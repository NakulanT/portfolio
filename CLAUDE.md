# Portfolio project context

Personal portfolio of Nakulan T (AI Engineer, Chennai). Live at https://nakulant.github.io/portfolio/. Read this before changing anything.

## Stack and commands
- React 18 + Vite 5, plain CSS (no UI library). Deployed to GitHub Pages with `gh-pages`.
- `npm run dev` (local), `npm run build` (to `dist/`), `npm run deploy` (build + publish `dist/` to the `gh-pages` branch).
- `vite.config.js` sets `base: '/portfolio/'`, which must match the repo name. Asset paths in `index.html` use `/portfolio/`.
- Source is on `main`; `gh-pages` holds only build output. Never edit `gh-pages` by hand.

## Structure
```
src/data.js                 ALL content: profile, links, stats, work cards, principles, stack, timeline, projects
src/App.jsx                 theme toggle (dark/light, saved in localStorage), scroll reveal, cursor glow
src/components/Sections.jsx nav, hero, marquee, stats, work, approach, stack, journey, projects, contact, footer
src/components/Art.jsx      hand-drawn SVG illustrations for each Work card + icons
src/styles.css              design tokens (CSS variables) and layout
src/assets/profile.jpg      hero portrait (cropped from a larger photo)
```
To add a profile link (Medium, Kaggle, Hugging Face, X), add an entry to `links` in `src/data.js`; add an icon case in `Icon` in `Art.jsx` if it needs one.

## Design decisions
- Concept: an AI engineer who also designs, so the site itself is the design proof. Minimalist, dark by default, one lime accent (violet in light mode).
- Fonts: Bricolage Grotesque (headings), Inter (body), JetBrains Mono (labels), loaded from Google Fonts.
- Work section is a uniform **3x3 grid of nine cards**. Every illustration is drawn in a **320x200 SVG (16:10)** so cards match. Keep card copy similar in length so rows stay equal height. Tablet: two columns, the last card spans the row. Phone: one column.
- Illustrations are original SVG, no screenshots and no stock images. They use CSS variables so they follow the theme. Keep them simple; the user rejected busy ones.
- Cursor glow and card spotlight use `--glow` and `--spot`; light mode needs stronger values to be visible.

## Content rules (from the owner)
- Solution-first tone: each card says the problem, then what was built, then the tools.
- Do NOT name clients or customers (no Avonya, Migros, Nouvobanq, KOBIL, LegacyLink, etc.). Do not use the word "client".
- Do NOT mention ticket counts, "four weeks", or specific HR-admin scoping for the employee engagement app; keep that card general.
- Real figures only: ~30 FPS, 4 Grafana dashboards, 98% (LBW), 93.59% (+3.5%) cattle. Do not invent metrics.
- Do not put the phone number or the resume PDF on the site. Email is shown deliberately; the old EmailJS contact form was removed.
- Strands Agents is used for the dance app and the tracking assistant; LangChain for the medical RAG application.
- Cards that describe old projects (cattle, LBW) draw facts from the GitHub READMEs of NakulanT/Cattle-behaviour-analysis and NakulanT/2D-DRS.

## Profile facts
- Grootan Technologies, AI Engineer, Apr 2025 - Present. iGrads Labs, ML Intern, Jan 2024 - Mar 2025 (no location).
- B.Tech AI & Data Science, Nandha Engineering College, 2021-2025, CGPA 7.9.
- AWS Certified Machine Learning Engineer - Associate, issued Sep 2026, valid to Sep 2029.
- Links: GitHub NakulanT, LinkedIn nakulant, LeetCode u/nakulant, email nakulan.thirukumar@gmail.com.

## How to work here
- Check changes visually (build, then screenshot desktop, light theme and phone widths) before saying it is done.
- Small, targeted edits; the owner reviews screenshots and gives precise feedback.
- The original large photo `0T2A1254.JPG` is gitignored and must never be committed (15MB).
