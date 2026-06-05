"use strict";

import { IND_META }              from '../config.js';
import { getZone, getColor }     from '../engine/scoring.js';
import { buildDifficultyBadge }  from '../features/difficulty.js';
import { INERTIA_RULES }         from '../engine/effects.js';

// ============================================================
// DASHBOARD — Panel de indicadores macroeconómicos
// Renderiza los 8 gauges, sparklines y la barra de mandato.
// ============================================================

// Historial de valores por indicador para el sparkline (últimos 8 turnos)
const _sparkHistory = {};

/**
 * Inicializa el sparkline history con los valores iniciales.
 * @param {object} ind - indicadores iniciales
 */
export function initSparklines(ind) {
  for (const m of IND_META) {
    _sparkHistory[m.key] = [ind[m.key]];
  }
}

/**
 * Agrega el estado actual a los sparklines.
 * @param {object} ind - indicadores actuales
 */
export function pushSparkline(ind) {
  for (const m of IND_META) {
    if (!_sparkHistory[m.key]) _sparkHistory[m.key] = [];
    _sparkHistory[m.key].push(ind[m.key]);
    if (_sparkHistory[m.key].length > 8) _sparkHistory[m.key].shift();
  }
}

/**
 * Renderiza el SVG del sparkline para un indicador.
 * @param {string} key
 * @returns {string} SVG HTML
 */
