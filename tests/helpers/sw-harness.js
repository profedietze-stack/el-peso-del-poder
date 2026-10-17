// Corre el service worker de verdad, el mismo archivo que se publica.
//
// No es una copia ni una reimplementacion: se lee `sw.js` y se ejecuta dentro de
// un contexto de `node:vm` con un `self`, un `caches` y un `fetch` de mentira.
// Una copia se desincroniza el dia que alguien toca el original, y entonces las
// pruebas dan verde sobre codigo que ya no existe.
//
// El service worker es lo unico del juego que **falla en silencio**: no rompe
// nada visible, simplemente el juego deja de andar sin internet o se queda con
// una version vieja para siempre. Por eso hace falta poder dispararle eventos y
// mirar con que contesta.
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../..', import.meta.url));

/** Una respuesta de mentira, con lo justo que el service worker mira. */
export function respuesta({ url = '', status = 200, type = 'basic', body = '' } = {}) {
  return {
    url,
    status,
    type,
    body,
    ok: status >= 200 && status < 300,
    clone() {
      return respuesta({ url, status, type, body });
    },
  };
}

/** Una peticion de mentira. `mode` es lo que distingue navegar de pedir un recurso. */
export function peticion(url, { method = 'GET', mode = 'no-cors' } = {}) {
  return { url, method, mode };
}

/**
 * Monta el service worker sobre una caja de arena controlable.
 *
 * - `red`: que contesta la red para cada URL. Una funcion; si lanza, es que no hay internet.
 * - `guardado`: lo que ya hay en la cache al empezar, por URL.
 */
export function montarSW({ red = () => { throw new Error('sin red'); }, guardado = {} } = {}) {
  const almacenes = new Map();
  const cache = new Map(Object.entries(guardado));
  almacenes.set('inicial', cache);

  const escrituras = [];
  const esperas = [];

  const cacheApi = (mapa) => ({
    put: async (peticionOClave, valor) => {
      const clave = typeof peticionOClave === 'string' ? peticionOClave : peticionOClave.url;
      escrituras.push({ clave, valor });
      mapa.set(clave, valor);
    },
    match: async (peticionOClave) => {
      const clave = typeof peticionOClave === 'string' ? peticionOClave : peticionOClave.url;
      return mapa.get(clave);
    },
    addAll: async (urls) => {
      for (const url of urls) mapa.set(url, respuesta({ url }));
    },
  });

  const oyentes = new Map();

  const caja = {
    self: {
      registration: { scope: 'https://juego.test/' },
      skipWaiting: async () => {},
      clients: { claim: async () => {} },
      addEventListener: (nombre, fn) => oyentes.set(nombre, fn),
    },
    caches: {
      open: async (nombre) => {
        if (!almacenes.has(nombre)) almacenes.set(nombre, new Map());
        return cacheApi(almacenes.get(nombre));
      },
      keys: async () => [...almacenes.keys()],
      delete: async (nombre) => almacenes.delete(nombre),
      match: async (peticionOClave) => {
        const clave = typeof peticionOClave === 'string' ? peticionOClave : peticionOClave.url;
        for (const mapa of almacenes.values()) if (mapa.has(clave)) return mapa.get(clave);
        return undefined;
      },
    },
    fetch: async (peticionOClave) => {
      const url = typeof peticionOClave === 'string' ? peticionOClave : peticionOClave.url;
      return red(url);
    },
    Response: class {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status ?? 200;
        this.type = 'basic';
        this.ok = this.status >= 200 && this.status < 300;
      }
      clone() {
        return this;
      }
    },
    URL,
    Promise,
    console,
  };
  caja.self.caches = caja.caches;
  caja.self.fetch = caja.fetch;
  createContext(caja);

  runInContext(readFileSync(new URL('../../sw.js', import.meta.url), 'utf8'), caja, {
    filename: 'sw.js',
  });

  /**
   * Dispara un `fetch` y devuelve lo que el service worker le entrega al navegador.
   *
   * Devuelve `{ respondio, valor, error }`. Los tres casos importan: no contestar
   * (el navegador va a la red por su cuenta), contestar algo, o **rechazar** — que
   * para el navegador es una pantalla de error muda.
   */
  async function pedir(req) {
    const oyente = oyentes.get('fetch');
    let promesa = null;
    const evento = {
      request: req,
      respondWith: (p) => { promesa = p; },
      waitUntil: (p) => { esperas.push(p); },
    };
    oyente(evento);
    if (promesa === null) return { respondio: false, valor: undefined, error: null };
    try {
      return { respondio: true, valor: await promesa, error: null };
    } catch (error) {
      return { respondio: true, valor: undefined, error };
    }
  }

  async function instalar() {
    const oyente = oyentes.get('install');
    const pendientes = [];
    oyente({ waitUntil: (p) => pendientes.push(p) });
    await Promise.all(pendientes);
  }

  async function activar() {
    const oyente = oyentes.get('activate');
    const pendientes = [];
    oyente({ waitUntil: (p) => pendientes.push(p) });
    await Promise.all(pendientes);
  }

  /** Deja que terminen las escrituras que el worker mando en segundo plano. */
  async function asentar() {
    await Promise.all(esperas);
    await new Promise((r) => setImmediate(r));
  }

  return { pedir, instalar, activar, asentar, almacenes, escrituras, esperas, caja, RAIZ };
}
