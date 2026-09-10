// La mejor decisión era casi siempre el botón de arriba.
//
// Los eventos se escriben con las opciones en el orden en que se le ocurrieron a
// quien los escribió, y eso es normal y está bien. Lo que no está bien es
// pintarlas siempre en ese orden, porque el orden resultó no ser neutro.
//
// Medido sobre los 130 eventos del banco, con los pesos del propio juego
// (`getScore`: confianza 0,20 · pobreza 0,20 · ipc 0,15 · desocupación 0,15 ·
// producción 0,15 · reservas 0,10 · riesgo 0,05):
//
//     la mejor opción es la primera    90 de 130   (69,2 %)
//     la segunda                       15          (11,5 %)
//     la tercera                       20          (15,4 %)
//     la cuarta                         5           (3,8 %)
//
// Con tres o cuatro opciones, el azar daría cerca del 30 %. Y la consecuencia se
// mide en puntos: jugar el banco entero tocando siempre el primer botón da 242,9
// puntos, contra 89,0 eligiendo al azar y 333,0 eligiendo siempre lo mejor. O
// sea que **tocar arriba sin leer recorre casi dos tercios del camino que separa
// al que elige al azar del que juega perfecto**.
//
// En un simulador cuya tesis es que gobernar es elegir entre costos, eso es el
// peor error posible: la interfaz enseña que hay un botón bueno.
//
// Se arregla barajando lo que se muestra, no reescribiendo los 130 eventos. El
// índice original viaja en el botón, así que el historial, los trofeos y el
// informe final siguen leyendo la opción que fue.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ordenDeOpciones } from '../js/ui/event.js';
import { EVENTS } from '../js/data/events.js';

/** Los pesos con los que el propio juego puntúa la gestión (engine/scoring.js). */
const PESO = {
  confianza: 0.2,
  pobreza: -0.2,
  ipc: -0.15,
  desocupacion: -0.15,
  produccion: 0.15,
  reservas: 0.1,
  riesgo: -0.05,
  deuda: 0,
};

/** Lo que una opción deja después de todo, contando los efectos que duran. */
function puntos(opcion) {
  const ef = { ...(opcion.efectos ?? {}) };
  const duracion = opcion.duracion ?? 0;
  for (const [k, v] of Object.entries(opcion.efectosPersistentes ?? {})) {
    ef[k] = (ef[k] ?? 0) + v * duracion;
  }
  return Object.keys(PESO).reduce((total, k) => total + PESO[k] * (ef[k] ?? 0), 0);
}

const mejorIndice = (evento) => {
  const p = evento.opciones.map(puntos);
  return p.indexOf(Math.max(...p));
};

test('el banco sigue teniendo la mejor opción escrita arriba', () => {
  // Este no es el arreglo: es la razón del arreglo, anotada. Si algún día se
  // reescriben los eventos para que el orden sea neutro, este test se cae y hay
  // que venir a mirar si el barajado sigue haciendo falta.
  const primeras = EVENTS.filter((ev) => ev.opciones?.length >= 2 && mejorIndice(ev) === 0).length;
  const conOpciones = EVENTS.filter((ev) => ev.opciones?.length >= 2).length;

  assert.ok(
    primeras / conOpciones > 0.5,
    `la mejor opción es la primera en ${primeras} de ${conOpciones}`,
  );
});

test('lo que se muestra no deja la mejor arriba', () => {
  // Se pinta cada evento muchas veces y se mira dónde cae la mejor. Ninguna
  // posición puede llevarse más de la cuenta.
  const VECES = 400;
  const peores = [];

  for (const evento of EVENTS) {
    if (!evento.opciones || evento.opciones.length < 2) continue;
    const mejor = mejorIndice(evento);
    const cuenta = new Array(evento.opciones.length).fill(0);

    for (let i = 0; i < VECES; i++) {
      const orden = ordenDeOpciones(evento);
      cuenta[orden.indexOf(mejor)]++;
    }

    const mayor = Math.max(...cuenta) / VECES;
    const esperado = 1 / evento.opciones.length;
    if (mayor > esperado + 0.12) {
      peores.push(
        `evento ${evento.id}: la mejor cae en un mismo sitio el ${(100 * mayor).toFixed(0)} %`,
      );
    }
  }

  assert.deepEqual(peores, [], 'hay eventos donde la posición sigue diciendo cuál conviene');
});

test('se muestran todas las opciones, sin perder ni repetir ninguna', () => {
  for (const evento of EVENTS) {
    if (!evento.opciones) continue;
    for (let i = 0; i < 20; i++) {
      const orden = ordenDeOpciones(evento);
      assert.deepEqual(
        [...orden].sort((a, b) => a - b),
        evento.opciones.map((_, j) => j),
        `evento ${evento.id}: el barajado perdió o repitió una opción`,
      );
    }
  }
});

test('un evento de una sola opción no se rompe', () => {
  assert.deepEqual(ordenDeOpciones({ opciones: [{ texto: 'única' }] }), [0]);
  assert.deepEqual(ordenDeOpciones({}), []);
});

test('el barajado es Fisher-Yates y no un sort con azar adentro', () => {
  // `sort(() => Math.random() - 0.5)` no baraja: el comparador es inconsistente y
  // deja los elementos cerca de donde estaban, que es justo el problema que se
  // vino a arreglar.
  // Sin los comentarios: el propio comentario que explica por qué no se usa el
  // comparador tramposo lo nombra, y el test se marcaba a sí mismo.
  const fuente = readFileSync(new URL('../js/ui/event.js', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\r\n]*/g, '');

  assert.equal(
    /sort\s*\(\s*\(\s*\)\s*=>\s*Math\.random/.test(fuente),
    false,
    'el comparador tramposo no baraja: deja la primera cerca de la primera',
  );
});

test('la pantalla pinta las opciones en el orden barajado', () => {
  // El barajado no sirve de nada si quien pinta se olvida de usarlo. Se comprueba
  // en el archivo porque el efecto sólo se ve en un navegador.
  const fuente = readFileSync(new URL('../js/ui/event.js', import.meta.url), 'utf8');
  const render = fuente.slice(fuente.indexOf('function renderOptions'));

  assert.ok(
    /ordenDeOpciones\s*\(/.test(render.slice(0, 1200)),
    'renderOptions volvió a recorrer event.opciones directamente',
  );
});
