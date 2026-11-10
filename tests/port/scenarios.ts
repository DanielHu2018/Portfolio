import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import type { PageOptions } from './lib/determinism';

export type Ctl = {
  runFor: (ms: number) => Promise<void>;
  checkpoint: (label: string, fullPage?: boolean) => Promise<void>;
};

export type Scenario = PageOptions & {
  name: string;
  viewport: { width: number; height: number };
  context?: { hasTouch?: boolean; isMobile?: boolean; reducedMotion?: boolean };
  run: (page: Page, ctl: Ctl) => Promise<void>;
};

type V = [number, number];
const A: V[] = [[390, 844], [824, 1100], [1440, 900], [2560, 1440]];
const B: V[] = [[699, 900], [700, 900], [1099, 800], [1100, 800]];
const DESK: V = [1440, 900];
const PHONE: V = [390, 844];
const SECTIONS = ['hero', 'about', 'experience', 'work', 'skills', 'off', 'contact'];

/** Lets real browser work (layout, observers, smooth scrolling) finish; page timers stay frozen. */
export async function settle(page: Page) {
  const frames = () => page.evaluate(() => new Promise<number>((resolve) => {
    const raf = (window as unknown as { __realRaf: typeof requestAnimationFrame }).__realRaf;
    raf(() => raf(() => raf(() => resolve(window.scrollY))));
  }));
  let last = await frames();
  for (let same = 0; same < 2;) {
    const y = await frames();
    same = y === last ? same + 1 : 0;
    last = y;
  }
}

/** Hover and press effects run on real time; jump them to their end so measurements don't race them. */
async function finishTransitions(page: Page) {
  await settle(page);
  await page.evaluate(() => {
    for (const a of document.getAnimations()) if (a.effect?.getComputedTiming().endTime !== Infinity) a.finish();
  });
  await settle(page);
}

