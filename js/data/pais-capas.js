"use strict";

// ============================================================
// CAPA DE NOMBRES — México, Colombia y Chile
//
// Cada uno de estos países parte de «Latinoamérica» (textos genéricos, tuteo, los 18
// eventos regionales) y le pone nombre a unas pocas instituciones y lugares.
// `textoPais()` (data/pais.js) aplica estas reglas DESPUÉS de las genéricas.
//
// Criterio, pensado para un aula: solo instituciones y lugares, y solo donde la mención
// es neutral. Nada de personas, partidos ni candidatos (ver PROHIBIDOS_PAIS), y nada de
// nombrar una institución real en el evento donde es la culpable: «el Instituto de
// Estadística bajo sospecha», «el Banco Nacional al borde del colapso» o «el crimen toma
// el puerto principal» quedan genéricos en todos los países. Una pareja que no se puede
// afirmar con certeza también se deja genérica: mejor «el organismo de seguridad social»
// que un nombre equivocado. Lo que queda genérico está anotado en docs/terminos-genericos-latam.md.
//
// Las reglas no pueden depender del orden de otras ni volver a actuar sobre su propio
// resultado: el observador del DOM re-pasa los textos y tiene que dar lo mismo.
// ============================================================

// «Banco Central» a secas es el del país; «Banco Central chino», «de Chile» o «supranacional» no.
const BANCO_CENTRAL = /\bBanco Central(?! (?:de |chino|supranacional|Europeo))/g;
// La universidad «de la capital» es genérica: no se la convierte en una universidad real.
const LA_CAPITAL = /(?<!Universidad de )\bla capital\b/g;
// Evento 212: México y Colombia no tuvieron una dictadura militar como la del Cono Sur; el
// dilema (abrir o sellar archivos de la violencia política) es el mismo.
const SIN_DICTADURA = [
  [/Los Archivos de una Dictadura/g, 'Los Archivos de un Período de Violencia Política'],
  [/Hace décadas gobernó un régimen autoritario que dejó miles de desaparecidos\./g, 'Durante décadas, un período de violencia política dejó miles de desaparecidos.'],
];
// Evento 40 (ancla de la segunda mitad): en estos países no es una elección legislativa. En
// México ya hubo la legislativa intermedia (turno 36), así que acá son elecciones estatales.
const sinLegislativas = (nombre, que, cargos) => [
  [/Elecciones Legislativas de Medio Término/g, `Elecciones ${nombre}`],
  [/Se acercan las elecciones legislativas que renovarán la mitad del Congreso\. Tu bloque perdió la mayoría en la primera vuelta y necesita alianzas urgentes\. La oposición tiene expectativas de hacerse con el control de ambas cámaras, lo que paralizaría toda tu agenda de gobierno\./g,
    `Se acercan las elecciones ${que}. Tu partido necesita alianzas urgentes en el territorio. La oposición tiene expectativas de quedarse con ${cargos}, lo que frenaría la ejecución de tu agenda de gobierno.`],
  [/proponer agenda legislativa concreta/g, 'proponer una agenda concreta para el territorio'],
];
const PETROLERA = /\b(?:[Ll]a )?Petrolera Estatal\b/g;
const FUERA = String.raw`(?<![\wáéíóúñÁÉÍÓÚÑ])`;

export const TERMINOS_PAIS = {
  mx: [
    [BANCO_CENTRAL, 'Banco de México'],
    // «Palacio Nacional» es masculino: cambian el artículo y las contracciones.
    [new RegExp(`${FUERA}([Dd])e la Casa de Gobierno\\b`, 'g'), '$1el Palacio Nacional'],
    [new RegExp(`${FUERA}([Aa]) la Casa de Gobierno\\b`, 'g'), '$1l Palacio Nacional'],
    [/\bLa Casa de Gobierno\b/g, 'El Palacio Nacional'],
    [/\bla Casa de Gobierno\b/g, 'el Palacio Nacional'],
    [/\bCasa de Gobierno\b/g, 'Palacio Nacional'],
    [LA_CAPITAL, 'la Ciudad de México'],
    [PETROLERA, 'Pemex'],
    ...SIN_DICTADURA,
    ...sinLegislativas('Estatales y Locales', 'estatales y locales', 'las principales gubernaturas y alcaldías'),
  ],
  co: [
    [BANCO_CENTRAL, 'Banco de la República'],
    [/\bCasa de Gobierno\b/g, 'Casa de Nariño'],
    [LA_CAPITAL, 'Bogotá'],
    [PETROLERA, 'Ecopetrol'],
    ...SIN_DICTADURA,
    ...sinLegislativas('Regionales y Locales', 'regionales y locales', 'las principales gobernaciones y alcaldías'),
  ],
  cl: [
    [BANCO_CENTRAL, 'Banco Central de Chile'],
    [/\b[Ll]a Casa de Gobierno\b/g, 'La Moneda'],
    [/\bCasa de Gobierno\b/g, 'La Moneda'],
    [LA_CAPITAL, 'Santiago'],
    [PETROLERA, 'ENAP'],
    ...sinLegislativas('Municipales y Regionales', 'municipales y regionales', 'las principales alcaldías y gobiernos regionales'),
  ],
};

// Lo que no puede aparecer en cada país: personas, partidos y candidatos reales, grupos
// armados, y los nombres propios de los otros dos países (un texto de Chile que diga
// «Bogotá» es un error de capa). Se suma a PROHIBIDOS (datos argentinos y voseo).
export const PROHIBIDOS_PAIS = {
  mx: [
    /López Obrador|\bAMLO\b|Sheinbaum|Peña Nieto|Felipe Calderón|Vicente Fox|Zedillo|Salinas de Gortari|Xóchitl|Gálvez Ruiz/,
    /\bMorena\b|\bPRI\b|\bPAN\b|\bPRD\b|Movimiento Regeneración|Zapatista|\bEZLN\b/,
    /Bogot[áa]|Casa de Nariño|Ecopetrol|Banco de la República|\bDANE\b|Santiago de Chile|Palacio de La Moneda|\bENAP\b|Banco Central de Chile/,
  ],
  co: [
    /Gustavo Petro|\bPetro\b|Iván Duque|Juan Manuel Santos|\bUribe\b|Pastrana|Samper|César Gaviria|Federico Gutiérrez|Rodolfo Hernández|Francia Márquez/,
    /Pacto Hist[óo]rico|Centro Democr[áa]tico|Cambio Radical|Alianza Verde|Colombia Humana|\bFARC\b|\bELN\b|\bM-19\b/,
    /Ciudad de México|Palacio Nacional|\bPemex\b|Banxico|Banco de México|Santiago de Chile|Palacio de La Moneda|\bENAP\b|Banco Central de Chile/,
  ],
  cl: [
    /Boric|Piñera|Bachelet|Pinochet|Allende|\bKast\b|Matthei|Eduardo Frei|Ricardo Lagos|Aylwin|Jeannette Jara/,
    /Frente Amplio|Chile Vamos|Unidad Constituyente|\bUDI\b|Renovaci[óo]n Nacional|Partido Republicano/,
    /Ciudad de México|Palacio Nacional|\bPemex\b|Banxico|Banco de México|Bogot[áa]|Casa de Nariño|Ecopetrol|Banco de la República|\bDANE\b/,
  ],
};
