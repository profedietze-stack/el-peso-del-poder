"use strict";

import { IND_META }                from '../config.js';
import { ACHIEVEMENTS }            from '../data/achievements.js';
import { getScore, getDiploma, getMandateVerdict,
         computeReelection, getColor, getZone } from '../engine/scoring.js';
import { EVENTS }                  from '../data/events.js';
import { showScreen }              from './screens.js';
import { soundVictory, soundDefeat } from '../audio.js';

// ============================================================
// END SCREEN — Pantalla final (victoria o derrota)
// ============================================================

/**
 * Muestra la pantalla de crisis / game over.
 * @param {string} reason - motivo de la derrota
 */
export function showCrisisOverlay(reason) {
  soundDefeat();
  const overlay = document.getElementById('crisis-overlay');
  const icon    = document.getElementById('cr-icon');
  const title   = document.getElementById('cr-title');
  const desc    = document.getElementById('cr-desc');

  if (icon)  icon.textContent  = '💀';
  if (title) title.textContent = 'FIN DE MANDATO';
  if (desc)  desc.textContent  = reason;

  if (overlay) overlay.classList.add('open');
}

/**
 * Oculta la pantalla de crisis.
 */
export function hideCrisisOverlay() {
  const overlay = document.getElementById('crisis-overlay');
  if (overlay) overlay.classList.remove('open');
}

/**
 * Construye y muestra la pantalla de resultados finales.
 * @param {object} state  - estado final del juego
 * @param {string} countryName - nombre del país del jugador
 */
export function showEndScreen(state, countryName) {
  if (state.won) soundVictory();

  // Segundo mandato ganado → pantalla especial de legado histórico
  if (state.isSecondTerm && state.won) {
    _showLegacyScreen(state, countryName);
    return;
  }

  const score  = getScore(state.indicadores);
  const diploma = getDiploma(score);

  _renderDiploma(state, score, diploma, countryName);
  _renderAnalysis(state, score);
  _renderReelection(state, score);
  _renderFinalStats(state);
  _renderLegacyDecisions(state);   // ← Feature 4: decisiones clave
  _renderAchievements(state, score);
  _renderHistory(state);
  _populateShareCard(state, score, diploma);
  // Resetear panel de compartir
  const shareOpts = document.getElementById('share-options');
  if (shareOpts) shareOpts.style.display = 'none';

  showScreen('screen-end');
}

// ── DIPLOMA ───────────────────────────────────────────────────

function _renderDiploma(state, score, diploma, countryName) {
  const medals = { gold: '🥇', silver: '🥈', bronze: '🥉', null: '📜' };
  const labels = {
    gold:   'DIPLOMA DE ORO',
    silver: 'DIPLOMA DE PLATA',
    bronze: 'DIPLOMA DE BRONCE',
    null:   'GESTIÓN CRITICADA',
  };
  const titles = {
    gold:   'Estadista Excepcional',
    silver: 'Gobierno Sólido',
    bronze: 'Gestión Regular',
    null:   'Mandato Difícil',
  };

  const key = diploma || 'null';

  const box = document.getElementById('diploma-box');
  if (box) {
    box.className = `diploma diploma-${diploma || 'none'}${state.isSecondTerm ? ' diploma-second' : ''}`;
  }

  const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setTxt('dip-medal', medals[key]);
  setTxt('dip-tipo',  state.isSecondTerm
    ? `2do MANDATO · ${labels[key]}`
    : labels[key]);
  setTxt('dip-title', state.won ? titles[key] : 'Mandato Interrumpido');

  // Línea del presidente/partido (usa identity si está disponible)
  const identity     = state.identity;
  const presidentLine = identity?.presidentName
    ? `${identity.presidentName}${identity.partyName ? ` · ${identity.partyName}` : ''}`
    : (countryName || 'Tu Gobierno');
  setTxt('dip-country', presidentLine);
  setTxt('dip-score',   score);

  const adj = document.getElementById('dip-score-adj');
  if (adj) {
    const diff = state.difficulty;
    const term = state.isSecondTerm ? ' · 2º Mandato' : '';
    adj.textContent = diff
      ? `Modo ${diff.charAt(0).toUpperCase() + diff.slice(1)} · ${state.turn} meses${term}`
      : '';
  }

  // Sección Mandato Histórico (solo segundo mandato ganado)
  const historicSection = document.getElementById('second-term-glory');
  if (historicSection) {
    if (state.isSecondTerm && state.won && state.firstTermData) {
      const s1 = state.firstTermData.score ?? '—';
      const s2 = score;
      const avg = typeof s1 === 'number' ? Math.round((s1 + s2) / 2) : s2;
      historicSection.style.display = '';
      historicSection.innerHTML = `
        <div class="st-banner">🏛️ PRESIDENTE/A HISTÓRICO/A</div>
        <div class="st-subtitle">Completaste dos mandatos presidenciales consecutivos</div>
        <div class="st-comparison">
          <div class="st-term">
            <div class="st-term-label">1er Mandato</div>
            <div class="st-term-score" style="color:${s1 >= 65 ? '#f1c40f' : s1 >= 45 ? '#c0c0c0' : '#cd7f32'}">${s1} pts</div>
          </div>
          <div class="st-arrow">→</div>
          <div class="st-term">
            <div class="st-term-label">2do Mandato</div>
            <div class="st-term-score" style="color:${s2 >= 65 ? '#f1c40f' : s2 >= 45 ? '#c0c0c0' : '#cd7f32'}">${s2} pts</div>
          </div>
          <div class="st-arrow">→</div>
          <div class="st-term">
            <div class="st-term-label">Promedio</div>
            <div class="st-term-score" style="color:var(--gold)">${avg} pts</div>
          </div>
        </div>
        <div class="st-note">Ocho años de mandato. Muy pocos presidentes llegan tan lejos.</div>`;
    } else {
      historicSection.style.display = 'none';
    }
  }
}

// ── ANÁLISIS ──────────────────────────────────────────────────

function _renderAnalysis(state, score) {
  const el = document.getElementById('analysis-text');
  if (!el) return;

  const verdict = getMandateVerdict(score);
  const corrupt = !state.adata.neverCorrupt
    ? '<p style="color:#e74c3c">⚠️ Eligiste al menos una opción de dudosa ética durante el mandato.</p>'
    : '<p style="color:#27ae60">✅ Tu gestión fue intachable: nunca elegiste opciones corruptas.</p>';

  el.innerHTML = `<p>${verdict}</p>${corrupt}
    <p><small>Turnos completados: <strong>${state.turn}</strong> de 48 · Crisis superadas: <strong>${state.adata.crisisCount}</strong></small></p>`;
}

