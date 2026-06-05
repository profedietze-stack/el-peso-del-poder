"use strict";

import { CONFIG, IND_META }              from '../config.js';
import { getZone }                        from '../engine/scoring.js';
import { getMinisterById, MINISTER_SLOTS } from '../data/ministers.js';
import { getVPById }                      from '../data/vicepresident.js';
import { soundAdvisor }                   from '../audio.js';

// ============================================================
// SISTEMA DE ASESORES / GABINETE
//
// Los asesores son los propios ministros elegidos en la pantalla
// de gabinete. Cada uno tiene:
//   - Su perfil ideológico (adviceFocus, adviceStyle del ministro)
//   - Credibilidad dinámica (0-5), inicializada en newState()
//   - Un turno de uso por consulta (usedThisTurn)
//
// El análisis que genera cada ministro está sesgado por su perfil:
//   Dra. Paz (ortodoxa) siempre mirará IPC y deuda primero.
//   Dr. Medina (heterodoxo) priorizará producción y confianza.
// ============================================================

// Mapa de indicadores "buenos cuando suben"
const LOW_BAD_SET = new Set(['reservas','produccion','confianza']);

// ============================================================
// SISTEMA DE TEXTOS CONTEXTUALES
//
// Cada asesor tiene frases según:
//   · Severidad: 'normal' | 'alerta' | 'crisis'
//   · Alertas específicas por indicador en riesgo
//   · Cierres según nivel de credibilidad
// ============================================================

// ── Frases de apertura por ministro y severidad ───────────────
// Cada array tiene 3+ variantes. Se elige con (turno % largo) para
// que rote turno a turno sin ser aleatoria e inconsistente.

