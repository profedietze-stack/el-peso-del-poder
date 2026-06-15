# El Peso del Poder

**Simulador de Economia Politica** · Juego educativo de navegador para el aula

[![Jugar ahora](https://img.shields.io/badge/jugar%20ahora-online-brightgreen?style=for-the-badge)](https://el-peso-del-poder.vercel.app)
[![PWA](https://img.shields.io/badge/PWA-instalable-blue?style=for-the-badge)](#instalacion-como-app)

> Creado por **ProfeD.** para el aula de Ciencias Sociales y Economia · v12

---

## Que es?

*El Peso del Poder* pone al jugador en el sillon presidencial de un pais latinoamericano ficticio. Durante **48 turnos** (equivalentes a un mandato de 4 anos) debe tomar decisiones de politica economica y social, gestionar crisis, armar su gabinete y sobrevivir la presion de los indicadores.

No hay respuestas correctas: cada decision tiene consecuencias encadenadas, y la economia tiene inercia propia.

---

## Mecanicas principales

### Indicadores economicos

8 variables en tiempo real, cada una entre 0 y 100:

| Indicador | Direccion | Descripcion |
|-----------|-----------|-------------|
| Confianza | Alta es buena | Apoyo ciudadano · derrota si cae demasiado |
| Pobreza | Baja es buena | Condicion social critica · derrota si sube demasiado |
| Inflacion (IPC) | Baja es buena | Corroe el poder adquisitivo |
| Deuda | Baja es buena | Sostenibilidad fiscal |
| Riesgo Pais | Baja es buena | Percepcion de los mercados |
| Desocupacion | Baja es buena | Empleo |
| Produccion | Alta es buena | Actividad economica |
| Reservas | Alta es buena | Margen de maniobra del Estado |

### Eventos y decisiones

Cada turno presenta un evento (politico, economico, social o internacional) con **2-4 opciones**. Un ministro comenta la decision antes de aplicar los efectos. Los eventos tienen:

- **Encadenamiento**: algunas decisiones desbloquean eventos futuros
- **Eventos ancla**: 3 eventos garantizados en rangos de turno fijos (crisis cambiaria, elecciones de medio termino, presion de deuda)
- **Eventos extremos y severos**: aparecen con probabilidad creciente segun la dificultad y el estado de los indicadores

### Inercia economica

A partir del turno 2, el motor aplica **14 reglas de inercia** al inicio de cada turno: espirales negativas (inflacion que alimenta pobreza) y circulos virtuosos (produccion que mejora empleo). La intensidad varia por dificultad.

### Gabinete de ministros

Antes de empezar, el jugador elige ministros para cada area. Cada ministro tiene **modificadores por indicador** que amplifican o amortiguan los efectos de las decisiones en su dominio.

### Vicepresidente

Aporta bonificaciones pasivas desde el inicio del mandato.

### Asesores

Panel disponible durante el juego: brindan analisis contextual de los indicadores y recomendaciones estrategicas.

### Crisis automaticas

El modulo de crisis puede disparar emergencias si ciertos indicadores cruzan umbrales criticos, independientemente del evento del turno.

### Elecciones de medio termino

En el turno 24 se evalua el desempeno con consecuencias sobre los eventos disponibles en la segunda mitad del mandato.

### Renuncias de ministros

Si el rendimiento del area a cargo de un ministro es muy malo, este puede renunciar y forzar un reemplazo.

---

## Niveles de dificultad

| Nivel | Efectos buenos | Efectos malos | Inercia | Derrota por confianza |
|-------|---------------|--------------|---------|----------------------|
| Facil | x1.0 | x1.0 | x0 | menor a 5 |
| Normal | x1.0 | x1.2 | x0.6 | menor a 10 |
| Dificil | x0.9 | x1.5 | x1.0 | menor a 15 |
| Ultra | x0.75 (mejoras) · x1.5 (logros) | x2.2 | x2.0 | menor a 20 |

En **Ultra**, los errores son mucho mas costosos que los aciertos son rentables: asimetria real, no solo numeros mas altos.

---

## Pantalla final

Al terminar el mandato el juego muestra:

- **Puntaje de gestion** (0-100) con diploma Oro / Plata / Bronce
- **Resultado electoral** estimado (reeleccion o derrota, con margen)
- **Factores positivos y negativos** que determinaron el resultado
- **Logros desbloqueados** durante la partida
- **Stickers** segun el desempeno
- Estadisticas historicas acumuladas entre partidas

---

## Tecnologia

- **Sin bundler, sin dependencias de produccion**: ES Modules nativos del navegador
- **PWA instalable**: `manifest.json` + Service Worker con cache offline
- **Fuentes**: Barlow, Barlow Condensed, Playfair Display (Google Fonts)
- **Audio**: Web Audio API (sin archivos externos)
- **Almacenamiento**: `localStorage` con fallback a `sessionStorage`

### Estructura del proyecto

```
├── index.html              # Shell de la app
├── manifest.json           # Configuracion PWA
├── sw.js                   # Service Worker — cache offline
├── css/
│   └── main.css            # Estilos completos
└── js/
    ├── main.js             # Entry point — bucle de turnos completo
    ├── config.js           # Constantes, umbrales, multiplicadores de dificultad
    ├── audio.js            # Motor de audio (Web Audio API)
    ├── engine/
    │   ├── state.js        # Estado global G, seleccion de eventos
    │   ├── scoring.js      # Efectos, puntaje, reeleccion, derrota
    │   ├── effects.js      # Inercia economica, efectos persistentes
    │   └── storage.js      # Persistencia localStorage / sessionStorage
    ├── data/
    │   ├── events.js       # Biblioteca de eventos (mas de 100 escenarios)
    │   ├── ministers.js    # Ministros disponibles y sus modificadores
    │   ├── vicepresident.js
    │   ├── heritage.js     # Herencias del gobierno anterior
    │   ├── achievements.js # Sistema de logros
    │   ├── news.js         # Titulares de noticias dinamicas
    │   ├── minister-commentary.js
    │   ├── stickers.js
    │   ├── quotes.js
    │   └── glossary.js
    ├── features/
    │   ├── advisors.js     # Panel de asesores
    │   ├── crisis-auto.js  # Crisis automaticas por umbral
    │   ├── difficulty.js   # Pantalla de seleccion de dificultad
    │   ├── midterm.js      # Elecciones de medio termino
    │   ├── news-engine.js  # Generador de noticias dinamicas
    │   ├── resignations.js # Sistema de renuncias de ministros
    │   └── tutorial.js     # Tutorial interactivo
    └── ui/
        ├── event.js        # Renderizado de eventos y opciones
        ├── dashboard.js    # Panel de indicadores
        ├── endscreen.js    # Pantalla de resultados finales
        ├── modals.js       # Modales de feedback post-decision
        ├── minister-modal.js
        ├── ministers-ui.js
        ├── screens.js      # Navegacion entre pantallas
        ├── splash.js       # Pantalla de carga
        ├── tooltip.js      # Glosario interactivo en tooltips
        ├── trophies-ui.js  # Logros y stickers
        └── news-ui.js      # Ticker de noticias
```

---

## Correr localmente

Cualquier servidor estatico sirve (ES Modules requieren HTTP, no `file://`):

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Abrir `http://localhost:8000` en el navegador.

---

## Instalacion como app

El juego es una **PWA instalable** en Android, iOS y escritorio:

- **Android / Chrome**: menu → *Instalar app*
- **iOS / Safari**: compartir → *Agregar a pantalla de inicio*
- **Desktop / Chrome o Edge**: icono de instalacion en la barra de direccion

Una vez instalado funciona **sin conexion** gracias al Service Worker.

---

## Deploy

El repositorio se despliega automaticamente en **Vercel** al hacer push a `master`. Tambien disponible via **GitHub Pages**.

Al modificar archivos CSS o JS, incrementar la version del cache en `sw.js` linea 1:

```js
const CACHE = 'sdr-v21';  // incrementar en cada deploy con cambios de JS/CSS
```

---

## Uso en el aula

Disenado para secundaria y nivel universitario en materias de:

- Economia y Administracion
- Ciencias Politicas
- Historia economica contemporanea
- Educacion Civica

**Sugerencias de uso:**

- Partida individual con reflexion escrita sobre las decisiones tomadas
- Partida grupal con debate entre turnos
- Comparacion de resultados entre distintas estrategias de gobierno
- Analisis de los indicadores como introduccion a la macroeconomia

---

## Licencia

Uso educativo libre y gratuito. Creado por **ProfeD.** · 2025
