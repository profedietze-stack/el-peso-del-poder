"use strict";

// ============================================================
// TOOLTIP SYSTEM — Glosario interactivo del juego
//
// Funciona con atributos HTML:
//   data-tip-key="ipc"     → busca en GLOSSARY y muestra modal rico
//   data-tip="texto libre" → muestra el texto directamente en el modal
//
// Uso desde JS:
//   showTip('ipc')               → abre por clave de glosario
//   showTipText('📈','Título','Cuerpo') → abre con contenido libre
//   closeTip()                   → cierra el modal
//   initTooltips()               → registra listener global (llamar 1 vez en main.js)
// ============================================================

// ── GLOSARIO ─────────────────────────────────────────────────
// Cada entrada tiene: icon, title, body, zona? (indicadores)

export const GLOSSARY = {

  // ── INDICADORES ───────────────────────────────────────────

  ipc: {
    icon:  '📈',
    title: 'IPC — Inflación',
    body:  'El <strong>Índice de Precios al Consumidor</strong> mide cuánto suben los precios de los productos y servicios mes a mes. Una inflación alta significa que el dinero pierde valor: con los mismos pesos comprás menos cada vez. Afecta especialmente a los sectores más vulnerables, que destinan casi todo su ingreso al consumo básico.',
    zona:  '🟢 Conviene tenerlo <strong>BAJO</strong> — si sube demasiado, la economía se desestabiliza.',
  },

  deuda: {
    icon:  '💸',
    title: 'Deuda Pública',
    body:  'Es el total del dinero que el Estado pidió prestado y todavía debe pagar. Incluye <strong>bonos soberanos</strong> vendidos a inversores, préstamos del FMI y de otros países. Tener mucha deuda obliga a destinar gran parte del presupuesto al pago de intereses, en vez de salud, educación o infraestructura.',
    zona:  '🟢 Conviene tenerla <strong>BAJA</strong> — deuda alta limita la inversión pública y eleva el riesgo país.',
  },

  reservas: {
    icon:  '🏦',
    title: 'Reservas Internacionales',
    body:  'Son los <strong>dólares y otras divisas</strong> que guarda el Banco Central. Funcionan como el "colchón" del país: permiten pagar importaciones, defender el valor del peso ante corridas cambiarias y dar señales de estabilidad a los mercados. Sin reservas, cualquier crisis externa puede desestabilizar toda la economía.',
    zona:  '🟢 Conviene tenerlas <strong>ALTAS</strong> — un nivel bajo genera pánico cambiario y pérdida de confianza.',
  },

  riesgo: {
    icon:  '⚠️',
    title: 'Riesgo País',
    body:  'Mide cuánto <strong>desconfían los inversores internacionales</strong> de la economía del país. Se expresa en "puntos básicos" (cada 100 pts = 1% de tasa extra). Un riesgo alto significa que nadie quiere prestar dinero, o solo lo hace a tasas muy elevadas, encareciendo toda la deuda futura.',
    zona:  '🟢 Conviene tenerlo <strong>BAJO</strong> — valores altos cierran el acceso al crédito externo.',
  },

  pobreza: {
    icon:  '🏚️',
    title: 'Índice de Pobreza',
    body:  'Porcentaje de la población que <strong>no puede cubrir sus necesidades básicas</strong>: alimentación, vivienda, salud y educación. Es el indicador con mayor impacto en la vida cotidiana de la gente y el más sensible políticamente. Una crisis de pobreza extrema puede generar estallidos sociales.',
    zona:  '🟢 Conviene tenerlo <strong>BAJO</strong> — si supera el límite crítico, el gobierno cae.',
  },

  desocupacion: {
    icon:  '👷',
    title: 'Tasa de Desocupación',
    body:  'Porcentaje de personas que <strong>buscan trabajo activamente pero no consiguen</strong>. El desempleo destruye el ingreso de las familias, aumenta la pobreza y genera conflicto social. Bajarlo requiere crecimiento económico sostenido y políticas activas de empleo.',
    zona:  '🟢 Conviene tenerla <strong>BAJA</strong> — desempleo alto alimenta la pobreza y erosiona la confianza.',
  },

  produccion: {
    icon:  '🏭',
    title: 'Producción Industrial',
    body:  'Mide el <strong>nivel de actividad económica</strong> del país: cuánto se fabrica, se exporta y se consume. Una economía productiva genera empleo de calidad, divisas por exportaciones y recursos fiscales para el Estado. Equivale aproximadamente al crecimiento del PBI.',
    zona:  '🟢 Conviene tenerla <strong>ALTA</strong> — una caída sostenida lleva a recesión y desempleo.',
  },

  confianza: {
    icon:  '🤝',
    title: 'Confianza en el Gobierno',
    body:  'Mide el <strong>apoyo ciudadano</strong> a tu gestión. Baja cuando hay escándalos, mala gestión o crisis económica; sube cuando la gente percibe mejoras reales. Es la variable más política del juego: si cae demasiado, el gobierno pierde legitimidad y no puede gobernar.',
    zona:  '🟢 Conviene tenerla <strong>ALTA</strong> — si llega a 0% el pueblo exige tu renuncia y perdés el juego.',
  },

  // ── CONCEPTOS ECONÓMICOS ──────────────────────────────────

  deficit: {
    icon:  '📉',
    title: 'Déficit Fiscal',
    body:  'Ocurre cuando el <strong>Estado gasta más de lo que recauda</strong> en impuestos. Para cubrirlo, el gobierno debe endeudarse (emitir bonos) o emitir dinero. El déficit sostenido en el tiempo puede generar inflación y desconfianza. Sin embargo, cierto déficit puede ser necesario para sostener la inversión pública en momentos de crisis.',
  },

  superavit: {
    icon:  '📈',
    title: 'Superávit Fiscal',
    body:  'El <strong>Estado recauda más de lo que gasta</strong>. Permite bajar la deuda, acumular reservas y dar señales de responsabilidad fiscal a los mercados. Es difícil de sostener porque implica recortar el gasto o subir impuestos, lo que puede tener costo político y social.',
  },

  paritarias: {
    icon:  '🤝',
    title: 'Paritarias',
    body:  '<strong>Negociaciones entre sindicatos y empleadores</strong> (a veces con participación del Estado) para fijar aumentos de salarios. Si los salarios suben por encima de la inflación, mejora el poder adquisitivo de los trabajadores. Pero si suben demasiado sin respaldo productivo, pueden retroalimentar la inflación.',
  },

  emision: {
    icon:  '🖨️',
    title: 'Emisión Monetaria',
    body:  'Cuando el <strong>Banco Central crea dinero nuevo</strong> para financiar al Estado. En el corto plazo puede cubrir el déficit sin recurrir a deuda. Pero si hay demasiado dinero circulando sin respaldo en la producción real, genera inflación: los precios suben para equilibrar la mayor cantidad de pesos.',
  },

  fmi: {
    icon:  '🌐',
    title: 'FMI — Fondo Monetario Internacional',
    body:  'Organismo internacional que <strong>presta dinero a países con crisis</strong> de deuda o balanza de pagos. Los préstamos vienen atados a condiciones: ajuste del gasto público, suba de tasas de interés, tipo de cambio flexible. Sus programas permiten estabilizar la economía pero suelen tener alto costo social en el corto plazo.',
  },

  default: {
    icon:  '🚨',
    title: 'Default — Cesación de Pagos',
    body:  'Cuando un <strong>país no puede pagar su deuda</strong>. Las consecuencias inmediatas son la pérdida de acceso al crédito internacional, caída del valor de la moneda, inflación acelerada y recesión profunda. Argentina atravesó defaults en 1989, 2001 y 2020, con impactos sociales devastadores.',
  },

  devaluacion: {
    icon:  '💱',
    title: 'Devaluación',
    body:  'Baja del <strong>valor de la moneda local respecto al dólar</strong> u otras divisas. Encarece las importaciones (puede acelerar la inflación) pero abarata las exportaciones (mejora la competitividad). Es una herramienta de política cambiaria con efectos dobles: puede ayudar a la economía real pero castiga a quienes tienen deudas en dólares.',
  },

  subsidios: {
    icon:  '💊',
    title: 'Subsidios',
    body:  'Cuando el <strong>Estado paga parte del costo</strong> de un servicio o producto para que llegue más barato a la gente. Los más comunes son a energía, transporte y alimentos. Reducen la pobreza y la inflación en el corto plazo, pero aumentan el gasto público y pueden generar déficit si no se financian correctamente.',
  },

  retenciones: {
    icon:  '🌾',
    title: 'Retenciones Agropecuarias',
    body:  '<strong>Impuestos a las exportaciones</strong> de productos del campo (soja, trigo, maíz, girasol). El Estado retiene un porcentaje de lo que los exportadores cobran en dólares. Son una fuente importante de ingresos fiscales pero muy resistidas por el sector agrario, que argumenta que reducen su rentabilidad.',
  },

  pbi: {
    icon:  '📊',
    title: 'PBI — Producto Bruto Interno',
    body:  'El <strong>valor total de todos los bienes y servicios</strong> producidos en el país durante un año. Es la medida más utilizada para calcular el tamaño de una economía y su ritmo de crecimiento. Si el PBI crece, en general mejoran el empleo y los ingresos. Si cae dos trimestres seguidos, se habla de recesión.',
  },

  ajuste: {
    icon:  '✂️',
    title: 'Ajuste Fiscal',
    body:  'Conjunto de medidas para <strong>reducir el déficit del Estado</strong>: recorte del gasto público, despidos en el sector estatal, quita de subsidios o suba de impuestos. Mejora las cuentas fiscales y la confianza de los mercados, pero suele aumentar la pobreza y el desempleo en el corto plazo.',
  },

  bonos: {
    icon:  '📜',
    title: 'Bonos Soberanos',
    body:  '<strong>Títulos de deuda</strong> que el Estado emite y vende a inversores (bancos, fondos de inversión, otros países). El inversor presta dinero hoy y recibe intereses durante años. Si el riesgo país es alto, los bonos se emiten con tasas de interés muy elevadas, encareciendo el costo del endeudamiento.',
  },

  bcra: {
    icon:  '🏛️',
    title: 'BCRA — Banco Central',
    body:  'El <strong>Banco Central de la República Argentina</strong> es la autoridad monetaria del país. Regula la cantidad de dinero en circulación, administra las reservas internacionales, fija la tasa de interés de referencia y controla el tipo de cambio. Su independencia (o falta de ella) es un tema central en el debate económico argentino.',
  },

  tipo_cambio: {
    icon:  '💲',
    title: 'Tipo de Cambio',
    body:  '<strong>Precio del dólar en pesos</strong>. Cuando el dólar sube, las importaciones se encarecen (presiona la inflación) pero las exportaciones se vuelven más competitivas. El Estado puede intervenir para mantenerlo estable (tipo de cambio fijo) o dejarlo fluctuar según el mercado (flotación).',
  },

  // ── MECÁNICAS DEL JUEGO ───────────────────────────────────

  herencia: {
    icon:  '🏛️',
    title: 'Herencia Política',
    body:  'El <strong>contexto económico que dejó el gobierno anterior</strong>. Podés recibir una economía estable y ordenada, una en recuperación gradual, o una en crisis profunda. Define los valores iniciales de todos tus indicadores y determina si empezás con ventaja o en modo de emergencia.',
  },

  mandato: {
    icon:  '📅',
    title: 'Mandato Presidencial',
    body:  'El <strong>período de 4 años</strong> que debés gestionar como presidente. Cada turno del juego representa un mes de gobierno. Tu objetivo es completar los 48 turnos sin que la confianza caiga a 0% o la pobreza llegue al límite crítico, tomando las mejores decisiones posibles en cada evento.',
  },

  pasivos: {
    icon:  '⚙️',
    title: 'Pasivos del Ministro',
    body:  '<strong>Cambios que el ministro aplica a los indicadores al inicio del juego</strong>, antes de que empiece el mandato. Representan el impacto de sus primeras medidas al asumir el cargo. Un valor positivo mejora ese indicador; uno negativo lo empeora. Son permanentes: forman la base de tu punto de partida.',
  },

  effectMods: {
    icon:  '⚡',
    title: 'Modificadores de Efectos',
    body:  '<strong>Multiplicadores que el ministro aplica durante toda la partida</strong> a las decisiones que involucran su área. Un mod <em>▼ IPC ×0.78</em> amortigua los shocks inflacionarios: todos los efectos sobre inflación se reducen un 22%. Un mod <em>▲ Producción ×1.22</em> amplifica las políticas productivas, para bien y para mal.',
  },

  credibilidad: {
    icon:  '⭐',
    title: 'Credibilidad del Asesor',
    body:  'Mide <strong>qué tan confiable es el consejo del ministro</strong> (0-5 estrellas). Un ministro con alta credibilidad casi siempre recomienda la mejor opción para su área. Uno con baja credibilidad puede equivocarse o darte consejos erróneos. Sube cuando seguís su consejo y el resultado es positivo para los indicadores de su cartera.',
  },

  dificultad: {
    icon:  '🎯',
    title: 'Dificultad del Juego',
    body:  'Define cuánto se amplifican los <strong>efectos de cada decisión</strong>. <em>Fácil</em> (×0.7) amortigua los golpes. <em>Normal</em> (×1.0) es el juego diseñado. <em>Difícil</em> (×1.3) penaliza cada error. <em>Ultra 💀</em> (×1.8) es casi imposible: eventos extremos frecuentes, arranque devastado, crises a cada paso.',
  },

  gabinete: {
    icon:  '🏛️',
    title: 'Gabinete de Ministros',
    body:  'El equipo de <strong>ministros que te acompañan durante tu presidencia</strong>. Cada ministro tiene un perfil ideológico que afecta cómo evolucionan los indicadores de su cartera, tanto al inicio (pasivos) como durante la partida (modificadores de efectos). Elegirlos bien es una decisión estratégica central.',
  },

  cartera: {
    icon:  '📁',
    title: 'Cartera Ministerial',
    body:  '<strong>Área de gobierno</strong> a cargo de un ministro. El juego tiene cuatro carteras: <em>Economía</em> (inflación, deuda, reservas, riesgo), <em>Desarrollo Social</em> (pobreza, desocupación, confianza), <em>Jefatura de Gabinete</em> (confianza, riesgo) y <em>Producción</em> (producción, reservas, desocupación).',
  },

  shock: {
    icon:  '⚡',
    title: 'Shock Económico',
    body:  'Un <strong>cambio brusco e inesperado</strong> en las condiciones económicas. Puede ser externo (suba del precio del petróleo, crisis global) o interno (corrida cambiaria, huelga general). Los shocks ponen a prueba la solidez de la economía y la capacidad de respuesta del gobierno.',
  },

  estanflacion: {
    icon:  '😰',
    title: 'Estanflación',
    body:  'La peor combinación económica: <strong>inflación alta + estancamiento económico</strong>. Ocurre cuando los precios suben pero la producción no crece (o cae). Es muy difícil de combatir porque las herramientas contra la inflación (suba de tasas, ajuste) tienden a agravar la recesión.',
  },

  recesion: {
    icon:  '📉',
    title: 'Recesión',
    body:  'Período de <strong>caída sostenida de la actividad económica</strong>. Técnicamente se define como dos trimestres consecutivos de caída del PBI. Genera desempleo, caída del consumo y menor recaudación fiscal. Suele ser consecuencia de políticas de ajuste o de crisis externas.',
  },
};

