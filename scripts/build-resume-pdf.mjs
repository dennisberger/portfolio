// Generates public/dennis-berger-resume.pdf from the live /resume page.
//
// Single source of truth: the page IS the résumé; the PDF is a print of it.
// Run via `npm run resume:pdf` whenever the résumé content changes, then
// commit the regenerated PDF alongside the source edit.
//
// Pipeline: astro build → astro preview → puppeteer prints /resume to PDF.
// `preferCSSPageSize: true` lets the @page rules in the print stylesheet
// drive page size and margins, so this script and the in-browser Cmd+P
// produce identical output.

import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const PORT = 4322;
const URL = `http://localhost:${PORT}/resume/`;
const OUTPUT = resolve(root, 'public', 'dennis-berger-resume.pdf');

await mkdir(dirname(OUTPUT), { recursive: true });

const preview = spawn(
  'npx',
  ['astro', 'preview', '--port', String(PORT), '--host', '127.0.0.1'],
  { cwd: root, stdio: 'inherit' },
);

const waitForServer = async () => {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(URL);
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
  // Headless Chromium's default prefers-color-scheme can resolve as dark,
  // pulling in the site's dark-mode tokens before the print stylesheet
  // applies — fuchsia/cobalt accents lose their brand hex and the output
  // looks grayscale. Pin to light so the print stylesheet's overrides
  // cascade against light-mode tokens, the same evaluation Cmd+P sees.
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'light' },
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ]);
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.pdf({
    path: OUTPUT,
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log(`✓ Wrote ${OUTPUT}`);
} finally {
  preview.kill();
}
