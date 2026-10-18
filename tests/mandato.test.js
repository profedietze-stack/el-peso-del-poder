// Duración del mandato y reglas por país: única fuente para todo lo que antes decía «48».
import test from 'node:test';
import assert from 'node:assert/strict';

import { aplicarReglas, escalarTurno, totalTurnos, permiteSegundoMandato, turnoMedioTermino } from '../js/engine/mandato.js';
import { PAISES } from '../js/data/pais.js';

test.afterEach(() => aplicarReglas('ar'));

test('México: 72 turnos, medio término en el 36, sin segundo mandato', () => {
  aplicarReglas('mx');
  assert.equal(totalTurnos(), 72);
  assert.equal(turnoMedioTermino(), 36);
  assert.equal(permiteSegundoMandato(), false);
});

test('Colombia y Chile: 48 turnos, medio término en el 24, sin segundo mandato', () => {
  for (const id of ['co', 'cl']) {
    aplicarReglas(id);
    assert.equal(totalTurnos(), 48, id);
    assert.equal(turnoMedioTermino(), 24, id);
    assert.equal(permiteSegundoMandato(), false, id);
  }
});

test('Argentina y Latinoamérica no cambian: 48, 24 y segundo mandato permitido', () => {
  for (const id of ['ar', 'latam']) {
    aplicarReglas(id);
    assert.equal(totalTurnos(), 48, id);
    assert.equal(turnoMedioTermino(), 24, id);
    assert.equal(permiteSegundoMandato(), true, id);
  }
});

test('un país desconocido cae en Argentina', () => {
  aplicarReglas('mx');
  aplicarReglas('xx');
  assert.equal(totalTurnos(), 48);
  assert.equal(permiteSegundoMandato(), true);
});

test('escalarTurno reparte por proporción y nunca baja de 1', () => {
  assert.equal(escalarTurno(10, 72), 15);
  assert.equal(escalarTurno(40, 72), 60);
  assert.equal(escalarTurno(10, 48), 10);
  assert.equal(escalarTurno(0, 72), 1);
});

test('los cinco países existen con nombre, bandera y reglas completas', () => {
  assert.deepEqual(Object.keys(PAISES).sort(), ['ar', 'cl', 'co', 'latam', 'mx']);
  for (const p of Object.values(PAISES)) {
    assert.ok(p.nombre && p.bandera, p.id);
    assert.ok(Number.isInteger(p.reglas.turnos) && p.reglas.turnos % 12 === 0, p.id);
    assert.ok(p.reglas.medioTermino > 1 && p.reglas.medioTermino < p.reglas.turnos, p.id);
    assert.equal(typeof p.reglas.segundoMandato, 'boolean', p.id);
  }
  assert.equal(PAISES.ar.base, null);
  for (const id of ['latam', 'mx', 'co', 'cl']) assert.equal(PAISES[id].base, 'latam', id);
});

// ── Todo lo que antes decía «48» ─────────────────────────────

import { readFileSync } from 'node:fs';
import { anclasDelMandato } from '../js/engine/state.js';
import { turnosDePedido, construirPedido } from '../js/features/coalicion.js';
import { validarGuardado } from '../js/engine/save-validation.js';
import { newState } from '../js/engine/state.js';

test('con Argentina las anclas y los pedidos de coalición son los de siempre', () => {
  aplicarReglas('ar');
  assert.deepEqual(anclasDelMandato(), [
    { id: 28, minTurn: 10, maxTurn: 18 }, { id: 36, minTurn: 20, maxTurn: 30 }, { id: 40, minTurn: 35, maxTurn: 45 },
  ]);
  assert.deepEqual(turnosDePedido(), [10, 20, 30, 40]);
  assert.equal(construirPedido(10).id, 'coalicion-socio-10');
});

