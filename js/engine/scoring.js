"use strict";

import { CONFIG, IND_META, BAD_KEYS } from '../config.js';

// ============================================================
// SCORING ENGINE
// Funciones puras que calculan zonas, colores y puntajes.
// No tienen estado propio — sólo reciben indicadores y devuelven valores.
// ============================================================

/**
 * Devuelve la zona de un indicador según su valor.
 * @param {string} key  - clave del indicador (ej: 'ipc')
 * @param {number} val  - valor actual (0-100)
 * @returns {'safe'|'warn'|'danger'}
 */
export function getZone(key, val) {
  const t = CONFIG.THRESHOLDS[key];
  if (!t) return 'safe';
  if (t.low_bad) {
    // Indicadores donde BAJO es malo (reservas, produccion, confianza)
    if (val <= t.danger) return 'danger';
    if (val <= t.warn)   return 'warn';
    return 'safe';
  } else {
    // Indicadores donde ALTO es malo (ipc, deuda, riesgo, pobreza, desocupacion)
    if (val >= t.danger) return 'danger';
    if (val >= t.warn)   return 'warn';
    return 'safe';
  }
}

/**
 * Devuelve el color CSS según la zona de un indicador.
 * @param {string} key
 * @param {number} val
 * @returns {string} color hex
 */
export function getColor(key, val) {
  const zone = getZone(key, val);
  return zone === 'danger' ? '#e74c3c'
       : zone === 'warn'    ? '#f39c12'
       :                      '#27ae60';
}

/**
 * Calcula el puntaje de gestión (0-100) según los indicadores finales.
 * Fórmula original del v11, preservada exactamente.
 * @param {object} ind - objeto con los 8 indicadores
 * @returns {number} puntaje redondeado (0-100)
 */
