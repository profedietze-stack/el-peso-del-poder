# Modos México, Colombia y Chile — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tres países nuevos en el selector (México 72 turnos, Colombia 48, Chile 48), con instituciones y lugares reales, sin segundo mandato, sin tocar Argentina ni Latinoamérica.

**Architecture:** Cada país es Latinoamérica + una capa de nombres + un objeto `reglas` (turnos, medio término, segundo mandato). Al arrancar, `aplicarReglas(pais)` escribe esas reglas en `CONFIG` (mismo patrón que `aplicarDificultad`), y todo lo que hoy dice `48` lee de ahí.

**Tech Stack:** JS ES modules sin bundler, `node --test`, Chromium por Playwright (`../CellQuest/node_modules/playwright`).

**Spec:** `docs/superpowers/specs/2026-10-18-modos-mexico-colombia-chile-design.md`

## Global Constraints

- Argentina y Latinoamérica quedan idénticas: 130 y 140 eventos, 48 turnos, medio término en 24, segundo mandato permitido, y simulaciones sin cambio (`hardRandom` 13/10/11, `ultraGreedy` 58/45/42, `normalRandom` 87/83/84 en Latinoamérica; `ultraGreedy` 58/46/42 en Argentina).
- Turnos: México 72, Colombia 48, Chile 48. Medio término: México 36, Colombia 24, Chile 24. `segundoMandato: false` en los tres.
- Sin presidentes, expresidentes, partidos ni candidatos reales en ningún texto. Una pareja institución/lugar que no se pueda afirmar con certeza se deja genérica.
- Tuteo («tú») en los tres países, como Latinoamérica.
- Cada cambio de lo precacheado: subir `const CACHE` en `sw.js` y correr `node tests/sellar-cache.js`.
- Un test nuevo debe fallar con el código anterior (comprobarlo, sin `git stash`: escribir el test, correrlo antes de implementar).
- Probar en Chromium con el audio silenciado y comprobando `document.title`. Nada de credenciales en archivos.
- Comandos: `npm test` (todos los tests), `py -m http.server 8077` para el navegador.

## Review Focus

1. Partida guardada en México (turno 60) con el país de Ajustes cambiado a Colombia: no se marca «dañada», no se trunca ni se pierde en silencio.
2. Ancla o pedido de coalición que, al escalar, cae fuera del mandato (turno > total) o repite turno: nunca ocurre en 48 ni en 72.
3. Medio término en Colombia y Chile: el aviso y el resultado no dicen «legislativas» ni «Congreso renovado».
4. Logros: el perfil de logros es único entre países; sin reelección, los logros de reelección no cuentan en el total de ese país y no aparecen como «bloqueados para siempre».
5. México a 72 turnos: el pool de eventos no se agota (no hay repetición de ids salvo cadenas) en Fácil, Normal, Difícil y Ultra.

---

## File Structure

- `js/data/pais.js` (modifica): `PAISES` gana `base` y `reglas`; nueva `reglasDelPais(id)`.
- `js/engine/mandato.js` (crea): reglas de duración, lógica pura. `aplicarReglas`, `escalarTurno`, `totalTurnos`, `permiteSegundoMandato`, `turnoMedioTermino`.
- `js/data/pais-capas.js` (crea): tablas `TERMINOS_PAIS` y `PROHIBIDOS_PAIS` por país, más `aplicarCapaPais(id)`.
- `js/data/pais-datos.js` (modifica): `aplicarPais` encadena Latinoamérica + capa.
- `js/config.js` (modifica): `MEDIO_TERMINO`, `SEGUNDO_MANDATO` junto a `TOTAL_TURNS`.
- Consumidores del 48 (modifican): `state.js`, `main.js`, `coalicion.js`, `save-validation.js`, `screens.js`, `end-texto.js`, `endscreen.js`, `trophies-ui.js`, `tooltip.js`, `achievements.js`, `capital.js`, `index.html`.
- `settings-modal.js`, `settings.js` (modifican): selector de 5 países.
- Tests nuevos: `mandato.test.js`, `pais-capas.test.js`, `sin-segundo-mandato.test.js`, `guardado-pais.test.js`, `mexico-72.test.js`.

