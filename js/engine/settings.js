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

import { PAISES, PAIS_POR_DEFECTO } from '../data/pais.js';

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
  pais:         PAIS_POR_DEFECTO,   // 'ar' | 'latam' (ver data/pais.js)
};

let _settings = { ...DEFAULTS };

/**
 * Lee los ajustes guardados, campo por campo.
 *
 * `{ ...DEFAULTS, ...JSON.parse(raw) }` solo se defiende de un JSON ilegible: si el
 * texto parsea, un campo con el tipo cambiado pasa entero (`volume: 'abc'`,
 * `soundOn: 'false'`). Acá cada campo se valida y, si no sirve, cae a su valor por
 * defecto; lo que no es un ajuste conocido no se copia.
 *
 * @param {unknown} crudo lo que devolvió `JSON.parse` (o undefined si no había nada)
 * @param {object} defaults valores por defecto
 */
export function sanearAjustes(crudo, defaults = DEFAULTS) {
  const g = crudo !== null && typeof crudo === 'object' && !Array.isArray(crudo) ? crudo : {};
  const bool = (v, def) => (typeof v === 'boolean' ? v : def);
  return {
    fontScale:    typeof g.fontScale === 'string' && Object.hasOwn(FONT_SCALES, g.fontScale) ? g.fontScale : defaults.fontScale,
    soundOn:      bool(g.soundOn, defaults.soundOn),
    volume:       typeof g.volume === 'number' && Number.isFinite(g.volume) ? Math.max(0, Math.min(1, g.volume)) : defaults.volume,
    highContrast: bool(g.highContrast, defaults.highContrast),
    reduceMotion: bool(g.reduceMotion, defaults.reduceMotion),
    pais:         typeof g.pais === 'string' && Object.hasOwn(PAISES, g.pais) ? g.pais : defaults.pais,
  };
}

/** ¿El sistema pide menos movimiento? Si el jugador no eligió nada, se le hace caso. */
function _sistemaPideMenosMovimiento() {
  try {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {
    return false;
  }
}

/** Carga desde localStorage (cada campo validado; sin nada guardado, valores por defecto). */
export function loadSettings() {
  const defaults = { ...DEFAULTS, reduceMotion: _sistemaPideMenosMovimiento() };
  let crudo;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) crudo = JSON.parse(raw);
  } catch (_) { /* ilegible: se queda con los valores por defecto */ }
  _settings = sanearAjustes(crudo, defaults);
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

/** Cambia el país. Los textos se reescriben al arrancar: quien llama recarga la página. */
export function setPais(id) {
  if (!Object.hasOwn(PAISES, id)) return;
  _settings.pais = id;
  _save();
}
