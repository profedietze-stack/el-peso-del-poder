"use strict";

// ============================================================
// NEWS-ENGINE.JS — Motor de generación de noticias
// Genera 3 noticias por turno basadas en: decisión + indicadores + pronóstico
// ============================================================

import {
  MEDIA_SOURCES, NEWS_TEMPLATES, IND_NEWS, FORECAST_RULES, getTagCategory,
  INAUGURAL_HERITAGE, INAUGURAL_MANDATE, INAUGURAL_VP_EXPECT, getInauguralApproval,
  SPECIAL_NEWS_TEMPLATES,
} from '../data/news.js';
import { getVPById } from '../data/vicepresident.js';

const MAX_HISTORY = 5;

// ── Helpers ───────────────────────────────────────────────────

function _sub(text, p, par) {
  return text.replace(/\{P\}/g, p).replace(/\{Par\}/g, par);
}

function _pick(arr, seed) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.abs(Math.floor(seed)) % arr.length];
}

/** Determina el sentimiento de una decisión de forma determinista */
function _sentiment(option, turn) {
  if (option.corrupta) return 'negative';
  const ef = option.efectos || {};
  const BAD = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);
  let score = 0;
  Object.entries(ef).forEach(([k, v]) => {
    if (v === 0) return;
    score += (BAD.has(k) ? (v < 0 ? 1 : -1) : (v > 0 ? 1 : -1));
  });
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  // empate: alternar por turno
  return (turn % 2 === 0) ? 'positive' : 'negative';
}

/** Calcula la zona de un indicador */
function _zone(key, v) {
  const T = {
    ipc:         { low:false, warn:40, danger:65 },
    deuda:       { low:false, warn:50, danger:70 },
    reservas:    { low:true,  warn:60, danger:30 },
    riesgo:      { low:false, warn:40, danger:65 },
    pobreza:     { low:false, warn:30, danger:55 },
    desocupacion:{ low:false, warn:10, danger:20 },
    produccion:  { low:true,  warn:65, danger:35 },
    confianza:   { low:true,  warn:60, danger:30 },
  };
  const t = T[key];
  if (!t) return 'safe';
  if (t.low) { if (v <= t.danger) return 'danger'; if (v <= t.warn) return 'warn'; }
  else        { if (v >= t.danger) return 'danger'; if (v >= t.warn) return 'warn'; }
  return 'safe';
}

/** Encuentra el indicador en peor estado */
function _worstIndicator(ind) {
  const keys = ['ipc','deuda','reservas','riesgo','pobreza','desocupacion','produccion','confianza'];
  let worst = null, worstScore = 0;
  keys.forEach(k => {
    const z = _zone(k, ind[k]);
    const score = z === 'danger' ? 3 : z === 'warn' ? 1 : 0;
    if (score > worstScore) { worstScore = score; worst = k; }
  });
  return worstScore > 0 ? worst : null;
}

/** Construye un objeto de noticia desde sus partes */
function _item(sourceId, h, b, isForecast, forecastTag, p, par) {
  const src = MEDIA_SOURCES[sourceId] || MEDIA_SOURCES.cronista;
  return {
    source:      src.id,
    sourceName:  src.name,
    sourceIcon:  src.icon,
    sourceType:  src.type,
    sourceColor: src.color,
    headline:    _sub(h, p, par),
    body:        b ? _sub(b, p, par) : '',
    isForecast:  !!isForecast,
    forecastTag: forecastTag || null,
  };
}

// ── GENERACIÓN PRINCIPAL ──────────────────────────────────────

/**
 * Genera 3 noticias para el turno actual.
 * @param {object} event      - evento del turno
 * @param {number} optionIdx  - índice de la opción elegida
 * @param {object} option     - opción elegida
 * @param {object} state      - estado del juego
 * @returns {Array} array de 3 objetos noticia
 */
