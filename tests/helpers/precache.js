// Qué precachea el service worker, y cómo se sella.
//
// La lista se arma recorriendo el disco, no a mano: una lista escrita a mano es la
// que se olvida del módulo nuevo, y un módulo que falta en la caché es una pantalla
// en negro sin conexión. El test compara esta lista contra la que dice `sw.js`.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const RAIZ = fileURLToPath(new URL('../..', import.meta.url));

const TEXTO = new Set(['.js', '.css', '.json', '.svg', '.html']);

function archivos(dir, filtro, acc = []) {
  for (const nombre of readdirSync(join(RAIZ, dir)).sort()) {
    const rel = `${dir}/${nombre}`;
    if (statSync(join(RAIZ, rel)).isDirectory()) archivos(rel, filtro, acc);
    else if (filtro(rel)) acc.push(rel);
  }
  return acc;
}

/**
 * Todo lo que el juego necesita para abrir y jugarse sin conexión, relativo a la
 * raíz del sitio. './' es la portada.
 */
export function listarPrecache() {
  return [
    './',
    'index.html',
    'manifest.json',
    'icon.svg',
    ...archivos('css', (r) => r.endsWith('.css')),
    ...archivos('js', (r) => r.endsWith('.js')),
    // De las tipografías, solo los subconjuntos latinos: es lo que el castellano usa.
    ...archivos('fonts', (r) => r.endsWith('-latin.woff2')),
    ...archivos('img/avatares', (r) => r.endsWith('.svg')),
    ...archivos('img/eventos', (r) => r.endsWith('.jpg')),
    'vendor/html2canvas.min.js',
  ];
}

/** El contenido de un archivo, con los saltos de línea normalizados: un checkout en Windows no cambia la huella. */
function contenido(rel) {
  const crudo = readFileSync(join(RAIZ, rel));
  if (!TEXTO.has(extname(rel))) return crudo;
  return Buffer.from(crudo.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
}

/** SHA-256 de la lista y del contenido de cada archivo que precachea. */
export function huella(lista = listarPrecache()) {
  const h = createHash('sha256');
  for (const rel of lista) {
    h.update(`${rel}\n`);
    if (rel === './') {
      h.update(contenido('index.html'));
    } else {
      h.update(contenido(rel));
    }
    h.update('\n');
  }
  return h.digest('hex');
}

/** Lo que `sw.js` declara: el nombre de la caché y la lista PRECACHE. */
export function leerSW() {
  const src = readFileSync(join(RAIZ, 'sw.js'), 'utf8');
  const nombre = src.match(/const CACHE = '([^']+)'/)?.[1] ?? null;
  const bloque = src.match(/\/\/ PRECACHE:INICIO\r?\n([\s\S]*?)\/\/ PRECACHE:FIN/)?.[1] ?? null;
  const lista = bloque ? JSON.parse(bloque.replace(/^const PRECACHE = /, '').replace(/;\s*$/, '')) : null;
  return { src, nombre, lista };
}
