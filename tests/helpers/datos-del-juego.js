// Re-exporta los datos con texto del juego para los barridos de contenido.
export { DATOS } from '../../js/data/pais-datos.js';

/** Todos los textos de un árbol, con su ruta. */
export function* textos(nodo, ruta = '', vistos = new WeakSet()) {
  if (typeof nodo === 'string') { yield [ruta, nodo]; return; }
  if (nodo === null || typeof nodo !== 'object' || vistos.has(nodo)) return;
  vistos.add(nodo);
  for (const k of Object.keys(nodo)) yield* textos(nodo[k], `${ruta}.${k}`, vistos);
}
