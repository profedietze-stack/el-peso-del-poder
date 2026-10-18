// Los diez eventos de América Latina (solo en el modo «Latinoamérica»).
//
// Cumplen las mismas reglas que el banco de 130 (ver decisiones-reales.test.js y
// ministros-dicen-la-verdad.test.js), que no los recorren porque se agregan al banco recién
// al arrancar en Latinoamérica.
import test from 'node:test';
import assert from 'node:assert/strict';

import { EVENTS } from '../js/data/events.js';
import { EVENTS_LATAM, EVENTOS_OCULTOS_LATAM, construirComentarios } from '../js/data/events-latam.js';
import { MINISTER_COMMENTARY } from '../js/data/minister-commentary.js';
import { PROHIBIDOS, textoPais } from '../js/data/pais.js';
import { agregarEventosLatam } from '../js/data/pais-datos.js';

// Foto del banco ANTES de que nadie le agregue los latinoamericanos.
const BANCO_AR = [...EVENTS];
const IDS_AR = new Set(BANCO_AR.map((e) => e.id));
const TAGS_AR = new Set(BANCO_AR.map((e) => e.tag));
const COMENTARIOS_AR_ANTES = new Set(Object.keys(MINISTER_COMMENTARY));

const MALO_ALTO = ['ipc', 'deuda', 'riesgo', 'pobreza', 'desocupacion'];
const INDICADORES = [...MALO_ALTO, 'reservas', 'produccion', 'confianza'];
const bien = (o, k) => (MALO_ALTO.includes(k) ? -(o.efectos[k] ?? 0) : (o.efectos[k] ?? 0));
const domina = (a, b) => INDICADORES.every((k) => bien(a, k) >= bien(b, k)) && INDICADORES.some((k) => bien(a, k) > bien(b, k));
const quitarTags = (t) => t.replace(/<[^>]+>/g, ' ');

test('son dieciocho eventos con ids propios que no pisan al banco', () => {
  assert.equal(EVENTS_LATAM.length, 18);
  const ids = EVENTS_LATAM.map((e) => e.id);
  assert.equal(new Set(ids).size, 18);
  for (const id of ids) {
    assert.ok(Number.isInteger(id) && id >= 201, `id ${id}`);
    assert.ok(!IDS_AR.has(id), `el id ${id} ya existe en el banco`);
  }
});

test('cada evento tiene la forma de los del banco: tag conocido, texto y 3 opciones con los 8 indicadores', () => {
  for (const e of EVENTS_LATAM) {
    assert.ok(TAGS_AR.has(e.tag), `${e.id}: el tag «${e.tag}» no existe en el banco (sin imagen ni peso)`);
    assert.ok(e.titulo.length > 15 && e.descripcion.length > 150, `${e.id}: texto muy corto`);
    assert.equal(e.opciones.length, 3, `${e.id}`);
    for (const o of e.opciones) {
      assert.ok(o.texto.length > 40, `${e.id}: opción muy corta`);
      for (const k of INDICADORES) {
        assert.ok(Number.isFinite(o.efectos[k]), `${e.id}: falta ${k}`);
        assert.ok(Math.abs(o.efectos[k]) <= 25, `${e.id}: ${k} fuera de escala`);
      }
    }
  }
});

test('ninguna opción está dominada por otra del mismo evento', () => {
  const dominadas = [];
  for (const e of EVENTS_LATAM) {
    const c = e.opciones.filter((o) => !o.corrupta && !o.chain);
    for (const a of c) for (const b of c) if (a !== b && domina(b, a)) dominadas.push(`${e.id}: «${a.texto.slice(0, 40)}» por «${b.texto.slice(0, 40)}»`);
  }
  assert.deepEqual(dominadas, []);
});

