// Los ajustes del jugador se leen campo por campo (auditoría de octubre, P-02).
//
// `{ ...DEFAULTS, ...JSON.parse(raw) }` solo se defiende de un JSON ilegible: si el
// texto parsea, un campo con el tipo cambiado pasa entero. Medido en el navegador:
// `volume: 'abc'` y `fontScale: 7` quedaban guardados crudos, `soundOn: 'false'`
// (texto) era verdadero, y un JSON de cuatro letras agregaba cuatro claves basura.
// Nada de eso rompía la pantalla, pero la pantalla de Opciones mostraba un estado
// que no era el real y el audio recibía un volumen que no es un número.
import test from 'node:test';
import assert from 'node:assert/strict';

import { loadSettings, getSettings, FONT_SCALES } from '../js/engine/settings.js';

/** Carga los ajustes como si `epp_settings` contuviera `crudo`, con o sin preferencia del sistema. */
function cargarCon(crudo, { reducirMovimiento = false } = {}) {
  globalThis.localStorage = { getItem: () => crudo, setItem() {}, removeItem() {} };
  globalThis.matchMedia = (q) => ({ matches: reducirMovimiento && q.includes('reduce') });
  return loadSettings();
}

const CLAVES = ['fontScale', 'soundOn', 'volume', 'highContrast', 'reduceMotion', 'pais'];

test('un ajuste con el tipo cambiado cae a su valor por defecto', () => {
  const s = cargarCon(JSON.stringify({
    fontScale: 7, soundOn: 'false', volume: 'abc', highContrast: 1, reduceMotion: 'si',
  }));
  assert.equal(s.fontScale, 'normal');
  assert.equal(s.soundOn, true);
  assert.equal(s.volume, 0.8);
  assert.equal(s.highContrast, false);
  assert.equal(s.reduceMotion, false);
});

test('una escala de letra que no existe no pasa, ni siquiera heredada de Object', () => {
  for (const k of ['constructor', '__proto__', 'toString', 'enorme', '']) {
    assert.equal(cargarCon(JSON.stringify({ fontScale: k })).fontScale, 'normal', k);
  }
  for (const k of Object.keys(FONT_SCALES)) {
    assert.equal(cargarCon(JSON.stringify({ fontScale: k })).fontScale, k);
  }
});

test('el volumen se acota a 0..1', () => {
  assert.equal(cargarCon(JSON.stringify({ volume: 5 })).volume, 1);
  assert.equal(cargarCon(JSON.stringify({ volume: -3 })).volume, 0);
  assert.equal(cargarCon(JSON.stringify({ volume: 0 })).volume, 0);
  assert.equal(cargarCon(JSON.stringify({ volume: 0.35 })).volume, 0.35);
  assert.equal(cargarCon(JSON.stringify({ volume: null })).volume, 0.8);
});

test('lo que no es un objeto de ajustes se ignora y no deja claves de más', () => {
  for (const crudo of ['"hola"', 'null', '[1,2]', '42', 'true', '{roto', '']) {
    const s = cargarCon(crudo);
    assert.deepEqual(Object.keys(s).sort(), [...CLAVES].sort(), `crudo ${crudo}`);
    assert.equal(s.fontScale, 'normal');
    assert.equal(s.soundOn, true);
  }
});

test('las claves desconocidas no se cuelan', () => {
  const s = cargarCon(JSON.stringify({ volume: 0.5, basura: 'x', __proto__: { x: 1 } }));
  assert.deepEqual(Object.keys(s).sort(), [...CLAVES].sort());
  assert.equal(s.volume, 0.5);
});

test('sin ajustes guardados se respeta la preferencia de movimiento reducido del sistema', () => {
  assert.equal(cargarCon(null, { reducirMovimiento: true }).reduceMotion, true);
  assert.equal(cargarCon(null, { reducirMovimiento: false }).reduceMotion, false);
});

test('con ajustes guardados manda lo que el jugador eligió, no el sistema', () => {
  const s = cargarCon(JSON.stringify({ reduceMotion: false }), { reducirMovimiento: true });
  assert.equal(s.reduceMotion, false);
});

test('getSettings devuelve una copia', () => {
  cargarCon(null);
  const a = getSettings();
  a.volume = 0;
  assert.equal(getSettings().volume, 0.8);
});
