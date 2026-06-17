"use strict";

// ============================================================
// CAPTURADOR GLOBAL DE ERRORES
//
// Muestra un banner rojo cuando una excepcion no capturada o una
// promesa rechazada rompe el flujo del juego. Sin esto, un throw
// silencioso (p.ej. al procesar una decision) deja la UI congelada
// sin pista de la causa.
//
// El banner muestra: mensaje, archivo:linea y el tope del stack.
// Toca el banner para copiarlo; boton X para cerrarlo.
// ============================================================

function _show(title, detail) {
  let box = document.getElementById('__err_banner');
  if (!box) {
    box = document.createElement('div');
    box.id = '__err_banner';
    box.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0',
      'z-index:2147483647',
      'background:#b00020', 'color:#fff',
      'font:12px/1.4 monospace', 'padding:10px 40px 10px 12px',
      'white-space:pre-wrap', 'word-break:break-word',
      'max-height:50vh', 'overflow:auto',
      'box-shadow:0 2px 12px rgba(0,0,0,.6)',
    ].join(';');
    document.body.appendChild(box);

    const close = document.createElement('button');
    close.textContent = '✕';
    close.setAttribute('aria-label', 'Cerrar error');
    close.style.cssText = 'position:fixed;top:6px;right:8px;z-index:2147483647;background:#fff;color:#b00020;border:0;width:28px;height:28px;font:bold 14px monospace;border-radius:6px;cursor:pointer;';
    close.onclick = () => { box.remove(); close.remove(); };
    document.body.appendChild(close);

    // Tocar el banner copia su contenido (debug rapido en movil)
    box.addEventListener('click', () => {
      navigator.clipboard?.writeText(box.textContent).catch(() => {});
    });
  }
  box.textContent = `⚠️ ERROR: ${title}\n${detail}`;
}

export function initErrorBanner() {
  window.addEventListener('error', (e) => {
    const where = e.filename
      ? `${e.filename.split('/').pop()}:${e.lineno}:${e.colno}`
      : '(sin ubicacion)';
    const stack = e.error?.stack ? '\n' + e.error.stack.split('\n').slice(0, 4).join('\n') : '';
    _show(e.message || 'error', `${where}${stack}`);
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    const msg    = reason?.message || String(reason);
    const stack  = reason?.stack ? '\n' + reason.stack.split('\n').slice(0, 4).join('\n') : '';
    _show('Promesa rechazada: ' + msg, stack);
  });

  console.info('[error-banner] activo');
}
