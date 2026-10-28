// Generates public/og/<slug>.png from the live /og/<slug> pages.
//
// Same shape as build-resume-pdf.mjs: the page IS the card, the PNG is a
// print of it. Run via `npm run og` whenever a card's copy, chart data or
// artwork changes, then commit the regenerated PNGs alongside the edit.
//
// Pipeline: astro build → astro preview → puppeteer screenshots each board.
// The slug list comes from dist/og/, so it's whatever actually built — a case
// study with no entry in src/lib/og-cards.ts emits no page and gets no PNG.

import { spawn } from 'node:child_process';
import { mkdir, readdir } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const PORT = 4323;
const OUT_DIR = resolve(root, 'public', 'og');

const slugs = (await readdir(resolve(root, 'dist', 'og'), { withFileTypes: true }))
  .filter(e => e.isDirectory())
  .map(e => e.name)
  .sort();

if (slugs.length === 0) {
  throw new Error('no /og/ pages in dist — did astro build run?');
}

await mkdir(OUT_DIR, { recursive: true });

const preview = spawn(
  'npx',
  ['astro', 'preview', '--port', String(PORT), '--host', '127.0.0.1'],
  { cwd: root, stdio: 'inherit' },
);

const waitForServer = async () => {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://localhost:${PORT}/og/${slugs[0]}/`);
      if (r.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('preview server timeout');
};

try {
  await waitForServer();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // The board pins its own palette, but headless Chromium can still resolve
  // prefers-color-scheme as dark and trip anything themed that leaks in.
  // Reduced motion keeps the sun mark from being caught mid-animation.
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'light' },
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ]);
  // deviceScaleFactor 1: the board is authored at the 1200x630 the OG spec
  // asks for, so no downsampling between layout and file.
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  for (const slug of slugs) {
    await page.goto(`http://localhost:${PORT}/og/${slug}/`, {
      waitUntil: 'networkidle0',
    });
    await page.evaluateHandle('document.fonts.ready');
    const board = await page.$('.board');
    if (!board) throw new Error(`no .board on /og/${slug}/`);
    const out = resolve(OUT_DIR, `${slug}.png`);
    await board.screenshot({ path: out });
    console.log(`✓ ${slug}.png`);
  }

  await browser.close();
  console.log(`✓ Wrote ${slugs.length} card(s) to ${OUT_DIR}`);
} finally {
  preview.kill();
}
