"use strict";

import { getVPById } from '../data/vicepresident.js';

// ============================================================
// TUTORIAL INTERACTIVO — Primer turno guiado por el Vicepresidente
//
// · Overlay: bloquea clicks (transparente). Clase .tut-full-dark
//   cuando el paso no tiene target (oscurece todo).
// · Spotlight (hermano del overlay, z-index 9001): box-shadow de
//   10000px crea la oscuridad alrededor; el interior queda claro
//   mostrando el contenido real del tablero.
// · Bubble (hermano, z-index 9002): globo con avatar VP + texto.
// · Se muestra una sola vez por navegador (localStorage).
// · "Saltear" es el único botón que elimina el overlay oscuro.
// ============================================================

const TUTORIAL_KEY = 'sdr_v12_tutorial_seen';
const BUBBLE_W     = 330;   // px — ancho estimado de la burbuja
const BUBBLE_H     = 290;   // px — alto estimado
const SPOT_PAD     = 12;    // px de padding alrededor del spotlight

let _steps      = [];
let _current    = 0;
let _scrollY    = 0;   // guarda la posición de scroll al bloquear (iOS fix)

let _overlay   = null;
let _spotlight = null;
let _bubble    = null;

// ── PASOS ─────────────────────────────────────────────────────

function _buildSteps(vp) {
  const firstName = vp?.name
    ? vp.name.replace(/^(Dr\.|Dra\.|Ing\.)\s+/, '').split(' ')[0]
    : 'Vicepresidente/a';
  const focuses = vp?.adviceFocus?.slice(0, 2).join(' y ') || 'los indicadores clave';

  return [
    {
      target: null,
      icon:   '🏛️',
      title:  '¡Bienvenido/a al gobierno!',
      text:   `Soy ${firstName}, tu Vicepresidente/a. Antes de tu primera decisión, déjame guiarte por las herramientas disponibles. Solo tomará un minuto — o podés saltearlo.`,
    },
    {
      target: '#event-card',
      icon:   '📋',
      title:  'El evento del mes',
      text:   'Cada mes enfrentás una situación crítica como esta. Leé bien el contexto antes de decidir: los detalles importan y las consecuencias son reales.',
    },
    {
      target: '#ev-options',
      icon:   '⚖️',
      title:  'Tu decisión',
      text:   'Estas son las opciones disponibles. Rara vez existe una perfecta — cada decisión tiene costos y beneficios. Pensá siempre en los 8 indicadores del panel.',
    },
    {
      target: '#advisors-panel-container',
      icon:   '🤝',
      title:  'Tus asesores',
      text:   `Podés consultarme a mí (hasta 2 veces) y a tus ministros antes de decidir. Yo me enfoco en ${focuses}. La credibilidad de cada asesor sube o baja según sus aciertos.`,
    },
    {
      target: '#indicators-wrap',
      icon:   '📊',
      title:  'Panel de indicadores',
      text:   '¡Vigilá estos 8 indicadores de cerca! Verde 🟢 = bien, Amarillo 🟡 = alerta, Rojo 🔴 = crisis. Si la Confianza llega a 0 o la Pobreza supera 80%, el mandato termina.',
    },
    {
      target: '.news-ticker-section',
      icon:   '📰',
      title:  'La prensa',
      text:   'Los medios y las redes cubrirán cada decisión tuya. Abrí la Sala de Prensa para leer todos los titulares y ver cómo te percibe la opinión pública.',
    },
    {
      target: '.top-actions',
      icon:   '🏛️',
      title:  'Barra de controles',
      text:   'Desde aquí accedés al gabinete completo, la Sala de Prensa y podés salir. En el gabinete podés consultar a tus ministros y, llegado el caso, pedirles la renuncia.',
    },
    {
      target: null,
      icon:   '🏛️',
      title:  'Opinión del Gabinete',
      text:   `En los eventos más importantes, al elegir una opción aparecerá un análisis de tus ministros ANTES de confirmar. Podés leerlo y volver si cambiás de idea. No aparece en todos los eventos — solo en los de mayor impacto.`,
    },
    {
      target: null,
      icon:   '🚀',
      title:  '¡Listo para gobernar!',
      text:   `Todo listo, Presidente/a. Recordá: no hay respuestas perfectas en política, solo consecuencias. Yo siempre estaré disponible para asesorarte. ¡Mucho éxito!`,
    },
  ];
}

