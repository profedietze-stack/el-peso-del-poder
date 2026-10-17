// Accesibilidad básica (auditoría de octubre: A-10, A-11, A-12 y los tamaños).
//
// Medido en Chromium sobre la pantalla de la partida y las de preparación:
//
//   · A-10  Enter y Espacio no elegían VP (`<div role=button onclick>` sin teclado),
//           y los tres tipos de mandato ni tenían `tabindex`: un alumno que usa
//           teclado o lector de pantalla no podía armar una partida.
//   · A-11  `maximum-scale=1.0` bloqueaba el pellizco para agrandar (WCAG 1.4.4) y
//           los avisos del juego no se anunciaban.
//   · A-12  Ocho botones de overlays cerrados (a `opacity:0`) seguían en el orden
//           de Tab: el teclado caía en «Entendido — Tomar Decisiones» sin verlo.
//   · 33 textos de 9,3 a 10,9 px (tarjetas de asesores, chips de ministros) y seis
//           botones de 36 px o menos en la barra superior.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const leer = (ruta) => readFileSync(fileURLToPath(new URL(`../${ruta}`, import.meta.url)), 'utf8');
const html = leer('index.html');
const css = leer('css/main.css').replace(/\/\*[\s\S]*?\*\//g, '');

// ── Zoom y avisos ────────────────────────────────────────────

test('A-11: la página se puede agrandar con los dedos', () => {
  const viewport = html.match(/<meta name="viewport" content="([^"]*)"/)?.[1] ?? '';
  assert.ok(viewport, 'no hay meta viewport');
  assert.ok(!/maximum-scale\s*=\s*1(\.0)?\b/.test(viewport), `«${viewport}» bloquea el zoom`);
  assert.ok(!/user-scalable\s*=\s*(no|0)/.test(viewport), `«${viewport}» bloquea el zoom`);
});

test('A-11: el aviso del juego se anuncia a los lectores de pantalla', () => {
  const tag = html.match(/<div[^>]*id="notif-strip"[^>]*>/)?.[0] ?? '';
  assert.match(tag, /role="status"/);
  assert.match(tag, /aria-live="polite"/);
});

// ── Teclado ──────────────────────────────────────────────────

import { debeActivarse } from '../js/ui/teclado.js';

const objetivo = (tag, { rol = null } = {}) => ({
  tagName: tag.toUpperCase(),
  matches: (sel) => rol !== null && sel.split(',').map((s) => s.trim()).includes(`[role="${rol}"]`),
});

test('A-10: Enter y Espacio activan un div con role=button', () => {
  for (const key of ['Enter', ' ']) {
    assert.equal(debeActivarse({ key, target: objetivo('div', { rol: 'button' }) }), true, `«${key}»`);
  }
});

test('A-10: también las opciones con role=radio (el tipo de mandato)', () => {
  assert.equal(debeActivarse({ key: 'Enter', target: objetivo('div', { rol: 'radio' }) }), true);
});

test('A-10: no se mete con lo que ya es nativo ni con otras teclas', () => {
  // Un <button> ya se activa solo: si además se llamara a click(), se dispararía dos veces.
  assert.equal(debeActivarse({ key: 'Enter', target: objetivo('button', { rol: 'button' }) }), false);
  assert.equal(debeActivarse({ key: 'Enter', target: objetivo('input', { rol: 'button' }) }), false);
  assert.equal(debeActivarse({ key: 'Enter', target: objetivo('a', { rol: 'button' }) }), false);
  assert.equal(debeActivarse({ key: 'Tab', target: objetivo('div', { rol: 'button' }) }), false);
  assert.equal(debeActivarse({ key: 'a', target: objetivo('div', { rol: 'button' }) }), false);
  assert.equal(debeActivarse({ key: 'Enter', target: objetivo('div') }), false, 'un div sin rol no es un control');
  assert.equal(debeActivarse({ key: 'Enter', target: null }), false);
});