const _OPEN = {
  ortodoxa: {
    normal: [
      'Los fundamentos macro están controlados.',
      'El equilibrio fiscal se sostiene. Hay margen.',
      'Los mercados reaccionan bien a nuestra gestión.',
    ],
    alerta: [
      'Hay señales que no podemos ignorar desde el lado fiscal.',
      'Los mercados nos están mirando con lupa. Hay que actuar.',
      'Si no intervenimos ahora, el mercado nos va a forzar la mano.',
    ],
    crisis: [
      'Esto es exactamente lo que pasa cuando se pierde la disciplina fiscal.',
      'Necesitamos medidas de shock o perdemos la confianza del mercado.',
      'La situación es crítica — cada día que pasa nos cuesta más caro.',
    ],
  },
  heterodoxa: {
    normal: [
      'La economía real está en movimiento. Hay que sostenerla.',
      'Los indicadores productivos muestran un camino sano.',
      'La demanda interna está respondiendo bien.',
    ],
    alerta: [
      'El sector productivo empieza a sentir el freno. Hay que actuar.',
      'Si no sostenemos el empleo y la actividad, los otros números se caen solos.',
      'Antes de hablar de ajuste, hay que ver qué le pasa a la economía real.',
    ],
    crisis: [
      'El colapso productivo no se soluciona con más ajuste — se agrava.',
      'Millones de familias sienten esto en el bolsillo, no solo los mercados.',
      'Esto requiere una respuesta del Estado. Esperar al mercado es un lujo que no tenemos.',
    ],
  },
  tecnocrata_eco: {
    normal: [
      'Los modelos muestran estabilidad en el corto plazo.',
      'Los indicadores están dentro de los rangos proyectados.',
      'No hay señales sistémicas de alarma por ahora.',
    ],
    alerta: [
      'Los modelos proyectan deterioro si no ajustamos los parámetros.',
      'Los datos sugieren una ventana que se está cerrando.',
      'La correlación entre estas variables me preocupa técnicamente.',
    ],
    crisis: [
      'Los modelos lo anticipaban. Ahora el margen es mínimo.',
      'Esto está fuera de todos los rangos normales. Es una emergencia técnica.',
      'Los números no mienten: necesitamos intervención inmediata.',
    ],
  },
  asistencial: {
    normal: [
      'Las personas más vulnerables están relativamente protegidas hoy.',
      'Los indicadores sociales muestran cierta estabilidad.',
      'El tejido social aguanta por ahora, pero hay que estar atentos.',
    ],
    alerta: [
      'Las familias en situación de pobreza no pueden esperar más.',
      'Cada punto que sube la desocupación es una persona que pierde dignidad.',
      'Las señales de deterioro social están ahí — no podemos mirar para otro lado.',
    ],
    crisis: [
      'Esto ya es una emergencia social. La gente no puede esperar análisis técnicos.',
      'No hay recuperación sostenible con este nivel de exclusión.',
      'Mientras debatimos números, hay familias que no comen. Hay que actuar YA.',
    ],
  },
  laboral: {
    normal: [
      'Los trabajadores están relativamente bien. El equilibrio laboral se sostiene.',
      'Las relaciones laborales están en calma. Hay que aprovechar el momento.',
      'El movimiento sindical está monitoreando, pero sin alarma.',
    ],
    alerta: [
      'Los trabajadores ya sienten la presión — esto no es abstracto.',
      'Los gremios me están llamando. El malestar laboral es real y crece.',
      'No se puede pedir más sacrificio al sector trabajador sin contrapartida.',
    ],
    crisis: [
      'Los trabajadores ya están en la calle — esto no puede seguir así.',
      'El movimiento obrero no va a tolerar esta situación mucho más tiempo.',
      'Esto ya es un conflicto laboral declarado, no solo un número de desocupación.',
    ],
  },
  focalizada: {
    normal: [
      'Los programas sociales focalizados están cumpliendo su rol.',
      'El gasto social está llegando donde tiene que llegar.',
      'Los indicadores de pobreza muestran una situación manejable.',
    ],
    alerta: [
      'Los programas actuales no alcanzan — hay que ampliar la cobertura.',
      'Estamos viendo filtraciones: hay personas que caen y no son contenidas.',
      'La pobreza tiene inercia: si no actuamos hoy, mañana es más difícil.',
    ],
    crisis: [
      'Los números de pobreza ya son inmanejables con los instrumentos actuales.',
      'Se rompió el piso de contención social. Necesitamos respuesta de emergencia.',
      'Los planes focalizados son insuficientes — hay que desplegar la red de emergencia.',
    ],
  },
  dialoguista: {
    normal: [
      'El clima político está tranquilo. Buen momento para consolidar alianzas.',
      'La gobernabilidad está asegurada. Podemos decidir con respaldo.',
      'La oposición está en modo constructivo — hay ventana de diálogo.',
    ],
    alerta: [
      'El ruido político empieza a interferir con la gestión.',
      'Hay tensiones que pueden escalar si no se contienen a tiempo.',
      'Necesitamos construir consenso antes de que se polarice más.',
    ],
    crisis: [
      'La gobernabilidad está en riesgo — esto es lo más urgente ahora.',
      'Sin diálogo no hay salida. Hay que tender puentes, aunque duela.',
      'La crisis política puede comerse cualquier avance económico. Primero hay que estabilizar.',
    ],
  },
  confrontacional: {
    normal: [
      'La oposición está quieta — es el momento de avanzar fuerte.',
      'Tenemos iniciativa política. No la desperdiciemos siendo tibios.',
      'El momento es favorable. Hay que ser audaces.',
    ],
    alerta: [
      'Los poderes concentrados están aprovechando la debilidad para presionar.',
      'Hay que mostrar fuerza o nos van a pasar por encima.',
      'El que duda en política pierde. Hay que tomar posición.',
    ],
    crisis: [
      'Nos están atacando por todos lados — hay que contraatacar.',
      'Esto es una operación coordinada contra nuestro gobierno. No hay que ceder.',
      'El establishment no va a aflojar por las buenas. Hay que confrontar.',
    ],
  },
  tecnocrata_gab: {
    normal: [
      'Los mecanismos institucionales están funcionando correctamente.',
      'La administración pública está procesando bien los desafíos.',
      'El marco normativo nos da las herramientas para esta situación.',
    ],
    alerta: [
      'Las instituciones están bajo presión — hay que reforzar los procedimientos.',
      'El riesgo institucional está creciendo y puede afectar la gobernabilidad.',
      'Hay que respetar los mecanismos formales, aunque sean lentos.',
    ],
    crisis: [
      'La institucionalidad está en tensión — esto compromete la legitimidad.',
      'Estamos al borde de una crisis de gobernanza. El marco legal importa.',
      'Si saltamos los procedimientos en la emergencia, pagamos un costo institucional muy alto.',
    ],
  },
  industrialista: {
    normal: [
      'El sector industrial está respondiendo bien.',
      'La capacidad productiva está siendo bien utilizada.',
      'La cadena de valor industrial funciona con buena fluidez.',
    ],
    alerta: [
      'La industria empieza a sentir el freno — hay que sostener la demanda.',
      'Si no protegemos el tejido industrial ahora, tarda años en recuperarse.',
      'Los inversores necesitan señales claras para no parar.',
    ],
    crisis: [
      'La planta productiva se está desmantelando. Eso no se recupera rápido.',
      'El colapso industrial tiene consecuencias que van mucho más allá del número.',
      'Esto es una desindustrialización en tiempo real. Hay que detenerla.',
    ],
  },
  agroexportador: {
    normal: [
      'El sector agropecuario está generando divisas de forma sostenida.',
      'Las exportaciones van bien — hay que capitalizar este momento.',
      'El campo está produciendo. Hay que darle estabilidad para que siga.',
    ],
    alerta: [
      'Las exportaciones están cayendo — eso se va a sentir en las reservas.',
      'El campo necesita previsibilidad. La incertidumbre frena la inversión.',
      'Si perdemos competitividad exportadora, perdemos el motor de divisas.',
    ],
    crisis: [
      'Las reservas se agotan porque no entran divisas del campo.',
      'El sector agroexportador está paralizado — esto es una emergencia de divisas.',
      'Sin exportaciones no hay reservas y sin reservas no hay nada.',
    ],
  },
  innovacion: {
    normal: [
      'El ecosistema de innovación está creciendo. Buenas señales.',
      'La economía del conocimiento gana peso — hay que sostener ese camino.',
      'Las empresas tecnológicas están invirtiendo. Momento para consolidar.',
    ],
    alerta: [
      'La incertidumbre frena la inversión en tecnología e innovación.',
      'Si perdemos talento por la inestabilidad, tardamos una década en recuperar.',
      'La economía digital necesita reglas claras para seguir creciendo.',
    ],
    crisis: [
      'La fuga de talento ya es un problema serio — hay que contenerla.',
      'Las startups y PyMEs tecnológicas no sobreviven este nivel de crisis.',
      'Si no protegemos el ecosistema de innovación ahora, volvemos décadas atrás.',
    ],
  },
  // Vicepresidentes
  'vp-moreno': {
    normal: [
      'Como vicepresidenta, mi mirada siempre empieza por la gente.',
      'Los indicadores sociales muestran un equilibrio que hay que mantener.',
      'El bienestar de los más vulnerables es nuestra brújula principal.',
    ],
    alerta: [
      'Desde mi rol, tengo que decirte: la situación social no da para esperar.',
      'Las familias que menos tienen son las que más sienten esto. Hay que actuar.',
      'El capital político se gasta rápido cuando la gente sufre.',
    ],
    crisis: [
      'Esto es una emergencia social. Como vice, te lo digo con toda claridad.',
      'No hay legitimidad posible si no protegemos a los más vulnerables.',
      'Hay que actuar ahora — después viene el debate técnico.',
    ],
  },
  'vp-fuentes': {
    normal: [
      'Los fundamentos están sólidos. Momento para consolidar la disciplina.',
      'La situación fiscal es manejable. Hay que aprovecharlo.',
      'Los mercados internacionales nos ven con relativa estabilidad.',
    ],
    alerta: [
      'Como vicepresidente, tengo que advertirte: esto puede escalar rápido.',
      'Los mercados no perdonan la indecisión. Hay que mandar señales claras.',
      'El margen se está achicando. Una decisión equivocada ahora cuesta mucho.',
    ],
    crisis: [
      'Esto es exactamente lo que pasa cuando no se mantiene la disciplina. Sin excepciones.',
      'Necesitamos medidas drásticas o el acceso al crédito se cierra definitivamente.',
      'No hay solución cómoda. Hay que hacer lo que hay que hacer.',
    ],
  },
  'vp-castillo': {
    normal: [
      'Los datos productivos son positivos. Hay que potenciarlos.',
      'La capacidad industrial está siendo bien aprovechada.',
      'Los números muestran que vamos en la dirección correcta.',
    ],
    alerta: [
      'Como vicepresidenta, veo señales técnicas que me preocupan.',
      'El sector productivo necesita certidumbre — la incertidumbre es el peor enemigo.',
      'Si los indicadores de producción siguen así, el impacto en empleo será inevitable.',
    ],
    crisis: [
      'Los datos son contundentes: esto es una crisis productiva real.',
      'No podemos administrar una crisis con instrumentos diseñados para tiempos normales.',
      'Necesitamos un plan de emergencia industrial. El diagnóstico ya lo tenemos.',
    ],
  },
  'vp-vargas': {
    normal: [
      'El clima político está estable. Hay espacio para gobernar.',
      'Las negociaciones en curso muestran que el diálogo funciona.',
      'Como vicepresidente, valoro el tono constructivo que se mantiene.',
    ],
    alerta: [
      'Como vice, mi lectura política es que hay tensiones que van a escalar.',
      'Hay actores que están esperando el momento para presionar. Cuidado.',
      'Necesitamos tender puentes antes de que se quemen.',
    ],
    crisis: [
      'Esto ya es una crisis política y de confianza. Hay que actuar en ese plano.',
      'La gobernabilidad no se restaura solo con medidas técnicas. Necesitamos diálogo.',
      'Como vicepresidente, te digo: hay que hacer concesiones políticas para estabilizar.',
    ],
  },
};

