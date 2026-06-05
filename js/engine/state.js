"use strict";

import { CONFIG, IND_META, DIFFICULTY_START_BONUS } from '../config.js';
import { EVENTS }           from '../data/events.js';
import { HERITAGE_PROFILES, MANDATE_MODS } from '../data/heritage.js';
import { getZone }          from './scoring.js';
import {
  applyMinisterPassives,
  getCombinedEffectMods,
  getDefaultMinisterSelection,
} from '../data/ministers.js';
import { getVPById, getDefaultVP } from '../data/vicepresident.js';

// ============================================================
// ESTADO GLOBAL DEL JUEGO
// Se exporta como live binding (`let G`) para que todos los
// módulos que lo importen vean siempre el valor actualizado.
// Usar setG() para reemplazar el objeto completo.
// ============================================================

/** @type {object|null} Estado global activo del juego */
export let G = null;

/**
 * Reemplaza el estado global.
 * Todos los módulos que hicieron `import { G }` verán el nuevo valor
 * en el siguiente ciclo de acceso (live ES module binding).
 * @param {object|null} newState
 */
export function setG(newState) {
  G = newState;
}

// ── EVENTOS ANCLA ─────────────────────────────────────────────
// Se garantizan en rangos específicos del mandato (turnos 1-48).
// IDs tomados del original v11.
const ANCHOR_EVENTS = [
  { id: 28, minTurn: 10, maxTurn: 18 },  // Evento sindical / crisis laboral
  { id: 36, minTurn: 20, maxTurn: 30 },  // Evento de corrupción (ancla)
  { id: 40, minTurn: 35, maxTurn: 45 },  // Evento electoral / FMI final
];

// ── PROBABILIDAD DE EVENTOS ESPECIALES ───────────────────────
// Probabilidad por turno de que aparezca un evento isExtreme.
// Los isSevere (sin preEffects) tienen probabilidad separada.
const EXTREME_PROB = { easy: 0.0, normal: 0.05, hard: 0.10, ultra: 0.20 };
const SEVERE_PROB  = { easy: 0.04, normal: 0.08, hard: 0.14, ultra: 0.25 };
// Turnos mínimos entre eventos especiales (extreme o severe)
// Ultra: cooldown reducido para que los eventos graves se acumulen
const SPECIAL_COOLDOWN      = 6;
const SPECIAL_COOLDOWN_ULTRA = 3;

// ── PESOS DE SELECCIÓN ────────────────────────────────────────
// Aumentan la probabilidad de eventos cuyo tag corresponde a
// indicadores en zona de advertencia o peligro.
const TAG_INDICATOR_MAP = {
  '🚨 Crisis Financiera':      ['ipc','deuda','riesgo'],
  '✊ Conflicto Laboral':      ['desocupacion','confianza'],
  '✊ Conflicto Social':       ['pobreza','confianza'],
  '💱 Política Cambiaria':     ['ipc','reservas','riesgo'],
  '💱 Debate Monetario':       ['ipc','deuda'],
  '🏥 Salud Pública':          ['pobreza','confianza'],
  '🏦 FMI':                    ['deuda','reservas','riesgo'],
  '🏦 Tensión con FMI':        ['deuda','riesgo'],
  '💼 Empleo':                 ['desocupacion','produccion'],
  '📊 Política Fiscal':        ['deuda','ipc'],
  '💰 Presupuesto':            ['deuda','reservas'],
  '⚡ Energía':                ['produccion','ipc'],
  '⚡ Crisis de Gas':          ['ipc','produccion'],
  '🌊 Desastre Natural':       ['pobreza','produccion'],
  '🌾 Sector Agropecuario':    ['produccion','reservas'],
  '🌾 Agroexportaciones':      ['reservas','produccion'],
  '💧 Crisis Hídrica':         ['produccion','pobreza'],
};

/**
 * Calcula el peso de un evento según el estado actual de los indicadores.
 * Eventos cuyos tags corresponden a indicadores en zona crítica o de alerta
 * tienen mayor probabilidad de ser seleccionados.
 * @param {object} evento
 * @param {object} ind - indicadores actuales
 * @returns {number} peso (1-6)
 */
