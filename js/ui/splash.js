"use strict";

// ============================================================
// SPLASH SCREEN — Carga inicial + solicitud de pantalla completa
//
// Compatible con:
//   · PC (Chrome, Firefox, Edge, Safari)
//   · Android (Chrome, Firefox, Samsung Browser)
//   · iOS Safari (no soporta Fullscreen API — muestra hint de PWA)
//   · iOS PWA / "Agregar a inicio" (ya es pantalla completa)
//
// Flujo:
//   1. El overlay cubre todo desde el inicio (z-index: 9999)
//   2. El checklist se completa con delays que representan la init
//   3. El botón se habilita → el jugador lo toca (gesto requerido para audio)
//   4. Se solicita pantalla completa (donde sea posible)
//   5. El overlay se desvanece y el juego inicia
// ============================================================

/** Items del checklist con su delay relativo al anterior (ms) */
const CHECKS = [
  { id: 'sp-chk-1', label: 'Interfaz del juego',      delay:   0 },
  { id: 'sp-chk-2', label: '100 eventos históricos',  delay: 260 },
  { id: 'sp-chk-3', label: 'Sistema de audio',        delay: 200 },
  { id: 'sp-chk-4', label: 'Ministros y gabinete',    delay: 240 },
  { id: 'sp-chk-5', label: 'Sala de prensa',          delay: 180 },
  { id: 'sp-chk-6', label: 'Sistema de guardado',     delay: 200 },
];

// ── DETECCIÓN DE PLATAFORMA ───────────────────────────────────

