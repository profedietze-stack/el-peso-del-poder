// Un guardado ilegible no puede dejar el juego mudo (auditoría de octubre, A-06).
//
// Había tres modos de fallo, todos silenciosos:
//
//   · JSON roto, `null` o un campo imposible: el botón «Continuar» quedaba
//     visible para siempre y apretarlo no hacía nada.
//   · `indicadores: 'hola'` o `[]`: `loadGame` lanzaba y dejaba la pantalla del
//     juego abierta, sin opciones.
//   · `indicadores: { ipc: 50 }`: cargaba con siete indicadores `undefined`.
//
// No hace falta un alumno tocando el localStorage: alcanza con que una versión
// futura le cambie el tipo a un campo y quede un guardado de la anterior.
import test from 'node:test';
import assert from 'node:assert/strict';

import { newState } from '../js/engine/state.js';
import { validarGuardado } from '../js/engine/save-validation.js';
import { limpiarNombre } from '../js/engine/texto.js';
import { EVENTS } from '../js/data/events.js';

const INDICADORES = ['ipc', 'deuda', 'reservas', 'riesgo', 'pobreza', 'desocupacion', 'produccion', 'confianza'];
const IDENTIDAD = { presidentName: 'Ana Pérez', partyName: 'Frente Amplio (FA)', vpId: 'vp-moreno' };

/** Lo que guarda `saveToStorage` y vuelve de `JSON.parse`: el estado con el Set como array. */
function guardadoBueno(extra = {}) {
  const g = newState({ heritageId: 'populista', mandateType: 'ajustado', difficulty: 'hard', identity: IDENTIDAD });
  g.turn = 12;
  g.usedEventIds.add(1);
  g.usedEventIds.add(2);
  g.history.push({ turn: 11, eventId: 2, opcionIndex: 1, snap: { ...g.indicadores }, isCrisis: false });
  return JSON.parse(JSON.stringify({ ...g, usedEventIds: [...g.usedEventIds], ...extra }));
}

/** Que lo que salió de la validación sea una partida que el juego puede arrancar. */
function assertJugable(state) {
  for (const k of INDICADORES) {
    assert.ok(Number.isFinite(state.indicadores[k]), `indicador ${k} no es un número`);
    assert.ok(state.indicadores[k] >= 0 && state.indicadores[k] <= 100, `indicador ${k} fuera de rango`);
  }
  assert.ok(Number.isInteger(state.turn) && state.turn >= 1 && state.turn <= 48);
  assert.ok(['easy', 'normal', 'hard', 'ultra'].includes(state.difficulty));
  assert.ok(state.usedEventIds instanceof Set);
  for (const campo of ['history', 'decisionLog', 'activeEffects', 'pendingCrises', 'pendingChainEvents', 'unlockedAchievements']) {
    assert.ok(Array.isArray(state[campo]), `${campo} no es un array`);
  }
  assert.equal(typeof state.identity.presidentName, 'string');
  assert.equal(typeof state.adata.dangerHistory, 'object');
  for (const slot of ['vp', 'economia', 'social', 'gabinete', 'produccion']) {
    assert.ok(Number.isFinite(state.advisors[slot].credibility), `asesor ${slot}`);
  }
  assert.equal(typeof state.effectMods, 'object');
}

// ── Lo que se descarta ───────────────────────────────────────

test('un guardado que no es una partida se declara dañado', () => {
  const casos = {
    null: null,
    array: [],
    texto: 'hola',
    número: 42,
    'sin indicadores': { turn: 5 },
    'indicadores texto': { ...guardadoBueno(), indicadores: 'hola' },
    'indicadores array': { ...guardadoBueno(), indicadores: [] },
    'indicadores parciales': { ...guardadoBueno(), indicadores: { ipc: 50 } },
    'un indicador es texto': { ...guardadoBueno(), indicadores: { ...guardadoBueno().indicadores, ipc: 'x' } },
    'un indicador es null': { ...guardadoBueno(), indicadores: { ...guardadoBueno().indicadores, deuda: null } },
    'turno 0': { ...guardadoBueno(), turn: 0 },
    'turno 999': { ...guardadoBueno(), turn: 999 },
    'turno texto': { ...guardadoBueno(), turn: '5' },
    'turno decimal': { ...guardadoBueno(), turn: 5.5 },
    'partida ya perdida': { ...guardadoBueno(), lost: true },
    'partida ya ganada': { ...guardadoBueno(), won: true },
  };
  for (const [nombre, crudo] of Object.entries(casos)) {
    const r = validarGuardado(crudo);
    assert.equal(r.estado, 'danado', `«${nombre}» debería ser dañado`);
    assert.equal(typeof r.motivo, 'string', `«${nombre}» tiene que decir por qué`);
  }
});

