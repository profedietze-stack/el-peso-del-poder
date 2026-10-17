// Capital político (ver docs/superpowers/specs/2026-10-17-capital-politico-design.md).
//
// El tipo de mandato casi no cambiaba la partida (±1,6 % de victorias medido con 2.500
// partidas por estrategia). Ahora fija un recurso, el capital político, que las
// decisiones gastan o devuelven y que decide cuánta fuerza tiene el gobierno: con poco,
// lo que sale mal duele más; con mucho, lo que sale bien rinde más.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CAPITAL, capitalInicial, topeDeCapital, variacionDeOpcion, costoDeAmbicion,
  iniciarTurnoCapital, aplicarCapital, efectosSegunCapital, estadoDeCapital,
} from '../js/engine/capital.js';
import * as capital from '../js/engine/capital.js';
import { newState } from '../js/engine/state.js';
import { aplicarInicioDeTurno } from '../js/engine/effects.js';
import { validarGuardado } from '../js/engine/save-validation.js';

const IDENTIDAD = { presidentName: 'Ana Pérez', partyName: 'Frente', vpId: 'vp-moreno' };
const partida = (mandateType) => newState({ heritageId: 'estable', mandateType, difficulty: 'normal', identity: IDENTIDAD });
const op = (confianza, extra = {}) => ({ texto: 'x', efectos: { confianza }, ...extra });

test('cada mandato arranca con su capital: amplio 80, coalición 65, ajustado 40', () => {
  assert.equal(capitalInicial('amplio'), 80);
  assert.equal(capitalInicial('coalicion'), 65);
  assert.equal(capitalInicial('ajustado'), 40);
  assert.equal(capitalInicial('inventado'), 40);
  for (const m of ['amplio', 'coalicion', 'ajustado']) assert.equal(partida(m).capital, capitalInicial(m), m);
});

test('una opción que baja la confianza cuesta esa cantidad; una que la sube devuelve la sexta parte', () => {
  assert.equal(variacionDeOpcion(op(-8), 'amplio'), -8);
  assert.equal(variacionDeOpcion(op(12), 'amplio'), 2);
  assert.equal(variacionDeOpcion(op(7), 'amplio'), 2, 'se redondea hacia arriba');
  assert.equal(variacionDeOpcion(op(0), 'amplio'), 0);
  assert.equal(variacionDeOpcion({ texto: 'x', efectos: {} }, 'amplio'), 0);
  assert.equal(variacionDeOpcion({ texto: 'x' }, 'amplio'), 0, 'sin efectos tampoco rompe');
});

test('las medidas ambiciosas cuestan capital; solo cuentan las MEJORAS', () => {
  // ipc, deuda, riesgo, pobreza y desocupación son malos cuando suben.
  const reforma = { efectos: { ipc: -10, deuda: -8, produccion: 6, reservas: 5 } }; // mejora 10+8+6+5 = 29
  assert.equal(costoDeAmbicion(reforma), Math.ceil((29 - CAPITAL.AUDACIA_BASE) / CAPITAL.AUDACIA_DIV));
  assert.ok(costoDeAmbicion(reforma) > 0);
  assert.equal(costoDeAmbicion({ efectos: { ipc: -3, produccion: 4 } }), 0, 'una medida chica no cuesta');
  const desastre = { efectos: { ipc: 20, deuda: 15, pobreza: 12, produccion: -18 } };
  assert.equal(costoDeAmbicion(desastre), 0, 'un desastre no pide permiso: si no, el Congreso protegería al que decide mal');
  assert.equal(variacionDeOpcion(reforma, 'amplio'), -costoDeAmbicion(reforma));
});

test('en Ajustado lo que se gana vale más, pero lo que se gasta no cambia', () => {
  assert.equal(variacionDeOpcion(op(12), 'ajustado'), Math.round(2 * CAPITAL.MULT_AJUSTADO));
  assert.equal(variacionDeOpcion(op(-8), 'ajustado'), -8);
  assert.equal(variacionDeOpcion(op(12), 'coalicion'), 2);
});