test('A-10: los tres tipos de mandato se pueden alcanzar y elegir con teclado', () => {
  const opciones = [...html.matchAll(/<div class="mandate-opt(?: selected)?"[^>]*>/g)].map((m) => m[0]);
  assert.equal(opciones.length, 3);
  for (const o of opciones) {
    assert.match(o, /role="radio"/, o);
    assert.match(o, /tabindex="0"/, o);
    assert.match(o, /aria-checked="(true|false)"/, o);
  }
  assert.match(html, /<div class="mandate-options"[^>]*role="radiogroup"/);
});

// ── Overlays cerrados ────────────────────────────────────────

test('A-12: un overlay cerrado sale del orden de Tab (visibility:hidden)', () => {
  const cerrados = {
    '.emergency-overlay': '.open',
    '.extreme-alert-overlay': '.open',
    '.resign-confirm-overlay': '.open',
    '.resign-replace-overlay': '.open',
    '.midterm-overlay': '.open',
    '.tutorial-bubble': '.tut-bubble-visible',
  };
  const sinSalir = [];
  for (const [sel, abierto] of Object.entries(cerrados)) {
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regla = new RegExp(`${esc(sel)}:not\\(${esc(abierto)}\\)[^{]*\\{[^}]*visibility:\\s*hidden`);
    if (!regla.test(css)) sinSalir.push(sel);
  }
  assert.deepEqual(sinSalir, [], 'sin visibility:hidden al cerrarse, el teclado cae en botones invisibles');
});

// ── Tamaños ──────────────────────────────────────────────────

test('ningún texto del juego se declara por debajo de 11,5 px', () => {
  const chicos = [];
  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    for (const d of m[2].matchAll(/font-size:\s*(\d*\.?\d+)(rem|px|em)/g)) {
      const px = d[2] === 'px' ? Number(d[1]) : Number(d[1]) * 16;
      if (px < 11.5) chicos.push(`${m[1].trim().replace(/\s+/g, ' ').slice(0, 50)} → ${d[1]}${d[2]}`);
    }
  }
  assert.equal(chicos.length, 0, `${chicos.length} tamaños chicos:\n${chicos.slice(0, 12).join('\n')}`);
});

test('ni los estilos en línea de js/ ni los de index.html bajan de 11,5 px', () => {
  // Los `style="font-size:.67rem"` escritos dentro de plantillas no los ve un barrido del CSS.
  const fuentes = ['index.html'];
  const recorrer = (dir) => {
    for (const nombre of readdirSync(fileURLToPath(new URL(`../${dir}`, import.meta.url)))) {
      const ruta = `${dir}/${nombre}`;
      if (statSync(fileURLToPath(new URL(`../${ruta}`, import.meta.url))).isDirectory()) recorrer(ruta);
      else if (nombre.endsWith('.js') && !ruta.startsWith('js/data/')) fuentes.push(ruta);
    }
  };
  recorrer('js');
  const chicos = [];
  for (const ruta of fuentes) {
    for (const m of leer(ruta).matchAll(/style="[^"]*font-size:\s*(\d*\.?\d+)(rem|px)/g)) {
      const px = m[2] === 'px' ? Number(m[1]) : Number(m[1]) * 16;
      if (px < 11.5) chicos.push(`${ruta}: ${m[1]}${m[2]}`);
    }
  }
  assert.deepEqual(chicos, []);
});

test('los botones de la barra y los enlaces de la pantalla miden al menos 44 px de alto', () => {
  const alto = (sel) => {
    const re = new RegExp(`(?:^|[}\\s,])${sel.replace(/[.]/g, '\\.')}\\s*(?:,[^{]*)?\\{[^}]*min-height:\\s*(\\d+)px`, 'g');
    return Math.max(0, ...[...css.matchAll(re)].map((m) => Number(m[1])));
  };
  for (const sel of ['.btn-sm', '.news-ticker-more', '.recent-log-toggle']) {
    assert.ok(alto(sel) >= 44, `${sel} no declara min-height de 44px o más`);
  }
});

test('la barra superior deja pasar los botones a otra fila en vez de cortarlos', () => {
  const reglas = [...css.matchAll(/\.top-actions\s*\{([^}]*)\}/g)].map((m) => m[1]).join(';');
  assert.match(reglas, /flex-wrap:\s*wrap/, 'con letra grande «SALIR» se salía de la pantalla');
});
