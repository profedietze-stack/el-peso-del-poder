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
        { h:'{P} escucha a los que más sufren: el {Par} prioriza lo humano', b:'Desde el gobierno remarcaron que la medida busca "poner en el centro a las personas y no a los números".' },
        { h:'Justicia social en acción: el {Par} cumple su promesa con los sectores vulnerables', b:'Organizaciones barriales y gremiales reconocieron el esfuerzo del gobierno de {P} por atender las demandas populares.' },
      ],
      negative: [
        { h:'{P} escucha al pueblo: el {Par} promete soluciones concretas en días', b:'Desde el gobierno remarcaron que trabajan "incansablemente" para mejorar las condiciones de la población más afectada.' },
        { h:'El {Par} reconoce el malestar y trabaja: {P} pide paciencia a la ciudadanía', b:'El ejecutivo pidió "tiempo y confianza" para revertir una situación social que "no se generó de un día para el otro".' },
        { h:'{P} no abandona a nadie: el {Par} presentará un plan de contención social esta semana', b:'Fuentes del ejecutivo adelantaron medidas de alivio para los sectores más golpeados por la última decisión.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'La oposición alerta: las medidas sociales del {Par} son asistencialismo sin futuro', b:'Referentes de la oposición señalaron que el gobierno de {P} "da pescado en lugar de enseñar a pescar".' },
        { h:'Oposición: el {Par} usa la asistencia social para comprar votos', b:'"La política social de {P} es clientelismo electoral disfrazado de solidaridad", señaló el principal referente opositor.' },
        { h:'El bloque opositor advierte: las medidas de {P} son insostenibles fiscalmente', b:'"El {Par} anuncia medidas que no puede pagar. El ajuste lo van a pagar los más pobres mañana", advirtieron legisladores opositores.' },
      ],
      negative: [
        { h:'Escándalo social: {P} abandona a los más pobres según informe de la oposición', b:'"El gobierno del {Par} ha dejado sola a la gente que más necesita del Estado", afirmó el diputado opositor.' },
        { h:'La crisis social se profundiza: el {Par} sin respuestas concretas para la gente', b:'Un informe de ONGs y organizaciones comunitarias documentó el deterioro de las condiciones de vida bajo la gestión de {P}.' },
        { h:'Oposición presenta proyecto de emergencia social ante la inacción del {Par}', b:'"No podemos esperar más. La gente se está cayendo del sistema y el gobierno de {P} mira para otro lado."' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Algo hizo bien {P} esta vez! Que sigan así 👏 #PolíticaSocial #ARG', b:'' },
        { h:'Llorando de emoción con lo que anunció {P} 😢 Por fin alguien piensa en nosotros #ARG', b:'' },
        { h:'El {Par} hizo algo bueno hoy. Anótenlo en el calendario 📅 #PolíticaSocial', b:'' },
      ],
      negative: [
        { h:'Los trabajadores están solos con este gobierno del {Par} 😤 #HuelgaGeneral #ARG', b:'' },
        { h:'Otra vez los más pobres pagando los errores del gobierno de {P} 😡 #JusticiaSocial', b:'' },
        { h:'Me duele ver lo que hace el {Par} con la gente más vulnerable 💔 #Argentina', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'En mi barrio se nota el cambio desde que el {Par} implementó esto. Gracias {P}.', b:'→ 345 respuestas | Hilo: "Impacto social de las políticas de {P}"' },
        { h:'Mamá me llama llorando de contenta por la medida de {P}. Eso es todo lo que necesito saber.', b:'→ 412 respuestas | Hilo: "Historias reales: cómo afecta la política social del {Par}"' },
        { h:'Trabajo en un comedor comunitario y esto cambia mucho la realidad cotidiana. Gracias {P}.', b:'→ 278 respuestas | Hilo: "Medidas sociales del {Par}: impacto en el territorio"' },
      ],
      negative: [
        { h:'Sigo esperando que las políticas del {Par} lleguen al interior. Capital siempre primero.', b:'→ 298 respuestas | Hilo: "¿El gobierno de {P} ignora el interior del país?"' },
        { h:'Tercera semana sin cobrar y el {Par} habla de recuperación. ¿De qué recuperación hablan?', b:'→ 567 respuestas | Hilo: "La situación social real bajo el gobierno de {P}"' },
        { h:'Mi vecina tiene 3 hijos y no llega a fin de mes. Eso es lo que vale lo que promete el {Par}.', b:'→ 389 respuestas | Hilo: "Testimonios: el impacto social de las decisiones de {P}"' },
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
      positive: [
        { h:'{P} cuida nuestra salud: el {Par} invierte en el futuro del sistema sanitario', b:'Desde el ministerio recordaron que "en este gobierno, la salud pública no es un gasto sino una inversión".' },
        { h:'El {Par} defiende la salud pública: {P} garantiza acceso para todos', b:'El ejecutivo reforzó el presupuesto sanitario y prometió que "ningún argentino quedará sin atención por falta de recursos".' },
        { h:'{P} atiende la salud del pueblo: el {Par} prioriza el sistema público sobre el privado', b:'Desde el gobierno remarcaron el compromiso con una salud pública de calidad como "derecho y no privilegio".' },
      ],
      negative: [
        { h:'{P} enfrenta la crisis sanitaria: el {Par} no baja los brazos', b:'El ejecutivo prometió soluciones concretas "en el marco de las restricciones presupuestarias heredadas".' },
        { h:'El {Par} trabaja para resolver la crisis de salud: {P} convoca a emergencia sanitaria', b:'El gobierno declaró emergencia en el sistema de salud y prometió medidas de refuerzo para hospitales públicos.' },
        { h:'{P} pide calma: el {Par} promete que la situación sanitaria está siendo atendida', b:'Fuentes del ministerio aseguraron que trabajan "con todos los recursos disponibles para garantizar la atención".' },
      ],
    },
    tribuna: {
      positive: [
        { h:'Oposición: la inversión en salud de {P} llega tarde y es insuficiente', b:'"Necesitábamos esto hace dos años", señaló un legislador de la oposición. El {Par} no tuvo respuesta inmediata.' },
        { h:'El bloque opositor: "lo de {P} en salud es bienvenido, pero el sistema sigue roto"', b:'"Parchar un sistema que necesita reforma estructural no alcanza. El {Par} tiene que ir al fondo del problema."' },
        { h:'Oposición pide auditoría del presupuesto de salud bajo el {Par}', b:'"¿A dónde fueron los fondos sanitarios del gobierno de {P}? Necesitamos rendición de cuentas", exigió el bloque opositor.' },
      ],
      negative: [
        { h:'Catástrofe sanitaria: {P} deja a los ciudadanos sin cobertura médica adecuada', b:'"Lo que está haciendo el gobierno de {P} es negligencia institucional ante la crisis", acusó la oposición.' },
        { h:'La oposición exige intervención del Congreso ante el colapso sanitario bajo el {Par}', b:'"No podemos esperar más. El sistema de salud bajo {P} está al borde del colapso total."' },
        { h:'Oposición: "los recortes en salud del {Par} cuestan vidas"', b:'"Hay listas de espera de meses para tratamientos urgentes. El gobierno de {P} tiene responsabilidad directa."' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Por fin el gobierno de {P} hizo algo por la salud! 🏥💊 #SaludPública #ARG', b:'' },
        { h:'Mi mamá pudo operarse gracias a la política del {Par}. Que sigan así 🏥🙏 #Salud', b:'' },
        { h:'Buen movimiento del {Par} en salud. Los médicos lo estaban pidiendo hace meses 👨‍⚕️👏', b:'' },
      ],
      negative: [
        { h:'Hospitales colapsados y el {Par} mirando para otro lado 🤦 #CrisisSanitaria', b:'' },
        { h:'Mi papá esperó 8 horas en urgencias. Esto es el sistema de salud del gobierno de {P} 😡', b:'' },
        { h:'Sin medicamentos básicos en el hospital público. ¿Qué hace el {Par} con el presupuesto?😤', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Mi familia pudo atenderse gracias a la nueva política del {Par}. Muy agradecidos.', b:'→ 156 respuestas | Hilo: "Experiencias con el sistema de salud público"' },
        { h:'Soy enfermero y por primera vez en años tenemos los insumos que necesitamos. Gracias {P}.', b:'→ 289 respuestas | Hilo: "Personal de salud evalúa las medidas del {Par}"' },
        { h:'Le dieron turno a mi abuela para la operación que esperaba hace un año. El {Par} reaccionó.', b:'→ 198 respuestas | Hilo: "Mejoras en el sistema de salud bajo el gobierno de {P}"' },
      ],
      negative: [
        { h:'4 horas de espera en urgencias. ¿Alguien le avisa a {P} que la salud pública está en crisis?', b:'→ 478 respuestas | Hilo: "Estado real del sistema sanitario - testimonios"' },
        { h:'Médica de hospital público. Trabajo con un estetoscopio roto porque el {Par} no manda insumos.', b:'→ 634 respuestas | Hilo: "Médicos denuncian el estado del sistema de salud bajo {P}"' },
        { h:'Mi hermano murió esperando una cama en terapia intensiva. Esto es lo que hace el gobierno del {Par}.', b:'→ 1.4k respuestas | Hilo: "Crisis sanitaria — testimonios que el gobierno de {P} no puede ignorar"' },
      ],
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
      positive: [
        { h:'El {Par} construye el futuro: {P} invierte en educación como nunca antes', b:'El ministerio de educación publicó datos que muestran un aumento del 30% en la inversión durante la gestión {Par}.' },
        { h:'{P} defiende la escuela pública: el {Par} prioriza la educación de los más chicos', b:'Desde el gobierno señalaron que ningún recorte afectará a las escuelas y universidades del país.' },
        { h:'El {Par} lleva la educación al siglo XXI: {P} anuncia plan de conectividad escolar', b:'El ejecutivo presentó un ambicioso programa de equipamiento e infraestructura educativa para los próximos años.' },
      ],
      negative: [
        { h:'{P} entiende a los docentes: el {Par} busca soluciones a la crisis educativa', b:'El gobierno nacional anunció nuevas mesas de diálogo con los gremios para desactivar el conflicto educativo.' },
        { h:'El gobierno de {P} promete resolver la crisis educativa: el {Par} convoca a mesa de emergencia', b:'Fuentes del ministerio confirmaron reuniones de urgencia con las federaciones docentes tras el fracaso de las negociaciones.' },
        { h:'{P} pide a los docentes que vuelvan a las aulas mientras el {Par} busca salida', b:'El ejecutivo apeló al sentido de responsabilidad de los gremios. "Los alumnos no pueden seguir pagando el costo de esta disputa."' },
      ],
    },
    tribuna: {
      positive: [
        { h:'Oposición: el acuerdo educativo de {P} es solo un parche electoral del {Par}', b:'"Resuelven lo urgente sin atacar lo estructural", afirmó la diputada opositora en sesión ordinaria.' },
        { h:'Legisladores opositores: "el {Par} gasta en educación cuando le conviene, no cuando se necesita"', b:'El bloque opositor cuestionó los tiempos del anuncio y señaló que llega "forzado por la presión gremial".' },
        { h:'Oposición exige auditoría de los fondos educativos del {Par}', b:'"¿A dónde va el dinero? {P} tiene que explicar en qué se usa el presupuesto educativo", exigió el bloque opositor.' },
      ],
      negative: [
        { h:'El {Par} rompe la educación pública: {P} abandona a docentes y alumnos', b:'La coalición opositora presentó un proyecto de interpelación al ministro de educación del gobierno de {P}.' },
        { h:'Oposición: la crisis educativa bajo {P} es la peor en décadas', b:'"Los indicadores de abandono escolar y la conflictividad docente muestran el fracaso del {Par} en esta área."' },
        { h:'El bloque opositor pide la renuncia del ministro de educación del gobierno de {P}', b:'"Alguien tiene que hacerse cargo de esta catástrofe educativa que el {Par} generó", exigieron legisladores.' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Por fin los chicos vuelven a clases! Gracias {P} 🎓 #EducaciónAR #Docentes', b:'' },
        { h:'Me emocioné viendo a los chicos entrar a la escuela hoy 😭 Gracias {Par} #EducaciónAR', b:'' },
        { h:'Qué buen gesto el de {P} con la educación. Ojalá se mantenga 📚 #Docentes #ARG', b:'' },
      ],
      negative: [
        { h:'Sin clases otra vez por culpa del {Par} 😡 Mis hijos pierden el año #EducaciónEnCrisis', b:'' },
        { h:'El gobierno de {P} arruinó la educación pública 📚😤 #HuelgaDocente #ARG', b:'' },
        { h:'Cómo puede el {Par} fallarles a los chicos así?? Vergüenza 🎒 #SinClases', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'El acuerdo docente bajo {P} fue más rápido que en los últimos años. Hay que reconocerlo.', b:'→ 203 respuestas | Hilo: "¿Cómo fue la paritaria docente de este año?"' },
        { h:'Soy maestra y me alegra que {P} haya escuchado este año. Volvemos contentos.', b:'→ 156 respuestas | Hilo: "Docentes opinan sobre el acuerdo paritario"' },
        { h:'La medida del {Par} llegó tarde pero llegó. Por los chicos, bien que volvemos.', b:'→ 312 respuestas | Hilo: "Fin del conflicto educativo: análisis"' },
      ],
      negative: [
        { h:'Tercera semana sin clases. El {Par} no tiene idea de cómo gestionar educación.', b:'→ 534 respuestas | Hilo: "Huelga docente: ¿quién tiene razón?"' },
        { h:'Soy padre de dos nenes y estoy desesperado. El {Par} no resuelve nada.', b:'→ 445 respuestas | Hilo: "Padres afectados por la huelga docente"' },
        { h:'Veinte años de docente y nunca vi al gobierno del {Par} tan lejos de la realidad del aula.', b:'→ 287 respuestas | Hilo: "Docentes sobre el gobierno de {P}: testimonios"' },
      ],
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
      positive: [
        { h:'{P} limpia su gobierno: el {Par} demuestra que la ética pública no es negociable', b:'Allegados al Ejecutivo remarcaron que la decisión de {P} demuestra "carácter y compromiso con la República".' },
        { h:'El {Par} actúa con transparencia: {P} muestra tolerancia cero ante los irregulares', b:'El gobierno destacó que "quien no cumple los estándares éticos no tiene lugar en este proyecto".' },
        { h:'{P} con la ética por delante: el {Par} marca diferencia con los gobiernos anteriores', b:'Desde el ejecutivo recordaron los escándalos del pasado para contrastar con la "firmeza republicana" actual.' },
      ],
      negative: [
        { h:'{P} denuncia persecución: el {Par} califica las acusaciones de operación política', b:'El gobierno del {Par} señaló que la investigación es "una maniobra para desestabilizar al gobierno legítimo".' },
        { h:'El {Par} intenta contener el escándalo: {P} pide esperar a la Justicia', b:'Desde el gobierno pidieron "no prejuzgar" y prometieron cooperar con la investigación judicial.' },
        { h:'{P} sale al cruce de las acusaciones: el {Par} dice que hay una campaña en su contra', b:'El ejecutivo convocó a una conferencia de prensa para refutar las acusaciones que "buscan desestabilizar al gobierno".' },
      ],
    },
    tribuna: {
      positive: [
        { h:'La oposición celebra pero advierte: el daño institucional ya está hecho bajo el {Par}', b:'"Que {P} haya actuado no borra que lo permitió durante meses", afirmó el jefe de la oposición.' },
        { h:'Oposición: "bien que {P} actúe, pero el {Par} ya perdió credibilidad moral"', b:'"Una swallow no hace verano. Necesitamos ver un cambio de cultura institucional, no gestos aislados."' },
        { h:'El bloque opositor pide comisión investigadora independiente para el caso', b:'"La Justicia por sí sola no alcanza. El Congreso tiene que fiscalizar a fondo al gobierno del {Par}."' },
      ],
      negative: [
        { h:'Indignación nacional: el gobierno del {Par} se niega a rendir cuentas', b:'Multitudinarias marchas en las principales ciudades exigen la renuncia de {P} ante el escándalo que salpica al ejecutivo.' },
        { h:'La oposición exige auditoría completa de la gestión del {Par} ante el escándalo', b:'"No pueden esconder más la basura bajo la alfombra. {P} tiene que dar la cara ante la ciudadanía."' },
        { h:'El bloque opositor: "el gobierno de {P} es el más corrupto de los últimos 20 años"', b:'Referentes opositores presentaron documentación que vincularía a funcionarios del {Par} con irregularidades graves.' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Bien {P}! Por fin alguien que actúa ante la corrupción 👏 #AntiCorrupción #ARG', b:'' },
        { h:'Me sorprendió que el {Par} actuara así. Por fin! 💪 #Transparencia #ARG', b:'' },
        { h:'Ojalá todos los gobiernos tuvieran la valentía que tuvo {P} hoy 🙏 #AntiCorrupción', b:'' },
      ],
      negative: [
        { h:'El {Par} corrompido hasta los huesos 🤢 Esto no da para más #Renuncia{P}', b:'' },
        { h:'Qué asco me da este gobierno. El {Par} es una vergüenza nacional 😡 #Corrupción', b:'' },
        { h:'Primero prometieron luchar contra la corrupción y ahora esto. {Par} hipócritas 🤮', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Primera vez que veo a un gobierno actuar de verdad ante la corrupción. Apoyar a {P} en esto.', b:'→ 445 respuestas | Hilo: "¿Cómo debe el gobierno manejar los escándalos internos?"' },
        { h:'No soy fan del {Par} pero hay que aplaudir que {P} no protegió a los corruptos.', b:'→ 312 respuestas | Hilo: "Ética pública: ¿el gobierno de {P} marca diferencia?"' },
        { h:'Que haya consecuencias para los funcionarios corruptos del {Par} es una novedad bienvenida.', b:'→ 521 respuestas | Hilo: "Tolerancia cero a la corrupción: ¿realidad o marketing?"' },
      ],
      negative: [
        { h:'Todos los políticos son iguales. El {Par} prometió cambio y es más de lo mismo.', b:'→ 789 respuestas | Hilo: "Corrupción estructural: ¿tiene solución?"' },
        { h:'Hay gente en prisión por menos que lo que hicieron los del {Par}. Doble estándar total.', b:'→ 634 respuestas | Hilo: "¿La Justicia llega igual a todos bajo el gobierno de {P}?"' },
        { h:'Seguimos esperando que algún corrupto del {Par} vaya preso de verdad. {P} tiene que actuar.', b:'→ 876 respuestas | Hilo: "Impunidad: el gran pendiente del gobierno de {P}"' },
      ],
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
      positive: [
        { h:'El {Par} con los productores: {P} apuesta al campo como motor del país', b:'Desde el gobierno remarcaron que el sector agropecuario es "un aliado estratégico del modelo productivo" del {Par}.' },
        { h:'{P} abre el diálogo con el campo: el {Par} reconoce al agro como motor de divisas', b:'El ejecutivo anunció mesas de trabajo con las principales cámaras rurales para diseñar políticas de largo plazo.' },
        { h:'El {Par} entiende al campo: {P} premia a los productores que apuestan al país', b:'Desde el ministerio de agricultura señalaron que la medida busca "reconocer el esfuerzo de quienes generan los dólares del país".' },
      ],
      negative: [
        { h:'El gobierno de {P} tiene un plan para el campo: el {Par} promete nuevas medidas', b:'Fuentes del ministerio de agricultura adelantaron compensaciones para los productores más afectados en los próximos días.' },
        { h:'{P} pide al campo paciencia: el {Par} trabaja en alternativas para el sector', b:'El ejecutivo reconoció las dificultades del sector y prometió una respuesta integral "antes de que termine el trimestre".' },
        { h:'El {Par} busca acercar posiciones con el campo: {P} anuncia mesa de diálogo sectorial', b:'Tras semanas de tensión, el gobierno convocó a los principales referentes del agro a una reunión en Casa Rosada.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'Oposición: las medidas para el campo del {Par} llegan tarde y son insuficientes', b:'"Hace meses que pedimos esto desde el Congreso y recién ahora lo escuchan", señaló el diputado opositor.' },
        { h:'El bloque opositor: "el {Par} descubrió al campo solo para las elecciones"', b:'"Cuatro años ignorando al agro y ahora promesas. El campo no es tonto", señaló el diputado opositor por Santa Fe.' },
        { h:'Oposición advierte: las medidas del {Par} para el campo no alcanzan para revertir el daño', b:'"Los productores necesitan certezas, no anuncios. El gobierno de {P} da señales contradictorias."' },
      ],
      negative: [
        { h:'El {Par} asfixia al campo: el sector que genera las divisas del país, acorralado', b:'"El gobierno de {P} no entiende al agro o directamente lo odia", fue la dura frase del presidente de la Sociedad Rural.' },
        { h:'La oposición con el campo: "{P} está destruyendo la principal fuente de divisas del país"', b:'Legisladores del interior exigen una sesión especial para tratar la situación del sector agropecuario.' },
        { h:'Oposición califica la política agraria del {Par} de "confiscatoria e irresponsable"', b:'Un informe opositor calcula que el sector perdió miles de millones de dólares en exportaciones por las trabas del gobierno de {P}.' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Buena noticia para el campo! El {Par} finalmente escuchó 🌾 #Agro #ARG', b:'' },
        { h:'Soy del interior y esto me cambia la vida. Gracias {P} por escuchar al campo 🌾🙏', b:'' },
        { h:'El {Par} hace algo bien con el campo. Anótenlo. 📝 #Agro #ProductoresAR', b:'' },
      ],
      negative: [
        { h:'El campo está podrido del gobierno de {P} 🌾😡 #LasRetencionesMatan', b:'' },
        { h:'Mi familia lleva 50 años en el campo y nunca lo vimos tan mal por culpa del {Par} 😢', b:'' },
        { h:'El gobierno de {P} le pone palos en la rueda al campo cada semana 🌾😤 #AgroAR', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Soy productor en el interior y la medida de {P} nos va a ayudar bastante. Al menos es algo.', b:'→ 167 respuestas | Hilo: "Impacto de las medidas agropecuarias en el interior"' },
        { h:'Cuatro años esperando que el {Par} hiciera algo así. {P} finalmente reaccionó.', b:'→ 223 respuestas | Hilo: "¿El gobierno de {P} da vuelta la relación con el campo?"' },
        { h:'Pequeño productor sojero de Córdoba. Esto que hizo {P} nos saca un peso de encima.', b:'→ 189 respuestas | Hilo: "Productores del interior opinan sobre la medida del {Par}"' },
      ],
      negative: [
        { h:'Tres generaciones en el campo y nunca vi políticas tan malas como las del {Par}.', b:'→ 321 respuestas | Hilo: "¿El gobierno de {P} destruye el campo?"' },
        { h:'Tuve que despedir a 8 empleados rurales por las medidas del {Par}. Una vergüenza.', b:'→ 456 respuestas | Hilo: "Testimonios: el campo bajo el gobierno de {P}"' },
        { h:'El {Par} no entiende que sin campo no hay reservas ni dólares. {P} que despierte.', b:'→ 534 respuestas | Hilo: "Crisis del agro: ¿quién tiene la culpa?"' },
      ],
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
      positive: [
        { h:'{P} asegura la energía para todos: el {Par} da un paso histórico', b:'El ministerio destacó que "la energía es un derecho, no un privilegio" y que el gobierno trabaja para garantizarla.' },
        { h:'El {Par} invierte en energía limpia: {P} apunta a la soberanía energética', b:'El gobierno presentó un ambicioso plan de inversión en renovables. "El futuro energético del país se construye hoy."' },
        { h:'{P} garantiza el suministro energético para el invierno: el {Par} actúa antes de la crisis', b:'Las medidas del ejecutivo lograron estabilizar el sistema eléctrico antes de que comenzara el pico de demanda invernal.' },
      ],
      negative: [
        { h:'El {Par} trabaja sin descanso para resolver la crisis: {P} promete luz para todos', b:'Fuentes del ejecutivo aseguraron que la situación energética está "bajo control y mejorando gradualmente".' },
        { h:'{P} pide calma ante los cortes: el {Par} promete solución estructural en 60 días', b:'El ejecutivo convocó a una mesa de emergencia energética y prometió medidas concretas "en un plazo perentorio".' },
        { h:'El gobierno del {Par} reconoce la crisis energética y promete plan urgente de infraestructura', b:'Fuentes del ministerio de energía adelantaron inversiones en transmisión y generación para evitar nuevos cortes.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'La oposición advierte: la solución energética de {P} es cara y no resuelve el fondo', b:'"Estamos pagando caro por los errores del {Par} en política energética", señaló la oposición en sesión especial.' },
        { h:'Oposición cuestiona el costo de la energía bajo {P}: "el ciudadano paga la factura de la ineficiencia del {Par}"', b:'Un informe opositor muestra que las tarifas energéticas aumentaron por encima de la inflación durante la gestión de {P}.' },
        { h:'El bloque opositor: "el plan energético del {Par} es un parche que no resuelve el problema de fondo"', b:'"Necesitamos una política de Estado en energía, no anuncios de {P} cada vez que hay un apagón."' },
      ],
      negative: [
        { h:'El {Par} apaga al país: {P} lleva a la Argentina a la oscuridad', b:'"Este gobierno no tiene plan energético. Improvisa un apagón tras otro", afirmó el candidato opositor.' },
        { h:'Oposición exige auditoría del sistema energético: "el {Par} descapitalizó el sector"', b:'"Los cortes de luz son la consecuencia de años de desinversión energética bajo el gobierno de {P}."' },
        { h:'La coalición opositora: "la crisis energética bajo {P} es la peor desde el corralito"', b:'Legisladores opositores presentaron un proyecto para crear una comisión de investigación del sector energético.' },
      ],
    },
    tendencias: {
      positive: [
        { h:'El plan energético de {P} no es tan malo 🤔 Veamos cómo sigue #EnergíaAR', b:'' },
        { h:'Volvió la luz y el gas! El {Par} cumplió con la energía esta vez 💡🙏 #EnergíaAR', b:'' },
        { h:'Algo hizo bien {P} con la energía. Le doy el beneficio de la duda 🤷 #EnergíaNacional', b:'' },
      ],
      negative: [
        { h:'Otra vez sin luz 😤 El gobierno de {P} no puede con la crisis energética #Apagones', b:'' },
        { h:'Cuatro horas sin luz en pleno invierno por culpa del {Par} 🕯️ #ApagonesARG', b:'' },
        { h:'La industria parada por culpa de los cortes del gobierno de {P} 😡 #CrisisEnergética', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'En mi zona volvió el gas y la presión mejoró. Algo hicieron bien desde el {Par}.', b:'→ 112 respuestas | Hilo: "¿Cómo está la energía en tu ciudad?"' },
        { h:'Primer invierno sin cortes desde que tengo memoria. {P} hizo algo bien con la energía.', b:'→ 234 respuestas | Hilo: "Balance energético de la gestión {Par}: voces del interior"' },
        { h:'La tarifa subió pero al menos hay suministro. El {Par} hizo lo posible con la herencia que recibió.', b:'→ 189 respuestas | Hilo: "Energía en Argentina: ¿quién tiene la culpa?"' },
      ],
      negative: [
        { h:'Tercer corte de luz esta semana. {P} y el {Par} que expliquen esta infraestructura.', b:'→ 389 respuestas | Hilo: "Crisis energética: testimonios de todo el país"' },
        { h:'Se me arruinó la heladera por los cortes del {Par}. ¿Quién me paga los daños?', b:'→ 567 respuestas | Hilo: "Daños por cortes de luz bajo el gobierno de {P}: ¿hay reclamo posible?"' },
        { h:'Pequeño comerciante. Cada corte me cuesta miles. El {Par} no entiende la realidad.', b:'→ 445 respuestas | Hilo: "Crisis energética: impacto en comercios y pymes"' },
      ],
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
      positive: [
        { h:'{P} defiende nuestro ambiente: el {Par} lidera la transición ecológica nacional', b:'El gobierno anunció nuevas áreas naturales protegidas y compromisos de reducción de emisiones bajo la gestión de {P}.' },
        { h:'El {Par} con el planeta: {P} firma compromisos históricos de protección ambiental', b:'El ejecutivo se comprometió con los objetivos climáticos más ambiciosos que se hayan asumido en el país.' },
        { h:'{P} actúa ante la emergencia: el {Par} moviliza recursos para proteger el ambiente', b:'El gobierno declaró la emergencia ambiental y afectó recursos extraordinarios para hacer frente a la crisis.' },
      ],
      negative: [
        { h:'El gobierno de {P} trabaja para proteger a los afectados: el {Par} en el territorio', b:'Equipos del ministerio de ambiente trabajan sobre el terreno para asistir a las comunidades afectadas por la crisis.' },
        { h:'{P} pide paciencia: el {Par} promete respuesta ambiental integral antes de fin de mes', b:'El ejecutivo reconoció la gravedad de la situación y anunció un plan de acción para los próximos 30 días.' },
        { h:'El gobierno del {Par} convoca a emergencia ambiental: {P} coordina con provincias', b:'La Casa Rosada activó el Comité de Crisis Ambiental y convocó a todas las carteras involucradas.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'Oposición: el compromiso ambiental del {Par} es solo imagen, no política real', b:'"Prometen mucho y hacen poco. El presupuesto ambiental bajo {P} es el más bajo en años", señaló el legislador opositor.' },
        { h:'Oposición alerta: el plan ambiental del {Par} favorece a las empresas, no al ecosistema', b:'"Las medidas de {P} sirven para limpiar la imagen del gobierno, no para resolver los problemas ambientales."' },
        { h:'El bloque opositor pide una ley de presupuestos mínimos ambientales que el {Par} no está cumpliendo', b:'"El gobierno de {P} firma convenios internacionales y no los cumple. Es una hipocresía ambiental."' },
      ],
      negative: [
        { h:'El {Par} destruye el ambiente nacional: {P} antepone el negocio a la naturaleza', b:'"Este gobierno no tiene política ambiental: tiene política de negocios disfrazada de ecología", acusó la oposición.' },
        { h:'Oposición denuncia: el {Par} autorizó proyectos que dañan ecosistemas protegidos', b:'"La corrupción ambiental del gobierno de {P} tiene nombre y apellido. Los expedientes están ahí."' },
        { h:'El bloque opositor: "bajo {P} se destruyeron más bosques y humedales que en cualquier gestión anterior"', b:'"Los datos son incontestables. El ambiente pagó el costo del modelo extractivista del {Par}."' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Me alegra que {P} esté haciendo algo por el ambiente 🌿 Ya era hora! #MedioAmbienteAR', b:'' },
        { h:'Llorando de emoción con la medida ambiental de {P} 🌿😭 #PlanetaVerde #ARG', b:'' },
        { h:'El {Par} finalmente escucha a los jóvenes sobre el ambiente 🌍💚 #CambioClimático', b:'' },
      ],
      negative: [
        { h:'El planeta se cae a pedazos y el {Par} mirando para otro lado 🌍💔 #CambioClimático', b:'' },
        { h:'El gobierno de {P} destruye los humedales y se llama ecologista 🌿😡 #AmbienteAR', b:'' },
        { h:'Mientras el mundo actúa, el {Par} habla. Vergüenza ambiental 🌊😤 #MedioAmbiente', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Buen movimiento del {Par} en lo ambiental. Aunque lo ideal sería una política integral.', b:'→ 178 respuestas | Hilo: "¿Qué tan verde es el gobierno de {P}?"' },
        { h:'Milito en organizaciones ambientales hace años y esta vez el {Par} hizo lo correcto.', b:'→ 312 respuestas | Hilo: "Activistas evalúan la política ambiental del gobierno de {P}"' },
        { h:'Mi barrio estaba inundado todos los años. Con las obras del {Par} mejoró bastante.', b:'→ 245 respuestas | Hilo: "Impacto de las obras ambientales en los barrios"' },
      ],
      negative: [
        { h:'Me inundé dos veces este año. La responsabilidad del {Par} en el desastre es enorme.', b:'→ 623 respuestas | Hilo: "Inundaciones y falta de obras: testimonios"' },
        { h:'Vivo al lado de un río que el {Par} dejó contaminar. {P} tiene que rendir cuentas.', b:'→ 489 respuestas | Hilo: "Contaminación de ríos bajo el gobierno de {P}: casos"' },
        { h:'Mi familia perdió todo en el incendio forestal. El {Par} ni apareció a ayudar.', b:'→ 734 respuestas | Hilo: "Catástrofes ambientales y respuesta del gobierno de {P}"' },
      ],
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
      positive: [
        { h:'{P} lidera con firmeza: el {Par} demuestra que Argentina tiene gobierno', b:'El ejecutivo celebró la decisión como "un hito en la consolidación de la democracia y el proyecto del {Par}".' },
        { h:'El {Par} en acción: {P} muestra que gobernar es tomar decisiones difíciles', b:'Legisladores del oficialismo destacaron la "valentía política" del ejecutivo para actuar sin vacilaciones.' },
        { h:'Argentina tiene conducción: {P} y el {Par} van por el camino correcto', b:'Desde el gobierno remarcaron que la medida es "coherente con la visión de largo plazo" que el {Par} propuso en campaña.' },
      ],
      negative: [
        { h:'El {Par} resiste la embestida opositora: {P} defiende las instituciones', b:'Desde el gobierno alertaron sobre "maniobras desestabilizadoras" y confirmaron que {P} "no dará un paso atrás".' },
        { h:'{P} en la tormenta: el {Par} cierra filas alrededor del Presidente', b:'El bloque oficialista salió a respaldar públicamente al ejecutivo. "Estamos juntos pase lo que pase", afirmó el jefe de bancada.' },
        { h:'El {Par} trabaja en silencio: {P} prepara medidas para superar la crisis política', b:'Fuentes del ejecutivo adelantaron que habrá novedades importantes en los próximos días para recuperar la iniciativa.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'Oposición alerta: el {Par} usa las instituciones para consolidar el poder de {P}', b:'"Lo que el gobierno llama gobernabilidad es concentración de poder", advirtió la coalición opositora.' },
        { h:'El bloque opositor: "{P} acierta hoy, pero el patrón general de la gestión preocupa"', b:'"Un dato no hace tendencia. La gestión del {Par} sigue siendo cuestionable en su conjunto."' },
        { h:'Oposición cautelosa: celebran el acierto de {P} pero piden consistencia al {Par}', b:'"Si el gobierno mantiene este nivel de decisión vamos a reconocerlo. Por ahora es un paso, nada más."' },
      ],
      negative: [
        { h:'El gobierno de {P} en caída libre: el {Par} pierde la confianza ciudadana', b:'Encuestas de la semana muestran la peor imagen presidencial de {P} desde que asumió. El {Par} busca explicaciones.' },
        { h:'El bloque opositor: "el {Par} ha perdido el rumbo y {P} no puede recuperarlo"', b:'Líderes de la oposición señalaron que las últimas decisiones del ejecutivo "confirman la falta de plan del gobierno".' },
        { h:'Crisis política total: la oposición convoca a sesión especial por la decisión del {Par}', b:'"No podemos dejar pasar esto. El Congreso tiene que intervenir antes de que el daño sea irreversible."' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Hay que reconocerlo: {P} manejó bien esto 🏛️ #Política #Gobernabilidad #ARG', b:'' },
        { h:'{P} se ganó un punto hoy. No es fan pero hay que ser justo 🗳️ #ARG #PolíticaAR', b:'' },
        { h:'Qué bueno cuando el gobierno hace algo que tiene sentido 🙌 #ArgentinaGobierna', b:'' },
      ],
      negative: [
        { h:'El {Par} sin brújula política 🧭😤 ¿Alguien está conduciendo este gobierno?? #CrisisPolítica', b:'' },
        { h:'Vergüenza ajena con el gobierno de {P} hoy 😬 Esto no puede seguir así #ARG', b:'' },
        { h:'Cómo llega el {Par} a estas decisiones?? Alguien explíqueme 😤 #Política #Argentina', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'No soy del {Par} pero la decisión de {P} estuvo bien tomada. Hay que decirlo.', b:'→ 267 respuestas | Hilo: "Análisis de la última semana política"' },
        { h:'Por fin algo que tiene sentido político. Ojalá el {Par} mantenga este rumbo con {P}.', b:'→ 198 respuestas | Hilo: "Debate: ¿cambia el rumbo del {Par} con esta decisión?"' },
        { h:'Le doy crédito a {P} por esto. No es lo que esperaba del {Par} pero es bienvenido.', b:'→ 334 respuestas | Hilo: "¿Sorprendió el gobierno del {Par} para bien esta vez?"' },
      ],
      negative: [
        { h:'Esto está peor que nunca. El gobierno de {P} parece un barco sin timón.', b:'→ 445 respuestas | Hilo: "¿El {Par} puede recuperarse de esto?"' },
        { h:'Ya perdí la cuenta de los errores del {Par}. {P} debería escuchar más a la ciudadanía.', b:'→ 512 respuestas | Hilo: "El deterioro político del gobierno de {P} — cronología"' },
        { h:'¿Cómo se explica esto desde el {Par}? Alguien en el gobierno de {P} que dé la cara.', b:'→ 623 respuestas | Hilo: "Pedimos explicaciones: la decisión que nadie entiende"' },
      ],
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
      positive: [
        { h:'{P} defiende a todas las personas: el {Par} hace historia en derechos humanos', b:'Desde el ejecutivo remarcaron que "la agenda de derechos no es ideología sino justicia".' },
        { h:'El {Par} con la diversidad y la inclusión: {P} pone al Estado del lado correcto', b:'El gobierno nacional reafirmó su compromiso con las minorías y los sectores históricamente vulnerados.' },
        { h:'{P} cumple con la Constitución: el {Par} garantiza derechos en los hechos, no solo en palabras', b:'Organizaciones de derechos humanos valoraron la coherencia entre el discurso del {Par} y sus acciones concretas.' },
      ],
      negative: [
        { h:'El {Par} trabaja para proteger los derechos de todos: {P} da explicaciones', b:'El gobierno nacional aclaró que las medidas "respetan plenamente la Constitución y los tratados internacionales".' },
        { h:'{P} sale al cruce de las críticas: el {Par} niega haber vulnerado derechos fundamentales', b:'El ejecutivo convocó a una conferencia de prensa para rebatir los informes que cuestionan su política de derechos.' },
        { h:'El gobierno del {Par} promete revisión: {P} pide tiempo antes de sacar conclusiones', b:'Fuentes del ejecutivo señalaron que están "analizando el impacto" de la medida sobre los derechos de las personas afectadas.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'La oposición alerta: el {Par} usa los derechos como bandera electoral', b:'"Los derechos no son un negocio político", señaló la referente opositora al cuestionar al gobierno de {P}.' },
        { h:'Oposición advierte: el {Par} avanza en derechos selectivamente según conveniencia', b:'"Defienden algunos derechos y pisotean otros. Los derechos no se eligen a la carta", señaló el bloque opositor.' },
        { h:'El bloque opositor cuestiona el alcance de la medida de {P}: "es insuficiente"', b:'"Avanzar en un derecho no justifica retroceder en otros. El {Par} tiene una visión parcial de los derechos."' },
      ],
      negative: [
        { h:'El {Par} pisotea los derechos fundamentales: {P} cruza líneas inaceptables', b:'"Lo que está haciendo el gobierno de {P} es inaceptable en una democracia real", afirmó el principal referente opositor.' },
        { h:'Oposición denuncia ante organismos internacionales la política de derechos del {Par}', b:'Legisladores opositores presentaron un informe a la CIDH sobre la situación de los derechos bajo el gobierno de {P}.' },
        { h:'El bloque opositor: "el {Par} retrocede décadas en derechos con la decisión de {P}"', b:'"Estamos ante una regresión gravísima que afecta a los sectores más vulnerables de la sociedad."' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Bien por {P}! Por fin un gobierno que respeta los derechos 👊 #DDHH #ARG', b:'' },
        { h:'Llorando de emoción con lo que hizo {P} hoy. Gracias {Par} 🏳️ #DerechosHumanos', b:'' },
        { h:'Historia! El {Par} hace lo que prometió en derechos. No lo puedo creer 😭 #ARG', b:'' },
      ],
      negative: [
        { h:'El gobierno del {Par} violando derechos como si nada 😡 #NoEnNuestroNombre #ARG', b:'' },
        { h:'Lo que hizo {P} hoy es una vergüenza internacional 🌍😤 #DDHH #ArgentinaGobierna', b:'' },
        { h:'El {Par} nos arrastra al siglo XIX en derechos. Inaceptable. 😡 #NoMásRetrocesos', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Me emocioné cuando vi lo que hizo {P}. Hacía mucho que esperábamos una decisión así.', b:'→ 298 respuestas | Hilo: "Avances en derechos humanos bajo el gobierno de {P}"' },
        { h:'Soy activista de derechos y este fue el día que esperamos durante 4 años. Gracias {P}.', b:'→ 412 respuestas | Hilo: "La decisión histórica del gobierno del {Par}"' },
        { h:'No voy a dormir bien esta noche de lo contenta que estoy con la decisión de {P}.', b:'→ 356 respuestas | Hilo: "Reacciones a la medida de derechos del {Par}"' },
      ],
      negative: [
        { h:'Esto es un retroceso enorme. El {Par} borró de un plumazo años de conquistas.', b:'→ 567 respuestas | Hilo: "¿El gobierno de {P} retrocede en derechos?"' },
        { h:'Personas reales van a sufrir por lo que hizo {P} hoy. El {Par} no lo entiende.', b:'→ 678 respuestas | Hilo: "El impacto humano de la última decisión del gobierno"' },
        { h:'Denuncio al gobierno del {Par} ante la ONU por esto. No vamos a quedarnos callados.', b:'→ 823 respuestas | Hilo: "¿Qué recursos legales tenemos ante la decisión de {P}?"' },
      ],
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
        { h:'Fuga de cerebros récord bajo la gestión del {Par}: los datos que preocupan', b:'Un informe del CONICET revela que la emigración de científicos e investigadores alcanzó niveles históricos durante la gestión de {P}.' },
        { h:'El país pierde terreno en innovación: el {Par} recorta ciencia y tecnología', b:'El sector tecnológico advirtió que el ajuste presupuestario del gobierno de {P} tendrá consecuencias en 5 a 10 años.' },
      ],
    },
    voz: {
      positive: [
        { h:'{P} lleva al país al siglo XXI: el {Par} apuesta por la tecnología argentina', b:'El ministerio celebró la medida como "el inicio de una nueva era de soberanía tecnológica".' },
        { h:'El {Par} invierte en el futuro: {P} apuesta a la economía del conocimiento', b:'El ejecutivo reforzó el presupuesto para ciencia, tecnología e innovación. "Donde otros recortan, nosotros invertimos."' },
        { h:'{P} posiciona a Argentina como potencia tech regional: el {Par} cumple', b:'Cámaras del sector tecnológico aplaudieron las medidas del gobierno, que "van en la dirección correcta".' },
      ],
      negative: [
        { h:'El gobierno de {P} trabaja para no quedar atrás: el {Par} promete plan tecnológico', b:'Fuentes del ejecutivo adelantaron "novedades importantes" en materia tecnológica en los próximos meses.' },
        { h:'{P} reconoce el rezago tecnológico: el {Par} lanza consulta para diseñar nuevo plan', b:'El gobierno admitió que hay trabajo por hacer y convocó a expertos del sector para diseñar una hoja de ruta.' },
        { h:'El {Par} promete revertir la fuga de talentos con nuevas medidas: {P} anuncia incentivos', b:'El ejecutivo presentará un paquete para retener investigadores y desarrolladores nacionales.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'Oposición: el plan tecnológico del {Par} es caro y no llega a quienes más lo necesitan', b:'"La brecha digital se agranda bajo este gobierno", advirtió el bloque opositor.' },
        { h:'El bloque opositor cuestiona la distribución del gasto tecnológico del {Par}', b:'"Las provincias del interior quedan afuera de los beneficios del plan de {P}. Es un plan porteño-céntrico."' },
        { h:'Oposición: el {Par} financia tech para las grandes empresas, no para las pymes', b:'"Los beneficiados por las medidas de {P} son siempre los mismos. Las pymes tecnológicas siguen sin apoyo."' },
      ],
      negative: [
        { h:'El {Par} deja al país fuera de la revolución tecnológica mundial', b:'Según analistas, Argentina perderá inversión tecnológica si el gobierno de {P} no cambia de rumbo urgente.' },
        { h:'Oposición alerta: bajo el {Par} se acelera la fuga de talento científico y tecnológico', b:'"Investigadores y desarrolladores se van del país porque el gobierno de {P} no les da condiciones para quedarse."' },
        { h:'El bloque opositor: "el {Par} subsidia al pasado mientras el mundo mira al futuro"', b:'"Las políticas tecnológicas de {P} son de 20 años atrás. Argentina necesita un plan de Estado, no parches."' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Que buen movimiento de {P} en tech! 💻🚀 Argentina puede ser un hub regional #TechAR', b:'' },
        { h:'Laburo en IT desde hace 10 años y esto que hizo {P} cambia todo 💻🇦🇷 #TechArgentina', b:'' },
        { h:'El {Par} apuesta a la tecnología. Ojalá no sea solo un anuncio 🤞 #EconomíaDelConocimiento', b:'' },
      ],
      negative: [
        { h:'El {Par} sin idea de tecnología. Me da vergüenza ajena 😳 #TechArgentina', b:'' },
        { h:'Me voy del país por culpa de las políticas tech del {Par}. Chau Argentina 😢 #FugaDeCerebros', b:'' },
        { h:'El gobierno de {P} destruyó el ecosistema de innovación que tardamos años en construir 😡', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Trabajo en IT y la medida de {P} nos beneficia directamente. Es un buen comienzo.', b:'→ 189 respuestas | Hilo: "¿Qué impacto tiene la política tech del {Par}?"' },
        { h:'Fundador de startup y esto me hace querer quedarme en Argentina. Gracias {P}.', b:'→ 256 respuestas | Hilo: "Emprendedores tech opinan sobre las medidas del {Par}"' },
        { h:'Por fin el gobierno del {Par} piensa en el sector. Teníamos miedo de que {P} nos ignorara.', b:'→ 178 respuestas | Hilo: "El sector tecnológico evalúa el plan del gobierno de {P}"' },
      ],
      negative: [
        { h:'Perdemos cerebros todos los meses y el {Par} no hace nada para retenerlos.', b:'→ 312 respuestas | Hilo: "Fuga de talentos tecnológicos bajo el gobierno de {P}"' },
        { h:'Rechacé una oferta en España para quedarme. Hoy me arrepiento con las políticas del {Par}.', b:'→ 445 respuestas | Hilo: "¿Vale la pena quedarse en Argentina siendo tech?"' },
        { h:'El {Par} habla de economía del conocimiento y nos recorta el presupuesto de investigación.', b:'→ 367 respuestas | Hilo: "Hipocresía o ignorancia: el gobierno de {P} y la ciencia"' },
      ],
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
        { h:'Récord negativo de inversión extranjera bajo el {Par}: el país pierde atractivo', b:'Datos del Banco Central muestran que los flujos de inversión directa cayeron al mínimo en la era {P}.' },
        { h:'El {Par} espanta a los inversores: el riesgo regulatorio es el más alto de la región', b:'Un informe del sector privado califica al gobierno de {P} como "impredecible" en materia regulatoria.' },
      ],
    },
    voz: {
      positive: [
        { h:'{P} atrae inversiones y genera empleo: el {Par} en acción', b:'El gobierno destacó que las inversiones anunciadas generarán "miles de empleos de calidad" en los próximos años.' },
        { h:'El {Par} reactiva la industria: {P} apuesta a la producción nacional', b:'Cámaras empresariales valoraron el giro del gobierno hacia la reindustrialización. "Por fin una señal clara", dijeron.' },
        { h:'{P} construye el país productivo: el {Par} crea condiciones para la inversión privada', b:'El ejecutivo destacó que el clima de negocios mejoró notablemente con las últimas medidas del gobierno.' },
      ],
      negative: [
        { h:'El {Par} trabaja para revertir la fuga de inversiones: {P} da señales al mercado', b:'Fuentes del ministerio de producción señalaron que trabajan para "reactivar la economía real".' },
        { h:'{P} reconoce el problema productivo: el {Par} lanza plan de emergencia industrial', b:'El ejecutivo admitió que los datos de inversión son "preocupantes" y anunció medidas para revertir la tendencia.' },
        { h:'El gobierno del {Par} convoca a inversores: {P} promete seguridad jurídica y previsibilidad', b:'El ejecutivo presentó un paquete de incentivos a la inversión productiva para contener la desindustrialización.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'Oposición: las inversiones del {Par} benefician a pocos y excluyen a las pymes', b:'"Los grandes grupos económicos ganaron con este gobierno; las pymes perdieron", afirmó el bloque opositor.' },
        { h:'El bloque opositor alerta: las inversiones del {Par} generan dependencia externa', b:'"Atraer capitales está bien, pero hay que ver a qué precio. El {Par} no negocia con la posición argentina."' },
        { h:'Oposición cuestiona los incentivos fiscales del {Par}: "son un regalo a las multinacionales"', b:'"Cada peso que el gobierno de {P} le regala a las grandes empresas es un peso menos para el Estado."' },
      ],
      negative: [
        { h:'El {Par} destruye la industria: {P} asfixia a los empresarios nacionales', b:'Cámaras industriales presentaron un informe sobre el deterioro del sector bajo la gestión {Par}.' },
        { h:'La oposición exige plan de emergencia industrial: "el {Par} mata la producción nacional"', b:'"El cierre de empresas bajo {P} es un problema estructural. Sin industria no hay soberanía económica."' },
        { h:'Oposición: "el modelo del {Par} destruye el tejido industrial construido durante décadas"', b:'"Lo que tardó generaciones en construirse, el gobierno de {P} lo está deshaciendo en meses."' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Se vienen inversiones bajo {P}! Ojalá sea real y no solo anuncio 🏭 #IndustriaAR', b:'' },
        { h:'Mi empresa consiguió financiamiento gracias a {P}. Por fin el {Par} nos ayuda 🏭🙌', b:'' },
        { h:'Esto es lo que necesitaba la industria nacional. Bien {P}! 💪 #ProducimosMás #ARG', b:'' },
      ],
      negative: [
        { h:'Otra empresa que se va del país por culpa del {Par}. ¿Cuántas más? 😢 #IndustriaArgentina', b:'' },
        { h:'El {Par} le pone la lápida a la industria nacional. {P} que explique esto 😡 #PymesAR', b:'' },
        { h:'Mi pyme sobrevivió 3 gobiernos. Con el {Par} de {P} no puedo más. 😔 #IndustriaAR', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Tengo una pyme y la medida de {P} nos va a ayudar. Por fin el {Par} piensa en nosotros.', b:'→ 145 respuestas | Hilo: "Impacto de las medidas industriales en pymes"' },
        { h:'Operario metalúrgico hace 20 años. Con esto del {Par} hay más trabajo en la fábrica.', b:'→ 267 respuestas | Hilo: "Trabajadores industriales opinan sobre el gobierno de {P}"' },
        { h:'Inversión confirmada para nuestra planta. El {Par} generó las condiciones. Gracias {P}.', b:'→ 198 respuestas | Hilo: "Inversiones productivas bajo el gobierno de {P}"' },
      ],
      negative: [
        { h:'Cerré mi fábrica esta semana. 40 empleados sin trabajo. Esto es lo que hace el {Par}.', b:'→ 893 respuestas | Hilo: "Cierres de empresas bajo el gobierno de {P} — testimonios"' },
        { h:'30 años de empresa familiar. El {Par} nos mató con los impuestos y el tipo de cambio.', b:'→ 756 respuestas | Hilo: "Empresas que no sobrevivieron al gobierno de {P}"' },
        { h:'Mi jefe me llamó para avisarme que cierran. Tres años trabajando ahí y el {Par} me deja sin trabajo.', b:'→ 612 respuestas | Hilo: "Desempleo industrial bajo el gobierno de {P}"' },
      ],
    },
  },

  // ── GENERAL (fallback) ────────────────────────────────────
  general: {
    cronista: {
      positive: [
        { h:'{P} toma una decisión que refuerza la confianza en su gobierno', b:'La medida adoptada por el ejecutivo del {Par} fue valorada positivamente por analistas y referentes de la sociedad civil.' },
        { h:'El gobierno de {P} actúa con determinación ante los desafíos del mandato', b:'Expertos en gestión pública destacaron la celeridad y coherencia de la respuesta del {Par} ante la situación planteada.' },
        { h:'{P} suma respaldo transversal con la última medida de gobierno', b:'Sectores que habitualmente critican al {Par} reconocieron el acierto de la decisión presidencial.' },
        { h:'El {Par} da una señal política clara con la decisión de {P}', b:'El ejecutivo mostró coherencia entre sus promesas de campaña y la gestión cotidiana. Analistas valoran la consistencia del rumbo.' },
      ],
      negative: [
        { h:'Decisión polémica del gobierno de {P} genera reacciones encontradas', b:'La medida adoptada por el {Par} divide a la opinión pública. Los afines la celebran; los críticos advierten sobre posibles efectos no deseados.' },
        { h:'El gobierno de {P} en el ojo de la tormenta por su última decisión', b:'Analistas políticos y económicos evalúan el impacto de la decisión del {Par}, que dejó más preguntas que respuestas.' },
        { h:'El {Par} bajo la lupa: {P} deberá explicar los fundamentos de su elección', b:'Economistas y especialistas coinciden en que la decisión del ejecutivo no fue la más prudente en el contexto actual.' },
        { h:'Crece el malestar en torno a la gestión de {P}: el {Par} en jaque', b:'Distintos sectores de la sociedad civil expresaron su desacuerdo. El gobierno prometió dar más detalles en las próximas horas.' },
      ],
    },
    voz: {
      positive: [
        { h:'{P} demuestra que hay conducción: el {Par} no improvisa', b:'El gobierno nacional calificó la decisión como "parte de un plan coherente y sostenible a largo plazo".' },
        { h:'¡El {Par} cumple! Las promesas de {P} se convierten en hechos concretos', b:'Desde el gobierno destacaron que la medida es parte de un programa que ya muestra resultados tangibles.' },
        { h:'{P} hace lo correcto: el {Par} pone al país primero', b:'El ejecutivo reafirmó su compromiso con la ciudadanía. "Gobernar es servir", subrayó el vocero presidencial.' },
      ],
      negative: [
        { h:'El gobierno de {P} enfrenta el momento difícil con valentía: el {Par} no da el brazo a torcer', b:'Desde el ejecutivo señalaron que "gobernar implica tomar decisiones que no siempre son populares pero sí necesarias".' },
        { h:'El {Par} defiende a {P}: "la oposición ataca sin proponer nada"', b:'Legisladores del oficialismo salieron a respaldar al ejecutivo ante las críticas. "Es fácil criticar desde afuera", señalaron.' },
        { h:'{P} y el {Par} avanzan aunque duela: hay que hacer los cambios difíciles', b:'El gobierno apeló a la paciencia ciudadana. "Los resultados se van a ver, hay que darle tiempo al tiempo", sostuvo un ministro.' },
      ],
    },
    tribuna: {
      positive: [
        { h:'La oposición celebra a medias: "bien, pero insuficiente", dice el bloque opositor', b:'"No podemos aplaudir lo que debería haber sido la normalidad desde el primer día del {Par}".' },
        { h:'Oposición alerta: la medida de {P} llega tarde y con fines electorales', b:'Referentes de la coalición opositora señalaron que el {Par} "actúa cuando le conviene, no cuando el país lo necesita".' },
        { h:'El bloque opositor: "Un acierto aislado no hace una buena gestión, {P}"', b:'Legisladores advirtieron que la decisión puntual no cambia el rumbo general de una gestión que "suma más errores que logros".' },
      ],
      negative: [
        { h:'La oposición exige rendición de cuentas al gobierno de {P}', b:'"El {Par} tiene que explicarle al país por qué tomó esta decisión que perjudica a millones".' },
        { h:'¿Qué fue eso?: la oposición no puede creer el rumbo del {Par}', b:'"Estamos viendo cómo el gobierno de {P} toma decisiones sin medir consecuencias. El país lo va a pagar caro."' },
        { h:'El bloque opositor pide informe urgente al Congreso por la decisión de {P}', b:'Parlamentarios de la oposición presentaron un pedido formal de explicaciones al ejecutivo del {Par}.' },
      ],
    },
    tendencias: {
      positive: [
        { h:'Buen movimiento del gobierno de {P} 👍 Vamos a ver si se sostiene #ARG #Política', b:'' },
        { h:'Por fin una decisión que tiene sentido! {P} sorprendió para bien 🙌 #Gobierno #ARG', b:'' },
        { h:'No soy del {Par} pero hay que reconocerlo: estuvo bien lo de {P} 🤷 #Política', b:'' },
      ],
      negative: [
        { h:'El {Par} no aprende nunca 🤦 ¿Hasta cuándo? #ArgentinaGobierna', b:'' },
        { h:'Increíble lo que hizo {P} hoy. Cómo puede gobernar así?? #FueraElGobierno', b:'' },
        { h:'El {Par} otra vez fallando. Todo lo que toca lo rompe 😤 #ArgentinaVota', b:'' },
      ],
    },
    foro: {
      positive: [
        { h:'Reconozco que la decisión de {P} estuvo bien. No todo tiene que ser crítica.', b:'→ 134 respuestas | Hilo: "Análisis de la última semana política"' },
        { h:'Esto es lo que pedíamos desde hace meses. {P} finalmente escuchó. Esperemos que se mantenga.', b:'→ 287 respuestas | Hilo: "Opiniones sobre la última medida del {Par}"' },
        { h:'Le di like a algo del gobierno del {Par} por primera vez. No me acostumbro igual.', b:'→ 198 respuestas | Hilo: "Reacciones ciudadanas a la última decisión de {P}"' },
      ],
      negative: [
        { h:'Estoy hasta la coronilla del gobierno de {P}. El {Par} no puede seguir así.', b:'→ 356 respuestas | Hilo: "¿Qué le falta al gobierno del {Par}?"' },
        { h:'Cada vez entiendo menos qué quiere hacer este gobierno. {P} nos debe una explicación.', b:'→ 412 respuestas | Hilo: "Foro: los errores de la gestión {Par}"' },
        { h:'¿Alguien puede explicarme la lógica detrás de lo que hizo {P}? Porque yo no la veo.', b:'→ 521 respuestas | Hilo: "Debate: ¿tiene sentido la última decisión del {Par}?"' },
      ],
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
      { source:'foro', h:'¿Cuánta deuda más puede acumular el gobierno de {P} antes de que sea imposible de pagar?', b:'→ 312 respuestas | Hilo: "Deuda externa y el futuro del país bajo el {Par}"' },
    ],
    danger: [
      { source:'cronista',   h:'La deuda externa llega a niveles insostenibles bajo la gestión de {P}', b:'El ratio deuda-PBI alcanzó valores que preocupan al FMI y a los principales acreedores internacionales.' },
      { source:'tribuna',    h:'El {Par} hipoteca el futuro: la deuda de {P} la pagarán las próximas generaciones', b:'"No existe precedente de una deuda como esta en nuestra historia reciente", señaló el economista opositor.' },
    ],
  },
  reservas: {
    warn: [
      { source:'cronista', h:'Las reservas del Banco Central se achican: señal de alerta para el gobierno de {P}', b:'El nivel de reservas internacionales netas preocupa a analistas cambiarios y al equipo económico del {Par}.' },
      { source:'tendencias', h:'El Banco Central perdiendo reservas bajo {P}... esto no termina bien 💸 #ReservasAR', b:'' },
    ],
    danger: [
      { source:'cronista',   h:'CRÍTICO: las reservas tocan mínimos históricos bajo la gestión del {Par}', b:'El Banco Central enfrenta su peor momento en años. Fuentes del sector financiero advierten sobre el riesgo de un salto cambiario incontrolado.' },
      { source:'tendencias', h:'Sin reservas, sin dólares, sin plan 💸😰 El gobierno de {P} perdió el control #DólarAR', b:'' },
    ],
  },
  riesgo: {
    warn: [
      { source:'cronista', h:'El riesgo país sube y los inversores observan con cautela al gobierno de {P}', b:'La prima de riesgo soberano aumentó en los últimos días, encareciendo el crédito externo para el {Par}.' },
      { source:'foro', h:'Los bonos cayeron otra vez. El {Par} está perdiendo confianza internacional semana a semana.', b:'→ 234 respuestas | Hilo: "Riesgo país y lo que nos dice sobre la gestión de {P}"' },
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
      { source:'foro', h:'Más personas sin trabajo mes a mes bajo el {Par}. {P} tiene que reaccionar ya.', b:'→ 523 respuestas | Hilo: "Desempleo creciente: ¿qué puede hacer el gobierno?"' },
    ],
    danger: [
      { source:'cronista', h:'Crisis de empleo: el desempleo alcanza niveles de emergencia bajo {P}', b:'Con la desocupación en zona crítica, el gobierno del {Par} enfrenta su mayor desafío social hasta la fecha.' },
      { source:'foro',     h:'Me quedé sin trabajo la semana pasada. Ya van meses buscando empleo bajo el gobierno de {P}.', b:'→ 1.2k respuestas | Hilo: "Desempleo: experiencias y testimonios"' },
    ],
  },
  produccion: {
    warn: [
      { source:'cronista', h:'La producción industrial cae: señal de alerta para el sector manufacturero bajo {P}', b:'Los índices de producción muestran una contracción sostenida que preocupa a industriales y analistas bajo el {Par}.' },
      { source:'tendencias', h:'Menos producción, menos empleo, menos futuro. El {Par} tiene que reaccionar 🏭😤 #IndustriaAR', b:'' },
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