// ── Lo que se arregla en vez de descartar ────────────────────

test('un guardado bueno sobrevive intacto', () => {
  const crudo = guardadoBueno();
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  assertJugable(r.state);
  assert.equal(r.state.turn, 12);
  assert.equal(r.state.difficulty, 'hard');
  assert.equal(r.state.heritageId, 'populista');
  assert.deepEqual(r.state.indicadores, crudo.indicadores);
  assert.deepEqual([...r.state.usedEventIds], [1, 2]);
  assert.equal(r.state.history.length, 1);
  assert.equal(r.state.identity.presidentName, 'Ana Pérez');
  assert.equal(r.state.identity.partyName, 'Frente Amplio (FA)');
});

test('los indicadores fuera de rango se acotan', () => {
  const crudo = guardadoBueno();
  crudo.indicadores.ipc = 150;
  crudo.indicadores.confianza = -20;
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.indicadores.ipc, 100);
  assert.equal(r.state.indicadores.confianza, 0);
});

test('una dificultad, un ministro o un VP que no existen caen a uno válido', () => {
  const crudo = guardadoBueno();
  crudo.difficulty = 'imposible';
  crudo.ministers = { economia: 'inventado', social: 7, gabinete: null, produccion: 'tampoco' };
  crudo.identity.vpId = 'vp-castro';
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  assertJugable(r.state);
  assert.equal(r.state.difficulty, 'normal');
  assert.notEqual(r.state.ministers.economia, 'inventado');
  assert.equal(r.state.identity.vpId, 'vp-moreno');
});

test('los campos de lista con el tipo cambiado quedan vacíos, no rompen', () => {
  const crudo = guardadoBueno();
  Object.assign(crudo, {
    usedEventIds: 7, history: 5, decisionLog: 'x', activeEffects: {}, pendingCrises: 1,
    pendingChainEvents: 'a', unlockedAchievements: 3, adata: 'x', advisors: [], cabinetHistory: 9,
  });
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  assertJugable(r.state);
  assert.equal(r.state.history.length, 0);
  assert.equal(r.state.activeEffects.length, 0);
  assert.equal(r.state.usedEventIds.size, 0);
});

test('de las listas se descartan los elementos rotos y se conservan los buenos', () => {
  const crudo = guardadoBueno();
  crudo.activeEffects = [
    { id: 'a', eventId: 1, sourceTitle: 't', sourceTurn: 3, turnsLeft: 2, totalDuration: 3, efectosPersistentes: { ipc: 1 } },
    { id: 'b', eventId: 1, turnsLeft: 'dos', efectosPersistentes: { ipc: 1 } },
    { id: 'c', eventId: 1, turnsLeft: 2, efectosPersistentes: 'x' },
    null,
  ];
  crudo.pendingChainEvents = [
    { eventId: EVENTS[0].id, triggerAtTurn: 14, sourceTitle: 'x' },
    { eventId: 99999, triggerAtTurn: 14, sourceTitle: 'x' },
    { eventId: EVENTS[1].id, triggerAtTurn: 'mañana', sourceTitle: 'x' },
  ];
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.activeEffects.length, 1);
  assert.equal(r.state.activeEffects[0].id, 'a');
  assert.equal(r.state.pendingChainEvents.length, 1);
});

test('el evento del turno se vuelve a armar desde el banco, no desde el guardado', () => {
  const crudo = guardadoBueno();
  const real = EVENTS.find((e) => !e.isSpecial);
  crudo.startedTurn = crudo.turn;
  crudo.currentEventTurn = crudo.turn;
  crudo.currentEvent = { ...real, titulo: '<img src=x onerror=alert(1)>', descripcion: '<script>1</script>' };
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.currentEvent.id, real.id);
  assert.equal(r.state.currentEvent.titulo, real.titulo, 'el título sale del banco, no del guardado');
  assert.ok(!JSON.stringify(r.state.currentEvent).includes('<script'));
});

