"use strict";

// ============================================================
// FICHA DE PAÍS — lo que se muestra al elegir dónde gobernar (sin DOM, para probarlo)
//
// El país se elige al empezar una partida nueva y no cambia hasta la siguiente: los textos
// del juego se reescriben UNA vez al arrancar (data/pais.js), así que elegir otro país
// guarda la elección y recarga la página (ver `decidirEleccion`).
//
// Estos textos se ven ANTES de saber el país: no usan voseo ni tuteo, y la pantalla va
// marcada con `data-sin-pais` para que el reescrito no cambie «Argentina» por «el país».
// Mandato, medio mandato y duración salen de `PAISES[id].reglas`: no se escriben dos veces.
// ============================================================

import { PAISES } from '../data/pais.js';

export const NUEVA_PARTIDA_CLAVE = 'sdr_nueva_partida';

const RESUMEN = {
  ar: 'Argentina, con sus hechos, instituciones y debates reales.',
  latam: 'Un país imaginario de la región, sin datos de ningún país en particular.',
  mx: 'México: el mandato más largo, seis años, y sin reelección.',
  co: 'Colombia: cuatro años y una sola vez en el cargo.',
  cl: 'Chile: cuatro años, sin reelección inmediata.',
};

const REELECCION_NO = {
  mx: 'No: la ley no permite la reelección. El mandato es único.',
  co: 'No: la Constitución no permite la reelección. El mandato es único.',
  cl: 'No inmediata: no se puede gobernar dos mandatos seguidos. La partida termina con el mandato.',
};

const MEDIO = {
  legislativas: 'elecciones legislativas',
  'regional-co': 'elecciones regionales y locales (gobernaciones y alcaldías)',
  'regional-cl': 'elecciones municipales y regionales (alcaldías y gobiernos regionales)',
};

const AMBIENTACION = {
  ar: 'Los 130 eventos originales, con instituciones, lugares y debates de Argentina.',
  latam: 'Un país imaginario, sin nombres ni datos reales de un solo país. 140 eventos, 18 pensados para toda la región.',
  mx: 'País de la región con nombres reales de México: Banco de México, Palacio Nacional, Ciudad de México y Pemex.',
  co: 'País de la región con nombres reales de Colombia: Banco de la República, Casa de Nariño, Bogotá y Ecopetrol. Lo nuclear es un plan a futuro.',
  cl: 'País de la región con nombres reales de Chile: Banco Central de Chile, La Moneda, Santiago y ENAP. Lo nuclear es un plan a futuro.',
};

/** Las filas de la ficha de un país: `{ clave, icono, texto }`. */
export function fichaDePais(id) {
  const p = PAISES[id];
  const r = p.reglas;
  const anios = r.turnos / 12;
  return {
    id,
    nombre: p.nombre,
    bandera: p.bandera,
    resumen: RESUMEN[id],
    lineas: [
      { clave: 'mandato', icono: '🗓️', texto: `${anios} años de mandato: ${r.turnos} meses, uno por turno.` },
      { clave: 'reeleccion', icono: '🔁', texto: r.segundoMandato ? 'Sí: si se gana el primer mandato, se puede ir por un segundo.' : REELECCION_NO[id] },
      { clave: 'medio', icono: '🗳️', texto: `A mitad del mandato, ${MEDIO[r.medioTerminoTipo]} en el mes ${r.medioTermino}.` },
      { clave: 'ambientacion', icono: '🏛️', texto: AMBIENTACION[id] },
      { clave: 'partida', icono: '⏱️', texto: r.turnos > 48 ? `${r.turnos} decisiones: una partida más larga, con la mitad más de tiempo de juego.` : `${r.turnos} decisiones por partida.` },
    ],
  };
}

/**
 * Qué pasa al tocar un país. El actual sigue sin recargar; otro se guarda, se marca que viene
 * una partida nueva y se recarga (los textos se reescriben solo al arrancar).
 * @returns {'seguir'|'recargar'}
 */
export function decidirEleccion(id, { paisActual, setPais, marcar, recargar }) {
  if (!Object.hasOwn(PAISES, id) || id === paisActual) return 'seguir';
  setPais(id);
  marcar();
  recargar();
  return 'recargar';
}

/** ¿Se llegó acá porque el jugador eligió otro país para una partida nueva? Se consume una vez. */
export function consumirNuevaPartida(almacen = globalThis.sessionStorage) {
  try {
    if (almacen?.getItem(NUEVA_PARTIDA_CLAVE) === null || almacen?.getItem(NUEVA_PARTIDA_CLAVE) === undefined) return false;
    almacen.removeItem(NUEVA_PARTIDA_CLAVE);
    return true;
  } catch (_) {
    return false;
  }
}
