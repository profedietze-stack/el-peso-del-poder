"use strict";

// ============================================================
// VALIDACIÓN DEL GUARDADO
//
// Lo que sale de `localStorage` es texto que pudo escribir cualquier versión del
// juego, o el alumno desde las DevTools, o nadie: un JSON cortado a la mitad. Esta
// capa decide qué se hace con eso, y lo decide por campo:
//
//   · Si falta lo imprescindible (los ocho indicadores, el turno), el guardado se
//     declara DAÑADO: no hay forma honesta de inventarlo.
//   · Todo lo demás se arma sobre una partida nueva (`newState`), que ya trae cada
//     campo con su tipo correcto, y solo se le pasa por encima lo que se pudo
//     validar. Un campo con el tipo cambiado cae a su valor por defecto en vez de
//     dejar la pantalla en negro.
//   · Nada de lo que viene de afuera se usa tal cual: el evento del turno se vuelve
//     a tomar del banco de eventos, los modificadores se recalculan desde los
//     ministros, los nombres se limpian.
//
// Es una función pura (sin DOM ni almacenamiento) para poder probarla con miles de
// guardados rotos.
// ============================================================

import { construirPedido } from '../features/coalicion.js';
import { IND_META } from '../config.js';
import { EVENTS } from '../data/events.js';
import { HERITAGE_PROFILES, MANDATE_MODS } from '../data/heritage.js';
import { MINISTER_SLOTS, getMinisterById, getMinistersBySlot } from '../data/ministers.js';
import { getVPById, getDefaultVP } from '../data/vicepresident.js';
import { newState } from './state.js';
import { limpiarNombre } from './texto.js';
import { totalTurnos } from './mandato.js';

/** Versión del esquema del guardado. Se sube cuando cambia la forma de algún campo. */
export const SAVE_VERSION = 1;

const CLAVES_IND = IND_META.map((m) => m.key);
const DIFICULTADES = ['easy', 'normal', 'hard', 'ultra'];
const SLOTS_ASESOR = ['vp', 'economia', 'social', 'gabinete', 'produccion'];

// ── Helpers de tipo ───────────────────────────────────────────

const esObjeto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const esNumero = (v) => typeof v === 'number' && Number.isFinite(v);
const esEntero = (v) => Number.isInteger(v);
const esTexto = (v) => typeof v === 'string';
const esId = (v) => esTexto(v) || esEntero(v);
const acotar = (v, min, max) => Math.min(max, Math.max(min, v));
const lista = (v) => (Array.isArray(v) ? v : []);
const textoSeguro = (t, max) => (esTexto(t) && !/[<>]/.test(t) ? t.slice(0, max) : '');

/** Algún texto del valor trae una etiqueta HTML (a cualquier profundidad). */
function traeHtml(v, prof = 0) {
  if (prof > 6) return true;
  if (esTexto(v)) return /[<>]/.test(v);
  if (Array.isArray(v)) return v.some((x) => traeHtml(x, prof + 1));
  if (esObjeto(v)) return Object.values(v).some((x) => traeHtml(x, prof + 1));
  return false;
}

/** Objeto { clave: número } → copia con solo las claves permitidas que son números. */
function numerosDe(v, permitidas) {
  const out = {};
  if (!esObjeto(v)) return out;
  for (const k of permitidas ?? Object.keys(v)) {
    if (esNumero(v[k])) out[k] = v[k];
  }
  return out;
}

// ── Piezas ────────────────────────────────────────────────────

function validarIndicadores(v) {
  if (!esObjeto(v)) return null;
  const out = {};
  for (const k of CLAVES_IND) {
    if (!esNumero(v[k])) return null;
    out[k] = acotar(v[k], 0, 100);
  }
  return out;
}

function validarMinistros(v) {
  const out = {};
  for (const slot of MINISTER_SLOTS) {
    const candidato = esObjeto(v) ? v[slot.id] : null;
    const min = esTexto(candidato) ? getMinisterById(candidato) : null;
    const delSlot = min && getMinistersBySlot(slot.id).some((m) => m.id === min.id);
    out[slot.id] = delSlot ? min.id : getMinistersBySlot(slot.id)[0].id;
  }
  return out;
}

