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
  const pais = Object.hasOwn(PAISES, id) ? id : PAIS_POR_DEFECTO;
  const { reglas } = PAISES[pais];
  CONFIG.PAIS = pais;
  CONFIG.TOTAL_TURNS = reglas.turnos;
  CONFIG.MEDIO_TERMINO = reglas.medioTermino;
  CONFIG.SEGUNDO_MANDATO = reglas.segundoMandato;
  CONFIG.MEDIO_TERMINO_TIPO = reglas.medioTerminoTipo;
  CONFIG.NOTA_MANDATO = reglas.notaMandato ?? '';
  CONFIG.RITMO = { efectos: 1, malos: 1, inercia: 1, especiales: 1, ...(reglas.ritmo ?? {}) };
}

/** Pasa un turno pensado para 48 a la duración del mandato activo (mínimo 1). */
export function escalarTurno(turnoEn48, total = CONFIG.TOTAL_TURNS) {
  return Math.max(1, Math.round((turnoEn48 * total) / TURNOS_BASE));
}

/** El país activo ('ar', 'latam', 'mx', 'co' o 'cl'). */
export const paisActivo = () => CONFIG.PAIS;
export const totalTurnos = () => CONFIG.TOTAL_TURNS;
export const turnoMedioTermino = () => CONFIG.MEDIO_TERMINO;
export const permiteSegundoMandato = () => CONFIG.SEGUNDO_MANDATO;

/** Qué se elige a mitad de mandato: 'legislativas', 'regional-co' o 'regional-cl'. */
export const medioTerminoTipo = () => CONFIG.MEDIO_TERMINO_TIPO;

/** Línea que explica por qué el país no tiene segundo mandato ('' si lo tiene). */
export const notaDeMandato = () => CONFIG.NOTA_MANDATO;

/** Años de gobierno del mandato activo (turnos / 12). */
export const aniosDeMandato = () => CONFIG.TOTAL_TURNS / 12;

/** Rellena `{{ANIOS}}` y `{{TURNOS}}` en un texto fijo del juego con la duración del país. */
export function textoConDuracion(texto) {
  return String(texto).replaceAll('{{ANIOS}}', String(aniosDeMandato())).replaceAll('{{TURNOS}}', String(CONFIG.TOTAL_TURNS));
}

/** Año del mandato (1..años) al que pertenece un turno. */
export function anioDelTurno(turno) {
  return Math.min(aniosDeMandato(), Math.ceil(turno / 12) || 1);
}

const NOMBRE_MEDIO = { legislativas: 'Legislativas', 'regional-co': 'Regionales y Locales', 'regional-cl': 'Municipales y Regionales' };

/** Lo que el HTML fijo (manual) muestra en cada `data-duracion`. */
export function valorDeDuracion(clave) {
  switch (clave) {
    case 'anios': return String(aniosDeMandato());
    case 'turnos': return String(totalTurnos());
    case 'medio': return String(turnoMedioTermino());
    case 'medio-aviso': return String(turnoMedioTermino() - 2);
    case 'medio-nombre': return NOMBRE_MEDIO[medioTerminoTipo()] ?? NOMBRE_MEDIO.legislativas;
    default: return '';
  }
}
