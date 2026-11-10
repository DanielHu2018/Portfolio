import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import type { BrowserContext, Page } from '@playwright/test';

export type ApiMode = 'ok' | 'playing' | 'fail';

export type PageOptions = { api?: ApiMode; stickers?: 'seeded' | 'full'; muted?: boolean };

const fixture = (name: string) => readFileSync(`tests/port/fixtures/${name}`, 'utf8');
const avatarStill = readFileSync('public/assets/avatar/avatar_idle.png');
const START = new Date('2026-11-09T12:00:00');

export const requestLog = new WeakMap<Page, string[]>();

/** Seeded Math.random and a log of every tone the page synthesizes. */
function initPage(muted: boolean) {
  let a = 0x5eed;
  Math.random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // The fake clock's performance.now carries a millisecond or two of real startup lag; Date does not.
  const epoch = Date.now();
  performance.now = () => Date.now() - epoch;
  // Same for its animation frames: their phase drifts with that lag, so derive them from Date too.
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16 - (performance.now() % 16)) as unknown as number;
  window.cancelAnimationFrame = (id) => clearTimeout(id);
  if (muted) localStorage.setItem('dh-sfx', 'off');
  const log: string[] = [];
  (window as unknown as { __audio: string[] }).__audio = log;
  const create = BaseAudioContext.prototype.createOscillator;
  BaseAudioContext.prototype.createOscillator = function () {
    const o = create.call(this);
    const set = o.frequency.setValueAtTime.bind(o.frequency);
    const ramp = o.frequency.exponentialRampToValueAtTime.bind(o.frequency);
    o.frequency.setValueAtTime = (v, t) => { log.push(`${o.type}:${v}`); return set(v, t); };
    o.frequency.exponentialRampToValueAtTime = (v, t) => { log.push(`ramp:${v}`); return ramp(v, t); };
    return o;
  };
}

export async function makeDeterministic(context: BrowserContext, page: Page, options: PageOptions) {
  // Runs before the fake clock replaces it, so tests can still wait on real browser frames.
  await context.addInitScript(() => { (window as unknown as { __realRaf: typeof requestAnimationFrame }).__realRaf = window.requestAnimationFrame.bind(window); });
  await page.clock.install({ time: START });
  await page.clock.pauseAt(new Date(START.getTime() + 1000));
  await context.addInitScript(initPage, !!options.muted);

  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/css', body: readFileSync('.port-baseline/fonts/fonts.css') }));
  await page.route('https://fonts.gstatic.com/**', (route) => route.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'access-control-allow-origin': '*' }, body: readFileSync(`.port-baseline/fonts/${basename(new URL(route.request().url()).pathname)}`) }));

  const requests: string[] = [];
  requestLog.set(page, requests);
  const api = options.api ?? 'ok';

  await page.route('**/api/stickers', async (route) => {
    const request = route.request();
    requests.push(`${request.method()} /api/stickers ${request.postData() ?? ''}`);
    if (api === 'fail') return route.fulfill({ status: 500, body: '' });
    if (request.method() === 'POST') return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    const stickers = options.stickers === 'full'
      ? JSON.stringify(Array.from({ length: 80 }, (_, i) => ({ x: 10 + (i % 8) * 10, y: 15 + (i % 7) * 10, k: i % 8, r: (i % 11) - 5, n: '' })))
      : fixture('stickers.json');
    return route.fulfill({ status: 200, contentType: 'application/json', body: stickers });
  });
  await page.route('**/api/now-playing', async (route) => {
    requests.push('GET /api/now-playing');
    if (api === 'fail') return route.fulfill({ status: 500, body: '' });
    return route.fulfill({ status: 200, contentType: 'application/json', body: api === 'playing' ? fixture('now-playing.json') : '{"playing":false}' });
  });
  await page.route('**/assets/receipts/receipts.json', async (route) => {
    requests.push('GET receipts.json');
    if (api === 'fail') return route.fulfill({ status: 500, body: '' });
    return route.fulfill({ status: 200, contentType: 'application/json', body: fixture('receipts.json') });
  });
  await page.route('**/assets/avatar/*.gif', (route) => route.fulfill({ status: 200, contentType: 'image/png', body: avatarStill }));
}
