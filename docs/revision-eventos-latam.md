# Revisión de los 130 eventos para Latinoamérica

Hecha el 2026-10-17 sobre el banco original. Es una **marca automática por palabras clave**, no una lectura evento por evento: sirve para decidir por dónde empezar, no para decidir sola.

- **Argentino de fondo:** 23 eventos. Mencionan hechos, instituciones o debates que son de un país concreto. Candidatos a reescribir o reemplazar.
- **Regional con un rasgo local:** 14 eventos. Temas de varios países con un detalle que conviene revisar.
- **Sin marca:** 93 eventos. Genéricos para esta revisión.

Los eventos de la lista que además se reescribieron a mano para Latinoamérica (por ejemplo Malvinas, el litio, el corralito) ya no nombran al país, pero conservan la trama. Esta tabla mira la trama.

## Argentino de fondo

| id | evento | marcas |
|---|---|---|
| 2 | Huelga General Docente | índices CER/UVA; paritarias |
| 3 | Presión Extrema sobre el Tipo de Cambio | cepo cambiario |
| 5 | Escándalo de Sobreprecios en Obra Pública | lawfare |
| 6 | La Peor Sequía en 50 Años | retenciones al agro |
| 24 | Cosecha Récord: El Campo No Liquida | retenciones al agro; «el campo no liquida» |
| 27 | Oleada de Femicidios: El País Dice Basta | femicidios / «Ni Una Menos» |
| 29 | Emergencia en los Barrios Populares | conurbano |
| 30 | Colapso del Mercado de Alquileres | índices CER/UVA; ley de alquileres |
| 48 | Toma Masiva de Tierras en el Conurbano | conurbano |
| 50 | Escasez de Alimentos Básicos en las Góndolas | programa Precios Justos |
| 53 | Recorte al INCAA: ¿Hay Futuro para el Cine Nacional? | instituto de cine |
| 58 | El Tren Bala Buenos Aires-Rosario-Córdoba | tren de alta velocidad entre 3 ciudades |
| 66 | El País Ganó el Mundial: ¿Negocio o Identidad? | Mundial de fútbol |
| 67 | El INDEC Bajo Sospecha: ¿Inflación Real o Manipulada? | índices CER/UVA; organismo de estadística bajo sospecha |
| 75 | Brecha Salarial de Género: El Informe que Sacudió al País | paritarias |
| 80 | Malvinas: La Ofensiva Diplomática en el Comité de Descolonización | Malvinas |
| 85 | Lawfare y Justicia: El Debate que Divide | lawfare |
| 88 | El Futuro Nuclear: ¿Ampliar la Capacidad Atómica? | centrales nucleares nombradas |
| 91 | Sitios de Memoria: ¿Qué Hacemos con el Pasado? | memoria de la última dictadura |
| 95 | El Acceso a la Vivienda en Crisis Extrema | índices CER/UVA; ley de alquileres |
| 99 | Argentina como Sede del Mundial Sub-20 | Mundial de fútbol |
| 100 | El Gran Acuerdo: ¿Pacto de Gobernabilidad o Rendición? | coparticipación federal |
| 120 | Accidente Nuclear en Atucha: Nivel 5 | centrales nucleares nombradas |

## Regional con un rasgo local

| id | evento | marcas |
|---|---|---|
| 4 | Epidemia de Dengue Sin Precedentes | dengue |
| 11 | Megaoferta por el Litio de la Puna | litio (varios países andinos); pueblos originarios |
| 46 | Propuesta de Unión Monetaria del MERCOSUR | bloque regional |
| 51 | Vacuna Nacional Contra el Dengue: ¿Producción Propia? | dengue |
| 68 | Prohibir el Glifosato: ¿Producción o Salud? | agroquímicos |
| 74 | El Acuífero Guaraní bajo Presión Internacional | Acuífero Guaraní (4 países); pueblos originarios |
| 79 | Lenguas Originarias: La Batalla Cultural en las Aulas | pueblos originarios |
| 81 | Pesca Ilegal en el Atlántico Sur: Flotas en el Límite | bloque regional |
| 93 | Litio: El Triángulo del Futuro bajo Presión | litio (varios países andinos) |
| 97 | Migración Regional: ¿Integración o Cierre de Fronteras? | bloque regional |
| 122 | Triple Catástrofe Climática Simultánea | bloque regional |
| 123 | La Corte Suprema Anula la Ley Central del Gobierno | Corte Suprema |
| 124 | El Éxodo: 1,5 Millones de Refugiados en la Frontera | bloque regional |
| 129 | El Poder Judicial Paraliza al Gobierno | Corte Suprema |

## Cómo seguir

1. Leer los eventos de «Argentino de fondo» uno por uno y decidir: reescribir la trama para la región, reemplazarlo por un evento nuevo de `js/data/events-latam.js`, o dejarlo si el tema es universal.
2. Cada evento reescrito o reemplazado tiene que seguir cumpliendo `tests/decisiones-reales.test.js` y `tests/ministros-dicen-la-verdad.test.js`.
3. Para el primer país concreto (México o Colombia), repetir esta revisión con sus propios marcadores.