// ── MODAL HELPERS ─────────────────────────────────────────────

const _el = id => document.getElementById(id);

/**
 * Abre el modal con una entrada del glosario.
 * @param {string} key — clave en GLOSSARY
 */
export function showTip(key) {
  const entry = GLOSSARY[key];
  if (!entry) return;
  _openModal(entry.icon || 'ℹ️', entry.title, entry.body, entry.zona || '');
}

/**
 * Abre el modal con contenido libre (sin pasar por el glosario).
 * @param {string} icon
 * @param {string} title
 * @param {string} body
 * @param {string} [zona]
 */
export function showTipText(icon, title, body, zona = '') {
  _openModal(icon || 'ℹ️', title, body, zona);
}

/**
 * Cierra el modal de tooltip.
 */
export function closeTip() {
  const overlay = _el('ttip-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    // Pequeño delay para que la animación de salida se vea
    setTimeout(() => { overlay.style.display = 'none'; }, 220);
  }
}

function _openModal(icon, title, body, zona) {
  const overlay = _el('ttip-overlay');
  if (!overlay) return;

  // Rellenar contenido
  const iconEl  = _el('ttip-icon');
  const titleEl = _el('ttip-title');
  const bodyEl  = _el('ttip-body');
  const zonaEl  = _el('ttip-zona');

  if (iconEl)  iconEl.textContent  = icon;
  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.innerHTML    = body;
  if (zonaEl)  zonaEl.innerHTML    = zona || '';
  if (zonaEl)  zonaEl.style.display = zona ? '' : 'none';

  // Mostrar
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('open'));
}

