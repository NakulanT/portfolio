# Nakulan T · Portfolio

Personal portfolio of an AI engineer who also designs. Built with React and Vite, deployed to GitHub Pages at https://nakulant.github.io/portfolio.

## Run it

```bash
npm install
npm run dev        # local dev server with hot reload
npm run build      # production build into dist/
npm run deploy     # build and publish dist/ to the gh-pages branch
```

## Edit the content

Everything you would normally change lives in **`src/data.js`**:

- `links`: social and contact links. Add Medium, Kaggle, Hugging Face or X here and they appear in the hero and contact section (add a matching icon in `src/components/Art.jsx` if needed).
- `stats`, `work`, `principles`, `stack`, `timeline`, `projects`: the text of each section.

Design tokens (colours, fonts, spacing) are CSS variables at the top of `src/styles.css`. Dark is the default; the toggle in the nav switches to light and remembers the choice.

## Structure

```
src/
  data.js                 all site content
  App.jsx                 theme toggle, scroll reveal, cursor glow
  components/Sections.jsx nav, hero, work, approach, stack, journey, projects, contact
  components/Art.jsx      hand-drawn SVG illustrations and icons
  styles.css              design system and layout
  assets/profile.jpg      portrait
```

## License

MIT, see `LICENSE`.
