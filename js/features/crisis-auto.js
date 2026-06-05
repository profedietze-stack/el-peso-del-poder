"use strict";

import { IND_META, CONFIG } from '../config.js';
import { getZone }          from '../engine/scoring.js';
import { soundCrisisAuto }  from '../audio.js';

// ============================================================
// SISTEMA DE CRISIS AUTOMÁTICAS
// Si un indicador permanece en zona "danger" durante 3+ turnos
// consecutivos, se genera automáticamente un evento de crisis
// vinculado a ese indicador.
// Los eventos de crisis automáticos tienen:
//   - isCrisisAuto: true
//   - Efectos pre-definidos (más severos que los normales)
//   - Visual distintivo (borde rojo pulsante en la tarjeta)
// ============================================================

// Mapa: clave de indicador → plantilla del evento de crisis automática
const CRISIS_TEMPLATES = {
  ipc: {
    tag:        '🚨 Crisis Financiera',
    titulo:     '⚡ CRISIS: Espiral Inflacionaria',
    descripcion: 'La inflación ha estado fuera de control por semanas. El BCRA convoca a una reunión de emergencia. Los supermercados registran desabastecimiento de básicos y los trabajadores reclaman indexación automática. La situación requiere una respuesta urgente del Ejecutivo.',
    imagen:     'https://picsum.photos/seed/crisis-ipc/800/360',
    opciones: [
      { texto: '🏦 Suba de tasas de emergencia: el BCRA sube la tasa de interés al 120% para detener la corrida.', efectos: { ipc:-12, deuda:5, reservas:-4, riesgo:-6, pobreza:5, desocupacion:3, produccion:-5, confianza:-3 } },
      { texto: '💰 Control de precios de emergencia: congelar precios de la canasta básica por 90 días.', efectos: { ipc:-8, deuda:3, reservas:0, riesgo:2, pobreza:-3, desocupacion:1, produccion:-3, confianza:4 } },
      { texto: '📢 Llamado a la responsabilidad: pedir a empresas y sindicatos moderación voluntaria sin medidas coercitivas.', efectos: { ipc:-2, deuda:0, reservas:0, riesgo:1, pobreza:1, desocupacion:0, produccion:0, confianza:-5 } },
    ],
  },
  deuda: {
    tag:        '🏦 Tensión con FMI',
    titulo:     '⚡ CRISIS: Vencimiento Impagable',
    descripcion: 'La deuda soberana alcanzó niveles críticos y los acreedores exigen una reunión de urgencia. El riesgo de cesación de pagos es real. Los mercados castigan los bonos argentinos y el tipo de cambio paralelo se dispara.',
    imagen:     'https://picsum.photos/seed/crisis-deuda/800/360',
    opciones: [
      { texto: '🤝 Reestructuración urgente: proponer a los acreedores una quita del 40% con nuevos plazos.', efectos: { ipc:4, deuda:-15, reservas:-3, riesgo:-8, pobreza:3, desocupacion:2, produccion:-2, confianza:3 } },
      { texto: '💵 Acuerdo puente con el FMI: aceptar un desembolso del FMI a cambio de ajuste fiscal inmediato.', efectos: { ipc:-3, deuda:-8, reservas:8, riesgo:-10, pobreza:6, desocupacion:4, produccion:-4, confianza:-7 } },
      { texto: '⏸️ Moratoria unilateral: suspender pagos y negociar desde una posición de fuerza.', efectos: { ipc:8, deuda:-10, reservas:3, riesgo:20, pobreza:5, desocupacion:3, produccion:-8, confianza:-10 } },
    ],
  },
  reservas: {
    tag:        '💱 Política Cambiaria',
    titulo:     '⚡ CRISIS: Corrida Cambiaria',
    descripcion: 'Las reservas del Banco Central cayeron a mínimos históricos. Se desata una corrida cambiaria: colas en las casas de cambio, dólar blue en alza vertiginosa y el BCRA pierde USD 200 millones por día. La situación es de emergencia.',
    imagen:     'https://picsum.photos/seed/crisis-reservas/800/360',
    opciones: [
      { texto: '🔐 Cepo de emergencia: restricciones totales al mercado de cambios para frenar la sangría.', efectos: { ipc:5, deuda:2, reservas:10, riesgo:8, pobreza:3, desocupacion:2, produccion:-5, confianza:-8 } },
      { texto: '📞 Swap con bancos centrales: activar líneas de crédito con Brasil, China y la UE.', efectos: { ipc:2, deuda:5, reservas:14, riesgo:-5, pobreza:1, desocupacion:0, produccion:0, confianza:4 } },
      { texto: '📈 Macrodevaluación controlada: ajustar el tipo de cambio oficial para reducir la brecha y frenar la corrida.', efectos: { ipc:12, deuda:0, reservas:6, riesgo:-4, pobreza:7, desocupacion:3, produccion:2, confianza:-6 } },
    ],
  },
  riesgo: {
    tag:        '🌍 Geopolítica',
    titulo:     '⚡ CRISIS: Riesgo País en Máximos',
    descripcion: 'El riesgo país superó los 1.800 puntos básicos. Argentina quedó excluida de los mercados internacionales de crédito. El capital extranjero huye y las empresas paralizan inversiones. La percepción externa de la economía es catastrófica.',
    imagen:     'https://picsum.photos/seed/crisis-riesgo/800/360',
    opciones: [
      { texto: '🤝 Agenda de confianza express: anunciar reformas estructurales y reuniones con inversores internacionales.', efectos: { ipc:-2, deuda:-3, reservas:2, riesgo:-12, pobreza:0, desocupacion:0, produccion:2, confianza:6 } },
      { texto: '📋 Acuerdo con el FMI de largo plazo: firmar un programa de facilidades extendidas con metas fiscales duras.', efectos: { ipc:-4, deuda:-6, reservas:5, riesgo:-15, pobreza:5, desocupacion:3, produccion:-3, confianza:-5 } },
      { texto: '📢 Discurso soberanista: culpar a los especuladores y rechazar las presiones externas públicamente.', efectos: { ipc:3, deuda:2, reservas:-2, riesgo:6, pobreza:0, desocupacion:0, produccion:-1, confianza:-4 } },
    ],
  },
  pobreza: {
    tag:        '✊ Conflicto Social',
    titulo:     '⚡ CRISIS: Estallido Social',
    descripcion: 'La pobreza estructural detonó en manifestaciones masivas en 18 provincias. Ollas populares en las plazas, piquetes en las rutas y el índice de indigencia en alza acelerada. La situación social está al límite de lo sostenible.',
    imagen:     'https://picsum.photos/seed/crisis-pobreza/800/360',
    opciones: [
      { texto: '🍲 Plan de emergencia alimentaria: triplicar el presupuesto de los comedores escolares y comunitarios.', efectos: { ipc:2, deuda:5, reservas:-2, riesgo:0, pobreza:-8, desocupacion:-1, produccion:0, confianza:8 } },
      { texto: '💸 Transferencia directa universal: bono de emergencia de $50.000 para todos los hogares en situación crítica.', efectos: { ipc:5, deuda:8, reservas:-3, riesgo:1, pobreza:-12, desocupacion:-2, produccion:0, confianza:10 } },
      { texto: '🏗️ Plan de obras y empleo: lanzar un plan de obras públicas intensivo en mano de obra para generar empleo urgente.', efectos: { ipc:3, deuda:7, reservas:-4, riesgo:-1, pobreza:-6, desocupacion:-5, produccion:3, confianza:7 } },
    ],
  },
  desocupacion: {
    tag:        '💼 Empleo',
    titulo:     '⚡ CRISIS: Desempleo Masivo',
    descripcion: 'La desocupación superó el 20%. Empresas industriales anuncian cierres masivos y el sector informal explota. Las oficinas de empleo colapsan. Los sindicatos convocan a huelga general indefinida y la tensión social es máxima.',
    imagen:     'https://picsum.photos/seed/crisis-desoc/800/360',
    opciones: [
      { texto: '🏭 Subsidio al empleo privado: cubrir el 50% del salario en empresas que suspendan despidos por 6 meses.', efectos: { ipc:2, deuda:6, reservas:-2, riesgo:0, pobreza:-3, desocupacion:-7, produccion:2, confianza:7 } },
      { texto: '👷 Plan de empleo público transitorio: crear 200.000 puestos de trabajo en obra pública y servicios comunitarios.', efectos: { ipc:3, deuda:7, reservas:-3, riesgo:1, pobreza:-4, desocupacion:-8, produccion:3, confianza:8 } },
      { texto: '💡 Incentivos a la reindustrialización: reducir impuestos al trabajo formal durante 2 años.', efectos: { ipc:1, deuda:-2, reservas:0, riesgo:-2, pobreza:-2, desocupacion:-4, produccion:4, confianza:4 } },
    ],
  },
  produccion: {
    tag:        '🏭 Industria',
    titulo:     '⚡ CRISIS: Colapso Industrial',
    descripcion: 'La producción industrial cayó a mínimos de la última década. Cierres de fábricas, caída de exportaciones y fuga de inversiones. Las cadenas de valor se rompen y el sector PyME agónica. El país necesita un shock productivo urgente.',
    imagen:     'https://picsum.photos/seed/crisis-prod/800/360',
    opciones: [
      { texto: '⚡ Shock de crédito productivo: lanzar líneas de crédito a tasa cero para PyMEs industriales a través del BNA.', efectos: { ipc:2, deuda:5, reservas:-2, riesgo:-1, pobreza:-2, desocupacion:-4, produccion:10, confianza:6 } },
      { texto: '🌐 Acuerdo comercial de emergencia: abrir mercados externos para colocar la producción excedente.', efectos: { ipc:0, deuda:-2, reservas:5, riesgo:-3, pobreza:-1, desocupacion:-2, produccion:7, confianza:4 } },
      { texto: '🔧 Reconversión industrial: subsidiar la reconversión tecnológica de industrias obsoletas.', efectos: { ipc:1, deuda:4, reservas:-2, riesgo:-1, pobreza:-1, desocupacion:-3, produccion:6, confianza:3 } },
    ],
  },
  confianza: {
    tag:        '🗳️ Elecciones',
    titulo:     '⚡ CRISIS: Colapso de Confianza',
    descripcion: 'La aprobación presidencial cayó a mínimos históricos. El Congreso amenaza con un juicio político, las calles se llenan de protestas y los propios aliados de la coalición gobernante empiezan a distanciarse. El gobierno enfrenta su peor momento.',
    imagen:     'https://picsum.photos/seed/crisis-conf/800/360',
    opciones: [
      { texto: '📣 Cadena nacional y agenda de reformas: anunciar un paquete de medidas populares con cadena presidencial.', efectos: { ipc:2, deuda:3, reservas:-1, riesgo:-2, pobreza:-3, desocupacion:-1, produccion:1, confianza:10 } },
      { texto: '🔄 Cambio de gabinete: renovar los ministerios más cuestionados con figuras de consenso.', efectos: { ipc:0, deuda:1, reservas:0, riesgo:-1, pobreza:0, desocupacion:0, produccion:0, confianza:7 } },
      { texto: '🤝 Diálogo multipartidario: convocar a una mesa de diálogo con todos los partidos políticos.', efectos: { ipc:0, deuda:1, reservas:0, riesgo:-2, pobreza:0, desocupacion:0, produccion:0, confianza:5 } },
    ],
  },
};

