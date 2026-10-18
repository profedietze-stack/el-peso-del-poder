# Modos México, Colombia y Chile — diseño

Fecha: 2026-10-18. Estado: **para aprobar** (nada construido todavía).

## Por qué

El juego se publica en Argentina y se abrió al resto del mundo hispano con «Latinoamérica» (un país imaginario). Eso evita errores de hecho, pero un alumno de Bogotá o de Santiago no ve *su* Banco Central ni *su* capital, y el juego le dice «cuatro años» aunque en su país el mandato dure seis. Estos tres modos le dan un país reconocible sin meter política real al aula.

## Qué se pidió (palabras del usuario)

- Modos México, Colombia y Chile.
- Instituciones y lugares reales, **sin personas ni partidos**.
- En los tres países **no hay segundo mandato**.
- «Cada turno representa un mes de mandato»: la cantidad de turnos tiene que respetar los meses que gobierna cada presidente.
- Eventos propios de cada país: **ninguno al inicio**. Los 18 regionales valen para los tres.
- Argentina y Latinoamérica **no se tocan**.

## Metas, no-metas y antimetas

**Metas**
1. Tres países nuevos en el selector de Ajustes, con bandera.
2. Cada partida dura lo que dura el mandato real: México 72 turnos (6 años), Colombia 48 (4), Chile 48 (4).
3. Los textos nombran las instituciones y los lugares reales de ese país.
4. Sin segundo mandato: la partida termina en el diploma.
5. Todo con la misma calidad de pruebas que el resto: barrido de prohibidos, balance medido, partida jugada de punta a punta en un navegador.

**No-metas**
- Eventos propios de cada país (segunda tanda).
- Portugués (Brasil) o inglés: proyecto aparte.
- Datos numéricos reales (inflación de México, pobreza de Chile): los indicadores siguen siendo los del juego.

**Antimetas (lo que lo haría fracasar aunque «ande»)**
- Nombrar un presidente, un partido o un candidato real. Un chico de 15 años lo lee en clase.
- Un hecho inexacto sobre un país real (una institución que no existe, un cargo mal puesto). Es peor que el texto genérico.
- Romper Argentina o Latinoamérica: mismos 130/140 eventos, mismos 48 turnos, mismo balance.
- Que la partida de México sea injugable por larga o por desequilibrada.

## Cómo funciona (idea central)

Un país nuevo es **Latinoamérica + una capa de nombres + unas reglas**:

```
datos originales (Argentina)
   └─ capa Latinoamérica (ya existe: textos genéricos, 18 eventos, «tú»)
        └─ capa país (nueva): «Banco Nacional» → «Banco de México», «la capital» → «Ciudad de México»…
```

Cada país es una entrada de `PAISES` con dos partes: los **textos** (tabla de reemplazos) y las **reglas** (números).

```js
mx: {
  id: 'mx', nombre: 'México', bandera: '🇲🇽', base: 'latam',
  reglas: { turnos: 72, medioTermino: 36, segundoMandato: false },
  terminos: [ ...reemplazos genéricos → reales... ],
}
```

`ar` y `latam` quedan como están (`base: null`, `turnos: 48`, `segundoMandato: true` para `ar` y `latam`).

### Reglas por país (mis llamadas, a verificar)

| | Argentina | Latinoamérica | México | Colombia | Chile |
|---|---|---|---|---|---|
| Duración | 48 | 48 | **72** | 48 | 48 |
| Segundo mandato | sí | sí | no | no | no |
| Elección a medio mandato | turno 24 (legislativas) | 24 | **36** (legislativas intermedias) | 24 (elecciones locales y regionales) | 24 (municipales y regionales) |

El texto del aviso y del resultado de medio término cambia por país (`Congreso`/`gobernaciones y alcaldías`), porque en Colombia y Chile no hay legislativas a mitad de mandato.

## Lo que depende del número 48 (inventario hecho leyendo el código)

Hay que pasar todo esto a una sola fuente, `totalTurnos()`, que lee el país activo:

| Dónde | Qué hay |
|---|---|
| `js/config.js:4` | `TOTAL_TURNS: 48` (lo leen `main.js`, `dashboard.js`, el debug) |
| `js/engine/save-validation.js:38,247` | `TOTAL_TURNOS = 48` y el mensaje «entre 1 y 48» |
| `js/engine/state.js:55-59` | eventos ancla en turnos 10-18, 20-30, 35-45: se escalan por proporción |
| `js/main.js:399-430` | medio término en 22 (aviso) y 24 (resultado) |
| `js/features/coalicion.js` | `TURNOS_PEDIDO = [10,20,30,40]`: se escalan |
| `js/ui/screens.js:142` | marcadores «Año N» de la barra (`y*12/48`) |
| `js/ui/end-texto.js:51`, `endscreen.js:155`, `trophies-ui.js:311` | «de 48» en pantallas |
| `js/ui/tooltip.js:186`, manual en `index.html` | «4 años… 48 turnos» |
| `js/data/achievements.js:34,98,99` | «las 48 decisiones», `turn >= 48` |
| `js/engine/capital.js` | regeneración +1 por turno: con 72 turnos acumula 50 % más |

Tests y simulaciones (`sim7.mjs`, `sim8.mjs`) también asumen 48 y hay que parametrizarlos.

