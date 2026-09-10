// Que pasa cuando se cae el wifi de la escuela.
//
// El service worker es la unica pieza del juego que falla **en silencio**: no
// tira un error, no deja un rastro, simplemente el juego deja de andar sin
// internet. Y el juego promete andar sin internet: es una PWA con manifiesto,
// pensada para tablets de aula.
//
// Este archivo prueba el `sw.js` de verdad, cargado y ejecutado tal como se
// publica. Ver `helpers/sw-harness.js`.
import test from 'node:test';
import assert from 'node:assert/strict';
import { montarSW, peticion, respuesta } from './helpers/sw-harness.js';

const PORTADA = 'https://juego.test/';
const MODULO = 'https://juego.test/js/main.js';

/** El estado normal de una tablet que ya jugo una vez y ahora esta sin internet. */
function sinInternet(guardado) {
  return montarSW({ red: () => { throw new Error('sin red'); }, guardado });
}

test('sin internet, la portada sale de la cache', async () => {
  const sw = sinInternet({ [PORTADA]: respuesta({ url: PORTADA, body: '<!doctype html>' }) });

  const { valor } = await sw.pedir(peticion(PORTADA, { mode: 'navigate' }));

  assert.equal(valor.body, '<!doctype html>');
});

test('un modulo que falta no se contesta con la portada', async () => {
  // El fallo: sin internet y sin ese modulo en la cache, el worker devolvia la
  // pagina entera para CUALQUIER peticion. El navegador recibe HTML donde
  // esperaba JavaScript y falla con «Expected a JavaScript module script but the
  // server responded with a MIME type of text/html».
  //
  // El juego son modulos ES sueltos, sin empaquetador: son decenas de peticiones
  // distintas, y basta con que una sola no estuviera cacheada. La pantalla queda
  // en negro y el mensaje no dice nada de lo que pasa.
  const sw = sinInternet({ [PORTADA]: respuesta({ url: PORTADA, body: '<!doctype html>' }) });

  const { valor, error } = await sw.pedir(peticion(MODULO));

  assert.equal(error, null, 'rechazar la peticion deja al navegador con una pantalla muda');
  assert.notEqual(
    valor && valor.body,
    '<!doctype html>',
    'le entrego la portada a un `import`: el modulo no carga y la pantalla queda en negro',
  );
});

test('y cuando no hay nada en la cache, contesta algo en vez de romperse', async () => {
  // `caches.match()` que no encuentra nada resuelve a `undefined`, y
  // `respondWith(undefined)` **rechaza**. Para el navegador un respondWith
  // rechazado es un error de red: pantalla de error del navegador, sin una linea
  // que explique nada. Siempre hay que contestar una Response.
  const sw = sinInternet({});

  const { valor, error } = await sw.pedir(peticion(MODULO));

  assert.equal(error, null, 'el respondWith se rechazo: el navegador muestra su pantalla de error');
  assert.ok(valor, 'hay que devolver una Response, aunque sea un 503');
});

test('la navegacion sin nada guardado tampoco rompe', async () => {
  const sw = sinInternet({});

  const { valor, error } = await sw.pedir(peticion(PORTADA, { mode: 'navigate' }));

  assert.equal(error, null);
  assert.ok(valor);
});

test('con internet manda lo que trae la red, no lo viejo de la cache', async () => {
  // Network-first: el juego se actualiza solo. Es lo correcto para HTML y para
  // unos modulos sin hash en el nombre, que es lo que sirve este juego.
  const sw = montarSW({
    red: (url) => respuesta({ url, body: 'nuevo' }),
    guardado: { [MODULO]: respuesta({ url: MODULO, body: 'viejo' }) },
  });

  const { valor } = await sw.pedir(peticion(MODULO));

  assert.equal(valor.body, 'nuevo');
});

test('lo que llega de la red queda guardado para la proxima', async () => {
  const sw = montarSW({ red: (url) => respuesta({ url, body: 'contenido' }) });

  await sw.pedir(peticion(MODULO));
  await sw.asentar();

  assert.ok(
    sw.escrituras.some((e) => e.clave === MODULO),
    'sin esto el juego no funciona offline nunca',
  );
});

test('una respuesta con error no se guarda', async () => {
  // Cachear un 404 o un 500 congela el error: la proxima vez que se abra sin
  // internet, el juego sirve el fallo desde su propia cache.
  const sw = montarSW({ red: (url) => respuesta({ url, status: 404, body: 'no esta' }) });

  await sw.pedir(peticion(MODULO));
  await sw.asentar();

  assert.equal(
    sw.escrituras.some((e) => e.clave === MODULO),
    false,
    'guardo una respuesta con error: queda congelada en la cache',
  );
});

test('las escrituras van por waitUntil y no sueltas', async () => {
  // Un `caches.put` lanzado sin `waitUntil` puede quedarse a medias: el navegador
  // apaga el service worker en cuanto cree que termino, y la escritura se pierde.
  // El sintoma es de los peores: el juego funciona offline en el escritorio del
  // que lo programa y no en la tablet del aula.
  // Se comprueba disparando una peticion y mirando si el worker registro la
  // escritura como algo que hay que esperar. El efecto de no hacerlo —perder la
  // escritura— depende de cuando decida apagarse el navegador, asi que no se
  // puede provocar; lo que si se puede exigir es que la escritura este anotada.
  const sw = montarSW({ red: (url) => respuesta({ url, body: 'x' }) });

  await sw.pedir(peticion(MODULO));

  assert.ok(sw.esperas.length > 0, 'las escrituras de la cache tienen que ir dentro de event.waitUntil');
});

test('no cachea peticiones que no sean GET', async () => {
  const sw = montarSW({ red: (url) => respuesta({ url }) });

  const { respondio } = await sw.pedir(peticion(MODULO, { method: 'POST' }));

  assert.equal(respondio, false, 'un POST cacheado tira TypeError en el navegador');
});
