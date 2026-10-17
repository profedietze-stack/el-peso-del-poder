// Re-sella el service worker: regenera la lista PRECACHE de sw.js recorriendo el
// disco y guarda la huella del contenido en sw-precache.json.
//
//   flujo:  editar algo → subir CACHE en sw.js (sdr-vN → sdr-vN+1) → node tests/sellar-cache.js
//
// Se niega a sellar si cambió el contenido y el nombre de la caché sigue igual:
// ése es justo el olvido que deja a las tablets con una versión vieja para siempre.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { listarPrecache, huella, leerSW, RAIZ } from './helpers/precache.js';

const rutaSW = join(RAIZ, 'sw.js');
const rutaSello = join(RAIZ, 'sw-precache.json');

const lista = listarPrecache();
const bloque = `// PRECACHE:INICIO\nconst PRECACHE = ${JSON.stringify(lista, null, 2)};\n// PRECACHE:FIN`;

let src = readFileSync(rutaSW, 'utf8');
const nl = src.includes('\r\n') ? '\r\n' : '\n';
const re = /\/\/ PRECACHE:INICIO\r?\n[\s\S]*?\/\/ PRECACHE:FIN/;
if (!re.test(src)) {
  console.error('sw.js no tiene el bloque // PRECACHE:INICIO … // PRECACHE:FIN');
  process.exit(1);
}
src = src.replace(re, bloque.replace(/\n/g, nl));
writeFileSync(rutaSW, src);

const { nombre } = leerSW();
const nueva = huella(lista);
if (existsSync(rutaSello)) {
  const previo = JSON.parse(readFileSync(rutaSello, 'utf8'));
  if (previo.cacheName === nombre && previo.huella !== nueva) {
    console.error(
      `Cambió el contenido pero CACHE sigue siendo «${nombre}».\n` +
        'Subí el número en sw.js (const CACHE = …) y volvé a correr este script.',
    );
    process.exit(1);
  }
}
writeFileSync(rutaSello, JSON.stringify({ cacheName: nombre, huella: nueva, archivos: lista.length }, null, 2) + '\n');
console.log(`sellado: ${nombre} · ${lista.length} archivos · ${nueva.slice(0, 12)}…`);