export function generateNews(event, optionIdx, option, state) {
  const id   = state.identity || {};
  const p    = (id.presidentName || 'el Presidente').split(' ').slice(-1)[0];
  const par  = (id.partyName || 'el Partido Gobernante').split('(')[0].trim().substring(0, 28);
  const turn = state.turn || 1;
  const ind  = state.indicadores;
  const seed = turn * 7 + optionIdx * 3;

  const cat       = getTagCategory(event.tag);
  const sentiment = _sentiment(option, turn);
  // Para eventos especiales: buscar primero en SPECIAL_NEWS_TEMPLATES por tag exacto
  const specialTpl = event.isSpecial ? (SPECIAL_NEWS_TEMPLATES?.[event.tag] || null) : null;

  const news = [];

  // ── Noticia 1: Cronista (reporte neutral de la decisión) ─────
  const tmplCronista =
    specialTpl?.cronista?.[sentiment] ||
    NEWS_TEMPLATES[cat]?.cronista?.[sentiment] ||
    NEWS_TEMPLATES.general.cronista[sentiment];
  const t1 = _pick(tmplCronista, seed);
  if (t1) news.push(_item('cronista', t1.h, t1.b, false, null, p, par));

  // ── Noticia 2: Reacción política (voz si positivo, tribuna si negativo) ──
  const reactSrc = sentiment === 'positive' ? 'voz' : 'tribuna';
  const tmplReact =
    specialTpl?.[reactSrc]?.[sentiment] ||
    NEWS_TEMPLATES[cat]?.[reactSrc]?.[sentiment] ||
    NEWS_TEMPLATES.general[reactSrc][sentiment];
  const t2 = _pick(tmplReact, seed + 1);
  if (t2) news.push(_item(reactSrc, t2.h, t2.b, false, null, p, par));

  // ── Noticia 3: Pronóstico o ciudadana/social ─────────────────
  const recentForecasts = state.recentForecasts || {};
  const forecast = FORECAST_RULES.find(r => {
    const lastShown = recentForecasts[r.id] || 0;
    return r.condition(ind) && (turn - lastShown) >= (r.cooldown || 4);
  });

  if (forecast) {
    news.push(_item(forecast.source, forecast.h, forecast.b, true, forecast.forecastTag, p, par));
    // Registrar en el estado para cooldown
    if (!state.recentForecasts) state.recentForecasts = {};
    state.recentForecasts[forecast.id] = turn;
  } else {
    // Intentar noticia reactiva a indicadores
    const worstKey = _worstIndicator(ind);
    if (worstKey) {
      const worstZone = _zone(worstKey, ind[worstKey]);
      const indPool   = IND_NEWS[worstKey]?.[worstZone];
      if (indPool && indPool.length > 0) {
        const t3 = _pick(indPool, seed + 2);
        news.push(_item(t3.source, t3.h, t3.b, false, null, p, par));
      }
    }

    // Si aún falta la tercera: noticia social/foro sobre la decisión
    if (news.length < 3) {
      const socialKey = (seed % 2 === 0) ? 'tendencias' : 'foro';
      const tmplSocial =
        specialTpl?.[socialKey]?.[sentiment] ||
        NEWS_TEMPLATES[cat]?.[socialKey]?.[sentiment] ||
        NEWS_TEMPLATES.general[socialKey][sentiment];
      const t3 = _pick(tmplSocial, seed + 3);
      if (t3) news.push(_item(socialKey, t3.h, t3.b, false, null, p, par));
    }
  }

  return news;
}

// ── NOTICIAS INAUGURALES (Turno 1) ───────────────────────────

/**
 * Sustituye placeholders incluyendo VP.
 */
function _subFull(text, p, par, vpName, vpTitle) {
  return text
    .replace(/\{P\}/g, p)
    .replace(/\{Par\}/g, par)
    .replace(/\{VP\}/g, vpName  || 'la Vicepresidencia')
    .replace(/\{VPt\}/g, vpTitle || 'Vicepresidente/a');
}

/**
 * Genera 3 noticias inaugurales personalizadas para el Turno 1.
 * Usa herencia, tipo de mandato, VP y dificultad del estado inicial.
 * @param {object} state
 * @returns {Array} array de 3 objetos noticia
 */
