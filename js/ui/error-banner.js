"use strict";

// ============================================================
// BANNER DE ERRORES
//
// El banner de verdad es `js/error-banner-inicial.js`, un script clásico que
// `index.html` carga ANTES que este módulo: así ve también los errores de
// arranque, cuando algún módulo ni siquiera llega a evaluarse.
//
// Este archivo queda para que `main.js` pueda comprobar, en la primera línea del
// arranque, que el banner está puesto. Si no lo está (alguien armó otro
// index.html sin la etiqueta), avisa por consola en vez de fallar en silencio.
// ============================================================

export function initErrorBanner() {
  if (typeof window !== 'undefined' && window.__eppErrorBanner) return true;
  console.warn('[error-banner] NO está activo: falta <script src="js/error-banner-inicial.js"> en index.html');
  return false;
}
