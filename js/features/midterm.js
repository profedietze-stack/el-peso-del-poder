"use strict";

import { medioTerminoTipo } from '../engine/mandato.js';

// ============================================================
// MIDTERM.JS — Elecciones de mitad de término (legislativas, o regionales y locales)
//
// Flujo:
//   · Turno 22: evento de AVISO — el jugador elige una estrategia
//     de campaña que guarda un bonus/malus en state.midtermBonus.
//   · Turno 24: resolución AUTOMÁTICA — se calcula el puntaje
//     electoral a partir de los indicadores + midtermBonus, se
//     muestra un modal de resultado y se aplican los efectos.
//
// Puntaje electoral (0-100):
//   Confianza:    peso 35%
//   IPC (inv):    peso 25%  (menor inflación → más votos)
//   Pobreza(inv): peso 25%  (menor pobreza → más votos)
//   Desocupación(inv): peso 15%
//
// Umbral de victoria: puntaje ≥ 50
// ============================================================

// ── Pesos para el puntaje electoral ──────────────────────────
const WEIGHTS = {
  confianza:    0.35,
  ipc:          0.25,   // invertido: menor es mejor
  pobreza:      0.25,   // invertido
  desocupacion: 0.15,   // invertido
};

// Rangos esperados de cada indicador (para normalizar 0-100)
const RANGES = {
  confianza:    { min: 0,  max: 100, invert: false },
  ipc:          { min: 0,  max: 100, invert: true  },
  pobreza:      { min: 0,  max: 100, invert: true  },
  desocupacion: { min: 0,  max: 50,  invert: true  },
};

// ── Opciones de campaña (turno 22) ───────────────────────────
export const CAMPAIGN_OPTIONS = [
  {
    id:     'propositiva',
    emoji:  '🤝',
    texto:  'Campaña propositiva: debatir propuestas concretas y abrir el diálogo con la oposición.',
    bonus:  +6,
    efectos: { confianza: 3, riesgo: -1 },
    desc:   'Suma +6 al puntaje electoral. Mejora la imagen institucional.',
  },
  {
    id:     'obras',
    emoji:  '🏗️',
    texto:  'Campaña de obras: anunciar inauguraciones y proyectos de infraestructura visible.',
    bonus:  +4,
    efectos: { produccion: 2, deuda: 2 },
    desc:   'Suma +4 al puntaje electoral. Genera deuda pero activa la economía.',
  },
  {
    id:     'confrontacion',
    emoji:  '⚡',
    texto:  'Campaña confrontacional: atacar a la oposición y movilizar la base propia.',
    bonus:  +2,
    efectos: { confianza: -2, riesgo: 2 },
    desc:   'Suma +2 al puntaje electoral. Polariza pero no convence a indecisos.',
  },
];

