// La ayuda del juego tiene que decir lo que el motor hace (auditoría de octubre, A-08).
//
// Los umbrales de derrota dependen de la dificultad:
//
//                 Fácil   Normal   Difícil   Ultra
//   Confianza ≤     0        5        10       15
//   Pobreza  ≥     80       78        75       70
//
// y la ayuda decía, en tres sitios distintos, «pobreza 80 %» y «confianza 0 %»: la
// cifra de Fácil. Un alumno en Ultra con la pobreza en 72 % se creía a salvo y
// perdía sin aviso. Es la capa de referencia contra la de ejercicios, otra vez.
//
// Y el manual (la pantalla que el alumno abre para estudiar) tenía además la
// columna «Meta» de Confianza en «> 55» cuando el motor la da por segura recién
// por encima de 60.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { CONFIG, IND_META } from '../js/config.js';
import * as scoring from '../js/engine/scoring.js';
import { GLOSSARY } from '../js/ui/tooltip.js';

const html = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');

const UMBRALES = {
  easy:   { confianza: CONFIG.DEFEAT_CONFIANZA,        pobreza: CONFIG.DEFEAT_POBREZA },
  normal: { confianza: CONFIG.DEFEAT_CONFIANZA_NORMAL, pobreza: CONFIG.DEFEAT_POBREZA_NORMAL },
  hard:   { confianza: CONFIG.DEFEAT_CONFIANZA_HARD,   pobreza: CONFIG.DEFEAT_POBREZA_HARD },
  ultra:  { confianza: CONFIG.DEFEAT_CONFIANZA_ULTRA,  pobreza: CONFIG.DEFEAT_POBREZA_ULTRA },
};

const sinHtml = (t) => t.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&le;/g, '≤').replace(/&ge;/g, '≥');
const IND_OK = { confianza: 65, pobreza: 35, ipc: 50, deuda: 40, reservas: 60, riesgo: 35, desocupacion: 12, produccion: 60 };

test('umbralesDeDerrota devuelve el umbral de cada dificultad', () => {
  assert.equal(typeof scoring.umbralesDeDerrota, 'function');
  for (const [dif, esperado] of Object.entries(UMBRALES)) {
    assert.deepEqual(scoring.umbralesDeDerrota(dif), esperado, dif);
  }
  assert.deepEqual(scoring.umbralesDeDerrota('inexistente'), UMBRALES.normal);
});

test('checkDefeat corta exactamente en el umbral que umbralesDeDerrota declara', () => {
  for (const [dif, u] of Object.entries(UMBRALES)) {
    assert.ok(scoring.checkDefeat({ ...IND_OK, confianza: u.confianza }, dif), `${dif}: confianza ${u.confianza}`);
    assert.equal(scoring.checkDefeat({ ...IND_OK, confianza: u.confianza + 1 }, dif), null, `${dif}: confianza ${u.confianza + 1}`);
    assert.ok(scoring.checkDefeat({ ...IND_OK, pobreza: u.pobreza }, dif), `${dif}: pobreza ${u.pobreza}`);
    assert.equal(scoring.checkDefeat({ ...IND_OK, pobreza: u.pobreza - 1 }, dif), null, `${dif}: pobreza ${u.pobreza - 1}`);
  }
});

test('la ayuda de Confianza y de Pobreza nombra el umbral de las cuatro dificultades', () => {
  for (const clave of ['confianza', 'pobreza']) {
    const texto = sinHtml(GLOSSARY[clave].zona);
    for (const [dif, u] of Object.entries(UMBRALES)) {
      assert.ok(
        new RegExp(`\\b${u[clave]}\\s?%`).test(texto),
        `la ayuda de ${clave} no dice ${u[clave]} % (${dif}): «${texto}»`,
      );
    }
  }
});

test('el manual dice las condiciones de derrota de las cuatro dificultades', () => {
  const derrotaA = sinHtml(html.match(/Derrota A:[\s\S]*?<\/li>/)?.[0] ?? '');
  const derrotaB = sinHtml(html.match(/Derrota B:[\s\S]*?<\/li>/)?.[0] ?? '');
  assert.ok(derrotaA && derrotaB, 'el manual no tiene Derrota A / Derrota B');
  for (const [dif, u] of Object.entries(UMBRALES)) {
    assert.ok(new RegExp(`\\b${u.confianza}\\s?%`).test(derrotaA), `Derrota A no dice ${u.confianza} % (${dif}): «${derrotaA}»`);
    assert.ok(new RegExp(`\\b${u.pobreza}\\s?%`).test(derrotaB), `Derrota B no dice ${u.pobreza} % (${dif}): «${derrotaB}»`);
  }
});

test('la tabla de indicadores del manual coincide con las zonas del motor', () => {
  const NOMBRES = {
    ipc: 'IPC', deuda: 'Deuda', reservas: 'Reservas', riesgo: 'Riesgo', pobreza: 'Pobreza',
    desocupacion: 'Desocupación', produccion: 'Producción', confianza: 'Confianza',
  };
  const tabla = html.match(/<table class="ind-table">([\s\S]*?)<\/table>/)?.[1] ?? '';
  const filas = tabla.split('</tr>')
    .map((fila) => [...fila.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => m[1]))
    .filter((celdas) => celdas.length === 4)
    .map(([a, , meta, crisis]) => [null, a, meta, crisis]);
  const desajustes = [];
  for (const [clave, nombre] of Object.entries(NOMBRES)) {
    const fila = filas.find((f) => f[1].includes(nombre));
    assert.ok(fila, `el manual no tiene la fila de ${nombre}`);
    const t = CONFIG.THRESHOLDS[clave];
    const meta = sinHtml(fila[2]);
    const crisis = sinHtml(fila[3]);
    const numMeta = Number(meta.match(/\d+/)?.[0]);
    const numCrisis = Number(crisis.match(/\d+/)?.[0]);
    if (numMeta !== t.warn) desajustes.push(`${nombre}: «Meta» dice ${numMeta}, el motor da la zona segura desde ${t.warn}`);
    if (numCrisis !== t.danger) desajustes.push(`${nombre}: «Crisis» dice ${numCrisis}, el motor da peligro en ${t.danger}`);
    // El sentido (< o >) tiene que ser el del indicador.
    const sentidoMeta = t.low_bad ? '>' : '<';
    if (!meta.trim().startsWith(sentidoMeta)) desajustes.push(`${nombre}: «Meta» tiene que empezar con ${sentidoMeta}: «${meta}»`);
    const sentidoCrisis = t.low_bad ? '≤' : '≥';
    if (!crisis.trim().startsWith(sentidoCrisis)) desajustes.push(`${nombre}: «Crisis» tiene que empezar con ${sentidoCrisis} (el motor cuenta el valor del umbral como peligro): «${crisis}»`);
  }
  assert.deepEqual(desajustes, []);
});

test('los textos de IND_META no repiten un umbral de derrota que depende de la dificultad', () => {
  const prohibidos = new Set(Object.values(UMBRALES).flatMap((u) => [u.pobreza]));
  const malos = [];
  for (const m of IND_META) {
    for (const n of prohibidos) {
      if (new RegExp(`\\b${n}\\s?%`).test(m.tip ?? '')) malos.push(`${m.key}: «${m.tip}»`);
    }
    if (m.key === 'confianza' && /llega a 0\s?%/.test(m.tip ?? '')) malos.push(`${m.key}: «${m.tip}»`);
  }
  assert.deepEqual(malos, []);
});
