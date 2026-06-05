"use strict";

// ============================================================
// VICEPRESIDENTES — 4 opciones, perfiles ideológicos distintos
//
// El vicepresidente es el asesor principal del jugador:
//   · Aparece destacado encima del panel de ministros
//   · Puede consultarse 2 veces por turno (ministros: 1 vez)
//   · Credibilidad inicial más alta (4/5)
//   · Sus pasivos y effectMods se aplican al estado inicial
//
// Avatares generados con DiceBear Avataaars v9 — misma lógica
// de filtros de género que los ministros.
// ============================================================

// Fondo oscuro dorado-presidencial, distinto de los slots de carteras
const _VP_BG = '0e1200';

// Parámetros de vestimenta formal (idénticos a ministers.js)
const _AVA = [
  'clothing[]=blazerAndShirt',
  'clothing[]=blazerAndSweater',
  'clothing[]=collarAndSweater',
  'mouth[]=default', 'mouth[]=smile', 'mouth[]=serious',
  'mouth[]=twinkle', 'mouth[]=concerned', 'mouth[]=sad',
  'eyes[]=default', 'eyes[]=happy', 'eyes[]=squint',
  'eyes[]=wink', 'eyes[]=side', 'eyes[]=closed',
  'eyebrows[]=default', 'eyebrows[]=defaultNatural',
  'eyebrows[]=raisedExcited', 'eyebrows[]=raisedExcitedNatural',
  'eyebrows[]=flatNatural',
  'accessoriesProbability=35',
  'accessories[]=kurt', 'accessories[]=prescription01', 'accessories[]=prescription02',
  'facialHairProbability=30',
  'facialHair[]=beardLight', 'facialHair[]=beardMedium', 'facialHair[]=beardMajestic',
  'facialHair[]=moustacheFancy', 'facialHair[]=moustacheMagnum',
].join('&');

// Pelo largo / femenino (sin sombreros)
const _TOP_F = [
  'top[]=bigHair', 'top[]=bob', 'top[]=bun', 'top[]=curly', 'top[]=curvy',
  'top[]=dreads', 'top[]=frida', 'top[]=fro', 'top[]=froBand',
  'top[]=longButNotTooLong', 'top[]=miaWallace', 'top[]=shavedSides',
  'top[]=straight01', 'top[]=straight02', 'top[]=straightAndStrand',
].join('&');

// Pelo corto / masculino (sin sombreros)
const _TOP_M = [
  'top[]=dreads01', 'top[]=dreads02', 'top[]=frizzle', 'top[]=shaggy',
  'top[]=shaggyMullet', 'top[]=shortCurly', 'top[]=shortFlat',
  'top[]=shortRound', 'top[]=shortWaved', 'top[]=sides',
  'top[]=theCaesar', 'top[]=theCaesarAndSidePart',
].join('&');

/**
 * Genera la URL DiceBear para un vicepresidente.
 * @param {string} seed        — semilla única
 * @param {string} gender      — 'f' | 'm' | 'any'
 * @param {string} [extraParams] — params adicionales al final (ej: clothesColor)
 * @returns {string}
 */