function getEventWeight(evento, ind) {
  const relatedKeys = TAG_INDICATOR_MAP[evento.tag] || [];
  let weight = 1;
  for (const key of relatedKeys) {
    const zone = getZone(key, ind[key]);
    if (zone === 'danger') weight += 3;
    else if (zone === 'warn') weight += 1;
  }
  return weight;
}

/**
 * Selecciona el próximo evento aplicando lógica de anclas, pesos y no-repetición.
 * @param {object} state - estado actual del juego
 * @returns {object} evento seleccionado
 */
export function pickNextEvent(state) {
  const { turn, indicadores, usedEventIds } = state;
  const diff          = state.difficulty || 'normal';
  const lastSpecial   = state.lastSpecialEventTurn || 0;
  const cooldown      = diff === 'ultra' ? SPECIAL_COOLDOWN_ULTRA : SPECIAL_COOLDOWN;
  const cooldownOk    = (turn - lastSpecial) >= cooldown;
  // No mostrar eventos especiales en los primeros 5 turnos
  const earlyGame     = turn < 5;

  // 0. ── Eventos encadenados — consecuencias diferidas ────────────
  // Tienen prioridad sobre la lógica normal.
  // Bypasean usedEventIds: son una consecuencia, no una repetición casual.
  if (state.pendingChainEvents?.length > 0) {
    const dueChain = state.pendingChainEvents.find(c => c.triggerAtTurn <= turn);
    if (dueChain) {
      state.pendingChainEvents = state.pendingChainEvents.filter(c => c !== dueChain);
      const chainEv = EVENTS.find(e => e.id === dueChain.eventId);
      if (chainEv) {
        // Devolver copia enriquecida con metadatos de cadena
        return { ...chainEv, isChained: true, chainSource: dueChain.sourceTitle };
      }
    }
  }

  // 1. Verificar si hay un evento ancla para este turno
  for (const anchor of ANCHOR_EVENTS) {
    if (
      turn >= anchor.minTurn &&
      turn <= anchor.maxTurn &&
      !usedEventIds.has(anchor.id)
    ) {
      const anchorEvent = EVENTS.find(e => e.id === anchor.id);
      if (anchorEvent) return anchorEvent;
    }
  }

  // 2. ── Ruleta de eventos EXTREMOS (preEffects) ────────────────
  // Ultra: eventos extremos también en los primeros turnos (earlyGame ignorado)
  if ((!earlyGame || diff === 'ultra') && cooldownOk && diff !== 'easy') {
    const extremeProb = EXTREME_PROB[diff] || 0.05;
    if (Math.random() < extremeProb) {
      const extremePool = EVENTS.filter(e =>
        e.isExtreme && !usedEventIds.has(e.id)
      );
      if (extremePool.length > 0) {
        return extremePool[Math.floor(Math.random() * extremePool.length)];
      }
    }
  }

  // 3. ── Ruleta de eventos GRAVES (isSevere, sin preEffects) ────
  if (!earlyGame && cooldownOk) {
    const severeProb = SEVERE_PROB[diff] || 0.08;
    if (Math.random() < severeProb) {
      const severePool = EVENTS.filter(e =>
        e.isSevere && !e.isExtreme && !usedEventIds.has(e.id)
      );
      if (severePool.length > 0) {
        return severePool[Math.floor(Math.random() * severePool.length)];
      }
    }
  }

  // 4. Construir pool de candidatos normales (no especiales, no crisis-auto)
  const pool = EVENTS.filter(e =>
    !usedEventIds.has(e.id) &&
    !e.isCrisisAuto &&
    !e.isSpecial &&                               // ← excluir los 30 especiales del pool normal
    !ANCHOR_EVENTS.some(a => a.id === e.id)
  );

  if (pool.length === 0) {
    // Fallback: reusar eventos ya vistos normales
    const fallback = EVENTS.filter(e =>
      !e.isCrisisAuto && !e.isSpecial &&
      !ANCHOR_EVENTS.some(a => a.id === e.id)
    );
    if (fallback.length > 0) {
      return fallback[Math.floor(Math.random() * fallback.length)];
    }
    // Último fallback: cualquier evento no crisis-auto
    const last = EVENTS.filter(e => !e.isCrisisAuto);
    return last[Math.floor(Math.random() * last.length)];
  }

  // 5. Selección ponderada por estado de indicadores
  const weights = pool.map(e => getEventWeight(e, indicadores));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < pool.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/**
 * Crea un estado inicial nuevo a partir de las selecciones del jugador.
 * @param {object} opts
 * @param {string} opts.heritageId   - ID del perfil de herencia elegido
 * @param {string} opts.mandateType  - 'amplio' | 'ajustado' | 'coalicion'
 * @param {string} opts.difficulty   - 'easy' | 'normal' | 'hard' | 'ultra'
 * @param {object} [opts.ministers]  - { economia, social, gabinete, produccion } → IDs de ministros
 *                                     Si no se pasa, usa los valores por defecto.
 * @returns {object} estado inicial completo
 */
export function newState({ heritageId, mandateType, difficulty, ministers, identity,
                           isSecondTerm = false, firstTermData = null, prevIndicadores = null }) {
  // ── 1. Dificultad ─────────────────────────────────────────────
  const diffMap = { easy: 0.7, normal: 1.0, hard: 1.3, ultra: 1.8 };
  CONFIG.EFFECT_MULTIPLIER = diffMap[difficulty] ?? 1.0;
  CONFIG.DOCENTE_MODE       = false; // modo docente eliminado

  // ── 2. Indicadores base ───────────────────────────────────────
  let ind;

  if (isSecondTerm && prevIndicadores) {
    // Segundo mandato: parte del estado final del primero
    // con un pequeño "efecto luna de miel" (renovación del mandato)
    ind = { ...prevIndicadores };
    ind.confianza = Math.min(100, Math.round(ind.confianza + 5));  // luna de miel
  } else {
    // Primer mandato: lógica normal de herencia + mandato
    ind = { ...CONFIG.INITIAL };

    // ── 3. Herencia ─────────────────────────────────────────────
    const heritage = HERITAGE_PROFILES.find(h => h.id === heritageId);
    if (heritage) {
      for (const [k, v] of Object.entries(heritage.delta)) {
        ind[k] = Math.round(Math.max(0, Math.min(100, ind[k] + v)));
      }
    }

    // ── 4. Mandato ───────────────────────────────────────────────
    const mods = MANDATE_MODS[mandateType] || {};
    for (const [k, v] of Object.entries(mods)) {
      ind[k] = Math.round(Math.max(0, Math.min(100, ind[k] + v)));
    }
  }

  // ── 4b. Bono de dificultad ────────────────────────────────────
  // Da margen extra en Easy, penaliza en Hard/Ultra.
  // Solo aplica al primer mandato (segundo hereda indicadores reales).
  if (!isSecondTerm) {
    const startBonus = DIFFICULTY_START_BONUS[difficulty] || {};
    for (const [k, v] of Object.entries(startBonus)) {
      ind[k] = Math.round(Math.max(0, Math.min(100, ind[k] + v)));
    }
  }

  // ── 5. Ministros: pasivos de inicio ───────────────────────────
  // Se aplican DESPUÉS de herencia y mandato, como capa final de
  // configuración inicial. El jugador elige el gabinete sabiendo
  // de qué situación parte, así que los pasivos ajustan sobre eso.
  const selectedMinisters = ministers || getDefaultMinisterSelection();
  applyMinisterPassives(ind, selectedMinisters);

  // ── 6. Modificadores de efectos combinados ────────────────────
  // Un mapa { ipc: 0.78, produccion: 1.22, ... } que applyEffects()
  // usará en cada turno para modular los efectos de las decisiones.
  const effectMods = getCombinedEffectMods(selectedMinisters);

  // ── 7. Vicepresidente: pasivos y mods ────────────────────────
  // El VP se selecciona en la pantalla de identidad. Sus pasivos
  // se aplican como capa final (después de herencia + ministros).
  const resolvedIdentity = identity || { presidentName: 'Presidente/a', partyName: 'Partido Nacional', vpId: getDefaultVP() };
  const vp = getVPById(resolvedIdentity.vpId);
  if (vp) {
    // Aplicar pasivos del VP
    for (const [k, v] of Object.entries(vp.passive || {})) {
      ind[k] = Math.round(Math.max(0, Math.min(100, ind[k] + v)));
    }
    // Combinar effectMods del VP con los de los ministros
    for (const [k, v] of Object.entries(vp.effectMods || {})) {
      effectMods[k] = (effectMods[k] ?? 1) * v;
    }
  }

  // ── 8. Credibilidad inicial de asesores ───────────────────────
  // Ahora hay 4 slots (coinciden con las 4 carteras de ministros).
  // La credibilidad inicial depende de qué tan "especializado" es
  // el ministro: los tecnocrátios empiezan con más credibilidad técnica,
  // los políticos con más carisma (confianza).
  const _initCred = (slot) => {
    const id = selectedMinisters[slot];
    if (!id) return 3;
    if (id.startsWith('tecnocrata')) return 4;   // tecnocrático → más creíble técnicamente
    if (id === 'confrontacional')   return 2;    // confrontacional → impredecible, menos fiable
    if (id === 'dialoguista')       return 4;    // dialoguista → alta credibilidad política
    return 3;                                     // resto: credibilidad media
  };

  return {
    // ── Meta ─────────────────────────────────────────────────────
    turn:         1,
    won:          false,
    lost:         false,
    lostReason:   null,
    reelection:   null,  // Se llena con computeReelection() al terminar el mandato

    // ── Segundo mandato ───────────────────────────────────────────
    isSecondTerm,
    firstTermData,       // { score, diploma, reelection } del mandato anterior

    // ── Configuración de partida ──────────────────────────────────
    difficulty,
    heritageId,
    mandateType,

    // ── Identidad del jugador ─────────────────────────────────────
    // Nombre del presidente, partido y vicepresidente elegido.
    identity:   resolvedIdentity,

    // ── Gabinete de ministros ─────────────────────────────────────
    // `ministers` guarda las IDs de los elegidos por cartera.
    // `effectMods` se precalcula aquí y se usa en applyEffects().
    ministers:  selectedMinisters,
    effectMods: effectMods,

    // ── Indicadores ───────────────────────────────────────────────
    indicadores: ind,

    // ── Evento actual ─────────────────────────────────────────────
    currentEvent: null,

    // ── Historial ────────────────────────────────────────────────
    history:      [],
    usedEventIds: new Set(),

    // ── Logros desbloqueados ──────────────────────────────────────
    unlockedAchievements: [],

    // ── Asesores (= ministros durante la partida) ─────────────────
    // Las claves coinciden con los slots de MINISTER_SLOTS.
    // `usedThisTurn` se resetea en resetAdvisorsForTurn() cada turno.
    advisors: {
      // VP: asesor principal, puede consultarse 2 veces por turno
      vp:         { credibility: 4, usedCount: 0 },
      economia:   { credibility: _initCred('economia'),   usedThisTurn: false },
      social:     { credibility: _initCred('social'),     usedThisTurn: false },
      gabinete:   { credibility: _initCred('gabinete'),   usedThisTurn: false },
      produccion: { credibility: _initCred('produccion'), usedThisTurn: false },
    },

    // ── Snapshot inicial para análisis final ──────────────────────
    // Captura DESPUÉS de aplicar herencia + mandato + pasivos de ministros.
    // Así el análisis docente compara el punto real de partida vs el final.
    startingIndicadores: { ...ind },

    // ── Datos acumulados para logros ──────────────────────────────
    adata: {
      ipcNeverHigh:       ind.ipc <= 55,   // post-herencia + post-ministros
      confianzaMax:       ind.confianza,
      confianzaMin:       ind.confianza,
      neverCorrupt:       true,
      crisisCount:        0,
      advisorUsed:        0,
      autoCrisisHandled:  0,
      dangerHistory:      {},
    },

    // ── Crisis automáticas pendientes ─────────────────────────────
    pendingCrises: [],

    // ── Eventos encadenados pendientes ────────────────────────────
    // Consecuencias diferidas de decisiones previas.
    // Cada entrada: { eventId, triggerAtTurn, sourceTitle }
    // Se consumen en pickNextEvent() cuando triggerAtTurn <= turn.
    pendingChainEvents: [],

    // ── Bitácora de decisiones (para legado de decisiones) ────────
    // Cada entrada: { turn, eventId, eventTitle, tag, opcionIndex,
    //                 opcionText, indBefore, indAfter }
    // Se llena en main.js _applyDecision; se usa en endscreen.js.
    decisionLog: [],

    // ── Efectos persistentes activos (Opción A) ───────────────────
    // Array de { id, eventId, sourceTitle, sourceTurn, turnsLeft, totalDuration, efectosPersistentes }
    // Se aplican al inicio de cada turno; se eliminan cuando turnsLeft llega a 0.
    activeEffects: [],

    // ── Control de eventos especiales ─────────────────────────────
    lastSpecialEventTurn: 0,

    // ── Elecciones de medio término ────────────────────────────────
    // midtermBonus:  bonus/malus de campaña elegido en turno 22 (-10 a +10)
    // midtermDone:   true una vez resuelta la elección (turno 24)
    midtermBonus: 0,
    midtermDone:  false,

    // ── Historial de gabinete (renuncias/reemplazos) ───────────────
    // Cada clave contiene el array de IDs usados en ese slot (en orden).
    // El miembro actual siempre es el ÚLTIMO del array.
    // Límite: máx 3 entradas por slot (original + 2 reemplazos).
    // Si se intenta pedir la renuncia del 3er miembro → derrota.
    cabinetHistory: {
      vp:         [resolvedIdentity.vpId],
      economia:   [selectedMinisters.economia],
      social:     [selectedMinisters.social],
      gabinete:   [selectedMinisters.gabinete],
      produccion: [selectedMinisters.produccion],
    },
  };
}

/**
 * Actualiza los campos de `adata` después de aplicar efectos.
 * Debe llamarse DESPUÉS de actualizar `state.indicadores`.
 * @param {object} state     - estado del juego (mutable)
 * @param {boolean} wasCorrupt - si la opción elegida era corrupta
 */
export function updateAdata(state, wasCorrupt) {
  const ind = state.indicadores;
  const ad  = state.adata;

  // Tracking de IPC
  if (ind.ipc > 55) ad.ipcNeverHigh = false;

  // Tracking de confianza
  if (ind.confianza > ad.confianzaMax) ad.confianzaMax = ind.confianza;
  if (ind.confianza < ad.confianzaMin) ad.confianzaMin = ind.confianza;

  // Tracking de corrupción
  if (wasCorrupt) ad.neverCorrupt = false;

  // Tracking de zonas peligrosas
  const dangerNow = IND_META.some(m => getZone(m.key, ind[m.key]) === 'danger');
  if (dangerNow) ad.crisisCount++;
}

/**
 * Registra una entrada en el historial del juego.
 * @param {object} state
 * @param {number} eventId
 * @param {number} opcionIndex
 * @param {boolean} isCrisis
 */
export function pushHistory(state, eventId, opcionIndex, isCrisis = false) {
  state.history.push({
    turn:        state.turn,
    eventId,
    opcionIndex,
    snap:        { ...state.indicadores },
    isCrisis,
  });
  state.usedEventIds.add(eventId);
}

/**
 * Obtiene el evento del historial de un turno específico.
 * @param {object} state
 * @param {number} turn
 * @returns {object|undefined}
 */
export function getHistoryEntry(state, turn) {
  return state.history.find(h => h.turn === turn);
}
