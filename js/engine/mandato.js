"use strict";

// ============================================================
// MANDATO — cuánto dura la partida y qué reglas tiene cada país
//
// Cada turno es un mes de gobierno. Argentina, Colombia y Chile: 4 años = 48 turnos;
// México: 6 años = 72. Las reglas viven en `PAISES[id].reglas` (data/pais.js) y se
// escriben UNA vez en CONFIG al arrancar (mismo patrón que `aplicarDificultad`):
// todo lo que antes decía «48» lee de acá.
// ============================================================

import { CONFIG } from '../config.js';
import { PAISES, PAIS_POR_DEFECTO } from '../data/pais.js';

/** Los 48 turnos para los que se escribieron los números de turno del juego. */
const TURNOS_BASE = 48;

/** Escribe las reglas del país en CONFIG. Un id desconocido cae en Argentina. */
export function aplicarReglas(id) {
  const { reglas } = PAISES[Object.hasOwn(PAISES, id) ? id : PAIS_POR_DEFECTO];
  CONFIG.TOTAL_TURNS = reglas.turnos;
  CONFIG.MEDIO_TERMINO = reglas.medioTermino;
  CONFIG.SEGUNDO_MANDATO = reglas.segundoMandato;
}

/** Pasa un turno pensado para 48 a la duración del mandato activo (mínimo 1). */
export function escalarTurno(turnoEn48, total = CONFIG.TOTAL_TURNS) {
  return Math.max(1, Math.round((turnoEn48 * total) / TURNOS_BASE));
}

export const totalTurnos = () => CONFIG.TOTAL_TURNS;
export const turnoMedioTermino = () => CONFIG.MEDIO_TERMINO;
export const permiteSegundoMandato = () => CONFIG.SEGUNDO_MANDATO;

/** Años de gobierno del mandato activo (turnos / 12). */
export const aniosDeMandato = () => CONFIG.TOTAL_TURNS / 12;

/** Rellena `{{ANIOS}}` y `{{TURNOS}}` en un texto fijo del juego con la duración del país. */
export function textoConDuracion(texto) {
  return String(texto).replaceAll('{{ANIOS}}', String(aniosDeMandato())).replaceAll('{{TURNOS}}', String(CONFIG.TOTAL_TURNS));
}
