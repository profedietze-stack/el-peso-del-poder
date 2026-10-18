"use strict";

// ============================================================
// EVENTOS DE AMÉRICA LATINA — solo en el modo «Latinoamérica»
//
// Los 130 eventos del banco se escribieron pensando en un país. Estos diez son los
// problemas que se repiten en toda la región y que el banco no tenía: remesas, crimen
// organizado, corrupción transnacional, estallido social, minería ilegal, huracanes,
// aranceles de EE.UU., inversión china, reelección indefinida y caída de las materias
// primas. Ningún texto nombra un país: es «el país», como el resto del modo.
//
// Se suman al banco con `agregarEventosLatam()` (ver pais-datos.js). Con Argentina
// no existen. Las reglas son las del banco: ninguna opción domina a otra en los ocho
// indicadores, y las que pagan por fuera (`corrupta`, `chain`) quedan fuera de esa
// comparación (tests/eventos-latam.test.js).
//
// COMENTARIOS DE LOS MINISTROS: las frases con números se escriben con marcadores
// —{confianza}, {riesgo}…— y `construirComentarios` pone la cifra EXACTA que el motor
// aplica a esa opción. Así el ministro no puede desincronizarse del evento.
// ============================================================

const IND = {
  confianza: 'La confianza', riesgo: 'El riesgo país', pobreza: 'La pobreza', deuda: 'La deuda',
  reservas: 'Las reservas', produccion: 'La producción', ipc: 'La inflación', desocupacion: 'El desempleo',
};
const MALO_ALTO = ['ipc', 'deuda', 'riesgo', 'pobreza', 'desocupacion'];

