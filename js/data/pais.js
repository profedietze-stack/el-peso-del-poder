"use strict";

// ============================================================
// PAÍS — Argentina o Latinoamérica (país imaginario)
//
// El juego se escribió con datos de Argentina. Para publicarlo en el resto del
// mundo hispano, "Latinoamérica" reescribe esos textos hacia un país sin nombre:
// mismas decisiones, mismos números, otras instituciones y otros lugares.
//
// Cómo funciona: `localizarDatos()` recorre los datos del juego UNA vez, al
// arrancar, y reemplaza los textos en el lugar. Cambiar de país recarga la página
// (ver settings-modal.js). Con 'ar' no se toca nada.
//
// Dos capas:
//   1. FRASES: pasajes con un dato real que no se arregla cambiando un nombre
//      (el 22 % del litio, Malvinas). Se reescriben a mano y van primero.
//   2. TERMINOS: instituciones y lugares con equivalente genérico.
//
// El test `tests/pais.test.js` recorre TODOS los textos y falla si en Latinoamérica
// queda algo de PROHIBIDOS: así un texto nuevo con "INDEC" no se cuela.
// ============================================================

// `base`: de qué capa de textos parte (null = los originales). `reglas.turnos` es la
// duración real del mandato en meses (ver engine/mandato.js).
export const PAISES = {
  ar:    { id: 'ar',    nombre: 'Argentina',     bandera: '🇦🇷', base: null,    reglas: { turnos: 48, medioTermino: 24, segundoMandato: true } },
  latam: { id: 'latam', nombre: 'Latinoamérica', bandera: '🌎', base: 'latam', reglas: { turnos: 48, medioTermino: 24, segundoMandato: true } },
  mx:    { id: 'mx',    nombre: 'México',        bandera: '🇲🇽', base: 'latam', reglas: { turnos: 72, medioTermino: 36, segundoMandato: false } },
  co:    { id: 'co',    nombre: 'Colombia',      bandera: '🇨🇴', base: 'latam', reglas: { turnos: 48, medioTermino: 24, segundoMandato: false } },
  cl:    { id: 'cl',    nombre: 'Chile',         bandera: '🇨🇱', base: 'latam', reglas: { turnos: 48, medioTermino: 24, segundoMandato: false } },
};
export const PAIS_POR_DEFECTO = 'ar';

