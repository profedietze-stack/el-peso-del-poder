// Decisiones con costo de capital político propio (segunda tanda, acordada con el docente).
//
// La fórmula deriva el capital de la confianza y de lo ambiciosa que es la medida. En doce
// decisiones eso da un número que no cuenta la historia política: una reforma que necesita
// votos del Congreso puede subir la confianza y aun así gastar capital; un pacto con la
// oposición devuelve respaldo aunque casi no mueva la confianza. Ahí el campo `capital` de la
// opción pisa la fórmula.
import test from 'node:test';
import assert from 'node:assert/strict';

import { EVENTS } from '../js/data/events.js';
import { variacionDeOpcion, CAPITAL } from '../js/engine/capital.js';

// [id del evento, índice de la opción, capital, fragmento del texto (para no pisar otra opción)]
const ACORDADAS = [
  [9, 0, -12, 'Reforma progresiva completa'],
  [84, 0, -12, 'Reforma integral con amplia consulta'],
  [75, 0, -8, 'Ley de Igualdad Salarial'],
  [69, 0, -6, 'Multa máxima y reforma'],
  [109, 0, -20, 'Aceptar el ajuste completo'],
  [108, 1, -8, 'Gobernar en minoría'],
  [100, 2, -6, 'Rechazar el acuerdo'],
  [100, 0, 10, 'Firmar el Gran Acuerdo'],
  [42, 1, 6, 'Acuerdo político'],
  [108, 3, 6, 'Consulta popular'],
  [8, 1, 5, 'Mesa de diálogo nacional'],
  [76, 2, 3, 'Aceptar el proyecto opositor'],
];

const evento = (id) => EVENTS.find((e) => e.id === id);

test('cada decisión acordada tiene el capital acordado', () => {
  for (const [id, i, valor, fragmento] of ACORDADAS) {
    const o = evento(id)?.opciones[i];
    assert.ok(o, `evento ${id} opción ${i} no existe`);
    assert.ok(o.texto.includes(fragmento), `evento ${id}.${i} ya no es «${fragmento}»: «${o.texto.slice(0, 60)}»`);
    assert.equal(o.capital, valor, `evento ${id}.${i}`);
  }
});

test('ninguna otra opción del juego trae `capital`: lo que no está acordado usa la fórmula', () => {
  const acordadas = new Set(ACORDADAS.map(([id, i]) => `${id}.${i}`));
  const sueltas = [];
  for (const e of EVENTS) {
    e.opciones.forEach((o, i) => {
      if (o.capital !== undefined && !acordadas.has(`${e.id}.${i}`)) sueltas.push(`${e.id}.${i}`);
    });
  }
  assert.deepEqual(sueltas, []);
});

test('el valor es un entero razonable (nunca un −100 que deje la partida sin capital)', () => {
  for (const e of EVENTS) {
    for (const o of e.opciones) {
      if (o.capital === undefined) continue;
      assert.ok(Number.isInteger(o.capital), `evento ${e.id}`);
      assert.ok(o.capital >= -25 && o.capital <= 15, `evento ${e.id}: ${o.capital}`);
    }
  }
});

test('el campo pisa la fórmula: el Gran Acuerdo devuelve capital aunque sea una medida grande', () => {
  const firmar = evento(100).opciones[0];
  const sinCampo = { ...firmar };
  delete sinCampo.capital;
  assert.ok(variacionDeOpcion(sinCampo, 'amplio') < 0, 'sin el campo, la fórmula lo cobraba como reforma ambiciosa');
  assert.equal(variacionDeOpcion(firmar, 'amplio'), 10);
  assert.equal(variacionDeOpcion(firmar, 'ajustado'), Math.round(10 * CAPITAL.MULT_AJUSTADO));
  assert.equal(variacionDeOpcion(evento(109).opciones[0], 'ajustado'), -20, 'lo que se gasta no cambia con el mandato');
});

test('la dirección es la política: reformas y confrontación gastan, pactos y consensos devuelven', () => {
  const gastan = ACORDADAS.filter(([, , v]) => v < 0).map(([id, i]) => [id, i].join('.')).sort();
  assert.deepEqual(gastan, ['100.2', '108.1', '109.0', '69.0', '75.0', '84.0', '9.0'].sort());
  const devuelven = ACORDADAS.filter(([, , v]) => v > 0).map(([id, i]) => [id, i].join('.')).sort();
  assert.deepEqual(devuelven, ['100.0', '108.3', '42.1', '76.2', '8.1'].sort());
});
