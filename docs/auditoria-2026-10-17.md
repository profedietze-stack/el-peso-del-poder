# Auditoría de El Peso del Poder — 17 de octubre de 2026

Alcance: toda la carpeta del juego en `HEAD = 14da9b1` (árbol limpio). Primera pasada **solo lectura y
medición**: no se tocó código del juego. Lo único que se escribió es este archivo (sin commitear).

Cómo se midió (todo reproducible, scripts en la carpeta de notas de la sesión):

- **Simulación headless con el motor real** (`sim.mjs`, `sim2.mjs`, `sim3.mjs`, `freq.mjs`): importa
  `state.js`, `scoring.js`, `effects.js`, `crisis-auto.js`, `midterm.js` y juega 48 turnos con inercia,
  efectos persistentes, cadenas, crisis automáticas, preEffects, medio término y derrota. Quedan fuera
  asesores y renuncias.
- **Chromium real por Playwright**, sonido silenciado por `epp_settings` antes de cargar. Se recorrió el camino
  completo (splash → identidad → herencia → gabinete → dificultad → 48 turnos → pantalla final), guardados
  corruptos, service worker, offline con la caché HTTP desactivada por CDP, móvil 375×812 al 140 % de letra.
- Servidor de pruebas `py -m http.server 8077` (no existe la config `epp` en
  `Claude/.claude/launch.json`, que solo tiene `inversor` y `lienzo-vivo`). `document.title` = «El Peso del
  Poder» comprobado. El servidor se mató al terminar (puerto 8077 caído, verificado).
- `npm test`: **43/43 verdes** (el patrón entre comillas corre los 6 archivos).

---

## 0. Lo ya cerrado en la auditoría de septiembre: sigue cerrado

| Ítem | Verificación |
|---|---|
| Orden de opciones barajado (Fisher-Yates) | `ordenDeOpciones` en `event.js:146`; 0 `sort(() => Math.random…)` en `js/` (solo en comentarios) |
| Sin opciones dominadas / sin evento «de una sola opción» | test `decisiones-reales` verde; no se reabre |
| SW no devuelve la portada a cualquier pedido | `sw.js` `sinNada()` devuelve 503; `tests/sw.test.js` verde |
| Sin terceros en el juego | 0 URLs `http(s)` en `js/`, `css/`, `index.html`, `manifest.json`, `sw.js`; 0 peticiones a otro origen en una partida completa. **Excepción nueva: ver M-09** |
| Comentarios ministeriales vs motor | test `ministros-dicen-la-verdad` verde |

**Pero el barajado, que se agregó para arreglar el sesgo, dejó un consumidor sin migrar: A-02 abajo.**

---

## 1. Bugs confirmados (con reproducción)

