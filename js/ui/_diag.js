"use strict";

// ============================================================
// DIAGNOSTICO TEMPORAL — identificar el "bloque oscuro" en Android
//
// Se activa SOLO con ?debug=1 en la URL. No afecta a los estudiantes.
//
// Que hace:
//   1. Escanea TODO el documento buscando elementos que cubran
//      >=85% del viewport Y tengan fondo oscuro / filter / blend
//      que oscurezca lo que esta debajo.
//   2. Lista la pila de elementos en el centro de la pantalla
//      (document.elementsFromPoint).
//   3. Muestra todo en un panel verde sobre negro, z-index maximo.
//   4. Toca en cualquier parte -> reescanea en ese punto.
//
// El usuario lee el panel (o screenshot) y nos dice que aparece.
// ============================================================

function _fmt(el) {
  if (!el || el === document.documentElement) return el === document.documentElement ? '<html>' : 'null';
  if (el === document.body) return '<body>';
  const tag = el.tagName.toLowerCase();
  const id  = el.id ? '#' + el.id : '';
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
    : '';
  return tag + id + cls;
}

function _props(el) {
  const cs = getComputedStyle(el);
  const r  = el.getBoundingClientRect();
  return {
    sel:      _fmt(el),
    pos:      cs.position,
    z:        cs.zIndex,
    bg:       cs.backgroundColor,
    opacity:  cs.opacity,
    filter:   cs.filter,
    backdrop: cs.backdropFilter || cs.webkitBackdropFilter,
    blend:    cs.mixBlendMode,
    pointer:  cs.pointerEvents,
    rect:     `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
  };
}

// Un fondo cuenta como "oscuro" si rgb promedio < 90 y alpha > .3
function _isDarkBg(bg) {
  const m = bg.match(/rgba?\(([^)]+)\)/);
  if (!m) return false;
  const p = m[1].split(',').map(s => parseFloat(s));
  const a = p.length >= 4 ? p[3] : 1;
  if (a < 0.3) return false;
  const avg = (p[0] + p[1] + p[2]) / 3;
  return avg < 90;
}

function _coversViewport(r) {
  return r.width >= window.innerWidth * 0.85 &&
         r.height >= window.innerHeight * 0.85 &&
         r.top <= window.innerHeight * 0.15 &&
         r.left <= window.innerWidth * 0.15;
}

function _scan(px, py) {
  const lines = [];
  lines.push(`VIEWPORT ${window.innerWidth}x${window.innerHeight} | fs=${!!document.fullscreenElement} | body.fs-active=${document.body.classList.contains('fs-active')}`);
  lines.push('');

  // --- 1. Elementos a pantalla completa, oscuros / con filter / blend ---
  lines.push('== CUBREN PANTALLA + oscurecen ==');
  const all = document.querySelectorAll('*');
  const suspects = [];
  all.forEach(el => {
    const r = el.getBoundingClientRect();
    if (!_coversViewport(r)) return;
    const cs = getComputedStyle(el);
    const darkens =
      _isDarkBg(cs.backgroundColor) ||
      (cs.filter && cs.filter !== 'none') ||
      (cs.backdropFilter && cs.backdropFilter !== 'none') ||
      (cs.mixBlendMode && cs.mixBlendMode !== 'normal' && cs.mixBlendMode !== 'initial');
    if (darkens) suspects.push(el);
  });
  if (!suspects.length) {
    lines.push('(ninguno — el bloque NO es un elemento fijo oscuro)');
  } else {
    suspects.sort((a, b) => (parseInt(getComputedStyle(b).zIndex) || 0) - (parseInt(getComputedStyle(a).zIndex) || 0));
    suspects.slice(0, 8).forEach(el => {
      const p = _props(el);
      lines.push(`> ${p.sel}`);
      lines.push(`  pos=${p.pos} z=${p.z} ptr=${p.pointer}`);
      lines.push(`  bg=${p.bg} op=${p.opacity}`);
      if (p.filter !== 'none')   lines.push(`  filter=${p.filter}`);
      if (p.backdrop && p.backdrop !== 'none') lines.push(`  backdrop=${p.backdrop}`);
      if (p.blend !== 'normal')  lines.push(`  blend=${p.blend}`);
      lines.push(`  rect=${p.rect}`);
    });
  }

  // --- 2. Pila de elementos en el punto (px,py) ---
  lines.push('');
  lines.push(`== PILA en (${px},${py}) — top primero ==`);
  const stack = document.elementsFromPoint(px, py);
  stack.slice(0, 6).forEach((el, i) => {
    const p = _props(el);
    lines.push(`${i}: ${p.sel}`);
    lines.push(`   pos=${p.pos} z=${p.z} bg=${p.bg} op=${p.opacity}${p.filter !== 'none' ? ' filter=' + p.filter : ''}${p.blend !== 'normal' ? ' blend=' + p.blend : ''}`);
  });

  return lines.join('\n');
}

function _render(text) {
  let panel = document.getElementById('__diag_panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = '__diag_panel';
    panel.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0',
      'max-height:70vh', 'overflow:auto',
      'z-index:2147483647',
      'background:#000', 'color:#0f0',
      'font:11px/1.35 monospace', 'padding:8px 8px 40px',
      'white-space:pre-wrap', 'word-break:break-word',
      'pointer-events:auto', 'box-shadow:0 4px 16px rgba(0,0,0,.8)',
    ].join(';');
    document.body.appendChild(panel);

    const close = document.createElement('button');
    close.textContent = 'X cerrar diag';
    close.style.cssText = 'position:fixed;bottom:8px;right:8px;z-index:2147483647;background:#0f0;color:#000;border:0;padding:8px 12px;font:bold 13px monospace;border-radius:6px;';
    close.onclick = () => { panel.remove(); close.remove(); };
    document.body.appendChild(close);
  }
  panel.textContent = text;
}

export function initDiag() {
  if (!/[?&]debug=1/.test(location.search)) return;

  const run = () => {
    _render(_scan(Math.round(window.innerWidth / 2), Math.round(window.innerHeight / 2)));
  };

  // Primer escaneo cuando el juego ya arranco
  setTimeout(run, 1800);

  // Toca en cualquier punto -> reescanea ahi (en captura, antes que el juego)
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#__diag_panel')) return;
    setTimeout(() => _render(_scan(Math.round(e.clientX), Math.round(e.clientY))), 50);
  }, true);

  // Reescaneo manual cada vez que cambia fullscreen
  document.addEventListener('fullscreenchange', () => setTimeout(run, 300));

  console.info('[diag] activo — ?debug=1');
}
