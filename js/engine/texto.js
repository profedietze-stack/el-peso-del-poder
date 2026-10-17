"use strict";

// ============================================================
// TEXTO — limpieza de lo que escribe el alumno
//
// El nombre del presidente y del partido llegan a la pantalla por `innerHTML` en
// más de veinte sitios (pantalla final, noticias, tarjeta para compartir). Un
// nombre como `<img src=x onerror=...>` se ejecutaba. Se limpia en las dos
// puertas de entrada —la pantalla de identidad y la carga del guardado— para que
// ningún consumidor reciba nunca algo que no sea texto.
// ============================================================

/** Todo lo que no sea letra, número, espacio, puntuación de nombres o emoji. */
const NO_PERMITIDO = /[^\p{L}\p{N} .,'’()\-–·\p{Extended_Pictographic}\uFE0F\u200D]/gu;

/**
 * Deja un nombre como texto plano: sin `<`, `>`, `&`, comillas dobles ni barras.
 * @param {unknown} valor
 * @param {number} [max=40] largo máximo
 * @returns {string} el nombre limpio, o '' si no era texto
 */
export function limpiarNombre(valor, max = 40) {
  if (typeof valor !== 'string') return '';
  return valor
    .normalize('NFC')
    .replace(/<[^>]*>/g, '')   // una etiqueta completa se va entera: «<b>Ana</b>» → «Ana»
    .replace(NO_PERMITIDO, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}