| ID | Eje | Sev. | Archivo:línea | Evidencia | Impacto en el alumno | Arreglo propuesto | Esf. |
|---|---|---|---|---|---|---|---|
| **A-01** | 1,6 | **Alto** | `main.js:275-297` (`loadGame`), `state.js:212-216` | Guardo una partida **Ultra** con `newState` (mult 1.5 / 2.2). Recargo y llamo `loadGame()`: `CONFIG.EFFECT_MULTIPLIER` = **1** y `_BAD` = **1**, con `G.difficulty = 'ultra'`. Los multiplicadores solo se fijan dentro de `newState`. | Al tocar F5, cambiar de pestaña con recarga o reabrir la tablet, la partida retomada **cambia de dificultad en silencio**: Ultra y Hard se vuelven Normal en los efectos (inercia, umbrales y crisis siguen siendo Ultra, así que queda una dificultad híbrida que nadie diseñó); Fácil se vuelve **más duro** (0,7 → 1,0). Los puntajes de una misma clase dejan de ser comparables. | Extraer `aplicarDificultad(difficulty)` y llamarla en `newState` **y** en `loadGame` (y al empezar 2.º mandato). Test: guardar, resetear `CONFIG`, cargar, comprobar. | S |
| **A-02** | 1,2 | **Alto** | `advisors.js:1016-1018` | Con el evento «Narcocriminalidad» (3 opciones) llamo 60 veces `renderEvent` + `showAdvisorModal('economia')`: el botón resaltado **no es la opción recomendada en 37/60 casos (62 %)**. Ej.: el texto del asesor dice «Operativo conjunto…» y el resalte cae en «Legalización regulada…». Compara `i === recommendedIndex` por **posición en pantalla**, pero desde el barajado `data-index` es el índice original. | El asesor dice una cosa y la pantalla marca otra, 2 de cada 3 veces. El alumno que sigue el resalte elige lo que el asesor **no** recomendó, y después `updateAdvisorCredibility` lo toma como «no seguí al asesor» o, peor, le sube/baja la credibilidad por una decisión que no pensó. Es la regresión del arreglo de septiembre: «el arreglo a medias». | Comparar `parseInt(btn.dataset.index) === recommendedIndex`. Test que renderice, baraje 50 veces y exija coincidencia. | S |
| **A-03** | 1,6 | **Alto** | `main.js:1105-1113` (`doQuit`), `main.js:340-357` (`_startTurn`) | Guardo en `turn=3` con `ipc=70`, un efecto persistente `produccion −2` (3 turnos). 1.ª carga: `ipc 71,6`, `prod 64`, `turnsLeft 2`. «Salir» guarda `G` **ya con la inercia del turno aplicada**; «Continuar» la aplica de nuevo: `ipc 73,2`, `prod 62`, `turnsLeft 1`. Cada salir/continuar en el mismo turno suma otra pasada. | Salir y Continuar a mitad de turno cobra la inercia y los efectos persistentes **otra vez** y **acorta su duración**. Es un exploit (gastar la duración de un efecto malo saliendo y volviendo) y un bug honesto (la tablet se apaga a mitad de turno). Además `pickNextEvent` ya consumió la cadena pendiente: se pierde ese evento. | `doQuit` no debe guardar mitad de turno: guardar el estado del **inicio** del turno (snapshot) o no guardar si el turno no avanzó. O marcar `G.turnStarted = G.turn` y no re-aplicar. | M |
| **A-04** | 7,1 | **Alto** | `sw.js:23-38`, `main.js:84-86` | Con la caché HTTP desactivada (CDP) y sin red: **1 visita** → la portada se pinta (¡«Todo listo para jugar!») pero `window.startGame === undefined`, 4 respuestas 503 en consola; **2 visitas** → funciona (55 entradas en caché). La 1.ª visita solo guarda `/` (1 entrada): `install` no precachea los módulos y `clients.claim()` llega tarde. | La pantalla de aviso del propio SW promete «conectate una vez, abrí el juego y funciona sin conexión»: **es falso**. En un aula: la tablet abre el juego una vez, el wifi se cae, y queda una portada con botones muertos y **sin banner de error** (el banner vive dentro de `main.js`, que no cargó). | Precachear la lista de módulos/CSS/fuentes/vendor en `install` (nombres fijos, sin hash: sirve), con `Promise.allSettled`; sello de caché con huella (como Math Race); test «todo lo precacheado existe». | M |
| **A-05** | 8 | **Medio** | `endscreen.js:106-107, 231, 401-402, 571-572, 803-804, 968-969`; `main.js:857-866`; `news-engine.js`/`news-ui.js` | Nombre `<img src=x onerror=window.__xss=1>Ana` y partido `<b id=xssb>…`: al llegar a la pantalla final **`window.__xss === 1`** y existe `#xssb`; la petición a `/x` aparece en el tráfico (`#share-card`). `identity-ui.js:109-110` guarda el texto crudo y se inyecta con `innerHTML`. | Es self-XSS (un solo jugador, sin multijugador), pero el nombre **persiste en `sdr_save`** y se renderiza en cada carga y en el «compartir» (html2canvas). Un alumno puede romper su propia pantalla final o la de un compañero al que le pasa la tablet. CLAUDE.md §5 y §15: nunca `innerHTML` con texto del alumno. | Helper `esc()` aplicado en los 20+ puntos; o `textContent`. Más simple: **sanear al guardar** la identidad (quitar `<>&"`) y además escapar al pintar. Test que recorra `js/` con glob buscando `${...presidentName...}` sin `esc`. | M |
| **A-06** | 1 | **Medio** | `storage.js:35-39, 100`; `main.js:202, 275-297` | `sdr_save` = `{"turn":5,` (JSON roto), `null`, o `usedEventIds:7`: el botón «Continuar» **queda visible para siempre** y `loadGame` solo avisa «No hay partida» sin borrar nada. Con `indicadores:'hola'` o `[]`: `loadGame` **lanza** (`Cannot read properties of undefined (reading 'dangerHistory'/'ipc')`) y deja `screen-game` abierta **sin opciones**. Con `indicadores:{ipc:50}` carga con valores `undefined`. Sin versión de esquema ni validación campo por campo (checklist §6.3). | Guardado ilegible = botón muerto o pantalla en negro sin mensaje. No hace falta un alumno editando: alcanza que una versión futura cambie un tipo. | `validarGuardado()`: versión, tipos, rangos 0-100, `difficulty` ∈ conjunto, `turn` 1-48, campos faltantes → defaults; si no pasa, `clearSave()` + aviso y ocultar el botón. | M |
| **A-07** | 1,5 | **Medio** | `event-images.js:141-148` | `event.id % 2` con id string (`crisis-auto-ipc-3`, `midterm-warning`) = `NaN` → `photos[NaN]` → `img/eventos/undefined.jpg`. En una partida completa: **12 respuestas 404** a esa URL; solo se salva por el `onerror` al degradado. | Cada crisis automática y la elección de medio término pide una imagen inexistente: 404 en consola (rompe la regla «cero errores de consola» y esconde errores reales) y pierde la foto de categoría. | `Number.isInteger(event.id) ? event.id % 2 : hash(String(event.id)) % 2`. Test con ids string. | S |
| **A-08** | 4 | **Medio** | `config.js:69, 75` vs `config.js:18-31` | Tooltip de Pobreza: «si supera 80% el gobierno cae»; confianza: «si llega a 0%». Reales: pobreza 80 / **78 / 75 / 70** y confianza 0 / **5 / 10 / 15** según Fácil/Normal/Difícil/Ultra. | La ayuda del juego miente en 3 de 4 dificultades: un alumno en Ultra «seguro» con pobreza 72 % pierde sin aviso. Capa de referencia contra el motor. | Generar el tooltip desde `checkDefeat`/`CONFIG` según `G.difficulty`. Test que cruce tooltip y umbrales. | S |
| **A-09** | 4,9 | **Bajo** | `main.js:1011-1017` | `vpNames` tiene `vp-santos/-gutiérrez/-castro/-herrera`; los VP reales son `vp-moreno/-fuentes/-castillo/-vargas`. 3 de 4 caen en «Vicepresidente/a (VP):» en la alerta de crisis extrema. (Mismo desfasaje en mis sims: no es del juego.) | El VP elegido no aparece por su nombre en la alerta de crisis más dramática. | Leer el nombre desde `getVPById(vpId).name`. | S |
| **A-10** | 10 | **Medio** | `identity-ui.js:151-155`; `heritage-ui.js` (`.mandate-opt`) | En la pantalla de identidad, `Enter` y `Espacio` sobre una tarjeta VP con foco **no seleccionan** (antes y después: `vp-moreno`). Las 3 `.mandate-opt` no tienen `tabindex` ni `role`. `<div role=button onclick>` sin `keydown`. | Un alumno que usa teclado o lector de pantalla **no puede elegir VP ni tipo de mandato**. | `keydown` Enter/Espacio → click; `tabindex=0` + `role=radio`/`aria-pressed` en mandatos. | S |
| **A-11** | 10 | **Bajo** | `index.html:5` | `maximum-scale=1.0` bloquea el pellizco para agrandar (WCAG 1.4.4). Cero `aria-live` y un solo `role=dialog`. | Baja visión en celular no puede ampliar; los avisos (`showNotif`) no se anuncian. | Sacar `maximum-scale`; `aria-live=polite` en notificaciones; `role=dialog`/foco al abrir en los demás modales. | S |
| **A-12** | 10 | **Bajo** | CSS overlays | 8 botones de overlays cerrados (`ea-confirm-btn`, `rc-confirm-btn`, `btn-em-grant`, `tut-next-btn`, …) están a `opacity:0`/`pointer-events:none` pero **siguen en el orden de Tab**. | El teclado cae en botones invisibles («Entendido — Tomar Decisiones»). | `visibility:hidden` (o `inert`) cuando el overlay no está `.open`. | S |

