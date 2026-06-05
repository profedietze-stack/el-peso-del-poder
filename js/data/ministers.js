"use strict";

// ============================================================
// MINISTERS — 12 ministros, 4 carteras, 3 candidatos por cartera
//
// Estructura de cada ministro:
//   id          → clave única
//   slot        → 'economia' | 'social' | 'gabinete' | 'produccion'
//   name        → nombre completo
//   title       → cargo formal
//   profile     → perfil corto (ideología / estilo)
//   avatarUrl   → URL DiceBear Personas (determinista por seed)
//   passive     → deltas aplicados a indicadores iniciales (post-herencia)
//   effectMods  → multiplicadores sobre efectos de ese indicador durante la partida
//                 (< 1 = amortigua, > 1 = amplifica)
//   bio         → descripción del personaje
//   tags        → etiquetas para filtros futuros
// ============================================================

// ── CARTERAS ─────────────────────────────────────────────────

export const MINISTER_SLOTS = [
  {
    id:    'economia',
    label: '💰 Ministerio de Economía',
    short: 'Economía',
    color: '#2563a8',
    bg:    'rgba(37,99,168,.12)',
    border:'rgba(37,99,168,.4)',
    indicators: ['ipc','deuda','reservas','riesgo'],
  },
  {
    id:    'social',
    label: '🤝 Ministerio de Desarrollo Social',
    short: 'Desarrollo Social',
    color: '#27ae60',
    bg:    'rgba(39,174,96,.1)',
    border:'rgba(39,174,96,.4)',
    indicators: ['pobreza','desocupacion','confianza'],
  },
  {
    id:    'gabinete',
    label: '🏛️ Jefatura de Gabinete',
    short: 'Jefatura',
    color: '#8e44ad',
    bg:    'rgba(142,68,173,.1)',
    border:'rgba(142,68,173,.4)',
    indicators: ['confianza','riesgo'],
  },
  {
    id:    'produccion',
    label: '🏭 Ministerio de Producción',
    short: 'Producción',
    color: '#e67e22',
    bg:    'rgba(230,126,34,.1)',
    border:'rgba(230,126,34,.4)',
    indicators: ['produccion','reservas','desocupacion'],
  },
];

// ── AVATARES — DiceBear Personas ─────────────────────────────
// Avatares profesionales generativos, deterministas (mismo seed → mismo resultado).
// Estilo "avataaars": retratos con ropa formal, blazer/sweater, lentes de prescripción.
// Parámetros confirmados desde el schema oficial DiceBear v9.
// Fondo oscuro por cartera para coherencia visual con el juego.

const _BG = {
  economia:   '0d1e38',
  social:     '0d2018',
  gabinete:   '1a0d2e',
  produccion: '1e1008',
};

// ── Parámetros de vestimenta formal ──────────────────────────
// Valores exactos del schema oficial de DiceBear avataaars v9.
const _AVA = [
  // Ropa: solo blazer y sweater formal
  'clothing[]=blazerAndShirt',
  'clothing[]=blazerAndSweater',
  'clothing[]=collarAndSweater',
  // Bocas formales (excluye: tongue, eating, grimace, screamOpen, vomit, disbelief)
  'mouth[]=default',
  'mouth[]=smile',
  'mouth[]=serious',
  'mouth[]=twinkle',
  'mouth[]=concerned',
  'mouth[]=sad',
  // Ojos normales (excluye: hearts, xDizzy, eyeRoll, winkWacky)
  'eyes[]=default',
  'eyes[]=happy',
  'eyes[]=squint',
  'eyes[]=wink',
  'eyes[]=side',
  'eyes[]=closed',
  // Cejas naturales
  'eyebrows[]=default',
  'eyebrows[]=defaultNatural',
  'eyebrows[]=raisedExcited',
  'eyebrows[]=raisedExcitedNatural',
  'eyebrows[]=flatNatural',
  // Accesorios: solo lentes formales (excluye: sunglasses, wayfarers, round, eyepatch)
  'accessoriesProbability=35',
  'accessories[]=kurt',
  'accessories[]=prescription01',
  'accessories[]=prescription02',
  // Barba: 30% de probabilidad, estilos sobrios
  'facialHairProbability=30',
  'facialHair[]=beardLight',
  'facialHair[]=beardMedium',
  'facialHair[]=beardMajestic',
  'facialHair[]=moustacheFancy',
  'facialHair[]=moustacheMagnum',
].join('&');

