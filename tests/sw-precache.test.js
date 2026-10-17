// La promesa «anda sin internet» tiene que ser entera (auditoría de octubre, A-04).
//
// El service worker no precacheaba nada: solo guardaba la portada y el resto «a
// medida que se usaba». Medido en Chromium con la caché HTTP apagada y sin red:
//
//     1 visita  → la portada se pinta ¡«Todo listo para jugar»!, pero `startGame`
//                 es `undefined`: los 42 módulos devolvían 503. Sin error, sin
//                 banner. Una pantalla viva y muerta a la vez.
//     2 visitas → funciona (55 entradas guardadas).
//
// Y el propio aviso del worker dice «conectate una vez, abrí el juego y a partir de
// ahí funciona sin conexión». Era falso: hacían falta dos.
//
// Ahora `install` precachea todo lo que el juego necesita. La lista se arma
// recorriendo el disco (`helpers/precache.js`), y un sello con la huella del
// contenido obliga a subir el nombre de la caché cuando algo cambia: sin eso, un
// arreglo que no sube `CACHE` no le llega a las tablets que ya lo tienen instalado.
// Ya se olvidó dos veces en otros juegos (ver juegos-checklist §6.4).
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { montarSW, peticion, respuesta } from './helpers/sw-harness.js';
import { listarPrecache, huella, leerSW, RAIZ } from './helpers/precache.js';

const ORIGEN = 'https://juego.test/';
const url = (rel) => new URL(rel, ORIGEN).href;

// ── La lista ─────────────────────────────────────────────────

test('sw.js declara una lista PRECACHE', () => {
  const { lista } = leerSW();
  assert.ok(Array.isArray(lista) && lista.length > 0, 'no hay un bloque PRECACHE:INICIO … PRECACHE:FIN con la lista');
});

test('la lista de sw.js es exactamente lo que hay en el disco: no falta nada ni sobra', () => {
  const { lista } = leerSW();
  const esperado = listarPrecache();
  const faltan = esperado.filter((r) => !lista?.includes(r));
  const sobran = (lista ?? []).filter((r) => !esperado.includes(r));
  assert.deepEqual(faltan, [], `faltan en sw.js (correr node tests/sellar-cache.js): ${faltan.join(', ')}`);
  assert.deepEqual(sobran, [], `sobran en sw.js (no existen o no van): ${sobran.join(', ')}`);
});

test('todo lo que precachea existe en el disco', () => {
  const { lista } = leerSW();
  const rotos = (lista ?? []).filter((r) => r !== './' && !existsSync(join(RAIZ, r)));
  assert.deepEqual(rotos, []);
});

test('cada <script> y <link> de index.html está en la lista', () => {
  const { lista } = leerSW();
  const html = readFileSync(join(RAIZ, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"#?]+)"/g)]
    .map((m) => m[1])
    .filter((r) => !/^https?:/.test(r));
  const fuera = refs.filter((r) => !lista?.includes(r));
  assert.deepEqual(fuera, [], `index.html pide cosas que el worker no precachea: ${fuera.join(', ')}`);
});

