"use strict";

// ============================================================
// EVENT IMAGES — Sistema de imágenes por categoría temática
//
// Las fotos se sirven desde `img/eventos/`, no desde un CDN. Los que abren esto
// son menores, y una foto por evento traída de afuera no le cuenta a un tercero
// que alguien jugó: le cuenta qué decisión está leyendo, y cuándo. Y con el wifi
// caído el juego se quedaba sin una sola imagen.
//
// Sobre la versión anterior: decía que los IDs de Unsplash estaban «verificados
// contra el CDN — respuesta JPEG 200». Eso comprueba que hay una foto, no cuál.
// Miradas una por una, diez de las veintiocho no tenían nada que ver con su
// categoría: una aurora boreal para ambiente, una calle de Kioto para cultura,
// un turista en Vietnam para lo institucional, y la misma foto de chicos pobres
// tanto en justicia como en social.
//
// Quedaron veintitrés fotos, todas miradas contra su categoría. Trece de las
// catorce categorías tienen foto propia; `industria` no consiguió ninguna que
// pasara, así que usa el degradado que el juego ya sabe generar. Un fondo de
// color hecho a propósito es mejor que una foto que no corresponde.
//
// Cadena de respaldo:
//   1. La foto local de la categoría
//   2. El degradado SVG generado acá mismo (sin red, sin terceros)
//   El onerror se aplica en event.js al renderizar la imagen.
// ============================================================

const DIR = 'img/eventos/';

// ── Foto por categoría (par → [0], impar → [1]) ──────────────
// `industria` queda vacía a propósito: ninguna candidata pasó la revisión, y cae
// al degradado. Es la única.
const PHOTOS = {
  economia:      ['economia-0', 'economia-1'],
  salud:         ['salud-0', 'salud-1'],
  campo:         ['campo-0', 'campo-1'],
  energia:       ['energia-0', 'energia-1'],
  educacion:     ['educacion-0', 'educacion-1'],
  ambiente:      ['ambiente-0', 'ambiente-0'],
  justicia:      ['justicia-0', 'justicia-1'],
  institucional: ['institucional-0', 'institucional-1'],
  seguridad:     ['seguridad-0', 'seguridad-0'],
  social:        ['social-0', 'social-0'],
  tecnologia:    ['tecnologia-0', 'tecnologia-1'],
  internacional: ['internacional-0', 'internacional-1'],
  industria:     [],
  cultura:       ['cultura-0', 'cultura-1'],
};


// ── Mapeo emoji-prefijo → categoría ──────────────────────────
// Se extrae el primer "token" del tag (antes del primer espacio)
// y se busca en este mapa.
const EMOJI_MAP = {
  // Economía / Finanzas
  '🏦': 'economia', '💰': 'economia', '📈': 'economia',
  '📊': 'economia', '💱': 'economia', '🚨': 'economia',
  '💸': 'economia', '💼': 'economia',
  // Salud
  '🏥': 'salud',   '💊': 'salud',   '🦠': 'salud',  '☣️': 'salud',
  // Campo / Agro
  '🌾': 'campo',   '🌿': 'campo',
  // Energía
  '⚡': 'energia', '⛏️': 'energia', '☢️': 'energia', '⛽': 'energia',
  // Educación
  '🎓': 'educacion',
  // Ambiente / Clima (🌊 Pesca es excepción → industria, ver función)
  '🌊': 'ambiente', '🌋': 'ambiente', '🌡️': 'ambiente',
  '🌱': 'ambiente', '💧': 'ambiente',
  // Justicia / DDHH
  '⚖️': 'justicia',
  // Institucional / Estado
  '🏛️': 'institucional', '🗳️': 'institucional', '🔐': 'institucional',
  '🔴': 'institucional',  '🏢': 'institucional',  '💀': 'institucional',
  // Seguridad / Conflicto
  '✊': 'seguridad', '🛡️': 'seguridad',
  // Internacional / Geopolítica
  '⚔️': 'internacional', '🌍': 'internacional', '🌏': 'internacional',
  '🤝': 'internacional', '🗺️': 'internacional', '✈️': 'internacional',
  '🌐': 'internacional',
  // Social / DDHH
  '♀️': 'social',  '🏔️': 'social',  '🤲': 'social', '🏃': 'social',
  '👴': 'social',  '🏠': 'social',   '🏙️': 'social', '👶': 'social',
  // Tecnología / IA / Cripto
  '💻': 'tecnologia', '🤖': 'tecnologia', '🧪': 'tecnologia',
  '🔬': 'tecnologia', '🧬': 'tecnologia', '🪙': 'tecnologia',
  // Industria / Infraestructura
  '🏭': 'industria', '🚆': 'industria', '🚌': 'industria', '💡': 'industria',
  // Cultura / Deportes / Medios
  '🎭': 'cultura', '🏋️': 'cultura', '📡': 'cultura',
};