export function getScore(ind) {
  const score =
    ind.confianza      * 0.20 +
    (100 - ind.pobreza)* 0.20 +
    (100 - ind.ipc)    * 0.15 +
    (100 - ind.desocupacion) * 0.15 +
    ind.produccion     * 0.15 +
    ind.reservas       * 0.10 +
    (100 - ind.riesgo) * 0.05;
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Calcula el porcentaje estimado de reelección basado en los indicadores.
 * @param {object} ind - objeto con los 8 indicadores
 * @returns {number} porcentaje (0-100)
 */
export function computeReelectionPct(ind) {
  // Basado en confianza y condiciones sociales/económicas
  const base = getScore(ind);
  // Bonus si las condiciones sociales son buenas
  const socialBonus = (ind.pobreza < 25 ? 5 : 0) + (ind.desocupacion < 9 ? 3 : 0);
  // Penalidad si la inflación o el riesgo son altos
  const macroPenalty = (ind.ipc > 60 ? -8 : 0) + (ind.riesgo > 55 ? -5 : 0);
  const pct = base * 0.7 + ind.confianza * 0.3 + socialBonus + macroPenalty;
  return Math.round(Math.max(0, Math.min(100, pct)));
}

/**
 * Aplica los efectos de una opción a los indicadores.
 * Combina tres multiplicadores en cascada:
 *   1. CONFIG.EFFECT_MULTIPLIER  — multiplicador de dificultad (global)
 *   2. effectMods[key]           — modificador del ministro para ese indicador
 *
 * Ejemplo: raw=+3, difficulty=1.3 (hard), minister IPC mod=0.78
 *   delta = 3 × 1.3 × 0.78 ≈ 3.0  (el ministro amortigua el shock inflacionario)
 *
 * @param {object} ind        - indicadores actuales
 * @param {object} efectos    - efectos crudos de la opción elegida
 * @param {object} effectMods - modificadores por indicador del gabinete (default: {})
 *                              Viene de state.effectMods, calculado en newState().
 * @returns {object} nuevos indicadores (copia modificada, mismos keys)
 */
export function applyEffects(ind, efectos, effectMods = {}) {
  const mult = CONFIG.EFFECT_MULTIPLIER;
  const next = { ...ind };
  for (const key of Object.keys(efectos)) {
    if (next[key] === undefined) continue;
    const ministerMod = effectMods[key] ?? 1.0;
    const delta       = efectos[key] * mult * ministerMod;
    next[key] = Math.round(Math.max(0, Math.min(100, next[key] + delta)));
  }
  return next;
}

/**
 * Verifica si el estado actual cumple alguna condición de derrota.
 * @param {object} ind - indicadores actuales
 * @returns {string|null} motivo de derrota o null si no hay derrota
 */
export function checkDefeat(ind) {
  // Math.round(): los efectos de inercia pueden dejar decimales (ej: 0.2).
  // Redondeamos para que indicadores en zona de colapso disparen la derrota correctamente.
  const confianza = Math.round(ind.confianza);
  const pobreza   = Math.round(ind.pobreza);

  if (confianza <= CONFIG.DEFEAT_CONFIANZA) {
    return `La confianza ciudadana llegó a ${confianza}%. El pueblo exige tu renuncia.`;
  }
  if (pobreza >= CONFIG.DEFEAT_POBREZA) {
    return `La pobreza alcanzó ${pobreza}%. La crisis social es insostenible.`;
  }
  return null;
}

/**
 * Calcula el diploma obtenido según el puntaje final.
 * @param {number} score - puntaje (0-100)
 * @returns {'gold'|'silver'|'bronze'|null}
 */
export function getDiploma(score) {
  if (score >= CONFIG.DIPLOMA_GOLD)   return 'gold';
  if (score >= CONFIG.DIPLOMA_SILVER) return 'silver';
  if (score >= CONFIG.DIPLOMA_BRONZE) return 'bronze';
  return null;
}

/**
 * Devuelve el texto de la estrella de reelección según el porcentaje.
 * @param {number} pct
 * @returns {string}
 */
export function getReelectionLabel(pct) {
  if (pct >= 60) return '🌟 Reelección segura';
  if (pct >= 45) return '🤔 Resultado incierto';
  if (pct >= 30) return '📉 Derrota probable';
  return '❌ Derrota contundente';
}

/**
 * Calcula el resultado electoral completo al final del mandato.
 * Devuelve si fue reelecto/a, tipo de victoria/derrota, porcentaje y factores.
 * @param {object} state - estado final del juego
 * @returns {{ pct, reelected, type, factors }}
 */
export function computeReelection(state) {
  const ind  = state.indicadores;
  const base = computeReelectionPct(ind);

  // Victoria amplia genera expectativas más altas → umbral sube
  const mandatePenalty = { amplio: 8, coalicion: 4, ajustado: 0 }[state.mandateType] || 0;
  const pct = Math.max(0, Math.min(100, base - mandatePenalty));

  const reelected = pct >= 50;

  const type =
    pct >= 65 ? 'landslide'   :   // Victoria amplia
    pct >= 55 ? 'comfortable' :   // Victoria cómoda
    pct >= 50 ? 'narrow'      :   // Ajustada
    pct >= 38 ? 'close_loss'  :   // Derrota ajustada
    pct >= 25 ? 'loss'        :   // Derrota clara
               'rout';            // Derrota histórica

  // ── Factores positivos y negativos que influyeron ──
  const HIGH_BAD = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);
  const IND_INFO = {
    ipc:          { name: 'Inflación',   emoji: '📈' },
    deuda:        { name: 'Deuda',       emoji: '💸' },
    reservas:     { name: 'Reservas',    emoji: '💰' },
    riesgo:       { name: 'Riesgo País', emoji: '⚠️' },
    pobreza:      { name: 'Pobreza',     emoji: '📉' },
    desocupacion: { name: 'Desempleo',   emoji: '👥' },
    produccion:   { name: 'Producción',  emoji: '🏭' },
    confianza:    { name: 'Confianza',   emoji: '🤝' },
  };

  const allFactors = Object.entries(ind).map(([key, val]) => {
    const info = IND_INFO[key];
    if (!info) return null;
    const isBad  = HIGH_BAD.has(key);
    // Normalizar a 0-1 donde 1 es "bueno para la reelección"
    const norm   = isBad ? (100 - val) / 100 : val / 100;
    const impact = norm >= 0.60 ? 'positive' : norm <= 0.38 ? 'negative' : 'neutral';
    return { key, name: info.name, emoji: info.emoji, val: Math.round(val), impact, isBad, norm };
  }).filter(Boolean);

  const positives = allFactors
    .filter(f => f.impact === 'positive')
    .sort((a, b) => b.norm - a.norm)
    .slice(0, 3);
  const negatives = allFactors
    .filter(f => f.impact === 'negative')
    .sort((a, b) => a.norm - b.norm)
    .slice(0, 3);

  return { pct: Math.round(pct), reelected, type, factors: { positives, negatives } };
}

/**
 * Genera el texto de evaluación del mandato según el puntaje.
 * @param {number} score
 * @returns {string}
 */
export function getMandateVerdict(score) {
  if (score >= 80) return 'Un mandato histórico. La ciudadanía te recordará como uno de los mejores presidentes.';
  if (score >= 65) return 'Una gestión sólida con luces y sombras. Dejaste el país mejor de como lo encontraste.';
  if (score >= 45) return 'Un mandato regular. Sobreviviste, pero los problemas estructurales siguen en pie.';
  if (score >= 25) return 'Una gestión difícil. Muchas decisiones no tuvieron el efecto esperado.';
  return 'Un mandato para el olvido. El país quedó peor que al inicio. La historia será severa.';
}
