"use strict";

// ============================================================
// SCREENS — Gestión de pantallas y transiciones
// ============================================================

/**
 * Muestra una pantalla y oculta el resto.
 * @param {string} id - ID del elemento pantalla (ej: 'screen-start')
 */
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
  }
}

/**
 * Devuelve el ID de la pantalla actualmente activa.
 * @returns {string|null}
 */
export function getActiveScreen() {
  const active = document.querySelector('.screen.active');
  return active ? active.id : null;
}

// ── INDICADOR DE AUTOSAVE ─────────────────────────────────────

let _autosaveTimer = null;

/**
 * Muestra brevemente el indicador de autosave.
 */
export function flashAutosave() {
  const el = document.getElementById('autosave-indicator');
  if (!el) return;
  el.classList.add('visible');
  clearTimeout(_autosaveTimer);
  _autosaveTimer = setTimeout(() => el.classList.remove('visible'), 2000);
}

// ── NOTIFICACIÓN EN STRIP ─────────────────────────────────────

let _notifTimer = null;

/**
 * Muestra una notificación en el strip sobre la tarjeta de evento.
 * @param {string} html    - contenido HTML del mensaje
 * @param {'info'|'warn'|'danger'|'success'} type
 * @param {number} duration - ms antes de ocultar (0 = no ocultar)
 */
export function showNotif(html, type = 'info', duration = 4000) {
  const strip = document.getElementById('notif-strip');
  if (!strip) return;
  strip.innerHTML  = html;
  // Mapear tipos a clases CSS del original (ok / bad)
  const cssClass = (type === 'success') ? 'ok'
                 : (type === 'danger' || type === 'warn') ? 'bad'
                 : '';
  strip.className  = `notif-strip${cssClass ? ' ' + cssClass : ''}`;
  strip.style.display = 'block';
  clearTimeout(_notifTimer);
  if (duration > 0) {
    _notifTimer = setTimeout(() => { strip.style.display = 'none'; }, duration);
  }
}

/**
 * Oculta el strip de notificación.
 */
export function hideNotif() {
  const strip = document.getElementById('notif-strip');
  if (strip) strip.style.display = 'none';
}

// ── LOG DE DECISIONES RECIENTES ───────────────────────────────

/**
 * Alterna la visibilidad del log de decisiones recientes.
 */
export function toggleRecentLog() {
  const log     = document.getElementById('recent-log');
  const arrow   = document.getElementById('log-toggle-arrow');
  if (!log) return;
  const open = log.classList.toggle('open');
  if (arrow) arrow.textContent = open ? '▲' : '▼';
}

/**
 * Agrega una entrada al log de decisiones recientes.
 * @param {number} turn
 * @param {string} titulo    - título del evento
 * @param {string} opcionTxt - texto de la opción elegida
 * @param {boolean} isCrisis - si fue una crisis automática
 */
export function addLogEntry(turn, titulo, opcionTxt, isCrisis = false) {
  const container = document.getElementById('recent-log-entries');
  if (!container) return;

  const entry = document.createElement('div');
  entry.className = `hist-item${isCrisis ? ' crisis-auto' : ''}`;
  const label = opcionTxt.substring(0, opcionTxt.indexOf(':') > -1 ? opcionTxt.indexOf(':') : 50).trim();
  entry.innerHTML = `
    <span class="hist-turn">Mes ${turn}</span>
    <span class="hist-event">${isCrisis ? '⚡ ' : ''}${titulo}</span>
    <span class="hist-choice">→ ${label}</span>
  `;

  // Insertar al principio del log (las más recientes arriba)
  container.insertBefore(entry, container.firstChild);

  // Limitar a las últimas 10 entradas visibles
  while (container.children.length > 10) {
    container.removeChild(container.lastChild);
  }
}

// ── FRASE CÉLEBRE EN EL FOOTER ────────────────────────────────

/**
 * Muestra una frase célebre en el footer del juego.
 * @param {string} text   - texto de la frase
 * @param {string} author - autor de la frase
 */
export function setFooterQuote(text, author) {
  const footer = document.getElementById('game-footer');
  if (!footer) return;
  footer.innerHTML = `💬 <em>"${text}"</em> — ${author}`;
}

// ── MARCADORES DE AÑO EN LA BARRA DE MANDATO ─────────────────

/**
 * Renderiza los marcadores de año en la barra de progreso del mandato.
 */
export function renderYearMarkers() {
  const container = document.getElementById('year-markers');
  if (!container) return;
  container.innerHTML = [1, 2, 3, 4].map(y =>
    `<span class="year-marker" style="left:${((y * 12 / 48) * 100).toFixed(1)}%">Año ${y}</span>`
  ).join('');
}