---

### Task 1: Reglas por país y fuente única de duración

**Files:**
- Create: `js/engine/mandato.js`, `tests/mandato.test.js`
- Modify: `js/config.js`, `js/data/pais.js`, `js/main.js` (arranque, junto a `aplicarPais`)

**Interfaces:**
- Produces: `PAISES[id].reglas = { turnos:number, medioTermino:number, segundoMandato:boolean }` para `ar` (48/24/true), `latam` (48/24/true), `mx` (72/36/false), `co` (48/24/false), `cl` (48/24/false); `PAISES[id].base` = `null` (ar) o `'latam'` (resto); `mx/co/cl` con `nombre` y `bandera` 🇲🇽 🇨🇴 🇨🇱.
- Produces en `mandato.js`: `aplicarReglas(id:string):void` (escribe `CONFIG.TOTAL_TURNS`, `CONFIG.MEDIO_TERMINO`, `CONFIG.SEGUNDO_MANDATO`), `escalarTurno(turnoEn48:number, total?:number):number` (`Math.round(turnoEn48 * total / 48)`, mínimo 1), `totalTurnos():number`, `permiteSegundoMandato():boolean`, `turnoMedioTermino():number`.

- [ ] **Step 1: Test `mandato.test.js`.** `aplicarReglas('mx')` deja `totalTurnos()===72`, `turnoMedioTermino()===36`, `permiteSegundoMandato()===false`. `aplicarReglas('ar')` y `'latam'` dejan 48/24/true. `escalarTurno(10,72)===15`, `escalarTurno(40,72)===60`, `escalarTurno(10,48)===10`. Un id desconocido cae en `ar`. Al terminar cada test, `aplicarReglas('ar')`.
- [ ] **Step 2: Correrlo y ver el rojo** — `node --test tests/mandato.test.js` → falla por módulo inexistente.
- [ ] **Step 3: Implementar** `mandato.js` y las reglas en `PAISES`; en `config.js` agregar `MEDIO_TERMINO: 24` y `SEGUNDO_MANDATO: true`. En `main.js`, llamar `aplicarReglas(ajustes.pais)` en el arranque **antes** de crear cualquier estado.
- [ ] **Step 4: Verde** — el test pasa y `npm test` sigue en 219+ verdes.
- [ ] **Step 5: Commit** — `git add js/engine/mandato.js js/config.js js/data/pais.js js/main.js tests/mandato.test.js`.

---

### Task 2: Todo el código lee la duración de la fuente única

**Files:**
- Modify: `js/engine/state.js:55-59`, `js/main.js:399-430,677`, `js/features/coalicion.js:18`, `js/engine/save-validation.js:38,246-247`, `js/ui/screens.js:142`, `js/ui/end-texto.js:51`, `js/ui/endscreen.js:155`, `js/ui/trophies-ui.js:311`, `js/ui/tooltip.js:186`, `js/data/achievements.js:34,98-99`, `js/engine/capital.js`, `index.html` (manual)
- Test: `tests/mandato.test.js` (se amplía)

**Interfaces:**
- Consumes: `totalTurnos`, `escalarTurno`, `turnoMedioTermino` (Task 1).
- Produces: `anclasDelMandato():{id,minTurn,maxTurn}[]` en `state.js` (las tres anclas de siempre con `escalarTurno` aplicado); `turnosDePedido():number[]` en `coalicion.js` (`[10,20,30,40]` escalados, reemplaza el uso directo de `TURNOS_PEDIDO`); `idsDeTextoDeDuracion`: ninguno, los textos se arman con `totalTurnos()` y `totalTurnos()/12` años.

