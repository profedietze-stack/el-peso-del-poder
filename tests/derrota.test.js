// La pantalla de derrota (revisada en Chromium con una partida perdida por confianza).
//
//   · con 33 puntos en Normal, quien PERDIÓ veía «DIPLOMA DE BRONCE» con medalla de bronce
//     (el diploma se calculaba solo con el puntaje) y debajo el título «Mandato Interrumpido»;
//   · el motivo de la derrota solo salía en la ventana roja y no volvía a aparecer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { textosDiploma, motivoDeDerrota } from '../js/ui/end-texto.js';
import { getDiploma } from '../js/engine/scoring.js';

const leer = (r) => readFileSync(fileURLToPath(new URL(`../${r}`, import.meta.url)), 'utf8');

test('quien perdió no recibe diploma, aunque su puntaje alcance para bronce', () => {
  const puntaje = 33;
  assert.equal(getDiploma(puntaje, 'normal'), 'bronze', 'el escenario: 33 puntos en Normal da bronce por puntaje');
  const t = textosDiploma({ won: false, lost: true }, getDiploma(puntaje, 'normal'));
  assert.equal(t.medal, '📜');
  assert.equal(t.title, 'Mandato Interrumpido');
  assert.ok(!/DIPLOMA/.test(t.tipo), t.tipo);
  assert.equal(t.clase, 'none');
});

test('quien terminó el mandato recibe el diploma que le corresponde', () => {
  const casos = [
    ['gold', '🥇', 'DIPLOMA DE ORO', 'Estadista Excepcional'],
    ['silver', '🥈', 'DIPLOMA DE PLATA', 'Gobierno Sólido'],
    ['bronze', '🥉', 'DIPLOMA DE BRONCE', 'Gestión Regular'],
    [null, '📜', 'GESTIÓN CRITICADA', 'Mandato Difícil'],
  ];
  for (const [d, medal, tipo, title] of casos) {
    const t = textosDiploma({ won: true }, d);
    assert.deepEqual([t.medal, t.tipo, t.title], [medal, tipo, title], String(d));
  }
});

test('en el segundo mandato el rótulo lo dice', () => {
  assert.equal(textosDiploma({ won: true, isSecondTerm: true }, 'gold').tipo, '2do MANDATO · DIPLOMA DE ORO');
});

test('el motivo de la derrota aparece con el mes en que pasó', () => {
  const h = motivoDeDerrota({ lost: true, lostReason: 'La confianza ciudadana llegó a 2%. El pueblo exige tu renuncia.', turn: 20 });
  assert.match(h, /Por qué terminó tu mandato/);
  assert.match(h, /La confianza ciudadana llegó a 2%/);
  assert.match(h, /mes 20 de 48/);
});

test('sin derrota o sin motivo no se dibuja nada', () => {
  assert.equal(motivoDeDerrota({ won: true }), '');
  assert.equal(motivoDeDerrota({ lost: true }), '');
  assert.equal(motivoDeDerrota({ lost: false, lostReason: 'x' }), '');
  assert.equal(motivoDeDerrota(undefined), '');
});

test('el motivo se escapa: nada de HTML llega a la pantalla', () => {
  const h = motivoDeDerrota({ lost: true, lostReason: '<img src=x onerror=alert(1)>', turn: 3 });
  assert.ok(!/<img/.test(h));
  assert.match(h, /&lt;img/);
});

test('endscreen.js usa estas funciones y ya no calcula el diploma a mano', () => {
  const src = leer('js/ui/endscreen.js');
  assert.match(src, /textosDiploma\(state, diploma\)/);
  assert.match(src, /motivoDeDerrota\(state\)/);
  assert.ok(!/const medals = /.test(src), 'quedó la tabla de medallas vieja');
});

test('la diapositiva «Tu gestión» es donde está el motivo', () => {
  const html = leer('index.html');
  const ini = html.indexOf('id="end-slide-gestion"');
  const fin = html.indexOf('id="end-slide-eleccion"');
  assert.match(html.slice(ini, fin), /id="analysis-text"/);
});
