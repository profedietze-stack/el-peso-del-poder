// Selector de país: Argentina o Latinoamérica.
//
// El juego se escribió con datos de Argentina (INDEC, el 22 % del litio, Malvinas…).
// Para publicarlo en el resto del mundo hispano, "Latinoamérica" reescribe esos
// textos hacia un país sin nombre. Estos tests recorren TODOS los textos —datos,
// código y manual— y fallan si en Latinoamérica queda un dato real, así un texto
// nuevo con «INDEC» no se cuela.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { DATOS, textos } from './helpers/datos-del-juego.js';
import { aplicarPais, QUOTES } from '../js/data/pais-datos.js';
import { PAISES, PROHIBIDOS, textoPais, localizarDatos } from '../js/data/pais.js';
import { sanearAjustes } from '../js/engine/settings.js';

const raiz = (r) => fileURLToPath(new URL(`../${r}`, import.meta.url));
const leer = (r) => readFileSync(raiz(r), 'utf8');
const quitarTags = (t) => t.replace(/<[^>]+>/g, ' ');

// Foto de los textos ANTES de localizar (el barrido de Latinoamérica la muta).
const originales = [...textos(DATOS)];
const originalPorRuta = new Map(originales);
const citasAntes = QUOTES.length;

test('los ajustes aceptan solo países que existen', () => {
  assert.equal(sanearAjustes({ pais: 'latam' }).pais, 'latam');
  assert.equal(sanearAjustes({ pais: 'ar' }).pais, 'ar');
  assert.equal(sanearAjustes({ pais: 'chile' }).pais, 'ar', 'un país inventado cae a Argentina');
  assert.equal(sanearAjustes({ pais: 7 }).pais, 'ar');
  assert.equal(sanearAjustes({}).pais, 'ar');
  assert.deepEqual(Object.keys(PAISES), ['ar', 'latam']);
});

test('con Argentina no se toca ningún texto', () => {
  assert.equal(aplicarPais('ar'), 0);
  assert.deepEqual([...textos(DATOS)], originales);
});

test('el juego trae datos reales de Argentina que Latinoamérica tiene que sacar', () => {
  // Si esto da 0, el barrido de abajo no prueba nada.
  let reales = 0;
  for (const [, t] of originales) if (PROHIBIDOS.some((re) => re.test(quitarTags(t)))) reales++;
  assert.ok(reales > 150, `solo ${reales} textos con datos reales: ¿cambió PROHIBIDOS?`);
});

test('Latinoamérica: ningún texto de los datos conserva un dato real', () => {
  const cambios = aplicarPais('latam');
  assert.ok(cambios > 150, `solo reescribió ${cambios} textos`);
  const quedan = [];
  for (const [ruta, t] of textos(DATOS)) {
    const plano = quitarTags(t);
    for (const re of PROHIBIDOS) {
      const m = plano.match(re);
      if (m) quedan.push(`${ruta}: «${m[0]}» en «${plano.slice(Math.max(0, m.index - 30), m.index + 50)}»`);
    }
  }
  assert.deepEqual(quedan, [], `${quedan.length} textos con datos reales`);
});

test('Latinoamérica: se sacan las citas de autores de un solo país y quedan citas genéricas', () => {
  assert.ok(QUOTES.length < citasAntes, 'no se sacó ninguna cita');
  assert.ok(QUOTES.length > 30);
  assert.ok(QUOTES.every((q) => q.text.length > 5 && q.author));
  assert.ok(QUOTES.some((q) => q.tags.length === 0), 'tienen que quedar citas genéricas para las etiquetas sin cita propia');
});

test('Latinoamérica: la gramática no queda rota por las sustituciones', () => {
  const rotas = [];
  const mal = [/\b(el|la|los|las|del|al) \1\b/i, /\bde el\b/, /\ba el\b/];
  for (const [ruta, t] of textos(DATOS)) {
    const antes = originalPorRuta.get(ruta);
    if (antes === undefined || antes === t) continue; // solo lo que cambió la localización
    const plano = quitarTags(t);
    for (const re of mal) {
      const m = plano.match(re);
      if (m) rotas.push(`${ruta}: «${plano.slice(Math.max(0, m.index - 25), m.index + 40)}»`);
    }
  }
  assert.deepEqual(rotas, []);
});

test('Latinoamérica: la oración no empieza en minúscula por haber sacado «Argentina»', () => {
  const rotas = [];
  for (const [ruta, t] of textos(DATOS)) {
    const antes = originalPorRuta.get(ruta);
    if (antes === undefined || antes === t) continue;
    for (const m of quitarTags(t).matchAll(/(?:^|[.!?]\s+)(el país|la capital|el sur)\b/g)) {
      rotas.push(`${ruta}: «${m[0].trim()}»`);
    }
  }
  assert.deepEqual(rotas, []);
});

test('textoPais: casos concretos', () => {
  assert.equal(textoPais('Argentina tiene reservas.'), 'El país tiene reservas.');
  assert.equal(textoPais('Viven en Argentina.'), 'Viven en el país.');
  assert.equal(textoPais('La economía argentina crece.'), 'La economía nacional crece.');
  assert.equal(textoPais('Según el INDEC, bajó.'), 'Según el Instituto de Estadística, bajó.');
  assert.equal(textoPais('Informe del INDEC.'), 'Informe del Instituto de Estadística.');
  assert.equal(textoPais('Hoy #ArgentinaGobierna'), 'Hoy #PaísGobierna');
  assert.equal(textoPais('Bien así #ARG'), 'Bien así #País');
  assert.equal(textoPais('Nada que cambiar.'), 'Nada que cambiar.');
  assert.equal(textoPais('🇦🇷 hola'), '🌎 hola');
  assert.equal(textoPais('el Banco Nacional'), 'el Banco Nacional', 'no tiene que partir «Nacional» en «Nacion»+«al»');
});

