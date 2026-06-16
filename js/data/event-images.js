"use strict";

// ============================================================
// EVENT IMAGES — Sistema de imágenes por categoría temática
//
// Reemplaza los 130 seeds aleatorios de picsum.photos por
// fotos curadas de Unsplash, agrupadas en 14 categorías.
// Cada categoría tiene 2 fotos alternadas por event.id (par/impar)
// para dar variedad visual sin repetir exactamente la misma foto.
//
// Todos los IDs de Unsplash fueron verificados contra el CDN
// antes de incluirse — se confirmó respuesta JPEG 200.
//
// Cadena de fallback:
//   1. Unsplash CDN (foto temáticamente relevante)
//   2. DiceBear shapes (fondo geométrico único por evento)
//   El onerror se aplica en event.js al renderizar la imagen.
// ============================================================

const BASE = 'https://images.unsplash.com/photo-';
const PARAMS = '?w=800&h=360&fit=crop&q=70&auto=format';

// ── 2 fotos por categoría (par → [0], impar → [1]) ───────────
const PHOTOS = {
  economia:     ['1611974789855-9c2a0a7236a3', '1517048676732-d65bc937f952'],
  salud:        ['1584036561566-baf8f5f1b144', '1576091160550-2173dba999ef'],
  campo:        ['1500382017468-9049fed747ef', '1464226184884-fa280b87c399'],
  energia:      ['1466611653911-95081537e5b7', '1513828583688-c52646db42da'],
  educacion:    ['1580582932707-520aed937b7b', '1522202176988-66273c2fd55f'],
  ambiente:     ['1504711434969-e33886168f5c', '1531366936337-7c912a4589a7'],
  justicia:     ['1589829545856-d10d557cf95f', '1488521787991-ed7bbaae773c'],
  institucional:['1575986767340-5d17ae767ab0', '1529107386315-e1a2ed48a620'],
  seguridad:    ['1569880153113-76e33fc52d5f', '1558618666-fcd25c85cd64'],
  social:       ['1529156069898-49953e39b3ac', '1488521787991-ed7bbaae773c'],
  tecnologia:   ['1518770660439-4636190af475', '1526374965328-7f61d4dc18c5'],
  internacional:['1451187580459-43490279c0fa', '1486325212027-8081e485255e'],
  industria:    ['1517048676732-d65bc937f952', '1498049794561-7780e7231661'],
  cultura:      ['1540575467063-178a50c2df87', '1493976040374-85c8e12f0c0e'],
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
 * Devuelve la URL de Unsplash para un evento.
 * Usa la categoría derivada del tag y alterna entre 2 fotos según event.id.
 *
 * @param {object} event - objeto evento { id, tag, ... }
 * @returns {string} URL completa de imagen
 */
export function getEventImage(event) {
  const category = _getCategoryFromTag(event.tag);
  const photos   = PHOTOS[category] || PHOTOS.economia;
  const idx      = event.id % 2;           // 0 para pares, 1 para impares
  return `${BASE}${photos[idx]}${PARAMS}`;
}

/**
 * Devuelve la URL del fallback de DiceBear cuando la imagen Unsplash falla.
 * Genera un fondo geométrico único y consistente por evento.
 *
 * @param {object} event - objeto evento { id, tag }
 * @returns {string} URL de DiceBear SVG
 */
export function getEventImageFallback(event) {
  const colors = _getCategoryColors(event.tag);
  return `https://api.dicebear.com/9.x/shapes/svg?seed=ev${event.id}&backgroundColor=${colors}`;
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
