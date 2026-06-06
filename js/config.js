"use strict";

export const CONFIG = {
  TOTAL_TURNS: 48,

  INITIAL: {
    ipc:          50,
    deuda:        40,
    reservas:     60,
    riesgo:       35,
    pobreza:      35,
    desocupacion: 12,
    produccion:   60,
    confianza:    65,
  },

  // Easy/Normal: umbrales muy permisivos — casi imposible perder solo por esto
  DEFEAT_CONFIANZA: 0,
  DEFEAT_POBREZA:  80,

  // Normal: umbrales ligeramente más estrictos que Easy — un jugador muy descuidado puede perder
  DEFEAT_CONFIANZA_NORMAL: 5,
  DEFEAT_POBREZA_NORMAL:   78,

  // Hard: umbrales de derrota intermedios — entre Normal y Ultra
  DEFEAT_CONFIANZA_HARD: 10,
  DEFEAT_POBREZA_HARD:   75,

  // Ultra: umbrales de derrota más estrictos — el margen de error se reduce
  DEFEAT_CONFIANZA_ULTRA: 15,
  DEFEAT_POBREZA_ULTRA:   70,

  // 0.7 = fácil | 1.0 = normal | 1.3 = difícil | 1.5/2.0 = ultra (asimétrico)
  // EFFECT_MULTIPLIER     → amplifica efectos que MEJORAN indicadores
  // EFFECT_MULTIPLIER_BAD → amplifica efectos que EMPEORAN indicadores
  // En ultra: buenas decisiones son menos poderosas; malas decisiones, más catastróficas.
  EFFECT_MULTIPLIER:     1.0,
  EFFECT_MULTIPLIER_BAD: 1.0,

  // (reservado — ya no se usa; el modo ultra tiene game-over)
  DOCENTE_MODE: false,

  THRESHOLDS: {
    ipc:          { low_bad:false, warn:40,  danger:65 },
    deuda:        { low_bad:false, warn:50,  danger:70 },
    reservas:     { low_bad:true,  warn:60,  danger:30 },
    riesgo:       { low_bad:false, warn:40,  danger:65 },
    pobreza:      { low_bad:false, warn:30,  danger:55 },
    desocupacion: { low_bad:false, warn:10,  danger:20 },
    produccion:   { low_bad:true,  warn:65,  danger:35 },
    confianza:    { low_bad:true,  warn:60,  danger:30 },
  },

  DIPLOMA_GOLD:   65,
  DIPLOMA_SILVER: 45,
  DIPLOMA_BRONZE: 25,
};

export const IND_META = [
  { key:'ipc',          emoji:'📈', name:'IPC / Inflación',         unit:'%',   reverse:true,
    tip:'El Índice de Precios al Consumidor mide cuánto suben los precios. 💡 Conviene tenerlo BAJO: una inflación alta hace que la plata valga menos y los más pobres sufren más.' },
  { key:'deuda',        emoji:'💸', name:'Deuda Externa',            unit:'%',   reverse:true,
    tip:'Es el dinero que el país le debe a otros países u organismos internacionales. 💡 Conviene tenerla BAJA: mucha deuda obliga a destinar recursos al pago de intereses en lugar de educación o salud.' },
  { key:'reservas',     emoji:'💰', name:'Reservas Internacionales', unit:'pts', reverse:false,
    tip:'Son los dólares y divisas que guarda el Banco Central. 💡 Conviene tenerlas ALTAS: son el "colchón" del país para afrontar crisis, pagar importaciones y defender la moneda.' },
  { key:'riesgo',       emoji:'⚠️', name:'Riesgo País',              unit:'pts', reverse:true,
    tip:'Mide cuánto desconfían los mercados internacionales de la economía del país. 💡 Conviene tenerlo BAJO: un riesgo alto encarece el crédito y aleja las inversiones.' },
  { key:'pobreza',      emoji:'📉', name:'Índice de Pobreza',        unit:'%',   reverse:true,
    tip:'Porcentaje de personas que no pueden cubrir sus necesidades básicas. 💡 Conviene tenerlo BAJO: si supera 80% el gobierno cae por crisis humanitaria.' },
  { key:'desocupacion', emoji:'👥', name:'Tasa de Desocupación',     unit:'%',   reverse:true,
    tip:'Porcentaje de personas que buscan trabajo y no consiguen. 💡 Conviene tenerla BAJA: el desempleo destruye el ingreso de las familias y aumenta la pobreza.' },
  { key:'produccion',   emoji:'🏭', name:'Producción Industrial',    unit:'pts', reverse:false,
    tip:'Mide cuánto produce la industria del país. 💡 Conviene tenerla ALTA: genera empleo de calidad y divisas por exportaciones.' },
  { key:'confianza',    emoji:'🤝', name:'Confianza en el Gobierno', unit:'%',   reverse:false,
    tip:'Apoyo ciudadano a tu gestión. 💡 Conviene tenerla ALTA: si llega a 0% el gobierno cae. Se construye con decisiones coherentes y transparentes.' },
];

export const BAD_KEYS = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);

// ── BONOS DE INICIO POR DIFICULTAD ───────────────────────────
// Se aplican DESPUÉS de herencia + mandato para dar margen extra
// en dificultades más amigables o penalizar en las exigentes.
// Solo aplica al primer mandato (segundo mandato hereda indicadores reales).
export const DIFFICULTY_START_BONUS = {
  easy:   { confianza: +8, reservas: +6, pobreza: -5         },
  normal: {},
  // Hard: arranque con 3-4 indicadores en zona Warn desde el inicio.
  hard:   { confianza: -6, riesgo: +8, ipc: +5, reservas: -5  },
  // Ultra: arranque devastado — todos los indicadores en zona de alerta o peligro desde el día 1.
  // Incluso con herencia "estable" + mandato "amplio" el jugador arranca en zona crítica.
  ultra:  { confianza: -15, riesgo: +14, ipc: +12, pobreza: +10, reservas: -12, deuda: +10 },
};