export const EVENTS_LATAM = [
  {
    id: 201, tag: '🌍 Migración',
    titulo: 'Las Remesas se Desploman: Cae el Dinero de la Diáspora',
    descripcion: 'Millones de familias viven del dinero que envían sus parientes desde el exterior. Un endurecimiento de las políticas migratorias y una recesión en los países de destino reducen las remesas un 30 % en un año. El consumo en los barrios más pobres se contrae, los comercios pequeños cierran y las reservas en dólares pierden una de sus fuentes más estables.',
    opciones: [
      { texto: '💳 Programa de crédito y ahorro para familias receptoras: financiar con fondos públicos microcréditos y cuentas de ahorro para compensar la caída.', efectos: { ipc: 2, deuda: 7, reservas: -2, riesgo: 2, pobreza: -6, desocupacion: -1, produccion: 3, confianza: 6 } },
      { texto: '💵 Bonos de la diáspora: ofrecer títulos en dólares para que los migrantes inviertan parte de lo que ganan en el país.', efectos: { ipc: 1, deuda: 6, reservas: 9, riesgo: -4, pobreza: 1, desocupacion: 0, produccion: 3, confianza: 1 } },
      { texto: '🤝 Acuerdo de movilidad laboral: negociar con los países de destino cupos de trabajo legal y la baja del costo de enviar dinero.', efectos: { ipc: 0, deuda: 1, reservas: 4, riesgo: 1, pobreza: -2, desocupacion: -2, produccion: 1, confianza: 5 } },
    ],
  },
  {
    id: 202, tag: '⚖️ Seguridad',
    titulo: 'El Crimen Organizado Toma el Puerto Principal',
    descripcion: 'Una organización criminal controla las terminales del principal puerto de exportación: cobra «peaje» a los transportistas, infiltró a funcionarios de aduana y financia candidatos locales. Los exportadores amenazan con desviar la carga a otros puertos de la región. Hay patrullas armadas en los accesos y la prensa muestra los primeros muertos.',
    opciones: [
      { texto: '🪖 Intervención militar del puerto: desplegar las Fuerzas Armadas y reemplazar a todo el personal de aduana.', efectos: { ipc: 1, deuda: 4, reservas: 3, riesgo: -5, pobreza: 1, desocupacion: 2, produccion: -4, confianza: 4 } },
      { texto: '🔎 Fiscalía especial y cooperación internacional: crear una unidad con jueces protegidos, seguimiento del dinero y apoyo de agencias extranjeras.', efectos: { ipc: 0, deuda: 3, reservas: 1, riesgo: -4, pobreza: 0, desocupacion: 0, produccion: 0, confianza: 5 } },
      { texto: '🤫 Tolerar el «peaje» para no frenar las exportaciones: negociar con los intermediarios y mirar para otro lado.', efectos: { ipc: 0, deuda: 0, reservas: 6, riesgo: 6, pobreza: -1, desocupacion: -1, produccion: 4, confianza: -11 }, corrupta: true },
    ],
  },
  {
    id: 203, tag: '🔴 Corrupción',
    titulo: 'Una Constructora Internacional Pagó Coimas en Ocho Países',
    descripcion: 'La justicia de otro país revela que una gran constructora pagó sobornos en ocho países de la región a cambio de obras públicas, y que parte del dinero llegó a campañas políticas locales. Dos de tus ministros firmaron contratos con la empresa. Las obras en marcha emplean a miles de trabajadores y no pueden pararse sin costo.',
    opciones: [
      { texto: '⚖️ Colaboración total con la justicia: suspender los contratos, entregar los documentos y dejar que investiguen a tu propio gabinete.', efectos: { ipc: 0, deuda: -2, reservas: -1, riesgo: -4, pobreza: 2, desocupacion: 4, produccion: -5, confianza: 9 } },
      { texto: '🏗️ Renegociar con sanciones: mantener las obras con otra gestión, multar a la empresa y exigirle devolver lo cobrado de más.', efectos: { ipc: 1, deuda: -3, reservas: 1, riesgo: 1, pobreza: 0, desocupacion: 1, produccion: -1, confianza: 3 } },
      { texto: '🛡️ Limitar la investigación a la oposición: dejar que avance solo sobre los contratos de gobiernos anteriores.', efectos: { ipc: 0, deuda: 0, reservas: 0, riesgo: 5, pobreza: 0, desocupacion: 0, produccion: 1, confianza: -12 }, corrupta: true },
    ],
  },
  {
    id: 204, tag: '✊ Conflicto Social',
    titulo: 'Estallido Social por el Aumento del IVA',
    descripcion: 'Para cerrar el déficit se aprobó un aumento del impuesto al consumo, incluida la canasta básica. En tres días las protestas llegaron a todas las ciudades: barricadas, saqueos aislados y una huelga de transportistas. La policía informa de más de cien heridos y la oposición pide una sesión de emergencia. El Ministerio de Economía advierte que revertir el impuesto abre un agujero fiscal.',
    opciones: [
      { texto: '↩️ Revertir el aumento: retirar el impuesto sobre los alimentos y financiar el hueco con deuda de corto plazo.', efectos: { ipc: 1, deuda: 7, reservas: -2, riesgo: 5, pobreza: -2, desocupacion: 0, produccion: 1, confianza: 7 } },
      { texto: '🛡️ Sostener la medida y reprimir: mantener el impuesto y desplegar a las fuerzas de seguridad para despejar las calles.', efectos: { ipc: 0, deuda: -5, reservas: 3, riesgo: 6, pobreza: 3, desocupacion: 1, produccion: -3, confianza: -9 } },
      { texto: '💬 Subsidio focalizado y mesa de diálogo: devolver el impuesto a los hogares más pobres y abrir una negociación con los movimientos sociales.', efectos: { ipc: 1, deuda: 1, reservas: 0, riesgo: 1, pobreza: -4, desocupacion: 0, produccion: 0, confianza: 4 } },
    ],
  },
  {
    id: 205, tag: '🌱 Medio Ambiente',
    titulo: 'Oro Ilegal y Deforestación en la Selva',
    descripcion: 'Cuarenta mil mineros informales extraen oro en la selva con mercurio, deforestan miles de hectáreas y contaminan los ríos de las comunidades indígenas. La actividad mueve millones de dólares que terminan en circuitos de lavado y sostiene a familias enteras en una región sin otro empleo. Organismos internacionales amenazan con restringir la compra de oro del país.',
    opciones: [
      { texto: '🚁 Operativo de erradicación: destruir los campamentos con apoyo militar y reubicar a los mineros en programas de empleo.', efectos: { ipc: 0, deuda: 5, reservas: -4, riesgo: -4, pobreza: 3, desocupacion: 3, produccion: -3, confianza: 3 } },
      { texto: '📜 Formalización con regalías: legalizar a quienes acepten controles ambientales, pagar impuestos y dejar de usar mercurio.', efectos: { ipc: 0, deuda: -2, reservas: 5, riesgo: 1, pobreza: -2, desocupacion: -1, produccion: 3, confianza: -2 } },
      { texto: '🌳 Pago por conservación: financiar con crédito internacional a las comunidades que protejan el bosque y cuiden el río.', efectos: { ipc: 0, deuda: 4, reservas: 4, riesgo: -2, pobreza: -1, desocupacion: 0, produccion: -1, confianza: 5 } },
    ],
  },
  {
    id: 206, tag: '🌊 Desastre Natural',
    titulo: 'Huracán Categoría 5 Golpea la Costa',
    descripcion: 'Un huracán de categoría 5 arrasa la costa: cientos de miles de personas sin hogar, el puerto inutilizado, caminos cortados y los cultivos de exportación destruidos. Los seguros cubren una fracción y el gobierno debe decidir cómo financiar la emergencia mientras las ciudades del interior reclaman que no se les quiten recursos.',
    opciones: [
      { texto: '🆘 Emergencia con ayuda internacional: declarar el estado de desastre, activar el seguro regional y pedir donaciones y créditos blandos.', efectos: { ipc: 1, deuda: 4, reservas: 6, riesgo: -2, pobreza: -3, desocupacion: 1, produccion: -2, confianza: 6 } },
      { texto: '🏗️ Plan de reconstrucción con obra pública: contratar a los damnificados para rehacer viviendas, caminos y el puerto con fondos propios.', efectos: { ipc: 3, deuda: 8, reservas: -5, riesgo: 2, pobreza: -4, desocupacion: -4, produccion: 3, confianza: 4 } },
      { texto: '📉 Reasignar el presupuesto: recortar otras partidas para financiar la emergencia sin endeudarse.', efectos: { ipc: 0, deuda: -3, reservas: 1, riesgo: -3, pobreza: 4, desocupacion: 1, produccion: -2, confianza: -4 } },
    ],
  },
  {
    id: 207, tag: '🌏 Relaciones Exteriores',
    titulo: 'EE.UU. Anuncia Aranceles del 25 % a las Exportaciones',
    descripcion: 'El principal socio comercial anuncia aranceles del 25 % a una parte de las exportaciones del país, entre ellas los productos industriales que más empleo generan. Los exportadores amenazan con despidos y piden una respuesta inmediata. Una represalia es posible, pero el país depende de ese mercado.',
    opciones: [
      { texto: '🤝 Negociar concesiones: aceptar compras de bienes y reglas de inversión a cambio de una exención parcial.', efectos: { ipc: 1, deuda: 1, reservas: 3, riesgo: -4, pobreza: 0, desocupacion: -1, produccion: 1, confianza: -1 } },
      { texto: '🌏 Diversificar hacia Asia y Europa: abrir mercados nuevos con acuerdos y apoyo financiero a los exportadores.', efectos: { ipc: 0, deuda: 4, reservas: 2, riesgo: 1, pobreza: 0, desocupacion: 1, produccion: -1, confianza: 5 } },
      { texto: '⚔️ Responder con aranceles propios: gravar productos del socio y defender la soberanía comercial.', efectos: { ipc: 5, deuda: 0, reservas: -2, riesgo: 6, pobreza: 2, desocupacion: 2, produccion: -4, confianza: 4 } },
    ],
  },
  {
    id: 208, tag: '💼 Inversión Extranjera',
    titulo: 'Una Potencia Asiática Ofrece Financiar un Puerto de Aguas Profundas',
    descripcion: 'Una empresa estatal asiática ofrece construir y financiar un puerto de aguas profundas que duplicaría la capacidad exportadora y crearía 20.000 empleos. A cambio pide una concesión de 40 años, la operación de las terminales y exenciones impositivas. Aliados tradicionales advierten que el acuerdo compromete la autonomía del país.',
    opciones: [
      { texto: '✅ Aceptar la oferta completa: firmar la concesión por 40 años y asegurar la obra y el financiamiento.', efectos: { ipc: 0, deuda: 8, reservas: 7, riesgo: 3, pobreza: -3, desocupacion: -5, produccion: 7, confianza: -3 } },
      { texto: '📑 Aceptar con condiciones: concesión de 20 años, control estatal de la aduana y compromisos de empleo y compras locales.', efectos: { ipc: 0, deuda: 5, reservas: 4, riesgo: 0, pobreza: -2, desocupacion: -3, produccion: 4, confianza: 3 } },
      { texto: '🏦 Rechazar y buscar financiamiento multilateral: pedir crédito a bancos de desarrollo con plazos más largos.', efectos: { ipc: 0, deuda: 6, reservas: 1, riesgo: -3, pobreza: 0, desocupacion: -1, produccion: 1, confianza: 4 } },
    ],
  },
  {
    id: 209, tag: '🏛️ Crisis Institucional',
    titulo: 'Presión para Habilitar la Reelección Indefinida',
    descripcion: 'El bloque oficialista propone reformar la Constitución para eliminar el límite de mandatos y asegurar la continuidad del proyecto de gobierno. Tus asesores políticos sostienen que, sin ti, la coalición se rompe. Los organismos internacionales y buena parte de la sociedad advierten que eliminar el límite debilita la alternancia. La oposición amenaza con movilizaciones.',
    opciones: [
      { texto: '🚫 Respetar el límite de mandatos: anunciar que no buscarás continuar y preparar una sucesión ordenada.', efectos: { ipc: 0, deuda: 0, reservas: -2, riesgo: -3, pobreza: 0, desocupacion: 0, produccion: -2, confianza: 6 } },
      { texto: '🗳️ Consulta popular: llevar la reforma a un referendo con campaña abierta y aceptar el resultado.', efectos: { ipc: 0, deuda: 2, reservas: 3, riesgo: 1, pobreza: 0, desocupacion: 0, produccion: 3, confianza: 3 } },
      { texto: '⚖️ Habilitarla por el tribunal constitucional: presionar a los jueces para que interpreten que el límite no te alcanza.', efectos: { ipc: 0, deuda: 0, reservas: 2, riesgo: 11, pobreza: 0, desocupacion: 0, produccion: 3, confianza: -14 }, corrupta: true },
    ],
  },
  {
    id: 210, tag: '🌾 Agroexportaciones',
    titulo: 'Se Desploma el Precio de la Principal Exportación',
    descripcion: 'El precio internacional del principal producto de exportación cae un 40 % en pocos meses. Las divisas que entran se reducen a la mitad, el presupuesto pierde recaudación y los productores amenazan con frenar la inversión. El país vendió durante años casi todo lo que producía de una sola materia prima.',
    opciones: [
      { texto: '🏦 Fondo de estabilización y deuda: usar el ahorro de los años buenos y pedir crédito para sostener el gasto durante la caída.', efectos: { ipc: 1, deuda: 6, reservas: -5, riesgo: 2, pobreza: -3, desocupacion: -1, produccion: 3, confianza: 5 } },
      { texto: '✂️ Ajuste del gasto y devaluación: recortar el presupuesto y dejar que el tipo de cambio absorba el golpe.', efectos: { ipc: 9, deuda: -4, reservas: 5, riesgo: -2, pobreza: 6, desocupacion: 3, produccion: -3, confianza: -6 } },
      { texto: '🏭 Plan de diversificación: incentivos a la industria y los servicios para depender menos de una sola materia prima.', efectos: { ipc: 2, deuda: 5, reservas: -2, riesgo: 0, pobreza: 1, desocupacion: -2, produccion: 4, confianza: 3 } },
    ],
  },
];