## Sin segundo mandato

Con `segundoMandato: false`:
- La diapositiva «elección» **no existe** (ya existe la lógica de ocultarla: `end-slides.js:24`). El final queda en 3 diapositivas: diploma, gestión, informe.
- No se calcula ni se muestra la reelección; no aparece el botón «Segundo mandato» ni la nota de la pantalla final.
- Los logros de reelección y segundo mandato (`achievements.js:203-233`) **no aparecen** en esos países, y los totales («X de Y logros») cuentan solo los que se pueden ganar.
- El manual, el tutorial y el tooltip de «Mandato» dicen «un solo mandato» en vez de «podés reelegirte».
- La diapositiva final puede decir una línea del país: «En México la ley no permite la reelección» (a verificar por país).

## Textos por país

Reemplazos de **instituciones y lugares**, no de personas ni partidos. Ejemplos de la forma (la tabla completa sale de recorrer los textos genéricos que deja la capa Latinoamérica):

| Genérico | México | Colombia | Chile |
|---|---|---|---|
| Banco Central | Banco de México | Banco de la República | Banco Central de Chile |
| organismo recaudador | SAT | DIAN | SII |
| Congreso | Congreso de la Unión | Congreso de la República | Congreso Nacional |
| Casa de Gobierno | Palacio Nacional | Casa de Nariño | La Moneda |
| la capital | Ciudad de México | Bogotá | Santiago |

**Regla de oro:** una pareja que no podemos afirmar con certeza **se deja genérica**. Mejor «el organismo de seguridad social» que un nombre equivocado.

`PROHIBIDOS` gana una lista por país: nombres de presidentes, expresidentes, partidos y candidatos, y los datos argentinos que ya prohíbe. El barrido recorre datos, literales del código y manual, como hoy.

## Partidas guardadas

Hoy el selector dice «tu partida queda guardada» al cambiar de país. Con 72 turnos eso se rompe (una partida de México en el turno 60 no es válida con 48). Mi propuesta:
- El guardado registra su `pais`.
- Si el país de Ajustes no coincide con el del guardado, al arrancar se ofrece «Continuar tu partida de México (cambia el país)» o «Empezar una nueva». Nunca se borra nada sin preguntar.

## Balance

- Colombia y Chile: 48 turnos con Latinoamérica como base. Se espera cero cambio; se mide igual.
- México: 72 turnos. Se corren las simulaciones (2.500 partidas por celda, tres mandatos, `hardRandom`, `ultraGreedy`, `normalRandom`). Meta: que cada celda quede **dentro de ±5 puntos** de Latinoamérica 48 (87/83/84 en `normalRandom`). Si no, se ajusta lo que escala con la duración (regeneración de capital, probabilidad de eventos graves) **antes** de tocar efectos de eventos.
- El pool de eventos alcanza: 107 normales en Latinoamérica contra unos 62 que se sortean en 72 turnos.
- Tiempo de clase: 72 decisiones son un 50 % más que 48. Es lo que se pidió; queda anotado para el docente.

## Qué queda a criterio de quien construya

- El orden de las capas de reemplazo y los casos borde de regex (ya hubo dos errores de orden en la capa Latinoamérica: tests de orden).
- Cómo escalar anclas y pedidos de coalición (por proporción redondeada, con un test que las deje dentro del mandato).
- Textos exactos de las líneas por país.

## Cómo se verifica (antes de decir «listo»)

1. `npm test` en verde y los tests nuevos fallan con el código viejo.
2. Barrido: ningún texto de MX/CO/CL contiene voseo, datos argentinos, ni presidentes/partidos/candidatos.
3. Argentina y Latinoamérica: mismo número de eventos (130 y 140), 48 turnos, mismas simulaciones.
4. Chromium: una partida **completa** de cada país hasta el diploma (72 turnos en México), sin errores de consola, con el audio silenciado y el título del juego comprobado.
5. Cambio de país con guardado en curso, en las dos direcciones.
6. Cache del service worker subido y sellado.

## Riesgos conocidos

- **Exactitud**: yo conozco estas instituciones, pero nadie del equipo es de esos países. Recomendación: una lectura por una persona de cada país antes de publicar (ya estaba en la hoja de ruta).
- **Sensibilidad**: los 18 eventos regionales tocan crimen organizado, minería ilegal y dictaduras. En México y Colombia el evento «archivos de una dictadura» no calza con la historia local; mi llamada es reescribirlo a «archivos de un período de violencia política» solo en esos dos, sin nombrar nada. Chile queda igual.
- **Tamaño del cambio**: tocar `TOTAL_TURNS` atraviesa media docena de módulos. Por eso el primer paso es la fuente única de duración, con Argentina verificada idéntica, y recién después los países.

## Orden de trabajo propuesto

1. Fuente única de duración y reglas por país (sin países nuevos): Argentina y Latinoamérica idénticas, probado.
2. Sin segundo mandato (regla `segundoMandato`), probado con un país de prueba.
3. Colombia y Chile (48 turnos): capa de nombres, prohibidos, tests.
4. México (72 turnos): capa de nombres, medición de balance, ajuste si hace falta.
5. Guardados, ajustes, manual, caché, partida completa de cada país en navegador.
