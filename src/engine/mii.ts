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
  const SPR: any = { still: ['avatar/avatar_idle.png', 481], blink: ['avatar/avatar_blink.png', 481], idle: ['web/avatar/avatar_idle.webp', 481], wave: ['web/avatar/avatar_waving.webp', 481], dance: ['web/avatar/avatar_dancing.webp', 496], cheer: ['web/avatar/avatar_celebration.webp', 493] };
  const DIRS: any = [[0, '12'], [30, '1'], [60, '2'], [75, '230'], [90, '3'], [105, '330'], [120, '4'], [150, '5'], [180, '6'], [210, '7'], [240, '8'], [255, '830'], [270, '9'], [285, '930'], [300, '10'], [330, '11']];
  DIRS.forEach((d: any) => { SPR['walk' + d[1]] = ['web/avatar/avatar_walking_' + d[1] + 'oclock.webp', 461]; });
  const imgs: any = {};
  const load = (k: any) => { if (!imgs[k]) { const im = new Image(); im.decoding = 'async'; im.src = BASE + SPR[k][0]; imgs[k] = im; } return imgs[k]; };
  ['still', 'blink', 'idle', 'wave', 'cheer'].forEach(load);
  const preload = setTimeout(() => { Object.keys(SPR).forEach(load); }, 1200);
  const ready = (k: any) => { const im = load(k); return im.complete && im.naturalWidth > 0; };
  let cur: any = '';
  const st: any = { x: 0, y: 0, tx: 0, ty: 0, walking: false, head: 180, dir: '6', lastClick: -1e9, hop: 1, wave: -10, nextWave: 3, blink: 0, nextBlink: 2, react: null, reactT: -10, notes: [], nextNote: 0 };
  site.miiReact = (type, at) => {
    const t = performance.now() / 1000;
    if (at) { st.x = st.tx = at.x; st.y = st.ty = at.y; st.lastClick = t; st.walking = false; st.pinned = true; }
    if (type === 'wave' && st.react === 'wave' && t - st.reactT < 2.2) return;
    st.react = type; st.reactT = t;
  };
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
  const clampT = (x: any, y: any) => [Math.max(50, Math.min(window.innerWidth - 50, x)), Math.max(170, Math.min(window.innerHeight - 8, y))];
  let touchStart: any = null;
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
    if (hm.vis && now - st.lastClick > 2.5 && !st.walking) {
      if (Math.hypot(hm.x - st.x, hm.py - st.y) > 8) { st.tx = hm.x; st.ty = hm.py; }
    }
    const dx = st.tx - st.x; const dy = st.ty - st.y;
    const dist = Math.hypot(dx, dy);
    const wasWalking = st.walking;
    if (dist > 3 && !rm) {
      st.walking = true;
      const sp = Math.min(dist, 150 * dt);
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
    if (!st.walking && st.m > 0.9 && now > st.nextWave) { st.wave = now; st.nextWave = now + 7 + Math.random() * 4; }
    if (now > st.nextBlink) { st.blink = now; st.nextBlink = now + 2.5 + Math.random() * 3; }
    const atHome = hm.vis && !st.walking && Math.hypot(hm.x - st.x, hm.py - st.y) < 10 && now - st.lastClick > 2.5;
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
    const react = !rm && st.react && rAge < (st.react === 'cheer' ? 2.2 : 1.9) ? st.react : null;
    if (!react) st.react = null;
    const dancing = !rm && !react && !st.walking && !!(site.st().np && site.st().np.playing);
    const hopLift = Math.sin(Math.PI * st.hop);
    let bob = rm ? 0 : hopLift * 9;
    if (dancing && now > st.nextNote) {
      st.nextNote = now + 0.55;
      st.notes.push({ t: now, dx: (Math.random() - 0.5) * 60, g: Math.random() < 0.5 ? '♪' : '♫', c: Math.random() < 0.5 ? '#34BEED' : '#FF6FB5' });
    }
    st.notes = st.notes.filter((nt: any) => now - nt.t < 1.4);
    if (!site.st().focus) st.pinned = false;
    wrap.style.zIndex = (st.pinned && site.st().focus) ? '85' : '60';
    const blink = now - st.blink < 0.14;
    let want;
    if (rm) want = blink ? 'blink' : 'still';
    else if (st.walking) want = 'walk' + st.dir;
    else if (react === 'cheer') want = 'cheer';
    else if (react || waving) want = 'wave';
    else if (dancing) want = 'dance';
    else want = 'idle';
    if (!ready(want)) want = st.walking || !ready('idle') ? (cur && ready(cur) ? cur : 'still') : 'idle';
    if (want !== cur) { spr.src = BASE + SPR[want][0]; cur = want; }
    const fb = SPR[cur][1];
    const left = AX - 256 * K; const top = AY - fb * K - bob;
    spr.style.transform = 'translate(' + left.toFixed(2) + 'px, ' + top.toFixed(2) + 'px) scale(' + K.toFixed(4) + ')';
    const R = Math.min(100 + m * 260, 400) - 2;
    spr.style.clipPath = m < 0.999 ? 'circle(' + (R / K).toFixed(1) + 'px at ' + ((120 - left) / K).toFixed(1) + 'px ' + ((128 - top) / K).toFixed(1) + 'px)' : 'none';
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
