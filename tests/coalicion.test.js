// El pedido del socio de Coalición (ver docs/superpowers/specs/2026-10-17-capital-politico-design.md).
//
// Quien gana en coalición gobierna con un socio que no es de su partido. Cada diez turnos
// el socio pide algo: aceptar cuesta capital político; rechazar rompe la alianza (el capital
// máximo baja y deja de recuperarse).
import test from 'node:test';
import assert from 'node:assert/strict';

import { pedidoDelSocio, aplicarAlianza, construirPedido, TURNOS_PEDIDO, COSTO_ACEPTAR } from '../js/features/coalicion.js';
import { aplicarCapital, iniciarTurnoCapital, topeDeCapital, CAPITAL } from '../js/engine/capital.js';
import { newState } from '../js/engine/state.js';
import { validarGuardado } from '../js/engine/save-validation.js';

const IDENTIDAD = { presidentName: 'Ana Pérez', partyName: 'Frente', vpId: 'vp-moreno' };
const partida = (mandateType, turn = 1) => {
  const s = newState({ heritageId: 'estable', mandateType, difficulty: 'normal', identity: IDENTIDAD });
  s.turn = turn;
  return s;
};

test('el socio pide en los turnos 10, 20, 30 y 40, y solo en Coalición', () => {
  assert.deepEqual(TURNOS_PEDIDO, [10, 20, 30, 40]);
  for (let t = 1; t <= 48; t++) {
    const hay = pedidoDelSocio(partida('coalicion', t)).length;
    assert.equal(hay, TURNOS_PEDIDO.includes(t) ? 1 : 0, `turno ${t}`);
  }
  for (const m of ['amplio', 'ajustado']) {
    for (const t of TURNOS_PEDIDO) assert.equal(pedidoDelSocio(partida(m, t)).length, 0, `${m} turno ${t}`);
  }
});

test('con la alianza rota el socio ya no pide', () => {
  const s = partida('coalicion', 20);
  s.alianzaRota = true;
  assert.deepEqual(pedidoDelSocio(s), []);
});

test('un pedido que ya está en la cola no se vuelve a agregar (salir y continuar)', () => {
  const s = partida('coalicion', 10);
  s.pendingCrises = pedidoDelSocio(s);
  assert.equal(s.pendingCrises.length, 1);
  assert.deepEqual(pedidoDelSocio(s), []);
});

test('cada pedido tiene dos opciones: aceptar cuesta capital, rechazar rompe la alianza', () => {
  for (const t of TURNOS_PEDIDO) {
    const e = construirPedido(t);
    assert.equal(e.id, `coalicion-socio-${t}`);
    assert.equal(e.opciones.length, 2);
    const [acepta, rechaza] = e.opciones;
    assert.equal(acepta.capital, -COSTO_ACEPTAR);
    assert.ok(!acepta.rompeAlianza);
    assert.equal(rechaza.capital, 0);
    assert.equal(rechaza.rompeAlianza, true);
    for (const o of e.opciones) assert.ok(Object.values(o.efectos).every(Number.isFinite));
    assert.ok(!/[<>]/.test(JSON.stringify(e)), 'sin HTML');
  }
  assert.equal(construirPedido(11), null);
});

test('los cuatro pedidos son distintos entre sí', () => {
  const titulos = TURNOS_PEDIDO.map((t) => construirPedido(t).titulo);
  assert.equal(new Set(titulos).size, 4);
});

test('aceptar gasta capital', () => {
  const s = partida('coalicion', 10);
  s.capital = 60;
  const [acepta] = construirPedido(10).opciones;
  assert.equal(aplicarCapital(s, acepta), -COSTO_ACEPTAR);
  assert.equal(s.capital, 60 - COSTO_ACEPTAR);
  assert.equal(aplicarAlianza(s, acepta), false);
  assert.equal(s.alianzaRota, false);
});

test('rechazar rompe la alianza: el tope baja, el capital se recorta y no se recupera más', () => {
  const s = partida('coalicion', 10);
  s.capital = 90;
  const [, rechaza] = construirPedido(10).opciones;
  assert.equal(aplicarCapital(s, rechaza), 0);
  assert.equal(aplicarAlianza(s, rechaza), true);
  assert.equal(s.alianzaRota, true);
  assert.equal(topeDeCapital(s), CAPITAL.TOPE_ALIANZA_ROTA);
  assert.equal(s.capital, CAPITAL.TOPE_ALIANZA_ROTA, 'el capital pasaba del nuevo tope');
  s.turn = 11; iniciarTurnoCapital(s);
  assert.equal(s.capital, CAPITAL.TOPE_ALIANZA_ROTA);
  s.capital = 30; s.turn = 12; iniciarTurnoCapital(s);
  assert.equal(s.capital, 30 + CAPITAL.REGEN + CAPITAL.REGEN_ALIANZA_ROTA, 'sin recuperación');
  assert.equal(aplicarAlianza(s, rechaza), false, 'romperla dos veces no hace nada');
});

test('con poco capital aceptar lo deja en 0, nunca negativo', () => {
  const s = partida('coalicion', 10);
  s.capital = 6;
  const [acepta] = construirPedido(10).opciones;
  assert.equal(aplicarCapital(s, acepta), -6);
  assert.equal(s.capital, 0);
});

// ── Guardado ─────────────────────────────────────────────────

const guardable = (s) => JSON.parse(JSON.stringify({ ...s, usedEventIds: [...s.usedEventIds] }));

test('un pedido pendiente o en pantalla sobrevive a guardar y cargar', () => {
  const s = partida('coalicion', 20);
  s.startedTurn = 20;
  s.currentEvent = construirPedido(20);
  s.currentEventTurn = 20;
  s.pendingCrises = [construirPedido(10)];
  const r = validarGuardado(guardable(s));
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.currentEvent?.id, 'coalicion-socio-20');
  assert.equal(r.state.pendingCrises.length, 1);
  assert.equal(r.state.pendingCrises[0].id, 'coalicion-socio-10');
  assert.equal(r.state.currentEvent.opciones[1].rompeAlianza, true);
});

test('el guardado no confía en el texto ni en las opciones guardadas de un pedido', () => {
  const s = partida('coalicion', 30);
  s.startedTurn = 30;
  s.currentEventTurn = 30;
  const falso = JSON.parse(JSON.stringify(construirPedido(30)));
  falso.titulo = '<img src=x onerror=alert(1)>';
  falso.opciones[0].capital = 100;
  falso.opciones[1].rompeAlianza = false;
  s.currentEvent = falso;
  const r = validarGuardado(guardable(s));
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.currentEvent.titulo, construirPedido(30).titulo);
  assert.equal(r.state.currentEvent.opciones[0].capital, -COSTO_ACEPTAR);
  assert.equal(r.state.currentEvent.opciones[1].rompeAlianza, true);
});

test('un id de pedido inventado se descarta', () => {
  const s = partida('coalicion', 30);
  s.pendingCrises = [{ ...construirPedido(30), id: 'coalicion-socio-11' }, { ...construirPedido(30), id: 'coalicion-socio-x' }];
  const r = validarGuardado(guardable(s));
  assert.equal(r.estado, 'ok');
  assert.deepEqual(r.state.pendingCrises, []);
});