test('el campo `capital` de una opción pisa la fórmula', () => {
  assert.equal(variacionDeOpcion(op(10, { capital: -12 }), 'amplio'), -12);
  assert.equal(variacionDeOpcion(op(-10, { capital: 4 }), 'amplio'), 4);
  assert.equal(variacionDeOpcion(op(-10, { capital: 4 }), 'ajustado'), Math.round(4 * CAPITAL.MULT_AJUSTADO));
  assert.equal(variacionDeOpcion(op(-10, { capital: 0 }), 'amplio'), 0, 'capital:0 también cuenta');
  const ambiciosa = { efectos: { ipc: -30, deuda: -30 }, capital: -2 };
  assert.equal(variacionDeOpcion(ambiciosa, 'amplio'), -2, 'tampoco suma el costo por ambición');
});

test('no existe el bloqueo de opciones: se midió y le sirve al que decide mal', () => {
  assert.equal(capital.opcionesBloqueadas, undefined);
});

test('el turno 1 no recupera; después se recupera con tope', () => {
  const s = partida('ajustado');
  s.capital = 40; s.turn = 1; iniciarTurnoCapital(s);
  assert.equal(s.capital, 40);
  s.turn = 2; iniciarTurnoCapital(s);
  assert.equal(s.capital, 40 + CAPITAL.REGEN);
  s.capital = 100; s.turn = 3; iniciarTurnoCapital(s);
  assert.equal(s.capital, 100, 'no pasa del tope');
});

test('con la alianza rota el tope baja y no se recupera', () => {
  const c = partida('coalicion');
  c.alianzaRota = true;
  assert.equal(topeDeCapital(c), CAPITAL.TOPE_ALIANZA_ROTA);
  c.capital = 30; c.turn = 2; iniciarTurnoCapital(c);
  assert.equal(c.capital, 30, 'regen 1 − 1 = 0');
  c.capital = 44; aplicarCapital(c, op(12));
  assert.equal(c.capital, CAPITAL.TOPE_ALIANZA_ROTA, 'ni ganando se pasa del tope');
});

test('el capital nunca baja de 0 ni pasa de 100 al decidir, y se lleva la cuenta de lo gastado', () => {
  const s = partida('ajustado');
  s.capital = 4;
  assert.equal(aplicarCapital(s, op(-10)), -4, 'devuelve lo que realmente cambió');
  assert.equal(s.capital, 0);
  assert.equal(s.capitalGastado, 4);
  s.capital = 99;
  assert.equal(aplicarCapital(s, op(12)), 1);
  assert.equal(s.capital, 100);
  assert.equal(s.capitalGastado, 4, 'ganar no suma al gasto');
});

test('aplicarInicioDeTurno recupera capital una sola vez por turno (salir y continuar no lo duplica)', () => {
  const s = partida('ajustado');
  s.turn = 5; s.capital = 40;
  aplicarInicioDeTurno(s);
  assert.equal(s.capital, 40 + CAPITAL.REGEN);
  aplicarInicioDeTurno(s);
  aplicarInicioDeTurno(s);
  assert.equal(s.capital, 40 + CAPITAL.REGEN);
});

// ── La fuerza del gobierno ───────────────────────────────────

test('con capital en la zona media los efectos no se tocan', () => {
  const ef = { ipc: 5, confianza: -3, produccion: 4 };
  assert.deepEqual(efectosSegunCapital(ef, 50), ef);
  assert.deepEqual(efectosSegunCapital(ef, CAPITAL.DEBIL_BAJO), ef);
  assert.deepEqual(efectosSegunCapital(ef, CAPITAL.FUERTE_ALTO), ef);
});