// ── Qué se elige a mitad de mandato, según el país ────────────
// Argentina y México tienen legislativas intermedias. Colombia y Chile no: a mitad de
// mandato eligen autoridades regionales y locales (ver `medioTerminoTipo` en data/pais.js).
// Cambia solo el texto: los efectos y el puntaje son los mismos en todos los países.
const ESCENARIOS = {
  legislativas: {
    aviso: {
      titulo: 'Elecciones Legislativas — Faltan 2 Meses',
      descripcion: 'En dos meses se realizarán las elecciones legislativas que renovarán la mitad del Congreso. Las encuestas muestran un escenario competitivo: tu bloque no tiene garantizada la mayoría. El resultado dependerá de cómo los ciudadanos evalúen tu gestión económica y social — y de la estrategia de campaña que elijas ahora.',
    },
    win: {
      titulo: '🗳️ ¡Victoria Legislativa!',
      subtitulo: 'Tu bloque retuvo la mayoría en el Congreso',
      desc: 'Los resultados confirmaron el apoyo ciudadano a tu gestión. Tu bloque ganó bancas y conserva la iniciativa legislativa. La oposición reconoce la derrota. El Congreso está de tu lado para la segunda mitad del mandato.',
    },
    lose: {
      titulo: '🗳️ Derrota en las Urnas',
      subtitulo: 'La oposición tomó el control del Congreso',
      desc: 'Los resultados son contundentes: la oposición avanzó y tu bloque perdió la mayoría. Gobernar la segunda mitad del mandato será mucho más difícil. Cada proyecto de ley necesitará negociación y concesiones. La presión política se intensifica.',
    },
    noticias: (gano, p, par) => gano
      ? [
          { headline: `${p} triunfa en las legislativas: el oficialismo retiene la mayoría`, body: `El bloque del ${par} logró mantener el control del Congreso. Analistas señalan que la gestión económica y la imagen presidencial fueron claves para el resultado.` },
          { headline: `#VictoriaLegislativa: el oficialismo celebra. ¿Qué viene ahora?`, body: `Las redes explotan de reacciones. El triunfo del ${par} despeja el camino para la segunda mitad del mandato de ${p}.` },
        ]
      : [
          { headline: `Derrota legislativa: la oposición toma el control del Congreso`, body: `La elección dejó al gobierno de ${p} sin mayoría parlamentaria. El ${par} deberá negociar cada proyecto de ley en la segunda mitad del mandato.` },
          { headline: `Congreso opositor: el mandato de ${p} entra en una zona de alta turbulencia`, body: `Con la oposición en el Congreso, el ejecutivo perderá iniciativa legislativa. Economistas advierten sobre posibles bloqueos al presupuesto.` },
        ],
  },
  'regional-co': {
    aviso: {
      titulo: 'Elecciones Regionales y Locales — Faltan 2 Meses',
      descripcion: 'En dos meses se realizarán las elecciones regionales y locales que renovarán gobernaciones y alcaldías. Las encuestas muestran un escenario competitivo: tu partido no tiene garantizado el triunfo en las principales regiones. El resultado dependerá de cómo los ciudadanos evalúen tu gestión económica y social — y de la estrategia de campaña que elijas ahora.',
    },
    win: {
      titulo: '🗳️ ¡Victoria en las Regiones!',
      subtitulo: 'Tus candidatos ganaron gobernaciones y alcaldías clave',
      desc: 'Los resultados confirmaron el apoyo ciudadano a tu gestión. Tus candidatos ganaron gobernaciones y alcaldías importantes y tu agenda llega con aliados al territorio. La oposición reconoce la derrota. Gobernarás la segunda mitad del mandato con respaldo en las regiones.',
    },
    lose: {
      titulo: '🗳️ Derrota en las Urnas',
      subtitulo: 'La oposición ganó las principales gobernaciones y alcaldías',
      desc: 'Los resultados son contundentes: la oposición avanzó y tu partido perdió terreno en las regiones. Gobernar la segunda mitad del mandato será mucho más difícil. Cada obra y cada programa necesitarán negociación con los nuevos gobiernos locales. La presión política se intensifica.',
    },
    noticias: (gano, p, par) => gano
      ? [
          { headline: `${p} gana las regionales: el oficialismo se impone en las principales gobernaciones`, body: `Los candidatos del ${par} ganaron en varias regiones y ciudades clave. Analistas señalan que la gestión económica y la imagen presidencial fueron claves para el resultado.` },
          { headline: `#VictoriaRegional: el oficialismo celebra. ¿Qué viene ahora?`, body: `Las redes explotan de reacciones. El triunfo del ${par} despeja el camino para la segunda mitad del mandato de ${p}.` },
        ]
      : [
          { headline: `Derrota regional: la oposición se queda con las principales gobernaciones`, body: `La elección dejó al gobierno de ${p} con menos aliados en el territorio. El ${par} deberá negociar cada obra con los nuevos gobiernos locales en la segunda mitad del mandato.` },
          { headline: `Regiones opositoras: el mandato de ${p} entra en una zona de alta turbulencia`, body: `Con la oposición al mando de las grandes regiones, el ejecutivo perderá capacidad de ejecución en el territorio. Economistas advierten sobre posibles demoras en las obras.` },
        ],
  },
  'regional-cl': {
    aviso: {
      titulo: 'Elecciones Municipales y Regionales — Faltan 2 Meses',
      descripcion: 'En dos meses se realizarán las elecciones municipales y regionales que renovarán alcaldías y consejos regionales. Las encuestas muestran un escenario competitivo: tu coalición no tiene garantizado el triunfo en las principales comunas. El resultado dependerá de cómo los ciudadanos evalúen tu gestión económica y social — y de la estrategia de campaña que elijas ahora.',
    },
    win: {
      titulo: '🗳️ ¡Victoria en las Comunas!',
      subtitulo: 'Tus candidatos ganaron alcaldías y consejos regionales clave',
      desc: 'Los resultados confirmaron el apoyo ciudadano a tu gestión. Tus candidatos ganaron alcaldías y consejos regionales importantes y tu agenda llega con aliados al territorio. La oposición reconoce la derrota. Gobernarás la segunda mitad del mandato con respaldo en las regiones.',
    },
    lose: {
      titulo: '🗳️ Derrota en las Urnas',
      subtitulo: 'La oposición ganó las principales alcaldías y consejos regionales',
      desc: 'Los resultados son contundentes: la oposición avanzó y tu coalición perdió terreno en las comunas y las regiones. Gobernar la segunda mitad del mandato será mucho más difícil. Cada obra y cada programa necesitarán negociación con las nuevas autoridades locales. La presión política se intensifica.',
    },
    noticias: (gano, p, par) => gano
      ? [
          { headline: `${p} gana las municipales: el oficialismo se impone en las principales comunas`, body: `Los candidatos del ${par} ganaron en varias comunas y regiones clave. Analistas señalan que la gestión económica y la imagen presidencial fueron claves para el resultado.` },
          { headline: `#VictoriaMunicipal: el oficialismo celebra. ¿Qué viene ahora?`, body: `Las redes explotan de reacciones. El triunfo del ${par} despeja el camino para la segunda mitad del mandato de ${p}.` },
        ]
      : [
          { headline: `Derrota municipal: la oposición se queda con las principales comunas`, body: `La elección dejó al gobierno de ${p} con menos aliados en el territorio. El ${par} deberá negociar cada obra con las nuevas autoridades locales en la segunda mitad del mandato.` },
          { headline: `Comunas opositoras: el mandato de ${p} entra en una zona de alta turbulencia`, body: `Con la oposición al mando de las grandes comunas, el ejecutivo perderá capacidad de ejecución en el territorio. Economistas advierten sobre posibles demoras en las obras.` },
        ],
  },
};

