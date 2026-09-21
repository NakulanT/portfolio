import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /portfolio/. Set VITE_BASE to publish somewhere else
// (for example a preview at /portfolio/hermes/).
export default defineConfig({
  base: process.env.VITE_BASE || '/portfolio/',
  plugins: [react()],
});
