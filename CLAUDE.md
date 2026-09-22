# Portfolio project context

Personal portfolio of Nakulan T (AI Engineer, Chennai). Live root site: https://nakulant.github.io/portfolio/.
This is the **worlds** rebuild on branch `worlds`. It is not yet merged to `main` or deployed. Read this before changing anything.

## The big idea
The whole site is one full-screen 3D scene. There is no page scroll. Wheel, arrow keys, swipes or the
chapter rail move the visitor one **stop** at a time (16 stops: hello, stats, principles, 9 work items,
projects, stack, timeline, contact). The camera flies to that stop's spot in the current **world**.
- **Five worlds** (`src/worlds.js` → `WORLDS`): each has its own 3D geometry, camera path, panel object,
  typography, numbering system and narrator voice. Switching worlds changes far more than a theme.
- **Bit, the being** (`src/engine/being.js`): one persistent character across all worlds. Only its costume changes:
  - neural: orbiting bit ring
  - arcade: pixel crown and square eyes
  - zen: fox ears and a paper lantern
  - olympus: gold laurel
  - cosmos: helmet and a moon

  Bit floats beside the panel, looks at the pointer, blinks, waves at the first and last stops and moves its mouth while its speech bubble types.
- **Discoverability of worlds** (the owner asked for this explicitly), handled in four places:
  - First visit opens the **Gate** (`Gate` in `src/ui/Chrome.jsx`). It offers five tiles, each styled in its world.
  - The labelled **Dial** is always visible at the top, with a pulsing hint until the visitor switches once.
  - Bit nudges toward another world at stops 3, 8 and 13 until the visitor switches (`lineFor` in `worlds.js`).
  - The contact stop has "Same story, another world" buttons.

  Keys 1–5 also switch worlds, and `?world=zen` deep-links (and skips the gate).

## Files
- `src/engine/Engine.js`
  - One `WebGLRenderer` plus camera.
  - `setWorld(id)` disposes the old world group and builds a new one.
  - `go(i)` moves to a stop, `setGate(open)` toggles the overview camera, and `snap()` jumps straight to the destination (used by screenshot tests).
  - Bit is rendered in a **second scene after `clearDepth()`**, with its own studio lights, so no planet or pillar hides it and it looks the same everywhere.
  - `BEING_NDC` places Bit per world on the side opposite that world's panel.
- `src/engine/worlds/*.js`: `buildX(T, {root, scene, count})` adds everything to `root`, sets `scene.background`/`fog`, and returns:
  - `stop(i)` → `{cam, look}`
  - `overview()` → the gate camera
  - `update(dt, t, {stop, gate, camera})`

  Cosmos planets orbit, so `stop(i)` is re-queried every frame.
- `src/engine/util.js`: seeded `rng`, gradient/glow textures, `disposeTree`, `damp`.
- `src/worlds.js`: `STOPS`, `WORLDS` and `VOICE`. `VOICE` holds, per world, the chapter titles, rail labels, work labels, numbering (ep_01 / LEVEL 1 / kanji / Greek numerals / NK-001) and Bit's lines. Content never lives here.
- `src/data.js`: all content (single source of truth).
- `src/ui/Panel.jsx`: the same semantic markup for every world (`.p-head`, `.work-row`, `.stat`…). Each world restyles it.
- `src/styles/base.css`: shared structure, dial, rail, bubble, gate, iris wipe, and the phone bottom sheet.
- `src/styles/worlds.css`: everything is scoped under `html[data-world='x']`. Keyframes are prefixed per world (`nr-`, `game-`, `zen-`, `ol-`, `co-`).

  Each world turns the panel into a different object:
  - neural: terminal, left
  - arcade: CRT, bottom
  - zen: hanging scroll with a vertical title and hanko, right
  - olympus: marble tablet with meander bands, bottom
  - cosmos: tilted hologram with gauge rings, right

## Gotchas already hit. Don't reintroduce them
1. **Clamp `dt` to ≥ 0** in the render loop. The first rAF timestamp can precede the `performance.now()` taken in the constructor. A negative dt makes every exponential damp diverge, sending the camera and Bit to infinity (black screen).
2. No React `StrictMode` (`main.jsx`): double-mounted effects would create and dispose the WebGL engine twice.
3. Wheel handling: if the pointer is over a `.panel-body` that can still scroll in that direction, let it scroll. Otherwise step one stop, with an 800ms lock (trackpad inertia).
4. Pixel fonts (Press Start 2P) lack symbols like ☠ ★. Cinzel lacks Greek letters. Keep decorative text in glyphs the font actually has.
5. Olympus washes out easily: marble plus fog plus additive light shafts. Keep env/hemisphere intensity low.

## Testing
Headless Chrome via CDP with swiftshader (scripts lived in the session scratchpad: `probe.mjs`, `wtour.mjs`).
Swiftshader runs at a few FPS, so call `window.__engine.snap()` (exposed in dev only) before screenshots, or frames show mid-flight.

## Stack and commands
- React 18 + Vite 5, plain CSS, Three.js (static import, ~260KB gzip total). GitHub Pages via `gh-pages`.
- `npm run dev` / `npm run build` / `npm run deploy`. **Don't** run deploy from an unmerged branch. It replaces the live site.
- `vite.config.js`: `base` is the `VITE_BASE` env var, or `/portfolio/`.

## Content rules (from the owner)
- Solution-first tone: problem, then what was built, then tools.
- No client/customer names, and never the word "client".
- Real figures only: ~30 FPS, 4 Grafana dashboards, 98% (LBW), 93.59% (+3.5%) cattle. Never invent metrics.
- Profile photo: plain, no scan/slide/hover effects on it.

## Profile facts
- Grootan Technologies, AI Engineer, Apr 2025 – Present. iGrads Labs, ML Intern, Jan 2024 – Mar 2025.
- B.Tech AI & Data Science, Nandha Engineering College, 2021–2025, CGPA 7.9.
- AWS Certified Machine Learning Engineer – Associate.
- Links: GitHub NakulanT, LinkedIn nakulant, LeetCode u/nakulant, email nakulan.thirukumar@gmail.com.

## Branch history
`main` (live) → `hermes-theme` → `rl-portfolio` → `multi-mode` (4 separate DOM sites, rejected as "just colour/font/model changes") → `worlds` (this one).
