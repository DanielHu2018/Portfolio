import type { SiteController } from '../site/controller';

declare const document: any;
declare const window: any;

export function initMii(site: SiteController) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const wrap = document.querySelector('.mii-wrap');
  const cv = document.getElementById('mii');
  const spr = wrap ? wrap.querySelector('.mii-sprite') : null;
  const rips = Array.prototype.slice.call(document.querySelectorAll('.rip'));
  if (!wrap || !cv || !cv.getContext || !spr) return;
  let rm = false;
  try { rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { rm = false; }
  const ctx = cv.getContext('2d');
  const CW = 240; const CH = 240;
  const dpr = Math.min(3, (window.devicePixelRatio || 1) * (site.pageZoom || 1));
  cv.width = CW * dpr; cv.height = CH * dpr;
  // Sprites: PNGs in public/assets/avatar, animations as lossless WebP in public/assets/web/avatar (scripts/optimize-images.py); 512px frames (the PNGs are the same framing at 1194px).
  // fb is the feet baseline in 512px frame units, so each animation stands on the same spot.
  const BASE = '/assets/';
  const SPR: any = { still: ['avatar/avatar_idle.png', 481], blink: ['avatar/avatar_blink.png', 481], idle: ['web/avatar/avatar_idle.webp', 481], wave: ['web/avatar/avatar_waving.webp', 481], dance: ['web/avatar/avatar_dancing.webp', 496], cheer: ['web/avatar/avatar_celebration.webp', 493],
    look: ['web/avatar/avatar_look_right.webp', 496], sit: ['web/avatar/avatar_sitting.webp', 507], spin: ['web/avatar/avatar_spinning_celebration.webp', 496], toetap: ['web/avatar/avatar_toetap.webp', 499], scratch: ['web/avatar/avatar_scratchhead.webp', 496], fight: ['web/avatar/avatar_fighterstance.webp', 509] };
  // Poses used by focus views and the tour: loaded when first needed (or when the tour starts), not on every visit.
  const LAZY = ['look', 'sit', 'spin', 'toetap', 'scratch', 'fight'];
  // How long a one-off reaction plays (seconds): one loop of its sprite.
  const REACT_LEN: any = { cheer: 2.2, wave: 1.9, dance: 2.6, spin: 3.96, scratch: 2.2, fight: 1.32, toetap: 1.64, look: 3.96, sit: 2.64 };
  const DIRS: any = [[0, '12'], [30, '1'], [60, '2'], [75, '230'], [90, '3'], [105, '330'], [120, '4'], [150, '5'], [180, '6'], [210, '7'], [240, '8'], [255, '830'], [270, '9'], [285, '930'], [300, '10'], [330, '11']];
  DIRS.forEach((d: any) => { SPR['walk' + d[1]] = ['web/avatar/avatar_walking_' + d[1] + 'oclock.webp', 461]; });
  const imgs: any = {};
  const load = (k: any) => { if (!imgs[k]) { const im = new Image(); im.decoding = 'async'; im.src = BASE + SPR[k][0]; imgs[k] = im; } return imgs[k]; };
  ['still', 'blink', 'idle', 'wave', 'cheer'].forEach(load);
  const preload = setTimeout(() => { Object.keys(SPR).forEach((k) => { if (LAZY.indexOf(k) < 0) load(k); }); }, 1200);
  const ready = (k: any) => { const im = load(k); return im.complete && im.naturalWidth > 0; };
  let cur: any = '';
  const st: any = { x: 0, y: 0, tx: 0, ty: 0, walking: false, head: 180, dir: '6', lastClick: -1e9, hop: 1, wave: -10, nextWave: 3, blink: 0, nextBlink: 2, react: null, reactT: -10, notes: [], nextNote: 0 };
  // type: a one-off reaction (cheer, wave, spin...), or null. at: stand there while the focus view is open,
  // holding opts.hold (a looping pose) once the reaction ends; opts.flip mirrors that pose.
  site.miiReact = (type, at, opts) => {
    const t = performance.now() / 1000;
    if (at) { st.x = st.tx = at.x; st.y = st.ty = at.y; st.lastClick = t; st.walking = false; st.pinned = true; st.pending = null; st.hold = (opts && opts.hold) || null; st.flip = !!(opts && opts.flip); }
    if (st.hold) load(st.hold);
    if (!type) { if (at) st.react = null; return; }
    if (type === 'wave' && st.react === 'wave' && t - st.reactT < 2.2) return;
    load(type);
    st.react = type; st.reactT = t; st.reactFlip = false;
  };
  // Tour hooks (engine/tour.ts drives these).
  site.miiTo = (x: number, y: number) => {
    const c = clampT(x, y, 230);
    st.tx = c[0]; st.ty = c[1];
    st.lastClick = performance.now() / 1000;
    if (rm) { st.x = st.tx; st.y = st.ty; }
  };
  site.miiPos = () => ({ x: st.x, y: st.y, done: !st.walking && Math.hypot(st.tx - st.x, st.ty - st.y) < 4 });
  site.miiPose = (pose: string | null, flip?: boolean) => { st.tourPose = pose; st.tourFlip = !!flip; if (pose) load(pose); };
  site.miiPreload = () => LAZY.forEach(load);
  const home = () => {
    const hero = document.getElementById('hero');
    const vw = window.innerWidth; const vh = window.innerHeight;
    const Z = site.pageZoom || 1;
    const right = vw >= 1100 ? vw - 260 * Z : vw - 20;
    const left = Math.min(vw * 0.48, 700 * Z);
    const r = hero ? hero.getBoundingClientRect() : { top: 0, height: vh, bottom: vh };
    const small = vw < 700;
    return { x: small ? vw - 84 : (left + right) / 2, y: r.top + Math.min(r.height, vh) * 0.7, vis: r.top > -vh * 0.35 && r.bottom > vh * 0.65, py: small ? r.top + 150 : r.top + Math.min(r.height, vh) * 0.42 };
  };
  const h0 = home();
  st.m = h0.vis ? 0 : 1;
  if (h0.vis) { st.x = h0.x; st.y = h0.py; } else { st.x = window.innerWidth * 0.5; st.y = window.innerHeight * 0.8; }
  st.tx = st.x; st.ty = st.y;
  let ripIdx = 0;
  const clampT = (x: any, y: any, top?: number) => [Math.max(50, Math.min(window.innerWidth - 50, x)), Math.max(top || 170, Math.min(window.innerHeight - 8, y))];
  const bub = document.querySelector('.mii-bubble');
  let touchStart: any = null;
  // Clicking a control: walk to a spot beside it (so it isn't covered) and react there. Each kind of control
  // gets its own reaction; 'none' leaves the avatar to whatever the click opens (focus views place it, the
  // tour button hands it to the tour). First match wins.
  const CTL = 'a, button, [role="button"], input, textarea, .proj, .photo3d, canvas[id^="hb-"], #globe, .gb-board';
  const RULES: any = [
    ['#globe, .ipod button[aria-pressed], .tour-fab button, a[href="#resume"], .skill-use, .proj:not(a):not(button), .photo3d, canvas[id^="hb-"]', 'none'],
    ['.ipod [aria-label^="Menu"]', 'wave'],
    ['.ipod [aria-label^="Previous"]', 'look'],
    ['.ipod [aria-label^="Next"]', 'toetap'],
    ['.ipod [aria-label="Open highlighted section"]', 'cheer'],
    ['.ipod a', 'look'],
    ['.flow-arrow', 'dance'],
    ['.sp-btn, #off .slab3d button, .np', 'dance'],
    ['[aria-label$="skill category"]', 'scratch'],
    ['.proj-cta', 'spin'],
    ['a[href*="linkedin.com"]', 'wave'],
    ['a[href*="github.com"]', 'fight'],
    ['a[href^="mailto:"]', 'toetap'],
    ['a[href="#hero"]', 'cheer'],
    ['.gb-board', 'cheer'],
    ['.gb-del', 'scratch'],
    ['input, textarea', 'sit'],
    ['#contact button', 'look']
  ];
  const FALLBACK = ['wave', 'toetap', 'look', 'scratch', 'cheer'];
  const poseFor = (el: any) => {
    for (let i = 0; i < RULES.length; i++) if (el.matches(RULES[i][0])) return RULES[i][1];
    const key = (el.getAttribute('aria-label') || el.textContent || '').trim();
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return FALLBACK[h % FALLBACK.length];
  };
  // A spot whose sprite box (about 34px either side of the feet, 118px tall, scaled) stays clear of the
  // control, picked from beside / above / below it, nearest the avatar. Buttons inside an iPod or a row of
  // pills count as the whole iPod or row; for a big area (the guestbook board) it's the click point.
  const spotFor = (el: any, cx: number, cy: number) => {
    const vw = window.innerWidth; const vh = window.innerHeight;
    const k = (vw < 700 ? 0.75 : 1) * (site.pageZoom || 1);
    const half = 34 * k; const tall = 118 * k; const gap = 12 * k;
    const dev = el.closest('.ipod, .slab3d');
    const box = dev || (el.classList.contains('pill') ? el.parentElement : el);
    let r = box.getBoundingClientRect();
    // A big area (the guestbook board): keep clear of the click point rather than the whole thing.
    if (!dev && (r.width > 380 * k || r.height > 280 * k)) r = { left: cx - 20, right: cx + 20, top: cy - 20, bottom: cy + 20 };
    const nav = document.querySelector('.ipod');
    const onNav = box === nav;
    const navR = nav && !onNav ? nav.getBoundingClientRect() : null;
    const ok = (p: any) => {
      if (p[0] < 50 || p[0] > vw - 50 || p[1] < 170 || p[1] > vh - 8) return false;
      if (navR && navR.width && p[0] + half > navR.left && p[0] - half < navR.right && p[1] > navR.top && p[1] - tall < navR.bottom) return false;
      return true;
    };
    const sides = [[r.left - gap - half, r.bottom], [r.right + gap + half, r.bottom]].filter(ok);
    const ends = [[(r.left + r.right) / 2, r.top - gap], [(r.left + r.right) / 2, r.bottom + gap + tall]].filter(ok);
    // The navigator iPod: beside it, only above or below when neither side fits (phones).
    const cands = onNav && sides.length ? sides : sides.concat(ends);
    if (!cands.length) return null;
    cands.sort((a, b) => Math.hypot(a[0] - st.x, a[1] - st.y) - Math.hypot(b[0] - st.x, b[1] - st.y));
    return { x: cands[0][0], y: cands[0][1], cx: (r.left + r.right) / 2 };
  };
  const onDown = (e: any) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.pointerType === 'touch' && !e._tap) { touchStart = { x: e.clientX, y: e.clientY, t: performance.now() }; return; }
    const rp = rips[ripIdx % Math.max(1, rips.length)];
    ripIdx++;
    if (rp) {
      rp.classList.remove('go');
      rp.style.left = e.clientX + 'px';
      rp.style.top = e.clientY + 'px';
      const cols = ['#34BEED', '#FF6FB5', '#FFB020', '#4CD07D', '#A77BFF', '#FFD23F'];
      const bits = rp.children;
      for (let j = 0; j < bits.length; j++) {
        const a = (j / bits.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const d = 36 + Math.random() * 28;
        bits[j].style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
        bits[j].style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
        bits[j].style.setProperty('--r', Math.round(Math.random() * 720 - 360) + 'deg');
        bits[j].style.background = cols[(j + ripIdx) % cols.length];
      }
      void rp.offsetWidth;
      rp.classList.add('go');
    }
    const t = e.target;
    if (t && t.closest && (t.closest('.focus-root') || t.closest('.boot'))) return;
    if (site.tourOn) return; // the tour guide picks where to stand
    st.pending = null;
    const ctl = t && t.closest ? t.closest(CTL) : null;
    if (ctl) {
      const pose = poseFor(ctl);
      if (pose === 'none') return;
      const p = spotFor(ctl, e.clientX, e.clientY);
      if (p) {
        load(pose);
        st.tx = p.x; st.ty = p.y;
        st.lastClick = performance.now() / 1000;
        st.pending = { pose: pose, cx: p.cx };
        if (rm) { st.x = st.tx; st.y = st.ty; }
        return;
      }
    }
    const c = clampT(e.clientX, e.clientY);
    st.tx = c[0]; st.ty = c[1];
    st.lastClick = performance.now() / 1000;
    if (rm) { st.x = st.tx; st.y = st.ty; }
  };
  const onUp = (e: any) => {
    if (e.pointerType !== 'touch' || !touchStart) return;
    const moved = Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y);
    const quick = performance.now() - touchStart.t < 350;
    touchStart = null;
    if (moved < 10 && quick) onDown({ clientX: e.clientX, clientY: e.clientY, target: e.target, pointerType: 'touch', _tap: true });
  };
  window.addEventListener('pointerdown', onDown, true);
  window.addEventListener('pointerup', onUp, true);
  // Portrait (home badge) vs roaming geometry, in the 240px wrap: feet anchor y and sprite scale.
  const AX = 120; const PY = 281; const PK = 0.56; const RY = 222; const RK = 0.24;
  const badge = (c: any, a: any) => {
    c.globalAlpha = a;
    const g = c.createLinearGradient(0, 28, 0, 228);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#BDEBFB');
    c.fillStyle = g;
    c.beginPath(); c.arc(120, 128, 100, 0, Math.PI * 2); c.fill();
    c.lineWidth = 4; c.strokeStyle = '#D5DAE1'; c.stroke();
    c.lineWidth = 3; c.strokeStyle = '#FFFFFF';
    c.beginPath(); c.arc(120, 128, 95, Math.PI * 1.1, Math.PI * 1.55); c.stroke();
    c.globalAlpha = 1;
  };
  let last = performance.now() / 1000;
  let raf = 0;
  let skip = false;
  const frame = (nowMs: any) => {
    const settled = !st.walking && st.hop >= 1 && (st.m < 0.01 || st.m > 0.99) && Math.hypot(st.tx - st.x, st.ty - st.y) < 3;
    skip = settled ? !skip : false;
    if (skip) { raf = requestAnimationFrame(frame); return; }
    const now = nowMs / 1000;
    const dt = Math.min(0.05, Math.max(0, now - last));
    last = now;
    const hm = home();
    const tour = !!site.tourOn;
    if (st.pending && !st.walking && Math.hypot(st.tx - st.x, st.ty - st.y) < 3) {
      // Arrived beside a clicked control: react, facing it for "look".
      st.react = st.pending.pose; st.reactT = now; st.lastClick = now;
      st.reactFlip = st.pending.pose === 'look' && st.pending.cx < st.x;
      st.pending = null;
    }
    const reacting = st.react && now - st.reactT < (REACT_LEN[st.react] || 1.9);
    // Not while it's standing beside a focus view (Resume opens from Home, where the portrait is on screen).
    if (!tour && !reacting && !st.pinned && hm.vis && now - st.lastClick > 2.5 && !st.walking) {
      if (Math.hypot(hm.x - st.x, hm.py - st.y) > 8) { st.tx = hm.x; st.ty = hm.py; }
    }
    // Focus cards reserve a bottom strip on phones for the posing avatar.
    if (st.pinned && site.st().focus && window.innerWidth < 700) {
      const card = document.querySelector('.focus-root [data-focus-card]');
      if (card) {
        const r = card.getBoundingClientRect();
        st.x = st.tx = (r.left + r.right) / 2;
        st.y = st.ty = Math.min(window.innerHeight - 28, r.bottom + (site.st().focus.kind === 'exp' ? 145 : 90));
      }
    }
    const dx = st.tx - st.x; const dy = st.ty - st.y;
    const dist = Math.hypot(dx, dy);
    const wasWalking = st.walking;
    if (dist > 3 && !rm) {
      st.walking = true;
      const sp = Math.min(dist, (tour ? 230 : 150) * dt);
      st.x += dx / dist * sp; st.y += dy / dist * sp;
      // Heading as a clock angle on screen (0 = up, 90 = right), eased so the sprite doesn't flicker.
      const tg = Math.atan2(dx, -dy) * 180 / Math.PI;
      const d = ((tg - st.head + 540) % 360) - 180;
      st.head = (st.head + d * Math.min(1, dt * 12) + 360) % 360;
      let best = DIRS[0]; let bd = 999;
      DIRS.forEach((q: any) => { const e2 = Math.abs(((q[0] - st.head + 540) % 360) - 180); if (e2 < bd) { bd = e2; best = q; } });
      st.dir = best[1];
    } else {
      st.walking = false;
      if (wasWalking) st.hop = 0;
    }
    if (st.hop < 1) st.hop = Math.min(1, st.hop + dt / 0.38);
    if (!tour && !st.walking && st.m > 0.9 && now > st.nextWave) { st.wave = now; st.nextWave = now + 7 + Math.random() * 4; }
    if (now > st.nextBlink) { st.blink = now; st.nextBlink = now + 2.5 + Math.random() * 3; }
    const atHome = !tour && !st.pinned && hm.vis && !st.walking && Math.hypot(hm.x - st.x, hm.py - st.y) < 10 && now - st.lastClick > 2.5;
    st.m += ((atHome ? 0 : 1) - st.m) * Math.min(1, dt * 4.5);
    if (rm) st.m = atHome ? 0 : 1;
    const m = st.m;
    const lerp = (a: any, b: any) => a + (b - a) * m;
    const AY = lerp(PY, RY); const K = lerp(PK, RK);
    const vw = window.innerWidth;
    const sc = (vw < 700 ? lerp(0.55, 0.75) : 1) * (site.pageZoom || 1);
    wrap.style.opacity = '1';
    wrap.style.transform = 'translate3d(' + (st.x - AX * sc).toFixed(1) + 'px, ' + (st.y - lerp(128, 222) * sc).toFixed(1) + 'px, 0) scale(' + sc + ')';
    wrap.style.transformOrigin = '0 0';
    const waving = !rm && now - st.wave < 1.7 && !st.walking;
    const rAge = now - st.reactT;
    const react = !rm && st.react && rAge < (REACT_LEN[st.react] || 1.9) ? st.react : null;
    if (!react) st.react = null;
    const dancing = !rm && !react && !st.walking && !!(site.st().np && site.st().np.playing);
    const hopLift = Math.sin(Math.PI * st.hop);
    let bob = rm ? 0 : hopLift * 9;
    if (dancing && now > st.nextNote) {
      st.nextNote = now + 0.55;
      st.notes.push({ t: now, dx: (Math.random() - 0.5) * 60, g: Math.random() < 0.5 ? '♪' : '♫', c: Math.random() < 0.5 ? '#34BEED' : '#FF6FB5' });
    }
    st.notes = st.notes.filter((nt: any) => now - nt.t < 1.4);
    if (!site.st().focus) { st.pinned = false; st.hold = null; st.flip = false; }
    const held = st.pinned && st.hold ? st.hold : (tour && st.tourPose ? st.tourPose : null);
    wrap.style.zIndex = (st.pinned && site.st().focus) ? '85' : '60';
    const blink = now - st.blink < 0.14;
    let want;
    if (rm) want = blink ? 'blink' : 'still';
    else if (st.walking) want = 'walk' + st.dir;
    else if (react) want = react;
    else if (held) want = held;
    else if (waving) want = 'wave';
    else if (dancing) want = 'dance';
    else want = 'idle';
    if (!ready(want)) want = st.walking || !ready('idle') ? (cur && ready(cur) ? cur : 'still') : 'idle';
    if (want !== cur) { spr.src = BASE + SPR[want][0]; cur = want; }
    const fb = SPR[cur][1];
    // Mirror a held pose (e.g. "look right" turned to look left) when roaming; never in the portrait.
    const flip = !st.walking && m > 0.99 && (react ? cur === react && st.reactFlip : cur === held && (st.pinned && st.hold ? st.flip : st.tourFlip));
    const left = flip ? AX + 256 * K : AX - 256 * K; const top = AY - fb * K - bob;
    spr.style.transform = 'translate(' + left.toFixed(2) + 'px, ' + top.toFixed(2) + 'px) scale(' + (flip ? -K : K).toFixed(4) + ', ' + K.toFixed(4) + ')';
    const R = Math.min(100 + m * 260, 400) - 2;
    spr.style.clipPath = m < 0.999 ? 'circle(' + (R / K).toFixed(1) + 'px at ' + ((120 - left) / K).toFixed(1) + 'px ' + ((128 - top) / K).toFixed(1) + 'px)' : 'none';
    if (bub && bub.classList.contains('on')) {
      // Speech bubble: centered over the head (the sprite's top edge, lower when sitting), kept on screen.
      const Zb = Math.max(0.9, site.pageZoom || 1); // phones shrink the page to 75%; keep the bubble readable
      const headY = st.y + (AY - lerp(128, 222) - (fb - (cur === 'sit' ? 130 : 34)) * K - bob) * sc;
      const bw = bub.offsetWidth * Zb; const bh = bub.offsetHeight * Zb;
      const bx = Math.max(10, Math.min((document.documentElement.clientWidth || vw) - bw - 10, st.x - bw / 2));
      const by = Math.max(8, headY - bh - 14 * Zb);
      bub.style.transform = 'translate3d(' + bx.toFixed(1) + 'px, ' + by.toFixed(1) + 'px, 0) scale(' + Zb + ')';
      bub.style.setProperty('--tx', Math.max(22, Math.min(bw / Zb - 22, (st.x - bx) / Zb)).toFixed(1) + 'px');
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CW, CH);
    if (m < 0.999) badge(ctx, 1 - m);
    if (m > 0.02) {
      ctx.globalAlpha = m;
      const rr = 17 - hopLift * 5;
      ctx.save();
      ctx.translate(AX, AY - 2); ctx.scale(1, 0.42);
      const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, rr * 1.3);
      sg.addColorStop(0, 'rgba(60, 64, 70, ' + (0.3 - hopLift * 0.12).toFixed(3) + ')');
      sg.addColorStop(0.7, 'rgba(60, 64, 70, ' + (0.18 - hopLift * 0.08).toFixed(3) + ')');
      sg.addColorStop(1, 'rgba(60, 64, 70, 0)');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(0, 0, rr * 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    if (st.notes.length) {
      const headY = AY - (fb - 60) * K;
      ctx.textAlign = 'center';
      st.notes.forEach((nt: any) => {
        const a = (now - nt.t) / 1.4;
        ctx.globalAlpha = Math.max(0, 1 - a);
        ctx.fillStyle = nt.c;
        ctx.font = '700 ' + Math.round(14 + K * 24) + 'px sans-serif';
        ctx.fillText(nt.g, AX + nt.dx * (0.5 + a), Math.max(18, headY + 20 - a * 40));
      });
      ctx.globalAlpha = 1;
    }
    const bc = document.getElementById('boot-mii');
    if (bc) {
      // Boot logo: the home portrait badge, drawn from the hi-res still (blinks with the avatar).
      const bx = bc.getContext('2d');
      const k = bc.width / 224;
      bx.setTransform(k, 0, 0, k, -8 * k, -16 * k);
      bx.clearRect(8, 16, 224, 224);
      badge(bx, 1);
      const pic = imgs[blink && ready('blink') ? 'blink' : 'still'];
      if (pic && pic.complete && pic.naturalWidth) {
        bx.save();
        bx.beginPath(); bx.arc(120, 128, 98, 0, Math.PI * 2); bx.clip();
        bx.drawImage(pic, AX - 256 * PK, PY - 481 * PK, 512 * PK, 512 * PK);
        bx.restore();
      }
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  site.miiOff = () => { cancelAnimationFrame(raf); clearTimeout(preload); window.removeEventListener('pointerdown', onDown, true); window.removeEventListener('pointerup', onUp, true); };
}
