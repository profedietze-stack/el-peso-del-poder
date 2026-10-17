const CACHE = 'sdr-v46';

/**
 * El juego sin internet.
 *
 * Es una PWA con manifiesto, pensada para tablets de aula, así que "anda sin
 * internet" no es un extra: es media promesa del juego. Y es la única pieza que
 * falla **en silencio** — no tira un error, no deja rastro, simplemente un día
 * la pantalla queda en negro y nadie sabe por qué.
 *
 * Dos cosas, y las dos hacen falta:
 *
 * 1. **`install` precachea todo lo que el juego necesita** (la lista PRECACHE, que
 *    se arma recorriendo el disco: `node tests/sellar-cache.js`). Antes solo
 *    guardaba la portada y el resto «a medida que se usaba», así que con UNA visita
 *    la portada se pintaba y los 42 módulos devolvían 503: botones muertos y sin
 *    error. Hacían falta dos visitas, y el propio aviso prometía una.
 *
 * 2. **Red primero para todo lo demás.** El juego son módulos ES sueltos, sin
 *    empaquetador y sin huella en el nombre, así que una caché que mande sobre la
 *    red dejaría a media clase con la versión de la semana pasada. Primero la red;
 *    la caché es la red de abajo, y se va refrescando con lo que se usa.
 *
 * El nombre de la caché (`CACHE`) va sellado con una huella del contenido
 * (`sw-precache.json`): si cambia algo precacheado y no se sube el nombre, el test
 * falla. Sin eso, un arreglo que no sube `CACHE` no le llega a las tablets que ya
 * lo tienen instalado.
 *
 * Ver `tests/sw.test.js` y `tests/sw-precache.test.js`, que corren este mismo archivo.
 */

// PRECACHE:INICIO
const PRECACHE = [
  "./",
  "index.html",
  "manifest.json",
  "icon.svg",
  "css/fuentes.css",
  "css/main.css",
  "js/audio.js",
  "js/config.js",
  "js/data/achievements.js",
  "js/data/event-images.js",
  "js/data/events.js",
  "js/data/glossary.js",
  "js/data/heritage.js",
  "js/data/minister-commentary.js",
  "js/data/ministers.js",
  "js/data/news.js",
  "js/data/pais-datos.js",
  "js/data/pais.js",
  "js/data/quotes.js",
  "js/data/stickers.js",
  "js/data/vicepresident.js",
  "js/engine/capital.js",
  "js/engine/effects.js",
  "js/engine/save-validation.js",
  "js/engine/scoring.js",
  "js/engine/settings.js",
  "js/engine/state.js",
  "js/engine/storage.js",
  "js/engine/texto.js",
  "js/error-banner-inicial.js",
  "js/features/advisors.js",
  "js/features/coalicion.js",
  "js/features/crisis-auto.js",
  "js/features/difficulty.js",
  "js/features/midterm.js",
  "js/features/news-engine.js",
  "js/features/resignations.js",
  "js/features/tutorial.js",
  "js/main.js",
  "js/ui/dashboard.js",
  "js/ui/endscreen.js",
  "js/ui/error-banner.js",
  "js/ui/event.js",
  "js/ui/heritage-ui.js",
  "js/ui/identity-ui.js",
  "js/ui/image-preloader.js",
  "js/ui/minister-modal.js",
  "js/ui/ministers-ui.js",
  "js/ui/modals.js",
  "js/ui/news-ui.js",
  "js/ui/pais-dom.js",
  "js/ui/screens.js",
  "js/ui/settings-modal.js",
  "js/ui/splash.js",
  "js/ui/teclado.js",
  "js/ui/tooltip.js",
  "js/ui/trophies-ui.js",
  "fonts/barlow-400-latin.woff2",
  "fonts/barlow-500-latin.woff2",
  "fonts/barlow-600-latin.woff2",
  "fonts/barlow-700-latin.woff2",
  "fonts/barlow-condensed-400-latin.woff2",
  "fonts/barlow-condensed-600-latin.woff2",
  "fonts/barlow-condensed-700-latin.woff2",
  "fonts/playfair-display-700-latin.woff2",
  "fonts/playfair-display-900-latin.woff2",
  "img/avatares/agroexportador.svg",
  "img/avatares/asistencial.svg",
  "img/avatares/confrontacional.svg",
  "img/avatares/dialoguista.svg",
  "img/avatares/focalizada.svg",
  "img/avatares/heterodoxa.svg",
  "img/avatares/industrialista.svg",
  "img/avatares/innovacion.svg",
  "img/avatares/laboral.svg",
  "img/avatares/ortodoxa.svg",
  "img/avatares/respaldo.svg",
  "img/avatares/tecnocrata_eco.svg",
  "img/avatares/tecnocrata_gab.svg",
  "img/avatares/vp-castillo.svg",
  "img/avatares/vp-fuentes.svg",
  "img/avatares/vp-moreno.svg",
  "img/avatares/vp-vargas.svg",
  "img/eventos/ambiente-0.jpg",
  "img/eventos/campo-0.jpg",
  "img/eventos/campo-1.jpg",
  "img/eventos/cultura-0.jpg",
  "img/eventos/cultura-1.jpg",
  "img/eventos/economia-0.jpg",
  "img/eventos/economia-1.jpg",
  "img/eventos/educacion-0.jpg",
  "img/eventos/educacion-1.jpg",
  "img/eventos/energia-0.jpg",
  "img/eventos/energia-1.jpg",
  "img/eventos/institucional-0.jpg",
  "img/eventos/institucional-1.jpg",
  "img/eventos/internacional-0.jpg",
  "img/eventos/internacional-1.jpg",
  "img/eventos/justicia-0.jpg",
  "img/eventos/justicia-1.jpg",
  "img/eventos/salud-0.jpg",
  "img/eventos/salud-1.jpg",
  "img/eventos/seguridad-0.jpg",
  "img/eventos/social-0.jpg",
  "img/eventos/tecnologia-0.jpg",
  "img/eventos/tecnologia-1.jpg",
  "vendor/html2canvas.min.js"
];
// PRECACHE:FIN

self.addEventListener('install', (e) => {
  e.waitUntil(precachear().then(() => self.skipWaiting()));
});

/**
 * Baja y guarda todo PRECACHE, un archivo por vez en paralelo y **tolerante**:
 * `cache.addAll` es todo o nada —un solo 404 y no queda nada guardado—, así que se
 * guarda archivo por archivo y lo que falle se avisa y se reintenta al usarse.
 * Una respuesta con error no se guarda: congelaría el error en la caché.
 */
async function precachear() {
  const cache = await caches.open(CACHE);
  const base = self.registration.scope;
  const resultados = await Promise.allSettled(
    PRECACHE.map(async (ruta) => {
      const url = new URL(ruta, base).href;
      const respuesta = await fetch(url, { cache: 'reload' });
      if (!sePuedeGuardar(respuesta)) throw new Error(`${url} → ${respuesta && respuesta.status}`);
      await cache.put(url, respuesta);
    }),
  );
  const fallidos = resultados.filter((r) => r.status === 'rejected');
  if (fallidos.length > 0) {
    console.warn(`[sw] ${fallidos.length} de ${PRECACHE.length} archivos no se pudieron precachear`, fallidos[0].reason);
  }
}

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
        '<p>Este dispositivo todavía no guardó el juego. Conectate a internet y abrí el ' +
        'juego una vez, esperando a que termine de cargar: después funciona sin conexión.</p>',
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
