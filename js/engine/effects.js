"use strict";

// ============================================================
// EFFECTS ENGINE — Efectos persistentes e inercia de indicadores
//
// Opción A: Efectos con duración fija (activeEffects[])
//   Ciertas decisiones aplican un delta menor en los N turnos
//   siguientes, representando el arrastre estructural de una política.
//
// Opción D: Inercia natural de los indicadores (INERTIA_RULES)
//   Los indicadores en zonas extremas se mueven solos cada turno,
//   simulando espirales económicas reales.
//   Intensidad escalada por dificultad.
// ============================================================

// ── OPCIÓN D: INERCIA ─────────────────────────────────────────

/**
 * Multiplicador de inercia por dificultad.
 * easy=0 (sin inercia), ultra=1.5 (espirales brutales).
 */
const INERTIA_MULT = {
  easy:   0,
  normal: 0.6,
  hard:   1.0,
  ultra:  2.0,   // subido de 1.5 — las espirales negativas son más brutales
};

/**
 * Reglas de inercia. Cada una define:
 *   id:    identificador único
 *   label: texto para mostrar al jugador
 *   bad:   true si es una espiral negativa
 *   when:  función que determina si se activa (recibe indicadores)
 *   apply: delta por turno (antes del multiplicador de dificultad)
 */
export const INERTIA_RULES = [

  // ── ESPIRALES NEGATIVAS ───────────────────────────────────

  {
    id:    'hiperinflacion',
    label: 'Espiral hiperinflacionaria',
    emoji: '🔥',
    bad:   true,
    // IPC > 65: la inflación se retroalimenta — los precios suben solos
    when:  ind => ind.ipc > 65,
    apply: { ipc: +1.6 },
  },
  {
    id:    'inflacion_persistente',
    label: 'Presión inflacionaria persistente',
    emoji: '📈',
    bad:   true,
    // IPC 51-65: inercia moderada
    when:  ind => ind.ipc > 51 && ind.ipc <= 65,
    apply: { ipc: +0.6 },
  },
  {
    id:    'fuga_capitales',
    label: 'Fuga de capitales',
    emoji: '💸',
    bad:   true,
    // Riesgo país alto → las reservas se erosionan y la deuda sube
    when:  ind => ind.riesgo > 62,
    apply: { reservas: -1.5, deuda: +0.5 },
  },
  {
    id:    'desempleo_estructural',
    label: 'Desempleo estructural',
    emoji: '👥',
    bad:   true,
    // Desocupación muy alta → arrastra la pobreza hacia arriba
    when:  ind => ind.desocupacion > 18,
    apply: { pobreza: +0.8 },
  },
  {
    id:    'trampa_productiva',
    label: 'Trampa productiva',
    emoji: '🏭',
    bad:   true,
    // Producción en crisis → genera más desempleo
    when:  ind => ind.produccion < 35,
    apply: { desocupacion: +0.5 },
  },
  {
    id:    'crisis_gobernabilidad',
    label: 'Crisis de gobernabilidad',
    emoji: '🏛️',
    bad:   true,
    // Confianza en colapso → retroalimenta la desconfianza
    when:  ind => ind.confianza < 22,
    apply: { confianza: -1.2 },
  },
  {
    id:    'deuda_insostenible',
    label: 'Deuda insostenible',
    emoji: '💳',
    bad:   true,
    // Deuda > 75 → intereses crecientes presionan el IPC y el riesgo
    when:  ind => ind.deuda > 75,
    apply: { ipc: +0.4, riesgo: +0.3 },
  },

  // ── CÍRCULOS VIRTUOSOS (más débiles) ─────────────────────

  {
    id:    'dinamismo_industrial',
    label: 'Dinamismo industrial',
    emoji: '⚙️',
    bad:   false,
    // Producción alta → genera empleo gradualmente
    when:  ind => ind.produccion > 72,
    apply: { desocupacion: -0.3 },
  },
  {
    id:    'solidez_cambiaria',
    label: 'Solidez cambiaria',
    emoji: '💰',
    bad:   false,
    // Reservas altas → reduce el riesgo país gradualmente
    when:  ind => ind.reservas > 76,
    apply: { riesgo: -0.3 },
  },

  // ── RELACIONES CRUZADAS — Economía más realista ───────────
  // Estas reglas modelan interdependencias que el motor base
  // no capturaba: pobreza ↔ confianza, reservas ↔ riesgo, etc.

  {
    id:    'pobreza_erosiona_confianza',
    label: 'Erosión social por pobreza',
    emoji: '📉',
    bad:   true,
    // Pobreza alta → desgasta la gobernabilidad y la confianza ciudadana
    when:  ind => ind.pobreza > 52,
    apply: { confianza: -0.4 },
  },
  {
    id:    'reservas_bajas_presion',
    label: 'Presión cambiaria por reservas',
    emoji: '🏦',
    bad:   true,
    // Reservas muy bajas → tensión cambiaria que sube precios y riesgo país
    when:  ind => ind.reservas < 25,
    apply: { riesgo: +0.5, ipc: +0.3 },
  },
  {
    id:    'espiral_precios_pobreza',
    label: 'Espiral inflación-pobreza',
    emoji: '🛒',
    bad:   true,
    // Inflación alta + pobreza alta = los más vulnerables no pueden absorber precios
    when:  ind => ind.ipc > 55 && ind.pobreza > 38,
    apply: { pobreza: +0.4 },
  },
  {
    id:    'crecimiento_genera_empleo',
    label: 'Crecimiento genera empleo',
    emoji: '🏗️',
    bad:   false,
    // Producción sólida + desempleo aún elevado = el mercado absorbe trabajadores
    when:  ind => ind.produccion > 65 && ind.desocupacion > 10,
    apply: { desocupacion: -0.3, pobreza: -0.2 },
  },
];