// Excepciones: tags completos que necesitan override del emoji-map
const TAG_OVERRIDE = {
  '🌊 Pesca':     'industria',   // override: pesca es industria, no ambiente
  '🌐 Internet':  'tecnologia',  // override: internet es tech, no internacional
};

// ── Fallback local (sin red) ──────────────────────────────────
// SVG minimalista generado localmente cuando ambos CDNs fallan.
// Se usa como tercer nivel en la cadena onerror del <img>.
// No requiere red — está incrustado como data URI.
const _LOCAL_FALLBACK_CACHE = {};

export function getLocalFallback(event) {
  const cat = _getCategoryFromTag(event?.tag ?? '');
  if (_LOCAL_FALLBACK_CACHE[cat]) return _LOCAL_FALLBACK_CACHE[cat];

  const COLORS = {
    economia:'0a1628,1a3a6e', salud:'0d2137,1a5276', campo:'0b2a14,1a5c2a',
    energia:'1a1a0a,3d3200',  educacion:'0a1a2a,1a3a5e', ambiente:'071a0a,0a3a1a',
    justicia:'1a0a00,3d1a00', institucional:'07111f,1a2a4a', seguridad:'1a0707,3d0a0a',
    social:'1a0a2a,3a1a5e',   tecnologia:'001a1a,003d3d', internacional:'1a1a00,3d3a00',
    industria:'0a0a0a,2a2a2a',cultura:'1a001a,3d003d',
  };
  const [c1, c2] = (COLORS[cat] || COLORS.institucional).split(',');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0%" stop-color="#${c1}"/>` +
    `<stop offset="100%" stop-color="#${c2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="800" height="360" fill="url(#g)"/>` +
    `</svg>`;
  const uri = 'data:image/svg+xml;base64,' + btoa(svg);
  _LOCAL_FALLBACK_CACHE[cat] = uri;
  return uri;
}

// ── API PÚBLICA ───────────────────────────────────────────────

/**
 * La imagen de un evento, servida desde este mismo sitio.
 *
 * Si la categoría no tiene foto que haya pasado la revisión, devuelve el degradado
 * generado acá: sin red y sin una foto que no corresponda.
 *
 * @param {object} event - objeto evento { id, tag, ... }
 * @returns {string} ruta relativa, o data URI del degradado
 */
export function getEventImage(event) {
  const category = _getCategoryFromTag(event.tag);
  const photos   = PHOTOS[category] || PHOTOS.economia;
  if (!photos.length) return getLocalFallback(event);
  const idx      = event.id % 2;           // 0 para pares, 1 para impares
  return `${DIR}${photos[idx]}.jpg`;
}

/**
 * El respaldo cuando la foto no carga.
 *
 * Era una llamada a api.dicebear.com, que es otro tercero y además no sirve de nada
 * si el problema es justamente que no hay red. El degradado se genera acá.
 *
 * @param {object} event - objeto evento { id, tag }
 * @returns {string} data URI del degradado de la categoría
 */
export function getEventImageFallback(event) {
  return getLocalFallback(event);
}

// ── INTERNOS ──────────────────────────────────────────────────

/**
 * Deriva la categoría temática a partir del tag del evento.
 * Primero chequea overrides exactos; luego el emoji-prefijo.
 * @param {string} tag
 * @returns {string} categoría
 */
function _getCategoryFromTag(tag = '') {
  // 1. Override exacto para tags ambiguos
  if (TAG_OVERRIDE[tag]) return TAG_OVERRIDE[tag];

  // 2. Extraer el primer "token" (emoji antes del espacio)
  const emojiToken = tag.split(' ')[0] || '';

  // 3. Buscar en el mapa directo
  if (EMOJI_MAP[emojiToken]) return EMOJI_MAP[emojiToken];

  // 4. Fallback: buscar por substring en caso de emoji compuesto
  for (const [emoji, cat] of Object.entries(EMOJI_MAP)) {
    if (tag.startsWith(emoji)) return cat;
  }

  return 'economia'; // fallback final
}

/**
 * Colores de fondo para DiceBear según categoría.
 * Devuelve uno o dos colores hex sin '#', separados por coma.
 * @param {string} tag
 * @returns {string}
 */
function _getCategoryColors(tag = '') {
  const cat = _getCategoryFromTag(tag);
  const COLORS = {
    economia:     '0a1628,1a3a6e',
    salud:        '0d2137,1a5276',
    campo:        '0b2a14,1a5c2a',
    energia:      '1a1a0a,3d3200',
    educacion:    '0a1a2a,1a3a5e',
    ambiente:     '071a0a,0a3a1a',
    justicia:     '1a0a00,3d1a00',
    institucional:'07111f,1a2a4a',
    seguridad:    '1a0707,3d0a0a',
    social:       '1a0a2a,3a1a5e',
    tecnologia:   '001a1a,003d3d',
    internacional:'1a1a00,3d3a00',
    industria:    '0a0a0a,2a2a2a',
    cultura:      '1a001a,3d003d',
  };
  return COLORS[cat] || '07111f,1a2a4a';
}
