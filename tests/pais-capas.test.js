// Capa de nombres de México, Colombia y Chile: instituciones y lugares reales, sin personas ni partidos.
//
// Aquí NO se llama a aplicarPais (muta los datos en el lugar y solo puede correr una vez por
// proceso): se toma una foto de los textos originales y se les pasa `textoPais` con cada
// país activo. Es la misma función que usan los datos y el observador del DOM.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { DATOS, textos } from './helpers/datos-del-juego.js';
import { PROHIBIDOS, AUTORES_NACIONALES, textoPais, fijarPais, prohibidosDe } from '../js/data/pais.js';
import { EVENTS_LATAM, EVENTOS_OCULTOS_LATAM } from '../js/data/events-latam.js';
import { TERMINOS_PAIS, PROHIBIDOS_PAIS } from '../js/data/pais-capas.js';

const raiz = (r) => fileURLToPath(new URL(`../${r}`, import.meta.url));
const leer = (r) => readFileSync(raiz(r), 'utf8');
const quitarTags = (t) => t.replace(/<[^>]+>/g, ' ');
// Lo que ve el alumno en un país de la familia Latinoamérica: sin las citas y los eventos de un
// solo país, y con los 18 eventos regionales (es lo que deja `aplicarPais`).
const datosDelModo = {
  ...DATOS,
  QUOTES: DATOS.QUOTES.filter((q) => !AUTORES_NACIONALES.includes(q.author)),
  EVENTS: [...DATOS.EVENTS.filter((e) => !EVENTOS_OCULTOS_LATAM.includes(e.id)), ...EVENTS_LATAM],
};
const originales = [...textos(datosDelModo)];

const PAISES_NUEVOS = ['mx', 'co', 'cl'];

test.afterEach(() => fijarPais('latam'));

test('Latinoamérica no cambia: «Banco Central» y «Casa de Gobierno» salen genéricos como siempre', () => {
  fijarPais('latam');
  assert.equal(textoPais('El Banco Central cierra'), 'El Banco Central cierra');
  assert.equal(textoPais('rodean Casa Rosada'), 'rodean la Casa de Gobierno');
  });

test('el nombre completo del Banco Central argentino ya no deja «de la República el país»', () => {
  fijarPais('latam');
  assert.equal(textoPais('el Banco Central de la República Argentina es la autoridad'), 'el Banco Central es la autoridad');
});

test('cada país pone su banco central, su sede de gobierno, su capital y su petrolera estatal', () => {
  const caso = {
    mx: ['Banco de México', 'el Palacio Nacional', 'la Ciudad de México', 'Pemex'],
    co: ['Banco de la República', 'la Casa de Nariño', 'Bogotá', 'Ecopetrol'],
    cl: ['Banco Central de Chile', 'La Moneda', 'Santiago', 'ENAP'],
  };
  for (const id of PAISES_NUEVOS) {
    fijarPais(id);
    const [banco, sede, capital, petrolera] = caso[id];
    assert.equal(textoPais('Reservas del Banco Central'), `Reservas del ${banco}`, id);
    assert.equal(textoPais('rodean Casa Rosada con vehículos'), `rodean ${sede} con vehículos`, id);
    assert.equal(textoPais('barrios de la capital'), `barrios de ${capital}`, id);
    assert.equal(textoPais('entre YPF y las provincias'), `entre ${petrolera} y las provincias`, id);
  }
});

test('la sede de gobierno concuerda con su artículo y con las preposiciones', () => {
  fijarPais('mx');
  assert.equal(textoPais('La Casa Rosada activó el comité'), 'El Palacio Nacional activó el comité');
  assert.equal(textoPais('marcha a Casa Rosada'), 'marcha a Palacio Nacional');
  assert.equal(textoPais('salió de la Casa Rosada'), 'salió del Palacio Nacional');
  assert.equal(textoPais('fue a la Casa Rosada'), 'fue al Palacio Nacional');
  fijarPais('cl');
  assert.equal(textoPais('La Casa Rosada activó el comité'), 'La Moneda activó el comité');
  assert.equal(textoPais('salió de la Casa Rosada'), 'salió de La Moneda');
});

test('no toca el «Banco Central» de otro lugar ni la universidad de la capital', () => {
  for (const id of PAISES_NUEVOS) {
    fijarPais(id);
    assert.equal(textoPais('acuerdo con el Banco Central chino'), 'acuerdo con el Banco Central chino', id);
    assert.equal(textoPais('un Banco Central supranacional'), 'un Banco Central supranacional', id);
    assert.equal(textoPais('la Universidad de la capital'), 'la Universidad de la capital', id);
  }
});