test('cada opción gana en algo: ninguna es mejor en cero indicadores del evento', () => {
  const sinGanar = [];
  for (const e of EVENTS_LATAM) {
    const c = e.opciones.filter((o) => !o.corrupta && !o.chain);
    for (const o of c) {
      const gana = INDICADORES.some((k) => c.every((p) => bien(o, k) >= bien(p, k)) && c.some((p) => bien(o, k) > bien(p, k)));
      if (!gana) sinGanar.push(`${e.id}: «${o.texto.slice(0, 50)}»`);
    }
  }
  assert.deepEqual(sinGanar, []);
});

test('las opciones que pagan por fuera (corrupta) existen y son las más dañinas para la confianza', () => {
  const corruptas = EVENTS_LATAM.flatMap((e) => e.opciones.filter((o) => o.corrupta).map((o) => [e, o]));
  assert.ok(corruptas.length >= 3, 'tienen que haber dilemas éticos reales');
  for (const [e, o] of corruptas) {
    assert.ok(e.opciones.every((p) => p === o || p.efectos.confianza > o.efectos.confianza), `${e.id}: la corrupta debería ser la que más confianza pierde`);
  }
});

test('ningún texto nombra un país ni un dato real (en Latinoamérica no hay datos de un solo país)', () => {
  const quedan = [];
  for (const e of EVENTS_LATAM) {
    for (const t of [e.titulo, e.descripcion, ...e.opciones.map((o) => o.texto)]) {
      for (const re of PROHIBIDOS) { const m = quitarTags(t).match(re); if (m) quedan.push(`${e.id}: «${m[0]}»`); }
      assert.equal(textoPais(t), t, `${e.id}: el texto cambiaría al localizarse (voseo o término de un país): «${t.slice(0, 50)}»`);
    }
  }
  assert.deepEqual(quedan, []);
});

// ── Comentarios de los ministros ─────────────────────────────

const INDICADOR = {
  'riesgo país': 'riesgo', confianza: 'confianza', pobreza: 'pobreza', deuda: 'deuda', reservas: 'reservas',
  producción: 'produccion', inflación: 'ipc', desempleo: 'desocupacion',
};
const BAJA = ['baja', 'bajan'];
const FRASE = new RegExp(`\\b(${Object.keys(INDICADOR).join('|')})\\s+(sube|suben|baja|bajan)\\s+(\\d+)`, 'gi');

test('cada opción tiene comentarios de ministros, con carteras válidas', () => {
  const c = construirComentarios();
  for (const e of EVENTS_LATAM) {
    assert.equal(c[e.id].length, 3, `${e.id}`);
    for (const [i, porOpcion] of c[e.id].entries()) {
      assert.ok(porOpcion.length >= 1, `${e.id} op${i + 1} sin comentario`);
      for (const t of porOpcion) assert.ok(['economia', 'social', 'gabinete', 'produccion'].includes(t.slot), `${e.id}: cartera ${t.slot}`);
    }
  }
});

test('ningún ministro cita una cifra que el motor no aplica', () => {
  const c = construirComentarios();
  const mentiras = [];
  let frases = 0;
  for (const e of EVENTS_LATAM) {
    c[e.id].forEach((porOpcion, i) => {
      for (const t of porOpcion) {
        for (const m of quitarTags(t.text).matchAll(FRASE)) {
          frases++;
          const clave = INDICADOR[m[1].toLowerCase()];
          const dicho = BAJA.includes(m[2].toLowerCase()) ? -Number(m[3]) : Number(m[3]);
          if (dicho !== (e.opciones[i].efectos[clave] ?? 0)) mentiras.push(`${e.id} op${i + 1}: «${m[0]}» y el motor aplica ${e.opciones[i].efectos[clave]}`);
        }
      }
    });
  }
  assert.ok(frases > 40, `solo ${frases} frases con cifras: ¿el reconocedor no funciona?`);
  assert.deepEqual(mentiras, []);
});