async function center(page: Page, selector: string, nth = 0, scroll = true) {
  // Park the pointer where nothing reacts, or Chrome's synthetic hover after a scroll can select a row.
  await page.mouse.move(1, 1);
  await finishTransitions(page);
  await page.evaluate(({ selector, nth, scroll }) => {
    const el = document.querySelectorAll(selector)[nth];
    if (!el) throw new Error(`no element: ${selector} [${nth}]`);
    if (scroll) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, { selector, nth, scroll });
  await finishTransitions(page);
  return page.evaluate(({ selector, nth }) => {
    const r = document.querySelectorAll(selector)[nth].getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  }, { selector, nth });
}

async function clickOn(page: Page, selector: string, nth = 0, scroll = true) {
  const b = await center(page, selector, nth, scroll);
  if (!b.w || !b.h) return;
  await page.mouse.move(b.x + b.w / 2, b.y + b.h / 2);
  await finishTransitions(page);
  await page.mouse.down();
  await finishTransitions(page);
  await page.mouse.up();
  await finishTransitions(page);
}

async function hover(page: Page, selector: string, fx = 0.5, fy = 0.5, nth = 0, scroll = true) {
  const b = await center(page, selector, nth, scroll);
  if (!b.w || !b.h) return;
  await page.mouse.move(b.x + b.w * fx, b.y + b.h * fy);
  await finishTransitions(page);
}

async function scrollToSection(page: Page, id: string) {
  await page.evaluate((id) => document.getElementById(id)!.scrollIntoView({ behavior: 'instant', block: 'start' }), id);
  await settle(page);
}

async function enter(page: Page, ctl: Ctl) {
  await ctl.runFor(100);
  const v = page.viewportSize()!;
  await page.mouse.move(v.width / 2, v.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await ctl.runFor(2400);
  await settle(page);
}

async function visit(page: Page, ctl: Ctl, id: string) {
  await scrollToSection(page, id);
  await ctl.runFor(1500);
  await settle(page);
}

type Open = { name: string; section: string; open: (page: Page) => Promise<void> };
const FOCUS: Open[] = [
  { name: 'photo', section: 'about', open: (p) => clickOn(p, '#about [style*="zoom-in"]') },
  { name: 'resume', section: 'hero', open: (p) => clickOn(p, '#hero a.pill[href="#resume"]') },
  { name: 'concert', section: 'off', open: (p) => clickOn(p, '[style*="translateX(0px)"] .photo3d') },
  { name: 'proj0', section: 'work', open: (p) => clickOn(p, '#work .slab3d.proj', 0) },
  { name: 'proj1', section: 'work', open: (p) => clickOn(p, '#work .slab3d.proj', 1) },
  { name: 'proj2', section: 'work', open: (p) => clickOn(p, '#work .slab3d.proj', 2) },
  { name: 'spotify', section: 'off', open: (p) => clickOn(p, '#off .slab3d.proj') },
  { name: 'skills', section: 'skills', open: (p) => clickOn(p, '#skills .slab3d.proj') },
  { name: 'guitar', section: 'off', open: (p) => clickOn(p, '#hb-guitar') },
  { name: 'drawing', section: 'off', open: (p) => clickOn(p, '#hb-drawing') },
  { name: 'ski', section: 'off', open: (p) => clickOn(p, '#hb-ski') },
  { name: 'volley', section: 'off', open: (p) => clickOn(p, '#hb-volley') },
];

async function openFocus(page: Page, ctl: Ctl, f: Open) {
  await visit(page, ctl, f.section);
  await f.open(page);
  await settle(page);
}

const out: Scenario[] = [];
const add = (name: string, v: V, run: Scenario['run'], extra: Partial<Scenario> = {}) =>
  out.push({ name: `${name} @${v[0]}x${v[1]}`, viewport: { width: v[0], height: v[1] }, run, ...extra });

for (const v of A) {
  add('boot idle', v, async (_p, c) => { await c.runFor(200); await c.checkpoint('idle'); });
  add('boot sequence', v, async (p, c) => {
    await c.runFor(100);
    await clickOn(p, '.boot', 0, false);
    await c.runFor(800);
    await c.checkpoint('loading');
    await c.runFor(900);
    await c.checkpoint('leaving');
    await c.runFor(700);
    await c.checkpoint('gone');
  });
  add('boot keys', v, async (p, c) => {
    await c.runFor(100);
    await p.keyboard.press('Tab');
    await c.runFor(100);
    await c.checkpoint('tab-does-nothing');
    await p.evaluate(() => (document.querySelector('.boot') as HTMLElement).focus());
    await p.keyboard.press('Enter');
    await c.runFor(100);
    await c.checkpoint('enter-starts');
  });
}

const sectionViewports: [V, string[]][] = [...A.map((v): [V, string[]] => [v, SECTIONS]), ...B.map((v): [V, string[]] => [v, ['hero', 'skills']])];
for (const [v, ids] of sectionViewports) {
  for (const id of ids) add(`section ${id}`, v, async (p, c) => { await enter(p, c); await visit(p, c, id); await c.checkpoint('visible'); });
}
for (const v of A) {
  add('full page', v, async (p, c) => {
    await enter(p, c);
    for (const id of SECTIONS) await visit(p, c, id);
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await settle(p);
    await c.checkpoint('all-revealed', true);
  });
  for (const f of FOCUS) {
    add(`focus ${f.name}`, v, async (p, c) => {
      await enter(p, c);
      await openFocus(p, c, f);
      await c.checkpoint('from');
      await c.runFor(50);
      await settle(p);
      await c.runFor(700);
      await settle(p);
      await c.checkpoint('open');
      await p.keyboard.press('Escape');
      await c.runFor(100);
      await c.checkpoint('closing');
      await c.runFor(600);
      await settle(p);
      await c.checkpoint('closed');
    });
  }
  add('focus concert stepping', v, async (p, c) => {
    await enter(p, c);
    await openFocus(p, c, FOCUS[2]);
    await c.runFor(800);
    await clickOn(p, 'button[aria-label="Next concert"]', 0, false);
    await c.checkpoint('next');
    await clickOn(p, 'button[aria-label="Previous concert"]', 0, false);
    await clickOn(p, 'button[aria-label="Previous concert"]', 0, false);
    await c.checkpoint('prev-wraps');
  });
  add('focus project stepping', v, async (p, c) => {
    await enter(p, c);
    await openFocus(p, c, FOCUS[3]);
    await c.runFor(800);
    await clickOn(p, 'button[aria-label="Next project"]', 0, false);
    await c.checkpoint('next');
    await clickOn(p, 'button[aria-label="Previous project"]', 0, false);
    await clickOn(p, 'button[aria-label="Previous project"]', 0, false);
    await c.checkpoint('prev-wraps');
    await clickOn(p, 'button[aria-label="Menu: close project"]', 0, false);
    await c.runFor(700);
    await settle(p);
    await c.checkpoint('closed-by-menu');
  });
  add('navigator wheel', v, async (p, c) => {
    await enter(p, c);
    for (const label of ['Next section', 'Next section', 'Previous section', 'Open highlighted section', 'Menu: back to top']) {
      await clickOn(p, `aside.ipod button[aria-label="${label}"]`, 0, false);
      await settle(p);
      await c.runFor(1000);
      await settle(p);
      await c.checkpoint(label);
    }
  });
  add('navigator rows', v, async (p, c) => {
    await enter(p, c);
    for (const i of [6, 3, 0]) {
      await clickOn(p, 'aside.ipod a', i, false);
      await settle(p);
      await c.runFor(1000);
      await settle(p);
      await c.checkpoint(`row${i}`);
    }
  });
  add('navigator drag', v, async (p, c) => {
    await enter(p, c);
    const b = await center(p, 'aside.ipod', 0, false);
    await c.checkpoint('before');
    if (!b.w) return;
    await p.mouse.move(b.x + 6, b.y + b.h * 0.6);
    await p.mouse.down();
    await p.mouse.move(120, 140, { steps: 4 });
    await c.checkpoint('dragging');
    await p.mouse.up();
    await settle(p);
    await c.checkpoint('dropped');
    const d = await center(p, 'aside.ipod', 0, false);
    await p.mouse.dblclick(d.x + 4, d.y + d.h * 0.6);
    await settle(p);
    await c.checkpoint('docked');
  });
}

for (const v of [DESK, PHONE]) {
  add('tilt project', v, async (p, c) => {
    await enter(p, c);
    await visit(p, c, 'work');
    for (const [fx, fy] of [[0.1, 0.1], [0.5, 0.5], [0.9, 0.8]]) {
      await hover(p, '#work .slab3d.proj', fx, fy, 1, false);
      await settle(p);
      await c.checkpoint(`at${fx}`);
    }
    await p.mouse.move(3, 3);
    await c.runFor(700);
    await settle(p);
    await c.checkpoint('left');
  });
  add('cover flow', v, async (p, c) => {
    await enter(p, c);
    await visit(p, c, 'off');
    await hover(p, '[style*="translateX(0px)"] .photo3d', 0.2, 0.3, 0, false);
    await settle(p);
    await c.checkpoint('photo-hover');
    await p.mouse.move(3, 3);
    await c.runFor(1000);
    await settle(p);
    for (let i = 1; i <= 12; i++) {
      await clickOn(p, '.flow-arrow', 1, false);
      if (i % 4 === 0) await c.checkpoint(`next${i}`);
    }
    for (let i = 1; i <= 12; i++) {
      await clickOn(p, '.flow-arrow', 0, false);
      if (i % 6 === 0) await c.checkpoint(`prev${i}`);
    }
  });
  add('receipts', v, async (p, c) => {
    await enter(p, c);
    await visit(p, c, 'off');
    await hover(p, '#off .slab3d.proj [role="listitem"]', 0.5, 0.5, 3, false);
    await settle(p);
    await c.checkpoint('row-hover');
    for (let i = 0; i < 6; i++) {
      await clickOn(p, '#off button[aria-label="Next receipt"]', 0, false);
      await c.checkpoint(`view${i}`);
    }
    await clickOn(p, '#off button[aria-label="Previous receipt"]', 0, false);
    await c.checkpoint('back');
  });
  add('skills', v, async (p, c) => {
    await enter(p, c);
    await visit(p, c, 'skills');
    for (let i = 0; i < 4; i++) {
      await hover(p, '#skills [role="listitem"]', 0.5, 0.5, i, false);
      await settle(p);
      await c.checkpoint(`row${i}`);
    }
    await clickOn(p, '#skills button[aria-label="Next skill category"]', 0, false);
    await c.checkpoint('next');
    await clickOn(p, '.skill-use', 0, false);
    await c.runFor(1000);
    await settle(p);
    await c.checkpoint('use-open');
  });
  add('skill use experience', v, async (p, c) => {
    await enter(p, c);
    await visit(p, c, 'skills');
    await clickOn(p, '#skills button[aria-label="Previous skill category"]', 0, false);
    await clickOn(p, '.skill-use', 0);
    await settle(p);
    await c.runFor(1000);
    await settle(p);
    await c.checkpoint('jumped');
  });
  add('guestbook', v, async (p, c) => {
    await enter(p, c);
    await visit(p, c, 'contact');
    for (let i = 0; i < 8; i++) await clickOn(p, 'button[role="radio"]', i);
    await c.checkpoint('picked-last');
    await clickOn(p, '#gb-name');
    await p.keyboard.type('hello   there, this note is much too long to fit in forty');
    await c.checkpoint('typed');
    await clickOn(p, '.gb-board');
    await settle(p);
    await c.checkpoint('placed');
    await p.evaluate(() => (document.querySelector('.gb-board') as HTMLElement).focus());
    await p.keyboard.press('Enter');
    await p.keyboard.press(' ');
    await settle(p);
    await c.checkpoint('keyboard-placed');
  });
  add('guestbook full', v, async (p, c) => {
    await enter(p, c);
    await visit(p, c, 'contact');
    await clickOn(p, '.gb-board');
    await settle(p);
    await c.checkpoint('trimmed-to-80');
  }, { stickers: 'full' });
}

add('avatar walk', DESK, async (p, c) => {
  await enter(p, c);
  for (let i = 0; i < 16; i++) {
    const t = (i * Math.PI) / 8;
    await p.mouse.move(720 + Math.sin(t) * 320, 450 - Math.cos(t) * 320);
    await p.mouse.down();
    await p.mouse.up();
    await c.runFor(300);
    await c.checkpoint(`walking${i}`);
    await c.runFor(1800);
  }
  await c.runFor(4000);
  await c.checkpoint('home-again');
});
add('avatar wave', DESK, async (p, c) => {
  await enter(p, c);
  await hover(p, '#hero h1');
  await c.runFor(600);
  await c.checkpoint('waving');
});
add('avatar cheer', DESK, async (p, c) => {
  await enter(p, c);
  await openFocus(p, c, FOCUS[3]);
  await c.runFor(1500);
  await c.checkpoint('cheering');
});
add('avatar dance and badge', DESK, async (p, c) => {
  await enter(p, c);
  await c.runFor(1500);
  await c.checkpoint('dancing');
}, { api: 'playing' });
add('badge phone', PHONE, async (p, c) => { await enter(p, c); await c.checkpoint('badge'); }, { api: 'playing' });
add('muted', DESK, async (p, c) => {
  await enter(p, c);
  await clickOn(p, '#hero a.pill[href="#resume"]');
  await c.runFor(800);
  await c.checkpoint('no-tones');
}, { muted: true });

for (const id of SECTIONS) add(`reduced ${id}`, DESK, async (p, c) => { await enter(p, c); await visit(p, c, id); await c.checkpoint('visible'); }, { context: { reducedMotion: true } });
for (const f of FOCUS) add(`reduced focus ${f.name}`, DESK, async (p, c) => {
  await enter(p, c);
  await openFocus(p, c, f);
  await c.runFor(800);
  await settle(p);
  await c.checkpoint('open');
}, { context: { reducedMotion: true } });

/** Changes what /api/now-playing returns, so the next poll re-renders the whole site. */
const startPlaying = (p: Page) => p.route('**/api/now-playing', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: readFileSync('tests/port/fixtures/now-playing.json', 'utf8') }));

