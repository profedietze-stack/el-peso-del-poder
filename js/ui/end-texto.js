"use strict";

import { totalTurnos } from '../engine/mandato.js';

// ============================================================
// TEXTOS DE LA PANTALLA FINAL (puros, sin DOM, para poder probarlos)
//
// Medido en la pantalla de derrota: con 33 puntos en Normal el alumno que perdió veía
// «DIPLOMA DE BRONCE» con medalla de bronce, porque el diploma se calculaba solo con el
// puntaje (el título sí decía «Mandato interrumpido»: se contradecían). Y el motivo de
// la derrota —«la confianza ciudadana llegó a 2 %»— solo salía en la ventana roja
// anterior y no volvía a aparecer: justo lo que el alumno tiene que entender.
// ============================================================

const MEDALLAS = { gold: '🥇', silver: '🥈', bronze: '🥉', null: '📜' };
const ETIQUETAS = {
  gold: 'DIPLOMA DE ORO', silver: 'DIPLOMA DE PLATA', bronze: 'DIPLOMA DE BRONCE', null: 'GESTIÓN CRITICADA',
};
const TITULOS = {
  gold: 'Estadista Excepcional', silver: 'Gobierno Sólido', bronze: 'Gestión Regular', null: 'Mandato Difícil',
};

/**
 * Medalla, rótulo y título del diploma. Solo se entrega diploma a quien terminó el mandato:
 * si lo perdió, no hay medalla ni «diploma de» nada.
 * @param {{won?: boolean, isSecondTerm?: boolean}} state
 * @param {'gold'|'silver'|'bronze'|null} diploma lo que corresponde por puntaje
 */
export function textosDiploma(state, diploma) {
  if (state?.won !== true) {
    return { medal: '📜', tipo: 'MANDATO INTERRUMPIDO', title: 'Mandato Interrumpido', clase: 'none' };
  }
  const k = diploma || 'null';
  return {
    medal: MEDALLAS[k],
    tipo: state.isSecondTerm ? `2do MANDATO · ${ETIQUETAS[k]}` : ETIQUETAS[k],
    title: TITULOS[k],
    clase: diploma || 'none',
  };
}

/** Texto a salvo de HTML (el motivo sale del motor, pero se escapa igual). */
function _escapar(t) {
  return String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/**
 * Bloque «Por qué terminó tu mandato» para la diapositiva 2 (cadena vacía si no se perdió).
 * @param {{lost?: boolean, lostReason?: string, turn?: number}} state
 */
export function motivoDeDerrota(state) {
  if (!state || state.lost !== true || !state.lostReason) return '';
  const mes = Number.isFinite(state.turn) ? ` Fue en el mes ${state.turn} de ${totalTurnos()}.` : '';
  return `<div class="end-motivo"><strong>💀 Por qué terminó tu mandato</strong><p>${_escapar(state.lostReason)}${mes}</p></div>`;
}