// ── Alertas específicas por indicador y perfil del ministro ───
// Cuando un indicador del adviceFocus está en zona warn o danger.

const _IND_ALERT = {
  // Por indicador → objeto con frases por tipo de ministro
  ipc: {
    fiscal:     'La inflación en este nivel destruye el ahorro y aleja las inversiones.',
    social:     'La inflación es el impuesto más cruel — la pagan siempre los que menos tienen.',
    productivo: 'Con esta inflación, los costos industriales son imposibles de proyectar.',
    politico:   'La inflación le quema la imagen a cualquier gobierno. Es urgente.',
    default:    'La inflación en este nivel es un problema que se retroalimenta solo.',
  },
  deuda: {
    fiscal:     'El nivel de deuda nos estrangula — cada punto de interés es plata que no va a servicios.',
    social:     'La deuda nos ata las manos para hacer política social. Eso tiene un costo humano enorme.',
    productivo: 'Con este nivel de deuda, el crédito productivo escasea y se encarece.',
    politico:   'La deuda externa siempre vuelve como condicionante político en el peor momento.',
    default:    'El nivel de endeudamiento nos deja sin margen de maniobra.',
  },
  reservas: {
    fiscal:     'Sin reservas no podemos defender el tipo de cambio. Es la línea roja.',
    social:     'Las reservas bajas generan volatilidad que impacta directo en los precios y en la gente.',
    productivo: 'Sin reservas no hay importaciones, y sin importaciones la producción se para.',
    politico:   'Las reservas bajas son munición para la oposición y para los especuladores.',
    default:    'Las reservas en este nivel nos dejan muy expuestos ante cualquier shock externo.',
  },
  riesgo: {
    fiscal:     'Este riesgo país nos cierra el acceso al financiamiento internacional.',
    social:     'El riesgo país alto encarece todo — y eso termina siendo más inflación para la gente.',
    productivo: 'Con este riesgo, ningún inversor externo pone un peso en el sector productivo.',
    politico:   'El riesgo país refleja desconfianza en la institucionalidad. Hay que revertirlo.',
    default:    'Este nivel de riesgo nos aisla del mercado financiero global.',
  },
  pobreza: {
    fiscal:     'La pobreza tiene costos fiscales de largo plazo que superan cualquier ahorro de corto.',
    social:     'Estos números de pobreza son inaceptables en una sociedad que se precie de justa.',
    productivo: 'La pobreza destruye capital humano y mercado interno a la vez.',
    politico:   'Con estos niveles de pobreza, la legitimidad de cualquier gobierno está en juego.',
    default:    'Estos índices de pobreza indican que el modelo no está funcionando para todos.',
  },
  desocupacion: {
    fiscal:     'El desempleo alto aumenta el gasto social y reduce la recaudación. Es un círculo vicioso.',
    social:     'Cada punto de desempleo representa familias reales sin ingresos. No es solo estadística.',
    productivo: 'La desocupación alta indica que la economía está utilizando mal sus recursos.',
    politico:   'El desempleo es el termómetro político más sensible. La gente lo vive en carne propia.',
    default:    'La tasa de desocupación en este nivel genera tensión social que escala.',
  },
  produccion: {
    fiscal:     'La caída productiva reduce la base tributaria — sin producción no hay recaudación.',
    social:     'Sin producción no hay empleo, y sin empleo no hay bienestar. Es la cadena completa.',
    productivo: 'Esto es una señal de alarma. La capacidad productiva no se reconstruye de un día para otro.',
    politico:   'La caída productiva se siente en el empleo y en las calles. Tiene consecuencias políticas directas.',
    default:    'La producción en caída arrastra empleo, ingresos y confianza.',
  },
  confianza: {
    fiscal:     'Sin confianza ciudadana, cualquier política económica pierde efectividad.',
    social:     'La confianza es el activo político más valioso y el más difícil de recuperar.',
    productivo: 'La desconfianza frena la inversión y el consumo. Tiene impacto económico concreto.',
    politico:   'La confianza en el gobierno es el oxígeno de la gobernabilidad. Sin ella, todo cuesta más.',
    default:    'Con estos niveles de confianza, cualquier decisión es más difícil de implementar.',
  },
};

// ── Cierres de recomendación por credibilidad ─────────────────
const _CLOSE = {
  alta:     [
    'Analizando las opciones, <strong>"{opt}"</strong> es la que mejor responde al desafío actual.',
    'Con toda la información disponible, recomiendo <strong>"{opt}"</strong> — es la más sólida.',
    'Mi evaluación es clara: <strong>"{opt}"</strong> es la opción correcta aquí.',
  ],
  media:    [
    'Con las variables actuales, me inclino por <strong>"{opt}"</strong>.',
    'Aunque hay incertidumbre, <strong>"{opt}"</strong> parece el camino más razonable.',
    'Mi lectura del contexto me lleva a recomendar <strong>"{opt}"</strong>.',
  ],
  baja:     [
    'No tengo total certeza, pero me inclino por <strong>"{opt}"</strong>.',
    'Con las reservas del caso, creo que <strong>"{opt}"</strong> podría ser la mejor opción.',
    'Es difícil de anticipar, pero <strong>"{opt}"</strong> me parece lo más conveniente.',
  ],
};

// ── Helper: categoría ideológica de un ministro ───────────────
function _ideologyGroup(ministerId) {
  if (['ortodoxa', 'vp-fuentes'].includes(ministerId))            return 'fiscal';
  if (['asistencial', 'focalizada', 'laboral', 'vp-moreno'].includes(ministerId)) return 'social';
  if (['industrialista', 'agroexportador', 'innovacion', 'vp-castillo', 'heterodoxa'].includes(ministerId)) return 'productivo';
  if (['dialoguista', 'confrontacional', 'tecnocrata_gab', 'vp-vargas'].includes(ministerId)) return 'politico';
  return 'default';
}

// ── Selector determinista: varía por turno, estable por ministro ─
function _pick(arr, turn, ministerId) {
  const offset = ministerId ? (ministerId.charCodeAt(0) + ministerId.charCodeAt(ministerId.length - 1)) : 0;
  return arr[(turn + offset) % arr.length];
}

/**
 * Construye el texto contextual del consejo del ministro.
 */