// ── REELECCIÓN ────────────────────────────────────────────────

const _REELECTION_TITLES = {
  landslide:   { icon: '🌊', label: 'Victoria aplastante', color: '#27ae60',  desc: 'El pueblo votó con una claridad histórica. Fuiste reelecto/a por amplia mayoría.' },
  comfortable: { icon: '✅', label: 'Victoria cómoda',     color: '#2ecc71',  desc: 'Una victoria clara que renueva el mandato con respaldo ciudadano sólido.' },
  narrow:      { icon: '😅', label: 'Victoria ajustada',   color: '#f39c12',  desc: 'Ganaste por un margen estrecho. Tu oposición fue fuerte hasta el final.' },
  close_loss:  { icon: '😞', label: 'Derrota ajustada',    color: '#e67e22',  desc: 'Perdiste por poco. Con algunos indicadores mejor, el resultado habría cambiado.' },
  loss:        { icon: '❌', label: 'Derrota clara',        color: '#e74c3c',  desc: 'El electorado dio un mensaje claro: necesitaba un cambio de rumbo.' },
  rout:        { icon: '💀', label: 'Derrota histórica',   color: '#c0392b',  desc: 'Una derrota contundente. Los problemas no resueltos pasaron factura electoral.' },
};

function _renderReelection(state, score) {
  const section = document.getElementById('reelection-section');
  const content = document.getElementById('reelection-content');
  if (!content) return;

  // Ocultar en derrota o en segundo mandato (ya no hay reelección)
  if (!state.won || state.isSecondTerm) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = '';

  const { pct, reelected, type, factors } = state.reelection || computeReelection(state);
  const info = _REELECTION_TITLES[type] || _REELECTION_TITLES.loss;
  const presidentName = state.identity?.presidentName?.split(' ').slice(-1)[0] || 'el/la candidato/a';

  // Factores positivos y negativos
  const posHTML = factors?.positives?.map(f =>
    `<div class="reel-factor positive">✅ ${f.emoji} ${f.name}: <strong>${f.val}${f.isBad ? '' : ''}</strong></div>`
  ).join('') || '';
  const negHTML = factors?.negatives?.map(f =>
    `<div class="reel-factor negative">❌ ${f.emoji} ${f.name}: <strong>${f.val}</strong></div>`
  ).join('') || '';

  // Botones según resultado
  const buttonsHTML = reelected
    ? `<div class="reel-btns">
         <button class="btn btn-gold reel-btn-main" onclick="window.startSecondTerm()">
           🏛️ Iniciar Segundo Mandato
         </button>
         <button class="btn btn-outline reel-btn-sec" onclick="window.restartGame()">
           🔄 Nueva Partida
         </button>
       </div>
       <div class="reel-note">Si iniciás el segundo mandato, arrancás desde donde terminaste.</div>`
    : `<div class="reel-btns">
         <button class="btn btn-primary reel-btn-main" onclick="window.restartGame()">
           🔄 Jugar de Nuevo
         </button>
       </div>`;

  content.innerHTML = `
    <div class="reel-result ${reelected ? 'won' : 'lost'}">

      <div class="reel-headline">
        <span class="reel-icon">${info.icon}</span>
        <div>
          <div class="reel-type" style="color:${info.color}">${info.label}</div>
          <div class="reel-name-line">
            ${reelected
              ? `<strong>${presidentName}</strong> fue reelecto/a con <strong>${pct}%</strong> de los votos`
              : `<strong>${presidentName}</strong> perdió las elecciones con <strong>${pct}%</strong> de los votos`}
          </div>
        </div>
      </div>

      <div class="reel-bar-wrap">
        <div class="reel-bar-track">
          <div class="reel-bar-fill" style="width:${pct}%;background:${info.color};transition:width 1.2s ease-out"></div>
          <div class="reel-bar-threshold" title="Umbral de victoria (50%)"></div>
        </div>
        <div class="reel-bar-labels">
          <span>0%</span><span style="color:${info.color};font-weight:700">${pct}%</span><span>100%</span>
        </div>
      </div>

      <div class="reel-desc">${info.desc}</div>

      ${(posHTML || negHTML) ? `
      <div class="reel-factors">
        <div class="reel-factors-title">Factores decisivos:</div>
        <div class="reel-factors-grid">
          ${posHTML}${negHTML}
        </div>
      </div>` : ''}

      ${buttonsHTML}
    </div>
  `;

  // Animar la barra con un pequeño delay
  setTimeout(() => {
    const fill = content.querySelector('.reel-bar-fill');
    if (fill) fill.style.width = `${pct}%`;
  }, 100);
}

// ── ESTADÍSTICAS FINALES ──────────────────────────────────────

function _renderFinalStats(state) {
  const grid = document.getElementById('final-stats');
  if (!grid) return;

  grid.innerHTML = IND_META.map(m => {
    const val   = state.indicadores[m.key];
    const color = getColor(m.key, val);
    const zone  = getZone(m.key, val);
    return `
      <div class="stat-item zone-${zone}">
        <span class="stat-emoji">${m.emoji}</span>
        <span class="stat-name">${m.name}</span>
        <span class="stat-value" style="color:${color}">${Math.round(val)}${m.unit}</span>
      </div>
    `;
  }).join('');
}

// ── LOGROS ────────────────────────────────────────────────────

function _renderAchievements(state, score) {
  const grid = document.getElementById('ach-grid');
  if (!grid) return;

  const unlockedSet = new Set(state.unlockedAchievements || []);

  grid.innerHTML = ACHIEVEMENTS
    .filter(a => unlockedSet.has(a.id))
    .map(a => `
      <div class="ach-card unlocked" title="${a.desc}">
        <span class="ach-icon">${a.icon}</span>
        <span class="ach-name">${a.name}</span>
      </div>
    `).join('') || '<p style="color:var(--text-dim)">Sin logros desbloqueados en esta partida.</p>';
}

// ── HISTORIAL DE DECISIONES ───────────────────────────────────

