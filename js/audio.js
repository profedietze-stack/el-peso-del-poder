"use strict";

// ============================================================
// AUDIO ENGINE — Web Audio API
// Sin archivos externos: todos los sonidos se generan por síntesis.
// Idéntico al enfoque del v11, refactorizado como módulo ES.
// ============================================================

/** @type {AudioContext|null} */
let ctx = null;

/** Nodo de ganancia maestro: todos los sonidos pasan por aquí.
 *  Permite mute global y control de volumen desde Opciones. */
let master = null;
let _volume = 0.8;   // 0..1
let _muted  = false;

/**
 * Inicializa el AudioContext (debe llamarse desde un gesto del usuario).
 * El navegador requiere un gesto (click) antes de crear el contexto.
 */
export function initAudio() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = _muted ? 0 : _volume;
    master.connect(ctx.destination);
  } catch (e) {
    console.warn('[audio] Web Audio API no disponible');
  }
}

/** Silencia/activa todo el audio (persiste aunque el ctx aún no exista). */
export function setAudioMuted(muted) {
  _muted = !!muted;
  if (master) master.gain.value = _muted ? 0 : _volume;
}

/** Ajusta volumen maestro (0..1). */
export function setAudioVolume(vol) {
  _volume = Math.max(0, Math.min(1, vol));
  if (master && !_muted) master.gain.value = _volume;
}

/** Destino de audio: master si existe, si no destination directo. */
function _dest() { return master || (ctx && ctx.destination); }

/**
 * Reanuda el AudioContext si estaba suspendido (política autoplay).
 */
export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

// ── UTILIDADES INTERNAS ───────────────────────────────────────

/**
 * Crea un oscilador simple con envelope y lo conecta al destino.
 * @param {number} freq        - frecuencia en Hz
 * @param {string} type        - 'sine'|'square'|'sawtooth'|'triangle'
 * @param {number} startTime   - tiempo de inicio
 * @param {number} duration    - duración en segundos
 * @param {number} gainPeak    - ganancia máxima (0-1)
 */
function playTone(freq, type = 'sine', startTime = 0, duration = 0.15, gainPeak = 0.18) {
  if (!ctx) return;
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(_dest());
  osc.type            = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + startTime;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration + 0.01);
}

/**
 * Genera un buffer de ruido blanco corto.
 * @param {number} duration
 * @param {number} gain
 */
function playNoise(duration = 0.05, gain = 0.04) {
  if (!ctx) return;
  const bufLen   = Math.floor(ctx.sampleRate * duration);
  const buffer   = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data     = buffer.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const src      = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  src.buffer     = buffer;
  src.connect(gainNode);
  gainNode.connect(_dest());
  gainNode.gain.value = gain;
  src.start(ctx.currentTime);
}

// ── SONIDOS DE JUEGO ──────────────────────────────────────────

/** Sonido de click/botón UI */
export function soundClick() {
  playTone(440, 'sine', 0, 0.06, 0.08);
}

/** Sonido de selección de opción */
export function soundSelect() {
  playTone(523, 'triangle', 0,    0.07, 0.12);
  playTone(659, 'triangle', 0.07, 0.07, 0.12);
}

/** Sonido de turno avanzado */
export function soundNextTurn() {
  playTone(392, 'sine', 0,    0.08, 0.10);
  playTone(494, 'sine', 0.08, 0.08, 0.10);
  playTone(587, 'sine', 0.16, 0.10, 0.12);
}

/** Sonido de alerta (indicador en zona warn) */
export function soundWarn() {
  playTone(350, 'sawtooth', 0,    0.12, 0.10);
  playTone(330, 'sawtooth', 0.13, 0.12, 0.10);
}

/** Sonido de crisis (indicador en danger) */
export function soundCrisis() {
  playTone(220, 'sawtooth', 0,    0.18, 0.14);
  playTone(196, 'sawtooth', 0.10, 0.18, 0.14);
  playNoise(0.06, 0.06);
  playTone(175, 'square',   0.22, 0.20, 0.12);
}

/** Sonido de crisis automática (más agresivo) */
export function soundCrisisAuto() {
  soundCrisis();
  setTimeout(() => soundCrisis(), 300);
}

/** Sonido de logro desbloqueado */
export function soundAchievement() {
  playTone(523, 'triangle', 0,    0.12, 0.14);
  playTone(659, 'triangle', 0.12, 0.12, 0.14);
  playTone(784, 'triangle', 0.24, 0.12, 0.14);
  playTone(1047,'triangle', 0.36, 0.20, 0.16);
}

/** Sonido de victoria */
export function soundVictory() {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((freq, i) => {
    playTone(freq, 'triangle', i * 0.12, 0.18, 0.15);
  });
  setTimeout(() => {
    playTone(1047, 'sine', 0,    0.30, 0.12);
    playTone(1319, 'sine', 0.08, 0.30, 0.12);
    playTone(1568, 'sine', 0.16, 0.40, 0.14);
  }, 700);
}

/** Sonido de derrota */
export function soundDefeat() {
  playTone(440, 'sawtooth', 0,    0.30, 0.14);
  playTone(392, 'sawtooth', 0.20, 0.30, 0.14);
  playTone(330, 'sawtooth', 0.40, 0.35, 0.14);
  playTone(220, 'sawtooth', 0.60, 0.50, 0.16);
  playNoise(0.10, 0.05);
}

/** Sonido de acción de asesor */
export function soundAdvisor() {
  playTone(660, 'sine', 0,    0.08, 0.10);
  playTone(880, 'sine', 0.09, 0.08, 0.10);
}

/** Sonido de tooltip */
export function soundTooltip() {
  playTone(800, 'sine', 0, 0.04, 0.05);
}

/** Sonido de pantalla de dificultad */
export function soundDifficultySelect() {
  playTone(440, 'triangle', 0,    0.10, 0.10);
  playTone(550, 'triangle', 0.10, 0.10, 0.10);
  playTone(660, 'triangle', 0.20, 0.15, 0.12);
}