function _buildContextualText(minister, ind, atRisk, opciones, recommendedIndex, credLevel, turn) {
  const id       = minister.id;
  const focus    = minister.adviceFocus;
  const group    = _ideologyGroup(id);

  // 1. Severidad según indicadores del foco en riesgo
  const dangerCount = focus.filter(k => ind[k] !== undefined && getZone(k, ind[k]) === 'danger').length;
  const warnCount   = focus.filter(k => ind[k] !== undefined && getZone(k, ind[k]) === 'warn').length;
  const severity    = dangerCount > 0 ? 'crisis' : warnCount > 0 ? 'alerta' : 'normal';

  // 2. Opening
  const openPool = (_OPEN[id] || _OPEN['ortodoxa'])[severity];
  const opening  = _pick(openPool, turn, id);

  // 3. Alerta de indicador específico (el más grave del foco)
  let alertText = '';
  if (atRisk.length > 0) {
    // Tomar el indicador más grave (danger > warn) dentro del foco
    const worstKey = focus.find(k => getZone(k, ind[k]) === 'danger')
                  || focus.find(k => getZone(k, ind[k]) === 'warn');
    if (worstKey && _IND_ALERT[worstKey]) {
      const variants = _IND_ALERT[worstKey];
      alertText = ' ' + (variants[group] || variants.default);
    }
  }

  // 4. Cierre según credibilidad
  const credKey  = credLevel >= 4 ? 'alta' : credLevel >= 2 ? 'media' : 'baja';
  const optTexto = opciones[recommendedIndex]?.texto || '';
  const optLabel = optTexto.split(':')[0].trim() || optTexto.substring(0, 40);
  const closePool = _CLOSE[credKey];
  const closing   = _pick(closePool, turn, id).replace('{opt}', optLabel);

  return `${opening}${alertText} ${closing}`;
}

// Nombres legibles para indicadores (para el texto del análisis)
const IND_NAME = Object.fromEntries(IND_META.map(m => [m.key, m.name]));

// ── HELPER: obtener datos del ministro desde el estado ────────

/**
 * Devuelve los datos del ministro que ocupa un slot en la partida actual.
 * @param {string} slotId   — 'economia' | 'social' | 'gabinete' | 'produccion'
 * @param {object} state    — estado del juego (contiene state.ministers)
 * @returns {object|null}
 */
function _ministerOf(slotId, state) {
  if (slotId === 'vp') {
    const vpId = state.identity?.vpId;
    return vpId ? getVPById(vpId) : null;
  }
  const ministerId = state.ministers?.[slotId];
  return ministerId ? getMinisterById(ministerId) : null;
}

/**
 * Devuelve el emoji de la cartera para fallback de avatar.
 * @param {string} slotId
 * @returns {string}
 */
function _slotEmoji(slotId) {
  const slot = MINISTER_SLOTS.find(s => s.id === slotId);
  return slot ? slot.label.split(' ')[0] : '🏛️';
}

// ── ANÁLISIS ──────────────────────────────────────────────────

/**
 * Genera el análisis contextual de un ministro para el evento actual.
 * El análisis está sesgado por el perfil del ministro (adviceFocus)
 * y modulado por su credibilidad (baja credibilidad → puede errar).
 *
 * @param {string} slotId   — slot de la cartera consultada
 * @param {object} event    — evento actual del juego
 * @param {object} state    — estado del juego
 * @returns {{ text, recommendedIndex, confidence, credLevel, minister }}
 */
export function getAdvisorAnalysis(slotId, event, state) {
  const minister = _ministerOf(slotId, state);
  if (!minister) return null;

  const opciones = event.opciones;
  const ind      = state.indicadores;
  const focus    = minister.adviceFocus;  // indicadores que el ministro prioriza

  // ── Puntuar cada opción desde la perspectiva del ministro ──
  const scores = opciones.map(opt => {
    const ef = opt.efectos || {};
    return focus.reduce((sum, key) => {
      const delta    = ef[key] || 0;
      const isBetter = LOW_BAD_SET.has(key) ? delta > 0 : delta < 0;
      return sum + (isBetter ? Math.abs(delta) : -Math.abs(delta) * 0.5);
    }, 0);
  });

  const bestIdx = scores.indexOf(Math.max(...scores));

  // ── Credibilidad → puede errar si es baja ─────────────────
  const credLevel = state.advisors[slotId]?.credibility ?? 3;
  const maxCred   = 5;
  const credPct   = credLevel / maxCred;

  let recommendedIndex = bestIdx;
  if (credPct < 0.4 && Math.random() > credPct + 0.3) {
    const wrongOptions = opciones.map((_, i) => i).filter(i => i !== bestIdx);
    if (wrongOptions.length > 0) {
      recommendedIndex = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    }
  }

  // ── Contexto: indicadores del área en zona de riesgo ──────
  const atRisk = focus.filter(k => ind[k] !== undefined && getZone(k, ind[k]) !== 'safe');

  // ── Confianza para el badge del modal ─────────────────────
  const confidence = credLevel >= 4 ? 'Alta confianza'
                   : credLevel >= 2 ? 'Confianza moderada'
                   : 'Opinión incierta';

  // ── Texto contextual dinámico ─────────────────────────────
  // Varía según severidad de la situación, indicadores en riesgo,
  // ideología del ministro y nivel de credibilidad.
  const text = _buildContextualText(
    minister, ind, atRisk, opciones, recommendedIndex, credLevel, state.turn
  );

  return {
    text,
    recommendedIndex,
    confidence,
    credLevel,
    minister,
  };
}

// ── CREDIBILIDAD ──────────────────────────────────────────────

/**
 * Actualiza la credibilidad de un ministro tras una decisión.
 * Solo sube si el jugador siguió su consejo Y el resultado fue positivo.
 *
 * @param {string} slotId          — cartera del asesor consultado
 * @param {number} chosenIndex     — opción elegida por el jugador
 * @param {number} recommendedIdx  — opción recomendada por el asesor
 * @param {object} efectosElegidos — efectos de la opción elegida
 * @param {object} state           — estado del juego (mutable)
 */
export function updateAdvisorCredibility(slotId, chosenIndex, recommendedIdx, efectosElegidos, state) {
  if (!state.advisors[slotId]) return;

  const minister  = _ministerOf(slotId, state);
  const focus     = minister?.adviceFocus || [];
  const followed  = chosenIndex === recommendedIdx;

  // Evaluar resultado neto en los indicadores del área del ministro
  const netEffect = focus.reduce((sum, key) => {
    const delta = efectosElegidos[key] || 0;
    return sum + (LOW_BAD_SET.has(key) ? delta : -delta);
  }, 0);

  let credDelta = 0;
  if (followed) {
    if (netEffect > 0)  credDelta = +1;  // consejo correcto y el jugador lo siguió
    if (netEffect < -5) credDelta = -1;  // consejo malo
  }

  const adv = state.advisors[slotId];
  adv.credibility = Math.max(0, Math.min(5, adv.credibility + credDelta));
  if (slotId === 'vp') {
    adv.usedCount = (adv.usedCount || 0) + 1;  // VP: incrementa contador (máx 2)
  } else {
    adv.usedThisTurn = true;
  }
  state.adata.advisorUsed++;
}