function _renderHistory(state) {
  const tabsEl  = document.getElementById('history-tabs');
  const panelEl = document.getElementById('history-panel');
  if (!tabsEl || !panelEl) return;

  const byYear = { 1: [], 2: [], 3: [], 4: [] };
  state.history.forEach(h => {
    const year = Math.min(4, Math.ceil(h.turn / 12) || 1);
    byYear[year].push(h);
  });

  // Tabs de años
  tabsEl.innerHTML = Object.entries(byYear)
    .filter(([, entries]) => entries.length > 0)
    .map(([year]) =>
      `<button class="hist-tab" data-year="${year}" onclick="switchHistTab(this)">Año ${year}</button>`
    ).join('');

  // Panel del primer año
  const firstYear = Object.keys(byYear).find(y => byYear[y].length > 0);
  if (firstYear) {
    const firstTab = tabsEl.querySelector('[data-year="' + firstYear + '"]');
    if (firstTab) switchHistTab(firstTab, byYear);
  }

  // Exponer byYear al DOM para la función switchHistTab
  window.__SDR_HIST_BYYEAR__ = byYear;
  window.__SDR_EVENTS__ = { EVENTS };

  // ── Botón "Exportar Bitácora" ──────────────────────────────────
  // Inyectado una sola vez; onclick siempre apunta al state actual.
  let exportBtn = document.getElementById('history-export-btn');
  if (!exportBtn) {
    exportBtn = document.createElement('button');
    exportBtn.id        = 'history-export-btn';
    exportBtn.className = 'btn btn-outline history-export-btn';
    exportBtn.innerHTML = '📄 Exportar Bitácora (.txt)';
    panelEl.insertAdjacentElement('afterend', exportBtn);
  }
  exportBtn.onclick = () => _exportHistory(state);
}

/**
 * Cambia el año mostrado en el historial de la end screen.
 * Accesible globalmente para uso desde HTML onclick.
 */
