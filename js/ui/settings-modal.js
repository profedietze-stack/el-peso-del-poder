"use strict";

// ============================================================
// SETTINGS MODAL — UI de Opciones
//
// Modal de configuración accesible desde el menú de inicio y
// durante la partida. Controles: tamaño de letra, sonido,
// volumen, alto contraste y reducir animaciones.
//
// El DOM se construye una sola vez (lazy) y se reutiliza.
// Cada control llama al setter correspondiente de settings.js,
// que aplica el cambio al instante y lo persiste.
// ============================================================

import {
  getSettings, FONT_SCALE_KEYS,
  setFontScale, setSoundOn, setVolume, setHighContrast, setReduceMotion, setPais,
} from '../engine/settings.js';
import { PAISES } from '../data/pais.js';

let _overlay = null;

const FONT_NAMES = {
  normal: 'Normal',
  grande: 'Grande',
  xl:     'Muy grande',
  max:    'Máximo',
};

function _build() {
  const o = document.createElement('div');
  o.id = 'settings-overlay';
  o.className = 'settings-overlay';
  o.addEventListener('click', (e) => { if (e.target === o) closeSettingsModal(); });

  o.innerHTML = `
    <div class="settings-box" role="dialog" aria-modal="true" aria-label="Opciones">
      <div class="settings-head">
        <span class="settings-icon">⚙️</span>
        <h2 class="settings-title">Opciones</h2>
        <button class="settings-close" aria-label="Cerrar opciones">✕</button>
      </div>

      <div class="settings-body">

        <div class="set-group">
          <div class="set-label" id="set-pais-label">🌎 País del juego</div>
          <div class="set-pais-row" id="set-pais-row" data-sin-pais role="radiogroup" aria-labelledby="set-pais-label">
            ${Object.values(PAISES).map((p) => `
              <button class="set-font-btn set-pais-btn" role="radio" data-pais="${p.id}">
                <span class="set-pais-bandera">${p.bandera}</span>
                <span class="set-font-name">${p.nombre}</span>
              </button>`).join('')}
          </div>
          <div class="set-hint">Latinoamérica usa un país imaginario, sin datos de un solo país; México, Colombia y Chile suman sus instituciones y la duración real del mandato. Cambiar de país recarga la página. Una partida guardada en otro país se continúa cambiando de país (se pide confirmación).</div>
        </div>

        <div class="set-group">
          <div class="set-label">🔤 Tamaño de letra</div>
          <div class="set-font-row" id="set-font-row">
            ${FONT_SCALE_KEYS.map((k, i) => `
              <button class="set-font-btn" data-font="${k}" title="${FONT_NAMES[k]}">
                <span class="set-font-glyph" style="font-size:${0.9 + i * 0.28}rem">A</span>
                <span class="set-font-name">${FONT_NAMES[k]}</span>
              </button>`).join('')}
          </div>
        </div>

        <div class="set-group">
          <div class="set-row">
            <span class="set-label">🔊 Sonido</span>
            <button class="set-toggle" id="set-sound-toggle" role="switch" aria-label="Activar sonido"></button>
          </div>
          <div class="set-row set-volume-row" id="set-volume-row">
            <span class="set-sublabel">Volumen</span>
            <input type="range" id="set-volume" class="set-range" min="0" max="100" step="5" aria-label="Volumen">
          </div>
        </div>

        <div class="set-group">
          <div class="set-row">
            <span class="set-label">🌗 Alto contraste</span>
            <button class="set-toggle" id="set-contrast-toggle" role="switch" aria-label="Alto contraste"></button>
          </div>
          <div class="set-hint">Mejora la legibilidad para baja visión.</div>
        </div>

        <div class="set-group">
          <div class="set-row">
            <span class="set-label">🎞️ Reducir animaciones</span>
            <button class="set-toggle" id="set-motion-toggle" role="switch" aria-label="Reducir animaciones"></button>
          </div>
          <div class="set-hint">Menos movimiento en pantalla.</div>
        </div>

      </div>

      <div class="settings-foot">
        <button class="btn btn-gold settings-done">Listo</button>
      </div>
    </div>`;

  document.body.appendChild(o);

  // ── Wiring ──────────────────────────────────────────────
  o.querySelector('.settings-close').addEventListener('click', closeSettingsModal);
  o.querySelector('.settings-done').addEventListener('click', closeSettingsModal);

  o.querySelector('#set-font-row').addEventListener('click', (e) => {
    const btn = e.target.closest('.set-font-btn');
    if (!btn) return;
    setFontScale(btn.dataset.font);
    _syncFont(o);
  });

  o.querySelector('#set-pais-row').addEventListener('click', (e) => {
    const btn = e.target.closest('.set-pais-btn');
    if (!btn || btn.dataset.pais === getSettings().pais) return;
    setPais(btn.dataset.pais);
    location.reload();
  });

  o.querySelector('#set-sound-toggle').addEventListener('click', () => {
    setSoundOn(!getSettings().soundOn);
    _sync(o);
  });

  o.querySelector('#set-volume').addEventListener('input', (e) => {
    setVolume(Number(e.target.value) / 100);
  });

  o.querySelector('#set-contrast-toggle').addEventListener('click', () => {
    setHighContrast(!getSettings().highContrast);
    _sync(o);
  });

  o.querySelector('#set-motion-toggle').addEventListener('click', () => {
    setReduceMotion(!getSettings().reduceMotion);
    _sync(o);
  });

  // Cerrar con Escape mientras esté abierto.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && o.classList.contains('open')) closeSettingsModal();
  });

  _overlay = o;
  return o;
}

function _syncFont(o) {
  const cur = getSettings().fontScale;
  o.querySelectorAll('.set-font-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.font === cur);
  });
}

function _sync(o) {
  const s = getSettings();
  _syncFont(o);
  o.querySelectorAll('.set-pais-btn').forEach((b) => {
    const activo = b.dataset.pais === s.pais;
    b.classList.toggle('active', activo);
    b.setAttribute('aria-checked', String(activo));
  });
  o.querySelector('#set-sound-toggle').classList.toggle('on', s.soundOn);
  o.querySelector('#set-contrast-toggle').classList.toggle('on', s.highContrast);
  o.querySelector('#set-motion-toggle').classList.toggle('on', s.reduceMotion);
  o.querySelector('#set-volume').value = Math.round(s.volume * 100);
  // El volumen sólo tiene sentido si el sonido está activo.
  o.querySelector('#set-volume-row').classList.toggle('disabled', !s.soundOn);
}

export function openSettingsModal() {
  const o = _overlay || _build();
  _sync(o);
  o.classList.add('open');
}

export function closeSettingsModal() {
  if (_overlay) _overlay.classList.remove('open');
}
