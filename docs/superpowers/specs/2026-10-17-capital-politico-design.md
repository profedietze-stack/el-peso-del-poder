# Capital político — el tipo de mandato pasa a importar

## Por qué
Hoy elegir «Victoria amplia / ajustada / coalición» casi no cambia la partida (±1,6 % de victorias
medido con 2.500 partidas por estrategia). El alumno elige sin consecuencias, y gobernar con
mayoría o sin ella es justo lo que el juego debería enseñar.

## Qué se agrega
Un recurso nuevo, **capital político** (0–100), que el mandato fija al empezar y que las decisiones
gastan o devuelven.

- **Costo de una opción** = `max(0, −efecto en confianza)` (una opción que baja la confianza 8 cuesta 8).
  Se deriva de los datos: no hace falta etiquetar las 426 opciones (129 bajan la confianza, 295 la suben).
- **Ganancia**: una opción que sube la confianza devuelve `ceil(efecto / 4)` (sube 8 → +2).
- **Recuperación natural**: +3 por turno (+2 en Amplio).
- **Bloqueo**: si el capital no alcanza, la opción aparece con 🔒 «El Congreso no lo aprueba: faltan N de
  capital». **Nunca se bloquea la opción de menor costo** de un evento, para que no haya callejones sin salida.

## Qué hace cada mandato
| Mandato | Capital inicial | Rasgo |
|---|---|---|
| Amplio | 80 | Luna de miel: pierde 10 de capital cada 8 turnos (desgaste); recupera 2 por turno |
| Ajustado | 40 | Arranca débil, pero lo que gana vale ×1,5 |
| Coalición | 60 | Cada ~10 turnos el socio pide un favor (evento): aceptar cuesta 15; rechazar rompe la alianza (tope de capital 70 y recuperación −1 por el resto del mandato) |

El modificador actual de confianza inicial y la penalidad de reelección por mandato se mantienen.

## Qué se muestra
- Una barra «🏛️ Capital político» junto a los indicadores, con tooltip que explica costo, bloqueo y rasgo.
- En cada opción, el costo o la ganancia («🏛️ −8» / «🏛️ +2»).
- En el informe final: capital promedio y cuántas veces el Congreso bloqueó una opción.
- Manual: sección nueva. Con país Latinoamérica el texto es genérico («el Congreso»).

## Objetivos
1. Que el mandato elegido cambie la partida: diferencia de victorias Amplio vs Ajustado ≥ 8 puntos
   con la estrategia «greedy» (hoy ±1,6).
2. Que el balance general no se mueva: tasas de victoria por dificultad dentro de ±3 puntos de las
   actuales (Fácil al azar 100 %, Normal al azar 88 %, Difícil al azar ~13 %, Ultra 0 %).
3. Que nunca haya un evento sin opción elegible.

## No objetivos / anti-objetivos
- No se tocan los efectos de las decisiones sobre los ocho indicadores.
- No se etiqueta cada opción a mano.
- Que el capital no se vuelva un segundo juego: un alumno que lo ignora no debe perder por eso.

## Cómo se prueba
- Tests puros del motor: costo/ganancia, bloqueo, opción libre siempre disponible, desgaste, coalición.
- Test sobre los 426 opciones: ningún evento queda sin opción elegible con capital 0.
- Simulación completa con el motor real (random, greedy, worst, survivor, sumgood) × 3 mandatos × 4
  dificultades, antes y después. Los parámetros (80/60/40, regen 3, ganancia /4, ×1,5, −10 cada 8, −15)
  son un punto de partida: se ajustan midiendo hasta cumplir los objetivos.
- Guardado: el capital entra al guardado con validación campo por campo; partidas viejas arrancan
  con el capital inicial de su mandato.
- Chromium real: jugar hasta ver un bloqueo y la barra.

## Decisiones mías (a confirmar)
- Fórmulas de costo y ganancia derivadas de «confianza» (la señal más cercana a «impopular»).
- Coalición con evento de socio: es la pieza más grande; si pesa mucho se entrega en una segunda tanda.
- Todos los números arriba son provisorios hasta medir.