/**
 * Aplica las reglas de inercia al estado del juego.
 * Muta state.indicadores directamente (sin applyEffects — sin doble multiplicador).
 * @param {object} state — estado del juego (mutable)
 * @returns {{ changed: boolean, triggered: Array<{id,label,emoji,bad}>, delta: object }}
 */
export function applyInertia(state) {
  const diff = state.difficulty || 'normal';
  const mult = INERTIA_MULT[diff] ?? 0.6;

  if (mult === 0) return { changed: false, triggered: [], delta: {} };

  const ind   = state.indicadores;
  const delta = {};

  // En ultra, los círculos virtuosos son más difíciles de activar
  // (los umbrales requeridos para la "prosperidad" son más altos).
  // Las espirales negativas mantienen los mismos umbrales pero golpean ×2.0.
  const ultraVirtueOverrides = diff === 'ultra' ? {
    dinamismo_industrial:      ind => ind.produccion  > 80,                          // era >72
    solidez_cambiaria:         ind => ind.reservas    > 85,                          // era >76
    crecimiento_genera_empleo: ind => ind.produccion  > 75 && ind.desocupacion > 10, // era >65
  } : null;

  // Evaluar TODAS las reglas ANTES de aplicar (evitar que una regla afecte a otra)
  const active = INERTIA_RULES.filter(r => {
    if (ultraVirtueOverrides && !r.bad && ultraVirtueOverrides[r.id]) {
      return ultraVirtueOverrides[r.id](ind);
    }
    return r.when(ind);
  });
  for (const rule of active) {
    for (const [k, v] of Object.entries(rule.apply)) {
      delta[k] = (delta[k] || 0) + v * mult;
    }
  }

  // Aplicar delta acumulado con precisión de 1 decimal
  let changed = false;
  for (const [k, v] of Object.entries(delta)) {
    if (Math.abs(v) < 0.05) continue;
    const prev = ind[k];
    const next = Math.max(0, Math.min(100, prev + v));
    ind[k] = Math.round(next * 10) / 10;
    if (ind[k] !== prev) changed = true;
  }

  return { changed, triggered: active, delta };
}

// ── OPCIÓN A: EFECTOS ACTIVOS ─────────────────────────────────

/**
 * Registra un efecto persistente en state.activeEffects cuando
 * la opción elegida tiene campo `duracion`.
 *
 * Si la opción tiene `efectosPersistentes`, los usa directamente.
 * Si no, auto-calcula al 22% de los efectos originales.
 *
 * @param {object} state  — estado del juego (mutable)
 * @param {object} option — opción elegida por el jugador
 * @param {object} event  — evento actual
 */
export function addActiveEffect(state, option, event) {
  if (!option.duracion || option.duracion <= 0) return;

  let persist = option.efectosPersistentes
    ? { ...option.efectosPersistentes }
    : _autoCalcPersist(option.efectos || {});

  if (!persist || Object.keys(persist).length === 0) return;

  state.activeEffects = state.activeEffects || [];

  // Reemplazar si ya había un efecto activo del mismo evento
  // (evitar que se acumulen si el jugador reinicia sin borrar el estado)
  state.activeEffects = state.activeEffects.filter(ae => ae.eventId !== event.id);

  const shortTitle = event.titulo.length > 30
    ? event.titulo.substring(0, 28) + '…'
    : event.titulo;

  state.activeEffects.push({
    id:                  `ae-${event.id}-${state.turn}`,
    eventId:             event.id,
    sourceTitle:         shortTitle,
    sourceTurn:          state.turn,
    turnsLeft:           option.duracion,
    totalDuration:       option.duracion,
    efectosPersistentes: persist,
  });
}

/**
 * Aplica todos los efectos activos del turno (decrementa contadores).
 * Muta state.indicadores directamente.
 * @param {object} state — estado del juego (mutable)
 * @returns {{ changed: boolean, expired: object[], applied: object[] }}
 */
export function applyActiveEffects(state) {
  if (!state.activeEffects?.length) return { changed: false, expired: [], applied: [] };

  const expired = [];
  const applied = [];
  let changed   = false;

  const ind = state.indicadores;

  for (const ae of state.activeEffects) {
    // Aplicar sin multiplicador de dificultad (los valores ya están calibrados)
    let hadEffect = false;
    for (const [k, v] of Object.entries(ae.efectosPersistentes)) {
      if (ind[k] === undefined) continue;
      const next = Math.round(Math.max(0, Math.min(100, ind[k] + v)) * 10) / 10;
      if (next !== ind[k]) { ind[k] = next; hadEffect = true; }
    }
    if (hadEffect) { applied.push(ae); changed = true; }

    ae.turnsLeft--;
    if (ae.turnsLeft <= 0) expired.push(ae);
  }

  state.activeEffects = state.activeEffects.filter(ae => ae.turnsLeft > 0);
  return { changed, expired, applied };
}

// ── INTERNOS ─────────────────────────────────────────────────

/**
 * Auto-calcula efectos persistentes al 22% de los originales.
 * Filtra valores de magnitud < 0.5 (irrelevantes).
 * @param {object} efectos
 * @returns {object}
 */
function _autoCalcPersist(efectos) {
  const result  = {};
  const FACTOR  = 0.22;
  const MIN_ABS = 0.5;
  for (const [k, v] of Object.entries(efectos)) {
    const scaled = v * FACTOR;
    if (Math.abs(scaled) >= MIN_ABS) {
      result[k] = Math.round(scaled * 10) / 10;
    }
  }
  return result;
}
