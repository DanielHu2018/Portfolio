import type { SiteController } from '../site/controller';

declare const document: any;
declare const window: any;

// The guided tour: started from the play/pause button on the iPod navigator. The avatar walks to each spot,
// strikes a pose and talks in a speech bubble; at the end of a section it moves on to the next one.
// Pausing hands the avatar back to its normal click-to-walk behavior; the iPod's arrows, MENU and menu rows
// move the tour to that section (see go() in the controller).

type Step = {
  el: string; // where to stand: the first element matching this selector (or the nth with `nth`)
  nth?: number;
  text?: boolean; // measure the element's text instead of its box (headings and lines are full width)
  side?: 'left' | 'right';
  pose?: string; // a sprite from engine/mii.ts: wave, cheer, dance, look, sit, spin, toetap, scratch, fight
  say: string;
  phone?: Partial<Step>; // replaces these fields on phones (under 700px), where the navigator iPod is hidden
};

const TOUR: Record<string, Step[]> = {
  hero: [
    { el: '#hero h1', text: true, side: 'right', pose: 'wave', say: "Hi, I'm Daniel! Welcome to my site. Let me show you around!" },
    { el: '#hero h1 + p', text: true, side: 'right', pose: 'toetap', say: "I'm a software and AI engineer. I build AI products that turn messy, high-stakes decisions into clear next steps." },
    { el: '#hero .pill', nth: 3, side: 'right', pose: 'look', say: "I study Computer Science and Engineering at Ohio State, and I graduate in December 2026. My resume, LinkedIn and GitHub are right here." },
    { el: '.ipod', side: 'left', pose: 'scratch', say: 'Use the arrows on this iPod to skip ahead or go back, and press play or pause to stop the tour whenever you like.',
      phone: { el: '.tour-fab', side: 'left', say: 'Use these buttons to skip ahead or go back, and press pause to stop the tour whenever you like.' } }
  ],
  about: [
    { el: '#about .slab3d', pose: 'toetap', say: "That's me! I like live music and being bad at things until I'm not." },
    { el: '#about h2', text: true, side: 'right', pose: 'cheer', say: "I'm in the Engineering Honors Program, I'm a National Merit Scholar, and I minor in Statistics." }
  ],
  experience: [
    { el: '#experience .proj', nth: 0, pose: 'look', say: "Right now I'm a software engineering intern at Nationwide. I own a module end to end: 18 features and 22 endpoints." },
    { el: '#experience .proj', nth: 1, pose: 'look', say: "Before that, I spent over two years as an AI/ML researcher at Ohio State's Intelligent Design and Robotics Laboratory, teaching a robot arm to handle objects." },
    { el: '#experience .proj', nth: 2, pose: 'toetap', say: 'I also lead the Foundations of AI track at the Big Data & Analytics Association. Click any card to see more!' }
  ],
  work: [
    { el: '#work .slab3d.proj', nth: 0, pose: 'spin', say: 'CLARA won 1st place at the IBM x OSU Hackathon! It turns live world events into portfolio risk signals and recommends hedges.' },
    { el: '#work .slab3d.proj', nth: 1, pose: 'look', say: 'Sierra plans transmission lines with multi-objective pathfinding and answers regulatory questions with RAG.' },
    { el: '#work .slab3d.proj', nth: 2, pose: 'toetap', say: 'And Disco is a multi-agent planner: agents negotiate to turn one idea into a plan the whole group agrees on. Press VIEW on any of them for the code.' }
  ],
  skills: [
    { el: '#skills .slab3d.proj', pose: 'scratch', say: "Here's my toolkit: AI development, frameworks, tools, and the languages I use most, like Python and TypeScript." },
    { el: '#skills .skill-use', pose: 'look', say: 'Pick a category on the iPod and this side shows exactly where I used it.' }
  ],
  off: [
    { el: '#off h2', text: true, side: 'right', pose: 'dance', say: "Off the clock, I go to a lot of concerts. These are a few I've been to, from The Strokes to Wynton Marsalis!" },
    { el: '#off .slab3d.proj', pose: 'dance', say: "This iPod shows what I've actually been listening to, straight from Spotify. Want to see my favorite albums?" },
    { el: '#hb-guitar', pose: 'toetap', say: "I just started learning guitar after seeing The Strokes live. I'm not very good yet, but it's a lot of fun." },
    { el: '#hb-drawing', pose: 'sit', say: "I've been drawing for as long as I can remember, mostly little things in my sketchbook." },
    { el: '#hb-ski', pose: 'spin', say: 'Skiing is my favorite winter activity. Someday I want to ski in Hokkaido!' },
    { el: '#hb-volley', pose: 'fight', say: 'And I play volleyball two or three times a week, indoor and sand.' }
  ],
  contact: [
    { el: '#contact h2', text: true, side: 'right', pose: 'look', say: "I'm open to new grad software and AI engineering roles, so feel free to reach out!" },
    { el: '#contact .gb-board', pose: 'sit', say: 'Before you go, leave a sticker on my guestbook!' },
    { el: '#contact .gb-board', pose: 'spin', say: "That's the tour. Thanks for stopping by!" }
  ]
};