const _escenario = () => ESCENARIOS[medioTerminoTipo()] ?? ESCENARIOS.legislativas;

// ── Efectos y colores del resultado (iguales en todos los países) ──
const RESULTS = {
  win: {
    efectos: { confianza: 8, riesgo: -4, deuda: 0, ipc: 0, pobreza: 0, desocupacion: 0, produccion: 2, reservas: 0 },
    color:  '#27ae60',
    icon:   '✅',
  },
  lose: {
    efectos: { confianza: -7, riesgo: 5, deuda: 0, ipc: 0, pobreza: 0, desocupacion: 0, produccion: -2, reservas: 0 },
    color:  '#e74c3c',
    icon:   '❌',
  },
};

// ── API pública ───────────────────────────────────────────────

/** El resultado del medio término (texto del país + efectos, color e ícono). */
export function resultadoDelMedioTermino(gano) {
  return { ...(gano ? RESULTS.win : RESULTS.lose), ...(gano ? _escenario().win : _escenario().lose) };
}

/** Las dos noticias del resultado: `{ headline, body }`. */
export function noticiasDeMedioTermino(gano, presidente, partido) {
  return _escenario().noticias(gano, presidente, partido);
}

/**
 * Calcula el puntaje electoral (0-100) a partir del estado actual.
 * @param {object} state
 * @returns {number} puntaje redondeado
 */
