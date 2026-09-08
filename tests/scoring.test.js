// Pruebas del motor de puntaje.
//
// Son funciones puras —reciben indicadores y devuelven un número— así que se
// pueden probar sin navegador ni servidor. Se corren con el runner de node, sin
// dependencias: `npm test`.
//
// Lo que se fija acá es lo que el alumno ve al final de la partida: la zona en
// que está cada indicador, el puntaje de gestión, el diploma y si el gobierno
// cae. Un error en cualquiera de esos cuatro le cambia el resultado de la
// partida sin que nada parezca roto.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getZone, getColor, getScore, computeReelectionPct,
  applyEffects, checkDefeat, getDiploma, getReelectionLabel,
} from '../js/engine/scoring.js';
import { CONFIG } from '../js/config.js';

const INDICADORES_PERFECTOS = {
  ipc: 0, deuda: 0, reservas: 100, riesgo: 0,
  pobreza: 0, desocupacion: 0, produccion: 100, confianza: 100,
};
const INDICADORES_PESIMOS = {
  ipc: 100, deuda: 100, reservas: 0, riesgo: 100,
  pobreza: 100, desocupacion: 100, produccion: 0, confianza: 0,
};

// ── Zonas ─────────────────────────────────────────────────────────────────────

test('getZone: en los indicadores donde ALTO es malo, subir empeora', () => {
  // ipc: warn 40, danger 65
  assert.equal(getZone('ipc', 20), 'safe');
  assert.equal(getZone('ipc', 40), 'warn');
  assert.equal(getZone('ipc', 64), 'warn');
  assert.equal(getZone('ipc', 65), 'danger');
});

test('getZone: en los indicadores donde BAJO es malo, bajar empeora', () => {
  // reservas: warn 60, danger 30
  assert.equal(getZone('reservas', 80), 'safe');
  assert.equal(getZone('reservas', 60), 'warn');
  assert.equal(getZone('reservas', 31), 'warn');
  assert.equal(getZone('reservas', 30), 'danger');
});

test('getZone: un indicador desconocido no rompe la pantalla', () => {
  assert.equal(getZone('inventado', 999), 'safe');
});

test('getColor: cada zona tiene su color y ninguno se repite', () => {
  const colores = new Set([
    getColor('ipc', 10), getColor('ipc', 50), getColor('ipc', 90),
  ]);
  assert.equal(colores.size, 3);
});

// ── Puntaje ───────────────────────────────────────────────────────────────────

test('getScore: los pesos suman 1, así que el puntaje va de 0 a 100', () => {
  assert.equal(getScore(INDICADORES_PERFECTOS), 100);
  assert.equal(getScore(INDICADORES_PESIMOS), 0);
});

test('getScore: mejorar un indicador nunca baja el puntaje', () => {
  const base = { ...CONFIG.INITIAL };
  const puntajeBase = getScore(base);
  assert.ok(getScore({ ...base, confianza: base.confianza + 10 }) >= puntajeBase);
  assert.ok(getScore({ ...base, pobreza: base.pobreza - 10 }) >= puntajeBase);
  assert.ok(getScore({ ...base, produccion: base.produccion + 10 }) >= puntajeBase);
});

test('getScore: la confianza y la pobreza pesan más que el riesgo país', () => {
  // 20% cada una contra 5%: es una decisión pedagógica del juego y conviene
  // que quede escrita, no sólo en la fórmula.
  const base = { ...CONFIG.INITIAL };
  const conConfianza = getScore({ ...base, confianza: base.confianza + 20 });
  const conRiesgo    = getScore({ ...base, riesgo: base.riesgo - 20 });
  assert.ok(conConfianza > conRiesgo);
});

test('computeReelectionPct: se mantiene entre 0 y 100 en los extremos', () => {
  for (const ind of [INDICADORES_PERFECTOS, INDICADORES_PESIMOS, CONFIG.INITIAL]) {
    const pct = computeReelectionPct(ind);
    assert.ok(pct >= 0 && pct <= 100, `pct fuera de rango: ${pct}`);
    assert.equal(Number.isInteger(pct), true);
  }
});

