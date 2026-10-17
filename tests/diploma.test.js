// El diploma tiene que depender de la dificultad (auditoría de octubre, D-01).
//
// Medido jugando 2.500 partidas completas con el motor real, el puntaje de los que
// ganan fue:
//
//                       mediana    p90
//   Fácil   al azar        73       84     ← clicar sin leer ya da oro (≥ 65)
//   Fácil   leyendo        86       91
//   Normal  al azar        55       73
//   Normal  leyendo        79       88
//   Difícil leyendo        64       74
//   Ultra   leyendo        51       55     ← con el mismo umbral, el oro no existía
//
// Con un solo juego de umbrales (65/45/25), el 72 % de los que clicaban al azar en
// Fácil se llevaba el diploma de oro, y en Ultra ni leyendo todo se llegaba. El
// diploma le dice al alumno cómo le fue; si lo dice igual para quien no leyó,
// enseña que leer no sirve.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { CONFIG } from '../js/config.js';
import * as scoring from '../js/engine/scoring.js';
import { newState, pickNextEvent } from '../js/engine/state.js';
import { applyInertia, applyActiveEffects, addActiveEffect } from '../js/engine/effects.js';
import { updateDangerTracking, checkAutoCrises } from '../js/features/crisis-auto.js';

const leer = (ruta) => readFileSync(fileURLToPath(new URL(`../${ruta}`, import.meta.url)), 'utf8');
const DIFICULTADES = ['easy', 'normal', 'hard', 'ultra'];

test('cada dificultad tiene sus tres umbrales, en orden', () => {
  for (const dif of DIFICULTADES) {
    const u = scoring.umbralesDeDiploma(dif);
    assert.ok(u.gold > u.silver && u.silver > u.bronze && u.bronze > 0, `${dif}: ${JSON.stringify(u)}`);
  }
});

test('el oro es más difícil cuanto más fácil es el juego', () => {
  const oro = DIFICULTADES.map((d) => scoring.umbralesDeDiploma(d).gold);
  for (let i = 1; i < oro.length; i++) {
    assert.ok(oro[i - 1] >= oro[i], `el oro de ${DIFICULTADES[i - 1]} (${oro[i - 1]}) no puede ser más fácil que el de ${DIFICULTADES[i]} (${oro[i]})`);
  }
  assert.ok(oro[0] > oro[1], 'Fácil tiene que exigir más puntos para el oro que Normal');
});

test('getDiploma corta exactamente en cada umbral', () => {
  for (const dif of DIFICULTADES) {
    const { gold, silver, bronze } = scoring.umbralesDeDiploma(dif);
    assert.equal(scoring.getDiploma(gold, dif), 'gold', `${dif} ${gold}`);
    assert.equal(scoring.getDiploma(gold - 1, dif), 'silver', `${dif} ${gold - 1}`);
    assert.equal(scoring.getDiploma(silver, dif), 'silver', `${dif} ${silver}`);
    assert.equal(scoring.getDiploma(silver - 1, dif), 'bronze', `${dif} ${silver - 1}`);
    assert.equal(scoring.getDiploma(bronze, dif), 'bronze', `${dif} ${bronze}`);
    assert.equal(scoring.getDiploma(bronze - 1, dif), null, `${dif} ${bronze - 1}`);
  }
});

test('sin dificultad, o con una que no existe, se usa la de Normal', () => {
  assert.deepEqual(scoring.umbralesDeDiploma(), scoring.umbralesDeDiploma('normal'));
  assert.deepEqual(scoring.umbralesDeDiploma('inventada'), scoring.umbralesDeDiploma('normal'));
  assert.equal(scoring.getDiploma(70), scoring.getDiploma(70, 'normal'));
});

// ── La medición ──────────────────────────────────────────────

/** Una partida completa al azar, con el motor real. Devuelve el puntaje si ganó. */
function partidaAlAzar(difficulty) {
  const g = newState({
    heritageId: ['populista', 'ortodoxo', 'crisis', 'estable'][Math.floor(Math.random() * 4)],
    mandateType: ['amplio', 'ajustado', 'coalicion'][Math.floor(Math.random() * 3)],
    difficulty,
  });
  for (; g.turn <= CONFIG.TOTAL_TURNS; g.turn++) {
    if (g.turn > 1) { applyInertia(g); applyActiveEffects(g); }
    updateDangerTracking(g);
    g.pendingCrises = [...g.pendingCrises, ...checkAutoCrises(g)];
    const ev = g.pendingCrises.length ? g.pendingCrises.shift() : pickNextEvent(g);
    if (ev.isSpecial) {
      g.lastSpecialEventTurn = g.turn;
      if (ev.isExtreme && ev.preEffects) g.indicadores = scoring.applyEffects(g.indicadores, ev.preEffects, {});
    }
    const op = ev.opciones[Math.floor(Math.random() * ev.opciones.length)];
    g.indicadores = scoring.applyEffects(g.indicadores, op.efectos || {}, g.effectMods);
    addActiveEffect(g, op, ev);
    g.usedEventIds.add(ev.id);
    if (scoring.checkDefeat(g.indicadores, difficulty)) return null;
  }
  return scoring.getScore(g.indicadores);
}

test('en Fácil, clicar al azar ya no regala el oro', () => {
  const N = 400;
  let oro = 0;
  for (let i = 0; i < N; i++) {
    const puntaje = partidaAlAzar('easy');
    if (puntaje !== null && scoring.getDiploma(puntaje, 'easy') === 'gold') oro++;
  }
  const pct = (100 * oro) / N;
  // Antes (umbral único de 65) era el 72 %.
  assert.ok(pct <= 20, `${pct.toFixed(1)} % de oro al azar en Fácil: sigue regalándolo`);
});

// ── Las copias del umbral ────────────────────────────────────

test('ninguna pantalla repite los umbrales de diploma a mano', () => {
  const fuentes = ['js/ui/endscreen.js', 'js/data/achievements.js', 'js/main.js'];
  const copias = [];
  for (const ruta of fuentes) {
    for (const m of leer(ruta).matchAll(/\b(?:score\d?|s[12]|sc)\s*>=\s*(65|45|25)\b/g)) copias.push(`${ruta}: ${m[0]}`);
  }
  assert.deepEqual(copias, [], 'esas pantallas tienen que preguntarle a getDiploma(puntaje, dificultad)');
});

test('el manual dice los umbrales de cada dificultad', () => {
  const seccion = leer('index.html').match(/Puntaje y Diplomas[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? '';
  assert.ok(seccion, 'el manual no tiene la sección «Puntaje y Diplomas»');
  const texto = seccion.replace(/<[^>]+>/g, ' ');
  for (const dif of DIFICULTADES) {
    const { gold, silver, bronze } = scoring.umbralesDeDiploma(dif);
    for (const n of [gold, silver, bronze]) {
      assert.ok(new RegExp(`\\b${n}\\b`).test(texto), `el manual no menciona ${n} (${dif})`);
    }
  }
});
