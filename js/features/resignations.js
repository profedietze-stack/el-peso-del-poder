"use strict";

// ============================================================
// RESIGNATIONS.JS — Sistema de renuncias y reemplazos de gabinete
//
// Flujo completo:
//   1. Botón "Pedir Renuncia" en el modal del asesor
//   2. Modal de confirmación con efectos negativos y advertencias
//   3. Modal de selección de reemplazo (ministros/VP no usados)
//   4. Aplicación de efectos en estado + animaciones
//
// Límite: máx 2 renuncias por slot. La 3.a intento → derrota.
// ============================================================

import { MINISTERS, MINISTER_SLOTS, getMinisterById,
         getCombinedEffectMods }  from '../data/ministers.js';
import { VICEPRESIDENTS, getVPById } from '../data/vicepresident.js';
import { applyEffects }            from '../engine/scoring.js';

// ── Efectos negativos por renuncia ────────────────────────────
// 'first'  = primera renuncia (1 reemplazo previo → pasando al 2.o)
// 'second' = segunda renuncia (2 reemplazos previos → pasando al 3.o; derrota)
// Nota: 'second' no se llega a aplicar (es derrota), pero se muestra en el
// modal de advertencia como "coste potencial".
const RESIGNATION_EFFECTS = {
  vp: {
    first:  { confianza: -15, riesgo:  10, ipc:  2, deuda:  2 },
    second: { confianza: -22, riesgo:  15, ipc:  4, deuda:  4, pobreza: 3 },
  },
  economia: {
    first:  { confianza:  -8, riesgo:   6, ipc:  5, deuda:  3 },
    second: { confianza: -14, riesgo:  10, ipc:  9, deuda:  6 },
  },
  social: {
    first:  { confianza:  -7, pobreza:  6, desocupacion: 3 },
    second: { confianza: -12, pobreza: 10, desocupacion: 6, riesgo: 3 },
  },
  gabinete: {
    first:  { confianza:  -9, riesgo:   6 },
    second: { confianza: -15, riesgo:  10, produccion: -3, ipc: 2 },
  },
  produccion: {
    first:  { confianza:  -6, produccion: -6, reservas: -3, desocupacion:  2 },
    second: { confianza: -11, produccion: -10, reservas: -5, desocupacion: 4 },
  },
};

// ── Labels de indicadores ─────────────────────────────────────
const IND_LABELS = {
  ipc:'Inflación', deuda:'Deuda', reservas:'Reservas', riesgo:'Riesgo País',
  pobreza:'Pobreza', desocupacion:'Desempleo', produccion:'Producción', confianza:'Confianza',
};
const BAD_KEYS = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);

// ── Estado interno del módulo ─────────────────────────────────
// Se setea antes de cada modal para que los onclick tengan contexto.
let _state      = null;  // referencia al estado del juego
let _pendingSlot = null; // slot cuya renuncia se está procesando
let _onApplied  = null;  // callback(slotId, newId) al confirmar reemplazo
let _onDefeat   = null;  // callback() si se activa la derrota por colapso

// ── API pública ───────────────────────────────────────────────

/**
 * Inicializa el módulo con referencias al estado y callbacks.
 * Llamar desde main.js al inicio de cada turno o al abrir el modal.
 */
export function initResignations(state, onApplied, onDefeat) {
  _state    = state;
  _onApplied = onApplied;
  _onDefeat  = onDefeat;
}

/**
 * Número de renuncias ocurridas en un slot (= reemplazos aplicados).
 * 0 = miembro original, 1 = 1.er reemplazo activo, 2 = 2.o reemplazo activo (último).
 */
export function getResignationCount(slotId, state) {
  const hist = state?.cabinetHistory?.[slotId];
  return hist ? hist.length - 1 : 0;
}

/**
 * Devuelve el ID del miembro actual de un slot.
 */
export function getCurrentMember(slotId, state) {
  const hist = state?.cabinetHistory?.[slotId];
  return hist ? hist[hist.length - 1] : null;
}

/**
 * Devuelve los miembros disponibles para reemplazar un slot
 * (los que NO aparecen en cabinetHistory de ese slot).
 */
