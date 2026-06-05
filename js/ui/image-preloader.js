"use strict";

// ============================================================
// IMAGE PRELOADER — Precarga progresiva de imágenes de eventos
//
// Mientras el jugador lee el modal de consecuencias (3-8 seg),
// precargamos las imágenes de los próximos eventos del pool.
//
// Estrategia:
//   · Se ejecuta al terminar cada decisión (fire-and-forget)
//   · Cache interno evita precargar la misma URL dos veces
//   · Filtra eventos ya vistos (usedEventIds) y el evento actual
//   · new Image().src = url → el browser la cachea en disco/memoria
//   · No bloquea el hilo principal (no await, no promise)
//
// Resultado: cuando llega el evento, la imagen ya está en caché
// HTTP del browser → tiempo de carga visualmente imperceptible.
// ============================================================

import { EVENTS }        from '../data/events.js';
import { getEventImage } from '../data/event-images.js';

/** URLs ya precargadas en esta sesión — evita trabajo duplicado */
const _cache = new Set();

/** Cuántos eventos precargar por llamada */
const PRELOAD_COUNT = 6;

/**
 * Precarga las imágenes de los próximos N eventos del pool disponible.
 * Debe llamarse después de cada decisión del jugador, mientras el modal
 * de consecuencias está visible (ventana de inactividad de 3-8 segundos).
 *
 * @param {object} state - estado actual del juego
 */
export function preloadUpcomingImages(state) {
  if (!state) return;

  // Usar requestIdleCallback si está disponible (Chrome/Android);
  // si no, setTimeout(0) para no bloquear el frame actual.
  const run = () => _doPreload(state);

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 0);
  }
}

// ── INTERNOS ──────────────────────────────────────────────────

function _doPreload(state) {
  const usedIds   = _resolveUsedIds(state);
  const currentId = state.currentEvent?.id ?? -1;

  // Pool: eventos no usados, no crisis-auto, no el evento actual
  const candidates = EVENTS.filter(e =>
    !usedIds.has(e.id) &&
    !e.isCrisisAuto &&
    e.id !== currentId
  );

  // Tomar los primeros PRELOAD_COUNT del pool (ya están ponderados
  // en el array original; la selección no es determinista pero
  // cubre la mayoría del pool pendiente)
  const toPreload = candidates.slice(0, PRELOAD_COUNT);

  for (const event of toPreload) {
    const url = getEventImage(event);
    if (_cache.has(url)) continue;   // ya precargada en esta sesión
    _cache.add(url);

    const img = new Image();
    img.src = url;   // fire-and-forget — el browser cachea la respuesta HTTP
  }
}

/**
 * Normaliza usedEventIds tanto si es Set (estado en memoria) como
 * Array (posible tras deserializar desde localStorage).
 * @param {object} state
 * @returns {Set<number>}
 */
function _resolveUsedIds(state) {
  if (state.usedEventIds instanceof Set)   return state.usedEventIds;
  if (Array.isArray(state.usedEventIds))   return new Set(state.usedEventIds);
  return new Set();
}
