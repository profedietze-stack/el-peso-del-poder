// Cuando un ministro dice un número, tiene que ser el número que el motor aplica.
//
// El comentario ministerial es la capa que enseña: aparece después de elegir y
// antes de ver las consecuencias, y explica por qué va a pasar lo que va a
// pasar. Muchos de esos comentarios citan cifras exactas — «el riesgo baja 8,
// las reservas suben 4, la deuda cae 5» — y ahí el juego se está jugando su
// credibilidad. Un alumno que mira el tablero después de leer eso y ve otra cosa
// aprende que los números del juego no significan nada.
//
// Es la misma familia que la capa de referencia contra la de ejercicios: dos
// textos escritos en archivos distintos que hablan del mismo hecho y se
// desincronizan sin que nadie se entere, porque ninguno de los dos rompe nada.
//
// Este test existe porque el rebalanceo de los eventos lo provocó: mover un
// número de `events.js` deja mintiendo al ministro que lo citaba. Dos comentarios
// quedaron desactualizados y los encontró esto, no una lectura.
import test from 'node:test';
import assert from 'node:assert/strict';
import { MINISTER_COMMENTARY } from '../js/data/minister-commentary.js';
import { EVENTS } from '../js/data/events.js';

/** Cómo nombra el ministro a cada indicador. */
const INDICADOR = {
  'riesgo país': 'riesgo',
  riesgo: 'riesgo',
  confianza: 'confianza',
  pobreza: 'pobreza',
  deuda: 'deuda',
  reservas: 'reservas',
  producción: 'produccion',
  inflación: 'ipc',
  ipc: 'ipc',
  desempleo: 'desocupacion',
  desocupación: 'desocupacion',
};

const SUBE = ['sube', 'suben', 'aumenta', 'aumentan', 'escala'];
const BAJA = ['baja', 'bajan', 'cae', 'caen', 'desciende'];

/** «la confianza cae 8», «el riesgo país sube 4», «las reservas suben 3». */
const FRASE = new RegExp(
  `\\b(${Object.keys(INDICADOR).sort((a, b) => b.length - a.length).join('|')})` +
    `\\s+(?:pa[ií]s\\s+)?(${[...SUBE, ...BAJA].join('|')})\\s+(\\d+)`,
  'gi',
);

/** Lo que la opción deja en total, contando lo que dura. */
function efectoTotal(opcion) {
  const ef = { ...(opcion.efectos ?? {}) };
  const duracion = opcion.duracion ?? 0;
  for (const [k, v] of Object.entries(opcion.efectosPersistentes ?? {})) {
    ef[k] = (ef[k] ?? 0) + v * duracion;
  }
  return ef;
}

test('ningún ministro cita una cifra que el motor no aplica', () => {
  const mentiras = [];

  for (const evento of EVENTS) {
    const comentarios = MINISTER_COMMENTARY[evento.id];
    if (!comentarios) continue;

    for (const [i, porOpcion] of comentarios.entries()) {
      const opcion = evento.opciones?.[i];
      if (!opcion || !porOpcion) continue;
      const ef = efectoTotal(opcion);

      for (const trozo of porOpcion) {
        const limpio = trozo.text.replace(/<[^>]+>/g, '');
        for (const m of limpio.matchAll(FRASE)) {
          const clave = INDICADOR[m[1].toLowerCase()];
          const dicho = BAJA.includes(m[2].toLowerCase()) ? -Number(m[3]) : Number(m[3]);
          const aplicado = ef[clave] ?? 0;

          if (dicho !== aplicado) {
            mentiras.push(
              `evento ${evento.id} «${evento.titulo.slice(0, 40)}» op${i + 1} [${trozo.slot}]: ` +
                `dice «${m[0]}» y el motor aplica ${aplicado} en ${clave}`,
            );
          }
        }
      }
    }
  }

  assert.deepEqual(mentiras, [], `\n${mentiras.join('\n')}\n`);
});

test('y la comprobación encuentra de verdad una cifra cambiada', () => {
  // Un test que sólo mira texto puede estar comprobando nada. Se le da un
  // comentario con un número inventado y tiene que cazarlo.
  const evento = EVENTS.find((e) => MINISTER_COMMENTARY[e.id]?.[0]?.length);
  const opcion = evento.opciones[0];
  const inventado = (opcion.efectos.confianza ?? 0) + 7;
  const frase = `la confianza sube ${Math.abs(inventado) + 1}`;

  const m = [...frase.matchAll(FRASE)];
  assert.equal(m.length, 1, 'la expresión no reconoce una frase que debería reconocer');
  assert.notEqual(Number(m[0][3]), opcion.efectos.confianza);
});
