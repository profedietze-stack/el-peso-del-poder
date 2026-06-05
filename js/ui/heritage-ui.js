"use strict";

import { HERITAGE_PROFILES } from '../data/heritage.js';
import { IND_META }          from '../config.js';
import { showScreen }        from './screens.js';
import { soundClick }        from '../audio.js';

// ============================================================
// HERITAGE UI — Pantalla de selección de herencia y mandato
// ============================================================

/** @type {string} herencia seleccionada */
let _selectedHeritage = 'estable';

/** @type {string} tipo de mandato seleccionado */
let _selectedMandate  = 'amplio';

/** @type {Function|null} */
let _onConfirm = null;

/**
 * Inicializa la pantalla de herencia.
 * @param {Function} onConfirm - callback({ heritageId, mandateType })
 */
export function showHeritageScreen(onConfirm) {
  _onConfirm = onConfirm;
  _selectedHeritage = 'estable';
  _selectedMandate  = 'amplio';

  renderHeritageGrid();
  initMandateOptions();

  showScreen('screen-heritage');
}

/**
 * Renderiza la grilla de perfiles de herencia.
 */
function renderHeritageGrid() {
  const grid = document.getElementById('heritage-grid');
  if (!grid) return;

  grid.innerHTML = HERITAGE_PROFILES.map(p => `
    <div class="heritage-card ${p.id === _selectedHeritage ? 'selected' : ''}"
         data-id="${p.id}" tabindex="0" role="button">
      <div class="hc-emoji">${p.emoji}</div>
      <div class="hc-name">${p.name}</div>
      <div class="hc-desc">${p.desc}</div>
      <div class="hc-flavor"><em>${p.flavor}</em></div>
      <div class="hc-bars">
        ${p.bars.map(b => `
          <div class="hc-bar-row">
            <span class="hc-bar-label">${b.label}</span>
            <div class="hc-bar-track">
              <div class="hc-bar-fill" style="width:${b.val}%;background:${b.color}"></div>
            </div>
            <span class="hc-bar-val">${b.val}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.heritage-card').forEach(card => {
    card.addEventListener('click',   () => selectHeritage(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectHeritage(card.dataset.id); });
  });
}

/**
 * Selecciona un perfil de herencia.
 * @param {string} id
 */
function selectHeritage(id) {
  _selectedHeritage = id;
  soundClick();
  renderHeritageGrid();
}

/**
 * Inicializa los botones de tipo de mandato.
 */
function initMandateOptions() {
  const container = document.getElementById('mandate-options');
  if (!container) return;

  container.querySelectorAll('.mandate-opt').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.mandate === _selectedMandate);
    opt.addEventListener('click', () => selectMandate(opt));
  });
}

/**
 * Selecciona el tipo de mandato.
 * @param {HTMLElement} el - elemento .mandate-opt clickeado
 */
export function selectMandate(el) {
  _selectedMandate = el.dataset.mandate;
  document.querySelectorAll('.mandate-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  soundClick();
}

/**
 * Confirma la herencia y llama al callback.
 */
export function confirmHeritage() {
  soundClick();
  if (_onConfirm) _onConfirm({ heritageId: _selectedHeritage, mandateType: _selectedMandate });
}

/**
 * Devuelve las selecciones actuales.
 * @returns {{ heritageId: string, mandateType: string }}
 */
export function getHeritageSelection() {
  return { heritageId: _selectedHeritage, mandateType: _selectedMandate };
}
