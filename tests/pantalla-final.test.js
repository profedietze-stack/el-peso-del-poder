// La pantalla final en diapositivas.
//
// Era una columna larga: el diploma y el análisis llenaban la primera vista y el resultado
// de la reelección, con el botón de «Iniciar segundo mandato», quedaba a ~1.050 px del borde
// superior en una ventana de 800. Muchos alumnos no se enteraban de que habían ganado.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { DIAPOSITIVAS, diapositivasVisibles, moverIndice } from '../js/ui/end-slides.js';

const leer = (r) => readFileSync(fileURLToPath(new URL(`../${r}`, import.meta.url)), 'utf8');
const html = leer('index.html');

test('son cuatro diapositivas, en este orden', () => {
  assert.deepEqual(DIAPOSITIVAS, ['diploma', 'gestion', 'eleccion', 'informe']);
});

test('ganar el primer mandato muestra la de elecciones; perder o el segundo mandato, no', () => {
  assert.deepEqual(diapositivasVisibles({ won: true, isSecondTerm: false }), ['diploma', 'gestion', 'eleccion', 'informe']);
  assert.deepEqual(diapositivasVisibles({ won: true }), ['diploma', 'gestion', 'eleccion', 'informe']);
  assert.deepEqual(diapositivasVisibles({ won: false }), ['diploma', 'gestion', 'informe']);
  assert.deepEqual(diapositivasVisibles({ won: true, isSecondTerm: true }), ['diploma', 'gestion', 'informe']);
  assert.deepEqual(diapositivasVisibles(undefined), ['diploma', 'gestion', 'informe']);
});

test('moverIndice no se sale de la lista', () => {
  assert.equal(moverIndice(0, -1, 4), 0);
  assert.equal(moverIndice(3, 1, 4), 3);
  assert.equal(moverIndice(1, 1, 4), 2);
  assert.equal(moverIndice(2, -1, 4), 1);
});

// ── El HTML ──────────────────────────────────────────────────

/** El texto de una diapositiva: desde su <section> hasta la siguiente o la navegación. */
function diapositiva(id) {
  const ini = html.indexOf(`id="end-slide-${id}"`);
  assert.ok(ini > 0, `no existe la diapositiva ${id}`);
  const topes = [html.indexOf('<section', ini + 10), html.indexOf('<nav class="end-nav"', ini)].filter((n) => n > 0);
  return html.slice(ini, Math.min(...topes));
}

test('cada parte de la pantalla final está en su diapositiva', () => {
  assert.match(diapositiva('diploma'), /id="diploma-box"/);
  const gestion = diapositiva('gestion');
  for (const id of ['analysis-text', 'final-stats', 'end-capital']) assert.match(gestion, new RegExp(`id="${id}"`), id);
  const eleccion = diapositiva('eleccion');
  assert.match(eleccion, /id="reelection-section"/);
  assert.match(eleccion, /id="reelection-content"/);
  const informe = diapositiva('informe');
  for (const id of ['ach-grid', 'history-panel', 'history-tabs', 'capture-btn', 'share-options', 'end-key-slot']) {
    assert.match(informe, new RegExp(`id="${id}"`), id);
  }
  assert.match(informe, /restartGame\(\)/, '«Jugar de nuevo» tiene que seguir en el informe');
});

test('el botón del segundo mandato no está en la primera diapositiva ni escondido en el informe', () => {
  assert.doesNotMatch(diapositiva('diploma'), /reelection|startSecondTerm/);
  assert.doesNotMatch(diapositiva('informe'), /startSecondTerm/);
  // El botón lo arma endscreen.js dentro de #reelection-content (diapositiva 3).
  assert.match(leer('js/ui/endscreen.js'), /startSecondTerm\(\)/);
});

test('hay navegación: Atrás, Siguiente, puntos y el atajo al informe', () => {
  const nav = html.match(/<nav class="end-nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.ok(nav, 'falta <nav class="end-nav">');
  for (const id of ['end-prev', 'end-next', 'end-dots', 'end-informe-link']) assert.match(nav, new RegExp(`id="${id}"`), id);
  assert.match(nav, /aria-label=/);
  assert.match(nav, /Informe completo/);
});

test('el CSS oculta las diapositivas inactivas y respeta «reducir animaciones»', () => {
  const css = leer('css/main.css').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(css, /\.end-slide\s*\{\s*display:\s*none/);
  assert.match(css, /\.end-slide\.activa\s*\{[^}]*display:\s*block/);
  assert.match(css, /body\.reduce-motion \.end-slide\.activa\s*\{[^}]*animation:\s*none/);
  assert.match(css, /prefers-reduced-motion[^{]*\{[^}]*\.end-slide\.activa/);
});

test('endscreen.js arma las diapositivas antes de mostrar la pantalla', () => {
  const src = leer('js/ui/endscreen.js');
  assert.match(src, /import \{ iniciarDiapositivas \}/);
  const i = src.indexOf('iniciarDiapositivas(state)');
  const j = src.indexOf("showScreen('screen-end')");
  assert.ok(i > 0 && j > i, 'iniciarDiapositivas tiene que ir antes de showScreen');
});

test('las decisiones clave van al informe, no después de los botones', () => {
  assert.match(leer('js/ui/endscreen.js'), /getElementById\('end-key-slot'\)/);
});