// ============================================================
// SISTEMA DE URGENCIA DE ASESORES
//
// Niveles:
//   0 — Normal (ningún indicador del foco en riesgo)
//   1 — Importante: ≥1 indicador en zona warn → borde dorado pulsante
//   2 — Urgente: ≥1 indicador en zona danger → borde rojo pulsante
//   3 — Crítico: ≥2 en danger O cerca del game-over → modal de reunión
//
// Los niveles 1 y 2 se muestran en el botón del panel de asesores.
// El nivel 3 dispara un modal bloqueante antes de que el jugador decida.
// ============================================================

// Registro de última vez que se mostró reunión de urgencia por slot
// (fuera del estado para no romper saves existentes)
const _emergencyShownAt = {};

// ── Mensajes de urgencia por ministro ─────────────────────────
const _EMERGENCY_MSG = {
  ortodoxa: [
    'Los indicadores fiscales están al límite. Cada hora sin decisión nos cuesta credibilidad ante los mercados.',
    'La situación financiera es crítica. Necesito su autorización para tomar medidas de emergencia.',
    'Los acreedores están presionando. Si no actuamos hoy, mañana el margen desaparece.',
  ],
  heterodoxa: [
    'La economía real está en caída libre. Si no intervenimos ahora, el daño será difícil de revertir.',
    'El sector productivo está colapsando. Necesito que me autorice a actuar de inmediato.',
    'Millones de puestos de trabajo están en riesgo. No podemos seguir esperando.',
  ],
  tecnocrata_eco: [
    'Los modelos indican una trayectoria crítica. Los datos exigen intervención urgente.',
    'El análisis técnico es claro: estamos fuera de todos los rangos normales de gestión.',
    'No hay margen de tolerancia en los números. Necesito que revisemos esto juntos ahora.',
  ],
  asistencial: [
    'La situación social es una emergencia humanitaria. La gente no puede esperar más decisiones postergadas.',
    'Los indicadores de pobreza y desempleo están en niveles que requieren acción inmediata.',
    'Tengo reportes desde los territorios que son alarmantes. Necesito su atención ahora.',
  ],
  laboral: [
    'El movimiento obrero está al límite. Si no actuamos, esto escala a huelga general.',
    'Los gremios me llaman a cada hora. La tensión laboral puede desbordarse en cualquier momento.',
    'Los trabajadores no aguantan más. Necesito autorización para negociar antes de que sea tarde.',
  ],
  focalizada: [
    'Los programas sociales están desbordados. La demanda supera en mucho la capacidad de respuesta.',
    'Se rompió el piso de contención social. Tenemos que activar el protocolo de emergencia.',
    'Los números de pobreza son los peores desde que asumimos. Necesito recursos adicionales ya.',
  ],
  dialoguista: [
    'La gobernabilidad está en riesgo real. Hay actores que están esperando el momento para presionar.',
    'Las tensiones políticas están a punto de estallar. Necesito su aval para iniciar negociaciones urgentes.',
    'Tengo información de que se está armando una coalición opositora. Hay que actuar diplomáticamente ahora.',
  ],
  confrontacional: [
    'Nos están atacando por todos lados y no estamos respondiendo. Necesito luz verde para contraatacar.',
    'La oposición está coordinando un movimiento fuerte. Si no actuamos primero, nos van a pasar por encima.',
    'Es ahora o nunca. Pido una reunión para definir nuestra ofensiva política.',
  ],
  tecnocrata_gab: [
    'La situación institucional es crítica. El riesgo de ingobernabilidad es real y medible.',
    'Los mecanismos de coordinación están bajo presión extrema. Necesito hablar con usted urgentemente.',
    'El marco normativo está siendo tensionado al máximo. Hay que tomar decisiones institucionales hoy.',
  ],
  industrialista: [
    'El sector industrial está en emergencia. Las plantas están parando y eso no se revierte fácil.',
    'Tengo reportes de cierre de empresas en cascada. Si no actuamos hoy, perdemos tejido productivo irreversible.',
    'La capacidad industrial está colapsando. Necesito autorización para un plan de rescate urgente.',
  ],
  agroexportador: [
    'Las reservas son críticas y el campo no puede liquidar con esta incertidumbre. Es una emergencia de divisas.',
    'El sector exportador está paralizado. Cada semana que pasa son dólares que no entran.',
    'Tengo productores que están reteniendo la cosecha. Necesitamos darles señales claras ya.',
  ],
  innovacion: [
    'La fuga de talento se aceleró. Estamos perdiendo lo que más nos costó construir.',
    'El ecosistema tech está en riesgo de colapso. Necesito un plan de emergencia para retener empresas clave.',
    'Los inversores del sector digital están saliendo. Si no actuamos ahora, esto no se recupera en años.',
  ],
  'vp-moreno': [
    'Como vicepresidenta, tengo que decírselo directamente: esto es una emergencia social que no podemos ignorar.',
    'Los índices sociales son los peores del mandato. Necesito una reunión urgente para definir la respuesta.',
    'La gente está sufriendo. No tengo otra forma de decirlo. Necesito su autorización para actuar.',
  ],
  'vp-fuentes': [
    'Como vicepresidente, le pido que me reciba hoy. La situación financiera requiere decisiones inmediatas.',
    'Los mercados nos están cerrando las puertas. Cada hora sin decisión nos cuesta más caro.',
    'Esto ya es una crisis fiscal. Le pido que me dé la autorización para actuar antes de que se agrave.',
  ],
  'vp-castillo': [
    'Como vicepresidenta, los datos son contundentes: necesitamos un plan de emergencia productivo ya.',
    'Los indicadores que sigo me muestran una trayectoria que no podemos ignorar. Pido reunión urgente.',
    'Tengo un análisis técnico que usted tiene que ver. La situación requiere acción inmediata.',
  ],
  'vp-vargas': [
    'Como vicepresidente, mi lectura política es que estamos ante una crisis de gobernabilidad inminente.',
    'Hay movimientos que me preocupan seriamente. Necesito hablar con usted antes de que escale.',
    'La ventana de diálogo se está cerrando. Pido una reunión urgente para definir la estrategia política.',
  ],
  default: [
    'La situación en mi área es crítica. Necesito hablar con usted urgentemente.',
    'Los indicadores de mi área están en niveles de emergencia. Solicito reunión de urgencia.',
    'No puedo esperar al próximo turno. Pido que me reciba ahora.',
  ],
};