// ── Comentarios de los ministros ────────────────────────────────
// [evento][opción] = lista de [cartera, texto con {marcadores}]. Los marcadores se reemplazan por
// el efecto REAL de la opción, con su color: verde si mejora al país, rojo si lo empeora.
const PLANTILLAS = {
  201: [
    [['social', 'Es la respuesta más directa para los barrios que vivían de las remesas. {pobreza} y {confianza}, pero {deuda}: es gasto sin contrapartida inmediata.'],
     ['economia', 'Sin dólares nuevos, financiar esto presiona las cuentas. {deuda} y {reservas}.']],
    [['economia', 'Atrae el ahorro de quienes ya tienen confianza en el país: {reservas} y {riesgo}. Pero {deuda}, y no ayuda a las familias que hoy pierden el ingreso.'],
     ['social', 'No llega a los hogares más pobres: {pobreza}.']],
    [['gabinete', 'Es una apuesta diplomática de largo plazo. {confianza} y {desocupacion}, pero no resuelve el golpe de este año: {reservas}.'],
     ['produccion', 'Abre la puerta a trabajo legal para los jóvenes, sin tocar el presupuesto: {deuda}.']],
  ],
  202: [
    [['gabinete', 'Es lo que la ciudadanía pide ver. {riesgo} y {confianza}. El costo: {produccion}, porque el puerto trabaja a media máquina mientras dura el operativo.'],
     ['economia', 'Los exportadores no pierden la carga: {reservas}. Pero {deuda} por el gasto militar.']],
    [['gabinete', 'Es la salida institucional: {riesgo} y {confianza}. Tarda en dar resultados y el crimen no espera.'],
     ['produccion', 'El puerto sigue operando con poca interrupción: {produccion}.']],
    [['economia', 'Las exportaciones no se frenan: {reservas} y {produccion}. Pero el crimen se consolida: {riesgo}.'],
     ['gabinete', 'Tolerar el peaje se paga caro: {confianza}. Cuando se sepa, será un escándalo.']],
  ],
  203: [
    [['gabinete', 'Es lo único creíble: {confianza} y {riesgo}. Pero frena las obras: {produccion} y {desocupacion}.'],
     ['social', 'Los trabajadores de las obras pagan el costo: {pobreza}.']],
    [['economia', 'Recupera dinero para el Estado: {deuda}. Es una salida intermedia: {confianza}, sin la ruptura de la primera opción.'],
     ['produccion', 'Las obras continúan casi sin pausa: {produccion}.']],
    [['gabinete', 'Es el atajo conocido y no sale gratis: {confianza}. Los mercados lo leen como cálculo político: {riesgo}.']],
  ],
  204: [
    [['social', 'Calma las calles al instante: {confianza}. Los hogares más pobres respiran: {pobreza}.'],
     ['economia', 'Pero se financia con deuda corta: {deuda} y {riesgo}.']],
    [['economia', 'El impuesto recauda y el déficit se cierra: {deuda}. Pero {confianza}: gobernar contra la calle tiene un precio.'],
     ['gabinete', 'La violencia puede escalar: {riesgo} y {pobreza}.']],
    [['social', 'Protege a los hogares que más sufren con el IVA: {pobreza} y {confianza}. Abre canales que bajan la tensión.'],
     ['economia', 'Es más caro que no hacer nada y más barato que revertirlo todo: {deuda}.']],
  ],
  205: [
    [['gabinete', 'Es una señal fuerte hacia afuera: {riesgo} y {confianza}. Pero {desocupacion} y {pobreza} en una región sin otro empleo.'],
     ['economia', 'El operativo cuesta: {deuda} y {reservas}.']],
    [['economia', 'Convierte economía informal en recaudación: {reservas} y {deuda}. A cambio, {confianza}: ambientalistas y comunidades lo ven como una rendición.'],
     ['produccion', 'La actividad sigue y se ordena: {produccion} y {desocupacion}.']],
    [['social', 'Cuida el río y la selva sin dejar a nadie sin ingreso: {confianza} y {pobreza}.'],
     ['economia', 'Se financia con crédito internacional: {deuda} y {reservas}.']],
  ],
  206: [
    [['social', 'Llega ayuda rápida a los damnificados: {pobreza} y {confianza}. Los donantes miran el uso de los fondos: {riesgo}.'],
     ['economia', 'Entran divisas: {reservas}, pero {deuda}.']],
    [['produccion', 'La reconstrucción es empleo inmediato: {desocupacion} y {produccion}. Pero {reservas} y {deuda}, con {ipc} por la demanda de materiales.'],
     ['social', 'Es la respuesta que más reduce el daño social: {pobreza}.']],
    [['economia', 'Mantiene el orden de las cuentas: {deuda} y {riesgo}. Pero {pobreza}: los damnificados esperan más.'],
     ['gabinete', 'Políticamente se paga: {confianza}.']],
  ],
  207: [
    [['economia', 'Evita lo peor: {reservas} y {riesgo}. Pero ceder se nota: {confianza}.'],
     ['produccion', 'Las fábricas respiran: {desocupacion} y {produccion}.']],
    [['produccion', 'Es el camino de largo plazo, no el de este año: {produccion} y {desocupacion}. {confianza}: se percibe como decisión propia.'],
     ['economia', 'Cuesta apoyo financiero: {deuda}.']],
    [['gabinete', 'Es popular: {confianza}. Pero {riesgo} y {ipc}: la factura la pagan los consumidores.'],
     ['produccion', 'Y la industria sufre las represalias: {produccion} y {desocupacion}.']],
  ],
  208: [
    [['produccion', 'La obra más grande de la década: {produccion} y {desocupacion}. Pero {deuda}, y {confianza} por las condiciones de la concesión.'],
     ['gabinete', 'Compromete la autonomía por cuarenta años: {riesgo}.']],
    [['gabinete', 'Mantiene el control del Estado en lo clave: {confianza}. Es la solución de equilibrio.'],
     ['produccion', 'Se pierde algo de velocidad: {produccion} y {desocupacion}.']],
    [['economia', 'Evita dependencias: {riesgo} y {confianza}. Pero {deuda} y casi nada de empleo inmediato: {desocupacion}.']],
  ],
  209: [
    [['gabinete', 'Es el gesto que fortalece las instituciones: {confianza} y {riesgo}. La coalición se tensa, pero la sucesión ordenada tranquiliza a los mercados.']],
    [['gabinete', 'Es legítima si acepta perder: {confianza}. La campaña abierta cuesta: {deuda}.'],
     ['economia', 'La incertidumbre mientras dura el referendo pesa: {produccion}.']],
    [['gabinete', 'Es el atajo del poder: {confianza} y {riesgo}. Un tribunal capturado es una amenaza para la inversión.'],
     ['economia', 'Los mercados lo castigan: {riesgo}.']],
  ],
  210: [
    [['economia', 'Amortigua el golpe sin ajuste social: {pobreza} y {confianza}. Pero {deuda} y {reservas}.'],
     ['produccion', 'La actividad aguanta: {produccion}.']],
    [['economia', 'Equilibra las cuentas: {deuda} y {reservas}. Pero {ipc} y {pobreza} por la devaluación, y {confianza}.'],
     ['social', 'El ajuste cae sobre los más pobres: {desocupacion}.']],
    [['produccion', 'Es la salida estructural: {produccion} y {desocupacion}. Los resultados tardan: {deuda} por los incentivos.'],
     ['economia', 'Mientras tanto, la caída de la materia prima sigue: {reservas}.']],
  ],
};

