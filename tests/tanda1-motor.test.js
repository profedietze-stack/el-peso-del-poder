// Tanda 1 de la auditoría de octubre de 2026: cinco bugs del motor que ningún
// test veía porque ninguno pasaba por «barajar», «recargar» o «salir y volver».
//
//   A-01  una partida cargada pierde los multiplicadores de dificultad
//   A-02  el asesor resalta el botón equivocado desde que se barajan las opciones
//   A-03  salir y continuar vuelve a cobrar la inercia y los efectos del turno
//   A-07  las imágenes de crisis automáticas piden `undefined.jpg`
//   A-09  el nombre del VP en la alerta de crisis no coincide con los VP reales
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { CONFIG } from '../js/config.js';
import { newState, setG, registrarEventoEspecial } from '../js/engine/state.js';
import { aplicarInicioDeTurno } from '../js/engine/effects.js';
import { resaltarOpcionRecomendada } from '../js/features/advisors.js';
import { getEventImage } from '../js/data/event-images.js';
import { EVENTS } from '../js/data/events.js';
import { VICEPRESIDENTS, nombreCortoVP } from '../js/data/vicepresident.js';

const IDENTIDAD = { presidentName: 'Ana Pérez', partyName: 'Frente', vpId: 'vp-moreno' };
const nuevaPartida = (difficulty) =>
  newState({ heritageId: 'estable', mandateType: 'amplio', difficulty, identity: IDENTIDAD });

// ── A-01 ─────────────────────────────────────────────────────

test('A-01: una partida cargada recupera los multiplicadores de su dificultad', () => {
  const esperado = { easy: [0.7, 0.7], normal: [1, 1], hard: [1.2, 1.5], ultra: [1.5, 2.2] };
  for (const [dif, [bueno, malo]] of Object.entries(esperado)) {
    const guardada = JSON.parse(JSON.stringify({ ...nuevaPartida(dif), usedEventIds: [] }));
    // Lo que pasa al recargar la página: el módulo de config vuelve a sus valores de fábrica.
    CONFIG.EFFECT_MULTIPLIER = 1;
    CONFIG.EFFECT_MULTIPLIER_BAD = 1;
    guardada.usedEventIds = new Set();
    setG(guardada);
    assert.equal(CONFIG.EFFECT_MULTIPLIER, bueno, `${dif}: multiplicador de lo bueno`);
    assert.equal(CONFIG.EFFECT_MULTIPLIER_BAD, malo, `${dif}: multiplicador de lo malo`);
  }
  setG(null);
});

// ── A-02 ─────────────────────────────────────────────────────

function botonesBarajados(ordenOriginal) {
  return ordenOriginal.map((indice) => {
    const clases = new Set();
    return {
      dataset: { index: String(indice) },
      classList: { toggle: (c, on) => (on ? clases.add(c) : clases.delete(c)), has: (c) => clases.has(c) },
    };
  });
}

test('A-02: el resalte del asesor cae en la opción recomendada, esté donde esté', () => {
  const ordenes = [[0, 1, 2], [2, 0, 1], [1, 2, 0], [2, 1, 0], [0, 2, 1], [1, 0, 2]];
  for (const orden of ordenes) {
    for (const recomendada of [0, 1, 2]) {
      const botones = botonesBarajados(orden);
      resaltarOpcionRecomendada(botones, recomendada);
      const marcados = botones.filter((b) => b.classList.has('advisor-highlight'));
      assert.equal(marcados.length, 1, `orden ${orden}: un solo botón marcado`);
      assert.equal(Number(marcados[0].dataset.index), recomendada, `orden ${orden}, recomendada ${recomendada}`);
    }
  }
});

// ── A-03 ─────────────────────────────────────────────────────

test('A-03: empezar dos veces el mismo turno no cobra la inercia ni los efectos dos veces', () => {
  const g = nuevaPartida('hard');
  g.turn = 3;
  g.indicadores.ipc = 70;
  g.activeEffects = [
    { id: 'x', eventId: 1, sourceTitle: 't', sourceTurn: 2, turnsLeft: 3, totalDuration: 3, efectosPersistentes: { produccion: -2 } },
  ];
  const prod0 = g.indicadores.produccion;

  aplicarInicioDeTurno(g);
  const tras1 = { ipc: g.indicadores.ipc, prod: g.indicadores.produccion, left: g.activeEffects[0].turnsLeft };
  assert.ok(tras1.ipc > 70 && tras1.prod === prod0 - 2 && tras1.left === 2, 'la primera vez sí se cobra');

  // Salir y continuar: la partida guardada ya trae el turno empezado.
  const recargada = JSON.parse(JSON.stringify(g));
  const r = aplicarInicioDeTurno(recargada);
  assert.equal(r.yaIniciado, true);
  assert.equal(recargada.indicadores.ipc, tras1.ipc, 'ipc no se mueve de nuevo');
  assert.equal(recargada.indicadores.produccion, tras1.prod, 'producción no se mueve de nuevo');
  assert.equal(recargada.activeEffects[0].turnsLeft, tras1.left, 'el efecto no gasta otro turno');
});

