"use strict";

// Todos los módulos de datos con texto que ve el alumno. Los usa `aplicarPais()`
// (al arrancar en Latinoamérica) y el barrido de tests/pais.test.js.
import { EVENTS } from './events.js';
import * as news from './news.js';
import { MINISTER_COMMENTARY } from './minister-commentary.js';
import { MINISTERS, MINISTER_SLOTS } from './ministers.js';
import { GLOSARIO } from './glossary.js';
import { ACHIEVEMENTS } from './achievements.js';
import { QUOTES } from './quotes.js';
import { HERITAGE_PROFILES } from './heritage.js';
import { VICEPRESIDENTS } from './vicepresident.js';
import { STICKER_MAP } from './stickers.js';
import { GLOSSARY } from '../ui/tooltip.js';
import { localizarDatos, adaptarCitas } from './pais.js';
import { EVENTS_LATAM, EVENTOS_OCULTOS_LATAM, construirComentarios } from './events-latam.js';

export { QUOTES };

export const DATOS = {
  EVENTS, MINISTER_COMMENTARY, MINISTERS, MINISTER_SLOTS, GLOSARIO, ACHIEVEMENTS, QUOTES,
  HERITAGE_PROFILES, VICEPRESIDENTS, STICKER_MAP, GLOSSARY,
  NEWS_TEMPLATES: news.NEWS_TEMPLATES, SPECIAL_NEWS_TEMPLATES: news.SPECIAL_NEWS_TEMPLATES,
  IND_NEWS: news.IND_NEWS, FORECAST_RULES: news.FORECAST_RULES, MEDIA_SOURCES: news.MEDIA_SOURCES,
  INAUGURAL_HERITAGE: news.INAUGURAL_HERITAGE, INAUGURAL_MANDATE: news.INAUGURAL_MANDATE,
  INAUGURAL_VP_EXPECT: news.INAUGURAL_VP_EXPECT,
};

/**
 * Suma al banco los eventos de América Latina (y sus comentarios de ministros). Solo
 * Latinoamérica: con Argentina el banco queda como estaba. Es idempotente.
 */
export function agregarEventosLatam() {
  if (EVENTS.some((e) => e.id === EVENTS_LATAM[0].id)) return 0;
  // Los de trama de un solo país se ocultan SOLO acá; el archivo original no se toca.
  for (let i = EVENTS.length - 1; i >= 0; i--) if (EVENTOS_OCULTOS_LATAM.includes(EVENTS[i].id)) EVENTS.splice(i, 1);
  EVENTS.push(...EVENTS_LATAM);
  Object.assign(MINISTER_COMMENTARY, construirComentarios());
  return EVENTS_LATAM.length;
}

/** Pasa los datos del juego a Latinoamérica, en el lugar. Una vez por carga de página. */
export function aplicarPais(pais) {
  if (pais !== 'latam') return 0;
  agregarEventosLatam();
  adaptarCitas(QUOTES);
  return localizarDatos(DATOS);
}
