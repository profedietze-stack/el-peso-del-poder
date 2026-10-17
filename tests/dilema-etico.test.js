// El dilema ético se descubre al decidir, no antes (auditoría de octubre, D-06).
//
// Las 11 opciones corruptas del banco llevaban un cartel «⚠️ Riesgo ético» en el propio
// botón. Un juego cuya tesis es que gobernar es elegir entre costos le avisaba al
// alumno cuál era la opción «mala» antes de que tuviera que pensarlo: la decisión
// moral pasaba a ser un filtro visual. El efecto se ve después: en el cartel de
// consecuencias, en el historial y en el informe final.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const leer = (ruta) => readFileSync(fileURLToPath(new URL(`../${ruta}`, import.meta.url)), 'utf8');
const sinComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '');

test('los botones de opción no marcan cuál es la opción corrupta', () => {
  const src = sinComentarios(leer('js/ui/event.js'));
  assert.ok(!/corrupt-badge|Riesgo ético|opt\.corrupta/.test(src), 'event.js todavía adelanta la marca');
});

test('la consecuencia ética sigue apareciendo DESPUÉS de decidir', () => {
  // El cartel de consecuencias, el historial y el informe final siguen leyendo `corrupta`.
  assert.match(leer('js/ui/modals.js'), /option\.corrupta/);
  assert.match(leer('js/ui/trophies-ui.js'), /\.corrupta/);
  assert.match(leer('js/ui/endscreen.js'), /neverCorrupt/);
});

test('el logro de transparencia no habla de opciones «marcadas»', () => {
  const src = leer('js/data/achievements.js');
  assert.ok(!/opci[oó]n marcada como corrupta/.test(src), 'ya no hay marca visible antes de decidir');
});