function _av(seed, gender = 'any', extraParams = '') {
  const top = gender === 'f' ? _TOP_F : gender === 'm' ? _TOP_M : `${_TOP_F}&${_TOP_M}`;
  // Las mujeres no tienen barba/bigote — sobreescribimos facialHairProbability=0
  const noBeard = gender === 'f' ? '&facialHairProbability=0' : '';
  const extra   = extraParams ? `&${extraParams}` : '';
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${_VP_BG}&${_AVA}&${top}${noBeard}${extra}`;
}

// ── DEFINICIÓN DE VICEPRESIDENTES ─────────────────────────────

export const VICEPRESIDENTS = [

  {
    id:          'vp-moreno',
    name:        'Dra. Isabel Moreno',
    title:       'Vicepresidenta',
    profile:     'Progresista Social · Ex-CEPAL',
    gender:      'f',
    color:       '#27ae60',
    bio:         'Ex directora regional de la CEPAL. Reconocida por su agenda social y su capacidad de construir consenso. La voz más cercana a la ciudadanía en todo el gabinete.',
    adviceStyle: 'La gente es lo primero. Antes de ver números, mirá a quién afectan.',
    adviceFocus: ['pobreza', 'desocupacion', 'confianza'],
    // Pasivos: mejora indicadores sociales, sube levemente el IPC (gasto)
    passive:    { pobreza: -3, desocupacion: -1, confianza: +4, ipc: +2 },
    // Mods: amortigua impacto negativo en pobreza y desocupación; amplifica confianza
    effectMods: { pobreza: 0.82, desocupacion: 0.88, confianza: 1.18 },
    avatarUrl:  _av('Moreno-Social-ViceP-F01', 'f'),
  },

  {
    id:          'vp-fuentes',
    name:        'Dr. Ramón Fuentes',
    title:       'Vicepresidente',
    profile:     'Liberal Fiscal · Ex-Banco Central',
    gender:      'm',
    color:       '#2563a8',
    bio:         'Ex presidente del Banco Central durante dos gobiernos. Riguroso y austero, sabe leer los mercados como nadie. Su presencia tranquiliza a los inversores internacionales.',
    adviceStyle: 'Sin equilibrio fiscal no hay nada. Todo lo demás es poesía.',
    adviceFocus: ['ipc', 'deuda', 'riesgo'],
    // Pasivos: mejora frente fiscal y financiero, baja la confianza popular
    passive:    { ipc: -4, deuda: -3, riesgo: -3, confianza: -2, reservas: +2 },
    effectMods: { ipc: 0.78, deuda: 0.85, riesgo: 0.82 },
    // Ropa oscura (navy casi negro) — perfil austero/fiscal
    avatarUrl:  _av('Fuentes-Liberal-ViceP-M02', 'm', 'clothesColor[]=0f1f3d&clothesColor[]=162447&clothesColor[]=0d1b2a'),
  },

  {
    id:          'vp-castillo',
    name:        'Ing. Andrea Castillo',
    title:       'Vicepresidenta',
    profile:     'Tecnocrática Productivista · MIT',
    gender:      'f',
    color:       '#e67e22',
    bio:         'Ingeniera industrial, MBA en MIT. Construyó tres parques industriales antes de los 40. Piensa en cadenas de valor y exportaciones. Pragmática por naturaleza.',
    adviceStyle: 'Si no podemos medirlo, no podemos mejorarlo. Los datos no mienten.',
    adviceFocus: ['produccion', 'reservas', 'desocupacion'],
    // Pasivos: impulsa producción y reservas, sube levemente el IPC (inversión)
    passive:    { produccion: +5, reservas: +3, desocupacion: -2, ipc: +1 },
    effectMods: { produccion: 1.22, reservas: 1.15, desocupacion: 0.85 },
    // Seed cambiado para evitar resultado masculino; facialHairProbability=0 aplicado por _av
    avatarUrl:  _av('Castillo-Ingeniera-VPF-X9', 'f'),
  },

  {
    id:          'vp-vargas',
    name:        'Dr. Luis Vargas',
    title:       'Vicepresidente',
    profile:     'Dialoguista · Ex-Embajador',
    gender:      'm',
    color:       '#8e44ad',
    bio:         'Politólogo y negociador de carrera. Fue embajador en tres países y mediador en dos crisis constitucionales. Sabe cuándo hablar y cuándo escuchar.',
    adviceStyle: 'Toda crisis es una oportunidad de negociación. El diálogo siempre tiene salida.',
    adviceFocus: ['confianza', 'riesgo', 'pobreza'],
    // Pasivos: alta confianza y baja el riesgo, sube levemente la desocupación
    passive:    { confianza: +5, riesgo: -3, deuda: -1, desocupacion: +1 },
    effectMods: { confianza: 1.28, riesgo: 0.88 },
    // Ropa oscura (carbón/negro) — perfil diplomático sobrio
    avatarUrl:  _av('Vargas-Dialogo-ViceP-M04', 'm', 'clothesColor[]=1a1a2e&clothesColor[]=1c1c2e&clothesColor[]=0d0d1a'),
  },

];

/**
 * Devuelve un VP por ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getVPById(id) {
  return VICEPRESIDENTS.find(v => v.id === id) ?? null;
}

/**
 * Devuelve el ID del VP por defecto (primer elemento).
 * @returns {string}
 */
export function getDefaultVP() {
  return VICEPRESIDENTS[0].id;
}
