"use strict";

import { applyGlosario }      from '../data/glossary.js';
import { getEventStickers, buildStickerHTML } from '../data/stickers.js';
import { getQuoteForTag }     from '../data/quotes.js';
import { buildAdvisorsHTML }  from '../features/advisors.js';
import { buildCrisisAutoTag } from '../features/crisis-auto.js';
import { setFooterQuote }     from './screens.js';
import { getEventImage, getEventImageFallback } from '../data/event-images.js';

// ============================================================
// EVENT UI — Renderizado de la tarjeta de evento
// ============================================================

/** @type {Function|null} callback a llamar cuando se elige una opción */
let _onOptionSelected = null;

/**
 * Registra el callback de selección de opción.
 * @param {Function} cb - (opcionIndex: number, option: object) => void
 */
export function onOptionSelected(cb) {
  _onOptionSelected = cb;
}

/**
 * Renderiza el evento actual en la tarjeta de evento.
 * @param {object} event - objeto evento del array EVENTS
 * @param {object} state - estado del juego actual
 */
export function renderEvent(event, state) {
  // ── Badge de severidad (eventos especiales) ───────────────
  const severityBadge = _buildSeverityBadge(event);

  // ── Imagen con stickers ────────────────────────────────────
  const imgWrap = document.getElementById('ev-img-wrap');
  if (imgWrap) {
    const stickers = getEventStickers(event.tag);
    imgWrap.innerHTML = `
      <div class="ev-img-container">
        <img class="ev-img"
             src="${getEventImage(event)}"
             alt="${event.titulo}"
             onerror="this.onerror=null;this.src='${getEventImageFallback(event)}'">
        <div class="ev-stickers">${buildStickerHTML(stickers)}</div>
        ${event.isCrisisAuto ? buildCrisisAutoTag() : ''}
        ${severityBadge}
      </div>
    `;
  }

  // ── Badge de evento encadenado ────────────────────────────────
  // Se inyecta dinámicamente antes del tag; se elimina si no aplica.
  document.getElementById('ev-chain-notice')?.remove();
  if (event.isChained && event.chainSource) {
    const tagEl = document.getElementById('ev-tag');
    if (tagEl) {
      const notice = document.createElement('div');
      notice.id        = 'ev-chain-notice';
      notice.className = 'ev-chain-notice';
      notice.innerHTML = `🔗 Consecuencia de: <strong>${event.chainSource}</strong>`;
      tagEl.insertAdjacentElement('beforebegin', notice);
    }
  }

  // ── Tag y título ───────────────────────────────────────────
  const tagEl = document.getElementById('ev-tag');
  if (tagEl) {
    tagEl.textContent = event.tag;
    let tagClass = 'event-tag';
    if (event.isCrisisAuto)  tagClass += ' crisis-tag';
    if (event.isExtreme)     tagClass += ' extreme-tag';
    else if (event.isSevere) tagClass += ' severe-tag';
    tagEl.className = tagClass;
  }

  const titleEl = document.getElementById('ev-title');
  if (titleEl) titleEl.textContent = event.titulo;

  // ── Descripción con glosario ───────────────────────────────
  const descEl = document.getElementById('ev-desc');
  if (descEl) descEl.innerHTML = applyGlosario(event.descripcion);

  // ── Clase visual de la tarjeta ─────────────────────────────
  const card = document.getElementById('event-card');
  if (card) {
    let cardClass = 'event-card';
    if (event.isCrisisAuto) cardClass += ' crisis-auto';
    if (event.isExtreme)    cardClass += ' event-extreme';
    else if (event.isSevere) cardClass += ' event-severe';
    card.className = cardClass;
  }

  // ── Opciones ───────────────────────────────────────────────
  renderOptions(event, state);

  // ── Panel de asesores ──────────────────────────────────────
  const panel = document.getElementById('event-panel');
  if (panel) {
    // Insertar panel de asesores si no existe
    let adv = document.getElementById('advisors-panel-container');
    if (!adv) {
      adv = document.createElement('div');
      adv.id = 'advisors-panel-container';
      panel.appendChild(adv);
    }
    adv.innerHTML = buildAdvisorsHTML(state);

    // Eventos de click en asesores (importación dinámica para evitar ciclos)
    adv.querySelectorAll('.advisor-card').forEach(btn => {
      btn.addEventListener('click', () => {
        import('../features/advisors.js').then(({ showAdvisorModal }) => {
          showAdvisorModal(btn.dataset.advisor, event, state);
        });
      });
    });
  }

  // ── Frase célebre relacionada ──────────────────────────────
  const quote = getQuoteForTag(event.tag);
  if (quote) setFooterQuote(quote.text, quote.author);
}

/**
 * Renderiza los botones de opciones del evento.
 * @param {object} event
 * @param {object} state
 */
function renderOptions(event, state) {
  const grid = document.getElementById('ev-options');
  if (!grid) return;

  grid.innerHTML = event.opciones.map((opt, i) => {
    const corruptBadge = opt.corrupta
      ? `<span class="corrupt-badge" title="Esta opción involucra una decisión de dudosa ética">⚠️ Riesgo ético</span>`
      : '';
    return `
      <button class="option-btn" data-index="${i}">
        <span class="opt-text">${opt.texto}</span>
        ${corruptBadge}
      </button>
    `;
  }).join('');

  grid.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      if (_onOptionSelected) _onOptionSelected(idx, event.opciones[idx]);
    });
  });
}

/**
 * Deshabilita todos los botones de opción (durante animación/modal).
 */
export function disableOptions() {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });
}

/**
 * Habilita todos los botones de opción.
 */
export function enableOptions() {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('disabled');
  });
}

/**
 * Construye el HTML del badge de severidad para eventos especiales.
 * @param {object} event
 * @returns {string} HTML string o vacío
 */
function _buildSeverityBadge(event) {
  if (event.isExtreme) {
    return `<div class="ev-severity-badge ev-severity-extreme">
      <span class="ev-severity-icon">🚨</span>
      <span class="ev-severity-text">CRISIS GRAVÍSIMA</span>
      <span class="ev-severity-icon">🚨</span>
    </div>`;
  }
  if (event.isSevere) {
    // Subtipo de badge según tipo de evento
    if (event.isVPCrisis) {
      return `<div class="ev-severity-badge ev-severity-vp">
        <span class="ev-severity-icon">💀</span>
        <span class="ev-severity-text">TRAICIÓN INTERNA</span>
      </div>`;
    }
    if (event.isCabinetCorruption) {
      return `<div class="ev-severity-badge ev-severity-corruption">
        <span class="ev-severity-icon">🔴</span>
        <span class="ev-severity-text">ESCÁNDALO DE GABINETE</span>
      </div>`;
    }
    return `<div class="ev-severity-badge ev-severity-severe">
      <span class="ev-severity-icon">⚡</span>
      <span class="ev-severity-text">DECISIÓN CRÍTICA</span>
    </div>`;
  }
  return '';
}

/**
 * Resalta visualmente la opción elegida.
 * @param {number} index
 */
export function highlightChosenOption(index) {
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('chosen', i === index);
  });
}