// ── Filtros de pelo por género (sin sombreros) ────────────────
// Excluye: hat, winterHat1, winterHat02, winterHat03, winterHat04, hijab, turban

// Estilos típicamente femeninos (pelo largo o semi-largo)
const _TOP_F = [
  'top[]=bigHair','top[]=bob','top[]=bun','top[]=curly','top[]=curvy',
  'top[]=dreads','top[]=frida','top[]=fro','top[]=froBand',
  'top[]=longButNotTooLong','top[]=miaWallace','top[]=shavedSides',
  'top[]=straight01','top[]=straight02','top[]=straightAndStrand',
].join('&');

// Estilos típicamente masculinos (pelo corto)
const _TOP_M = [
  'top[]=dreads01','top[]=dreads02','top[]=frizzle','top[]=shaggy',
  'top[]=shaggyMullet','top[]=shortCurly','top[]=shortFlat',
  'top[]=shortRound','top[]=shortWaved','top[]=sides',
  'top[]=theCaesar','top[]=theCaesarAndSidePart',
].join('&');

// Cualquier pelo (sin sombrero) — para ministros sin restricción de género
const _TOP_ANY = `${_TOP_F}&${_TOP_M}`;

/**
 * Genera la URL de DiceBear Avataaars para un ministro.
 * @param {string} seed    — semilla única por ministro
 * @param {string} slot    — cartera (determina color de fondo)
 * @param {string} gender  — 'f' | 'm' | 'any' (controla el estilo de pelo)
 * @returns {string}
 */