test('localizarDatos solo toca valores: ni claves ni funciones', () => {
  const f = () => 'INDEC';
  const o = { INDEC: 'dato del INDEC', f, n: 5, a: ['Argentina crece.'] };
  localizarDatos(o);
  assert.equal(o.f, f);
  assert.ok('INDEC' in o);
  assert.equal(o.INDEC, 'dato del Instituto de Estadística');
  assert.equal(o.n, 5);
  assert.deepEqual(o.a, ['El país crece.']);
});

// ── Textos que viven en el código (no en js/data) ────────────

function archivosJs(dir, salida = []) {
  for (const nombre of readdirSync(raiz(dir))) {
    const ruta = `${dir}/${nombre}`;
    if (statSync(raiz(ruta)).isDirectory()) archivosJs(ruta, salida);
    else if (nombre.endsWith('.js')) salida.push(ruta);
  }
  return salida;
}

test('Latinoamérica: los textos escritos dentro del código también quedan limpios', () => {
  const fuentes = [...archivosJs('js').filter((r) => !r.startsWith('js/data/')), 'index.html'];
  const literales = String.raw`'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|` + '`((?:[^`\\\\]|\\\\.)*)`';
  const quedan = [];
  for (const ruta of fuentes) {
    const texto = leer(ruta);
    const trozos = ruta.endsWith('.html')
      ? [quitarTags(texto)]
      : [...texto.matchAll(new RegExp(literales, 'g'))].map((m) => m[1] ?? m[2] ?? m[3] ?? '');
    for (const t of trozos) {
      const lit = quitarTags(textoPais(t));
      for (const re of PROHIBIDOS) {
        const x = lit.match(re);
        if (x) quedan.push(`${ruta}: «${lit.slice(Math.max(0, x.index - 30), x.index + 50)}»`);
      }
    }
  }
  assert.deepEqual(quedan, []);
});

test('el selector de país queda fuera del reescrito (si no, «Argentina» pasaría a decir «El país»)', () => {
  assert.match(leer('js/ui/settings-modal.js'), /id="set-pais-row" data-sin-pais/);
  const dom = leer('js/ui/pais-dom.js');
  assert.match(dom, /data-sin-pais/);
  assert.ok((dom.match(/_excluido\(/g) || []).length >= 2, 'tanto textos como elementos tienen que respetar la marca');
});

// ── Voseo → tuteo ────────────────────────────────────────────

test('Latinoamérica tutea: el voseo rioplatense pasa a «tú»', () => {
  const casos = [
    ['¿A qué dificultad querés jugar?', '¿A qué dificultad quieres jugar?'],
    ['Podés cambiarla en cada partida.', 'Puedes cambiarla en cada partida.'],
    ['Elegí con cuidado.', 'Elige con cuidado.'],
    ['definí quién sos.', 'define quién eres.'],
    ['Si no tenés reservas, perdés confianza.', 'Si no tienes reservas, pierdes confianza.'],
    ['Antes de ver números, mirá a quién afectan.', 'Antes de ver números, mira a quién afectan.'],
    ['Ingresá el nombre del partido.', 'Ingresa el nombre del partido.'],
    ['Un juicio político contra vos.', 'Un juicio político contra ti.'],
    ['podría arrastrarte a vos también', 'podría arrastrarte a ti también'],
    ['hablar con vos', 'hablar contigo'],
    ['vos debés decidir', 'tú debes decidir'],
  ];
  for (const [vos, tu] of casos) assert.equal(textoPais(vos), tu, vos);
});

test('el tuteo no toca palabras que terminan igual ni nombres propios', () => {
  for (const t of ['El país gana más interés', 'Después de atrás, además', 'Tomás y Andrés viajan a París', 'estás seguro', 'perderás el apoyo', 'deberás decidir']) {
    assert.equal(textoPais(t), t, t);
  }
});

test('el juego trae voseo que el tuteo tiene que sacar (si no, el barrido no prueba nada)', () => {
  const voseo = PROHIBIDOS.find((re) => re.test('podés'));
  assert.ok(voseo, 'PROHIBIDOS tiene que traer la regla del voseo');
  assert.ok(originales.filter(([, t]) => voseo.test(t)).length >= 3, 'los datos casi no traen voseo');
});

test('una forma de voseo que falta en la tabla la encuentra el barrido del código', () => {
  const sinTabla = textoPais('Hacé lo que querés.');
  // «Hacé» no está en la tabla: queda, y quien lo agregue tiene que sumarlo a VOSEO.
  assert.match(sinTabla, /Hacé/);
  assert.match(sinTabla, /quieres/);
});

test('Latinoamérica: «la Patagonia» no queda como «la sur» (el artículo cambia con el género)', () => {
  assert.equal(textoPais('Incendios en la Patagonia: El Bosque Arde'), 'Incendios en el sur: El Bosque Arde');
  assert.equal(textoPais('los ecosistemas de la Patagonia'), 'los ecosistemas del sur');
  assert.equal(textoPais('una refinería en la Patagonia'), 'una refinería en el sur');
  const mal = [];
  for (const [ruta, t] of textos(DATOS)) {
    const m = quitarTags(t).match(/\b(?:la|de la|en la|por la) sur\b/i);
    if (m) mal.push(`${ruta}: «${m[0]}»`);
  }
  assert.deepEqual(mal, []);
});
