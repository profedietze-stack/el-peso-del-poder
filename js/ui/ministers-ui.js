"use strict";

import { MINISTER_SLOTS, getMinistersBySlot, getDefaultMinisterSelection } from '../data/ministers.js';
import { showScreen } from './screens.js';

// ============================================================
// MINISTERS UI — Pantalla de selección de gabinete
// ============================================================

// Estado local de selección
let _selections  = {};  // { economia: 'ortodoxa', social: 'asistencial', ... }
let _onConfirm   = null;

// Indicadores donde un valor BAJO es mejor (delta negativo = bueno)
const HIGH_BAD = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);

// Nombres cortos de indicadores para los chips de pasivos
const IND_SHORT = {
  ipc:          'IPC',
  deuda:        'Deuda',
  reservas:     'Reservas',
  riesgo:       'Riesgo',
  pobreza:      'Pobreza',
  desocupacion: 'Desocup.',
  produccion:   'Producción',
  confianza:    'Confianza',
};

/**
 * Muestra la pantalla de selección de gabinete.
 * @param {Function} onConfirm — callback({ economia, social, gabinete, produccion })
 */
export function showMinistersScreen(onConfirm) {
  _onConfirm  = onConfirm;
  _selections = getDefaultMinisterSelection();  // pre-selecciona el 1ro de cada cartera

  _renderScreen();
  showScreen('screen-ministers');
  _scrollToTop();
}

/**
 * Expone la selección actual (útil para confirmación desde HTML onclick).
 * @returns {{ economia, social, gabinete, produccion }}
 */
export function getMinistersSelection() {
  return { ..._selections };
}

/**
 * Confirma el gabinete y dispara el callback.
 * Llamado desde HTML onclick="confirmMinistersSelection()".
 */
export function confirmMinistersSelection() {
  if (!_allSelected()) return;
  _onConfirm && _onConfirm({ ..._selections });
}

// ── RENDER ────────────────────────────────────────────────────

function _renderScreen() {
  const grid = document.getElementById('ministers-grid');
  if (!grid) return;

  grid.innerHTML = MINISTER_SLOTS.map(slot => _renderSlot(slot)).join('');
  _renderSummaryBar();
  _updateConfirmButton();  // habilitar el botón si ya hay pre-selección válida
  _exposeWindowHelper();
}

function _renderSlot(slot) {
  const candidates = getMinistersBySlot(slot.id);
  return `
    <div class="min-slot" id="min-slot-${slot.id}">
      <div class="min-slot-header">
        <div class="min-slot-dot" style="background:${slot.color}"></div>
        <div class="min-slot-title" style="color:${slot.color}">${slot.label}</div>
        <div class="min-slot-sub">Elegí un ministro/a para esta cartera</div>
      </div>
      <div class="min-candidates-row" id="min-row-${slot.id}">
        ${candidates.map(m => _renderCard(m, slot)).join('')}
      </div>
    </div>`;
}