function _av(seed, slot, gender = 'any') {
  const bg  = _BG[slot] || '0d1e35';
  const top = gender === 'f' ? _TOP_F : gender === 'm' ? _TOP_M : _TOP_ANY;
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&${_AVA}&${top}`;
}

// ── DEFINICIÓN DE MINISTROS ───────────────────────────────────

export const MINISTERS = [

  // ── ECONOMÍA ─────────────────────────────────────────────

  {
    id:        'ortodoxa',
    slot:      'economia',
    name:      'Dra. María Eugenia Paz',
    title:     'Ministra de Economía',
    profile:   'Ortodoxa · Ajuste Fiscal',
    avatarUrl: _av('Paz-Chicago-Fiscal-F9', 'economia', 'f'),
    bio:       'Economista formada en Chicago. Prioriza el equilibrio fiscal y la credibilidad ante los mercados. Sus políticas reducen la inflación y la deuda, pero generan fricción social.',
    passive: {
      ipc:          -4,
      deuda:        -3,
      riesgo:       -3,
      reservas:     +2,
      confianza:    -3,
    },
    effectMods: {
      ipc:      0.78,
      deuda:    0.80,
      riesgo:   0.82,
      reservas: 1.08,
    },
    adviceFocus: ['ipc','deuda','riesgo','reservas'],
    adviceStyle: 'Recomienda estabilidad fiscal. Desconfía de los estímulos.',
    corrupt: false,
    tags: ['ortodoxa','fiscal','ajuste','fmi'],
  },

  {
    id:        'heterodoxa',
    slot:      'economia',
    name:      'Dr. Axel Medina',
    title:     'Ministro de Economía',
    profile:   'Heterodoxo · Industrialismo Activo',
    avatarUrl: _av('Medina-Keynes-BCentral-M7', 'economia', 'm'),
    bio:       'Economista keynesiano, ex-director del Banco Central. Apuesta por la demanda interna y el mercado interno. Sus políticas impulsan la producción y la confianza, pero aceleran la inflación.',
    passive: {
      produccion:   +5,
      confianza:    +4,
      ipc:          +4,
      deuda:        +3,
    },
    effectMods: {
      produccion: 1.18,
      confianza:  1.12,
      ipc:        1.14,
      deuda:      1.10,
    },
    adviceFocus: ['produccion','confianza','ipc'],
    adviceStyle: 'Prioriza el crecimiento y el empleo. Acepta cierta inflación como costo.',
    corrupt: false,
    tags: ['heterodoxa','keynesiano','produccion','demanda'],
  },

  {
    id:        'tecnocrata_eco',
    slot:      'economia',
    name:      'Dr. Roberto Chen',
    title:     'Ministro de Economía',
    profile:   'Tecnocrático · Gestión Técnica',
    avatarUrl: _av('PhD-FinanzasIntl-Chen-087', 'economia', 'm'),
    bio:       'Ph.D. en Finanzas Internacionales. Orientado a métricas y procesos. No tiene agenda ideológica fuerte: actúa según los datos. Mejora reservas y riesgo, pero su frialdad aleja a la ciudadanía.',
    passive: {
      reservas:       +5,
      riesgo:         -4,
      ipc:            -2,
      desocupacion:   +3,
      confianza:      -2,
    },
    effectMods: {
      reservas:     1.15,
      riesgo:       0.80,
      desocupacion: 1.12,
    },
    adviceFocus: ['reservas','riesgo','deuda'],
    adviceStyle: 'Analiza costos y beneficios. Recomienda la opción más predecible.',
    corrupt: false,
    tags: ['tecnocrata','finanzas','reservas','neutro'],
  },

  // ── SOCIAL ───────────────────────────────────────────────

  {
    id:        'asistencial',
    slot:      'social',
    name:      'Lic. Alex Gutiérrez',
    title:     'Ministerio de Desarrollo Social',
    profile:   'Asistencialista · Transferencias Directas',
    avatarUrl: _av('Sociologa-Equidad-Gutierrez-113', 'social', 'any'),
    bio:       'Especialista con 20 años de trabajo en comunidades vulnerables. Cree en la transferencia directa de recursos como motor de equidad. Baja la pobreza y sube la confianza, pero presiona la deuda.',
    passive: {
      pobreza:      -5,
      confianza:    +4,
      deuda:        +3,
      desocupacion: -1,
    },
    effectMods: {
      pobreza:   0.78,
      confianza: 1.12,
      deuda:     1.10,
    },
    adviceFocus: ['pobreza','confianza','desocupacion'],
    adviceStyle: 'Prioriza el impacto social inmediato. Acepta deuda si salva vidas.',
    corrupt: false,
    tags: ['asistencial','transferencias','pobreza','gasto-social'],
  },

  {
    id:        'laboral',
    slot:      'social',
    name:      'Dr. Hugo Fernández',
    title:     'Ministro de Desarrollo Social',
    profile:   'Laboral · Pro-Sindicatos',
    avatarUrl: _av('Gremial-Sindicato-Fernandez-156', 'social', 'm'),
    bio:       'Ex-secretario general de un sindicato nacional. Conoce el mundo del trabajo desde adentro. Baja el desempleo y genera fidelidad obrera, pero sus paritarias aceleran la inflación.',
    passive: {
      desocupacion: -4,
      confianza:    +3,
      ipc:          +3,
      produccion:   +2,
    },
    effectMods: {
      desocupacion: 0.80,
      confianza:    1.10,
      ipc:          1.12,
    },
    adviceFocus: ['desocupacion','confianza','ipc'],
    adviceStyle: 'Defiende el trabajo. Alerta sobre el impacto social de los ajustes.',
    corrupt: false,
    tags: ['laboral','sindicatos','empleo','trabajadores'],
  },

  {
    id:        'focalizada',
    slot:      'social',
    name:      'Dra. Lucía Ramos',
    title:     'Ministra de Desarrollo Social',
    profile:   'Focalizada · Programas Medibles',
    avatarUrl: _av('Ramos-ImpactoSocial-F3', 'social', 'f'),
    bio:       'Experta en evaluación de impacto social. Diseña programas precisos con metas medibles. Sus resultados son más lentos pero sostenibles: baja la pobreza y el desempleo sin presionar el gasto.',
    passive: {
      pobreza:      -3,
      desocupacion: -2,
    },
    effectMods: {
      pobreza:      0.88,
      desocupacion: 0.88,
      confianza:    1.05,
    },
    adviceFocus: ['pobreza','desocupacion'],
    adviceStyle: 'Busca soluciones de bajo costo y alto impacto. Piensa a largo plazo.',
    corrupt: false,
    tags: ['focalizada','programas','evaluacion','sostenible'],
  },

  // ── GABINETE ─────────────────────────────────────────────

  {
    id:        'dialoguista',
    slot:      'gabinete',
    name:      'Dr. Carlos Estévez',
    title:     'Jefe de Gabinete',
    profile:   'Dialoguista · Consenso Político',
    avatarUrl: _av('Consenso-Politico-Estevez-234', 'gabinete', 'm'),
    bio:       'Político veterano con contactos en todos los sectores. Su estilo es el acuerdo. Sube la confianza ciudadana y reduce el riesgo país, pero su moderación puede frustrar a la base propia.',
    passive: {
      confianza:  +5,
      riesgo:     -3,
    },
    effectMods: {
      confianza: 1.15,
      riesgo:    0.82,
    },
    adviceFocus: ['confianza','riesgo'],
    adviceStyle: 'Busca el punto de equilibrio político. Prefiere negociar antes que confrontar.',
    corrupt: false,
    tags: ['dialoguista','consenso','confianza','estabilidad'],
  },

  {
    id:        'confrontacional',
    slot:      'gabinete',
    name:      'Dr. Rodrigo Salas',
    title:     'Jefe de Gabinete',
    profile:   'Confrontacional · Alto Riesgo / Alta Recompensa',
    avatarUrl: _av('Constitucionalista-Combativa-Salas-277', 'gabinete', 'm'),
    bio:       'Abogado constitucionalista con estilo combativo. Radicaliza el escenario político: cuando las cosas van bien, la confianza sube mucho; cuando van mal, cae en picada. Juego de alto vuelo.',
    passive: {
      confianza:  +2,
      riesgo:     +3,
    },
    effectMods: {
      confianza: 1.28,
      riesgo:    1.18,
    },
    adviceFocus: ['confianza','riesgo'],
    adviceStyle: 'Prefiere la decisión audaz. Le incomoda la tibieza.',
    corrupt: false,
    tags: ['confrontacional','volatil','riesgo','radicalismo'],
  },

  {
    id:        'tecnocrata_gab',
    slot:      'gabinete',
    name:      'Dr. Pablo Ibáñez',
    title:     'Jefe de Gabinete',
    profile:   'Tecnocrático · Gestión Institucional',
    avatarUrl: _av('AdminPub-Institucional-Ibanez-318', 'gabinete', 'm'),
    bio:       'Abogado administrativista. Ordena el Estado, cumple con los organismos internacionales, baja el riesgo país. Su frialdad le cuesta popularidad, pero es un excelente administrador.',
    passive: {
      riesgo:     -5,
      confianza:  -2,
    },
    effectMods: {
      riesgo:    0.72,
      confianza: 0.84,
    },
    adviceFocus: ['riesgo','confianza'],
    adviceStyle: 'Prioriza el orden institucional. Advierte sobre riesgos legales y reputacionales.',
    corrupt: false,
    tags: ['tecnocrata','institucional','riesgo','formalismo'],
  },

  // ── PRODUCCIÓN ───────────────────────────────────────────

  {
    id:        'industrialista',
    slot:      'produccion',
    name:      'Ing. Daniela Torres',
    title:     'Ministra de Producción',
    profile:   'Industrialista · Sustitución de Importaciones',
    avatarUrl: _av('Ingenieria-Manufactura-Torres-361', 'produccion', 'f'),
    bio:       'Ingeniera industrial con décadas en el sector manufacturero. Cree en la industria nacional como motor de desarrollo. Sus políticas disparan la producción y el empleo, pero incrementan la deuda.',
    passive: {
      produccion:   +6,
      desocupacion: -3,
      deuda:        +4,
      reservas:     -2,
    },
    effectMods: {
      produccion:   1.22,
      desocupacion: 0.85,
      deuda:        1.12,
    },
    adviceFocus: ['produccion','desocupacion','deuda'],
    adviceStyle: 'Siempre defiende la producción. Acepta deuda si crea empleo.',
    corrupt: false,
    tags: ['industrialista','manufactura','empleo','proteccionismo'],
  },

  {
    id:        'agroexportador',
    slot:      'produccion',
    name:      'Ing. Fernanda Blanco',
    title:     'Ministra de Producción',
    profile:   'Agroexportador · Divisas y Campo',
    avatarUrl: _av('Agronomia-Exportacion-Blanco-404', 'produccion', 'f'),
    bio:       'Ingeniera agrónoma con lazos en el sector agropecuario. Su estrategia: exportar más para acumular reservas. Sube las divisas y diversifica la producción, pero descuida el mercado interno.',
    passive: {
      reservas:     +5,
      produccion:   +3,
      desocupacion: +3,
      ipc:          +2,
    },
    effectMods: {
      reservas:     1.18,
      produccion:   1.08,
      desocupacion: 1.12,
    },
    adviceFocus: ['reservas','produccion'],
    adviceStyle: 'Prioriza la acumulación de divisas. Confía en el campo como motor.',
    corrupt: false,
    tags: ['agro','exportaciones','reservas','campo'],
  },

  {
    id:        'innovacion',
    slot:      'produccion',
    name:      'Dr. Nicolás Cruz',
    title:     'Ministro de Producción',
    profile:   'Innovación · Economía del Conocimiento',
    avatarUrl: _av('EconomiaDigital-Innovacion-Cruz-447', 'produccion', 'm'),
    bio:       'Doctor en Economía Digital. Apuesta por la transición tecnológica y la industria del software. Sus resultados son más lentos al inicio pero tienen un efecto compuesto al final del mandato.',
    passive: {
      produccion:   +3,
      desocupacion: -2,
    },
    effectMods: {
      produccion:   1.12,
      desocupacion: 0.88,
      reservas:     1.06,
    },
    adviceFocus: ['produccion','desocupacion','reservas'],
    adviceStyle: 'Piensa en el largo plazo. Recomienda invertir en capacidades, no solo en bienes.',
    corrupt: false,
    tags: ['innovacion','tecnologia','conocimiento','sostenible'],
  },
];

// ── EXPORTS AUXILIARES ────────────────────────────────────────

/**
 * Devuelve un ministro por ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getMinisterById(id) {
  return MINISTERS.find(m => m.id === id);
}

/**
 * Devuelve los 3 candidatos para una cartera.
 * @param {string} slot  — 'economia' | 'social' | 'gabinete' | 'produccion'
 * @returns {object[]}
 */
export function getMinistersBySlot(slot) {
  return MINISTERS.filter(m => m.slot === slot);
}

/**
 * Devuelve la definición de una cartera.
 * @param {string} slot
 * @returns {object|undefined}
 */
export function getSlotMeta(slot) {
  return MINISTER_SLOTS.find(s => s.id === slot);
}

/**
 * Aplica los pasivos de los ministros seleccionados al objeto de indicadores.
 * Llamar DESPUÉS de aplicar herencia y mandato (en newState).
 *
 * @param {object} ind           — indicadores actuales (mutable)
 * @param {object} selectedMap   — { economia: 'ortodoxa', social: 'asistencial', ... }
 * @returns {object} ind modificado (mismo objeto)
 */
export function applyMinisterPassives(ind, selectedMap) {
  for (const [, ministerId] of Object.entries(selectedMap)) {
    const minister = getMinisterById(ministerId);
    if (!minister) continue;
    for (const [key, delta] of Object.entries(minister.passive)) {
      if (key in ind) {
        ind[key] = Math.round(Math.max(0, Math.min(100, ind[key] + delta)));
      }
    }
  }
  return ind;
}

/**
 * Calcula el multiplicador combinado de efectos para cada indicador,
 * según los ministros seleccionados.
 *
 * @param {object} selectedMap — { economia: 'ortodoxa', ... }
 * @returns {object}  e.g. { ipc: 0.78, deuda: 0.80, produccion: 1.22, ... }
 */
export function getCombinedEffectMods(selectedMap) {
  const result = {};
  for (const [, ministerId] of Object.entries(selectedMap)) {
    const minister = getMinisterById(ministerId);
    if (!minister) continue;
    for (const [key, mult] of Object.entries(minister.effectMods)) {
      result[key] = (result[key] ?? 1.0) * mult;
    }
  }
  return result;
}

/**
 * Devuelve la selección de ministros por defecto (primero de cada cartera).
 * Útil como fallback si el jugador no completó la pantalla de gabinete.
 * @returns {object} { economia: 'ortodoxa', social: 'asistencial', ... }
 */
export function getDefaultMinisterSelection() {
  return Object.fromEntries(
    MINISTER_SLOTS.map(s => [s.id, getMinistersBySlot(s.id)[0].id])
  );
}
