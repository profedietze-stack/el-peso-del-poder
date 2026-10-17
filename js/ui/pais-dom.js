"use strict";

// Red de seguridad de "Latinoamérica": algunos textos viven dentro del código (las
// crisis automáticas, el manual de index.html, los tooltips armados al vuelo) y no
// en los módulos de datos. Este observador les aplica el mismo `textoPais` cuando
// llegan a la pantalla. tests/pais.test.js comprueba que ningún texto del código
// deje un dato real una vez pasado por `textoPais`.
import { textoPais } from '../data/pais.js';

const ATRIBUTOS = ['title', 'aria-label', 'placeholder', 'alt'];

/** El selector de país tiene que seguir diciendo «Argentina»: se lo marca con data-sin-pais. */
const _excluido = (nodo) => !!(nodo.nodeType === 1 ? nodo : nodo.parentElement)?.closest?.('[data-sin-pais]');

function _texto(nodo) {
  if (_excluido(nodo)) return;
  const v = nodo.nodeValue;
  const n = textoPais(v);
  if (n !== v) nodo.nodeValue = n;
}

function _elemento(el) {
  if (el.nodeType === 3) { _texto(el); return; }
  if (el.nodeType !== 1 || _excluido(el)) return;
  for (const a of ATRIBUTOS) {
    const v = el.getAttribute(a);
    if (v) { const n = textoPais(v); if (n !== v) el.setAttribute(a, n); }
  }
  for (const h of el.childNodes) _elemento(h);
}

/** Reescribe lo que ya está en pantalla y vigila lo que llegue después. */
export function iniciarPaisDom(raiz = document.body) {
  _elemento(raiz);
  new MutationObserver((cambios) => {
    for (const c of cambios) {
      if (c.type === 'characterData') _texto(c.target);
      else if (c.type === 'attributes') _elemento(c.target);
      else c.addedNodes.forEach(_elemento);
    }
  }).observe(raiz, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATRIBUTOS });
  document.title = textoPais(document.title);
}
