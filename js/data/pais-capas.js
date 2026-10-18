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
// Colombia y Chile no tienen centrales nucleares. Los eventos del sector nuclear pasan a ser un
// plan a futuro (la primera central, un programa de fusión) y el accidente, uno ocurrido en un
// país vecino. Los efectos de cada opción no cambian: solo el contexto.
const _escapar = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const frase = (de, a) => [new RegExp(_escapar(de), 'g'), a];

const NUCLEAR_A_FUTURO = [
  // Evento 60: fusión nuclear
  frase('La Comisión de Energía Atómica logró un avance técnico histórico en reactores de fusión nuclear de pequeña escala. Con USD 500 millones de inversión en 5 años podría tener el primer reactor comercial de fusión de América Latina.',
    'Un grupo de científicos del país logró un avance técnico histórico en reactores de fusión nuclear de pequeña escala. Con USD 500 millones de inversión en 5 años, el país podría crear su primer programa nuclear y tener el primer reactor comercial de fusión de América Latina.'),
  frase('convertir a la Comisión de Energía Atómica en líder mundial en fusión', 'crear un programa nacional de fusión que sea líder mundial'),
  frase('el país puede seguir siendo referente regional en energía nuclear', 'el país puede llegar a ser referente regional en energía nuclear'),
  frase('acumulado en décadas de trayectoria de la Comisión de Energía Atómica', 'que van a desarrollar los científicos del país'),
  // Evento 88: la primera central
  frase('El Futuro Nuclear: ¿Ampliar la Capacidad Atómica?', 'El Futuro Nuclear: ¿Dar el Primer Paso?'),
  frase('La Comisión de Energía Atómica presenta el proyecto de construcción de Central Nuclear III, una central nuclear de cuarta generación que duplicaría la capacidad eléctrica nuclear del país.',
    'Un equipo de expertos presenta un plan a futuro: construir la primera central nuclear del país, de cuarta generación, para diversificar la matriz eléctrica.'),
  frase('Los ingenieros de Empresa Nuclear Estatal señalan que el país tiene la tecnología y el capital humano para ser potencia nuclear regional en energía limpia.',
    'Los ingenieros señalan que el país puede formar la tecnología y el capital humano para ser potencia nuclear regional en energía limpia.'),
  frase('Aprobar la Central Nuclear III con financiamiento diversificado', 'Aprobar el plan nuclear con financiamiento diversificado'),
  frase('rechazar la Central Nuclear III', 'rechazar el plan nuclear'),
  frase('La Central Nuclear III genera 7 puntos', 'La primera central nuclear genera 7 puntos'),
  frase('La Empresa Nuclear Estatal tiene el know-how para participar activamente.', 'Los científicos del país pueden participar activamente desde el primer día.'),
  frase('Los ingenieros de Comisión de Energía Atómica e Empresa Nuclear Estatal tienen décadas de know-how acumulado', 'Los ingenieros y científicos del país ya tienen conocimiento acumulado'),
  // Evento 120: el accidente ocurre en un país vecino
  frase('Accidente Nuclear en Central Nuclear Norte: Nivel 5', 'Accidente Nuclear en un País Vecino: Nivel 5'),
  frase('Una falla en el sistema de refrigeración de la planta Central Nuclear II desencadenó', 'Una falla en el sistema de refrigeración de una central nuclear de un país vecino desencadenó'),
  frase('La zona de exclusión ya se amplió a 50 km, afectando a 2,1 millones de personas. El suministro eléctrico al Área Metropolitana cayó 35%.',
    'La zona de exclusión del país vecino ya se amplió a 50 km y el viento lleva la nube hacia la frontera. El suministro eléctrico regional, que depende de esa red, cayó 35%.'),
  frase('Los primeros indicios de contaminación radiológica se detectaron a 70 km.', 'Los primeros indicios de contaminación radiológica ya llegaron a la franja fronteriza.'),
  frase('focalizar todos los recursos en enfriar el reactor antes de tomar medidas', 'focalizar todos los recursos en coordinar con el país vecino y monitorear la radiación antes de tomar medidas'),
  // Lo que sobre, genérico y sin una comisión ni una empresa nuclear que el país no tiene
  [/\bLa Empresa Nuclear Estatal\b/g, 'El sector científico estatal'],
  [/\bla Empresa Nuclear Estatal\b/g, 'el sector científico estatal'],
  [/\bEmpresa Nuclear Estatal\b/g, 'sector científico estatal'],
  [/\b([Ll])a Comisión de Energía Atómica\b/g, '$1a investigación nuclear'],
  [/\bComisión de Energía Atómica\b/g, 'investigación nuclear'],
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
    ...NUCLEAR_A_FUTURO,
  ],
  cl: [
    [BANCO_CENTRAL, 'Banco Central de Chile'],
    [/\b[Ll]a Casa de Gobierno\b/g, 'La Moneda'],
    [/\bCasa de Gobierno\b/g, 'La Moneda'],
    [LA_CAPITAL, 'Santiago'],
    [PETROLERA, 'ENAP'],
    ...sinLegislativas('Municipales y Regionales', 'municipales y regionales', 'las principales alcaldías y gobiernos regionales'),
    ...NUCLEAR_A_FUTURO,
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
