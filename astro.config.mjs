// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dennisberger.me',
  output: 'static',
  server: { port: 5173 },
  // Inline all CSS into <style> tags in <head>. Eliminates the two
  // render-blocking <link rel="stylesheet"> requests (Base + per-page).
  // Per-page Brotli'd CSS is ~5KB, so the cross-page cache reuse we lose
  // is trivial vs. the FCP/LCP win from removing the critical-path RTT.
  build: { inlineStylesheets: 'always' },
  integrations: [mdx(), sitemap()],
});
