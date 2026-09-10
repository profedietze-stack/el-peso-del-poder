const CACHE = 'sdr-v38';

/**
 * El juego sin internet.
 *
 * Es una PWA con manifiesto, pensada para tablets de aula, así que "anda sin
 * internet" no es un extra: es media promesa del juego. Y es la única pieza que
 * falla **en silencio** — no tira un error, no deja rastro, simplemente un día
 * la pantalla queda en negro y nadie sabe por qué.
 *
 * La estrategia es red primero para todo. El juego son módulos ES sueltos
 * servidos tal cual, sin empaquetador y sin huella en el nombre, así que una
 * caché que mande sobre la red dejaría a media clase con la versión de la semana
 * pasada y sin forma de salir de ahí. Primero la red; la caché es la red de
 * abajo, y se va llenando con lo que se va usando.
 *
 * Ver `tests/sw.test.js`, que corre este mismo archivo.
 */

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        fetch(self.registration.scope)
          .then((r) => {
            if (r.ok) return cache.put(self.registration.scope, r);
          })
          .catch(() => {}),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Lo que no tiene sentido cachear ni interceptar. */
function fueraDeAlcance(url) {
  return (
    url.startsWith('chrome-extension') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  );
}

/**
 * Si una respuesta se puede guardar.
 *
 * Un 404 o un 500 guardado **congela el error**: la próxima vez que el juego se
 * abra sin internet, se sirve el fallo desde su propia caché y ya no hay forma
 * de que se arregle solo.
 */
function sePuedeGuardar(response) {
  return Boolean(response) && response.status === 200 && response.type !== 'opaque';
}

/**
 * Lo que se contesta cuando no hay red y tampoco hay nada guardado.
 *
 * Tiene que ser una `Response`. `caches.match()` que no encuentra nada resuelve
 * a `undefined`, y un `respondWith(undefined)` **rechaza**: para el navegador
 * eso es un error de red, o sea su propia pantalla de error, sin una línea que
 * le diga al docente qué pasó. Un 503 explicado es peor que el juego y mucho
 * mejor que una pantalla muda.
 */
function sinNada(request) {
  if (request.mode === 'navigate') {
    return new Response(
      '<!doctype html><html lang="es"><meta charset="utf-8">' +
        '<title>El Peso del Poder · sin conexión</title>' +
        '<body style="font-family:system-ui;background:#0d1117;color:#e6edf3;padding:2rem">' +
        '<h1>Sin conexión</h1>' +
        '<p>Este dispositivo todavía no guardó el juego. Conectate una vez a internet, ' +
        'abrí el juego y a partir de ahí funciona sin conexión.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
  return new Response('', { status: 503 });
}

/**
 * Red primero, caché después, y la portada **sólo** para quien está navegando.
 *
 * Lo último es el arreglo que más importa. Antes, cualquier petición que fallara
 * se contestaba con la página entera: un `import` de un módulo recibía HTML
 * donde esperaba JavaScript y el navegador cortaba con «Expected a JavaScript
 * module script but the server responded with a MIME type of text/html». Como el
 * juego son decenas de módulos sueltos, bastaba con que uno solo no estuviera
 * guardado para dejar la pantalla en negro con un mensaje que no explica nada.
 */
async function atender(e) {
  try {
    const response = await fetch(e.request);

    if (sePuedeGuardar(response)) {
      const copia = response.clone();
      // La escritura va dentro de `waitUntil`: sin eso el navegador puede apagar
      // el worker en cuanto cree que terminó y la escritura se pierde a medias.
      // El síntoma es de los peores — funciona en la máquina del que programa y
      // no en la tablet del aula.
      e.waitUntil(caches.open(CACHE).then((cache) => cache.put(e.request, copia)));
    }

    return response;
  } catch {
    const guardado = await caches.match(e.request);
    if (guardado) return guardado;

    if (e.request.mode === 'navigate') {
      const portada = await caches.match(self.registration.scope);
      if (portada) return portada;
    }

    return sinNada(e.request);
  }
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (fueraDeAlcance(e.request.url)) return;

  e.respondWith(atender(e));
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'CACHE_PAGE') {
    const guardar = caches.open(CACHE).then((cache) =>
      fetch(e.data.url)
        .then((r) => {
          if (r.ok) return cache.put(e.data.url, r);
        })
        .catch(() => {}),
    );
    if (e.waitUntil) e.waitUntil(guardar);
  }
});
