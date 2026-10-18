"use strict";

// ============================================================
// PANTALLA FINAL EN DIAPOSITIVAS
//
// La pantalla final era una sola columna larga: el diploma y el análisis llenaban
// la primera vista y el resultado de la reelección —con el botón de «Iniciar segundo
// mandato»— quedaba dos pantallas más abajo, así que muchos alumnos nunca se enteraban
// de que habían ganado y podían seguir.
//
// Ahora son cuatro diapositivas que se pasan con Siguiente / Atrás / flechas:
//   1 Diploma · 2 Tu gestión · 3 ¿Te reelegirían? (solo si ganaste el 1.er mandato) ·
//   4 Informe completo (logros, bitácora, compartir: lo que usa el docente).
// «📜 Informe completo» salta directo a la 4 desde cualquier diapositiva.
// ============================================================

import { permiteSegundoMandato } from '../engine/mandato.js';

export const DIAPOSITIVAS = ['diploma', 'gestion', 'eleccion', 'informe'];

/**
 * Qué diapositivas se muestran para esta partida. La de elecciones solo existe si se
 * ganó el primer mandato en un país con reelección (en derrota, en segundo mandato o
 * donde la ley no permite reelegirse no hay reelección que mostrar).
 */
export function diapositivasVisibles(state) {
  const hayEleccion = permiteSegundoMandato() && state?.won === true && state?.isSecondTerm !== true;
  return DIAPOSITIVAS.filter((d) => d !== 'eleccion' || hayEleccion);
}

/** Índice vecino sin salirse de la lista. */
export function moverIndice(actual, delta, total) {
  return Math.max(0, Math.min(total - 1, actual + delta));
}

let _lista = [];
let _i = 0;
let _oyenteTeclado = null;

function _el(id) { return document.getElementById(id); }

function _pantallaActiva() {
  return _el('screen-end')?.classList.contains('active');
}

function _mostrar() {
  const actual = _lista[_i];
  for (const id of DIAPOSITIVAS) {
    const s = _el(`end-slide-${id}`);
    if (!s) continue;
    const esta = id === actual;
    s.classList.toggle('activa', esta);
    s.hidden = !esta;
  }
  const prev = _el('end-prev');
  const next = _el('end-next');
  if (prev) prev.disabled = _i === 0;
  if (next) next.style.visibility = _i === _lista.length - 1 ? 'hidden' : 'visible';
  const link = _el('end-informe-link');
  if (link) link.style.display = actual === 'informe' ? 'none' : '';
  document.querySelectorAll('#end-dots .end-dot').forEach((d, k) => {
    d.classList.toggle('activo', k === _i);
    d.setAttribute('aria-selected', String(k === _i));
    d.setAttribute('aria-label', `Diapositiva ${k + 1} de ${_lista.length}`);
  });
  // Cada diapositiva arranca arriba: el que scrollea es la pantalla o la ventana, según el alto.
  const pantalla = _el('screen-end');
  if (pantalla) pantalla.scrollTop = 0;
  window.scrollTo(0, 0);
}

/** Ir a la diapositiva `delta` lugares más allá. */
export function moverDiapositiva(delta) {
  const nuevo = moverIndice(_i, delta, _lista.length);
  if (nuevo === _i) return;
  _i = nuevo;
  _mostrar();
}

/** Saltar a una diapositiva por nombre (ignora las que esta partida no tiene). */
export function irADiapositiva(nombre) {
  const k = _lista.indexOf(nombre);
  if (k < 0) return;
  _i = k;
  _mostrar();
}

/** Arma las diapositivas de esta partida y muestra la primera. */
export function iniciarDiapositivas(state) {
  _lista = diapositivasVisibles(state);
  _i = 0;

  const dots = _el('end-dots');
  if (dots) {
    dots.innerHTML = _lista.map((_, k) =>
      `<button class="end-dot" type="button" role="tab" data-k="${k}"></button>`).join('');
    dots.querySelectorAll('.end-dot').forEach((d) => {
      d.addEventListener('click', () => { _i = Number(d.dataset.k); _mostrar(); });
    });
  }
  _el('end-prev')?.addEventListener('click', _alAtras);
  _el('end-next')?.addEventListener('click', _alSiguiente);
  _el('end-informe-link')?.addEventListener('click', _alInforme);

  if (!_oyenteTeclado) {
    _oyenteTeclado = (e) => {
      if (!_pantallaActiva()) return;
      // No pisar a quien escribe, ni a un modal abierto.
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowRight') moverDiapositiva(1);
      else if (e.key === 'ArrowLeft') moverDiapositiva(-1);
    };
    document.addEventListener('keydown', _oyenteTeclado);
  }
  _mostrar();
}

// Referencias estables: volver a llamar addEventListener con la misma función no suma otro oyente.
function _alAtras() { moverDiapositiva(-1); }
function _alSiguiente() { moverDiapositiva(1); }
function _alInforme() { irADiapositiva('informe'); }