/** Un evento del banco, con las marcas de cadena del guardado si venían bien. */
function validarEvento(v) {
  if (!esObjeto(v)) return null;
  // Los eventos normales se vuelven a tomar del banco: el guardado solo aporta el id.
  if (esEntero(v.id)) {
    const base = EVENTS.find((e) => e.id === v.id);
    if (!base) return null;
    const out = { ...base };
    if (v.isChained === true && esTexto(v.chainSource) && !/[<>]/.test(v.chainSource)) {
      out.isChained = true;
      out.chainSource = v.chainSource.slice(0, 60);
    }
    return out;
  }
  // El pedido del socio de Coalición también nace de una plantilla: se reconstruye por turno.
  if (esTexto(v.id)) {
    const m = /^coalicion-socio-(\d+)$/.exec(v.id);
    if (m) return construirPedido(Number(m[1]));
  }
  // Las crisis automáticas nacen de plantillas y no están en el banco: se aceptan
  // solo si tienen la forma completa y ningún texto con HTML.
  if (esTexto(v.id) && /^crisis-auto-[a-z]+-\d+$/.test(v.id) && v.isCrisisAuto === true) {
    const opciones = lista(v.opciones);
    const bien =
      esTexto(v.tag) && esTexto(v.titulo) && esTexto(v.descripcion) && esTexto(v._crisisKey) &&
      opciones.length >= 2 && opciones.length <= 6 &&
      opciones.every((o) => esObjeto(o) && esTexto(o.texto) && esObjeto(o.efectos) &&
        Object.values(o.efectos).every(esNumero));
    if (bien && !traeHtml(v)) return v;
  }
  return null;
}

function validarEfectosActivos(v) {
  return lista(v).flatMap((ae) => {
    if (!esObjeto(ae) || !esId(ae.eventId) || !esNumero(ae.turnsLeft) || ae.turnsLeft <= 0) return [];
    const persist = numerosDe(ae.efectosPersistentes, CLAVES_IND);
    if (Object.keys(persist).length === 0) return [];
    const turnos = Math.min(ae.turnsLeft, 12);
    return [{
      id: esTexto(ae.id) ? ae.id.slice(0, 40) : `ae-${ae.eventId}`,
      eventId: ae.eventId,
      sourceTitle: textoSeguro(ae.sourceTitle, 60),
      sourceTurn: esNumero(ae.sourceTurn) ? ae.sourceTurn : 0,
      turnsLeft: turnos,
      totalDuration: esNumero(ae.totalDuration) ? Math.min(ae.totalDuration, 12) : turnos,
      efectosPersistentes: persist,
    }];
  });
}

function validarCadenas(v) {
  return lista(v).flatMap((c) => {
    if (!esObjeto(c) || !EVENTS.some((e) => e.id === c.eventId) || !esNumero(c.triggerAtTurn)) return [];
    return [{ eventId: c.eventId, triggerAtTurn: c.triggerAtTurn, sourceTitle: textoSeguro(c.sourceTitle, 60) }];
  });
}

function validarHistorial(v) {
  return lista(v).flatMap((h) => {
    if (!esObjeto(h) || !esEntero(h.turn) || !esId(h.eventId) || !esEntero(h.opcionIndex) || h.opcionIndex < 0) return [];
    const snap = validarIndicadores(h.snap);
    if (!snap) return [];
    return [{ turn: h.turn, eventId: h.eventId, opcionIndex: h.opcionIndex, snap, isCrisis: h.isCrisis === true }];
  });
}