test('aplicar la capa dos veces da lo mismo (el observador del DOM re-pasa los textos)', () => {
  for (const id of PAISES_NUEVOS) {
    fijarPais(id);
    const raros = [];
    for (const [ruta, t] of originales) {
      const una = textoPais(t);
      if (textoPais(una) !== una) raros.push(ruta);
    }
    assert.deepEqual(raros, [], id);
  }
});

test('el orden importa: ninguna regla de un país actúa sobre lo que otra de ese país ya escribió', () => {
  for (const id of PAISES_NUEVOS) {
    const reglas = TERMINOS_PAIS[id];
    const resultados = reglas.map(([, a]) => a).filter((a) => typeof a === 'string');
    for (const [re] of reglas) {
      const sobreResultados = resultados.filter((r) => { re.lastIndex = 0; return re.test(r); });
      assert.deepEqual(sobreResultados, [], `${id}: ${re} se vuelve a aplicar sobre su propio resultado`);
    }
  }
});

test('el barrido existe: «prohibidosDe» trae la lista general más la del país', () => {
  for (const id of PAISES_NUEVOS) {
    assert.equal(prohibidosDe(id).length, PROHIBIDOS.length + PROHIBIDOS_PAIS[id].length, id);
  }
});

test('el barrido encuentra un presidente o un partido sembrado (el test no es vacío)', () => {
  const sembrados = { mx: 'Sheinbaum anuncia', co: 'el Pacto Histórico propone', cl: 'Boric y el Frente Amplio' };
  for (const id of PAISES_NUEVOS) {
    assert.ok(prohibidosDe(id).some((re) => re.test(sembrados[id])), `${id}: «${sembrados[id]}» pasaría el barrido`);
  }
});

test('ningún país nombra a un presidente, un partido ni un candidato reales, ni deja datos argentinos', () => {
  const quedan = [];
  for (const id of PAISES_NUEVOS) {
    fijarPais(id);
    for (const [ruta, t] of originales) {
      const plano = quitarTags(textoPais(t));
      for (const re of prohibidosDe(id)) {
        const m = plano.match(re);
        if (m) quedan.push(`${id} ${ruta}: «${m[0]}»`);
      }
    }
  }
  assert.deepEqual(quedan, []);
});

function archivosJs(dir, salida = []) {
  for (const nombre of readdirSync(raiz(dir))) {
    const ruta = `${dir}/${nombre}`;
    if (statSync(raiz(ruta)).isDirectory()) archivosJs(ruta, salida);
    else if (nombre.endsWith('.js')) salida.push(ruta);
  }
  return salida;
}

test('los textos del código y del manual tampoco nombran personas ni partidos reales en esos países', () => {
  const fuentes = [...archivosJs('js').filter((r) => !r.startsWith('js/data/')), 'index.html'];
  const literales = String.raw`'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|` + '`((?:[^`\\\\]|\\\\.)*)`';
  const quedan = [];
  for (const id of PAISES_NUEVOS) {
    fijarPais(id);
    for (const ruta of fuentes) {
      const texto = leer(ruta);
      const trozos = ruta.endsWith('.html')
        ? [quitarTags(texto)]
        : [...texto.matchAll(new RegExp(literales, 'g'))].map((m) => m[1] ?? m[2] ?? m[3] ?? '');
      for (const t of trozos) {
        const lit = quitarTags(textoPais(t));
        for (const re of prohibidosDe(id)) {
          const x = lit.match(re);
          if (x) quedan.push(`${id} ${ruta}: «${lit.slice(Math.max(0, x.index - 30), x.index + 50)}»`);
        }
      }
    }
  }
  assert.deepEqual(quedan, []);
});

test('la capa cambia textos de verdad en cada país (si no, los barridos no prueban nada)', () => {
  for (const id of PAISES_NUEVOS) {
    fijarPais(id);
    let cambios = 0;
    for (const [, t] of originales) {
      fijarPais('latam');
      const base = textoPais(t);
      fijarPais(id);
      if (textoPais(t) !== base) cambios++;
    }
    assert.ok(cambios >= 30, `${id}: la capa solo cambió ${cambios} textos`);
  }
});