- [ ] **Step 1: Tests.** (a) Con `aplicarReglas('ar')`: `anclasDelMandato()` es exactamente las de hoy (10-18, 20-30, 35-45) y `turnosDePedido()` es `[10,20,30,40]`. (b) Con `'mx'`: toda ancla cumple `1 <= minTurn < maxTurn <= 72`, y `turnosDePedido()` es `[15,30,45,60]`, estrictamente creciente y `<= 72`. (c) Con `'co'` igual que `ar`. (d) `save-validation`: una partida con `turn: 60` es válida con `'mx'` y «dañada» con `'ar'`, con el motivo «entre 1 y 72» / «entre 1 y 48» según el país. (e) Un test que lea los archivos listados y falle si encuentra un literal `48` fuera de comentarios (lista blanca: `events.js`, `minister-commentary.js`, `news.js`, que usan 48 con otro sentido).
- [ ] **Step 2: Rojo** — correr `node --test tests/mandato.test.js`.
- [ ] **Step 3: Implementar** `anclasDelMandato()` y `turnosDePedido()`; en `main.js` el aviso es `turnoMedioTermino()-2` y el resultado `turnoMedioTermino()`; `capital.js`: la regeneración queda igual (se mide en Task 6). Textos de UI: «de ${totalTurnos()}», «${totalTurnos()/12} años». En `index.html` y `tooltip.js`, los textos fijos «4 años / 48 turnos» pasan a placeholders rellenados al abrir (`data-duracion-anios`, `data-duracion-turnos`).
- [ ] **Step 4: Verde**, incluido el test (e) con la lista blanca.
- [ ] **Step 5: Commit.**

---

### Task 3: Sin segundo mandato

**Files:**
- Modify: `js/ui/end-slides.js:20-30`, `js/ui/endscreen.js:52,174-203`, `js/data/achievements.js:203-233`, `js/ui/trophies-ui.js` (conteo de logros), `index.html` (manual/tutorial), `js/ui/tooltip.js` (entrada «mandato»)
- Test: `tests/sin-segundo-mandato.test.js`

**Interfaces:**
- Consumes: `permiteSegundoMandato()`.
- Produces: `logrosVisibles():Achievement[]` en `achievements.js` (excluye los de reelección y segundo mandato si `!permiteSegundoMandato()`); `diapositivasVisibles(state)` ya existente, ahora sin `'eleccion'` si no se permite.

- [ ] **Step 1: Tests.** Con `'mx'` y un `state` ganador de primer mandato: `diapositivasVisibles(state)` es `['diploma','gestion','informe']`. Con `'ar'` sigue siendo las cuatro. `logrosVisibles()` con `'co'` no incluye ningún logro cuyo `id` pertenezca a los de reelección/segundo mandato (identificarlos por sus ids reales en `achievements.js:203-233`) y su largo es `ACHIEVEMENTS.length` menos esos. El HTML del botón «Segundo mandato» no se genera con `'cl'`.
- [ ] **Step 2: Rojo.**
- [ ] **Step 3: Implementar.** No calcular reelección cuando `!permiteSegundoMandato()`. La diapositiva final agrega la línea «En {país} la ley no permite la reelección inmediata» tomada de `PAISES[id].reglas.notaReeleccion` (texto por país; en `ar`/`latam` ausente).
- [ ] **Step 4: Verde.**
- [ ] **Step 5: Commit.**

---

### Task 4: Capa de nombres, estructura y Colombia/Chile

**Files:**
- Create: `js/data/pais-capas.js`, `tests/pais-capas.test.js`, `docs/terminos-genericos-latam.md`
- Modify: `js/data/pais-datos.js`, `js/data/pais.js` (`PROHIBIDOS` por país), `tests/pais.test.js`

**Interfaces:**
- Produces: `TERMINOS_PAIS: Record<'mx'|'co'|'cl', Array<[RegExp|string,string]>>`; `PROHIBIDOS_PAIS: Record<id, RegExp[]>` (presidentes, expresidentes, partidos y candidatos reales del país, más datos de los otros dos países); `aplicarCapaPais(id:string, datos:object):number` (cuántos textos cambió; no hace nada con `ar`/`latam`). `aplicarPais(id)` en `pais-datos.js` pasa a: Latinoamérica si `base==='latam'`, luego `aplicarCapaPais`.