## 2. Riesgos plausibles (sin reproducir en vivo)

| ID | Eje | Sev. | Archivo:línea | Qué se ve en el código | Cómo confirmarlo |
|---|---|---|---|---|---|
| P-01 | 1,2 | Medio | `main.js:1053-1065` vs `425-437` | `_resumeTurnAfterMidterm` (evento del turno 24) **no** aplica `preEffects`, no marca `lastSpecialEventTurn` y no muestra la alerta: si sale un evento extremo/grave justo ese turno, el golpe inmediato se pierde y el cartel «crisis gravísima» no aparece. | Forzar `pickNextEvent` a devolver un `isExtreme` en el turno 24 (stub) y mirar `G.indicadores`. |
| P-02 | 6 | Bajo | `settings.js:41` | `{...DEFAULTS, ...JSON.parse(raw)}` no valida campo por campo. Medido: `volume:'abc'` y `fontScale:7` quedan guardados crudos; `soundOn:'false'` (string) queda truthy; un JSON string de 4 caracteres agrega 4 claves basura. **No crashea** (medido: 0 errores, 0 banner). | — |
| P-03 | 6 | Bajo | `main.js:186-188` | `initErrorBanner()` es lo primero **dentro de `DOMContentLoaded`**, pero después de evaluar ~42 módulos. Un error en la evaluación de un módulo (o un 503 como en A-04) no pasa por el banner. Checklist §6.1: «primera línea de verdad». | Hacer que `index.html` cargue un `<script>` inline/clásico mínimo con el banner antes del `type=module`. |
| P-04 | 11 | Bajo | red | Carga inicial medida: **1,6 MB sin comprimir, 55 pedidos, 42 módulos en cascada** (`minister-commentary.js` 228 kB y `events.js` 182 kB al arrancar, aunque se usan recién al decidir). Con gzip de Pages serían ~350 kB. Sin `modulepreload`. En wifi escolar pobre, la cascada de 42 módulos domina. | Lighthouse con throttling; medir TTI en 3G lento. |
| P-05 | 10 | Bajo | `index.html`/CSS | A 140 % en 375 px no hay desborde horizontal en ninguna pantalla (medido). Pero la barra superior de la partida corta «SALIR» en el borde derecho (scroll horizontal sin pista) y el modal ministerial usa `overflow:hidden` con el texto largo pegado al borde inferior. | Mirar capturas en tablet real; verificar scroll interno del texto del ministro. |
| P-06 | 4 | Bajo | `identity-ui.js:34-67`, `crisis-auto.js`, `events.js` | Sugerencias de nombres/partidos: 28 políticos reales de la región (Milei, Chávez, Bukele, Petro, Allende, Evo…) y 22 partidos reales (PSUV, La Libertad Avanza, PT, MORENA, Peronismo…). Hay mezcla de signos, pero **fijar a figuras vivas y partidos en un juego de aula** invita a que el alumno juegue «como X» y los compañeros lean la partida en clave partidaria. Además el texto asume **Argentina** (33 menciones a Argentina/BCRA/MERCOSUR en `events.js`; «los bonos argentinos», «18 provincias» en `crisis-auto.js`) aunque el país es genérico. | Decisión del docente. |
| P-07 | 5 | Bajo | `state.js:140-182` | Salir y continuar re-sortea el evento del turno (no hay semilla ni evento guardado): se puede «repetir» un turno hasta que salga un evento fácil. | Guardar `currentEvent.id` en el save. |
| P-08 | 9 | Bajo | `main.js` | `window.__debug.forceEvent` empuja `{id, triggerAtTurn}` pero `pickNextEvent` lee `eventId`: no fuerza nada. `news-engine.js:42-55` duplica los umbrales de `CONFIG.THRESHOLDS`. `startGame` y `confirmHeritage` repiten el flujo de herencia→gabinete→dificultad. Fallback con error de concordancia: «Los próximas decisiones» (`news-engine.js`, noticia inaugural genérica). | — |

