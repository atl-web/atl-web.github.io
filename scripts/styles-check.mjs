import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.route('https://calendar.google.com/**', (i) =>
  i.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><html><body></body></html>' }),
);
await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForTimeout(1200);

const styles = await page.evaluate(() => {
  const get = (selector, props) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return Object.fromEntries(props.map((prop) => [prop, cs[prop]]));
  };
  return {
    h1Font: get('h1', ['fontFamily', 'fontSize']),
    bodyFont: get('body', ['fontFamily', 'backgroundColor']),
    header: get('.site-header', ['position', 'top']),
    carouselMask: get('.carousel-track', ['maskImage', 'overflowX', 'scrollSnapType']),
    fadedCard: get('.event-card.is-faded', ['backgroundColor', 'filter']),
    nextCard: get('.event-card.is-next', ['borderColor', 'opacity', 'flexBasis']),
    pill: get('.event-card.is-next .countdown', ['backgroundColor', 'color']),
    descriptions: [...document.querySelectorAll('.event-desc')].map((n) => n.textContent?.replace(/\s+/g, ' ').trim().slice(0, 35)),
    preloads: [...document.querySelectorAll('link[rel=preload]')].map((n) => n.href),
    hasTwitter: document.body.innerHTML.includes('twitter.com'),
    pseudoBefore: getComputedStyle(document.body, '::before').backgroundImage,
    pseudoAfter: getComputedStyle(document.body, '::after').backgroundImage,
    primaryButton: get('.btn--primary', ['backgroundColor', 'color']),
    footer: get('.site-footer', ['backgroundColor', 'color']),
    heroLink: get('.hero .btn--ghost', ['borderTopColor', 'color']),
    focusOutlineDefined: get('a', ['outlineWidth']),
    trackTabIndex: document.querySelector('#event-track')?.getAttribute('tabindex'),
    listRole: document.querySelector('.carousel-track')?.getAttribute('role'),
    timeElements: [...document.querySelectorAll('time')].map((t) => t.getAttribute('datetime')),
    headings: [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => h.tagName),
    lang: document.documentElement.lang,
    canonical: document.querySelector('link[rel=canonical]')?.href,
    stamp: document.querySelector('.stamp')?.textContent,
    iframeTitle: document.querySelector('.embed-frame')?.getAttribute('title'),
  };
});

console.log(JSON.stringify(styles, null, 2));
await browser.close();