test('cada módulo que otro módulo importa está en la lista', () => {
  const { lista } = leerSW();
  const fuera = [];
  for (const rel of lista ?? []) {
    if (!rel.startsWith('js/')) continue;
    const src = readFileSync(join(RAIZ, rel), 'utf8');
    for (const m of src.matchAll(/(?:from\s+|import\s*\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const destino = join('js', rel.slice(3), '..', m[1]).replace(/\\/g, '/');
      const limpio = destino.split('/').reduce((acc, p) => {
        if (p === '..') acc.pop(); else if (p !== '.') acc.push(p);
        return acc;
      }, []).join('/');
      if (!lista.includes(limpio)) fuera.push(`${rel} → ${limpio}`);
    }
  }
  assert.deepEqual(fuera, [], `imports que no están precacheados:\n${fuera.join('\n')}`);
});

test('las tipografías latinas que usa fuentes.css están precacheadas', () => {
  const { lista } = leerSW();
  const css = readFileSync(join(RAIZ, 'css/fuentes.css'), 'utf8');
  const latinas = [...css.matchAll(/url\('\.\.\/(fonts\/[^']+-latin\.woff2)'\)/g)].map((m) => m[1]);
  assert.ok(latinas.length > 0);
  assert.deepEqual(latinas.filter((f) => !lista?.includes(f)), []);
});

// ── El sello ─────────────────────────────────────────────────

test('el nombre de la caché y su huella están sellados', () => {
  const sello = JSON.parse(readFileSync(join(RAIZ, 'sw-precache.json'), 'utf8'));
  const { nombre } = leerSW();
  assert.equal(sello.cacheName, nombre, 'sw-precache.json y sw.js no coinciden en el nombre de la caché');
});

test('si cambió el contenido, cambió el nombre de la caché', () => {
  const sello = JSON.parse(readFileSync(join(RAIZ, 'sw-precache.json'), 'utf8'));
  assert.equal(
    huella(),
    sello.huella,
    'Cambió algo de lo que precachea el worker. Subí CACHE en sw.js (sdr-vN → sdr-vN+1) y corré ' +
      '`node tests/sellar-cache.js`. Sin eso, las tablets que ya lo tienen instalado no reciben el cambio.',
  );
});

// ── El comportamiento ────────────────────────────────────────

/** Una red que sirve todo lo precacheado con un cuerpo reconocible. */
function redCompleta(caida = []) {
  const { lista } = leerSW();
  const servidos = new Set(lista.map(url));
  return (u) => {
    if (caida.includes(u)) return respuesta({ url: u, status: 404 });
    if (!servidos.has(u)) throw new Error(`pidió algo fuera de la lista: ${u}`);
    return respuesta({ url: u, body: `contenido de ${u}` });
  };
}

test('después de instalar, la caché tiene TODA la lista', async () => {
  const sw = montarSW({ red: redCompleta() });
  await sw.instalar();
  const { lista, nombre } = leerSW();
  const caché = sw.almacenes.get(nombre);
  assert.ok(caché, `no se creó la caché «${nombre}»`);
  const faltan = lista.map(url).filter((u) => !caché.has(u));
  assert.deepEqual(faltan, []);
});

test('A-04: con UNA sola visita (solo instalar), sin red el juego arranca', async () => {
  const sw = montarSW({ red: redCompleta() });
  await sw.instalar();
  await sw.activar();

  // Se cae el wifi: el worker responde solo desde lo que dejó el install.
  const sinRed = montarSWConCache(sw);
  for (const rel of ['js/main.js', 'js/engine/state.js', 'css/main.css', 'js/error-banner-inicial.js']) {
    const { valor, error } = await sinRed.pedir(peticion(url(rel)));
    assert.equal(error, null, rel);
    assert.equal(valor.status, 200, `${rel} → ${valor.status}: la primera visita no dejó el archivo en la caché`);
    assert.match(valor.body, /contenido de/);
  }
  const portada = await sinRed.pedir(peticion(ORIGEN, { mode: 'navigate' }));
  assert.equal(portada.valor.status, 200);
});

/** Un worker nuevo, sin red, sobre la caché que dejó el install del anterior. */
function montarSWConCache(swAnterior) {
  const { nombre } = leerSW();
  const guardado = Object.fromEntries(swAnterior.almacenes.get(nombre));
  return montarSW({ red: () => { throw new Error('sin red'); }, guardado });
}

test('un archivo que no se pudo bajar no impide instalar el resto', async () => {
  const roto = url('img/eventos/justicia-1.jpg');
  const sw = montarSW({ red: redCompleta([roto]) });
  await assert.doesNotReject(() => sw.instalar());
  const { lista, nombre } = leerSW();
  const caché = sw.almacenes.get(nombre);
  assert.equal(caché.has(roto), false, 'una respuesta 404 no se guarda: congelaría el error');
  assert.equal(caché.size, lista.length - 1, 'el resto sí tiene que quedar guardado');
});

test('si la red está caída del todo, instalar no revienta', async () => {
  const sw = montarSW({ red: () => { throw new Error('sin red'); } });
  await assert.doesNotReject(() => sw.instalar());
});

test('al activar se borran las cachés de versiones anteriores', async () => {
  const sw = montarSW({ red: redCompleta() });
  await sw.instalar();
  sw.almacenes.set('sdr-v1-vieja', new Map([['x', 1]]));
  await sw.activar();
  assert.ok(!sw.almacenes.has('sdr-v1-vieja'));
  assert.ok(sw.almacenes.has(leerSW().nombre));
});

test('el aviso de «sin conexión» no promete más de lo que cumple', () => {
  const { src } = leerSW();
  assert.ok(!/a partir de ahí funciona sin conexión/.test(src), 'sigue prometiendo offline tras una sola visita sin garantizarlo');
});

test('sw-precache.json es JSON válido con las tres claves', () => {
  const sello = JSON.parse(readFileSync(join(RAIZ, 'sw-precache.json'), 'utf8'));
  for (const k of ['cacheName', 'huella', 'archivos']) assert.ok(k in sello, k);
  assert.equal(sello.archivos, leerSW().lista.length);
  assert.ok(readdirSync(RAIZ).includes('sw-precache.json'));
});