## 3. Mejoras de diseño opcionales (balance)

Todas las cifras son de **partidas completas simuladas con el motor real**, N entre 1500 y 3000 por celda,
herencia y mandato al azar. «Greedy» = elige la opción que deja mejor `getScore` tras aplicarla (un solo paso,
sin mirar nada más): es lo que haría un alumno que lee y compara.

| Dificultad | Estrategia | Gana | Puntaje de los que ganan | Oro / Plata / Bronce |
|---|---|---|---|---|
| Fácil | al azar | **100 %** | 71,7 | **72 %** / 27 % / 1 % |
| Fácil | greedy | 100 % | 84,5 | 100 % oro |
| Normal | al azar | 87 % (11 % pierde) | 56,7 | 23 / 56 / 10 |
| Normal | greedy | 100 % | 78,1 | **94 % oro** |
| Normal | «suma de lo bueno» (sin leer) | 100 % | 80,0 | — |
| Difícil | al azar | **10,7 %** | 47,5 | 0 / 9 / 4 |
| Difícil | greedy | 100 % | 63,2 | 42 / 58 / 0 |
| Difícil | «suma de lo bueno» | 100 % | 68,5 | — |
| Ultra | al azar | **0 %** (muere en el turno ~6,7) | — | — |
| Ultra | greedy | 49 % | 51,5 | 0 / 49 / 0 |
| Ultra | solo confianza−pobreza | 69,3 % | 50,5 | — |

