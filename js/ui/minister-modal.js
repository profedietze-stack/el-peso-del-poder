"use strict";

import { getMinisterCommentary }  from '../data/minister-commentary.js';
import { getMinisterById }        from '../data/ministers.js';

// ============================================================
// MINISTER MODAL — Pre-decisión definitiva / pre-consecuencias
//
// Aparece ANTES de aplicar los efectos: el ministro explica las
// *posibles* consecuencias educativamente.
// "Volver"      → re-habilita las opciones (callback onBack)
// "Entendido"   → aplica la decisión (callback onContinue)
// ============================================================

const SLOT_LABELS = {
  economia:   { icon: '💰', label: 'Ministerio de Economía'          },
  social:     { icon: '🤝', label: 'Ministerio de Desarrollo Social'  },
  gabinete:   { icon: '🏛️', label: 'Jefatura de Gabinete'            },
  produccion: { icon: '🏭', label: 'Ministerio de Producción'         },
};

let _onContinue = null;
let _onBack     = null;

/**
 * Abre el modal de comentario ministerial.
 * Si no hay comentarios para este evento/opción, llama onContinue directamente.
 *
 * @param {number}   eventId    - ID del evento
 * @param {number}   optionIdx  - índice de la opción elegida
 * @param {object}   ministers  - G.ministers: { slot → ministerId }
 * @param {Function} onContinue - al presionar "Entendido, continuar"
 * @param {Function} [onBack]   - al presionar "Volver" (re-habilita opciones)
 */
export function showMinisterModal(eventId, optionIdx, ministers, onContinue, onBack) {
  const entries = getMinisterCommentary(eventId, optionIdx);

  // Resolver ministros concretos del jugador para cada slot
  const resolved = entries
    .map(e => {
      const ministerId = ministers?.[e.slot];
      const minister   = ministerId ? getMinisterById(ministerId) : null;
      return minister ? { minister, text: e.text, slot: e.slot } : null;
    })
    .filter(Boolean);

  // Sin comentarios → saltar directamente a la decisión
  if (!resolved.length) {
    onContinue();
    return;
  }

  _onContinue = onContinue;
  _onBack     = onBack || null;

  const overlay = document.getElementById('minister-modal-overlay');
  const body    = document.getElementById('minister-modal-body');
  if (!overlay || !body) { onContinue(); return; }

  body.innerHTML = resolved.map(({ minister, text, slot }) => {
    const slotMeta = SLOT_LABELS[slot] || { icon: '🏛️', label: slot };
    return `
      <div class="mm-card">
        <div class="mm-card-header">
          <img class="mm-avatar" src="${minister.avatarUrl}" alt="${minister.name}"
               onerror="this.src='https://api.dicebear.com/7.x/personas/svg?seed=fallback'">
          <div class="mm-card-info">
            <div class="mm-name">${minister.name}</div>
            <div class="mm-title">${minister.title}</div>
            <div class="mm-slot-badge">
              <span class="mm-slot-icon">${slotMeta.icon}</span>
              ${slotMeta.label}
            </div>
          </div>
        </div>
        <div class="mm-speech">
          <span class="mm-speech-icon">💬</span>
          <p class="mm-speech-text">${text}</p>
        </div>
      </div>
    `;
  }).join('');

  // Mostrar/ocultar botón Volver según haya callback
  const backBtn = document.getElementById('mm-back-btn');
  if (backBtn) backBtn.style.display = _onBack ? '' : 'none';

  overlay.classList.add('open');
  body.scrollTop = 0;
}

/** Confirmar: aplica la decisión */
export function continueMinisterModal() {
  const overlay = document.getElementById('minister-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  const cb = _onContinue;
  _onContinue = null;
  _onBack     = null;
  if (typeof cb === 'function') cb();
}

/** Volver: re-habilita las opciones */
export function backMinisterModal() {
  const overlay = document.getElementById('minister-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  const cb = _onBack;
  _onContinue = null;
  _onBack     = null;
  if (typeof cb === 'function') cb();
}

window.__continueMinisterModal = continueMinisterModal;
window.__backMinisterModal     = backMinisterModal;
// Cerrar haciendo click en el overlay (equivale a Volver)
window.__closeMinisterModal    = backMinisterModal;