test('A-03: al pasar al turno siguiente el inicio vuelve a cobrarse', () => {
  const g = nuevaPartida('hard');
  g.turn = 3;
  g.indicadores.ipc = 70;
  aplicarInicioDeTurno(g);
  const ipc3 = g.indicadores.ipc;
  g.turn = 4;
  const r = aplicarInicioDeTurno(g);
  assert.equal(r.yaIniciado, false);
  assert.ok(g.indicadores.ipc > ipc3);
});

// ── A-07 ─────────────────────────────────────────────────────

test('A-07: ningún evento pide una imagen `undefined`, tenga el id que tenga', () => {
  const tags = [...new Set(EVENTS.map((e) => e.tag))];
  const ids = ['crisis-auto-ipc-3', 'crisis-auto-pobreza-48', 'midterm-warning', 7, 8];
  const malas = [];
  for (const tag of tags) {
    for (const id of ids) {
      const ruta = getEventImage({ id, tag });
      if (/undefined|NaN/.test(ruta)) malas.push(`${id} / ${tag} → ${ruta}`);
    }
  }
  assert.deepEqual(malas, []);
});

test('A-07: un mismo id string siempre da la misma imagen', () => {
  const a = getEventImage({ id: 'crisis-auto-ipc-3', tag: '🚨 Crisis Financiera' });
  const b = getEventImage({ id: 'crisis-auto-ipc-3', tag: '🚨 Crisis Financiera' });
  assert.equal(a, b);
});

// ── A-09 ─────────────────────────────────────────────────────

test('A-09: la alerta de crisis nombra a los cuatro VP reales', () => {
  for (const vp of VICEPRESIDENTS) {
    const corto = nombreCortoVP(vp.id);
    assert.notEqual(corto, 'Vicepresidente/a', `${vp.id} cae al nombre genérico`);
    assert.ok(vp.name.endsWith(corto), `${corto} no es el apellido de ${vp.name}`);
  }
});

test('A-09: main.js no conserva una lista propia de ids de VP', () => {
  const main = readFileSync(fileURLToPath(new URL('../js/main.js', import.meta.url)), 'utf8');
  for (const viejo of ['vp-santos', 'vp-gutiérrez', 'vp-castro', 'vp-herrera']) {
    assert.ok(!main.includes(viejo), `main.js todavía nombra ${viejo}, que no existe`);
  }
});

// ── P-01 (tanda 2) ───────────────────────────────────────────

test('P-01: un evento extremo aplica su golpe inmediato y marca el turno, venga de donde venga', () => {
  const extremo = EVENTS.find((e) => e.isExtreme && e.preEffects);
  assert.ok(extremo, 'hay al menos un evento extremo en el banco');
  const g = nuevaPartida('normal');
  g.turn = 24;
  const antes = { ...g.indicadores };
  const prev = registrarEventoEspecial(g, extremo);
  assert.deepEqual(prev, antes, 'devuelve los indicadores de antes del golpe');
  assert.equal(g.lastSpecialEventTurn, 24);
  const cambio = Object.keys(extremo.preEffects).some((k) => g.indicadores[k] !== antes[k]);
  assert.ok(cambio, 'el golpe inmediato movió algún indicador');
});

test('P-01: un evento grave solo marca el turno, y uno común no hace nada', () => {
  const grave = EVENTS.find((e) => e.isSevere && !e.isExtreme);
  const comun = EVENTS.find((e) => !e.isSpecial);
  const g = nuevaPartida('normal');
  g.turn = 10;
  const antes = { ...g.indicadores };
  assert.equal(registrarEventoEspecial(g, grave), null);
  assert.equal(g.lastSpecialEventTurn, 10);
  assert.deepEqual(g.indicadores, antes);
  g.turn = 11;
  assert.equal(registrarEventoEspecial(g, comun), null);
  assert.equal(g.lastSpecialEventTurn, 10, 'un evento común no cuenta como especial');
});