test('con poco capital lo que empeora un indicador duele más, y lo bueno queda igual', () => {
  // ipc +5 (malo: la inflación sube), confianza −3 (malo), produccion +4 (bueno).
  const r = efectosSegunCapital({ ipc: 5, confianza: -3, produccion: 4 }, 0);
  assert.ok(Math.abs(r.ipc - 5 * (1 + CAPITAL.DEBIL_EXTRA)) < 1e-9);
  assert.ok(Math.abs(r.confianza + 3 * (1 + CAPITAL.DEBIL_EXTRA)) < 1e-9);
  assert.equal(r.produccion, 4);
});

test('con mucho capital lo bueno rinde más, y lo malo queda igual', () => {
  const r = efectosSegunCapital({ ipc: 5, ipcMejora: 0, deuda: -6, produccion: 4, confianza: -3 }, 100);
  assert.ok(Math.abs(r.deuda + 6 * (1 + CAPITAL.FUERTE_EXTRA)) < 1e-9, 'bajar la deuda es bueno');
  assert.ok(Math.abs(r.produccion - 4 * (1 + CAPITAL.FUERTE_EXTRA)) < 1e-9);
  assert.equal(r.ipc, 5);
  assert.equal(r.confianza, -3);
});

test('el efecto crece de forma continua entre el umbral y el extremo, y no muta el original', () => {
  const ef = { ipc: 10 };
  const mitad = efectosSegunCapital(ef, CAPITAL.DEBIL_BAJO / 2).ipc;
  const cero = efectosSegunCapital(ef, 0).ipc;
  assert.ok(10 < mitad && mitad < cero);
  assert.deepEqual(ef, { ipc: 10 });
  assert.deepEqual(efectosSegunCapital({}, 0), {});
  assert.deepEqual(efectosSegunCapital(undefined, 0), {});
});

test('estadoDeCapital: débil, estable o fuerte', () => {
  assert.equal(estadoDeCapital(0), 'debil');
  assert.equal(estadoDeCapital(CAPITAL.DEBIL_BAJO - 1), 'debil');
  assert.equal(estadoDeCapital(50), 'estable');
  assert.equal(estadoDeCapital(CAPITAL.FUERTE_ALTO), 'estable');
  assert.equal(estadoDeCapital(CAPITAL.FUERTE_ALTO + 1), 'fuerte');
});

// ── Guardado ─────────────────────────────────────────────────

const guardable = (s) => JSON.parse(JSON.stringify({ ...s, usedEventIds: [...s.usedEventIds] }));

test('el capital sobrevive a guardar y cargar', () => {
  const s = partida('coalicion');
  s.turn = 7; s.capital = 33; s.capitalGastado = 21; s.alianzaRota = true;
  const r = validarGuardado(guardable(s));
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.capital, 33);
  assert.equal(r.state.capitalGastado, 21);
  assert.equal(r.state.alianzaRota, true);
});

test('una partida guardada antes del capital arranca con el de su mandato', () => {
  const s = partida('amplio');
  s.turn = 7;
  const crudo = guardable(s);
  for (const k of ['capital', 'capitalGastado', 'alianzaRota']) delete crudo[k];
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.capital, 80);
  assert.equal(r.state.capitalGastado, 0);
  assert.equal(r.state.alianzaRota, false);
});

test('un capital editado o de otro tipo no rompe la carga', () => {
  const s = partida('ajustado');
  s.turn = 3;
  for (const [valor, esperado] of [[500, 100], [-9, 0], ['mucho', 40], [null, 40], [NaN, 40], [42.6, 43]]) {
    const crudo = guardable(s);
    crudo.capital = valor;
    const r = validarGuardado(crudo);
    assert.equal(r.estado, 'ok', String(valor));
    assert.equal(r.state.capital, esperado, `capital ${valor}`);
  }
  const crudo = guardable(s);
  crudo.alianzaRota = 'si'; crudo.capitalGastado = 'x';
  const r = validarGuardado(crudo);
  assert.equal(r.state.alianzaRota, false);
  assert.equal(r.state.capitalGastado, 0);
});