/** ¿Estamos en iOS (iPhone, iPad, incluido iPad en iOS 13+)? */
function _isIOS() {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  // iPad con iPadOS 13+ se reporta como "MacIntel" pero tiene touchpoints
  return (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/** ¿La app está corriendo en modo PWA/standalone (ya pantalla completa)? */
function _isStandalone() {
  return (
    window.navigator.standalone === true ||                        // iOS PWA
    window.matchMedia('(display-mode: standalone)').matches ||     // Android PWA / manifest
    window.matchMedia('(display-mode: fullscreen)').matches
  );
}

/** ¿El navegador soporta la Fullscreen API estándar? */
function _supportsFullscreen() {
  const el = document.documentElement;
  return !!(
    el.requestFullscreen       ||
    el.webkitRequestFullscreen ||
    el.mozRequestFullScreen    ||
    el.msRequestFullscreen
  );
}

/**
 * ¿Estamos en Android mobile?
 * En Android, requestFullscreen() causa un flash negro que resetea el
 * brightness adaptativo del teléfono y deja la pantalla muy oscura.
 * Los teléfonos Android ya llenan la pantalla — fullscreen no aporta nada.
 */
function _isAndroidMobile() {
  return /Android/i.test(navigator.userAgent) && /Mobi/i.test(navigator.userAgent);
}

/** Solicita pantalla completa. Falla silenciosamente si se deniega. */
async function _requestFullscreen() {
  const el = document.documentElement;
  try {
    if      (el.requestFullscreen)       await el.requestFullscreen();
    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen({ navigationUI: 'hide' });
    else if (el.mozRequestFullScreen)    await el.mozRequestFullScreen();
    else if (el.msRequestFullscreen)     await el.msRequestFullscreen();
  } catch (err) {
    // Fullscreen denegado por el usuario o no disponible — el juego sigue igual
    console.info('[splash] Fullscreen no disponible:', err?.message || err);
  }
}

// ── API PÚBLICA ───────────────────────────────────────────────

/**
 * Inicializa el splash screen.
 * @param {Function} onReady — callback llamado DESPUÉS de que el jugador
 *                             toca "Continuar" y se solicita pantalla completa.
 *                             Ideal para llamar initAudio() (requiere gesto).
 */
export function initSplash(onReady) {
  const overlay = document.getElementById('splash-overlay');
  if (!overlay) {
    // Sin overlay en el DOM — saltar splash (útil en tests)
    onReady?.();
    return;
  }

  _buildChecklist(overlay);
  _setupButton(overlay, onReady);
  _runChecklist(overlay);
}

// ── CONSTRUCCIÓN ─────────────────────────────────────────────

function _buildChecklist(overlay) {
  const list = overlay.querySelector('#sp-checks');
  if (!list) return;
  list.innerHTML = CHECKS.map(c => `
    <div class="sp-check" id="${c.id}" aria-live="polite">
      <span class="sp-dot" aria-hidden="true"></span>
      <span class="sp-check-label">${c.label}</span>
      <span class="sp-check-tick" aria-hidden="true"></span>
    </div>
  `).join('');
}

function _setupButton(overlay, onReady) {
  const btn  = overlay.querySelector('#sp-continue-btn');
  const hint = overlay.querySelector('#sp-ios-hint');

  const ios        = _isIOS();
  const standalone = _isStandalone();
  const canFs      = _supportsFullscreen();

  if (_isAndroidMobile()) {
    // Android mobile — requestFullscreen() causa flash negro que resetea el
    // brightness adaptativo. En Android el browser ya llena la pantalla.
    if (btn) btn.dataset.label = '▶ Continuar';
  } else if (ios && !standalone) {
    // iOS Safari sin PWA — no puede pedir fullscreen
    // Mostrar hint de "Agregar a inicio"
    const isIPad = /iPad/.test(navigator.userAgent) ||
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (hint) {
      hint.innerHTML = `
        <div class="sp-ios-hint-inner">
          <span class="sp-ios-hint-icon">📲</span>
          <span>Para <strong>pantalla completa</strong> en iOS:
            tocá <strong>Compartir</strong>${isIPad ? '' : ' ↑'} y luego
            <strong>Agregar a la pantalla de inicio</strong>
          </span>
        </div>`;
      hint.style.display = '';
    }
    if (btn) btn.dataset.label = '▶ Continuar';
  } else if (standalone) {
    // Ya en modo pantalla completa (PWA)
    if (btn) btn.dataset.label = '▶ Continuar';
  } else if (canFs) {
    if (btn) btn.dataset.label = '⛶  Pantalla Completa · Jugar';
  } else {
    if (btn) btn.dataset.label = '▶ Continuar';
  }

  // Aplicar texto inicial (deshabilitado hasta que termine el checklist)
  if (btn) {
    btn.textContent = btn.dataset.label || '▶ Continuar';
    btn.disabled    = true;
  }

  // Exponer el handler al onclick del HTML
  window.__splashContinue = async () => {
    if (!btn || btn.disabled) return;
    btn.disabled    = true;
    btn.textContent = '⏳ Iniciando…';

    await _requestFullscreen();

    onReady?.();
    _hideSplash(overlay);
  };
}

// ── ANIMACIÓN DEL CHECKLIST ───────────────────────────────────

function _runChecklist(overlay) {
  const fill      = overlay.querySelector('#sp-progress-fill');
  const statusLbl = overlay.querySelector('#sp-status-label');
  let elapsed = 0;

  CHECKS.forEach((chk, i) => {
    elapsed += chk.delay;
    setTimeout(() => {
      // Marcar item como hecho
      const el = document.getElementById(chk.id);
      if (el) {
        const dot  = el.querySelector('.sp-dot');
        const tick = el.querySelector('.sp-check-tick');
        if (dot)  dot.classList.add('done');
        if (tick) tick.textContent = '✓';
        el.classList.add('sp-check-done');
      }

      // Actualizar barra de progreso
      const pct = ((i + 1) / CHECKS.length) * 100;
      if (fill) {
        fill.style.width      = `${pct}%`;
        fill.style.transition = 'width .35s ease-out';
      }

      // Último ítem — habilitar botón
      if (i === CHECKS.length - 1) {
        if (statusLbl) {
          statusLbl.textContent  = '¡Todo listo para jugar!';
          statusLbl.style.color  = 'var(--gold, #f1c40f)';
        }

        // Pequeño delay extra para que el jugador lo perciba
        setTimeout(() => {
          const btn = document.getElementById('sp-continue-btn');
          if (btn) {
            btn.disabled = false;
            btn.classList.add('sp-btn-ready');
            btn.textContent = btn.dataset.label || '▶ Continuar';
          }
        }, 160);
      }
    }, elapsed);
  });
}

// ── OCULTAR / DESTRUIR ────────────────────────────────────────

function _hideSplash(overlay) {
  overlay.classList.add('sp-hiding');
  // Esperar la transición CSS antes de remover del DOM
  overlay.addEventListener('transitionend', () => {
    overlay.remove();
  }, { once: true });
  // Fallback por si transitionend no dispara (iOS Safari a veces lo omite)
  setTimeout(() => {
    if (overlay.parentNode) overlay.remove();
  }, 600);
}
