"use strict";

// ============================================================
// LOGROS — 20 en total (12 originales + 8 nuevos)
// Estructura: { id, icon, name, desc, why(s), check(s, ctx) }
//   s   → estado de juego actual (ver engine/state.js)
//   ctx → { getScore, getZone, IND_META } inyectado por el engine
//
// Campos de s usados:
//   s.indicadores.{ipc,deuda,reservas,riesgo,pobreza,desocupacion,produccion,confianza}
//   s.turn         → turno actual (48 = mandato completo)
//   s.won          → boolean — ganó el mandato
//   s.history[]    → array de { snap:{...indicadores} } por turno
//   s.adata        → objeto de seguimiento acumulado (ver state.js)
//     .ipcNeverHigh   → IPC nunca superó 55
//     .confianzaMax   → máxima confianza alcanzada
//     .confianzaMin   → mínima confianza alcanzada  ← NUEVO
//     .neverCorrupt   → nunca eligió opción corrupta
//     .crisisCount    → cantidad de veces que algún indicador entró en peligro
//     .advisorUsed    → cantidad de veces que usó asesores
//     .autoCrisisHandled → cantidad de crisis automáticas gestionadas  ← NUEVO
// ============================================================

// ── LOGROS ORIGINALES (1–12) ─────────────────────────────────

const ORIGINAL_ACHIEVEMENTS = [
  {
    id: "hierro",
    icon: "🛡️",
    name: "Estabilidad de Hierro",
    desc: "El IPC nunca superó 55 durante todo el mandato.",
    why: s => `Mantuviste la inflación bajo control durante las 48 decisiones. El IPC final fue ${Math.round(s.indicadores.ipc)}%.`,
    check: (s, _ctx) => s.adata.ipcNeverHigh && s.turn >= 12,
  },
  {
    id: "masas",
    icon: "💪",
    name: "Líder de Masas",
    desc: "La confianza ciudadana llegó al 80% o más en algún momento.",
    why: s => `En algún momento de tu mandato la confianza ciudadana alcanzó ${Math.round(s.adata.confianzaMax)}%.`,
    check: (s, _ctx) => s.adata.confianzaMax >= 80,
  },
  {
    id: "transparencia",
    icon: "🔍",
    name: "Transparencia Total",
    desc: "Nunca elegiste una opción marcada como corrupta en todo el mandato.",
    why: _s => `Atravesaste los escándalos de corrupción sin sucumbir a la tentación. Tu gestión fue intachable éticamente.`,
    check: (s, _ctx) => s.adata.neverCorrupt,
  },
  {
    id: "default",
    icon: "💳",
    name: "Default Evitado",
    desc: "La deuda externa nunca superó 75 durante el mandato.",
    why: s => `Gestionaste la deuda con prudencia. El nivel final fue ${Math.round(s.indicadores.deuda)}%.`,
    check: (s, _ctx) => s.indicadores.deuda < 75 && !s.history.some(h => h.snap.deuda >= 75),
  },
  {
    id: "reservas",
    icon: "🏦",
    name: "Reservas Sólidas",
    desc: "Las reservas internacionales superaron 65 al finalizar el mandato.",
    why: s => `Cerraste el mandato con reservas internacionales en ${Math.round(s.indicadores.reservas)} puntos, por encima del umbral de seguridad.`,
    check: (s, _ctx) => s.indicadores.reservas > 65,
  },
  {
    id: "empleo",
    icon: "👷",
    name: "Pleno Empleo",
    desc: "La tasa de desocupación quedó bajo 9% al finalizar el mandato.",
    why: s => `Cerraste el mandato con una tasa de desocupación de ${Math.round(s.indicadores.desocupacion)}%, la más baja posible.`,
    check: (s, _ctx) => s.indicadores.desocupacion < 9,
  },
  {
    id: "produccion",
    icon: "🏭",
    name: "País Productivo",
    desc: "La producción industrial superó 72 al finalizar el mandato.",
    why: s => `La actividad industrial llegó a ${Math.round(s.indicadores.produccion)} puntos, por encima del umbral de zona productiva.`,
    check: (s, _ctx) => s.indicadores.produccion > 72,
  },
  {
    id: "justicia",
    icon: "⚖️",
    name: "Justicia Social",
    desc: "La pobreza quedó bajo 25% al finalizar el mandato.",
    why: s => `La pobreza bajó a ${Math.round(s.indicadores.pobreza)}%. Tus políticas sociales llegaron a quienes más lo necesitaban.`,
    check: (s, _ctx) => s.indicadores.pobreza < 25,
  },
  {
    id: "superv",
    icon: "🧗",
    name: "Superviviente",
    desc: "Completaste el mandato después de que al menos 3 indicadores entraran en zona crítica.",
    why: s => `Tu gobierno enfrentó ${s.adata.crisisCount} situaciones en zona crítica y aun así terminaste los 48 meses.`,
    check: (s, _ctx) => s.adata.crisisCount >= 3 && s.turn >= 48,
  },
  {
    id: "ejemplar",
    icon: "⭐",
    name: "Gestor Ejemplar",
    desc: "Obtuviste 60 puntos o más en el puntaje final de gestión.",
    why: (s, ctx) => `Tu puntaje final fue ${ctx.getScore(s.indicadores)}, reflejando un balance sólido en todos los indicadores.`,
    check: (s, ctx) => s.won && ctx.getScore(s.indicadores) >= 60,
  },
  {
    id: "incorruptible",
    icon: "🧭",
    name: "Sin Precio",
    desc: "Completaste el mandato sin elegir ninguna opción corrupta y con confianza por encima de 50.",
    why: s => `Terminaste el mandato sin comprometer tu integridad y con ${Math.round(s.indicadores.confianza)}% de confianza ciudadana.`,
    check: (s, _ctx) => s.adata.neverCorrupt && s.won && s.indicadores.confianza > 50,
  },
  {
    id: "equilibrista",
    icon: "🎯",
    name: "Equilibrista",
    desc: "Terminaste el mandato con todos los indicadores fuera de zona crítica (rojo).",
    why: _s => `Lograste que ningún indicador terminara en zona crítica, gestionando los trade-offs con precisión.`,
    check: (s, ctx) => s.won && ctx.IND_META.every(m => ctx.getZone(m.key, s.indicadores[m.key]) !== 'danger'),
  },
];