window.switchHistTab = function(el, byYearOverride) {
  document.querySelectorAll('.hist-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  const year   = el.dataset.year;
  const byYear = byYearOverride || window.__SDR_HIST_BYYEAR__ || {};
  const events = window.__SDR_EVENTS__?.EVENTS || [];
  const entries = byYear[year] || [];

  const panel = document.getElementById('history-panel');
  if (!panel) return;

  panel.innerHTML = entries.map(h => {
    const event   = events.find(e => e.id === h.eventId);
    const titulo  = event ? event.titulo : `Evento #${h.eventId}`;
    const opcion  = event ? event.opciones[h.opcionIndex]?.texto : '—';
    const isAnchor = [28, 36, 40].includes(h.eventId);
    return `
      <div class="hist-item${h.isCrisis ? ' crisis-auto' : ''}">
        <div class="hist-turn-badge">Mes ${h.turn}${isAnchor ? ' ★' : ''}</div>
        <div class="hist-event-name">${h.isCrisis ? '⚡ ' : ''}${titulo}</div>
        <div class="hist-choice-text">→ ${opcion || '—'}</div>
      </div>
    `;
  }).join('') || '<p style="color:var(--text-dim)">Sin decisiones en este año.</p>';
};

// ── EXPORT DE HISTORIAL ───────────────────────────────────────

/**
 * Genera y descarga la bitácora completa de la partida como .txt.
 * Incluye identidad, indicadores finales y todas las decisiones
 * con el snapshot de indicadores post-decisión.
 * @param {object} state
 */
function _exportHistory(state) {
  const DIFF_LABELS = { easy:'Fácil', normal:'Normal', hard:'Difícil', ultra:'Ultra 💀' };
  const DIP_LABELS  = {
    gold:   'Diploma de Oro 🥇',
    silver: 'Diploma de Plata 🥈',
    bronze: 'Diploma de Bronce 🥉',
    null:   'Gestión Criticada 📜',
  };

  const score   = getScore(state.indicadores);
  const diploma = getDiploma(score);
  const id      = state.identity || {};
  const name    = id.presidentName || 'Presidente/a';
  const party   = (id.partyName || '').split('(')[0].trim();
  const diff    = DIFF_LABELS[state.difficulty] || (state.difficulty || '—');
  const term    = state.isSecondTerm ? '2do Mandato' : '1er Mandato';
  const outcome = state.won
    ? `Victoria · ${score} pts · ${DIP_LABELS[diploma] || diploma}`
    : `Derrota en Mes ${state.turn}`;

  const SEP  = '═'.repeat(56);
  const SEP2 = '─'.repeat(40);
  const lines = [];

  lines.push(SEP);
  lines.push('  EL PESO DEL PODER — BITÁCORA DE MANDATO');
  lines.push('  Simulador de Economía Política · Creado por ProfeD.');
  lines.push(SEP);
  lines.push('');
  lines.push(`PRESIDENTE/A:  ${name}`);
  if (party) lines.push(`PARTIDO:       ${party}`);
  lines.push(`DIFICULTAD:    ${diff}  ·  ${term}`);
  lines.push(`RESULTADO:     ${outcome}`);
  lines.push('');

  // Indicadores finales
  lines.push('INDICADORES FINALES');
  lines.push(SEP2);
  const ind = state.indicadores;
  const IND_PAIRS = [
    ['Confianza',  'confianza',   'Pobreza',    'pobreza'  ],
    ['Inflación',  'ipc',         'Desempleo',  'desocupacion'],
    ['Producción', 'produccion',  'Deuda',      'deuda'    ],
    ['Reservas',   'reservas',    'Riesgo País','riesgo'   ],
  ];
  for (const [la, ka, lb, kb] of IND_PAIRS) {
    const va = ind[ka] !== undefined ? String(Math.round(ind[ka])).padStart(3) : ' —';
    const vb = ind[kb] !== undefined ? String(Math.round(ind[kb])).padStart(3) : ' —';
    lines.push(`  ${la.padEnd(13)}${va}  |  ${lb.padEnd(13)}${vb}`);
  }
  lines.push('');

  // Historial de decisiones
  lines.push('HISTORIAL DE DECISIONES');
  lines.push(SEP);

  const events = EVENTS;
  state.history.forEach(h => {
    const ev     = events.find(e => e.id === h.eventId);
    const titulo = ev ? ev.titulo : `Evento #${h.eventId}`;
    const opRaw  = ev?.opciones[h.opcionIndex]?.texto || '—';
    // Cortar en la coma o primer punto si es largo
    const op = opRaw.length > 72 ? opRaw.substring(0, 70) + '…' : opRaw;

    lines.push('');
    const crisisFlag = h.isCrisis ? ' [CRISIS AUTO]' : '';
    lines.push(`[Mes ${String(h.turn).padStart(2)}] ${titulo}${crisisFlag}`);
    lines.push(`  → ${op}`);

    // Snapshot de indicadores clave
    if (h.snap) {
      const s  = h.snap;
      const fmt = (v) => String(Math.round(v ?? 0)).padStart(3);
      lines.push(
        `     Conf:${fmt(s.confianza)}  Pob:${fmt(s.pobreza)}  IPC:${fmt(s.ipc)}  ` +
        `Res:${fmt(s.reservas)}  Riesgo:${fmt(s.riesgo)}`
      );
    }
  });

  lines.push('');
  lines.push(SEP);
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`;
  lines.push(`  Generado el ${dateStr} · El Peso del Poder v12`);
  lines.push(SEP);

  // Descargar como .txt
  const text        = lines.join('\n');
  const blob        = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url         = URL.createObjectURL(blob);
  const a           = document.createElement('a');
  const lastName    = name.split(' ').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'bitacora';
  a.download        = `sdr-bitacora-${lastName}-mes${state.turn}.txt`;
  a.href            = url;
  a.click();
  URL.revokeObjectURL(url);
}

// ── PANTALLA DE LEGADO HISTÓRICO (2do Mandato) ───────────────

/** Tabla de títulos históricos según puntaje promedio */
const LEGACY_TITLES = [
  {
    minScore: 80,
    icon:  '🏆',
    title: 'Presidente/a del Siglo',
    color: '#f1c40f',
    banner: 'LEYENDA DE LA REPÚBLICA',
    quote: 'En dos mandatos consecutivos, refundaste el rumbo de la nación. La historia te reserva un lugar entre los más grandes estadistas del continente.',
    short: 'Leyenda',
  },
  {
    minScore: 65,
    icon:  '🌟',
    title: 'Gran Estadista',
    color: '#f39c12',
    banner: 'LEGADO SOBRESALIENTE',
    quote: 'Ocho años de gobierno sólido que el pueblo recordará con respeto y gratitud. Dejás el país mejor de como lo encontraste.',
    short: 'Gran Estadista',
  },
  {
    minScore: 50,
    icon:  '🏛️',
    title: 'Presidente/a del Pueblo',
    color: '#2ecc71',
    banner: 'LEGADO POSITIVO',
    quote: 'Un doble mandato que mejoró la vida de millones. No fue fácil, pero lo lograste. El país te debe un reconocimiento.',
    short: 'Del Pueblo',
  },
  {
    minScore: 35,
    icon:  '📜',
    title: 'Administrador/a Histórico/a',
    color: '#3498db',
    banner: 'LEGADO MODERADO',
    quote: 'Completaste ocho años de mandato en tiempos complejos. Tu perseverancia ante la adversidad merece reconocimiento.',
    short: 'Histórico/a',
  },
  {
    minScore: 0,
    icon:  '⚖️',
    title: 'Mandato Controversial',
    color: '#e67e22',
    banner: 'LEGADO CUESTIONADO',
    quote: 'Tu doble mandato quedará registrado en los libros de historia. No siempre por las razones más gloriosas, pero completaste el camino.',
    short: 'Controversial',
  },
];

function _getLegacyTitle(avgScore) {
  return LEGACY_TITLES.find(t => avgScore >= t.minScore) || LEGACY_TITLES[LEGACY_TITLES.length - 1];
}

function _getTrendAnalysis(score1, score2) {
  const diff = score2 - score1;
  if (diff >= 12) return { icon: '📈', label: 'Presidencia ascendente', desc: `Tu segundo mandato superó al primero en ${diff} puntos. Aprendiste, creciste y lo demostraste.` };
  if (diff <= -12) return { icon: '📉', label: 'Presidencia descendente', desc: `El segundo mandato fue ${Math.abs(diff)} puntos más difícil. Gobernar por segunda vez demostró ser el desafío mayor.` };
  return { icon: '⚖️', label: 'Presidencia consistente', desc: 'Mantuviste un nivel de gestión muy similar en ambos mandatos. La coherencia también es una virtud presidencial.' };
}

function _getDiplomaMini(score) {
  if (score >= 65) return { icon: '🥇', label: 'Oro',   css: 'gold'   };
  if (score >= 45) return { icon: '🥈', label: 'Plata', css: 'silver' };
  if (score >= 25) return { icon: '🥉', label: 'Bronce',css: 'bronze' };
  return              { icon: '📜', label: 'Gestión', css: 'none'   };
}

/**
 * Renderiza la pantalla especial de legado histórico para el 2do mandato ganado.
 * @param {object} state
 * @param {string} countryName
 */
function _showLegacyScreen(state, countryName) {
  const score2  = getScore(state.indicadores);
  const score1  = state.firstTermData?.score ?? score2;
  const avg     = Math.round((score1 + score2) / 2);
  const legacy  = _getLegacyTitle(avg);
  const trend   = _getTrendAnalysis(score1, score2);
  const dip1    = _getDiplomaMini(score1);
  const dip2    = _getDiplomaMini(score2);
  const id      = state.identity || {};
  const name    = id.presidentName || 'Presidente/a';
  const party   = id.partyName ? ` · ${id.partyName.split('(')[0].trim()}` : '';
  const diff    = { easy:'Fácil', normal:'Normal', hard:'Difícil', ultra:'Ultra 💀' }[state.difficulty] || 'Normal';
  const unlockedSet = new Set(state.unlockedAchievements || []);
  const unlockedAchs = ACHIEVEMENTS.filter(a => unlockedSet.has(a.id));
  const totalDecisions = (state.history || []).length;
  const crisisCount    = state.adata?.crisisCount ?? 0;
  const neverCorrupt   = !!state.adata?.neverCorrupt;

  // ── Indicadores finales ───────────────────────────────────────
  const statsRows = IND_META.map(m => {
    const val   = state.indicadores[m.key];
    const color = getColor(m.key, val);
    const zone  = getZone(m.key, val);
    return `<div class="lstat-item zone-${zone}">
      <span class="lstat-emoji">${m.emoji}</span>
      <span class="lstat-name">${m.name}</span>
      <span class="lstat-val" style="color:${color}">${Math.round(val)}${m.unit}</span>
    </div>`;
  }).join('');

  // ── Logros ───────────────────────────────────────────────────
  const achHTML = unlockedAchs.length
    ? unlockedAchs.map(a =>
        `<div class="ach-card unlocked" title="${a.desc}">
          <span class="ach-icon">${a.icon}</span>
          <span class="ach-name">${a.name}</span>
        </div>`).join('')
    : '<p style="color:var(--text-dim)">Sin logros desbloqueados.</p>';

  // ── Historial de decisiones — años 5-8 (turno 49→96 del 2do mandato) ──
  // En el 2do mandato, state.turn va de 1 a 48; los años son 1-4 del mandato.
  // Los mostramos como "Año 5", "Año 6", etc. del gobierno total.
  const byYear = { 5:[], 6:[], 7:[], 8:[] };
  (state.history || []).forEach(h => {
    const gameYear = 4 + Math.min(4, Math.ceil(h.turn / 12) || 1);
    if (byYear[gameYear]) byYear[gameYear].push(h);
  });
  const histTabsHTML = Object.entries(byYear)
    .filter(([, entries]) => entries.length > 0)
    .map(([year]) =>
      `<button class="hist-tab" data-year="${year}" onclick="window.__legacyHistTab(this)">Año ${year}</button>`
    ).join('');

  window.__SDR_LEGACY_HIST__  = { byYear, EVENTS };
  window.__legacyHistTab = function(el) {
    document.querySelectorAll('#legacy-hist-tabs .hist-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const yr      = el.dataset.year;
    const entries = window.__SDR_LEGACY_HIST__.byYear[yr] || [];
    const evs     = window.__SDR_LEGACY_HIST__.EVENTS || [];
    document.getElementById('legacy-hist-panel').innerHTML = entries.map(h => {
      const ev  = evs.find(e => e.id === h.eventId);
      const tit = ev ? ev.titulo : `Evento #${h.eventId}`;
      const opt = ev ? ev.opciones[h.opcionIndex]?.texto : '—';
      return `<div class="hist-item${h.isCrisis ? ' crisis-auto' : ''}">
        <div class="hist-turn-badge">Mes ${h.turn}</div>
        <div class="hist-event-name">${h.isCrisis ? '⚡ ' : ''}${tit}</div>
        <div class="hist-choice-text">→ ${opt || '—'}</div>
      </div>`;
    }).join('') || '<p style="color:var(--text-dim)">Sin decisiones en este año.</p>';
  };

  // ── HTML COMPLETO DE LA PANTALLA ──────────────────────────────
  const root = document.getElementById('legacy-root');
  if (!root) { console.error('[legacy] #legacy-root no encontrado'); return; }

  root.innerHTML = `

    <!-- ══ HERO HEADER ══════════════════════════════════════════ -->
    <div class="legacy-hero">
      <div class="legacy-hero-bg"></div>
      <div class="legacy-hero-stars" aria-hidden="true">
        ${Array.from({length: 18}, (_, i) => `<span class="lstar lstar-${i % 5}" style="--d:${(i * 37) % 360}deg;--r:${40 + (i % 4) * 12}px"></span>`).join('')}
      </div>
      <div class="legacy-hero-content">
        <div class="legacy-hero-flag">🏛️</div>
        <h1 class="legacy-hero-title">LEGADO PRESIDENCIAL</h1>
        <p class="legacy-hero-name">${name}${party}</p>
        <p class="legacy-hero-sub">8 años · Dos mandatos consecutivos · Modo ${diff}</p>
      </div>
    </div>

    <!-- ══ TÍTULO HISTÓRICO ══════════════════════════════════════ -->
    <div class="legacy-section">
      <div class="legacy-title-box" style="--ltc:${legacy.color}">
        <div class="ltb-banner">${legacy.banner}</div>
        <div class="ltb-icon">${legacy.icon}</div>
        <div class="ltb-title">${legacy.title}</div>
        <blockquote class="ltb-quote">"${legacy.quote}"</blockquote>
        <div class="ltb-trend">
          <span class="ltb-trend-icon">${trend.icon}</span>
          <div>
            <div class="ltb-trend-label">${trend.label}</div>
            <div class="ltb-trend-desc">${trend.desc}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ COMPARATIVA DE MANDATOS ══════════════════════════════ -->
    <div class="legacy-section">
      <h3 class="legacy-section-title">📊 Evolución de tu Presidencia</h3>
      <div class="lmand-grid">

        <div class="lmand-card lmand-${dip1.css}">
          <div class="lmand-label">1er Mandato</div>
          <div class="lmand-years">Años 1 – 4</div>
          <div class="lmand-medal">${dip1.icon}</div>
          <div class="lmand-score">${score1}</div>
          <div class="lmand-score-lbl">puntos</div>
          <div class="lmand-dip-label">Diploma de ${dip1.label}</div>
          <div class="lmand-dip-label" style="font-size:.7rem;opacity:.7">${state.firstTermData?.reelection?.pct ?? '—'}% votos</div>
        </div>

        <div class="lmand-arrow">
          <div class="lmand-arrow-line"></div>
          <div class="lmand-arrow-tip">▶</div>
          <div class="lmand-arrow-label">${trend.icon}</div>
        </div>

        <div class="lmand-card lmand-${dip2.css}">
          <div class="lmand-label">2do Mandato</div>
          <div class="lmand-years">Años 5 – 8</div>
          <div class="lmand-medal">${dip2.icon}</div>
          <div class="lmand-score">${score2}</div>
          <div class="lmand-score-lbl">puntos</div>
          <div class="lmand-dip-label">Diploma de ${dip2.label}</div>
        </div>

        <div class="lmand-arrow">
          <div class="lmand-arrow-line"></div>
          <div class="lmand-arrow-tip">▶</div>
          <div class="lmand-arrow-label">⚖️</div>
        </div>

        <div class="lmand-card lmand-avg">
          <div class="lmand-label">Promedio Total</div>
          <div class="lmand-years">8 años de gobierno</div>
          <div class="lmand-medal" style="color:${legacy.color}">${legacy.icon}</div>
          <div class="lmand-score" style="color:${legacy.color}">${avg}</div>
          <div class="lmand-score-lbl">puntos</div>
          <div class="lmand-dip-label" style="color:${legacy.color}">${legacy.short}</div>
        </div>

      </div>
    </div>

    <!-- ══ TU HUELLA ════════════════════════════════════════════ -->
    <div class="legacy-section">
      <h3 class="legacy-section-title">📋 Tu Huella en la Historia</h3>
      <div class="lhuella-grid">
        <div class="lhuella-item">
          <div class="lhuella-num">${totalDecisions}</div>
          <div class="lhuella-lbl">decisiones tomadas</div>
        </div>
        <div class="lhuella-item">
          <div class="lhuella-num">${crisisCount}</div>
          <div class="lhuella-lbl">crisis superadas</div>
        </div>
        <div class="lhuella-item">
          <div class="lhuella-num">${unlockedAchs.length}</div>
          <div class="lhuella-lbl">logros obtenidos</div>
        </div>
        <div class="lhuella-item ${neverCorrupt ? 'lhuella-good' : 'lhuella-warn'}">
          <div class="lhuella-num">${neverCorrupt ? '✅' : '⚠️'}</div>
          <div class="lhuella-lbl">${neverCorrupt ? 'Gestión intachable' : 'Decisiones cuestionables'}</div>
        </div>
      </div>
    </div>

    <!-- ══ ESTADO FINAL DEL PAÍS ════════════════════════════════ -->
    <div class="legacy-section">
      <h3 class="legacy-section-title">🌎 Estado Final del País</h3>
      <div class="lstat-grid">${statsRows}</div>
    </div>

    <!-- ══ LOGROS ════════════════════════════════════════════════ -->
    <div class="legacy-section">
      <h3 class="legacy-section-title">🏅 Logros de tu Presidencia</h3>
      <div class="achievements-grid">${achHTML}</div>
    </div>

    <!-- ══ BITÁCORA HISTÓRICA ════════════════════════════════════ -->
    <div class="legacy-section">
      <h3 class="legacy-section-title">📜 Bitácora del Segundo Mandato</h3>
      <p style="font-size:.82rem;color:var(--text-dim);margin-bottom:12px">
        Decisiones tomadas durante los años 5 a 8 de tu gobierno.
      </p>
      <div id="legacy-hist-tabs" style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${histTabsHTML}
      </div>
      <div id="legacy-hist-panel"></div>
    </div>

    <!-- ══ ACCIONES FINALES ══════════════════════════════════════ -->
    <div class="legacy-actions">
      <button class="btn btn-gold" id="legacy-capture-btn" onclick="window.__legacyCapture()">
        📸 Imagen del Legado
      </button>
    </div>
    <div id="legacy-capture-status" style="text-align:center;font-size:.78rem;color:var(--text-dim);margin-bottom:10px;min-height:1.2em"></div>
    <div id="legacy-share-options" style="display:none;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:16px"></div>
    <div class="legacy-actions" style="margin-bottom:40px">
      <button class="btn btn-primary" onclick="restartGame()">🔄 Nueva Partida</button>
      <button class="btn btn-outline" onclick="openManual()">📚 Manual Didáctico</button>
    </div>
  `;

  // Activar primer tab del historial
  const firstTab = root.querySelector('#legacy-hist-tabs .hist-tab');
  if (firstTab) {
    firstTab.classList.add('active');
    window.__legacyHistTab(firstTab);
  }

  // Rellenar legacy share card y exponer captura
  _populateLegacyShareCard(state, score1, score2, avg, legacy, name, party, diff);
  window.__legacyCapture = () => _captureLegacy();

  showScreen('screen-legacy');
}

