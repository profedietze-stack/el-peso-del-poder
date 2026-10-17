// Código duplicado y restos que se desfasaron (auditoría de octubre, P-08 y M-09).
//
//   · `news-engine.js` tenía su propia copia de los umbrales de zona: el día que se
//     toque `CONFIG.THRESHOLDS` las noticias hablarían de otra «zona crítica».
//   · «Los próximas decisiones»: error de concordancia en el texto de respaldo de la
//     noticia inaugural.
//   · `main.js` armaba dos veces el flujo herencia → gabinete → dificultad; la copia de
//     `startGame` nunca se ejecutaba (el botón llama a `confirmHeritage`).
//   · `herramientas/preview-avatars.html` pide Google Fonts y api.dicebear.com: no se
//     enlaza desde el juego, pero si el sitio se publica entero esa URL existe.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';


const leer = (ruta) => readFileSync(fileURLToPath(new URL(`../${ruta}`, import.meta.url)), 'utf8');
const sinComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '');

test('news-engine no tiene su propia tabla de umbrales', () => {
  const src = sinComentarios(leer('js/features/news-engine.js'));
  assert.ok(!/warn\s*:\s*\d+\s*,\s*danger\s*:\s*\d+/.test(src), 'news-engine.js repite CONFIG.THRESHOLDS');
  assert.match(src, /getZone/, 'news-engine.js tiene que usar getZone de scoring.js');
});

test('el texto de respaldo de la noticia inaugural no tiene errores de concordancia', () => {
  assert.ok(!/Los próximas/.test(leer('js/features/news-engine.js')));
});

test('startGame no repite el flujo que ya hace confirmHeritage', () => {
  const src = sinComentarios(leer('js/main.js'));
  const cuerpo = src.match(/function startGame\(\)\s*\{([\s\S]*?)\n\}\n/)?.[1] ?? '';
  assert.ok(cuerpo, 'no se encontró startGame');
  assert.ok(!/showMinistersScreen|showDifficultyScreen|newState\(/.test(cuerpo),
    'startGame arma otra vez gabinete/dificultad: esa copia nunca se ejecuta');
});

test('la herramienta de avatares avisa que pide recursos a terceros y no se indexa', () => {
  const ruta = 'herramientas/preview-avatars.html';
  if (!existsSync(fileURLToPath(new URL(`../${ruta}`, import.meta.url)))) return; // si se borró, también vale
  const html = leer(ruta);
  assert.match(html, /<meta name="robots" content="noindex/);
  assert.match(html, /herramienta de desarrollo/i);
});