function validarBitacora(v) {
  return lista(v).flatMap((d) => {
    if (!esObjeto(d) || !esEntero(d.turn) || !esId(d.eventId) || !esEntero(d.opcionIndex) || d.opcionIndex < 0) return [];
    const antes = validarIndicadores(d.indBefore);
    const despues = validarIndicadores(d.indAfter);
    if (!antes || !despues) return [];
    return [{
      turn: d.turn, eventId: d.eventId, eventTitle: textoSeguro(d.eventTitle, 120), tag: textoSeguro(d.tag, 60),
      opcionIndex: d.opcionIndex, opcionText: textoSeguro(d.opcionText, 120), indBefore: antes, indAfter: despues,
    }];
  });
}

function validarAdata(v, base) {
  const out = { ...base };
  if (!esObjeto(v)) return out;
  for (const k of ['ipcNeverHigh', 'neverCorrupt']) if (typeof v[k] === 'boolean') out[k] = v[k];
  for (const k of ['confianzaMax', 'confianzaMin', 'crisisCount', 'advisorUsed', 'autoCrisisHandled']) {
    if (esNumero(v[k])) out[k] = v[k];
  }
  if (esObjeto(v.dangerHistory)) {
    out.dangerHistory = Object.fromEntries(
      Object.entries(v.dangerHistory).filter(([k, n]) => CLAVES_IND.includes(k) && esNumero(n) && n >= 0),
    );
  }
  return out;
}

function validarAsesores(v, base) {
  const out = {};
  for (const slot of SLOTS_ASESOR) {
    const guardado = esObjeto(v) && esObjeto(v[slot]) ? v[slot] : {};
    const copia = { ...base[slot] };
    if (esNumero(guardado.credibility)) copia.credibility = acotar(Math.round(guardado.credibility), 1, 5);
    if (typeof guardado.usedThisTurn === 'boolean' && 'usedThisTurn' in copia) copia.usedThisTurn = guardado.usedThisTurn;
    if (esNumero(guardado.usedCount) && 'usedCount' in copia) copia.usedCount = acotar(guardado.usedCount, 0, 9);
    out[slot] = copia;
  }
  return out;
}

function validarGabinete(v, base) {
  const out = {};
  for (const slot of SLOTS_ASESOR) {
    const ids = esObjeto(v) ? lista(v[slot]).filter(esTexto).slice(0, 3) : [];
    out[slot] = ids.length > 0 ? ids : base[slot];
  }
  return out;
}

function validarNoticias(v) {
  const hist = lista(v).flatMap((n) => {
    if (!esObjeto(n) || !esEntero(n.turn)) return [];
    const items = lista(n.items);
    const bien = items.length > 0 && items.every((it) =>
      esObjeto(it) && esTexto(it.headline) && (it.body === undefined || esTexto(it.body)));
    return bien && !traeHtml(items) ? [{ turn: n.turn, items }] : [];
  });
  return hist.slice(0, 5);
}

// ── API ───────────────────────────────────────────────────────

/**
 * Valida y normaliza una partida cargada desde el almacenamiento.
 * @param {unknown} raw lo que devolvió `JSON.parse`
 * @returns {{estado:'ok', state:object} | {estado:'danado', motivo:string}}
 */
export function validarGuardado(raw) {
  try {
    return _validar(raw);
  } catch (e) {
    return { estado: 'danado', motivo: `error al validar: ${e.message}` };
  }
}