// ── LEGACY SHARE CARD ─────────────────────────────────────────

function _populateLegacyShareCard(state, score1, score2, avg, legacy, name, party, diff) {
  const card = document.getElementById('legacy-share-card');
  if (!card) return;

  const dip1 = _getDiplomaMini(score1);
  const dip2 = _getDiplomaMini(score2);
  const id   = state.identity || {};
  const nm   = id.presidentName || name;
  const par  = party || (id.partyName ? ` · ${id.partyName.split('(')[0].trim().substring(0, 24)}` : '');
  const crisisCount = state.adata?.crisisCount ?? 0;

  card.innerHTML = `
    <div class="sc-header">
      <span class="sc-logo-icon">🏛️</span>
      <div class="sc-logo-text">
        <div class="sc-game-name">El Peso del Poder</div>
        <div class="sc-game-sub">Simulador de Economía Política</div>
      </div>
      <div class="sc-difficulty-badge">${diff} · 8 años</div>
    </div>

    <div class="sc-legacy-banner" style="background:linear-gradient(135deg,rgba(${_hexToRgb(legacy.color)},.18),transparent);border-color:${legacy.color}40">
      <span class="sc-legacy-icon">${legacy.icon}</span>
      <div class="sc-legacy-info">
        <div class="sc-legacy-banner-title" style="color:${legacy.color}">${legacy.title}</div>
        <div class="sc-legacy-name">${nm}${par}</div>
        <div class="sc-legacy-term">2 mandatos · 8 años de gobierno</div>
      </div>
    </div>

    <div class="sc-legacy-scores">
      <div class="sc-leg-term sc-leg-${dip1.css}">
        <div class="sc-leg-medal">${dip1.icon}</div>
        <div class="sc-leg-num">${score1}</div>
        <div class="sc-leg-lbl">1er mandato</div>
      </div>
      <div class="sc-leg-arrow">→</div>
      <div class="sc-leg-term sc-leg-${dip2.css}">
        <div class="sc-leg-medal">${dip2.icon}</div>
        <div class="sc-leg-num">${score2}</div>
        <div class="sc-leg-lbl">2do mandato</div>
      </div>
      <div class="sc-leg-arrow">=</div>
      <div class="sc-leg-term sc-leg-avg" style="--lc:${legacy.color}">
        <div class="sc-leg-medal" style="color:${legacy.color}">${legacy.icon}</div>
        <div class="sc-leg-num" style="color:${legacy.color}">${avg}</div>
        <div class="sc-leg-lbl">promedio</div>
      </div>
    </div>

    <div class="sc-legacy-quote">"${legacy.quote.substring(0, 110)}…"</div>

    <div class="sc-footer">¿Podés hacer mejor? · Creado por ProfeD ✦ · ${crisisCount} crisis superadas</div>
  `;
  card.className = `share-card sc-theme-${_getDiplomaMini(avg).css} sc-legacy-card`;
}