// ── TRACKING DE TURNOS EN PELIGRO ─────────────────────────────

/**
 * Actualiza el contador de turnos consecutivos en zona peligrosa para cada indicador.
 * Se llama al inicio de cada turno.
 * @param {object} state - estado del juego (mutable)
 */
export function updateDangerTracking(state) {
  const ind = state.indicadores;
  if (!state.adata.dangerHistory) state.adata.dangerHistory = {};

  for (const meta of IND_META) {
    const zone = getZone(meta.key, ind[meta.key]);
    if (zone === 'danger') {
      state.adata.dangerHistory[meta.key] = (state.adata.dangerHistory[meta.key] || 0) + 1;
    } else {
      state.adata.dangerHistory[meta.key] = 0;
    }
  }
}

/**
 * Verifica si algún indicador activó una crisis automática (3+ turnos en danger).
 * Devuelve los eventos de crisis pendientes a insertar en la cola.
 * @param {object} state - estado del juego
 * @returns {object[]} array de eventos de crisis automática generados
 */
export function checkAutoCrises(state) {
  const triggered = [];
  const history   = state.adata.dangerHistory || {};
  const pending   = new Set((state.pendingCrises || []).map(e => e._crisisKey));

  for (const [key, turns] of Object.entries(history)) {
    // Ultra: umbral reducido a 2 turnos (vs 3 en normal/hard) — las crisis escalan más rápido
    const threshold = (state.difficulty === 'ultra') ? 2 : 3;
    if (turns >= threshold && !pending.has(key)) {
      const template = CRISIS_TEMPLATES[key];
      if (template) {
        triggered.push({
          ...template,
          id:          `crisis-auto-${key}-${state.turn}`,
          isCrisisAuto: true,
          _crisisKey:   key,
          _triggerTurn: state.turn,
        });
      }
    }
  }

  return triggered;
}

