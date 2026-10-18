"use strict";

// ============================================================
// COALICIÓN — el pedido del socio
//
// Quien gana en coalición gobierna con un socio que no es de su partido. Cada
// diez turnos (10, 20, 30 y 40) el socio pide algo. Aceptar cuesta capital
// político; rechazar es gratis… hasta que rompe la alianza: el capital máximo
// baja a 70 y deja de recuperarse (ver engine/capital.js).
//
// Los pedidos entran a la cola de eventos del turno, igual que las crisis
// automáticas, así que pasan por el mismo camino de decisión, historial y
// guardado. Solo existen en el mandato «coalicion».
// ============================================================

import { topeDeCapital } from '../engine/capital.js';
import { escalarTurno } from '../engine/mandato.js';

/** Turnos del pedido en un mandato de 48; ver `turnosDePedido()` para el país activo. */
export const TURNOS_PEDIDO = [10, 20, 30, 40];

/** Los turnos de pedido ajustados a la duración del mandato activo. */
export const turnosDePedido = () => TURNOS_PEDIDO.map((t) => escalarTurno(t));

/** Lo que cuesta aceptar un pedido del socio. */
export const COSTO_ACEPTAR = 8;

const PEDIDOS = [
  {
    titulo: 'El socio de la coalición reclama un ministerio clave',
    descripcion: 'El partido que te acompañó en la segunda vuelta exige el control de una cartera estratégica. Sin ese gesto, anuncian que dejarán de votar tus proyectos en el Congreso. Dentro de tu propio partido hay quienes piden resistir y quienes piden ceder.',
    ceder: 'Ceder el ministerio: darle la cartera al socio y sostener la mayoría en el Congreso.',
    rechazar: 'Rechazar el pedido: mantener tu equipo y asumir que el socio puede irse.',
  },
  {
    titulo: 'El socio exige fondos para sus distritos',
    descripcion: 'Los gobernadores aliados reclaman una transferencia extraordinaria de recursos para sus distritos a cambio de sostener la coalición. El Ministerio de Economía advierte que no está presupuestada. Si el socio se va, tu bloque queda sin mayoría.',
    ceder: 'Aceptar las transferencias: enviar los fondos y mantener unida la coalición.',
    rechazar: 'Negar los fondos: sostener el presupuesto y arriesgar la ruptura.',
  },
  {
    titulo: 'El socio condiciona su voto a una ley',
    descripcion: 'El socio de la coalición presenta un proyecto propio y condiciona su apoyo a que el Ejecutivo lo respalde, aunque contradice parte de tu plan de gobierno. La votación es en pocos días y el resultado depende de esos legisladores.',
    ceder: 'Respaldar el proyecto del socio: ceder en el contenido a cambio de su voto.',
    rechazar: 'No respaldarlo: defender tu plan y votar sin el socio.',
  },
  {
    titulo: 'El socio pide lugares en las listas',
    descripcion: 'Con las próximas elecciones a la vista, el socio reclama más candidaturas en las listas de la coalición. Tu partido no quiere resignar lugares. Una ruptura ahora debilitaría a ambos frente a la oposición.',
    ceder: 'Cederle lugares en las listas: reforzar la alianza a costa de tu propio partido.',
    rechazar: 'Mantener las listas como están: priorizar a tu partido y tensar la alianza.',
  },
];

/** Efectos de aceptar y de rechazar: chicos; lo que pesa es el capital y la alianza. */
const EFECTOS_CEDER = { confianza: 2, deuda: 2 };
const EFECTOS_RECHAZAR = { confianza: -6, riesgo: 5, produccion: -2 };

/** El pedido del turno indicado (uno de `turnosDePedido()`), o null. También lo usa el guardado. */
export function construirPedido(turno) {
  const i = turnosDePedido().indexOf(turno);
  if (i < 0) return null;
  const p = PEDIDOS[i];
  return {
    id: `coalicion-socio-${turno}`,
    tag: '🏛️ Gobernabilidad de la Coalición',
    titulo: p.titulo,
    descripcion: p.descripcion,
    isCoalicion: true,
    opciones: [
      { texto: `🤝 ${p.ceder}`, efectos: { ...EFECTOS_CEDER }, capital: -COSTO_ACEPTAR },
      { texto: `✋ ${p.rechazar}`, efectos: { ...EFECTOS_RECHAZAR }, capital: 0, rompeAlianza: true },
    ],
  };
}

/**
 * Pedido del socio que corresponde al turno actual (lista vacía si no toca).
 * Se llama una vez por turno, junto con las crisis automáticas.
 * @param {object} state
 * @returns {object[]} eventos a agregar a `pendingCrises`
 */
export function pedidoDelSocio(state) {
  if (state.mandateType !== 'coalicion' || state.alianzaRota) return [];
  const pedido = construirPedido(state.turn);
  if (!pedido || (state.pendingCrises ?? []).some((e) => e.id === pedido.id)) return [];
  return [pedido];
}

/**
 * Aplica lo que la decisión haga a la alianza. Devuelve true si se rompió ahora.
 * @param {object} state
 * @param {object} opcion
 */
export function aplicarAlianza(state, opcion) {
  if (!opcion?.rompeAlianza || state.alianzaRota) return false;
  state.alianzaRota = true;
  // El tope baja: si el capital estaba por encima, se recorta.
  state.capital = Math.min(state.capital, topeDeCapital(state));
  return true;
}
