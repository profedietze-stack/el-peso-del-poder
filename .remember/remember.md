# Handoff

## State
Game "El Peso del Poder" at `C:\Users\nicod\Documents\JuegosEducativos\El Peso del Poder\`. Latest: `sw.js` sdr-v36. Two major bugs fixed: (1) dark screen Android - `css/main.css` scoped `.tutorial-overlay` to `.tut-full-dark`; (2) decision buttons freeze ~35 events - NaN seed from string crisis IDs fixed in `js/features/news-engine.js`. Error banner at `js/ui/error-banner.js` initialized first line in `js/main.js`.

## Next
- Await user confirmation sdr-v36 resolves freeze on device.
- User plans to add error-banner to other games (CellQuest, Cazador, Revolucionarios, Choque) - not asked yet.

## Context
- Caveman mode full. Python binary writes for emoji files (never PowerShell Set-Content).
- Folder renamed from `Sillon_Rivadavia_v12` this session - update any cached paths.
- Bump CACHE in sw.js on every JS/CSS deploy.
- Repo: https://github.com/profedietze-stack/el-peso-del-poder