export function getAvailableReplacements(slotId, state) {
  const used = new Set(state?.cabinetHistory?.[slotId] || []);
  if (slotId === 'vp') {
    return VICEPRESIDENTS.filter(v => !used.has(v.id));
  }
  return MINISTERS.filter(m => m.slot === slotId && !used.has(m.id));
}

// ── Apertura del modal de confirmación ───────────────────────

/**
 * Abre el modal de confirmación de renuncia para un slot.
 * Llamado desde el botón en el advisor modal (window.__openResignConfirm).
 */
export function openResignConfirm(slotId) {
  if (!_state) return;
  _pendingSlot = slotId;

  const count = getResignationCount(slotId, _state);
  const overlay = document.getElementById('resign-confirm-overlay');
  if (!overlay) return;

  // Caso: 3.er intento → derrota directa
  if (count >= 2) {
    _renderCollapseWarning();
    overlay.classList.add('open');
    return;
  }

  _renderResignConfirm(slotId, count);
  overlay.classList.add('open');
}

export function closeResignConfirm() {
  const overlay = document.getElementById('resign-confirm-overlay');
  if (overlay) overlay.classList.remove('open');
  _pendingSlot = null;
}

// ── Apertura del modal de selección de reemplazo ─────────────

export function openReplacementModal(slotId) {
  const overlay = document.getElementById('resign-replace-overlay');
  if (!overlay) return;

  _pendingSlot = slotId;
  _renderReplacementModal(slotId);
  overlay.classList.add('open');
}

export function closeReplacementModal() {
  const overlay = document.getElementById('resign-replace-overlay');
  if (overlay) overlay.classList.remove('open');
}

// ── Ejecución de la renuncia ──────────────────────────────────

/**
 * Confirma la renuncia:
 * - Si count >= 2 → activa derrota por colapso
 * - Si count < 2 → aplica efectos y abre modal de reemplazo
 */
export function confirmResign() {
  if (!_state || !_pendingSlot) return;
  const count = getResignationCount(_pendingSlot, _state);
  closeResignConfirm();

  if (count >= 2) {
    // ── Derrota: gabinete colapsó ─────────────────────────────
    if (_onDefeat) _onDefeat(_pendingSlot);
    return;
  }

  // ── Abrir selección de reemplazo ─────────────────────────────
  openReplacementModal(_pendingSlot);
}

/**
 * Aplica el reemplazo: actualiza estado, efectos y notifica.
 * @param {string} newId — ID del nuevo miembro seleccionado
 */
export function selectReplacement(newId) {
  if (!_state || !_pendingSlot) return;
  const slotId = _pendingSlot;
  const count  = getResignationCount(slotId, _state); // 0 o 1

  // ── 1. Agregar al historial ───────────────────────────────────
  if (!_state.cabinetHistory) _state.cabinetHistory = {};
  if (!_state.cabinetHistory[slotId]) _state.cabinetHistory[slotId] = [];
  _state.cabinetHistory[slotId].push(newId);

  // ── 2. Actualizar miembro activo en state ─────────────────────
  if (slotId === 'vp') {
    _state.identity.vpId = newId;
    // Resetear credibilidad del VP
    if (_state.advisors?.vp) {
      _state.advisors.vp.credibility = 3;
      _state.advisors.vp.usedCount   = 0;
    }
    // Actualizar effectMods del VP nuevo
    const newVP = getVPById(newId);
    if (newVP?.effectMods) {
      for (const [k, v] of Object.entries(newVP.effectMods)) {
        _state.effectMods[k] = (_state.effectMods[k] ?? 1) * v;
      }
    }
  } else {
    _state.ministers[slotId] = newId;
    // Resetear credibilidad del slot
    if (_state.advisors?.[slotId]) {
      _state.advisors[slotId].credibility   = 3;
      _state.advisors[slotId].usedThisTurn  = false;
    }
    // Recalcular effectMods combinados (todos los ministros)
    const newMods = getCombinedEffectMods(_state.ministers);
    // VP mods (mantenerlos)
    const vp = getVPById(_state.identity?.vpId);
    if (vp?.effectMods) {
      for (const [k, v] of Object.entries(vp.effectMods)) {
        newMods[k] = (newMods[k] ?? 1) * v;
      }
    }
    _state.effectMods = newMods;
  }

  // ── 3. Aplicar efectos negativos de la renuncia ───────────────
  const effectKey = count === 0 ? 'first' : 'second';
  const fx = RESIGNATION_EFFECTS[slotId]?.[effectKey] || {};
  _state.indicadores = applyEffects(_state.indicadores, fx, {});

  // ── 4. Cerrar modal y notificar ───────────────────────────────
  closeReplacementModal();
  if (_onApplied) _onApplied(slotId, newId, fx);
}

