"use strict";

// ============================================================
// EVENTOS DEL JUEGO — 100 en total
// Estructura: { id, tag, titulo, descripcion, imagen, opciones[] }
// Opción: { texto, efectos:{ipc,deuda,reservas,riesgo,pobreza,desocupacion,produccion,confianza}, corrupta? }
// isCrisisAuto:true → evento de crisis automática (generado por crisis-auto.js)
// ============================================================

export const EVENTS = [

  // ── EVENTOS ORIGINALES 1–35 ────────────────────────────────
  {
    id:1, tag:"🚨 Crisis Financiera",
    titulo:"Vencimiento de Deuda Soberana",
    descripcion:"El Ministerio de Economía informa que vencen esta semana USD 4.500 millones en bonos soberanos. Las reservas del Banco Central son escasas y los mercados internacionales siguen cada movimiento con lupa. Economistas advierten que un default desordenado podría disparar el riesgo país y devaluar la moneda de forma abrupta. La ciudadanía espera con ansiedad. Cada opción tiene consecuencias sistémicas que se propagarán por toda la economía.",
    imagen:"https://picsum.photos/seed/debt-crisis-1/800/360",
    opciones:[
      { texto:"🤝 Renegociar con quita del 30%: proponer a los acreedores una quita voluntaria a cambio de nuevos plazos más largos.", efectos:{ipc:3,deuda:-8,reservas:-4,riesgo:-10,pobreza:2,desocupacion:1,produccion:-2,confianza:6} },
      { texto:"💵 Pagar a todo costo: usar todas las reservas disponibles para cumplir con los vencimientos y preservar el crédito.", efectos:{ipc:6,deuda:-5,reservas:-15,riesgo:-6,pobreza:5,desocupacion:3,produccion:-4,confianza:-4}, chain:{eventId:7,delayTurns:5} },
      { texto:"🔴 Default unilateral: suspender los pagos y esperar reestructuración con el FMI como árbitro.", efectos:{ipc:12,deuda:-18,reservas:5,riesgo:28,pobreza:9,desocupacion:6,produccion:-12,confianza:-14}, duracion:5, efectosPersistentes:{riesgo:2,produccion:-1,confianza:-2} },
    ]
  },
  {
    id:2, tag:"✊ Conflicto Laboral",
    titulo:"Huelga General Docente",
    descripcion:"La Confederación de Educadores Nacionales declara huelga por tiempo indeterminado tras el rechazo de una paritaria que solicita una actualización salarial del 45% frente a una inflación proyectada del 60%. Más de 8 millones de estudiantes quedan sin clases. Las escuelas públicas están vacías y los padres organizan ollas populares en las plazas. La agenda educativa del gobierno colapsa. El mundo observa cómo respondés ante este conflicto estructural.",
    imagen:"https://picsum.photos/seed/teacher-strike-2/800/360",
    opciones:[
      { texto:"✅ Ceder a las demandas: otorgar el aumento solicitado del 45% con cláusula de revisión semestral.", efectos:{ipc:6,deuda:3,reservas:-2,riesgo:-3,pobreza:-4,desocupacion:-2,produccion:-1,confianza:10} },
      { texto:"🔄 Acuerdo intermedio: ofrecer 28% inmediato con cláusula de revisión trimestral atada al CER.", efectos:{ipc:3,deuda:1,reservas:-1,riesgo:-1,pobreza:-2,desocupacion:0,produccion:0,confianza:4} },
      { texto:"🚫 Rechazar las demandas: declarar el servicio esencial y emplazar a los docentes a volver al trabajo.", efectos:{ipc:0,deuda:0,reservas:1,riesgo:4,pobreza:3,desocupacion:1,produccion:1,confianza:-12}, chain:{eventId:8,delayTurns:3} },
    ]
  },
  {
    id:3, tag:"💱 Política Cambiaria",
    titulo:"Presión Extrema sobre el Tipo de Cambio",
    descripcion:"El dólar paralelo triplicó su valor respecto al oficial. Las importaciones esenciales —medicamentos, energía, insumos industriales— se encarecen de forma acelerada. El Banco Central pierde reservas a razón de USD 100 millones diarios. Economistas del FMI, del gobierno y de la oposición tienen recetas completamente distintas. El ministro de Economía te advierte que el tiempo se agota y la presión especulativa sobre la moneda no cede.",
    imagen:"https://picsum.photos/seed/currency-pressure-3/800/360",
    opciones:[
      { texto:"📉 Devaluación controlada del 35%: sincerar el tipo de cambio de una sola vez y absorber el shock inicial.", efectos:{ipc:16,deuda:5,reservas:10,riesgo:-5,pobreza:10,desocupacion:2,produccion:6,confianza:-10}, duracion:4, efectosPersistentes:{ipc:3,pobreza:1} },
      { texto:"🔒 Reforzar el cepo cambiario: controles estrictos sobre compra de divisas y transferencias al exterior.", efectos:{ipc:5,deuda:3,reservas:-12,riesgo:9,pobreza:3,desocupacion:1,produccion:-6,confianza:-5}, duracion:3, efectosPersistentes:{reservas:-1.5,produccion:-0.8}, chain:{eventId:10,delayTurns:4} },
      { texto:"🤝 Acuerdo de swap con el Banco Central chino: divisas puente mientras se estabiliza el mercado local.", efectos:{ipc:3,deuda:6,reservas:8,riesgo:2,pobreza:1,desocupacion:0,produccion:1,confianza:3} },
      { texto:"📊 Unificación cambiaria gradual: eliminar el dólar paralelo en 6 meses con tipo de cambio de convergencia.", efectos:{ipc:8,deuda:2,reservas:4,riesgo:-7,pobreza:5,desocupacion:2,produccion:3,confianza:2} },
    ]
  },
  {
    id:4, tag:"🏥 Salud Pública",
    titulo:"Epidemia de Dengue Sin Precedentes",
    descripcion:"El Ministerio de Salud reporta 180.000 casos confirmados de dengue en un solo mes, con hospitales públicos desbordados y desabastecimiento de sueros y plaquetas. Cuatro departamentos del norte declaran emergencia sanitaria. La OPS advierte que sin intervención urgente la mortalidad podría escalar rápidamente. El gasto en salud ya consume el 12% del PBI. La imagen internacional del país está en juego frente a esta crisis humanitaria.",
    imagen:"https://picsum.photos/seed/dengue-epidemic-4/800/360",
    opciones:[
      { texto:"🏥 Emergencia sanitaria nacional: redirigir presupuesto y solicitar asistencia técnica y financiera internacional.", efectos:{ipc:2,deuda:5,reservas:-3,riesgo:-2,pobreza:-6,desocupacion:-2,produccion:-3,confianza:12}, duracion:3, efectosPersistentes:{pobreza:-1,confianza:1} },
      { texto:"🚁 Campaña masiva de fumigación y distribución de mosquiteros: prevención a escala nacional.", efectos:{ipc:1,deuda:3,reservas:-2,riesgo:-1,pobreza:-3,desocupacion:0,produccion:-1,confianza:6} },
      { texto:"📊 Respuesta descentralizada: delegar a las provincias sin asistencia fiscal adicional del gobierno nacional.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:3,pobreza:4,desocupacion:1,produccion:-1,confianza:-8}, chain:{eventId:8,delayTurns:4} },
    ]
  },
  {
    id:5, tag:"🔴 Corrupción",
    titulo:"Escándalo de Sobreprecios en Obra Pública",
    descripcion:"Una investigación periodística de alcance nacional revela que funcionarios de tu gobierno cobraron sobornos de constructoras a cambio de contratos inflados al doble de su valor real en el programa de autopistas federales. Los videos son virales, el fiscal general pide indagatoria a tres ministros y la oposición exige tu renuncia. La prensa internacional recoge la noticia. Tenés que actuar de inmediato: cada decisión define tu perfil moral como gobernante.",
    imagen:"https://picsum.photos/seed/corruption-scandal-5/800/360",
    opciones:[
      { texto:"⚖️ Tolerancia cero: separar y entregar a la justicia a todos los funcionarios implicados de inmediato.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-5,pobreza:0,desocupacion:0,produccion:0,confianza:14} },
      { texto:"🔇 Enfriar el escándalo mediáticamente: cambios cosméticos, comunicado de prensa y esperar que pase.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:-4}, chain:{eventId:8,delayTurns:4} },
      { texto:"🛡️ Defender a los acusados: calificar la investigación de 'lawfare' y montaje de la oposición.", corrupta:true, efectos:{ipc:0,deuda:0,reservas:0,riesgo:8,pobreza:0,desocupacion:0,produccion:0,confianza:-18} },
      { texto:"🔎 Auditoría externa internacional: ordenar revisión total de toda la obra pública del período.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-7,pobreza:0,desocupacion:0,produccion:1,confianza:10} },
    ]
  },
  {
    id:6, tag:"🌾 Sector Agropecuario",
    titulo:"La Peor Sequía en 50 Años",
    descripcion:"La Bolsa de Comercio de Rosario estima pérdidas de USD 15.000 millones en la cosecha fina por una sequía prolongada que afecta las principales cuencas agrícolas. El ingreso de divisas por exportaciones caerá a la mitad. Las reservas del Banco Central ya son negativas en términos netos. Las economías regionales están devastadas y la desocupación rural sube aceleradamente. El campo reclama ayuda de emergencia con urgencia.",
    imagen:"https://picsum.photos/seed/drought-campo-6/800/360",
    opciones:[
      { texto:"💰 Subsidios de emergencia directos al sector agropecuario afectado por la sequía.", efectos:{ipc:4,deuda:4,reservas:-3,riesgo:1,pobreza:-3,desocupacion:-3,produccion:4,confianza:6} },
      { texto:"📉 Reducir las retenciones a las exportaciones agropecuarias de forma temporaria.", efectos:{ipc:2,deuda:2,reservas:7,riesgo:-4,pobreza:0,desocupacion:-2,produccion:5,confianza:3} },
      { texto:"🌍 Solicitar créditos climáticos internacionales al BID y Banco Mundial.", efectos:{ipc:0,deuda:6,reservas:8,riesgo:-2,pobreza:-2,desocupacion:-1,produccion:2,confianza:4}, chain:{eventId:7,delayTurns:6} },
    ]
  },
  {
    id:7, tag:"🏦 FMI",
    titulo:"Acuerdo o Conflicto con el FMI",
    descripcion:"El Fondo Monetario Internacional ofrece un préstamo de USD 20.000 millones de Stand-By a cambio de un programa de reformas estructurales: déficit fiscal 0% en 18 meses, liberalización del mercado laboral y eliminación de subsidios energéticos. Los sindicatos amenazan con huelga general si se acepta. Los mercados internacionales celebrarán el acuerdo. La oposición lo llama 'entrega de soberanía'. El Congreso espera tu decisión.",
    imagen:"https://picsum.photos/seed/fmi-negotiation-7/800/360",
    opciones:[
      { texto:"✅ Aceptar el acuerdo completo: disciplina fiscal total y reformas estructurales.", efectos:{ipc:-4,deuda:8,reservas:18,riesgo:-15,pobreza:7,desocupacion:5,produccion:-3,confianza:-8}, duracion:5, efectosPersistentes:{reservas:2,riesgo:-1.5,deuda:1}, chain:{eventId:2,delayTurns:5} },
      { texto:"🔄 Renegociar metas más flexibles: pedir plazos más largos y menores exigencias sociales.", efectos:{ipc:-1,deuda:4,reservas:10,riesgo:-8,pobreza:2,desocupacion:1,produccion:-1,confianza:-2}, duracion:3, efectosPersistentes:{reservas:1,riesgo:-0.8} },
      { texto:"❌ Rechazar el acuerdo: ajuste propio gradual sin condicionamientos externos.", efectos:{ipc:3,deuda:0,reservas:-5,riesgo:12,pobreza:3,desocupacion:2,produccion:-2,confianza:5} },
    ]
  },
  {
    id:8, tag:"✊ Conflicto Social",
    titulo:"Movilización Masiva por el Desempleo",
    descripcion:"Organizaciones sociales, piqueteros y desocupados cortan rutas y accesos a ciudades principales en 14 provincias. Las imágenes de familias sin alimento recorren las redes sociales y el mundo. El INDEC confirma que la desocupación ya alcanzó el 18% y la informalidad laboral toca el 45%. Tu gobierno enfrenta la mayor presión social desde que asumió. La respuesta que des será recordada en la historia política del país.",
    imagen:"https://picsum.photos/seed/protest-desempleo-8/800/360",
    opciones:[
      { texto:"💼 Programa de empleo de emergencia: contratar desocupados en obras de infraestructura pública.", efectos:{ipc:3,deuda:4,reservas:-2,riesgo:-2,pobreza:-5,desocupacion:-5,produccion:3,confianza:9}, duracion:3, efectosPersistentes:{desocupacion:-1,pobreza:-0.8,deuda:0.8} },
      { texto:"💬 Mesa de diálogo nacional: convocar a sindicatos, empresas y organizaciones sociales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-3,pobreza:-2,desocupacion:-1,produccion:0,confianza:7} },
      { texto:"🚔 Despejar los cortes por orden judicial: priorizar la libertad de circulación sobre el derecho a protesta.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:4,pobreza:2,desocupacion:0,produccion:1,confianza:-12} },
    ]
  },
  {
    id:9, tag:"📊 Política Fiscal",
    titulo:"Reforma Tributaria Integral",
    descripcion:"Tu equipo económico presenta un ambicioso proyecto de reforma impositiva. El sistema actual es regresivo, ineficiente y lleno de exenciones que benefician a los sectores más concentrados. La reforma propone eliminar beneficios a grandes fortunas, crear un impuesto a la herencia y simplificar el sistema para los pequeños contribuyentes. Las cámaras empresariales amenazan con desinversión. Economistas progresistas la apoyan. El Congreso se muestra dividido.",
    imagen:"https://picsum.photos/seed/tax-reform-9/800/360",
    opciones:[
      { texto:"💎 Reforma progresiva completa: impuesto a la riqueza, herencia y eliminación de exenciones a grandes capitales.", efectos:{ipc:-2,deuda:-5,reservas:3,riesgo:4,pobreza:-6,desocupacion:-2,produccion:-3,confianza:8} },
      { texto:"📋 Reforma parcial: solo simplificación tributaria para pymes, sin tocar grandes fortunas.", efectos:{ipc:-1,deuda:-2,reservas:1,riesgo:0,pobreza:-2,desocupacion:-1,produccion:2,confianza:3} },
      { texto:"📉 Reforma regresiva: bajar el impuesto a las ganancias corporativas para atraer inversión extranjera.", efectos:{ipc:0,deuda:-1,reservas:0,riesgo:-4,pobreza:2,desocupacion:-2,produccion:5,confianza:-4}, chain:{eventId:7,delayTurns:6} },
      { texto:"🚫 Suspender la reforma: el Congreso no tiene los votos y el conflicto político es demasiado alto.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-3} },
    ]
  },
  {
    id:10, tag:"⚡ Energía",
    titulo:"Apagones Masivos en Plena Ola de Calor",
    descripcion:"El sistema interconectado nacional colapsa durante una ola de calor histórica de 42°C. Los apagones afectan a 15 millones de personas durante más de 12 horas. Las industrias paralizan su producción. Los hospitales funcionan con generadores de emergencia. Las pérdidas económicas se estiman en USD 800 millones por día. La infraestructura energética no se ha renovado en décadas y el déficit del sector supera el 30% del PBI. Necesitás actuar ya.",
    imagen:"https://picsum.photos/seed/energy-crisis-10/800/360",
    opciones:[
      { texto:"🏗️ Plan de inversión en infraestructura eléctrica: licitación pública de emergencia de nuevas plantas.", efectos:{ipc:2,deuda:5,reservas:-3,riesgo:-3,pobreza:-1,desocupacion:-4,produccion:4,confianza:7}, duracion:4, efectosPersistentes:{produccion:1,desocupacion:-0.5} },
      { texto:"🌱 Transición a energías renovables acelerada: parques eólicos y solares en 24 meses.", efectos:{ipc:1,deuda:7,reservas:-4,riesgo:-2,pobreza:-1,desocupacion:-5,produccion:3,confianza:5}, duracion:6, efectosPersistentes:{produccion:0.8,desocupacion:-0.5,riesgo:-0.3} },
      { texto:"🛢️ Aumentar importación de gas natural licuado (GNL): solución de corto plazo para la demanda inmediata.", efectos:{ipc:4,deuda:3,reservas:-7,riesgo:1,pobreza:1,desocupacion:0,produccion:5,confianza:2} },
    ]
  },
  {
    id:11, tag:"💼 Inversión Extranjera",
    titulo:"Megaoferta por el Litio de la Puna",
    descripcion:"Un consorcio europeo-asiático ofrece USD 8.000 millones para desarrollar el yacimiento de litio de Puna-Norte, el segundo más grande del mundo. La condición: exención impositiva por 15 años, repatriación irrestricta de utilidades y no sindicalización de los trabajadores. Los ambientalistas advierten sobre el impacto en los humedales. Las comunidades originarias piden ser consultadas. La presión del mercado de baterías eléctricas es enorme.",
    imagen:"https://picsum.photos/seed/lithium-invest-11/800/360",
    opciones:[
      { texto:"✅ Aceptar las condiciones tal como vienen: el desarrollo económico es prioritario ahora.", efectos:{ipc:-1,deuda:-3,reservas:10,riesgo:-8,pobreza:-4,desocupacion:-5,produccion:9,confianza:4} },
      { texto:"🤝 Negociar: exigir 30% de empleo local, evaluación ambiental y 10% de regalías para comunidades.", efectos:{ipc:-1,deuda:-1,reservas:5,riesgo:-4,pobreza:-2,desocupacion:-3,produccion:5,confianza:7}, duracion:5, efectosPersistentes:{produccion:1,reservas:0.8,desocupacion:-0.5} },
      { texto:"🌿 Rechazar la oferta: proteger los humedales y consultar previamente a las comunidades indígenas.", efectos:{ipc:0,deuda:0,reservas:-2,riesgo:3,pobreza:0,desocupacion:1,produccion:-1,confianza:3} },
    ]
  },
  {
    id:12, tag:"📈 Inflación",
    titulo:"Espiral Inflacionaria: 14% Mensual",
    descripcion:"El INDEC publica el dato del mes: inflación mensual del 14,2% —equivalente a 170% anual—. Los precios de los alimentos básicos suben al doble del promedio. Los comerciantes cambian los precios tres veces por semana. El salario real cayó un 35% en los últimos 12 meses. Los jubilados no llegan a fin de mes y hacen cola en los comedores públicos. Tu equipo económico está profundamente dividido sobre cómo cortar esta espiral.",
    imagen:"https://picsum.photos/seed/inflation-spiral-12/800/360",
    opciones:[
      { texto:"🔒 Plan de estabilización de shock: anclar el tipo de cambio y congelar precios 6 meses.", efectos:{ipc:-15,deuda:2,reservas:-8,riesgo:-5,pobreza:-4,desocupacion:3,produccion:-3,confianza:8}, duracion:4, efectosPersistentes:{ipc:-1.5,produccion:-0.8,reservas:-0.8} },
      { texto:"📉 Plan gradualista: bajar el déficit fiscal 1% mensual y liberar gradualmente el tipo de cambio.", efectos:{ipc:-5,deuda:-1,reservas:-3,riesgo:-3,pobreza:1,desocupacion:1,produccion:-1,confianza:2} },
      { texto:"💵 Dolarización de facto: fijar todas las transacciones al dólar libre eliminando el peso.", efectos:{ipc:-20,deuda:-2,reservas:-20,riesgo:-10,pobreza:8,desocupacion:6,produccion:-5,confianza:-5}, duracion:5, efectosPersistentes:{ipc:-1,reservas:-1.5,produccion:-0.8} },
    ]
  },
  {
    id:13, tag:"🚌 Transporte",
    titulo:"Paro General de Transporte Público",
    descripcion:"La Unión de Conductores de Transporte Automotor declara paro por 72 horas tras el fracaso de las negociaciones salariales. La capital queda paralizada. Más de 3 millones de trabajadores no pueden llegar a sus empleos. Las pérdidas económicas por jornada se estiman en $150.000 millones. Los supermercados agotan sus stocks de emergencia. Los hospitales reportan dificultades para el ingreso de personal de guardia. El caos urbano escala hora a hora.",
    imagen:"https://picsum.photos/seed/transport-strike-13/800/360",
    opciones:[
      { texto:"💰 Otorgar el aumento salarial completo: resolver el conflicto de inmediato y volver a la normalidad.", efectos:{ipc:3,deuda:2,reservas:-1,riesgo:-2,pobreza:-2,desocupacion:-1,produccion:2,confianza:7} },
      { texto:"⚖️ Mediar mediante el Ministerio de Trabajo con acuerdo intermedio del 60% de lo pedido.", efectos:{ipc:1,deuda:1,reservas:0,riesgo:-1,pobreza:-1,desocupacion:0,produccion:1,confianza:3} },
      { texto:"🚌 Declarar el transporte servicio esencial e impedir el paro por orden judicial.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:3,confianza:-8} },
    ]
  },
  {
    id:14, tag:"🌏 Relaciones Exteriores",
    titulo:"Conflicto por el Agua con País Vecino",
    descripcion:"El país vecino construye una represa sobre un río compartido que reducirá un 40% el caudal de agua que llega a la región noroeste. Los productores agrícolas de la zona están desesperados. El canciller del vecino niega la competencia de los organismos internacionales. La ICJ podría intervenir, pero el proceso llevaría años. Tu ejército solicita autorización para maniobras de 'disuasión' en la frontera. El futuro hídrico de una región entera está en juego.",
    imagen:"https://picsum.photos/seed/border-water-14/800/360",
    opciones:[
      { texto:"⚖️ Llevar el caso a organismos internacionales: OEA, ICJ y ONU como árbitros legítimos.", efectos:{ipc:0,deuda:1,reservas:-1,riesgo:-3,pobreza:0,desocupacion:0,produccion:-1,confianza:5} },
      { texto:"🤝 Negociación bilateral directa: ofrecer compensaciones económicas a cambio del agua garantizada.", efectos:{ipc:0,deuda:2,reservas:-2,riesgo:-5,pobreza:0,desocupacion:0,produccion:0,confianza:4} },
      { texto:"🪖 Autorizar maniobras militares de disuasión en la zona fronteriza.", efectos:{ipc:1,deuda:2,reservas:-3,riesgo:8,pobreza:0,desocupacion:0,produccion:-1,confianza:-3} },
    ]
  },
  {
    id:15, tag:"👴 Seguridad Social",
    titulo:"Bomba de Tiempo Previsional",
    descripcion:"El sistema jubilatorio enfrenta un déficit que consume el 10% del PBI. Con una población envejecida, los actuarios proyectan que en 3 años el sistema será insostenible. El ministro de Economía propone elevar la edad jubilatoria a 67 años, reducir los beneficios diferenciales y crear cuentas de capitalización individual. Los jubilados, sindicatos y movimientos sociales organizan protestas multitudinarias. La bomba previsional explota políticamente.",
    imagen:"https://picsum.photos/seed/pension-reform-15/800/360",
    opciones:[
      { texto:"⚖️ Reforma moderada: elevar la edad a 65 años y crear un fondo de sustentabilidad con Ganancias.", efectos:{ipc:-1,deuda:-4,reservas:2,riesgo:-5,pobreza:2,desocupacion:0,produccion:1,confianza:-5}, duracion:4, efectosPersistentes:{deuda:-0.8,riesgo:-0.5} },
      { texto:"🏦 Reforma estructural: privatización parcial con cuentas individuales de capitalización.", efectos:{ipc:0,deuda:-7,reservas:3,riesgo:-8,pobreza:5,desocupacion:0,produccion:2,confianza:-12}, duracion:5, efectosPersistentes:{deuda:-1,riesgo:-0.5,confianza:-0.8} },
      { texto:"🔴 No reformar: inyección fiscal para sostener el sistema actual por 4 años más.", efectos:{ipc:5,deuda:6,reservas:-4,riesgo:4,pobreza:-3,desocupacion:0,produccion:0,confianza:6}, duracion:5, efectosPersistentes:{ipc:1,deuda:1} },
    ]
  },
  {
    id:16, tag:"💊 Salud",
    titulo:"Desabastecimiento de Medicamentos Esenciales",
    descripcion:"Las farmacias de todo el país reportan faltante de 120 medicamentos esenciales de la lista del Formulario Terapéutico Nacional: insulina, quimioterápicos y antihipertensivos. El problema es triple: falta de divisas para importar, precios desactualizados que desincentivan la producción local y demoras en aprobación de genéricos. Pacientes crónicos están sin medicación. La emergencia silenciosa escala en número de afectados día a día.",
    imagen:"https://picsum.photos/seed/medicine-shortage-16/800/360",
    opciones:[
      { texto:"🏥 Importación de emergencia estatal: el gobierno compra directamente en el exterior para los más críticos.", efectos:{ipc:1,deuda:2,reservas:-5,riesgo:0,pobreza:-5,desocupacion:0,produccion:0,confianza:10} },
      { texto:"🏭 Subsidiar la producción pública de medicamentos en laboratorios estatales y universitarios.", efectos:{ipc:1,deuda:3,reservas:-2,riesgo:-1,pobreza:-4,desocupacion:-3,produccion:3,confianza:8} },
      { texto:"📋 Liberalizar precios de medicamentos para incentivar que el mercado resuelva el desabasto.", efectos:{ipc:5,deuda:0,reservas:0,riesgo:-1,pobreza:3,desocupacion:0,produccion:2,confianza:-5} },
    ]
  },
  {
    id:17, tag:"💡 Economía del Conocimiento",
    titulo:"Boom de Startups y Tecnología",
    descripcion:"El país se posiciona como hub tecnológico regional: 400 startups nuevas en el último año, unicornios en fintech y agtech, y exportaciones de servicios informáticos que ya generan USD 3.000 millones anuales. El sector pide incentivos especiales, financiamiento estatal de I+D y visa para talentos internacionales. Los sindicatos advierten que el trabajo de plataformas precariza el empleo. Tenés una oportunidad histórica para dar el salto tecnológico.",
    imagen:"https://picsum.photos/seed/startup-tech-17/800/360",
    opciones:[
      { texto:"🚀 Ley de Economía del Conocimiento: incentivos fiscales, financiamiento de I+D y visas para talentos.", efectos:{ipc:-1,deuda:-1,reservas:4,riesgo:-5,pobreza:-3,desocupacion:-4,produccion:7,confianza:8}, duracion:6, efectosPersistentes:{produccion:1,reservas:0.5,desocupacion:-0.5} },
      { texto:"⚖️ Apoyo condicionado: beneficios solo si las empresas garantizan derechos laborales plenos.", efectos:{ipc:0,deuda:0,reservas:2,riesgo:-3,pobreza:-2,desocupacion:-2,produccion:4,confianza:5}, duracion:4, efectosPersistentes:{produccion:0.8,desocupacion:-0.3} },
      { texto:"🚫 Priorizar la industria tradicional: los beneficios al software benefician solo a las élites.", efectos:{ipc:0,deuda:0,reservas:-1,riesgo:2,pobreza:0,desocupacion:0,produccion:1,confianza:-2} },
    ]
  },
  {
    id:18, tag:"🏭 Industria",
    titulo:"Guerra Comercial: Proteccionismo vs. Libre Comercio",
    descripcion:"Los grandes sindicatos de la industria automotriz, del acero y del aluminio amenazan con paralizar plantas si el gobierno no impone barreras a las importaciones que compiten con la producción nacional. Las empresas argumentan que no pueden competir con la subvaluación de monedas extranjeras. Los exportadores de commodities advierten que las trabas generarán represalias comerciales. El dilema entre proteccionismo y libre comercio es el debate económico central.",
    imagen:"https://picsum.photos/seed/industry-trade-18/800/360",
    opciones:[
      { texto:"🛡️ Aranceles y licencias no automáticas a importaciones de manufacturas industriales.", efectos:{ipc:4,deuda:0,reservas:-1,riesgo:3,pobreza:-2,desocupacion:-4,produccion:6,confianza:5} },
      { texto:"🤝 Negociar acuerdos de reciprocidad comercial con países de la región.", efectos:{ipc:1,deuda:0,reservas:1,riesgo:-1,pobreza:-1,desocupacion:-2,produccion:3,confianza:4} },
      { texto:"🌐 Apertura comercial: la competencia baja precios para los consumidores y mejora la eficiencia.", efectos:{ipc:-3,deuda:0,reservas:2,riesgo:-3,pobreza:2,desocupacion:3,produccion:-4,confianza:-3} },
    ]
  },
  {
    id:19, tag:"🌊 Desastre Natural",
    titulo:"Inundaciones Devastadoras en el Litoral",
    descripcion:"Lluvias extraordinarias durante 15 días seguidos provocan las inundaciones más graves en 80 años. Más de 200.000 personas deben evacuar sus hogares en la región litoral. Puentes y rutas cortadas aislan ciudades enteras. Las pérdidas en el sector agropecuario superan los USD 2.000 millones. El Estado nacional enfrenta un pedido urgente de asistencia que pone a prueba su capacidad de respuesta y su solidaridad federal.",
    imagen:"https://picsum.photos/seed/flooding-litoral-19/800/360",
    opciones:[
      { texto:"🚨 Emergencia nacional: desplegar fuerzas armadas, gendarmería y asistencia integral del Estado.", efectos:{ipc:2,deuda:4,reservas:-3,riesgo:-1,pobreza:-4,desocupacion:-2,produccion:-2,confianza:13} },
      { texto:"🤝 Asistencia coordinada con ONGs, Cruz Roja y municipios: respuesta descentralizada y ágil.", efectos:{ipc:1,deuda:1,reservas:-1,riesgo:0,pobreza:-2,desocupacion:-1,produccion:-1,confianza:8} },
      { texto:"📋 Declarar zona de desastre y delegar completamente a las provincias sin asistencia fiscal.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:3,desocupacion:0,produccion:-2,confianza:-7} },
    ]
  },
  {
    id:20, tag:"🏢 Estado",
    titulo:"Privatización de Empresas Públicas",
    descripcion:"Think-tanks económicos y el FMI presionan para privatizar las empresas estatales deficitarias: la aerolínea de bandera (pérdidas de $80.000M/año), la empresa ferroviaria obsoleta y los astilleros nacionales. Los trabajadores de esas empresas, con tradición sindical centenaria, ocupan las instalaciones preventivamente. La oposición sostiene que privatizar en este contexto es 'soldar el barco mientras se hunde'. El rol del Estado en la economía se pone en debate abierto.",
    imagen:"https://picsum.photos/seed/privatization-20/800/360",
    opciones:[
      { texto:"🏢 Privatización total: vender todas las empresas deficitarias al mejor postor internacional.", efectos:{ipc:-2,deuda:-6,reservas:4,riesgo:-7,pobreza:4,desocupacion:7,produccion:2,confianza:-8} },
      { texto:"🤝 PPP: asociar al Estado con privados manteniendo el 51% de las acciones estratégicas.", efectos:{ipc:-1,deuda:-2,reservas:2,riesgo:-4,pobreza:1,desocupacion:1,produccion:3,confianza:1} },
      { texto:"🏭 Reconversión con inversión pública: modernizar las empresas sin privatizar ni despedir.", efectos:{ipc:1,deuda:4,reservas:-2,riesgo:2,pobreza:-1,desocupacion:-3,produccion:5,confianza:5} },
      { texto:"🚫 No tocar nada: sostener las empresas públicas como fuente de empleo y soberanía estatal.", efectos:{ipc:3,deuda:5,reservas:-2,riesgo:3,pobreza:-2,desocupacion:-4,produccion:-1,confianza:4} },
    ]
  },
  {
    id:21, tag:"🏦 Tensión con FMI",
    titulo:"Incumplimiento de Metas Fiscales",
    descripcion:"El Ministerio de Economía informa que el déficit fiscal del trimestre superó en un 40% la meta acordada con el FMI. El directorio del Fondo evaluará si continuar con los desembolsos del programa Stand-By. Si se cortan, las reservas caerían a niveles críticos en semanas. La misión técnica del FMI llega en 72 horas. Tenés que preparar una respuesta que convenza a los acreedores sin destruir el tejido social que sostiene la gobernabilidad.",
    imagen:"https://picsum.photos/seed/fmi-targets-21/800/360",
    opciones:[
      { texto:"✂️ Ajuste de emergencia: recortar gastos en educación y salud para cumplir la meta inmediatamente.", efectos:{ipc:-3,deuda:-2,reservas:3,riesgo:-10,pobreza:6,desocupacion:3,produccion:-2,confianza:-10} },
      { texto:"📊 Presentar un plan alternativo de cumplimiento gradual con plazos extendidos.", efectos:{ipc:-1,deuda:-1,reservas:1,riesgo:-4,pobreza:1,desocupacion:0,produccion:0,confianza:-2} },
      { texto:"🚀 Buscar financiamiento alternativo en China, Rusia o países del Golfo Pérsico.", efectos:{ipc:2,deuda:5,reservas:7,riesgo:3,pobreza:-1,desocupacion:0,produccion:1,confianza:2} },
    ]
  },
  {
    id:22, tag:"🔴 Corrupción",
    titulo:"Espionaje Ilegal a Periodistas y Opositores",
    descripcion:"El diario de mayor circulación revela que la Agencia Federal de Inteligencia (AFI), bajo órdenes directas de tu gobierno, intervino ilegalmente los teléfonos de 40 periodistas de investigación, 12 dirigentes opositores y 3 jueces. Los audios filtrados son devastadores. La Fiscalía abre investigación penal. El escándalo recorre el mundo. La libertad de prensa y el Estado de Derecho están en el centro del debate. Tu credibilidad democrática está en juego.",
    imagen:"https://picsum.photos/seed/espionage-22/800/360",
    opciones:[
      { texto:"⚖️ Intervenir la AFI, colaborar con la Justicia y pedir disculpas públicas genuinas.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-4,pobreza:0,desocupacion:0,produccion:0,confianza:10} },
      { texto:"🔇 Calificar las revelaciones de 'montaje mediático' sin tomar ninguna medida.", corrupta:true, efectos:{ipc:0,deuda:0,reservas:0,riesgo:5,pobreza:0,desocupacion:0,produccion:0,confianza:-16} },
      { texto:"👤 Despedir al director de la AFI como chivo expiatorio sin asumir responsabilidades institucionales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-4} },
    ]
  },
  {
    id:23, tag:"🎓 Educación",
    titulo:"Crisis Presupuestaria Universitaria",
    descripcion:"Las 57 universidades nacionales informan que sus partidas presupuestarias perdieron el 47% de su valor real por la inflación. Los rectorados advierten que no podrán pagar los servicios básicos a partir del mes próximo. Miles de docentes e investigadores planean emigrar al exterior. El movimiento estudiantil convoca a una marcha universitaria que se perfila como la más grande desde el retorno de la democracia. La noche de los bastones largos es el fantasma que recorre los campus.",
    imagen:"https://picsum.photos/seed/university-23/800/360",
    opciones:[
      { texto:"📚 Actualizar los presupuestos universitarios al 100% de la inflación del período.", efectos:{ipc:1,deuda:3,reservas:-1,riesgo:-2,pobreza:-2,desocupacion:-3,produccion:2,confianza:12} },
      { texto:"⚖️ Aumento parcial del 60% con auditoría de eficiencia universitaria como condición.", efectos:{ipc:1,deuda:1,reservas:0,riesgo:-1,pobreza:-1,desocupacion:-1,produccion:1,confianza:5} },
      { texto:"🚫 Mantener el presupuesto actual: el ajuste es necesario también en las universidades.", efectos:{ipc:0,deuda:-1,reservas:0,riesgo:2,pobreza:1,desocupacion:2,produccion:-1,confianza:-14} },
    ]
  },
  {
    id:24, tag:"🌾 Agroexportaciones",
    titulo:"Cosecha Récord: El Campo No Liquida",
    descripcion:"La Bolsa de Cereales proyecta la cosecha más grande en 40 años: 140 millones de toneladas con precios internacionales en máximos históricos. El campo podría liquidar USD 25.000 millones en divisas. Sin embargo, los productores retienen la soja a la espera de una baja de retenciones. El Banco Central necesita esas divisas desesperadamente para sostener el tipo de cambio. La tensión entre el campo y el Estado llega a su punto máximo histórico.",
    imagen:"https://picsum.photos/seed/harvest-soja-24/800/360",
    opciones:[
      { texto:"💱 'Dólar soja': tipo de cambio diferencial y temporario para incentivar las liquidaciones.", efectos:{ipc:4,deuda:-2,reservas:12,riesgo:-6,pobreza:-1,desocupacion:-2,produccion:5,confianza:2} },
      { texto:"📉 Bajar las retenciones a las exportaciones 5 puntos de manera permanente.", efectos:{ipc:1,deuda:-1,reservas:9,riesgo:-5,pobreza:-1,desocupacion:-1,produccion:4,confianza:3} },
      { texto:"🔒 No ceder: sostener las retenciones y esperar que el mercado liquide naturalmente.", efectos:{ipc:2,deuda:0,reservas:2,riesgo:3,pobreza:0,desocupacion:0,produccion:2,confianza:0} },
    ]
  },
  {
    id:25, tag:"💻 Ciberseguridad",
    titulo:"Ciberataque a la Infraestructura del Estado",
    descripcion:"Un sofisticado ataque de ransomware paraliza los sistemas informáticos del Banco Central, el ANSES, el Registro Nacional y los hospitales públicos. Los datos de 30 millones de ciudadanos están en riesgo. Los atacantes exigen USD 50 millones en criptomonedas. El acceso a pensiones, salarios estatales y prestaciones sociales está bloqueado. La inteligencia cibernética del Estado es insuficiente y el tiempo corre en contra.",
    imagen:"https://picsum.photos/seed/cyberattack-25/800/360",
    opciones:[
      { texto:"💻 No pagar: contratar empresa internacional de ciberseguridad para recuperar los sistemas.", efectos:{ipc:0,deuda:2,reservas:-3,riesgo:3,pobreza:2,desocupacion:0,produccion:-3,confianza:-4} },
      { texto:"💰 Pagar el rescate: recuperar los sistemas en 48 horas y minimizar el daño ciudadano.", efectos:{ipc:0,deuda:1,reservas:-2,riesgo:5,pobreza:0,desocupacion:0,produccion:0,confianza:-7} },
      { texto:"🛡️ Crear la Agencia Nacional de Ciberseguridad: inversión en soberanía digital a largo plazo.", efectos:{ipc:0,deuda:3,reservas:-4,riesgo:-2,pobreza:0,desocupacion:-2,produccion:2,confianza:6} },
    ]
  },
  {
    id:26, tag:"💱 Debate Monetario",
    titulo:"Propuesta de Dolarización Total",
    descripcion:"Un bloque opositor presenta un proyecto de ley para dolarizar completamente la economía: eliminar el peso, adoptar el dólar y disolver el Banco Central. La propuesta tiene apoyo del 60% de la ciudadanía harta de la inflación crónica. Economistas de renombre mundial están profundamente divididos. Los expertos que se oponen advierten sobre la pérdida del instrumento monetario en caso de shocks externos. Es el debate económico más profundo de tu gestión.",
    imagen:"https://picsum.photos/seed/dollarization-26/800/360",
    opciones:[
      { texto:"💵 Apoyar la dolarización completa: responder al mandato ciudadano y a la necesidad histórica.", efectos:{ipc:-18,deuda:-3,reservas:-22,riesgo:-12,pobreza:7,desocupacion:8,produccion:-5,confianza:5} },
      { texto:"🏦 Bimonetarismo controlado: permitir que el dólar y el peso convivan legalmente.", efectos:{ipc:-8,deuda:0,reservas:-5,riesgo:-6,pobreza:2,desocupacion:2,produccion:0,confianza:3} },
      { texto:"🚫 Rechazar la dolarización: defender la soberanía monetaria y el Banco Central.", efectos:{ipc:2,deuda:0,reservas:2,riesgo:4,pobreza:0,desocupacion:0,produccion:1,confianza:-4} },
      { texto:"📊 Convocar un referéndum ciudadano sobre el tema en 6 meses.", efectos:{ipc:1,deuda:0,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:6} },
    ]
  },
  {
    id:27, tag:"⚖️ Derechos Humanos",
    titulo:"Oleada de Femicidios: El País Dice Basta",
    descripcion:"Una oleada de 45 femicidios en un mes y el asesinato de una joven activista de derechos humanos desatan la movilización más grande en años. El Ni Una Menos convoca marchas en 200 ciudades del país. La Justicia y la Fiscalía piden más recursos. Los movimientos sociales exigen una Ley de Emergencia en Violencia de Género con presupuesto garantizado. El Ministerio de la Mujer tiene fondos para apenas el 15% de los centros de atención necesarios.",
    imagen:"https://picsum.photos/seed/rights-gender-27/800/360",
    opciones:[
      { texto:"💜 Ley de Emergencia: triplicar el presupuesto del Ministerio de la Mujer y crear 200 refugios.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-2,pobreza:-3,desocupacion:-1,produccion:0,confianza:13} },
      { texto:"⚖️ Reforzar el sistema judicial: más fiscales, juzgados especializados y programas de protección.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-1,pobreza:-2,desocupacion:-1,produccion:0,confianza:8} },
      { texto:"📋 Comprometerse a revisar la legislación pero sin fondos adicionales inmediatos.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-8} },
    ]
  },
  {
    id:28, tag:"🏦 Sistema Financiero",
    titulo:"Corrida Bancaria: El Sistema Tambalea",
    descripcion:"Un banco de tamaño mediano quiebra de forma imprevista tras revelarse irregularidades contables. El pánico se extiende: en 48 horas, los depositantes retiran $800.000 millones del sistema. Los bancos más pequeños son los más vulnerables. El Banco Central tiene reservas insuficientes para cubrir todos los depósitos. El fantasma del corralito del 2001 se cierne sobre el país. Cada hora sin respuesta agrava el pánico.",
    imagen:"https://picsum.photos/seed/bank-run-28/800/360",
    opciones:[
      { texto:"🔒 Garantizar todos los depósitos con respaldo del Tesoro: salvar el sistema bancario completo.", efectos:{ipc:5,deuda:8,reservas:-10,riesgo:-8,pobreza:-2,desocupacion:0,produccion:-1,confianza:9} },
      { texto:"🏦 Rescate selectivo: solo garantizar pequeños ahorristas hasta $10 millones.", efectos:{ipc:3,deuda:4,reservas:-5,riesgo:-3,pobreza:-1,desocupacion:0,produccion:-2,confianza:4} },
      { texto:"🌍 Solicitar prestamista de última instancia al FMI o Bancos de Desarrollo Regionales.", efectos:{ipc:1,deuda:6,reservas:5,riesgo:-5,pobreza:0,desocupacion:0,produccion:0,confianza:2} },
    ]
  },
  {
    id:29, tag:"🏥 Crisis Sanitaria Social",
    titulo:"Emergencia en los Barrios Populares",
    descripcion:"Un brote de leptospirosis y síndrome urémico en asentamientos periféricos revela la gravedad de la crisis sanitaria-habitacional. El 40% de los barrios populares no tiene agua potable ni cloacas. La mortalidad infantil en estas zonas triplica la media nacional. Los hospitales del conurbano están al 150% de capacidad. Médicos comunitarios llevan meses alertando sobre esta situación sin respuesta del Estado. Las imágenes dan vuelta al mundo.",
    imagen:"https://picsum.photos/seed/slum-health-29/800/360",
    opciones:[
      { texto:"🏗️ Plan Nacional de Urbanización: agua potable, cloacas y viviendas en 18 meses.", efectos:{ipc:1,deuda:5,reservas:-3,riesgo:-2,pobreza:-8,desocupacion:-5,produccion:3,confianza:11} },
      { texto:"🏥 Reforzar la atención primaria: médicos comunitarios en cada barrio del país.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-1,pobreza:-4,desocupacion:-2,produccion:0,confianza:7} },
      { texto:"📋 Diagnóstico y plan a largo plazo: crear un comité de expertos para diseñar políticas en 2 años.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:2,desocupacion:0,produccion:0,confianza:-6} },
    ]
  },
  {
    id:30, tag:"🏠 Vivienda",
    titulo:"Colapso del Mercado de Alquileres",
    descripcion:"El mercado inmobiliario colapsó: hay 60% menos oferta de alquileres que hace 3 años, los precios aumentan un 180% anual y las desalojaciones forzosas se multiplican. Familias con hijos viven en autos y plazas. Los propietarios retiran inmuebles del mercado y los convierten en alquileres turísticos en dólares. El debate entre derechos de inquilinos y derechos de propiedad divide a la sociedad y al Congreso.",
    imagen:"https://picsum.photos/seed/housing-crisis-30/800/360",
    opciones:[
      { texto:"⚖️ Ley de Alquileres pro-inquilino: contratos a 3 años con actualización por CER.", efectos:{ipc:-1,deuda:1,reservas:0,riesgo:1,pobreza:-4,desocupacion:0,produccion:-1,confianza:8} },
      { texto:"🏗️ Plan Nacional de Vivienda Pública: construir 200.000 unidades habitacionales en 2 años.", efectos:{ipc:2,deuda:5,reservas:-3,riesgo:-1,pobreza:-6,desocupacion:-7,produccion:5,confianza:10} },
      { texto:"🏢 Incentivos al mercado: desgravaciones impositivas a propietarios que alquilen a largo plazo.", efectos:{ipc:0,deuda:-1,reservas:0,riesgo:-2,pobreza:-2,desocupacion:0,produccion:0,confianza:2} },
    ]
  },
  {
    id:31, tag:"⛽ Recursos Naturales",
    titulo:"Descubrimiento de Petróleo Offshore Patagónico",
    descripcion:"YPF y una empresa noruega confirman el hallazgo de un yacimiento offshore de clase mundial frente a las costas patagónicas: reservas estimadas en 4.000 millones de barriles. La explotación podría generar USD 20.000 millones anuales en 10 años. Los ambientalistas advierten sobre el riesgo de un derrame que destruiría los ecosistemas marinos únicos de la Patagonia. Las comunidades costeras están divididas. El petróleo puede ser maldición o milagro.",
    imagen:"https://picsum.photos/seed/offshore-oil-31/800/360",
    opciones:[
      { texto:"🛢️ Explotar el yacimiento a máxima velocidad: el país necesita las divisas urgentemente.", efectos:{ipc:-2,deuda:-8,reservas:12,riesgo:-10,pobreza:-5,desocupacion:-5,produccion:10,confianza:6} },
      { texto:"🌿 Explotar con Evaluación de Impacto Ambiental rigurosa y ritmo moderado y sostenido.", efectos:{ipc:-1,deuda:-4,reservas:6,riesgo:-5,pobreza:-2,desocupacion:-3,produccion:5,confianza:8} },
      { texto:"🚫 Declarar el área Reserva Marina: preservar el ecosistema para las generaciones futuras.", efectos:{ipc:0,deuda:0,reservas:-2,riesgo:3,pobreza:0,desocupacion:0,produccion:-1,confianza:5} },
    ]
  },
  {
    id:32, tag:"🌐 Soberanía Sanitaria",
    titulo:"Multinacional Farmacéutica Demanda al Estado",
    descripcion:"Una multinacional farmacéutica amenaza con demandar al Estado ante el CIADI por USD 4.000 millones alegando que una ley de producción local de medicamentos viola sus derechos de propiedad intelectual. El medicamento afecta a 200.000 pacientes crónicos. Perder el juicio implicaría una deuda impagable. Los TLCs firmados hace 20 años están en el centro del debate. ¿Cómo defendés la soberanía sanitaria del país?",
    imagen:"https://picsum.photos/seed/pharma-32/800/360",
    opciones:[
      { texto:"⚖️ Litigar en el CIADI con los mejores abogados internacionales especializados.", efectos:{ipc:0,deuda:2,reservas:-2,riesgo:2,pobreza:-3,desocupacion:0,produccion:0,confianza:6} },
      { texto:"🤝 Negociar un acuerdo extrajudicial: compensación módica a cambio de mantener la ley vigente.", efectos:{ipc:0,deuda:3,reservas:-3,riesgo:-2,pobreza:-3,desocupacion:0,produccion:0,confianza:4} },
      { texto:"🚀 Derogar la ley: ceder ante la multinacional para evitar el costoso juicio internacional.", efectos:{ipc:3,deuda:0,reservas:0,riesgo:-4,pobreza:5,desocupacion:0,produccion:0,confianza:-9} },
    ]
  },
  {
    id:33, tag:"🎓 Reforma Educativa",
    titulo:"Debate por el Nuevo Currículum Escolar",
    descripcion:"Tu Ministro de Educación propone incorporar pensamiento computacional, educación financiera y sexualidad integral (ESI) como materias obligatorias en la secundaria, eliminando Historia del Arte y Filosofía de cuarto y quinto año. Los docentes de esas materias amenazan con huelga. La Iglesia Católica rechaza la ESI obligatoria. Los tecnólogos y empresarios aplauden. El debate sobre qué tipo de ciudadanos queremos formar toca fibras profundas de la identidad cultural.",
    imagen:"https://picsum.photos/seed/edu-reform-33/800/360",
    opciones:[
      { texto:"💻 Reforma completa: nuevas materias obligatorias incluyendo ESI sin excepciones.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-2,pobreza:-2,desocupacion:-1,produccion:2,confianza:5} },
      { texto:"⚖️ Reforma parcial: agregar las nuevas materias sin eliminar las humanísticas clásicas.", efectos:{ipc:0,deuda:3,reservas:-1,riesgo:-1,pobreza:-1,desocupacion:-1,produccion:1,confianza:6} },
      { texto:"🚫 Suspender la reforma: el conflicto docente y eclesial es políticamente insostenible.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-3} },
    ]
  },
  {
    id:34, tag:"🌍 Migración",
    titulo:"Crisis de Refugiados en la Frontera",
    descripcion:"Una crisis política en un país vecino genera un flujo masivo de 400.000 refugiados en 6 meses. Los servicios de salud, vivienda y educación de las ciudades fronterizas están al límite. Los sindicatos advierten sobre presión en el mercado laboral informal. Algunos sectores empresariales celebran la llegada de fuerza de trabajo calificada. Las organizaciones de DDHH exigen integración plena. La xenofobia crece en redes sociales y la opinión pública está dividida.",
    imagen:"https://picsum.photos/seed/refugees-34/800/360",
    opciones:[
      { texto:"🤝 Programa de integración: documentación rápida, empleo formal y acceso pleno a servicios.", efectos:{ipc:1,deuda:3,reservas:-2,riesgo:-2,pobreza:-2,desocupacion:2,produccion:3,confianza:7} },
      { texto:"🏕️ Campos de refugiados: asistencia humanitaria controlada en zonas delimitadas.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:0} },
      { texto:"🚫 Cierre de fronteras: deportar a quienes no acrediten peligro real e inminente.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:4,pobreza:0,desocupacion:0,produccion:-1,confianza:-6} },
    ]
  },
  {
    id:35, tag:"⚡ Crisis de Gas",
    titulo:"Corte de Suministro de Gas Importado",
    descripcion:"El principal proveedor de gas natural licuado suspende los envíos alegando incumplimientos de pago por USD 600 millones. La interrupción ocurre en pleno invierno con temperaturas de -5°C. Las industrias deben bajar su producción al 50%. Los hogares del sur del país enfrentan cortes de calefacción. El Ministerio de Energía calcula que el sistema podría colapsar completamente en 10 días si no se consigue un proveedor alternativo.",
    imagen:"https://picsum.photos/seed/gas-shortage-35/800/360",
    opciones:[
      { texto:"💰 Pagar la deuda con el proveedor y reanudar el suministro de inmediato antes del colapso.", efectos:{ipc:2,deuda:2,reservas:-8,riesgo:-4,pobreza:0,desocupacion:0,produccion:4,confianza:5} },
      { texto:"🌍 Buscar proveedores alternativos de emergencia en el mercado spot internacional.", efectos:{ipc:4,deuda:3,reservas:-10,riesgo:0,pobreza:1,desocupacion:0,produccion:3,confianza:2} },
      { texto:"🕯️ Plan de racionamiento: cortes rotativos programados para distribuir el gas disponible.", efectos:{ipc:2,deuda:0,reservas:-2,riesgo:3,pobreza:3,desocupacion:1,produccion:-4,confianza:-6} },
    ]
  },


  // ── EVENTOS ORIGINALES 36–70 ───────────────────────────────
  {
    id:36, tag:"🔴 Corrupción",
    titulo:"Licitación Vial Manipulada: Tu Propio Entorno",
    descripcion:"La Oficina Anticorrupción detecta que la licitación de la nueva autopista norte-sur fue manipulada: el pliego técnico fue diseñado a medida de una empresa constructora vinculada a un empresario cercano al poder. La sobrevaluación es del 80% y el anticipo ya fue abonado. El titular de la Dirección Nacional de Vialidad es tu cuñado. El fiscal federal pide la nulidad del contrato. La corrupción llegó a tu círculo íntimo.",
    imagen:"https://picsum.photos/seed/corruption-vial-36/800/360",
    opciones:[
      { texto:"⚖️ Anular el contrato, remover a tu cuñado y entregar todo a la justicia sin condicionamientos.", efectos:{ipc:0,deuda:-3,reservas:0,riesgo:-6,pobreza:0,desocupacion:0,produccion:-1,confianza:16} },
      { texto:"🔄 Relicitar la obra bajo condiciones transparentes pero sin investigar el caso anterior.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:0,confianza:5} },
      { texto:"🛡️ Defender la licitación como legal y bloquear la investigación judicial.", corrupta:true, efectos:{ipc:0,deuda:2,reservas:0,riesgo:6,pobreza:0,desocupacion:0,produccion:0,confianza:-20} },
    ]
  },
  {
    id:37, tag:"🏛️ Reforma del Estado",
    titulo:"¿Cuántos Ministerios Necesita el País?",
    descripcion:"Tu gabinete debate reducir el número de ministerios de 22 a 12, fusionando áreas y eliminando organismos 'redundantes'. Los empleados públicos organizan paros. La oposición acusa de vaciamiento del Estado. Los economistas ortodoxos aplauden la señal de austeridad. Los heterodoxos advierten que el Estado es el empleador de última instancia y garante de derechos fundamentales. La eficiencia versus el rol social del Estado se debate en cada mesa del país.",
    imagen:"https://picsum.photos/seed/state-reform-37/800/360",
    opciones:[
      { texto:"✂️ Reducción drástica: fusionar ministerios y despedir empleados considerados redundantes.", efectos:{ipc:-2,deuda:-5,reservas:2,riesgo:-6,pobreza:5,desocupacion:4,produccion:1,confianza:-7} },
      { texto:"⚖️ Reforma gradual: fusionar sin despidos, solo a través de jubilaciones y pases voluntarios.", efectos:{ipc:-1,deuda:-2,reservas:1,riesgo:-3,pobreza:1,desocupacion:1,produccion:0,confianza:-2} },
      { texto:"🔄 Modernización digital: informatización de trámites sin reducir el personal estatal.", efectos:{ipc:0,deuda:1,reservas:-1,riesgo:-1,pobreza:0,desocupacion:-1,produccion:2,confianza:4} },
      { texto:"🚫 No reformar: el tamaño del Estado refleja necesidades reales de la población.", efectos:{ipc:1,deuda:1,reservas:0,riesgo:2,pobreza:-1,desocupacion:-1,produccion:0,confianza:3} },
    ]
  },
  {
    id:38, tag:"⚖️ Seguridad",
    titulo:"Motín Carcelario: El Sistema Penal Colapsa",
    descripcion:"Un motín en la cárcel más grande del país deja 18 presos muertos y 60 heridos. Las imágenes del interior revelan celdas con 5 veces su capacidad, infestadas de ratas, sin agua caliente ni atención médica. El Comité contra la Tortura de la ONU emite un informe lapidario. El 65% de los presos están en prisión preventiva sin condena firme. La sociedad debate entre más mano dura y reforma del sistema penal integral.",
    imagen:"https://picsum.photos/seed/prison-riot-38/800/360",
    opciones:[
      { texto:"⚖️ Reforma penal integral: juicio abreviado, tobilleras electrónicas y cárceles abiertas.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-3,pobreza:-2,desocupacion:-1,produccion:0,confianza:5} },
      { texto:"🏗️ Construir nuevas cárceles y ampliar la infraestructura penitenciaria urgentemente.", efectos:{ipc:0,deuda:3,reservas:-2,riesgo:-2,pobreza:0,desocupacion:-3,produccion:1,confianza:3} },
      { texto:"🔒 Mano dura: reforzar la presencia de fuerzas federales en cárceles, sin reforma de fondo.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-1,pobreza:0,desocupacion:0,produccion:0,confianza:-2} },
    ]
  },
  {
    id:39, tag:"🦠 Pandemia",
    titulo:"Nuevo Brote de Influenza Aviar H5N2",
    descripcion:"La OMS alerta sobre una nueva variante de influenza aviar H5N2 que ya causó 3.000 muertes en el sudeste asiático. Tu Ministerio de Salud confirma los primeros 12 casos en el aeropuerto internacional. Los epidemiólogos piden cierre de fronteras y cuarentena preventiva. Las cámaras empresariales advierten que el impacto económico de un cierre sería devastador. El fantasma de la pandemia de 2020 está fresco en la memoria colectiva del país.",
    imagen:"https://picsum.photos/seed/pandemic-new-39/800/360",
    opciones:[
      { texto:"🔒 Cierre inmediato de fronteras y cuarentena estricta: la salud sobre todo lo demás.", efectos:{ipc:3,deuda:5,reservas:-4,riesgo:2,pobreza:4,desocupacion:6,produccion:-8,confianza:6} },
      { texto:"😷 Protocolo de vigilancia intensiva: sin cierre pero con rastreo y testeo masivo sistematizado.", efectos:{ipc:1,deuda:3,reservas:-2,riesgo:0,pobreza:1,desocupacion:1,produccion:-2,confianza:5} },
      { texto:"📊 No sobreactuar: medidas mínimas de control sin alterar la vida cotidiana ni la economía.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:3,pobreza:3,desocupacion:0,produccion:0,confianza:-4} },
    ]
  },
  {
    id:40, tag:"🗳️ Elecciones",
    titulo:"Elecciones Legislativas de Medio Término",
    descripcion:"Se acercan las elecciones legislativas que renovarán la mitad del Congreso. Tu bloque perdió la mayoría en la primera vuelta y necesita alianzas urgentes. La oposición tiene expectativas de hacerse con el control de ambas cámaras, lo que paralizaría toda tu agenda de gobierno. La campaña está sucia: fake news, acusaciones cruzadas y una sociedad polarizada. Tu jefe de campaña te presenta tres estrategias antes del sprint final.",
    imagen:"https://picsum.photos/seed/elections-mid-40/800/360",
    opciones:[
      { texto:"🤝 Campaña propositiva: proponer agenda legislativa concreta, debates abiertos y propuestas claras.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-2,pobreza:-1,desocupacion:0,produccion:0,confianza:9} },
      { texto:"🗞️ Campaña de contraste: mostrar los errores de la oposición sin ofrecer propuestas propias.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:-2} },
      { texto:"🏗️ Adelantar transferencias a provincias clave priorizando distritos electorales sobre necesidad real.", corrupta:true, efectos:{ipc:4,deuda:4,reservas:-3,riesgo:2,pobreza:-4,desocupacion:-2,produccion:2,confianza:5} },
    ]
  },
  {
    id:41, tag:"🌱 Medio Ambiente",
    titulo:"Incendios en la Patagonia: El Bosque Arde",
    descripcion:"Los peores incendios forestales en 30 años arrasan 800.000 hectáreas de bosque nativo en la Patagonia andina. El viento sur activa focos en simultáneo en cuatro provincias. Los bomberos voluntarios no dan abasto y la fauna nativa está en peligro crítico. El turismo internacional, motor de la economía regional, colapsa. Las imágenes del humo cubriendo ciudades patagónicas recorren el mundo. El Estado debe actuar con rapidez y coordinación.",
    imagen:"https://picsum.photos/seed/wildfire-patagonia-41/800/360",
    opciones:[
      { texto:"🚒 Emergencia ígnea nacional: aviones hidrantes, ejército y recursos del COFEMA desplegados.", efectos:{ipc:1,deuda:3,reservas:-3,riesgo:-1,pobreza:-1,desocupacion:-2,produccion:-2,confianza:11} },
      { texto:"🌿 Campaña de reforestación urgente: brigadas comunitarias en todas las zonas afectadas.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:0,pobreza:-1,desocupacion:-3,produccion:-1,confianza:7} },
      { texto:"📋 Delegar en provincias sin recursos adicionales: el Estado nacional no tiene competencia directa.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:2,desocupacion:0,produccion:-3,confianza:-9} },
    ]
  },
  {
    id:42, tag:"🏛️ Instituciones",
    titulo:"Crisis Constitucional: El Congreso se Fractura",
    descripcion:"La oposición presenta un pedido de juicio político contra vos y logra los votos necesarios para abrir la investigación. La acusación: mal desempeño de funciones y violación de la división de poderes. Tus aliados en el Senado prometen frenar el proceso. La ciudadanía está dividida y las manifestaciones llenan las plazas de todo el país. El sistema republicano muestra sus grietas más profundas. Cada movimiento tuyo será histórico.",
    imagen:"https://picsum.photos/seed/congress-crisis-42/800/360",
    opciones:[
      { texto:"⚖️ Colaborar con el proceso constitucional: presentar toda la documentación y enfrentar el debate.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-5,pobreza:0,desocupacion:0,produccion:0,confianza:8} },
      { texto:"🤝 Acuerdo político: negociar con la oposición mediana para frenar el juicio a cambio de concesiones.", efectos:{ipc:0,deuda:2,reservas:0,riesgo:-3,pobreza:-1,desocupacion:0,produccion:0,confianza:3} },
      { texto:"📢 Campaña de comunicación agresiva: denunciar el juicio como golpe institucional en todos los medios.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:4,pobreza:0,desocupacion:0,produccion:0,confianza:-6} },
    ]
  },
  {
    id:43, tag:"💼 Empleo",
    titulo:"Plataformas Digitales vs. Sindicatos: ¿Empleo o Negocio?",
    descripcion:"Los grandes sindicatos del transporte y el comercio exigen que el Estado regule las plataformas de reparto y transporte como Rappi, Pedidos Ya y Uber. Piden encuadre laboral pleno: aportes, obra social y salario mínimo garantizado. Las empresas advierten que eso haría el modelo inviable y amenazan con irse del país. Más de 400.000 trabajadores de plataforma esperan una definición que cambiará sus vidas.",
    imagen:"https://picsum.photos/seed/gig-economy-43/800/360",
    opciones:[
      { texto:"⚖️ Ley de Trabajo de Plataformas: encuadre laboral pleno con aportes y salario mínimo garantizado.", efectos:{ipc:1,deuda:1,reservas:0,riesgo:2,pobreza:-4,desocupacion:-3,produccion:-2,confianza:9} },
      { texto:"🤝 Estatuto especial: beneficios básicos sin relación laboral clásica ni aportes completos.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:-2,desocupacion:-1,produccion:0,confianza:4} },
      { texto:"🌐 No regular: que el mercado defina las condiciones del trabajo digital sin intervención estatal.", efectos:{ipc:0,deuda:-1,reservas:0,riesgo:-2,pobreza:2,desocupacion:2,produccion:2,confianza:-5} },
    ]
  },
  {
    id:44, tag:"🌡️ Cambio Climático",
    titulo:"Ola de Calor Histórica: 47°C en el Interior",
    descripcion:"Una ola de calor sin precedentes históricos registra 47°C en Córdoba y 45°C en Santiago del Estero. Los hospitales colapsan con casos de golpe de calor. Los cortes de luz afectan a 8 millones de personas. Los cultivos de maíz y girasol se pierden en el norte. Los meteorólogos advierten que sin adaptación climática urgente, esto será la norma. El IPCC señala al país como uno de los más vulnerables de América del Sur.",
    imagen:"https://picsum.photos/seed/heatwave-44/800/360",
    opciones:[
      { texto:"🌱 Plan Nacional de Adaptación Climática: arbolado urbano, eficiencia energética y alerta temprana.", efectos:{ipc:0,deuda:4,reservas:-2,riesgo:-2,pobreza:-2,desocupacion:-3,produccion:1,confianza:8} },
      { texto:"❄️ Reforzar el sistema eléctrico: generación de emergencia y distribución prioritaria a hogares.", efectos:{ipc:2,deuda:3,reservas:-3,riesgo:-1,pobreza:-1,desocupacion:-2,produccion:2,confianza:6} },
      { texto:"📋 Declarar alerta por 30 días y esperar que pase sin inversión estructural adicional.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:2,desocupacion:0,produccion:-2,confianza:-5} },
    ]
  },
  {
    id:45, tag:"💰 Presupuesto",
    titulo:"Déficit Récord: El Presupuesto No Cierra",
    descripcion:"El Ministro de Economía te convoca de urgencia: el déficit fiscal acumulado del año ya supera en un 60% la proyección del presupuesto aprobado por el Congreso. No hay margen para seguir gastando, pero los programas sociales son la red de contención de millones de familias. Las opciones son dolorosas y políticamente costosas. Cada peso que se ahorra en un ministerio impacta directamente en alguien que lo necesita. La hora de la verdad presupuestaria.",
    imagen:"https://picsum.photos/seed/budget-deficit-45/800/360",
    opciones:[
      { texto:"✂️ Ajuste integral: recorte del 15% en todos los ministerios sin excepciones, incluidos sociales.", efectos:{ipc:-4,deuda:-6,reservas:3,riesgo:-8,pobreza:8,desocupacion:4,produccion:-2,confianza:-11} },
      { texto:"⚖️ Ajuste selectivo: recortar gastos de funcionamiento y mantener intactos los programas sociales.", efectos:{ipc:-2,deuda:-3,reservas:1,riesgo:-4,pobreza:1,desocupacion:0,produccion:-1,confianza:-3} },
      { texto:"📈 Suba de impuestos: aumentar las alícuotas de Bienes Personales y Ganancias corporativas.", efectos:{ipc:-1,deuda:-4,reservas:2,riesgo:-2,pobreza:-2,desocupacion:1,produccion:-3,confianza:4} },
      { texto:"💳 Financiar el déficit con deuda interna: colocación de letras del Tesoro en el mercado doméstico.", efectos:{ipc:4,deuda:5,reservas:0,riesgo:5,pobreza:0,desocupacion:0,produccion:0,confianza:2} },
    ]
  },
  {
    id:46, tag:"🤝 Integración Regional",
    titulo:"Propuesta de Unión Monetaria del MERCOSUR",
    descripcion:"Brasil y Uruguay proponen crear una moneda común del MERCOSUR —el 'Sur'— para reducir la dependencia del dólar en el comercio regional. El proyecto implicaría ceder parte de la soberanía monetaria a un Banco Central supranacional. Las exportaciones a la región, que representan el 35% del total, se beneficiarían. Los economistas ortodoxos nacionales advierten que limita el manejo de la política monetaria en crisis. Argentina tiene que decidir en 90 días.",
    imagen:"https://picsum.photos/seed/mercosur-monetary-46/800/360",
    opciones:[
      { texto:"✅ Adherir a la unión monetaria: apostar a la integración regional y reducir la exposición al dólar.", efectos:{ipc:-3,deuda:-2,reservas:3,riesgo:-6,pobreza:-2,desocupacion:-2,produccion:4,confianza:7} },
      { texto:"🤝 Participar en el diseño pero no adoptar la moneda: ser observador con veto en el directorio.", efectos:{ipc:-1,deuda:0,reservas:0,riesgo:-3,pobreza:-1,desocupacion:-1,produccion:2,confianza:4} },
      { texto:"🚫 Rechazar: la soberanía monetaria es innegociable en el contexto económico actual.", efectos:{ipc:0,deuda:0,reservas:-1,riesgo:3,pobreza:0,desocupacion:0,produccion:-1,confianza:-3} },
    ]
  },
  {
    id:47, tag:"🧪 Ciencia y Tecnología",
    titulo:"Fuga de Cerebros: Los Científicos se Van",
    descripcion:"El CONICET registra el mayor éxodo de investigadores en la historia: 1.200 científicos se radicaron en el exterior en el último año, atraídos por salarios diez veces mayores en Europa y Norteamérica. Entre ellos hay especialistas en inteligencia artificial, bioquímica e ingeniería nuclear. Las universidades advierten que perder esta generación significa décadas de retraso tecnológico. El futuro productivo del país depende de lo que se decida ahora.",
    imagen:"https://picsum.photos/seed/brain-drain-47/800/360",
    opciones:[
      { texto:"🚀 Programa de retención: triplicar salarios del CONICET y crear polos tecnológicos con financiamiento privado.", efectos:{ipc:1,deuda:4,reservas:-2,riesgo:-3,pobreza:-2,desocupacion:-4,produccion:6,confianza:10} },
      { texto:"🌍 Programa de repatriación: subsidios y exenciones para investigadores que regresen desde el exterior.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-2,pobreza:-1,desocupacion:-2,produccion:3,confianza:6} },
      { texto:"🤝 Convenios con empresas tecnológicas: captar inversión para que investiguen desde Argentina.", efectos:{ipc:0,deuda:0,reservas:1,riesgo:-2,pobreza:-1,desocupacion:-3,produccion:5,confianza:5} },
    ]
  },
  {
    id:48, tag:"🏙️ Urbanismo",
    titulo:"Toma Masiva de Tierras en el Conurbano",
    descripcion:"Una toma organizada de 300 hectáreas en el conurbano bonaerense concentra en una semana a más de 15.000 familias sin techo. Las imágenes de niños durmiendo en carpas sin agua ni luz circulan en todos los medios. Los propietarios de los terrenos piden desalojo inmediato y la policía bonaerense espera instrucciones. Las organizaciones sociales llaman a no criminalizar la pobreza. La decisión que tomes tendrá repercusión nacional e internacional.",
    imagen:"https://picsum.photos/seed/land-takeover-48/800/360",
    opciones:[
      { texto:"🏗️ Regularizar la situación: expropiar los terrenos y urbanizar la toma con servicios básicos.", efectos:{ipc:0,deuda:5,reservas:-3,riesgo:-1,pobreza:-7,desocupacion:-4,produccion:2,confianza:10} },
      { texto:"🔄 Reubicación voluntaria: ofrecer viviendas en polígonos habitacionales fuera del área tomada.", efectos:{ipc:0,deuda:3,reservas:-2,riesgo:0,pobreza:-4,desocupacion:-2,produccion:1,confianza:5} },
      { texto:"🚔 Desalojo judicial: respetar la propiedad privada y emplazar a las familias a desalojar en 72 hs.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:5,pobreza:3,desocupacion:0,produccion:0,confianza:-12} },
    ]
  },
  {
    id:49, tag:"📡 Medios de Comunicación",
    titulo:"Concentración Mediática: La Libertad de Prensa en Debate",
    descripcion:"Un holding internacional compra el 70% de los medios gráficos, radios y portales digitales del país, incluida la agencia oficial de noticias. Periodistas y organizaciones de libertad de prensa advierten que la concentración deja a la democracia sin pluralismo informativo. Los accionistas prometen independencia editorial. El mercado celebra la inversión. El Congreso debate una Ley de Medios que el holding llama 'censura' y las ONG llaman 'necesidad democrática'.",
    imagen:"https://picsum.photos/seed/media-concentration-49/800/360",
    opciones:[
      { texto:"📰 Ley Antitrust de Medios: limitar la concentración y garantizar pluralismo mediático por ley.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-3,pobreza:0,desocupacion:-1,produccion:-1,confianza:8} },
      { texto:"💼 Aprobar la concentración con compromisos de inversión y pluralismo editorial.", efectos:{ipc:0,deuda:-1,reservas:1,riesgo:-2,pobreza:0,desocupacion:-2,produccion:2,confianza:-4} },
      { texto:"📺 Fortalecer los medios públicos: triplicar el presupuesto de la TV y radio estatal.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:0,pobreza:0,desocupacion:-1,produccion:0,confianza:4} },
    ]
  },
  {
    id:50, tag:"🌾 Soberanía Alimentaria",
    titulo:"Escasez de Alimentos Básicos en las Góndolas",
    descripcion:"Los supermercados reportan faltante sostenido de aceite, harina, azúcar y leche. Los productores retienen la mercadería esperando una devaluación, mientras las cámaras exportadoras priorizan los mercados externos con mejores precios. El programa Precios Justos no se cumple. Las familias de bajos ingresos son las más afectadas. El INDEC confirma que el gasto en alimentos ya consume el 60% del ingreso de los hogares del cuartil más bajo. La seguridad alimentaria está en riesgo.",
    imagen:"https://picsum.photos/seed/food-shortage-50/800/360",
    opciones:[
      { texto:"🔒 Restricciones a la exportación: cupos para garantizar abastecimiento interno primero.", efectos:{ipc:-3,deuda:0,reservas:-2,riesgo:2,pobreza:-5,desocupacion:-1,produccion:-2,confianza:8} },
      { texto:"💰 Subsidios directos a la canasta básica para los sectores más vulnerables.", efectos:{ipc:1,deuda:3,reservas:-2,riesgo:0,pobreza:-7,desocupacion:-1,produccion:0,confianza:10} },
      { texto:"🌐 Libre exportación: que los precios de mercado resuelvan el desabastecimiento naturalmente.", efectos:{ipc:6,deuda:-2,reservas:5,riesgo:-3,pobreza:6,desocupacion:0,produccion:3,confianza:-8} },
    ]
  },
  {
    id:51, tag:"⚗️ Industria Farmacéutica",
    titulo:"Vacuna Nacional Contra el Dengue: ¿Producción Propia?",
    descripcion:"El CONICET y la Universidad de Buenos Aires desarrollaron con éxito una vacuna contra el dengue con eficacia del 89%. El laboratorio estatal puede producirla a un costo diez veces menor que las alternativas importadas. Las farmacéuticas multinacionales presionan para que se compre su producto. Producir la vacuna localmente abre la puerta a exportarla a 15 países de la región que la necesitan urgentemente. El futuro de la industria farmacéutica nacional está en juego.",
    imagen:"https://picsum.photos/seed/vaccine-local-51/800/360",
    opciones:[
      { texto:"🏭 Producción pública masiva: financiar al laboratorio estatal para producir y exportar la vacuna.", efectos:{ipc:0,deuda:3,reservas:5,riesgo:-4,pobreza:-5,desocupacion:-4,produccion:7,confianza:12} },
      { texto:"🤝 Licencia mixta: producir localmente y también permitir la importación del producto multinacional.", efectos:{ipc:0,deuda:1,reservas:2,riesgo:-2,pobreza:-3,desocupacion:-2,produccion:3,confianza:7} },
      { texto:"💊 Comprar la vacuna importada: riesgo cero técnico pero dependencia exterior total.", efectos:{ipc:2,deuda:2,reservas:-4,riesgo:-3,pobreza:-3,desocupacion:0,produccion:-1,confianza:2} },
    ]
  },
  {
    id:52, tag:"🏦 Banca Pública",
    titulo:"El Banco Nación al Borde del Colapso",
    descripcion:"Una auditoría reservada revela que el Banco de la Nación Argentina tiene una cartera de préstamos incobrables equivalente al 40% de su activo. Años de préstamos a empresas públicas deficitarias y créditos políticos pasaron la factura. Si el BNA cae, 14 millones de ahorristas y 700.000 pymes quedarían sin acceso a sus cuentas. El Banco Central no tiene reservas suficientes para un rescate completo. La decisión debe tomarse antes de que se filtre a los medios.",
    imagen:"https://picsum.photos/seed/bna-crisis-52/800/360",
    opciones:[
      { texto:"🏦 Rescate total con fondos del Tesoro: recapitalizar el BNA y absorber la cartera incobrable.", efectos:{ipc:5,deuda:8,reservas:-6,riesgo:-5,pobreza:-2,desocupacion:0,produccion:-1,confianza:6} },
      { texto:"✂️ Reestructuración con quita: los acreedores institucionales absorben parte de las pérdidas.", efectos:{ipc:2,deuda:3,reservas:-3,riesgo:-3,pobreza:-1,desocupacion:1,produccion:-2,confianza:3} },
      { texto:"🌍 Fusión con otro banco público y venta parcial de cartera sana a privados.", efectos:{ipc:1,deuda:2,reservas:-2,riesgo:-4,pobreza:0,desocupacion:2,produccion:0,confianza:1} },
    ]
  },
  {
    id:53, tag:"🎭 Cultura",
    titulo:"Recorte al INCAA: ¿Hay Futuro para el Cine Nacional?",
    descripcion:"El Ministerio de Economía propone eliminar el fondo de fomento del INCAA —base del cine nacional— para reducir el déficit. El cine argentino ganó 3 premios Oscar en 20 años y es referencia cultural de América Latina. Los directores y actores organizan proyecciones callejeras en todo el país. Las plataformas digitales extranjeras, que no pagan impuestos locales, están devorando el mercado. ¿Vale la pena defender la identidad cultural ante las urgencias económicas?",
    imagen:"https://picsum.photos/seed/culture-incaa-53/800/360",
    opciones:[
      { texto:"🎬 Defender el INCAA: mantener el fondo e imponer un impuesto a plataformas digitales extranjeras.", efectos:{ipc:0,deuda:1,reservas:1,riesgo:-1,pobreza:-1,desocupacion:-2,produccion:2,confianza:9} },
      { texto:"⚖️ Reforma del fondo: mantenerlo reducido y exigir más cooproducción internacional.", efectos:{ipc:0,deuda:-1,reservas:0,riesgo:0,pobreza:0,desocupacion:-1,produccion:1,confianza:3} },
      { texto:"✂️ Eliminar el INCAA: el mercado y las plataformas decidirán qué contenido es viable.", efectos:{ipc:0,deuda:-2,reservas:0,riesgo:-1,pobreza:0,desocupacion:2,produccion:-1,confianza:-7} },
    ]
  },
  {
    id:54, tag:"🌊 Pesca",
    titulo:"Pesca Ilegal en el Mar Argentino: Soberanía Marítima",
    descripcion:"Imágenes satelitales detectan más de 400 buques de bandera china pescando ilegalmente en la Zona Económica Exclusiva argentina. La extracción ilegal se estima en USD 1.500 millones anuales. La Prefectura Naval tiene apenas 8 patrulleros operativos para una costa de 4.700 kilómetros. China es el tercer socio comercial del país. La decisión que tomes definirá si la soberanía marítima tiene algún valor concreto o solo es un discurso.",
    imagen:"https://picsum.photos/seed/illegal-fishing-54/800/360",
    opciones:[
      { texto:"⚓ Operativo de soberanía: hundir o capturar buques ilegales con apoyo de la Armada.", efectos:{ipc:0,deuda:2,reservas:-2,riesgo:6,pobreza:0,desocupacion:0,produccion:2,confianza:9} },
      { texto:"🤝 Negociación diplomática: acuerdo con China para autorizar pesca regulada a cambio de inversiones.", efectos:{ipc:0,deuda:-2,reservas:3,riesgo:-3,pobreza:0,desocupacion:0,produccion:3,confianza:3} },
      { texto:"🌍 Denuncia ante la CONVEMAR: llevar el caso a los organismos internacionales de Derecho del Mar.", efectos:{ipc:0,deuda:1,reservas:-1,riesgo:-2,pobreza:0,desocupacion:0,produccion:1,confianza:5} },
    ]
  },
  {
    id:55, tag:"🎓 Deserción Escolar",
    titulo:"El 30% de los Adolescentes No Termina la Secundaria",
    descripcion:"Un informe de la UNESCO posiciona al país en el lugar 18 de 20 en América Latina en tasas de egreso de la secundaria. El 30% de los jóvenes entre 15 y 18 años abandonó la escuela. Las causas son múltiples: necesidad de trabajo temprano, violencia, embarazo adolescente y desconexión curricular. La brecha entre el modelo educativo del siglo XX y las realidades del siglo XXI está matando la escuela secundaria. El futuro del capital humano del país está en juego.",
    imagen:"https://picsum.photos/seed/school-dropout-55/800/360",
    opciones:[
      { texto:"💰 Beca universal: otorgar $30.000 mensuales a todo estudiante secundario que asista regularmente.", efectos:{ipc:2,deuda:4,reservas:-2,riesgo:-1,pobreza:-6,desocupacion:-3,produccion:1,confianza:11} },
      { texto:"📚 Reforma curricular: adaptar la secundaria al mundo del trabajo y la tecnología del siglo XXI.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-1,pobreza:-3,desocupacion:-2,produccion:3,confianza:7} },
      { texto:"🏫 Doble jornada obligatoria: más tiempo escolar con talleres, deporte y alimentación asegurada.", efectos:{ipc:0,deuda:3,reservas:-1,riesgo:0,pobreza:-4,desocupacion:-2,produccion:2,confianza:8} },
    ]
  },
  {
    id:56, tag:"⛏️ Minería",
    titulo:"Megaminería a Cielo Abierto: Riqueza o Destrucción",
    descripcion:"Una empresa australiana-canadiense propone extraer oro y plata de un yacimiento en los Andes con inversión de USD 6.000 millones. El yacimiento se ubica sobre el nacimiento de tres ríos que abastecen de agua a 500.000 personas. Los estudios de impacto ambiental muestran riesgo 'moderado a alto' de contaminación. Las comunidades huarpe y la asamblea de vecinos rechazan el proyecto. Los sindicatos mineros y los intendentes de la región lo apoyan por el empleo que generaría.",
    imagen:"https://picsum.photos/seed/mining-andes-56/800/360",
    opciones:[
      { texto:"⛏️ Aprobar el proyecto: el desarrollo económico y el empleo son prioridad sobre el riesgo ambiental.", efectos:{ipc:-2,deuda:-4,reservas:9,riesgo:-5,pobreza:-4,desocupacion:-6,produccion:8,confianza:-4} },
      { texto:"🌿 Rechazar: la cuenca hídrica es un bien estratégico que ninguna rentabilidad puede justificar.", efectos:{ipc:0,deuda:0,reservas:-2,riesgo:2,pobreza:0,desocupacion:1,produccion:-1,confianza:7} },
      { texto:"🔬 Aprobar con auditoría ambiental permanente y fondo de remediación del 5% de la facturación.", efectos:{ipc:-1,deuda:-2,reservas:5,riesgo:-3,pobreza:-2,desocupacion:-4,produccion:5,confianza:3} },
    ]
  },
  {
    id:57, tag:"🧬 Biotecnología",
    titulo:"OGM: El Debate por los Cultivos Transgénicos",
    descripcion:"El CONICET aprueba dos nuevas variedades de trigo transgénico resistente a la sequía y a los principales hongos. La adopción masiva podría aumentar la producción en un 30% y generar USD 4.000 millones adicionales en exportaciones. La Unión Europea amenaza con bloquear el trigo argentino si se autoriza la siembra comercial. Los productores orgánicos y los movimientos agroecológicos exigen una moratoria. El futuro del principal grano exportador está en debate.",
    imagen:"https://picsum.photos/seed/gmo-wheat-57/800/360",
    opciones:[
      { texto:"🌾 Autorizar la siembra comercial: la tecnología y la seguridad alimentaria global primero.", efectos:{ipc:-2,deuda:-3,reservas:8,riesgo:-4,pobreza:-3,desocupacion:-3,produccion:9,confianza:3} },
      { texto:"🔬 Autorizar en zonas piloto: experimentación controlada antes de liberar comercialmente.", efectos:{ipc:-1,deuda:-1,reservas:2,riesgo:-2,pobreza:-1,desocupacion:-1,produccion:3,confianza:4} },
      { texto:"🚫 Moratoria por 2 años: esperar resultados ambientales internacionales antes de decidir.", efectos:{ipc:0,deuda:0,reservas:-1,riesgo:2,pobreza:0,desocupacion:0,produccion:-2,confianza:2} },
    ]
  },
  {
    id:58, tag:"🚆 Infraestructura",
    titulo:"El Tren Bala Buenos Aires-Rosario-Córdoba",
    descripcion:"Un consorcio chino-alemán presenta un proyecto de tren de alta velocidad entre Buenos Aires, Rosario y Córdoba con inversión de USD 18.000 millones. El viaje de 700 kilómetros tomaría 2 horas. El proyecto crearía 40.000 empleos en construcción y 8.000 permanentes. El financiamiento chino exige que el 60% de los materiales sean de origen chino y que el repago sea en commodities agrícolas. La vieja promesa del tren bala regresa con nueva tecnología y nuevas dudas.",
    imagen:"https://picsum.photos/seed/highspeed-rail-58/800/360",
    opciones:[
      { texto:"🚆 Aprobar el proyecto: la infraestructura moderna es la base del desarrollo productivo del siglo XXI.", efectos:{ipc:1,deuda:8,reservas:-4,riesgo:-3,pobreza:-3,desocupacion:-6,produccion:7,confianza:9} },
      { texto:"🔄 Renegociar: exigir 80% de componente nacional y repago en divisas, no en commodities.", efectos:{ipc:0,deuda:4,reservas:-2,riesgo:-1,pobreza:-1,desocupacion:-3,produccion:4,confianza:5} },
      { texto:"🚫 Rechazar: USD 18.000 millones en deuda para un proyecto que no es prioridad en la coyuntura.", efectos:{ipc:0,deuda:0,reservas:1,riesgo:3,pobreza:0,desocupacion:0,produccion:-1,confianza:-4} },
    ]
  },
  {
    id:59, tag:"🏃 Economía Informal",
    titulo:"El 50% de los Trabajadores en la Informalidad",
    descripcion:"El INDEC confirma que la mitad de los trabajadores argentinos opera en la economía informal: sin aportes jubilatorios, sin obra social y sin protección laboral. Los 'cuentapropistas forzados' son la cara más visible de décadas de exclusión productiva. El costo fiscal de la informalidad es monumental: el Estado pierde el 4% del PBI en recaudación no realizada. Formalizar este enorme sector es la oportunidad y el desafío más complejo de tu gestión.",
    imagen:"https://picsum.photos/seed/informal-economy-59/800/360",
    opciones:[
      { texto:"📋 Monotributo Social Plus: régimen simplificado con beneficios completos para trabajadores informales.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-2,pobreza:-5,desocupacion:-4,produccion:3,confianza:9} },
      { texto:"🏭 Formalización por sectores: empezar por gastronómicos, textiles y construcción con fiscalización.", efectos:{ipc:-1,deuda:1,reservas:0,riesgo:-3,pobreza:-3,desocupacion:-3,produccion:4,confianza:6} },
      { texto:"✂️ Blanqueo laboral masivo: amnistía a empleadores que regularicen toda su planta en 180 días.", efectos:{ipc:0,deuda:0,reservas:1,riesgo:-4,pobreza:-2,desocupacion:-5,produccion:5,confianza:5} },
    ]
  },
  {
    id:60, tag:"🔬 Investigación",
    titulo:"Fusión Nuclear: El País Puede Ser Pionero",
    descripcion:"La Comisión Nacional de Energía Atómica (CNEA) logró un avance técnico histórico en reactores de fusión nuclear de pequeña escala. Con USD 500 millones de inversión en 5 años podría tener el primer reactor comercial de fusión de América Latina. La energía de fusión es limpia, inagotable y segura. El obstáculo es el costo inmediato en un contexto de ajuste fiscal. Los países desarrollados ya están invirtiendo masivamente. Perderse esta ventana de oportunidad podría ser irreversible.",
    imagen:"https://picsum.photos/seed/nuclear-fusion-60/800/360",
    opciones:[
      { texto:"⚡ Inversión histórica: fondos de emergencia para convertir a la CNEA en líder mundial en fusión.", efectos:{ipc:0,deuda:4,reservas:-3,riesgo:-3,pobreza:-2,desocupacion:-4,produccion:6,confianza:10} },
      { texto:"🤝 Asociación internacional: buscar socios de EE.UU., Japón o la UE para cofinanciar el proyecto.", efectos:{ipc:0,deuda:2,reservas:1,riesgo:-2,pobreza:-1,desocupacion:-2,produccion:4,confianza:7} },
      { texto:"📋 Postergar: la coyuntura económica no permite inversiones de largo plazo sin retorno inmediato.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:-1,confianza:-3} },
    ]
  },
  {
    id:61, tag:"🛡️ Defensa",
    titulo:"Las Fuerzas Armadas Piden Rearme Urgente",
    descripcion:"El jefe del Estado Mayor Conjunto advierte que el 70% del equipamiento militar tiene más de 40 años de antigüedad y ya no es operativo. Aviones sin radar, submarinos sin torpedos y fragatas sin sistemas de misiles. Un conflicto vecinal en la región tensiona la situación. El presupuesto de defensa equivale al 0,8% del PBI —el más bajo de América del Sur—. El dilema: invertir en armas o en escuelas y hospitales.",
    imagen:"https://picsum.photos/seed/military-budget-61/800/360",
    opciones:[
      { texto:"🛡️ Plan de modernización: invertir USD 2.000 millones en equipamiento con créditos blandos regionales.", efectos:{ipc:0,deuda:4,reservas:-3,riesgo:-5,pobreza:0,desocupacion:-3,produccion:2,confianza:3} },
      { texto:"⚖️ Modernización parcial: solo los sistemas más críticos para la disuasión básica del territorio.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-3,pobreza:0,desocupacion:-1,produccion:1,confianza:2} },
      { texto:"🏫 No rearmar: redirigir los fondos a educación, salud y vivienda social.", efectos:{ipc:0,deuda:-1,reservas:1,riesgo:4,pobreza:-3,desocupacion:-2,produccion:0,confianza:5} },
    ]
  },
  {
    id:62, tag:"🌐 Internet",
    titulo:"¿El Estado Debe Proveer Internet Gratuita?",
    descripcion:"Una iniciativa del Ministerio de Ciencia propone declarar a Internet como servicio público esencial y crear una empresa estatal de telecomunicaciones que provea conectividad gratuita en hogares de bajos ingresos y zonas rurales. Las telefónicas y cableoperadoras multinacionales denuncian 'competencia desleal'. El 35% de los hogares rurales no tiene banda ancha. La brecha digital reproduce la desigualdad educativa y laboral. La conectividad como derecho es el debate del siglo XXI.",
    imagen:"https://picsum.photos/seed/internet-state-62/800/360",
    opciones:[
      { texto:"📡 Empresa estatal de telecomunicaciones: conectividad universal como servicio público gratuito.", efectos:{ipc:0,deuda:5,reservas:-3,riesgo:1,pobreza:-5,desocupacion:-4,produccion:4,confianza:11} },
      { texto:"🤝 Subsidio a privados: pagar a empresas existentes para cubrir zonas rurales y hogares pobres.", efectos:{ipc:0,deuda:3,reservas:-2,riesgo:-1,pobreza:-3,desocupacion:-2,produccion:2,confianza:7} },
      { texto:"🌐 Obligación de cobertura: exigir por ley a privados que cubran el 100% del territorio.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-1,pobreza:-2,desocupacion:-1,produccion:3,confianza:5} },
    ]
  },
  {
    id:63, tag:"🤝 Diplomacia",
    titulo:"Embajador Expulsado: Crisis Diplomática",
    descripcion:"El embajador de un país europeo publica declaraciones criticando la política económica del gobierno en términos que el canciller califica de 'injerencia inadmisible'. La prensa nacional lo convierte en escándalo. Los sectores más nacionalistas exigen la expulsión del embajador. El sector exportador advierte que una crisis diplomática con ese país puede costar USD 800 millones en comercio bilateral. La soberanía y los negocios colisionan en el peor momento.",
    imagen:"https://picsum.photos/seed/diplomatic-crisis-63/800/360",
    opciones:[
      { texto:"🚫 Expulsar al embajador: la soberanía nacional no admite injerencia extranjera, cueste lo que cueste.", efectos:{ipc:0,deuda:0,reservas:-3,riesgo:4,pobreza:0,desocupacion:0,produccion:-3,confianza:6} },
      { texto:"📢 Nota de protesta formal: rechazo diplomático enérgico sin romper relaciones bilaterales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:3} },
      { texto:"🤝 Gestión discreta: canal confidencial para que el embajador aclare sus dichos sin escándalo público.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:1,confianza:-2} },
    ]
  },
  {
    id:64, tag:"💊 Adicciones",
    titulo:"Narcocriminalidad: El Estado Ante el Avance del Crimen Organizado",
    descripcion:"Tres ciudades del interior registran récords históricos de homicidios vinculados al narcotráfico. Los barrios más pobres viven bajo el control territorial de bandas armadas que cobran peajes, reclutan adolescentes y operan con impunidad. La Policía Federal admite que el 30% de sus efectivos en esas zonas están 'comprometidos'. El Ministerio de Seguridad pide operativos de shock. Las organizaciones sociales piden un enfoque de salud pública. El Estado debe elegir su modelo.",
    imagen:"https://picsum.photos/seed/narco-crime-64/800/360",
    opciones:[
      { texto:"🚔 Operativo conjunto: Fuerzas Federales, Gendarmería e Interpol en las tres ciudades de forma masiva.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-5,pobreza:-1,desocupacion:0,produccion:1,confianza:7} },
      { texto:"🏥 Estrategia integral: recuperación de barrios, centros de salud y tratamiento de adicciones.", efectos:{ipc:0,deuda:3,reservas:-2,riesgo:-3,pobreza:-4,desocupacion:-3,produccion:0,confianza:9} },
      { texto:"⚖️ Legalización regulada: explorar un modelo de regulación estatal para reducir la violencia del mercado ilegal.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-4,pobreza:-3,desocupacion:-1,produccion:0,confianza:-2} },
    ]
  },
  {
    id:65, tag:"👶 Demografía",
    titulo:"La Tasa de Natalidad Colapsa: ¿Crisis Demográfica?",
    descripcion:"El INDEC confirma que la tasa de natalidad cayó a 1,4 hijos por mujer —muy por debajo del 2,1 necesario para renovar la población—. En 30 años, habrá el doble de jubilados por cada trabajador activo, haciendo insostenible el sistema previsional. Los países que enfrentaron esta crisis antes (Japón, Alemania) tardaron décadas en revertirla. El Estado debe decidir si actúa ahora con políticas de largo plazo o espera a que la crisis sea más visible.",
    imagen:"https://picsum.photos/seed/demographics-65/800/360",
    opciones:[
      { texto:"👶 Política de natalidad: subsidios al nacimiento, guarderías gratuitas y licencias parentales extendidas.", efectos:{ipc:0,deuda:3,reservas:-2,riesgo:-1,pobreza:-3,desocupacion:-2,produccion:1,confianza:7} },
      { texto:"🌍 Política migratoria activa: atraer migrantes jóvenes calificados con facilidades de integración.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-2,pobreza:-2,desocupacion:2,produccion:4,confianza:4} },
      { texto:"📋 No intervenir: la natalidad es una decisión privada que el Estado no debe condicionar.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-2} },
    ]
  },
  {
    id:66, tag:"🏋️ Deporte",
    titulo:"El País Ganó el Mundial: ¿Negocio o Identidad?",
    descripcion:"La selección nacional ganó el Campeonato Mundial de fútbol. El festejo popular es inmenso. La FIFA y el gobierno proponen aprovechar el momento para construir un estadio nacional de 80.000 personas con inversión de USD 1.200 millones. La plata existe en el presupuesto de obras públicas. Sectores sociales advierten que hay 3 millones de personas bajo la línea de pobreza que esperan esos recursos. El dilema entre la identidad cultural y las prioridades sociales.",
    imagen:"https://picsum.photos/seed/world-cup-win-66/800/360",
    opciones:[
      { texto:"🏟️ Construir el estadio: el deporte y la cultura nacional también son desarrollo social.", efectos:{ipc:1,deuda:3,reservas:-2,riesgo:-2,pobreza:1,desocupacion:-4,produccion:2,confianza:8} },
      { texto:"⚖️ Estadio más chico: 50.000 plazas con menor inversión y el resto a vivienda social.", efectos:{ipc:0,deuda:1,reservas:-1,riesgo:-1,pobreza:-2,desocupacion:-2,produccion:1,confianza:5} },
      { texto:"🏠 No construir: redirigir todo el presupuesto a emergencia habitacional y social.", efectos:{ipc:0,deuda:-1,reservas:0,riesgo:0,pobreza:-4,desocupacion:-2,produccion:0,confianza:3} },
    ]
  },
  {
    id:67, tag:"📊 Estadísticas",
    titulo:"El INDEC Bajo Sospecha: ¿Inflación Real o Manipulada?",
    descripcion:"Un informe de Price Stats del MIT estima que la inflación real duplica la que publica el INDEC. Los organismos internacionales advierten que si los datos son incorrectos, los bonos indexados al CER pagarán de menos a los tenedores. La credibilidad estadística del Estado está en juego. La oposición pide intervención judicial. Los mercados elevan el riesgo país. Intervenir el INDEC tiene costos políticos enormes; no hacerlo puede costar más caro aún.",
    imagen:"https://picsum.photos/seed/indec-stats-67/800/360",
    opciones:[
      { texto:"🔍 Auditoría internacional: invitar a EUROSTAT y FMI a auditar la metodología del INDEC.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-7,pobreza:0,desocupacion:0,produccion:0,confianza:11} },
      { texto:"🔄 Reforma metodológica interna: cambiar los técnicos y actualizar la canasta básica sin auditoría.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-3,pobreza:0,desocupacion:0,produccion:0,confianza:5} },
      { texto:"🛡️ Defender el INDEC: las críticas son parte de la guerra mediática y financiera contra el gobierno.", corrupta:true, efectos:{ipc:0,deuda:0,reservas:0,riesgo:8,pobreza:0,desocupacion:0,produccion:0,confianza:-10} },
    ]
  },
  {
    id:68, tag:"🌿 Agroecología",
    titulo:"Prohibir el Glifosato: ¿Producción o Salud?",
    descripcion:"Un metaanálisis de 47 estudios confirma la correlación entre el uso masivo de glifosato y el aumento del cáncer infantil en zonas rurales. Las madres de Ituzaingó llevan 20 años denunciando lo que los datos ahora confirman. La industria sojera, que genera USD 20.000 millones anuales en exportaciones, advierte que sin glifosato la producción caería un 40%. El dilema entre la salud de los habitantes rurales y el principal generador de divisas del país.",
    imagen:"https://picsum.photos/seed/glyphosate-68/800/360",
    opciones:[
      { texto:"🚫 Prohibir el glifosato: la salud de las poblaciones rurales está por encima de cualquier rentabilidad.", efectos:{ipc:3,deuda:0,reservas:-8,riesgo:4,pobreza:3,desocupacion:2,produccion:-7,confianza:5} },
      { texto:"⚖️ Zona de exclusión obligatoria: prohibir su uso en un radio de 1.000 metros de viviendas y escuelas.", efectos:{ipc:1,deuda:1,reservas:-2,riesgo:0,pobreza:-2,desocupacion:0,produccion:-2,confianza:7} },
      { texto:"🔬 Financiar alternativas: subsidiar la transición a herbicidas menos tóxicos en 5 años.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-1,pobreza:-2,desocupacion:-1,produccion:-1,confianza:6} },
    ]
  },
  {
    id:69, tag:"🏢 Monopolios",
    titulo:"Los Supermercados Hacen Cartel: Precios Coordinados",
    descripcion:"La Comisión Nacional de Defensa de la Competencia (CNDC) detecta que las cinco principales cadenas de supermercados coordinaron subas de precios en forma simultánea y homogénea, en lo que configura un cartel ilegal. El daño al consumidor se estima en $600.000 millones. Las cadenas son empleadoras de 180.000 trabajadores. La multa máxima prevista por ley es risible frente a las ganancias. El sistema de defensa de la competencia mostró sus límites.",
    imagen:"https://picsum.photos/seed/supermarket-cartel-69/800/360",
    opciones:[
      { texto:"⚖️ Multa máxima y reforma de la Ley de Defensa de la Competencia con nuevas herramientas.", efectos:{ipc:-3,deuda:0,reservas:0,riesgo:-3,pobreza:-4,desocupacion:0,produccion:0,confianza:10} },
      { texto:"🤝 Acuerdo voluntario: las cadenas se comprometen a no reeditar la práctica a cambio de no ser multadas.", efectos:{ipc:-1,deuda:0,reservas:0,riesgo:0,pobreza:-1,desocupacion:0,produccion:0,confianza:2} },
      { texto:"🏪 Crear cadenas de supermercados estatales para competir directamente y bajar precios.", efectos:{ipc:-4,deuda:5,reservas:-3,riesgo:2,pobreza:-5,desocupacion:-5,produccion:2,confianza:8} },
    ]
  },
  {
    id:70, tag:"🌍 Geopolítica",
    titulo:"El País Frente a la Nueva Guerra Fría: ¿Occidente o Multipolarismo?",
    descripcion:"El mundo se fractura en dos bloques: el liderado por EE.UU./UE y el eje China-Rusia. Los tratados de libre comercio con Europa exigen que el país elija bando. EE.UU. presiona para salir del bloque BRICS ampliado. China amenaza con cortar las inversiones si el gobierno se acerca demasiado a la OTAN. El 40% de las exportaciones van a China, pero el financiamiento del FMI viene de Washington. La neutralidad se vuelve imposible.",
    imagen:"https://picsum.photos/seed/geopolitics-70/800/360",
    opciones:[
      { texto:"🌎 Alineamiento occidental: TLC con la UE, salida del BRICS y fortalecimiento del eje democrático.", efectos:{ipc:-2,deuda:-3,reservas:5,riesgo:-8,pobreza:1,desocupacion:-1,produccion:3,confianza:4} },
      { texto:"🐉 Alineamiento con el eje asiático: profundizar el BRICS, swap con China y alejamiento del FMI.", efectos:{ipc:2,deuda:3,reservas:8,riesgo:4,pobreza:-2,desocupacion:-2,produccion:5,confianza:2} },
      { texto:"⚖️ No alineamiento activo: defensa de la autonomía estratégica y relaciones pragmáticas con todos.", efectos:{ipc:0,deuda:1,reservas:1,riesgo:-2,pobreza:0,desocupacion:0,produccion:2,confianza:6} },
    ]
  },


  // ── EVENTOS NUEVOS 71–100 ─────────────────────────────────
  // Categorías inéditas: IA, Crisis Hídrica, Género, Economía del Cuidado,
  // Pueblos Originarios, Malvinas, Criptomonedas, Reforma Judicial,
  // Economía Circular, Economía Popular, DDHH, Energía Nuclear, etc.

  {
    id:71, tag:"🤖 Inteligencia Artificial",
    titulo:"La IA Avanza sobre el Empleo Formal",
    descripcion:"Un informe del Ministerio de Trabajo revela que la automatización basada en inteligencia artificial eliminó 180.000 puestos administrativos y de servicios en los últimos 18 meses. Sindicatos de bancarios, aseguradoras y call centers reclaman un marco regulatorio urgente. Las empresas tecnológicas presionan para que el Estado no interfiera. El mundo del trabajo está en transición y vos debés decidir el rol del Estado en esa transformación.",
    imagen:"https://picsum.photos/seed/ia-empleo-71/800/360",
    opciones:[
      { texto:"📋 Fondo de Reconversión Laboral: crear un fondo financiado por las empresas que automatizan para reentrenar a los trabajadores desplazados.", efectos:{ipc:1,deuda:4,reservas:-2,riesgo:-4,pobreza:-3,desocupacion:-3,produccion:3,confianza:9} },
      { texto:"⚖️ Impuesto al Robot: gravar la automatización con un porcentaje de los salarios ahorrados para financiar la transición.", efectos:{ipc:2,deuda:2,reservas:0,riesgo:2,pobreza:-2,desocupacion:-1,produccion:-3,confianza:5} },
      { texto:"🚀 Desregular totalmente: dejar que el mercado absorba la transición sin intervención estatal para atraer inversión tecnológica.", efectos:{ipc:0,deuda:-2,reservas:4,riesgo:-3,pobreza:6,desocupacion:8,produccion:6,confianza:-8} },
    ]
  },
  {
    id:72, tag:"🤖 Inteligencia Artificial",
    titulo:"El Estado ante la IA: ¿Algoritmos para Gobernar?",
    descripcion:"El Ministerio de Modernización propone utilizar algoritmos de inteligencia artificial para asignar subsidios sociales, priorizar obra pública y detectar evasión fiscal. ONG de derechos digitales advierten sobre sesgos discriminatorios y falta de transparencia. Académicos del CONICET presentan protocolos éticos. La ciudadanía está dividida entre la eficiencia prometida y el riesgo de decisiones automatizadas sin control humano.",
    imagen:"https://picsum.photos/seed/ia-estado-72/800/360",
    opciones:[
      { texto:"🔬 Implementar con auditoría ciudadana: adoptar IA en el Estado con revisión pública de algoritmos y derecho a impugnación humana.", efectos:{ipc:-1,deuda:3,reservas:-1,riesgo:-5,pobreza:-4,desocupacion:-1,produccion:4,confianza:10} },
      { texto:"⚡ Implementar rápido sin regulación: acelerar la digitalización para ganar eficiencia y reducir el gasto en burocracia.", efectos:{ipc:-2,deuda:-3,reservas:2,riesgo:-2,pobreza:1,desocupacion:4,produccion:5,confianza:-3} },
      { texto:"🚫 Rechazar el proyecto: mantener la decisión humana en todos los procesos estatales y archivar la propuesta.", efectos:{ipc:1,deuda:1,reservas:0,riesgo:1,pobreza:0,desocupacion:-1,produccion:-2,confianza:2} },
    ]
  },
  {
    id:73, tag:"💧 Crisis Hídrica",
    titulo:"Sequía Histórica en las Cuencas del Litoral",
    descripcion:"El Servicio Meteorológico Nacional declara sequía extraordinaria en las cuencas del Paraná y el Uruguay: las bajantes récord afectan la navegación fluvial, la generación hidroeléctrica y el abastecimiento de agua potable en 14 provincias. Las exportaciones de soja y maíz caen un 35%. Más de 2 millones de personas tienen cortes rotativos de agua. Las provincias piden ayuda federal de emergencia.",
    imagen:"https://picsum.photos/seed/sequia-73/800/360",
    opciones:[
      { texto:"🌊 Plan Nacional Hídrico: declarar emergencia hídrica, activar obras de infraestructura y coordinar con provincias la distribución de agua.", efectos:{ipc:3,deuda:7,reservas:-5,riesgo:-2,pobreza:-5,desocupacion:-2,produccion:-3,confianza:8} },
      { texto:"💧 Comprar agua en tanques: solución paliativa inmediata mediante distribución de camiones cisterna en zonas críticas.", efectos:{ipc:4,deuda:4,reservas:-3,riesgo:0,pobreza:-2,desocupacion:0,produccion:-5,confianza:1} },
      { texto:"🏭 Priorizar la industria: garantizar agua para el sector agropecuario-exportador y racionar el consumo domiciliario.", efectos:{ipc:2,deuda:1,reservas:3,riesgo:3,pobreza:7,desocupacion:1,produccion:2,confianza:-12} },
    ]
  },
  {
    id:74, tag:"💧 Crisis Hídrica",
    titulo:"El Acuífero Guaraní bajo Presión Internacional",
    descripcion:"Una corporación multinacional solicita autorización para extraer 500 millones de litros diarios del Acuífero Guaraní para exportar agua embotellada a Asia. El acuífero, compartido con Brasil, Paraguay y Uruguay, es la mayor reserva de agua dulce subterránea del mundo. Ambientalistas, pueblos originarios y el gobierno de Brasil se oponen. El acuerdo prometería 800 millones de dólares en regalías anuales.",
    imagen:"https://picsum.photos/seed/acuifero-74/800/360",
    opciones:[
      { texto:"🚫 Rechazar la concesión: declarar el Acuífero Guaraní patrimonio estratégico nacional y prohibir su explotación comercial.", efectos:{ipc:0,deuda:0,reservas:-3,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:11} },
      { texto:"🤝 Negociar concesión limitada: autorizar extracción del 10% de lo solicitado con royalties y monitoreo ambiental.", efectos:{ipc:0,deuda:-4,reservas:5,riesgo:-2,pobreza:-2,desocupacion:-1,produccion:2,confianza:3} },
      { texto:"💰 Aprobar la concesión completa: aceptar las condiciones de la corporación priorizando el ingreso de divisas urgentes.", efectos:{ipc:0,deuda:-8,reservas:12,riesgo:-6,pobreza:-3,desocupacion:-2,produccion:3,confianza:-14} },
    ]
  },
  {
    id:75, tag:"♀️ Género y Diversidad",
    titulo:"Brecha Salarial de Género: El Informe que Sacudió al País",
    descripcion:"El INDEC publica un informe que confirma que las mujeres ganan en promedio un 27% menos que los varones en el sector privado por igual tarea. La CTA Femenina convoca a un paro de mujeres y convoca al Congreso a debatir la Ley de Igualdad Salarial. Cámaras empresarias advierten que regulaciones forzosas aumentarán costos laborales. Los datos evidencian que la brecha es mayor en sectores rurales e informales.",
    imagen:"https://picsum.photos/seed/brecha-salarial-75/800/360",
    opciones:[
      { texto:"⚖️ Ley de Igualdad Salarial con auditoría: impulsar la ley con registros de transparencia salarial obligatorios en empresas de más de 50 empleados.", efectos:{ipc:2,deuda:2,reservas:-1,riesgo:-2,pobreza:-5,desocupacion:-2,produccion:2,confianza:10} },
      { texto:"🎓 Programa de capacitación y sensibilización: lanzar campañas de concientización y subsidios a empresas que reduzcan la brecha voluntariamente.", efectos:{ipc:1,deuda:2,reservas:-1,riesgo:-1,pobreza:-2,desocupacion:-1,produccion:1,confianza:5} },
      { texto:"📋 Derivar al diálogo sectorial: dejar la resolución en manos de negociaciones paritarias sin legislación nacional.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-4} },
    ]
  },
  {
    id:76, tag:"♀️ Género y Diversidad",
    titulo:"Violencia Institucional: Protocolo de Género en el Estado",
    descripcion:"Tras el escándalo por acoso sexual en tres ministerios y una empresa pública, la sociedad civil exige un Protocolo de Actuación ante Violencia de Género en el ámbito estatal. El movimiento #NiUnaMenos convoca una marcha masiva frente a Casa Rosada. La oposición presenta un proyecto propio. La titularidad del debate político sobre género se disputa entre distintos sectores.",
    imagen:"https://picsum.photos/seed/genero-estado-76/800/360",
    opciones:[
      { texto:"📋 Protocolo integral con sanciones: impulsar el protocolo con comisiones independientes, sanciones efectivas y garantías de anonimato para denunciantes.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-3,pobreza:-2,desocupacion:0,produccion:1,confianza:12} },
      { texto:"🔍 Investigar caso por caso: abrir sumarios internos y dejar la política general para una etapa posterior.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-2} },
      { texto:"🔄 Aceptar el proyecto opositor: negociar con la oposición para sacar un protocolo más débil a cambio de apoyo parlamentario en otra agenda.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-6} },
    ]
  },
  {
    id:77, tag:"🤲 Economía del Cuidado",
    titulo:"El Trabajo Invisible que Sostiene la Economía",
    descripcion:"El INDEC publica la primera Encuesta Nacional de Uso del Tiempo: las mujeres realizan el 76% del trabajo de cuidado no remunerado —crianza, cuidado de adultos mayores, tareas del hogar— equivalente al 15,9% del PBI. El Ministerio de Economía propone crear el Sistema Nacional de Cuidados con guarderías públicas, licencias igualitarias y registro de cuidadoras. El sector empresario alerta por el costo fiscal.",
    imagen:"https://picsum.photos/seed/cuidado-77/800/360",
    opciones:[
      { texto:"🏗️ Sistema Nacional de Cuidados: financiar una red pública de centros de cuidado y reconocer el trabajo doméstico en el sistema previsional.", efectos:{ipc:2,deuda:6,reservas:-3,riesgo:-1,pobreza:-6,desocupacion:-4,produccion:4,confianza:11} },
      { texto:"💼 Licencias igualitarias: extender la licencia de paternidad a 90 días y crear licencias para cuidado de adultos mayores sin red pública.", efectos:{ipc:1,deuda:3,reservas:-1,riesgo:-1,pobreza:-3,desocupacion:-2,produccion:2,confianza:7} },
      { texto:"📋 Sólo datos y diagnóstico: publicar los resultados y postergar la implementación por restricción fiscal.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-5} },
    ]
  },
  {
    id:78, tag:"🏔️ Pueblos Originarios",
    titulo:"Relevamiento Territorial Incompleto: Tierras en Conflicto",
    descripcion:"La Ley 26.160 obliga al Estado a relevar y titular las tierras de comunidades indígenas desde 2006 pero veinte años después sólo se completó el 40% del relevamiento. En Neuquén y Chubut, desalojos judiciales amenazan a 35 comunidades mapuche. La Relatoría Especial de la ONU sobre Pueblos Indígenas visita el país y redacta un informe crítico. Los pueblos exigen reconocimiento constitucional de la plurinacionalidad.",
    imagen:"https://picsum.photos/seed/indigenas-78/800/360",
    opciones:[
      { texto:"🗺️ Completar el relevamiento y suspender desalojos: declarar emergencia territorial, suspender los desalojos mientras dura el proceso y acelerar las titulaciones.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-3,pobreza:-3,desocupacion:-1,produccion:1,confianza:9} },
      { texto:"⚖️ Dejar actuar a la justicia: respetar las sentencias judiciales sin intervención del Ejecutivo en los conflictos territoriales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:2,desocupacion:0,produccion:0,confianza:-7} },
      { texto:"🏭 Priorizar inversión en las zonas: autorizar proyectos extractivos en zonas en disputa ofreciendo regalías a las comunidades como compensación.", efectos:{ipc:0,deuda:-3,reservas:4,riesgo:-2,pobreza:-1,desocupacion:-2,produccion:5,confianza:-11} },
    ]
  },
  {
    id:79, tag:"🏔️ Pueblos Originarios",
    titulo:"Lenguas Originarias: La Batalla Cultural en las Aulas",
    descripcion:"El Ministerio de Educación debate si incluir la enseñanza de lenguas originarias (quechua, mapuzungun, guaraní, qom) como materia obligatoria en las escuelas de las provincias con mayor presencia indígena. Docentes bilingües celebran la propuesta pero advierten que no hay infraestructura ni presupuesto. Sectores conservadores cuestionan la 'fragmentación cultural'. Comunidades originarias llevan décadas reclamando este reconocimiento.",
    imagen:"https://picsum.photos/seed/lenguas-79/800/360",
    opciones:[
      { texto:"📚 Educación intercultural bilingüe obligatoria: implementar la materia con formación docente financiada por Nación en provincias con más del 5% de población indígena.", efectos:{ipc:0,deuda:3,reservas:-1,riesgo:-2,pobreza:-3,desocupacion:-2,produccion:1,confianza:8} },
      { texto:"🎓 Optativa provincial: recomendar la inclusión pero dejar la decisión a cada provincia según sus recursos.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-1,pobreza:-1,desocupacion:-1,produccion:0,confianza:4} },
      { texto:"🚫 Rechazar el proyecto: mantener el currículum actual argumentando que no hay recursos para implementarlo.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-6} },
    ]
  },
  {
    id:80, tag:"🗺️ Soberanía Territorial",
    titulo:"Malvinas: La Ofensiva Diplomática en el Comité de Descolonización",
    descripcion:"El Comité de Descolonización de la ONU sesiona sobre la cuestión Malvinas. Argentina tiene la oportunidad de presentar una argumentación renovada para retomar las negociaciones bilaterales con el Reino Unido. El gobierno británico condiciona cualquier diálogo a un plebiscito entre los isleños. La Cancillería trabaja con nuevos elementos legales sobre el CONVEMAR y los recursos de la plataforma continental. El país espera una posición firme.",
    imagen:"https://picsum.photos/seed/malvinas-80/800/360",
    opciones:[
      { texto:"🌍 Ofensiva multilateral completa: presentar ante la ONU la demanda de soberanía reforzada con argumentos sobre plataforma continental y recursos naturales, y activar apoyos regionales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-3,pobreza:0,desocupacion:0,produccion:0,confianza:12} },
      { texto:"🤝 Proponer diálogo bilateral: solicitar retomar negociaciones directas con el Reino Unido en un formato 2+2 (ambos gobiernos más representantes de isleños).", efectos:{ipc:0,deuda:0,reservas:1,riesgo:-2,pobreza:0,desocupacion:0,produccion:1,confianza:6} },
      { texto:"📋 Posición cautelosa: mantener el reclamo formal sin escalar la disputa para no afectar el comercio y las relaciones diplomáticas con el Reino Unido.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-5} },
    ]
  },
  {
    id:81, tag:"🗺️ Soberanía Territorial",
    titulo:"Pesca Ilegal en el Atlántico Sur: Flotas en el Límite",
    descripcion:"Prefectura Naval detecta 47 buques pesqueros chinos operando dentro de la Zona Económica Exclusiva argentina sin autorización en el Mar Argentino. La pesca ilegal genera pérdidas estimadas en USD 1.800 millones anuales y daña los ecosistemas marinos patagónicos. Brasil y Chile enfrentan el mismo problema. El Ejército y la Marina piden reforzar el patrullaje naval. Actuar tiene costos diplomáticos con Pekín.",
    imagen:"https://picsum.photos/seed/pesca-ilegal-81/800/360",
    opciones:[
      { texto:"⚓ Operativo soberanía: reforzar el patrullaje naval, detener los buques ilegales y activar sanciones diplomáticas vía Cancillería.", efectos:{ipc:0,deuda:3,reservas:-2,riesgo:-1,pobreza:-1,desocupacion:-1,produccion:2,confianza:11} },
      { texto:"🌐 Acuerdo regional MERCOSUR: proponer a Brasil, Uruguay y Paraguay un sistema conjunto de monitoreo satelital del Atlántico Sur.", efectos:{ipc:0,deuda:2,reservas:0,riesgo:-2,pobreza:-1,desocupacion:0,produccion:1,confianza:8} },
      { texto:"🤝 Negociación silenciosa con China: gestionar el conflicto por canales diplomáticos privados para no afectar el comercio de soja.", efectos:{ipc:0,deuda:0,reservas:2,riesgo:0,pobreza:0,desocupacion:0,produccion:1,confianza:-8} },
    ]
  },
  {
    id:82, tag:"🪙 Criptomonedas",
    titulo:"El Boom Cripto: Dolarización Digital por las Bases",
    descripcion:"Un informe del BCRA revela que más de 4 millones de argentinos usan criptomonedas como reserva de valor ante la inflación crónica. Plataformas de intercambio operan en un vacío legal que facilita la evasión fiscal. El FMI presiona para regular el sector. El sector cripto amenaza con trasladar operaciones a Paraguay si se legisla de forma restrictiva. La dolarización informal a través de stablecoins alcanza nuevos máximos.",
    imagen:"https://picsum.photos/seed/cripto-82/800/360",
    opciones:[
      { texto:"📋 Marco regulatorio con tributación: regular las criptomonedas integrándolas al sistema financiero con obligaciones impositivas claras y protección al usuario.", efectos:{ipc:-1,deuda:-3,reservas:2,riesgo:-4,pobreza:0,desocupacion:-1,produccion:2,confianza:7} },
      { texto:"🚀 Zona franca cripto: crear un ecosistema regulatorio favorable para atraer empresas de blockchain y fintech como hub regional.", efectos:{ipc:1,deuda:-4,reservas:5,riesgo:-3,pobreza:-1,desocupacion:-3,produccion:4,confianza:4} },
      { texto:"🚫 Prohibición de exchanges: cerrar las plataformas locales de criptomonedas por riesgo sistémico y evasión fiscal.", efectos:{ipc:2,deuda:0,reservas:-3,riesgo:4,pobreza:1,desocupacion:1,produccion:-2,confianza:-8} },
    ]
  },
  {
    id:83, tag:"🪙 Criptomonedas",
    titulo:"Municipio Pionero: El Primer Bono Soberano en Blockchain",
    descripcion:"El gobierno de una provincia patagónica propone emitir el primer 'bono verde' provincial en tecnología blockchain para financiar obras de energía eólica. La propuesta despierta el interés de inversores internacionales y el escepticismo del Ministerio de Economía nacional, que ve riesgos en la fragmentación del sistema de deuda. El BID ofrece asistencia técnica. Es una oportunidad de innovación financiera pero también un test para la coordinación federal.",
    imagen:"https://picsum.photos/seed/bono-blockchain-83/800/360",
    opciones:[
      { texto:"🌱 Apoyar el proyecto piloto: brindar asistencia técnica y jurídica a la provincia para que el bono verde blockchain sea un modelo exportable.", efectos:{ipc:0,deuda:-2,reservas:3,riesgo:-4,pobreza:-1,desocupacion:-2,produccion:4,confianza:8} },
      { texto:"⚖️ Regular primero: exigir que el Congreso legisle sobre deuda provincial en blockchain antes de autorizar emisiones.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-1,pobreza:0,desocupacion:0,produccion:0,confianza:3} },
      { texto:"🚫 Vetar la iniciativa: impedir la emisión por riesgo de fragmentación financiera y descoordinación de política monetaria.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:-1,confianza:-6} },
    ]
  },
  {
    id:84, tag:"🏛️ Instituciones",
    titulo:"Crisis en el Poder Judicial: Reforma o Colapso",
    descripcion:"El Consejo de la Magistratura colapsa tras meses de parálisis política: hay 1.200 juzgados vacantes en todo el país, causas de corrupción demoradas por años y el índice de impunidad alcanza el 87%. Organismos de derechos humanos, el sector empresario y la sociedad civil —por razones distintas— reclaman una reforma judicial integral. El gobierno tiene la oportunidad histórica de proponer un rediseño del sistema.",
    imagen:"https://picsum.photos/seed/reforma-judicial-84/800/360",
    opciones:[
      { texto:"⚖️ Reforma integral con amplia consulta: proponer una reforma del Consejo de la Magistratura con participación de universidades, colegios de abogados y sociedad civil.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:-6,pobreza:-2,desocupacion:0,produccion:2,confianza:11} },
      { texto:"🔧 Reforma acotada: sólo modificar el sistema de designación de jueces para destrabar las vacantes urgentes.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-3,pobreza:-1,desocupacion:0,produccion:1,confianza:5} },
      { texto:"📋 Postergar: declarar que la reforma judicial no es prioridad y concentrar el capital político en la agenda económica.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:-7} },
    ]
  },
  {
    id:85, tag:"🏛️ Instituciones",
    titulo:"Lawfare y Justicia: El Debate que Divide",
    descripcion:"La detención de un ex funcionario de tu propia gestión por una causa de corrupción de la administración anterior desata una tormenta política. Tus aliados acusan de 'lawfare' y persecución judicial. La oposición celebra la independencia del Poder Judicial. Los medios internacionales observan si el gobierno respeta o interfiere con la justicia. Cada señal que des marcará la agenda política por semanas.",
    imagen:"https://picsum.photos/seed/lawfare-85/800/360",
    opciones:[
      { texto:"🕊️ Respeto irrestricto a la Justicia: declarar públicamente que el gobierno no interferirá en ninguna causa judicial y garantizar acceso de la defensa.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-5,pobreza:0,desocupacion:0,produccion:0,confianza:10} },
      { texto:"📢 Defensa pública del acusado: salir a cuestionar públicamente el proceso judicial y movilizar militantes en apoyo al ex funcionario.", efectos:{ipc:1,deuda:0,reservas:0,riesgo:4,pobreza:0,desocupacion:0,produccion:-1,confianza:-9} },
      { texto:"🤫 Silencio estratégico: no hacer declaraciones públicas y gestionar el conflicto en privado para no desgastar al gobierno.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-3} },
    ]
  },
  {
    id:86, tag:"🌱 Medio Ambiente",
    titulo:"La Economía Circular llega al Presupuesto Nacional",
    descripcion:"Argentina genera 17 millones de toneladas de basura al año, de las cuales sólo el 10% se recicla. Una propuesta interministerial propone crear un Sistema Nacional de Economía Circular: etiquetado de residuos, responsabilidad extendida del productor, cooperativas de recicladores formalizadas y financiamiento verde del BID. Las cámaras industriales piden plazos largos de adaptación. Los movimientos ambientalistas exigen implementación inmediata.",
    imagen:"https://picsum.photos/seed/economia-circular-86/800/360",
    opciones:[
      { texto:"♻️ Implementar con plazos cortos: poner en marcha el sistema en 24 meses con apoyo del BID y formalización de 40.000 cartoneros.", efectos:{ipc:-1,deuda:3,reservas:-1,riesgo:-2,pobreza:-4,desocupacion:-5,produccion:3,confianza:9} },
      { texto:"🏗️ Plan gradual a 5 años: establecer metas escalonadas para no impactar en la competitividad industrial durante la transición.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-1,pobreza:-2,desocupacion:-2,produccion:2,confianza:5} },
      { texto:"📋 Solo el etiquetado: implementar únicamente la regulación de etiquetado sin el resto del sistema por restricción fiscal.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:1} },
    ]
  },
  {
    id:87, tag:"🌡️ Cambio Climático",
    titulo:"El Plan Climático Nacional ante la COP",
    descripcion:"Argentina debe presentar ante la Conferencia de las Partes de la ONU (COP) su contribución actualizada de reducción de emisiones. Los compromisos vigentes implican reducir las emisiones un 19% hacia 2030, pero los propios técnicos de la Cancillería admiten que el país va camino a superar esa meta. El sector agropecuario, responsable del 35% de las emisiones nacionales, se resiste a regulaciones sobre el metano bovino.",
    imagen:"https://picsum.photos/seed/clima-cop-87/800/360",
    opciones:[
      { texto:"🌿 Compromisos ambiciosos: anunciar una meta del 30% de reducción de emisiones con regulación del metano y reconversión energética del agro.", efectos:{ipc:1,deuda:2,reservas:-1,riesgo:-4,pobreza:-1,desocupacion:-2,produccion:-1,confianza:10} },
      { texto:"⚡ Energías renovables sin tocar el agro: aumentar la meta energética renovable al 50% para 2030 sin regular las emisiones agropecuarias.", efectos:{ipc:0,deuda:3,reservas:0,riesgo:-2,pobreza:0,desocupacion:-2,produccion:2,confianza:6} },
      { texto:"📋 Mantener los compromisos actuales: no elevar las metas para no afectar la competitividad exportadora y evitar conflictos sectoriales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-4} },
    ]
  },
  {
    id:88, tag:"⚡ Energía",
    titulo:"El Futuro Nuclear: ¿Ampliar la Capacidad Atómica?",
    descripcion:"La CNEA presenta el proyecto de construcción de Atucha III, una central nuclear de cuarta generación que duplicaría la capacidad eléctrica nuclear del país. El proyecto requiere USD 8.000 millones de financiamiento, parte del cual provendría de China. Ambientalistas advierten sobre los residuos radiactivos. Los ingenieros de INVAP señalan que Argentina tiene la tecnología y el capital humano para ser potencia nuclear regional en energía limpia.",
    imagen:"https://picsum.photos/seed/nuclear-88/800/360",
    opciones:[
      { texto:"⚛️ Aprobar Atucha III con financiamiento diversificado: avanzar con el proyecto buscando inversión de Brasil, UE y AIEA además de China.", efectos:{ipc:0,deuda:8,reservas:-4,riesgo:-3,pobreza:-1,desocupacion:-4,produccion:7,confianza:8} },
      { texto:"🌞 Redirigir a energías renovables: rechazar Atucha III y destinar el financiamiento a parques solares y eólicos con menor tiempo de construcción.", efectos:{ipc:0,deuda:5,reservas:-3,riesgo:-2,pobreza:-1,desocupacion:-3,produccion:4,confianza:6} },
      { texto:"📋 Postergar la decisión: encargar un nuevo estudio de factibilidad y aplazar la decisión a la próxima gestión.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-4} },
    ]
  },
  {
    id:89, tag:"🏃 Economía Informal",
    titulo:"Economía Popular: Reconocimiento o Exclusión",
    descripcion:"La Unión de Trabajadores de la Economía Popular (UTEP) presenta un proyecto de ley para reconocer formalmente a 4 millones de trabajadores informales —vendedores ambulantes, cartoneros, trabajadoras de casas particulares, feriantes— con acceso a cobertura social, jubilación y obra social. El costo fiscal se estima en 0,4% del PBI. El debate es si el Estado debe incorporar la informalidad o profundizar la formalización laboral clásica.",
    imagen:"https://picsum.photos/seed/economia-popular-89/800/360",
    opciones:[
      { texto:"✅ Aprobar el Estatuto del Trabajador Popular: reconocer a los trabajadores de la economía popular con derechos laborales plenos y financiamiento de ANSES.", efectos:{ipc:2,deuda:5,reservas:-2,riesgo:-1,pobreza:-7,desocupacion:-6,produccion:2,confianza:12} },
      { texto:"🏗️ Plan de formalización progresiva: ofrecer a los trabajadores informales una categoría impositiva simplificada (monotributo social reforzado) para migrar gradualmente.", efectos:{ipc:1,deuda:3,reservas:-1,riesgo:-1,pobreza:-4,desocupacion:-3,produccion:1,confianza:7} },
      { texto:"📋 No avanzar en el proyecto: priorizar la formalización del empleo privado convencional y no crear nuevas cargas fiscales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:1,desocupacion:0,produccion:0,confianza:-8} },
    ]
  },
  {
    id:90, tag:"🏃 Economía Informal",
    titulo:"Mercados Populares: ¿Regularización o Desalojo?",
    descripcion:"Más de 300 ferias y mercados populares en el Gran Buenos Aires operan en terrenos fiscales sin habilitación. El Ministerio del Interior recibe presiones de municipios que quieren desalojarlos por 'caos urbano'. La UTEP responde que esos mercados abastecen de alimentos frescos y económicos a 2 millones de familias de bajos ingresos. El debate mezcla urbanismo, derechos sociales y orden público.",
    imagen:"https://picsum.photos/seed/mercados-populares-90/800/360",
    opciones:[
      { texto:"🏪 Regularización integral: instrumentar un programa de habilitación, saneamiento y mejora edilicia de los mercados populares.", efectos:{ipc:-2,deuda:3,reservas:-1,riesgo:-2,pobreza:-5,desocupacion:-4,produccion:1,confianza:9} },
      { texto:"🔄 Regularizar los ordenados, reubicar los conflictivos: distinguir caso por caso según condiciones sanitarias y urbanísticas.", efectos:{ipc:-1,deuda:2,reservas:0,riesgo:-1,pobreza:-3,desocupacion:-2,produccion:1,confianza:4} },
      { texto:"🚧 Desalojar y relocalizar: hacer cumplir las ordenanzas municipales y trasladar los mercados a predios habilitados aunque muchos no puedan sostenerse.", efectos:{ipc:1,deuda:0,reservas:0,riesgo:2,pobreza:4,desocupacion:3,produccion:-1,confianza:-10} },
    ]
  },
  {
    id:91, tag:"⚖️ Derechos Humanos",
    titulo:"Sitios de Memoria: ¿Qué Hacemos con el Pasado?",
    descripcion:"El debate sobre los sitios de memoria de la última dictadura estalla cuando un municipio bonaerense propone demoler un ex centro clandestino de detención para construir una escuela. Organismos de derechos humanos y Madres de Plaza de Mayo se oponen. El gobierno debe definir su postura sobre la política nacional de memoria histórica ante la presión de distintos sectores políticos y la comunidad internacional.",
    imagen:"https://picsum.photos/seed/ddhh-memoria-91/800/360",
    opciones:[
      { texto:"🏛️ Preservar y expandir los sitios de memoria: declarar todos los ex CCD patrimonio histórico nacional e intangible y financiar su mantenimiento.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-3,pobreza:0,desocupacion:0,produccion:0,confianza:11} },
      { texto:"🔄 Uso mixto con señalización: permitir usos compatibles (educativos, culturales) con señalización permanente del pasado del lugar.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-1,pobreza:0,desocupacion:0,produccion:0,confianza:4} },
      { texto:"🏫 Priorizar la escuela: autorizar la demolición argumentando que las necesidades educativas presentes superan a la preservación del pasado.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:-13} },
    ]
  },
  {
    id:92, tag:"⚖️ Derechos Humanos",
    titulo:"Represión en Marcha: El Dilema de la Fuerza",
    descripcion:"Una protesta social de gran escala bloquea durante 72 horas el acceso al Puerto de Buenos Aires, generando pérdidas de USD 200 millones en exportaciones. Las cámaras empresarias exigen desalojo inmediato. Los manifestantes reclaman contra tarifazos en servicios básicos. Organismos de DDHH monitorean la situación. La forma en que el gobierno maneje la fuerza pública definirá su imagen por años.",
    imagen:"https://picsum.photos/seed/represion-marcha-92/800/360",
    opciones:[
      { texto:"🤝 Diálogo y mediación: nombrar un mediador independiente, abrir mesa de negociación y levantar el bloqueo de forma voluntaria.", efectos:{ipc:2,deuda:1,reservas:-3,riesgo:-2,pobreza:-1,desocupacion:0,produccion:-3,confianza:8} },
      { texto:"⚖️ Intervención judicial: solicitar al juez el desalojo con presencia de Gendarmería y instrucciones de mínima fuerza.", efectos:{ipc:1,deuda:0,reservas:-1,riesgo:1,pobreza:0,desocupacion:0,produccion:-1,confianza:-2} },
      { texto:"🚔 Desalojo por la fuerza: ordenar a las fuerzas de seguridad despejar el acceso al puerto de forma inmediata.", efectos:{ipc:0,deuda:0,reservas:2,riesgo:5,pobreza:1,desocupacion:0,produccion:2,confianza:-15} },
    ]
  },
  {
    id:93, tag:"🌱 Medio Ambiente",
    titulo:"Litio: El Triángulo del Futuro bajo Presión",
    descripcion:"Argentina posee el 22% de las reservas mundiales de litio en el 'Triángulo del Litio' (Jujuy, Salta, Catamarca). Tres empresas transnacionales y una firma china proponen proyectos de extracción a cielo abierto. Comunidades indígenas alegan que no se cumplió la consulta previa libre e informada. El litio es clave para las baterías de autos eléctricos. CONICET advierte que sin industrialización local Argentina sólo exporta materia prima de bajo valor agregado.",
    imagen:"https://picsum.photos/seed/litio-93/800/360",
    opciones:[
      { texto:"🏭 Industrialización con YPF-Litio: crear una empresa mixta entre YPF y las provincias para producir baterías en Argentina, no solo mineral crudo.", efectos:{ipc:0,deuda:6,reservas:-4,riesgo:-3,pobreza:-3,desocupacion:-5,produccion:8,confianza:10} },
      { texto:"💵 Concesiones con regalías altas: autorizar la extracción con regalías del 15% y exigencia de consulta indígena previa.", efectos:{ipc:0,deuda:-3,reservas:7,riesgo:-3,pobreza:-2,desocupacion:-3,produccion:4,confianza:4} },
      { texto:"⏸️ Moratoria hasta nueva ley: suspender todas las concesiones hasta que el Congreso legisle sobre minería de litio con participación de comunidades.", efectos:{ipc:0,deuda:1,reservas:-4,riesgo:3,pobreza:0,desocupacion:0,produccion:-2,confianza:5} },
    ]
  },
  {
    id:94, tag:"⚖️ Derechos Humanos",
    titulo:"Discriminación Racial en las Fuerzas de Seguridad",
    descripcion:"Un video viral muestra a efectivos policiales deteniendo y golpeando a jóvenes afrodescendientes e indígenas en un barrio popular de Córdoba. La ONG CELS documenta que el 78% de los detenidos sin causa en Argentina son personas de tez oscura o apariencia indígena. El debate sobre el racismo institucional en las fuerzas de seguridad llega al Congreso. Sectores del establishment policial resisten cualquier reforma.",
    imagen:"https://picsum.photos/seed/discriminacion-94/800/360",
    opciones:[
      { texto:"📋 Protocolo antidiscriminación y capacitación: implementar capacitación obligatoria en DDHH para todas las fuerzas y crear un registro de denuncias raciales.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-3,pobreza:-2,desocupacion:0,produccion:0,confianza:9} },
      { texto:"⚖️ Sumarios y sanciones: abrir sumarios a todos los efectivos involucrados e incorporar el criterio racial a los indicadores de control policial.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-2,pobreza:-1,desocupacion:0,produccion:0,confianza:7} },
      { texto:"🔇 Minimizar el caso: tratar el incidente como un hecho aislado y dejar su investigación en la justicia ordinaria sin señales políticas adicionales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-9} },
    ]
  },
  {
    id:95, tag:"🏠 Vivienda",
    titulo:"El Acceso a la Vivienda en Crisis Extrema",
    descripcion:"El déficit habitacional en Argentina supera los 3,5 millones de viviendas. Los alquileres en el AMBA aumentaron un 280% en tres años. La ley de alquileres fue reformada dos veces sin resolver el problema estructural. Constructoras paralizaron obra nueva por falta de crédito hipotecario. El movimiento de inquilinos pide regulación de precios y la Cámara Inmobiliaria amenaza con retirar propiedades del mercado si se impone techos.",
    imagen:"https://picsum.photos/seed/vivienda-95/800/360",
    opciones:[
      { texto:"🏗️ Plan Nacional de Vivienda Pública: construir 100.000 viviendas en 4 años con fondos de ANSES y créditos del BID a largo plazo.", efectos:{ipc:3,deuda:8,reservas:-4,riesgo:-1,pobreza:-7,desocupacion:-6,produccion:5,confianza:10} },
      { texto:"💰 Crédito hipotecario UVA mejorado: lanzar créditos hipotecarios con tasa real negativa y ajuste por salarios en lugar de inflación.", efectos:{ipc:1,deuda:4,reservas:-2,riesgo:-2,pobreza:-4,desocupacion:-2,produccion:3,confianza:7} },
      { texto:"📋 Regulación de alquileres: establecer un techo del 60% de ajuste anual en contratos de alquiler para proteger a los inquilinos.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:-2,desocupacion:0,produccion:-1,confianza:2} },
    ]
  },
  {
    id:96, tag:"🎓 Reforma Educativa",
    titulo:"La Educación Digital: Brecha Tecnológica en las Aulas",
    descripcion:"El 48% de los alumnos de escuelas públicas del norte del país no tiene acceso a internet en sus hogares. El programa 'Conectar Igualdad' distribuyó 5 millones de netbooks pero sin conectividad ni capacitación docente el impacto fue mínimo. El Ministerio de Educación propone un Plan de Alfabetización Digital que incluye fibra óptica hasta escuelas rurales, formación docente en IA y rediseño curricular del nivel secundario.",
    imagen:"https://picsum.photos/seed/educacion-digital-96/800/360",
    opciones:[
      { texto:"💻 Plan integral con fibra y formación: financiar con ARSAT la conexión de 8.000 escuelas y lanzar el programa de alfabetización digital con contenidos soberanos.", efectos:{ipc:0,deuda:5,reservas:-2,riesgo:-2,pobreza:-4,desocupacion:-2,produccion:4,confianza:9} },
      { texto:"📱 Solución de bajo costo: distribuir acceso satelital mediante acuerdo con ARSAT y tablets en zonas sin fibra óptica.", efectos:{ipc:0,deuda:3,reservas:-1,riesgo:-1,pobreza:-2,desocupacion:-1,produccion:2,confianza:6} },
      { texto:"📋 Sólo la formación docente: priorizar la capacitación sin infraestructura nueva por restricción presupuestaria.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:0,pobreza:-1,desocupacion:0,produccion:1,confianza:2} },
    ]
  },
  {
    id:97, tag:"🌍 Migración",
    titulo:"Migración Regional: ¿Integración o Cierre de Fronteras?",
    descripcion:"Argentina recibe anualmente 80.000 migrantes de países limítrofes, principalmente de Venezuela, Bolivia y Paraguay. Algunos municipios bonaerenses denuncian saturación de sistemas de salud y educación. Organizaciones sociales documentan discriminación y explotación laboral de migrantes. El MERCOSUR tiene normas de libre circulación pero su aplicación es desigual. La sociedad está dividida entre la tradición de país receptor y el malestar por servicios públicos saturados.",
    imagen:"https://picsum.photos/seed/migracion-97/800/360",
    opciones:[
      { texto:"🤝 Integración plena con servicios: fortalecer la Patria Grande, facilitar la regularización de migrantes y reforzar la inversión en salud y educación municipal.", efectos:{ipc:1,deuda:4,reservas:-1,riesgo:-2,pobreza:-3,desocupacion:-2,produccion:3,confianza:8} },
      { texto:"⚖️ Regularización con cupos: abrir ventanillas de regularización con cupos sectoriales para migrantes que cubran empleos formales sin oferta local.", efectos:{ipc:0,deuda:2,reservas:0,riesgo:-1,pobreza:-2,desocupacion:-1,produccion:2,confianza:4} },
      { texto:"🚧 Endurecimiento migratorio: restringir el ingreso y acelerar las deportaciones para reducir la presión sobre los servicios públicos.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:4,pobreza:1,desocupacion:1,produccion:-2,confianza:-8} },
    ]
  },
  {
    id:98, tag:"📡 Medios de Comunicación",
    titulo:"La Desinformación Digital: Fake News en Campaña",
    descripcion:"Un estudio del CONICET revela que el 65% de las noticias políticas que circulan en redes sociales contiene información falsa o manipulada. Tres empresas de comunicación concentran el 70% de la pauta publicitaria oficial. Periodistas independientes denuncian presiones para autocensurarse. La propuesta de una Agencia Nacional de Verificación genera debate: para unos es herramienta de transparencia, para otros un riesgo de censura estatal.",
    imagen:"https://picsum.photos/seed/desinformacion-98/800/360",
    opciones:[
      { texto:"✅ Agencia independiente de verificación: crear un organismo autárquico financiado por el Estado pero gestionado por periodistas y universidades, sin control gubernamental.", efectos:{ipc:0,deuda:2,reservas:0,riesgo:-4,pobreza:0,desocupacion:-1,produccion:0,confianza:10} },
      { texto:"📋 Alfabetización mediática en escuelas: incluir pensamiento crítico y verificación de fuentes en el currículum escolar en lugar de regular los contenidos.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:0,confianza:6} },
      { texto:"🔇 Regulación gubernamental directa: crear un organismo bajo el Ejecutivo para etiquetar contenidos falsos en plataformas digitales.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:3,pobreza:0,desocupacion:0,produccion:0,confianza:-9} },
    ]
  },
  {
    id:99, tag:"🏋️ Deporte",
    titulo:"Argentina como Sede del Mundial Sub-20",
    descripcion:"La FIFA ofrece a Argentina organizar el Mundial Sub-20 en un plazo de 14 meses. El evento requiere remodelar 6 estadios, construir infraestructura de transporte y alojar a 24 selecciones nacionales. El costo estimado es de USD 900 millones con retorno proyectado de USD 1.400 millones en turismo y actividad económica. Arquitectos y sindicalistas de la construcción apoyan el proyecto. Economistas alertan sobre el riesgo de sobrecosto como ocurrió en Brasil 2014.",
    imagen:"https://picsum.photos/seed/mundial-sub20-99/800/360",
    opciones:[
      { texto:"⚽ Aceptar con presupuesto blindado: organizar el Mundial con un esquema de financiamiento mixto (FIFA + privados + mínimo del Estado) y comité anticorrupción.", efectos:{ipc:2,deuda:4,reservas:-3,riesgo:-3,pobreza:-2,desocupacion:-5,produccion:5,confianza:11} },
      { texto:"🤝 Aceptar como co-sede con otro país: negociar una organización conjunta con Uruguay o Chile para reducir el costo y el riesgo.", efectos:{ipc:1,deuda:2,reservas:-1,riesgo:-2,pobreza:-1,desocupacion:-3,produccion:3,confianza:7} },
      { texto:"🚫 Rechazar la candidatura: priorizar el gasto social y negarse a organizar megaeventos deportivos con fondos públicos.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-3} },
    ]
  },
  {
    id:100, tag:"🏛️ Reforma del Estado",
    titulo:"El Gran Acuerdo: ¿Pacto de Gobernabilidad o Rendición?",
    descripcion:"A mitad del mandato, los indicadores muestran que la situación económica es manejable pero el país necesita reformas estructurales que ningún gobierno logró sostener. El principal partido opositor propone un 'Gran Acuerdo Nacional' de largo plazo para reformar el sistema previsional, el régimen impositivo y la coparticipación federal a cambio de apoyo parlamentario. Las bases de tu coalición lo ven como una traición. Los mercados lo celebran como señal de estabilidad.",
    imagen:"https://picsum.photos/seed/gran-acuerdo-100/800/360",
    opciones:[
      { texto:"🤝 Firmar el Gran Acuerdo: negociar con la oposición un programa de reformas consensuadas con cronograma de implementación y control parlamentario conjunto.", efectos:{ipc:-3,deuda:-5,reservas:4,riesgo:-8,pobreza:-3,desocupacion:-2,produccion:5,confianza:8} },
      { texto:"⚖️ Acuerdo parcial: acordar sólo las reformas tributarias y dejar las previsionales y la coparticipación para una próxima legislatura.", efectos:{ipc:-1,deuda:-3,reservas:2,riesgo:-4,pobreza:-1,desocupacion:-1,produccion:3,confianza:4} },
      { texto:"✊ Rechazar el acuerdo: gobernar sin acuerdos con la oposición, confiando en la movilización de la base propia y en el desgaste del adversario.", efectos:{ipc:2,deuda:2,reservas:-2,riesgo:5,pobreza:2,desocupacion:1,produccion:-2,confianza:-6} },
    ]
  },


  // ══════════════════════════════════════════════════════════════
  // EVENTOS ESPECIALES 101–130 — Gravedad Extrema
  // Flags: isSpecial:true | isSevere:true | isExtreme:true | isVPCrisis | isCabinetCorruption
  // isExtreme → se aplican preEffects ANTES de tomar decisión (stats dañados al aparecer)
  // ══════════════════════════════════════════════════════════════

  // ── A. TRAICIÓN INTERNA / CRISIS DE VICEPRESIDENCIA ──────────

  {
    id:101, tag:"💀 Traición Interna",
    isSpecial:true, isSevere:true, isVPCrisis:true,
    titulo:"La Renuncia que Nadie Vio Venir",
    descripcion:"El Vicepresidente convocó a los medios de comunicación sin avisarte. En cadena nacional anunció su 'profundo desacuerdo con la orientación del gobierno' y exigió públicamente tres cambios radicales de política. Si no los obtenemos en 72 horas, renunciará. Las redes explotan. Tus aliados piden firmeza. La oposición pide sangre. Los mercados caen 3% en la apertura. Tu propio equipo está dividido: algunos quieren negociar, otros quieren aceptar la renuncia ya.",
    imagen:"https://picsum.photos/seed/vp-renuncia-101/800/360",
    opciones:[
      { texto:"🤝 Reunión de emergencia: negociar en privado las demandas del Vicepresidente y ceder en puntos menores sin anuncio público.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-3,pobreza:0,desocupacion:0,produccion:0,confianza:-5} },
      { texto:"✊ Aceptar la renuncia públicamente: declarar que quien no acompaña el proyecto debe hacer el camino aparte.", efectos:{ipc:1,deuda:0,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:-10} },
      { texto:"⚖️ Mediación del Congreso: pedir a los presidentes de ambas cámaras que actúen como árbitros del conflicto.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:0,confianza:3} },
      { texto:"🎤 Conferencia de prensa presidencial: salir a defender el programa sin conceder nada y desafiar al Vicepresidente públicamente.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:3,pobreza:0,desocupacion:0,produccion:0,confianza:-2} },
    ]
  },
  {
    id:102, tag:"💀 Traición Interna",
    isSpecial:true, isSevere:true, isVPCrisis:true,
    titulo:"El Vicepresidente Negocia con la Oposición",
    descripcion:"Fotos y conversaciones filtradas muestran al Vicepresidente reunido en secreto con el líder de la oposición durante los últimos tres meses. Según fuentes de inteligencia, ambos están coordinando una estrategia electoral conjunta para 2027. Ante la consulta, el Vicepresidente no lo desmintió. La traición a la coalición es evidente. Sin embargo, el Vicepresidente tiene apoyo popular propio y sus seguidores amenazaron con escindirse del partido.",
    imagen:"https://picsum.photos/seed/vp-traicion-102/800/360",
    opciones:[
      { texto:"📋 Confrontación directa: exigir al Vicepresidente una declaración pública de lealtad al gobierno o presentar la renuncia.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:3,pobreza:0,desocupacion:0,produccion:0,confianza:-6} },
      { texto:"🤫 Gestión silenciosa: negociar en privado que el Vicepresidente baje el perfil a cambio de no ser desplazado públicamente.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:0,confianza:-4} },
      { texto:"📢 Filtrar contrainformación: publicar los logros del gobierno donde el Vicepresidente tuvo rol central y atarlo públicamente al proyecto.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-1,pobreza:0,desocupacion:0,produccion:0,confianza:3} },
      { texto:"🔪 Separarse del Vicepresidente: anunciar que el gobierno opera independientemente, sin coordinación formal con la Vicepresidencia.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:5,pobreza:0,desocupacion:0,produccion:0,confianza:-8} },
    ]
  },

  // ── B. CORRUPCIÓN DE GABINETE ─────────────────────────────────

  {
    id:103, tag:"🔴 Escándalo de Gabinete",
    isSpecial:true, isSevere:true, isCabinetCorruption:true,
    titulo:"El Ministro de Economía y las Cuentas en el Exterior",
    descripcion:"La Unidad de Investigaciones Financieras detectó transferencias por USD 800.000 a cuentas offshore vinculadas al Ministro de Economía. Las transferencias se realizaron durante el proceso de licitación de importaciones farmacéuticas donde los permisos fueron otorgados a empresas que triplicaron sus precios. La justicia federal abrió una causa. El ministro es la pieza clave del equipo económico: sin él, el programa fiscal colapsa en semanas. La decisión que tomés definirá tu legado.",
    imagen:"https://picsum.photos/seed/minister-corruption-103/800/360",
    opciones:[
      { texto:"⚖️ Tolerancia cero: separar inmediatamente al ministro y colaborar activamente con la justicia aunque el programa económico sufra.", efectos:{ipc:2,deuda:2,reservas:0,riesgo:-8,pobreza:1,desocupacion:1,produccion:-2,confianza:14} },
      { texto:"🚪 Salida negociada: convencer al ministro de presentar 'renuncia por razones personales' y acordar en secreto su cooperación con la justicia.", efectos:{ipc:1,deuda:1,reservas:0,riesgo:-3,pobreza:0,desocupacion:0,produccion:-1,confianza:2} },
      { texto:"🛡️ Defensa política: declarar que la causa es una maniobra del poder judicial y los medios para desestabilizar el programa económico.", corrupta:true, efectos:{ipc:0,deuda:0,reservas:0,riesgo:8,pobreza:0,desocupacion:0,produccion:0,confianza:-16} },
      { texto:"🔎 Auditoría total: ordenar una auditoría forense completa del ministerio con interventor externo e independiente.", efectos:{ipc:1,deuda:2,reservas:0,riesgo:-5,pobreza:0,desocupacion:0,produccion:-1,confianza:9} },
    ]
  },
  {
    id:104, tag:"🔴 Escándalo de Gabinete",
    isSpecial:true, isSevere:true, isCabinetCorruption:true,
    titulo:"La Ministra Social y las Licitaciones Fantasma",
    descripcion:"Una investigación periodística revela que el Ministerio de Desarrollo Social adjudicó contratos por $4.000 millones a empresas que no existen o que se crearon semanas antes de cada licitación. La ministra es una de tus aliadas más cercanas y tiene base electoral propia en cinco provincias. Si la sacrificás, parte de tu coalición puede desbandarse. Si la cubrís, el escándalo podría arrastrarte a vos también. La causa ya llegó al juzgado federal.",
    imagen:"https://picsum.photos/seed/ministry-social-corruption-104/800/360",
    opciones:[
      { texto:"⚖️ Separación y justicia: desafuero inmediato, colaboración con el juzgado federal y convocatoria a nuevas autoridades del ministerio.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-7,pobreza:1,desocupacion:0,produccion:0,confianza:12} },
      { texto:"🔒 Licencia preventiva: suspender a la ministra con goce de sueldo mientras dura la investigación y esperar el fallo.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:0,confianza:3} },
      { texto:"📢 Ataque mediático: cuestionar la fuente del periodismo, tildar la investigación de 'campaña sucia' y movilizar a las bases.", corrupta:true, efectos:{ipc:0,deuda:0,reservas:0,riesgo:5,pobreza:0,desocupacion:0,produccion:0,confianza:-14} },
      { texto:"🔄 Reestructuración silenciosa: reorganizar el ministerio, cambiar las firmas responsables y ofrecer devolución de fondos antes del juicio.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-4,pobreza:0,desocupacion:0,produccion:0,confianza:5} },
    ]
  },
  {
    id:105, tag:"🔴 Escándalo de Gabinete",
    isSpecial:true, isSevere:true, isCabinetCorruption:true,
    titulo:"El Ministro de Producción y los Negocios Propios",
    descripcion:"Documentos reservados del ARCA muestran que el Ministro de Producción posee acciones en tres empresas que se beneficiaron directamente de resoluciones ministeriales que él mismo firmó: exenciones impositivas, habilitaciones y subsidios. El conflicto de interés es flagrante. Las empresas generan $600 millones anuales de rentabilidad adicional gracias a sus propias decisiones. Los organismos de control miran hacia el otro lado.",
    imagen:"https://picsum.photos/seed/production-minister-105/800/360",
    opciones:[
      { texto:"⚖️ Destitución total: separar al ministro, remitir las actuaciones a la justicia y anular las resoluciones viciadas.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-6,pobreza:0,desocupacion:0,produccion:-2,confianza:11} },
      { texto:"📋 Comisión de ética: crear una comisión bicameral para analizar el conflicto de interés y suspender las resoluciones cuestionadas.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-3,pobreza:0,desocupacion:0,produccion:-1,confianza:5} },
      { texto:"🤝 Acuerdo confidencial: negociar que el ministro ceda en fideicomiso ciego sus participaciones y se mantenga en el cargo.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:0,confianza:-2} },
      { texto:"🛡️ Encubrimiento activo: archivar los documentos, presionar al organismo de control y defender al ministro en público.", corrupta:true, efectos:{ipc:0,deuda:0,reservas:0,riesgo:9,pobreza:0,desocupacion:0,produccion:1,confianza:-15} },
    ]
  },
  {
    id:106, tag:"🔴 Escándalo de Gabinete",
    isSpecial:true, isSevere:true, isCabinetCorruption:true,
    titulo:"La Familia Presidencial en el Expediente",
    descripcion:"Una investigación judicial vincula directamente al hermano del Presidente y a dos primos lejanos con contratos estatales por USD 220 millones obtenidos gracias a 'gestiones especiales' ante organismos del gobierno. Las declaraciones juradas muestran incrementos patrimoniales inexplicables. La oposición exige tu renuncia. Tu partido pide silencio. Los medios internacionales encienden la nota. Deberás decidir entre tu familia y tu legado histórico.",
    imagen:"https://picsum.photos/seed/presidential-family-106/800/360",
    opciones:[
      { texto:"⚖️ Justicia sin excepciones: pedir públicamente que la justicia actúe con total independencia e indicar que ningún vínculo familiar los protege.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-9,pobreza:0,desocupacion:0,produccion:0,confianza:18} },
      { texto:"📋 Mediación familiar: solicitar que los familiares devuelvan los fondos voluntariamente y se aparten de toda actividad vinculada al Estado.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-4,pobreza:0,desocupacion:0,produccion:0,confianza:7} },
      { texto:"🛡️ Defensa familiar: declarar que la acusación es una operación política para golpear a la familia presidencial y afectar al gobierno.", corrupta:true, efectos:{ipc:0,deuda:0,reservas:0,riesgo:10,pobreza:0,desocupacion:0,produccion:0,confianza:-20} },
    ]
  },

  // ── C. RENUNCIA MASIVA Y QUIEBRE INTERNO ──────────────────────

  {
    id:107, tag:"💀 Traición Interna",
    isSpecial:true, isSevere:true,
    titulo:"Tres Ministros Renuncian Juntos",
    descripcion:"En una acción coordinada e inesperada, los titulares de Economía, Interior y Relaciones Exteriores presentaron renuncias simultáneas con un comunicado conjunto donde critican 'decisiones tomadas sin consulta' y la 'concentración de poder en el entorno íntimo del Presidente'. La filtración del memo interno muestra que llevan dos meses coordinando esto. El mercado reacciona con una caída del 6%. Tenés menos de 24 horas para contener el caos institucional.",
    imagen:"https://picsum.photos/seed/mass-resignation-107/800/360",
    opciones:[
      { texto:"🔄 Reconstruir el gabinete de forma urgente: aceptar las tres renuncias y anunciar un nuevo equipo en 48 horas con perfiles técnicos respetados.", efectos:{ipc:3,deuda:2,reservas:-2,riesgo:3,pobreza:1,desocupacion:0,produccion:-2,confianza:4} },
      { texto:"📢 Salir al frente de la crisis: conferencia presidencial de emergencia para presentar el nuevo gabinete y la agenda del gobierno.", efectos:{ipc:2,deuda:1,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:-1,confianza:6} },
      { texto:"⚔️ Contraataque político: filtrar información comprometedora sobre los tres ministros salientes y desacreditarlos en los medios.", corrupta:true, efectos:{ipc:1,deuda:0,reservas:0,riesgo:4,pobreza:0,desocupacion:0,produccion:-1,confianza:-10} },
      { texto:"🤝 Convocar al Congreso: pedir sesión de emergencia parlamentaria y ofrecer al Congreso un rol de supervisión más amplio del ejecutivo.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:0,confianza:5} },
    ]
  },
  {
    id:108, tag:"💀 Traición Interna",
    isSpecial:true, isSevere:true,
    titulo:"La Fractura en la Coalición de Gobierno",
    descripcion:"Un bloque parlamentario interno —el tercio más grande dentro de tu propio partido— anunció que votará contra el próximo proyecto de ley central del gobierno. Sin ese bloque, el gobierno pierde la mayoría parlamentaria para prácticamente todo. Sus tres líderes exigen cinco ministerios, cambio en la política exterior y revisión del programa económico. El acuerdo es político, no técnico. Cualquier decisión que tomés afecta la gobernabilidad.",
    imagen:"https://picsum.photos/seed/coalition-fracture-108/800/360",
    opciones:[
      { texto:"🤝 Negociar los ministerios: ceder tres carteras secundarias al sector interno y ajustar la política exterior sin tocar lo económico.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-4,pobreza:0,desocupacion:0,produccion:0,confianza:-3} },
      { texto:"✊ Gobernar en minoría: rechazar el chantaje y buscar apoyos puntuales en la oposición moderada proyecto por proyecto.", efectos:{ipc:1,deuda:0,reservas:0,riesgo:4,pobreza:0,desocupacion:0,produccion:0,confianza:5} },
      { texto:"🔄 Buscar alianza alternativa: acercarse al partido de centro que tiene 40 diputados a cambio de incluir parte de su agenda.", efectos:{ipc:-1,deuda:-1,reservas:1,riesgo:-2,pobreza:-1,desocupacion:0,produccion:1,confianza:3} },
      { texto:"🗳️ Consulta popular: llamar a un referéndum sobre los puntos de conflicto y plebiscitar el programa de gobierno.", efectos:{ipc:2,deuda:2,reservas:-1,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:8} },
    ]
  },

  // ── D. DILEMAS SIN SALIDA BUENA ───────────────────────────────

  {
    id:109, tag:"⚡ Dilema Sin Salida",
    isSpecial:true, isSevere:true,
    titulo:"El Ultimátum del FMI: Todo o Nada",
    descripcion:"El FMI envió al gobierno un memorándum secreto —ahora filtrado a los medios— con un ultimátum de 72 horas: ajuste fiscal del 4% del PBI de forma inmediata, despido de 80.000 empleados públicos y liberación del tipo de cambio. Si el gobierno no acepta, el Fondo retira su apoyo y activa el proceso de default técnico de la deuda. Todas las opciones disponibles implican un costo social enorme. No hay salida sin daño grave.",
    imagen:"https://picsum.photos/seed/imf-ultimatum-109/800/360",
    opciones:[
      { texto:"💉 Aceptar el ajuste completo: el FMI cumple pero el gobierno pierde legitimidad social y puede caer por la calle.", efectos:{ipc:-5,deuda:-10,reservas:15,riesgo:-18,pobreza:15,desocupacion:10,produccion:-6,confianza:-18} },
      { texto:"🔴 Rechazo y default controlado: asumir el default técnico, salvar los servicios esenciales y reestructurar luego.", efectos:{ipc:18,deuda:-20,reservas:-10,riesgo:30,pobreza:10,desocupacion:7,produccion:-15,confianza:-10} },
      { texto:"⚖️ Ajuste parcial negociado: ofrecer el 60% de las medidas y jugar al límite del tiempo con el Fondo.", efectos:{ipc:-2,deuda:-5,reservas:5,riesgo:-8,pobreza:7,desocupacion:4,produccion:-3,confianza:-8} },
      { texto:"💰 Impuesto de emergencia a la riqueza: financiar el ajuste con un tributo extraordinario sobre las 200 mayores fortunas del país.", efectos:{ipc:0,deuda:-3,reservas:3,riesgo:4,pobreza:-2,desocupacion:0,produccion:-3,confianza:4} },
    ]
  },
  {
    id:110, tag:"⚡ Dilema Sin Salida",
    isSpecial:true, isSevere:true,
    titulo:"Rehenes en la Patagonia",
    descripcion:"Un grupo armado tomó una refinería de petróleo en la Patagonia con 40 rehenes, incluyendo 8 menores de edad. Exigen la liberación de 12 presos que ellos llaman 'presos políticos' —en realidad son personas condenadas por violencia y atentados. Los servicios de inteligencia estiman que una operación de rescate tiene probabilidad del 40% de dejar víctimas. Negociar establece un precedente que puede repetirse. No hacer nada daña la producción energética 38 días seguidos.",
    imagen:"https://picsum.photos/seed/hostages-patagonia-110/800/360",
    opciones:[
      { texto:"⚔️ Operación de rescate: desplegar Fuerzas Especiales. Probabilidad del 60% de liberar todos los rehenes, 40% de víctimas.", efectos:{ipc:0,deuda:2,reservas:-2,riesgo:-2,pobreza:0,desocupacion:0,produccion:-4,confianza:3} },
      { texto:"🤝 Negociación con mediadores: aceptar la mediación del CICR y ofrecer condiciones de liberación sin presos, sólo garantías procesales.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-1,pobreza:0,desocupacion:0,produccion:-6,confianza:2} },
      { texto:"🔓 Liberar presos: ceder a la demanda y liberar a los 12 condenados a cambio de todos los rehenes.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:8,pobreza:0,desocupacion:0,produccion:-3,confianza:-12} },
      { texto:"⏳ Sitio prolongado: rodear, negarse a ceder y desgastar al grupo armado con tiempo y presión psicológica.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:-10,confianza:-4} },
    ]
  },
  {
    id:111, tag:"⚡ Dilema Sin Salida",
    isSpecial:true, isSevere:true,
    titulo:"La Industria que Mata el Río",
    descripcion:"Un complejo petroquímico que emplea a 42.000 trabajadores —el principal empleador de cuatro provincias— es responsable de contaminar el río más importante de la región con metales pesados. El cáncer infantil en la zona es el doble de la media nacional. La empresa tiene fondos para limpiar pero lo viene dilatando hace 15 años con recursos judiciales. Si la cerrás, 42.000 familias colapsan económicamente. Si no la cerrás, la contaminación continúa matando.",
    imagen:"https://picsum.photos/seed/industry-river-111/800/360",
    opciones:[
      { texto:"🏭 Cierre inmediato: clausura total de la planta y plan de emergencia social para los trabajadores afectados.", efectos:{ipc:2,deuda:6,reservas:-4,riesgo:1,pobreza:4,desocupacion:8,produccion:-10,confianza:6} },
      { texto:"⚖️ Plan de reconversión obligatoria: dar 18 meses a la empresa para limpiar o cerrar, con monitoreo externo cada 30 días.", efectos:{ipc:0,deuda:2,reservas:0,riesgo:-1,pobreza:-1,desocupacion:0,produccion:-2,confianza:4} },
      { texto:"🏛️ Nacionalización: expropiar la planta, limpiar con fondos públicos y mantener el empleo bajo gestión estatal.", efectos:{ipc:0,deuda:8,reservas:-5,riesgo:3,pobreza:-3,desocupacion:-4,produccion:0,confianza:7} },
      { texto:"💰 Multa exorbitante: aplicar la máxima multa diaria disponible por ley hasta que la empresa limpie, sin cerrar.", efectos:{ipc:0,deuda:-2,reservas:2,riesgo:0,pobreza:2,desocupacion:0,produccion:-1,confianza:2} },
    ]
  },
  {
    id:112, tag:"⚡ Dilema Sin Salida",
    isSpecial:true, isSevere:true,
    titulo:"Reprimir o Dejar Arder",
    descripcion:"Una protesta masiva contra los tarifazos degeneró en disturbios. 300 personas destruyen negocios, prenden fuego autos y cortan la autopista principal durante la tercera noche consecutiva. Las pérdidas ya superan los USD 90 millones. Los empresarios exigen represión inmediata. Los organismos de derechos humanos y la oposición progresista advierten que una represión dura costará vidas y deslegitimará al gobierno por años. No hay respuesta sin costo grave.",
    imagen:"https://picsum.photos/seed/riots-112/800/360",
    opciones:[
      { texto:"🚔 Operativo de desalojo total: Fuerzas Federales con protocolo de mínima fuerza pero orden de despejar la autopista antes de las 6 AM.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:6,pobreza:2,desocupacion:0,produccion:2,confianza:-14} },
      { texto:"💬 Negociación urgente: suspender los tarifazos por 90 días y abrir mesa de diálogo antes de dispersar la protesta.", efectos:{ipc:4,deuda:3,reservas:-2,riesgo:-2,pobreza:-3,desocupacion:0,produccion:-3,confianza:9} },
      { texto:"🕊️ Desalojo gradual con mediadores: presencia de defensoras del pueblo, procesiones religiosas y líderes sociales para dialogar y liberar la autopista.", efectos:{ipc:1,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:-2,confianza:3} },
      { texto:"🔇 Esperar el desgaste: no intervenir, esperar que los disturbios se agoten solos. Costo en imagen pero evita confrontación directa.", efectos:{ipc:0,deuda:0,reservas:-3,riesgo:3,pobreza:1,desocupacion:0,produccion:-5,confianza:-7} },
    ]
  },
  {
    id:113, tag:"⚡ Dilema Sin Salida",
    isSpecial:true, isSevere:true,
    titulo:"La Droga Prohibida que Salva Vidas",
    descripcion:"Un tratamiento oncológico de nueva generación desarrollado en un país bajo sanciones internacionales tiene 78% de efectividad en leucemia infantil —el triple de lo disponible actualmente. Importarlo viola los tratados internacionales y puede costar financiamiento del BID y FMI. No importarlo condena a 1.400 niños diagnosticados este año. Los padres organizan una campaña viral. Los aliados internacionales presionan para que Argentina cumpla las sanciones.",
    imagen:"https://picsum.photos/seed/drug-sanctions-113/800/360",
    opciones:[
      { texto:"💊 Importar el tratamiento: violar las sanciones para salvar 1.400 vidas, asumiendo las consecuencias diplomáticas y financieras.", efectos:{ipc:0,deuda:4,reservas:-5,riesgo:5,pobreza:-4,desocupacion:0,produccion:0,confianza:10} },
      { texto:"🔬 Producción local de emergencia: autorizar al CONICET a replicar la fórmula invocando la excepción humanitaria del Acuerdo TRIPS.", efectos:{ipc:0,deuda:3,reservas:-2,riesgo:3,pobreza:-2,desocupacion:-1,produccion:2,confianza:8} },
      { texto:"🌐 Presión en la ONU: impulsar una excepción humanitaria en el Consejo de Seguridad para los 3 países con mayor incidencia de la enfermedad.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-1,pobreza:-1,desocupacion:0,produccion:0,confianza:5} },
      { texto:"📋 Respetar las sanciones: declinar el tratamiento y priorizar la relación con los organismos internacionales financiadores.", efectos:{ipc:0,deuda:-3,reservas:2,riesgo:-4,pobreza:2,desocupacion:0,produccion:0,confianza:-14} },
    ]
  },

  // ── E. EVENTOS EXTREMOS CON PRE-EFECTOS ───────────────────────

  {
    id:114, tag:"🌍 Crisis Global",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:12, deuda:8, reservas:-18, riesgo:25, pobreza:8, desocupacion:5, produccion:-10, confianza:-8},
    titulo:"Colapso Financiero Global: El Mundo se Derrumba",
    descripcion:"Los mercados financieros globales colapsaron en 48 horas. Wall Street cayó 42%, los mercados europeos 38% y los asiáticos 35%. La quiebra de tres bancos sistémicos de EE.UU. generó una corrida global sin precedentes desde 1929. El crédito internacional se secó de un día para el otro. Las reservas del BCRA ya cayeron USD 5.000 millones en las últimas horas y el riesgo país se disparó 1.200 puntos antes de que pudieras convocar al gabinete de emergencia. Las consecuencias llegaron solas — ahora hay que decidir cómo responder.",
    imagen:"https://picsum.photos/seed/global-crisis-114/800/360",
    opciones:[
      { texto:"🔒 Controles de capital de emergencia: cierre total del mercado cambiario, intervención del BCRA y suspensión de operaciones bursátiles por 72 horas.", efectos:{ipc:5,deuda:2,reservas:5,riesgo:-5,pobreza:3,desocupacion:2,produccion:-8,confianza:-5} },
      { texto:"🤝 Coordinación multilateral: solicitar asistencia del FMI y Banco Mundial e integrarse al G20 de respuesta a la crisis global.", efectos:{ipc:2,deuda:5,reservas:8,riesgo:-10,pobreza:2,desocupacion:1,produccion:-3,confianza:3} },
      { texto:"💵 Plan de dolarización de emergencia: fijar el peso al dólar y requerir asistencia del Tesoro de EEUU como prestamista de última instancia.", efectos:{ipc:-8,deuda:6,reservas:-15,riesgo:-8,pobreza:8,desocupacion:6,produccion:-5,confianza:-8} },
      { texto:"🏛️ Economía de guerra: control de precios de todos los bienes esenciales, racionamiento de divisas y priorización de producción nacional.", efectos:{ipc:-3,deuda:3,reservas:-2,riesgo:8,pobreza:0,desocupacion:-2,produccion:3,confianza:2} },
    ]
  },
  {
    id:115, tag:"☣️ Pandemia Global",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:8, deuda:10, reservas:-12, riesgo:18, pobreza:12, desocupacion:8, produccion:-15, confianza:-10},
    titulo:"Pandemia Global: El Virus que Nadie Esperaba",
    descripcion:"La OMS declaró pandemia de fase 6 por un nuevo virus con 11% de mortalidad en mayores de 50 años y 3% de mortalidad general. En 10 días, 40 países cerraron sus fronteras. Los vuelos se cancelaron masivamente. Los primeros casos en el país ya son 3.000 y la curva es exponencial. Las cadenas de suministro de medicamentos e insumos médicos ya colapsaron antes de que la situación local se torne crítica. El sistema de salud tiene reservas para 30 días.",
    imagen:"https://picsum.photos/seed/pandemic-115/800/360",
    opciones:[
      { texto:"🔒 Confinamiento total: cuarentena obligatoria nacional, cierre de todas las actividades no esenciales y militarización de la distribución de alimentos.", efectos:{ipc:3,deuda:10,reservas:-5,riesgo:-8,pobreza:5,desocupacion:8,produccion:-18,confianza:6} },
      { texto:"🏥 Expansión máxima del sistema sanitario: construir hospitales de campaña, contratar 20.000 trabajadores de salud y importar equipo de emergencia.", efectos:{ipc:2,deuda:8,reservas:-8,riesgo:-5,pobreza:3,desocupacion:-6,produccion:-5,confianza:10} },
      { texto:"🔬 Vacuna soberana de emergencia: asignar al CONICET y ANLIS recursos ilimitados para desarrollar una vacuna nacional y producir antivirales.", efectos:{ipc:1,deuda:6,reservas:-4,riesgo:-3,pobreza:2,desocupacion:-3,produccion:1,confianza:8} },
      { texto:"🌐 Compra masiva de vacunas: negociar de urgencia con todos los laboratorios del mundo, incluyendo productores de países sancionados, para immunizar al país primero.", efectos:{ipc:0,deuda:5,reservas:-6,riesgo:-4,pobreza:1,desocupacion:0,produccion:-2,confianza:7} },
    ]
  },
  {
    id:116, tag:"⚔️ Conflicto Bélico",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:8, deuda:5, reservas:-10, riesgo:20, pobreza:5, desocupacion:3, produccion:-8, confianza:-5},
    titulo:"Guerra en la Región: El Fuego Llega a las Fronteras",
    descripcion:"Dos países vecinos entraron en guerra abierta. Los primeros bombardeos destruyeron infraestructura energética regional compartida. El precio del petróleo subió 60% en 24 horas. Ya llegaron 180.000 refugiados en los últimos tres días y las estimaciones hablan de 1,5 millones en 60 días. La OTAN y el bloque asiático están tomando posiciones opuestas. La Argentina aún no definió su postura y todos la están mirando.",
    imagen:"https://picsum.photos/seed/regional-war-116/800/360",
    opciones:[
      { texto:"🕊️ Neutralidad activa: declarar neutralidad formal, abrir corredor humanitario y postularse como sede de negociaciones de paz.", efectos:{ipc:3,deuda:3,reservas:-3,riesgo:-5,pobreza:-2,desocupacion:-1,produccion:-2,confianza:10} },
      { texto:"🌎 Rol humanitario: abrir fronteras a refugiados con sistema de integración acelerado y solicitar financiamiento internacional para el proceso.", efectos:{ipc:2,deuda:5,reservas:-4,riesgo:-2,pobreza:-1,desocupacion:-2,produccion:0,confianza:8} },
      { texto:"⚡ Aprovechar el contexto energético: activar producción de gas y petróleo nacionales para cubrir la demanda regional con precio de mercado.", efectos:{ipc:-2,deuda:-3,reservas:8,riesgo:3,pobreza:-2,desocupacion:-3,produccion:8,confianza:2} },
      { texto:"🛡️ Postura defensiva: reforzar las fronteras, suspender tratados con los países en conflicto y priorizar la seguridad nacional.", efectos:{ipc:1,deuda:4,reservas:-3,riesgo:2,pobreza:1,desocupacion:0,produccion:-3,confianza:-1} },
    ]
  },
  {
    id:117, tag:"🌍 Guerra Mundial",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:20, deuda:15, reservas:-25, riesgo:35, pobreza:12, desocupacion:8, produccion:-20, confianza:-20},
    titulo:"Tercera Guerra Mundial: El Apocalipsis Geopolítico",
    descripcion:"Las potencias nucleares entran en conflicto directo. Rusia, China y EE.UU. se enfrentan en tres frentes simultáneos. El comercio internacional virtualmente cesó. La ONU está paralizada. Los suministros de chips, petróleo, medicamentos y alimentos importados colapsaron antes de que el gobierno pudiera actuar. La economía ya recibió el golpe — los indicadores cayeron solos. El mundo cambió para siempre y Argentina debe definir su rol en el nuevo orden que surgirá.",
    imagen:"https://picsum.photos/seed/wwiii-117/800/360",
    opciones:[
      { texto:"🕊️ Neutralidad total y soberana: declarar neutralidad en el conflicto, rescindir alianzas militares y activar autosuficiencia alimentaria y energética máxima.", efectos:{ipc:5,deuda:3,reservas:-3,riesgo:-8,pobreza:3,desocupacion:2,produccion:5,confianza:6} },
      { texto:"🤝 Rol humanitario global: postular a Argentina como corredor humanitario, sede de gobierno en exilio y centro médico internacional.", efectos:{ipc:2,deuda:6,reservas:-5,riesgo:-5,pobreza:-2,desocupacion:-4,produccion:0,confianza:12} },
      { texto:"🌾 Potencia alimentaria de emergencia: reorientar toda la capacidad agropecuaria e industrial al abastecimiento mundial — la Argentina como granero del mundo en crisis.", efectos:{ipc:-5,deuda:-5,reservas:15,riesgo:-3,pobreza:-5,desocupacion:-6,produccion:12,confianza:5} },
      { texto:"🛡️ Alineamiento estratégico: unirse a uno de los bloques a cambio de protección militar, financiamiento y acceso preferencial a tecnología.", efectos:{ipc:-2,deuda:-8,reservas:10,riesgo:8,pobreza:0,desocupacion:-2,produccion:3,confianza:-5} },
    ]
  },
  {
    id:118, tag:"✊ Golpe de Estado",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:0, deuda:0, reservas:-8, riesgo:25, pobreza:0, desocupacion:0, produccion:-5, confianza:-22},
    titulo:"Intento de Golpe de Estado",
    descripcion:"El Jefe del Estado Mayor Conjunto rodeó la Casa Rosada con vehículos blindados al amanecer. Una cadena de cuarteles en todo el país está en alerta máxima. En un comunicado leyó un ultimátum de 6 horas: renuncia del gabinete completo y llamado a elecciones adelantadas, o las Fuerzas Armadas tomarán el gobierno. Los presidentes de Brasil, Uruguay y Chile llamaron para expresar su apoyo. La sociedad civil se moviliza espontáneamente. La democracia pende de un hilo.",
    imagen:"https://picsum.photos/seed/coup-attempt-118/800/360",
    opciones:[
      { texto:"✊ Resistencia constitucional: atrincherarse en Casa Rosada con los ministros leales, convocar al pueblo a las plazas y desafiar el ultimátum.", efectos:{ipc:0,deuda:0,reservas:-3,riesgo:5,pobreza:0,desocupacion:0,produccion:-3,confianza:20} },
      { texto:"🤝 Negociación con los militares: abrir un canal privado con los mandos rebeldes y ofrecer cambios de gabinete sin elecciones adelantadas.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-5,pobreza:0,desocupacion:0,produccion:0,confianza:-8} },
      { texto:"🌍 Internacionalización inmediata: transmitir el ultimátum en vivo, pedir activación del TIAR y protección democrática internacional.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-8,pobreza:0,desocupacion:0,produccion:-1,confianza:15} },
      { texto:"📋 Convocatoria al Congreso: pedir sesión de emergencia del Congreso y delegar en el Poder Legislativo la respuesta institucional.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-3,pobreza:0,desocupacion:0,produccion:0,confianza:10} },
    ]
  },
  {
    id:119, tag:"🌋 Catástrofe Natural",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:5, deuda:8, reservas:-8, riesgo:5, pobreza:15, desocupacion:5, produccion:-12, confianza:-5},
    titulo:"Terremoto 8.2: La Tierra se Abre",
    descripcion:"Un terremoto de magnitud 8.2 con epicentro a 30 km de la segunda ciudad más grande del país. Los primeros reportes confirman 3.400 muertos y la cifra sube cada hora. 600.000 personas quedaron sin vivienda. Los hospitales de la zona colapsaron. Rutas, puentes y la planta potabilizadora destruidos. La coordinación con las provincias es caótica. Llegaron offerts de ayuda internacional de 40 países. El FMI ofreció fondos de emergencia sin condicionalidades. El tiempo de las decisiones es ahora.",
    imagen:"https://picsum.photos/seed/earthquake-119/800/360",
    opciones:[
      { texto:"🚁 Operativo federal máximo: movilizar el 100% del Ejército, Gendarmería y Prefectura para coordinación unificada bajo mando presidencial.", efectos:{ipc:0,deuda:8,reservas:-6,riesgo:-4,pobreza:-8,desocupacion:-5,produccion:2,confianza:14} },
      { texto:"🌍 Corredor humanitario internacional: aceptar TODA la ayuda exterior disponible con coordinación de la ONU para maximizar el alcance.", efectos:{ipc:0,deuda:3,reservas:0,riesgo:-3,pobreza:-6,desocupacion:-3,produccion:1,confianza:11} },
      { texto:"🏗️ Reconstrucción inmediata: emitir un bono de reconstrucción de USD 5.000 millones con garantía soberana para comenzar obras en 72 horas.", efectos:{ipc:3,deuda:12,reservas:-4,riesgo:4,pobreza:-5,desocupacion:-6,produccion:4,confianza:8} },
      { texto:"📋 Respuesta federalizada: coordinar desde Nación pero mantener autonomía provincial en la ejecución de la emergencia.", efectos:{ipc:0,deuda:4,reservas:-3,riesgo:0,pobreza:-3,desocupacion:-2,produccion:0,confianza:4} },
    ]
  },
  {
    id:120, tag:"☢️ Accidente Nuclear",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:5, deuda:5, reservas:-5, riesgo:15, pobreza:8, desocupacion:3, produccion:-12, confianza:-15},
    titulo:"Accidente Nuclear en Atucha: Nivel 5",
    descripcion:"Una falla en el sistema de refrigeración de la planta Atucha II desencadenó un accidente de nivel 5 en la escala INES. Hay 4 muertos confirmados entre el personal técnico. La zona de exclusión ya se amplió a 50 km, afectando a 2,1 millones de personas. El suministro eléctrico al Gran Buenos Aires cayó 35%. La OIEA está en camino. Los primeros indicios de contaminación radiológica se detectaron a 70 km. El pánico ya está instalado y los medios internacionales están cubriendo en vivo.",
    imagen:"https://picsum.photos/seed/nuclear-accident-120/800/360",
    opciones:[
      { texto:"📢 Transparencia total: transmitir en cadena nacional todos los datos disponibles, pedir ayuda a la OIEA y IAEA, y ordenar la evacuación completa de la zona.", efectos:{ipc:3,deuda:6,reservas:-4,riesgo:-4,pobreza:3,desocupacion:2,produccion:-8,confianza:12} },
      { texto:"🔬 Contención técnica prioritaria: focalizar todos los recursos en enfriar el reactor antes de tomar medidas de comunicación pública para evitar el pánico masivo.", efectos:{ipc:2,deuda:4,reservas:-2,riesgo:2,pobreza:2,desocupacion:1,produccion:-5,confianza:-6} },
      { texto:"🚁 Evacuación máxima: ampliar la zona de exclusión a 100 km y evacuar por la fuerza aunque implique el colapso logístico de la región.", efectos:{ipc:1,deuda:8,reservas:-5,riesgo:-2,pobreza:1,desocupacion:3,produccion:-10,confianza:5} },
      { texto:"🔒 Gestión de la información: controlar el flujo de noticias, minimizar el incidente públicamente mientras se trabaja en la solución técnica.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:6,pobreza:1,desocupacion:0,produccion:-4,confianza:-14} },
    ]
  },
  {
    id:121, tag:"💻 Ciberataque Masivo",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:3, deuda:2, reservas:-5, riesgo:10, pobreza:2, desocupacion:2, produccion:-8, confianza:-8},
    titulo:"Ciberataque Total a la Infraestructura Crítica",
    descripcion:"Un sofisticado ataque informático atribuido por inteligencia a un actor estatal extranjero golpeó simultáneamente el sistema bancario, la red eléctrica, la red hospitalaria y el sistema de pagos de ANSES. Los daños ya son visibles: los cajeros no funcionan, los hospitales operan en modo manual, 8 millones de jubilados no cobraron sus haberes y el sistema de pagos interbancario está caído. Los atacantes piden un rescate de USD 1.000 millones en 24 horas.",
    imagen:"https://picsum.photos/seed/cyberattack-121/800/360",
    opciones:[
      { texto:"🛡️ Emergencia de ciberseguridad: activar el protocolo CERT nacional, desconectar sistemas comprometidos y pedir asistencia técnica inmediata a aliados de inteligencia.", efectos:{ipc:1,deuda:3,reservas:-2,riesgo:-4,pobreza:1,desocupacion:1,produccion:-5,confianza:5} },
      { texto:"💻 Contraataque digital: activar las capacidades ofensivas del Comando Conjunto de Ciberdefensa contra la infraestructura del atacante.", efectos:{ipc:0,deuda:2,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:-3,confianza:3} },
      { texto:"🔌 Desconexión preventiva total: aislar los sistemas críticos de internet y operar en modo manual hasta restaurar la seguridad.", efectos:{ipc:2,deuda:1,reservas:0,riesgo:-6,pobreza:2,desocupacion:2,produccion:-12,confianza:2} },
      { texto:"💰 Pago del rescate: negociar y pagar en secreto para recuperar los sistemas antes de que el caos se profundice.", efectos:{ipc:0,deuda:4,reservas:-4,riesgo:5,pobreza:1,desocupacion:0,produccion:-2,confianza:-8} },
    ]
  },
  {
    id:122, tag:"🌊 Catástrofe Climática",
    isSpecial:true, isExtreme:true,
    preEffects:{ipc:6, deuda:6, reservas:-7, riesgo:5, pobreza:10, desocupacion:4, produccion:-15, confianza:-5},
    titulo:"Triple Catástrofe Climática Simultánea",
    descripcion:"El peor mes climático en la historia del país: un huracán de categoría 4 devastó el noreste (240.000 desplazados), la peor sequía en 80 años destruyó el 60% de la cosecha del sur, y lluvias históricas inundaron las principales cuencas agrícolas del centro. Tres catástrofes simultáneas superaron toda capacidad de respuesta estatal. La CEPAL estima pérdidas de USD 20.000 millones. El sistema de protección civil es insuficiente. La ayuda internacional llegará pero no alcanzará.",
    imagen:"https://picsum.photos/seed/climate-catastrophe-122/800/360",
    opciones:[
      { texto:"🆘 Emergencia climática nacional: declarar estado de emergencia, redirigir el 100% del presupuesto de obras públicas y movilizar a las Fuerzas Armadas.", efectos:{ipc:2,deuda:10,reservas:-6,riesgo:-3,pobreza:-8,desocupacion:-5,produccion:3,confianza:12} },
      { texto:"🌍 Fondo climático de reconstrucción: emitir bonos verdes soberanos y activar todos los mecanismos de financiamiento climático internacional.", efectos:{ipc:1,deuda:8,reservas:-2,riesgo:-2,pobreza:-5,desocupacion:-3,produccion:2,confianza:9} },
      { texto:"📋 Priorización por impacto: concentrar recursos sólo en las zonas más afectadas y delegar a las provincias el resto de la respuesta.", efectos:{ipc:1,deuda:5,reservas:-3,riesgo:1,pobreza:-3,desocupacion:-2,produccion:0,confianza:3} },
      { texto:"🤝 Coordinación regional: proponer un fondo de respuesta climática del MERCOSUR para enfrentar el desastre en forma conjunta.", efectos:{ipc:0,deuda:4,reservas:-1,riesgo:-4,pobreza:-2,desocupacion:-1,produccion:1,confianza:7} },
    ]
  },

  // ── F. EVENTOS GRAVES ADICIONALES ────────────────────────────

  {
    id:123, tag:"🏛️ Crisis Institucional",
    isSpecial:true, isSevere:true,
    titulo:"La Corte Suprema Anula la Ley Central del Gobierno",
    descripcion:"La Corte Suprema de Justicia declaró inconstitucional la ley más importante del programa de gobierno por 4 a 1 votos. La ley afectada regula el sistema impositivo que financia el 30% del presupuesto. El fallo entra en vigencia en 30 días. Los mercados reaccionan: riesgo país sube 400 puntos. El gobierno debe rehacer su estrategia desde cero. La oposición celebra. Los aliados están en pánico. El golpe institucional dejó al programa económico sin su pilar central.",
    imagen:"https://picsum.photos/seed/supreme-court-123/800/360",
    opciones:[
      { texto:"⚖️ Aceptar el fallo y pivotar: anunciar un nuevo programa adaptado en 72 horas, priorizando la continuidad institucional sobre el plan original.", efectos:{ipc:3,deuda:3,reservas:-2,riesgo:-5,pobreza:2,desocupacion:1,produccion:-2,confianza:5} },
      { texto:"📋 Legislación de emergencia: enviar al Congreso un proyecto de ley sustitutivo en fast-track para mantener el financiamiento sin la norma anulada.", efectos:{ipc:2,deuda:2,reservas:-1,riesgo:-2,pobreza:1,desocupacion:0,produccion:-1,confianza:4} },
      { texto:"⚔️ Conflicto con la Corte: cuestionar públicamente el fallo como 'activismo judicial' y proponer reformar el sistema de nombramiento de jueces.", efectos:{ipc:1,deuda:1,reservas:0,riesgo:5,pobreza:0,desocupacion:0,produccion:0,confianza:-7} },
      { texto:"🗳️ Reforma constitucional: aprovechar el quiebre institucional para convocar a una convención reformadora con agenda económica amplia.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:4,pobreza:0,desocupacion:0,produccion:0,confianza:2} },
    ]
  },
  {
    id:124, tag:"🌍 Crisis Humanitaria",
    isSpecial:true, isSevere:true,
    titulo:"El Éxodo: 1,5 Millones de Refugiados en la Frontera",
    descripcion:"La guerra en un país vecino generó el mayor flujo de refugiados de la historia del continente. En 45 días llegaron 900.000 personas y se proyectan 600.000 más. El 45% son menores de 15 años. Los sistemas de salud, educación y vivienda de tres provincias fronterizas colapsaron. Las organizaciones de derechos humanos piden acción urgente. Grupos xenófobos organizaron ataques contra campamentos. El Alto Comisionado de la ONU está llegando al país.",
    imagen:"https://picsum.photos/seed/refugees-124/800/360",
    opciones:[
      { texto:"🤝 Acogida humanitaria plena: abrir el sistema de refugio, activar financiamiento de emergencia y lanzar un programa de integración social.", efectos:{ipc:2,deuda:7,reservas:-4,riesgo:-2,pobreza:-1,desocupacion:-3,produccion:1,confianza:10} },
      { texto:"⚖️ Recepción controlada: cupos de ingreso, campos de refugio administrados por la ONU y proceso de regularización documentado.", efectos:{ipc:1,deuda:4,reservas:-2,riesgo:-3,pobreza:0,desocupacion:-1,produccion:0,confianza:5} },
      { texto:"🚧 Cierre de frontera: suspender los ingresos y establecer un perímetro humanitario del lado del país vecino con financiamiento argentino.", efectos:{ipc:0,deuda:2,reservas:-1,riesgo:5,pobreza:1,desocupacion:0,produccion:0,confianza:-12} },
      { texto:"🌎 Carga compartida regional: negociar con el MERCOSUR una distribución proporcional de los refugiados entre todos los países miembro.", efectos:{ipc:0,deuda:2,reservas:0,riesgo:-4,pobreza:0,desocupacion:-1,produccion:0,confianza:6} },
    ]
  },
  {
    id:125, tag:"✈️ Fuga de Capital Humano",
    isSpecial:true, isSevere:true,
    titulo:"El Éxodo Intelectual: La Generación que se Va",
    descripcion:"El CONICET y las universidades nacionales reportan que 31.000 científicos, médicos e ingenieros emigraron este año — el récord histórico de fuga de cerebros. Los mejores estudiantes de medicina empezaron a hacer sus residencias en España, Alemania y Canadá. Las pymes tecnológicas más exitosas trasladan sus headquarters a Uruguay. El INVAP no puede retener a sus mejores ingenieros. El tejido intelectual del país se está deshaciendo silenciosamente.",
    imagen:"https://picsum.photos/seed/brain-drain-125/800/360",
    opciones:[
      { texto:"💰 Reforma salarial sectorial: triplicar los sueldos de científicos, médicos y docentes universitarios mediante una asignación especial de retención de talento.", efectos:{ipc:2,deuda:7,reservas:-3,riesgo:-2,pobreza:-2,desocupacion:-4,produccion:3,confianza:9} },
      { texto:"🏭 Zonas económicas especiales: crear 5 polos tecnológicos con salarios internacionales y condiciones de trabajo equiparables a los mejores del mundo.", efectos:{ipc:0,deuda:5,reservas:-3,riesgo:-3,pobreza:-1,desocupacion:-5,produccion:6,confianza:7} },
      { texto:"🌐 Programa de retorno: financiar la vuelta de 5.000 profesionales emigrados con paquetes de reinstalación e inserción laboral garantizada.", efectos:{ipc:0,deuda:3,reservas:-2,riesgo:-2,pobreza:0,desocupacion:-2,produccion:4,confianza:5} },
      { texto:"📋 Diagnóstico y planificación: encargar un estudio profundo del fenómeno antes de actuar para no gastar en medidas ineficaces.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:0,pobreza:0,desocupacion:0,produccion:0,confianza:-5} },
    ]
  },
  {
    id:126, tag:"🔴 Escándalo de Gabinete",
    isSpecial:true, isSevere:true, isCabinetCorruption:true,
    titulo:"El Ministro y las Acusaciones de Acoso",
    descripcion:"Cuatro ex empleadas del Ministerio de Infraestructura presentaron denuncias formales por acoso sexual contra el ministro, respaldadas por capturas de mensajes y testimonios de testigos. El ministro es la pieza técnica central del plan de obras públicas — sin él, USD 8.000 millones en proyectos quedan sin dirección. El movimiento feminista convocó marcha a Casa Rosada. Mantenerse en silencio no es opción: cualquier demora es leída como respaldo.",
    imagen:"https://picsum.photos/seed/minister-harassment-126/800/360",
    opciones:[
      { texto:"🚪 Destitución inmediata: separar al ministro sin esperar el resultado judicial para enviar una señal clara de que el gobierno no tolera estas conductas.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:-4,pobreza:0,desocupacion:0,produccion:-3,confianza:14} },
      { texto:"⚖️ Licencia preventiva: suspender al ministro sin goce de sueldo mientras avanza la investigación judicial, preservando la estructura ministerial.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-2,pobreza:0,desocupacion:0,produccion:-1,confianza:5} },
      { texto:"🛡️ Acompañar al denunciado: declarar que se respeta la 'presunción de inocencia' sin tomar medidas hasta el fallo judicial.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:3,pobreza:0,desocupacion:0,produccion:0,confianza:-16} },
      { texto:"🔄 Reubicación discreta: trasladar al ministro a un rol sin personal a cargo y designar a otra persona para la cartera pública.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:1,pobreza:0,desocupacion:0,produccion:-1,confianza:-3} },
    ]
  },
  {
    id:127, tag:"🌐 Injerencia Extranjera",
    isSpecial:true, isSevere:true,
    titulo:"Espionaje Extranjero Infiltró el Gobierno",
    descripcion:"La Secretaría de Inteligencia del Estado confirma que al menos tres funcionarios de segundo rango dentro del gobierno venían pasando información clasificada a una potencia extranjera durante los últimos 18 meses. Los documentos filtrados incluyen estrategia económica, posiciones de negociación con el FMI y datos de inteligencia policial. Hacer esto público demuestra fortaleza institucional pero genera pánico. Silenciarlo es una traición al pueblo.",
    imagen:"https://picsum.photos/seed/foreign-espionage-127/800/360",
    opciones:[
      { texto:"📢 Transparencia total: comunicar el espionaje a la ciudadanía, expulsar al embajador del país involucrado y fortalecer los controles de inteligencia.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-4,pobreza:0,desocupacion:0,produccion:0,confianza:8} },
      { texto:"🤝 Canal diplomático: confrontar a la potencia involucrada en privado, exigir compensación y establecer nuevos protocolos de seguridad.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-5,pobreza:0,desocupacion:0,produccion:0,confianza:3} },
      { texto:"🔒 Contener la información: resolver la situación internamente sin hacerlo público para no generar caos político con la información filtrada.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:3,pobreza:0,desocupacion:0,produccion:0,confianza:-5} },
      { texto:"⚔️ Retorsión asimétrica: activar operaciones de contrainteligencia ofensiva contra el país agresor y revelar su actividad en foros internacionales.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:5} },
    ]
  },
  {
    id:128, tag:"⚡ Colapso Energético",
    isSpecial:true, isSevere:true,
    titulo:"El Sistema Eléctrico al Borde del Colapso Total",
    descripcion:"El Operador del Sistema Interconectado Nacional (SOIN) advirtió al gobierno que el sistema eléctrico nacional tiene probabilidad del 65% de colapso total en los próximos 30 días si no se toman medidas drásticas. El crecimiento de la demanda residencial e industrial superó toda proyección. Las inversiones en infraestructura se postergaron durante cuatro gobiernos consecutivos. El costo de un apagón total: USD 2.000 millones por día.",
    imagen:"https://picsum.photos/seed/energy-collapse-128/800/360",
    opciones:[
      { texto:"💡 Racionamiento preventivo: implementar cortes rotativos de 4 horas por zona para reducir la demanda y evitar el colapso total.", efectos:{ipc:3,deuda:1,reservas:0,riesgo:-6,pobreza:2,desocupacion:1,produccion:-7,confianza:-8} },
      { texto:"🏗️ Obras de emergencia: declarar la emergencia eléctrica y licitar de urgencia turbinas de generación temporaria con contratos expeditivos.", efectos:{ipc:2,deuda:6,reservas:-4,riesgo:-4,pobreza:1,desocupacion:-3,produccion:-2,confianza:5} },
      { texto:"⛽ Importación masiva de GNL: contratar de urgencia barcos regasificadores flotantes para aumentar la oferta energética en 60 días.", efectos:{ipc:4,deuda:5,reservas:-7,riesgo:-3,pobreza:1,desocupacion:0,produccion:3,confianza:4} },
      { texto:"📊 Tarifas de choque: aumentar las tarifas eléctricas un 80% para reducir la demanda de los grandes consumidores industriales inmediatamente.", efectos:{ipc:7,deuda:-2,reservas:1,riesgo:2,pobreza:5,desocupacion:1,produccion:-4,confianza:-12} },
    ]
  },
  {
    id:129, tag:"🏛️ Crisis Institucional",
    isSpecial:true, isSevere:true,
    titulo:"El Poder Judicial Paraliza al Gobierno",
    descripcion:"En una semana, cinco jueces federales distintos dictaron medidas cautelares que bloquean las cinco iniciativas más importantes del gobierno: la reforma impositiva, el plan de obras, la reorganización del BCRA, el acuerdo con el FMI y la ley de empleo. La coordinación es demasiado perfecta para ser coincidencia. Los mercados están en shock. El programa de gobierno está legalmente paralizado. El gobierno enfrenta lo que los propios abogados del Ejecutivo llaman 'golpe judicial'.",
    imagen:"https://picsum.photos/seed/judicial-blockade-129/800/360",
    opciones:[
      { texto:"⚖️ Respeto irrestricto: acatar todas las cautelares y reformular cada iniciativa para subsanar los vicios que señala la justicia.", efectos:{ipc:1,deuda:1,reservas:0,riesgo:-6,pobreza:0,desocupacion:0,produccion:-2,confianza:7} },
      { texto:"📢 Denuncia política: declarar públicamente que se trata de un 'golpe blando judicial' y apelar todas las cautelares en tiempo récord.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:5,pobreza:0,desocupacion:0,produccion:-1,confianza:-4} },
      { texto:"🔧 Reforma judicial urgente: proponer al Congreso una reforma de la composición de los juzgados de 1.ª instancia para evitar la concentración de causas políticas.", efectos:{ipc:0,deuda:1,reservas:0,riesgo:2,pobreza:0,desocupacion:0,produccion:0,confianza:2} },
      { texto:"🏛️ Mesa de consenso con la Corte: pedir una audiencia con los miembros de la Corte Suprema para buscar una salida institucional conjunta.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-4,pobreza:0,desocupacion:0,produccion:0,confianza:5} },
    ]
  },
  {
    id:130, tag:"🔐 Secreto de Estado",
    isSpecial:true, isSevere:true,
    titulo:"La Manipulación Electoral que Nadie Debe Saber",
    descripcion:"La SIDE confirmó con evidencia irrefutable que una potencia extranjera interfirió en las últimas elecciones presidenciales: manipulación de redes sociales, financiamiento encubierto de medios y posible alteración de escrutinio provisorio en tres provincias. Hacer público este informe podría invalidar la elección — y tu propio mandato. Silenciarlo es traicionar a la democracia. La presión del tiempo es máxima: el informe llegará a los medios en 72 horas de todos modos.",
    imagen:"https://picsum.photos/seed/election-manipulation-130/800/360",
    opciones:[
      { texto:"📢 Transparencia total: publicar el informe completo, convocar al Congreso y pedir una comisión investigadora multipartidaria.", efectos:{ipc:0,deuda:0,reservas:-2,riesgo:-6,pobreza:0,desocupacion:0,produccion:0,confianza:14} },
      { texto:"🤝 Gestión diplomática: confrontar a la potencia responsable en privado, revelar el mínimo necesario y no comprometer el mandato.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-3,pobreza:0,desocupacion:0,produccion:0,confianza:2} },
      { texto:"🔒 Suprimir el informe: clasificar el expediente como secreto de Estado por 10 años y destruir las copias disponibles.", corrupta:true, efectos:{ipc:0,deuda:0,reservas:0,riesgo:8,pobreza:0,desocupacion:0,produccion:0,confianza:-18} },
      { texto:"⚖️ Tribunal electoral internacional: solicitar a la OEA y la ONU que auditen las elecciones y determinen si el mandato es legítimo.", efectos:{ipc:0,deuda:0,reservas:0,riesgo:-5,pobreza:0,desocupacion:0,produccion:0,confianza:8} },
    ]
  },

]; // ← FIN COMPLETO — 130 eventos (1-100 originales + 101-130 especiales)