function _validar(raw) {
  if (!esObjeto(raw)) return { estado: 'danado', motivo: 'no es una partida' };
  if (esNumero(raw.saveVersion) && raw.saveVersion > SAVE_VERSION) {
    return { estado: 'danado', motivo: 'es de una versión más nueva del juego' };
  }
  if (raw.won === true || raw.lost === true) return { estado: 'danado', motivo: 'la partida ya había terminado' };

  const indicadores = validarIndicadores(raw.indicadores);
  if (!indicadores) return { estado: 'danado', motivo: 'faltan indicadores o no son números' };
  if (!esEntero(raw.turn) || raw.turn < 1 || raw.turn > totalTurnos()) {
    return { estado: 'danado', motivo: `el turno no es un entero entre 1 y ${totalTurnos()}` };
  }

  const difficulty = DIFICULTADES.includes(raw.difficulty) ? raw.difficulty : 'normal';
  const heritageId = HERITAGE_PROFILES.some((h) => h.id === raw.heritageId) ? raw.heritageId : 'estable';
  const mandateType = esTexto(raw.mandateType) && raw.mandateType in MANDATE_MODS ? raw.mandateType : 'ajustado';

  const idRaw = esObjeto(raw.identity) ? raw.identity : {};
  const identity = {
    presidentName: limpiarNombre(idRaw.presidentName) || 'Presidente/a',
    partyName: limpiarNombre(idRaw.partyName) || 'Frente Cívico',
    vpId: esTexto(idRaw.vpId) && getVPById(idRaw.vpId) ? idRaw.vpId : getDefaultVP(),
  };
  const ministers = validarMinistros(raw.ministers);

  // Una partida nueva con esa configuración: trae cada campo con su tipo correcto
  // y los modificadores de efectos recalculados desde los ministros y el VP, que es
  // de donde salen siempre (también tras una renuncia).
  const base = newState({
    heritageId, mandateType, difficulty, ministers, identity, isSecondTerm: raw.isSecondTerm === true,
  });

  const evento = validarEvento(raw.currentEvent);
  const iniciado = esEntero(raw.startedTurn) && raw.startedTurn === raw.turn;

  const state = {
    ...base,
    saveVersion: SAVE_VERSION,
    turn: raw.turn,
    indicadores,
    startingIndicadores: validarIndicadores(raw.startingIndicadores) ?? { ...indicadores },
    usedEventIds: new Set(lista(raw.usedEventIds).filter(esId)),
    history: validarHistorial(raw.history),
    decisionLog: validarBitacora(raw.decisionLog),
    activeEffects: validarEfectosActivos(raw.activeEffects),
    pendingChainEvents: validarCadenas(raw.pendingChainEvents),
    pendingCrises: lista(raw.pendingCrises).map(validarEvento).filter(Boolean),
    unlockedAchievements: lista(raw.unlockedAchievements).filter(esTexto).slice(0, 200),
    adata: validarAdata(raw.adata, base.adata),
    advisors: validarAsesores(raw.advisors, base.advisors),
    cabinetHistory: validarGabinete(raw.cabinetHistory, base.cabinetHistory),
    // Una partida guardada antes del capital político arranca con el de su mandato.
    capital: esNumero(raw.capital) ? acotar(Math.round(raw.capital), 0, 100) : base.capital,
    capitalGastado: esNumero(raw.capitalGastado) && raw.capitalGastado >= 0 ? Math.min(raw.capitalGastado, 9999) : 0,
    alianzaRota: raw.alianzaRota === true,
    midtermBonus: esNumero(raw.midtermBonus) ? acotar(raw.midtermBonus, -30, 30) : 0,
    midtermDone: raw.midtermDone === true,
    lastSpecialEventTurn: esEntero(raw.lastSpecialEventTurn) ? acotar(raw.lastSpecialEventTurn, 0, totalTurnos()) : 0,
    startedTurn: iniciado ? raw.startedTurn : undefined,
    currentEvent: iniciado ? evento : null,
    currentEventTurn: iniciado && evento && raw.currentEventTurn === raw.turn ? raw.turn : undefined,
    newsHistory: validarNoticias(raw.newsHistory),
    recentForecasts: numerosDe(raw.recentForecasts),
  };
  state.currentNews = state.newsHistory[0]?.items ?? null;

  if (esObjeto(raw.firstTermData) && esNumero(raw.firstTermData.score)) {
    state.firstTermData = {
      score: raw.firstTermData.score,
      diploma: ['gold', 'silver', 'bronze'].includes(raw.firstTermData.diploma) ? raw.firstTermData.diploma : null,
      reelection: esObjeto(raw.firstTermData.reelection) ? raw.firstTermData.reelection : null,
      turn: esNumero(raw.firstTermData.turn) ? raw.firstTermData.turn : totalTurnos(),
    };
  }

  return { estado: 'ok', state };
}
