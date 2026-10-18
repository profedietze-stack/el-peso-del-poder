// El país se elige al empezar una partida nueva y no se puede cambiar después.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { fichaDePais, decidirEleccion, consumirNuevaPartida, NUEVA_PARTIDA_CLAVE } from '../js/ui/pais-ficha.js';
import { PAISES } from '../js/data/pais.js';

const leer = (r) => readFileSync(new URL(`../${r}`, import.meta.url), 'utf8');
const lineas = (id) => Object.fromEntries(fichaDePais(id).lineas.map((l) => [l.clave, l.texto]));

test('cada país tiene una ficha con las mismas filas: mandato, reelección, medio mandato, ambientación y partida', () => {
  for (const id of Object.keys(PAISES)) {
    const f = fichaDePais(id);
    assert.ok(f.nombre && f.bandera && f.resumen, id);
    assert.deepEqual(f.lineas.map((l) => l.clave), ['mandato', 'reeleccion', 'medio', 'ambientacion', 'partida'], id);
    for (const l of f.lineas) assert.ok(l.texto.length > 8 && l.icono, `${id} ${l.clave}`);
  }
});

test('el mandato sale de las reglas: México 6 años y 72 meses, los demás 4 años y 48', () => {
  assert.match(lineas('mx').mandato, /6 años/);
  assert.match(lineas('mx').mandato, /72 meses/);
  for (const id of ['ar', 'latam', 'co', 'cl']) {
    assert.match(lineas(id).mandato, /4 años/, id);
    assert.match(lineas(id).mandato, /48 meses/, id);
  }
});

test('la reelección: sí en Argentina y Latinoamérica; no en México y Colombia; no inmediata en Chile', () => {
  for (const id of ['ar', 'latam']) assert.match(lineas(id).reeleccion, /^Sí/, id);
  assert.match(lineas('mx').reeleccion, /^No/);
  assert.match(lineas('co').reeleccion, /^No/);
  assert.match(lineas('cl').reeleccion, /^No inmediata/);
});

test('el medio mandato dice qué se elige y en qué mes', () => {
  assert.match(lineas('ar').medio, /legislativas.*mes 24/i);
  assert.match(lineas('latam').medio, /legislativas.*mes 24/i);
  assert.match(lineas('mx').medio, /legislativas.*mes 36/i);
  assert.match(lineas('co').medio, /regionales y locales.*mes 24/i);
  assert.match(lineas('cl').medio, /municipales y regionales.*mes 24/i);
});

test('la duración de la partida avisa que la de México es más larga', () => {
  assert.match(lineas('mx').partida, /72 decisiones/);
  assert.match(lineas('mx').partida, /más larga/);
  assert.match(lineas('ar').partida, /48 decisiones/);
});

test('la ambientación nombra lo que cambia en cada país y nunca promete personas ni partidos', () => {
  assert.match(lineas('mx').ambientacion, /Banco de México/);
  assert.match(lineas('co').ambientacion, /Banco de la República/);
  assert.match(lineas('cl').ambientacion, /Banco Central de Chile/);
  assert.match(lineas('latam').ambientacion, /imaginario/);
  assert.match(lineas('ar').ambientacion, /Argentina/);
});

test('elegir el país que ya está activo sigue sin recargar; elegir otro lo guarda, marca y recarga', () => {
  const llamadas = [];
  const deps = { paisActual: 'ar', setPais: (id) => llamadas.push(['setPais', id]), marcar: () => llamadas.push(['marcar']), recargar: () => llamadas.push(['recargar']) };
  assert.equal(decidirEleccion('ar', deps), 'seguir');
  assert.deepEqual(llamadas, []);
  assert.equal(decidirEleccion('mx', deps), 'recargar');
  assert.deepEqual(llamadas, [['setPais', 'mx'], ['marcar'], ['recargar']]);
  assert.equal(decidirEleccion('atlantida', deps), 'seguir', 'un país inventado no cambia nada');
});

test('la marca de «nueva partida» se consume una sola vez, y sin sessionStorage no rompe', () => {
  const datos = new Map();
  const almacen = { getItem: (k) => datos.get(k) ?? null, setItem: (k, v) => datos.set(k, v), removeItem: (k) => datos.delete(k) };
  assert.equal(consumirNuevaPartida(almacen), false);
  almacen.setItem(NUEVA_PARTIDA_CLAVE, '1');
  assert.equal(consumirNuevaPartida(almacen), true);
  assert.equal(consumirNuevaPartida(almacen), false, 'ya se consumió');
  const roto = { getItem() { throw new Error('bloqueado'); }, removeItem() { throw new Error('bloqueado'); } };
  assert.equal(consumirNuevaPartida(roto), false);
});

test('el país ya no se cambia en Opciones: la pantalla de país es lo primero de una partida nueva', () => {
  const modal = leer('js/ui/settings-modal.js');
  assert.doesNotMatch(modal, /set-pais|setPais|PAISES/, 'Opciones no tiene selector de país');
  const main = leer('js/main.js');
  assert.match(main, /function startGame\(\)[\s\S]{0,600}showPaisScreen/);
  assert.match(main, /consumirNuevaPartida/);
  const html = leer('index.html');
  assert.match(html, /id="screen-pais"/);
  assert.match(html, /id="pais-grid"[^>]*data-sin-pais|data-sin-pais[^>]*id="pais-grid"|<div class="pais-wrap" data-sin-pais/);
});

test('el texto de la pantalla de país no usa voseo ni tuteo: se ve igual antes de elegir', () => {
  const ficha = Object.keys(PAISES).flatMap((id) => { const f = fichaDePais(id); return [f.resumen, ...f.lineas.map((l) => l.texto)]; }).join(' ');
  assert.doesNotMatch(ficha, /\b(podés|tenés|elegí|vos|puedes|tienes|elige)\b/i);
});
