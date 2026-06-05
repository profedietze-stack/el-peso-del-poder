"use strict";

import { applyGlosario }       from '../data/glossary.js';
import { IND_META }            from '../config.js';
import { getColor }            from '../engine/scoring.js';
import { soundClick }          from '../audio.js';
import { closeAdvisorModal }   from '../features/advisors.js';

// ============================================================
// MODALS — Modales del juego
// Modal de confirmación de decisión, tooltips de glosario,
// modal de asesor, overlay de manual.
// ============================================================

/** @type {Function|null} callback a ejecutar al cerrar el modal de consecuencias */
let _pendingContinue = null;

// ── MODAL DE CONSECUENCIAS ────────────────────────────────────

/**
 * Abre el modal de consecuencias de la decisión ya tomada.
 * La decisión es definitiva — este modal solo informa los efectos.
 * @param {object}   option        - opción ya aplicada { texto, efectos, corrupta? }
 * @param {Function} onContinue    - callback a ejecutar al hacer clic en "Continuar"
 * @param {string}   [pressHeadline] - titular de prensa opcional a mostrar
 */
export function openModal(option, onContinue, pressHeadline = null) {
  _pendingContinue = onContinue;

  const modal      = document.getElementById('modal');
  const icon       = document.getElementById('m-icon');
  const title      = document.getElementById('m-title');
  const body       = document.getElementById('m-body');
  const effects    = document.getElementById('m-effects');
  const confirmBtn = document.getElementById('m-confirm-btn');

  if (!modal) return;

  if (icon)  icon.textContent  = option.corrupta ? '⚠️' : '📋';
  if (title) title.textContent = option.corrupta
    ? '⚠️ Decisión tomada — riesgo ético registrado'
    : 'Consecuencias de tu decisión';

  const texto  = option.texto || '';
  const colon  = texto.indexOf(':');
  const label  = colon > -1 ? texto.substring(0, colon) : texto.substring(0, 60);
  const detail = colon > -1 ? texto.substring(colon + 1).trim() : '';

  if (body) body.innerHTML = `<strong>${label}</strong>${detail ? `<p>${detail}</p>` : ''}`;

  // Titular de prensa (si está disponible)
  const pressEl = document.getElementById('m-press-reaction');
  if (pressEl) {
    if (pressHeadline) {
      pressEl.innerHTML = `<span class="m-press-icon">🗞️</span> <em>${pressHeadline}</em>`;
      pressEl.style.display = '';
    } else {
      pressEl.style.display = 'none';
    }
  }

  // Efectos reales ya aplicados al estado
  if (effects) {
    const rows = Object.entries(option.efectos || {})
      .filter(([, v]) => v !== 0)
      .map(([key, val]) => {
        const meta    = IND_META.find(m => m.key === key);
        const name    = meta ? meta.name : key;
        const emoji   = meta ? meta.emoji : '•';
        // meta.reverse=true → indicador donde ALTO es MALO (ipc, deuda, riesgo, pobreza, desoc.)
        const highBad = meta ? meta.reverse : false;
        const isGood  = highBad ? val < 0 : val > 0;
        const color   = isGood ? '#27ae60' : '#e74c3c';
        const arrow   = val > 0 ? '▲' : '▼';
        return `<div class="eff-row" style="color:${color}">${emoji} ${name}: <strong>${arrow} ${Math.abs(val)}</strong></div>`;
      });

    effects.innerHTML = rows.length
      ? rows.join('')
      : `<div class="eff-row" style="color:#888">Sin cambios inmediatos en indicadores.</div>`;
  }

  if (confirmBtn) {
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.addEventListener('click', _continueFromModal);
  }

  modal.classList.add('open');
}

/**
 * Cierra el modal de consecuencias y llama al callback de continuación.
 */
function _continueFromModal() {
  soundClick();
  closeModal();
  if (_pendingContinue) {
    _pendingContinue();
    _pendingContinue = null;
  }
}

/**
 * Cierra el modal de consecuencias.
 * (También expuesto a window para compatibilidad con HTML existente.)
 */
export function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('open');
}

// ── TOOLTIPS DE GLOSARIO ──────────────────────────────────────

/**
 * MIGRADO: el sistema de tooltips fue reemplazado por el modal centralizado
 * de js/ui/tooltip.js (initTooltips), que funciona correctamente en mobile.
 *
 * Los elementos .tt-term generados por applyGlosario() tienen data-tip y
 * data-tip-title, que el nuevo initTooltips() captura con un listener global.
 *
 * Esta función se mantiene como stub para no romper la llamada en main.js.
 */
export function initGlosarioTooltips() {
  // No-op: reemplazado por initTooltips() en js/ui/tooltip.js
}

// ── MODAL DE ASESOR ───────────────────────────────────────────

/**
 * Cierra el modal de asesor (delegado al módulo de asesores).
 * Expuesto aquí para uso desde el HTML.
 */
export { closeAdvisorModal };

// ── MODAL/OVERLAY DE MANUAL ───────────────────────────────────

/**
 * Abre la pantalla del manual didáctico.
 */
export function openManual() {
  soundClick();
  import('./screens.js').then(({ showScreen }) => showScreen('screen-manual'));
}

// ── CONFIRM QUIT ──────────────────────────────────────────────

/**
 * Pregunta al usuario si quiere salir y ejecuta el callback si confirma.
 * Usa un modal nativo (confirm) para simplicidad.
 * @param {Function} onConfirm
 */
export function confirmQuit(onConfirm) {
  if (window.confirm('¿Seguro que querés salir? El progreso se guarda automáticamente.')) {
    onConfirm();
  }
}
