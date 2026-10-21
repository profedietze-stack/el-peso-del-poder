// México, Colombia y Chile no permiten la reelección inmediata: no hay segundo mandato.
import test from 'node:test';
import assert from 'node:assert/strict';

import { aplicarReglas, notaDeMandato } from '../js/engine/mandato.js';
import { diapositivasVisibles } from '../js/ui/end-slides.js';
import { ACHIEVEMENTS, logrosVisibles, checkAchievements, IDS_DE_REELECCION } from '../js/data/achievements.js';

test.afterEach(() => aplicarReglas('ar'));

const ganador = { won: true, isSecondTerm: false };

test('sin segundo mandato la pantalla final tiene tres diapositivas, sin la de elecciones', () => {
  for (const id of ['mx', 'co', 'cl']) {
    aplicarReglas(id);
    assert.deepEqual(diapositivasVisibles(ganador), ['diploma', 'gestion', 'informe'], id);
  }
});

test('con Argentina y Latinoamérica sigue la diapositiva de elecciones', () => {
  for (const id of ['ar', 'latam']) {
    aplicarReglas(id);
    assert.deepEqual(diapositivasVisibles(ganador), ['diploma', 'gestion', 'eleccion', 'informe'], id);
  }
});

test('los logros de reelección y segundo mandato son cinco y solo faltan donde no hay reelección', () => {
  assert.equal(IDS_DE_REELECCION.length, 5);
  aplicarReglas('ar');
  assert.equal(logrosVisibles().length, ACHIEVEMENTS.length);
  aplicarReglas('co');
  const visibles = logrosVisibles();
  assert.equal(visibles.length, ACHIEVEMENTS.length - 5);
  for (const id of IDS_DE_REELECCION) assert.ok(!visibles.some((a) => a.id === id), id);
});

test('un logro de reelección ya ganado en otro país sigue visible como ganado, y cuenta', () => {
  aplicarReglas('co');
  const id = IDS_DE_REELECCION[0];
  assert.ok(!logrosVisibles([]).some((a) => a.id === id));
  assert.ok(logrosVisibles([id]).some((a) => a.id === id));
  assert.equal(logrosVisibles([id]).length, ACHIEVEMENTS.length - 4);
});

test('sin reelección nadie desbloquea un logro de reelección, aunque el estado lo pida', () => {
  aplicarReglas('mx');
  const falso = { won: true, isSecondTerm: false, reelection: { reelected: true, pct: 90 }, indicadores: {}, adata: {}, history: [], difficulty: 'normal' };
  const desbloqueados = checkAchievements(falso, { getScore: () => 90, getZone: () => 'ok', IND_META: [] });
  for (const id of IDS_DE_REELECCION) assert.ok(!desbloqueados.includes(id), id);
});

test('cada país sin reelección explica su regla y dice el mandato que dura', () => {
  aplicarReglas('mx');
  assert.match(notaDeMandato(), /México.*seis años.*reelección/);
  aplicarReglas('co');
  assert.match(notaDeMandato(), /Colombia.*cuatro años.*reelección/);
  aplicarReglas('cl');
  assert.match(notaDeMandato(), /Chile.*cuatro años.*reelección inmediata/);
  aplicarReglas('ar');
  assert.equal(notaDeMandato(), '');
  aplicarReglas('latam');
  assert.equal(notaDeMandato(), '');
});
