"use strict";

// ============================================================
// MIDTERM.JS — Elecciones legislativas de mitad de término
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

// ── Resultados posibles (turno 24) ───────────────────────────
const RESULTS = {
  win: {
    titulo:  '🗳️ ¡Victoria Legislativa!',
    subtitulo: 'Tu bloque retuvo la mayoría en el Congreso',
    desc: 'Los resultados confirmaron el apoyo ciudadano a tu gestión. Tu bloque ganó bancas y conserva la iniciativa legislativa. La oposición reconoce la derrota. El Congreso está de tu lado para la segunda mitad del mandato.',
    efectos: { confianza: 8, riesgo: -4, deuda: 0, ipc: 0, pobreza: 0, desocupacion: 0, produccion: 2, reservas: 0 },
    color:  '#27ae60',
    icon:   '✅',
  },
  lose: {
    titulo:  '🗳️ Derrota en las Urnas',
    subtitulo: 'La oposición tomó el control del Congreso',
    desc: 'Los resultados son contundentes: la oposición avanzó y tu bloque perdió la mayoría. Gobernar la segunda mitad del mandato será mucho más difícil. Cada proyecto de ley necesitará negociación y concesiones. La presión política se intensifica.',
    efectos: { confianza: -7, riesgo: 5, deuda: 0, ipc: 0, pobreza: 0, desocupacion: 0, produccion: -2, reservas: 0 },
    color:  '#e74c3c',
    icon:   '❌',
  },
};

// ── API pública ───────────────────────────────────────────────

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
    titulo:      'Elecciones Legislativas — Faltan 2 Meses',
    descripcion: 'En dos meses se realizarán las elecciones legislativas que renovarán la mitad del Congreso. Las encuestas muestran un escenario competitivo: tu bloque no tiene garantizada la mayoría. El resultado dependerá de cómo los ciudadanos evalúen tu gestión económica y social — y de la estrategia de campaña que elijas ahora.',
    imagen:      'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=70',
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
  const result = won ? RESULTS.win : RESULTS.lose;

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
