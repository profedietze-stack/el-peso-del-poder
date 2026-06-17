# Handoff

## State
Juego completo y publicado en https://el-peso-del-poder.vercel.app (master = 0b74258, sdr-v23).
Esta sesion: README.md para GitHub, debug toolkit (?debug=1 / window.__debug), error reporter siempre activo, fix SW cacheaba imagenes cross-origin (opaque responses), fallback de 3 niveles para imagenes (Unsplash → DiceBear → data URI SVG local).

## Next
No hay trabajo pendiente. Monitorear si estudiantes siguen reportando problemas de imagenes — si persiste, considerar precargar imagenes al instalar el SW en lugar de lazy.

## Context
- NUNCA usar PowerShell Set-Content en archivos con emojis — siempre Python con open(..., encoding='utf-8').
- Bump CACHE en sw.js en cada deploy que cambie JS/CSS.
- Debug: agregar ?debug=1 a la URL o localStorage.setItem('sdr_debug','1').
- Repo: https://github.com/profedietze-stack/el-peso-del-poder
