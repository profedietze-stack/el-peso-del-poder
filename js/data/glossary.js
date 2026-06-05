"use strict";

// ============================================================
// GLOSARIO DE TÉRMINOS — Aplicado al texto de los eventos
//
// applyGlosario(text) escanea el texto y envuelve los términos
// conocidos en <strong class="tt-term"> con atributos para el
// sistema de tooltips modal (js/ui/tooltip.js).
//
// Si el término tiene clave en GLOSSARY de tooltip.js (campo `key`),
// se usa data-tip-key para mostrar la definición rica.
// Si no, se usa data-tip + data-tip-title con el texto corto.
// ============================================================

export const GLOSARIO = [
  // ── Términos con entrada rica en GLOSSARY de tooltip.js ──
  // (key coincide con una entrada de GLOSSARY → modal rico)
  { re:/\bIPC\b/g,                    key:'ipc',          tip:'Índice de Precios al Consumidor: mide cuánto suben los precios mes a mes.' },
  { re:/\bFMI\b/g,                    key:'fmi',          tip:'Fondo Monetario Internacional: organismo que presta dinero a países en crisis, generalmente a cambio de reformas económicas.' },
  { re:/\bBCRA\b/g,                   key:'bcra',         tip:'Banco Central de la República Argentina: regula la moneda, las reservas y el sistema financiero.' },
  { re:/\bPBI\b/g,                    key:'pbi',          tip:'Producto Bruto Interno: valor total de todo lo que produce un país en un año.' },
  { re:/\bPIB\b/g,                    key:'pbi',          tip:'Producto Interno Bruto: sinónimo de PBI. Mide el tamaño de la economía de un país.' },
  { re:/\bdefault\b/gi,               key:'default',      tip:'Situación en que un país declara que no puede pagar su deuda. Genera crisis de confianza y pérdida de acceso al crédito.' },
  { re:/\bdevaluaci[oó]n\b/gi,        key:'devaluacion',  tip:'Bajar el valor de la moneda local respecto al dólar. Encarece importaciones pero puede favorecer exportaciones.' },
  { re:/\bparitaria[s]?\b/gi,         key:'paritarias',   tip:'Negociación entre sindicatos y empleadores para fijar salarios, generalmente en relación a la inflación.' },
  { re:/\bretenci[oó]n(?:es)?\b/gi,   key:'retenciones',  tip:'Impuesto a las exportaciones agropecuarias. El Estado retiene parte de los dólares que entran por ventas al exterior.' },
  { re:/\bsubsidio[s]?\b/gi,          key:'subsidios',    tip:'Dinero que el Estado da para abaratar un servicio (ej. el boleto de colectivo o la luz).' },
  { re:/riesgo\s*pa[ií]s/gi,          key:'riesgo',       tip:'Indicador que mide cuánto desconfían los inversores internacionales de la economía del país.' },
  { re:/\bstand[\s-]?by\b/gi,         key:'fmi',          tip:'Tipo de acuerdo con el FMI que desembolsa dinero en cuotas a cambio de cumplir metas económicas.' },
  { re:/\bcepo\s*cambiario\b/gi,      key:'tipo_cambio',  tip:'Restricción del gobierno para comprar dólares. Limita la fuga de divisas pero puede generar mercado paralelo.' },
  { re:/\btipo\s*de\s*cambio\b/gi,    key:'tipo_cambio',  tip:'Precio del dólar en pesos. Su variación afecta la inflación, las exportaciones y la deuda.' },
  { re:/\bdficit\s*fiscal\b|d[eé]ficit/gi, key:'deficit', tip:'Cuando el Estado gasta más de lo que recauda. Requiere deuda o emisión para cubrirse.' },
  { re:/\bsuperávit|superavit\b/gi,   key:'superavit',    tip:'Cuando el Estado recauda más de lo que gasta. Permite bajar la deuda y acumular reservas.' },
  { re:/\bemisi[oó]n\s*monetaria\b/gi,key:'emision',      tip:'Cuando el Banco Central crea dinero nuevo para financiar al Estado. Puede generar inflación.' },
  { re:/\bswap\b/gi,                  key:'bcra',         tip:'Acuerdo entre bancos centrales para prestarse divisas mutuamente.' },
  { re:/\bajuste\s*fiscal\b/gi,       key:'ajuste',       tip:'Medidas para reducir el déficit: recorte del gasto, quita de subsidios o suba de impuestos.' },
  { re:/\bbonos?\s*soberano[s]?\b/gi, key:'bonos',        tip:'Títulos de deuda que el Estado emite y vende a inversores a cambio de intereses.' },
  { re:/\bestanflaci[oó]n\b/gi,       key:'estanflacion', tip:'Inflación alta + estancamiento económico. Una de las peores combinaciones posibles.' },
  { re:/\brecesi[oó]n\b/gi,           key:'recesion',     tip:'Caída sostenida de la actividad económica. Técnicamente: dos trimestres de caída del PBI.' },

  // ── Términos sin clave en GLOSSARY → modal con texto corto ──
  { re:/\bBID\b/g,            tip:'Banco Interamericano de Desarrollo: presta dinero a países de América Latina para proyectos de desarrollo.' },
  { re:/\bCIADI\b/g,          tip:'Centro Internacional de Arreglo de Diferencias relativas a Inversiones: tribunal donde empresas demandan a los Estados.' },
  { re:/\bOEA\b/g,            tip:'Organización de los Estados Americanos: foro político de los países del continente americano.' },
  { re:/\bONU\b/g,            tip:'Organización de las Naciones Unidas: organismo que promueve la paz y la cooperación global.' },
  { re:/\bOPS\b/g,            tip:'Organización Panamericana de la Salud: organismo de salud pública para América.' },
  { re:/\bOMS\b/g,            tip:'Organización Mundial de la Salud: coordina la respuesta sanitaria internacional.' },
  { re:/\bCONICET\b/g,        tip:'Consejo Nacional de Investigaciones Científicas y Técnicas: principal organismo de ciencia de Argentina.' },
  { re:/\bINCAA\b/g,          tip:'Instituto Nacional de Cine y Artes Audiovisuales: fomenta y financia el cine argentino.' },
  { re:/\bINDEC\b/g,          tip:'Instituto Nacional de Estadística y Censos: mide la inflación, la pobreza y el desempleo en Argentina.' },
  { re:/\bYPF\b/g,            tip:'Yacimientos Petrolíferos Fiscales: empresa estatal argentina de petróleo y gas.' },
  { re:/\bAFI\b/g,            tip:'Agencia Federal de Inteligencia: servicio de inteligencia del Estado argentino.' },
  { re:/\bANSES\b/g,          tip:'Administración Nacional de la Seguridad Social: paga jubilaciones, pensiones y beneficios sociales.' },
  { re:/\bCNEA\b/g,           tip:'Comisión Nacional de Energía Atómica: desarrolla tecnología nuclear en Argentina.' },
  { re:/\bCER\b/g,            tip:'Coeficiente de Estabilización de Referencia: índice que ajusta deudas y contratos según la inflación oficial.' },
  { re:/\bGNL\b/g,            tip:'Gas Natural Licuado: gas enfriado hasta estado líquido para transportarlo en barcos.' },
  { re:/\bOGM\b/g,            tip:'Organismo Genéticamente Modificado: ser vivo al que se le alteró el ADN en laboratorio para darle nuevas características.' },
  { re:/\bTLC[s]?\b/g,        tip:'Tratado(s) de Libre Comercio: acuerdos entre países para eliminar aranceles al comercio.' },
  { re:/\bBRICS\b/g,          tip:'Bloque de países emergentes: Brasil, Rusia, India, China, Sudáfrica y otros. Alternativa al eje occidental.' },
  { re:/\bOTAN\b/g,           tip:'Organización del Tratado del Atlántico Norte: alianza militar liderada por Estados Unidos y países europeos.' },
  { re:/\bPPP\b/g,            tip:'Participación Público-Privada: modelo donde el Estado y empresas privadas comparten la gestión de servicios.' },
  { re:/\bESI\b/g,            tip:'Educación Sexual Integral: programa educativo que aborda la sexualidad desde una perspectiva de derechos y salud.' },
  { re:/\bIA\b/g,             tip:'Inteligencia Artificial: capacidad de las computadoras para simular razonamiento y tomar decisiones.' },
  { re:/\bhiperinflaci[oó]n\b/gi, tip:'Inflación extrema y descontrolada (miles de % al año). Argentina la vivió en 1989.' },
  { re:/\bcorrida\s*cambiaria\b/gi, tip:'Cuando muchas personas compran dólares al mismo tiempo, agotando las reservas del Banco Central.' },
  { re:/\bransomware\b/gi,     tip:'Tipo de virus que bloquea sistemas informáticos y pide dinero para liberarlos.' },
  { re:/\blawfare\b/gi,        tip:'Uso del sistema judicial como arma política para perseguir opositores. Término muy debatido.' },
  { re:/\bunif[oi]caci[oó]n\s*cambiaria\b/gi, tip:'Eliminar los distintos tipos de cambio oficiales y unificarlos en uno solo.' },
  { re:/\bglifosat[oa]\b/gi,   tip:'Herbicida muy usado en cultivos de soja. Hay debate científico sobre sus efectos en la salud.' },
  { re:/\btrade[\s-]?off[s]?\b/gi, tip:'Dilema: para ganar algo en un área hay que ceder en otra. Ej.: bajar inflación puede subir el desempleo.' },
  { re:/\bautomatizaci[oó]n\b/gi, tip:'Reemplazo de trabajo humano por máquinas o algoritmos. Transforma sectores del mercado laboral.' },
  { re:/\bcriptomoneda[s]?\b/gi, tip:'Moneda digital descentralizada (ej: Bitcoin). No depende de un banco central y sus precios son muy volátiles.' },
  { re:/\beconom[ií]a\s*circular\b/gi, tip:'Modelo donde los residuos de un proceso se convierten en insumos de otro, reduciendo el desperdicio.' },
  { re:/\beconom[ií]a\s*del\s*cuidado\b/gi, tip:'Trabajo no remunerado (mayormente femenino) de crianza y cuidado que sostiene el sistema productivo.' },
  { re:/\bactuarios?\b/gi,    tip:'Especialistas que calculan proyecciones financieras y de riesgo a largo plazo, especialmente en jubilaciones.' },
  { re:/\bCOFEMA\b/g,         tip:'Consejo Federal de Medio Ambiente: coordina la política ambiental entre la Nación y las provincias.' },
  { re:/\bCONVEMAR\b/g,       tip:'Convención de las Naciones Unidas sobre el Derecho del Mar: regula el uso de los océanos y sus recursos.' },
  { re:/\bPPP\b/g,            tip:'Participación Público-Privada: el Estado y empresas privadas comparten la gestión de servicios o infraestructura.' },
];

