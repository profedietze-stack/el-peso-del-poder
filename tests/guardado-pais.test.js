// Una partida guardada pertenece al país en que se jugó: cambiar el país en Ajustes no la
// abre con las reglas de otro (México dura 72 turnos y no tiene segundo mandato).
import test from 'node:test';
import assert from 'node:assert/strict';

import { aplicarReglas, paisActivo } from '../js/engine/mandato.js';
import { newState } from '../js/engine/state.js';
import { validarGuardado } from '../js/engine/save-validation.js';

test.afterEach(() => { aplicarReglas('ar'); delete globalThis.localStorage; });

const IDENTIDAD = { presidentName: 'Ana Pérez', partyName: 'Frente Amplio (FA)', vpId: 'vp-moreno' };

/** Lo que guarda el juego y vuelve de JSON.parse, creado en el país activo. */
function guardado(turn = 12) {
  const g = newState({ heritageId: 'estable', mandateType: 'amplio', difficulty: 'normal', identity: IDENTIDAD });
  g.turn = turn;
  return JSON.parse(JSON.stringify({ ...g, usedEventIds: [...g.usedEventIds] }));
}

function falsoLocalStorage(contenido) {
  const datos = new Map(contenido ? [['sdr_save', JSON.stringify(contenido)]] : []);
  globalThis.localStorage = {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => { datos.set(k, String(v)); },
    removeItem: (k) => { datos.delete(k); },
  };
  return datos;
}

test('el país activo queda anotado en la partida nueva y en la validada', () => {
  aplicarReglas('mx');
  assert.equal(paisActivo(), 'mx');
  const g = guardado(60);
  assert.equal(g.pais, 'mx');
  const r = validarGuardado(g);
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.pais, 'mx');
});

test('un guardado de México (turno 60) abierto con Colombia no se marca dañado: es de otro país', () => {
  aplicarReglas('mx');
  const g = guardado(60);
  aplicarReglas('co');
  assert.deepEqual(validarGuardado(g), { estado: 'otro-pais', paisGuardado: 'mx' });
});

test('el cambio de país vale en las dos direcciones, también entre Argentina y Latinoamérica', () => {
  aplicarReglas('latam');
  const g = guardado();
  aplicarReglas('ar');
  assert.equal(validarGuardado(g).estado, 'otro-pais');
  aplicarReglas('latam');
  assert.equal(validarGuardado(g).estado, 'ok');
});

test('un guardado viejo, sin país, se acepta; uno con un país inventado también', () => {
  const g = guardado();
  delete g.pais;
  assert.equal(validarGuardado(g).estado, 'ok');
  assert.equal(validarGuardado({ ...g, pais: 'atlantida' }).estado, 'ok');
  assert.equal(validarGuardado({ ...g, pais: 7 }).estado, 'ok');
});

test('con el país correcto, un turno fuera del mandato sigue siendo un guardado dañado', () => {
  aplicarReglas('co');
  const g = guardado(60);
  const r = validarGuardado(g);
  assert.equal(r.estado, 'danado');
  assert.match(r.motivo, /entre 1 y 48/);
});

test('cargarGuardado avisa «otro-pais» y no borra nada; hayPartidaValida deja visible «Continuar»', async () => {
  aplicarReglas('mx');
  const g = guardado(60);
  aplicarReglas('cl');
  const datos = falsoLocalStorage(g);
  const { cargarGuardado, hayPartidaValida } = await import('../js/engine/storage.js');
  const r = cargarGuardado();
  assert.equal(r.estado, 'otro-pais');
  assert.equal(r.paisGuardado, 'mx');
  assert.equal(r.state, null);
  assert.equal(hayPartidaValida(), true);
  assert.ok(datos.has('sdr_save'), 'el guardado de México tiene que seguir ahí');
});
