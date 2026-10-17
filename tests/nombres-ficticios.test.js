// Las sugerencias de nombre no son políticos ni partidos reales (auditoría de octubre, P-06).
//
// La pantalla de identidad sugería 28 presidentes reales de la región (algunos en
// ejercicio) y 22 partidos reales. En un aula eso invita a «jugar como X», y los
// compañeros leen la partida en clave partidaria: el juego deja de ser un simulador
// y pasa a ser una opinión sobre una persona o un partido concreto. Las sugerencias
// ahora son ficticias.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildPresidentDatalist, buildPartyDatalist } from '../js/ui/identity-ui.js';
import { limpiarNombre } from '../js/engine/texto.js';

const opciones = (html) => [...html.matchAll(/<option value="([^"]+)">/g)].map((m) => m[1]);
const presidentes = opciones(buildPresidentDatalist());
const partidos = opciones(buildPartyDatalist());

// Quienes figuraban antes, más otros que no deberían aparecer.
const PERSONAS_REALES = [
  'allende', 'chávez', 'chavez', 'cristina', 'lula', 'da silva', 'evo morales', 'correa', 'bachelet',
  'obrador', 'boric', 'petro', 'kirchner', 'menem', 'alberto fernández', 'milei', 'bukele', 'lacalle',
  'uribe', 'vizcarra', 'pedro castillo', 'juárez', 'bolívar', 'san martín', 'ortega', 'torrijos',
  'rousseff', 'perón', 'chamorro', 'moscoso', 'macri', 'bolsonaro', 'maduro', 'castro', 'fujimori',
  'mujica', 'piñera', 'lagos', 'noboa', 'arce', 'sheinbaum',
];
const PARTIDOS_REALES = [
  'justicialista', 'peronismo', 'frente amplio', 'morena', 'acción nacional', '(pan)', '(udi)', 'psuv',
  'movimiento al socialismo', 'renovación nacional', 'propuesta republicana', 'libertad avanza',
  'partido colorado', 'partido nacional', 'fuerza popular', 'pacto histórico', 'fsln', 'sandinista',
  'partido comunista', '(pri)', 'cambio democrático', 'convergencia nacional', 'alianza país',
  'partido de los trabajadores', '(pt)', 'partido socialista', 'unión cívica', 'radical',
];

test('hay una buena cantidad de sugerencias', () => {
  assert.ok(presidentes.length >= 20, `${presidentes.length} presidentes`);
  assert.ok(partidos.length >= 15, `${partidos.length} partidos`);
});

test('ningún presidente sugerido es una persona real conocida', () => {
  // Por palabra entera: «arce» no puede saltar con «Marcela».
  const enNombre = (n, r) => new RegExp(String.raw`(^|[^\p{L}])${r}([^\p{L}]|$)`, 'iu').test(n);
  const reales = presidentes.filter((n) => PERSONAS_REALES.some((r) => enNombre(n, r)));
  assert.deepEqual(reales, []);
});

test('ningún partido sugerido es un partido real', () => {
  const reales = partidos.filter((n) => PARTIDOS_REALES.some((r) => n.toLowerCase().includes(r)));
  assert.deepEqual(reales, []);
});

test('no hay sugerencias repetidas y todas son nombres válidos', () => {
  for (const lista of [presidentes, partidos]) {
    assert.equal(new Set(lista.map((n) => n.toLowerCase())).size, lista.length, 'repetidas');
    for (const n of lista) assert.equal(limpiarNombre(n), n, `«${n}» no sobrevive a limpiarNombre`);
  }
});

test('lo que se ve en pantalla sale de esas listas: index.html no trae las suyas', () => {
  // Las sugerencias que ve el alumno son las del <datalist> de la página. Este test
  // existió primero sobre las funciones de JS... que nadie llamaba, mientras index.html
  // seguía sugiriendo a los 28 políticos reales. Se mira lo que realmente se muestra.
  const html = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');
  for (const id of ['dl-presidents', 'dl-parties']) {
    const bloque = html.match(new RegExp(String.raw`<datalist id="${id}">([\s\S]*?)</datalist>`))?.[1] ?? null;
    assert.notEqual(bloque, null, `no está el datalist ${id}`);
    assert.ok(!/<option/.test(bloque), `${id} trae opciones propias en index.html`);
  }
  const todo = html.toLowerCase();
  for (const real of ['milei', 'chávez', 'bukele', 'peronismo', 'psuv']) {
    assert.ok(!todo.includes(real), `index.html todavía nombra a «${real}»`);
  }
});

test('la pantalla de identidad llena los datalist al mostrarse', () => {
  const src = readFileSync(fileURLToPath(new URL('../js/ui/identity-ui.js', import.meta.url)), 'utf8');
  assert.match(src, /_llenarSugerencias\(\)/);
  assert.match(src, /getElementById\(id\)[\s\S]*?innerHTML/);
});
