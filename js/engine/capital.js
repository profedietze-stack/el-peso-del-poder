"use strict";

// ============================================================
// CAPITAL POLÍTICO — por qué el tipo de mandato importa
//
// Un recurso de 0 a 100 que el mandato fija al empezar y que las decisiones
// gastan o devuelven. Con poco capital el gobierno es débil: lo que le sale mal
// duele más. Con mucho, lo que le sale bien rinde más.
// Diseño: docs/superpowers/specs/2026-10-17-capital-politico-design.md
//
// Todo es puro (recibe el estado, no toca la pantalla) para poder medirlo con
// simulaciones completas del motor real.
//
// POR QUÉ NO HAY OPCIONES BLOQUEADAS (la idea original del diseño, medida y descartada):
// bloquear las opciones caras le sirve al que decide mal. Con el bloqueo, Normal al azar
// pasaba de ~90 % a 100 % de victorias y Difícil al azar de 14 % a 60-80 %, porque las
// opciones de grandes cambios son también las que más pueden hundir un indicador. Y a un
// jugador competente no lo afectaba: hay otras opciones casi igual de buenas. Ahora el
// capital no prohíbe nada: cuesta, y se nota en cuánto rinde cada decisión.
//
// Cuánto cambia el capital con una opción:
//   · si trae `capital` (número), ese valor: negativo gasta, positivo devuelve;
//   · si no, se deriva de dos cosas:
//       – popularidad: si baja la confianza X cuesta X; si la sube X devuelve ceil(X/6);
//       – ambición: cuanto más mejora de golpe la medida (suma de mejoras), más capital
//         cuesta (una reforma grande necesita respaldo del Congreso).
// ============================================================

import { BAD_KEYS } from '../config.js';

export const CAPITAL = {
  TOPE: 100,
  INICIAL: { amplio: 80, coalicion: 65, ajustado: 40 },
  REGEN: 1,                 // por turno
  GANANCIA_DIV: 6,          // una opción que sube la confianza X devuelve ceil(X / 6)
  MULT_AJUSTADO: 1.25,       // en Ajustado lo que se gana vale más
  AUDACIA_BASE: 12,         // hasta esta suma de mejoras la medida no cuesta por ambiciosa
  AUDACIA_DIV: 3,           // cada tanto de más cuesta 1
  DEBIL_BAJO: 40,           // por debajo de este capital, lo malo duele más…
  DEBIL_EXTRA: 0.06,        // …hasta +6 % con capital 0
  FUERTE_ALTO: 60,          // por encima de este capital, lo bueno rinde más…
  FUERTE_EXTRA: 0.09,       // …hasta +9 % con capital 100
  TOPE_ALIANZA_ROTA: 45,    // Coalición con la alianza rota
  REGEN_ALIANZA_ROTA: -1,
};

/** Capital con el que arranca un mandato (desconocido → Ajustado, el más cauto). */
export function capitalInicial(mandateType) {
  return CAPITAL.INICIAL[mandateType] ?? CAPITAL.INICIAL.ajustado;
}

/** Máximo de capital: la alianza rota lo baja. */
export function topeDeCapital(state) {
  return state.alianzaRota ? CAPITAL.TOPE_ALIANZA_ROTA : CAPITAL.TOPE;
}

/**
 * Cuánto capital cuesta lo ambiciosa de una medida (0 si es chica): cuanto más mejora
 * de golpe, más respaldo del Congreso necesita. Solo cuentan las MEJORAS: una medida
 * desastrosa no necesita permiso de nadie.
 */
export function costoDeAmbicion(opcion) {
  let mejora = 0;
  for (const [k, d] of Object.entries(opcion?.efectos ?? {})) {
    if (!Number.isFinite(d)) continue;
    const bueno = BAD_KEYS.has(k) ? -d : d;
    if (bueno > 0) mejora += bueno;
  }
  return Math.max(0, Math.ceil((mejora - CAPITAL.AUDACIA_BASE) / CAPITAL.AUDACIA_DIV));
}

/** Cuánto cambia el capital si se elige `opcion` (negativo = gasta). */
export function variacionDeOpcion(opcion, mandateType) {
  const propio = Number.isFinite(opcion?.capital);
  const conf = opcion?.efectos?.confianza ?? 0;
  let base = propio ? opcion.capital : conf < 0 ? conf : Math.ceil(conf / CAPITAL.GANANCIA_DIV);
  if (base > 0 && mandateType === 'ajustado') base = Math.round(base * CAPITAL.MULT_AJUSTADO);
  if (!propio) base -= costoDeAmbicion(opcion);
  return base;
}

/** Recuperación natural al empezar un turno. El turno 1 no cuenta. */
export function iniciarTurnoCapital(state) {
  if (state.turn <= 1) return;
  const regen = CAPITAL.REGEN + (state.alianzaRota ? CAPITAL.REGEN_ALIANZA_ROTA : 0);
  state.capital = Math.max(0, Math.min(topeDeCapital(state), state.capital + regen));
}

/** Aplica el costo o la ganancia de la opción elegida. Devuelve la variación real. */
export function aplicarCapital(state, opcion) {
  const antes = state.capital;
  const v = variacionDeOpcion(opcion, state.mandateType);
  state.capital = Math.max(0, Math.min(topeDeCapital(state), antes + v));
  const real = state.capital - antes;
  if (real < 0) state.capitalGastado = (state.capitalGastado ?? 0) - real;
  return real;
}

/**
 * Con poco capital el gobierno es débil: lo que le sale mal duele más. Con mucho,
 * lo que le sale bien rinde más. Devuelve una copia de `efectos` escalada
 * («malo» = lo que empeora el indicador).
 */
export function efectosSegunCapital(efectos, capital) {
  const debil = Math.max(0, (CAPITAL.DEBIL_BAJO - capital) / CAPITAL.DEBIL_BAJO) * CAPITAL.DEBIL_EXTRA;
  const fuerte = Math.max(0, (capital - CAPITAL.FUERTE_ALTO) / (CAPITAL.TOPE - CAPITAL.FUERTE_ALTO)) * CAPITAL.FUERTE_EXTRA;
  if (!debil && !fuerte) return efectos;
  const salida = {};
  for (const [k, d] of Object.entries(efectos ?? {})) {
    if (!Number.isFinite(d)) { salida[k] = d; continue; }
    const malo = BAD_KEYS.has(k) ? d > 0 : d < 0;
    salida[k] = d * (1 + (malo ? debil : fuerte));
  }
  return salida;
}

/** «Débil», «Estable» o «Fuerte»: para el cartel de la barra. */
export function estadoDeCapital(capital) {
  if (capital < CAPITAL.DEBIL_BAJO) return 'debil';
  if (capital > CAPITAL.FUERTE_ALTO) return 'fuerte';
  return 'estable';
}