test('computeReelectionPct: la inflación alta y el riesgo alto penalizan', () => {
  const base = { ...CONFIG.INITIAL, ipc: 50, riesgo: 50 };
  const conMacroMala = { ...base, ipc: 70, riesgo: 60 };
  assert.ok(computeReelectionPct(conMacroMala) < computeReelectionPct(base));
});

// ── Efectos ───────────────────────────────────────────────────────────────────

test('applyEffects: no toca los indicadores que la opción no menciona', () => {
  const antes = { ...CONFIG.INITIAL };
  const despues = applyEffects(antes, { ipc: -5 });
  assert.equal(despues.confianza, antes.confianza);
  assert.equal(despues.ipc, antes.ipc - 5);
});

test('applyEffects: devuelve una copia, no muta lo que recibe', () => {
  const antes = { ...CONFIG.INITIAL };
  const copia = { ...antes };
  applyEffects(antes, { ipc: 20, pobreza: 15 });
  assert.deepEqual(antes, copia);
});

test('applyEffects: ningún indicador se sale de 0-100', () => {
  const alTope = applyEffects(CONFIG.INITIAL, { confianza: 500, ipc: 500 });
  assert.equal(alTope.confianza, 100);
  assert.equal(alTope.ipc, 100);
  const alPiso = applyEffects(CONFIG.INITIAL, { confianza: -500, ipc: -500 });
  assert.equal(alPiso.confianza, 0);
  assert.equal(alPiso.ipc, 0);
});

test('applyEffects: ignora las claves que no son indicadores', () => {
  const despues = applyEffects(CONFIG.INITIAL, { noExiste: 50 });
  assert.deepEqual(despues, { ...CONFIG.INITIAL });
});

test('applyEffects: el modificador del ministro escala el efecto', () => {
  const sinMinistro = applyEffects(CONFIG.INITIAL, { produccion: 10 });
  const conMinistro = applyEffects(CONFIG.INITIAL, { produccion: 10 }, { produccion: 2 });
  assert.ok(conMinistro.produccion > sinMinistro.produccion);
});

// ── Derrota ───────────────────────────────────────────────────────────────────

test('checkDefeat: una partida en marcha no dispara derrota', () => {
  assert.equal(checkDefeat({ ...CONFIG.INITIAL }, 'normal'), null);
});

test('checkDefeat: cada dificultad usa su propio umbral', () => {
  // Con confianza 4, normal ya cae (umbral 5) y easy todavía no (umbral 0).
  const ind = { ...CONFIG.INITIAL, confianza: 4 };
  assert.equal(typeof checkDefeat(ind, 'normal'), 'string');
  assert.equal(checkDefeat(ind, 'easy'), null);
});

test('checkDefeat: redondea antes de comparar', () => {
  // La inercia deja decimales. Con 4,6 de confianza el jugador está por debajo
  // del umbral 5 sólo si se redondea; si no, la derrota nunca llega.
  const ind = { ...CONFIG.INITIAL, confianza: 4.6 };
  assert.equal(typeof checkDefeat(ind, 'normal'), 'string');
});

test('checkDefeat: el mensaje dice el número, no sólo que perdiste', () => {
  const motivo = checkDefeat({ ...CONFIG.INITIAL, pobreza: 95 }, 'normal');
  assert.match(motivo, /95/);
});

// ── Diploma y etiqueta electoral ──────────────────────────────────────────────

test('getDiploma: los umbrales son los declarados en config', () => {
  assert.equal(getDiploma(CONFIG.DIPLOMA_GOLD), 'gold');
  assert.equal(getDiploma(CONFIG.DIPLOMA_GOLD - 1), 'silver');
  assert.equal(getDiploma(CONFIG.DIPLOMA_SILVER), 'silver');
  assert.equal(getDiploma(CONFIG.DIPLOMA_BRONZE), 'bronze');
  assert.equal(getDiploma(CONFIG.DIPLOMA_BRONZE - 1), null);
});

test('getReelectionLabel: cubre todo el rango sin huecos', () => {
  for (let pct = 0; pct <= 100; pct++) {
    assert.equal(typeof getReelectionLabel(pct), 'string');
  }
  assert.notEqual(getReelectionLabel(60), getReelectionLabel(59));
  assert.notEqual(getReelectionLabel(45), getReelectionLabel(44));
  assert.notEqual(getReelectionLabel(30), getReelectionLabel(29));
});
