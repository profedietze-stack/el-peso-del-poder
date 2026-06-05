"use strict";

// ============================================================
// COMENTARIOS MINISTERIALES — Post-decisión, pre-consecuencias
//
// Estructura: MINISTER_COMMENTARY[eventId][optionIdx] = [
//   { slot: 'economia'|'social'|'gabinete'|'produccion', text: '...' },
// ]
// Los textos usan HTML:
//   <b>texto</b>                  → negrita (conceptos clave)
//   <span class="mm-good">...</span> → verde (ganancia / positivo)
//   <span class="mm-bad">...</span>  → rojo  (pérdida / riesgo)
// ============================================================

export const MINISTER_COMMENTARY = {

  // ── EVENTO 1: Vencimiento de Deuda Soberana ───────────────
  1: [
    // Opción 0: Renegociar con quita del 30%
    [
      { slot: 'economia', text: 'La renegociación con quita es dolorosa pero <span class="mm-good">sostenible a largo plazo</span>. Al reducir el stock de deuda un 30% y extender plazos, <span class="mm-good">liberamos recursos para la economía real</span>. El <b>riesgo país va a bajar</b> porque los mercados prefieren un deudor que paga menos pero cumple. Ojo: <span class="mm-bad">la inflación subirá levemente</span> por la incertidumbre inicial, y la producción tardará en recuperarse.' },
      { slot: 'gabinete', text: 'Políticamente, renegociar es la salida más viable: la ciudadanía entiende la quita como una <span class="mm-good">victoria frente a los acreedores</span>. Pero <span class="mm-bad">los inversores internacionales tardarán en volver</span>. Tenemos una ventana de <b>6 meses</b> para consolidar la confianza interna antes de que los mercados vuelvan a presionar.' },
    ],
    // Opción 1: Pagar a todo costo
    [
      { slot: 'economia', text: 'Pagar en tiempo y forma <span class="mm-good">preserva la reputación crediticia del país</span>. Pero <span class="mm-bad">vaciar las reservas a este ritmo nos deja sin colchón</span> ante cualquier shock externo. <span class="mm-bad">La inflación va a subir</span> porque necesitaremos emitir para cubrir el gasto corriente. Con menos reservas, <span class="mm-bad">el tipo de cambio se tensará y la pobreza escala</span>.' },
    ],
    // Opción 2: Default unilateral
    [
      { slot: 'economia', text: 'El <b>default</b> es el peor escenario para los indicadores de corto plazo. <span class="mm-bad">El riesgo país se va a disparar</span>, el crédito internacional se corta y <span class="mm-bad">la inflación puede irse de las manos</span>. Sí, <span class="mm-good">ahorramos divisas hoy</span>, pero el costo es años de exclusión financiera. Cada default tardó entre <b>3 y 7 años</b> en resolverse. Preparate para una crisis profunda.' },
      { slot: 'gabinete', text: 'Esto va a generar <span class="mm-bad">caos político inmediato</span>. La oposición pedirá juicio político, los mercados cerrarán, y <span class="mm-bad">la confianza en el gobierno puede colapsar en semanas</span>. Necesitamos un plan de comunicación de emergencia y apoyo legislativo antes de anunciar esto públicamente.' },
    ],
  ],

  // ── EVENTO 2: Huelga General Docente ─────────────────────
  2: [
    // Opción 0: Ceder al 45%
    [
      { slot: 'social', text: 'Otorgar el aumento es correcto: <span class="mm-bad">los docentes perdieron casi 20 puntos de salario real</span> en dos años. Sin docentes bien pagados no hay educación de calidad, y sin educación, <span class="mm-bad">la pobreza estructural no baja</span>. Sí, <span class="mm-bad">va a presionar la inflación</span>, pero <span class="mm-good">la inversión en educación tiene retorno a largo plazo</span>.' },
      { slot: 'economia', text: 'Un aumento del <b>45%</b> es razonable pero caro: <span class="mm-bad">la masa salarial del sector docente es enorme</span> y el impacto en el déficit fiscal se va a sentir. <span class="mm-bad">Habrá presión sobre el IPC</span> porque otros sectores van a exigir paridad. Recomiendo una cláusula de revisión que blinde el acuerdo sin comprometer aumentos automáticos desbordados.' },
    ],
    // Opción 1: Acuerdo intermedio 28%
    [
      { slot: 'social', text: 'El <b>28% con cláusula CER</b> es un equilibrio razonable pero frágil: los docentes no van a estar conformes. El impacto en pobreza será modesto. Lo más importante es que <span class="mm-good">las aulas vuelven a funcionar hoy</span>, y eso tiene un valor social que no se mide solo en pesos.' },
      { slot: 'gabinete', text: 'Esta solución <span class="mm-good">compra tiempo</span>, pero no resuelve el conflicto de fondo. En tres meses volvemos a la misma mesa con las mismas demandas, <span class="mm-bad">tal vez con más presión</span>. Hay que usar este período para reformar el esquema salarial con previsibilidad.' },
    ],
    // Opción 2: Rechazar y declarar esencial
    [
      { slot: 'social', text: 'Declarar el servicio esencial puede resolver el problema logístico, pero <span class="mm-bad">crea un conflicto político y social enorme</span>. Los docentes tienen alta legitimidad: <span class="mm-bad">la confianza va a caer</span>, la pobreza no mejora, y <span class="mm-bad">el resentimiento se acumula</span> para conflictos futuros.' },
      { slot: 'gabinete', text: 'Vamos a ganar la escaramuza pero <span class="mm-bad">perder la batalla</span>: los gremios van a escalar, los estudiantes van a salir a las calles, y <span class="mm-bad">el costo político puede superar el ahorro en salarios</span>. No recomiendo esta opción sin tener lista una oferta superadora para los próximos 30 días.' },
    ],
  ],

  // ── EVENTO 3: Presión sobre el Tipo de Cambio ────────────
  3: [
    // Opción 0: Devaluación controlada 35%
    [
      { slot: 'economia', text: '<span class="mm-bad">La devaluación del 35% va a ser un shock inflacionario importante</span>: los precios de importados suben de inmediato. Pero <span class="mm-good">sincerar el tipo de cambio es necesario</span> para que las exportaciones sean competitivas y para frenar la sangría de reservas. El <span class="mm-good">efecto positivo en producción y reservas</span> va a tardar 2 o 3 meses en materializarse.' },
      { slot: 'social', text: '<span class="mm-bad">El impacto en los sectores vulnerables es duro</span>: los alimentos importados y los que tienen componente dólar suben inmediatamente. <span class="mm-bad">La pobreza va a subir antes de bajar</span>. Necesitamos activar el <b>programa de transferencias de emergencia</b> en paralelo para proteger a los más vulnerables durante los primeros dos meses.' },
    ],
    // Opción 1: Reforzar el cepo
    [
      { slot: 'economia', text: 'El cepo <span class="mm-good">compra tiempo</span> pero <span class="mm-bad">agrava el problema de fondo</span>: la brecha cambiaria va a seguir creciendo, <span class="mm-bad">las reservas netas siguen cayendo</span>, y los importadores no pueden operar. <span class="mm-bad">Cada vez que se refuerzan los controles sin resolver el desequilibrio</span>, el ajuste final es más costoso. Es una solución de corto plazo con facturas de largo plazo.' },
      { slot: 'produccion', text: 'El cepo nos estrangula: <span class="mm-bad">sin divisas no podemos importar maquinaria, insumos ni tecnología</span>. Las industrias que dependen de importaciones van a reducir producción en semanas. <span class="mm-bad">El desempleo industrial puede subir</span> aunque los números oficiales tarden en reflejarlo.' },
    ],
    // Opción 2: Swap con China
    [
      { slot: 'economia', text: 'El swap con China es <span class="mm-good">una solución de liquidez</span>, no de solvencia. Nos da un <span class="mm-good">respiro temporal de divisas</span>, pero ojo: <span class="mm-bad">el tipo de cambio implícito del swap suele ser desfavorable</span> y nos genera deuda en yuanes. Sirve como <b>puente</b> mientras atacamos el desequilibrio estructural, pero no puede ser la solución final.' },
      { slot: 'gabinete', text: 'Políticamente, el acuerdo con China va a tener <b>lectura doble</b>: para unos es pragmatismo, para otros es dependencia. <span class="mm-bad">Los socios del Mercosur y los alineados con Washington van a mirar esto con atención</span>. Necesitamos trabajar el relato diplomático para que no se lea como un giro geopolítico.' },
    ],
    // Opción 3: Unificación cambiaria gradual
    [
      { slot: 'economia', text: 'La unificación gradual en <b>6 meses</b> es el camino más ordenado pero más lento. <span class="mm-good">Reduce la incertidumbre de una devaluación abrupta</span>. El riesgo: <span class="mm-bad">si el mercado no cree en el plan, la presión sobre el dólar paralelo puede acelerarse</span> y terminar forzando una corrección más brusca. La credibilidad del anuncio lo es todo.' },
    ],
  ],

  // ── EVENTO 4: Epidemia de Dengue ─────────────────────────
  4: [
    // Opción 0: Emergencia sanitaria nacional
    [
      { slot: 'social', text: 'Declarar la emergencia sanitaria es la respuesta correcta: <b>180.000 casos</b> supera la capacidad de respuesta regular. <span class="mm-good">La pobreza baja porque los sectores vulnerables son los más afectados</span>, y una respuesta rápida del Estado evita muertes y pérdidas de ingreso familiares. <span class="mm-bad">El costo fiscal es alto</span> pero el costo de no actuar, en vidas y credibilidad, es mucho mayor.' },
      { slot: 'economia', text: 'Sí, la emergencia <span class="mm-bad">implica redirigir presupuesto y tomar deuda</span>, pero una epidemia sin control <span class="mm-bad">destruye productividad, genera ausentismo masivo y daña el turismo</span>. <span class="mm-good">La inversión sanitaria tiene retorno económico medible</span>. Lo que no podemos permitir es que esto se convierta en una crisis de meses.' },
    ],
    // Opción 1: Campaña de fumigación
    [
      { slot: 'social', text: 'La fumigación masiva y los mosquiteros son <span class="mm-good">medidas preventivas efectivas y de bajo costo relativo</span>. No resuelven la crisis de corto plazo en los hospitales, pero cortando la cadena de transmisión el número de nuevos casos debería <span class="mm-good">bajar en 3 a 4 semanas</span>. Es una respuesta pragmática, aunque la ciudadanía espera más acciones visibles de emergencia.' },
    ],
    // Opción 2: Delegar a provincias
    [
      { slot: 'social', text: 'Delegar sin asistencia fiscal en una epidemia de esta magnitud es <span class="mm-bad">abandonar a las provincias más pobres y menos equipadas</span>. Las que tienen más casos son las que tienen menos recursos sanitarios. <span class="mm-bad">La pobreza va a subir</span> porque los más vulnerables son los que menos pueden pagar atención privada. Y <span class="mm-bad">la confianza en el gobierno nacional va a desplomarse</span>.' },
      { slot: 'gabinete', text: 'Esto va a costar caro políticamente: <span class="mm-bad">los gobernadores afectados van a responsabilizar al gobierno nacional</span>, y van a tener razón. En elecciones, la respuesta sanitaria es uno de los temas que más pesa. Recomiendo fuertemente ofrecer al menos un <b>fondo de emergencia</b>.' },
    ],
  ],

  // ── EVENTO 5: Escándalo de Corrupción ────────────────────
  5: [
    // Opción 0: Tolerancia cero
    [
      { slot: 'gabinete', text: 'Separar y entregar a la justicia a los implicados es la única respuesta que <span class="mm-good">permite sostener la legitimidad del gobierno</span>. <span class="mm-good">La confianza ciudadana va a recuperarse significativamente</span>. Sí, quedaremos expuestos mediáticamente en el corto plazo, pero <span class="mm-bad">el costo de no actuar es perder la gobernabilidad</span>. Actuar rápido y con decisión es lo único que funciona.' },
    ],
    // Opción 1: Enfriar el escándalo
    [
      { slot: 'gabinete', text: 'Los cambios cosméticos no van a funcionar: la investigación ya está en marcha y <span class="mm-bad">los videos seguirán circulando</span>. Cada día sin posición clara es un día que la oposición llena ese vacío. <span class="mm-bad">La confianza va a seguir cayendo</span>. Esta estrategia solo funciona si hay algo más grave que tape la noticia, y confiar en eso es una apuesta <span class="mm-bad">muy arriesgada</span>.' },
    ],
    // Opción 2: Defender a los acusados (corrupta)
    [
      { slot: 'gabinete', text: 'Calificar la investigación de montaje es un <span class="mm-bad">error estratégico grave</span>: los videos son concretos, las fuentes múltiples y los medios internacionales ya tomaron el caso. <span class="mm-bad">Cada vez que un gobierno defiende a corruptos con evidencia en contra, la caída de confianza es exponencial</span>. Esto puede transformarse en una crisis que amenace la continuidad del mandato.' },
      { slot: 'social', text: 'Defender estos actos <span class="mm-bad">impacta directamente en la legitimidad de los programas sociales</span>. La ciudadanía empieza a percibir que los recursos públicos no llegan a quienes más los necesitan. El <span class="mm-bad">daño a la cohesión social y a la confianza institucional</span> es profundo y difícil de revertir.' },
    ],
    // Opción 3: Auditoría externa
    [
      { slot: 'gabinete', text: 'La auditoría externa internacional es una respuesta inteligente: <span class="mm-good">demuestra voluntad de transparencia</span> sin admitir culpa inmediata. <span class="mm-good">La confianza va a recuperarse moderadamente</span>. El riesgo: <span class="mm-bad">la auditoría puede encontrar más irregularidades de las esperadas</span>. Necesitamos prepararnos para ese escenario.' },
      { slot: 'economia', text: 'Una auditoría también <span class="mm-good">mejora la percepción de los inversores y organismos internacionales</span>: el <span class="mm-good">riesgo país baja</span> porque señaliza gobernanza responsable. Hay que comunicarlo en los mercados como una señal de orden, no solo como medida defensiva.' },
    ],
  ],

  // ── EVENTO 6: Sequía ─────────────────────────────────────
  6: [
    // Opción 0: Subsidios directos
    [
      { slot: 'produccion', text: 'Los subsidios de emergencia son la respuesta más directa: <span class="mm-good">el empleo rural se va a sostener</span> y <span class="mm-good">la producción se va a recuperar antes</span>. Sin capital de trabajo, los productores no pueden plantar la próxima campaña. El costo es <span class="mm-bad">inflación y deuda</span>, pero la alternativa es un <span class="mm-bad">desempleo rural masivo</span>.' },
      { slot: 'economia', text: 'El subsidio es caro. Pero <span class="mm-good">el campo aporta el 60% de las exportaciones</span>, así que sostenerlo hoy <span class="mm-good">preserva los dólares del año que viene</span>. Lo ideal es diseñarlo como <b>crédito blando a tasa negativa</b> con devolución atada a la cosecha futura, no como transferencia directa.' },
    ],
    // Opción 1: Reducir retenciones
    [
      { slot: 'economia', text: 'Bajar retenciones es la herramienta más eficiente: <span class="mm-good">cada punto que quitamos trae más dólares al sistema</span>. El costo es <span class="mm-bad">menor recaudación</span>, pero en un contexto de sequía donde la cosecha ya cayó, recaudar menos del <b>60%</b> es mejor que no recaudar nada de productores quebrados.' },
      { slot: 'produccion', text: 'La baja de retenciones le da <span class="mm-good">oxígeno al campo justo cuando más lo necesita</span>. <span class="mm-good">Las exportaciones van a aumentar, las reservas van a mejorar y el empleo rural se va a sostener</span>. Hay que comunicarlo como una medida temporal de emergencia, no como un cambio estructural.' },
    ],
    // Opción 2: Créditos climáticos internacionales
    [
      { slot: 'economia', text: 'Los créditos climáticos del BID y Banco Mundial son la alternativa más ordenada: <span class="mm-good">nos dan dólares frescos sin renunciar a la recaudación por retenciones</span>. <span class="mm-bad">Generan deuda en moneda extranjera</span>, aunque a tasas muy bajas. Y nos posiciona internacionalmente como un país que <span class="mm-good">usa instrumentos climáticos responsablemente</span>.' },
      { slot: 'produccion', text: 'Los fondos del BID generalmente incluyen <span class="mm-good">asistencia técnica para adaptación climática</span>: riego eficiente, variedades resistentes, seguros agropecuarios. Eso no solo resuelve la emergencia sino que <span class="mm-good">prepara al sector para la próxima sequía</span>. La desventaja es que <span class="mm-bad">los desembolsos pueden tardar semanas</span>.' },
    ],
  ],

  // ── EVENTO 7: FMI ─────────────────────────────────────────
  7: [
    // Opción 0: Aceptar completo
    [
      { slot: 'economia', text: 'El acuerdo con el FMI trae <span class="mm-good">una lluvia de dólares que estabiliza las reservas</span> y <span class="mm-good">baja el riesgo país de forma inmediata</span>. Pero el programa de ajuste es duro: <span class="mm-bad">déficit cero en 18 meses implica recortar gasto social, subir tarifas y liberar el mercado laboral</span>. <span class="mm-bad">La desocupación y la pobreza van a subir en el corto plazo</span> antes de que los indicadores macro mejoren.' },
      { slot: 'social', text: 'El ajuste que exige el FMI tiene nombre y apellido: <span class="mm-bad">corte de subsidios, reforma laboral y reducción del gasto social</span>. Eso se traduce en <span class="mm-bad">más pobreza en el corto plazo</span>, especialmente para los sectores más vulnerables. Voy a necesitar <b>partidas presupuestarias de emergencia</b> para los programas de asistencia social mientras el ajuste hace efecto.' },
    ],
    // Opción 1: Renegociar metas más flexibles
    [
      { slot: 'economia', text: 'Renegociar plazos y metas es la posición más equilibrada: <span class="mm-good">conseguimos los dólares del Fondo</span> pero con <span class="mm-good">un programa menos brutal socialmente</span>. La clave es la credibilidad: si el FMI percibe que estamos dilatando sin resultados, <span class="mm-bad">van a endurecer la posición en la próxima revisión</span>.' },
    ],
    // Opción 2: Rechazar
    [
      { slot: 'economia', text: 'Rechazar implica ir a un ajuste propio sin dólares frescos. <span class="mm-bad">El riesgo país va a subir</span> porque el mercado interpretará el rechazo como señal de desorden. Sin los <b>USD 20.000 millones del FMI</b>, <span class="mm-bad">vamos a necesitar recortar más en menos tiempo para sostener las reservas</span>. Requiere una coordinación política y social muy fuerte.' },
      { slot: 'produccion', text: 'Sin el acuerdo, <span class="mm-bad">la inversión privada se va a contraer</span>: los empresarios leen el rechazo como señal de inestabilidad. <span class="mm-bad">Los proyectos de inversión que estaban en carpeta probablemente se posterguen un año</span>. A mediano plazo, si el ajuste propio funciona, la producción puede recuperarse.' },
    ],
  ],

  // ── EVENTO 8: Movilización por Desempleo ─────────────────
  8: [
    // Opción 0: Programa de empleo emergencia
    [
      { slot: 'social', text: 'El programa de empleo en infraestructura es la respuesta más efectiva: <span class="mm-good">ataca el desempleo directamente</span>, <span class="mm-good">pone plata en el bolsillo de los trabajadores</span> y produce algo concreto. <span class="mm-good">La pobreza baja con ingreso directo</span>. <span class="mm-bad">El costo en deuda es real</span> pero manejable si el programa está bien diseñado con metas y auditoría.' },
      { slot: 'produccion', text: 'La inversión en infraestructura tiene <b>doble retorno</b>: <span class="mm-good">empleo inmediato</span> para los que no trabajan y <span class="mm-good">reducción de costos logísticos para las empresas que producen</span>. Cada peso invertido en rutas y redes energéticas tiene un multiplicador económico de <b>1,5 a 2 veces</b> el gasto original.' },
    ],
    // Opción 1: Mesa de diálogo
    [
      { slot: 'social', text: 'La mesa de diálogo es necesaria pero no suficiente. <span class="mm-good">La confianza sube porque la ciudadanía ve al gobierno escuchando</span>, pero si el diálogo no produce resultados concretos en <b>60 días</b>, <span class="mm-bad">la presión social va a volver con más fuerza</span>. Necesitamos que la mesa tenga agenda con plazos y compromisos medibles.' },
      { slot: 'gabinete', text: 'El diálogo es la vía más inteligente para desactivar la tensión inmediata. Pero <span class="mm-bad">no podemos prometer lo que no podemos cumplir</span>. Si el diálogo no deriva en al menos <b>un anuncio concreto</b> en las próximas dos semanas, <span class="mm-bad">perdemos credibilidad y el costo de la próxima movilización será mayor</span>.' },
    ],
    // Opción 2: Despejar por orden judicial
    [
      { slot: 'social', text: 'Despejar los cortes por la fuerza va a <span class="mm-bad">agravar el conflicto social profundamente</span>. Las imágenes de represión van a circular en todo el mundo. <span class="mm-bad">Los sectores medios que hoy son neutrales van a enojarse</span>, y los sectores organizados van a radicalizar sus demandas. <span class="mm-bad">La confianza cae</span> porque la gente distingue entre un gobierno que resuelve problemas y uno que reprime a los que los padecen.' },
      { slot: 'gabinete', text: 'Esta decisión puede tener <span class="mm-bad">consecuencias constitucionales</span>: la protesta social es un derecho garantizado. Si hay incidentes durante el desalojo, <span class="mm-bad">el gobierno queda expuesto política y jurídicamente</span>. Recomiendo explorar todas las vías de negociación antes de tomar esta decisión.' },
    ],
  ],

  // ── EVENTO 9: Reforma Tributaria ─────────────────────────
  9: [
    // Opción 0: Reforma progresiva completa
    [
      { slot: 'economia', text: 'Una reforma progresiva bien diseñada es posiblemente la <b>política fiscal más potente</b> disponible: <span class="mm-good">redistribuye la carga hacia quienes más tienen</span> y libera recursos para inversión social. <span class="mm-good">La pobreza baja, la deuda mejora y las reservas se consolidan</span>. Eso sí: <span class="mm-bad">las cámaras empresariales van a reaccionar con amenazas de desinversión</span>.' },
      { slot: 'social', text: 'Esta es exactamente la reforma que venimos pidiendo: <span class="mm-good">que los que más tienen paguen más</span>. <span class="mm-good">El impacto en la confianza ciudadana va a ser importante</span> porque la gente percibe que el sistema es más justo. Hay que comunicarla bien para que no se lea solo como castigo a los ricos sino como financiamiento de lo público.' },
    ],
    // Opción 1: Reforma parcial para pymes
    [
      { slot: 'economia', text: 'La reforma parcial para pymes es la más viable políticamente: <span class="mm-good">simplificar el sistema tributario para las empresas chicas reduce la informalidad y fomenta la inversión</span>. No resuelve el problema estructural de la regresividad, pero <span class="mm-good">es un paso adelante sin generar los conflictos políticos</span> de la reforma completa.' },
    ],
    // Opción 2: Reforma regresiva
    [
      { slot: 'economia', text: 'Bajar impuestos corporativos puede funcionar si los inversores responden: <span class="mm-good">el riesgo país baja y la producción puede subir</span>. Pero hay un costo social: <span class="mm-bad">la carga tributaria se traslada a los sectores medios y la pobreza puede aumentar</span>. Históricamente, estas reformas en países emergentes tardaron <b>3 a 5 años</b> en verse reflejadas en inversión concreta.' },
      { slot: 'social', text: 'Bajar el impuesto a las ganancias corporativas mientras el <b>40% de la población</b> está en situación de vulnerabilidad es políticamente muy difícil de defender. <span class="mm-bad">La confianza va a caer</span> porque la percepción es que el gobierno favorece a las empresas sobre las personas.' },
    ],
    // Opción 3: Suspender la reforma
    [
      { slot: 'gabinete', text: 'Suspender la reforma evita el desgaste político de un conflicto que no podemos ganar en el Congreso. Pero hay un costo: <span class="mm-bad">la ciudadanía percibe debilidad e inacción</span>. Recomiendo usar este tiempo para construir los votos necesarios. <span class="mm-good">Una reforma aprobable vale mucho más que un fracaso legislativo</span>.' },
    ],
  ],

  // ── EVENTO 10: Apagones Energéticos ──────────────────────
  10: [
    // Opción 0: Plan de infraestructura eléctrica
    [
      { slot: 'produccion', text: 'La inversión en infraestructura eléctrica es urgente: <span class="mm-bad">sin energía confiable, la industria no puede producir</span> y el desempleo escala. <span class="mm-good">Las plantas nuevas van a generar empleos en la construcción de inmediato</span>. El <span class="mm-good">efecto en producción y desocupación será visible en 6 a 12 meses</span>. <span class="mm-bad">El costo en deuda es real</span>, pero la energía es la columna vertebral de toda la economía.' },
      { slot: 'economia', text: 'Una licitación pública bien diseñada puede <span class="mm-good">atraer inversión privada y reducir el costo para el Estado</span>. El <span class="mm-good">riesgo país baja</span> porque los inversores leen la inversión en infraestructura como señal de seriedad económica. Lo que no podemos hacer es <span class="mm-bad">seguir subsidiando energía sin invertir</span>: eso es pagar caro por un servicio que se deteriora.' },
    ],
    // Opción 1: Transición a renovables
    [
      { slot: 'produccion', text: 'La transición a energías renovables en <b>24 meses</b> es ambiciosa pero posible: el país tiene uno de los <span class="mm-good">potenciales eólicos y solares más grandes del mundo</span>. El empleo que genera la construcción de parques es intensivo y calificado. En el mediano plazo, las renovables tienen <span class="mm-good">costo marginal cercano a cero</span>, lo que <span class="mm-good">reduce los subsidios estructuralmente</span>.' },
      { slot: 'gabinete', text: 'La apuesta renovable tiene un gran <span class="mm-good">valor de imagen internacional</span>: nos posiciona en la agenda climática global y facilita acceso a <span class="mm-good">financiamiento verde del BID, CAF y bonos verdes</span>. El riesgo: <span class="mm-bad">si hay más apagones mientras se construye la capacidad nueva, el costo político puede ser alto</span>.' },
    ],
    // Opción 2: Importar GNL
    [
      { slot: 'economia', text: 'Importar GNL es la <span class="mm-good">solución más rápida para aliviar la crisis de corto plazo</span>: en semanas se puede aumentar la generación eléctrica. Pero es cara: <span class="mm-bad">el GNL en el mercado spot puede costar el triple del gas local</span>. <span class="mm-bad">Eso va a drenar reservas</span>. Es una buena solución de emergencia mientras se desarrolla capacidad propia, pero no puede ser el plan de largo plazo.' },
      { slot: 'produccion', text: 'El GNL <span class="mm-good">resuelve el problema inmediato de la producción</span>: las industrias van a poder volver a operar en días. Necesitamos negociar <b>contratos de mediano plazo</b> para no quedar expuestos a la volatilidad del <span class="mm-bad">mercado spot de GNL, que tuvo picos que triplicaron el costo proyectado</span>.' },
    ],
  ],

  // ── EVENTO 11: Litio ──────────────────────────────────────
  11: [
    // Opción 0: Aceptar condiciones tal como vienen
    [
      { slot: 'produccion', text: 'Aceptar las condiciones nos da <span class="mm-good">acceso inmediato a USD 8.000 millones en inversión</span> y al empleo que genera, pero <span class="mm-bad">resignamos soberanía económica a largo plazo</span>. La <span class="mm-bad">exención impositiva por 15 años</span> significa que el Estado no va a recaudar nada de una de las mayores riquezas del país durante todo ese período.' },
      { slot: 'economia', text: 'El flujo de divisas es tentador, pero el modelo <span class="mm-bad">sin regalías ni impuestos durante 15 años es insostenible</span> para las cuentas públicas. Los países que aceptan estas condiciones terminan con <span class="mm-bad">enclaves extractivos que no generan encadenamiento productivo local</span>. Recomiendo fuertemente incluir al menos <b>cláusulas de revisión</b> ante cambios en el precio internacional del litio.' },
    ],
    // Opción 1: Negociar condiciones
    [
      { slot: 'produccion', text: 'Negociar <span class="mm-good">empleo local, evaluación ambiental y regalías</span> es lo correcto: la empresa igual va a invertir porque el yacimiento es extraordinario. El litio es el <b>petróleo del siglo XXI</b> y ellos lo saben. <span class="mm-good">Las regalías para comunidades generan desarrollo regional sostenible</span>.' },
      { slot: 'social', text: 'La <b>consulta previa a las comunidades indígenas</b> no es solo un requisito legal: es lo que hace que el proyecto sea <span class="mm-good">socialmente viable en el largo plazo</span>. Los proyectos extractivos que ignoran a las comunidades locales terminan con <span class="mm-bad">conflictos que los paralizan años</span>. Invertir tiempo en la negociación hoy nos ahorra costos enormes en el futuro.' },
    ],
    // Opción 2: Rechazar
    [
      { slot: 'produccion', text: 'Rechazar la oferta <span class="mm-good">protege los humedales y los derechos de las comunidades</span>, y tiene peso real. Pero hay un costo económico: <span class="mm-bad">perdemos una fuente de divisas urgente y el desempleo en la región sube</span>. Si se rechaza, hay que tener un <b>plan alternativo</b> para el desarrollo sustentable del recurso.' },
      { slot: 'gabinete', text: 'La decisión de rechazar va a tener <span class="mm-good">impacto positivo en la confianza de los movimientos ambientales y las comunidades indígenas</span>, que tienen más poder político del que los medios muestran. Pero habrá <span class="mm-bad">presión de los sectores que esperaban el empleo y la inversión</span>. Hay que comunicarlo claro: no es un no al desarrollo, es un no a <b>este</b> modelo de desarrollo.' },
    ],
  ],

  // ── EVENTO 12: Espiral Inflacionaria ─────────────────────
  12: [
    // Opción 0: Plan de shock
    [
      { slot: 'economia', text: 'El plan de shock tiene una lógica clara: <span class="mm-good">anclar el tipo de cambio y congelar precios corta la espiral inflacionaria de raíz</span>. <span class="mm-good">La inflación baja rápido y la confianza sube</span>. Pero el costo es real: <span class="mm-bad">reservas que se agotan defendiendo el ancla</span>, <span class="mm-bad">producción que cae</span>, y <span class="mm-bad">desocupación que sube</span>. Hay que tener un plan B para cuando el ancla no aguante.' },
      { slot: 'social', text: 'El congelamiento de precios <span class="mm-good">ayuda a los sectores de ingresos fijos en el corto plazo</span>, pero genera <span class="mm-bad">escasez si los precios no cubren los costos de producción</span>. Si hay desabastecimiento, <span class="mm-bad">el impacto en los sectores más vulnerables es devastador</span>. Necesitamos asegurarnos de que el congelamiento no afecte la disponibilidad de alimentos básicos.' },
    ],
    // Opción 1: Plan gradualista
    [
      { slot: 'economia', text: 'El gradualismo tiene la virtud de <span class="mm-good">no generar el shock social del ajuste abrupto</span>, pero requiere credibilidad sostenida: <span class="mm-bad">si el mercado no cree que el déficit va a bajar 1% mensual, no va a cambiar sus expectativas y la inflación sigue</span>. La clave es la consistencia: cada mes que cumplimos la meta, <span class="mm-good">la credibilidad crece y la inflación cede un poco más</span>.' },
    ],
    // Opción 2: Dolarización
    [
      { slot: 'economia', text: 'La dolarización <span class="mm-good">elimina la inflación de raíz</span> porque el peso deja de existir, pero el costo es brutal: <span class="mm-bad">necesitamos reservas para convertir todos los pesos en circulación</span> y <span class="mm-bad">perdemos para siempre la herramienta de política monetaria</span>. Si hay un shock externo, <span class="mm-bad">no tenemos cómo ajustar el tipo de cambio</span>. Es muy riesgoso en el contexto argentino.' },
      { slot: 'social', text: 'La dolarización va a golpear muy fuerte a los sectores más vulnerables en la transición: <span class="mm-bad">la pobreza sube porque los salarios en pesos pierden capacidad de compra en el momento del cambio</span>, y <span class="mm-bad">la desocupación escala porque muchas empresas no pueden ajustar sus costos</span>. La inflación baja, sí, pero el costo distributivo es muy alto.' },
    ],
  ],

  // ── EVENTO 13: Paro de Transporte ────────────────────────
  13: [
    // Opción 0: Otorgar el aumento completo
    [
      { slot: 'social', text: 'Resolver el conflicto con el aumento completo es la decisión más efectiva para restaurar la normalidad. Los choferes tienen razón: <span class="mm-bad">sus salarios cayeron en términos reales</span>. <span class="mm-good">La confianza ciudadana sube porque la gente puede volver a trabajar</span>. El impacto en inflación es moderado porque la masa salarial del sector es acotada.' },
      { slot: 'economia', text: 'El costo fiscal del aumento es real pero limitado. Lo que sí hay que vigilar es el <b>efecto de arrastre</b>: <span class="mm-bad">si los choferes consiguen el 100%, otros gremios van a pedir lo mismo</span>. Recomiendo acordar con los demás sindicatos antes de anunciar esto públicamente, para que no se lea como precedente automático para todos.' },
    ],
    // Opción 1: Mediación y acuerdo intermedio
    [
      { slot: 'gabinete', text: 'La mediación con un acuerdo del <b>60%</b> es una salida diplomática razonable. <span class="mm-good">No satisface completamente a nadie, pero desescala el conflicto</span>. La clave está en la <b>cláusula de revisión</b>: si comprometemos una segunda etapa en 6 meses, los gremios tienen un horizonte y el acuerdo se sostiene.' },
      { slot: 'social', text: 'El 60% no recupera el poder adquisitivo perdido, pero <span class="mm-good">es un avance real</span>. Lo que más importa es que las rutas vuelvan a funcionar porque <span class="mm-bad">cada día de paro afecta a los sectores más pobres que no tienen auto propio</span>.' },
    ],
    // Opción 2: Declarar servicio esencial
    [
      { slot: 'gabinete', text: 'Declarar el servicio esencial es legal pero <span class="mm-bad">políticamente muy costoso</span>: los sindicatos lo van a leer como una declaración de guerra. <span class="mm-bad">El riesgo de que el paro se extienda a otros sectores solidarios es real</span>. <span class="mm-bad">La confianza cae significativamente</span> porque la ciudadanía percibe que el gobierno usa el poder del Estado contra los trabajadores.' },
      { slot: 'social', text: 'Forzar el retorno al trabajo sin resolver la demanda salarial de fondo es una solución de cortísimo plazo. En <b>30 días</b> vamos a estar exactamente en el mismo punto, pero con <span class="mm-bad">un gremio más radicalizado y menos dispuesto a negociar</span>.' },
    ],
  ],

  // ── EVENTO 14: Conflicto por el Agua ─────────────────────
  14: [
    // Opción 0: Organismos internacionales
    [
      { slot: 'gabinete', text: 'Llevar el caso a la OEA, ICJ y ONU es la vía correcta desde el derecho internacional: los <b>tratados de aguas compartidas son vinculantes</b> y tenemos un caso sólido. El proceso lleva tiempo — <b>2 a 5 años</b> — pero <span class="mm-good">el fallo internacional va a ser más difícil de ignorar que una presión bilateral</span>. Hay que negociar una solución transitoria que garantice caudal mínimo a la región.' },
      { slot: 'produccion', text: 'Los productores agrícolas del noroeste no pueden esperar años. <span class="mm-bad">El impacto en producción y desocupación regional puede ser muy severo</span> si no hay una solución de corto plazo paralela al proceso jurídico. Necesitamos una <b>medida cautelar</b> o acuerdo transitorio que asegure agua mientras se desarrolla el proceso.' },
    ],
    // Opción 1: Negociación bilateral
    [
      { slot: 'gabinete', text: 'La negociación bilateral directa con compensaciones económicas puede <span class="mm-good">resolver esto más rápido que los organismos internacionales</span>. El vecino tiene intereses económicos concretos con nosotros: deuda, comercio, inversiones. Hay palancas para una negociación. La clave es que el acuerdo incluya <span class="mm-good">garantías concretas de caudal mínimo verificable</span>, no solo promesas diplomáticas.' },
    ],
    // Opción 2: Maniobras militares
    [
      { slot: 'gabinete', text: 'Las maniobras militares en zona fronteriza son una escalada que <span class="mm-bad">rara vez produce los resultados buscados</span>. <span class="mm-bad">El riesgo país sube</span> porque los inversores internacionales huyen de tensiones fronterizas. Y los organismos multilaterales de crédito que necesitamos <span class="mm-bad">van a complicar sus relaciones con nosotros</span>.' },
      { slot: 'produccion', text: 'Una tensión fronteriza puede <span class="mm-bad">interrumpir el comercio bilateral</span> que tenemos con el vecino, afectando exportaciones, cadenas de suministro y contratos activos. El <span class="mm-bad">impacto productivo puede ser mayor que el beneficio de la presión</span>. Recomiendo resolver esto por vías diplomáticas.' },
    ],
  ],

  // ── EVENTO 15: Reforma Previsional ───────────────────────
  15: [
    // Opción 0: Reforma moderada
    [
      { slot: 'economia', text: 'La reforma moderada es la más sostenible políticamente: <span class="mm-good">elevar la edad a 65 y crear un fondo con Ganancias reduce el déficit previsional sin destruir el sistema de reparto</span>. <span class="mm-good">La deuda y el riesgo país bajan</span> porque el mercado valora la sostenibilidad fiscal. El costo es impopularidad real: <span class="mm-bad">los que tienen hoy 60 años van a sentir que les movemos el arco</span>.' },
      { slot: 'social', text: 'La reforma moderada es un punto de equilibrio que podemos defender: <span class="mm-good">no privatiza, no elimina beneficios, pero hace el sistema más sostenible</span>. La pobreza sube levemente porque algunos jubilados esperan más. Pero lo que no podemos hacer es no reformar: sin intervención, <span class="mm-bad">el colapso del sistema en 3 años va a ser mucho más duro</span>.' },
    ],
    // Opción 1: Privatización con capitalización
    [
      { slot: 'economia', text: 'La capitalización individual <span class="mm-good">reduce el déficit fiscal en el largo plazo y baja el riesgo país</span>. Pero hay un riesgo real: <span class="mm-bad">los jubilados que recibieron bajos salarios terminan con jubilaciones miserables</span> porque sus cuentas individuales acumulan poco. La evidencia de <b>Chile, pionero en este modelo</b>, muestra que 40 años después el 80% de los jubilados recibe pensiones por debajo de la línea de pobreza.' },
      { slot: 'social', text: 'La privatización parcial tiene costos sociales documentados: <span class="mm-bad">quienes tuvieron empleos informales o salarios bajos — mayoritariamente mujeres — terminan con jubilaciones ínfimas</span>. <span class="mm-bad">La confianza cae significativamente</span> porque la ciudadanía percibe el riesgo. Si avanzamos en esta dirección, tiene que haber un <span class="mm-good">piso de jubilación mínima garantizada muy robusto</span>.' },
    ],
    // Opción 2: No reformar, inyección fiscal
    [
      { slot: 'economia', text: 'No reformar patear la pelota hacia adelante: <span class="mm-bad">el déficit previsional crece 1,5% del PBI por año sin reforma</span>. En <b>3 años</b> vamos a enfrentar la misma decisión pero con mucho menos margen. Lo que <span class="mm-good">ganamos hoy en confianza popular</span> lo <span class="mm-bad">pagamos después en una crisis previsional con consecuencias mucho más severas</span>.' },
      { slot: 'social', text: 'Sostener el sistema sin reforma <span class="mm-good">protege hoy a los jubilados actuales</span>, que son los más vulnerables. <span class="mm-good">La confianza sube y la pobreza baja entre los jubilados</span>. El costo es <span class="mm-bad">déficit e inflación</span>. Es una decisión que prioriza el presente sobre el futuro, y tiene justificación: los jubilados no pueden esperar 3 años.' },
    ],
  ],

  // ── EVENTO 16: Desabasto de Medicamentos ─────────────────
  16: [
    // Opción 0: Importación estatal de emergencia
    [
      { slot: 'social', text: 'La importación estatal de emergencia es la única respuesta que <span class="mm-good">garantiza medicamentos a los pacientes crónicos en el corto plazo</span>. Sí, <span class="mm-bad">cuesta reservas</span>, pero el costo de que pacientes con diabetes, cáncer o hipertensión queden sin medicación <b>se mide en vidas humanas</b>. <span class="mm-good">La confianza en el gobierno sube significativamente</span> porque la ciudadanía valora que el Estado actúe cuando el mercado falla.' },
      { slot: 'economia', text: 'El gasto es alto pero acotado: se puede hacer por licitación directa internacional con precios razonables. A mediano plazo, esta crisis debería impulsarnos a <span class="mm-good">desarrollar capacidad de producción local para no depender del mercado de divisas para medicamentos esenciales</span>.' },
    ],
    // Opción 1: Subsidiar producción pública
    [
      { slot: 'social', text: 'Subsidiar la producción en laboratorios estatales y universitarios es una apuesta de mediano plazo con <span class="mm-good">retornos sólidos</span>: <span class="mm-good">genera empleo calificado, reduce la dependencia de divisas y abarata los medicamentos de forma estructural</span>. La pobreza baja porque los medicamentos genéricos locales son <span class="mm-good">60 a 80% más baratos</span> que los importados.' },
      { slot: 'produccion', text: 'Argentina tiene <span class="mm-good">laboratorios universitarios con capacidad técnica para producir genéricos de alta calidad</span>. El CONICET y las universidades nacionales pueden escalar la producción si tienen financiamiento. <span class="mm-good">La desocupación baja</span> porque los laboratorios son intensivos en trabajo calificado.' },
    ],
    // Opción 2: Liberalizar precios
    [
      { slot: 'economia', text: 'La liberalización de precios puede <span class="mm-good">atraer nuevos actores al mercado</span> si la rentabilidad mejora. Pero hay un problema ético y económico: <span class="mm-bad">los medicamentos esenciales no funcionan como un mercado normal porque la demanda es inelástica</span> — la gente necesita insulina aunque cueste el triple.' },
      { slot: 'social', text: 'Liberalizar precios cuando hay desabasto es peligroso: <span class="mm-bad">los laboratorios van a subir los precios al máximo posible</span> porque saben que los pacientes no tienen alternativa. <span class="mm-bad">La pobreza sube</span> porque una parte importante de los ingresos de los sectores vulnerables se va en medicamentos. <span class="mm-bad">La confianza baja</span> porque la ciudadanía percibe que el gobierno eligió el mercado sobre la salud.' },
    ],
  ],

  // ── EVENTO 17: Startups y Tecnología ─────────────────────
  17: [
    // Opción 0: Ley de Economía del Conocimiento
    [
      { slot: 'produccion', text: 'La Ley de Economía del Conocimiento es una de las mejores inversiones que puede hacer el Estado: <span class="mm-good">por cada peso de beneficio fiscal al sector tech, el retorno en exportaciones, empleo calificado y divisas es de 3 a 5 veces mayor</span>. <span class="mm-good">La producción sube, el desempleo baja, las reservas mejoran</span>.' },
      { slot: 'economia', text: 'Los beneficios fiscales al conocimiento <span class="mm-good">generan exportaciones que no existirían de otra forma</span>. El <span class="mm-good">riesgo país baja</span> porque la diversificación exportadora mejora la percepción de solvencia. Las empresas de tecnología no dependen de commodities, lo que <span class="mm-good">reduce la vulnerabilidad a shocks externos</span>.' },
    ],
    // Opción 1: Apoyo condicionado a derechos laborales
    [
      { slot: 'produccion', text: 'El apoyo condicionado a derechos laborales plenos es un equilibrio razonable: <span class="mm-good">fomentamos el sector pero sin crear un esquema de precarización laboral disfrazado de modernidad</span>. Las empresas que no garantizan derechos terminan con <span class="mm-bad">rotación altísima y pérdida de talento</span>. El crecimiento es un poco más lento pero <span class="mm-good">más sostenible y equitativo</span>.' },
      { slot: 'social', text: 'Las plataformas digitales pueden ser excelentes fuentes de empleo, pero si no hay regulación laboral, <span class="mm-bad">terminan siendo trabajo precario con nombre moderno</span>. <span class="mm-good">La confianza sube porque la ciudadanía ve que el gobierno no regala beneficios sin condiciones</span>. El desempleo baja con <span class="mm-good">empleos de calidad</span>, que es lo que realmente importa para reducir la pobreza estructural.' },
    ],
    // Opción 2: Priorizar industria tradicional
    [
      { slot: 'produccion', text: 'Priorizar la industria tradicional sobre el conocimiento es conservar lo conocido, pero <span class="mm-bad">perdemos una oportunidad histórica</span>. El mundo está en transición tecnológica y los países que se quedan afuera de esa ola tienen cada vez más dificultades para competir. En <b>10 años</b>, esta decisión puede tener <span class="mm-bad">consecuencias estructurales difíciles de revertir</span>.' },
    ],
  ],

  // ── EVENTO 18: Proteccionismo vs. Libre Comercio ─────────
  18: [
    // Opción 0: Aranceles y licencias
    [
      { slot: 'produccion', text: 'Los aranceles protegen el empleo nacional en el corto plazo: <span class="mm-good">las industrias van a poder operar de nuevo</span>. <span class="mm-good">La desocupación industrial baja y la producción sube</span>. El costo es que <span class="mm-bad">los consumidores pagan más por los productos</span> y que hay <span class="mm-bad">riesgo de represalias comerciales que afecten nuestras exportaciones agropecuarias</span>.' },
      { slot: 'economia', text: 'El proteccionismo tiene su lógica en sectores estratégicos, pero hay que hacerlo bien: <span class="mm-bad">aranceles muy altos generan ineficiencia y corrupción en las aduanas</span>. Recomiendo combinarlos con <b>metas de productividad</b> para las industrias protegidas, de forma que la protección sea temporal y los sectores se vuelvan <span class="mm-good">competitivos</span>, no dependientes del arancel para siempre.' },
    ],
    // Opción 1: Acuerdos de reciprocidad
    [
      { slot: 'produccion', text: 'Los acuerdos de reciprocidad son la vía más equilibrada: <span class="mm-good">protegemos a los sectores que necesitan protección pero mantenemos el acceso a mercados externos</span> para las exportaciones. <span class="mm-good">La producción crece de forma más sostenible</span> que con aranceles unilaterales.' },
      { slot: 'gabinete', text: 'La negociación de acuerdos de reciprocidad requiere capital diplomático, pero <span class="mm-good">los resultados son más duraderos</span>. El <b>Mercosur</b>, la <b>Alianza del Pacífico</b> y los acuerdos bilaterales con Brasil e India son las prioridades. <span class="mm-good">El mundo ve que somos un socio comercial constructivo</span>, no un proteccionista unilateral.' },
    ],
    // Opción 2: Apertura comercial
    [
      { slot: 'economia', text: 'La apertura comercial <span class="mm-good">baja la inflación</span> porque los bienes importados más baratos compiten con la producción local. El <span class="mm-good">riesgo país baja y las reservas suben</span>. Pero <span class="mm-bad">la producción industrial cae</span> porque muchas empresas no pueden competir con importaciones subsidiadas. <span class="mm-bad">La desocupación en el sector manufacturero puede subir rápidamente</span>.' },
      { slot: 'produccion', text: 'La apertura abrupta puede <span class="mm-bad">destruir sectores industriales que tardaron décadas en desarrollarse</span>. El empleo que se pierde en la manufactura es empleo calificado que, una vez perdido, <span class="mm-bad">tarda años en recuperarse</span>. La historia de las aperturas rápidas en América Latina en los 90 muestra que <span class="mm-bad">el costo en desocupación y producción industrial puede ser permanente</span>.' },
    ],
  ],

  // ── EVENTO 19: Inundaciones ───────────────────────────────
  19: [
    // Opción 0: Emergencia nacional con FFAA
    [
      { slot: 'social', text: 'La declaración de emergencia nacional es la respuesta correcta y proporcional: <span class="mm-bad">200.000 evacuados</span> necesitan asistencia inmediata, y las provincias afectadas no tienen capacidad para responder solas. <span class="mm-good">La confianza sube significativamente porque la ciudadanía ve al Estado presente en las peores horas</span>. <span class="mm-good">La pobreza baja porque se evitan pérdidas permanentes de activos</span> en los sectores más vulnerables.' },
      { slot: 'gabinete', text: 'La respuesta rápida y visible en una catástrofe natural es políticamente fundamental: <span class="mm-good">los gobiernos que actúan con rapidez tienen mejoras durables en su imagen pública</span>. Necesitamos un vocero único y un centro de coordinación con información actualizada cada <b>6 horas</b> para los medios. La comunicación de crisis es tan importante como la respuesta operativa.' },
    ],
    // Opción 1: Asistencia con ONGs y municipios
    [
      { slot: 'social', text: 'La coordinación descentralizada con ONGs y Cruz Roja puede ser <span class="mm-good">más ágil que la burocracia estatal en ciertos aspectos</span>, pero tiene un límite: <span class="mm-bad">sin recursos del gobierno nacional, la respuesta va a ser insuficiente para 200.000 evacuados</span>. Esta opción funciona como complemento de la acción estatal, no como reemplazo.' },
    ],
    // Opción 2: Declarar zona de desastre y delegar
    [
      { slot: 'social', text: 'Delegar completamente a las provincias sin asistencia fiscal es <span class="mm-bad">abandonarlas en el peor momento</span>. Las provincias del litoral son las que tienen <span class="mm-bad">menor capacidad fiscal y administrativa del país</span>. Delegar sin recursos es transferir responsabilidad sin posibilidad de respuesta. <span class="mm-bad">La pobreza va a subir, la confianza va a colapsar</span>.' },
      { slot: 'gabinete', text: 'Esta es una de las peores opciones políticamente posibles en una catástrofe: <span class="mm-bad">la ciudadanía espera al Estado nacional en los momentos de crisis</span>. Si el gobierno no aparece, la oposición va a ocupar ese espacio. El <span class="mm-bad">daño a la imagen del gobierno puede ser duradero y mucho más costoso</span> que cualquier partida presupuestaria de emergencia.' },
    ],
  ],

  // ── EVENTO 20: Privatización de Empresas Públicas ────────
  20: [
    // Opción 0: Privatización total
    [
      { slot: 'economia', text: 'La venta total genera <span class="mm-good">ingresos extraordinarios que mejoran la deuda y bajan el riesgo país</span>. Pero hay un costo que los números no capturan: <span class="mm-bad">las empresas que se venden en condiciones de urgencia se venden baratas</span>. La experiencia argentina de los 90 muestra que las privatizaciones apresuradas <span class="mm-bad">transfirieron activos estratégicos a valores muy por debajo del real</span>.' },
      { slot: 'social', text: 'La privatización total implica <span class="mm-bad">despidos masivos en sectores con alta sindicalización</span>. <span class="mm-bad">La desocupación va a subir significativamente y la confianza va a caer</span>. Los trabajadores que pierden empleos en empresas públicas suelen tener <span class="mm-bad">baja empleabilidad en el sector privado</span> porque sus competencias son específicas.' },
    ],
    // Opción 1: Asociación público-privada (PPP)
    [
      { slot: 'economia', text: 'La PPP con <b>51% estatal</b> es la solución más inteligente: <span class="mm-good">atrae capital privado y gestión eficiente sin perder el control estratégico</span>. <span class="mm-good">La deuda baja, el riesgo país mejora y la producción sube</span> porque los privados invierten en modernización. Es el modelo que usan exitosamente <b>Alemania, Francia e Italia</b> en empresas estratégicas.' },
      { slot: 'produccion', text: 'Las asociaciones público-privadas bien diseñadas <span class="mm-good">generan empleo de calidad y mejoran la productividad</span>. Los privados aportan gestión y capital; el Estado mantiene el control estratégico y los objetivos sociales. <span class="mm-bad">La desocupación sube levemente</span> porque hay restructuración, pero mucho menos que con la privatización total.' },
    ],
    // Opción 2: Reconversión con inversión pública
    [
      { slot: 'produccion', text: 'Modernizar sin privatizar es la opción más soberana: <span class="mm-good">mantenemos el control y los empleos</span>, y apostamos a que con inversión y gestión eficiente las empresas se vuelvan viables. <span class="mm-good">La producción sube y el desempleo baja</span>. El costo es <span class="mm-bad">deuda</span> y el riesgo de que <span class="mm-bad">la gestión pública no logre los cambios culturales necesarios</span>.' },
      { slot: 'social', text: 'La reconversión con inversión pública <span class="mm-good">preserva los empleos y la capacidad industrial del país</span>. <span class="mm-good">La confianza sube moderadamente</span> porque la ciudadanía valora la defensa de las empresas nacionales. El desafío real es la gestión: sin profesionalización y autonomía real de la conducción, <span class="mm-bad">la inversión no alcanza para transformar la cultura organizacional</span>.' },
    ],
    // Opción 3: No tocar nada
    [
      { slot: 'economia', text: 'Sostener las empresas sin reformarlas prolonga el déficit estructural: <span class="mm-bad">cada año de pérdidas se suma a la deuda pública</span>. <span class="mm-bad">El IPC sube porque el déficit se financia con emisión</span>. Es una decisión con justificación política — preservar empleo y soberanía — pero requiere un plan de reducción gradual de pérdidas que haga sustentable el modelo.' },
      { slot: 'social', text: 'No tocar nada <span class="mm-good">protege a los trabajadores actuales y mantiene el empleo</span>. <span class="mm-good">La desocupación baja levemente</span>. El problema es que sin inversión ni reforma, estas empresas seguirán deteriorándose hasta que <span class="mm-bad">el costo de sostenerlas sea insostenible y la decisión se tome en crisis</span>, no en planificación.' },
    ],
  ],


  // ── EVENTO 21: Incumplimiento de Metas Fiscales / FMI ────────
  21: [
    // Opción 0: Ajuste de emergencia
    [
      { slot: 'economia', text: 'El ajuste de emergencia <span class="mm-good">cumple la meta del FMI y preserva los desembolsos</span>, pero el costo social es muy alto. <span class="mm-bad">Recortar educación y salud genera una deuda social que después cuesta el doble reponer</span>. Las reservas mejoran en el corto plazo, pero <span class="mm-bad">la pobreza va a subir y la confianza en el gobierno caerá</span>. Solo recomendable si no existe alternativa.' },
      { slot: 'gabinete', text: 'Esta decisión <span class="mm-bad">va a generar un conflicto político enorme</span>: docentes, médicos y trabajadores de salud van a movilizarse. Perderemos capital político difícil de recuperar. Si elegimos este camino, <span class="mm-good">necesitamos un relato claro y medidas compensatorias focalizadas en los más vulnerables</span> para que la ciudadanía entienda que es un sacrificio temporal, no una política permanente.' },
    ],
    // Opción 1: Plan alternativo gradual
    [
      { slot: 'economia', text: 'El plan de cumplimiento gradual es el <b>camino más inteligente</b>: <span class="mm-good">muestra voluntad sin destruir el tejido social</span>. El FMI acepta planes alternativos cuando están bien fundamentados técnicamente. <span class="mm-good">El riesgo país mejora moderadamente</span> y las reservas se estabilizan sin el shock inflacionario del ajuste abrupto. Necesitamos presentar metas creíbles con indicadores verificables.' },
      { slot: 'gabinete', text: 'La negociación con el FMI requiere <b>tiempo y credibilidad técnica</b>. <span class="mm-good">Si logramos que el Fondo apruebe el plan alternativo, la confianza se sostiene</span>. El riesgo es que los mercados lean la propuesta como dilación y presionen sobre el tipo de cambio. Hay que trabajar el mensaje simultáneamente con los acreedores privados para evitar una corrida.' },
    ],
    // Opción 2: Financiamiento alternativo (China/Golfo)
    [
      { slot: 'economia', text: 'El financiamiento alternativo <span class="mm-good">nos da margen para no ajustar</span>, pero tiene costos ocultos. <span class="mm-bad">Los swaps con China tienen tipos de cambio implícitos desfavorables</span> y los créditos del Golfo suelen exigir contrapartidas comerciales. <span class="mm-good">Las reservas suben en el corto plazo</span>, pero <span class="mm-bad">la deuda total aumenta y el riesgo a largo plazo crece</span>. Es un puente, no una solución.' },
      { slot: 'gabinete', text: 'Buscar financiamiento por fuera del FMI <span class="mm-good">nos da autonomía política</span>, pero <span class="mm-bad">tensiona la relación con Washington y los organismos multilaterales</span>. Si conseguimos el dinero sin condicionamientos excesivos, <span class="mm-good">la confianza interna sube</span> porque la ciudadanía valora la independencia. El riesgo es que la señal sea leída como una ruptura con el sistema financiero internacional.' },
    ],
  ],

  // ── EVENTO 22: Espionaje Ilegal a Periodistas ─────────────────
  22: [
    // Opción 0: Intervenir AFI, colaborar con la Justicia
    [
      { slot: 'gabinete', text: 'Colaborar con la Justicia es la única salida que <span class="mm-good">protege la gobernabilidad a largo plazo</span>. <span class="mm-bad">Los escándalos de espionaje que se tapan terminan siendo peores</span> — el caso Watergate lo enseñó. <span class="mm-good">La confianza va a recuperarse</span> si la intervención de la AFI es real y visible. La ciudadanía distingue a quien asume los errores de quien los niega.' },
    ],
    // Opción 1: Calificar como montaje
    [
      { slot: 'gabinete', text: 'Negar el espionaje cuando hay evidencia es <span class="mm-bad">el camino más peligroso</span>. <span class="mm-bad">La confianza va a colapsar</span> porque los audios son verificables. Los organismos internacionales de libertad de prensa ya están monitoreando el caso. <span class="mm-bad">El riesgo país va a subir</span> porque los inversores leen este tipo de escándalo como señal de fragilidad institucional. No hay forma de contener esto sin transparencia.' },
    ],
    // Opción 2: Despedir al director como chivo expiatorio
    [
      { slot: 'gabinete', text: 'El chivo expiatorio <span class="mm-good">aplaca el escándalo en el corto plazo</span>, pero <span class="mm-bad">no cierra la investigación judicial</span>. Si el fiscal sigue tirando del hilo y aparece más evidencia, el costo político será el doble. <span class="mm-good">Es mejor que negar todo</span>, pero mucho peor que asumir la responsabilidad institucional completa. Dejamos la puerta abierta para que el problema regrese.' },
    ],
  ],

  // ── EVENTO 23: Crisis Presupuestaria Universitaria ────────────
  23: [
    // Opción 0: Actualizar 100% de la inflación
    [
      { slot: 'social', text: 'Las universidades nacionales son la <b>columna vertebral del ascenso social</b>. <span class="mm-good">Actualizar el presupuesto al 100% de la inflación estabiliza a los investigadores, frena la emigración y recupera la confianza del movimiento estudiantil</span>. Sí, <span class="mm-bad">la deuda sube</span>, pero la inversión en ciencia tiene retorno a 10 años. Sin universidades fuertes, la trampa de la pobreza se vuelve estructural.' },
      { slot: 'economia', text: 'El impacto fiscal es real pero manejable: <span class="mm-bad">la deuda sube unos puntos</span>, pero <span class="mm-good">el capital humano formado en universidades públicas es el activo más rentable del Estado a largo plazo</span>. Cada investigador que se va al exterior es una pérdida de décadas de inversión pública. Recomiendo esta opción si podemos financiarla con instrumentos de deuda interna de largo plazo.' },
    ],
    // Opción 1: Aumento 60% con auditoría
    [
      { slot: 'social', text: 'El 60% con auditoría es un <b>equilibrio difícil</b>: <span class="mm-good">alivia la urgencia sin la presión fiscal máxima</span>, pero <span class="mm-bad">los docentes e investigadores van a estar disconformes</span> porque la actualización real no alcanza. La condición de auditoría puede ser razonable si se formula con las universidades, no contra ellas. <span class="mm-good">La confianza sube moderadamente</span>.' },
      { slot: 'gabinete', text: 'La auditoría de eficiencia tiene sentido si se hace bien: <span class="mm-good">transparenta el gasto y legitima la inversión</span>. El riesgo es que las universidades la vean como una amenaza a su autonomía, <span class="mm-bad">generando más conflicto político del que resuelve</span>. Hay que diseñar la auditoría de forma participativa con los rectorados para que sea una herramienta de mejora, no de control.' },
    ],
    // Opción 2: Mantener el presupuesto actual
    [
      { slot: 'social', text: '<span class="mm-bad">Congelar el presupuesto universitario en términos reales equivale a un recorte del 47%</span>. Los docentes van a irse, los laboratorios van a cerrar y los estudiantes van a percibir que el Estado abandonó la educación pública. <span class="mm-bad">La confianza va a caer significativamente</span> y la marcha universitaria puede convertirse en la movilización más grande del mandato. El ajuste en universidades tiene el costo político más alto.' },
    ],
  ],

  // ── EVENTO 24: Cosecha Récord / Campo no liquida ──────────────
  24: [
    // Opción 0: Dólar soja (tipo de cambio diferencial)
    [
      { slot: 'economia', text: 'El <b>dólar diferencial</b> funciona: lo hemos visto en experiencias previas. <span class="mm-good">Las reservas pueden subir más de 10 puntos en pocas semanas</span>, lo que nos da aire para manejar el tipo de cambio oficial. El costo es <span class="mm-bad">inflacionario</span> porque hay más pesos en la economía y <span class="mm-bad">el efecto se agota en pocas semanas</span>. Es una solución de liquidez, no de largo plazo.' },
      { slot: 'produccion', text: 'Los productores van a liquidar con el diferencial porque tienen incentivo concreto. <span class="mm-good">La producción sube, el desempleo baja y hay dinamismo económico en el interior</span>. Pero <span class="mm-bad">los sectores industriales que dependen del dólar oficial van a quejarse</span> por la mayor brecha cambiaria. Recomiendo comunicar que es una medida temporal con fecha de vencimiento clara.' },
    ],
    // Opción 1: Bajar retenciones 5 puntos
    [
      { slot: 'economia', text: 'Bajar retenciones de manera permanente <span class="mm-good">genera más divisas ahora y en el futuro</span>, pero <span class="mm-bad">resigna ingresos fiscales para siempre</span>. Cada punto de retenciones equivale a miles de millones de pesos de recaudación anual. <span class="mm-good">El campo va a liquidar, las reservas suben y la producción mejora</span>. El riesgo es fiscal: sin esa recaudación, el déficit se agranda.' },
      { slot: 'produccion', text: '<span class="mm-good">Una baja permanente de retenciones da previsibilidad al productor</span> — que es el mayor reclamo histórico del sector. <span class="mm-good">La producción agropecuaria se incentiva structuralmente</span> y el empleo rural mejora. El debate de fondo es distributivo: las retenciones son el principal mecanismo por el que el agro aporta al financiamiento del Estado social.' },
    ],
    // Opción 2: No ceder, esperar liquidación natural
    [
      { slot: 'economia', text: 'Sostener las retenciones es <span class="mm-good">preservar la recaudación</span>, pero <span class="mm-bad">el campo va a seguir reteniendo soja</span> y las reservas no van a mejorar. Si la situación de reservas es crítica, esperar puede ser muy costoso. <span class="mm-bad">La brecha cambiaria puede aumentar</span> y generar más presión inflacionaria que la que evitamos al no dar el dólar diferencial.' },
    ],
  ],

  // ── EVENTO 25: Ciberataque a Infraestructura del Estado ───────
  25: [
    // Opción 0: No pagar, contratar empresa internacional
    [
      { slot: 'gabinete', text: 'No pagar el rescate es la posición correcta en principio: <span class="mm-good">pagar incentiva nuevos ataques</span>. Pero <span class="mm-bad">los sistemas críticos van a estar caídos días o semanas</span>, y eso significa que millones de ciudadanos no pueden cobrar pensiones, acceder a turnos médicos ni hacer trámites. Hay que ser honesto con la ciudadanía sobre el tiempo de recuperación y activar planes de contingencia manuales.' },
      { slot: 'produccion', text: 'La <b>soberanía digital</b> se defiende no cediendo ante extorsiones. <span class="mm-bad">El daño económico es significativo a corto plazo</span> — producción cae porque los sistemas de comercio exterior y los registros aduaneros también están afectados. Pero <span class="mm-good">contratar expertos internacionales genera know-how local</span> si exigimos transferencia tecnológica como parte del contrato.' },
    ],
    // Opción 1: Pagar el rescate
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Pagar el rescate resuelve la urgencia pero destruye nuestra posición para el futuro</span>. <span class="mm-bad">El riesgo país sube porque muestra que el Estado es extorsionable</span>. Otros grupos van a intentar lo mismo. La ciudadanía cuando se entere — y se va a enterar — va a ver esto como una derrota. Es la opción que parece más rápida pero deja las peores consecuencias.' },
    ],
    // Opción 2: Crear Agencia Nacional de Ciberseguridad
    [
      { slot: 'produccion', text: 'Crear la <b>Agencia Nacional de Ciberseguridad</b> es <span class="mm-good">convertir la crisis en una oportunidad de largo plazo</span>. <span class="mm-good">La confianza institucional sube</span> porque se muestra capacidad de respuesta estratégica. <span class="mm-good">El desempleo baja porque se genera un nuevo sector público de alta calificación</span>. El costo inmediato es mayor pero el retorno en soberanía digital es invaluable.' },
      { slot: 'gabinete', text: 'Esta opción <span class="mm-good">posiciona al gobierno como proactivo</span> — no solo reactivo. <span class="mm-bad">A corto plazo los sistemas siguen caídos mientras se organiza la agencia</span>, por lo que necesitamos un plan de contingencia paralelo. <span class="mm-good">A mediano plazo, la Argentina puede exportar know-how de ciberseguridad a la región</span>, que es un activo estratégico real.' },
    ],
  ],

  // ── EVENTO 26: Propuesta de Dolarización Total ────────────────
  26: [
    // Opción 0: Apoyar la dolarización completa
    [
      { slot: 'economia', text: '<span class="mm-good">La dolarización elimina la inflación crónica</span> — ese es su principal atractivo. Pero el costo es brutal: <span class="mm-bad">se necesitan dólares suficientes para respaldar toda la base monetaria y las reservas no alcanzan</span>. Sin moneda propia, perdemos el instrumento para responder a shocks externos: no podemos devaluar, emitir ni bajar tasas. <span class="mm-bad">El desempleo y la pobreza subirán fuerte durante la transición</span>.' },
      { slot: 'gabinete', text: 'El 60% de apoyo ciudadano a la dolarización es real, pero refleja el hartazgo con la inflación, no un análisis de los costos. <span class="mm-bad">Si la dolarización sale mal — y Ecuador tardó décadas en ajustarse — el costo político es el fin del mandato</span>. <span class="mm-good">La confianza inicial sube</span>, pero hay que prepararse para una recesión de ajuste que puede durar años.' },
    ],
    // Opción 1: Bimonetarismo controlado
    [
      { slot: 'economia', text: 'El <b>bimonetarismo</b> es un camino intermedio: <span class="mm-good">baja la inflación significativamente sin la brutalidad del ajuste dolarizador completo</span>. Permite que el mercado elija la moneda según la transacción. <span class="mm-bad">La transición tiene costos en empleo y reservas</span>, pero son menores que la dolarización pura. Es el modelo que más países con inflación crónica terminan usando como paso previo.' },
    ],
    // Opción 2: Rechazar la dolarización
    [
      { slot: 'economia', text: 'Defender la soberanía monetaria es correcto en principio: <span class="mm-good">el Banco Central es el instrumento de política económica ante shocks externos</span>. Pero sin credibilidad anti-inflacionaria, la soberanía monetaria solo significa derecho a emitir sin límites. <span class="mm-bad">El riesgo país sube porque los mercados leen el rechazo como falta de plan</span>. Necesitamos un programa de estabilización creíble en paralelo.' },
    ],
    // Opción 3: Convocar referéndum
    [
      { slot: 'gabinete', text: 'El referéndum <span class="mm-good">es políticamente inteligente: delega la decisión a la ciudadanía y gana tiempo para preparar argumentos</span>. <span class="mm-good">La confianza sube porque se percibe como ejercicio democrático</span>. El riesgo: <span class="mm-bad">6 meses de incertidumbre pueden ser costosos para la economía</span>. Hay que acotar el debate con información técnica de calidad para que el voto sea informado.' },
    ],
  ],

  // ── EVENTO 27: Oleada de Femicidios ──────────────────────────
  27: [
    // Opción 0: Ley de Emergencia con 200 refugios
    [
      { slot: 'social', text: 'La <b>Ley de Emergencia</b> es la respuesta que la magnitud del problema exige. <span class="mm-good">Triplicar el presupuesto y crear 200 refugios reduce directamente la pobreza y la desocupación</span> — las cuidadoras y trabajadoras de los refugios son empleo genuino. <span class="mm-good">La confianza sube fuerte</span> porque el Estado demuestra que la vida de las mujeres es una prioridad política, no un slogan.' },
      { slot: 'gabinete', text: '<span class="mm-good">Esta decisión posiciona al gobierno en el lado correcto de la historia</span>. El movimiento feminista tiene una capacidad de movilización enorme y puede ser aliado estratégico si el gobierno actúa con convicción. <span class="mm-bad">El costo fiscal existe</span>, pero <span class="mm-good">el retorno en confianza y cohesión social supera la inversión</span>. Hay que coordinar con las provincias para que los recursos lleguen a las localidades más alejadas.' },
    ],
    // Opción 1: Reforzar el sistema judicial
    [
      { slot: 'social', text: '<span class="mm-good">Los fiscales especializados y la protección de víctimas salvan vidas concretas</span>. La Justicia es el primer eslabón de la cadena de protección. <span class="mm-good">La pobreza y el desempleo bajan levemente</span> porque se crean empleos judiciales y de acompañamiento social. Es una inversión más focalizada que la ley de emergencia, con impacto directo y visible.' },
    ],
    // Opción 2: Comprometerse sin fondos
    [
      { slot: 'social', text: '<span class="mm-bad">Prometer sin fondos es la peor respuesta posible en este contexto</span>. El movimiento feminista tiene muy claro la diferencia entre anuncios y políticas reales. <span class="mm-bad">La confianza caerá</span> porque la ciudadanía leerá esto como una respuesta vacía ante una tragedia concreta. El costo político de no actuar en este momento es altísimo y difícil de recuperar.' },
    ],
  ],

  // ── EVENTO 28: Corrida Bancaria ───────────────────────────────
  28: [
    // Opción 0: Garantizar todos los depósitos
    [
      { slot: 'economia', text: 'Garantizar todos los depósitos es <span class="mm-good">la única forma de cortar el pánico bancario de raíz</span>. El <b>corralito del 2001</b> enseñó que la media tinta en crisis financieras es peor que la acción contundente. <span class="mm-bad">El costo en deuda y reservas es enorme</span>, pero <span class="mm-good">la confianza se recupera rápido porque la gente ve que su dinero está seguro</span>. Cada hora de pánico que cortamos vale más que días de recuperación.' },
      { slot: 'gabinete', text: 'Esta es una <b>decisión de Estado</b> que va más allá de la política partidaria. <span class="mm-good">El sistema bancario protegido es la columna vertebral de la economía</span>. Si cae, todo cae. <span class="mm-bad">El costo inflacionario es real</span>, pero la alternativa — un colapso sistémico — es incomparablemente peor. Necesitamos coordinar el anuncio con el Banco Central para que el mensaje sea unívoco y contundente.' },
    ],
    // Opción 1: Rescate selectivo (pequeños ahorristas)
    [
      { slot: 'economia', text: 'El rescate selectivo <span class="mm-good">protege a los más vulnerables con menor costo fiscal</span>. Los grandes depositantes tienen más herramientas para diversificar riesgos. <span class="mm-bad">El riesgo es que los depositantes medianos no se sientan cubiertos y sigan retirando</span>, extendiendo la corrida. La comunicación del límite de $10 millones debe ser muy precisa para no generar más incertidumbre.' },
    ],
    // Opción 2: Solicitar prestamista de última instancia
    [
      { slot: 'economia', text: 'Acudir al FMI o los bancos de desarrollo <span class="mm-good">nos da reservas sin emitir, lo que reduce el impacto inflacionario</span>. <span class="mm-good">El riesgo país baja porque hay una red de seguridad externa</span>. El costo es que los desembolsos tienen condicionalidades y <span class="mm-bad">la deuda externa sube significativamente</span>. Es la opción más ordenada si tenemos crédito suficiente con esos organismos.' },
    ],
  ],

  // ── EVENTO 29: Emergencia en Barrios Populares ───────────────
  29: [
    // Opción 0: Plan Nacional de Urbanización
    [
      { slot: 'social', text: 'El <b>Plan Nacional de Urbanización</b> es la única respuesta que ataca las causas y no solo los síntomas. <span class="mm-good">Agua potable y cloacas en 18 meses pueden reducir la mortalidad infantil a la mitad en esas zonas</span>. <span class="mm-good">La pobreza baja 8 puntos, el desempleo 5 — es de las decisiones con mayor impacto social por peso invertido</span>. El costo en deuda es alto pero completamente justificado.' },
      { slot: 'produccion', text: '<span class="mm-good">Las obras de urbanización son empleo real, inmediato y local</span>: albañiles, electricistas, plomeros de los propios barrios. <span class="mm-good">El desempleo baja 5 puntos y la producción sube</span> porque el gasto en materiales dinamiza la industria regional. Es de las pocas inversiones que tienen retorno económico, social y político al mismo tiempo.' },
    ],
    // Opción 1: Reforzar atención primaria
    [
      { slot: 'social', text: 'Los <b>médicos comunitarios</b> son el primer escudo de la salud pública. <span class="mm-good">Llegan donde los hospitales no pueden llegar</span> y tienen capacidad de detección temprana que salva vidas. <span class="mm-good">La pobreza baja 4 puntos y la confianza sube</span>. Es una medida con impacto rápido y costo menor que la urbanización integral. No resuelve el problema estructural pero sí salva vidas en el corto plazo.' },
    ],
    // Opción 2: Diagnóstico a largo plazo
    [
      { slot: 'social', text: '<span class="mm-bad">Crear un comité de expertos cuando los niños están muriendo es políticamente insostenible</span>. <span class="mm-bad">La confianza cae y la pobreza sube</span> porque no hay ninguna acción concreta. Las imágenes que recorren el mundo ya crearon una expectativa de respuesta inmediata. Un comité puede ser útil en paralelo a la acción, pero <span class="mm-bad">nunca como reemplazo</span> de la misma.' },
    ],
  ],

  // ── EVENTO 30: Colapso del Mercado de Alquileres ─────────────
  30: [
    // Opción 0: Ley pro-inquilino con CER
    [
      { slot: 'social', text: '<span class="mm-good">La ley de alquileres reduce la pobreza 4 puntos</span> porque las familias dejan de destinar el 70% de sus ingresos a la vivienda. <span class="mm-good">La confianza sube 8 puntos</span> porque hay una respuesta concreta al drama habitacional. <span class="mm-bad">Los propietarios van a quejarse</span>, pero la evidencia comparada muestra que los contratos más largos en realidad estabilizan el mercado y reducen la rotación.' },
      { slot: 'economia', text: 'La regulación de alquileres <span class="mm-good">reduce levemente la inflación porque el rubro vivienda pesa mucho en la canasta</span>. El riesgo es que algunos propietarios retiren inmuebles del mercado, <span class="mm-bad">reduciendo la oferta y subiendo los precios en el segmento no regulado</span>. Hay que acompañar la ley con incentivos fiscales para propietarios que mantengan sus propiedades alquiladas.' },
    ],
    // Opción 1: Plan Nacional de Vivienda Pública
    [
      { slot: 'social', text: '<b>200.000 viviendas en 2 años</b> es el impacto más transformador posible: <span class="mm-good">la pobreza baja 6 puntos y el desempleo 7</span>. La vivienda pública es la solución estructural que el mercado por sí solo nunca va a proveer. <span class="mm-good">La confianza sube 10 puntos</span> porque la ciudadanía ve obras concretas. El costo en deuda es alto, pero <span class="mm-good">la construcción es el sector con mayor efecto multiplicador sobre el resto de la economía</span>.' },
      { slot: 'produccion', text: 'La construcción masiva de viviendas <span class="mm-good">dinamiza toda la cadena productiva: cemento, acero, madera, electricidad, plomería</span>. <span class="mm-good">El desempleo baja 7 puntos y la producción sube 5</span>. Es la política anticíclica más efectiva que existe: en épocas de recesión, construir viviendas públicas genera empleo donde más se necesita.' },
    ],
    // Opción 2: Incentivos al mercado
    [
      { slot: 'economia', text: 'Los incentivos fiscales a propietarios <span class="mm-good">no generan deuda pública y pueden aumentar la oferta de alquileres</span>. <span class="mm-bad">El impacto en pobreza es menor</span> porque beneficia principalmente a propietarios de clase media. Es una solución de mercado que funciona en economías estables, pero en Argentina, donde la inflación erosiona los contratos, <span class="mm-bad">el efecto puede ser insuficiente</span>.' },
    ],
  ],

  // ── EVENTO 31: Petróleo Offshore Patagónico ──────────────────
  31: [
    // Opción 0: Explotar a máxima velocidad
    [
      { slot: 'produccion', text: '<span class="mm-good">Los números son extraordinarios: reservas de 4.000 millones de barriles pueden transformar la estructura económica del país</span>. <span class="mm-good">La producción sube 10 puntos, el desempleo cae 5, las reservas internacionales se disparan</span>. El riesgo ambiental existe pero es gestionable con tecnología moderna. <span class="mm-bad">La aceleración sin controles puede generar un daño ecológico que destruya el turismo patagónico</span>.' },
      { slot: 'economia', text: 'USD 20.000 millones anuales en divisas <span class="mm-good">resuelven el problema de reservas estructuralmente</span>. <span class="mm-good">La deuda baja, el riesgo país cae y la pobreza se reduce</span> con los recursos que llegan al fisco. El debate real es de timing: si aceleramos sin los controles adecuados y hay un derrame, el costo legal y reputacional puede superar las ganancias.' },
    ],
    // Opción 1: Explotar con evaluación ambiental rigurosa
    [
      { slot: 'produccion', text: 'La <b>EIA rigurosa</b> es el camino correcto: <span class="mm-good">maximiza las ganancias a largo plazo porque protege el activo ambiental que también tiene valor económico</span>. El turismo, la pesca y la imagen internacional del país son activos que vale la pena proteger. <span class="mm-good">La producción y el empleo suben igual, pero a ritmo sostenible</span>. Los inversores serios prefieren este esquema porque reduce el riesgo de litigios futuros.' },
      { slot: 'social', text: 'Las <b>comunidades costeras</b> necesitan ser parte del proceso. <span class="mm-good">La confianza sube 8 puntos</span> porque se percibe que el desarrollo no viene a costa de destruir el entorno. <span class="mm-good">La pobreza baja</span> con los empleos generados. El proceso de EIA también crea empleo calificado en monitoreo y gestión ambiental.' },
    ],
    // Opción 2: Declarar Reserva Marina
    [
      { slot: 'produccion', text: 'Preservar el ecosistema es una decisión válida con <span class="mm-good">alto retorno en confianza y en preservación de activos naturales de largo plazo</span>. <span class="mm-bad">Las reservas internacionales se resienten</span> porque perdemos las divisas potenciales. <span class="mm-good">El turismo ecológico puede crecer</span>, pero tarda décadas en compensar el valor del petróleo. Es una apuesta por las generaciones futuras que tiene costos presentes reales.' },
    ],
  ],

  // ── EVENTO 32: Multinacional Farmacéutica Demanda al Estado ──
  32: [
    // Opción 0: Litigar en el CIADI
    [
      { slot: 'gabinete', text: '<span class="mm-good">Litigar es defender la soberanía sanitaria con todas las herramientas legales disponibles</span>. Argentina tiene buenos argumentos: el TRIPS permite excepciones por salud pública. <span class="mm-good">La confianza sube porque se percibe que el Estado defiende el interés nacional</span>. <span class="mm-bad">El proceso puede durar años y el riesgo de perder es real</span>. Necesitamos los mejores abogados internacionales especializados en arbitraje de inversiones.' },
      { slot: 'social', text: '<span class="mm-good">Mantener la ley es proteger a 200.000 pacientes que dependen de medicamentos accesibles</span>. <span class="mm-good">La pobreza baja porque el acceso a medicamentos es un determinante directo de la pobreza sanitaria</span>. El costo legal existe pero es menor que renunciar a la política de producción local que puede beneficiar a toda la región.' },
    ],
    // Opción 1: Acuerdo extrajudicial
    [
      { slot: 'economia', text: 'Un acuerdo extrajudicial <span class="mm-good">cierra la incertidumbre jurídica a menor costo</span>. <span class="mm-bad">La deuda sube por la compensación</span>, pero <span class="mm-good">evitamos el riesgo de una sentencia de USD 4.000 millones</span> que sería impagable. La clave es mantener la ley vigente como condición innegociable del acuerdo. Sin eso, el acuerdo es una derrota disfrazada.' },
    ],
    // Opción 2: Derogar la ley
    [
      { slot: 'social', text: '<span class="mm-bad">Derogar la ley es capitular ante la presión corporativa a costa de la salud de 200.000 personas</span>. <span class="mm-bad">La pobreza sube 5 puntos porque los medicamentos suben inmediatamente</span>. <span class="mm-bad">La confianza cae 9 puntos</span> porque la ciudadanía percibe que el Estado eligió a la multinacional sobre los pacientes. Esta decisión puede definir negativamente toda la gestión.' },
    ],
  ],

  // ── EVENTO 33: Debate por el Nuevo Currículum Escolar ────────
  33: [
    // Opción 0: Reforma completa con ESI obligatoria
    [
      { slot: 'social', text: 'La <b>ESI obligatoria</b> tiene evidencia sólida: <span class="mm-good">reduce el embarazo adolescente, la violencia de género en las escuelas y la desinformación</span>. El pensamiento computacional y la educación financiera preparan a los jóvenes para el mundo real. <span class="mm-bad">Los docentes de humanidades van a resistir</span>, pero el currículum necesita actualizarse. La filosofía puede integrarse como perspectiva transversal.' },
      { slot: 'produccion', text: '<span class="mm-good">Incorporar pensamiento computacional y educación financiera es invertir en el capital humano que la economía del siglo XXI necesita</span>. <span class="mm-good">La producción mejora a largo plazo</span> porque los egresados tienen habilidades aplicables. <span class="mm-good">El desempleo baja</span> porque los jóvenes son más empleables. La resistencia inicial es esperable en toda reforma educativa.' },
    ],
    // Opción 1: Reforma parcial sin eliminar humanidades
    [
      { slot: 'social', text: 'La reforma parcial <span class="mm-good">agrega valor sin destruir lo que funciona</span>. La filosofía y el arte tienen un rol irreemplazable en la formación de ciudadanos críticos — no son materias prescindibles. <span class="mm-good">La confianza sube más que con la reforma total</span> porque hay consenso más amplio. Es el equilibrio más sustentable políticamente.' },
      { slot: 'gabinete', text: '<span class="mm-good">La reforma parcial minimiza el conflicto docente y eclesial</span>. Podemos implementarla sin huelgas, lo que la hace más probable de sostenerse. <span class="mm-bad">El costo fiscal es algo mayor</span> porque no hay eliminación de materias que compense el costo de las nuevas, pero <span class="mm-good">la implementación exitosa vale más que la reforma perfecta que nunca se concreta</span>.' },
    ],
    // Opción 2: Suspender la reforma
    [
      { slot: 'social', text: '<span class="mm-bad">Suspender por presión política es la señal más negativa para el sistema educativo</span>: muestra que cualquier grupo de presión puede bloquear reformas necesarias. <span class="mm-bad">La confianza baja levemente</span> y el rezago educativo continúa. Si vamos a suspender, al menos hay que comunicar una hoja de ruta con plazos concretos para retomar el debate.' },
    ],
  ],

  // ── EVENTO 34: Crisis de Refugiados en la Frontera ───────────
  34: [
    // Opción 0: Programa de integración plena
    [
      { slot: 'social', text: 'La integración plena es la <b>opción más humana y más eficiente a largo plazo</b>. <span class="mm-good">Los migrantes documentados pagan impuestos, contribuyen a la seguridad social y llenan vacantes que el mercado no cubre</span>. <span class="mm-bad">El desempleo sube levemente en el corto plazo</span> por la mayor oferta laboral, pero <span class="mm-good">la producción crece porque hay más trabajadores formales</span>. Argentina fue históricamente un país de inmigrantes y prosperó por eso.' },
      { slot: 'gabinete', text: '<span class="mm-good">La integración rápida evita la formación de guetos y reduce la xenofobia</span>. <span class="mm-good">La confianza sube</span> porque la ciudadanía más solidaria celebra la respuesta humanitaria. El riesgo político es que sectores más conservadores lo usen como bandera, pero <span class="mm-good">los datos históricos muestran que los países que integran bien a los migrantes tienen mejor desempeño económico a 10 años</span>.' },
    ],
    // Opción 1: Campos de refugiados
    [
      { slot: 'social', text: 'Los campos de refugiados son una solución de emergencia, no una política. <span class="mm-good">Proveen asistencia inmediata y evitan la dispersión desordenada</span>, pero <span class="mm-bad">si se prolongan, generan marginación, tensiones sociales y costos crecientes</span>. Tiene sentido como medida de las primeras semanas mientras se organiza un programa de integración real.' },
    ],
    // Opción 2: Cierre de fronteras
    [
      { slot: 'gabinete', text: '<span class="mm-bad">El cierre de fronteras viola los compromisos internacionales de Argentina en materia de refugiados</span> y puede generar sanciones diplomáticas. <span class="mm-bad">El riesgo país sube</span> porque los inversores valoran la estabilidad institucional. <span class="mm-bad">La producción cae</span> porque los flujos comerciales fronterizos se interrumpen. Es una señal de cierre que tiene costos económicos y reputacionales desproporcionados.' },
    ],
  ],

  // ── EVENTO 35: Corte de Suministro de Gas Importado ──────────
  35: [
    // Opción 0: Pagar la deuda y reanudar el suministro
    [
      { slot: 'produccion', text: 'Pagar la deuda es la única forma de <span class="mm-good">evitar el colapso industrial en pleno invierno</span>. <span class="mm-bad">Las reservas caen significativamente</span>, pero <span class="mm-good">la producción se recupera rápido porque las industrias pueden operar</span>. El costo de no pagar — industrias paradas, desempleo creciente, protestas sociales — es mucho mayor que el desembolso en divisas. Una vez normalizado el suministro, hay que renegociar la deuda de gas con mejores condiciones.' },
      { slot: 'economia', text: 'El análisis costo-beneficio es claro: <span class="mm-bad">USD 600 millones en reservas duele</span>, pero <span class="mm-bad">10 días de industria al 50% y hogares sin calefacción en invierno generan un daño social y económico imposible de medir</span>. <span class="mm-good">La confianza se preserva porque el Estado demuestra capacidad de resolver crisis energéticas</span>. Hay que negociar en paralelo la diversificación de proveedores.' },
    ],
    // Opción 1: Proveedores alternativos en mercado spot
    [
      { slot: 'produccion', text: 'El mercado spot internacional de GNL <span class="mm-good">nos da independencia del proveedor habitual</span>, pero <span class="mm-bad">los precios de emergencia son dos o tres veces más altos</span>. <span class="mm-bad">Las reservas caen más que pagando la deuda</span> porque los contratos spot tienen sobrecostos. <span class="mm-good">La producción se sostiene parcialmente</span>. Es mejor que el racionamiento pero más caro que pagar directamente.' },
    ],
    // Opción 2: Racionamiento
    [
      { slot: 'produccion', text: 'El racionamiento <span class="mm-bad">destruye la producción industrial: -4 puntos en el indicador</span>. Las empresas que no pueden producir despiden empleados o reducen horas. <span class="mm-bad">La pobreza sube porque los hogares más vulnerables son los más afectados por los cortes</span>. Solo tiene sentido si no hay ninguna alternativa de financiamiento o provisión disponible. Es la última opción.' },
      { slot: 'social', text: '<span class="mm-bad">Cortar calefacción en invierno en zonas con -5°C tiene consecuencias sanitarias graves</span>: hipotermia en adultos mayores, enfermedades respiratorias en niños. <span class="mm-bad">La pobreza sube 3 puntos y el desempleo sube</span>. <span class="mm-bad">La confianza cae fuerte</span> porque la ciudadanía espera que el Estado garantice servicios básicos, especialmente en emergencias.' },
    ],
  ],


  // ── EVENTO 36: Licitación Vial Manipulada ────────────────────
  36: [
    // Opción 0: Anular, remover y entregar a la justicia
    [
      { slot: 'gabinete', text: 'Esta es la decisión más difícil y la más correcta. <span class="mm-good">Remover a un familiar y entregarlo a la justicia es el acto de mayor integridad que puede hacer un gobierno</span>. <span class="mm-good">La confianza sube 16 puntos</span> porque la ciudadanía ve que nadie está por encima de la ley, ni el círculo íntimo del presidente. Este acto puede definir positivamente toda la gestión.' },
    ],
    // Opción 1: Relicitar sin investigar
    [
      { slot: 'gabinete', text: '<span class="mm-good">Relicitar transparentemente limpia el proceso</span>, pero <span class="mm-bad">no investigar el caso anterior deja la impresión de encubrimiento parcial</span>. Los periodistas de investigación van a seguir tirando del hilo. <span class="mm-good">La confianza mejora algo</span> porque hay una acción concreta, pero el caso no se cierra aquí. En algún momento va a volver.' },
    ],
    // Opción 2: Defender la licitación y bloquear la investigación
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Bloquear una investigación judicial es un error gravísimo</span>: se configura obstrucción a la Justicia y se expone al gobierno a acusaciones de encubrimiento con evidencia sólida. <span class="mm-bad">La confianza colapsa -20 puntos</span>. Los mercados, los organismos internacionales y la prensa van a leer esto como una señal de que la corrupción tiene protección institucional en el más alto nivel.' },
    ],
  ],

  // ── EVENTO 37: Reforma del Estado ────────────────────────────
  37: [
    // Opción 0: Reducción drástica con despidos
    [
      { slot: 'gabinete', text: 'La reducción drástica <span class="mm-good">genera señal fiscal muy fuerte y baja el riesgo país</span>, pero <span class="mm-bad">el costo humano es enorme: el desempleo sube 4 puntos</span>. Los empleados públicos despedidos tienen familias que dependen de ese ingreso. <span class="mm-bad">La confianza cae 7 puntos</span> porque el Estado pierde legitimidad como garante del bienestar social. Es la señal de austeridad más agresiva y la más costosa en términos políticos.' },
      { slot: 'economia', text: '<span class="mm-good">El ahorro fiscal es real: la deuda baja 5 puntos y las reservas suben</span>. Pero hay que ser honestos: <span class="mm-bad">el corto plazo es muy doloroso</span> y la eficiencia no mejora automáticamente con menos empleados si los procesos no se rediseñan. El Estado eficiente no es necesariamente el Estado pequeño.' },
    ],
    // Opción 1: Reforma gradual sin despidos
    [
      { slot: 'gabinete', text: 'La reforma gradual <span class="mm-good">evita el conflicto social abierto y permite una transición ordenada</span>. <span class="mm-good">El riesgo país baja</span> porque hay señal de racionalización sin shock. <span class="mm-bad">El impacto fiscal es menor</span>, pero es sostenible políticamente. Las jubilaciones y pases voluntarios permiten reducir el plantel sin generar desamparo.' },
    ],
    // Opción 2: Modernización digital
    [
      { slot: 'produccion', text: 'La <b>digitalización del Estado</b> es la reforma más inteligente: <span class="mm-good">mejora la calidad del servicio sin destruir empleo</span>. <span class="mm-good">La producción mejora porque los trámites empresariales se agilizan</span> y el tiempo de respuesta del Estado baja. <span class="mm-good">El desempleo baja levemente</span> porque se crean empleos en tecnología del sector público. Es la reforma con mejor relación costo-beneficio.' },
      { slot: 'gabinete', text: '<span class="mm-good">Modernizar sin despidos es políticamente sustentable</span>: los sindicatos de empleados públicos no van a oponerse a la digitalización si no implica pérdida de empleos. <span class="mm-good">La confianza sube</span> porque los ciudadanos valoran la mejora en la calidad de los servicios. Es una reforma que se puede mostrar como logro de gestión.' },
    ],
    // Opción 3: No reformar
    [
      { slot: 'gabinete', text: 'No reformar <span class="mm-good">evita el conflicto gremial y preserva los empleos</span>, pero <span class="mm-bad">el déficit continúa y el riesgo a largo plazo crece</span>. <span class="mm-good">La desocupación baja levemente</span> porque el Estado sigue siendo empleador. La decisión de no actuar también tiene consecuencias: en algún momento la presión fiscal obligará a una reforma, posiblemente en peores condiciones.' },
    ],
  ],

  // ── EVENTO 38: Motín Carcelario ──────────────────────────────
  38: [
    // Opción 0: Reforma penal integral
    [
      { slot: 'social', text: 'El 65% de presos en prisión preventiva sin condena firme es <b>una violación masiva de derechos fundamentales</b>. <span class="mm-good">Las tobilleras y el juicio abreviado descomprimen el sistema sin soltar a los peligrosos</span>. <span class="mm-good">La pobreza y el desempleo bajan</span> porque muchos detenidos preventivos son personas de bajo ingreso que podrían sostenerse en libertad con monitoreo. La reforma penal es también política social.' },
      { slot: 'gabinete', text: 'La reforma penal <span class="mm-good">posiciona al gobierno del lado del Estado de Derecho</span> y los organismos internacionales. El <b>Comité de la ONU</b> ya emitió un informe lapidario — no actuar tiene costo diplomático. <span class="mm-good">El riesgo país baja</span> porque el respeto a los derechos humanos en las cárceles es un indicador de gobernabilidad para los inversores institucionales.' },
    ],
    // Opción 1: Construir nuevas cárceles
    [
      { slot: 'produccion', text: 'Construir cárceles <span class="mm-good">genera empleo en construcción y reduce el hacinamiento</span>. Es una solución más aceptada políticamente que la reforma penal. <span class="mm-bad">Sin embargo, no resuelve el problema de fondo</span>: si seguimos encarcelando preventivamente al mismo ritmo, las cárceles nuevas también se llenarán. Es necesario como parte de un paquete más amplio.' },
    ],
    // Opción 2: Mano dura sin reforma
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Más fuerzas sin reforma de fondo no resuelve el hacinamiento</span>: solo aumenta el control de un sistema que ya está colapsado. <span class="mm-bad">La confianza baja</span> porque la ciudadanía que tiene información percibe que no hay plan real. Los organismos de derechos humanos van a intensificar las denuncias internacionales.' },
    ],
  ],

  // ── EVENTO 39: Nuevo Brote de Influenza Aviar ────────────────
  39: [
    // Opción 0: Cierre de fronteras y cuarentena
    [
      { slot: 'social', text: 'Con solo 12 casos detectados, actuar rápido puede <span class="mm-good">evitar una pandemia masiva</span>. El cierre preventivo <span class="mm-bad">tiene un costo económico alto</span>, pero la experiencia de 2020 mostró que cerrar tarde cuesta mucho más. <span class="mm-good">Si cortamos la transmisión ahora, la vida social y económica puede normalizarse en semanas</span>. Cada día de demora multiplica los contagios.' },
      { slot: 'economia', text: '<span class="mm-bad">El impacto económico del cierre es real: el desempleo sube 6 puntos y la producción cae 8</span>. Pero el análisis de costo-beneficio de la pandemia de 2020 es claro: <span class="mm-good">los países que cerraron temprano salieron antes y con menor daño total</span>. La deuda sube para financiar el cierre, pero es manejable si dura pocas semanas.' },
    ],
    // Opción 1: Vigilancia intensiva sin cierre
    [
      { slot: 'social', text: 'El <b>rastreo y testeo masivo</b> es el modelo que mejor combina salud y economía. <span class="mm-good">Permite detectar casos antes de que escalen</span> sin paralizar la actividad. <span class="mm-bad">El riesgo es que si la transmisión es más veloz de lo esperado, podemos quedar desbordados</span>. Requiere una capacidad de respuesta rápida que el sistema de salud debe tener lista.' },
      { slot: 'gabinete', text: '<span class="mm-good">La vigilancia sin cierre mantiene la confianza ciudadana</span> y evita el pánico. <span class="mm-good">El impacto económico es mínimo comparado con la cuarentena</span>. El riesgo político es que si la situación se agrava, la responsabilidad por no haber cerrado antes caerá sobre el gobierno. Hay que tener listo el plan B.' },
    ],
    // Opción 2: No sobreactuar
    [
      { slot: 'social', text: '<span class="mm-bad">Minimizar la amenaza con 12 casos confirmados es una apuesta muy peligrosa</span>. Si la variante tiene transmisibilidad alta, en una semana podemos tener miles. <span class="mm-bad">La pobreza y el riesgo suben</span> porque sin respuesta, la carga sobre el sistema de salud público — que ya está al límite — puede colapsar. La inacción también es una política, y tiene consecuencias.' },
    ],
  ],

  // ── EVENTO 40: Elecciones Legislativas de Medio Término ──────
  40: [
    // Opción 0: Campaña propositiva
    [
      { slot: 'gabinete', text: 'La <b>campaña propositiva</b> es la apuesta de largo plazo correcta. <span class="mm-good">La confianza sube 9 puntos</span> porque la ciudadanía distingue entre quienes proponen y quienes solo atacan. <span class="mm-bad">Cuesta más en términos de elaboración técnica</span>, pero construye capital político más sólido. Los debates abiertos posicionan al gobierno como el actor responsable en el tablero político.' },
    ],
    // Opción 1: Campaña de contraste
    [
      { slot: 'gabinete', text: 'La campaña de contraste <span class="mm-bad">sube el riesgo país porque aumenta la polarización</span>. <span class="mm-bad">La confianza baja levemente</span> porque la ciudadanía harta de la grieta suele castigar al que escala el tono. Puede ser tácticamente útil en algunos distritos, pero como estrategia nacional tiene retornos decrecientes. El electorado independiente — el que define las elecciones — no se mueve con el miedo al otro.' },
    ],
    // Opción 2: Transferencias electorales (corrupta)
    [
      { slot: 'economia', text: 'Adelantar transferencias <span class="mm-good">puede mejorar algunos indicadores socioeconómicos</span>, pero <span class="mm-bad">priorizar distritos electorales sobre la necesidad real es corrupción electoral</span>. <span class="mm-bad">El IPC sube por la inyección de gasto, la deuda sube y las reservas caen</span>. Si se filtra — y siempre se filtra — el daño reputacional supera cualquier ventaja táctica electoral.' },
    ],
  ],

  // ── EVENTO 41: Incendios en la Patagonia ─────────────────────
  41: [
    // Opción 0: Emergencia ígnea nacional
    [
      { slot: 'produccion', text: '<span class="mm-good">Los aviones hidrantes y el ejército son la única respuesta a la escala del desastre</span>. <span class="mm-good">La confianza sube 11 puntos</span> porque el Estado demuestra capacidad de acción ante la emergencia. <span class="mm-bad">El costo en deuda y reservas es significativo</span>, pero el turismo patagónico — que genera divisas — necesita que los bosques se preserven. <span class="mm-good">El empleo de emergencia también crea trabajo</span>.' },
      { slot: 'social', text: 'Las familias y comunidades patagónicas necesitan ver que el Estado nacional llega. <span class="mm-good">La pobreza baja porque se activa la economía de emergencia local</span>. Los bomberos voluntarios han estado solos demasiado tiempo — <span class="mm-good">reforzarlos con recursos federales es un acto de justicia</span> además de una necesidad operativa.' },
    ],
    // Opción 1: Campaña de reforestación
    [
      { slot: 'produccion', text: '<span class="mm-good">Las brigadas de reforestación generan empleo comunitario local</span> y <span class="mm-good">la confianza sube</span> porque hay acción visible. <span class="mm-bad">Sin embargo, sin atacar el fuego activo primero, reforestar es inútil</span>. Esta opción funciona como segunda etapa de respuesta, no como primera. El fuego hay que apagarlo antes de pensar en plantar.' },
    ],
    // Opción 2: Delegar en provincias sin recursos
    [
      { slot: 'produccion', text: '<span class="mm-bad">Delegar sin recursos equivale a no hacer nada</span>: las provincias patagónicas ya agotaron sus propios medios. <span class="mm-bad">La producción cae 3 puntos porque el turismo colapsa con las imágenes del humo</span>. <span class="mm-bad">La confianza cae 9 puntos</span> porque el Estado nacional muestra indiferencia ante una catástrofe en territorio propio.' },
    ],
  ],

  // ── EVENTO 42: Crisis Constitucional / Juicio Político ───────
  42: [
    // Opción 0: Colaborar con el proceso constitucional
    [
      { slot: 'gabinete', text: '<span class="mm-good">Colaborar con el proceso constitucional es el camino que preserva la institucionalidad</span>. <span class="mm-good">El riesgo país baja 5 puntos porque los inversores y organismos internacionales valoran la estabilidad del sistema republicano</span>. Si la causa no tiene sustento real, la transparencia juega a nuestro favor. Resistirse crea la apariencia de culpabilidad.' },
    ],
    // Opción 1: Acuerdo político con oposición moderada
    [
      { slot: 'gabinete', text: '<span class="mm-good">Un acuerdo político puede frenar el juicio con menor desgaste</span> que la confrontación pública. <span class="mm-bad">Las concesiones tienen costo fiscal y político</span>, pero el costo de un juicio político prolongado es mayor. La clave es que las concesiones sean políticas y no impliquen compromisos que comprometan la integridad de la gestión.' },
    ],
    // Opción 2: Campaña de comunicación agresiva
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Denunciar el juicio como golpe institucional sin evidencia puede aumentar la polarización</span>. <span class="mm-bad">El riesgo país sube porque los mercados leen la confrontación institucional como inestabilidad</span>. Si la movilización electoral es fuerte, puede funcionar tácticamente, pero <span class="mm-bad">la confianza cae a nivel global</span> y los organismos internacionales toman nota.' },
    ],
  ],

  // ── EVENTO 43: Plataformas Digitales vs. Sindicatos ──────────
  43: [
    // Opción 0: Ley de Trabajo de Plataformas plena
    [
      { slot: 'social', text: '<span class="mm-good">400.000 trabajadores con aportes, obra social y salario mínimo es justicia social concreta</span>. <span class="mm-good">La pobreza baja 4 puntos y el desempleo cae 3</span>. El riesgo de que las empresas se vayan es real pero exagerado: el mercado argentino es demasiado grande para abandonarlo. España reguló las plataformas y Glovo sigue operando.' },
      { slot: 'produccion', text: '<span class="mm-bad">La regulación plena puede reducir la producción del sector y aumentar los precios del servicio para el usuario</span>. Las empresas van a trasladar el costo laboral a las tarifas. <span class="mm-bad">El riesgo país sube levemente</span> porque el mercado lo lee como regulación excesiva. Pero <span class="mm-good">la confianza ciudadana sube fuerte</span> porque el Estado protege a los más vulnerables del mercado digital.' },
    ],
    // Opción 1: Estatuto especial
    [
      { slot: 'social', text: 'El <b>estatuto especial</b> es el equilibrio pragmático. <span class="mm-good">Mejora la situación de los trabajadores sin las rigideces de la relación laboral clásica</span>. <span class="mm-good">La pobreza baja 2 puntos y la confianza sube</span>. No es la solución ideal desde los derechos laborales, pero es realista dada la naturaleza del trabajo de plataformas. Puede ser una etapa hacia una regulación más completa.' },
    ],
    // Opción 2: No regular
    [
      { slot: 'social', text: '<span class="mm-bad">No regular deja a 400.000 trabajadores sin ninguna protección</span>. <span class="mm-bad">La pobreza sube 2 puntos</span> porque la informalidad de plataformas empeora las condiciones de los sectores más vulnerables. <span class="mm-bad">La confianza baja</span>. Hay quienes dicen que el mercado se autoregula, pero la experiencia global muestra que sin reglas mínimas, las plataformas maximizan beneficios a costa de los trabajadores.' },
    ],
  ],

  // ── EVENTO 44: Ola de Calor Histórica ────────────────────────
  44: [
    // Opción 0: Plan Nacional de Adaptación Climática
    [
      { slot: 'produccion', text: 'El <b>Plan de Adaptación Climática</b> es la respuesta estructural que el país necesita. <span class="mm-good">El arbolado urbano y la eficiencia energética reducen el consumo eléctrico a largo plazo</span>. <span class="mm-good">La confianza sube 8 puntos</span> porque el gobierno demuestra visión estratégica. <span class="mm-good">El desempleo baja</span> con las obras. Cada grado menos en las ciudades reduce la mortalidad por calor y la demanda eléctrica.' },
      { slot: 'social', text: 'Las olas de calor golpean desproporcionadamente a <span class="mm-bad">adultos mayores, niños y personas en situación de calle que no tienen aire acondicionado</span>. <span class="mm-good">Un plan de adaptación con centros de enfriamiento gratuitos y acceso a agua salva vidas concretas</span>. <span class="mm-good">La pobreza baja porque las enfermedades por calor tienen costo de bolsillo enorme para las familias vulnerables</span>.' },
    ],
    // Opción 1: Reforzar el sistema eléctrico
    [
      { slot: 'produccion', text: '<span class="mm-good">La generación de emergencia y la distribución prioritaria a hogares resuelven la urgencia</span>. <span class="mm-good">La producción mejora porque la industria puede operar sin cortes</span>. <span class="mm-bad">El costo en reservas y deuda es significativo</span>, pero es la respuesta más rápida a la crisis inmediata. Hay que complementarla con el plan de largo plazo.' },
    ],
    // Opción 2: Solo alerta 30 días
    [
      { slot: 'social', text: '<span class="mm-bad">Una alerta sin inversión no enfría las ciudades ni repara las redes eléctricas</span>. <span class="mm-bad">La pobreza sube porque los cortes de luz afectan la cadena alimentaria y la salud</span>. <span class="mm-bad">La confianza cae</span>. El IPCC ya advirtió que estas olas serán más frecuentes: esperar sin actuar implica enfrentar la próxima crisis en peores condiciones.' },
    ],
  ],

  // ── EVENTO 45: Déficit Récord / Presupuesto ──────────────────
  45: [
    // Opción 0: Ajuste integral 15%
    [
      { slot: 'economia', text: 'El ajuste integral <span class="mm-good">manda la señal fiscal más fuerte posible: el riesgo país baja 8 puntos y la deuda cae</span>. Pero <span class="mm-bad">el impacto social es brutal: la pobreza sube 8 puntos y el desempleo 4</span>. Recortar programas sociales en contexto de fragilidad puede retroalimentar el déficit porque cae la actividad económica y la recaudación. Es el ajuste más duro y el que más rápido se nota en la calle.' },
      { slot: 'social', text: '<span class="mm-bad">Recortar salud, educación y programas sociales al mismo tiempo destruye el tejido que sostiene la economía informal</span>. <span class="mm-bad">La pobreza sube 8 puntos</span> y las consecuencias se verán en el sistema de salud sobrecargado y la escuela deteriorada por años. El ajuste de corto plazo puede generar un gasto mayor a largo plazo.' },
    ],
    // Opción 1: Ajuste selectivo preservando lo social
    [
      { slot: 'economia', text: '<span class="mm-good">El ajuste selectivo es la opción más inteligente fiscalmente</span>: <span class="mm-good">reduce el déficit sin destruir el tejido social</span>. Los gastos de funcionamiento (viáticos, publicidad, consultorías) tienen poco impacto en el bienestar ciudadano. <span class="mm-good">El riesgo país baja 4 puntos</span>. El desafío es que el ahorro es menor, pero el impacto político es más manejable.' },
    ],
    // Opción 2: Suba de impuestos a ricos
    [
      { slot: 'economia', text: 'Subir <b>Bienes Personales y Ganancias corporativas</b> <span class="mm-good">es progresivo y reduce el déficit sin tocar a los más vulnerables</span>. <span class="mm-good">La pobreza baja 2 puntos y la confianza sube</span>. <span class="mm-bad">La producción cae levemente</span> porque algunas empresas reducen inversiones. El riesgo: <span class="mm-bad">la fuga de capitales si la alícuota es percibida como confiscatoria</span>. Hay que calibrar bien el nivel.' },
    ],
    // Opción 3: Financiar con deuda interna
    [
      { slot: 'economia', text: '<span class="mm-bad">Financiar el déficit con letras del Tesoro traslada el problema al futuro y lo agrava</span>. <span class="mm-bad">El IPC sube 4 puntos y el riesgo país sube 5</span> porque los mercados leen esto como "el gobierno no tiene plan". <span class="mm-bad">La deuda total sube</span>. Es la opción que más evita el costo político inmediato pero más lo concentra en el mediano plazo.' },
    ],
  ],

  // ── EVENTO 46: Unión Monetaria del MERCOSUR ──────────────────
  46: [
    // Opción 0: Adherir a la unión monetaria
    [
      { slot: 'economia', text: 'Una <b>moneda regional común</b> eliminaría los costos de conversión en el 35% de nuestras exportaciones y <span class="mm-good">reduciría la inflación importada</span>. <span class="mm-good">Las reservas mejoran porque hay menos necesidad de dólares para el comercio regional</span>. El costo: <span class="mm-bad">cedemos autonomía en política monetaria</span>. Si Brasil tiene una recesión, nosotros no podemos devaluar para compensar.' },
      { slot: 'gabinete', text: '<span class="mm-good">La integración regional profunda es una apuesta estratégica de largo plazo</span>. <span class="mm-good">La confianza sube y el riesgo país baja</span> porque los inversores valoran la estabilidad que da una moneda regional con respaldo de varias economías. El desafío es político: <span class="mm-bad">hay sectores que van a leer esto como entrega de soberanía</span>. Necesitamos un relato de integración fuerte.' },
    ],
    // Opción 1: Participar sin adoptar la moneda
    [
      { slot: 'economia', text: 'Participar en el diseño sin adoptar la moneda <span class="mm-good">nos da influencia en las reglas sin perder el instrumento monetario</span>. Es la posición más pragmática. <span class="mm-good">El riesgo país baja moderadamente</span> y <span class="mm-good">la producción regional mejora porque hay más coordinación</span>. Si el experimento funciona, podemos adherir después con mejor información.' },
    ],
    // Opción 2: Rechazar
    [
      { slot: 'economia', text: '<span class="mm-bad">Rechazar nos deja fuera del proceso de integración más ambicioso de la región</span>. <span class="mm-bad">El riesgo país sube porque los socios regionales van a ver esto como un distanciamiento</span>. La soberanía monetaria tiene valor, pero hay que sopesarla contra el costo de quedar aislados de un bloque comercial que representa el 35% de nuestras exportaciones.' },
    ],
  ],

  // ── EVENTO 47: Fuga de Cerebros / CONICET ────────────────────
  47: [
    // Opción 0: Triplicar salarios CONICET y polos tecnológicos
    [
      { slot: 'produccion', text: '<b>1.200 investigadores en un año</b> es la mayor pérdida de capital humano de nuestra historia reciente. <span class="mm-good">Triplicar salarios y crear polos tecnológicos detiene la hemorragia y puede revertirla</span>. <span class="mm-good">La producción sube 6 puntos, el desempleo cae 4</span>. Un investigador de IA o bioquímica que regresa genera un retorno de 10 a 1 en innovación productiva. Es la inversión con mayor ROI posible.' },
      { slot: 'social', text: '<span class="mm-good">Los polos tecnológicos generan empleo calificado que ancla a los jóvenes talentosos en el país</span>. <span class="mm-good">La pobreza baja y la confianza sube 10 puntos</span> porque la ciudadanía ve que el Estado apuesta por el futuro. <span class="mm-bad">La deuda sube para financiarlo</span>, pero es el tipo de deuda que tiene retorno económico verificable.' },
    ],
    // Opción 1: Programa de repatriación
    [
      { slot: 'produccion', text: 'El <b>programa de repatriación</b> es más barato que los polos tecnológicos y puede ser muy efectivo: <span class="mm-good">los investigadores que se fueron por razones económicas regresan con subsidios y exenciones</span>. <span class="mm-good">La producción y el desempleo mejoran</span>. El desafío es que funciona para los que se fueron por dinero, no para los que se fueron por calidad institucional o científica.' },
    ],
    // Opción 2: Convenios con empresas tecnológicas
    [
      { slot: 'produccion', text: '<span class="mm-good">Los convenios con empresas tech generan empleo privado de alta calidad sin gasto fiscal adicional</span>. <span class="mm-good">Las reservas mejoran con la inversión extranjera y la producción sube 5 puntos</span>. El riesgo: <span class="mm-bad">los investigadores trabajan para las agendas privadas de las empresas, no para el conocimiento público</span>. Hay que negociar cláusulas de acceso a resultados para el Estado.' },
    ],
  ],

  // ── EVENTO 48: Toma Masiva de Tierras ────────────────────────
  48: [
    // Opción 0: Regularizar y urbanizar
    [
      { slot: 'social', text: '<b>15.000 familias con niños</b> no tienen hogar: la regularización es la única respuesta que no produce una crisis humanitaria. <span class="mm-good">La pobreza baja 7 puntos y el desempleo 4</span> con la urbanización. <span class="mm-good">La confianza sube 10</span> porque el Estado elige la solución humana sobre la del propietario. La expropiación con compensación justa es un instrumento legal disponible.' },
      { slot: 'produccion', text: '<span class="mm-good">Urbanizar una toma genera empleo en la construcción local</span> y convierte un asentamiento informal en barrio con servicios y consumo. <span class="mm-bad">La deuda sube para financiarlo</span>, pero <span class="mm-good">el costo de no actuar — servicios de emergencia, violencia, enfermedades — es mayor a largo plazo</span>.' },
    ],
    // Opción 1: Reubicación voluntaria
    [
      { slot: 'social', text: 'La reubicación voluntaria <span class="mm-good">respeta la legalidad sin violencia</span>. <span class="mm-good">La pobreza baja y la confianza sube moderadamente</span>. El riesgo es que muchas familias rechacen la reubicación por estar lejos del trabajo o las escuelas de sus hijos. Si la oferta de vivienda alternativa es real y accesible, puede funcionar.' },
    ],
    // Opción 2: Desalojo judicial
    [
      { slot: 'social', text: '<span class="mm-bad">Desalojar 15.000 familias con niños genera imágenes que van a recorrer el mundo</span>. <span class="mm-bad">El riesgo país sube 5 puntos, la pobreza sube 3 y la confianza cae 12</span>. Las familias desalojadas no desaparecen: terminan en asentamientos más precarios o en la calle. El costo humano y político de esta decisión puede perseguir al gobierno durante años.' },
    ],
  ],

  // ── EVENTO 49: Concentración Mediática ───────────────────────
  49: [
    // Opción 0: Ley Antitrust de Medios
    [
      { slot: 'gabinete', text: 'La <b>concentración del 70% de los medios en un solo holding</b> es una amenaza real a la democracia. <span class="mm-good">La ley antitrust reduce el riesgo institucional y sube la confianza 8 puntos</span>. <span class="mm-bad">El holding va a resistir con litigios y presión internacional</span>. Hay que tener el marco jurídico bien armado y aliados en el Congreso para sostener la ley ante los recursos legales.' },
    ],
    // Opción 1: Aprobar con compromisos editoriales
    [
      { slot: 'gabinete', text: 'Los compromisos de pluralismo editorial son difíciles de hacer cumplir en la práctica. <span class="mm-good">La inversión llega y la producción mejora</span>, pero <span class="mm-bad">la confianza democrática baja porque se percibe que el gobierno cedió ante el poder económico mediático</span>. Si en un año el pluralismo no se verifica, habremos perdido la oportunidad de regular sin ganar el beneficio.' },
    ],
    // Opción 2: Fortalecer medios públicos
    [
      { slot: 'gabinete', text: 'Triplicar el presupuesto de <b>TV Pública y Radio Nacional</b> <span class="mm-good">crea un polo de producción de contenidos nacionales de calidad</span>. <span class="mm-good">El desempleo baja en el sector y la confianza sube levemente</span>. El riesgo: <span class="mm-bad">si los medios públicos se perciben como gubernamentales y no como pluralistas, refuerza la narrativa de que el Estado quiere controlar la información</span>.' },
    ],
  ],

  // ── EVENTO 50: Escasez de Alimentos Básicos ──────────────────
  50: [
    // Opción 0: Restricciones a la exportación
    [
      { slot: 'social', text: '<span class="mm-good">Priorizar el abastecimiento interno es la política correcta cuando el 60% del ingreso de los más pobres se va en comida</span>. <span class="mm-good">La pobreza baja 5 puntos y la confianza sube 8</span>. <span class="mm-bad">El sector agropecuario va a protestar</span> y las reservas caen levemente porque se exporta menos. Pero el derecho a la alimentación no puede estar subordinado al precio de mercado internacional.' },
      { slot: 'economia', text: '<span class="mm-bad">Las restricciones a la exportación generan conflicto con el campo y reducen divisas</span>. <span class="mm-bad">El IPC baja 3 puntos</span> porque hay más oferta interna. Funcionan como medida de emergencia pero <span class="mm-bad">si se prolongan, los productores dejan de producir los bienes regulados</span>. Hay que combinarlas con un plan de productividad para el mediano plazo.' },
    ],
    // Opción 1: Subsidios directos a la canasta básica
    [
      { slot: 'social', text: 'Los <b>subsidios directos</b> son la respuesta más focalizada: <span class="mm-good">llegan a quienes más los necesitan sin distorsionar el mercado</span>. <span class="mm-good">La pobreza baja 7 puntos y la confianza sube 10</span>. <span class="mm-bad">La deuda sube</span>, pero el impacto en la seguridad alimentaria es inmediato y medible. Es la política con mayor impacto por peso invertido en alivio de la pobreza extrema.' },
      { slot: 'economia', text: 'Los subsidios focalizados <span class="mm-good">son más eficientes que los controles de precio generalizados</span>: evitan la escasez que generan los topes y llegan a quienes más los necesitan. <span class="mm-bad">El IPC sube levemente</span> porque hay más pesos en la economía, pero es gestionable. La clave es el padrón de beneficiarios — tiene que estar bien armado para evitar la filtración a sectores no vulnerables.' },
    ],
    // Opción 2: Libre exportación
    [
      { slot: 'social', text: '<span class="mm-bad">Liberar totalmente las exportaciones en un contexto de escasez interna es una decisión que impacta directamente a las familias más pobres</span>. <span class="mm-bad">El IPC sube 6 puntos y la pobreza 6</span>. <span class="mm-good">Las reservas mejoran y la producción sube</span>, pero el costo de ese ajuste lo pagan los que menos tienen. <span class="mm-bad">La confianza cae 8 puntos</span>.' },
    ],
  ],

  // ── EVENTO 51: Vacuna Nacional Contra el Dengue ──────────────
  51: [
    // Opción 0: Producción pública masiva
    [
      { slot: 'social', text: 'Una vacuna propia a <span class="mm-good">un décimo del costo importado es soberanía sanitaria real</span>. <span class="mm-good">La pobreza baja 5 puntos porque las familias acceden a protección sin costo privado</span>. <span class="mm-good">La confianza sube 12 puntos</span> — este tipo de logro científico-industrial genera un orgullo nacional genuino y difícil de replicar por la oposición. Y los 15 países que la necesitan son mercado de exportación real.' },
      { slot: 'produccion', text: '<span class="mm-good">Exportar la vacuna a 15 países genera divisas, empleos de alta calificación y posiciona a Argentina como potencia farmacéutica regional</span>. <span class="mm-good">La producción sube 7 puntos y el desempleo cae 4</span>. Es el tipo de industrialización de alto valor agregado que el país necesita para salir de la trampa de exportar solo commodities.' },
    ],
    // Opción 1: Licencia mixta
    [
      { slot: 'social', text: 'La <b>licencia mixta</b> <span class="mm-good">asegura el acceso a la vacuna para la población sin depender de una sola fuente</span>. <span class="mm-good">La pobreza baja 3 puntos y la confianza sube</span>. El riesgo es que la producción local no escale lo suficiente rápido y el suministro importado siga dominando. Es una opción intermedia razonable si la capacidad del laboratorio estatal es limitada al inicio.' },
    ],
    // Opción 2: Comprar la vacuna importada
    [
      { slot: 'produccion', text: '<span class="mm-bad">Comprar la vacuna importada es resignar una oportunidad histórica de desarrollar industria farmacéutica nacional</span>. <span class="mm-bad">Las reservas caen 4 puntos y la producción baja</span> porque el gasto en dividas sale del circuito productivo local. La seguridad técnica que ofrece es real, pero el costo de oportunidad — capacidad instalada, empleos, exportaciones futuras — es enorme.' },
    ],
  ],

  // ── EVENTO 52: Banco Nación al Borde del Colapso ─────────────
  52: [
    // Opción 0: Rescate total con fondos del Tesoro
    [
      { slot: 'economia', text: 'El BNA tiene <b>14 millones de ahorristas y 700.000 pymes</b>: su caída es sistémica. <span class="mm-good">El rescate total es la única forma de evitar una corrida generalizada</span>. <span class="mm-bad">El IPC sube 5 y la deuda 8</span>, pero el costo de un colapso bancario completo sería infinitamente mayor — lo aprendimos en 2001. <span class="mm-good">El riesgo país baja y la confianza sube</span> porque el Estado cumple su rol de garante.' },
      { slot: 'gabinete', text: 'La decisión debe tomarse antes de que se filtre a los medios: <span class="mm-good">cada hora de incertidumbre multiplica el pánico</span>. El rescate total <span class="mm-good">manda la señal más potente posible de que el sistema financiero está garantizado</span>. Necesitamos coordinar el anuncio con el Banco Central y el Ministerio de Economía de forma simultánea para que sea contundente.' },
    ],
    // Opción 1: Reestructuración con quita
    [
      { slot: 'economia', text: 'La quita a acreedores institucionales <span class="mm-good">reduce el costo fiscal del rescate</span>. <span class="mm-bad">Los bancos y fondos que absorben pérdidas van a trasladar el costo a los clientes con tasas más altas</span>. <span class="mm-bad">El desempleo sube levemente</span> porque el crédito se encarece. Es una solución más ordenada que el rescate total pero con mayor tiempo de implementación y más riesgo de contagio.' },
    ],
    // Opción 2: Fusión y venta parcial
    [
      { slot: 'economia', text: 'La fusión con otro banco público y la venta de cartera sana <span class="mm-good">reduce el riesgo sistémico sin el costo fiscal del rescate total</span>. <span class="mm-bad">El desempleo sube porque hay reestructuración de personal</span>. <span class="mm-good">El riesgo país baja más que con las otras opciones</span> porque los mercados ven que hay un plan creíble de resolución. Es la opción más técnica y menos política.' },
    ],
  ],

  // ── EVENTO 53: INCAA / Cine Nacional ─────────────────────────
  53: [
    // Opción 0: Defender el INCAA con impuesto a plataformas
    [
      { slot: 'social', text: 'El <b>cine argentino</b> es uno de los activos culturales más reconocidos del mundo — 3 Oscar en 20 años no es casualidad. <span class="mm-good">La confianza sube 9 puntos</span> porque hay una narrativa cultural de la que el gobierno puede ser parte. <span class="mm-good">El desempleo baja porque el sector audiovisual emplea a miles de trabajadores</span>. El impuesto a plataformas digitales es justo y recaudatorio.' },
      { slot: 'produccion', text: 'El <b>impuesto a Netflix, Disney y Amazon</b> <span class="mm-good">genera recursos sin impactar al sector productivo local</span>. <span class="mm-good">Las reservas mejoran levemente porque las plataformas pagan en divisas</span>. Es una política de <b>reciprocidad digital</b>: si se benefician del mercado argentino, contribuyen al ecosistema cultural que sostiene a sus audiencias.' },
    ],
    // Opción 1: Reforma reducida con coproducción
    [
      { slot: 'produccion', text: 'La coproducción internacional <span class="mm-good">reduce la dependencia del financiamiento estatal y abre mercados</span>. <span class="mm-good">La producción audiovisual sube levemente y el desempleo baja</span>. El INCAA más pequeño pero focalizado puede ser más eficiente. El riesgo es que la coproducción favorezca proyectos más comerciales y menos identitarios.' },
    ],
    // Opción 2: Eliminar el INCAA
    [
      { slot: 'social', text: '<span class="mm-bad">Sin INCAA, el cine argentino que da identidad cultural al país desaparece en 5 años</span>. <span class="mm-bad">El desempleo sube en el sector cultural y la confianza cae 7 puntos</span>. Las plataformas no van a financiar las películas que cuentan la historia de los barrios de Buenos Aires o la vida en el noroeste argentino. <span class="mm-bad">La producción cultural con valor de identidad solo existe con apoyo estatal</span>.' },
    ],
  ],

  // ── EVENTO 54: Pesca Ilegal en el Mar Argentino ──────────────
  54: [
    // Opción 0: Operativo soberanía
    [
      { slot: 'produccion', text: '<span class="mm-good">USD 1.500 millones anuales robados por flotas ilegales es un daño enorme a la economía pesquera nacional</span>. <span class="mm-good">Defender la ZEE genera confianza y producción</span>. <span class="mm-bad">El riesgo político con China es real</span>, pero hay que separar la pesca ilegal de las relaciones comerciales: son cosas distintas. Los acuerdos bilaterales tienen cláusulas de respeto a la ley internacional.' },
    ],
    // Opción 1: Negociación diplomática con China
    [
      { slot: 'produccion', text: 'Un acuerdo de pesca regulada <span class="mm-good">genera divisas e inversión sin confrontación</span>. <span class="mm-good">Las reservas suben, la producción mejora</span>. El riesgo: <span class="mm-bad">si el acuerdo no tiene controles efectivos, la pesca ilegal continúa bajo otra denominación</span>. Hay que exigir mecanismos de monitoreo verificables como condición del acuerdo.' },
    ],
    // Opción 2: Denuncia ante CONVEMAR
    [
      { slot: 'gabinete', text: 'La <b>CONVEMAR</b> es el marco legal correcto para este tipo de conflicto. <span class="mm-good">El riesgo país baja porque Argentina muestra respeto por el derecho internacional</span>. El proceso es lento — puede tardar años — pero <span class="mm-good">construye jurisprudencia que protege a Argentina y a toda la región en el futuro</span>. Es la opción con menor costo y mayor legitimidad internacional.' },
    ],
  ],

  // ── EVENTO 56: Megaminería a Cielo Abierto ───────────────────
  56: [
    // Opción 0: Aprobar el proyecto
    [
      { slot: 'produccion', text: 'USD 6.000 millones de inversión y <span class="mm-good">8.000 empleos directos son un impacto productivo enorme</span>. <span class="mm-good">Las reservas suben 9 puntos, la producción 8 y el desempleo cae 6</span>. Pero hay que ser transparentes: <span class="mm-bad">el riesgo de contaminación de las cuencas hídricas es "moderado a alto" según los propios estudios</span>. Si hay un accidente, el daño a 500.000 personas será irreversible y el costo político, devastador.' },
      { slot: 'social', text: '<span class="mm-bad">Las comunidades huarpe llevan generaciones dependiendo del agua de esos ríos</span>. La consulta previa libre e informada exigida por el Convenio 169 de la OIT no se completó. <span class="mm-bad">La confianza baja 4 puntos</span> porque hay un conflicto de derechos que el proyecto no resuelve. Si avanzamos sin resolver eso, el litigio internacional puede frenar el proyecto igual que sin aprobarlo.' },
    ],
    // Opción 1: Rechazar
    [
      { slot: 'produccion', text: '<span class="mm-good">Proteger la cuenca hídrica que abastece a 500.000 personas es una decisión de soberanía sobre un recurso estratégico irreemplazable</span>. <span class="mm-bad">Las reservas caen levemente por el ingreso que no llega</span>. <span class="mm-good">La confianza sube 7 puntos</span> porque hay sectores amplios de la sociedad que valoran la protección ambiental. El litio y el cobre se pueden buscar en zonas sin conflicto hídrico.' },
    ],
    // Opción 2: Aprobar con auditoría y fondo de remediación
    [
      { slot: 'produccion', text: 'La auditoría permanente y el <b>fondo de remediación del 5%</b> son las mejores prácticas internacionales. <span class="mm-good">Las reservas suben 5 puntos, la producción mejora y el desempleo baja</span>. <span class="mm-good">El riesgo país cae</span> porque se muestra capacidad de gobernar la inversión con responsabilidad. Es la opción que maximiza el beneficio económico minimizando el riesgo ambiental.' },
      { slot: 'social', text: '<span class="mm-good">El fondo de remediación garantiza recursos para reparar daños si ocurren</span>. La auditoría independiente con participación comunitaria puede calmar a las asambleas de vecinos. <span class="mm-good">La pobreza y el desempleo mejoran con el empleo minero</span>. Es importante que las comunidades indígenas sean parte de la auditoría para legitimar el proceso.' },
    ],
  ],

  // ── EVENTO 57: OGM / Trigo Transgénico ───────────────────────
  57: [
    // Opción 0: Autorizar la siembra comercial
    [
      { slot: 'produccion', text: '<span class="mm-good">Un 30% más de producción triguera y USD 4.000 millones adicionales en exportaciones es transformador</span>. <span class="mm-good">Las reservas suben 8 puntos, la producción 9, el desempleo cae</span>. La tecnología tiene aval del CONICET. El riesgo de la UE es real pero negociable: <span class="mm-bad">algunos mercados van a cerrarse, pero otros como China y Medio Oriente aceptan OGM sin restricciones</span>.' },
      { slot: 'economia', text: '<span class="mm-good">El trigo OGM resistente a la sequía es una respuesta concreta al cambio climático</span>. <span class="mm-good">La inflación baja porque hay más oferta interna de harina</span>. <span class="mm-bad">El bloqueo de la UE puede costar entre USD 1.000 y 2.000 millones anuales</span>. Hay que hacer el análisis de mercados de destino antes del anuncio para comunicar con precisión los mercados alternativos.' },
    ],
    // Opción 1: Autorizar en zonas piloto
    [
      { slot: 'produccion', text: 'Las <b>zonas piloto</b> son la posición más prudente: <span class="mm-good">generan datos científicos reales en condiciones de campo antes de escalar</span>. <span class="mm-good">Las reservas y la producción mejoran moderadamente</span>. Si los resultados ambientales son buenos en 2-3 años, la autorización comercial plena tendrá mucho más respaldo técnico y político para resistir las críticas.' },
    ],
    // Opción 2: Moratoria 2 años
    [
      { slot: 'produccion', text: 'La moratoria <span class="mm-good">es una señal de precaución que protege los mercados europeos</span> y da tiempo para estudiar el tema. <span class="mm-bad">Las reservas caen levemente porque perdemos el ingreso potencial</span>. <span class="mm-bad">La producción cae 2 puntos</span>. Es la opción más conservadora, razonable si el principal destino de exportación de trigo es la UE y el costo del bloqueo europeo supera el beneficio de la tecnología.' },
    ],
  ],

  // ── EVENTO 58: Tren Bala Buenos Aires-Rosario-Córdoba ─────────
  58: [
    // Opción 0: Aprobar el proyecto
    [
      { slot: 'produccion', text: '<span class="mm-good">40.000 empleos en construcción y 8.000 permanentes son un impacto laboral enorme</span>. <span class="mm-good">La producción sube 7 puntos y el desempleo cae 6</span>. La infraestructura de alta velocidad tiene un retorno económico de largo plazo probado en Europa y Asia. <span class="mm-bad">La deuda sube 8 puntos</span> y la condicionalidad de componente chino es un costo soberano que hay que evaluar.' },
      { slot: 'economia', text: 'El <b>repago en commodities</b> es el punto más delicado: <span class="mm-bad">implica comprometer producción agropecuaria futura como garantía de deuda</span>, lo que reduce flexibilidad fiscal. <span class="mm-good">Si se renegocia el repago en divisas</span>, el proyecto es más atractivo. La infraestructura ferroviaria tiene externalidades positivas que los modelos financieros tradicionales subestiman.' },
    ],
    // Opción 1: Renegociar condiciones
    [
      { slot: 'produccion', text: 'Exigir <b>80% de componente nacional</b> <span class="mm-good">maximiza el empleo local y el derrame industrial</span>. <span class="mm-good">La producción mejora más que con el proyecto original</span> porque la industria metalmecánica y de ingeniería nacional se beneficia. <span class="mm-bad">La deuda sube igual</span>, pero el repago en divisas es más manejable. El riesgo es que China no acepte las condiciones.' },
      { slot: 'economia', text: 'El <span class="mm-good">repago en divisas en lugar de commodities es la condición innegociable</span>. Comprometer soja o maíz como pago reduce la flexibilidad exportadora del país por décadas. Una negociación firme que consiga este punto convierte al proyecto en una oportunidad real de desarrollo industrial.' },
    ],
    // Opción 2: Rechazar
    [
      { slot: 'economia', text: 'Rechazar evita <span class="mm-good">acumular USD 18.000 millones de deuda</span> con condicionalidades problemáticas. <span class="mm-bad">El riesgo país sube porque los inversores ven al gobierno como poco ambicioso en infraestructura</span>. <span class="mm-bad">La producción cae levemente</span>. Si hay alternativas de financiamiento mejores, es razonable rechazar esta oferta. Sin alternativa, rechazar es perder una ventana de oportunidad difícil de repetir.' },
    ],
  ],

  // ── EVENTO 59: Economía Informal (50% de trabajadores) ────────
  59: [
    // Opción 0: Monotributo Social Plus
    [
      { slot: 'social', text: 'El <b>Monotributo Social Plus</b> con beneficios completos es la llave para sacar a millones de personas de la informalidad sin destruir sus fuentes de ingreso. <span class="mm-good">La pobreza baja 5 puntos y el desempleo 4</span>. <span class="mm-good">La confianza sube 9 puntos</span> porque el Estado llega a los que el sistema formal siempre ignoró. Y para el fisco, un informal que formaliza aporta donde antes no aportaba nada.' },
      { slot: 'economia', text: '<span class="mm-good">Formalizar el 4% del PBI que hoy no se recauda es el mayor potencial fiscal sin subir tasas</span>. El Monotributo Social Plus es el mecanismo más simple: baja los costos de entrada al sistema formal a cero. <span class="mm-bad">La deuda sube levemente</span> por los beneficios extendidos, pero el retorno en recaudación a 3 años justifica la inversión inicial.' },
    ],
    // Opción 1: Formalización por sectores
    [
      { slot: 'produccion', text: 'Empezar por <b>gastronómicos, textiles y construcción</b> es estratégico: <span class="mm-good">son los sectores con mayor informalidad y mayor capacidad de absorción</span>. <span class="mm-good">La producción mejora 4 puntos y el desempleo cae</span>. La fiscalización sectorial es más manejable que la universal. El éxito en estos sectores crea el modelo para expandir a los demás.' },
    ],
    // Opción 2: Blanqueo laboral masivo
    [
      { slot: 'economia', text: 'La amnistía a empleadores que regularizan <span class="mm-good">genera un shock de formalización rápida: las reservas suben y el desempleo cae 5</span>. <span class="mm-good">El riesgo país baja</span> porque hay más trabajadores formales que contribuyen a la seguridad social. El costo: <span class="mm-bad">los empleadores que eludieron aportes quedan sin sanción</span>, lo que puede percibirse como inequitativo con quienes siempre cumplieron.' },
    ],
  ],

  // ── EVENTO 60: Fusión Nuclear / CNEA ─────────────────────────
  60: [
    // Opción 0: Inversión histórica en la CNEA
    [
      { slot: 'produccion', text: 'La <b>fusión nuclear</b> es la fuente de energía del futuro: limpia, inagotable y sin riesgo de accidente nuclear. <span class="mm-good">Argentina tiene el capital humano y la trayectoria científica para ser el primer país de América Latina con un reactor comercial de fusión</span>. <span class="mm-good">La producción sube 6 puntos, el desempleo cae 4</span>. Perderse esta ventana puede significar décadas de dependencia energética.' },
      { slot: 'economia', text: '<span class="mm-good">El retorno económico de liderar la fusión nuclear es difícil de cuantificar pero enorme</span>: exportación de tecnología, atracción de inversión científica internacional, independencia energética. <span class="mm-bad">La deuda sube 4 puntos y las reservas caen 3</span> por la inversión inicial, pero los países que invierten en esta tecnología ahora son los que van a vender energía al mundo en 30 años.' },
    ],
    // Opción 1: Asociación internacional
    [
      { slot: 'produccion', text: 'Cofinanciar con <b>EE.UU., Japón o la UE</b> <span class="mm-good">reduce el riesgo fiscal y acelera el acceso a tecnología de punta</span>. <span class="mm-good">Las reservas mejoran porque los socios aportan divisas</span>. El costo es compartir la propiedad intelectual. Si negociamos bien la participación accionaria, Argentina puede seguir siendo referente regional en energía nuclear.' },
      { slot: 'gabinete', text: '<span class="mm-good">Una asociación internacional de este nivel posiciona a la Argentina en la vanguardia científica global</span>. <span class="mm-good">La confianza sube</span> porque es un logro diplomático y tecnológico al mismo tiempo. Hay que cuidar que los contratos protejan el know-how argentino acumulado en décadas de trayectoria de la CNEA.' },
    ],
    // Opción 2: Postergar
    [
      { slot: 'produccion', text: '<span class="mm-bad">Postergar en un sector donde las ventanas de oportunidad se cierran rápido es perder la posición</span>. <span class="mm-bad">La producción baja levemente</span> porque el talento científico sin inversión emigra. <span class="mm-bad">La confianza cae 3 puntos</span>. Los países que están invirtiendo ahora van a tener las patentes y el liderazgo. Cuando queramos entrar, ya no estaremos en la frontera del conocimiento.' },
    ],
  ],

  // ── EVENTO 61: Rearme de las Fuerzas Armadas ─────────────────
  61: [
    // Opción 0: Plan de modernización completo
    [
      { slot: 'gabinete', text: 'El <b>70% del equipamiento militar con 40 años de antigüedad</b> es un problema real de soberanía. <span class="mm-good">La modernización reduce el riesgo de conflicto porque la disuasión funciona con equipamiento operativo</span>. <span class="mm-good">El riesgo país baja 5 puntos</span>. <span class="mm-good">El desempleo cae</span> porque la industria de defensa genera empleos calificados. Los créditos blandos regionales minimizan el impacto en reservas.' },
    ],
    // Opción 1: Modernización parcial crítica
    [
      { slot: 'gabinete', text: 'La <b>modernización de sistemas críticos</b> es la respuesta más eficiente fiscalmente. <span class="mm-good">El riesgo baja 3 puntos con menor costo en reservas</span>. Radares, sistemas de comunicación y capacidad antisubmarina son las prioridades reales para la disuasión. Los aviones de combate pueden esperar; los sistemas de vigilancia, no.' },
    ],
    // Opción 2: No rearmar, redirigir a lo social
    [
      { slot: 'social', text: 'Redirigir esos fondos a <span class="mm-good">educación, salud y vivienda reduce la pobreza 3 puntos y el desempleo 2</span>. <span class="mm-good">La confianza sube</span> porque la ciudadanía prioriza el bienestar social sobre el gasto militar. <span class="mm-bad">El riesgo sube 4 puntos</span> porque el deterioro del equipamiento militar es percibido como vulnerabilidad. Es una apuesta pacifista que tiene sentido en un contexto de buenas relaciones regionales.' },
    ],
  ],

  // ── EVENTO 62: Internet Gratuita como Servicio Público ────────
  62: [
    // Opción 0: Empresa estatal de telecomunicaciones
    [
      { slot: 'produccion', text: '<span class="mm-good">Conectividad universal gratuita en hogares pobres y rurales cierra la brecha digital que reproduce desigualdad educativa y laboral</span>. <span class="mm-good">La producción sube 4 puntos, el desempleo cae 4</span>. <span class="mm-bad">La deuda sube 5 puntos</span> para crear la infraestructura. Las telefónicas van a litigar, pero el Estado tiene derecho a crear empresas públicas en sectores estratégicos. ARSAT ya existe — es ampliarlo.' },
      { slot: 'social', text: '<span class="mm-good">El 35% de hogares rurales sin banda ancha es exclusión digital que bloquea el acceso a educación, trabajo y servicios del Estado</span>. <span class="mm-good">La pobreza baja 5 puntos y la confianza sube 11</span>. Internet como servicio público tiene la misma lógica que la electricidad o el agua: hay bienes que el mercado no provee donde no es rentable, y el Estado debe cubrirlos.' },
    ],
    // Opción 1: Subsidio a privados para zonas rurales
    [
      { slot: 'produccion', text: 'Pagar a empresas existentes <span class="mm-good">es más rápido que construir infraestructura desde cero</span>. <span class="mm-good">La producción sube y el desempleo cae</span>. <span class="mm-bad">La deuda sube menos que con la empresa estatal</span>. El riesgo es que los privados no cumplan los compromisos de cobertura. Hay que establecer multas contractuales reales y mecanismos de monitoreo independiente.' },
    ],
    // Opción 2: Obligación legal de cobertura total
    [
      { slot: 'produccion', text: 'Exigir cobertura del 100% por ley <span class="mm-good">no cuesta nada al fisco</span>. <span class="mm-good">La producción y el desempleo mejoran moderadamente</span>. El riesgo: <span class="mm-bad">las empresas pueden incumplir si no hay capacidad de control o si la penalidad no es suficiente</span>. Funciona mejor como complemento de otras medidas que como única política de conectividad.' },
    ],
  ],

  // ── EVENTO 63: Crisis Diplomática con Embajador ──────────────
  63: [
    // Opción 0: Expulsar al embajador
    [
      { slot: 'gabinete', text: '<span class="mm-good">La soberanía nacional es innegociable y la injerencia extranjera en política interna justifica la expulsión</span>. <span class="mm-good">La confianza sube en los sectores más nacionalistas</span>. Pero <span class="mm-bad">USD 800 millones en comercio bilateral son un costo real</span>. Antes de expulsar, hay que asegurarse de que las declaraciones califican legalmente como injerencia y no como simple crítica pública.' },
    ],
    // Opción 1: Nota de protesta formal
    [
      { slot: 'gabinete', text: '<span class="mm-good">La nota de protesta formal es la respuesta diplomáticamente correcta: firme sin escalar</span>. <span class="mm-good">El riesgo país sube levemente</span>, pero el comercio bilateral se preserva. <span class="mm-good">La confianza sube moderadamente</span>. La mayoría de los conflictos diplomáticos de este tipo se resuelven con este mecanismo. La expulsión es una herramienta de último recurso.' },
    ],
    // Opción 2: Gestión discreta
    [
      { slot: 'gabinete', text: 'La gestión discreta <span class="mm-good">protege el comercio y evita el escándalo</span>, pero <span class="mm-bad">la confianza baja 2 puntos</span> porque la ciudadanía que ya conoce el caso puede percibir la discreción como debilidad. Funciona mejor si el escándalo no está completamente en la prensa. Si ya es público, la discreción solo añade la percepción de que el gobierno no defiende la soberanía.' },
    ],
  ],

  // ── EVENTO 64: Narcocriminalidad ─────────────────────────────
  64: [
    // Opción 0: Operativo conjunto de fuerzas federales
    [
      { slot: 'gabinete', text: '<span class="mm-good">La presencia federal en zonas controladas por el narcotráfico es urgente</span>. <span class="mm-good">El riesgo baja 5 puntos y la confianza sube 7</span>. Hay que ser cuidadosos: <span class="mm-bad">el 30% de la policía local está comprometido</span>, así que la coordinación con fuerzas federales debe ser hermética. Sin inteligencia previa sólida, los operativos de shock solo desplazan a las bandas sin desmantelarlas.' },
    ],
    // Opción 1: Estrategia integral de recuperación de barrios
    [
      { slot: 'social', text: 'Los <b>centros de salud y tratamiento de adicciones</b> atacan la raíz del problema: el narcotráfico recluta donde el Estado nunca estuvo. <span class="mm-good">La pobreza baja 4 puntos, el desempleo 3 y la confianza sube 9</span>. El impacto es más lento que el operativo de shock, pero es el único que tiene resultados duraderos. Las ciudades con menor narcotráfico son las que tienen más Estado social, no más policía.' },
      { slot: 'gabinete', text: '<span class="mm-good">La estrategia integral reduce el riesgo de forma sostenida</span> porque aborda las condiciones que hacen al narco poderoso. Necesita coordinación entre Seguridad, Salud y Desarrollo Social — eso requiere voluntad política real y presupuesto multiministerial. Es más complejo de gestionar pero <span class="mm-good">produce la única transformación que no se revierte cuando se retiran las fuerzas</span>.' },
    ],
    // Opción 2: Legalización regulada
    [
      { slot: 'social', text: 'La <b>regulación estatal del mercado</b> es el modelo que más países están explorando para reducir la violencia del narcotráfico. <span class="mm-good">El riesgo baja 4 puntos y la pobreza cae</span> porque el Estado captura la renta que hoy va al crimen organizado. <span class="mm-bad">La confianza baja levemente</span> porque es una posición políticamente controversial. Requiere un marco legal robusto y coordinación con organismos internacionales.' },
    ],
  ],

  // ── EVENTO 65: Tasa de Natalidad / Crisis Demográfica ─────────
  65: [
    // Opción 0: Política de natalidad
    [
      { slot: 'social', text: '<span class="mm-good">Las guarderías gratuitas y las licencias parentales extendidas son la política que más impacta en la decisión de tener hijos</span>: la principal razón de no tener más hijos no es el deseo sino el costo económico y de cuidados. <span class="mm-good">La pobreza baja 3 puntos y la confianza sube</span>. El impacto demográfico es en 20 años, pero <span class="mm-good">los beneficios inmediatos en empleo y calidad de vida son concretos</span>.' },
    ],
    // Opción 1: Política migratoria activa
    [
      { slot: 'produccion', text: 'Atraer <b>migrantes jóvenes calificados</b> es la respuesta más rápida a la crisis demográfica. <span class="mm-good">La producción sube 4 puntos</span> porque llega fuerza de trabajo calificada. <span class="mm-bad">El desempleo local sube 2 puntos en el corto plazo</span> por mayor competencia laboral. A 10 años, los migrantes que trabajan y pagan impuestos sostienen el sistema previsional. Es la política demográfica más eficiente en términos de tiempo.' },
    ],
    // Opción 2: No intervenir
    [
      { slot: 'social', text: 'La natalidad es una decisión íntima, pero <span class="mm-bad">no intervenir cuando hay una tendencia que en 30 años hará insostenible el sistema previsional es una omisión con consecuencias enormes</span>. El Estado puede intervenir sin coaccionar: incentivos económicos, infraestructura de cuidados y flexibilidad laboral son herramientas que respetan la autonomía individual y al mismo tiempo crean condiciones para que quien quiera tener hijos, pueda.' },
    ],
  ],

  // ── EVENTO 66: Argentina Ganó el Mundial ─────────────────────
  66: [
    // Opción 0: Construir el estadio
    [
      { slot: 'economia', text: '<span class="mm-good">El momento post-mundial es la ventana perfecta para una inversión en infraestructura deportiva: la ciudadanía está eufórica y el apoyo político es máximo</span>. <span class="mm-good">El desempleo cae 4 puntos con la construcción</span>. <span class="mm-bad">La deuda sube y la pobreza sube levemente</span> porque los recursos no van a lo social. El debate real es si USD 1.200 millones en un estadio tienen mejor retorno que en vivienda.' },
    ],
    // Opción 1: Estadio más chico con resto para vivienda
    [
      { slot: 'social', text: 'El estadio de <b>50.000 plazas</b> <span class="mm-good">satisface la demanda deportiva con menor inversión y el resto va a vivienda social concreta</span>. <span class="mm-good">La pobreza baja 2 puntos y la confianza sube 5</span>. Es la solución que concilia la identidad cultural con las urgencias sociales. Políticamente, es la más difícil de atacar desde cualquier extremo del espectro.' },
    ],
    // Opción 2: No construir
    [
      { slot: 'social', text: 'Redirigir <span class="mm-good">USD 1.200 millones a emergencia habitacional tiene impacto social directo</span>: <span class="mm-good">la pobreza baja 4 puntos y el desempleo 2</span>. <span class="mm-bad">La confianza sube solo 3 puntos</span> porque hay ciudadanos que esperaban el estadio. Es la apuesta más consistente con las prioridades sociales declaradas del gobierno, aunque no sea la más popular en el momento de la euforia.' },
    ],
  ],

  // ── EVENTO 67: INDEC bajo sospecha ───────────────────────────
  67: [
    // Opción 0: Auditoría internacional
    [
      { slot: 'economia', text: '<span class="mm-good">Invitar a EUROSTAT y al FMI a auditar el INDEC es la única forma de restaurar la credibilidad estadística</span>. <span class="mm-good">El riesgo país cae 7 puntos y la confianza sube 11</span>: los mercados y los organismos internacionales valoran la transparencia estadística más que cualquier número concreto. Si el INDEC tiene razón, la auditoría lo confirma y el tema se cierra. Si no, es mejor saberlo ahora.' },
    ],
    // Opción 1: Reforma metodológica interna
    [
      { slot: 'economia', text: 'Cambiar los técnicos y actualizar la canasta básica <span class="mm-good">mejora la credibilidad con menor costo político que admitir una auditoría externa</span>. <span class="mm-good">El riesgo país baja 3 puntos</span>. El riesgo: <span class="mm-bad">si los mercados no perciben la reforma como suficientemente independiente, el problema de credibilidad persiste</span>. Una reforma interna bien comunicada puede ser suficiente si hay compromiso técnico real.' },
    ],
    // Opción 2: Defender el INDEC
    [
      { slot: 'economia', text: '<span class="mm-bad">Defender las estadísticas cuando MIT Price Stats dice que la inflación real duplica la oficial es una posición insostenible</span>. <span class="mm-bad">El riesgo país sube 8 puntos y la confianza cae 10</span>. Los bonos indexados al CER pagarán de menos a los tenedores y los litigios internacionales son inevitables. <span class="mm-bad">Esta opción no resuelve el problema, solo lo agrava</span>.' },
    ],
  ],

  // ── EVENTO 68: Glifosato ──────────────────────────────────────
  68: [
    // Opción 0: Prohibir el glifosato
    [
      { slot: 'social', text: 'El <b>metaanálisis de 47 estudios</b> es evidencia científica robusta que no se puede ignorar. <span class="mm-good">Prohibir el glifosato protege a las poblaciones rurales que llevan décadas denunciando el cáncer infantil</span>. <span class="mm-good">La confianza sube 5 puntos</span>. <span class="mm-bad">El IPC sube y la pobreza sube</span> porque los alimentos se encarecen. Hay que implementar un programa de transición para los productores.' },
      { slot: 'produccion', text: '<span class="mm-bad">La prohibición total impacta fuertemente la producción sojera: reservas caen 8, producción cae 7, pobreza sube 3</span>. Es el mayor shock productivo posible. Si vamos por esta vía, necesitamos un plan de transición con asistencia técnica y financiera para los productores que deben cambiar su modelo agronómico. Sin plan de transición, solo generamos pérdida sin beneficio alternativo.' },
    ],
    // Opción 1: Zona de exclusión 1.000 metros
    [
      { slot: 'social', text: 'La <b>exclusión de 1.000 metros alrededor de viviendas y escuelas</b> <span class="mm-good">protege a las poblaciones más expuestas sin destruir la producción</span>. <span class="mm-good">La pobreza baja 2 puntos</span> porque hay menos enfermedad. <span class="mm-good">La confianza sube 7 puntos</span> porque es una respuesta concreta y verificable. Es el equilibrio entre la evidencia científica y la realidad productiva del país.' },
      { slot: 'produccion', text: 'La zona de exclusión <span class="mm-bad">reduce algo la producción</span> en zonas cercanas a poblaciones, pero <span class="mm-good">la mayor parte de la actividad agropecuaria no está en esas franjas</span>. El impacto productivo es manejable. Los productores pueden adaptarse con ajustes en los calendarios de aplicación y las técnicas de pulverización.' },
    ],
    // Opción 2: Financiar alternativas
    [
      { slot: 'produccion', text: 'Subsidiar la transición a <b>herbicidas menos tóxicos</b> <span class="mm-good">es la solución de mediano plazo más sostenible</span>. <span class="mm-good">La confianza sube y la pobreza baja moderadamente</span>. <span class="mm-bad">A corto plazo la producción cae levemente</span> mientras los productores adaptan sus técnicas. Es la opción que alinea los intereses del sector productivo con los de la salud pública.' },
    ],
  ],

  // ── EVENTO 69: Cartel de Supermercados ───────────────────────
  69: [
    // Opción 0: Multa máxima y reforma de la ley
    [
      { slot: 'economia', text: 'USD 600.000 millones en daño al consumidor es uno de los mayores robos legales de la historia económica reciente. <span class="mm-good">La multa máxima y la reforma de la ley de competencia manda la señal más fuerte posible: la colusión tiene costo real</span>. <span class="mm-good">El IPC baja 3 puntos, la pobreza 4 y la confianza sube 10</span>. Las 5 cadenas no van a cerrar por la multa — tienen espalda para absorberla y van a preferir no reincidirla.' },
    ],
    // Opción 1: Acuerdo voluntario
    [
      { slot: 'economia', text: 'El acuerdo voluntario <span class="mm-good">resuelve el caso rápido</span>, pero <span class="mm-bad">sin multa ni reforma legal, el cartel puede rehacerse en 6 meses</span>. <span class="mm-good">El IPC baja levemente</span>. <span class="mm-bad">La confianza sube poco</span> porque la ciudadanía percibe impunidad. Un acuerdo sin sanción es una señal de que la defensa de la competencia en Argentina no tiene dientes reales.' },
    ],
    // Opción 2: Supermercados estatales
    [
      { slot: 'social', text: '<span class="mm-good">La competencia estatal directa es el mecanismo más efectivo para bajar precios al consumidor: el IPC cae 4 puntos y la pobreza 5</span>. <span class="mm-bad">La deuda sube 5 puntos</span> para crear la infraestructura. El riesgo: <span class="mm-bad">si la gestión del supermercado estatal es ineficiente, el costo fiscal puede superar el beneficio</span>. Requiere una conducción profesional y autonomía de gestión. Modelos similares funcionaron en Venezuela (mal) y en Uruguay (bien).' },
    ],
  ],

  // ── EVENTO 70: Geopolítica / Nueva Guerra Fría ───────────────
  70: [
    // Opción 0: Alineamiento occidental
    [
      { slot: 'economia', text: '<span class="mm-good">El TLC con la UE abre mercados de alto valor agregado y el FMI nos da financiamiento más barato</span>. <span class="mm-good">Las reservas suben 5, el riesgo baja 8 y la deuda cae</span>. <span class="mm-bad">Perder el mercado chino — que compra el 40% de nuestras exportaciones — es un riesgo enorme</span>. Hay que gestionar el conflicto con China con mucha habilidad diplomática para no romper el vínculo comercial.' },
    ],
    // Opción 1: Alineamiento con el eje asiático
    [
      { slot: 'economia', text: '<span class="mm-good">China compra el 40% de nuestras exportaciones y puede financiar proyectos sin las condicionalidades del FMI</span>. <span class="mm-good">Las reservas suben 8 y la producción mejora</span>. <span class="mm-bad">El riesgo país sube porque los mercados de deuda occidentales son los que principalmente financian al sector privado argentino</span>. El alineamiento con el eje asiático tiene retorno productivo pero costo financiero.' },
    ],
    // Opción 2: No alineamiento activo
    [
      { slot: 'gabinete', text: 'El <b>no alineamiento activo</b> es la tradición diplomática más inteligente para Argentina: <span class="mm-good">mantener relaciones con todos los actores globales según el interés concreto de cada sector</span>. <span class="mm-good">La confianza sube 6 puntos</span> porque hay autonomía estratégica real. <span class="mm-good">El riesgo baja moderadamente</span>. El riesgo: en un mundo cada vez más bipolar, la neutralidad se vuelve cada vez más difícil de sostener sin ceder algo a cada lado.' },
      { slot: 'economia', text: '<span class="mm-good">El pragmatismo relacional maximiza el acceso a distintos mercados y fuentes de financiamiento</span>. <span class="mm-good">La producción sube 2 puntos</span> porque comerciamos con todos. La clave es tener una narrativa coherente que explique por qué Argentina no elige bando: la defensa del multilateralismo y el derecho internacional son argumentos sólidos.' },
    ],
  ],

  // ── EVENTO 71: IA y Empleo Formal ────────────────────────────
  71: [
    // Opción 0: Fondo de Reconversión Laboral
    [
      { slot: 'social', text: 'La automatización eliminó <b>180.000 puestos</b> en 18 meses — esos trabajadores existen, tienen familias y tienen derechos. <span class="mm-good">El Fondo de Reconversión financiado por quienes automatizan es justicia distributiva</span>: las empresas se benefician de la productividad de la IA y contribuyen a la transición de quienes pierden el trabajo. <span class="mm-good">La pobreza baja 3 y el desempleo 3</span>.' },
      { slot: 'produccion', text: 'Crear el Fondo de Reconversión <span class="mm-good">no frena la innovación pero la hace socialmente sostenible</span>. <span class="mm-good">La producción mejora 3 puntos</span> porque los trabajadores reconvertidos son más productivos. <span class="mm-bad">La deuda sube 4 puntos</span>. El modelo funciona: Alemania usó algo similar durante la reconversión industrial y tuvo la mayor tasa de reinserción laboral de Europa.' },
    ],
    // Opción 1: Impuesto al Robot
    [
      { slot: 'economia', text: 'El <b>impuesto al robot</b> es una propuesta debatida globalmente. <span class="mm-good">Genera recursos para la transición laboral sin endeudamiento</span>. <span class="mm-bad">La producción cae 3 puntos porque las empresas invierten menos en automatización</span>. <span class="mm-bad">El riesgo país sube levemente</span>. El punto clave es calibrar la tasa: demasiado alta frena la innovación; demasiado baja no financia la reconversión.' },
    ],
    // Opción 2: Desregular totalmente
    [
      { slot: 'social', text: '<span class="mm-bad">La desregulación total genera 8 puntos de desempleo</span> — 180.000 trabajadores sin red de seguridad. <span class="mm-good">La producción sube 6 y las reservas mejoran</span> porque la inversión tecnológica es masiva. <span class="mm-bad">La pobreza sube 6 puntos</span>. El crecimiento sin distribución no es sostenible política ni socialmente. Es la solución que maximiza la eficiencia en el papel y maximiza el conflicto social en la práctica.' },
    ],
  ],

  // ── EVENTO 72: IA en el Estado ────────────────────────────────
  72: [
    // Opción 0: Implementar con auditoría ciudadana
    [
      { slot: 'gabinete', text: 'La <b>auditoría ciudadana de los algoritmos</b> es el modelo correcto: <span class="mm-good">aprovecha la eficiencia de la IA sin los riesgos de discriminación algorítmica</span>. <span class="mm-good">El riesgo baja 5 puntos y la confianza sube 10</span>. El derecho a impugnación humana es fundamental — ningún algoritmo debe tener la última palabra sobre el acceso a derechos sociales. Transparencia en el código y en las decisiones.' },
      { slot: 'produccion', text: '<span class="mm-good">La IA en el Estado bien implementada reduce el gasto en burocracia y aumenta la eficiencia del gasto público</span>. <span class="mm-good">La producción sube 4 puntos</span> porque los trámites empresariales se agilizan. <span class="mm-bad">La deuda sube 3 para financiar la implementación y la auditoría</span>. A largo plazo, el ahorro en eficiencia supera la inversión inicial.' },
    ],
    // Opción 1: Implementar rápido sin regulación
    [
      { slot: 'gabinete', text: '<span class="mm-good">La implementación rápida genera eficiencia y reduce el gasto</span>. <span class="mm-bad">Sin auditoría, los sesgos discriminatorios del algoritmo pueden negarle subsidios a quienes más los necesitan</span>. <span class="mm-bad">La confianza baja 3 puntos</span> cuando aparezcan los primeros casos de discriminación algorítmica — y van a aparecer. La velocidad sin control es la fórmula para una crisis de derechos digitales.' },
    ],
    // Opción 2: Rechazar el proyecto
    [
      { slot: 'produccion', text: '<span class="mm-bad">Rechazar la IA en el Estado es perder la oportunidad de modernizar la gestión pública</span>. <span class="mm-bad">La producción cae levemente</span> porque los procesos estatales siguen siendo lentos. <span class="mm-good">Se preservan los empleos burocráticos actuales</span>. La alternativa al uso responsable de la IA no es no usarla — es que otros la usen de forma no regulada mientras el Estado queda obsoleto.' },
    ],
  ],

  // ── EVENTO 73: Sequía Histórica en el Litoral ────────────────
  73: [
    // Opción 0: Plan Nacional Hídrico
    [
      { slot: 'produccion', text: '<span class="mm-good">La sequía está afectando 14 provincias y 2 millones de personas sin agua potable: la emergencia hídrica es la respuesta que corresponde a la escala del problema</span>. <span class="mm-good">La confianza sube 8 puntos</span>. <span class="mm-bad">La deuda sube 7 y las reservas caen</span>. El Plan Nacional Hídrico debe incluir obras de infraestructura permanente — canales, embalses, redes — porque la sequía estructural va a repetirse.' },
      { slot: 'social', text: '<span class="mm-good">Las obras de infraestructura hídrica crean empleo local en las provincias más afectadas</span>. <span class="mm-good">La pobreza baja 5 puntos</span> porque el agua potable es un determinante básico de la salud y la productividad. Las comunidades rurales y los barrios sin red de agua son los más vulnerables — hay que priorizar esas zonas en el Plan.' },
    ],
    // Opción 1: Camiones cisterna
    [
      { slot: 'social', text: 'Los camiones cisterna <span class="mm-good">dan respuesta inmediata a la urgencia</span>, pero <span class="mm-bad">no resuelven el problema estructural y son 10 veces más caros por litro que la red fija</span>. <span class="mm-bad">La producción cae 5 puntos porque la industria agropecuaria sigue sin agua</span>. Es aceptable como primera respuesta de emergencia mientras se organiza el Plan Hídrico, no como política sostenida.' },
    ],
    // Opción 2: Priorizar la industria sobre consumo domiciliario
    [
      { slot: 'social', text: '<span class="mm-bad">Racionar el consumo domiciliario para priorizar la agroindustria es una decisión que impacta directamente a los más vulnerables</span>. <span class="mm-bad">La pobreza sube 7 puntos y la confianza cae 12</span>. El derecho humano al agua potable está por encima del derecho a la renta agropecuaria. Las imágenes de familias sin agua en Argentina van a recorrer el mundo y el costo reputacional será enorme.' },
    ],
  ],

  // ── EVENTO 74: Acuífero Guaraní bajo presión ─────────────────
  74: [
    // Opción 0: Rechazar la concesión
    [
      { slot: 'produccion', text: 'El <b>Acuífero Guaraní</b> es la mayor reserva de agua dulce subterránea del mundo: <span class="mm-good">declararlo patrimonio estratégico es proteger el activo natural más valioso que tiene el país y la región</span>. <span class="mm-good">La confianza sube 11 puntos</span>. <span class="mm-bad">Las reservas caen levemente por los USD 800 millones que no llegan</span>. El agua no tiene precio cuando escasea: renunciar a ese ingreso hoy es la decisión más inteligente de largo plazo.' },
      { slot: 'gabinete', text: 'Brasil y los pueblos originarios se oponen — y tienen razón jurídica y moral. <span class="mm-good">Rechazar la concesión fortalece las relaciones regionales con Brasil y Paraguay</span>. El Acuífero es un recurso compartido que requiere gestión multilateral, no unilateral. <span class="mm-good">La decisión de rechazo puede convertirse en el punto de partida de un tratado regional de protección del Acuífero</span>.' },
    ],
    // Opción 1: Concesión limitada con monitoreo
    [
      { slot: 'produccion', text: 'El 10% de lo solicitado con <b>royalties y monitoreo ambiental</b> <span class="mm-good">genera ingresos sin comprometer el recurso estratégico</span>. <span class="mm-good">Las reservas suben 5, la deuda baja 4</span>. El riesgo: <span class="mm-bad">si el monitoreo falla o la corporación presiona para ampliar la concesión, el daño puede ser irreversible</span>. La clave es que el monitoreo sea independiente y con capacidad de detener las operaciones.' },
    ],
    // Opción 2: Aprobar la concesión completa
    [
      { slot: 'produccion', text: '<span class="mm-good">USD 800 millones anuales en regalías y grandes mejoras en reservas y deuda</span> son tentadores. Pero <span class="mm-bad">aprobar la extracción de 500 millones de litros diarios de un acuífero que tarda siglos en recargarse es una hipoteca sobre el futuro del país y la región</span>. <span class="mm-bad">La confianza cae 14 puntos</span>. Los beneficios son para esta gestión; el daño, para las próximas generaciones.' },
    ],
  ],

  // ── EVENTO 75: Brecha Salarial de Género ─────────────────────
  75: [
    // Opción 0: Ley de Igualdad Salarial con auditoría
    [
      { slot: 'social', text: 'Un <b>27% de diferencia salarial por igual tarea</b> no es mercado: es discriminación estructural. <span class="mm-good">La Ley de Igualdad Salarial con registros obligatorios reduce esa brecha en 2-3 años en los países que la implementaron</span>. <span class="mm-good">La pobreza baja 5 puntos, el desempleo 2 y la confianza sube 10</span>. La transparencia salarial no es burocracia — es el único mecanismo que hace visible la discriminación.' },
      { slot: 'economia', text: 'La igualdad salarial <span class="mm-good">aumenta el ingreso disponible de los hogares donde las mujeres trabajan</span>, lo que dinamiza el consumo. <span class="mm-good">La producción sube 2 puntos</span>. <span class="mm-bad">Algunas empresas van a argumentar sobrecosto, pero la evidencia internacional muestra que la igualdad salarial no reduce la competitividad</span> — solo redistribuye la renta del trabajo hacia abajo.' },
    ],
    // Opción 1: Capacitación y sensibilización
    [
      { slot: 'social', text: 'La sensibilización es importante pero insuficiente como única política. <span class="mm-good">Reduce la brecha moderadamente en el mediano plazo</span> sin costo de conflicto con las cámaras empresarias. <span class="mm-good">La confianza sube 5 puntos</span>. El riesgo: <span class="mm-bad">sin obligaciones legales, las empresas que no quieren cambiar no lo hacen</span>. Funciona mejor como complemento de la ley, no como sustituto.' },
    ],
    // Opción 2: Derivar al diálogo sectorial
    [
      { slot: 'social', text: '<span class="mm-bad">Las negociaciones paritarias sectoriales no resuelven la brecha de género porque los sindicatos históricamente no incorporaron el tema como central</span>. <span class="mm-bad">La confianza cae 4 puntos</span> porque el movimiento de mujeres lee esto como evasión. La brecha salarial existe hace décadas en todas las paritarias — si el diálogo sectorial fuera suficiente, ya la habría resuelto.' },
    ],
  ],

  // ── EVENTO 55: Deserción Escolar / Secundaria ────────────────
  55: [
    // Opción 0: Beca universal $30.000 mensuales
    [
      { slot: 'social', text: 'La <b>beca universal</b> ataca la causa principal de abandono: la necesidad de trabajar. <span class="mm-good">La pobreza baja 6 puntos y la confianza sube 11</span>. Mantener a los jóvenes en la escuela es la mejor política de empleo a 10 años. <span class="mm-bad">La deuda sube para financiarla</span>, pero el costo de un joven sin secundaria completa para el sistema previsional y de salud es mucho mayor.' },
      { slot: 'economia', text: '<span class="mm-good">Cada año adicional de educación aumenta el salario futuro entre un 8% y 12%</span>. La beca es una inversión con retorno fiscal comprobado: más años de educación = más ingresos = más recaudación. <span class="mm-bad">El IPC sube levemente</span> porque hay más pesos en circulación, pero <span class="mm-good">el retorno productivo a largo plazo supera con creces el costo</span>.' },
    ],
    // Opción 1: Reforma curricular
    [
      { slot: 'social', text: 'Adaptar la secundaria al siglo XXI <span class="mm-good">reduce el abandono estructural que se genera por la desconexión entre lo que enseña la escuela y la realidad que viven los jóvenes</span>. <span class="mm-good">La pobreza baja 3 puntos y la confianza sube</span>. El impacto no es inmediato — los cambios curriculares tardan años en verse en las estadísticas — pero es más sostenible que un subsidio sin cambio pedagógico.' },
    ],
    // Opción 2: Doble jornada con alimentación
    [
      { slot: 'social', text: 'La <b>doble jornada</b> con comida garantizada <span class="mm-good">retiene a los alumnos porque resuelve la seguridad alimentaria al mismo tiempo</span>. <span class="mm-good">La pobreza baja 4 puntos y la confianza sube</span>. El impacto es más gradual que la beca pero <span class="mm-good">el desempleo baja porque se crean puestos en docencia, cocina y actividades extracurriculares</span>.' },
    ],
  ],


  // ── EVENTO 76: Protocolo de Género en el Estado ───────────────
  76: [
    // Opción 0: Protocolo integral con sanciones
    [
      { slot: 'social', text: 'El escándalo de acoso en tres ministerios requiere una respuesta institucional real. <span class="mm-good">Un protocolo con sanciones efectivas y garantías de anonimato es la única forma de que las víctimas denuncien sin miedo a represalias</span>. <span class="mm-good">La confianza sube 12 puntos</span>. Las comisiones independientes deben tener autonomía presupuestaria y reportar al Congreso, no al Ejecutivo, para garantizar su credibilidad.' },
      { slot: 'gabinete', text: '<span class="mm-good">El protocolo integral posiciona al gobierno como referente en derechos en el ámbito laboral público</span>. <span class="mm-bad">Habrá resistencias internas</span> — sectores del Estado que temen la exposición. Pero la alternativa es que el problema siga existiendo y que el próximo escándalo sea peor. <span class="mm-good">El riesgo país baja porque el gobierno muestra estabilidad institucional</span>.' },
    ],
    // Opción 1: Investigar caso por caso
    [
      { slot: 'gabinete', text: 'Los sumarios internos pueden resolver los casos puntuales, pero <span class="mm-bad">sin política general el problema se repite</span>. <span class="mm-bad">La confianza baja 2 puntos</span> porque se percibe que el gobierno trata el acoso como un error individual, no como un problema estructural que necesita una respuesta sistémica. Es reaccionar a la crisis, no prevenirla.' },
    ],
    // Opción 2: Aceptar el proyecto opositor más débil
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Aceptar un protocolo más débil a cambio de apoyo parlamentario en otra agenda es usar los derechos de las mujeres como moneda de cambio</span>. <span class="mm-bad">La confianza cae 6 puntos</span> porque el movimiento feminista y la sociedad civil van a identificar exactamente lo que ocurrió. El capital político que se gana en la otra agenda no compensa el daño en credibilidad.' },
    ],
  ],

  // ── EVENTO 77: Economía del Cuidado ──────────────────────────
  77: [
    // Opción 0: Sistema Nacional de Cuidados
    [
      { slot: 'social', text: 'El <b>76% del trabajo de cuidado lo hacen las mujeres sin remuneración</b>: es la mayor transferencia de valor no reconocida de la economía. <span class="mm-good">Crear guarderías públicas libera a millones de mujeres para el mercado laboral formal</span>. <span class="mm-good">La pobreza baja 6, el desempleo 4 y la confianza sube 11</span>. Cada guardería pública genera empleo para cuidadoras y permite que una madre trabaje — es multiplicador doble.' },
      { slot: 'economia', text: 'El <b>15,9% del PBI</b> en trabajo no remunerado es la mayor externalidad positiva de nuestra economía que el sistema nunca reconoció. <span class="mm-good">Reconocer el trabajo doméstico en el sistema previsional corrige una injusticia y evita la pobreza en la vejez de millones de mujeres</span>. <span class="mm-bad">La deuda sube 6 puntos</span>, pero el retorno en productividad laboral femenina y en recaudación futura lo justifica.' },
    ],
    // Opción 1: Solo licencias igualitarias
    [
      { slot: 'social', text: 'Las <b>licencias igualitarias de 90 días</b> para padres y cuidadores <span class="mm-good">redistribuyen el cuidado entre hombres y mujeres</span> y reducen la brecha de género en el mercado laboral. <span class="mm-good">La pobreza baja 3 y la confianza sube 7</span>. Es un paso real y mucho menos costoso que el Sistema Nacional completo. <span class="mm-bad">Sin la red de centros de cuidado</span>, las licencias son útiles pero insuficientes para las familias más vulnerables.' },
    ],
    // Opción 2: Solo datos y diagnóstico
    [
      { slot: 'social', text: '<span class="mm-bad">Publicar los datos y no actuar es la respuesta más insatisfactoria posible</span>. El movimiento de mujeres y las organizaciones sociales esperaban políticas concretas, no más informes. <span class="mm-bad">La confianza cae 5 puntos</span>. Si hay restricción fiscal real, hay que decirlo con honestidad y proponer un cronograma de implementación gradual. La postergación indefinida sin plan es peor que un plan parcial.' },
    ],
  ],

  // ── EVENTO 78: Pueblos Originarios / Relevamiento Territorial ─
  78: [
    // Opción 0: Completar relevamiento y suspender desalojos
    [
      { slot: 'social', text: 'La <b>Ley 26.160</b> tiene 20 años de incumplimiento acumulado. <span class="mm-good">Suspender los desalojos mientras dura el relevamiento es la única forma de cumplir el espíritu de la ley</span>. <span class="mm-good">La confianza sube 9 puntos</span>. La Relatoría de la ONU está mirando — actuar bien ahora evita un informe internacional crítico que dañe la imagen del país. El territorio titulado es también territorio que puede desarrollarse con respaldo legal.' },
      { slot: 'gabinete', text: '<span class="mm-good">Suspender los desalojos reduce el riesgo de conflictos de alta visibilidad internacional</span>. Los enfrentamientos entre comunidades y fuerzas de seguridad son las imágenes que más dañan la imagen del país en los foros de derechos humanos. <span class="mm-good">El riesgo baja 3 puntos</span>. Hay que coordinar con las provincias para que la suspensión sea operativa y no quede solo en el papel nacional.' },
    ],
    // Opción 1: Dejar actuar a la justicia
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Respetar sentencias que se basan en un relevamiento incompleto perpetúa la injusticia</span>. El Ejecutivo tiene herramientas legales para intervenir en cumplimiento de la Ley 26.160 sin interferir con la independencia judicial. <span class="mm-bad">La confianza cae 7 puntos</span>. La Relatoría de la ONU va a emitir un informe lapidario y el conflicto territorial va a escalar.' },
    ],
    // Opción 2: Priorizar inversión en zonas en disputa
    [
      { slot: 'social', text: 'Ofrecer regalías a comunidades sin resolver el conflicto territorial de fondo <span class="mm-bad">es intentar comprar derechos que no son negociables</span>. <span class="mm-bad">La confianza cae 11 puntos</span>. Los pueblos originarios, sus organizaciones internacionales y los organismos de DDHH van a rechazar públicamente esta propuesta. El conflicto se agrava y cualquier proyecto extractivo en zona en disputa enfrenta litigios internacionales que pueden frenarlo igual.' },
    ],
  ],

  // ── EVENTO 79: Lenguas Originarias en las Aulas ──────────────
  79: [
    // Opción 0: Educación intercultural bilingüe obligatoria
    [
      { slot: 'social', text: 'Las <b>lenguas originarias</b> son patrimonio cultural irreemplazable: cada idioma que muere lleva consigo una visión del mundo única. <span class="mm-good">La educación intercultural bilingüe reduce la pobreza 3 puntos en comunidades indígenas</span> porque aumenta la retención escolar. <span class="mm-good">La confianza sube 8 puntos</span>. <span class="mm-bad">La deuda sube para financiar la formación docente</span>, pero es una inversión en identidad y en inclusión.' },
    ],
    // Opción 1: Optativa provincial
    [
      { slot: 'social', text: 'Dejar la decisión a las provincias <span class="mm-good">respeta la autonomía federal y evita conflictos con provincias que no tienen capacidad inmediata</span>. <span class="mm-good">La confianza sube moderadamente</span>. El riesgo: <span class="mm-bad">las provincias con mayor población indígena suelen ser las más pobres y las que menos recursos tienen para implementar la educación intercultural sin apoyo nacional</span>. La optativa sin financiamiento puede ser una promesa vacía.' },
    ],
    // Opción 2: Rechazar
    [
      { slot: 'social', text: '<span class="mm-bad">Rechazar la educación intercultural por restricción presupuestaria envía un mensaje de desvalorización cultural que tiene costo en confianza y en relaciones con comunidades indígenas</span>. <span class="mm-bad">La confianza cae 6 puntos</span>. El argumento del presupuesto pierde credibilidad cuando el Estado financia otras iniciativas de menor impacto social. Hay opciones de implementación gradual que son mucho menos costosas que el modelo pleno.' },
    ],
  ],

  // ── EVENTO 80: Malvinas / ONU ─────────────────────────────────
  80: [
    // Opción 0: Ofensiva multilateral completa
    [
      { slot: 'gabinete', text: 'El <b>Comité de Descolonización</b> es el foro correcto para este reclamo y Argentina tiene argumentos jurídicos sólidos sobre la plataforma continental. <span class="mm-good">La confianza sube 12 puntos</span> porque la ciudadanía valora la firmeza en la cuestión Malvinas. <span class="mm-good">El riesgo baja 3 puntos</span> porque la posición diplomática activa muestra estabilidad de política exterior. Los apoyos regionales del MERCOSUR y la CELAC deben activarse antes de la sesión.' },
    ],
    // Opción 1: Proponer diálogo bilateral
    [
      { slot: 'gabinete', text: 'Un diálogo bilateral en formato <b>2+2</b> es pragmático: <span class="mm-good">las reservas mejoran levemente porque el comercio bilateral con el Reino Unido se preserva</span>. <span class="mm-good">La confianza sube moderadamente</span>. El riesgo es que el formato con representantes de los isleños implica reconocerles una representación que Argentina históricamente rechaza. Hay que ser muy cuidadoso en los términos para no ceder posición jurídica.' },
    ],
    // Opción 2: Posición cautelosa
    [
      { slot: 'gabinete', text: '<span class="mm-bad">La cautela en Malvinas es leída como abandono del reclamo</span> por la ciudadanía y los organismos que siguen el tema. <span class="mm-bad">La confianza cae 5 puntos</span>. El comercio con el Reino Unido no se ve afectado por una posición diplomática firme — Argentina y el Reino Unido mantienen intercambio comercial incluso en períodos de tensión diplomática alta. No hay razón de peso para la cautela.' },
    ],
  ],

  // ── EVENTO 81: Pesca Ilegal en el Atlántico Sur ──────────────
  81: [
    // Opción 0: Operativo soberanía naval
    [
      { slot: 'produccion', text: '<span class="mm-good">USD 1.800 millones anuales en pesca ilegal es el equivalente a varios programas sociales completos</span>. Defender la ZEE es defender la economía nacional. <span class="mm-good">La producción mejora y la confianza sube 11 puntos</span>. <span class="mm-bad">La deuda sube para financiar el patrullaje reforzado</span>. La comunicación diplomática debe ser paralela: separar el tema de la pesca ilegal de la relación comercial con China es clave.' },
    ],
    // Opción 1: Acuerdo regional MERCOSUR
    [
      { slot: 'gabinete', text: 'Un <b>sistema conjunto de monitoreo satelital</b> con Brasil, Uruguay y Paraguay <span class="mm-good">es más efectivo que actuar solos porque cubre un área más grande con menores costos por país</span>. <span class="mm-good">La confianza sube 8 puntos</span>. El acuerdo regional además envía un mensaje diplomático más contundente a China que una acción unilateral. Es la respuesta más inteligente estratégicamente.' },
    ],
    // Opción 2: Negociación silenciosa con China
    [
      { slot: 'produccion', text: '<span class="mm-bad">La gestión silenciosa no desincentiva la pesca ilegal</span>: si no hay costo visible para China, no hay razón para cambiar el comportamiento de sus flotas. <span class="mm-bad">La confianza cae 8 puntos</span> cuando la ciudadanía percibe que el Estado no defiende la soberanía marítima por no afectar la relación comercial. El silencio estratégico tiene un costo de legitimidad muy alto.' },
    ],
  ],

  // ── EVENTO 82: Criptomonedas / Boom Cripto ────────────────────
  82: [
    // Opción 0: Marco regulatorio con tributación
    [
      { slot: 'economia', text: '<b>4 millones de argentinos</b> ya usan cripto: es un sector que existe con o sin regulación estatal. <span class="mm-good">Un marco legal claro con tributación es más inteligente que la prohibición</span>: <span class="mm-good">las reservas suben, el riesgo baja 4 y la confianza sube 7</span>. Los usuarios que hoy evaden porque no hay reglas claras pasan a la formalidad. La regulación atrae empresas serias y expulsa a las fraudulentas.' },
      { slot: 'produccion', text: 'La regulación cripto <span class="mm-good">genera empleo en el sector fintech y atrae inversión tecnológica</span>. <span class="mm-good">La producción sube 2</span>. Las empresas de blockchain que operan en un marco legal estable invierten más y generan más valor. El FMI también presiona por regulación — cumplirla mejora la relación con el organismo.' },
    ],
    // Opción 1: Zona franca cripto
    [
      { slot: 'economia', text: '<span class="mm-good">El hub regional de blockchain puede atraer empresas tech que hoy operan desde Paraguay o Uruguay</span>. <span class="mm-good">Las reservas suben 5, la deuda cae y el desempleo cae 3</span>. El riesgo: <span class="mm-bad">el ecosistema regulatorio muy laxo puede atraer también operaciones de lavado de dinero</span>. Hay que diseñar la zona franca con controles anti-lavado robustos para que el beneficio no venga con ese costo.' },
    ],
    // Opción 2: Prohibición de exchanges
    [
      { slot: 'economia', text: '<span class="mm-bad">Prohibir los exchanges locales no elimina el uso de cripto — solo lo empuja a plataformas extranjeras fuera de la jurisdicción argentina</span>. <span class="mm-bad">El riesgo país sube 4, la confianza cae 8 y las reservas caen porque los flujos van al exterior</span>. China probó la prohibición y el mercado cripto chino simplemente migró a VPNs y plataformas de otros países. No funciona.' },
    ],
  ],

  // ── EVENTO 83: Bono Verde en Blockchain ──────────────────────
  83: [
    // Opción 0: Apoyar el proyecto piloto
    [
      { slot: 'economia', text: 'El <b>bono verde blockchain</b> es innovación financiera real: <span class="mm-good">atrae inversores internacionales que no comprarían deuda argentina tradicional</span>. <span class="mm-good">Las reservas suben 3, el riesgo baja 4 y la confianza sube 8</span>. Si Argentina puede posicionarse como pionera en finanzas verdes descentralizadas, el retorno en reputación y en acceso a capital internacional es considerable.' },
      { slot: 'produccion', text: '<span class="mm-good">El financiamiento de energía eólica con bono verde genera empleo en la Patagonia y reduce la dependencia energética</span>. <span class="mm-good">La producción sube 4</span>. El BID ofrece asistencia técnica — aprovecharla reduce el riesgo de implementación. Un piloto exitoso puede replicarse en otras provincias y en el nivel nacional.' },
    ],
    // Opción 1: Regular primero
    [
      { slot: 'economia', text: 'Legislar antes de emitir <span class="mm-good">reduce el riesgo jurídico del instrumento</span>. <span class="mm-good">El riesgo baja levemente</span>. El costo: <span class="mm-bad">el proceso legislativo puede demorar 2 años y la ventana de oportunidad puede cerrarse</span>. Si el Congreso puede legislar en 6 meses con acompañamiento técnico del BID, tiene sentido. Si va a tardar más, es mejor apoyar el piloto con un marco administrativo provisional.' },
    ],
    // Opción 2: Vetar la iniciativa
    [
      { slot: 'economia', text: '<span class="mm-bad">Vetar una iniciativa innovadora por miedo a la fragmentación financiera es demasiado conservador</span>. <span class="mm-bad">La confianza cae 6 y la producción baja levemente</span>. El riesgo de fragmentación es real pero manejable con coordinación técnica entre Nación y provincia. La señal de que el gobierno bloquea la innovación financiera provincial puede desincentivar otras iniciativas en el futuro.' },
    ],
  ],

  // ── EVENTO 84: Reforma Judicial ──────────────────────────────
  84: [
    // Opción 0: Reforma integral con consulta amplia
    [
      { slot: 'gabinete', text: 'El <b>87% de impunidad</b> y 1.200 juzgados vacantes es una crisis de gobernabilidad real. <span class="mm-good">Una reforma integral con universidades, colegios de abogados y sociedad civil tiene más legitimidad y más posibilidades de sostenerse en el tiempo</span>. <span class="mm-good">El riesgo baja 6 puntos y la confianza sube 11</span>. La reforma judicial es la reforma estructural más importante que puede hacer un gobierno democrático.' },
      { slot: 'social', text: 'La justicia que no funciona <span class="mm-bad">es el mayor obstáculo para los derechos de los más vulnerables</span>: causas de violencia de género demoradas, disputas laborales que tardan décadas, procesos penales sin resolución. <span class="mm-good">Una reforma real reduce la pobreza 2 puntos</span> porque el acceso a la justicia oportuna tiene un valor económico directo para las familias que necesitan cobrar lo que les deben.' },
    ],
    // Opción 1: Reforma acotada de designaciones
    [
      { slot: 'gabinete', text: 'Destrabar las <b>1.200 vacantes</b> es el paso más urgente y más manejable políticamente. <span class="mm-good">El riesgo baja 3 y la confianza sube 5</span>. Una reforma acotada bien ejecutada puede ser el punto de partida para reformas más amplias. No hay que subestimar el impacto de tener juzgados funcionando en ciudades donde hoy las causas prescriben por falta de juez.' },
    ],
    // Opción 2: Postergar
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Postergar la reforma judicial mientras el capital político existe es perder la ventana</span>. <span class="mm-bad">La confianza cae 7 puntos</span> porque todos los sectores — de derecha, de izquierda y del centro — reclaman una justicia que funcione. <span class="mm-bad">El riesgo sube 2</span>. Cada año de demora es un año más de causas que prescriben, juzgados vacantes y ciudadanos sin acceso a sus derechos.' },
    ],
  ],

  // ── EVENTO 85: Lawfare y Justicia ────────────────────────────
  85: [
    // Opción 0: Respeto irrestricto a la Justicia
    [
      { slot: 'gabinete', text: '<span class="mm-good">Garantizar la independencia judicial es la decisión que mejor protege a la institución y al gobierno a largo plazo</span>. <span class="mm-good">El riesgo baja 5 puntos y la confianza sube 10</span>. Los organismos internacionales, los mercados y la ciudadanía moderada valoran que el Ejecutivo respete los límites constitucionales. Si el acusado es inocente, el proceso lo va a demostrar.' },
    ],
    // Opción 1: Defensa pública del acusado
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Cuestionar públicamente el proceso judicial cuando hay evidencia presentada configura interferencia en el Poder Judicial</span>. <span class="mm-bad">El riesgo sube 4, la confianza cae 9</span>. Los sectores independientes y la prensa internacional van a leer esto como intento de presión sobre la justicia. El costo político de defender públicamente a un ex funcionario imputado es desproporcionado respecto a cualquier beneficio.' },
    ],
    // Opción 2: Silencio estratégico
    [
      { slot: 'gabinete', text: 'El silencio puede ser la opción más cómoda en el corto plazo. <span class="mm-bad">La confianza baja levemente</span> porque los aliados del acusado esperan más del gobierno. <span class="mm-good">No crea el daño que genera la defensa pública</span>. Es una posición intermedia que da margen de gestión, pero que tampoco construye capital democrático. La institucionalidad se construye con señales claras, no con silencios.' },
    ],
  ],

  // ── EVENTO 86: Economía Circular ─────────────────────────────
  86: [
    // Opción 0: Implementar en 24 meses
    [
      { slot: 'produccion', text: 'El <b>Sistema Nacional de Economía Circular</b> <span class="mm-good">formaliza 40.000 cartoneros con derechos laborales y seguridad social</span>. <span class="mm-good">El desempleo cae 5 puntos y la confianza sube 9</span>. <span class="mm-bad">La deuda sube 3</span>. Los países que implementaron responsabilidad extendida del productor — Alemania, Suecia — redujeron costos de gestión de residuos en un 40% en 10 años. Es inversión, no gasto.' },
      { slot: 'social', text: '<span class="mm-good">Formalizar a los cartoneros es reconocer un trabajo esencial que el Estado ignoró por décadas</span>. <span class="mm-good">La pobreza baja 4 puntos</span>. Las cooperativas de recicladores con apoyo del BID tienen modelos exitosos en Brasil, Colombia y Argentina mismo. La reducción del 17 millones de toneladas de basura sin reciclar también tiene valor ambiental y sanitario directo.' },
    ],
    // Opción 1: Plan gradual a 5 años
    [
      { slot: 'produccion', text: 'El plan gradual <span class="mm-good">da tiempo a la industria para adaptarse sin shock competitivo</span>. <span class="mm-good">La producción sube 2 y el desempleo baja</span>. <span class="mm-bad">El impacto en pobreza y desempleo es menor que el plan corto</span>, pero la implementación es más robusta porque hay menos resistencia empresarial. Si los plazos se cumplen, el resultado final es similar al del plan de 24 meses.' },
    ],
    // Opción 2: Solo el etiquetado
    [
      { slot: 'produccion', text: 'El etiquetado solo <span class="mm-good">tiene costo fiscal cero y genera conciencia</span>, pero <span class="mm-bad">no formaliza cartoneros, no establece responsabilidad del productor ni reduce el flujo de residuos sin reciclaje</span>. Es un primer paso muy pequeño. <span class="mm-good">La confianza sube apenas 1 punto</span>. El ciudadano que sabe que su envase es reciclable pero no tiene dónde llevarlo no puede cambiar nada.' },
    ],
  ],

  // ── EVENTO 87: Plan Climático Nacional / COP ─────────────────
  87: [
    // Opción 0: Compromisos ambiciosos con regulación del metano
    [
      { slot: 'produccion', text: 'El <b>agro emite el 35% de las emisiones nacionales</b> — no se puede tener una política climática creíble sin regularlo. <span class="mm-good">Los compromisos ambiciosos ante la COP generan acceso a financiamiento climático internacional que hoy no tenemos</span>. <span class="mm-good">El riesgo baja 4, la confianza sube 10</span>. <span class="mm-bad">La producción cae levemente</span> en el agro por la regulación del metano bovino, pero la conversión energética compensa.' },
      { slot: 'economia', text: '<span class="mm-good">Los fondos climáticos del Banco Mundial, BID y Green Climate Fund se desbloquean con compromisos verificables</span>. Argentina puede financiar parte de su transición con esos fondos. <span class="mm-bad">Habrá tensión con el sector agropecuario exportador</span>. El desafío es diseñar la regulación del metano de manera gradual para que no impacte en la competitividad exportadora en el corto plazo.' },
    ],
    // Opción 1: Energías renovables sin tocar el agro
    [
      { slot: 'produccion', text: 'Llevar las energías renovables al <b>50% para 2030</b> <span class="mm-good">es un compromiso ambicioso y alcanzable con la capacidad eólica y solar que tenemos</span>. <span class="mm-good">El desempleo cae 2, la producción sube 2</span>. <span class="mm-bad">No regular el metano agropecuario va a ser criticado internacionalmente</span>, pero es una posición negociable: Argentina puede comprometerse a un plan de reducción del metano bovino con plazos más largos.' },
    ],
    // Opción 2: Mantener compromisos actuales
    [
      { slot: 'economia', text: '<span class="mm-bad">Mantener los compromisos actuales cuando el país va camino a superarlos es perder credibilidad en la COP</span>. <span class="mm-bad">La confianza cae 4 puntos</span>. El financiamiento climático internacional está condicionado a compromisos progresivos verificables. No elevar las metas cierra la puerta a fondos concesionales que podrían financiar la transición energética sin aumentar la deuda comercial.' },
    ],
  ],

  // ── EVENTO 88: Atucha III / Energía Nuclear ───────────────────
  88: [
    // Opción 0: Aprobar Atucha III con financiamiento diversificado
    [
      { slot: 'produccion', text: 'La <b>energía nuclear de cuarta generación</b> es segura, limpia y base — no depende del viento ni del sol. <span class="mm-good">Atucha III genera 7 puntos de producción adicional y crea 4.000 empleos de alta calificación</span>. <span class="mm-bad">La deuda sube 8 puntos</span>. <span class="mm-good">El financiamiento diversificado con Brasil, UE y AIEA reduce la dependencia de China y mejora las condiciones del crédito</span>. INVAP tiene el know-how para participar activamente.' },
      { slot: 'economia', text: '<span class="mm-good">La energía nuclear baja el costo de la energía eléctrica a largo plazo porque el costo variable del reactor es mínimo una vez construido</span>. <span class="mm-good">El riesgo baja 3 puntos</span> porque la independencia energética reduce la vulnerabilidad ante shocks de precios internacionales. La deuda es alta pero el plazo de repago de infraestructura nuclear es de 40-60 años — está bien que sea deuda de largo plazo.' },
    ],
    // Opción 1: Redirigir a renovables
    [
      { slot: 'produccion', text: '<span class="mm-good">Los parques solares y eólicos tienen tiempos de construcción de 2-3 años contra 10-15 del nuclear</span>. <span class="mm-good">El impacto en desempleo y producción es más rápido</span>. <span class="mm-bad">La deuda sube igual aunque algo menos</span>. El costo por MW instalado en renovables ya es menor que en nuclear. La pregunta es si las renovables pueden proveer la misma estabilidad de base que la nuclear.' },
    ],
    // Opción 2: Postergar con nuevo estudio
    [
      { slot: 'produccion', text: '<span class="mm-bad">Postergar la decisión energética estructural cuando el sistema eléctrico ya está al límite de su capacidad es diferir un problema que se agrava</span>. <span class="mm-bad">La confianza cae 4 puntos</span>. Los ingenieros de CNEA e INVAP tienen décadas de know-how acumulado — si no se usa ahora, los talentos emigran y ese conocimiento se pierde. El estudio de factibilidad ya fue hecho varias veces.' },
    ],
  ],

  // ── EVENTO 89: Economía Popular / Reconocimiento ─────────────
  89: [
    // Opción 0: Estatuto del Trabajador Popular
    [
      { slot: 'social', text: '<b>4 millones de trabajadores</b> sin jubilación, sin obra social y sin protección laboral es la mayor deuda social pendiente. <span class="mm-good">El Estatuto reduce la pobreza 7 puntos y el desempleo 6 — es el impacto social más alto de cualquier política en este juego</span>. <span class="mm-good">La confianza sube 12 puntos</span>. La UTEP tiene capacidad de movilización para defender la ley y el 0,4% del PBI de costo es perfectamente manejable.' },
      { slot: 'economia', text: '<span class="mm-good">Los 4 millones que pasan al sistema de protección social son 4 millones que consumen más, se enferman menos y cuestan menos al Estado de urgencia</span>. <span class="mm-bad">La deuda sube 5 puntos</span>, pero el ahorro en hospitales de emergencia, en pobreza extrema y en criminalidad asociada a la exclusión compensa a mediano plazo. Es el tipo de gasto social que tiene retorno fiscal demostrable.' },
    ],
    // Opción 1: Monotributo social reforzado
    [
      { slot: 'social', text: 'El <b>monotributo social reforzado</b> <span class="mm-good">es un puente hacia la formalidad que respeta la realidad de los trabajadores populares</span>. <span class="mm-good">La pobreza baja 4 y el desempleo 3</span>. Tiene menos impacto que el Estatuto completo pero es más fácil de implementar administrativamente y genera menos resistencia desde el sector empresario privado. Puede ser una etapa hacia la solución completa.' },
    ],
    // Opción 2: No avanzar
    [
      { slot: 'social', text: '<span class="mm-bad">No reconocer a los trabajadores populares mientras se prioriza la formalización del empleo privado es elegir a quiénes se protege</span>. <span class="mm-bad">La confianza cae 8 puntos</span>. La UTEP tiene capacidad de movilización real. <span class="mm-bad">La pobreza sube</span>. Los trabajadores informales no tienen sindicato que los defienda en una paritaria — son exactamente los que más necesitan que el Estado legisle.' },
    ],
  ],

  // ── EVENTO 90: Mercados Populares ────────────────────────────
  90: [
    // Opción 0: Regularización integral
    [
      { slot: 'social', text: '<span class="mm-good">Los mercados populares abastecen a 2 millones de familias con alimentos más baratos que los supermercados</span>. <span class="mm-good">Regularizarlos reduce la pobreza 5 puntos y el desempleo 4</span>. <span class="mm-good">La confianza sube 9</span>. La habilitación con saneamiento convierte un espacio informal en activo barrial formal, con control sanitario y sin desamparo. Es la política que respeta tanto el orden urbano como el derecho a trabajar.' },
    ],
    // Opción 1: Regularizar los ordenados, reubicar los conflictivos
    [
      { slot: 'social', text: 'La diferenciación caso por caso <span class="mm-good">es más justa y más efectiva que una política única</span>: los mercados con condiciones sanitarias pueden funcionar donde están; los que tienen problemas reales se mejoran con apoyo técnico antes de decidir la reubicación. <span class="mm-good">La pobreza baja 3 y la confianza sube 4</span>. Requiere más trabajo administrativo pero produce mejores resultados.' },
    ],
    // Opción 2: Desalojar y relocalizar
    [
      { slot: 'social', text: '<span class="mm-bad">Los desalojos sin garantía de que el nuevo predio sea viable destruyen las fuentes de ingreso de miles de familias</span>. <span class="mm-bad">La pobreza sube 4, el desempleo 3 y la confianza cae 10</span>. Los comerciantes de los mercados son trabajadores formalizables, no okupas: la solución es la habilitación con estándares, no el desalojo. Las imágenes de un mercado popular desalojado tienen costo político real.' },
    ],
  ],

  // ── EVENTO 91: Sitios de Memoria / Dictadura ─────────────────
  91: [
    // Opción 0: Preservar y expandir los sitios de memoria
    [
      { slot: 'gabinete', text: 'Los <b>ex centros clandestinos de detención</b> son patrimonio histórico irreemplazable. <span class="mm-good">Declararlos intangibles y financiar su mantenimiento sube la confianza 11 puntos</span> porque la política de memoria tiene apoyo transversal. Los organismos de DDHH, las universidades y la comunidad internacional valoran esta posición. <span class="mm-bad">La deuda sube 1 punto</span> — es el costo más bajo de cualquier política con este retorno en confianza.' },
    ],
    // Opción 1: Uso mixto con señalización permanente
    [
      { slot: 'gabinete', text: 'El uso mixto con <b>señalización permanente</b> <span class="mm-good">permite que el espacio tenga función educativa activa</span> mientras se preserva la memoria del lugar. <span class="mm-good">La confianza sube 4 puntos</span>. Es un equilibrio que puede funcionar en algunos casos específicos — espacios grandes donde la superficie permite usos compatibles. La clave es que la señalización sea permanente y protagónica, no decorativa.' },
    ],
    // Opción 2: Autorizar la demolición
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Demoler un ex CCD es borrar la evidencia física de uno de los crímenes de lesa humanidad más documentados del mundo</span>. <span class="mm-bad">La confianza cae 13 puntos</span>. Las Madres de Plaza de Mayo, los organismos internacionales y la Justicia que procesa causas por estos crímenes van a reaccionar con dureza. <span class="mm-bad">El riesgo sube 2</span>. El argumento de la escuela nueva sobre la memoria histórica es una falsa dicotomía: se puede construir sin demoler.' },
    ],
  ],

  // ── EVENTO 92: Represión en Marcha / Bloqueo del Puerto ──────
  92: [
    // Opción 0: Diálogo y mediación
    [
      { slot: 'gabinete', text: '<span class="mm-good">El mediador independiente es la herramienta más efectiva para resolver conflictos de alta visibilidad sin violencia</span>. <span class="mm-good">La confianza sube 8 puntos</span>. <span class="mm-bad">Las pérdidas en producción son reales</span> mientras dura el bloqueo, pero el daño de una represión violenta — en confianza, en derechos humanos, en imagen internacional — es incomparablemente mayor. Los conflictos laborales que se resuelven por diálogo duran menos.' },
      { slot: 'social', text: 'Los manifestantes están reclamando contra <b>tarifazos en servicios básicos</b> — la protesta tiene legitimidad sustancial. <span class="mm-good">El diálogo puede resolver tanto el bloqueo como la demanda de fondo si hay voluntad real de negociar las tarifas</span>. <span class="mm-bad">La producción cae 3 y las reservas 3</span> por las pérdidas en exportaciones, pero <span class="mm-good">la pobreza baja 1</span> si el diálogo incluye revisión de tarifas.' },
    ],
    // Opción 1: Intervención judicial con mínima fuerza
    [
      { slot: 'gabinete', text: 'El desalojo judicial con Gendarmería e instrucciones de mínima fuerza <span class="mm-good">respeta el Estado de Derecho sin la brutalidad del desalojo policial directo</span>. <span class="mm-bad">La confianza baja levemente</span>. Es la opción intermedia: más legal que la represión directa, más rápida que la mediación. Funciona mejor si la presencia de Gendarmería genera las condiciones para que los manifestantes levanten el bloqueo voluntariamente.' },
    ],
    // Opción 2: Desalojo por la fuerza
    [
      { slot: 'social', text: '<span class="mm-bad">Un desalojo violento de una protesta por tarifas puede ser el peor momento de la gestión</span>. <span class="mm-bad">La confianza cae 15 puntos</span> — el mayor impacto negativo posible en un solo evento. <span class="mm-bad">El riesgo sube 5</span>. Las imágenes de violencia policial contra manifestantes que reclaman por servicios básicos van a definir al gobierno negativamente durante años. La Justicia internacional puede involucrarse.' },
    ],
  ],

  // ── EVENTO 93: Litio / Triángulo del Futuro ──────────────────
  93: [
    // Opción 0: Industrialización con YPF-Litio
    [
      { slot: 'produccion', text: 'Exportar <b>baterías en lugar de mineral crudo</b> es la diferencia entre ser proveedor de commodities y ser industria de alta tecnología. <span class="mm-good">La producción sube 8, el desempleo cae 5 y la confianza sube 10</span>. <span class="mm-bad">La deuda sube 6</span> para crear la empresa mixta. El modelo YPF-Litio con las provincias garantiza la participación de los territorios. Es la política de desarrollo productivo más ambiciosa del mandato.' },
      { slot: 'economia', text: '<span class="mm-good">El valor agregado del litio procesado en batería es 10 veces mayor al del carbonato de litio crudo</span>. Si Argentina produce baterías, captura ese diferencial de valor en empleo e ingresos locales. <span class="mm-bad">La deuda inicial es alta</span>, pero los ingresos futuros de exportar baterías para autos eléctricos — el mercado de mayor crecimiento del siglo XXI — justifican sobradamente la inversión.' },
    ],
    // Opción 1: Concesiones con regalías altas
    [
      { slot: 'produccion', text: 'Las <b>regalías del 15% con consulta indígena previa</b> <span class="mm-good">son el modelo que más países productores de recursos naturales adoptaron exitosamente</span>. <span class="mm-good">Las reservas suben 7, la deuda baja 3, el desempleo cae</span>. La consulta previa es obligación legal — incluirla como condición protege al Estado de litigios futuros que pueden paralizar todo el proyecto.' },
    ],
    // Opción 2: Moratoria hasta nueva ley
    [
      { slot: 'produccion', text: 'Legislar antes de concesionar <span class="mm-good">es el camino más ordenado jurídicamente y genera más legitimidad</span>. <span class="mm-bad">Las reservas caen 4 puntos mientras esperamos</span>. <span class="mm-bad">El riesgo sube 3</span> porque el mercado percibe incertidumbre regulatoria. Si el Congreso puede legislar en 6 meses con urgencia real, la moratoria es razonable. Si tarda 2 años, el costo de oportunidad es demasiado alto.' },
    ],
  ],

  // ── EVENTO 94: Discriminación Racial Policial ─────────────────
  94: [
    // Opción 0: Protocolo antidiscriminación y capacitación
    [
      { slot: 'social', text: 'El <b>78% de detenidos sin causa de tez oscura o apariencia indígena</b> es discriminación sistemática documentada. <span class="mm-good">Un protocolo con capacitación obligatoria y registro de denuncias es la respuesta estructural que corresponde</span>. <span class="mm-good">La confianza sube 9 puntos</span>. <span class="mm-good">La pobreza baja 2</span> porque la criminalización de la pobreza tiene costos económicos directos para las familias afectadas.' },
      { slot: 'gabinete', text: '<span class="mm-good">El protocolo antidiscriminación reduce el riesgo institucional de demandas internacionales</span>. El CELS ya tiene documentación sólida — si el Estado no actúa, el caso llega a la CIDH con evidencia suficiente para una condena. <span class="mm-good">Actuar proactivamente baja el riesgo 3 puntos</span>. La capacitación en derechos humanos para las fuerzas de seguridad tiene retorno en reducción de conflictos.' },
    ],
    // Opción 1: Sumarios y sanciones a los efectivos
    [
      { slot: 'gabinete', text: 'Los <b>sumarios</b> solucionan el caso visible pero <span class="mm-bad">sin política general el problema estructural persiste</span>. <span class="mm-good">La confianza sube 7 puntos</span> porque hay acción concreta. Incorporar el criterio racial a los indicadores de control policial es el cambio más importante: si la discriminación se mide, se puede corregir. Sin métricas, no hay rendición de cuentas.' },
    ],
    // Opción 2: Minimizar el caso
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Tratar la discriminación racial policial documentada como un hecho aislado es una respuesta que el CELS, la ONU y la prensa internacional no van a aceptar</span>. <span class="mm-bad">La confianza cae 9 puntos</span>. El video ya es viral — el encuadre de "hecho aislado" pierde credibilidad ante la evidencia estadística del 78%. El silencio institucional sobre el racismo policial es también una política.' },
    ],
  ],

  // ── EVENTO 95: Acceso a la Vivienda en Crisis Extrema ─────────
  95: [
    // Opción 0: Plan Nacional de Vivienda Pública
    [
      { slot: 'social', text: '<b>3,5 millones de viviendas de déficit</b> no se resuelven con el mercado: ningún sistema de mercado puro resolvió jamás la crisis habitacional de los sectores de bajos ingresos. <span class="mm-good">100.000 viviendas en 4 años reducen la pobreza 7 y el desempleo 6</span>. <span class="mm-good">La confianza sube 10</span>. La construcción es el sector con mayor multiplicador económico — cada peso en vivienda genera 2,5 en actividad económica total.' },
      { slot: 'produccion', text: '<span class="mm-good">100.000 viviendas en 4 años es uno de los mayores programas de inversión pública posibles</span>: <span class="mm-good">dinamiza cemento, acero, madera, electricidad, plomería — toda la cadena de la construcción</span>. <span class="mm-bad">La deuda sube 8</span>, pero los créditos del BID a 30 años para vivienda social tienen condiciones que hacen el servicio de deuda manejable. El empleo en construcción es inmediato, no en 3 años.' },
    ],
    // Opción 1: Crédito hipotecario UVA mejorado
    [
      { slot: 'economia', text: 'Los <b>créditos UVA ajustados por salarios</b> en lugar de inflación <span class="mm-good">son el instrumento que puede incluir a la clase media que no accede a la vivienda pública pero tampoco puede pagar el mercado libre</span>. <span class="mm-good">La pobreza baja 4, el desempleo 2 y la confianza sube 7</span>. <span class="mm-bad">La deuda sube 4</span>. Funciona para el estrato medio; los sectores más vulnerables necesitan vivienda pública igualmente.' },
    ],
    // Opción 2: Regular alquileres con techo
    [
      { slot: 'social', text: 'El <b>techo del 60% de ajuste anual</b> <span class="mm-good">protege a los inquilinos actuales</span>, pero <span class="mm-bad">puede reducir la oferta si los propietarios retiran propiedades del mercado</span>. <span class="mm-good">La pobreza baja 2</span>. El techo de alquileres funciona mejor cuando hay mucha oferta — en el contexto actual de escasez severa, el riesgo de contracción de oferta es alto. Necesita acompañarse de incentivos para que los propietarios mantengan los inmuebles alquilados.' },
    ],
  ],

  // ── EVENTO 96: Brecha Digital en las Aulas ────────────────────
  96: [
    // Opción 0: Plan integral con fibra y formación
    [
      { slot: 'social', text: 'El <b>48% sin internet en zonas rurales</b> es exclusión digital que se convierte en exclusión educativa y laboral. <span class="mm-good">Conectar 8.000 escuelas y lanzar el programa de alfabetización digital reduce la pobreza 4 y el desempleo 2</span>. <span class="mm-good">La confianza sube 9</span>. ARSAT tiene la infraestructura — hay que extenderla. Los contenidos soberanos evitan la dependencia de plataformas extranjeras.' },
      { slot: 'produccion', text: '<span class="mm-good">La conectividad escolar tiene un retorno productivo enorme a 10 años</span>: los jóvenes que acceden a internet en la escuela son más empleables y emprendedores. <span class="mm-good">La producción sube 4</span>. <span class="mm-bad">La deuda sube 5</span> para financiar la infraestructura. Es el tipo de inversión que los organismos de desarrollo (BID, Banco Mundial) financian con condiciones blandas porque el retorno social es verificable.' },
    ],
    // Opción 1: Solución satelital de bajo costo
    [
      { slot: 'produccion', text: 'El acceso <b>satelital mediante ARSAT</b> <span class="mm-good">llega más rápido a zonas sin fibra y con menor inversión inicial</span>. <span class="mm-good">La producción y el desempleo mejoran moderadamente</span>. <span class="mm-bad">La calidad de la conexión satelital es menor que la fibra</span> para usos intensivos como videoconferencia educativa. Es una solución de transición válida mientras se tiende la infraestructura definitiva.' },
    ],
    // Opción 2: Solo formación docente
    [
      { slot: 'social', text: 'Capacitar docentes sin internet en las escuelas <span class="mm-bad">es preparar a alguien para conducir sin darle el auto</span>. <span class="mm-good">La confianza sube apenas 2 puntos</span>. Los docentes capacitados no pueden aplicar sus conocimientos digitales si el aula no tiene conectividad. La formación sola tiene impacto marginal en zonas rurales sin infraestructura. Es el paso menos costoso y también el menos transformador.' },
    ],
  ],

  // ── EVENTO 97: Migración Regional ────────────────────────────
  97: [
    // Opción 0: Integración plena con servicios reforzados
    [
      { slot: 'social', text: 'Argentina es un país de inmigrantes — construido por ellos. <span class="mm-good">La integración plena con documentación rápida y acceso a servicios es la política que genera más valor económico y social a largo plazo</span>. <span class="mm-good">La pobreza baja 3, el desempleo 2 y la confianza sube 8</span>. Los migrantes que se formalizan aportan al sistema previsional y al fisco. La xenofobia es un síntoma de servicios insuficientes — la solución es invertir en los servicios, no cerrar las fronteras.' },
      { slot: 'gabinete', text: '<span class="mm-good">Reforzar la inversión en salud y educación municipal de zonas fronterizas resuelve la presión sobre los servicios</span> que genera el rechazo a la migración. <span class="mm-bad">La deuda sube 4 puntos</span>. El MERCOSUR tiene normas de libre circulación que el país debe respetar como miembro. Una política de integración activa con el MERCOSUR también fortalece la posición diplomática regional.' },
    ],
    // Opción 1: Regularización con cupos sectoriales
    [
      { slot: 'social', text: 'Los cupos sectoriales <span class="mm-good">son un mecanismo que dirige la migración hacia donde hay demanda real de empleo</span>. <span class="mm-good">La pobreza baja 2, el desempleo 1 y la confianza sube 4</span>. Es una política pragmática que puede funcionar bien en sectores como salud, construcción y agricultura donde hay déficit de fuerza de trabajo local. Requiere coordinación entre el Ministerio de Trabajo y el de Interior.' },
    ],
    // Opción 2: Endurecimiento migratorio
    [
      { slot: 'social', text: '<span class="mm-bad">Cerrar las fronteras en un país miembro del MERCOSUR con normas de libre circulación es ilegal y genera conflicto diplomático regional</span>. <span class="mm-bad">El riesgo sube 4, la pobreza sube y la confianza cae 8</span>. La producción cae porque los sectores que dependen de mano de obra migrante quedan sin trabajadores. La historia económica muestra que los países que cerraron fronteras durante shocks económicos salieron peor.' },
    ],
  ],

  // ── EVENTO 98: Desinformación Digital / Fake News ────────────
  98: [
    // Opción 0: Agencia independiente de verificación
    [
      { slot: 'gabinete', text: 'Una <b>agencia autárquica gestionada por periodistas y universidades</b> es el modelo correcto: <span class="mm-good">la credibilidad de la verificación depende de su independencia del gobierno</span>. <span class="mm-good">El riesgo baja 4 y la confianza sube 10</span>. Los modelos exitosos como Full Fact en el Reino Unido o AFP Factual son autónomos. Si el gobierno controla la agencia, pierde toda credibilidad como árbitro de la verdad.' },
    ],
    // Opción 1: Alfabetización mediática en escuelas
    [
      { slot: 'social', text: 'El <b>pensamiento crítico y la verificación de fuentes</b> en el currículum escolar es la solución más sostenible a largo plazo. <span class="mm-good">El riesgo baja 2 y la confianza sube 6</span>. El impacto es en 10-15 años — cuando los estudiantes de hoy sean los adultos de mañana. No es suficiente como única política ante la urgencia de las fake news en campaña, pero es la más robusta estructuralmente.' },
    ],
    // Opción 2: Regulación gubernamental directa
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Un organismo gubernamental que etiqueta contenidos como "falsos" es una herramienta de censura estatal independientemente de la intención</span>. <span class="mm-bad">El riesgo sube 3 y la confianza cae 9</span>. Reporteros Sin Fronteras, la SIP y los medios internacionales van a denunciar esto como vulneración de la libertad de prensa. El gobierno que controla qué es verdad controla el debate público — eso es incompatible con la democracia.' },
    ],
  ],

  // ── EVENTO 99: Argentina sede del Mundial Sub-20 ──────────────
  99: [
    // Opción 0: Aceptar con presupuesto blindado
    [
      { slot: 'economia', text: '<span class="mm-good">El retorno proyectado de USD 1.400 millones en turismo supera la inversión de USD 900 millones</span>. <span class="mm-good">El desempleo cae 5 en construcción y servicios, la producción sube 5</span>. El <b>comité anticorrupción</b> es clave: Brasil 2014 mostró que sin control, los megaeventos generan sobrecostos del 300%. Con supervisión real, el riesgo de desborde es manejable.' },
      { slot: 'produccion', text: 'La infraestructura deportiva modernizada tiene valor permanente más allá del Mundial. <span class="mm-good">Los 6 estadios renovados quedan como activos productivos para el deporte y el entretenimiento</span>. <span class="mm-bad">La deuda sube 4</span>. El esquema mixto con FIFA y privados minimiza el aporte estatal. Si los números cierran con ese esquema, es una oportunidad real de inversión con retorno positivo.' },
    ],
    // Opción 1: Co-sede con Uruguay o Chile
    [
      { slot: 'economia', text: 'La co-sede <span class="mm-good">reduce el costo a la mitad y el riesgo proporcionalmente</span>. <span class="mm-good">El desempleo y la producción mejoran moderadamente</span>. <span class="mm-good">La confianza sube 7</span> porque hay organización sin exposición excesiva. Es la opción más prudente si el presupuesto está ajustado. Organizar con Uruguay o Chile también fortalece las relaciones regionales.' },
    ],
    // Opción 2: Rechazar la candidatura
    [
      { slot: 'economia', text: 'Rechazar el Mundial <span class="mm-good">evita el riesgo de sobrecosto y la deuda</span>. <span class="mm-bad">La confianza baja levemente</span> en un contexto post-mundial donde la ciudadanía estaba expectante. Es la posición más fiscalmente conservadora. Si hay dudas sobre la capacidad de gestión anticorrupción del megaevento, rechazar es preferible a un escándalo de sobrecosto.' },
    ],
  ],

  // ── EVENTO 100: Gran Acuerdo Nacional ────────────────────────
  100: [
    // Opción 0: Firmar el Gran Acuerdo
    [
      { slot: 'gabinete', text: 'El <b>Gran Acuerdo Nacional</b> es la oportunidad de hacer reformas que ningún gobierno logró sostener solo. <span class="mm-good">El riesgo baja 8, las reservas suben 4, la deuda cae 5 y la confianza sube 8</span>. Las reformas estructurales negociadas con la oposición son más duraderas porque sobreviven los cambios de gobierno. <span class="mm-bad">Las bases de la coalición van a resistir</span> — hay que explicar que gobernar es también ceder para ganar lo más importante.' },
      { slot: 'economia', text: '<span class="mm-good">Reformar el sistema previsional, el régimen impositivo y la coparticipación federal simultáneamente es el mayor cambio estructural posible en democracia</span>. <span class="mm-good">Los mercados van a celebrarlo: el riesgo país cae y la producción sube</span>. El desafío es que las reformas sean equilibradas — no puede ser todo ajuste. Hay que asegurar que la reforma previsional incluya protección para los jubilados de menores ingresos.' },
    ],
    // Opción 1: Acuerdo parcial solo tributario
    [
      { slot: 'economia', text: '<span class="mm-good">La reforma tributaria es la más urgente y la que más impacto fiscal tiene</span>. <span class="mm-good">La deuda baja 3 y el riesgo 4</span>. Dejar las reformas previsional y de coparticipación para más adelante <span class="mm-bad">reduce el impacto total del acuerdo</span>, pero es políticamente más viable. Un acuerdo parcial exitoso genera confianza para avanzar en las reformas pendientes.' },
      { slot: 'gabinete', text: 'El acuerdo parcial <span class="mm-good">reduce el riesgo político de que las bases de la coalición lo perciban como una rendición total</span>. <span class="mm-good">La confianza sube 4</span>. La oposición puede aceptar si consigue un logro visible en lo tributario. Es la estrategia de negociación por etapas: primero lo más urgente, luego lo más complejo.' },
    ],
    // Opción 2: No acordar
    [
      { slot: 'gabinete', text: '<span class="mm-bad">Rechazar el Gran Acuerdo por presión de las bases propias es perder una oportunidad histórica</span>. <span class="mm-bad">El riesgo sube, la deuda sube y la producción cae</span>. Los mercados que celebraban la posibilidad del acuerdo van a penalizar su fracaso. <span class="mm-bad">La confianza cae</span>. Gobernar en soledad en la segunda mitad del mandato, sin las reformas y sin apoyo legislativo, es la situación más difícil posible.' },
    ],
  ],

};

/**
 * Devuelve el array de comentarios ministeriales para un evento y opción dados.
 * Si no existe comentario específico, devuelve array vacío (sin modal).
 *
 * @param {number} eventId
 * @param {number} optionIdx
 * @returns {Array<{slot:string, text:string}>}
 */
export function getMinisterCommentary(eventId, optionIdx) {
  return MINISTER_COMMENTARY[eventId]?.[optionIdx] ?? [];
}
