// Ninguna decisión del juego puede tener una opción que nadie deba elegir.
//
// Una opción **dominada** es la que sale peor o igual en los ocho indicadores
// que alguna de sus compañeras. No es una mala decisión: es una decisión que no
// existe. El alumno que la compara nunca tiene motivo para elegirla, y el que no
// la compara está eligiendo a ciegas entre tres cosas de las que una es mejor en
// todo.
//
// Y es lo contrario de lo que el juego enseña. La tesis de El Peso del Poder es
// que gobernar es elegir entre costos: bajar la inflación cuesta empleo, pagar
// la deuda cuesta reservas, contentar al campo cuesta recaudación. Una opción
// que gana en los ocho indicadores dice que hay almuerzo gratis.
//
// Había 35 eventos con alguna, y cinco donde una sola opción ganaba en los ocho
// —o sea cinco eventos que no eran una decisión—. Se corrigieron con un criterio
// fijo, escrito aquí para que el que agregue eventos lo siga:
//
//   1. **Nunca se premia la opción mala para emparejar.** Minimizar una denuncia
//      de discriminación no puede volverse conveniente. Lo que se hace es
//      ponerle un costo real a la opción fuerte, que casi siempre existe y no
//      estaba contado.
//   2. **Cada opción tiene que ganar en algo, y ese algo tiene que ser cierto.**
//      Demoler el ex centro clandestino para construir la escuela baja la
//      pobreza — y cuesta trece puntos de confianza. Ése es el dilema, y ahora
//      está en los números.
//   3. **Los efectos que duran cuentan.** Una opción con `duracion` y
//      `efectosPersistentes` entrega mucho más de lo que dice su línea; hay que
//      sumarlos antes de comparar. Dos de los arreglos de esta tanda salieron
//      justamente de ahí.
//
// Quedan fuera de la comprobación las opciones con `corrupta` o con `chain`:
// ésas pagan por un camino que los ocho indicadores no ven —el costo ético y el
// evento encadenado que llega después— así que pueden verse peores sin serlo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EVENTS } from '../js/data/events.js';

const MALO_ALTO = ['ipc', 'deuda', 'riesgo', 'pobreza', 'desocupacion'];
const INDICADORES = [...MALO_ALTO, 'reservas', 'produccion', 'confianza'];

/** Lo que una opción deja en total: el golpe inmediato más lo que dura. */
function efectoTotal(opcion) {
  const ef = {};
  for (const k of INDICADORES) ef[k] = opcion.efectos?.[k] ?? 0;
  const duracion = opcion.duracion ?? 0;
  for (const [k, v] of Object.entries(opcion.efectosPersistentes ?? {})) {
    ef[k] = (ef[k] ?? 0) + v * duracion;
  }
  return ef;
}

/** Cuánto bien hace un valor, ya con el signo del indicador aplicado. */
const bien = (ef, k) => (MALO_ALTO.includes(k) ? -ef[k] : ef[k]);

const domina = (a, b) =>
  INDICADORES.every((k) => bien(a, k) >= bien(b, k)) &&
  INDICADORES.some((k) => bien(a, k) > bien(b, k));

/** Las que se comparan: las que no pagan por fuera de los ocho indicadores. */
const comparable = (opcion) => !opcion.corrupta && !opcion.chain;

const etiqueta = (opcion) =>
  opcion.texto.replace(/^[^\wÁÉÍÓÚÑáéíóúñ]*\s*/, '').split(':')[0].trim().slice(0, 46);

test('ninguna opción está dominada por otra del mismo evento', () => {
  const hallazgos = [];

  for (const evento of EVENTS) {
    const opciones = evento.opciones ?? [];
    if (opciones.length < 2) continue;
    const totales = opciones.map(efectoTotal);

    for (let peor = 0; peor < opciones.length; peor++) {
      if (!comparable(opciones[peor])) continue;
      for (let mejor = 0; mejor < opciones.length; mejor++) {
        if (mejor === peor || !comparable(opciones[mejor])) continue;
        if (!domina(totales[mejor], totales[peor])) continue;

        const detalle = INDICADORES.map(
          (k) => `${k} ${totales[mejor][k]} vs ${totales[peor][k]}`,
        ).join(', ');
        hallazgos.push(
          `evento ${evento.id} «${evento.titulo}»: la op${mejor + 1} ` +
            `«${etiqueta(opciones[mejor])}» gana o empata en los ocho contra la op${peor + 1} ` +
            `«${etiqueta(opciones[peor])}» — ${detalle}`,
        );
      }
    }
  }

  assert.deepEqual(hallazgos, [], `\n${hallazgos.join('\n')}\n`);
});

test('ningún evento se resuelve solo: siempre hay más de una opción viva', () => {
  // El caso extremo de lo anterior: una opción que le gana a TODAS las demás.
  // Eran cinco, y en los cinco era la primera de la lista.
  const sinDecision = [];

  for (const evento of EVENTS) {
    const opciones = evento.opciones ?? [];
    if (opciones.length < 2) continue;
    const totales = opciones.map(efectoTotal);

    for (let i = 0; i < opciones.length; i++) {
      if (!comparable(opciones[i])) continue;
      const resto = opciones.map((_, j) => j).filter((j) => j !== i);
      if (resto.every((j) => comparable(opciones[j]) && domina(totales[i], totales[j]))) {
        sinDecision.push(`evento ${evento.id} «${evento.titulo}»: gana siempre la op${i + 1}`);
      }
    }
  }

  assert.deepEqual(sinDecision, [], `\n${sinDecision.join('\n')}\n`);
});

test('cada opción sigue teniendo los ocho indicadores', () => {
  // El ajuste del balance se hizo con una herramienta que reescribe números
  // dentro del archivo. Esto comprueba que no se llevó puesta ninguna clave.
  const rotas = [];

  for (const evento of EVENTS) {
    for (const [i, opcion] of (evento.opciones ?? []).entries()) {
      const faltan = INDICADORES.filter((k) => typeof opcion.efectos?.[k] !== 'number');
      if (faltan.length) rotas.push(`evento ${evento.id} op${i + 1}: falta ${faltan.join(', ')}`);
    }
  }

  assert.deepEqual(rotas, []);
});

test('el juego sigue teniendo decisiones mejores y peores', () => {
  // La otra forma de arruinarlo: emparejar tanto que da lo mismo qué se elija.
  // Si ninguna opción fuera mejor que otra, no habría nada que enseñar. Se exige
  // que en un evento típico haya una diferencia real entre la mejor y la peor.
  const PESO = {
    confianza: 0.2, pobreza: -0.2, ipc: -0.15, desocupacion: -0.15,
    produccion: 0.15, reservas: 0.1, riesgo: -0.05, deuda: 0,
  };
  const puntos = (opcion) => {
    const ef = efectoTotal(opcion);
    return Object.keys(PESO).reduce((total, k) => total + PESO[k] * ef[k], 0);
  };

  const brechas = EVENTS.filter((e) => (e.opciones?.length ?? 0) >= 2).map((e) => {
    const p = e.opciones.map(puntos);
    return Math.max(...p) - Math.min(...p);
  });
  const mediana = [...brechas].sort((a, b) => a - b)[Math.floor(brechas.length / 2)];

  assert.ok(mediana > 1, `la diferencia mediana entre la mejor y la peor opción es ${mediana.toFixed(2)}`);
});
