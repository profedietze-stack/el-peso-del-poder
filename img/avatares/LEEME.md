# Caras del gabinete

Los dieciséis SVG de esta carpeta —doce ministros y cuatro vicepresidentes— se
generaron una sola vez con [DiceBear](https://www.dicebear.com), colección
**Avataaars**, de Pablo Stanley, bajo licencia **CC BY 4.0**.

Están acá y no se piden a la API en cada partida por dos motivos. Los que abren
el juego son menores: `api.dicebear.com` no se enteraba de que alguien jugó, se
enteraba de qué ministro tenía en pantalla y cuándo. Y sin internet el gabinete
se quedaba sin caras.

`respaldo.svg` es la silueta que se muestra si alguno no carga. También es local:
un respaldo que necesita red no cubre el caso que tiene que cubrir.

## Cómo regenerar uno

La receta es la URL de la API con estos parámetros. La semilla es la que estaba
en el código de cada personaje (por ejemplo `Paz-Chicago-Fiscal-F9`), y el color
de fondo el de su cartera.

```
https://api.dicebear.com/9.x/avataaars/svg
  ?seed=<semilla>
  &backgroundColor=<color>
  &clothing[]=blazerAndShirt&clothing[]=blazerAndSweater&clothing[]=collarAndSweater
  &mouth[]=default&mouth[]=smile&mouth[]=serious&mouth[]=twinkle&mouth[]=concerned&mouth[]=sad
  &eyes[]=default&eyes[]=happy&eyes[]=squint&eyes[]=wink&eyes[]=side&eyes[]=closed
  &eyebrows[]=default&eyebrows[]=defaultNatural&eyebrows[]=raisedExcited
  &eyebrows[]=raisedExcitedNatural&eyebrows[]=flatNatural
  &accessoriesProbability=35
  &accessories[]=kurt&accessories[]=prescription01&accessories[]=prescription02
  &facialHairProbability=30
  &facialHair[]=beardLight&facialHair[]=beardMedium&facialHair[]=beardMajestic
  &facialHair[]=moustacheFancy&facialHair[]=moustacheMagnum
  &top[]=...   (la lista de pelo, según el personaje)
```

**Cuidado con `facialHairProbability`.** Para los personajes sin barba hay que
**reemplazar** el valor, no agregar otro al final: mandarlo dos veces hace que la
API conteste `400 querystring/facialHairProbability must be integer`. Así estaban
dos de las cuatro vicepresidentas, y nunca se notó porque el respaldo dibujaba
algo igual.