function _hexToRgb(hex) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return '201,168,76'; // fallback dorado
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

/** Captura la legacy share card */
async function _captureLegacy() {
  const btn    = document.getElementById('legacy-capture-btn');
  const status = document.getElementById('legacy-capture-status');
  const opts   = document.getElementById('legacy-share-options');
  if (btn)    btn.disabled = true;
  if (opts)   opts.style.display = 'none';
  if (status) status.textContent = '⏳ Generando imagen del legado…';

  try {
    if (!window.html2canvas) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src   = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    const card = document.getElementById('legacy-share-card');
    if (!card) throw new Error('No se encontró #legacy-share-card');

    card.style.left    = '-9999px';
    card.style.top     = '0';
    card.style.opacity = '1';

    const canvas = await window.html2canvas(card, {
      scale: 2, useCORS: true, allowTaint: true, logging: false,
      width: 800, height: 460,
    });

    card.style.opacity = '0';
    if (status) status.textContent = '✅ ¡Imagen del legado lista!';
    _showLegacyShareOptions(canvas, opts);
  } catch (e) {
    if (status) status.textContent = '❌ Error al generar la imagen.';
    console.error('[legacy-capture]', e);
  } finally {
    if (btn) btn.disabled = false;
  }
}

function _showLegacyShareOptions(canvas, opts) {
  if (!opts) return;
  opts.style.display = 'flex';
  opts.innerHTML = '';
  const dataUrl = canvas.toDataURL('image/png');

  const dlBtn = document.createElement('button');
  dlBtn.className = 'btn btn-gold share-btn';
  dlBtn.innerHTML = '📥 Descargar';
  dlBtn.onclick = () => {
    const a = document.createElement('a');
    a.download = 'el-peso-del-poder-legado.png';
    a.href = dataUrl;
    a.click();
  };
  opts.appendChild(dlBtn);

  if (navigator.clipboard?.write) {
    const cpBtn = document.createElement('button');
    cpBtn.className = 'btn btn-outline share-btn';
    cpBtn.innerHTML = '📋 Copiar';
    cpBtn.onclick = async () => {
      try {
        const blob = await fetch(dataUrl).then(r => r.blob());
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        cpBtn.textContent = '✅ Copiado!';
        setTimeout(() => { cpBtn.textContent = '📋 Copiar'; }, 2000);
      } catch { cpBtn.textContent = '❌ No disponible'; }
    };
    opts.appendChild(cpBtn);
  }

  if (navigator.share) {
    const shareBtn = document.createElement('button');
    shareBtn.className = 'btn btn-outline share-btn';
    shareBtn.innerHTML = '📤 Compartir';
    shareBtn.onclick = async () => {
      try {
        const blob = await fetch(dataUrl).then(r => r.blob());
        const file = new File([blob], 'el-peso-del-poder-legado.png', { type: 'image/png' });
        const sd = { title: 'El Peso del Poder — Legado Presidencial', text: '¡Completé 8 años de mandato en El Peso del Poder! Creado por ProfeD.', files: [file] };
        if (navigator.canShare?.(sd)) await navigator.share(sd);
        else await navigator.share({ title: sd.title, text: sd.text });
      } catch (e) { if (e.name !== 'AbortError') console.warn('[legacy-share]', e); }
    };
    opts.appendChild(shareBtn);
  }
}

