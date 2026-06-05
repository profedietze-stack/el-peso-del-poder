"use strict";

import { ACHIEVEMENTS }           from '../data/achievements.js';
import { EVENTS }                  from '../data/events.js';
import { IND_META, CONFIG }        from '../config.js';
import { loadGlobal }              from '../engine/storage.js';
import { getScore }                from '../engine/scoring.js';
import { showScreen }              from './screens.js';

// ============================================================
// TROPHIES UI — Pantalla de Logros, Stats & Análisis Docente
// ============================================================

export function openTrophies(state = null) {
  renderTrophiesProfile();
  renderTrophiesAchievements(state);
  renderTrophiesHistory(state);
  renderTrophiesDocente(state);
  showScreen('screen-trophies');
  switchTrTab(document.querySelector('[data-tab="tr-profile"]'));
}

// ── TAB SWITCHER ──────────────────────────────────────────────

export function switchTrTab(el) {
  if (!el) return;
  document.querySelectorAll('.tr-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tr-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById(el.dataset.tab);
  if (panel) panel.classList.add('active');
}

// ── TAB 1: PERFIL ─────────────────────────────────────────────

function renderTrophiesProfile() {
  const global = loadGlobal();
  const rank   = getRank(global);

  const avatarEl = document.getElementById('tr-avatar');
  const nameEl   = document.getElementById('tr-profile-name');
  const rankEl   = document.getElementById('tr-profile-rank');

  if (avatarEl) avatarEl.textContent = rank.icon;
  if (nameEl)   nameEl.textContent   = `${global.gamesWon} victorias · ${global.gamesPlayed} partidas jugadas`;
  if (rankEl)   rankEl.textContent   = `${rank.icon} ${rank.label}`;

  // ── KPIs ─────────────────────────────────────────────────────
  const kpiGrid = document.getElementById('tr-kpi-grid');
  if (kpiGrid) {
    const winRate = global.gamesPlayed > 0
      ? Math.round((global.gamesWon / global.gamesPlayed) * 100) : 0;
    const avgScore = global.gamesWon > 0
      ? Math.round(global.totalScore / global.gamesWon) : 0;

    kpiGrid.innerHTML = [
      { label: 'Partidas',         value: global.gamesPlayed,           icon: '🎮' },
      { label: 'Victorias',        value: global.gamesWon,              icon: '🏆' },
      { label: 'Tasa de victoria', value: `${winRate}%`,                icon: '📊' },
      { label: 'Puntaje promedio', value: avgScore,                     icon: '⭐' },
      { label: 'Mejor puntaje',    value: global.bestScore,             icon: '🥇' },
      { label: 'Logros totales',   value: global.allUnlocked.length,    icon: '🏅' },
    ].map(k => `
      <div class="kpi-card">
        <div class="kpi-emoji">${k.icon}</div>
        <div class="kpi-val">${k.value}</div>
        <div class="kpi-lbl">${k.label}</div>
      </div>
    `).join('');
  }

  // ── Stats por dificultad ──────────────────────────────────────
  const docenteQuick = document.getElementById('tr-docente-quick-content');
  if (docenteQuick) {
    const ds = global.diffStats || {};
    const DIFF_LABELS = {
      easy: { label: '🌱 Fácil', cls: 'easy' },
      normal: { label: '⚖️ Normal', cls: 'normal' },
      hard: { label: '🔥 Difícil', cls: 'hard' },
      ultra:   { label: '💀 Ultra',   cls: 'ultra'   },
    };
    const rows = Object.entries(DIFF_LABELS).map(([key, meta]) => {
      const s   = ds[key] || { played: 0, won: 0 };
      const pct = s.played > 0 ? Math.round(s.won / s.played * 100) : 0;
      return `
        <div class="diff-stat-row">
          <span class="diff-label-pill ${meta.cls}">${meta.label}</span>
          <div class="diff-stat-bars">
            <span class="ds-played">${s.played} partidas</span>
            <span class="ds-won">${s.won} victorias</span>
            <span class="ds-pct ${pct >= 50 ? 'good' : ''}">${pct}%</span>
          </div>
        </div>`;
    }).join('');
    docenteQuick.innerHTML = `<div class="diff-stats-grid">${rows}</div>`;
  }

  // ── Stats por herencia ────────────────────────────────────────
  const avgGrid = document.getElementById('tr-avg-ind-grid');
  if (avgGrid) {
    const hs    = global.heritageStats || {};
    const items = Object.entries(hs).filter(([, s]) => s.played > 0);
    if (items.length === 0) {
      avgGrid.innerHTML = '<p class="no-data-msg">Sin partidas registradas aún.</p>';
    } else {
      const HERITAGE_NAMES = {
        neoliberal:    '📉 Herencia Neoliberal',
        populista:     '✊ Herencia Populista',
        tecnocrata:    '🔬 Herencia Tecnocrática',
        kirchnerismo:  '🇦🇷 Kirchnerismo',
      };
      avgGrid.innerHTML = items.map(([hid, s]) => {
        const pct = Math.round(s.won / s.played * 100);
        const name = HERITAGE_NAMES[hid] || hid;
        return `
          <div class="hs-card">
            <div class="hs-name">${name}</div>
            <div class="hs-bar-row">
              <div class="hs-bar-track">
                <div class="hs-bar-fill" style="width:${pct}%;background:${pct >= 60 ? '#5ddd8a' : pct >= 40 ? 'var(--gold)' : '#ff7070'}"></div>
              </div>
              <span class="hs-pct">${pct}%</span>
            </div>
            <div class="hs-meta">${s.played} partidas · ${s.won} ganadas</div>
          </div>`;
      }).join('');
    }
  }
}

function getRank(global) {
  const w = global.gamesWon;
  if (w >= 20) return { icon: '👑', label: 'Estadista Legendario' };
  if (w >= 10) return { icon: '🏛️', label: 'Presidente Experimentado' };
  if (w >= 5)  return { icon: '⭐', label: 'Gobernante Sólido' };
  if (w >= 1)  return { icon: '🌱', label: 'Mandatario en Formación' };
  return         { icon: '🎮', label: 'Sin victorias aún' };
}

// ── TAB 2: LOGROS ─────────────────────────────────────────────

function renderTrophiesAchievements(state) {
  const global      = loadGlobal();
  const unlockedSet = new Set(global.allUnlocked);
  if (state && state.unlockedAchievements) {
    state.unlockedAchievements.forEach(id => unlockedSet.add(id));
  }

  const unlocked = unlockedSet.size;
  const total    = ACHIEVEMENTS.length;

  const countEl = document.getElementById('tr-ach-unlocked-count');
  const barEl   = document.getElementById('tr-ach-bar');
  if (countEl) countEl.textContent = `${unlocked} / ${total}`;
  if (barEl)   barEl.style.width   = `${(unlocked / total * 100).toFixed(1)}%`;

  const grid = document.getElementById('tr-ach-grid');
  if (!grid) return;

  // Ordenar: desbloqueados primero
  const sorted = [...ACHIEVEMENTS].sort((a, b) => {
    const ua = unlockedSet.has(a.id) ? 0 : 1;
    const ub = unlockedSet.has(b.id) ? 0 : 1;
    return ua - ub;
  });

  grid.innerHTML = sorted.map(a => {
    const ok = unlockedSet.has(a.id);
    return `
      <div class="ach-full-card ${ok ? 'unlocked' : 'locked'}" title="${a.desc}">
        ${ok ? '<span class="ach-unlocked-badge">✓ Obtenido</span>' : ''}
        <span class="afc-icon">${ok ? a.icon : '🔒'}</span>
        <div class="afc-name">${a.name}</div>
        <div class="afc-req">${ok ? a.desc : '???'}</div>
        ${!ok ? '<span class="afc-locked-tag">Bloqueado — seguí jugando</span>' : ''}
      </div>`;
  }).join('');
}

// ── TAB 3: HISTORIAL ──────────────────────────────────────────

function renderTrophiesHistory(state) {
  const container = document.getElementById('tr-history-content');
  if (!container) return;

  if (!state || !state.history || state.history.length === 0) {
    container.innerHTML = `
      <div class="no-data-block">
        <div class="no-data-icon">📜</div>
        <div class="no-data-title">Sin historial de partida activa</div>
        <div class="no-data-sub">Iniciá o cargá una partida para ver las decisiones aquí.</div>
      </div>`;
    return;
  }

  // Agrupar por año
  const byYear = { 1: [], 2: [], 3: [], 4: [] };
  state.history.forEach(h => {
    const year = Math.min(4, Math.ceil(h.turn / 12) || 1);
    byYear[year].push(h);
  });

  const YEAR_LABELS = { 1: '🌱 Año 1 — Inicio del Mandato', 2: '📈 Año 2 — Consolidación', 3: '⚡ Año 3 — Punto Crítico', 4: '🏁 Año 4 — Tramo Final' };

  container.innerHTML = Object.entries(byYear)
    .filter(([, entries]) => entries.length > 0)
    .map(([year, entries]) => `
      <div class="hist-year-group">
        <div class="hyg-header">${YEAR_LABELS[year] || `Año ${year}`}</div>
        ${entries.map(h => {
          const ev      = EVENTS.find(e => e.id === h.eventId);
          const titulo  = ev ? ev.titulo : `Evento #${h.eventId}`;
          const opcion  = ev ? (ev.opciones[h.opcionIndex]?.texto || '—') : '—';
          const shortOp = opcion.length > 65 ? opcion.substring(0, 65) + '…' : opcion;
          const isCorrupt = ev && ev.opciones[h.opcionIndex]?.corrupta;
          return `
            <div class="hist-item-full${h.isCrisis ? ' is-crisis' : ''}${isCorrupt ? ' is-corrupt' : ''}">
              <span class="hif-turn">Mes ${h.turn}</span>
              <div class="hif-body">
                <div class="hif-title">${h.isCrisis ? '⚡ ' : ''}${titulo}</div>
                <div class="hif-choice">→ ${shortOp}</div>
              </div>
              ${isCorrupt ? '<span class="hif-corrupt-badge">⚠️ Corrupta</span>' : ''}
            </div>`;
        }).join('')}
      </div>`
    ).join('');
}

// ── TAB 4: ANÁLISIS DOCENTE ───────────────────────────────────

function renderTrophiesDocente(state) {
  const container = document.getElementById('tr-docente-content');
  if (!container) return;

  const global = loadGlobal();

  // Si no hay partida activa con suficiente historia, mostrar vista reducida
  const hasGame = state && state.history && state.history.length >= 1;

  container.innerHTML = `
    <div class="docente-wrap">

      ${_renderDocenteHeader()}

      ${hasGame ? _renderDocenteGameSummary(state) : _renderDocenteNoGame()}

      ${hasGame ? _renderDocenteIndicators(state) : ''}

      ${hasGame ? _renderDocenteDecisionProfile(state) : ''}

      ${hasGame ? _renderDocenteRubric(state) : ''}

      ${_renderDocenteGlobalStats(global)}

      ${_renderDocenteQuestions()}

      ${_renderDocenteExportNote()}

    </div>`;
}

// ── Sección: Encabezado ───────────────────────────────────────

function _renderDocenteHeader() {
  return `
    <div class="dc-section dc-header-section">
      <div class="dc-header-icon">👩‍🏫</div>
      <div>
        <h2 class="dc-main-title">Panel de Evaluación Docente</h2>
        <p class="dc-main-sub">Análisis automático del desempeño del estudiante. Basado en los datos de la partida.</p>
      </div>
    </div>`;
}

// ── Sección: Sin juego activo ─────────────────────────────────

function _renderDocenteNoGame() {
  return `
    <div class="dc-no-game-msg">
      <span class="dc-ngg-icon">🎮</span>
      <strong>Sin partida activa</strong> — Las secciones de análisis individual aparecerán una vez que el estudiante complete al menos una partida.
    </div>`;
}

// ── Sección: Resumen de partida ───────────────────────────────

function _renderDocenteGameSummary(s) {
  const score     = getScore(s.indicadores);
  const diploma   = _getDiploma(score);
  const resultado = s.won
    ? `<span class="dc-badge won">✅ Mandato Completado</span>`
    : s.lost
      ? `<span class="dc-badge lost">❌ ${s.lostReason === 'confianza' ? 'Derrota — Confianza Agotada' : 'Derrota — Pobreza Crítica'}</span>`
      : `<span class="dc-badge inprogress">🕹️ Partida en Curso</span>`;

  const DIFF_NAMES = { easy: '🌱 Fácil', normal: '⚖️ Normal', hard: '🔥 Difícil', ultra: '💀 Modo Ultra' };
  const HERITAGE_NAMES = {
    neoliberal: '📉 Herencia Neoliberal', populista: '✊ Herencia Populista',
    tecnocrata: '🔬 Herencia Tecnocrática', kirchnerismo: '🇦🇷 Kirchnerismo',
  };
  const MANDATE_NAMES = { amplio: '🗳️ Victoria Amplia', ajustado: '⚖️ Victoria Ajustada', coalicion: '🤝 Coalición Frágil' };

  return `
    <div class="dc-section">
      <h3 class="dc-section-title">📋 Ficha de la Partida</h3>
      <div class="dc-ficha-grid">
        <div class="dc-ficha-left">
          <div class="dc-diploma-box ${diploma.cls}">
            <div class="dc-dip-medal">${diploma.medal}</div>
            <div class="dc-dip-name">${diploma.name}</div>
            <div class="dc-dip-score">${score} pts</div>
          </div>
          <div style="text-align:center;margin-top:8px">${resultado}</div>
        </div>
        <div class="dc-ficha-right">
          <div class="dc-ficha-row"><span class="dc-fr-label">Dificultad</span><span class="dc-fr-val">${DIFF_NAMES[s.difficulty] || s.difficulty}</span></div>
          <div class="dc-ficha-row"><span class="dc-fr-label">Herencia</span><span class="dc-fr-val">${HERITAGE_NAMES[s.heritageId] || s.heritageId}</span></div>
          <div class="dc-ficha-row"><span class="dc-fr-label">Mandato</span><span class="dc-fr-val">${MANDATE_NAMES[s.mandateType] || s.mandateType}</span></div>
          <div class="dc-ficha-row"><span class="dc-fr-label">Turnos jugados</span><span class="dc-fr-val">${s.history.length} / 48</span></div>
          <div class="dc-ficha-row"><span class="dc-fr-label">Logros obtenidos</span><span class="dc-fr-val">${s.unlockedAchievements.length} de ${ACHIEVEMENTS.length}</span></div>
        </div>
      </div>
    </div>`;
}

// ── Sección: Análisis de indicadores ─────────────────────────

function _renderDocenteIndicators(s) {
  const start = s.startingIndicadores || {};
  const end   = s.indicadores;

  const rows = IND_META.map(m => {
    const vStart = Math.round(start[m.key] ?? '—');
    const vEnd   = Math.round(end[m.key]);
    const delta  = (typeof start[m.key] === 'number') ? (vEnd - vStart) : null;
    const isGood  = m.reverse ? delta < 0 : delta > 0;
    const isNeutral = delta === 0;
    const deltaStr = delta === null ? '—'
      : delta > 0 ? `<span class="dc-delta pos">+${delta}</span>`
      : delta < 0 ? `<span class="dc-delta neg">${delta}</span>`
      : `<span class="dc-delta neu">—</span>`;
    const improved = delta !== null && !isNeutral;
    const arrowCls = improved ? (isGood ? 'delta-good' : 'delta-bad') : '';
    const arrow    = delta === null ? '' : isNeutral ? '→' : isGood ? '↑' : '↓';
    return `
      <tr class="${arrowCls}">
        <td class="dc-ind-name">${m.emoji} ${m.name}</td>
        <td class="dc-ind-num">${vStart}${m.unit}</td>
        <td class="dc-ind-arrow">${arrow}</td>
        <td class="dc-ind-num">${vEnd}${m.unit}</td>
        <td>${deltaStr}</td>
      </tr>`;
  }).join('');

  return `
    <div class="dc-section">
      <h3 class="dc-section-title">📊 Evolución de Indicadores</h3>
      <div class="dc-table-wrap">
        <table class="dc-ind-table">
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Inicio</th>
              <th></th>
              <th>Final</th>
              <th>Variación</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="dc-table-note">↑ = mejora, ↓ = empeora según el indicador. Recordar que para IPC, Deuda, Riesgo, Pobreza y Desocupación, <em>bajar</em> es positivo.</p>
    </div>`;
}

// ── Sección: Perfil de decisiones ────────────────────────────

function _renderDocenteDecisionProfile(s) {
  const ad = s.adata || {};
  const corruptCount = ad.neverCorrupt ? 0
    : s.history.filter(h => {
        const ev = EVENTS.find(e => e.id === h.eventId);
        return ev && ev.opciones[h.opcionIndex]?.corrupta;
      }).length;

  const crisisEvents  = s.history.filter(h => h.isCrisis).length;
  const advisorUsed   = ad.advisorUsed || 0;
  const totalDecisions = s.history.length;

  const ethicsColor  = corruptCount === 0 ? '#5ddd8a' : corruptCount <= 1 ? 'var(--gold)' : '#ff7070';
  const ethicsLabel  = corruptCount === 0 ? 'Íntegro ✅' : corruptCount === 1 ? 'Una excepción ⚠️' : `${corruptCount} decisiones corruptas ❌`;

  return `
    <div class="dc-section">
      <h3 class="dc-section-title">🧭 Perfil de Decisiones</h3>
      <div class="dc-profile-grid">
        <div class="dc-profile-card">
          <div class="dc-pc-icon">📋</div>
          <div class="dc-pc-val">${totalDecisions}</div>
          <div class="dc-pc-lbl">Decisiones tomadas</div>
        </div>
        <div class="dc-profile-card">
          <div class="dc-pc-icon">⚖️</div>
          <div class="dc-pc-val" style="color:${ethicsColor}">${ethicsLabel}</div>
          <div class="dc-pc-lbl">Perfil ético</div>
        </div>
        <div class="dc-profile-card">
          <div class="dc-pc-icon">⚡</div>
          <div class="dc-pc-val">${crisisEvents}</div>
          <div class="dc-pc-lbl">Crisis automáticas gestionadas</div>
        </div>
        <div class="dc-profile-card">
          <div class="dc-pc-icon">🤝</div>
          <div class="dc-pc-val">${advisorUsed}</div>
          <div class="dc-pc-lbl">Consultas a asesores</div>
        </div>
        <div class="dc-profile-card">
          <div class="dc-pc-icon">🚨</div>
          <div class="dc-pc-val">${ad.crisisCount || 0}</div>
          <div class="dc-pc-lbl">Turnos con indicadores en zona roja</div>
        </div>
        <div class="dc-profile-card">
          <div class="dc-pc-icon">💪</div>
          <div class="dc-pc-val">${s.adata.confianzaMin !== undefined ? Math.round(s.adata.confianzaMin) + '%' : '—'}</div>
          <div class="dc-pc-lbl">Confianza mínima registrada</div>
        </div>
      </div>
    </div>`;
}

// ── Sección: Rúbrica automática ───────────────────────────────

function _renderDocenteRubric(s) {
  const score      = getScore(s.indicadores);
  const ad         = s.adata || {};
  const turns      = s.history.length;

  // Criterio 1: Comprensión sistémica (30 pts)
  // Basado en balance de indicadores finales y mandato completado
  let c1 = 0;
  if (s.won) c1 += 15; else if (turns >= 24) c1 += 7; else if (turns >= 12) c1 += 4;
  const dangerAtEnd = IND_META.filter(m => {
    const t = CONFIG.THRESHOLDS[m.key];
    if (!t) return false;
    const v = s.indicadores[m.key];
    return t.low_bad ? v <= t.danger : v >= t.danger;
  }).length;
  if (dangerAtEnd === 0) c1 += 15;
  else if (dangerAtEnd === 1) c1 += 10;
  else if (dangerAtEnd === 2) c1 += 5;

  // Criterio 2: Gestión económica (25 pts)
  let c2 = 0;
  if (score >= 65) c2 = 25;
  else if (score >= 50) c2 = 20;
  else if (score >= 35) c2 = 14;
  else if (score >= 20) c2 = 8;
  else c2 = 3;

  // Criterio 3: Ética en la gestión (25 pts)
  const corruptCount = ad.neverCorrupt ? 0
    : s.history.filter(h => {
        const ev = EVENTS.find(e => e.id === h.eventId);
        return ev && ev.opciones[h.opcionIndex]?.corrupta;
      }).length;
  let c3 = 0;
  if (corruptCount === 0)       c3 = 25;
  else if (corruptCount === 1)  c3 = 14;
  else if (corruptCount === 2)  c3 = 6;
  else                          c3 = 0;
  // Bonus por uso de asesores (reflexión antes de decidir)
  if ((ad.advisorUsed || 0) >= 5)  c3 = Math.min(25, c3 + 3);
  if ((ad.advisorUsed || 0) >= 10) c3 = Math.min(25, c3 + 2);

  // Criterio 4: Gestión de crisis (20 pts)
  let c4 = 0;
  const crisisCount = ad.crisisCount || 0;
  if (s.won && crisisCount < 3)        c4 = 20;
  else if (s.won && crisisCount < 6)   c4 = 17;
  else if (s.won && crisisCount >= 6)  c4 = 20; // Fénix — sobrevivió muchas crisis
  else if (!s.won && turns >= 30)      c4 = 10;
  else if (!s.won && turns >= 15)      c4 = 6;
  else                                 c4 = 2;

  const total = c1 + c2 + c3 + c4;
  const totalPct = total;

  const gradeColor = total >= 80 ? '#5ddd8a' : total >= 60 ? 'var(--gold)' : total >= 40 ? '#f39c12' : '#ff7070';
  const gradeLbl   = total >= 80 ? 'Excelente' : total >= 60 ? 'Muy Bueno' : total >= 40 ? 'Regular' : 'Insuficiente';

  const rubricRow = (n, name, pts, max, desc) => {
    const pct = Math.round((pts / max) * 100);
    const color = pct >= 80 ? '#5ddd8a' : pct >= 55 ? 'var(--gold)' : pct >= 30 ? '#f39c12' : '#ff7070';
    return `
      <tr>
        <td class="dc-rb-num">${n}</td>
        <td class="dc-rb-name">${name}</td>
        <td class="dc-rb-desc">${desc}</td>
        <td><div class="dc-rb-bar-wrap"><div class="dc-rb-bar" style="width:${pct}%;background:${color}"></div></div></td>
        <td class="dc-rb-pts" style="color:${color}">${pts} / ${max}</td>
      </tr>`;
  };

  return `
    <div class="dc-section dc-rubric-section">
      <h3 class="dc-section-title">📝 Rúbrica Automática de Evaluación</h3>
      <p class="dc-section-intro">Puntaje calculado automáticamente a partir de los datos de la partida. Sirve como insumo — el docente puede ajustarlo según el ensayo escrito y la participación oral.</p>

      <div class="dc-rubric-score-hero">
        <div class="dc-rs-circle" style="border-color:${gradeColor}">
          <span class="dc-rs-num" style="color:${gradeColor}">${total}</span>
          <span class="dc-rs-denom">/100</span>
        </div>
        <div class="dc-rs-info">
          <div class="dc-rs-grade" style="color:${gradeColor}">${gradeLbl}</div>
          <div class="dc-rs-sub">Puntaje de juego (insumo para evaluación)</div>
        </div>
      </div>

      <div class="dc-table-wrap">
        <table class="dc-rubric-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Criterio</th>
              <th>Evidencia en la partida</th>
              <th class="dc-rb-bar-col">Progreso</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            ${rubricRow(1, 'Comprensión sistémica', c1, 30,
              s.won
                ? `Mandato completo · ${dangerAtEnd === 0 ? 'Sin indicadores en rojo al final' : dangerAtEnd + ' indicador/es en rojo al final'}`
                : `Mandato interrumpido en mes ${turns} · ${dangerAtEnd} indicadores en zona crítica`)}
            ${rubricRow(2, 'Gestión económica', c2, 25,
              `Puntaje final de gestión: ${score}/100 (${_getDiploma(score).name})`)}
            ${rubricRow(3, 'Ética en la gestión', c3, 25,
              corruptCount === 0
                ? `Ninguna opción corrupta elegida · ${ad.advisorUsed || 0} consultas a asesores`
                : `${corruptCount} opción/es corrupta/s elegida/s · ${ad.advisorUsed || 0} consultas`)}
            ${rubricRow(4, 'Gestión de crisis', c4, 20,
              `${crisisCount} situaciones de crisis · ${s.history.filter(h => h.isCrisis).length} crisis automáticas resueltas`)}
          </tbody>
          <tfoot>
            <tr class="dc-rb-total-row">
              <td colspan="3" style="text-align:right;font-weight:700;padding-right:12px">TOTAL</td>
              <td></td>
              <td class="dc-rb-pts" style="color:${gradeColor};font-size:1.1rem">${total} / 100</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="dc-rubric-note">
        💡 <strong>Nota para el docente:</strong> este puntaje es un insumo automático que refleja el desempeño <em>dentro del juego</em>. Para una evaluación integral, combinarlo con el <strong>ensayo de justificación post-partida</strong> (ver Manual Didáctico) y la <strong>participación en el debate de aula</strong>.
      </div>
    </div>`;
}

// ── Sección: Stats globales ───────────────────────────────────

function _renderDocenteGlobalStats(global) {
  const winRate = global.gamesPlayed > 0
    ? Math.round(global.gamesWon / global.gamesPlayed * 100) : 0;

  return `
    <div class="dc-section">
      <h3 class="dc-section-title">📈 Historial Acumulado del Estudiante</h3>
      <div class="dc-global-chips">
        <div class="dc-gc"><span class="dc-gc-val">${global.gamesPlayed}</span><span class="dc-gc-lbl">Partidas totales</span></div>
        <div class="dc-gc"><span class="dc-gc-val" style="color:#5ddd8a">${global.gamesWon}</span><span class="dc-gc-lbl">Victorias</span></div>
        <div class="dc-gc"><span class="dc-gc-val">${winRate}%</span><span class="dc-gc-lbl">Tasa de victoria</span></div>
        <div class="dc-gc"><span class="dc-gc-val" style="color:var(--gold)">${global.bestScore}</span><span class="dc-gc-lbl">Mejor puntaje</span></div>
        <div class="dc-gc"><span class="dc-gc-val">${global.allUnlocked.length}</span><span class="dc-gc-lbl">Logros desbloqueados</span></div>
      </div>
    </div>`;
}

// ── Sección: Preguntas disparadoras ──────────────────────────

function _renderDocenteQuestions() {
  const questions = [
    { q: '¿Qué decisiones resultaron más difíciles de tomar? ¿Por qué?', hint: 'Explorar los <em>trade-offs</em> entre indicadores económicos y sociales.' },
    { q: '¿Existe alguna decisión "objetivamente correcta"?', hint: '¿O siempre hay costos ocultos? Relacionar con el concepto de <em>costo de oportunidad</em>.' },
    { q: '¿Cómo influyó la herencia recibida en las primeras decisiones?', hint: 'Conectar con el análisis de la situación económica al inicio del mandato real de algún gobierno argentino.' },
    { q: '¿Qué rol juega la confianza ciudadana en la economía?', hint: 'Vincular con el concepto de <em>legitimidad política</em> y credibilidad institucional.' },
    { q: '¿Podría un gobierno ser económicamente exitoso pero éticamente cuestionable?', hint: 'Debate sobre corrupción, crecimiento económico y redistribución.' },
    { q: '¿Qué indicador fue más difícil de mejorar? ¿Por qué?', hint: 'Identificar tensiones estructurales de la economía argentina (inflación, pobreza, deuda).' },
  ];

  return `
    <div class="dc-section">
      <h3 class="dc-section-title">💡 Preguntas Disparadoras para el Aula</h3>
      <div class="dc-questions-list">
        ${questions.map((item, i) => `
          <div class="dc-question-item">
            <div class="dc-q-num">${i + 1}</div>
            <div class="dc-q-body">
              <div class="dc-q-text">${item.q}</div>
              <div class="dc-q-hint">🔎 ${item.hint}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── Sección: Nota de exportación ──────────────────────────────

function _renderDocenteExportNote() {
  return `
    <div class="dc-export-note">
      <strong>📸 Para documentar resultados:</strong> usá el botón "Capturar Resultados" en la pantalla final de partida para generar una imagen compartible. Los datos de esta rúbrica se calculan en tiempo real y no se almacenan externamente.
    </div>`;
}

// ── Helpers ───────────────────────────────────────────────────

function _getDiploma(score) {
  if (score >= 65) return { medal: '🥇', name: 'Diploma de Oro',   cls: 'gold'   };
  if (score >= 45) return { medal: '🥈', name: 'Diploma de Plata', cls: 'silver' };
  if (score >= 25) return { medal: '🥉', name: 'Diploma de Bronce', cls: 'bronze' };
  return             { medal: '📜', name: 'Gestión Criticada',  cls: 'basic'  };
}