Lo que dicen los números:

- **D-01 · La dificultad separa bien al que no lee del que lee, pero no al que lee poco.** Normal y Difícil
  se ganan al **100 %** con una regla aritmética que no requiere pensar (sumar los efectos buenos). Fácil
  regala el **oro** al 72 % de los que clican al azar. El diploma depende solo del puntaje (`getDiploma`),
  no de la dificultad. *Propuesta:* diploma con tope por dificultad o puntos ponderados; subir un poco Fácil
  (hoy ×0,7 y sin inercia) o bajar el oro (65 → 70) en Fácil.
- **D-02 · No hay herencia ni gabinete dominante** (Difícil, greedy: todos 100 %; Normal, azar: ministros entre
  82,7 % y 90,7 %, herencias 73 % (Crisis) a 94,7 % (Ortodoxa)). La **herencia ortodoxa** rinde más puntaje
  que la populista en las tres dificultades; es contenido ideológico: conviene que el docente lo sepa.
  **El tipo de mandato casi no mueve nada** (86,3 / 87,9 / 87,0 %): una elección que parece importante y no lo es.
- **D-03 · Eventos.** 130 eventos, ids sin duplicar, 4 cadenas (`7,8,10,2`) todas válidas, 0 repeticiones por
  partida. En Fácil los 9 extremos (`114-122`) **nunca** salen (a propósito: `EXTREME_PROB.easy = 0`). Las
  anclas 28/36/40 salen en el **92-95 %** de las partidas Fáciles (¡son fijas!); en Ultra 36 y 40 nunca salen
  porque se muere antes. En Ultra se juegan **7,3 eventos por partida** con azar y la mayoría son crisis
  automáticas: el contenido de 130 eventos casi no se ve. *Propuesta:* revisar el umbral de crisis (2 turnos) y
  el multiplicador 2,2 en Ultra.
- **D-04 · Espirales.** No encontré estado sin salida real: con `greedy` Ultra gana 49 %, y todas las muertes
  son por pobreza (153) y no por confianza (0). El umbral de pobreza 70 % + inercia 2,0 es la causa: una
  Ultra «Herencia de Crisis» ya empieza con pobreza ~63 (35+18+10). Es difícil, no imposible; está bien
  como modo «reto», pero la ayuda (A-08) debería decirlo.
- **D-05 · Economía.** No hay moneda que se acabe: el juego no tiene recurso gastable, solo 8 indicadores.
  Cierra.
- **D-06 · «Riesgo ético».** El badge ⚠️ marca las 11 opciones corruptas en la propia tarjeta: es un
  **spoiler del dilema moral**. Pedagógicamente se puede defender, pero hay que decidirlo.

## 4. Lo que está bien (con evidencia)

- **Camino de entrada completo y sin sorpresas.** Guardado limpio → 48 turnos con el motor y la UI reales
  hasta la pantalla final: sin errores de página, sin banner, `heap 5,8 MB` y 1.812 nodos DOM al final (sin
  fuga apreciable). La validación de identidad avisa qué falta («Por favor, ingresá el nombre…»).
