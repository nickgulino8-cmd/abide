// End-to-end smoke test against the production build (npm run build && npm run preview).
// Usage: NODE_PATH=$(npm root -g) node scripts/e2e.mjs [baseUrl] [screenshotDir]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const { chromium, devices } = createRequire(import.meta.url)('playwright');

const BASE = process.argv[2] ?? 'http://localhost:4173';
const OUT = process.argv[3] ?? 'e2e-screens';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });
const step = async (name, fn) => {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.log(`✗ ${name}: ${e.message.split('\n')[0]}`);
    await shot(`FAIL-${name.replace(/\W+/g, '-')}`);
    process.exitCode = 1;
  }
};
const click = (text) => page.getByRole('button', { name: text, exact: false }).first().click();

await step('onboarding', async () => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByText('Welcome to Abide.').waitFor();
  await shot('01-welcome');
  await click('Begin');
  await page.getByPlaceholder('Your first name').fill('Friend');
  await click('Continue');
  await click('Overcome an unwanted habit');
  await click('Build a daily prayer life');
  await shot('02-goals');
  await click('Continue');
  await click('Purity of heart');
  await click('Continue');
  await click('Continue');
  await click('The Gospels');
  await click('Continue');
  await page.getByText('Meet your companion').waitFor();
  await shot('03-companion');
  await click('Begin my journey');
  await page.getByText('Take another step toward Christ today.').waitFor();
});

await step('home renders', async () => {
  await page.getByText('Begin Today’s Devotional').waitFor();
  await page.getByText('Friend.').first().waitFor();
  await page.waitForTimeout(900);
  await shot('04-home');
  await page.evaluate(() => window.scrollTo(0, 1100));
  await page.waitForTimeout(400);
  await shot('05-home-scripture');
});

await step('companion is interactive', async () => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('canvas').first().click({ position: { x: 180, y: 90 } });
  await page.getByRole('status').first().waitFor({ timeout: 2000 });
});

await step('check-in: committed', async () => {
  await page.getByRole('link', { name: 'I stayed committed to my goal' }).click();
  await page.getByText('Thanks be to God.').waitFor();
  await page.waitForTimeout(600);
  await shot('06-checkin-committed');
  await click('Done');
  await page.getByText('You stayed committed today.').waitFor();
});

await step('daily devotional (8 steps)', async () => {
  await click('Begin Today’s Devotional');
  await click('I am ready');
  await page.getByText('Listen to the Word').waitFor();
  await page.waitForTimeout(400);
  await shot('07-devotional-scripture');
  await click('Continue');
  await page.getByText('Historical context').waitFor();
  await shot('08-devotional-understanding');
  await click('Continue');
  await click('Continue');
  await click('Continue');
  await page.locator('textarea').fill('Where I need God most is in the evenings.');
  await click('Continue');
  await click('I accept today’s challenge');
  await click('Finish');
  await page.getByText('Go in peace.').waitFor();
  await page.waitForTimeout(700);
  await shot('09-devotional-complete');
  await click('Home');
  await page.getByText('Devotional complete').waitFor();
});