test('el verde y el rojo del ministro dicen la verdad: verde si mejora, rojo si empeora', () => {
  const c = construirComentarios();
  for (const e of EVENTS_LATAM) {
    c[e.id].forEach((porOpcion, i) => {
      for (const t of porOpcion) {
        for (const m of t.text.matchAll(/<span class="mm-(good|bad)">([^<]+)<\/span>/g)) {
          const f = [...m[2].matchAll(FRASE)][0];
          if (!f) continue;
          const clave = INDICADOR[f[1].toLowerCase()];
          const d = e.opciones[i].efectos[clave];
          const mejora = MALO_ALTO.includes(clave) ? d < 0 : d > 0;
          assert.equal(m[1] === 'good', mejora, `${e.id} op${i + 1}: «${m[2]}»`);
        }
      }
    });
  }
});

test('una cifra escrita a mano y distinta de la del motor SÍ la detecta el reconocedor (el test no es vacío)', () => {
  const e = EVENTS_LATAM[0];
  const falso = construirComentarios([e], { 201: [[['social', 'La confianza sube 99 puntos.']], [], []] });
  const frase = [...quitarTags(falso[201][0][0].text).matchAll(FRASE)][0];
  assert.ok(frase, 'el reconocedor no encontró la frase');
  assert.equal(Number(frase[3]), 99);
  assert.notEqual(Number(frase[3]), e.opciones[0].efectos.confianza, 'tiene que ser una mentira: distinta de lo que aplica el motor');
});

// ── Cómo se suman al banco ───────────────────────────────────

test('agregarEventosLatam suma los 18, oculta los 8 de trama argentina y es idempotente', () => {
  assert.equal(EVENTS.length, 130);
  assert.ok(![...COMENTARIOS_AR_ANTES].some((k) => Number(k) >= 201));
  assert.equal(EVENTOS_OCULTOS_LATAM.length, 8);
  for (const id of EVENTOS_OCULTOS_LATAM) assert.ok(IDS_AR.has(id), `el oculto ${id} no existe en el banco original`);

  assert.equal(agregarEventosLatam(), 18);
  assert.equal(EVENTS.length, 130 - 8 + 18);
  for (const id of EVENTOS_OCULTOS_LATAM) assert.ok(!EVENTS.some((e) => e.id === id), `el ${id} sigue en Latinoamérica`);
  assert.equal(agregarEventosLatam(), 0, 'una segunda llamada no duplica ni vuelve a ocultar');
  assert.equal(EVENTS.length, 140);
  for (const e of EVENTS_LATAM) {
    assert.ok(EVENTS.find((x) => x.id === e.id));
    assert.equal(MINISTER_COMMENTARY[e.id].length, 3);
  }
});

test('ocultar eventos no rompe nada del banco: ninguna cadena ni ancla apunta a un oculto', () => {
  const ocultos = new Set(EVENTOS_OCULTOS_LATAM);
  const cadenas = BANCO_AR.flatMap((e) => e.opciones.filter((o) => o.chain).map((o) => o.chain.eventId));
  assert.deepEqual(cadenas.filter((id) => ocultos.has(id)), []);
  for (const ancla of [28, 36, 40]) assert.ok(!ocultos.has(ancla), `el ancla ${ancla}`);
  assert.ok(BANCO_AR.filter((e) => ocultos.has(e.id)).every((e) => !e.isSpecial), 'ningún oculto es un evento especial');
});

test('cada evento oculto tiene su reemplazo con el mismo tag (imagen y peso se mantienen)', () => {
  const reemplazo = { 85: 211, 91: 212, 53: 213, 58: 214, 66: 215, 99: 216, 24: 217, 75: 218 };
  for (const [viejo, nuevo] of Object.entries(reemplazo)) {
    const v = BANCO_AR.find((e) => e.id === Number(viejo));
    const n = EVENTS_LATAM.find((e) => e.id === nuevo);
    assert.equal(n.tag, v.tag, `${viejo} → ${nuevo}`);
  }
});