export function generateInauguralNews(state) {
  const id         = state.identity || {};
  const p          = (id.presidentName || 'el Presidente').split(' ').slice(-1)[0];
  const par        = (id.partyName || 'el Partido Gobernante').split('(')[0].trim().substring(0, 28);
  const heritageId = state.heritageId  || 'estable';
  const mandate    = state.mandateType || 'normal';
  const diff       = state.difficulty  || 'normal';
  const vpId       = id.vpId || 'vp-moreno';
  const vpData     = getVPById(vpId) || { name:'el/la Vicepresidente/a', title:'Vicepresidente/a' };
  const vpName     = vpData.name;
  const vpTitle    = vpData.title;

  // Semilla para selección determinista (sin Math.random)
  const seed = (p.charCodeAt(0) || 7) + (par.charCodeAt(0) || 3);

  const news = [];

  // ── Artículo 1: Cronista — inauguración + herencia ───────────
  const hTemplates = INAUGURAL_HERITAGE[heritageId] || INAUGURAL_HERITAGE.estable;
  const t1 = _pick(hTemplates, seed);
  news.push({
    source:      'cronista',
    sourceName:  MEDIA_SOURCES.cronista.name,
    sourceIcon:  MEDIA_SOURCES.cronista.icon,
    sourceType:  MEDIA_SOURCES.cronista.type,
    sourceColor: MEDIA_SOURCES.cronista.color,
    headline:    _subFull(t1.h, p, par, vpName, vpTitle),
    body:        _subFull(t1.b, p, par, vpName, vpTitle),
    isForecast:  false,
    forecastTag: null,
  });

  // ── Artículo 2: Reacción política — tipo de mandato ──────────
  const mData  = INAUGURAL_MANDATE[mandate] || INAUGURAL_MANDATE.coalicion;

  // Dificultad alta + mandato ajustado → prensa amarilla (tribuna_amarilla)
  let reactPool;
  let reactSrc;
  if ((diff === 'hard' || diff === 'ultra') && mandate === 'ajustado' && mData.tribuna_amarilla) {
    reactPool = mData.tribuna_amarilla;
    reactSrc  = 'tribuna';
  } else if (diff === 'hard' || diff === 'ultra') {
    reactPool = mData.tribuna;
    reactSrc  = 'tribuna';
  } else if (mandate === 'amplio' && diff === 'easy') {
    reactPool = mData.voz;
    reactSrc  = 'voz';
  } else if (mandate === 'ajustado') {
    reactPool = mData.tribuna;
    reactSrc  = 'tribuna';
  } else {
    // coalicion o amplio normal → mezclar según seed
    const usePro = seed % 3 !== 0;
    reactPool = usePro ? mData.voz : mData.tribuna;
    reactSrc  = usePro ? 'voz'     : 'tribuna';
  }

  // Fallback social si el pool está vacío
  if (!reactPool || reactPool.length === 0) {
    reactPool = mData.tendencias || mData.voz || [{ h:`{P} asume al frente del {Par}.`, b:'' }];
    reactSrc  = 'tendencias';
  }

  const t2 = _pick(reactPool, seed + 1);
  const src2 = MEDIA_SOURCES[reactSrc];
  news.push({
    source:      src2.id,
    sourceName:  src2.name,
    sourceIcon:  src2.icon,
    sourceType:  src2.type,
    sourceColor: src2.color,
    headline:    _subFull(t2.h, p, par, vpName, vpTitle),
    body:        _subFull(t2.b, p, par, vpName, vpTitle),
    isForecast:  false,
    forecastTag: null,
  });

  // ── Artículo 3: Expectativas + VP ───────────────────────────
  // Mapeo: las claves en INAUGURAL_VP_EXPECT usan nombres en español heredados
  const _vpDiffKey = { easy:'facil', normal:'normal', hard:'dificil', ultra:'ultra' }[diff] || 'normal';
  const vpPool  = INAUGURAL_VP_EXPECT[vpId]?.[_vpDiffKey] || INAUGURAL_VP_EXPECT[vpId]?.normal;
  const approval = getInauguralApproval(mandate, diff);

  let t3, src3id;
  if (vpPool && vpPool.length > 0) {
    const picked = _pick(vpPool, seed + 2);
    t3    = picked;
    src3id = picked.source || 'cronista';
  } else {
    // Fallback genérico con número de encuesta
    const encSentiment = approval >= 60 ? 'positiva' : approval >= 50 ? 'moderada' : 'crítica';
    t3 = {
      source: 'cronista',
      h: `Encuesta inaugural: el ${approval}% respalda al gobierno de {P} — expectativas ${encSentiment}s`,
      b: `El primer sondeo tras la asunción del {Par} muestra un arranque ${encSentiment === 'positiva' ? 'sólido' : 'ajustado'}. Los próximas decisiones definirán la tendencia.`,
    };
    src3id = 'cronista';
  }

  // Enriquecer con dato de aprobación si el template no lo tiene
  let body3 = _subFull(t3.b, p, par, vpName, vpTitle);
  if (!body3.includes('%') && !body3.includes('→')) {
    body3 += ` Encuesta primera semana: ${approval}% de aprobación inicial.`;
  }

  const src3 = MEDIA_SOURCES[src3id] || MEDIA_SOURCES.cronista;
  news.push({
    source:      src3.id,
    sourceName:  src3.name,
    sourceIcon:  src3.icon,
    sourceType:  src3.type,
    sourceColor: src3.color,
    headline:    _subFull(t3.h, p, par, vpName, vpTitle),
    body:        body3,
    isForecast:  false,
    forecastTag: null,
  });

  return news;
}

// ── HISTORIAL ─────────────────────────────────────────────────

/**
 * Agrega noticias al historial del estado (máx. MAX_HISTORY turnos).
 * @param {object} state
 * @param {Array}  newsItems
 */
export function addToNewsHistory(state, newsItems) {
  if (!state.newsHistory) state.newsHistory = [];
  // Evitar duplicar el mismo turno (por si se llama dos veces)
  state.newsHistory = state.newsHistory.filter(e => e.turn !== state.turn);
  state.newsHistory.unshift({ turn: state.turn, items: newsItems });
  if (state.newsHistory.length > MAX_HISTORY) {
    state.newsHistory = state.newsHistory.slice(0, MAX_HISTORY);
  }
  state.currentNews = newsItems;
}