test('México: anclas y pedidos escalados caen dentro de los 72 turnos y en orden', () => {
  aplicarReglas('mx');
  const anclas = anclasDelMandato();
  for (const a of anclas) assert.ok(a.minTurn >= 1 && a.minTurn < a.maxTurn && a.maxTurn <= 72, JSON.stringify(a));
  assert.deepEqual(turnosDePedido(), [15, 30, 45, 60]);
  assert.equal(construirPedido(15).id, 'coalicion-socio-15');
  assert.equal(construirPedido(10), null, 'el turno 10 ya no es de pedido en México');
});

function partidaEnTurno(turn) {
  const s = newState({ heritageId: 'estable', mandateType: 'amplio', difficulty: 'normal' });
  s.turn = turn;
  return JSON.parse(JSON.stringify({ ...s, usedEventIds: [...s.usedEventIds] }));
}

test('un guardado del turno 60 vale con México y está dañado con Argentina, con el motivo correcto', () => {
  const crudo = partidaEnTurno(60);
  aplicarReglas('mx');
  assert.notEqual(validarGuardado(crudo).estado, 'danado');
  aplicarReglas('ar');
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'danado');
  assert.match(r.motivo, /entre 1 y 48/);
});

test('ningún módulo de juego deja un 48 suelto: la duración sale de mandato.js', () => {
  const archivos = [
    'js/engine/state.js', 'js/engine/save-validation.js', 'js/features/coalicion.js', 'js/main.js',
    'js/ui/screens.js', 'js/ui/end-texto.js', 'js/ui/endscreen.js', 'js/ui/trophies-ui.js',
    'js/data/achievements.js',
  ];
  const sueltos = [];
  for (const f of archivos) {
    readFileSync(new URL(`../${f}`, import.meta.url), 'utf8').split(/\r?\n/).forEach((l, i) => {
      const codigo = l.replace(/\/\/.*$/, '').replace(/\/\*.*$/, '').replace(/^\s*\*.*$/, '');
      if (/\b48\b/.test(codigo)) sueltos.push(`${f}:${i + 1}: ${l.trim().slice(0, 80)}`);
    });
  }
  assert.deepEqual(sueltos, []);
});

// ── Ritmo: un mandato largo cobra menos por turno ────────────

import { CONFIG } from '../js/config.js';
import { applyEffects } from '../js/engine/scoring.js';

const SIN_RITMO = { efectos: 1, malos: 1, inercia: 1, especiales: 1 };

test('Argentina, Latinoamérica, Colombia y Chile no cambian nada por turno', () => {
  for (const id of ['ar', 'latam', 'co', 'cl']) {
    aplicarReglas(id);
    assert.deepEqual(CONFIG.RITMO, SIN_RITMO, id);
  }
});

test('México, con 72 turnos, cobra menos por turno: efectos, efectos malos e inercia', () => {
  aplicarReglas('mx');
  assert.ok(CONFIG.RITMO.efectos < 1 && CONFIG.RITMO.efectos >= 0.6, 'efectos');
  assert.ok(CONFIG.RITMO.malos < 1 && CONFIG.RITMO.malos >= 0.8, 'malos');
  assert.ok(CONFIG.RITMO.inercia < 1 && CONFIG.RITMO.inercia >= 0.6, 'inercia');
  assert.equal(CONFIG.RITMO.especiales, 1);
  aplicarReglas('ar');
  assert.deepEqual(CONFIG.RITMO, SIN_RITMO, 'al volver a Argentina el ritmo vuelve a 1');
});

test('el ritmo escala los efectos de una decisión: un golpe de -10 pega menos en México', () => {
  const ind = { confianza: 50, ipc: 50 };
  aplicarReglas('ar');
  const ar = applyEffects(ind, { confianza: -10, ipc: -10 });
  assert.deepEqual([ar.confianza, ar.ipc], [40, 40]);
  aplicarReglas('mx');
  const mx = applyEffects(ind, { confianza: -10, ipc: -10 });
  assert.ok(mx.confianza > 40, `el golpe malo en México (${mx.confianza}) tiene que pegar menos que en 48 turnos (40)`);
  assert.ok(mx.confianza < 50);
  assert.ok(mx.ipc < 50 && mx.ipc > 40, 'una mejora también rinde menos');
});
