import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT = process.env.OUT_DIR ?? 'verify';

const viewportSets = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

const pages = ['/', '/apuntes', '/formas', '/traducciones'];

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });

for (const view of viewportSets) {
  const context = await browser.newContext({
    viewport: { width: view.width, height: view.height },
    deviceScaleFactor: 1,
    reducedMotion: view.name === 'mobile' ? 'reduce' : 'no-preference',
  });

  for (const route of pages) {
    const page = await context.newPage();
    await page.addInitScript(() => {
      const apply = () => {
        const style = document.createElement('style');
        style.textContent = 'html { scroll-behavior: auto !important; }';
        document.documentElement?.appendChild(style);
      };
      if (document.documentElement) apply();
      else document.addEventListener('DOMContentLoaded', apply);
    });
    await page.route('https://calendar.google.com/**', (intercepted) =>
      intercepted.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html lang="es"><body style="margin:0;background:#e5e7eb"></body></html>',
      }),
    );
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`${route}: ${msg.text()}`);
    });
    page.on('pageerror', (error) => errors.push(`${route}: ${error.message}`));

    const name = route === '/' ? 'home' : route.slice(1);
    console.log(`[${name}/${view.name}] goto`);
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);
    console.log(`[${name}] loaded`);

    await page.screenshot({
      path: `${OUT}/${name}-${view.name}.png`,
      fullPage: route === '/' ? false : true, animations: 'disabled', caret: 'hide',
      timeout: 25000,
    });

    if (route === '/') {
      const cards = await page.locator('.event-card').count();
      const nextVisible = await page.locator('.event-card.is-next').isVisible();
      const descCount = await page.locator('.event-desc').count();
      const iframe = await page.locator('.embed-frame').isVisible();
      const carouselState = await page.evaluate(() => {
        const track = document.getElementById('event-track');
        const next = track?.querySelector('.is-next');
        if (!track || !next) return null;
        const mid = track.scrollLeft + track.clientWidth / 2;
        const cardMid = next.offsetLeft + next.offsetWidth / 2;
        return { cards: track.children.length, offset: Math.round(cardMid - mid), scrollable: track.scrollWidth > track.clientWidth };
      });

      console.log(
        `[home/${view.name}] cards=${cards} nextVisible=${nextVisible} descriptions=${descCount} iframe=${iframe} carouselCenterOffset=${carouselState?.offset} scrollable=${carouselState?.scrollable}`,
      );

      const prevButton = page.locator('#carousel-prev');
      const nextButton = page.locator('#carousel-next');
      if (cards > 1) {
        await nextButton.click();
        await page.waitForTimeout(600);
        const afterNext = await page.evaluate(() => {
          const track = document.getElementById('event-track');
          return Math.round(track.scrollLeft);
        });
        await prevButton.click();
        await page.waitForTimeout(600);
        const afterPrev = await page.evaluate(() => {
          const track = document.getElementById('event-track');
          return Math.round(track.scrollLeft);
        });
        console.log(`[home/${view.name}] scrollAfterNext=${afterNext} scrollAfterPrev=${afterPrev}`);
      }

      await page.screenshot({ path: `${OUT}/home-${view.name}-events.png`, timeout: 60000 });

      const keyboardOk = await (async () => {
        await page.focus('#event-track');
        const before = await page.evaluate(() => document.getElementById('event-track').scrollLeft);
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(400);
        const after = await page.evaluate(() => document.getElementById('event-track').scrollLeft);
        return { before: Math.round(before), after: Math.round(after) };
      })();
      console.log(`[home/${view.name}] trackKeyboard before=${keyboardOk.before} after=${keyboardOk.after}`);

      const focusTrail = await page.evaluate(() => {
        const seen = [];
        const walk = document.querySelectorAll(
          'a[href], button, [tabindex], input, select, textarea',
        );
        walk.forEach((el) => seen.push(el.textContent?.trim().slice(0, 28)));
        return seen.slice(0, 20);
      });
      console.log(`[home/${view.name}] focusables=${focusTrail.join(' | ')}`);
    }

    if (errors.length) console.log(`[errors] ${errors.join('\n')}`);
    else console.log(`[${name}/${view.name}] no console errors`);

    await page.close();
  }

  await context.close();
}

await browser.close();