- **Sin terceros** en el juego: 0 pedidos a otros orígenes en una partida entera.
- **Audio**: todo pasa por `master` (`audio.js:28,47,71,97`); el mute y el volumen cero se respetan en los 11 sonidos.
- **Reducir animaciones** es real: `body.reduce-motion` anula todas las animaciones y transiciones.
- **Letra al 140 % en 375 px**: 0 desbordes horizontales en 7 pantallas (medido). Opciones y alto contraste
  persisten y sobreviven a recargas.
- **SW (después de dos visitas)**: 55 entradas, el juego se juega sin servidor en el turno 1 incluso con la
  caché HTTP apagada.
- **Contenido**: 0 placeholders sin resolver (`{P}`, `{Par}`, `{VP}`, `{VPt}` en las 7 secciones de `news.js`,
  y `{VP}` solo donde corresponde); glosario sin HTML anidado en las 130 descripciones y escapa `<>&`.
- **Eventos bien armados**: ids únicos, cadenas válidas, ministros equilibrados (no hay uno dominante),
  `npm test` 43/43.
- Ningún error de consola salvo los 404 de A-07.

## 5. Top 5 a arreglar primero

1. **A-02 · Resalte del asesor** (S): una línea, impacto directo en una de las ayudas más usadas, regresión del
   último arreglo.
2. **A-01 · Multiplicadores de dificultad al cargar** (S): cambia la dificultad en silencio al recargar.
3. **A-03 · Salir/Continuar re-aplica inercia y efectos** (M): exploit y bug real en aula.
4. **A-04 · Precache del SW** (M): la promesa «offline» es falsa en la primera visita y la pantalla queda muerta.
5. **A-05 · `innerHTML` con el nombre del alumno** (M): self-XSS persistente en el save y en el «compartir».

## 6. Orden sugerido por tandas

- **Tanda 1 (motor, S/M):** A-02, A-01, A-03, A-07, A-09. Un test rojo-antes/verde-después por cada uno
  (en `tests/`; A-02 y A-07 sin navegador, A-01 y A-03 con `node:vm`/jsdom o exportando `aplicarDificultad`).
  Después **volver a correr `sim.mjs`** para confirmar que el balance no cambió.
- **Tanda 2 (robustez, M):** A-06 (validar guardado), A-05 (escapar), P-03 (banner de verdad primero), P-02
  (ajustes campo por campo), P-01 (turno 24), P-07 (evento en el save).
- **Tanda 3 (PWA, M):** A-04 con sello de caché y test «todo lo precacheado existe».
- **Tanda 4 (accesibilidad, S):** A-10, A-11, A-12, tamaños de toque ≥44 px y letra <11 px en las tarjetas de
  asesores (33 textos de 9,3–10,9 px; 6 botones de 36 px de alto), A-08.
- **Tanda 5 (diseño, decisión del docente):** D-01 a D-06 y P-06.

## 7. Lo que NO pude verificar, y por qué

- **Tabletas y celulares reales, Safari/WebKit.** Todo en Chromium de escritorio (emulación móvil 375×812).
  iOS Safari no tiene `navigator.vibrate` ni se comporta igual con el SW.
- **Tooltips con tap en tablet** (hover+tap): no los recorrí. Solo mido que los 24 botones ⓘ del gabinete tienen
  `aria-label` (0 sin etiqueta).
- **Foco, orden de tabulación completo y lector de pantalla real** (NVDA/VoiceOver): solo medí lo estático y el
  teclado sobre la pantalla de identidad.
- **Asesores y renuncias en las simulaciones** de balance: quedan fuera del modelo; el resto del motor sí es el real.
- **A-02 hasta el final de la cadena** (cuánto cambia la credibilidad real del asesor): medí el resalte, no el
  efecto acumulado en una partida jugada.
- **P-01** solo por lectura de código; **P-04** sin throttling de red; **P-05** sin tablet real.
- **Producción en GitHub Pages/Vercel** (encabezados de caché, gzip): solo servidor local sin compresión.
- **`herramientas/` y `vendor/html2canvas.min.js`**: no auditado el contenido del vendor.

## M-09 · (bajo) Terceros fuera del juego pero dentro del sitio publicado

`herramientas/preview-avatars.html:7,245,272` pide **Google Fonts y api.dicebear.com** (el test
`sin-terceros` excluye `herramientas/` a propósito). No se enlaza desde el juego, pero si el repo se publica
entero, la URL existe y quien la abra le cuenta a esos terceros qué mira. *Propuesta:* sacarla del sitio
publicado o dejarla fuera del despliegue.

