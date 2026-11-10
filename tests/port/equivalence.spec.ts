import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { test, type Browser } from '@playwright/test';
import { BASELINE_URL, TARGET_URL } from '../../playwright.config';
import { capture, compareStructure, noiseMask, pixelDiff, type Capture } from './lib/capture';
import { makeDeterministic, requestLog } from './lib/determinism';
import { scenarios, settle, type Scenario } from './scenarios';

type Stored = { label: string; file: string };
type Run = { captures: Stored[]; requests: string[]; errors: string[] };

// Captures are large, so they wait on disk and are read back one pair at a time.
let stored = 0;
function store(result: Capture): string {
  const dir = test.info().outputPath('captures');
  mkdirSync(dir, { recursive: true });
  const file = `${dir}/${stored++}`;
  const { png, ...data } = result;
  writeFileSync(`${file}.png`, png);
  writeFileSync(`${file}.json`, JSON.stringify(data));
  return file;
}
const loadPng = (c: Stored) => ({ png: readFileSync(`${c.file}.png`) });
const loadCapture = (c: Stored): Capture => ({ ...JSON.parse(readFileSync(`${c.file}.json`, 'utf8')), ...loadPng(c) });

async function runOn(browser: Browser, url: string, s: Scenario, mutate: boolean): Promise<Run> {
  const context = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: 1, hasTouch: s.context?.hasTouch, isMobile: s.context?.isMobile, reducedMotion: s.context?.reducedMotion ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await makeDeterministic(context, page, s);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('.rv-root');
  await settle(page);
  await page.evaluate(async () => {
    // Load every face now, then let size-at-mount canvases re-measure the settled layout.
    await Promise.all(Array.from(document.fonts).map((f) => f.load()));
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => undefined)));
    window.dispatchEvent(new Event('resize'));
  });
  await settle(page);
  if (mutate) await page.addStyleTag({ content: '.rv-root{padding-left:1px}' });

  const captures: Run['captures'] = [];
  await s.run(page, {
    runFor: (ms) => page.clock.runFor(ms),
    checkpoint: async (label, fullPage) => { captures.push({ label, file: store(await capture(page, fullPage)) }); },
  });
  const requests = requestLog.get(page) ?? [];
  await context.close();
  return { captures, requests, errors };
}

const BASELINE_SAMPLES = 8;

async function compare(browser: Browser, s: Scenario) {
  const mutate = process.env.PORT_MUTATE === '1';
  const base = await runOn(browser, BASELINE_URL, s, false);
  let target = await runOn(browser, TARGET_URL, s, mutate);

  if (base.captures.length === 0) throw new Error('scenario made no checkpoints');
  if (base.captures.length !== target.captures.length) throw new Error(`checkpoints ${base.captures.length} vs ${target.captures.length}`);
  if (target.errors.join() !== base.errors.join()) throw new Error(`page errors: ${base.errors.join(' | ')} vs ${target.errors.join(' | ')}`);
  if (base.requests.join(' | ') !== target.requests.join(' | ')) throw new Error(`requests differ: ${base.requests.join(' | ')} --- ${target.requests.join(' | ')}`);
  base.captures.forEach((c, i) => {
    const diff = compareStructure(loadCapture(c), loadCapture(target.captures[i]));
    if (diff) throw new Error(`[${c.label}] ${diff}`);
  });
  if (base.captures.every((c, i) => pixelDiff(loadPng(c), loadPng(target.captures[i])).count === 0)) return;

  // Some pixels differ. Only pixels the old site itself cannot reproduce run to run may be excused.
  const samples = [base];
  for (let k = 1; k < BASELINE_SAMPLES; k++) samples.push(await runOn(browser, BASELINE_URL, s, false));
  let failure = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    failure = '';
    for (let i = 0; i < base.captures.length && !failure; i++) {
      const a = loadPng(base.captures[i]);
      const b = loadPng(target.captures[i]);
      if (pixelDiff(a, b).count === 0) continue;
      const mask = noiseMask(samples.map((sample) => loadPng(sample.captures[i])));
      console.log(`NOISE ${s.name} [${base.captures[i].label}] ${mask.reduce((n, v) => n + v, 0)} of ${mask.length}`);
      const diff = pixelDiff(a, b, mask);
      if (diff.count === 0) continue;
      if (diff.image) writeFileSync(test.info().outputPath(`${i}-diff.png`), diff.image);
      failure = `[${base.captures[i].label}] ${diff.message}`;
    }
    if (!failure) break;
    target = await runOn(browser, TARGET_URL, s, mutate);
  }
  if (failure) throw new Error(failure);
}

for (const s of scenarios) {
  test(s.name, async ({ browser }) => {
    try {
      await compare(browser, s);
    } finally {
      rmSync(test.info().outputPath('captures'), { recursive: true, force: true });
    }
  });
}
