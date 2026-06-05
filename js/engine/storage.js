"use strict";

// ============================================================
// STORAGE ENGINE
// Maneja el guardado/carga en localStorage.
// Claves:
//   'sdr_save'   → partida guardada (estado serializado)
//   'sdr_global' → estadísticas globales acumuladas
// ============================================================

const SAVE_KEY   = 'sdr_save';
const GLOBAL_KEY = 'sdr_global';

// ── SERIALIZACIÓN ────────────────────────────────────────────
// El estado contiene un Set (usedEventIds) que JSON.stringify no soporta.
// Se convierte a array antes de guardar y se restaura al cargar.

/**
 * Serializa el estado del juego para guardarlo en localStorage.
 * @param {object} state
 * @returns {string} JSON string
 */
function serializeState(state) {
  return JSON.stringify({
    ...state,
    usedEventIds: [...state.usedEventIds],
  });
}

/**
 * Deserializa el estado cargado desde localStorage.
 * @param {string} json
 * @returns {object} estado restaurado
 */
function deserializeState(json) {
  const parsed = JSON.parse(json);
  parsed.usedEventIds = new Set(parsed.usedEventIds || []);
  return parsed;
}

// ── PARTIDA ───────────────────────────────────────────────────

/**
 * Guarda el estado actual en localStorage (con fallback a sessionStorage).
 * @param {object} state
 * @returns {boolean} true si el guardado fue exitoso
 */
export function saveToStorage(state) {
  const data = serializeState(state);
  // Intentar localStorage primero (persiste entre sesiones)
  try {
    localStorage.setItem(SAVE_KEY, data);
    // Verificar que realmente se guardó (iOS Safari puede aceptar sin error y luego fallar)
    if (localStorage.getItem(SAVE_KEY) === data) return true;
  } catch (_) { /* localStorage no disponible o cuota excedida */ }

  // Fallback: sessionStorage (se pierde al cerrar la pestaña, pero protege la partida actual)
  try {
    sessionStorage.setItem(SAVE_KEY, data);
    console.warn('[storage] localStorage no disponible. Usando sessionStorage como fallback.');
    return true;
  } catch (e) {
    console.error('[storage] No se pudo guardar la partida:', e);
    return false;
  }
}

/**
 * Carga la partida guardada desde localStorage (con fallback a sessionStorage).
 * @returns {object|null} estado restaurado o null si no hay guardado
 */
export function loadFromStorage() {
  // Intentar localStorage
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return deserializeState(raw);
  } catch (_) { /* localStorage no disponible */ }

  // Fallback: sessionStorage
  try {
    const raw = sessionStorage.getItem(SAVE_KEY);
    if (raw) return deserializeState(raw);
  } catch (_) { /* sessionStorage tampoco disponible */ }

  return null;
}

/**
 * Elimina la partida guardada (localStorage y sessionStorage).
 */
export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); }  catch (_) {}
  try { sessionStorage.removeItem(SAVE_KEY); } catch (_) {}
}

/**
 * Verifica si existe una partida guardada (localStorage o sessionStorage).
 * @returns {boolean}
 */
export function hasSave() {
  try { if (localStorage.getItem(SAVE_KEY) !== null) return true; } catch (_) {}
  try { if (sessionStorage.getItem(SAVE_KEY) !== null) return true; } catch (_) {}
  return false;
}

// ── ESTADÍSTICAS GLOBALES ─────────────────────────────────────

/**
 * Estructura por defecto de las estadísticas globales.
 */
const DEFAULT_GLOBAL = {
  gamesPlayed:          0,
  gamesWon:             0,
  gamesLost:            0,
  totalScore:           0,
  bestScore:            0,
  bestScoreDiff:        null,
  totalTurns:           0,
  reelections:          0,   // veces que el jugador fue reelecto/a
  secondTermsCompleted: 0,   // segundo mandatos completados
  allUnlocked:          [],
  diffStats: {
    easy:   { played: 0, won: 0 },
    normal: { played: 0, won: 0 },
    hard:   { played: 0, won: 0 },
    ultra:  { played: 0, won: 0 },
  },
  heritageStats: {
    populista: { played: 0, won: 0 },
    ortodoxo:  { played: 0, won: 0 },
    crisis:    { played: 0, won: 0 },
    estable:   { played: 0, won: 0 },
  },
};

/**
 * Carga las estadísticas globales desde localStorage.
 * @returns {object} estadísticas globales (nunca null)
 */
export function loadGlobal() {
  try {
    const raw = localStorage.getItem(GLOBAL_KEY);
    if (!raw) return { ...DEFAULT_GLOBAL };
    const parsed = JSON.parse(raw);
    // Merge con defaults para compatibilidad hacia adelante
    return {
      ...DEFAULT_GLOBAL,
      ...parsed,
      diffStats:            { ...DEFAULT_GLOBAL.diffStats,    ...(parsed.diffStats    || {}) },
      heritageStats:        { ...DEFAULT_GLOBAL.heritageStats,...(parsed.heritageStats|| {}) },
      reelections:          parsed.reelections          ?? 0,
      secondTermsCompleted: parsed.secondTermsCompleted ?? 0,
    };
  } catch (e) {
    console.warn('[storage] No se pudo cargar estadísticas globales:', e);
    return { ...DEFAULT_GLOBAL };
  }
}

/**
 * Guarda las estadísticas globales en localStorage.
 * @param {object} global
 */
export function saveGlobal(global) {
  try {
    localStorage.setItem(GLOBAL_KEY, JSON.stringify(global));
  } catch (e) {
    console.warn('[storage] No se pudo guardar estadísticas globales:', e);
  }
}

/**
 * Registra los resultados de una partida terminada en las estadísticas globales.
 * @param {object} state  - estado final del juego
 * @param {number} score  - puntaje calculado
 */
export function recordGameToGlobal(state, score) {
  const global = loadGlobal();

  global.gamesPlayed++;
  global.totalTurns += state.turn;

  if (state.won) {
    global.gamesWon++;
    global.totalScore += score;
    if (score > global.bestScore) {
      global.bestScore     = score;
      global.bestScoreDiff = state.difficulty;
    }
  } else {
    global.gamesLost++;
  }

  // Stats por dificultad
  const diff = state.difficulty || 'normal';
  if (!global.diffStats[diff]) global.diffStats[diff] = { played: 0, won: 0 };
  global.diffStats[diff].played++;
  if (state.won) global.diffStats[diff].won++;

  // Stats por herencia
  const hid = state.heritageId || 'estable';
  if (!global.heritageStats[hid]) global.heritageStats[hid] = { played: 0, won: 0 };
  global.heritageStats[hid].played++;
  if (state.won) global.heritageStats[hid].won++;

  // Reelecciones y segundos mandatos
  if (state.reelection?.reelected)      global.reelections++;
  if (state.won && state.isSecondTerm)  global.secondTermsCompleted++;

  // Acumular logros desbloqueados
  for (const achId of (state.unlockedAchievements || [])) {
    if (!global.allUnlocked.includes(achId)) {
      global.allUnlocked.push(achId);
    }
  }

  saveGlobal(global);
  return global;
}

/**
 * Elimina todas las estadísticas globales (reset total).
 */
export function clearGlobal() {
  localStorage.removeItem(GLOBAL_KEY);
}
