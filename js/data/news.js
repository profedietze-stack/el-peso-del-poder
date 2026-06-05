"use strict";

// ============================================================
// NEWS.JS — Sistema de Prensa
// Fuentes de medios, templates de noticias y reglas de pronóstico
// ============================================================

export const MEDIA_SOURCES = {
  cronista:   { id:'cronista',   name:'El Cronista Nacional', icon:'🗞️', type:'paper',  color:'#5b8dee', bias:'neutral'  },
  voz:        { id:'voz',        name:'La Voz del Pueblo',    icon:'📢', type:'tabloid', color:'#27ae60', bias:'pro'      },
  tribuna:    { id:'tribuna',    name:'Tribuna Libre',        icon:'⚡', type:'paper',  color:'#e74c3c', bias:'against'  },
  tendencias: { id:'tendencias', name:'@TendenciasPol',       icon:'🐦', type:'social', color:'#1da1f2', bias:'mixed'    },
  foro:       { id:'foro',       name:'Foro Ciudadano',       icon:'💬', type:'forum',  color:'#e07b39', bias:'citizen'  },
};

// ── Mapa de tag de evento → categoría ────────────────────────
const _TAG_CAT = {
  '🚨 Crisis Financiera':'economia', '💱 Política Cambiaria':'economia', '📈 Inflación':'economia',
  '📊 Política Fiscal':'economia',   '🏦 FMI':'economia',               '🏦 Tensión con FMI':'economia',
  '🏦 Sistema Financiero':'economia','💰 Presupuesto':'economia',        '🏦 Banca Pública':'economia',
  '💱 Debate Monetario':'economia',
  '✊ Conflicto Laboral':'social',   '✊ Conflicto Social':'social',     '👴 Seguridad Social':'social',
  '🤲 Economía del Cuidado':'social','🏠 Vivienda':'social',             '🏃 Economía Informal':'social',
  '💼 Empleo':'social',
  '🏥 Salud Pública':'salud',        '💊 Salud':'salud',                '🏥 Crisis Sanitaria Social':'salud',
  '🦠 Pandemia':'salud',             '🌐 Soberanía Sanitaria':'salud',  '⚗️ Industria Farmacéutica':'salud',
  '💊 Adicciones':'salud',
  '🎓 Educación':'educacion',        '🎓 Reforma Educativa':'educacion','🎓 Deserción Escolar':'educacion',
  '🔴 Corrupción':'corrupcion',
  '🌾 Sector Agropecuario':'campo',  '🌾 Agroexportaciones':'campo',    '🌾 Soberanía Alimentaria':'campo',
  '🌊 Pesca':'campo',                '🌱 Agroecología':'campo',
  '⚡ Energía':'energia',            '⚡ Crisis de Gas':'energia',       '⛽ Recursos Naturales':'energia',
  '🌊 Desastre Natural':'ambiente',  '🌍 Migración':'ambiente',         '🌡️ Cambio Climático':'ambiente',
  '🌱 Medio Ambiente':'ambiente',    '💧 Crisis Hídrica':'ambiente',
  '🗳️ Elecciones':'politica',        '🏛️ Instituciones':'politica',     '🏛️ Reforma del Estado':'politica',
  '🤝 Integración Regional':'politica','🌏 Relaciones Exteriores':'politica','🤝 Diplomacia':'politica',
  '🌍 Geopolítica':'politica',       '🗺️ Soberanía Territorial':'politica','🏢 Estado':'politica',
  '⚖️ Derechos Humanos':'derechos',  '♀️ Género y Diversidad':'derechos','🏔️ Pueblos Originarios':'derechos',
  '⚖️ Seguridad':'derechos',
  '💻 Ciberseguridad':'tecnologia',  '💡 Economía del Conocimiento':'tecnologia','🤖 Inteligencia Artificial':'tecnologia',
  '🔬 Investigación':'tecnologia',   '🧪 Ciencia y Tecnología':'tecnologia','🧬 Biotecnología':'tecnologia',
  '🌐 Internet':'tecnologia',
  '💼 Inversión Extranjera':'inversion','🏭 Industria':'inversion',     '⛏️ Minería':'inversion',
  '🚆 Infraestructura':'inversion',  '🏙️ Urbanismo':'inversion',

  // ── Eventos especiales 101-130 ────────────────────────────────
  '💀 Traición Interna':'politica',   '🔴 Escándalo de Gabinete':'corrupcion',
  '⚡ Dilema Sin Salida':'politica',  '🌍 Crisis Global':'economia',
  '☣️ Pandemia Global':'salud',       '⚔️ Conflicto Bélico':'politica',
  '🌍 Guerra Mundial':'politica',     '✊ Golpe de Estado':'politica',
  '🌋 Catástrofe Natural':'ambiente', '☢️ Accidente Nuclear':'energia',
  '💻 Ciberataque Masivo':'tecnologia','🌊 Catástrofe Climática':'ambiente',
  '🏛️ Crisis Institucional':'politica','🌍 Crisis Humanitaria':'social',
  '✈️ Fuga de Capital Humano':'social','🌐 Injerencia Extranjera':'politica',
  '⚡ Colapso Energético':'energia',  '🔐 Secreto de Estado':'politica',
};

export function getTagCategory(tag) { return _TAG_CAT[tag] || 'general'; }

// ── Templates: { h: headline, b: body } ──────────────────────
// {P} = apellido del presidente   {Par} = nombre del partido

