// La pantalla de trofeos mostraba el id crudo de la herencia («ortodoxo») porque su
// tabla de nombres era de una versión vieja del juego (neoliberal, tecnocrata,
// kirchnerismo) y no tenía ninguna de las cuatro herencias reales.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HERITAGE_PROFILES, nombreDeHerencia } from '../js/data/heritage.js';

test('cada herencia real tiene nombre legible, no su id', () => {
  for (const h of HERITAGE_PROFILES) {
    const n = nombreDeHerencia(h.id);
    assert.notEqual(n, h.id);
    assert.ok(n.includes(h.name), n);
  }
});

test('un id desconocido (partida de una versión vieja) no rompe', () => {
  assert.equal(nombreDeHerencia('kirchnerismo'), 'kirchnerismo');
});

test('la pantalla de trofeos usa nombreDeHerencia y no una tabla propia', () => {
  const src = readFileSync(fileURLToPath(new URL('../js/ui/trophies-ui.js', import.meta.url)), 'utf8');
  assert.ok(!/HERITAGE_NAMES/.test(src), 'quedó una tabla de nombres local');
  assert.match(src, /nombreDeHerencia\(/);
});