// ── SHARE CARD ────────────────────────────────────────────────

/**
 * Rellena el #share-card con los datos actuales de la partida
 * para captura con html2canvas.
 * @param {object} state
 * @param {number} score
 * @param {string|null} diploma
 */
function _populateShareCard(state, score, diploma) {
  const card = document.getElementById('share-card');
  if (!card) return;

  const medals  = { gold:'🥇', silver:'🥈', bronze:'🥉', null:'📜' };
  const labels  = { gold:'DIPLOMA DE ORO', silver:'DIPLOMA DE PLATA', bronze:'DIPLOMA DE BRONCE', null:'GESTIÓN CRITICADA' };
  const key     = diploma || 'null';
  const id      = state.identity || {};
  const name    = id.presidentName || 'Presidente/a';
  const party   = (id.partyName || '').split('(')[0].trim().substring(0, 28);
  const diff    = { easy:'Fácil', normal:'Normal', hard:'Difícil', ultra:'Ultra 💀' }[state.difficulty] || '';
  const turns   = state.turn || 0;

  // Indicadores clave para la tarjeta (4 más representativos)
  const keyInds = [
    { key:'confianza', emoji:'🤝', label:'Confianza', unit:'%'  },
    { key:'pobreza',   emoji:'📉', label:'Pobreza',   unit:'%'  },
    { key:'ipc',       emoji:'📈', label:'Inflación', unit:'%'  },
    { key:'reservas',  emoji:'💰', label:'Reservas',  unit:'pts'},
  ];

  const BAD  = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);
  const THRS = {
    ipc:      { low_bad:false, warn:40, danger:65 },
    pobreza:  { low_bad:false, warn:30, danger:55 },
    confianza:{ low_bad:true,  warn:60, danger:30 },
    reservas: { low_bad:true,  warn:60, danger:30 },
  };
  const _color = (k, v) => {
    const t = THRS[k]; if (!t) return '#27ae60';
    if (t.low_bad) return v <= t.danger ? '#e74c3c' : v <= t.warn ? '#f39c12' : '#27ae60';
    return v >= t.danger ? '#e74c3c' : v >= t.warn ? '#f39c12' : '#27ae60';
  };

  const statsHtml = keyInds.map(m => {
    const val = Math.round(state.indicadores[m.key] ?? 0);
    const col = _color(m.key, val);
    return `<div class="sc-stat">
      <span class="sc-stat-emoji">${m.emoji}</span>
      <span class="sc-stat-label">${m.label}</span>
      <span class="sc-stat-value" style="color:${col}">${val}${m.unit}</span>
    </div>`;
  }).join('');

  card.innerHTML = `
    <div class="sc-header">
      <span class="sc-logo-icon">🏛️</span>
      <div class="sc-logo-text">
        <div class="sc-game-name">El Peso del Poder</div>
        <div class="sc-game-sub">Simulador de Economía Política</div>
      </div>
      <div class="sc-difficulty-badge">${diff} · ${turns} meses</div>
    </div>
    <div class="sc-diploma-zone sc-diploma-${key}">
      <span class="sc-medal">${medals[key]}</span>
      <div class="sc-diploma-info">
        <div class="sc-diploma-tipo">${labels[key]}</div>
        <div class="sc-diploma-name">${name}${party ? ` · ${party}` : ''}</div>
        <div class="sc-score-wrap">
          <span class="sc-score-num">${score}</span>
          <span class="sc-score-lbl">pts</span>
        </div>
      </div>
    </div>
    <div class="sc-stats-grid">${statsHtml}</div>
    <div class="sc-footer">
      ¿Podés hacer mejor? · Creado por ProfeD ✦
    </div>
  `;

  // Clase de color según diploma
  card.className = `share-card sc-theme-${key}`;
}

// ── CAPTURA Y COMPARTIR ───────────────────────────────────────

/** Canvas de la última captura para poder copiar/compartir sin recapturar. */
let _lastCanvas = null;

/**
 * Captura la share card como imagen y ofrece opciones de compartir.
 * Versión mejorada compatible con descarga, clipboard y Web Share API.
 */