export function initTour(site: SiteController) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const bub = document.querySelector('.mii-bubble');
  const txt = bub ? bub.querySelector('.mii-say') : null;
  const live = document.querySelector('.mii-live');
  if (!bub || !txt) return;
  let rm = false;
  try { rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { rm = false; }
  const ids = site.sectionIds();
  let run = 0; // bumped to cancel whatever the tour is doing
  let sec = 0; let step = 0; // where the tour is (or where it was paused)
  let fresh = true; // the next start begins at the top of the site
  const timers = new Set<any>();
  const sleep = (ms: number) => new Promise<void>((res) => { const t = setTimeout(() => { timers.delete(t); res(); }, ms); timers.add(t); });
  const alive = (tok: number) => tok === run && site.tourOn;

  const hush = () => { bub.classList.remove('on'); txt.textContent = ''; };
  const say = async (text: string, tok: number) => {
    // The whole line is laid out from the start (the untyped part invisible), so the bubble doesn't grow.
    txt.textContent = '';
    const shown = document.createElement('span'); const rest = document.createElement('span');
    rest.style.visibility = 'hidden';
    rest.textContent = text;
    txt.appendChild(shown); txt.appendChild(rest);
    if (live) live.textContent = text;
    bub.classList.add('on');
    const ask = /\?\s*$/.test(text);
    for (let i = 0; i < text.length; i++) {
      if (!alive(tok)) return false;
      const ch = text[i];
      shown.textContent = text.slice(0, i + 1);
      rest.textContent = text.slice(i + 1);
      if (/[a-z0-9]/i.test(ch)) site.voice(ch, ask && i > text.length - 8 ? 1.18 : 1);
      await sleep(/[.!?]/.test(ch) ? 260 : /[,:]/.test(ch) ? 140 : 32);
    }
    await sleep(Math.min(4200, 1300 + text.length * 20));
    return alive(tok);
  };

  // The box to stand beside: the element, or the text inside it.
  const box = (s: Step) => {
    const el = document.querySelectorAll(s.el)[s.nth || 0];
    if (!el) return null;
    let r = el.getBoundingClientRect();
    if (s.text) {
      const rg = document.createRange();
      rg.selectNodeContents(el);
      const rr = rg.getBoundingClientRect();
      if (rr.width && rr.height) r = rr;
    }
    return { el: el, r: r };
  };
  // Scroll the element into view if it isn't already.
  const reveal = async (el: any, tok: number) => {
    const r = el.getBoundingClientRect(); const vh = window.innerHeight;
    if (r.top >= 60 && r.bottom <= vh - 20) return true;
    el.scrollIntoView({ behavior: rm || site.st().reduced ? 'auto' : 'smooth', block: r.height > vh * 0.8 ? 'start' : 'center' });
    await sleep(800);
    return alive(tok);
  };
  // Where to stand: beside the box on the side with room (or the step's side), feet level with its bottom.
  const stand = (s: Step, r: any) => {
    const vw = window.innerWidth; const vh = window.innerHeight; const Z = site.pageZoom || 1;
    const nav = document.querySelector('.ipod');
    const navR = nav && s.el !== '.ipod' ? nav.getBoundingClientRect() : null;
    const maxX = navR && navR.width && navR.top < vh * 0.7 ? Math.min(vw - 50, navR.left - 40) : vw - 50;
    const gap = 58 * Z;
    const y = Math.min(vh - 24, Math.max(250, r.bottom - 6));
    const roomL = r.left - gap >= 50; const roomR = r.right + gap <= maxX;
    let side = s.side || (r.left > maxX - r.right ? 'left' : 'right');
    if (side === 'left' && !roomL && roomR) side = 'right';
    if (side === 'right' && !roomR && roomL) side = 'left';
    if ((side === 'left' && roomL) || (side === 'right' && roomR)) return { x: side === 'left' ? r.left - gap : r.right + gap, y: y };
    // No room beside it (phones): stand below it if that's on screen, else at its lower left corner.
    if (r.bottom + 130 < vh) return { x: Math.min(maxX, Math.max(60, r.left + r.width / 2)), y: r.bottom + 130 };
    return { x: Math.min(maxX, Math.max(60, r.left + 50)), y: y };
  };
  const arrive = async (tok: number) => {
    const t0 = performance.now();
    while (performance.now() - t0 < 9000) {
      if (!alive(tok)) return false;
      const p = site.miiPos ? site.miiPos() : null;
      if (!p || p.done) return true;
      await sleep(80);
    }
    return alive(tok);
  };

  const play = async (tok: number) => {
    while (alive(tok)) {
      const steps = TOUR[ids[sec]] || [];
      if (step === 0) { site.go(sec, true); await sleep(rm ? 200 : 950); }
      while (step < steps.length) {
        if (!alive(tok)) return;
        const s = window.innerWidth < 700 && steps[step].phone ? { ...steps[step], ...steps[step].phone } : steps[step];
        let b = box(s);
        if (b) {
          if (!(await reveal(b.el, tok))) return;
          b = box(s);
        }
        if (b) {
          hush();
          site.miiPose(null);
          const p = stand(s, b.r);
          site.miiTo(p.x, p.y);
          if (!(await arrive(tok))) return;
          const me = site.miiPos();
          site.miiPose(s.pose || null, b.r.left + b.r.width / 2 < me.x);
        } else site.miiPose(s.pose || null, false);
        if (!(await say(s.say, tok))) return;
        step++;
      }
      if (sec >= ids.length - 1) { stop(true); return; }
      sec++; step = 0;
    }
  };
  const resume = () => { const tok = ++run; hush(); play(tok); };

  const start = () => {
    site.tourOn = true;
    site.setState({ tour: true });
    if (site.miiPreload) site.miiPreload();
    if (site.st().focus) site.closeFocus();
    const here = site.st().sel ?? 0;
    // Pick up where it was paused, unless the visitor has since moved to another section.
    if (fresh) { sec = 0; step = 0; } else if (here !== sec) { sec = here; step = 0; }
    fresh = false;
    resume();
  };
  // finished: the tour reached the end, so the next start begins at the top again.
  const stop = (finished?: boolean) => {
    run++;
    site.tourOn = false;
    hush();
    if (site.miiPose) site.miiPose(null);
    const p = site.miiPos ? site.miiPos() : null;
    if (p && !finished) site.miiTo(p.x, p.y); // stop where it is
    if (finished) fresh = true;
    site.setState({ tour: false });
  };
  site.tourToggle = () => { if (site.tourOn) stop(); else start(); };
  site.tourJump = (i: number) => { sec = i; step = 0; resume(); };
  // The iPod's arrows while the tour plays: the next or previous checkpoint, crossing into the neighboring
  // section at either end. Skipping past the last checkpoint ends the tour.
  site.tourStep = (d: number) => {
    let s = sec; let k = step + d;
    while (k < 0 && s > 0) { s--; k += (TOUR[ids[s]] || []).length; }
    while (k >= (TOUR[ids[s]] || []).length && s < ids.length - 1) { k -= (TOUR[ids[s]] || []).length; s++; }
    if (k >= (TOUR[ids[s]] || []).length) { stop(true); return; }
    // Stepping into a new section mid-way: scroll to it here (play() only scrolls when starting a section at its top).
    if (s !== sec && k > 0) site.go(s, true);
    sec = s; step = Math.max(0, k);
    resume();
  };

  // Scrolling by hand: wait until it settles, then carry on from the section now on screen.
  let userT: any = 0;
  const onUser = (e: any) => {
    if (!site.tourOn || site.st().focus) return;
    if (e.type === 'keydown') {
      const t = e.target;
      if (t && t.closest && t.closest('input, textarea')) return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) < 0) return;
    }
    run++; hush(); site.miiPose(null);
    clearTimeout(userT);
    userT = setTimeout(() => {
      if (!site.tourOn || site.st().focus) return;
      const here = site.st().sel ?? 0;
      if (here !== sec) { sec = here; step = 0; }
      resume();
    }, 900);
  };
  window.addEventListener('wheel', onUser, { passive: true });
  window.addEventListener('touchmove', onUser, { passive: true });
  window.addEventListener('keydown', onUser);
  // A focus view opened mid-tour: hold the tour, and pick the step back up once it closes.
  let hadFocus = !!site.st().focus;
  const unsub = site.subscribe(() => {
    const f = !!site.st().focus;
    if (f === hadFocus) return;
    hadFocus = f;
    if (!site.tourOn) return;
    if (f) { run++; hush(); site.miiPose(null); } else { const tok = ++run; setTimeout(() => { if (alive(tok)) play(tok); }, 0); }
  });
  site.tourOff = () => {
    run++;
    site.tourOn = false;
    timers.forEach((t) => clearTimeout(t));
    clearTimeout(userT);
    unsub();
    window.removeEventListener('wheel', onUser);
    window.removeEventListener('touchmove', onUser);
    window.removeEventListener('keydown', onUser);
  };
}
