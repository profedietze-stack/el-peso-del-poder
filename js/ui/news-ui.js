"use strict";

// ============================================================
// NEWS-UI.JS — Interfaz del sistema de prensa
// Ticker de noticias, Sala de Prensa y artículos expandidos
// ============================================================

/** Referencia al estado actual para uso desde onclicks de window */
let _state = null;

// ── TICKER ────────────────────────────────────────────────────

/**
 * Renderiza las 3 noticias del turno en el ticker del dashboard.
 * @param {object} state
 */
export function renderNewsTicker(state) {
  _state = state;
  const container = document.getElementById('news-ticker-items');
  if (!container) return;

  const news = state?.currentNews;
  if (!news || news.length === 0) {
    container.innerHTML = `
      <div class="news-empty">
        📰 Las noticias aparecerán luego de tu primera decisión
      </div>`;
    return;
  }

  container.innerHTML = news.map((item, i) => `
    <div class="news-ticker-item${item.isForecast ? ' news-forecast' : ''}${item.isBreaking ? ' news-breaking' : ''}"
         onclick="window.__openArticle(${i})"
         title="Click para leer más"
         style="animation-delay:${i * 0.1}s">
      <div class="nti-source">
        <span class="nti-src-icon">${item.sourceIcon}</span>
        <span class="nti-src-name" style="color:${item.sourceColor}">${item.sourceName}</span>
        ${item.isForecast  ? '<span class="nti-forecast-badge">🔮 PRONÓSTICO</span>' : ''}
        ${item.isBreaking  ? '<span class="nti-breaking-badge">🚨 URGENTE</span>'    : ''}
      </div>
      <div class="nti-headline">${item.headline}</div>
    </div>
  `).join('');
}

// ── SALA DE PRENSA ────────────────────────────────────────────

/**
 * Abre el modal de la Sala de Prensa.
 * @param {object} state
 * @param {number} [highlightIdx] - índice de artículo a resaltar (desde ticker)
 */
export function openNewsRoom(state, highlightIdx = -1) {
  _state = state;
  const overlay = document.getElementById('newsroom-overlay');
  if (!overlay) return;

  _renderNewsRoom(state, highlightIdx);
  overlay.classList.add('open');
}

export function closeNewsRoom() {
  const overlay = document.getElementById('newsroom-overlay');
  if (overlay) overlay.classList.remove('open');
}

/** Cambia de tab dentro de la sala de prensa */
export function switchNrTab(tab, btn) {
  document.querySelectorAll('.nr-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const curr = document.getElementById('nr-current');
  const arch = document.getElementById('nr-archive');
  if (curr) curr.style.display = tab === 'current' ? '' : 'none';
  if (arch) arch.style.display = tab === 'archive' ? '' : 'none';
}

// ── Renderizado interno ───────────────────────────────────────

function _renderNewsRoom(state, highlightIdx) {
  const content = document.getElementById('newsroom-content');
  if (!content) return;

  const current = state?.currentNews || [];
  const history = (state?.newsHistory || []).slice(1); // excluir el turno actual (ya en "current")
  const turn    = state?.turn || 1;

  const archiveTab = history.length > 0
    ? `<button class="nr-tab" onclick="window.__switchNrTab('archive', this)">📁 Archivo (${history.length})</button>`
    : '';

  content.innerHTML = `
    <div class="nr-tabs">
      <button class="nr-tab active" onclick="window.__switchNrTab('current', this)">📰 Este mes (Mes ${turn})</button>
      ${archiveTab}
    </div>
    <div id="nr-current" class="nr-panel">
      ${_buildArticleList(current, highlightIdx)}
    </div>
    <div id="nr-archive" class="nr-panel" style="display:none">
      ${_buildArchive(history)}
    </div>
  `;
}

function _buildArticleList(items, highlightIdx = -1) {
  if (!items || items.length === 0) {
    return '<p class="nr-empty">Las noticias de este turno aparecerán luego de tu próxima decisión.</p>';
  }
  return items.map((item, i) => `
    <article class="nr-article${i === highlightIdx ? ' nr-article-highlight' : ''}"
             id="nr-art-${i}">
      <div class="nr-art-header">
        <div class="nr-art-source" style="color:${item.sourceColor}">
          <span class="nr-art-src-icon">${item.sourceIcon}</span>
          <span class="nr-art-src-name">${item.sourceName}</span>
          ${item.isForecast ? '<span class="nr-forecast-tag">🔮 PRONÓSTICO</span>' : ''}
        </div>
        <span class="nr-art-type-badge nr-type-${item.sourceType}">${_typeLabel(item.sourceType)}</span>
      </div>
      <h3 class="nr-art-headline">${item.headline}</h3>
      ${item.body ? `<p class="nr-art-body">${item.body}</p>` : ''}
      ${item.isForecast && item.forecastTag
        ? `<div class="nr-art-forecast-hint">📌 Sector en riesgo: <strong>${item.forecastTag}</strong></div>`
        : ''}
    </article>
  `).join('');
}

function _buildArchive(history) {
  if (!history || history.length === 0) {
    return '<p class="nr-empty">El archivo se irá llenando con cada mes de tu mandato.</p>';
  }
  return history.map(entry => `
    <details class="nr-archive-month">
      <summary>📅 Mes ${entry.turn} — ${entry.items.length} noticias</summary>
      <div class="nr-archive-items">
        ${entry.items.map(item => `
          <div class="nr-archive-item">
            <span class="nr-arch-source" style="color:${item.sourceColor}">${item.sourceIcon} ${item.sourceName}</span>
            <span class="nr-arch-headline">${item.headline}</span>
          </div>
        `).join('')}
      </div>
    </details>
  `).join('');
}

function _typeLabel(type) {
  return { paper:'Diario', tabloid:'Tabloide', social:'Red Social', forum:'Foro', news:'Agencia' }[type] || 'Medio';
}

// ── Exponer a window (llamados desde onclick en HTML dinámico) ─

window.__openArticle = function(idx) {
  if (!_state) return;
  openNewsRoom(_state, idx);
};

window.__switchNrTab = function(tab, btn) {
  switchNrTab(tab, btn);
};