export async function captureResults() {
  const btn    = document.getElementById('capture-btn');
  const status = document.getElementById('capture-status');
  const opts   = document.getElementById('share-options');
  if (btn)  btn.disabled = true;
  if (opts) opts.style.display = 'none';
  if (status) status.textContent = '⏳ Generando imagen…';

  try {
    if (!window.html2canvas) {
      await new Promise((res, rej) => {
        const s  = document.createElement('script');
        s.src    = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }

    // Asegurarse de que la share card tenga los datos actuales
    // (el state ya fue seteado en showEndScreen)
    const card = document.getElementById('share-card');
    if (!card) throw new Error('No se encontró #share-card');

    // Mostrar temporalmente para que html2canvas pueda renderizarla
    card.style.left    = '-9999px';
    card.style.top     = '0';
    card.style.opacity = '1';

    const canvas = await window.html2canvas(card, {
      scale:      2,
      useCORS:    true,
      allowTaint: true,
      logging:    false,
      width:      800,
      height:     420,
    });
    _lastCanvas = canvas;

    if (status) status.textContent = '✅ ¡Imagen lista!';

    // Mostrar opciones de compartir
    _showShareOptions(canvas);

  } catch (e) {
    if (status) status.textContent = '❌ Error al generar la imagen. Intentá de nuevo.';
    console.error('[capture]', e);
  } finally {
    if (btn) btn.disabled = false;
  }
}

/**
 * Muestra los botones de compartir con el canvas generado.
 * @param {HTMLCanvasElement} canvas
 */
// ── FEATURE 4: LEGADO DE DECISIONES ─────────────────────────────

/**
 * Renderiza la sección "Decisiones Clave del Mandato" en la pantalla final.
 * Calcula las 3 decisiones con mayor impacto total sobre los indicadores
 * y genera un análisis automático para cada una.
 * @param {object} state
 */
function _renderLegacyDecisions(state) {
  if (!state.decisionLog || state.decisionLog.length < 3) return;

  // Crear o reutilizar el contenedor
  let container = document.getElementById('end-key-decisions');
  if (!container) {
    container = document.createElement('section');
    container.id        = 'end-key-decisions';
    container.className = 'end-section key-decisions-section';
    // Insertar antes de logros o historial (lo que exista primero)
    const anchor = document.getElementById('end-achievements')
                || document.getElementById('end-history');
    if (anchor?.parentNode) anchor.parentNode.insertBefore(container, anchor);
    else document.getElementById('screen-end')?.appendChild(container);
  }

  const top = _getTopDecisions(state);
  if (top.length === 0) { container.style.display = 'none'; return; }

  container.innerHTML = `
    <h3 class="key-dec-heading">🔑 Decisiones Clave del Mandato</h3>
    <p class="key-dec-subtitle">Las ${top.length} decisiones con mayor impacto en los indicadores:</p>
    ${top.map((d, i) => `
      <div class="key-dec-card">
        <div class="key-dec-header">
          <span class="key-dec-rank">#${i + 1}</span>
          <span class="key-dec-turn">Mes ${d.turn}</span>
          <span class="key-dec-tag">${d.tag}</span>
        </div>
        <div class="key-dec-title">${d.eventTitle}</div>
        <div class="key-dec-choice">→ ${d.opcionText}</div>
        <div class="key-dec-analysis ${d.analysisBad ? 'kda-bad' : 'kda-good'}">${d.analysis}</div>
      </div>
    `).join('')}
  `;
}

/**
 * Calcula las 3 decisiones con mayor impacto total y genera su análisis.
 * @param {object} state
 * @returns {Array<object>}
 */
function _getTopDecisions(state) {
  const log = state.decisionLog || [];
  const BAD = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);
  const IND_LABELS = {
    ipc:'la inflación', deuda:'la deuda', reservas:'las reservas',
    riesgo:'el riesgo país', pobreza:'la pobreza', desocupacion:'el desempleo',
    produccion:'la producción', confianza:'la confianza',
  };

  const scored = log.map(d => {
    let totalImpact = 0;
    let biggestKey  = null;
    let biggestDelta = 0;

    for (const k of Object.keys(d.indBefore)) {
      const before = d.indBefore[k] ?? 0;
      const after  = d.indAfter[k]  ?? before;
      const delta  = after - before;
      const abs    = Math.abs(delta);
      totalImpact += abs;
      if (abs > biggestDelta) { biggestDelta = abs; biggestKey = k; }
    }

    let analysis   = '';
    let analysisBad = false;

    if (biggestKey && biggestDelta >= 1) {
      const delta  = (d.indAfter[biggestKey] ?? 0) - (d.indBefore[biggestKey] ?? 0);
      const sign   = delta > 0 ? '+' : '';
      const label  = IND_LABELS[biggestKey] || biggestKey;
      const isBad  = (BAD.has(biggestKey) && delta > 0) || (!BAD.has(biggestKey) && delta < 0);
      analysisBad  = isBad;

      if (isBad) {
        const cap = label.charAt(0).toUpperCase() + label.slice(1);
        analysis = `⚠️ ${cap} se deterioró ${sign}${Math.round(delta)} pts — uno de los golpes más duros del mandato.`;
      } else {
        const cap = label.charAt(0).toUpperCase() + label.slice(1);
        analysis = `✅ ${cap} mejoró ${sign}${Math.round(delta)} pts — uno de los mayores logros del mandato.`;
      }
    } else {
      analysis    = '📊 Decisión estructural de alto impacto acumulado.';
      analysisBad = false;
    }

    return { ...d, totalImpact, analysis, analysisBad };
  });

  scored.sort((a, b) => b.totalImpact - a.totalImpact);
  return scored.slice(0, 3);
}

function _showShareOptions(canvas) {
  const opts = document.getElementById('share-options');
  if (!opts) return;

  opts.style.display = 'flex';
  opts.innerHTML = '';

  const dataUrl = canvas.toDataURL('image/png');

  // ── Descargar ───────────────────────────────────────────
  const dlBtn = document.createElement('button');
  dlBtn.className   = 'btn btn-gold share-btn';
  dlBtn.innerHTML   = '📥 Descargar';
  dlBtn.onclick = () => {
    const link     = document.createElement('a');
    link.download  = 'el-peso-del-poder-resultado.png';
    link.href      = dataUrl;
    link.click();
  };
  opts.appendChild(dlBtn);

  // ── Copiar al portapapeles ──────────────────────────────
  if (navigator.clipboard?.write) {
    const cpBtn = document.createElement('button');
    cpBtn.className = 'btn btn-outline share-btn';
    cpBtn.innerHTML = '📋 Copiar';
    cpBtn.onclick = async () => {
      try {
        const blob = await fetch(dataUrl).then(r => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        cpBtn.textContent = '✅ Copiado!';
        setTimeout(() => { cpBtn.textContent = '📋 Copiar'; }, 2000);
      } catch {
        cpBtn.textContent = '❌ No disponible';
      }
    };
    opts.appendChild(cpBtn);
  }

  // ── Web Share API (móvil / compatible) ─────────────────
  if (navigator.share) {
    const shareBtn = document.createElement('button');
    shareBtn.className = 'btn btn-outline share-btn';
    shareBtn.innerHTML = '📤 Compartir';
    shareBtn.onclick = async () => {
      try {
        const blob = await fetch(dataUrl).then(r => r.blob());
        const file = new File([blob], 'el-peso-del-poder.png', { type: 'image/png' });
        const shareData = {
          title: 'El Peso del Poder',
          text:  '¡Terminé mi mandato en El Peso del Poder, el simulador de economía política! ¿Podés hacer mejor? Creado por ProfeD.',
          files: [file],
        };
        if (navigator.canShare?.(shareData)) {
          await navigator.share(shareData);
        } else {
          await navigator.share({ title: shareData.title, text: shareData.text });
        }
      } catch (e) {
        if (e.name !== 'AbortError') console.warn('[share]', e);
      }
    };
    opts.appendChild(shareBtn);
  }
}