const _T = {

  // ── ECONOMÍA ─────────────────────────────────────────────
  economia: {
    cronista: {
      positive: [
        { h:'{P} anuncia medidas que calman a los mercados financieros', b:'Los índices bursátiles reaccionaron positivamente ante el paquete de medidas del gobierno de {P}. Operadores del mercado destacaron la señal de racionalidad económica del {Par}.' },
        { h:'El {Par} logra aliviar la presión sobre las reservas del Banco Central', b:'Luego de semanas de tensión, las decisiones del gobierno mostraron sus primeros resultados. Analistas del sector celebraron el cambio de tendencia.' },
        { h:'Mercados en alza: la gestión económica de {P} recibe apoyo del sector privado', b:'Cámaras empresariales calificaron la medida como "un paso en la dirección correcta". El riesgo país cedió puntos en la apertura del día.' },
      ],
      negative: [
        { h:'El gobierno de {P} enfrenta presión creciente en los mercados internacionales', b:'Economistas advierten que la decisión de la administración {Par} podría tener costos en el mediano plazo. Los bonos soberanos registran volatilidad.' },
        { h:'Analistas cuestionan el rumbo económico del {Par}', b:'Especialistas consultados advierten sobre posibles efectos en el tipo de cambio y los indicadores fiscales tras la última medida de {P}.' },
        { h:'{P} y el {Par} buscan alternativas ante la presión de los mercados', b:'Los datos macroeconómicos de la semana encendieron alarmas en el equipo económico. Fuentes del ministerio prometieron nuevas medidas en los próximos días.' },
      ],
    },
    voz: {
      positive: [
        { h:'¡Victoria económica del gobierno de {P}! El {Par} demuestra que hay salida', b:'El gobierno nacional celebró hoy los resultados de sus políticas. Desde el {Par} remarcaron que "estamos construyendo el país que nos merecemos".' },
        { h:'El {Par} tiene el rumbo: economistas progresistas avalan las medidas de {P}', b:'Un informe de think-tanks afines al oficialismo destacó que las políticas de {P} son las correctas para superar la crisis heredada.' },
      ],
      negative: [
        { h:'{P} da la pelea: el {Par} asegura que la tormenta ya pasó lo peor', b:'Desde el gobierno remarcaron que la situación actual es producto de "los años de descuido anterior". La recuperación, afirman, ya está en marcha.' },
        { h:'El {Par} defiende la decisión de {P}: "Era necesario tomar medidas difíciles"', b:'Legisladores del {Par} salieron a respaldar al Ejecutivo. "Gobernar implica tomar decisiones impopulares pero necesarias", señalaron.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'La oposición advierte: el alivio del gobierno de {P} es solo transitorio', b:'Referentes opositores señalaron que las medidas de {P} son "un parche" y que los problemas estructurales de fondo siguen sin resolverse.' },
        { h:'Economistas liberales critican el intervencionismo del {Par}', b:'Según el Centro de Estudios Económicos, la política del gobierno "distorsiona el mercado y genera incentivos perversos de largo plazo".' },
      ],
      negative: [
        { h:'Fracaso económico: el gobierno de {P} lleva al país por mal camino', b:'La oposición unificó su discurso para exigir cambios urgentes en el equipo económico. "Así no se puede gobernar", disparó el principal referente opositor.' },
        { h:'El {Par} destruye la economía: lo que prometieron y lo que hicieron', b:'Un informe de la oposición contabiliza "al menos 12 promesas incumplidas" del {Par} en materia económica desde que asumió {P}.' },
      ],
    },
    tendencias: {
      positive: [
        { h:'💹 Los mercados la ven a {P}! ¿Se viene la recuperación? 🤔 #EconomíaAR', b:'' },
        { h:'El dólar se calmó después de la decisión de {P} 🙏 Ojalá dure #MercadosAR', b:'' },
      ],
      negative: [
        { h:'📉 Se viene la tormenta... {P} no tiene ni idea de economía #ARG #Inflación', b:'' },
        { h:'¿Alguien puede explicarle al {Par} qué es un presupuesto? 😤 #EconómicoFail', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Qué buena noticia, ojalá se sostenga. Igual hay que ver cómo impacta en las pymes.', b:'→ 234 respuestas | Hilo: "¿Creés que las medidas de {P} van a funcionar?"' },
        { h:'Por fin algo sensato del {Par}. No soy fanático pero esto está bien tomado.', b:'→ 189 respuestas | Hilo: "Medidas económicas de la semana — análisis"' },
      ],
      negative: [
        { h:'Con lo que cobro no llego a fin de mes y el gobierno de {P} dice que todo está bien 😔', b:'→ 567 respuestas | Hilo: "La realidad que no muestran los medios oficialistas"' },
        { h:'El {Par} prometió bajar la inflación y mirá cómo estamos. Decepcionante.', b:'→ 412 respuestas | Hilo: "¿Cuándo mejora la situación económica?"' },
      ],
    },
  },

  // ── SOCIAL ───────────────────────────────────────────────
  social: {
    cronista: {
      positive: [
        { h:'El gobierno de {P} lanza medidas de alivio para los sectores más vulnerables', b:'La decisión del ejecutivo fue bien recibida por organizaciones sociales y sindicatos. Expertos en política social aplaudieron el enfoque del {Par}.' },
        { h:'{P} reactiva el diálogo con gremios y apuesta por la paz social', b:'Tras semanas de conflicto, el ejecutivo logró abrir una mesa de negociación. Analistas destacan la voluntad política demostrada por el {Par}.' },
      ],
      negative: [
        { h:'Tensión social: el gobierno de {P} enfrenta protestas en varias ciudades', b:'Organizaciones de la sociedad civil expresaron su malestar ante las últimas medidas del {Par}. El ejecutivo prometió "continuar el diálogo".' },
        { h:'Conflicto social escala bajo la gestión del {Par}: analistas advierten', b:'Expertos señalan que el gobierno de {P} no está encontrando las soluciones adecuadas para los problemas sociales de fondo.' },
      ],
    },
    voz: {
      positive: [
        { h:'El {Par} con los trabajadores: {P} garantiza derechos para todos', b:'Organizaciones sociales afines al {Par} celebraron la decisión del ejecutivo como "un ejemplo de sensibilidad social que el país necesitaba".' },
      ],
      negative: [
        { h:'{P} escucha al pueblo: el {Par} promete soluciones concretas en días', b:'Desde el gobierno remarcaron que trabajan "incansablemente" para mejorar las condiciones de la población más afectada.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'La oposición alerta: las medidas sociales del {Par} son asistencialismo sin futuro', b:'Referentes de la oposición señalaron que el gobierno de {P} "da pescado en lugar de enseñar a pescar".' },
      ],
      negative: [
        { h:'Escándalo social: {P} abandona a los más pobres según informe de la oposición', b:'"El gobierno del {Par} ha dejado sola a la gente que más necesita del Estado", afirmó el diputado opositor.' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Algo hizo bien {P} esta vez! Que sigan así 👏 #PolíticaSocial #ARG', b:'' },
      ],
      negative: [
        { h:'Los trabajadores están solos con este gobierno del {Par} 😤 #HuelgaGeneral #ARG', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'En mi barrio se nota el cambio desde que el {Par} implementó esto. Gracias {P}.', b:'→ 345 respuestas | Hilo: "Impacto social de las políticas de {P}"' },
      ],
      negative: [
        { h:'Sigo esperando que las políticas del {Par} lleguen al interior. Capital siempre primero.', b:'→ 298 respuestas | Hilo: "¿El gobierno de {P} ignora el interior del país?"' },
      ],
    },
  },

  // ── SALUD ────────────────────────────────────────────────
  salud: {
    cronista: {
      positive: [
        { h:'El gobierno de {P} fortalece el sistema sanitario con inversión récord', b:'El Ministerio de Salud anunció una ampliación presupuestaria para el sector. Médicos valoraron la señal política del {Par}.' },
        { h:'{P} pone la salud en el centro de la agenda: el {Par} refuerza hospitales', b:'La decisión de fortalecer el sistema público recibió el aval de la OPS y sociedades médicas nacionales.' },
      ],
      negative: [
        { h:'Crisis sanitaria: los hospitales públicos al límite bajo la gestión {Par}', b:'Médicos de guardia denunciaron falta de insumos y hacinamiento. El gobierno de {P} prometió "atender la situación con urgencia".' },
        { h:'El sistema de salud en riesgo bajo la administración {Par}', b:'Informes de organismos sanitarios internacionales encendieron alarmas sobre la situación del sistema de salud bajo el gobierno de {P}.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} cuida nuestra salud: el {Par} invierte en el futuro del sistema sanitario', b:'Desde el ministerio recordaron que "en este gobierno, la salud pública no es un gasto sino una inversión".' }],
      negative: [{ h:'{P} enfrenta la crisis sanitaria: el {Par} no baja los brazos', b:'El ejecutivo prometió soluciones concretas "en el marco de las restricciones presupuestarias heredadas".' }],
    },
    tribuna: {
      positive: [{ h:'Oposición: la inversión en salud de {P} llega tarde y es insuficiente', b:'"Necesitábamos esto hace dos años", señaló un legislador de la oposición. El {Par} no tuvo respuesta inmediata.' }],
      negative: [{ h:'Catástrofe sanitaria: {P} deja a los ciudadanos sin cobertura médica adecuada', b:'"Lo que está haciendo el gobierno de {P} es negligencia institucional ante la crisis", acusó la oposición.' }],
    },
    tendencias: {
      positive: [{ h:'Por fin el gobierno de {P} hizo algo por la salud! 🏥💊 #SaludPública #ARG', b:'' }],
      negative: [{ h:'Hospitales colapsados y el {Par} mirando para otro lado 🤦 #CrisisSanitaria', b:'' }],
    },
    foro: {
      positive: [{ h:'Mi familia pudo atenderse gracias a la nueva política del {Par}. Muy agradecidos.', b:'→ 156 respuestas | Hilo: "Experiencias con el sistema de salud público"' }],
      negative: [{ h:'4 horas de espera en urgencias. ¿Alguien le avisa a {P} que la salud pública está en crisis?', b:'→ 478 respuestas | Hilo: "Estado real del sistema sanitario - testimonios"' }],
    },
  },

  // ── EDUCACIÓN ────────────────────────────────────────────
  educacion: {
    cronista: {
      positive: [
        { h:'El gobierno de {P} y los docentes llegan a un acuerdo histórico', b:'Luego de semanas de negociación, el ejecutivo del {Par} cerró una paritaria que satisfizo a las principales federaciones docentes.' },
        { h:'{P} apuesta por la educación: el {Par} lanza plan de inversión escolar', b:'El anuncio fue valorado por pedagogos y organizaciones educativas. "Es un giro positivo", señaló el rector de la Universidad Nacional.' },
      ],
      negative: [
        { h:'Crisis educativa: el conflicto docente se extiende bajo la gestión {Par}', b:'Millones de estudiantes siguen sin clases. Las negociaciones entre el gobierno de {P} y los gremios no avanzan.' },
        { h:'El gobierno de {P} y la educación: promesas que no se cumplen', b:'Un informe de UNICEF señala que los indicadores de escolaridad empeoraron durante la gestión del {Par}.' },
      ],
    },
    voz: {
      positive: [{ h:'El {Par} construye el futuro: {P} invierte en educación como nunca antes', b:'El ministerio de educación publicó datos que muestran un aumento del 30% en la inversión durante la gestión {Par}.' }],
      negative: [{ h:'{P} entiende a los docentes: el {Par} busca soluciones a la crisis educativa', b:'El gobierno nacional anunció nuevas mesas de diálogo con los gremios para desactivar el conflicto educativo.' }],
    },
    tribuna: {
      positive: [{ h:'Oposición: el acuerdo educativo de {P} es solo un parche electoral del {Par}', b:'"Resuelven lo urgente sin atacar lo estructural", afirmó la diputada opositora en sesión ordinaria.' }],
      negative: [{ h:'El {Par} rompe la educación pública: {P} abandona a docentes y alumnos', b:'La coalición opositora presentó un proyecto de interpelación al ministro de educación del gobierno de {P}.' }],
    },
    tendencias: {
      positive: [{ h:'Por fin los chicos vuelven a clases! Gracias {P} 🎓 #EducaciónAR #Docentes', b:'' }],
      negative: [{ h:'Sin clases otra vez por culpa del {Par} 😡 Mis hijos pierden el año #EducaciónEnCrisis', b:'' }],
    },
    foro: {
      positive: [{ h:'El acuerdo docente bajo {P} fue más rápido que en los últimos años. Hay que reconocerlo.', b:'→ 203 respuestas | Hilo: "¿Cómo fue la paritaria docente de este año?"' }],
      negative: [{ h:'Tercera semana sin clases. El {Par} no tiene idea de cómo gestionar educación.', b:'→ 534 respuestas | Hilo: "Huelga docente: ¿quién tiene razón?"' }],
    },
  },

  // ── CORRUPCIÓN ───────────────────────────────────────────
  corrupcion: {
    cronista: {
      positive: [
        { h:'El gobierno de {P} actúa con celeridad ante el escándalo de corrupción', b:'La decisión del ejecutivo del {Par} de separar a los funcionarios implicados fue valorada por organismos anticorrupción y juristas.' },
        { h:'{P} demuestra tolerancia cero: el {Par} responde a la presión ciudadana', b:'La ONG Transparencia Internacional calificó la respuesta del gobierno como "ejemplar y acorde a los estándares internacionales".' },
      ],
      negative: [
        { h:'Escándalo de corrupción sacude al gobierno de {P}: la oposición pide renuncia', b:'Las revelaciones sobre irregularidades en la gestión del {Par} generaron una ola de repudio en la opinión pública.' },
        { h:'El gobierno de {P} en el centro de la tormenta ética', b:'Juristas advierten que la demora en actuar del {Par} tiene costos políticos e institucionales difíciles de revertir.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} limpia su gobierno: el {Par} demuestra que la ética pública no es negociable', b:'Allegados al Ejecutivo remarcaron que la decisión de {P} demuestra "carácter y compromiso con la República".' }],
      negative: [{ h:'{P} denuncia persecución: el {Par} califica las acusaciones de operación política', b:'El gobierno del {Par} señaló que la investigación es "una maniobra para desestabilizar al gobierno legítimo".' }],
    },
    tribuna: {
      positive: [{ h:'La oposición celebra pero advierte: el daño institucional ya está hecho bajo el {Par}', b:'"Que {P} haya actuado no borra que lo permitió durante meses", afirmó el jefe de la oposición.' }],
      negative: [{ h:'Indignación nacional: el gobierno del {Par} se niega a rendir cuentas', b:'Multitudinarias marchas en las principales ciudades exigen la renuncia de {P} ante el escándalo que salpica al ejecutivo.' }],
    },
    tendencias: {
      positive: [{ h:'Bien {P}! Por fin alguien que actúa ante la corrupción 👏 #AntiCorrupción #ARG', b:'' }],
      negative: [{ h:'El {Par} corrompido hasta los huesos 🤢 Esto no da para más #Renuncia{P}', b:'' }],
    },
    foro: {
      positive: [{ h:'Primera vez que veo a un gobierno actuar de verdad ante la corrupción. Apoyar a {P} en esto.', b:'→ 445 respuestas | Hilo: "¿Cómo debe el gobierno manejar los escándalos internos?"' }],
      negative: [{ h:'Todos los políticos son iguales. El {Par} prometió cambio y es más de lo mismo.', b:'→ 789 respuestas | Hilo: "Corrupción estructural: ¿tiene solución?"' }],
    },
  },

  // ── CAMPO / AGRO ─────────────────────────────────────────
  campo: {
    cronista: {
      positive: [
        { h:'El campo respira: el gobierno de {P} y el sector agropecuario llegan a un acuerdo', b:'La medida del {Par} fue recibida con alivio en las principales cámaras del sector. Las exportaciones agroindustriales podrían recuperarse en los próximos meses.' },
        { h:'Agro-exportaciones en alza: las políticas de {P} favorecen al sector rural', b:'La Bolsa de Comercio de Rosario informó que el volumen de declaraciones de ventas al exterior aumentó tras las medidas del gobierno {Par}.' },
      ],
      negative: [
        { h:'El campo en pie de guerra: el sector agropecuario rechaza las políticas de {P}', b:'Organizaciones rurales convocaron a una reunión de emergencia para evaluar medidas de protesta ante las decisiones del {Par}.' },
        { h:'Sequía y políticas: doble golpe para el agro bajo la gestión de {P}', b:'El sector agropecuario enfrenta una temporada difícil, complicada además por la política cambiaria y fiscal del gobierno {Par}.' },
      ],
    },
    voz: {
      positive: [{ h:'El {Par} con los productores: {P} apuesta al campo como motor del país', b:'Desde el gobierno remarcaron que el sector agropecuario es "un aliado estratégico del modelo productivo" del {Par}.' }],
      negative: [{ h:'El gobierno de {P} tiene un plan para el campo: el {Par} promete nuevas medidas', b:'Fuentes del ministerio de agricultura adelantaron compensaciones para los productores más afectados en los próximos días.' }],
    },
    tribuna: {
      positive: [{ h:'Oposición: las medidas para el campo del {Par} llegan tarde y son insuficientes', b:'"Hace meses que pedimos esto desde el Congreso y recién ahora lo escuchan", señaló el diputado opositor.' }],
      negative: [{ h:'El {Par} asfixia al campo: el sector que genera las divisas del país, acorralado', b:'"El gobierno de {P} no entiende al agro o directamente lo odia", fue la dura frase del presidente de la Sociedad Rural.' }],
    },
    tendencias: {
      positive: [{ h:'Buena noticia para el campo! El {Par} finalmente escuchó 🌾 #Agro #ARG', b:'' }],
      negative: [{ h:'El campo está podrido del gobierno de {P} 🌾😡 #LasRetencionesMatan', b:'' }],
    },
    foro: {
      positive: [{ h:'Soy productor en el interior y la medida de {P} nos va a ayudar bastante. Al menos es algo.', b:'→ 167 respuestas | Hilo: "Impacto de las medidas agropecuarias en el interior"' }],
      negative: [{ h:'Tres generaciones en el campo y nunca vi políticas tan malas como las del {Par}.', b:'→ 321 respuestas | Hilo: "¿El gobierno de {P} destruye el campo?"' }],
    },
  },

  // ── ENERGÍA ──────────────────────────────────────────────
  energia: {
    cronista: {
      positive: [
        { h:'El gobierno de {P} avanza en la solución a la crisis energética nacional', b:'La medida anunciada por el ejecutivo {Par} busca garantizar el suministro a corto plazo. Expertos en energía valoraron la decisión.' },
        { h:'{P} lanza plan energético: el {Par} apuesta por la soberanía y la transición', b:'El anuncio incluye inversiones en infraestructura y énfasis en la diversificación de la matriz energética nacional.' },
      ],
      negative: [
        { h:'Cortes de luz y gas: el gobierno de {P} no puede resolver la crisis energética', b:'La situación energética se deteriora y el {Par} no logra presentar soluciones definitivas. Industriales advierten sobre el impacto productivo.' },
        { h:'La crisis energética pone en jaque a la gestión de {P}', b:'Proyecciones técnicas indican que la demanda energética seguirá superando la oferta durante los próximos meses bajo la administración {Par}.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} asegura la energía para todos: el {Par} da un paso histórico', b:'El ministerio destacó que "la energía es un derecho, no un privilegio" y que el gobierno trabaja para garantizarla.' }],
      negative: [{ h:'El {Par} trabaja sin descanso para resolver la crisis: {P} promete luz para todos', b:'Fuentes del ejecutivo aseguraron que la situación energética está "bajo control y mejorando gradualmente".' }],
    },
    tribuna: {
      positive: [{ h:'La oposición advierte: la solución energética de {P} es cara y no resuelve el fondo', b:'"Estamos pagando caro por los errores del {Par} en política energética", señaló la oposición en sesión especial.' }],
      negative: [{ h:'El {Par} apaga al país: {P} lleva a la Argentina a la oscuridad', b:'"Este gobierno no tiene plan energético. Improvisa un apagón tras otro", afirmó el candidato opositor.' }],
    },
    tendencias: {
      positive: [{ h:'El plan energético de {P} no es tan malo 🤔 Veamos cómo sigue #EnergíaAR', b:'' }],
      negative: [{ h:'Otra vez sin luz 😤 El gobierno de {P} no puede con la crisis energética #Apagones', b:'' }],
    },
    foro: {
      positive: [{ h:'En mi zona volvió el gas y la presión mejoró. Algo hicieron bien desde el {Par}.', b:'→ 112 respuestas | Hilo: "¿Cómo está la energía en tu ciudad?"' }],
      negative: [{ h:'Tercer corte de luz esta semana. {P} y el {Par} que expliquen esta infraestructura.', b:'→ 389 respuestas | Hilo: "Crisis energética: testimonios de todo el país"' }],
    },
  },

  // ── AMBIENTE ─────────────────────────────────────────────
  ambiente: {
    cronista: {
      positive: [
        { h:'El gobierno de {P} responde a la emergencia ambiental con medidas concretas', b:'La decisión del ejecutivo fue valorada por ONGs ambientales y organismos internacionales. El {Par} se compromete con la agenda climática.' },
        { h:'{P} pone la agenda ambiental en el centro de la política nacional', b:'Organismos internacionales destacaron el compromiso del gobierno {Par} con los objetivos del Acuerdo de París.' },
      ],
      negative: [
        { h:'Catástrofe ambiental: el gobierno de {P} enfrenta una de las peores crisis', b:'Expertos en medio ambiente señalan que la respuesta de la administración {Par} ha sido tardía e insuficiente ante la emergencia.' },
        { h:'El cambio climático golpea y el {Par} no tiene respuestas estructurales', b:'Un informe advierte que las políticas ambientales del gobierno de {P} están lejos de lo necesario para enfrentar la crisis climática.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} defiende nuestro ambiente: el {Par} lidera la transición ecológica nacional', b:'El gobierno anunció nuevas áreas naturales protegidas y compromisos de reducción de emisiones bajo la gestión de {P}.' }],
      negative: [{ h:'El gobierno de {P} trabaja para proteger a los afectados: el {Par} en el territorio', b:'Equipos del ministerio de ambiente trabajan sobre el terreno para asistir a las comunidades afectadas por la crisis.' }],
    },
    tribuna: {
      positive: [{ h:'Oposición: el compromiso ambiental del {Par} es solo imagen, no política real', b:'"Prometen mucho y hacen poco. El presupuesto ambiental bajo {P} es el más bajo en años", señaló el legislador opositor.' }],
      negative: [{ h:'El {Par} destruye el ambiente nacional: {P} antepone el negocio a la naturaleza', b:'"Este gobierno no tiene política ambiental: tiene política de negocios disfrazada de ecología", acusó la oposición.' }],
    },
    tendencias: {
      positive: [{ h:'Me alegra que {P} esté haciendo algo por el ambiente 🌿 Ya era hora! #MedioAmbienteAR', b:'' }],
      negative: [{ h:'El planeta se cae a pedazos y el {Par} mirando para otro lado 🌍💔 #CambioClimático', b:'' }],
    },
    foro: {
      positive: [{ h:'Buen movimiento del {Par} en lo ambiental. Aunque lo ideal sería una política integral.', b:'→ 178 respuestas | Hilo: "¿Qué tan verde es el gobierno de {P}?"' }],
      negative: [{ h:'Me inundé dos veces este año. La responsabilidad del {Par} en el desastre es enorme.', b:'→ 623 respuestas | Hilo: "Inundaciones y falta de obras: testimonios"' }],
    },
  },

  // ── POLÍTICA ─────────────────────────────────────────────
  politica: {
    cronista: {
      positive: [
        { h:'{P} consolida su posición institucional con respaldo del Congreso', b:'La medida del ejecutivo contó con el respaldo de la mayoría parlamentaria. Analistas políticos describen un momento de fortaleza para el {Par}.' },
        { h:'El gobierno de {P} suma puntos en la agenda política internacional', b:'La gestión del {Par} recibió reconocimiento de cancillerías regionales y organismos multilaterales.' },
      ],
      negative: [
        { h:'Tensión institucional: el gobierno de {P} enfrenta cuestionamientos desde el Congreso', b:'Legisladores de la oposición presentaron pedidos de informes sobre el ejecutivo del {Par}.' },
        { h:'La gobernabilidad en riesgo: el {Par} bajo presión en todos los frentes', b:'Analistas señalan que el gobierno de {P} atraviesa su momento político más difícil desde que asumió.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} lidera con firmeza: el {Par} demuestra que Argentina tiene gobierno', b:'El ejecutivo celebró la decisión como "un hito en la consolidación de la democracia y el proyecto del {Par}".' }],
      negative: [{ h:'El {Par} resiste la embestida opositora: {P} defiende las instituciones', b:'Desde el gobierno alertaron sobre "maniobras desestabilizadoras" y confirmaron que {P} "no dará un paso atrás".' }],
    },
    tribuna: {
      positive: [{ h:'Oposición alerta: el {Par} usa las instituciones para consolidar el poder de {P}', b:'"Lo que el gobierno llama gobernabilidad es concentración de poder", advirtió la coalición opositora.' }],
      negative: [{ h:'El gobierno de {P} en caída libre: el {Par} pierde la confianza ciudadana', b:'Encuestas de la semana muestran la peor imagen presidencial de {P} desde que asumió. El {Par} busca explicaciones.' }],
    },
    tendencias: {
      positive: [{ h:'Hay que reconocerlo: {P} manejó bien esto 🏛️ #Política #Gobernabilidad #ARG', b:'' }],
      negative: [{ h:'El {Par} sin brújula política 🧭😤 ¿Alguien está conduciendo este gobierno?? #CrisisPolítica', b:'' }],
    },
    foro: {
      positive: [{ h:'No soy del {Par} pero la decisión de {P} estuvo bien tomada. Hay que decirlo.', b:'→ 267 respuestas | Hilo: "Análisis de la última semana política"' }],
      negative: [{ h:'Esto está peor que nunca. El gobierno de {P} parece un barco sin timón.', b:'→ 445 respuestas | Hilo: "¿El {Par} puede recuperarse de esto?"' }],
    },
  },

  // ── DERECHOS ─────────────────────────────────────────────
  derechos: {
    cronista: {
      positive: [
        { h:'{P} avanza en la agenda de derechos: el {Par} cumple compromisos internacionales', b:'Organizaciones de derechos humanos valoraron positivamente la decisión del ejecutivo. El {Par} se alinea con estándares internacionales.' },
        { h:'El gobierno de {P} toma medidas históricas en materia de derechos y ciudadanía', b:'La decisión del {Par} fue aplaudida por organismos internacionales y organizaciones de la sociedad civil.' },
      ],
      negative: [
        { h:'Alerta de derechos humanos: organizaciones cuestionan la política del {Par}', b:'Informes de organismos internacionales señalan preocupaciones sobre el respeto a los derechos bajo las últimas decisiones de {P}.' },
        { h:'El gobierno de {P} retrocede en derechos: el {Par} bajo la lupa internacional', b:'La ONU y varias ONG expresaron preocupación por las últimas medidas del ejecutivo en materia de derechos civiles.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} defiende a todas las personas: el {Par} hace historia en derechos humanos', b:'Desde el ejecutivo remarcaron que "la agenda de derechos no es ideología sino justicia".' }],
      negative: [{ h:'El {Par} trabaja para proteger los derechos de todos: {P} da explicaciones', b:'El gobierno nacional aclaró que las medidas "respetan plenamente la Constitución y los tratados internacionales".' }],
    },
    tribuna: {
      positive: [{ h:'La oposición alerta: el {Par} usa los derechos como bandera electoral', b:'"Los derechos no son un negocio político", señaló la referente opositora al cuestionar al gobierno de {P}.' }],
      negative: [{ h:'El {Par} pisotea los derechos fundamentales: {P} cruza líneas inaceptables', b:'"Lo que está haciendo el gobierno de {P} es inaceptable en una democracia real", afirmó el principal referente opositor.' }],
    },
    tendencias: {
      positive: [{ h:'Bien por {P}! Por fin un gobierno que respeta los derechos 👊 #DDHH #ARG', b:'' }],
      negative: [{ h:'El gobierno del {Par} violando derechos como si nada 😡 #NoEnNuestroNombre #ARG', b:'' }],
    },
    foro: {
      positive: [{ h:'Me emocioné cuando vi lo que hizo {P}. Hacía mucho que esperábamos una decisión así.', b:'→ 298 respuestas | Hilo: "Avances en derechos humanos bajo el gobierno de {P}"' }],
      negative: [{ h:'Esto es un retroceso enorme. El {Par} borró de un plumazo años de conquistas.', b:'→ 567 respuestas | Hilo: "¿El gobierno de {P} retrocede en derechos?"' }],
    },
  },

  // ── TECNOLOGÍA ───────────────────────────────────────────
  tecnologia: {
    cronista: {
      positive: [
        { h:'El gobierno de {P} impulsa la economía del conocimiento con medidas innovadoras', b:'El sector tecnológico recibió con optimismo el anuncio del {Par}. Startups y empresas de software celebraron las nuevas condiciones.' },
        { h:'{P} posiciona al país en la vanguardia tecnológica regional', b:'El plan del {Par} fue elogiado por cámaras del sector y organismos internacionales especializados.' },
      ],
      negative: [
        { h:'El gobierno de {P} queda atrás en la agenda tecnológica regional', b:'Informes comparativos muestran que el país pierde posiciones en innovación y conocimiento bajo la gestión del {Par}.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} lleva al país al siglo XXI: el {Par} apuesta por la tecnología argentina', b:'El ministerio celebró la medida como "el inicio de una nueva era de soberanía tecnológica".' }],
      negative: [{ h:'El gobierno de {P} trabaja para no quedar atrás: el {Par} promete plan tecnológico', b:'Fuentes del ejecutivo adelantaron "novedades importantes" en materia tecnológica en los próximos meses.' }],
    },
    tribuna: {
      positive: [{ h:'Oposición: el plan tecnológico del {Par} es caro y no llega a quienes más lo necesitan', b:'"La brecha digital se agranda bajo este gobierno", advirtió el bloque opositor.' }],
      negative: [{ h:'El {Par} deja al país fuera de la revolución tecnológica mundial', b:'Según analistas, Argentina perderá inversión tecnológica si el gobierno de {P} no cambia de rumbo urgente.' }],
    },
    tendencias: {
      positive: [{ h:'Que buen movimiento de {P} en tech! 💻🚀 Argentina puede ser un hub regional #TechAR', b:'' }],
      negative: [{ h:'El {Par} sin idea de tecnología. Me da vergüenza ajena 😳 #TechArgentina', b:'' }],
    },
    foro: {
      positive: [{ h:'Trabajo en IT y la medida de {P} nos beneficia directamente. Es un buen comienzo.', b:'→ 189 respuestas | Hilo: "¿Qué impacto tiene la política tech del {Par}?"' }],
      negative: [{ h:'Perdemos cerebros todos los meses y el {Par} no hace nada para retenerlos.', b:'→ 312 respuestas | Hilo: "Fuga de talentos tecnológicos bajo el gobierno de {P}"' }],
    },
  },

  // ── INVERSIÓN / INDUSTRIA ─────────────────────────────────
  inversion: {
    cronista: {
      positive: [
        { h:'Señal positiva para la inversión: el gobierno de {P} atrae capitales externos', b:'El anuncio del {Par} fue recibido con optimismo por cámaras industriales y fondos de inversión internacionales.' },
        { h:'{P} reactiva la industria nacional con un plan de largo plazo', b:'El sector industrial celebró el compromiso del {Par} con la producción local. Las proyecciones de inversión mejoran por primera vez en meses.' },
      ],
      negative: [
        { h:'La inversión huye del país: el gobierno de {P} no genera confianza empresarial', b:'Informes del sector privado muestran caídas en la inversión productiva durante la gestión del {Par}.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} atrae inversiones y genera empleo: el {Par} en acción', b:'El gobierno destacó que las inversiones anunciadas generarán "miles de empleos de calidad" en los próximos años.' }],
      negative: [{ h:'El {Par} trabaja para revertir la fuga de inversiones: {P} da señales al mercado', b:'Fuentes del ministerio de producción señalaron que trabajan para "reactivar la economía real".' }],
    },
    tribuna: {
      positive: [{ h:'Oposición: las inversiones del {Par} benefician a pocos y excluyen a las pymes', b:'"Los grandes grupos económicos ganaron con este gobierno; las pymes perdieron", afirmó el bloque opositor.' }],
      negative: [{ h:'El {Par} destruye la industria: {P} asfixia a los empresarios nacionales', b:'Cámaras industriales presentaron un informe sobre el deterioro del sector bajo la gestión {Par}.' }],
    },
    tendencias: {
      positive: [{ h:'Se vienen inversiones bajo {P}! Ojalá sea real y no solo anuncio 🏭 #IndustriaAR', b:'' }],
      negative: [{ h:'Otra empresa que se va del país por culpa del {Par}. ¿Cuántas más? 😢 #IndustriaArgentina', b:'' }],
    },
    foro: {
      positive: [{ h:'Tengo una pyme y la medida de {P} nos va a ayudar. Por fin el {Par} piensa en nosotros.', b:'→ 145 respuestas | Hilo: "Impacto de las medidas industriales en pymes"' }],
      negative: [{ h:'Cerré mi fábrica esta semana. 40 empleados sin trabajo. Esto es lo que hace el {Par}.', b:'→ 893 respuestas | Hilo: "Cierres de empresas bajo el gobierno de {P} — testimonios"' }],
    },
  },

  // ── GENERAL (fallback) ────────────────────────────────────
  general: {
    cronista: {
      positive: [
        { h:'{P} toma una decisión que refuerza la confianza en su gobierno', b:'La medida adoptada por el ejecutivo del {Par} fue valorada positivamente por analistas y referentes de la sociedad civil.' },
        { h:'El gobierno de {P} actúa con determinación ante los desafíos del mandato', b:'Expertos en gestión pública destacaron la celeridad y coherencia de la respuesta del {Par} ante la situación planteada.' },
      ],
      negative: [
        { h:'Decisión polémica del gobierno de {P} genera reacciones encontradas', b:'La medida adoptada por el {Par} divide a la opinión pública. Los afines la celebran; los críticos advierten sobre posibles efectos no deseados.' },
        { h:'El gobierno de {P} en el ojo de la tormenta por su última decisión', b:'Analistas políticos y económicos evalúan el impacto de la decisión del {Par}, que dejó más preguntas que respuestas.' },
      ],
    },
    voz: {
      positive: [{ h:'{P} demuestra que hay conducción: el {Par} no improvisa', b:'El gobierno nacional calificó la decisión como "parte de un plan coherente y sostenible a largo plazo".' }],
      negative: [{ h:'El gobierno de {P} enfrenta el momento difícil con valentía: el {Par} no da el brazo a torcer', b:'Desde el ejecutivo señalaron que "gobernar implica tomar decisiones que no siempre son populares pero sí necesarias".' }],
    },
    tribuna: {
      positive: [{ h:'La oposición celebra a medias: "bien, pero insuficiente", dice el bloque opositor', b:'"No podemos aplaudir lo que debería haber sido la normalidad desde el primer día del {Par}".' }],
      negative: [{ h:'La oposición exige rendición de cuentas al gobierno de {P}', b:'"El {Par} tiene que explicarle al país por qué tomó esta decisión que perjudica a millones".' }],
    },
    tendencias: {
      positive: [{ h:'Buen movimiento del gobierno de {P} 👍 Vamos a ver si se sostiene #ARG #Política', b:'' }],
      negative: [{ h:'El {Par} no aprende nunca 🤦 ¿Hasta cuándo? #ArgentinaGobierna', b:'' }],
    },
    foro: {
      positive: [{ h:'Reconozco que la decisión de {P} estuvo bien. No todo tiene que ser crítica.', b:'→ 134 respuestas | Hilo: "Análisis de la última semana política"' }],
      negative: [{ h:'Estoy hasta la coronilla del gobierno de {P}. El {Par} no puede seguir así.', b:'→ 356 respuestas | Hilo: "¿Qué le falta al gobierno del {Par}?"' }],
    },
  },
};

export const NEWS_TEMPLATES = _T;

// ── Templates específicos para eventos especiales ─────────────
// Se acceden vía getTagCategory() que mapea los nuevos tags a categorías.
// Aquí se agregan overrides específicos para los tags especiales.
// El motor busca primero NEWS_TEMPLATES[cat][source][sentiment],
// y si no hay, cae al 'general'. Estos templates son contextuales.

export const SPECIAL_NEWS_TEMPLATES = {
  // Traición interna / VP
  '💀 Traición Interna': {
    cronista: {
      positive: [
        { h:'Crisis interna en el gobierno de {P}: el Vicepresidente tensiona la coalición', b:'El Ejecutivo intenta contener el daño político de una fractura que amenaza la gobernabilidad. Fuentes del {Par} piden calma pero admiten que la situación es "seria".' },
        { h:'{P} enfrenta su mayor desafío interno desde que asumió', b:'La crisis con la Vicepresidencia pone a prueba la solidez de la coalición de gobierno. El {Par} trabaja en una salida institucional.' },
      ],
      negative: [
        { h:'La traición que nadie esperaba: crisis terminal en el gobierno del {Par}', b:'El Vicepresidente desafió abiertamente a {P} en un golpe político sin precedentes. Analistas advierten que el gobierno quedó herido de gravedad.' },
        { h:'El gobierno de {P} al borde de la fractura: Vicepresidente vs. Presidente', b:'La ruptura interna expone las contradicciones de fondo del proyecto del {Par}. Los mercados reaccionaron con cautela.' },
      ],
    },
    tribuna: {
      negative: [
        { h:'TRAICIÓN EN LA CÚPULA: el Vicepresidente le clava el puñal a {P}', b:'Lo que el {Par} prometió unido se cayó a pedazos. La traición del vice es el principio del fin de este gobierno.' },
        { h:'El {Par} se derrumba desde adentro: el vicio de la deslealtad llega a la cumbre del poder', b:'Nadie puede gobernar un país desde la hipocresía. La crisis interna confirma que {P} nunca tuvo el control real.' },
      ],
      positive: [
        { h:'La fractura interna en el {Par}: quién va a pagar el precio', b:'La crisis de la Vicepresidencia puede costarle caro a {P}, pero también puede ser la oportunidad para reorganizar el gobierno.' },
      ],
    },
    tendencias: {
      negative: [{ h:'#ViceRenuncia tendencia nacional: miles piden elecciones ya', b:'Las redes explotan con el conflicto interno del gobierno del {Par}. "Si se pelean entre ellos, ¿quién gobierna?" es el tweet más retuiteado del día.' }],
      positive: [{ h:'#GobiernoDePie: el {Par} llama a la calma ante la crisis interna', b:'Miles de simpatizantes del {Par} salen a defender a {P} en las redes. "Las peleas internas son parte de la democracia" argumentan.' }],
    },
  },

  // Escándalo de gabinete / Corrupción interna
  '🔴 Escándalo de Gabinete': {
    cronista: {
      negative: [
        { h:'Escándalo en el gobierno de {P}: ministro investigado por corrupción', b:'La justicia avanza sobre un funcionario clave del {Par}. El gobierno enfrenta la peor crisis de imagen de su gestión.' },
        { h:'La corrupción llegó al corazón del gobierno del {Par}', b:'Un ministro de {P} enfrenta acusaciones graves que sacuden los cimientos de la coalición gobernante. La credibilidad institucional está en juego.' },
      ],
      positive: [
        { h:'{P} actúa con firmeza ante el escándalo de corrupción en el gabinete', b:'La decisión presidencial de separar al funcionario acusado fue bien recibida por sectores de la oposición. El {Par} intenta recuperar credibilidad.' },
      ],
    },
    tribuna: {
      negative: [
        { h:'CORRUPCIÓN CONFIRMADA: el {Par} roba igual que siempre', b:'No hay diferencia entre los de antes y los de ahora. El escándalo de corrupción en el gobierno de {P} demuestra que el sistema político está podrido.' },
        { h:'La podredumbre llega a la cima: {P} debe responder por su ministro', b:'¿Cuánto sabía el Presidente? La pregunta que todo el país se hace mientras el {Par} intenta tapar el sol con la mano.' },
      ],
      positive: [{ h:'¿Alcanza con echar al ministro? El {Par} tiene mucho que explicar', b:'La remoción del funcionario es apenas el primer paso. La sociedad exige saber cómo llegó hasta tan alto alguien con estas conductas.' }],
    },
    tendencias: {
      negative: [{ h:'#MinistroCorrupto viral: el escándalo que no para de crecer', b:'Las capturas de pantalla, los documentos y los testimonios se multiplican en redes. "{P} sabía" es el hashtag más buscado del día.' }],
      positive: [{ h:'#ToleranciasCero: {P} actúa contra la corrupción en su propio gobierno', b:'La decisión de {P} de separar al ministro gana apoyo en redes. "Por eso lo voté" comentan simpatizantes del {Par}.' }],
    },
  },

  // Crisis global / Pandemia / Guerra
  '🌍 Crisis Global': {
    cronista: {
      negative: [
        { h:'Crisis financiera global golpea a Argentina antes de que el gobierno pueda reaccionar', b:'Los mercados internacionales arrastraron a la economía local. El gobierno de {P} toma medidas de emergencia para contener el impacto.' },
        { h:'El colapso global llega a las puertas del {Par}: emergencia económica declarada', b:'{P} convocó a un gabinete de emergencia. Los indicadores locales ya reflejan el shock externo antes de que se tome ninguna decisión.' },
      ],
      positive: [
        { h:'Argentina frente a la crisis global: {P} busca diferenciarse de la región', b:'El gobierno del {Par} presenta su plan de contingencia ante la crisis financiera mundial. Economistas advierten que el margen de maniobra es estrecho.' },
      ],
    },
    tribuna: {
      negative: [{ h:'LA CRISIS GLOBAL DESTRUYE LO POCO QUE QUEDABA: {P} sin respuestas', b:'El caos financiero internacional encontró a Argentina sin reservas, sin crédito y con un gobierno del {Par} que no tiene plan B.' }],
      positive: [{ h:'Una crisis externa que llega en el peor momento para el gobierno del {Par}', b:'Nadie tiene la culpa de lo que pasa afuera, pero sí son responsables de haber llegado tan débiles a este momento.' }],
    },
    tendencias: {
      negative: [{ h:'#CrisisGlobal: Argentina una vez más en el ojo de la tormenta', b:'Las redes explotan con memes y con miedo. "¿Cuánto sube el dólar?" es la pregunta más buscada en Google de Argentina.' }],
      positive: [{ h:'#ArgentinaResiste: el gobierno de {P} activa el plan de emergencia', b:'Las medidas anunciadas por {P} generan debate. Algunos creen que es suficiente, otros que llega tarde.' }],
    },
  },

  '☣️ Pandemia Global': {
    cronista: {
      negative: [
        { h:'Pandemia global: Argentina activa protocolo de emergencia sanitaria', b:'El gobierno de {P} declara la emergencia sanitaria internacional. Los primeros casos locales ya son miles y la curva es exponencial.' },
        { h:'El virus llegó antes que el plan: el sistema de salud bajo {P} enfrenta su mayor prueba', b:'Los hospitales se preparan para el peor escenario. El gobierno del {Par} pide a la población calma y cooperación.' },
      ],
      positive: [
        { h:'{P} activa respuesta coordinada ante la pandemia global: ¿alcanza?', b:'El plan sanitario presentado por el gobierno del {Par} incluye cuarentena, expansión del sistema de salud y compra de insumos.' },
      ],
    },
    tribuna: {
      negative: [{ h:'PANDEMIA Y GOBIERNO DESBORDADO: el {Par} no estaba preparado', b:'Lo que otros países previeron, {P} no vio venir. La pandemia encontró al sistema de salud en ruinas y al gobierno sin plan.' }],
      positive: [{ h:'La pandemia no es culpa del gobierno pero sí es su responsabilidad', b:'El {Par} tiene ahora la oportunidad de demostrar que el Estado puede proteger a la gente. Las próximas semanas definirán el legado de {P}.' }],
    },
    tendencias: {
      negative: [{ h:'#PandemiaGlobal ya es tendencia: el miedo se apodera de las redes', b:'"¿Cierran las escuelas?" "¿Hay camas?" Las preguntas de los argentinos revelan la angustia ante la crisis sanitaria.' }],
      positive: [{ h:'#JuntosContraElVirus: el {Par} llama a la unidad nacional', b:'El llamado de {P} a la unidad nacional ante la pandemia genera respaldo en las redes. Miles comparten el mensaje del gobierno.' }],
    },
  },

  '🌍 Guerra Mundial': {
    cronista: {
      negative: [
        { h:'Tercera Guerra Mundial: el gobierno de {P} define la postura argentina', b:'El conflicto global dejó a Argentina ante una disyuntiva histórica. El {Par} delibera mientras los mercados colapsan y el comercio internacional se paraliza.' },
        { h:'El mundo en guerra: Argentina pierde el 35% de su comercio exterior en 48 horas', b:'Antes de que {P} tomara ninguna decisión, el impacto económico de la guerra global ya fue devastador. El gobierno enfrenta la crisis más grave del siglo.' },
      ],
      positive: [
        { h:'Argentina en tiempos de guerra mundial: {P} apuesta por la neutralidad', b:'La postura del gobierno del {Par} es histórica. Cómo Argentina manejó su rol en las guerras mundiales del siglo pasado puede ser una guía.' },
      ],
    },
    tribuna: {
      negative: [{ h:'EL MUNDO ARDE Y EL {Par} SIN BRÚJULA: {P} desorientado ante la III Guerra', b:'Mientras las potencias nucleares se enfrentan, el gobierno no sabe qué hacer. Neutralidad, alineamiento o aislacionismo: todas las opciones tienen un costo devastador.' }],
      positive: [{ h:'En medio de la guerra mundial, ¿puede Argentina ser la excepción?', b:'El gobierno de {P} tiene la oportunidad histórica de hacer de la Argentina un refugio de paz. Si logra mantenerse neutral, puede beneficiarse.' }],
    },
    tendencias: {
      negative: [{ h:'#GuerraMundial3 tendencia: los argentinos buscan respuestas', b:'"¿Somos neutrales?" "¿Vienen los misiles aquí?" Las búsquedas revelan el pánico de una sociedad que mira el horror desde lejos pero lo siente cerca.' }],
      positive: [{ h:'#ArgentinaNeutra: miles apoyan la postura de {P} ante la guerra', b:'La decisión del {Par} de mantenerse al margen del conflicto global genera alivio en las redes. "Lo único sensato que hicieron" comentan.' }],
    },
  },

  '✊ Golpe de Estado': {
    cronista: {
      negative: [
        { h:'Intento de golpe de Estado: militares rodean Casa Rosada y dan ultimátum a {P}', b:'Crisis constitucional sin precedentes desde 1983. El Jefe del Estado Mayor exige la renuncia del gobierno del {Par} en 6 horas. La comunidad internacional condena.' },
        { h:'La democracia bajo amenaza: {P} enfrenta un golpe militar', b:'Las Fuerzas Armadas desafían al gobierno electo del {Par} en lo que analistas califican como el mayor ataque a las instituciones en 40 años.' },
      ],
      positive: [
        { h:'{P} resiste el golpe: la democracia en la encrucijada', b:'El gobierno del {Par} llama a la ciudadanía a defender las instituciones. La respuesta popular puede definir el desenlace de la crisis.' },
      ],
    },
    tribuna: {
      negative: [{ h:'GOLPE MILITAR: la crisis que nadie quería y que el {Par} no supo evitar', b:'La debilidad del gobierno de {P} abrió la puerta a los que siempre quisieron volver. La democracia paga el precio de años de mala política.' }],
      positive: [{ h:'El pueblo en la calle defiende a {P} ante el intento de golpe', b:'Miles de ciudadanos rodean Casa Rosada en defensa de la democracia. La respuesta popular sorprende hasta a los propios organizadores de la resistencia.' }],
    },
    tendencias: {
      negative: [{ h:'#GolpeDeEstado viral: el mundo mira con horror la crisis argentina', b:'La noticia recorre el mundo. "¿Argentina en golpe?" es trending en 40 países. La solidaridad internacional con {P} es masiva.' }],
      positive: [{ h:'#DemocraciaONada: millones de argentinos salen a defender las instituciones', b:'El hashtag que nadie quería usar se volvió el símbolo de la resistencia. "{P} no está solo" repiten los que se movilizan.' }],
    },
  },
};

// ── Templates reactivos a indicadores ────────────────────────
export const IND_NEWS = {
  ipc: {
    warn: [
      { source:'cronista', h:'La inflación supera las proyecciones: el {Par} bajo presión económica', b:'Los últimos datos del INDEC muestran una inflación mensual que preocupa al equipo económico de {P}. Economistas exigen medidas urgentes.' },
      { source:'foro',     h:'Los precios siguen subiendo y el sueldo no alcanza. ¿Alguien le avisa a {P}?', b:'→ 445 respuestas | Hilo: "Precios y salarios: la brecha que crece"' },
    ],
    danger: [
      { source:'cronista',   h:'ALERTA: la inflación alcanza niveles críticos bajo el gobierno de {P}', b:'El IPC de los últimos 30 días registró valores que no se veían desde la crisis. Economistas advierten sobre el riesgo de espiralización.' },
      { source:'tribuna',    h:'La hiperinflación llama a la puerta: el {Par} pierde el control de los precios', b:'"Estamos en el umbral de una crisis sin precedentes. El gobierno de {P} perdió el control monetario", advirtió el economista opositor.' },
      { source:'tendencias', h:'📈📈📈 Los precios no paran. Esto ya no es inflación, es desastre 😱 #HiperinflacionAR', b:'' },
    ],
  },
  deuda: {
    warn: [
      { source:'cronista', h:'La deuda externa genera señales de alerta: el mercado sigue de cerca a {P}', b:'Economistas advierten sobre la trayectoria del endeudamiento y exigen al {Par} una estrategia de largo plazo.' },
    ],
    danger: [
      { source:'cronista',   h:'La deuda externa llega a niveles insostenibles bajo la gestión de {P}', b:'El ratio deuda-PBI alcanzó valores que preocupan al FMI y a los principales acreedores internacionales.' },
      { source:'tribuna',    h:'El {Par} hipoteca el futuro: la deuda de {P} la pagarán las próximas generaciones', b:'"No existe precedente de una deuda como esta en nuestra historia reciente", señaló el economista opositor.' },
    ],
  },
  reservas: {
    warn: [
      { source:'cronista', h:'Las reservas del Banco Central se achican: señal de alerta para el gobierno de {P}', b:'El nivel de reservas internacionales netas preocupa a analistas cambiarios y al equipo económico del {Par}.' },
    ],
    danger: [
      { source:'cronista',   h:'CRÍTICO: las reservas tocan mínimos históricos bajo la gestión del {Par}', b:'El Banco Central enfrenta su peor momento en años. Fuentes del sector financiero advierten sobre el riesgo de un salto cambiario incontrolado.' },
      { source:'tendencias', h:'Sin reservas, sin dólares, sin plan 💸😰 El gobierno de {P} perdió el control #DólarAR', b:'' },
    ],
  },
  riesgo: {
    warn: [
      { source:'cronista', h:'El riesgo país sube y los inversores observan con cautela al gobierno de {P}', b:'La prima de riesgo soberano aumentó en los últimos días, encareciendo el crédito externo para el {Par}.' },
    ],
    danger: [
      { source:'cronista', h:'Riesgo país disparado: la confianza internacional en {P} está en mínimos históricos', b:'El spread soberano superó los niveles de la última crisis. Economistas comparan la situación con episodios críticos previos.' },
      { source:'tribuna',  h:'El {Par} destruyó la credibilidad del país: el riesgo país en zona de default', b:'"Esto es el resultado de improvisación y gestión irresponsable", señaló el principal economista de la oposición.' },
    ],
  },
  pobreza: {
    warn: [
      { source:'cronista', h:'Los índices de pobreza suben: el gobierno de {P} enfrenta un desafío social urgente', b:'Datos de organismos sociales muestran un deterioro en las condiciones de vida bajo la gestión del {Par}.' },
      { source:'foro',     h:'Más pobres que antes de que asumiera {P}. Los números no mienten aunque el {Par} los niegue.', b:'→ 678 respuestas | Hilo: "La pobreza en el país — datos reales"' },
    ],
    danger: [
      { source:'cronista',   h:'EMERGENCIA SOCIAL: la pobreza alcanza niveles críticos bajo la gestión de {P}', b:'El índice de pobreza superó el umbral de emergencia. Organismos sociales exigen al {Par} declarar crisis humanitaria nacional.' },
      { source:'tendencias', h:'Que alguien le explique a {P} que la mitad del país no llega a comer 😢 #CrisisSocial #Urgente', b:'' },
    ],
  },
  desocupacion: {
    warn: [
      { source:'cronista', h:'El desempleo crece: el gobierno de {P} no logra revertir la tendencia laboral', b:'Los últimos datos del mercado laboral confirman que la desocupación sigue en alza bajo la administración del {Par}.' },
    ],
    danger: [
      { source:'cronista', h:'Crisis de empleo: el desempleo alcanza niveles de emergencia bajo {P}', b:'Con la desocupación en zona crítica, el gobierno del {Par} enfrenta su mayor desafío social hasta la fecha.' },
      { source:'foro',     h:'Me quedé sin trabajo la semana pasada. Ya van meses buscando empleo bajo el gobierno de {P}.', b:'→ 1.2k respuestas | Hilo: "Desempleo: experiencias y testimonios"' },
    ],
  },
  produccion: {
    warn: [
      { source:'cronista', h:'La producción industrial cae: señal de alerta para el sector manufacturero bajo {P}', b:'Los índices de producción muestran una contracción sostenida que preocupa a industriales y analistas bajo el {Par}.' },
    ],
    danger: [
      { source:'cronista', h:'Colapso productivo: la industria nacional en su peor momento bajo la gestión de {P}', b:'La actividad industrial registra una caída histórica. Cámaras del sector advierten sobre quiebras masivas si el {Par} no actúa.' },
      { source:'tribuna',  h:'El {Par} destruye la industria: récord de cierres de fábricas bajo el gobierno de {P}', b:'"El aparato productivo del país está siendo demolido por políticas sin sustento técnico", acusó la oposición.' },
    ],
  },
  confianza: {
    warn: [
      { source:'cronista',   h:'Baja la imagen de {P}: el gobierno del {Par} pierde terreno en las encuestas', b:'Consultoras especializadas muestran una caída sostenida en la aprobación presidencial. El {Par} busca explicaciones internas.' },
      { source:'tendencias', h:'Las encuestas no mienten: {P} está perdiendo el apoyo popular 📊 #ImagenPresidencial', b:'' },
    ],
    danger: [
      { source:'cronista', h:'CRISIS DE GOBERNABILIDAD: la confianza en {P} toca el piso histórico bajo el {Par}', b:'Analistas políticos advierten que el nivel de aprobación presidencial no tiene precedentes modernos. La estabilidad política está en riesgo.' },
      { source:'tribuna',  h:'{P} ya no tiene respaldo popular: el gobierno del {Par} está políticamente exhausto', b:'"No hay mandato popular que aguante estos números. El gobierno de {P} debe escuchar o caer", señaló la oposición.' },
    ],
  },
};

// ── Reglas de pronóstico ──────────────────────────────────────
// condition(ind) → bool; se muestra si se cumple y no se mostró en los últimos cooldown turnos
export const FORECAST_RULES = [
  {
    id: 'fc_inflation_spiral',
    condition: (ind) => ind.ipc >= 50 && ind.deuda >= 45,
    cooldown: 4,
    forecastTag: '🚨 Crisis Financiera',
    source: 'cronista',
    h: '🔮 Economistas advierten sobre posible tormenta financiera en el corto plazo',
    b: 'Fuentes del ámbito académico y financiero señalan que la combinación de inflación alta y deuda creciente podría derivar en una crisis de mayor magnitud. "Los indicadores apuntan en la misma dirección", señaló un economista.',
  },
  {
    id: 'fc_social_unrest',
    condition: (ind) => ind.pobreza >= 40 && ind.desocupacion >= 14,
    cooldown: 3,
    forecastTag: '✊ Conflicto Social',
    source: 'foro',
    h: '🔮 Organizaciones sociales preparan movilización nacional: "La paciencia tiene límites"',
    b: '→ 892 respuestas | Hilo: "¿Se viene un estallido social? El hartazgo que ningún medio muestra en TV"',
  },
  {
    id: 'fc_labor_conflict',
    condition: (ind) => ind.confianza <= 45 && ind.desocupacion >= 12,
    cooldown: 4,
    forecastTag: '✊ Conflicto Laboral',
    source: 'tribuna',
    h: '🔮 Gremios advierten: si el gobierno de {P} no escucha, habrá medidas de fuerza',
    b: 'Confederaciones sindicales anticiparon que evaluarán acciones gremiales si el gobierno del {Par} no convoca a paritarias en los próximos días.',
  },
  {
    id: 'fc_currency_crisis',
    condition: (ind) => ind.reservas <= 40 && ind.riesgo >= 45,
    cooldown: 3,
    forecastTag: '💱 Política Cambiaria',
    source: 'tendencias',
    h: '🔮 ¿Se viene una devaluación? Todos los indicadores apuntan al mismo lado 💱📉 #DólarAR',
    b: '',
  },
  {
    id: 'fc_energy_crisis',
    condition: (ind) => ind.produccion <= 50 && ind.reservas <= 55,
    cooldown: 4,
    forecastTag: '⚡ Energía',
    source: 'cronista',
    h: '🔮 Expertos anticipan posibles problemas de abastecimiento energético en los próximos meses',
    b: 'Informes del sector advierten que la baja actividad industrial y las tensiones en la matriz energética podrían derivar en restricciones en el mediano plazo bajo el gobierno de {P}.',
  },
  {
    id: 'fc_fmi_pressure',
    condition: (ind) => ind.deuda >= 60,
    cooldown: 5,
    forecastTag: '🏦 FMI',
    source: 'cronista',
    h: '🔮 El FMI podría exigir nuevas condiciones al gobierno de {P} ante el aumento de la deuda',
    b: 'Fuentes diplomáticas indican que representantes del Fondo podrían solicitar una revisión del acuerdo vigente con el gobierno del {Par} en los próximos meses.',
  },
  {
    id: 'fc_corruption_probe',
    condition: (ind) => ind.confianza <= 40 && ind.riesgo >= 50,
    cooldown: 5,
    forecastTag: '🔴 Corrupción',
    source: 'tribuna',
    h: '🔮 Fiscales investigan nuevas irregularidades en el gobierno de {P}: fuentes judiciales',
    b: '"Hay expedientes activos", señalaron fuentes del Poder Judicial. La oposición pidió transparencia al {Par}.',
  },
  {
    id: 'fc_humanitarian',
    condition: (ind) => ind.pobreza >= 50,
    cooldown: 4,
    forecastTag: '🏥 Crisis Sanitaria Social',
    source: 'cronista',
    h: '🔮 Organizaciones humanitarias advierten sobre riesgo de crisis sanitaria vinculada a la pobreza',
    b: 'El nivel de pobreza alcanzado bajo el gobierno de {P} empieza a traducirse en indicadores de salud preocupantes, según un informe académico.',
  },
];

// ============================================================
// NOTICIAS INAUGURALES — Turno 1
// Personalizadas según herencia, tipo de mandato, VP y dificultad
// ============================================================

// {P}=apellido presidente  {Par}=partido  {VP}=nombre VP  {VPt}=título VP

/** Artículo 1 (Cronista): enfocado en la herencia recibida */
export const INAUGURAL_HERITAGE = {
  populista: [
    { h:'{P} asume entre vítores populares y señales de alerta macroeconómica', b:'El nuevo gobierno del {Par} recibe un país con alta popularidad pero con inflación desbocada y reservas al límite. Economistas piden "no derrochar el capital político".' },
    { h:'Euforia y déficit: {P} hereda un Estado generoso pero fiscalmente frágil', b:'El {Par} llega al poder con el respaldo de las calles, pero el equipo económico ya trabaja contra reloj ante la presión sobre el tipo de cambio.' },
    { h:'{P} recibe las llaves de un país enamorado de sí mismo pero con las cuentas en rojo', b:'Los festejos de anoche en la Plaza no alcanzaron para tapar la realidad: inflación en zona crítica y Banco Central con reservas negativas.' },
  ],
  ortodoxo: [
    { h:'{P} asume con las cuentas ordenadas pero con deuda social que no espera', b:'El gobierno del {Par} hereda una economía "sana en los papeles" pero con millones de familias al límite. La agenda social deberá ser prioritaria desde el primer día.' },
    { h:'Los mercados aplauden, la gente espera: el doble desafío del gobierno de {P}', b:'El Banco Central está capitalizado y el riesgo país es bajo gracias a la gestión anterior. Pero el índice de pobreza y el desempleo exigen respuesta urgente del {Par}.' },
    { h:'{P} hereda el mejor punto de partida financiero en años — y el peor social', b:'El {Par} tiene el lujo de gobernar con reservas sólidas. El problema es que afuera de las esferas financieras, la gente no llega a fin de mes.' },
  ],
  crisis: [
    { h:'{P} asume en situación de emergencia: "El país necesita unidad o se rompe"', b:'El nuevo gobierno del {Par} no tendrá luna de miel. Mercados paralelos, default técnico y una sociedad exhausta esperan la primera señal del presidente.' },
    { h:'Todo está en rojo: {P} hereda la peor situación en décadas', b:'Inflación disparada, reservas negativas y producción en colapso. Los analistas coinciden: el {Par} deberá tomar decisiones dolorosas desde el primer día.' },
    { h:'EDICIÓN ESPECIAL — {P} asume en el peor momento posible: "No vine a gobernar en bonanza"', b:'El presidente electo no tiene margen para el error. Cada decisión del {Par} en los primeros meses determinará si el país sale del abismo o se hunde más.' },
  ],
  estable: [
    { h:'{P} asume con la hoja en blanco: ni gran herencia ni gran crisis', b:'El {Par} llega al poder sin grandes problemas urgentes, pero también sin impulso. Analistas coinciden: "El partido se juega desde cero".' },
    { h:'Herencia neutra, agenda propia: {P} define su gestión desde el primer día', b:'El nuevo presidente del {Par} no podrá culpar a nadie de lo que hereda. Los indicadores están en zona media y el futuro depende exclusivamente de sus decisiones.' },
    { h:'{P} arranca en modo "papel en blanco": ni crisis ni bonanza en el punto de partida', b:'Un gobierno anterior sin logros ni desastres deja al {Par} en la situación más inusual: libertad total para definir el rumbo.' },
  ],
};

/** Artículo 2 (reacción): enfocado en el tipo de mandato */
export const INAUGURAL_MANDATE = {
  amplio: {
    voz: [
      { h:'¡Victoria histórica! {P} llega al poder con un mandato que no admite excusas', b:'La contundencia del resultado electoral le da al {Par} una legitimidad sin precedentes. "Tenemos el mandato para hacer los cambios que el país necesita", declaró {P} tras conocer los resultados.' },
      { h:'La gente habló fuerte y claro: {P} arranca con el viento a favor', b:'Un triunfo aplastante que le da al {Par} mayoría en el Congreso y apoyo popular difícil de ignorar. Los analistas hablan de "ventana de oportunidad histórica".' },
    ],
    tribuna: [
      { h:'La oposición advierte: el "mandato popular" de {P} no es cheque en blanco', b:'"Que hayan ganado por mucho no significa que puedan hacer cualquier cosa", señaló el principal referente opositor. "Los derechos no se votan".' },
      { h:'Ganaron, sí. Pero la realidad no los va a aplaudir: el desafío de {P} es enorme', b:'"El {Par} tiene el poder. Ahora tiene que demostrar que también tiene las ideas", desafió la oposición en conferencia de prensa.' },
    ],
    tendencias: [
      { h:'QUÉ PALIZA les metió {P} a todos 😭🗳️ El {Par} no para #EleccionesAR #VictoriaHistórica', b:'' },
    ],
  },
  coalicion: {
    voz: [
      { h:'La alianza que cambió todo: {P} y el {Par} demuestran que juntos se puede', b:'La coalición que armó {P} fue la clave de la victoria. "Somos distintos pero tenemos el mismo objetivo: un país mejor", afirmó el flamante presidente.' },
      { h:'{P} llega al poder al frente de una coalición inédita: el {Par} con todos', b:'Distintos partidos, una sola voz. La unidad electoral del {Par} fue la clave del triunfo según los analistas de la noche electoral.' },
    ],
    tribuna: [
      { h:'La coalición de {P} es un castillo de naipes: ¿cuánto aguantará?', b:'"Las alianzas se forman para ganar y se rompen para gobernar", advirtió el politólogo consultado por Tribuna Libre. El {Par} deberá gestionar tensiones internas desde el día uno.' },
      { h:'Analistas advierten: las coaliciones duran hasta la primera crisis de gobierno', b:'"Cuando lleguen las decisiones difíciles, veremos si el {Par} se mantiene unido o si cada partido tira para su lado", señaló el politólogo del Centro de Estudios.' },
    ],
    tendencias: [
      { h:'La coalición de {P} es rara pero funcionó 🤔 Veremos si gobiernan igual de unidos #ARG #Política', b:'' },
    ],
  },
  ajustado: {
    voz: [
      { h:'{P} ganó y eso es suficiente: "La mitad del país nos eligió y vamos a gobernar para todos"', b:'Desde el {Par} insistieron en que "el que ganó, ganó" y que la legitimidad del resultado no está en discusión. "El llamado a la unidad es sincero".' },
      { h:'Victoria ajustada pero victoria al fin: {P} se prepara para gobernar sin mayorías cómodas', b:'El {Par} deberá negociar cada decisión con la oposición. El estrecho margen electoral obliga a construir consensos permanentemente.' },
    ],
    tribuna: [
      { h:'Con menos del 50%, {P} gobernará un país partido al medio y en tensión', b:'"La mitad del país votó en contra. El {Par} no puede ignorar eso y pretender que tiene carta blanca", advirtió el bloque opositor al conocer los resultados definitivos.' },
      { h:'Un presidente sin mayoría: {P} y el desafío de gobernar con la mitad del país en contra', b:'El resultado más ajustado en años deja al {Par} sin margen de error. Cada decisión deberá ser negociada, explicada y justificada ante una sociedad dividida.' },
    ],
    tribuna_amarilla: [
      { h:'ESCÁNDALO: {P} ganó por apenas unos votos — ¿LEGÍTIMO? La oposición pide recuento', b:'Fuentes opositoras no reconocen el resultado y exigen auditoría total. El {Par} tilda las acusaciones de "maniobra desesperada". La tensión sube.' },
    ],
    tendencias: [
      { h:'Esto está re partido igual que el país 😬 {P} va a tener que convencer a MUCHA gente #EleccionesAR', b:'' },
    ],
  },
};

/** Artículo 3 (expectativas/encuesta): combinación VP + dificultad */
export const INAUGURAL_VP_EXPECT = {
  'vp-moreno': {
    facil:   [
      { source:'voz',    h:'La Dra. {VP} como {VPt}: "Vamos a reducir la pobreza a la mitad en cuatro años"', b:'La flamante vicepresidenta del {Par} llegó con promesas ambiciosas que entusiasmaron a las organizaciones sociales. El 74% de la ciudadanía apoya la agenda social de la dupla {P}-{VP}.' },
      { source:'foro',   h:'¡Por fin una vicepresidenta que habla de los pobres! {VP} le pone corazón al gobierno de {P}', b:'→ 567 respuestas | Hilo: "¿Qué esperamos del gobierno de {P} y la Dra. {VP}?"' },
    ],
    normal:  [
      { source:'cronista',h:'{VP} asume como {VPt} con agenda social ambiciosa: expectativas altas, recursos limitados', b:'La reconocida especialista social llegó al segundo cargo del país con el compromiso de hacer del bienestar ciudadano la prioridad del {Par}. Economistas piden "realismo sin abandono".' },
      { source:'tendencias',h:'La Dra. {VP} de {VPt} me da esperanza 🙏 Ojalá el {Par} la escuche #BienestarSocial #ARG', b:'' },
    ],
    dificil: [
      { source:'tribuna', h:'Promesas de {VP} como {VPt}: buenas intenciones que chocaron contra la realidad en otros gobiernos', b:'"Todos los vicepresidentes sociales del mundo prometieron lo mismo", advierte el editorialista. "El {Par} deberá explicar de dónde sale el dinero para financiar la agenda de {VP}".' },
      { source:'cronista', h:'Encuesta: solo el 38% cree que {P} y {VP} podrán cumplir las promesas sociales en 4 años', b:'La dificultad del contexto y la herencia recibida generan escepticismo. Especialistas señalan que las metas de la {VPt} {VP} "son aspiracionales pero tienen bajo correlato presupuestario".' },
    ],
    ultra: [
      { source:'cronista', h:'¿Qué es una vicepresidenta con perfil social? {VP} explica su rol en el gobierno de {P}', b:'La nueva {VPt} explicó que su función será "articular las políticas sociales del {Par} y ser la voz de los sectores más vulnerables dentro del Ejecutivo". El rol constitucional incluye presidir el Senado.' },
    ],
  },
  'vp-fuentes': {
    facil:   [
      { source:'voz',    h:'Los mercados festejan: el Dr. {VP} como {VPt} es la señal que el sector privado esperaba', b:'El perfil fiscal del vicepresidente tranquilizó a inversores y acreedores. Los bonos soberanos subieron en la apertura. "El {Par} entiende la economía", señaló una gestora internacional.' },
      { source:'tendencias', h:'El Dr. {VP} como {VPt} y los mercados ya re contentos 📈 Veamos si también ayuda a la gente #EconomíaAR', b:'' },
    ],
    normal:  [
      { source:'cronista', h:'Dr. {VP} como {VPt}: los mercados celebran, los economistas sociales advierten', b:'La designación del exbanquero central genera entusiasmo en el sector financiero pero preocupación en las organizaciones sociales. "El {Par} deberá equilibrar austeridad y bienestar", señalan analistas.' },
      { source:'foro', h:'Que sea del Banco Central no me garantiza que entienda lo que pasa en la calle. A ver, {VP}...', b:'→ 289 respuestas | Hilo: "El perfil económico del gobierno de {P}: ¿qué esperar?"' },
    ],
    dificil: [
      { source:'tribuna', h:'{VP} como {VPt}: el {Par} elige los mercados antes que la gente', b:'"La designación de un exbanquero central como segundo del país dice todo sobre las prioridades del {Par}", señaló la coalición opositora. "Ajuste y más ajuste".' },
      { source:'cronista', h:'Encuesta: el 55% desconfía del perfil "demasiado financiero" del {VPt} {VP}', b:'Una mayoría ciudadana reconoce la experiencia de {VP} pero teme que su enfoque privilegie la estabilidad macroeconómica sobre el bienestar popular.' },
    ],
    ultra: [
      { source:'cronista', h:'¿Qué hace un {VPt} con perfil fiscal? {VP} y su rol en el gobierno de {P}', b:'El nuevo {VPt} explicó que trabajará para "garantizar la sostenibilidad de las cuentas públicas como condición para cualquier política social". El Banco Central seguirá de cerca sus movimientos.' },
    ],
  },
  'vp-castillo': {
    facil:   [
      { source:'voz',    h:'Ing. {VP} como {VPt}: "Vamos a industrializar el país de verdad, no de boca para afuera"', b:'La flamante vicepresidenta del {Par} llegó con planes concretos para reactivar la industria nacional. El sector manufacturero celebra el nombramiento.' },
      { source:'tendencias', h:'La Ing. {VP} tiene un CV impresionante 💪 Espero que el {Par} la deje hacer #IndustriaAR', b:'' },
    ],
    normal:  [
      { source:'cronista', h:'Ing. {VP} como {VPt}: perfil productivista con agenda de exportaciones y empleo industrial', b:'La exdirectora de parques industriales lleva al segundo cargo del país una visión pragmática y orientada a resultados. El sector de pymes ve con buenos ojos la designación.' },
      { source:'foro', h:'La Ing. {VP} como {VPt} me parece una muy buena señal para el sector industrial. A ver si se puede.', b:'→ 234 respuestas | Hilo: "¿Reactivación industrial bajo el gobierno de {P}?"' },
    ],
    dificil: [
      { source:'tribuna', h:'{VP} como {VPt}: planes de industria que nunca llegan a los trabajadores reales', b:'"Los parques industriales que construyó solo beneficiaron a grandes empresas. El {Par} elige nuevamente a los de arriba", acusó la oposición al conocer el nombramiento.' },
      { source:'cronista', h:'Encuesta: el 47% duda de que el enfoque "tecnocrático" del {VPt} {VP} resuelva los problemas de fondo', b:'Ciudadanos consultados reconocen el perfil técnico de {VP} pero señalan que "los problemas del país no son de ingeniería sino de distribución".' },
    ],
    ultra: [
      { source:'cronista', h:'¿Qué es una vicepresidenta tecnocrática? {VP} explica su visión de gobierno para el {Par}', b:'La nueva {VPt} aclaró que su rol será "traducir los datos técnicos en políticas públicas concretas" y que trabajará codo a codo con los ministerios de economía y producción.' },
    ],
  },
  'vp-vargas': {
    facil:   [
      { source:'voz',    h:'El Dr. {VP} como {VPt}: "Vamos a terminar con la grieta que destruye al país"', b:'El reconocido diplomático llegó al segundo cargo con un mensaje que emocionó a muchos: "El diálogo es el único camino". El 71% apoya su perfil conciliador.' },
      { source:'tendencias', h:'El Dr. {VP} como {VPt} es exactamente lo que necesitamos 🕊️ Basta de peleas #DiálogoARG', b:'' },
    ],
    normal:  [
      { source:'cronista', h:'Dr. {VP} como {VPt}: el perfil dialoguista que el {Par} necesitaba para construir consensos', b:'El exembajador y mediador de crisis constitucionales aporta una dimensión institucional que el gobierno de {P} necesitará para navegar los conflictos que se avecinan.' },
      { source:'foro', h:'El Dr. {VP} como {VPt} me parece bien, pero diálogo solo no alcanza. Necesitamos resultados concretos.', b:'→ 312 respuestas | Hilo: "¿Puede el gobierno de {P} bajar la temperatura política del país?"' },
    ],
    dificil: [
      { source:'tribuna', h:'{VP} como {VPt}: el {Par} elige imagen conciliadora para tapar decisiones difíciles', b:'"El diálogo es el escudo perfecto: mientras {VP} habla de paz, el {Par} toma medidas que afectan al pueblo", advirtió la principal referente opositora.' },
      { source:'cronista', h:'Encuesta: el 52% valora a {VP} pero solo el 29% cree que el "diálogo" resolverá la crisis', b:'Ciudadanos consultados reconocen el talento negociador del {VPt} pero señalan que "los problemas son estructurales, no de relaciones públicas".' },
    ],
    ultra: [
      { source:'cronista', h:'¿Qué hace un {VPt} dialoguista? {VP} explica su rol en el gobierno de {P}', b:'El nuevo {VPt} explicó que su misión será "construir los puentes políticos que el Ejecutivo necesita para gobernar en un contexto de alta polarización". También presidirá el Senado.' },
    ],
  },
};

/**
 * Devuelve el número de aprobación inaugural según mandato y dificultad.
 * @param {'amplio'|'coalicion'|'ajustado'} mandate
 * @param {'easy'|'normal'|'hard'|'ultra'} difficulty
 * @returns {number} porcentaje 0-100
 */
export function getInauguralApproval(mandate, difficulty) {
  const base = { amplio: 72, coalicion: 61, ajustado: 47 }[mandate] ?? 55;
  // Ultra: aprobación inaugural devastada (-22 pts)
  const mod  = { easy: 8, normal: 0, hard: -10, ultra: -22 }[difficulty] ?? 0;
  return Math.min(95, Math.max(25, base + mod));
}