// ── LISTENER GLOBAL ───────────────────────────────────────────

/**
 * Registra el listener delegado para `data-tip-key` y `data-tip`.
 * Llamar una sola vez desde main.js en el DOMContentLoaded.
 */
export function initTooltips() {
  document.addEventListener('click', e => {
    // Buscar el elemento con data-tip-key o data-tip más cercano
    const target = e.target.closest('[data-tip-key],[data-tip]');
    if (!target) return;

    e.stopPropagation();
    e.preventDefault();

    const key = target.dataset.tipKey;
    if (key && GLOSSARY[key]) {
      showTip(key);
      return;
    }

    // Fallback: data-tip como texto libre
    const text = target.dataset.tip;
    if (text) {
      // Si el texto es corto, crear modal minimalista
      _openModal('ℹ️', target.dataset.tipTitle || '', text, '');
    }
  });

  // Tecla Escape para cerrar
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTip();
  });
}

// ── HELPER DE ÍCONO ─────────────────────────────────────────
/**
 * Genera el HTML de un botón ⓘ para insertar junto a un término.
 * @param {string} key — clave del glosario
 * @param {string} [cls] — clase CSS extra
 * @returns {string} HTML del botón
 */
export function tipBtn(key, cls = '') {
  return `<button class="tip-btn ${cls}" data-tip-key="${key}" aria-label="Ver definición" type="button">ⓘ</button>`;
}
