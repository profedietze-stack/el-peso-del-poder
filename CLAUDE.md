# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**El Peso del Poder** — PWA educational game (political-economy simulator). No bundler, no build step. Pure ES Modules served statically via GitHub Pages + Vercel auto-deploy.

## Running locally

Any static file server works:
```
npx serve .
python -m http.server 8000
```
Opening `index.html` directly as `file://` will fail (ES module CORS). Cache version is in `sw.js` line 1 (`const CACHE = 'sdr-vXX'`); bump it on every deploy that changes CSS or JS so old service workers are evicted.

## Architecture

### Turn loop (js/main.js)
All game flow lives in `main.js`. The cycle is:

```
_startTurn()
  → pickNextEvent(G)          # engine/state.js
  → renderEvent(event, G)     # ui/event.js — rebuilds option buttons
  → onOptionSelected(cb)      # registers callback

    [player taps option]
  → _handleDecision()
      → disableOptions()
      → showMinisterModal()    # ui/minister-modal.js

        [player taps "Entendido"]
      → _applyDecision()
          → applyEffects()     # engine/scoring.js
          → openModal()        # ui/modals.js

            [player taps "Continuar"]
          → _advanceTurn()
              → G.turn++
              → setTimeout(_startTurn, 300)   ← NO enableOptions() here
```

**Critical invariant**: `enableOptions()` must NOT be called in `_advanceTurn()`. `renderEvent()` in `_startTurn()` always rebuilds option buttons via `innerHTML` replacement — they start enabled. Calling `enableOptions()` before `_startTurn` runs would re-enable the *old* buttons during the 300ms delay, causing double-fire if the player taps quickly.

### Global state (js/engine/state.js)
Single mutable object `G` exported as a live ES module binding. Use `setG(newState)` to replace it — never reassign `G` directly in other modules. Key fields:
- `G.indicadores` — 8 economic indicators (0-100 each)
- `G.turn` — current turn (1-48)
- `G.usedEventIds` — `Set<number>`, serialized as array in localStorage
- `G.activeEffects` — persistent effects array
- `G.pendingCrises`, `G.pendingChainEvents` — priority queues consumed in `pickNextEvent()`
- `G.ministers`, `G.effectMods` — cabinet selection + precomputed modifier map

### Indicators
8 indicators defined in `js/config.js → IND_META`. Two directions:
- **High is bad** (`BAD_KEYS`): `ipc`, `deuda`, `riesgo`, `pobreza`, `desocupacion`
- **Low is bad**: `reservas`, `produccion`, `confianza`

Defeat triggers: `confianza` ≤ threshold OR `pobreza` ≥ threshold. Thresholds vary by difficulty (see `CONFIG.DEFEAT_CONFIANZA_*` / `CONFIG.DEFEAT_POBREZA_*`).

### Difficulty system
Four levels: `easy | normal | hard | ultra`. Two asymmetric multipliers:
- `CONFIG.EFFECT_MULTIPLIER` — amplifies effects that **improve** an indicator
- `CONFIG.EFFECT_MULTIPLIER_BAD` — amplifies effects that **worsen** an indicator

Ultra: good decisions are less powerful (×1.5), bad decisions are more catastrophic (×2.2). Set in `newState()` and mutate `CONFIG` directly (intentional — single source of truth for `applyEffects()`).

Inertia (`js/engine/effects.js → applyInertia`) runs at turn start (from turn 2). Intensity: `easy=0`, `ultra=2.0`. Circle-virtuous thresholds are higher in ultra.

### Event selection (js/engine/state.js → pickNextEvent)
Priority order:
1. `pendingChainEvents` with `triggerAtTurn <= turn`
2. Anchor events (guaranteed to appear in their turn range)
3. Extreme events (random, probability by difficulty, cooldown enforced)
4. Severe events (random, probability by difficulty)
5. Weighted random from unused normal pool (weights from TAG_INDICATOR_MAP)
6. Fallback: reuse already-seen events