- [ ] **Step 1: Inventario.** Script de scratchpad que corre `aplicarPais('latam')` y lista los sustantivos genéricos que dejó (`Banco Nacional`, `la capital`, `Casa de Gobierno`, `el puerto fluvial`, organismo recaudador, etc.) con cuántas veces aparece cada uno. Guardar el resultado en `docs/terminos-genericos-latam.md`: es la lista de trabajo.
- [ ] **Step 2: Tests `pais-capas.test.js`.** (a) Con `'co'`, el texto «Banco Nacional» pasa a «Banco de la República» y `'cl'` a «Banco Central de Chile»; (b) ningún texto de `co`/`cl` contiene voseo, datos argentinos ni nada de `PROHIBIDOS_PAIS[id]`; (c) `ar` y `latam` devuelven 0 cambios de la capa; (d) el barrido recorre datos, literales del código y el manual, con la misma técnica de `pais.test.js`; (e) **orden**: cada término de `TERMINOS_PAIS` que sea prefijo de otro va después (regla ya mordió dos veces). (f) Test de que el barrido encuentra algo: un texto sembrado con «Boric» en una copia de los datos de `cl` hace fallar `PROHIBIDOS_PAIS.cl`.
- [ ] **Step 3: Rojo**, luego implementar Colombia y Chile con las parejas de la tabla del spec (Banco de la República / DIAN / Congreso de la República / Casa de Nariño / Bogotá; Banco Central de Chile / SII / Congreso Nacional / La Moneda / Santiago) y las que salgan del inventario. Pareja dudosa → se deja genérica y se anota en el doc.
- [ ] **Step 4: Verde**, con Chromium: partida Colombia y Chile hasta el turno 12 sin hits de `PROHIBIDOS` ni errores de consola.
- [ ] **Step 5: Commit.**

---

### Task 5: Medio término y eventos regionales por país

**Files:**
- Modify: `js/features/midterm.js` (textos), `js/data/events-latam.js` (evento 212 por país), `js/data/pais-capas.js`
- Test: `tests/pais-capas.test.js`

**Interfaces:**
- Produces: `PAISES[id].reglas.medioTerminoTipo`: `'legislativas'` (ar, latam, mx) o `'locales'` (co, cl); `buildWarningEvent()` y el resultado leen ese tipo y usan «elecciones regionales y locales» / «gobernaciones y alcaldías» (co) y «municipales y regionales» (cl) sin «renovarán la mitad del Congreso». `FRASES_PAIS[mx|co]` reescribe el evento 212 («archivos de una dictadura») a «archivos de un período de violencia política»; Chile queda igual.

- [ ] **Step 1: Tests.** Con `'co'` y `'cl'`, el título, la descripción y el resultado del medio término no contienen «legislativ» ni «Congreso». Con `'mx'` sí «legislativas». El evento 212 en `mx`/`co` no contiene «dictadura»; en `cl` sí.
- [ ] **Step 2: Rojo, implementar, verde.**
- [ ] **Step 3: Commit.**

---

### Task 6: México — capa de nombres y balance a 72 turnos

**Files:**
- Modify: `js/data/pais-capas.js` (México), `js/engine/capital.js` (solo si la medición lo pide), simulaciones del scratchpad (`sim8.mjs`: variable `PAIS`)
- Create: `tests/mexico-72.test.js`
- Modify: `docs/superpowers/specs/2026-10-17-capital-politico-design.md` (mediciones)

**Interfaces:**
- Consumes: `aplicarReglas('mx')`, `anclasDelMandato`, `turnosDePedido`.
- Produces: capa `mx` (Banco de México, SAT, Congreso de la Unión, Palacio Nacional, Ciudad de México y las del inventario).

- [ ] **Step 1: Tests `mexico-72.test.js`.** (a) Con `'mx'`, 200 partidas simuladas por dificultad terminan o pierden sin lanzar error y ningún evento no encadenado se repite (Review Focus 5). (b) Las anclas, los pedidos de coalición y el medio término caen dentro de 1–72 y en orden. (c) Prohibidos de México (presidentes y partidos reales) no aparecen.
- [ ] **Step 2: Rojo, implementar la capa, verde.**
- [ ] **Step 3: Medir.** `PAIS=mx CONFIGS=... N=2500` sobre `hardRandom`, `ultraGreedy`, `normalRandom` × Amplio/Ajustado/Coalición, comparado con la línea base de Latinoamérica 48. **Criterio:** cada celda a ±5 puntos. Si no, ajustar primero lo que escala con la duración (regeneración de capital `REGEN` → `REGEN * 48/72`, probabilidad de eventos graves) y volver a medir; efectos de eventos no se tocan. Anotar la tabla en el spec de capital.
- [ ] **Step 4: Commit** con los números en el mensaje.

