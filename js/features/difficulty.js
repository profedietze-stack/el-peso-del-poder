"use strict";

import { CONFIG } from '../config.js';
import { soundDifficultySelect, soundClick } from '../audio.js';

// ============================================================
// SELECTOR DE DIFICULTAD
// Muestra la pantalla #screen-difficulty y maneja la selección.
// Integrado con el flujo: Heritage → Difficulty → Game.
// ============================================================

/** @type {string} dificultad seleccionada actualmente */
let _selectedDifficulty = 'normal';

/** @type {Function|null} callback a llamar cuando se confirma la dificultad */
let _onConfirm = null;

/**
 * Definición de cada nivel de dificultad.
 */
export const DIFFICULTY_LEVELS = [
  {
    id:    'easy',
    label: 'Fácil',
    tag:   'Principiante',
    tagClass: 'easy',
    icon:  '🌱',
    multiplier: 0.7,
    desc:  'Los efectos de cada decisión son un 30% más suaves. Ideal para conocer el juego y la historia argentina.',
    extra: 'No hay penalidades adicionales. Los indicadores se mueven despacio.',
  },
  {
    id:    'normal',
    label: 'Normal',
    tag:   'Recomendado',
    tagClass: 'normal',
    icon:  '⚖️',
    multiplier: 1.0,
    desc:  'La experiencia diseñada. Efectos reales, desafío equilibrado y todas las mecánicas activas.',
    extra: 'Los eventos de crisis automática están activos. El juego tal como fue pensado.',
  },
  {
    id:    'hard',
    label: 'Difícil',
    tag:   'Experto',
    tagClass: 'hard',
    icon:  '🔥',
    multiplier: 1.3,
    desc:  'Los efectos se amplifican un 30%. Las malas decisiones castigan más y las buenas cuesta más llegar.',
    extra: 'Crisis automáticas más frecuentes. Sólo para jugadores experimentados.',
  },
  {
    id:    'ultra',
    label: 'Modo Ultra',
    tag:   'Casi Imposible',
    tagClass: 'ultra',
    icon:  '💀',
    multiplier: 1.8,
    desc:  'Los efectos se amplifican un 80%. Eventos extremos frecuentes, arranque devastado. Terminar el mandato es un logro en sí mismo.',
    extra: 'Cooldown de crisis reducido. Alta probabilidad de eventos catastróficos. Para los que ya ganaron en Difícil y quieren más.',
  },
];

/**
 * Renderiza la grilla de tarjetas de dificultad en #difficulty-grid.
 */
function renderDifficultyCards() {
  const grid = document.getElementById('difficulty-grid');
  if (!grid) return;

  grid.innerHTML = DIFFICULTY_LEVELS.map(d => `
    <div class="difficulty-card ${d.id === _selectedDifficulty ? 'selected' : ''}"
         data-diff="${d.id}"
         role="button" tabindex="0"
         aria-label="Dificultad ${d.label}">
      <div class="dc-icon">${d.icon}</div>
      <div class="dc-tag ${d.tagClass}">${d.tag}</div>
      <div class="dc-name">${d.label}</div>
      <div class="dc-desc">${d.desc}</div>
      <div class="dc-extra">${d.extra}</div>
      <div class="dc-mult">Multiplicador de efectos: <strong>×${d.multiplier.toFixed(1)}</strong></div>
    </div>
  `).join('');

  // Event listeners
  grid.querySelectorAll('.difficulty-card').forEach(card => {
    card.addEventListener('click',   () => selectDifficulty(card.dataset.diff));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectDifficulty(card.dataset.diff); });
  });
}

/**
 * Selecciona una dificultad y actualiza la UI.
 * @param {string} id - ID de la dificultad
 */
function selectDifficulty(id) {
  _selectedDifficulty = id;
  soundDifficultySelect();
  renderDifficultyCards();
  updateConfirmButton();
}

/**
 * Actualiza el estado del botón de confirmación.
 */
function updateConfirmButton() {
  const btn = document.getElementById('btn-confirm-difficulty');
  if (!btn) return;
  const level = DIFFICULTY_LEVELS.find(d => d.id === _selectedDifficulty);
  btn.textContent = `▶ Jugar en modo ${level ? level.label : ''}`;
  btn.disabled = false;
}

/**
 * Muestra la pantalla de selección de dificultad.
 * @param {Function} onConfirm - callback(difficultyId) al confirmar
 */
export function showDifficultyScreen(onConfirm) {
  _onConfirm = onConfirm;
  _selectedDifficulty = 'normal';

  const screen = document.getElementById('screen-difficulty');
  if (!screen) return;

  // Ocultar otras pantallas
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screen.classList.add('active');

  renderDifficultyCards();
  updateConfirmButton();

  // Botón confirmar
  const btn = document.getElementById('btn-confirm-difficulty');
  if (btn) {
    // Remover listeners anteriores clonando el nodo
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', confirmDifficulty);
  }
}

/**
 * Confirma la dificultad seleccionada y llama al callback.
 */
function confirmDifficulty() {
  soundClick();
  if (_onConfirm) _onConfirm(_selectedDifficulty);
}

/**
 * Devuelve la dificultad actualmente seleccionada.
 * @returns {string}
 */
export function getSelectedDifficulty() {
  return _selectedDifficulty;
}

/**
 * Construye el badge de dificultad para la barra de mandato.
 * @param {string} diffId
 * @returns {string} HTML del badge
 */
export function buildDifficultyBadge(diffId) {
  const level = DIFFICULTY_LEVELS.find(d => d.id === diffId);
  if (!level) return '';
  return `<span class="difficulty-badge ${level.tagClass}">${level.icon} ${level.label}</span>`;
}