/**
 * Calcula el nivel de urgencia de un asesor según el estado actual.
 * @param {string} slotId
 * @param {object} state
 * @returns {0|1|2|3}
 */
export function getAdvisorUrgency(slotId, state) {
  const minister = _ministerOf(slotId, state);
  if (!minister) return 0;

  const ind    = state.indicadores;
  const focus  = minister.adviceFocus;

  const dangerKeys = focus.filter(k => ind[k] !== undefined && getZone(k, ind[k]) === 'danger');
  const warnKeys   = focus.filter(k => ind[k] !== undefined && getZone(k, ind[k]) === 'warn');

  // Nivel 3 — Reunión de urgencia
  // · 2+ indicadores del foco en peligro
  // · O 1 en peligro y el gobierno está cerca del game-over
  const nearGameOver = (ind.confianza !== undefined && ind.confianza <= 18)
                    || (ind.pobreza   !== undefined && ind.pobreza   >= 70);
  if (dangerKeys.length >= 2)                     return 3;
  if (dangerKeys.length === 1 && nearGameOver)    return 3;

  // Nivel 2 — Urgente (borde rojo pulsante)
  if (dangerKeys.length >= 1)                     return 2;

  // Nivel 1 — Importante (borde dorado pulsante)
  if (warnKeys.length >= 1)                       return 1;

  return 0;
}

/**
 * Devuelve los asesores con urgencia nivel 3 que aún no mostraron reunión en este rango de turnos.
 * @param {object} state
 * @returns {Array<{ slotId, minister, urgency }>}
 */
export function checkEmergencyMeetings(state) {
  const allSlots = ['vp', ...MINISTER_SLOTS.map(s => s.id)];
  const result   = [];

  for (const slotId of allSlots) {
    if (getAdvisorUrgency(slotId, state) < 3) continue;

    // No repetir en menos de 3 turnos para el mismo asesor
    const lastShown = _emergencyShownAt[slotId] ?? -99;
    if (state.turn - lastShown < 3) continue;

    const minister = _ministerOf(slotId, state);
    if (minister) result.push({ slotId, minister });
  }

  // Mostrar solo el más "urgente" (VP primero, luego por slot)
  return result.slice(0, 1);
}

/**
 * Marca que la reunión de urgencia de un slot ya fue mostrada en este turno.
 * @param {string} slotId
 * @param {number} turn
 */
export function markEmergencyShown(slotId, turn) {
  _emergencyShownAt[slotId] = turn;
}

/**
 * Muestra el modal de reunión de urgencia.
 * @param {string}  slotId
 * @param {object}  minister
 * @param {object}  event    — evento actual (para pasarlo al modal de asesor)
 * @param {object}  state
 */
export function showEmergencyModal(slotId, minister, event, state) {
  const overlay = document.getElementById('emergency-overlay');
  if (!overlay) return;

  // Avatar
  const avatarEl = document.getElementById('em-avatar');
  if (avatarEl) {
    if (minister.avatarUrl) {
      avatarEl.innerHTML = `<img src="${minister.avatarUrl}" alt="${minister.name}"
        width="80" height="80" style="border-radius:50%;object-fit:cover;border:2px solid ${minister.color || 'var(--gold)'};"
        onerror="this.onerror=null;this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=${minister.id}'">`;
    } else {
      avatarEl.textContent = '🏛️';
    }
  }

  // Info
  const nameEl    = document.getElementById('em-name');
  const profileEl = document.getElementById('em-profile');
  const msgEl     = document.getElementById('em-message');
  const titleEl   = document.getElementById('em-title');
  if (nameEl)    nameEl.textContent    = minister.name;
  if (profileEl) profileEl.textContent = minister.profile || '';
  if (titleEl)   titleEl.style.borderColor = minister.color || 'var(--red, #e74c3c)';

  // Mensaje contextual
  const msgPool = _EMERGENCY_MSG[minister.id] || _EMERGENCY_MSG.default;
  if (msgEl) msgEl.textContent = msgPool[state.turn % msgPool.length];

  // Botones
  const grantBtn  = document.getElementById('btn-em-grant');
  const rejectBtn = document.getElementById('btn-em-reject');

  const closeOverlay = () => overlay.classList.remove('open');

  if (grantBtn) {
    grantBtn.onclick = () => {
      closeOverlay();
      // Breve delay para que el modal de urgencia cierre antes de abrir el asesor
      setTimeout(() => showAdvisorModal(slotId, event, state), 150);
    };
  }
  if (rejectBtn) {
    rejectBtn.onclick = closeOverlay;
  }

  overlay.classList.add('open');
}

/**
 * Cierra el modal de reunión de urgencia.
 */
export function closeEmergencyModal() {
  const overlay = document.getElementById('emergency-overlay');
  if (overlay) overlay.classList.remove('open');
}

// ── RESET POR TURNO ───────────────────────────────────────────

/**
 * Resetea usedThisTurn de todos los asesores al inicio de cada turno.
 * @param {object} state
 */
export function resetAdvisorsForTurn(state) {
  for (const key of Object.keys(state.advisors)) {
    if (!state.advisors[key]) continue;
    if (key === 'vp') {
      state.advisors[key].usedCount = 0;  // VP: resetea contador de usos (máx 2/turno)
    } else {
      state.advisors[key].usedThisTurn = false;
    }
  }
}

// ── PANEL HTML (vista de evento) ──────────────────────────────

/**
 * Construye el HTML del panel de asesores que aparece debajo del evento.
 * Muestra los 4 ministros del gabinete con su mini-avatar y estrellas.
 * @param {object} state
 * @returns {string} HTML
 */