---

### Task 7: Guardados con país

**Files:**
- Modify: `js/engine/state.js` (campo `pais`), `js/engine/save-validation.js`, `js/main.js` (arranque), `js/ui/settings-modal.js` (texto), `js/engine/storage.js`
- Test: `tests/guardado-pais.test.js`

**Interfaces:**
- Produces: `state.pais:string`; `validarPartida(raw, paisActual)` devuelve `{estado:'otro-pais', paisGuardado}` cuando `raw.pais` existe y difiere de `paisActual`. Un guardado viejo sin `pais` se toma como `'ar'` o `'latam'` según los ajustes de ese momento (el mismo valor de `ajustes.pais` si es uno de los dos, `'ar'` si no).

- [ ] **Step 1: Tests.** Guardado de `mx` turno 60 con el país `co`: `estado==='otro-pais'`, el guardado sigue intacto en `localStorage` y no se borra. Guardado sin campo `pais`: se acepta. Dos casos más de ida y vuelta: `ar → latam → ar` conserva el guardado.
- [ ] **Step 2: Rojo, implementar.** Al arrancar con `otro-pais`, mostrar «Tu partida es de {país}. ¿Continuar ahí (cambia el país) o empezar una nueva?» Continuar fija el país y recarga; empezar una nueva **pregunta de nuevo** antes de descartar. El hint del selector deja de prometer que la partida se guarda en cualquier país.
- [ ] **Step 3: Verde. Commit.**

---

### Task 8: Selector, manual, caché y partida completa en el navegador

**Files:**
- Modify: `js/ui/settings-modal.js:49-55`, `js/engine/settings.js`, `index.html`, `sw.js` (`CACHE`), `docs/revision-eventos-latam.md`, memoria del proyecto
- Test: `tests/ajustes.test.js`

- [ ] **Step 1: Test.** `sanearAjustes` acepta `mx`, `co`, `cl` y rechaza `xx`; el selector renderiza cinco botones con sus banderas, y `data-sin-pais` sigue en la fila.
- [ ] **Step 2: Rojo, implementar, verde.** Subir `CACHE` y `node tests/sellar-cache.js`; `npm test` completo.
- [ ] **Step 3: Chromium, una partida completa por país** (México 72 turnos, Colombia y Chile 48) hasta el diploma, audio silenciado, `document.title` correcto, sin errores de consola. Comprobar: sin segundo mandato, tres diapositivas, medio término en el turno correcto, año/mes de la barra, nota de reelección. Y Argentina y Latinoamérica en 48 con el segundo mandato disponible.
- [ ] **Step 4: Documentar** en `docs/revision-eventos-latam.md` los pares dejados genéricos y pedir la lectura por una persona de cada país; actualizar la memoria del proyecto.
- [ ] **Step 5: Commit. No hacer push sin preguntar.**

---

## Self-Review

- **Cobertura del spec:** reglas por país (T1), inventario del 48 (T2), sin segundo mandato (T3), capas de nombres y prohibidos (T4, T6), medio término y evento 212 (T5), balance (T6), guardados (T7), selector, caché, partida completa (T8). Eventos propios de cada país: fuera de alcance, como en el spec.
- **Consistencia de nombres:** `aplicarReglas`, `escalarTurno`, `totalTurnos`, `permiteSegundoMandato`, `turnoMedioTermino` definidos en T1 y usados igual en T2–T7.
- **Orden de dependencias:** T1 → T2 → T3 son secuenciales; T4 puede ir en paralelo con T2/T3 (otros archivos); T5 depende de T1 y T4; T6 de T2, T4 y T5; T7 de T1; T8 al final.