add('resize stale flow', DESK, async (p, c) => {
  await enter(p, c);
  await visit(p, c, 'off');
  await p.setViewportSize({ width: 690, height: 900 });
  await settle(p);
  await c.checkpoint('resized');
  await clickOn(p, '.flow-arrow', 1, false);
  await c.checkpoint('next');
});
add('api fail', DESK, async (p, c) => {
  await enter(p, c);
  await c.checkpoint('hero');
  await visit(p, c, 'off');
  await c.checkpoint('off');
  await visit(p, c, 'contact');
  await c.checkpoint('contact');
}, { api: 'fail' });
add('rerender mid tilt', DESK, async (p, c) => {
  await enter(p, c);
  await visit(p, c, 'work');
  await hover(p, '#work .slab3d.proj', 0.1, 0.1, 1, false);
  await c.checkpoint('tilted');
  await startPlaying(p);
  await c.runFor(20000);
  await settle(p);
  await c.checkpoint('after-update');
});
add('rerender mid drag', DESK, async (p, c) => {
  await enter(p, c);
  const b = await center(p, 'aside.ipod', 0, false);
  await p.mouse.move(b.x + 6, b.y + b.h * 0.6);
  await p.mouse.down();
  await p.mouse.move(120, 140, { steps: 4 });
  await startPlaying(p);
  await c.runFor(20000);
  await settle(p);
  await c.checkpoint('after-update');
  await p.mouse.move(200, 220, { steps: 4 });
  await c.checkpoint('still-dragging');
  await p.mouse.up();
  await settle(p);
  await c.checkpoint('dropped');
});
add('touch', PHONE, async (p, c) => {
  await c.runFor(100);
  await p.touchscreen.tap(195, 422);
  await c.runFor(2400);
  await settle(p);
  if (await p.evaluate(() => document.documentElement.hasAttribute('data-wii'))) throw new Error('hand cursor is on for a touch device');
  await p.touchscreen.tap(195, 600);
  await c.runFor(300);
  await c.checkpoint('walking');
  await c.runFor(2000);
  await visit(p, c, 'work');
  const b = await center(p, '#work .slab3d.proj', 0);
  await p.touchscreen.tap(b.x + b.w / 2, b.y + b.h / 2);
  await settle(p);
  await c.runFor(800);
  await settle(p);
  await c.checkpoint('card-tapped');
}, { context: { hasTouch: true, isMobile: true } });
add('focus races', DESK, async (p, c) => {
  await enter(p, c);
  await openFocus(p, c, FOCUS[3]);
  await p.keyboard.press('Escape');
  await c.runFor(100);
  await c.checkpoint('esc-during-from');
  await c.runFor(700);
  await settle(p);
  await c.checkpoint('esc-settled');

  await openFocus(p, c, FOCUS[0]);
  await c.runFor(800);
  await settle(p);
  await p.keyboard.press('Escape');
  await c.runFor(100);
  await clickOn(p, 'button[aria-label="Close"]', 0, false);
  await c.checkpoint('x-during-closing');
  await c.runFor(700);
  await settle(p);
  await c.checkpoint('x-settled');

  await openFocus(p, c, FOCUS[3]);
  await settle(p);
  await c.runFor(800);
  await settle(p);
  await p.keyboard.press('Escape');
  await c.runFor(100);
  await FOCUS[4].open(p);
  await settle(p);
  await c.checkpoint('reopen-during-closing');
  await c.runFor(800);
  await settle(p);
  await c.checkpoint('reopen-settled');
});

export const scenarios = out;
