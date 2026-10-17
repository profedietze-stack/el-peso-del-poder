"use strict";

// ============================================================
// TECLADO — activar con Enter o Espacio lo que no es un <button>
//
// Varias pantallas de preparación (VP, herencia, gabinete, dificultad, tipo de
// mandato) usan `<div role="button" tabindex="0" onclick>`. Un div con ese rol se
// anuncia como botón y entra en el orden de Tab, pero el navegador NO le agrega el
// comportamiento de un botón: Enter y Espacio no hacen nada. Quien usaba teclado o
// lector de pantalla llegaba a la tarjeta y no podía elegirla.
//
// Un solo oyente global en vez de un `keydown` por tarjeta: las tarjetas se
// regeneran con `innerHTML` y el oyente seguiría funcionando.
// ============================================================

const ACTIVABLES = '[role="button"], [role="radio"]';
const NATIVOS = new Set(['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY']);

/**
 * ¿Este `keydown` tiene que convertirse en un clic?
 * No para los controles nativos (un <button> ya se activa solo: llamar a click()
 * además lo dispararía dos veces).
 * @param {{key:string, target:Element|null}} e
 */
export function debeActivarse(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return false;
  const t = e.target;
  if (!t || typeof t.matches !== 'function') return false;
  if (NATIVOS.has(t.tagName)) return false;
  return t.matches(ACTIVABLES);
}

/** Registra el oyente global. Llamar una vez al arrancar. */
export function initTeclado(doc = document) {
  doc.addEventListener('keydown', (e) => {
    if (!debeActivarse(e)) return;
    e.preventDefault(); // el Espacio no tiene que desplazar la página
    e.target.click();
  });
}
