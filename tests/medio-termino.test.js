// Elecciones de medio mandato: legislativas donde las hay (Argentina, México) y
// regionales y locales donde no (Colombia, Chile).
import test from 'node:test';
import assert from 'node:assert/strict';

import { aplicarReglas } from '../js/engine/mandato.js';
import { buildWarningEvent, resultadoDelMedioTermino, noticiasDeMedioTermino } from '../js/features/midterm.js';

test.afterEach(() => aplicarReglas('ar'));

const textosDe = () => {
  const aviso = buildWarningEvent();
  return [
    aviso.titulo, aviso.descripcion,
    ...[true, false].flatMap((gano) => {
      const r = resultadoDelMedioTermino(gano);
      const n = noticiasDeMedioTermino(gano, 'Pérez', 'Partido Nuevo');
      return [r.titulo, r.subtitulo, r.desc, ...n.flatMap((x) => [x.headline, x.body])];
    }),
  ];
};

test('Argentina, Latinoamérica y México: elecciones legislativas, con los textos de siempre', () => {
  for (const id of ['ar', 'latam', 'mx']) {
    aplicarReglas(id);
    assert.equal(buildWarningEvent().titulo, 'Elecciones Legislativas — Faltan 2 Meses', id);
    assert.match(buildWarningEvent().descripcion, /renovarán la mitad del Congreso/, id);
    assert.equal(resultadoDelMedioTermino(true).titulo, '🗳️ ¡Victoria Legislativa!', id);
    assert.equal(resultadoDelMedioTermino(false).subtitulo, 'La oposición tomó el control del Congreso', id);
    assert.equal(noticiasDeMedioTermino(true, 'Pérez', 'Partido Nuevo')[0].headline, 'Pérez triunfa en las legislativas: el oficialismo retiene la mayoría', id);
    assert.equal(noticiasDeMedioTermino(false, 'Pérez', 'Partido Nuevo')[1].headline, 'Congreso opositor: el mandato de Pérez entra en una zona de alta turbulencia', id);
  }
});

test('Colombia y Chile: no hay legislativas a mitad de mandato, hay elecciones regionales y locales', () => {
  for (const id of ['co', 'cl']) {
    aplicarReglas(id);
    for (const t of textosDe()) assert.doesNotMatch(t, /legislativ|Congreso|parlament|bancas/i, `${id}: «${t.slice(0, 70)}»`);
  }
  aplicarReglas('co');
  assert.match(buildWarningEvent().descripcion, /gobernaciones y alcaldías/);
  aplicarReglas('cl');
  assert.match(buildWarningEvent().titulo, /Municipales y Regionales/);
});

test('el resultado sigue teniendo los mismos efectos en todos los países (solo cambia el texto)', () => {
  const efectos = (gano) => JSON.stringify(resultadoDelMedioTermino(gano).efectos);
  aplicarReglas('ar');
  const ar = [efectos(true), efectos(false)];
  for (const id of ['co', 'cl', 'mx']) {
    aplicarReglas(id);
    assert.deepEqual([efectos(true), efectos(false)], ar, id);
  }
});

test('cada escenario trae las dos noticias de victoria y las dos de derrota', () => {
  for (const id of ['ar', 'co', 'cl']) {
    aplicarReglas(id);
    assert.equal(noticiasDeMedioTermino(true, 'A', 'B').length, 2, id);
    assert.equal(noticiasDeMedioTermino(false, 'A', 'B').length, 2, id);
  }
});
