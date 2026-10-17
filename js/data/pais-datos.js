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

export { QUOTES };

export const DATOS = {
  EVENTS, MINISTER_COMMENTARY, MINISTERS, MINISTER_SLOTS, GLOSARIO, ACHIEVEMENTS, QUOTES,
  HERITAGE_PROFILES, VICEPRESIDENTS, STICKER_MAP, GLOSSARY,
  NEWS_TEMPLATES: news.NEWS_TEMPLATES, SPECIAL_NEWS_TEMPLATES: news.SPECIAL_NEWS_TEMPLATES,
  IND_NEWS: news.IND_NEWS, FORECAST_RULES: news.FORECAST_RULES, MEDIA_SOURCES: news.MEDIA_SOURCES,
  INAUGURAL_HERITAGE: news.INAUGURAL_HERITAGE, INAUGURAL_MANDATE: news.INAUGURAL_MANDATE,
  INAUGURAL_VP_EXPECT: news.INAUGURAL_VP_EXPECT,
};

/** Pasa los datos del juego a Latinoamérica, en el lugar. Una vez por carga de página. */
export function aplicarPais(pais) {
  if (pais !== 'latam') return 0;
  adaptarCitas(QUOTES);
  return localizarDatos(DATOS);
}