// ── Renderers internos ────────────────────────────────────────

function _renderResignConfirm(slotId, count) {
  const isVP   = slotId === 'vp';
  const isLast = count === 1; // si confirmamos, este es el ÚLTIMO reemplazo
  const effectKey = count === 0 ? 'first' : 'second';
  const fx = RESIGNATION_EFFECTS[slotId]?.[effectKey] || {};

  const currentId = getCurrentMember(slotId, _state);
  const member    = isVP ? getVPById(currentId) : getMinisterById(currentId);
  const slotMeta  = !isVP ? MINISTER_SLOTS.find(s => s.id === slotId) : null;
  const slotLabel = isVP ? 'Vicepresidencia' : (slotMeta?.short || slotId);
  const slotColor = isVP ? '#c9a84c' : (slotMeta?.color || '#aaa');

  const effectsHTML = _buildEffectsHTML(fx);
  const warningHTML = isLast
    ? `<div class="rc-last-warning">
        ⚠️ <strong>ATENCIÓN:</strong> Este será el <strong>último reemplazo posible</strong>
        para este cargo. Si pedís otra renuncia, el gabinete colapsará y perderás el mandato.
      </div>`
    : '';

  const confirmEl = document.getElementById('rc-content');
  if (!confirmEl) return;
  confirmEl.innerHTML = `
    <div class="rc-header" style="border-color:${slotColor}22">
      ${member?.avatarUrl
        ? `<img class="rc-avatar" src="${member.avatarUrl}" alt="${member.name}">`
        : `<div class="rc-avatar-placeholder">👤</div>`}
      <div class="rc-info">
        <div class="rc-name" style="color:${slotColor}">${member?.name || '—'}</div>
        <div class="rc-role">${member?.title || slotLabel}</div>
        <div class="rc-slot-badge" style="background:${slotColor}22;border-color:${slotColor}44">
          ${isVP ? '🏛️' : _slotEmoji(slotId)} ${slotLabel}
        </div>
      </div>
    </div>
    <p class="rc-question">¿Estás seguro de que querés pedirle la renuncia?</p>
    ${warningHTML}
    <div class="rc-effects-label">📉 Impacto inmediato en los indicadores:</div>
    <div class="rc-effects">${effectsHTML}</div>
  `;

  // Actualizar título del modal
  const titleEl = document.getElementById('rc-title');
  if (titleEl) titleEl.textContent = `Pedir renuncia — ${slotLabel}`;
}

function _renderCollapseWarning() {
  const confirmEl = document.getElementById('rc-content');
  if (!confirmEl) return;
  confirmEl.innerHTML = `
    <div class="rc-collapse-warning">
      <div class="rc-collapse-icon">💀</div>
      <div class="rc-collapse-title">El gabinete está al límite</div>
      <p class="rc-collapse-desc">
        Ya reemplazaste al miembro de esta cartera dos veces. Este es el
        <strong>tercer intento de renuncia</strong> en el mismo ministerio.
      </p>
      <p class="rc-collapse-desc">
        Si continuás, <strong>todo el gabinete renunciará en solidaridad</strong>,
        perderás el apoyo parlamentario y el Congreso te obligará a llamar a
        elecciones anticipadas.
      </p>
      <p class="rc-collapse-desc rc-collapse-final">
        ¿Estás seguro de que querés proceder sabiendo que
        <strong>perderás el mandato?</strong>
      </p>
    </div>
  `;
  const titleEl = document.getElementById('rc-title');
  if (titleEl) titleEl.textContent = '⚠️ Crisis Terminal de Gabinete';

  // Cambiar el botón de confirmar a "rojo total"
  const confirmBtn = document.getElementById('rc-confirm-btn');
  if (confirmBtn) {
    confirmBtn.textContent = 'Sí, pedir la renuncia (PERDERÉ EL MANDATO)';
    confirmBtn.classList.add('rc-btn-collapse');
  }
}

