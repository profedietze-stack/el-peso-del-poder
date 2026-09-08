// El juego no le pide nada a un servidor ajeno.
//
// Los que lo abren son menores. Cada recurso traido de afuera le cuenta a un
// tercero la IP del aula, la hora y que se estaba mirando — y no hace falta que
// ese tercero guarde nada para que el dato ya haya salido. Aca era peor que una
// peticion al abrir: era **una por evento y una por ministro**, asi que el
// tercero no se enteraba de que alguien jugo, se enteraba de que decision estaba
// leyendo y a que ministro tenia en pantalla.
//
// Y hay un motivo que se nota el mismo dia: el wifi de una escuela se cae y el
// filtro de contenidos bloquea dominios. Sin internet, el juego se quedaba sin
// caras, sin imagenes de evento y sin tipografia.
//
// Lo que habia, contado:
//
//   picsum.photos        140  (8 vivas en crisis-auto, 130 en un campo muerto)
//   api.dicebear.com       9  (las 16 caras de ministros y vice, y un respaldo)
//   images.unsplash.com    4  (28 fotos de evento por 2 constantes, mas midterm)
//   fonts.googleapis.com   2
//   cdn.jsdelivr.net       2  (html2canvas, para compartir la captura final)
//
// Se recorren los archivos como texto porque el juego no tiene empaquetador:
// son modulos ES sueltos servidos tal cual, asi que lo que dice el archivo es
// exactamente lo que pide el navegador.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

/** Todos los archivos que el navegador llega a leer. */
function archivosDelSitio(dir = RAIZ, acc = []) {
  for (const nombre of readdirSync(dir)) {
    // `herramientas/` no es el juego: son paginas de apoyo que no se enlazan desde
    // ningun lado y que un alumno no abre. Se deja fuera para que la regla hable de lo
    // que el juego sirve de verdad.
    if (['node_modules', '.git', 'tests', '.remember', 'herramientas', 'vendor'].includes(nombre)) continue;
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) archivosDelSitio(ruta, acc);
    else if (['.js', '.css', '.html', '.json'].includes(extname(nombre))) acc.push(ruta);
  }
  return acc;
}

/** Los origenes ajenos que un archivo nombra. */
function origenesAjenos(texto) {
  return [...texto.matchAll(/https?:\/\/[^\s"'`)]+/g)]
    .map((m) => m[0])
    // El espacio de nombres de un SVG es un identificador, no una descarga.
    .filter((u) => !u.startsWith('http://www.w3.org/'))
    .filter((u) => !u.startsWith('http://localhost'))
    // Enlaces que el jugador elige abrir no son recursos que el juego trae solo.
    .filter((u) => !u.includes('creativecommons.org/licenses'))
    .filter((u) => !u.includes('commons.wikimedia.org'));
}

test('ningun archivo del sitio trae un recurso de un servidor ajeno', () => {
  const hallazgos = [];
  for (const ruta of archivosDelSitio()) {
    const encontrados = origenesAjenos(readFileSync(ruta, 'utf8'));
    for (const u of encontrados) {
      hallazgos.push(`${ruta.slice(RAIZ.length)}: ${u.slice(0, 70)}`);
    }
  }
  assert.deepEqual(hallazgos, [], `\n  ${hallazgos.join('\n  ')}\n`);
});

// Las caras del gabinete, comprobadas contra el disco.
//
// Venian de api.dicebear.com y ahora son dieciseis SVG bajados una vez. Este test
// existe por lo que aparecio al bajarlos: dos de las cuatro vicepresidentas
// devolvian 400 porque `facialHairProbability` se mandaba dos veces —una en la
// lista base y otra en la sobreescritura de «sin barba»— y DiceBear rechaza el
// parametro repetido.
//
// Nunca se noto porque habia un respaldo que dibuja algo igual. Un fallo tapado por
// un respaldo es exactamente el que dura anios: la pantalla no queda vacia, solo
// deja de mostrar lo que alguien escribio.
test('cada ministro y cada vice tienen su cara en el repositorio', async () => {
  const { MINISTERS } = await import('../js/data/ministers.js');
  const { VICEPRESIDENTS } = await import('../js/data/vicepresident.js');
  const todos = [...MINISTERS, ...VICEPRESIDENTS];

  assert.equal(todos.length, 16);

  const rotos = [];
  for (const p of todos) {
    const ruta = join(RAIZ, p.avatarUrl);
    let svg = '';
    try { svg = readFileSync(ruta, 'utf8'); } catch { rotos.push(`${p.avatarUrl}: no existe`); continue; }
    // Un 400 de DiceBear se guarda como JSON y pesa poco: mirar sólo que el archivo
    // esté no alcanza, hay que ver que sea un SVG.
    if (!svg.includes('<svg')) rotos.push(`${p.avatarUrl}: no es un SVG (${svg.slice(0, 60)})`);
    if (svg.length < 800) rotos.push(`${p.avatarUrl}: demasiado corto (${svg.length} bytes)`);
  }
  assert.deepEqual(rotos, [], `\n  ${rotos.join('\n  ')}\n`);
});
