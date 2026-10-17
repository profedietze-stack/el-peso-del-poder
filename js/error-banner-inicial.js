/* ============================================================
   BANNER DE ERRORES — script clásico, el PRIMERO que carga

   Muestra un banner rojo cuando una excepción no capturada, una promesa
   rechazada o un script que no se pudo traer rompen el juego. Sin esto, un fallo
   en silencio deja la pantalla muerta sin pista de la causa.

   Es un script clásico y no un módulo ES, y no importa nada, a propósito: el juego
   son ~42 módulos sueltos, y un error al evaluar cualquiera de ellos (o un 503 al
   traerlo sin conexión) ocurre ANTES de que `main.js` llegue a correr. Si el
   banner viviera ahí, justo el fallo de arranque —el que más necesita un aviso—
   pasaría sin verse.

   El banner muestra: mensaje, archivo:línea y el tope del stack. Tocarlo copia su
   contenido; el botón ✕ lo cierra.
   ============================================================ */
(function () {
  'use strict';
  if (window.__eppErrorBanner) return;

  var pendiente = null; // último error que ocurrió antes de que existiera <body>

  function dibujar(titulo, detalle) {
    var box = document.getElementById('__err_banner');
    if (!box) {
      box = document.createElement('div');
      box.id = '__err_banner';
      box.setAttribute('role', 'alert');
      box.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'right:0',
        'z-index:2147483647',
        'background:#b00020', 'color:#fff',
        'font:12px/1.4 monospace', 'padding:10px 40px 10px 12px',
        'white-space:pre-wrap', 'word-break:break-word',
        'max-height:50vh', 'overflow:auto',
        'box-shadow:0 2px 12px rgba(0,0,0,.6)'
      ].join(';');
      document.body.appendChild(box);

      var cerrar = document.createElement('button');
      cerrar.textContent = '✕';
      cerrar.setAttribute('aria-label', 'Cerrar error');
      cerrar.style.cssText = 'position:fixed;top:6px;right:8px;z-index:2147483647;background:#fff;color:#b00020;border:0;width:28px;height:28px;font:bold 14px monospace;border-radius:6px;cursor:pointer;';
      cerrar.onclick = function () { box.remove(); cerrar.remove(); };
      document.body.appendChild(cerrar);

      // Tocar el banner copia su contenido (para pasárselo al que programa)
      box.addEventListener('click', function () {
        try {
          if (navigator.clipboard) navigator.clipboard.writeText(box.textContent).catch(function () {});
        } catch (e) { /* sin portapapeles */ }
      });
    }
    box.textContent = '⚠️ ERROR: ' + titulo + '\n' + detalle;
  }

  function mostrar(titulo, detalle) {
    if (document.body) {
      dibujar(titulo, detalle);
    } else {
      // Un error durante el <head>: se guarda y se dibuja en cuanto exista el <body>.
      pendiente = [titulo, detalle];
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (pendiente) { dibujar(pendiente[0], pendiente[1]); pendiente = null; }
  });

  function topeDelStack(error) {
    return error && error.stack ? '\n' + String(error.stack).split('\n').slice(0, 4).join('\n') : '';
  }

  // En captura: un <script> o <link> que no se pudo traer dispara `error` en el
  // elemento y ese evento NO sube hasta window, solo se ve en la fase de captura.
  window.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t !== window && t.tagName) {
      var esRecurso = t.tagName === 'SCRIPT' || (t.tagName === 'LINK' && /stylesheet/i.test(t.rel || ''));
      // Las imágenes tienen su propio respaldo (un degradado): no son un fallo del juego.
      if (esRecurso) {
        mostrar('No se pudo cargar un archivo del juego',
          (t.src || t.href || '(sin dirección)') + '\nProbá recargar con conexión a internet.');
      }
      return;
    }
    var donde = e.filename
      ? String(e.filename).split('/').pop() + ':' + e.lineno + ':' + e.colno
      : '(sin ubicacion)';
    mostrar(e.message || 'error', donde + topeDelStack(e.error));
  }, true);

  window.addEventListener('unhandledrejection', function (e) {
    var razon = e.reason;
    var msg = (razon && razon.message) || String(razon);
    mostrar('Promesa rechazada: ' + msg, topeDelStack(razon));
  });

  window.__eppErrorBanner = { mostrar: mostrar };
  if (window.console && console.info) console.info('[error-banner] activo (script inicial)');
})();