/** Pasajes completos con datos reales de un solo país. Se aplican primero. */
export const FRASES = [
  // Malvinas → disputa por un archipiélago (el reclamo es de un solo país)
  ['Malvinas: La Ofensiva Diplomática en el Comité de Descolonización', 'Reclamo Territorial: La Ofensiva Diplomática en el Comité de Descolonización'],
  ['sobre la cuestión Malvinas. Argentina tiene la oportunidad', 'sobre un archipiélago en disputa. El país tiene la oportunidad'],
  ['con el Reino Unido en un formato', 'con la potencia europea en un formato'],
  ['El gobierno británico condiciona', 'El gobierno de esa potencia condiciona'],
  ['relaciones diplomáticas con el Reino Unido', 'relaciones diplomáticas con la potencia europea'],
  ['la cuestión Malvinas', 'la disputa por el archipiélago'],
  ['cautela en Malvinas', 'cautela en la disputa del archipiélago'],
  // Litio: el 22 % es de un solo país
  ["Argentina posee el 22% de las reservas mundiales de litio en el 'Triángulo del Litio' (Jujuy, Salta, Catamarca).", "El país posee una de las mayores reservas mundiales de litio, en el 'Triángulo del Litio' de la región andina."],
  ['yacimiento de litio de Puna-Norte', 'yacimiento de litio del altiplano norte'],
  ['Megaoferta por el Litio de la Puna', 'Megaoferta por el Litio del Altiplano'],
  // 2001 → corralito genérico
  ['El fantasma del corralito del 2001 se cierne', 'El fantasma de un corralito bancario se cierne'],
  ['El <b>corralito del 2001</b> enseñó', 'El <b>corralito de una crisis anterior</b> enseñó'],
  ['lo aprendimos en 2001', 'lo aprendimos en la crisis anterior'],
  ['es la peor desde el corralito', 'es la peor desde la gran crisis'],
  // Geografía
  ['tren de alta velocidad entre Buenos Aires, Rosario y Córdoba', 'tren de alta velocidad entre la capital, el puerto fluvial y la ciudad del centro'],
  ['Tren Bala Buenos Aires-Rosario-Córdoba', 'Tren de Alta Velocidad'],
  ['Santiago del Estero', 'una provincia del norte'],
  ['cuencas del Paraná y el Uruguay', 'cuencas de los grandes ríos'],
  ['Zona Económica Exclusiva argentina sin autorización en el Mar Argentino', 'Zona Económica Exclusiva nacional sin autorización'],
  ['Mar Argentino', 'mar territorial'],
  ['ecosistemas marinos patagónicos', 'ecosistemas marinos del sur'],
  ['Petróleo Offshore Patagónico', 'Petróleo Offshore del Sur'],
  ['Acuerdo regional MERCOSUR', 'Acuerdo regional'],
  ['La Unión de Trabajadores de la Economía Popular (UTEP)', 'La Unión de la Economía Popular'],
  ['Comisión Nacional de Energía Atómica (CNEA)', 'Comisión de Energía Atómica'],
  ['Agencia Federal de Inteligencia (AFI)', 'Agencia Federal de Inteligencia'],
  ['Banco de la Nación Argentina', 'Banco Nacional'],
  ['Comisión Nacional de Defensa de la Competencia (CNDC)', 'Comisión Nacional de Defensa de la Competencia'],
  ['Las madres de Ituzaingó', 'Las madres del barrio'],
  ['Las Madres de Plaza de Mayo', 'Las organizaciones de familiares de víctimas'],
  ['Madres de Plaza de Mayo', 'organizaciones de familiares de víctimas'],
  [' (ESI)', ''],
  ['YPF-Litio', 'Litio Estatal'],
  ['rodean Casa Rosada', 'rodean la Casa de Gobierno'],
];

/**
 * VOSEO → TUTEO. El juego está escrito en español rioplatense («podés», «elegí», «vos»).
 * En Latinoamérica se pasa al tuteo, que entiende todo el mundo hispano. Es una lista
 * cerrada (el juego usa unas 60 formas) y no una regla de conjugación: así no se rompe
 * un nombre propio ni una palabra que termina igual (país, más, interés). El test
 * revisa que no quede ninguna forma de PROHIBIDOS y que esta tabla sea el único origen.
 */
export const VOSEO = {
  // presente
  podés: 'puedes', tenés: 'tienes', querés: 'quieres', debés: 'debes', sos: 'eres', creés: 'crees',
  elegís: 'eliges', asumís: 'asumes', cubrís: 'cubres', seguís: 'sigues', pedís: 'pides',
  cerrás: 'cierras', arrancás: 'arrancas', enfrentás: 'enfrentas', cambiás: 'cambias',
  respondés: 'respondes', necesitás: 'necesitas', defendés: 'defiendes', sacrificás: 'sacrificas',
  iniciás: 'inicias', dejás: 'dejas', comprás: 'compras', perdés: 'pierdes', empezás: 'empiezas',
  continuás: 'continúas', accedés: 'accedes', heredás: 'heredas', ganás: 'ganas',
  atendés: 'atiendes', gobernás: 'gobiernas', contás: 'cuentas', intentás: 'intentas',
  justificás: 'justificas', rechazás: 'rechazas',
  // subjuntivo
  tomés: 'tomes',
  // imperativo
  mirá: 'mira', ingresá: 'ingresa', tocá: 'toca', cargá: 'carga', usá: 'usa', iniciá: 'inicia',
  seguí: 'sigue', definí: 'define', elegí: 'elige', asumí: 'asume', pedí: 'pide',
};

/** [regex, reemplazo]. El orden importa. Los nombres propios van sin artículo
 *  para que "del INDEC" quede "del Instituto de Estadística". */
