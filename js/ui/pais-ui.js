"use strict";

// Pantalla «¿En qué país gobernarás?»: lo primero de cada partida nueva.
import { PAISES } from '../data/pais.js';
import { paisActivo } from '../engine/mandato.js';
import { setPais } from '../engine/settings.js';
import { showScreen } from './screens.js';
import { fichaDePais, decidirEleccion, NUEVA_PARTIDA_CLAVE } from './pais-ficha.js';

const _esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function _tarjeta(id, activo) {
  const f = fichaDePais(id);
  return `
    <button class="pais-card${id === activo ? ' pais-card-actual' : ''}" type="button" data-pais="${id}">
      <span class="pais-card-cabecera">
        <span class="pais-card-bandera" aria-hidden="true">${f.bandera}</span>
        <span class="pais-card-nombre">${_esc(f.nombre)}</span>
        ${id === activo ? '<span class="pais-card-tag">Último usado</span>' : ''}
      </span>
      <span class="pais-card-resumen">${_esc(f.resumen)}</span>
      <span class="pais-card-lineas">
        ${f.lineas.map((l) => `<span class="pais-card-linea"><span class="pais-card-icono" aria-hidden="true">${l.icono}</span><span>${_esc(l.texto)}</span></span>`).join('')}
      </span>
      <span class="pais-card-elegir">Gobernar en ${_esc(f.nombre)} →</span>
    </button>`;
}

/**
 * Muestra la elección de país. `onElegido` se llama si el país elegido ya es el activo; si es otro,
 * se guarda y se recarga la página, que arranca directo en la identidad (ver main.js).
 */
export function showPaisScreen(onElegido) {
  const grid = document.getElementById('pais-grid');
  if (!grid) { onElegido(); return; }
  const activo = paisActivo();
  grid.innerHTML = Object.keys(PAISES).map((id) => _tarjeta(id, activo)).join('');
  grid.onclick = (e) => {
    const btn = e.target.closest('.pais-card');
    if (!btn) return;
    const r = decidirEleccion(btn.dataset.pais, {
      paisActual: paisActivo(),
      setPais,
      marcar: () => { try { sessionStorage.setItem(NUEVA_PARTIDA_CLAVE, '1'); } catch (_) { /* sin sessionStorage: se vuelve a elegir tras recargar */ } },
      recargar: () => location.reload(),
    });
    if (r === 'seguir') onElegido();
  };
  showScreen('screen-pais');
}