export function buildAdvisorsHTML(state) {
  // ── Botón del Vicepresidente (asesor principal) ───────────────
  const vp        = _ministerOf('vp', state);
  const vpAdv     = state.advisors?.vp;
  const vpUsed    = vpAdv?.usedCount ?? 0;
  const vpCanUse  = vpUsed < 2;
  const vpCred    = vpAdv?.credibility ?? 4;
  const vpStars   = '⭐'.repeat(vpCred) + '☆'.repeat(Math.max(0, 5 - vpCred));
  const vpName    = vp?.name?.split(' ').slice(-1)[0] || 'Vice';
  const vpUsesLeft = 2 - vpUsed;
  const vpUrgency  = getAdvisorUrgency('vp', state);
  const vpUrgClass = !vpCanUse ? '' : (vpUrgency >= 2 ? 'advisor-urgency-2' : vpUrgency === 1 ? 'advisor-urgency-1' : '');

  const vpButton = vp ? `
    <button class="advisor-card advisor-vp ${!vpCanUse ? 'used' : ''} ${vpUrgClass}"
            data-advisor="vp"
            data-urgency="${vpUrgency}"
            style="--adv-color:${vp.color || '#c9a84c'}"
            ${!vpCanUse ? 'disabled title="Ya consultado 2 veces este turno"'
                        : `title="Consultar a ${vp.name} (Vicepresidente/a)"`}>
      ${vp.avatarUrl
        ? `<img src="${vp.avatarUrl}" class="advisor-mini-avatar" alt="${vpName}"
               onerror="this.onerror=null;this.style.display='none'">`
        : `<span class="advisor-emoji">⭐</span>`}
      <span class="advisor-name">${vpName}</span>
      <span class="advisor-cred" title="Credibilidad: ${vpCred}/5">${vpStars}</span>
      ${vpUrgency >= 1 && vpCanUse ? `<span class="advisor-urgency-badge u${vpUrgency}">${vpUrgency >= 2 ? '🚨' : '⚠️'}</span>` : ''}
      ${vpCanUse && vpUsed > 0 ? `<span class="advisor-vp-uses">${vpUsesLeft} uso${vpUsesLeft !== 1 ? 's' : ''}</span>` : ''}
      ${!vpCanUse ? '<span class="advisor-used-tag">✓✓</span>' : ''}
    </button>` : '';

  // ── Botones de ministros ──────────────────────────────────────
  const buttons = MINISTER_SLOTS.map(slot => {
    const minister  = _ministerOf(slot.id, state);
    const adv       = state.advisors[slot.id];
    const cred      = adv?.credibility ?? 3;
    const used      = adv?.usedThisTurn;
    const stars     = '⭐'.repeat(cred) + '☆'.repeat(Math.max(0, 5 - cred));
    const urgency   = used ? 0 : getAdvisorUrgency(slot.id, state);
    const urgClass  = urgency >= 2 ? 'advisor-urgency-2' : urgency === 1 ? 'advisor-urgency-1' : '';

    const lastName = minister?.name?.split(' ').slice(-1)[0] || slot.short;
    const emoji    = _slotEmoji(slot.id);

    return `
      <button class="advisor-card ${used ? 'used' : ''} ${urgClass}"
              data-advisor="${slot.id}"
              data-urgency="${urgency}"
              style="--adv-color:${slot.color || '#2563a8'}"
              ${used ? 'disabled title="Ya consultado este turno"' : `title="Consultar a ${minister?.name || lastName}"`}>
        <span class="advisor-emoji">${emoji}</span>
        <span class="advisor-name">${lastName}</span>
        <span class="advisor-cred" title="Credibilidad: ${cred}/5">${stars}</span>
        ${urgency >= 1 && !used ? `<span class="advisor-urgency-badge u${urgency}">${urgency >= 2 ? '🚨' : '⚠️'}</span>` : ''}
        ${used ? '<span class="advisor-used-tag">✓</span>' : ''}
      </button>`;
  }).join('');

  return `
    <div class="advisors-panel">
      <div class="advisors-title">👥 Consultá tu Gabinete</div>
      ${vp ? `<div class="advisors-vp-row">${vpButton}</div>` : ''}
      <div class="advisors-list">${buttons}</div>
    </div>`;
}

// ── MODAL ─────────────────────────────────────────────────────

/**
 * Muestra el modal de análisis de un ministro.
 * Incluye el avatar SVG del ministro y su análisis del evento actual.
 * @param {string} slotId
 * @param {object} event
 * @param {object} state
 */
/**
 * Muestra el modal de análisis de un ministro.
 * @param {string}  slotId
 * @param {object}  event
 * @param {object}  state
 * @param {boolean} [fromCabinet=false] — si true, el modal se apila sobre el gabinete
 */
export function showAdvisorModal(slotId, event, state, fromCabinet = false) {
  // Verificar si el VP ya usó sus 2 consultas
  if (slotId === 'vp' && (state.advisors?.vp?.usedCount ?? 0) >= 2) return;

  const analysis = getAdvisorAnalysis(slotId, event, state);
  if (!analysis) return;

  soundAdvisor();

  const { minister, text, confidence, credLevel, recommendedIndex } = analysis;
  // VP no tiene slotMeta en MINISTER_SLOTS; usamos su color directamente
  const slotMeta = slotId === 'vp'
    ? { color: minister?.color || '#c9a84c', label: minister?.title || 'Vicepresidencia' }
    : MINISTER_SLOTS.find(s => s.id === slotId);
  const modal    = document.getElementById('advisor-modal');
  if (!modal) return;

  // ── Inyectar avatar SVG del ministro en la cabecera del modal ──
  // Se inserta en advisor-modal-title (que antes mostraba solo el emoji de cartera)
  const titleEl = document.getElementById('advisor-modal-title');
  if (titleEl) {
    if (minister?.avatarUrl) {
      titleEl.innerHTML = `
        <div class="adv-modal-avatar" style="border-color:${slotMeta?.color || '#2563a8'}">
          <img src="${minister.avatarUrl}"
               alt="${minister.name}"
               width="72" height="72"
               loading="lazy"
               onerror="this.onerror=null;this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=${minister.id}'">
        </div>`;
    } else {
      titleEl.textContent = _slotEmoji(slotId);
    }
  }

  // Nombre, cartera y perfil
  const roleEl = document.getElementById('advisor-modal-role');
  if (roleEl) {
    roleEl.innerHTML = `
      <div class="adv-modal-name" style="color:${slotMeta?.color || 'var(--gold)'}">
        ${minister?.name || slotMeta?.label || slotId}
      </div>
      <div class="adv-modal-profile">${minister?.profile || ''}</div>`;
  }

  // Texto del análisis
  const textEl = document.getElementById('advisor-modal-text');
  if (textEl) textEl.innerHTML = text;

  // Credibilidad
  const credEl = document.getElementById('advisor-modal-cred');
  if (credEl) {
    credEl.textContent = '⭐'.repeat(credLevel) + '☆'.repeat(Math.max(0, 5 - credLevel));
  }

  // Nivel de confianza
  const confEl = document.getElementById('advisor-modal-conf');
  if (confEl) confEl.textContent = confidence;

  // Abrir modal y guardar datos para el handler de decisión
  modal.classList.add('open');
  modal.dataset.advisorId   = slotId;
  modal.dataset.recommended = recommendedIndex;

  // ── Modo "desde gabinete": apila sobre el gabinete y cambia el botón ──
  if (fromCabinet) {
    modal.classList.add('from-cabinet');
    const closeBtn = document.getElementById('advisor-modal-close-btn');
    if (closeBtn) {
      closeBtn.textContent = '← Volver al Gabinete';
      closeBtn.classList.add('btn-back-cabinet');
    }
  } else {
    modal.classList.remove('from-cabinet');
    const closeBtn = document.getElementById('advisor-modal-close-btn');
    if (closeBtn) {
      closeBtn.textContent = '✓ Entendido';
      closeBtn.classList.remove('btn-back-cabinet');
    }
  }

  // Resaltar opción recomendada
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('advisor-highlight', i === recommendedIndex);
  });

  // ── Botón "Pedir Renuncia" ────────────────────────────────────
  // Se inyecta dinámicamente en #advisor-resign-area (placeholder en el HTML)
  const resignArea = document.getElementById('advisor-resign-area');
  if (resignArea) {
    // Importamos buildResignBtnHTML de forma dinámica para evitar
    // dependencia circular en el módulo (resignations.js ← advisors.js)
    import('./resignations.js').then(m => {
      resignArea.innerHTML = m.buildResignBtnHTML(slotId, state);
    }).catch(() => {
      resignArea.innerHTML = '';
    });
  }
}