/** El texto de un indicador con su cifra y color según el efecto real de la opción. */
function _frase(clave, delta, alInicio) {
  const nombre = alInicio ? IND[clave] : IND[clave][0].toLowerCase() + IND[clave].slice(1);
  if (!delta) return `${nombre} no cambia`;
  const sube = delta > 0;
  const bueno = MALO_ALTO.includes(clave) ? !sube : sube;
  const verbo = sube ? (clave === 'reservas' ? 'suben' : 'sube') : (clave === 'reservas' ? 'bajan' : 'baja');
  const clase = bueno ? 'mm-good' : 'mm-bad';
  const n = Math.abs(delta);
  return `<span class="${clase}">${nombre} ${verbo} ${n} ${n === 1 ? 'punto' : 'puntos'}</span>`;
}

/**
 * Arma el objeto de comentarios {id: [opción][{slot, text}]} con las cifras reales.
 * Un marcador de un indicador que la opción no mueve se reemplaza por «no cambia».
 */
export function construirComentarios(eventos = EVENTS_LATAM, plantillas = PLANTILLAS) {
  const salida = {};
  for (const ev of eventos) {
    const porOpcion = plantillas[ev.id];
    if (!porOpcion) continue;
    salida[ev.id] = ev.opciones.map((op, i) =>
      (porOpcion[i] ?? []).map(([slot, texto]) => ({
        slot,
        text: texto.replace(/\{(\w+)\}/g, (_, k, desde) => _frase(k, op.efectos?.[k] ?? 0, desde === 0 || /[.!?]\s*$/.test(texto.slice(0, desde)))),
      })));
  }
  return salida;
}