## Orden de entrega (acordado con el docente)
1. **Primera tanda:** la mecánica con la fórmula derivada de confianza, más un campo opcional
   `capital` por opción que, si existe, pisa la fórmula (sin usarlo todavía).
2. **Segunda tanda:** elegir juntos 5–10 decisiones cuyo costo político no coincide con su efecto en
   confianza (ajuste fiscal, reforma laboral, concesiones a la oposición), ponerles `capital`, medir de
   nuevo y ajustar. Un test comprueba que ninguna deje un evento sin opción elegible.
Motivo: medir primero la mecánica sola; así se sabe qué movió cada cosa.

## Cambios al diseño tras medir (2026-10-17)
Medido con 1.000–1.500 partidas por celda sobre el motor real:

1. **Se descartó el bloqueo de opciones.** Con bloqueo, Normal al azar pasaba de ~90 % a 100 % y Difícil al
   azar de 14 % a 60–80 %: las opciones de grandes cambios son también las que más pueden hundir un
   indicador, así que el Congreso protegía al que decide mal. Y a un jugador competente (greedy) casi no lo
   tocaba: hay otras opciones casi igual de buenas. Ver el comentario de `js/engine/capital.js`.
2. **Ahora el capital cambia la FUERZA del gobierno:** con menos de 40, lo que empeora un indicador duele
   hasta +6 % más; con más de 60, lo que lo mejora rinde hasta +9 % más.
3. **Costo:** popularidad (baja confianza X → −X) y ambición (suma de mejoras por encima de 12, 1 cada 3);
   ganancia: confianza X → +ceil(X/6), ×1,25 en Ajustado. Una medida desastrosa no cuesta (si no, protege).
4. **Números finales:** inicial amplio 80 / coalición 65 / ajustado 40, recuperación +1 por turno, sin desgaste.

Resultado (base = sin capital → con capital): Difícil al azar 14/12/13 → 13/11/12; Ultra greedy
48/46/48 → 56/46/48 (amplio/ajustado/coalición); Normal al azar 88/86/88 → 86/83/83.
Amplio se separa 8–10 puntos de los otros en Ultra; el balance general queda a ≤4 puntos.

## Pedido del socio de Coalición (hecho)
Turnos 10, 20, 30 y 40 (`js/features/coalicion.js`). Aceptar: −8 de capital, efectos chicos (confianza +2,
deuda +2). Rechazar: gratis, pero rompe la alianza (tope 45, sin recuperación) y baja confianza 6 / riesgo +5 /
producción −2. Medido en Ultra con greedy (Coalición): sin pedido 48 %, aceptando siempre 40 %, rechazando
siempre 45 %, al azar ~44 %: ninguna salida domina, que es lo que se busca. La primera versión (aceptar −15,
tope 70) dejaba rechazar como la opción gratis y dominante (49 % vs 40 %).

## Pendiente
- **Segunda tanda:** campo `capital` en 5–10 decisiones elegidas con el docente (el motor ya lo respeta).

## Segunda tanda: 12 decisiones con `capital` propio (hecha)
Aprobadas por el docente. Gastan: reforma tributaria progresiva (−12), reforma judicial (−12), igualdad
salarial (−8), ley de competencia (−6), ajuste completo del FMI (−20, la fórmula daba −30), gobernar en minoría
(−8), rechazar el Gran Acuerdo (−6). Devuelven: firmar el Gran Acuerdo (+10), acuerdo con la oposición mediana
(+6), consulta popular (+6), mesa de diálogo nacional (+5), aceptar el proyecto opositor (+3).
Medido con 2.500 partidas por celda (antes → después): Difícil al azar 13/11/12 → 12/10/11; Ultra greedy
57/46/45 → 59/47/43; Normal al azar 87/84/85 → 87/84/84. Dentro del ruido (±2). `tests/capital-decisiones.test.js`
fija la lista: falla con los datos viejos y verifica que ninguna otra opción traiga `capital`.
