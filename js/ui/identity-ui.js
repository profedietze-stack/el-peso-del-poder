"use strict";

import { VICEPRESIDENTS, getDefaultVP } from '../data/vicepresident.js';
import { showScreen }                    from './screens.js';

// ============================================================
// IDENTITY UI — Pantalla de identidad política
//
// Permite al jugador definir:
//   1. Nombre del presidente/a (con sugerencias de Latinoamérica)
//   2. Nombre del partido político (ídem)
//   3. Vicepresidente/a (4 opciones con stats y avatar)
//
// Aparece entre el menú inicial y la pantalla de herencia.
// ============================================================

// Estado local
let _sel       = { presidentName: '', partyName: '', vpId: '' };
let _onConfirm = null;

// Indicadores donde valor BAJO es mejor (para colorear chips)
const HIGH_BAD = new Set(['ipc', 'deuda', 'riesgo', 'pobreza', 'desocupacion']);
const IND_ICON = {
  ipc: '📈', deuda: '💸', reservas: '💰', riesgo: '⚠️',
  pobreza: '📉', desocupacion: '👥', produccion: '🏭', confianza: '🤝',
};
const IND_SHORT = {
  ipc: 'IPC', deuda: 'Deuda', reservas: 'Reservas', riesgo: 'Riesgo',
  pobreza: 'Pobreza', desocupacion: 'Desocup.', produccion: 'Producción', confianza: 'Confianza',
};

// ── SUGERENCIAS LATINOAMERICANAS ──────────────────────────────

const PRESIDENT_SUGGESTIONS = [
  'Salvador Allende', 'Hugo Chávez', 'Cristina Fernández', 'Lula da Silva',
  'Evo Morales', 'Rafael Correa', 'Michelle Bachelet', 'Andrés Manuel López Obrador',
  'Gabriel Boric', 'Gustavo Petro', 'Néstor Kirchner', 'Carlos Menem',
  'Alberto Fernández', 'Javier Milei', 'Nayib Bukele', 'Luis Lacalle Pou',
  'Álvaro Uribe', 'Martín Vizcarra', 'Pedro Castillo', 'Benito Juárez',
  'Simón Bolívar', 'José de San Martín', 'Daniel Ortega', 'Omar Torrijos',
  'Dilma Rousseff', 'Isabel Perón', 'Violeta Chamorro', 'Mireya Moscoso',
];

const PARTY_SUGGESTIONS = [
  'Partido de los Trabajadores (PT)',
  'Partido Justicialista (Peronismo)',
  'Frente Amplio',
  'MORENA',
  'Partido Acción Nacional (PAN)',
  'Unión Demócrata Independiente (UDI)',
  'Partido Socialista Unido de Venezuela (PSUV)',
  'Movimiento al Socialismo (MAS)',
  'Partido Socialista',
  'Renovación Nacional',
  'PRO – Propuesta Republicana',
  'La Libertad Avanza',
  'Partido Colorado',
  'Partido Nacional',
  'Fuerza Popular',
  'Pacto Histórico',
  'FSLN – Frente Sandinista',
  'Partido Comunista',
  'Partido Revolucionario Institucional (PRI)',
  'Cambio Democrático',
  'Convergencia Nacional',
  'Alianza País',
];

// ── API PÚBLICA ───────────────────────────────────────────────

/**
 * Muestra la pantalla de identidad.
 * @param {Function} onConfirm — callback({ presidentName, partyName, vpId })
 */
export function showIdentityScreen(onConfirm) {
  _onConfirm = onConfirm;
  _sel = { presidentName: '', partyName: '', vpId: getDefaultVP() };
  _renderCards();
  showScreen('screen-identity');
}

/**
 * Confirma la identidad y llama al callback.
 * Llamado desde HTML onclick="confirmIdentity()".
 */
export function confirmIdentity() {
  const nameEl  = document.getElementById('ident-president-input');
  const partyEl = document.getElementById('ident-party-input');

  const name  = nameEl?.value?.trim();
  const party = partyEl?.value?.trim();

  // Validación: ambos campos obligatorios
  if (!name) {
    nameEl?.focus();
    nameEl?.classList.add('ident-input-error');
    nameEl?.addEventListener('input', () => nameEl.classList.remove('ident-input-error'), { once: true });
    _showIdentError('Por favor, ingresá el nombre del/la Presidente/a antes de continuar.');
    return;
  }
  if (!party) {
    partyEl?.focus();
    partyEl?.classList.add('ident-input-error');
    partyEl?.addEventListener('input', () => partyEl.classList.remove('ident-input-error'), { once: true });
    _showIdentError('Por favor, ingresá el nombre del partido político antes de continuar.');
    return;
  }

  _sel.presidentName = name;
  _sel.partyName     = party;
  if (!_sel.vpId) _sel.vpId = getDefaultVP();
  _onConfirm?.({ ..._sel });
}

