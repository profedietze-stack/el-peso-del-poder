// México gobierna seis años: 72 turnos. Las partidas largas tienen que cerrar con el motor real.
import test from 'node:test';
import assert from 'node:assert/strict';

import { aplicarReglas, totalTurnos } from '../js/engine/mandato.js';
import { agregarEventosLatam } from '../js/data/pais-datos.js';
import { EVENTS } from '../js/data/events.js';
import { anclasDelMandato } from '../js/engine/state.js';
import { jugarAlAzar } from './helpers/partida-simulada.js';

test.before(() => { agregarEventosLatam(); });
test.afterEach(() => aplicarReglas('ar'));

const PARTIDAS = 120;

test('una partida de México dura hasta 72 turnos y se juega entera sin errores', () => {
  aplicarReglas('mx');
  assert.equal(totalTurnos(), 72);
  let largas = 0;
  for (const dificultad of ['easy', 'normal', 'hard', 'ultra']) {
    for (const mandato of ['amplio', 'ajustado', 'coalicion']) {
      for (let i = 0; i < 10; i++) {
        const r = jugarAlAzar({ dificultad, mandato });
        assert.ok(r.turnos >= 1 && r.turnos <= 72);
        if (r.gano) { assert.equal(r.turnos, 72); largas++; }
      }
    }
  }
  assert.ok(largas > 0, 'ninguna de 120 partidas llegó a los 72 turnos: ¿el balance quedó injugable?');
});

test('en 72 turnos ningún evento se repite (salvo las consecuencias encadenadas y las crisis automáticas)', () => {
  aplicarReglas('mx');
  const repetidos = [];
  for (let i = 0; i < PARTIDAS; i++) {
    const r = jugarAlAzar({ dificultad: 'easy' });
    const vistos = new Set();
    for (const e of r.eventos) {
      if (e.encadenado || e.auto) continue;
      if (vistos.has(e.id)) repetidos.push(`partida ${i}: evento ${e.id} en el turno ${e.turno}`);
      vistos.add(e.id);
    }
  }
  assert.deepEqual(repetidos.slice(0, 5), []);
});

test('el medio término de México se resuelve en alguna partida (turno 36)', () => {
  aplicarReglas('mx');
  let vistas = 0;
  for (let i = 0; i < 40; i++) { if (jugarAlAzar({ dificultad: 'easy' }).medioTermino) vistas++; }
  assert.ok(vistas > 0);
});

test('las anclas aparecen dentro de su rango escalado (como en 48 turnos, alguna se pierde por una crisis ese mes)', () => {
  aplicarReglas('mx');
  const rangos = anclasDelMandato();
  let largas = 0, presentes = 0, esperadas = 0;
  for (let i = 0; i < PARTIDAS && largas < 40; i++) {
    const r = jugarAlAzar({ dificultad: 'easy' });
    if (!r.gano) continue;
    largas++;
    for (const a of rangos) {
      esperadas++;
      const v = r.eventos.find((e) => e.id === a.id);
      if (!v) continue;
      presentes++;
      assert.ok(v.turno >= a.minTurn && v.turno <= a.maxTurn, `ancla ${a.id} en el turno ${v.turno}, fuera de ${a.minTurn}-${a.maxTurn}`);
    }
  }
  assert.ok(largas >= 10, `solo ${largas} partidas largas en Fácil`);
  assert.ok(presentes / esperadas >= 0.85, `solo el ${Math.round(100 * presentes / esperadas)} % de las anclas apareció`);
});

test('el banco de eventos alcanza para 72 turnos con margen', () => {
  const normales = EVENTS.filter((e) => !e.isSpecial && !e.isCrisisAuto);
  assert.ok(normales.length >= 90, `solo ${normales.length} eventos normales`);
});