// ── LOGROS NUEVOS (13–20) ─────────────────────────────────────

const NEW_ACHIEVEMENTS = [
  {
    id: "paz_social",
    icon: "🕊️",
    name: "Paz Social",
    desc: "La confianza ciudadana nunca bajó de 40% durante todo el mandato.",
    why: s => `La confianza mínima registrada fue ${Math.round(s.adata.confianzaMin)}%. Supiste mantener el vínculo con la ciudadanía incluso en las peores tormentas.`,
    check: (s, _ctx) => (s.adata.confianzaMin ?? 100) >= 40 && s.turn >= 12,
  },
  {
    id: "inclusion",
    icon: "💜",
    name: "Inclusión Real",
    desc: "Cerraste el mandato con pobreza bajo 20% y desocupación bajo 8%.",
    why: s => `Pobreza: ${Math.round(s.indicadores.pobreza)}% — Desocupación: ${Math.round(s.indicadores.desocupacion)}%. Las dos heridas sociales más profundas de Argentina bajo tus mínimos históricos.`,
    check: (s, _ctx) => s.won && s.indicadores.pobreza < 20 && s.indicadores.desocupacion < 8,
  },
  {
    id: "perfecto",
    icon: "👑",
    name: "Mandato Perfecto",
    desc: "Obtuviste 75 puntos o más en el puntaje final: el máximo reconocimiento.",
    why: (s, ctx) => `Tu puntaje final fue ${ctx.getScore(s.indicadores)} — uno de los más altos registrados en la historia de El Peso del Poder.`,
    check: (s, ctx) => s.won && ctx.getScore(s.indicadores) >= 75,
  },
  {
    id: "fenix",
    icon: "🔥",
    name: "Fénix",
    desc: "Completaste el mandato luego de atravesar 5 o más situaciones de crisis crítica.",
    why: s => `Tu gobierno sobrevivió ${s.adata.crisisCount} situaciones en rojo. Como el ave fénix, renaciste de las cenizas de cada crisis.`,
    check: (s, _ctx) => s.adata.crisisCount >= 5 && s.won,
  },
  {
    id: "potencia",
    icon: "🌍",
    name: "Potencia Regional",
    desc: "Cerraste el mandato con riesgo país bajo 20 y reservas por encima de 75.",
    why: s => `Riesgo país: ${Math.round(s.indicadores.riesgo)} — Reservas: ${Math.round(s.indicadores.reservas)}. Argentina volvió a ser referente en la región.`,
    check: (s, _ctx) => s.won && s.indicadores.riesgo < 20 && s.indicadores.reservas > 75,
  },
  {
    id: "digital",
    icon: "🤖",
    name: "Argentina Digital",
    desc: "La producción industrial superó 80 al finalizar el mandato.",
    why: s => `Con ${Math.round(s.indicadores.produccion)} puntos de producción, convertiste a Argentina en un polo de innovación industrial y tecnológica.`,
    check: (s, _ctx) => s.won && s.indicadores.produccion > 80,
  },
  {
    id: "verde",
    icon: "🌿",
    name: "Desarrollo Sostenible",
    desc: "Ganaste el mandato con IPC bajo 35% y pobreza bajo 28%: economía sana y sociedad justa.",
    why: s => `IPC: ${Math.round(s.indicadores.ipc)}% — Pobreza: ${Math.round(s.indicadores.pobreza)}%. Demostraste que la estabilidad macroeconómica y la justicia social no son incompatibles.`,
    check: (s, _ctx) => s.won && s.indicadores.ipc < 35 && s.indicadores.pobreza < 28,
  },
  {
    id: "identidad",
    icon: "🏔️",
    name: "Con Identidad",
    desc: "Ganaste el mandato sin elegir opciones corruptas y con confianza ciudadana por encima de 75%.",
    why: s => `Terminaste con ${Math.round(s.indicadores.confianza)}% de confianza y la conciencia limpia. Tu pueblo te recordará como uno de los suyos.`,
    check: (s, _ctx) => s.adata.neverCorrupt && s.won && s.indicadores.confianza > 75,
  },
];

