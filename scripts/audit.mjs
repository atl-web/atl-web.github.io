import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const views = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];
const routes = ['/', '/apuntes', '/formas', '/traducciones'];

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });

for (const view of views) {
  const context = await browser.newContext({
    viewport: { width: view.width, height: view.height },
    deviceScaleFactor: 1,
    reducedMotion: view.name === 'mobile' ? 'reduce' : 'no-preference',
  });

  for (const route of routes) {
    const page = await context.newPage();
    await page.route('https://calendar.google.com/**', (intercepted) =>
      intercepted.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html lang="es"><body style="margin:0;background:#e5e7eb"></body></html>',
      }),
    );
    await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(1200);

    const name = route === '/' ? 'home' : route.slice(1);
    const results = await new AxeBuilder({ page })
      .include('#contenido')
      .include('.site-header')
      .include('.site-footer')
      .exclude('.embed-frame')
      .analyze();

    const overflow = await page.evaluate(() => ({
      hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    console.log(
      `[${name}/${view.name}] axe violations=${results.violations.length} overflow=${overflow.hasHorizontalScroll} (${overflow.scrollWidth}/${overflow.clientWidth})`,
    );
    for (const violation of results.violations) {
      const targets = violation.nodes.map((node) => node.target.join(',')).slice(0, 4);
      console.log(`  - ${violation.id} (${violation.impact}) x${violation.nodes.length}: ${targets.join(' | ')}`);
    }

    await page.close();
  }

  await context.close();
}

await browser.close();
