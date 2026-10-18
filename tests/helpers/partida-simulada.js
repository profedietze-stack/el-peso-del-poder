// Una partida completa con el motor real y sin pantalla: la misma secuencia de cada turno que
// usa main.js (inercia, crisis automáticas, pedido del socio, medio término, evento, decisión).
import { CONFIG } from '../../js/config.js';
import { newState, pickNextEvent, updateAdata, pushHistory } from '../../js/engine/state.js';
import { applyEffects, checkDefeat } from '../../js/engine/scoring.js';
import { applyInertia, applyActiveEffects, addActiveEffect } from '../../js/engine/effects.js';
import { updateDangerTracking, checkAutoCrises } from '../../js/features/crisis-auto.js';
import { calcElectoralScore } from '../../js/features/midterm.js';
import { pedidoDelSocio, aplicarAlianza } from '../../js/features/coalicion.js';
import { iniciarTurnoCapital, aplicarCapital, efectosSegunCapital } from '../../js/engine/capital.js';

const HERENCIAS = ['populista', 'ortodoxo', 'crisis', 'estable'];
const azar = (n) => Math.floor(Math.random() * n);

/**
 * Juega una partida entera eligiendo siempre al azar.
 * @returns {{ gano: boolean, turnos: number, eventos: Array<string|number>, anclas: number[], medioTermino: boolean }}
 */
export function jugarAlAzar({ dificultad = 'normal', mandato = 'amplio' } = {}) {
  const G = newState({ heritageId: HERENCIAS[azar(4)], mandateType: mandato, difficulty: dificultad });
  const eventos = [];
  let medioTermino = false;
  for (; G.turn <= CONFIG.TOTAL_TURNS; G.turn++) {
    if (G.turn > 1) { applyInertia(G); applyActiveEffects(G); }
    updateDangerTracking(G);
    const nuevas = checkAutoCrises(G);
    if (nuevas.length) G.pendingCrises = [...G.pendingCrises, ...nuevas];
    G.pendingCrises = [...G.pendingCrises, ...pedidoDelSocio(G)];
    if (G.turn === CONFIG.MEDIO_TERMINO && !G.midtermDone) {
      G.midtermDone = true;
      medioTermino = true;
      const gana = calcElectoralScore(G) >= 50;
      G.indicadores = applyEffects(G.indicadores, gana
        ? { confianza: 8, riesgo: -4, produccion: 2 } : { confianza: -7, riesgo: 5, produccion: -2 }, G.effectMods);
    }
    const ev = G.pendingCrises.length ? G.pendingCrises.shift() : pickNextEvent(G);
    if (ev.isSpecial) {
      G.lastSpecialEventTurn = G.turn;
      if (ev.isExtreme && ev.preEffects) G.indicadores = applyEffects(G.indicadores, ev.preEffects, {});
    }
    if (G.turn > 1) iniciarTurnoCapital(G);
    const idx = azar(ev.opciones.length);
    const op = ev.opciones[idx];
    const capitalAntes = G.capital;
    aplicarCapital(G, op);
    aplicarAlianza(G, op);
    G.indicadores = applyEffects(G.indicadores, efectosSegunCapital(op.efectos || {}, capitalAntes), G.effectMods || {});
    updateAdata(G, !!op.corrupta);
    addActiveEffect(G, op, ev);
    if (op.chain) G.pendingChainEvents.push({ eventId: op.chain.eventId, triggerAtTurn: G.turn + op.chain.delayTurns, sourceTitle: 'x' });
    pushHistory(G, ev.id, idx, !!ev.isCrisisAuto);
    eventos.push({ id: ev.id, turno: G.turn, encadenado: !!ev.isChained, auto: !!ev.isCrisisAuto || !!ev.isCoalicion });
    if (checkDefeat(G.indicadores, G.difficulty)) return { gano: false, turnos: G.turn, eventos, medioTermino };
  }
  return { gano: true, turnos: CONFIG.TOTAL_TURNS, eventos, medioTermino };
}