function _showIdentError(msg) {
  let el = document.getElementById('ident-error-msg');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ident-error-msg';
    el.className = 'ident-error-msg';
    document.querySelector('.ident-footer')?.prepend(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

// ── RENDER ────────────────────────────────────────────────────

function _renderCards() {
  const grid = document.getElementById('ident-vp-grid');
  if (!grid) return;
  grid.innerHTML = VICEPRESIDENTS.map(vp => _renderVPCard(vp)).join('');
  _exposeHelper();
}

function _renderVPCard(vp) {
  const selected = _sel.vpId === vp.id;

  // Top 4 pasivos más significativos
  const chips = Object.entries(vp.passive)
    .slice(0, 4)
    .map(([key, delta]) => {
      const good = HIGH_BAD.has(key) ? delta < 0 : delta > 0;
      const sign = delta > 0 ? '+' : '';
      const lbl  = IND_SHORT[key] || key;
      return `<span class="ident-vp-chip ${good ? 'good' : 'bad'}">${IND_ICON[key] || ''} ${sign}${delta} ${lbl}</span>`;
    }).join('');

  return `
    <div class="ident-vp-card ${selected ? 'selected' : ''}"
         id="ident-vp-card-${vp.id}"
         onclick="window.__identSelectVP('${vp.id}')"
         role="button" tabindex="0"
         aria-pressed="${selected}">

      <div class="ident-vp-top" style="--vp-color:${vp.color}">
        ${selected ? `<div class="ident-vp-badge" style="background:${vp.color}">✓ Elegido/a</div>` : ''}
        <div class="ident-vp-avatar-wrap">
          <img src="${vp.avatarUrl}"
               alt="${vp.name}"
               width="88" height="88"
               loading="lazy"
               class="ident-vp-img"
               onerror="this.onerror=null;this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=${vp.id}'">
        </div>
      </div>

      <div class="ident-vp-body">
        <div class="ident-vp-name">${vp.name}</div>
        <div class="ident-vp-title">${vp.title}</div>
        <div class="ident-vp-profile" style="color:${vp.color}">${vp.profile}</div>
        <p class="ident-vp-bio">${vp.bio}</p>
        <div class="ident-vp-chips">${chips}</div>
        <div class="ident-vp-quote">"${vp.adviceStyle}"</div>
      </div>

      <div class="ident-vp-footer" style="border-color:${selected ? vp.color : 'rgba(255,255,255,.06)'}">
        <div class="ident-vp-hint">${selected ? `✓ ${vp.title} seleccionado/a` : 'Tocar para elegir'}</div>
      </div>
    </div>`;
}

// ── INTERACCIÓN ───────────────────────────────────────────────

function _selectVP(id) {
  _sel.vpId = id;
  const grid = document.getElementById('ident-vp-grid');
  if (grid) grid.innerHTML = VICEPRESIDENTS.map(vp => _renderVPCard(vp)).join('');
  // Scroll suave al card elegido
  const card = document.getElementById(`ident-vp-card-${id}`);
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function _exposeHelper() {
  window.__identSelectVP = (id) => _selectVP(id);
}

// ── GENERADORES DE HTML ESTÁTICO (para index.html) ────────────
// Estas funciones generan el HTML de los datalists para sugerencias.

/**
 * Genera el HTML del datalist de presidentes.
 * @returns {string}
 */
export function buildPresidentDatalist() {
  return `<datalist id="dl-presidents">${
    PRESIDENT_SUGGESTIONS.map(p => `<option value="${p}">`).join('')
  }</datalist>`;
}

/**
 * Genera el HTML del datalist de partidos.
 * @returns {string}
 */
export function buildPartyDatalist() {
  return `<datalist id="dl-parties">${
    PARTY_SUGGESTIONS.map(p => `<option value="${p}">`).join('')
  }</datalist>`;
}
