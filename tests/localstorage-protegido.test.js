// Todo acceso a localStorage va dentro de un try/catch (checklist §6.3).
//
// En una tablet con el almacenamiento bloqueado (modo privado, política de la escuela,
// cuota llena) `localStorage` no devuelve null: LANZA. Un acceso suelto en el nivel
// superior de un módulo tira el módulo entero, y con él el juego: pantalla muerta.
// Un acceso suelto dentro de una función tira solo esa función, pero igual rompe el
// botón que la llamó. Este barrido recorre js/ con un glob, no una lista a mano.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../js', import.meta.url));

function archivos(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    const ruta = join(dir, n);
    if (statSync(ruta).isDirectory()) archivos(ruta, acc);
    else if (n.endsWith('.js')) acc.push(ruta);
  }
  return acc;
}

/** Las líneas con un acceso a localStorage/sessionStorage que no están dentro de un try. */
function sueltos(texto) {
  const lineas = texto.split(/\r?\n/);
  const malos = [];
  lineas.forEach((l, i) => {
    if (/^\s*(\*|\/\*|\/\/)/.test(l)) return; // comentario / JSDoc
    const codigo = l.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    if (!/\b(localStorage|sessionStorage)\s*\./.test(codigo)) return;
    // ¿hay un `try` abierto antes de esta línea que todavía no se cerró con su catch?
    let abiertos = 0;
    for (let j = i; j >= 0 && j > i - 12; j--) {
      const c = lineas[j].replace(/\/\/.*$/, '');
      if (/\btry\s*\{/.test(c) && !/\}\s*catch/.test(c.slice(c.search(/\btry\s*\{/)).replace(/^try\s*\{/, ''))) { abiertos++; break; }
      if (/\btry\s*\{[^}]*\}\s*catch/.test(c) && j === i) { abiertos++; break; }
    }
    if (!abiertos) malos.push(`${i + 1}: ${l.trim().slice(0, 90)}`);
  });
  return malos;
}

test('ningún acceso a localStorage queda fuera de un try/catch', () => {
  const hallazgos = [];
  for (const ruta of archivos(RAIZ)) {
    for (const m of sueltos(readFileSync(ruta, 'utf8'))) hallazgos.push(`${ruta.slice(RAIZ.length - 2)}:${m}`);
  }
  assert.deepEqual(hallazgos, [], `\n${hallazgos.join('\n')}\n`);
});

test('el detector de accesos sueltos funciona', () => {
  assert.equal(sueltos("const a = localStorage.getItem('x');").length, 1);
  assert.equal(sueltos(' * Guarda en localStorage. Fin.').length, 0, 'un comentario no cuenta');
  assert.equal(sueltos("try { const a = localStorage.getItem('x'); } catch (_) {}").length, 0);
  assert.equal(sueltos("try {\n  localStorage.setItem('a','b');\n} catch (_) {}").length, 0);
  assert.equal(sueltos("function f() {\n  localStorage.removeItem('k');\n}").length, 1);
});