// ── API PÚBLICA ───────────────────────────────────────────────

export function initTutorial(state, force = false) {
  try { if (!force && localStorage.getItem(TUTORIAL_KEY)) return; } catch (_) { /* iOS privado */ }

  const vpId = state?.identity?.vpId || 'vp-moreno';
  const vp   = getVPById(vpId);

  _steps   = _buildSteps(vp);
  _current = 0;

  _overlay   = document.getElementById('tutorial-overlay');
  _spotlight = document.getElementById('tutorial-spotlight');
  _bubble    = document.getElementById('tutorial-bubble');

  if (!_overlay || !_spotlight || !_bubble) return;

  // Inyectar datos del VP
  const vpImg  = document.getElementById('tut-vp-img');
  const vpName = document.getElementById('tut-vp-name');
  const vpRole = document.getElementById('tut-vp-role');
  if (vpImg  && vp) { vpImg.src = vp.avatarUrl; vpImg.alt = vp.name; }
  if (vpName && vp) vpName.textContent = vp.name;
  if (vpRole && vp) vpRole.textContent = vp.profile || 'Vicepresidente/a';

  window.__tutorialNext = tutorialNext;
  window.__tutorialSkip = closeTutorial;

  _lockScroll();
  _overlay.classList.add('tut-active');
  _showStep(0);
}

export function tutorialNext() {
  _current++;
  if (_current >= _steps.length) {
    closeTutorial();
  } else {
    _showStep(_current);
  }
}

export function closeTutorial() {
  try { localStorage.setItem(TUTORIAL_KEY, '1'); } catch (_) { /* iOS privado */ }
  if (_overlay)   _overlay.classList.remove('tut-active', 'tut-full-dark');
  if (_spotlight) _spotlight.style.cssText = '';
  if (_bubble)    _bubble.classList.remove('tut-bubble-visible');
  _unlockScroll();
  _current = 0;
}

// ── INTERNOS ─────────────────────────────────────────────────

function _showStep(idx) {
  const step = _steps[idx];
  if (!step || !_bubble) return;

  // Actualizar contenido del bubble
  const titleEl = document.getElementById('tut-step-title');
  const textEl  = document.getElementById('tut-bubble-text');
  const iconEl  = document.getElementById('tut-step-icon');
  const dotsEl  = document.getElementById('tut-progress-dots');
  const nextBtn = document.getElementById('tut-next-btn');
  const stepLbl = document.getElementById('tut-step-label');

  if (titleEl) titleEl.textContent = step.title;
  if (textEl)  textEl.textContent  = step.text;
  if (iconEl)  iconEl.textContent  = step.icon;
  if (stepLbl) stepLbl.textContent = `${idx + 1} / ${_steps.length}`;

  if (dotsEl) {
    dotsEl.innerHTML = _steps.map((_, i) =>
      `<span class="tut-dot${i === idx ? ' tut-dot-active' : ''}"></span>`
    ).join('');
  }

  if (nextBtn) {
    nextBtn.textContent = idx === _steps.length - 1
      ? '🚀 ¡A gobernar!'
      : 'Siguiente →';
  }

  // Animar bubble: fade-out → reposicionar → fade-in
  _bubble.classList.remove('tut-bubble-visible');

  setTimeout(() => {
    if (!step.target) {
      // Sin elemento objetivo: oscurecer TODO y centrar bubble
      _setFullDark();
      _centerBubble();
    } else {
      const el = document.querySelector(step.target);
      if (el) {
        _scrollToEl(el);
        const rect = el.getBoundingClientRect();
        _setSpotlight(rect);
        _positionBubble(rect);
      } else {
        _setFullDark();
        _centerBubble();
      }
    }
    _bubble.classList.add('tut-bubble-visible');
  }, 90);
}

/**
 * Modo sin target: overlay completamente oscuro, spotlight oculto.
 */
function _setFullDark() {
  if (_overlay)   _overlay.classList.add('tut-full-dark');
  if (_spotlight) {
    _spotlight.style.opacity = '0';
    _spotlight.style.width   = '0';
    _spotlight.style.height  = '0';
  }
}