export function calcElectoralScore(state) {
  const ind   = state.indicadores;
  let score = 0;

  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const { min, max, invert } = RANGES[key];
    const raw  = Math.max(min, Math.min(max, ind[key] ?? 50));
    const norm = (raw - min) / (max - min);   // 0-1
    const contrib = invert ? (1 - norm) : norm;
    score += contrib * weight * 100;
  }

  // Agregar bonus de campaña (guardado en state)
  score += state.midtermBonus ?? 0;

  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Genera el evento de AVISO de elecciones (turno 22).
 * Devuelve un objeto evento sintético con las opciones de campaña.
 * @returns {object} evento sintético
 */
export function buildWarningEvent() {
  return {
    id:          'midterm-warning',
    isMidtermWarning: true,
    tag:         '🗳️ Elecciones',
    titulo:      _escenario().aviso.titulo,
    descripcion: _escenario().aviso.descripcion,
    opciones:    CAMPAIGN_OPTIONS.map(o => ({
      texto:   `${o.emoji} ${o.texto}`,
      efectos: o.efectos,
      _campaignId: o.id,
      _campaignBonus: o.bonus,
    })),
  };
}

/**
 * Genera el modal de resultado de las elecciones (turno 24).
 * Muestra el puntaje, el resultado y los efectos.
 * @param {object} state
 * @param {Function} onClose — callback al cerrar el modal
 */
export function showElectionResult(state, onClose) {
  const score  = calcElectoralScore(state);
  const won    = score >= 50;
  const result = resultadoDelMedioTermino(won);

  // Calcular barra de puntaje
  const barColor = won ? '#27ae60' : '#e74c3c';

  // Construir efectos HTML
  const fxEntries = Object.entries(result.efectos).filter(([, v]) => v !== 0);
  const fxHTML = fxEntries.map(([k, v]) => {
    const labels = { confianza:'Confianza', ipc:'Inflación', deuda:'Deuda',
      reservas:'Reservas', riesgo:'Riesgo País', pobreza:'Pobreza',
      desocupacion:'Desempleo', produccion:'Producción' };
    const bad = (['ipc','deuda','riesgo','pobreza','desocupacion'].includes(k) && v > 0)
             || (!['ipc','deuda','riesgo','pobreza','desocupacion'].includes(k) && v < 0);
    const sign = v > 0 ? '+' : '';
    return `<span class="midterm-fx ${bad ? 'bad' : 'good'}">${labels[k] || k} <strong>${sign}${v}</strong></span>`;
  }).join('');

  // Inyectar overlay en el DOM
  let overlay = document.getElementById('midterm-result-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'midterm-result-overlay';
    overlay.className = 'midterm-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="midterm-modal" style="border-color:${result.color}44">
      <div class="midterm-header" style="background:${result.color}18;border-bottom:2px solid ${result.color}44">
        <div class="midterm-icon">${result.icon}</div>
        <div>
          <div class="midterm-titulo" style="color:${result.color}">${result.titulo}</div>
          <div class="midterm-subtitulo">${result.subtitulo}</div>
        </div>
      </div>

      <div class="midterm-score-wrap">
        <div class="midterm-score-label">Puntaje electoral</div>
        <div class="midterm-score-bar-bg">
          <div class="midterm-score-bar-fill" style="width:${score}%;background:${barColor}"></div>
          <div class="midterm-score-threshold"></div>
        </div>
        <div class="midterm-score-num" style="color:${barColor}">${score} / 100</div>
        <div class="midterm-score-hint">Umbral de victoria: 50 puntos</div>
      </div>

      <p class="midterm-desc">${result.desc}</p>

      ${fxHTML.length ? `
        <div class="midterm-fx-label">📉 Impacto inmediato:</div>
        <div class="midterm-fx-list">${fxHTML}</div>
      ` : ''}

      <button class="btn midterm-close-btn" style="border-color:${result.color};color:${result.color}"
              id="midterm-close-btn">
        Continuar gobernando →
      </button>
    </div>
  `;

  overlay.classList.add('open');
  document.getElementById('midterm-close-btn').onclick = () => {
    overlay.classList.remove('open');
    if (onClose) onClose(result);
  };
}
