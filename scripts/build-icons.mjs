// Generates the app icons (SVG + PNG sizes) using the preinstalled Chromium via Playwright.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // preinstalled globally; run with NODE_PATH=$(npm root -g)

const mark = (pad = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e5641"/><stop offset="1" stop-color="#16301f"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3dc9c"/><stop offset=".55" stop-color="#d9b15e"/><stop offset="1" stop-color="#a87b2a"/></linearGradient>
    <radialGradient id="glow" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="#f6e5b9" stop-opacity=".35"/><stop offset="1" stop-color="#f6e5b9" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="512" height="512" rx="${pad ? 0 : 112}" fill="url(#bg)"/>
  <circle cx="256" cy="230" r="210" fill="url(#glow)"/>
  <g transform="translate(256 262) scale(${pad ? 0.78 : 1}) translate(-256 -262)" fill="none" stroke="url(#gold)" stroke-linecap="round">
    <ellipse cx="256" cy="352" rx="128" ry="42" stroke-width="30"/>
    <path d="M 256 394 C 150 394 160 300 230 262 C 300 224 320 170 262 140" stroke-width="28"/>
    <circle cx="258" cy="128" r="30" fill="url(#gold)" stroke="none"/>
    <path d="M 120 420 C 180 440 330 440 392 412" stroke="#8fb89a" stroke-width="10"/>
    <path d="M 392 412 q 30 -30 52 -6 q -28 22 -52 6 z" fill="#8fb89a" stroke="none"/>
  </g>
</svg>`;

writeFileSync('public/favicon.svg', mark());
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, size, pad] of [
  ['pwa-192.png', 192, 0],
  ['pwa-512.png', 512, 0],
  ['pwa-maskable-512.png', 512, 1],
  ['apple-touch-icon.png', 180, 1],
]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${mark(pad).replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: `public/${file}`, omitBackground: !pad });
}
await browser.close();
console.log('icons written');