export const TERMINOS = [
  // Nombre propio que hace de sujeto y necesita artículo ("CONICET advierte" → "El Consejo…").
  [/(^|[.!?—:]\s+|>\s*)ARSAT\b/g, '$1La Empresa Satelital Estatal'],
  [/(^|[.!?—:]\s+|>\s*)INVAP\b/g, '$1La Empresa Nuclear Estatal'],
  [/(^|[.!?—:]\s+|>\s*)CONICET\b/g, '$1El Consejo Científico Nacional'],
  [/(^|[.!?—:]\s+|>\s*)Atucha III/g, '$1La Central Nuclear III'],
  [/(\b(?:mediante|con)) ARSAT\b/g, '$1 la Empresa Satelital Estatal'],
  [/(\b(?:Aprobar|rechazar)) Atucha III/g, '$1 la Central Nuclear III'],
  [/\bdel Reino Unido\b/g, 'de la potencia europea'],
  [/\bel Reino Unido\b/g, 'la potencia europea'],
  // Términos de la economía y la política argentina con equivalente genérico.
  [/\bLas retenciones a las exportaciones/g, 'Los impuestos a las exportaciones'],
  [/\blas retenciones a las exportaciones/g, 'los impuestos a las exportaciones'],
  [/\bLas retenciones\b/g, 'Los impuestos a la exportación'],
  [/\blas retenciones\b/g, 'los impuestos a la exportación'],
  [/\bretenciones\b/g, 'impuestos a la exportación'],
  [/Retenciones Agropecuarias/g, 'Impuestos a la Exportación Agropecuaria'],
  [/\bRetenciones\b/g, 'Impuestos a la exportación'],
  [/#LasRetenciones(\w*)/g, '#LosImpuestos$1'],
  [/\bParitarias\b/g, 'Negociaciones colectivas'],
  [/acuerdo paritario/g, 'acuerdo salarial'],
  [/porte[ñn]o-céntrico/g, 'capitalino'],
  [/\bporte[ñn]os?\b/g, 'capitalinos'],
  [/conurbano bonaerense/gi, 'cinturón urbano'],   // antes que «bonaerense» suelto
  [/policía bonaerense/g, 'policía provincial'],
  [/municipios bonaerenses/g, 'municipios del cinturón urbano'],
  [/\bbonaerenses?\b/g, 'locales'],
  [/\bboleto de colectivo\b/g, 'pasaje de transporte público'],
  [/\bLaburo\b/g, 'Trabajo'],
  [/\blaburo\b/g, 'trabajo'],
  [/\bpiquetes\b/g, 'bloqueos'],
  [/\bpiquete\b/g, 'bloqueo'],
  [/\bcepo cambiario\b/g, 'control de cambios'],
  [/\bCepo\b/g, 'Control de cambios'],
  [/\bcepo\b/g, 'control de cambios'],
  [/negociaciones paritarias/g, 'negociaciones colectivas'],
  [/\bparitarias\b/g, 'negociaciones colectivas'],
  [/\bparitaria\b/g, 'negociación colectiva'],
  [/'lawfare'/g, "'persecución política'"],
  [/\bMonotributo\b/g, 'Régimen Simplificado'],
  [/\bmonotributo\b/g, 'régimen simplificado'],
  [/\bobra social\b/g, 'seguro de salud'],
  [/\bpiqueteros\b/g, 'manifestantes'],
  [/\bintendentes\b/g, 'alcaldes'],
  [/\bconurbano\b/g, 'cinturón urbano'],
  [/Casa Rosada/g, 'Casa de Gobierno'],
  [/\bBCRA\b/g, 'Banco Central'],
  [/\bINDEC\b/g, 'Instituto de Estadística'],
  [/\bINVAP\b/g, 'Empresa Nuclear Estatal'],
  [/\bCONICET\b/g, 'Consejo Científico Nacional'],
  [/\bYPF\b/g, 'Petrolera Estatal'],
  [/\bANSES\b/g, 'Seguridad Social'],
  [/\bAFA\b/g, 'Federación de Fútbol'],
  [/\bMERCOSUR\b|\bMercosur\b/g, 'Bloque Regional'],
  [/\bINCAA\b/g, 'Instituto de Cine'],
  [/\bARSAT\b/g, 'Empresa Satelital Estatal'],
  [/\bCNEA\b/g, 'Comisión de Energía Atómica'],
  [/Atucha III/g, 'Central Nuclear III'],
  [/Atucha II/g, 'Central Nuclear II'],
  [/\bAtucha\b/g, 'Central Nuclear Norte'],
  [/\bAFI\b/g, 'agencia de inteligencia'],
  [/\bESI\b/g, 'educación sexual integral'],
  [/\bUTEP\b/g, 'Unión de la Economía Popular'],
  [/\bCELS\b/g, 'Centro de Derechos Humanos'],
  [/Gendarmer[íi]a/g, 'Guardia Fronteriza'],
  [/Prefectura Naval|\bPrefectura\b/g, 'Guardia Costera'],
  [/\bBanco Naci[óo]n\b|\bBNA\b/g, 'Banco Nacional'],
  [/\bCTA\b/g, 'Central Sindical'],
  [/los ex CCD/g, 'los ex centros clandestinos de detención'],
  [/\bex CCD\b/g, 'ex centro clandestino de detención'],
  [/\bCOFEMA\b/g, 'consejo federal ambiental'],
  [/\bCNDC\b/g, 'comisión de defensa de la competencia'],
  [/\bCER\b/g, 'índice de ajuste'],
  [/\bUVA\b/g, 'indexado'],
  [/\bAMBA\b/g, 'Área Metropolitana'],
  [/Gran Buenos Aires/g, 'Área Metropolitana'],
  [/Puerto de Buenos Aires/g, 'Puerto Principal'],
  [/Buenos Aires/g, 'la capital'],
  [/Conurbano/g, 'Cinturón Urbano'],
  [/Precios Justos/g, 'Precios Acordados'],
  [/Formulario Terap[ée]utico Nacional/g, 'Listado Nacional de Medicamentos'],
  [/Patagonia andina/g, 'cordillera sur'],
  [/\bde la Patagonia\b/g, 'del sur'],
  [/\bla Patagonia\b/g, 'el sur'],
  [/Patagonia/g, 'el sur'],
  [/patag[óo]nic[oa]s?/g, 'del sur'],
  [/Bolsa de Comercio de Rosario/g, 'Bolsa de Comercio'],
  [/\bRosario\b/g, 'el puerto fluvial'],
  [/C[óo]rdoba/g, 'la ciudad del centro'],
  [/Malvinas/g, 'el archipiélago en disputa'],
  [/\bReino Unido\b/g, 'potencia europea'],
  [/#(\w*)Argentina(\w*)/g, '#$1País$2'],
  [/#(\w*)ARG\b/g, '#$1País'],
  [/#(\w*)AR\b/g, '#$1País'],
  [/🇦🇷/g, '🌎'],
  [/(^|[.!?:]\s+|>\s*|["¡¿]\s*)Argentina\b/g, '$1El país'],
  [/\bargentinos\b/g, 'ciudadanos'],
  [/\bargentinas\b/g, 'nacionales'],
  [/\bargentino\b/g, 'nacional'],
  [/\bargentina\b/g, 'nacional'],
  [/\bArgentina\b/g, 'el país'],
  // Arreglos de gramática que dejan las sustituciones.
  [/\b(del|al) el\b/g, '$1'],
  [/\bde el\b/g, 'del'],
  [/\ba el\b/g, 'al'],
  [/\b([Ee]l) el\b/g, '$1'],
  [/\b([Ll]a) la\b/g, '$1'],
  [/\b([Ll]a) el\b/g, '$1'],
];

/** Lo que NO puede quedar en Latinoamérica (lo usa el test y `localizarDatos`). */
export const PROHIBIDOS = [
  // jerga y términos de un solo país
  /conurbano|bonaerense|porte[ñn]o|rioplatense|monotributo|obra social|piquete|paritari|\bcepo\b|lawfare|retenciones|intendente|laburo|boleto de colectivo/i,
  // voseo rioplatense (en Latinoamérica se tutea)
  new RegExp(String.raw`(?<![\wáéíóúñÁÉÍÓÚÑ])(vos|${Object.keys(VOSEO).join('|')})(?![\wáéíóúñÁÉÍÓÚÑ])`, 'i'),
  /argentin/i, /\bARG\b/, /INDEC/, /INVAP/, /CONICET/i, /\bYPF\b/, /ANSES/, /\bAFA\b/, /Mercosur/i,
  /Casa Rosada/, /BCRA/, /Buenos Aires/, /Patagon/i, /Malvinas/, /Rosario/, /C[óo]rdoba/,
  /corralito del/i, /Vaca Muerta/, /kirchner/i, /Jujuy|Salta\b|Catamarca|Puna\b/,
  /INCAA|ARSAT|CNEA|Atucha|\bAFI\b|\bESI\b|UTEP|CELS|Gendarmer|\bBNA\b|\bBanco Naci[óo]n\b|\bCTA\b|\bCCD\b/,
  /COFEMA|CNDC|Conurbano|Ituzaing|Tren Bala|AMBA|Precios Justos|\bCER\b|\bUVA\b|Plaza de Mayo/,
  /Santiago del Estero|Prefectura|Formulario Terap/, /Reino Unido|brit[áa]nic/i,
  /Sarmiento|Belgrano|Alberdi|Alfons[ií]n|San Mart[ií]n|Per[óo]n\b|P[ée]rez Esquivel/,
];

/** Autores de citas que son de un solo país: en Latinoamérica no se muestran. */
export const AUTORES_NACIONALES = [
  'Domingo F. Sarmiento', 'Manuel Belgrano', 'Raúl Alfonsín', 'Juan B. Alberdi', 'Juan Bautista Alberdi',
  'Néstor Kirchner', 'General José de San Martín', 'Juan Domingo Perón', 'Adolfo Pérez Esquivel',
  'Preámbulo Constitucional 1994',
];

/** Saca de `citas` (en el lugar) las de autores de un solo país. Devuelve cuántas sacó. */
export function adaptarCitas(citas) {
  let sacadas = 0;
  for (let i = citas.length - 1; i >= 0; i--) {
    if (AUTORES_NACIONALES.includes(citas[i].author)) { citas.splice(i, 1); sacadas++; }
  }
  return sacadas;
}

const _LETRA = String.raw`[\wáéíóúñÁÉÍÓÚÑ]`;
const _mayus = (palabra) => palabra[0].toUpperCase() + palabra.slice(1);
const _REGLAS_VOSEO = [
  // «con vos» → «contigo»; «a/de/para… vos» → «ti»; el resto, «tú».
  [new RegExp(`(?<!${_LETRA})([Cc])on vos(?!${_LETRA})`, 'g'), (_, c) => `${c}ontigo`],
  [new RegExp(`(?<!${_LETRA})(a|de|para|contra|por|sin|en|hacia|sobre|ante|tras) vos(?!${_LETRA})`, 'gi'), (_, p) => `${p} ti`],
  [new RegExp(`(?<!${_LETRA})([Vv])os(?!${_LETRA})`, 'g'), (_, v) => (v === 'V' ? 'Tú' : 'tú')],
  ...Object.entries(VOSEO).map(([vos, tu]) => [
    new RegExp(`(?<!${_LETRA})${vos}(?!${_LETRA})`, 'gi'),
    (m) => (m[0] === m[0].toUpperCase() ? _mayus(tu) : tu),
  ]),
];

/** Aplica FRASES, TERMINOS y el paso de voseo a tuteo a un texto. */
export function textoPais(s) {
  if (typeof s !== 'string' || s.length < 3) return s;
  let t = s;
  for (const [de, a] of FRASES) t = t.split(de).join(a);
  for (const [re, a] of TERMINOS) t = t.replace(re, a);
  for (const [re, a] of _REGLAS_VOSEO) t = t.replace(re, a);
  return t;
}

/**
 * Recorre `raiz` y reemplaza, en el lugar, todo texto que cambie. Solo toca
 * valores (nunca claves ni funciones). Devuelve cuántos textos cambió.
 */
export function localizarDatos(raiz) {
  const vistos = new WeakSet();
  let cambios = 0;
  const visitar = (nodo) => {
    if (nodo === null || typeof nodo !== 'object' || vistos.has(nodo)) return;
    vistos.add(nodo);
    for (const k of Object.keys(nodo)) {
      const v = nodo[k];
      if (typeof v === 'string') {
        const nuevo = textoPais(v);
        if (nuevo !== v) { nodo[k] = nuevo; cambios++; }
      } else visitar(v);
    }
  };
  visitar(raiz);
  return cambios;
}