/**
 * Modo con target: overlay transparente (solo bloquea clicks),
 * spotlight con box-shadow gigante que crea el "agujero de luz".
 * El contenido real del tablero se ve dentro del spotlight.
 */
function _setSpotlight(rect) {
  if (_overlay)   _overlay.classList.remove('tut-full-dark');
  if (!_spotlight) return;

  const l = Math.max(0, rect.left - SPOT_PAD);
  const t = Math.max(0, rect.top  - SPOT_PAD);
  const w = rect.width  + SPOT_PAD * 2;
  const h = rect.height + SPOT_PAD * 2;

  _spotlight.style.left    = `${l}px`;
  _spotlight.style.top     = `${t}px`;
  _spotlight.style.width   = `${w}px`;
  _spotlight.style.height  = `${h}px`;
  _spotlight.style.opacity = '1';
}

// ── SCROLL LOCK / UNLOCK (iOS Safari safe) ───────────────────

/**
 * Bloquea el scroll guardando la posición actual.
 * En iOS Safari, overflow:hidden solo no alcanza; hay que usar
 * position:fixed + top negativo para congelar el scroll.
 */
function _lockScroll() {
  _scrollY = window.scrollY;
  document.body.style.top = `-${_scrollY}px`;
  document.body.classList.add('tut-open');
}

/**
 * Desbloquea el scroll y restaura la posición exacta donde estaba.
 */
function _unlockScroll() {
  document.body.classList.remove('tut-open');
  document.body.style.top = '';
  // Scroll sin animación, compatible con todos los navegadores
  window.scrollTo(0, _scrollY);
}

/**
 * Scrollea al elemento centrado en viewport durante el tutorial.
 * Desbloquea momentáneamente, scrollea, vuelve a bloquear.
 * Usa la forma de 2 argumentos (máxima compatibilidad: iOS Safari, Android).
 */
function _scrollToEl(el) {
  // Desbloquear temporalmente para poder scrollear
  document.body.classList.remove('tut-open');
  document.body.style.top = '';
  window.scrollTo(0, _scrollY);   // restaurar posición antes de medir

  const rect      = el.getBoundingClientRect();
  const newScrollY = Math.max(0,
    window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2
  );

  window.scrollTo(0, newScrollY);   // sin opciones: funciona en todos
  _scrollY = newScrollY;            // actualizar el guardado

  // Re-bloquear en la nueva posición
  document.body.style.top = `-${_scrollY}px`;
  document.body.classList.add('tut-open');
}

/**
 * Posiciona el bubble adyacente al spotlight.
 * Prueba: derecha → izquierda → abajo → arriba → centro.
 */
function _positionBubble(rect) {
  if (!_bubble) return;
  const vw  = window.innerWidth;
  const vh  = window.innerHeight;
  const pad = 16;

  const topCentered  = Math.max(pad, Math.min(vh - BUBBLE_H - pad,
    rect.top + rect.height / 2 - BUBBLE_H / 2));
  const leftCentered = Math.max(pad, Math.min(vw - BUBBLE_W - pad,
    rect.left + rect.width / 2 - BUBBLE_W / 2));

  const candidates = [
    { left: rect.right + pad,           top: topCentered   },   // derecha
    { left: rect.left - BUBBLE_W - pad, top: topCentered   },   // izquierda
    { left: leftCentered,               top: rect.bottom + pad },// abajo
    { left: leftCentered,               top: rect.top - BUBBLE_H - pad }, // arriba
  ];

  let chosen = null;
  for (const c of candidates) {
    if (c.left >= pad && c.left + BUBBLE_W <= vw - pad &&
        c.top  >= pad && c.top  + BUBBLE_H <= vh - pad) {
      chosen = c;
      break;
    }
  }
  if (!chosen) {
    chosen = { left: vw / 2 - BUBBLE_W / 2, top: vh / 2 - BUBBLE_H / 2 };
  }

  _bubble.style.left      = `${chosen.left}px`;
  _bubble.style.top       = `${chosen.top}px`;
  _bubble.style.transform = 'none';
}

/**
 * Centra el bubble en pantalla (pasos sin target).
 */
function _centerBubble() {
  if (!_bubble) return;
  _bubble.style.left      = '50%';
  _bubble.style.top       = '50%';
  _bubble.style.transform = 'translate(-50%, -50%)';
}