function _renderReplacementModal(slotId) {
  const isVP        = slotId === 'vp';
  const replacements = getAvailableReplacements(slotId, _state);
  const slotMeta    = !isVP ? MINISTER_SLOTS.find(s => s.id === slotId) : null;
  const slotLabel   = isVP ? 'Vicepresidencia' : (slotMeta?.short || slotId);
  const slotColor   = isVP ? '#c9a84c' : (slotMeta?.color || '#aaa');

  const titleEl = document.getElementById('rr-title');
  if (titleEl) titleEl.textContent = `Seleccioná el nuevo ${slotLabel}`;

  const listEl = document.getElementById('rr-list');
  if (!listEl) return;

  if (replacements.length === 0) {
    listEl.innerHTML = `<p class="rr-empty">No hay candidatos disponibles para este cargo.</p>`;
    return;
  }

  listEl.innerHTML = replacements.map(m => {
    const passiveHTML = _buildPassiveHTML(m.passive || {});
    return `
      <div class="rr-card" onclick="window.__selectReplacement('${m.id}')">
        <div class="rr-card-top">
          <img class="rr-avatar" src="${m.avatarUrl}" alt="${m.name}"
               onerror="this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=${m.id}'">
          <div class="rr-card-info">
            <div class="rr-name" style="color:${slotColor}">${m.name}</div>
            <div class="rr-title">${m.title}</div>
            <div class="rr-profile">${m.profile}</div>
          </div>
        </div>
        <p class="rr-bio">${m.bio}</p>
        <div class="rr-passives-label">Pasivos de inicio:</div>
        <div class="rr-passives">${passiveHTML}</div>
        <button class="btn rr-select-btn" style="border-color:${slotColor};color:${slotColor}"
                onclick="window.__selectReplacement('${m.id}');event.stopPropagation()">
          ✓ Nombrar como nuevo ${isVP ? 'Vicepresidente/a' : slotMeta?.short || slotId}
        </button>
      </div>
    `;
  }).join('');
}

// ── Helpers de display ────────────────────────────────────────

function _buildEffectsHTML(fx) {
  return Object.entries(fx)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => {
      const isBad = (BAD_KEYS.has(k) && v > 0) || (!BAD_KEYS.has(k) && v < 0);
      const sign  = v > 0 ? '+' : '';
      return `<span class="rc-effect ${isBad ? 'bad' : 'good'}">
        ${IND_LABELS[k] || k} <strong>${sign}${v}</strong>
      </span>`;
    }).join('');
}

function _buildPassiveHTML(passive) {
  return Object.entries(passive)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => {
      const isBad = (BAD_KEYS.has(k) && v > 0) || (!BAD_KEYS.has(k) && v < 0);
      const sign  = v > 0 ? '+' : '';
      return `<span class="rr-passive ${isBad ? 'bad' : 'good'}">${IND_LABELS[k] || k} ${sign}${v}</span>`;
    }).join('');
}

function _slotEmoji(slotId) {
  const map = { vp:'🏛️', economia:'💰', social:'🤝', gabinete:'🏛️', produccion:'🏭' };
  return map[slotId] || '👤';
}

/**
 * Devuelve el HTML del badge de renuncia para el botón en el modal de asesor.
 * Incluye el label y estilo según el número de renuncias previas.
 */
export function buildResignBtnHTML(slotId, state) {
  const count = getResignationCount(slotId, state);
  if (count >= 2) {
    // 3.er intento → botón rojo intenso con advertencia
    return `<button class="btn-resign btn-resign-danger"
              onclick="window.__openResignConfirm('${slotId}')">
              💀 Pedir Renuncia — Riesgo de Derrota
            </button>`;
  }
  if (count === 1) {
    // 2.o reemplazo → botón naranja con advertencia
    return `<button class="btn-resign btn-resign-warn"
              onclick="window.__openResignConfirm('${slotId}')">
              ⚠️ Pedir Renuncia — Último Reemplazo
            </button>`;
  }
  // 1.er intento → botón discreto
  return `<button class="btn-resign"
            onclick="window.__openResignConfirm('${slotId}')">
            🚪 Pedir Renuncia
          </button>`;
}
