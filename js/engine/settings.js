"use strict";

// ============================================================
// SETTINGS — Configuración del jugador (accesibilidad + audio)
//
// Fuente única de verdad. Persiste en localStorage (epp_settings).
// applySettings() aplica TODO al DOM y al motor de audio.
//
// Tamaño de letra: escala font-size del <html>. Como el CSS usa
// rem en todo, una sola línea reescala el juego entero.
// ============================================================

import { setAudioMuted, setAudioVolume } from '../audio.js';

const KEY = 'epp_settings';

// Escalas de letra (porcentaje aplicado al <html>).
export const FONT_SCALES = {
  normal: 100,
  grande: 112.5,
  xl:     125,
  max:    140,
};

export const FONT_SCALE_KEYS = Object.keys(FONT_SCALES);

const DEFAULTS = {
  fontScale:    'normal',   // clave de FONT_SCALES
  soundOn:      true,
  volume:       0.8,        // 0..1
  highContrast: false,
  reduceMotion: false,
};

let _settings = { ...DEFAULTS };

/** Carga desde localStorage (fusiona con defaults para tolerar versiones viejas). */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) _settings = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (_) {
    _settings = { ...DEFAULTS };
  }
  return getSettings();
}

/** Copia inmutable del estado actual. */
export function getSettings() {
  return { ..._settings };
}

function _save() {
  try { localStorage.setItem(KEY, JSON.stringify(_settings)); } catch (_) {}
}

/** Aplica todos los ajustes al DOM y al audio. Idempotente. */
export function applySettings() {
  // Tamaño de letra → escala el <html> (todo el CSS usa rem).
  const pct = FONT_SCALES[_settings.fontScale] ?? 100;
  document.documentElement.style.fontSize = pct + '%';

  // Accesibilidad → clases en <body>.
  document.body.classList.toggle('high-contrast', !!_settings.highContrast);
  document.body.classList.toggle('reduce-motion', !!_settings.reduceMotion);

  // Audio (seguro aunque el AudioContext aún no exista).
  setAudioMuted(!_settings.soundOn);
  setAudioVolume(_settings.volume);
}

// ── SETTERS (cada uno aplica + persiste) ─────────────────────

export function setFontScale(key) {
  if (FONT_SCALES[key] == null) return;
  _settings.fontScale = key;
  applySettings(); _save();
}

export function setSoundOn(on) {
  _settings.soundOn = !!on;
  applySettings(); _save();
}

export function setVolume(v) {
  _settings.volume = Math.max(0, Math.min(1, Number(v) || 0));
  applySettings(); _save();
}

export function setHighContrast(on) {
  _settings.highContrast = !!on;
  applySettings(); _save();
}

export function setReduceMotion(on) {
  _settings.reduceMotion = !!on;
  applySettings(); _save();
}