function buildSparklineSVG(key) {
  const hist   = _sparkHistory[key] || [];
  if (hist.length < 2) return '';
  const W = 60, H = 18;
  const min = Math.min(...hist) - 2;
  const max = Math.max(...hist) + 2;
  const range = max - min || 1;
  const pts = hist.map((v, i) => {
    const x = ((i / (hist.length - 1)) * W).toFixed(1);
    const y = (H - ((v - min) / range) * H).toFixed(1);
    return `${x},${y}`;
  }).join(' ');
  const color = getColor(key, hist[hist.length - 1]);
  return `<svg class="ind-sparkline" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/**
 * Renderiza el panel completo de indicadores en #indicators-wrap.
 * @param {object} ind    - indicadores actuales
 * @param {object} prevInd - indicadores del turno anterior (para mostrar delta)
 */
export function renderDashboard(ind, prevInd = null) {
  const wrap = document.getElementById('indicators-wrap');
  if (!wrap) return;

  wrap.innerHTML = IND_META.map(m => {
    const val   = ind[m.key];
    const prev  = prevInd ? prevInd[m.key] : null;
    const delta = prev !== null ? val - prev : null;
    const zone  = getZone(m.key, val);
    const color = getColor(m.key, val);
    const pct   = val; // barra de progreso directamente en %

    // Flecha de tendencia
    let arrow = '';
    if (delta !== null && delta !== 0) {
      const up   = delta > 0;
      // Para "low_bad" (reservas, produccion, confianza): up es bueno = verde
      // Para los demás: up es malo = rojo
      // m.reverse=true → alto es malo (ipc, deuda…): subir es malo
      // m.reverse=false → bajo es malo (reservas, produccion…): subir es bueno
      const good = m.reverse ? !up : up;
      arrow = `<span class="ind-delta ${good ? 'delta-good' : 'delta-bad'}">${up ? '▲' : '▼'}${Math.abs(delta)}</span>`;
    }

    return `
      <div class="ind-card zone-${zone}" data-key="${m.key}">
        <div class="ind-top">
          <div class="ind-name">${m.emoji} ${m.name}<i class="ind-info" data-tip-key="${m.key}" title="Ver definición">i</i></div>
          <div class="ind-val" style="color:${color}">${Math.round(val)}${m.unit}</div>
        </div>
        <div class="ind-bar-track">
          <div class="ind-bar-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <div class="ind-foot">
          <span style="font-size:.67rem;opacity:.7">${zone === 'safe' ? '🟢 Zona segura' : zone === 'warn' ? '🟡 Zona de alerta' : '🔴 ZONA CRÍTICA'}</span>
          ${arrow}
          ${buildSparklineSVG(m.key)}
        </div>
      </div>
    `;
  }).join('');
}

// ── BARRA DE MANDATO ──────────────────────────────────────────

/**
 * Actualiza la barra de progreso del mandato.
 * @param {number} turn        - turno actual (1-48)
 * @param {number} total       - total de turnos (48)
 * @param {string} difficulty  - dificultad seleccionada
 * @param {string} countryName - nombre del país
 */
export function updateMandateBar(turn, total, difficulty, countryName) {
  const fill  = document.getElementById('mandate-fill');
  const label = document.getElementById('month-label');
  const rem   = document.getElementById('events-remaining');

  if (fill)  fill.style.width  = `${((turn - 1) / total * 100).toFixed(1)}%`;
  if (label) label.textContent = `Mes ${turn} / ${total}`;
  if (rem)   rem.textContent   = `${total - turn + 1} decisiones restantes`;

  // Badge de dificultad en la barra
  const badgeSlot = document.getElementById('difficulty-badge-slot');
  if (badgeSlot && difficulty) {
    badgeSlot.innerHTML = buildDifficultyBadge(difficulty);
  }

  // Nombre del país en el footer del evento
  const label2 = document.getElementById('country-game-label');
  if (label2 && countryName) {
    label2.textContent = `✦ ${countryName} ✦`;
  }
}

// ── EFECTOS ACTIVOS ───────────────────────────────────────────

const _IND_LABELS = {
  ipc:'IPC', deuda:'Deuda', reservas:'Reservas', riesgo:'Riesgo',
  pobreza:'Pobreza', desocupacion:'Desempleo', produccion:'Producción', confianza:'Confianza',
};
const _BAD_KEYS = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);

/**
 * Renderiza el panel de efectos persistentes activos.
 * Oculta el panel si no hay efectos.
 * @param {Array} activeEffects — state.activeEffects
 */
export function renderActiveEffects(activeEffects) {
  const panel = document.getElementById('active-effects-panel');
  if (!panel) return;

  if (!activeEffects?.length) {
    panel.style.display = 'none';
    return;
  }
  panel.style.display = '';

  const items = activeEffects.map(ae => {
    // Resumir los efectos más significativos (máx. 3)
    const fxHtml = Object.entries(ae.efectosPersistentes)
      .filter(([, v]) => Math.abs(v) >= 0.3)
      .slice(0, 3)
      .map(([k, v]) => {
        const isBad = (_BAD_KEYS.has(k) && v > 0) || (!_BAD_KEYS.has(k) && v < 0);
        const sign  = v > 0 ? '+' : '';
        return `<span class="ae-fx ${isBad ? 'ae-fx-bad' : 'ae-fx-good'}">${_IND_LABELS[k] || k} ${sign}${v}</span>`;
      }).join('');

    // Color de urgencia según turnos restantes
    const urgClass = ae.turnsLeft === 1 ? 'ae-urgent'
                   : ae.turnsLeft <= 2  ? 'ae-warn' : '';
    const pct = Math.round((ae.turnsLeft / ae.totalDuration) * 100);

    return `
      <div class="ae-item ${urgClass}" title="Turno de origen: ${ae.sourceTurn}">
        <div class="ae-item-body">
          <div class="ae-item-title">${ae.sourceTitle}</div>
          <div class="ae-fx-row">${fxHtml || '<span class="ae-fx-none">sin cambio neto</span>'}</div>
        </div>
        <div class="ae-item-timer">
          <div class="ae-timer-num ${urgClass}">${ae.turnsLeft}</div>
          <div class="ae-timer-lbl">turno${ae.turnsLeft !== 1 ? 's' : ''}</div>
          <div class="ae-progress-bar">
            <div class="ae-progress-fill ${urgClass}" style="width:${pct}%"></div>
          </div>
        </div>
      </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="ae-header">
      <span class="ae-header-icon">📌</span>
      <span class="ae-header-title">Medidas en Curso</span>
      <span class="ae-header-count">${activeEffects.length}</span>
    </div>
    <div class="ae-list">${items}</div>
  `;
}

// ── ANIMACIÓN DE CAMBIO ───────────────────────────────────────

/**
 * Anima brevemente los indicadores que cambiaron (efecto flash).
 * @param {object} prevInd - indicadores anteriores
 * @param {object} newInd  - indicadores nuevos
 */
export function animateIndicatorChanges(prevInd, newInd) {
  for (const m of IND_META) {
    if (prevInd[m.key] === newInd[m.key]) continue;
    const row = document.querySelector(`.ind-card[data-key="${m.key}"]`);
    if (!row) continue;
    row.classList.remove('flash-change');
    // Forzar reflow
    void row.offsetWidth;
    row.classList.add('flash-change');
    setTimeout(() => row.classList.remove('flash-change'), 700);
  }
}