---

# Resultado de las tandas (mismo día)

Todo con test que falla con el código viejo y pasa con el nuevo, y verificado en Chromium real.
`npm test`: **43 → 135 tests, 0 fallan.** Caché del service worker `sdr-v38` → `sdr-v42`, sellada.

| ID | Estado | Cómo se comprobó |
|---|---|---|
| A-01 multiplicadores al cargar | ✅ | `setG` los recupera de `difficulty`; recarga real con partida Ultra: [1,5 / 2,2] |
| A-02 resalte del asesor | ✅ | 60/60 coincidencias (antes 23/60) |
| A-03 Salir/Continuar re-cobra | ✅ | `startedTurn` en el guardado; 3 recargas seguidas dejan idénticos indicadores, evento y efectos; 6 puntos de una partida |
| A-04 offline con una visita | ✅ | `install` precachea 101 archivos; 1 visita + sin red + caché HTTP apagada → juega, 0 fallos |
| A-05 XSS por el nombre | ✅ | se limpia al escribir y al cargar; nombre `<img onerror>` → «Ana»; `__xss` ya no se ejecuta |
| A-06 guardado dañado | ✅ | `validarGuardado` + 2.000 mutaciones al azar sin una excepción; botón oculto y guardado descartado |
| A-07 `undefined.jpg` | ✅ | 0 respuestas 404 en una partida completa |
| A-08 ayudas vs umbrales | ✅ | un solo origen (`umbralesDeDerrota`); manual y tooltips lo citan por dificultad |
| A-09 nombre del VP | ✅ | `nombreCortoVP` desde la lista real |
| A-10/11/12 accesibilidad | ✅ | Enter/Espacio en VP, herencia y mandato; `aria-live`; zoom permitido; 0 botones invisibles en Tab (80 Tab reales) |
| Tamaños | ✅ | ningún texto < 11,5 px; botones ≥ 44 px; la barra no se corta a 140 % en 375 px |
| P-01 turno 24 | ✅ | `registrarEventoEspecial` compartido |
| P-02 ajustes | ✅ | campo por campo + respeta `prefers-reduced-motion` si no hay nada guardado |
| P-03 banner primero | ✅ | script clásico antes de los módulos; `main.js` 503 y módulo que lanza → banner |
| P-04 carga | 📝 | medido: 7,0 s a 2 Mbps / 150 ms **sin gzip** (limitado por ancho de banda, no por la cascada); con gzip de Pages ≈ un tercio, y con el SW la 2.ª carga es instantánea. Sin cambios |
| P-07 evento re-sorteado | ✅ | el evento viaja en el guardado |
| P-08 duplicados | ✅ | `getZone` único, `startGame` sin código muerto, `forceEvent`, texto |
| P-09 modales apilados | ✅ | la reunión de urgencia no se abre sobre otro modal |
| D-01 diploma por dificultad | ✅ | oro al azar en Fácil **72 % → 7 %**; tasas de victoria sin cambios (misma simulación) |
| D-06 badge «Riesgo ético» | ✅ | sacado; la consecuencia ética sigue después de decidir |
| P-06 nombres reales | ✅ parcial | sugerencias ficticias. **Textos con Argentina: pendiente de decisión (ver abajo)** |
| M-09 herramienta de avatares | ✅ | `noindex` + aviso rojo de que pide recursos a terceros |
| también | ✅ | `localStorage` sin `try` en 3 sitios (uno a nivel de módulo: tiraba `main.js` entero) |

## Pendiente de decisión

- **País neutro.** Los textos nombran Argentina y su realidad en ~230 sitios, con datos reales (INDEC, INVAP,
  «Argentina posee el 22 % del litio», la hiperinflación de 1989, Malvinas, Casa Rosada…). Cambiar «Argentina» por
  «el país» en un dato real lo vuelve falso para un país genérico. Opciones: (a) declarar que el país **es** Argentina
  (coherente con los datos), o (b) reescribir ~230 pasajes a mano.
- **D-02 (el tipo de mandato casi no mueve nada, ±1,6 % de victorias):** es un rediseño de mecánica; no lo toqué.
- **D-03/D-04:** el diseño de Ultra (7 eventos por partida al azar) es una decisión de dificultad, no un bug.