/**
 * Cierra el modal de asesor y limpia los highlights.
 */
export function closeAdvisorModal() {
  const modal = document.getElementById('advisor-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.classList.remove('from-cabinet');
  }
  // Restaurar botón a su estado por defecto
  const closeBtn = document.getElementById('advisor-modal-close-btn');
  if (closeBtn) {
    closeBtn.textContent = '✓ Entendido';
    closeBtn.classList.remove('btn-back-cabinet');
  }
  document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('advisor-highlight'));
  // Limpiar área de renuncia
  const resignArea = document.getElementById('advisor-resign-area');
  if (resignArea) resignArea.innerHTML = '';
}

// ── MODAL DE GABINETE ─────────────────────────────────────────

/**
 * Devuelve el resumen (primera oración) del consejo de un asesor.
 * Si aún no puede analizarse (sin evento), devuelve el adviceStyle.
 * @param {string} slotId
 * @param {object|null} event
 * @param {object} state
 * @returns {{ summary, urgency, minister, canConsult, credLevel, slotColor }}
 */
export function getAdvisorSummary(slotId, event, state) {
  const minister = _ministerOf(slotId, state);
  if (!minister) return null;

  const urgency = getAdvisorUrgency(slotId, state);
  const adv     = state.advisors?.[slotId] ?? state.advisors?.vp;
  const credLevel = (slotId === 'vp' ? state.advisors?.vp?.credibility : state.advisors?.[slotId]?.credibility) ?? 3;
  const usedThisTurn = slotId === 'vp'
    ? (state.advisors?.vp?.usedCount ?? 0) >= 2
    : !!(state.advisors?.[slotId]?.usedThisTurn);
  const canConsult = !usedThisTurn;

  const slotMeta = slotId === 'vp'
    ? { color: minister.color || '#c9a84c', label: minister.title || 'Vicepresidencia' }
    : MINISTER_SLOTS.find(s => s.id === slotId);

  let summary = minister.adviceStyle || '—';
  if (event) {
    const analysis = getAdvisorAnalysis(slotId, event, state);
    if (analysis?.text) {
      // Primera oración del texto contextual
      const firstDot = analysis.text.search(/[.!?]/);
      summary = firstDot > 0
        ? analysis.text.substring(0, firstDot + 1)
        : analysis.text.substring(0, 90) + (analysis.text.length > 90 ? '…' : '');
    }
  }

  return { summary, urgency, minister, canConsult, credLevel, slotColor: slotMeta?.color || '#888' };
}

/**
 * Construye el HTML interno del modal de gabinete.
 * @param {object|null} event
 * @param {object} state
 * @returns {string} HTML
 */
export function buildCabinetModalHTML(event, state) {
  const allSlots = ['vp', ...MINISTER_SLOTS.map(s => s.id)];

  const cards = allSlots.map(slotId => {
    const data = getAdvisorSummary(slotId, event, state);
    if (!data) return '';

    const { summary, urgency, minister, canConsult, credLevel, slotColor } = data;
    const stars     = '⭐'.repeat(credLevel) + '☆'.repeat(Math.max(0, 5 - credLevel));
    const urgBadge  = urgency >= 2 ? '<span class="cab-urgency-badge u2">🚨</span>'
                    : urgency === 1 ? '<span class="cab-urgency-badge u1">⚠️</span>' : '';
    const usedBadge = !canConsult ? '<span class="cab-used-badge">✓ Consultado</span>' : '';
    const isVP      = slotId === 'vp';

    const slotMeta  = isVP ? null : MINISTER_SLOTS.find(s => s.id === slotId);
    const roleLabel = isVP ? minister.title : (slotMeta?.short || slotId);
    const emoji     = isVP ? '⭐' : _slotEmoji(slotId);

    return `
      <div class="cab-card${isVP ? ' cab-card-vp' : ''}${!canConsult ? ' cab-card-used' : ''}"
           style="--cab-color:${slotColor}">
        <div class="cab-card-header">
          <div class="cab-avatar-wrap">
            ${minister.avatarUrl
              ? `<img src="${minister.avatarUrl}" class="cab-avatar" alt="${minister.name}"
                     onerror="this.onerror=null;this.parentElement.innerHTML='<span class=cab-avatar-emoji>${emoji}</span>'">`
              : `<span class="cab-avatar-emoji">${emoji}</span>`}
            ${urgBadge}
          </div>
          <div class="cab-info">
            <div class="cab-name">${minister.name}</div>
            <div class="cab-role" style="color:${slotColor}">${roleLabel}</div>
            <div class="cab-stars" title="Credibilidad ${credLevel}/5">${stars}</div>
          </div>
          ${usedBadge}
        </div>
        <p class="cab-summary">${summary}</p>
        <button class="cab-consult-btn${!canConsult ? ' disabled' : ''}"
                ${canConsult ? `onclick="window.__openAdvisorFromCabinet('${slotId}')"` : 'disabled'}
                style="--cab-color:${slotColor}">
          ${canConsult ? '💬 Consultar' : '✓ Ya consultado'}
        </button>
      </div>`;
  }).join('');

  return `
    <div class="cab-grid">
      ${cards}
    </div>`;
}

/**
 * Abre el modal del gabinete.
 * @param {object|null} event
 * @param {object} state
 */
export function openCabinetModal(event, state) {
  const overlay = document.getElementById('cabinet-overlay');
  if (!overlay) return;
  const content = document.getElementById('cabinet-content');
  if (content) content.innerHTML = buildCabinetModalHTML(event, state);
  overlay.classList.add('open');
}

/**
 * Cierra el modal del gabinete.
 */
export function closeCabinetModal() {
  const overlay = document.getElementById('cabinet-overlay');
  if (overlay) overlay.classList.remove('open');
}