await step('setback flow for yesterday is compassionate', async () => {
  const y = await page.evaluate(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  await page.goto(`${BASE}/checkin?date=${y}`);
  await click('I experienced a setback');
  await page.getByText('Thank you for your honesty.').waitFor();
  await page.getByText('Nothing you’ve built is lost.').waitFor();
  await page.waitForTimeout(700);
  await shot('10-setback');
  await click('Continue');
  await page.getByText('What made today challenging?').waitFor();
  await page.locator('textarea').first().fill('I was tired and alone late at night.');
  await shot('11-setback-reflect');
  await click('Continue');
  await page.getByText('Begin again, now.').waitFor();
  await click('Begin again with God');
  await page.getByText('Take another step toward Christ today.').waitFor();
});

await step('journey dashboard', async () => {
  await page.getByRole('link', { name: 'Journey' }).click();
  await page.getByText('Walking with Christ').waitFor();
  await page.waitForTimeout(1300);
  await shot('12-journey');
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(300);
  await shot('13-journey-calendar');
});

await step('companion stages page', async () => {
  await page.goto(`${BASE}/journey/companion`);
  await page.getByText('Seven stages').waitFor();
  await page.getByRole('button', { name: /Preview stage 7/ }).click();
  await page.waitForTimeout(500);
  await shot('14-companion-stages');
});

await step('rosary (guided, with counters)', async () => {
  await page.goto(`${BASE}/faith/rosary`);
  await page.getByRole('link', { name: /^Pray the/ }).click();
  for (let i = 0; i < 10; i++) await page.getByRole('button', { name: /Next|Begin this decade/ }).click();
  await page.getByText(/of 10/).waitFor();
  await shot('15-rosary');
});

await step('bible reader', async () => {
  await page.goto(`${BASE}/faith/bible/john/15`);
  await page.getByText('Abide in me: and I in you.').waitFor();
  await page.locator('#v4').click();
  await page.getByRole('button', { name: 'Save selected verses' }).click();
  await shot('16-bible');
});

await step('abide companion answers', async () => {
  await page.goto(`${BASE}/faith/ask`);
  await page.getByPlaceholder('Ask about Scripture, prayer, the faith…').fill('How does confession work?');
  await page.getByRole('button', { name: 'Send' }).click();
  await page.getByText('How confession works').waitFor();
  await page.waitForTimeout(400);
  await shot('17-ask');
});

await step('journal entry', async () => {
  await page.goto(`${BASE}/journal/new?type=gratitude`);
  await page.locator('textarea').fill('Grateful for a quiet morning and a good friend.');
  await click('Save');
  await page.getByText('Grateful for a quiet morning').waitFor();
  await page.getByText('Where I need God most').waitFor(); // devotional answer saved too
  await shot('18-journal');
});

await step('learn + quiz', async () => {
  await page.goto(`${BASE}/faith/learn/beatitudes/beatitude-clean`);
  await page.getByText('Blessed are the clean of heart').waitFor();
  await page.goto(`${BASE}/faith/learn/virtues/quiz`);
  await page.getByText('Faith, hope, charity').click();
  await page.getByText('Faith, hope, and charity have God').waitFor();
});

await step('data persists after reload', async () => {
  await page.goto(`${BASE}/journey`);
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('Walking with Christ').waitFor();
  const streak = await page.locator('text=day streak').first().locator('..').innerText();
  if (!/\b1\b/.test(streak)) throw new Error(`streak not persisted: ${streak}`);
});

await step('works offline', async () => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => navigator.serviceWorker?.controller != null, null, { timeout: 15000 }).catch(async () => {
    await page.reload({ waitUntil: 'networkidle' });
  });
  await page.waitForTimeout(2500); // let the precache finish
  await ctx.setOffline(true);
  await page.goto(`${BASE}/faith/bible/psalms/22`, { waitUntil: 'domcontentloaded' });
  await page.getByText('The Lord ruleth me').waitFor({ timeout: 10000 });
  await page.goto(`${BASE}/faith/prayers/memorare`, { waitUntil: 'domcontentloaded' });
  await page.getByText('Remember, O most gracious Virgin Mary').waitFor();
  await shot('19-offline');
  await ctx.setOffline(false);
});

await step('dark mode', async () => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await shot('20-home-dark');
});

const relevant = errors.filter((e) => !/Failed to load resource.*(net::ERR_INTERNET_DISCONNECTED|offline)/i.test(e));
if (relevant.length) {
  console.log('\nBrowser errors:\n' + relevant.join('\n'));
  process.exitCode = 1;
}
await browser.close();
console.log(process.exitCode ? '\nE2E: FAILURES' : '\nE2E: all passed');