### Module layout
```
js/
  main.js          — entry point, turn loop, window.* bindings
  config.js        — CONFIG, IND_META, DIFFICULTY_START_BONUS
  audio.js         — Web Audio API wrapper
  engine/
    state.js       — G, setG, newState, pickNextEvent, pushHistory
    scoring.js     — applyEffects, checkDefeat, getScore, computeReelection
    effects.js     — applyInertia (INERTIA_RULES), applyActiveEffects, addActiveEffect
    storage.js     — localStorage/sessionStorage with fallback (keys: sdr_save, sdr_global)
  data/            — static data arrays (events, ministers, vp, heritage, achievements…)
  features/        — self-contained feature modules (advisors, resignations, crisis-auto, midterm…)
  ui/              — DOM renderers (event.js, dashboard.js, modals.js, screens.js…)
```

### Option callback pattern
`js/ui/event.js` holds `let _onOptionSelected = null`. The click handler nulls it before calling to prevent double-fire on fast double-taps:
```js
const cb = _onOptionSelected;
_onOptionSelected = null;   // must null BEFORE calling cb
cb(idx, option);
```

### Mobile GPU fix (css/main.css)
`@media (max-width: 600px)` block near the end removes `backdrop-filter` from all overlays and sticky bars (`min-header`, `min-footer`). Adreno/Mali GPUs from 2015-2019 artifact under backdrop-filter. When adding new overlays with `backdrop-filter`, add the class to this block and provide a solid-background fallback.

## File writing constraint

**NEVER use PowerShell `Set-Content` on files that contain emojis.** Use Python binary writes instead:
```python
with open('file.js', 'w', encoding='utf-8') as f:
    f.write(content)
```
PowerShell Set-Content silently corrupts emoji characters.

## Storage keys
- `sdr_save` — active game state (localStorage, fallback sessionStorage)
- `sdr_global` — cumulative stats across all games
- `sdr_v12_tutorial_seen` — tutorial flag

## Debugging

### Error reporter (always active)
`window.onerror` and `unhandledrejection` handlers in `main.js` capture every uncaught error with a full state snapshot. Look for the `[SDR ERROR REPORT]` group in the browser console — it includes the message, stack trace, and a JSON snapshot of `G` at crash time (turn, difficulty, indicadores, active event).

### Debug toolkit (opt-in)
Activate by adding `?debug=1` to the URL, or:
```js
localStorage.setItem('sdr_debug', '1'); location.reload();
```
All tools are on `window.__debug`:

| Command | Effect |
|---------|--------|
| `__debug.state()` | Returns live `G` object |
| `__debug.setIndicator('pobreza', 85)` | Sets one indicator and re-renders dashboard |
| `__debug.setAllIndicators({confianza:5})` | Sets multiple indicators at once |
| `__debug.setTurn(40)` | Jumps to turn 40 and starts it |
| `__debug.forceEvent(28)` | Prepends event id 28 to `pendingChainEvents` and starts turn |
| `__debug.listEvents('crisis')` | `console.table` of events matching the filter string |
| `__debug.exportState()` | Copies full `G` JSON to clipboard |
| `__debug.skipToEnd()` | Sets turn to 48 and calls `_advanceTurn()` |
| `__debug.autoPlay(n, strategy)` | Simulates n turns; strategy: `'random'`\|`'first'`\|`'last'`\|`'worst'` |

Keyboard shortcuts (debug mode only): `Ctrl+Shift+D` logs state, `Ctrl+Shift+E` exports, `Ctrl+Shift+A` auto-plays 1 turn.

`autoPlay` clicks DOM `.option-btn` elements directly — it works through the same code path as a real player tap and respects all guards (null-before-call, disableOptions, etc.).

## Deployment
Push to `master` → GitHub Pages auto-updates → Vercel auto-deploys. After any JS/CSS change, bump `const CACHE = 'sdr-vXX'` in `sw.js` so the service worker evicts the old cache on next visit.
