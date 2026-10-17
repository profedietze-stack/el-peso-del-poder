// El banner de errores tiene que existir ANTES que el resto del juego (auditoría
// de octubre, P-03).
//
// Estaba dentro de `main.js`, y `main.js` importa ~42 módulos. Un error al evaluar
// cualquiera de ellos —o un 503 al traerlo sin conexión— ocurre antes de que el
// banner exista, así que el docente ve una pantalla muerta sin una sola pista. Es
// justo el caso del arranque que el banner tiene que cubrir.
//
// Por eso es un script clásico, sin imports, cargado antes del módulo principal.
// Estos tests lo corren en un `window` y un `document` de mentira.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const raiz = (ruta) => fileURLToPath(new URL(`../${ruta}`, import.meta.url));
const SCRIPT = raiz('js/error-banner-inicial.js');

/** Un navegador de mentira lo justo para que el script dibuje su banner. */
function navegadorFalso({ body = true } = {}) {
  const oyentes = {};
  const cuerpo = { hijos: [], appendChild(h) { this.hijos.push(h); h.parent = this; } };
  const crear = () => {
    const el = { style: {}, attrs: {}, textContent: '', listeners: {}, remove() { this.removed = true; },
      setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(t, f) { this.listeners[t] = f; } };
    return el;
  };
  const document = {
    readyState: body ? 'complete' : 'loading',
    body: body ? cuerpo : null,
    createElement: crear,
    getElementById: (id) => cuerpo.hijos.find((h) => h.id === id) ?? null,
    addEventListener: (t, f) => { (oyentes[`doc:${t}`] ||= []).push(f); },
  };
  const window = {
    addEventListener: (t, f, captura) => { (oyentes[t] ||= []).push({ f, captura: !!captura }); },
  };
  window.window = window;
  const ctx = vm.createContext({ window, document, console: { info() {}, warn() {}, error() {} }, navigator: {} });
  vm.runInContext(readFileSync(SCRIPT, 'utf8'), ctx);
  const disparar = (tipo, evento) => (oyentes[tipo] ?? []).forEach((o) => o.f(evento));
  const banner = () => cuerpo.hijos.find((h) => h.id === '__err_banner');
  return { disparar, banner, oyentes, document, cuerpo, window, abrirDocumento: () => {
    document.body = cuerpo; document.readyState = 'complete';
    (oyentes['doc:DOMContentLoaded'] ?? []).forEach((f) => f());
  } };
}

test('el banner es un script clásico que carga antes del módulo principal', () => {
  const html = readFileSync(raiz('index.html'), 'utf8');
  const clasico = html.search(/<script[^>]*src="js\/error-banner-inicial\.js"[^>]*>/);
  const modulo = html.search(/<script[^>]*type="module"[^>]*src="js\/main\.js"/);
  assert.ok(clasico >= 0, 'index.html no carga js/error-banner-inicial.js');
  assert.ok(modulo >= 0, 'index.html no carga el módulo principal');
  assert.ok(clasico < modulo, 'el banner tiene que cargar ANTES que main.js');
  const etiqueta = html.match(/<script[^>]*src="js\/error-banner-inicial\.js"[^>]*>/)[0];
  assert.ok(!/type="module"/.test(etiqueta), 'tiene que ser clásico: un módulo también se retrasa si falla un import');
});

test('el script no importa nada: tiene que poder correr aunque el resto no cargue', () => {
  const src = readFileSync(SCRIPT, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  assert.ok(!/\bimport\b|\bexport\b/.test(src));
});

test('un error de JavaScript dibuja el banner con mensaje y lugar', () => {
  const n = navegadorFalso();
  n.disparar('error', {
    message: 'x is not defined', filename: 'http://h/js/main.js', lineno: 7, colno: 3,
    error: { stack: 'ReferenceError: x\n at a\n at b' },
  });
  const b = n.banner();
  assert.ok(b, 'no se dibujó el banner');
  assert.match(b.textContent, /x is not defined/);
  assert.match(b.textContent, /main\.js:7:3/);
});

test('una promesa rechazada dibuja el banner', () => {
  const n = navegadorFalso();
  n.disparar('unhandledrejection', { reason: new Error('se cayó la red') });
  assert.match(n.banner().textContent, /se cayó la red/);
});

test('un módulo que no se pudo traer (503) dibuja el banner diciendo cuál', () => {
  const n = navegadorFalso();
  // Un <script> que falla a cargar dispara `error` en el elemento, que NO sube hasta
  // window: solo se ve en la fase de captura.
  n.disparar('error', { target: { tagName: 'SCRIPT', src: 'http://h/js/main.js' } });
  assert.match(n.banner().textContent, /main\.js/);
  assert.ok(n.oyentes.error.some((o) => o.captura), 'tiene que escuchar en captura');
});

test('una imagen que falla NO dibuja el banner: tiene su propio respaldo', () => {
  const n = navegadorFalso();
  n.disparar('error', { target: { tagName: 'IMG', src: 'http://h/img/eventos/x.jpg' } });
  assert.equal(n.banner(), undefined);
});

test('un error antes de que exista el <body> espera y se dibuja al abrirse el documento', () => {
  const n = navegadorFalso({ body: false });
  n.disparar('error', { message: 'muy temprano', filename: 'http://h/js/a.js', lineno: 1, colno: 1 });
  assert.equal(n.banner(), undefined, 'todavía no hay dónde dibujar');
  n.abrirDocumento();
  assert.match(n.banner().textContent, /muy temprano/);
});

test('el módulo del juego no duplica el banner', () => {
  const mod = readFileSync(raiz('js/ui/error-banner.js'), 'utf8');
  assert.ok(!/createElement\('div'\)/.test(mod), 'js/ui/error-banner.js todavía dibuja su propio banner');
});
