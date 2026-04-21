// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dennisberger.me',
  output: 'static',
  server: { port: 5173 },
  integrations: [mdx(), sitemap()],
});