/**
 * Resetea el contador de turnos en peligro para un indicador al resolverse.
 * @param {object} state
 * @param {string} key - clave del indicador resuelto
 */
export function resetDangerCounter(state, key) {
  if (state.adata.dangerHistory) {
    state.adata.dangerHistory[key] = 0;
  }
}

/**
 * Construye el tag visual de crisis automática para la tarjeta de evento.
 * @returns {string} HTML del tag
 */
export function buildCrisisAutoTag() {
  return `<span class="event-tag crisis-tag">⚡ CRISIS AUTOMÁTICA</span>`;
}

/**
 * Muestra una notificación visual de crisis automática inminente.
 * @param {string} key      - clave del indicador en peligro
 * @param {number} turns    - turnos consecutivos en peligro
 */
export function showCrisisWarning(key, turns) {
  const meta = IND_META.find(m => m.key === key);
  if (!meta) return;

  soundCrisisAuto();

  const notif = document.createElement('div');
  notif.className = 'crisis-auto-notif';
  notif.innerHTML = `
    <span class="crisis-icon">🚨</span>
    <span class="crisis-msg">
      <strong>${meta.name}</strong> lleva ${turns} turnos en zona crítica.<br>
      <em>Se aproxima una crisis automática.</em>
    </span>
  `;
  document.body.appendChild(notif);

  // Auto-remover después de 4s
  setTimeout(() => {
    notif.classList.add('fade-out');
    setTimeout(() => notif.remove(), 500);
  }, 4000);
}