function _renderCard(minister, slot) {
  const selected = _selections[slot.id] === minister.id;

  // Pasivos: mostrar todos (con signo, color y tooltip al tocar)
  const passiveChips = Object.entries(minister.passive).map(([key, delta]) => {
    const good = HIGH_BAD.has(key) ? delta < 0 : delta > 0;
    const sign = delta > 0 ? '+' : '';
    return `<span class="mpc-chip ${good ? 'good' : 'bad'}" data-tip-key="${key}">${sign}${delta} ${IND_SHORT[key] || key}</span>`;
  }).join('');

  // Effect mods: solo los que se desvían más del 1 (±10%)
  const modChips = Object.entries(minister.effectMods)
    .filter(([, v]) => Math.abs(v - 1) >= 0.08)
    .map(([key, v]) => {
      const amplifies = v > 1;
      return `<span class="mpc-chip mod ${amplifies ? 'mod-amp' : 'mod-dam'}" data-tip-key="${key}">${amplifies ? '▲' : '▼'} ${IND_SHORT[key] || key} ×${v.toFixed(2)}</span>`;
    }).join('');

  return `
    <div class="min-card ${selected ? 'selected' : ''}"
         id="min-card-${minister.id}"
         onclick="window.__ministerSelect('${slot.id}','${minister.id}')"
         role="button" tabindex="0"
         aria-pressed="${selected}"
         title="Seleccionar ${minister.name}">

      <div class="min-card-top" style="--slot-color:${slot.color}">
        ${selected ? `<div class="min-selected-badge" style="background:${slot.color}">✓ Seleccionado</div>` : ''}
        <div class="min-avatar-wrap">
          <img src="${minister.avatarUrl}"
               alt="${minister.name}"
               width="88" height="88"
               loading="lazy"
               class="min-avatar-img"
               onerror="this.onerror=null;this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=${minister.id}'">
        </div>
      </div>

      <div class="min-card-body">
        <div class="min-name">${minister.name}</div>
        <div class="min-profile" style="color:${slot.color}">${minister.profile}</div>
        <p class="min-bio">${minister.bio}</p>

        <div class="min-section-label">📊 Pasivos de inicio <button class="tip-btn" data-tip-key="pasivos" type="button">ⓘ</button></div>
        <div class="min-chips-row">${passiveChips}</div>

        ${modChips ? `
        <div class="min-section-label" style="margin-top:8px">⚡ Durante la partida <button class="tip-btn" data-tip-key="effectMods" type="button">ⓘ</button></div>
        <div class="min-chips-row">${modChips}</div>
        ` : ''}

        <div class="min-advice-quote">"${minister.adviceStyle}"</div>
      </div>

      <div class="min-card-footer" style="border-color:${selected ? slot.color : 'rgba(255,255,255,.06)'}">
        <div class="min-select-hint">${selected ? '✓ Ministro/a seleccionado/a' : 'Clic para seleccionar'}</div>
      </div>
    </div>`;
}

// ── SUMMARY BAR ───────────────────────────────────────────────

function _renderSummaryBar() {
  const bar = document.getElementById('min-summary-bar');
  if (!bar) return;

  const chips = MINISTER_SLOTS.map(slot => {
    const selId   = _selections[slot.id];
    const candidates = getMinistersBySlot(slot.id);
    const sel    = candidates.find(m => m.id === selId);
    return sel
      ? `<div class="msb-chip" style="border-color:${slot.color}">
           <span class="msb-slot" style="color:${slot.color}">${slot.short}</span>
           <span class="msb-name">${sel.name.split(' ').slice(-1)[0]}</span>
           <span class="msb-profile">${sel.profile.split('·')[0].trim()}</span>
         </div>`
      : `<div class="msb-chip empty"><span class="msb-slot">${slot.short}</span><span style="color:var(--text-dim)">Sin seleccionar</span></div>`;
  }).join('');

  bar.innerHTML = `
    <div class="min-summary-inner">
      <div class="msb-label">Tu gabinete:</div>
      <div class="msb-chips">${chips}</div>
    </div>`;
}

// ── INTERACCIÓN ───────────────────────────────────────────────

function _selectMinister(slot, ministerId) {
  _selections[slot] = ministerId;
  _refreshSlot(slot);
  _renderSummaryBar();
  _updateConfirmButton();
  // Feedback sutil de scroll al card elegido
  const card = document.getElementById(`min-card-${ministerId}`);
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function _refreshSlot(slotId) {
  const slotMeta = MINISTER_SLOTS.find(s => s.id === slotId);
  const row      = document.getElementById(`min-row-${slotId}`);
  if (!row || !slotMeta) return;
  const candidates = getMinistersBySlot(slotId);
  row.innerHTML    = candidates.map(m => _renderCard(m, slotMeta)).join('');
}

function _updateConfirmButton() {
  const btn = document.getElementById('btn-confirm-ministers');
  if (!btn) return;
  const ready = _allSelected();
  btn.disabled = !ready;
  btn.textContent = ready ? '🏛️ Asumir el Gabinete →' : 'Completá tu gabinete…';
  btn.style.opacity = ready ? '1' : '0.5';
}

function _allSelected() {
  return MINISTER_SLOTS.every(s => !!_selections[s.id]);
}

function _scrollToTop() {
  const screen = document.getElementById('screen-ministers');
  if (screen) screen.scrollTop = 0;
}

// ── WINDOW HELPER ─────────────────────────────────────────────
// Necesario para manejar onclick inline en tarjetas generadas dinámicamente.

function _exposeWindowHelper() {
  window.__ministerSelect = (slot, id) => _selectMinister(slot, id);
}