/**
 * Procesa el texto de un evento e inserta marcas interactivas en los
 * términos técnicos del glosario. Devuelve HTML seguro.
 *
 * - Si el término tiene `key` (entrada en GLOSSARY de tooltip.js):
 *     → data-tip-key="key"  → modal rico con título + cuerpo + zona
 * - Si no tiene `key`:
 *     → data-tip="texto" + data-tip-title="TERM" → modal con título del término
 *
 * El CSS de .tt-term ya destaca visualmente el término (subrayado dorado).
 *
 * @param {string} text — texto plano del evento
 * @returns {string} HTML con términos marcados
 */
export function applyGlosario(text) {
  // Escapar HTML base para evitar XSS
  let html = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const usados = new Set();

  GLOSARIO.forEach(({ re, key, tip }) => {
    let firstDone = false;
    html = html.replace(re, match => {
      // Solo marcar la primera aparición de cada término
      if (firstDone || usados.has(match.toLowerCase())) return match;
      firstDone = true;
      usados.add(match.toLowerCase());

      if (key) {
        // Término con entrada rica → usa data-tip-key para el modal completo
        return `<strong class="tt-term tt-rich" data-tip-key="${key}">${match}</strong>`;
      } else {
        // Término sin clave → texto corto, con el término como título
        const safeTitle = match.replace(/"/g, '&quot;');
        const safeTip   = tip.replace(/"/g, '&quot;');
        return `<strong class="tt-term" data-tip="${safeTip}" data-tip-title="${safeTitle}">${match}</strong>`;
      }
    });
  });

  return html;
}
