# Portfolio project context

Personal portfolio of Nakulan T (AI Engineer, Chennai). Live root site: https://nakulant.github.io/portfolio/.
Current design lives on branch `sculpture`, which is not yet merged or deployed.

## Design (owner's direction: one attractive theme, no multi-page / POV "street" navigation)
- **One normal scrolling page**, light and editorial:
  - Colours: warm paper `#f3efe7`, ink `#141414`, a single cobalt accent `#2f4bff`.
  - Fonts: Instrument Serif (display), Inter Tight (body), JetBrains Mono (labels).
- **One 3D element** (`src/sculpture.js`): a liquid chrome/iridescent blob.
  - It sits in a fixed canvas on the right of the viewport; on screens under 900px it sits behind the hero only.
  - Vertex noise is added to `MeshPhysicalMaterial` via `onBeforeCompile`. Normals are rebuilt from two neighbouring displaced points.
  - Its palette comes from a baked studio environment: a dark room with cobalt, orange, pink and white panels.
  - **The camera never moves.** Each `<section data-mood="…">` sets target noise amp/freq/spin (`MOODS`), so the sculpture "breathes" differently per section.
  - The pointer tilts it, and it swells when the cursor is near.
- Content comes from `src/data.js`; layout and markup are in `src/App.jsx`; all CSS is in `src/styles.css`.

## Performance rules (the owner has complained about lag before)
- DPR is capped at 1.5, with adaptive step-down when frames exceed 21ms.
- Rendering stops when the tab is hidden or the canvas is off-screen.
- No `backdrop-filter` over the WebGL canvas. It forces a re-blur every frame.
- No React StrictMode (it would double-create the WebGL context).

## Content rules (from the owner)
- Solution-first: problem, then what was built, then tools. No client names, and never the word "client".
- Real figures only: ~30 FPS, 4 Grafana dashboards, 98% (LBW), 93.59% cattle. Never invent metrics.
- Profile photo is plain, with no effects on it.

## Commands
`npm run dev` / `npm run build` / `npm run deploy`. Deploy replaces the live site, so only run it after the owner approves.
`vite.config.js` `base` = `VITE_BASE` or `/portfolio/`.

## Branches
- `main`: the live site.
- `hermes-theme`, `rl-portfolio`, `multi-mode`: older experiments.
- `archive/five-worlds`: the full 3D five-worlds version with Bit, the guide character. The owner rejected it as over-hyped and too POV, but it was kept for possible future use.
- `sculpture`: current.