test('un evento de texto con HTML en el guardado se descarta', () => {
  const crudo = guardadoBueno();
  crudo.startedTurn = crudo.turn;
  crudo.currentEventTurn = crudo.turn;
  crudo.currentEvent = {
    id: 'crisis-auto-ipc-12', _crisisKey: 'ipc', isCrisisAuto: true, tag: 'x', titulo: '<b>x</b>', descripcion: 'd',
    opciones: [{ texto: 'a', efectos: { ipc: 1 } }, { texto: 'b', efectos: { ipc: -1 } }],
  };
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  assert.equal(r.state.currentEvent, null);
});

// ── El nombre del alumno ─────────────────────────────────────

test('el nombre se limpia al cargar y al escribirlo', () => {
  const crudo = guardadoBueno();
  crudo.identity.presidentName = '<img src=x onerror=window.__xss=1>Ana "Q" López';
  crudo.identity.partyName = '<b id=xssb>Partido</b> (PX)';
  const r = validarGuardado(crudo);
  assert.equal(r.estado, 'ok');
  for (const t of [r.state.identity.presidentName, r.state.identity.partyName]) {
    assert.ok(!/[<>&"\\`]/.test(t), `queda algo peligroso en «${t}»`);
  }
  assert.ok(r.state.identity.presidentName.includes('López'));
});

test('limpiarNombre deja pasar los nombres normales y el emoji', () => {
  assert.equal(limpiarNombre('Ana María López'), 'Ana María López');
  assert.equal(limpiarNombre("Ñandú O'Higgins-Pérez Jr."), "Ñandú O'Higgins-Pérez Jr.");
  assert.equal(limpiarNombre('Frente Amplio (FA)'), 'Frente Amplio (FA)');
  assert.equal(limpiarNombre('Partido del Sol ☀️'), 'Partido del Sol ☀️');
  assert.equal(limpiarNombre('  muchos    espacios  '), 'muchos espacios');
  assert.equal(limpiarNombre('x'.repeat(100)).length, 40);
  assert.equal(limpiarNombre('<img src=x onerror=alert(1)>Ana "Q" López'), 'Ana Q López');
  assert.equal(limpiarNombre('<b>Partido</b> (PX)'), 'Partido (PX)');
  assert.equal(limpiarNombre(42), '');
  assert.equal(limpiarNombre(null), '');
});

test('limpiarNombre no deja ninguna etiqueta ni comilla doble', () => {
  const ataques = [
    '<script>alert(1)</script>', '<img src=x onerror=alert(1)>', '"><svg onload=1>', "'><iframe src=javascript:1>",
    '`${alert(1)}`', '&lt;b&gt;', 'a\\"b', '<<>>',
  ];
  for (const a of ataques) {
    const limpio = limpiarNombre(a);
    assert.ok(!/[<>&"`\\]/.test(limpio), `«${a}» → «${limpio}»`);
  }
});

// ── Fuzz: nada de lo que llegue puede tirar ni devolver una partida rota ─────

test('con 2000 guardados mutados al azar, nunca lanza y lo que acepta es jugable', () => {
  const basura = [null, undefined, 'x', 0, -1, 1e9, NaN, true, false, [], {}, [1, 2], { a: 1 }, '<b>', 'normal', 12.5];
  const campos = Object.keys(guardadoBueno());
  let semilla = 12345;
  const azar = () => ((semilla = (semilla * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const elegir = (a) => a[Math.floor(azar() * a.length)];

  let aceptados = 0;
  for (let i = 0; i < 2000; i++) {
    const crudo = guardadoBueno();
    const cuantos = 1 + Math.floor(azar() * 3);
    for (let k = 0; k < cuantos; k++) {
      const campo = elegir(campos);
      if (azar() < 0.2 && crudo[campo] && typeof crudo[campo] === 'object' && !Array.isArray(crudo[campo])) {
        const sub = elegir(Object.keys(crudo[campo]));
        if (sub) crudo[campo][sub] = elegir(basura);
      } else {
        crudo[campo] = elegir(basura);
      }
    }
    let r;
    assert.doesNotThrow(() => { r = validarGuardado(JSON.parse(JSON.stringify(crudo))); }, `mutación ${i}`);
    assert.ok(r.estado === 'ok' || r.estado === 'danado');
    if (r.estado === 'ok') {
      aceptados++;
      assertJugable(r.state);
    }
  }
  assert.ok(aceptados > 200, `solo ${aceptados} de 2000 se aceptaron: la validación es demasiado estricta`);
});