// ── LOGROS DE REELECCIÓN Y SEGUNDO MANDATO ───────────────────

const REELECTION_ACHIEVEMENTS = [
  {
    id:   'reelecto',
    icon: '🗳️',
    name: 'Reelecto/a',
    desc: 'Ganaste las elecciones presidenciales al completar tu primer mandato.',
    why:  s => `Con ${s.reelection?.pct ?? '?'}% de apoyo electoral, el pueblo te renovó el mandato. Pocos presidentes logran ese respaldo.`,
    check: s => s.won && !s.isSecondTerm && s.reelection?.reelected === true,
  },
  {
    id:   'reelecto_amplio',
    icon: '🌊',
    name: 'Ola Electoral',
    desc: 'Ganaste la reelección con más del 65% de los votos.',
    why:  s => `${s.reelection?.pct ?? '?'}% de los votos. Una victoria aplastante que rara vez se ve en democracia.`,
    check: s => s.won && !s.isSecondTerm && (s.reelection?.pct ?? 0) >= 65,
  },
  {
    id:   'segundo_mandato',
    icon: '🏛️',
    name: 'Segundo Mandato',
    desc: 'Completaste exitosamente un segundo mandato presidencial consecutivo.',
    why:  _s => 'Muy pocos presidentes completan dos mandatos. Sos parte de la historia de tu país.',
    check: s => s.won && s.isSecondTerm,
  },
  {
    id:   'mandato_historico',
    icon: '📜',
    name: 'Mandato Histórico',
    desc: 'Completaste dos mandatos consecutivos con puntaje ≥ 55 en ambos.',
    why:  (s, ctx) => {
      const s1 = s.firstTermData?.score ?? 0;
      const s2 = ctx.getScore(s.indicadores);
      return `Primer mandato: ${s1} pts · Segundo mandato: ${s2} pts. Ocho años de gestión sólida.`;
    },
    check: (s, ctx) => s.won && s.isSecondTerm
                    && (s.firstTermData?.score ?? 0) >= 55
                    && ctx.getScore(s.indicadores) >= 55,
  },
  {
    id:   'estadista_eterno',
    icon: '⭐',
    name: 'Estadista de la Época',
    desc: 'Completaste dos mandatos obteniendo Diploma de Oro (≥ 65 pts) en ambos.',
    why:  (s, ctx) => {
      const s1 = s.firstTermData?.score ?? 0;
      const s2 = ctx.getScore(s.indicadores);
      return `${s1} pts y ${s2} pts. Dos mandatos de excelencia absoluta. La historia te recordará.`;
    },
    check: (s, ctx) => s.won && s.isSecondTerm
                    && (s.firstTermData?.score ?? 0) >= 65
                    && ctx.getScore(s.indicadores) >= 65,
  },
];

// ── EXPORT PRINCIPAL ──────────────────────────────────────────

export const ACHIEVEMENTS = [...ORIGINAL_ACHIEVEMENTS, ...NEW_ACHIEVEMENTS, ...REELECTION_ACHIEVEMENTS];

/**
 * Evalúa todos los logros contra el estado actual del juego.
 * @param {object} s   - estado del juego (ver engine/state.js)
 * @param {object} ctx - { getScore, getZone, IND_META }
 * @returns {string[]} array de IDs de logros desbloqueados
 */
export function checkAchievements(s, ctx) {
  return ACHIEVEMENTS
    .filter(a => a.check(s, ctx))
    .map(a => a.id);
}

/**
 * Devuelve un logro por su ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Construye el HTML de la grilla de logros para la pantalla de trofeos.
 * @param {string[]} unlockedIds - IDs de logros desbloqueados
 * @returns {string} HTML listo para insertar en #ach-grid
 */
export function buildAchievementsGridHTML(unlockedIds) {
  const unlockedSet = new Set(unlockedIds);
  return ACHIEVEMENTS.map(a => {
    const unlocked = unlockedSet.has(a.id);
    return `<div class="ach-card ${unlocked ? 'unlocked' : 'locked'}" title="${a.desc}">
      <span class="ach-icon">${unlocked ? a.icon : '🔒'}</span>
      <span class="ach-name">${a.name}</span>
      <span class="ach-desc">${a.desc}</span>
    </div>`;
  }).join('');
}
