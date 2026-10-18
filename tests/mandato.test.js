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
