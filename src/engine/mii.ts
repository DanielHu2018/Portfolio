// The 3D avatar: a portrait on the home screen that steps out to walk to clicks, waves, cheers and dances.
import { AVATAR } from '../data/content';
import { prefersReducedMotion } from './motion';

type Vec = number[];
type RGB = number[];
interface Face { i: number[]; c: RGB }
interface Ball { p: Vec; r: number; c: RGB; head?: boolean }
interface Tube { pts: Vec[]; w: number; c: RGB }
interface Part { v: Vec[]; f: Face[]; b: Ball[]; t?: Tube[] }
interface Colors { skin: RGB; hair: RGB; shirt: RGB }
type Built = Record<'torso' | 'head' | 'armL' | 'armR' | 'legL' | 'legR', Part> & { C: Colors };
interface Rot { x: number; y: number; z: number }
interface Pose { [k: string]: Partial<Rot> }
interface DrawItem {
  z: number;
  col: RGB;
  a?: number;
  pts?: number[][];
  tube?: number[][];
  w?: number;
  ball?: number[];
  line?: number[][];
}

export type MiiReaction = 'wave' | 'cheer';

export interface MiiHandle {
  react: (type: MiiReaction, at?: { x: number; y: number } | null) => void;
  stop: () => void;
}

function miiColors(): Colors {
  const hex = (h: string) => {
    const v = h.slice(1);
    return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
  };
  return { skin: hex(AVATAR.skin), hair: hex(AVATAR.hair), shirt: hex(AVATAR.shirt) };
}

let icoCache: Record<number, number[][][]> = {};

function buildMii(C: Colors): Built {
  const part = (): Part => ({ v: [], f: [], b: [] });
  const add = (m: Part, p: Vec) => { m.v.push(p); return m.v.length - 1; };
  const dim = (c: RGB, k: number) => c.map((x) => Math.round(x * k));
  const lathe = (m: Part, n: number, rings: number[][], col: RGB) => {
    const rs = rings.map((r) => Array.from({ length: n }, (_, k) => { const t = k * Math.PI * 2 / n; return add(m, [Math.cos(t) * r[1], r[0], Math.sin(t) * r[2]]); }));
    for (let j = 0; j < rs.length - 1; j++) for (let k = 0; k < n; k++) { const k2 = (k + 1) % n; m.f.push({ i: [rs[j][k], rs[j][k2], rs[j + 1][k2], rs[j + 1][k]], c: col }); }
    m.f.push({ i: rs[0].slice().reverse(), c: col });
    m.f.push({ i: rs[rs.length - 1].slice(), c: col });
  };
  const ico = (lvl: number) => {
    if (icoCache[lvl]) return icoCache[lvl];
    const t = (1 + Math.sqrt(5)) / 2;
    const vs = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((p) => { const L = Math.hypot(p[0], p[1], p[2]); return p.map((x) => x / L); });
    let fs = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    for (let pass = 0; pass < lvl; pass++) {
      const cache: Record<string, number> = {};
      const mid = (a2: number, b2: number) => {
        const key = a2 < b2 ? a2 + '_' + b2 : b2 + '_' + a2;
        if (cache[key] !== undefined) return cache[key];
        const p = vs[a2].map((x, k) => (x + vs[b2][k]) / 2);
        const L = Math.hypot(p[0], p[1], p[2]);
        vs.push(p.map((x) => x / L));
        cache[key] = vs.length - 1;
        return cache[key];
      };
      const nf: number[][] = [];
      fs.forEach((f) => { const a2 = mid(f[0], f[1]); const b2 = mid(f[1], f[2]); const c2 = mid(f[2], f[0]); nf.push([f[0], a2, c2], [f[1], b2, a2], [f[2], c2, b2], [a2, b2, c2]); });
      fs = nf;
    }
    icoCache = { ...icoCache, [lvl]: fs.map((f) => f.map((k) => vs[k])) };
    return icoCache[lvl];
  };
  const shell = (m: Part, r: number, cx: number, cy: number, cz: number, keep: (n: Vec) => boolean, col: RGB) => {
    ico(3).forEach((tri) => {
      const n = [0, 1, 2].map((k) => (tri[0][k] + tri[1][k] + tri[2][k]) / 3);
      const L = Math.hypot(n[0], n[1], n[2]);
      if (!keep([n[0] / L, n[1] / L, n[2] / L])) return;
      m.f.push({ i: tri.map((p) => add(m, [cx + p[0] * r, cy + p[1] * r, cz + p[2] * r])), c: col });
    });
  };
  const pants = [70, 76, 90];
  const shoe = [244, 246, 250];
  const torso = part();
  lathe(torso, 18, [[0.44, 0.235, 0.17], [0.52, 0.25, 0.18]], pants);
  lathe(torso, 18, [[0.5, 0.255, 0.185], [0.64, 0.25, 0.18], [0.8, 0.265, 0.18], [0.93, 0.25, 0.165], [1.0, 0.16, 0.12], [1.05, 0.06, 0.05]], C.shirt);
  const head = part();
  shell(head, 0.648, 0, 0.56, -0.005, (n) => n[1] > 0.3 || (n[2] < -0.1 && n[1] > -0.5) || (Math.abs(n[0]) > 0.82 && n[1] > -0.12 && n[2] < 0.25), C.hair);
  head.b.push({ p: [0, 0.56, 0], r: 0.62, c: C.skin, head: true });
  head.b.push({ p: [0.6, 0.47, -0.08], r: 0.1, c: dim(C.skin, 0.95) });
  head.b.push({ p: [-0.6, 0.47, -0.08], r: 0.1, c: dim(C.skin, 0.95) });
  const phWhite = [206, 211, 219];
  const phBlue = [176, 182, 192];
  head.t = [{ pts: Array.from({ length: 21 }, (_, k) => { const ang = -1.32 + k * 2.64 / 20; return [Math.sin(ang) * 0.71, 0.53 + Math.cos(ang) * 0.71, -0.02]; }), w: 0.11, c: phWhite }];
  const rr = (w: number, h: number, r: number) => {
    const pts: number[][] = [];
    [[w / 2 - r, h / 2 - r, 0], [-(w / 2 - r), h / 2 - r, 1], [-(w / 2 - r), -(h / 2 - r), 2], [w / 2 - r, -(h / 2 - r), 3]].forEach((c) => {
      for (let k = 0; k <= 5; k++) { const t = (c[2] + k / 5) * Math.PI / 2; pts.push([c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r]); }
    });
    return pts;
  };
  [-1, 1].forEach((sd) => {
    const shape = rr(0.26, 0.34, 0.1);
    const x0 = sd * 0.58; const x1 = sd * 0.76; const xm = sd * 0.7;
    const ring = (x: number, k: number) => shape.map((q) => add(head, [x, 0.48 + q[1] * k, q[0] * k]));
    const a0 = ring(x0, 0.86); const a1 = ring(xm, 1); const a2 = ring(x1, 0.94);
    const n = shape.length;
    for (let k = 0; k < n; k++) {
      const k2 = (k + 1) % n;
      head.f.push({ i: [a0[k], a0[k2], a1[k2], a1[k]], c: [120, 126, 136] });
      head.f.push({ i: [a1[k], a1[k2], a2[k2], a2[k]], c: phWhite });
    }
    head.f.push({ i: a2.slice(), c: phBlue });
  });
  const arm = () => {
    const m = part();
    lathe(m, 12, [[0.03, 0.08, 0.08], [-0.17, 0.076, 0.076]], C.shirt);
    lathe(m, 10, [[-0.16, 0.058, 0.058], [-0.34, 0.056, 0.056]], C.skin);
    m.b.push({ p: [0, -0.4, 0], r: 0.08, c: C.skin });
    return m;
  };
  const leg = () => {
    const m = part();
    lathe(m, 12, [[0.03, 0.095, 0.095], [-0.33, 0.085, 0.085]], pants);
    m.b.push({ p: [0, -0.4, 0.04], r: 0.1, c: shoe });
    return m;
  };
  return { torso, head, armL: arm(), armR: arm(), legL: leg(), legR: leg(), C };
}

/**
 * Starts the avatar on the `.mii-wrap` canvas. Clicks anywhere fire a ripple (`.rip`) and send the avatar
 * walking there; it also mirrors itself into the boot screen's `#boot-mii` canvas while that exists.
 */
export function startMii(opts: { isPlaying: () => boolean; hasFocus: () => boolean }): MiiHandle | null {
  const wrap = document.querySelector<HTMLElement>('.mii-wrap');
  const cv = document.getElementById('mii') as HTMLCanvasElement | null;
  const rips = Array.from(document.querySelectorAll<HTMLElement>('.rip'));
  const ctx = cv && cv.getContext ? cv.getContext('2d') : null;
  if (!wrap || !cv || !ctx) return null;
  const rm = prefersReducedMotion();
  const CW = 240; const CH = 240;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = CW * dpr; cv.height = CH * dpr;
  const st = {
    x: 0, y: 0, tx: 0, ty: 0, walking: false, phase: 0, yaw: 0, lastClick: -1e9, hop: 1, wave: -10, nextWave: 3,
    blink: 0, nextBlink: 2, react: null as MiiReaction | null, reactT: -10, pinned: false, m: 0,
    notes: [] as { t: number; dx: number; g: string; c: string }[], nextNote: 0, pose: null as Record<string, Rot> | null,
  };
  const react = (type: MiiReaction, at?: { x: number; y: number } | null) => {
    const t = performance.now() / 1000;
    if (at) { st.x = st.tx = at.x; st.y = st.ty = at.y; st.lastClick = t; st.walking = false; st.yaw = 0.4; st.pinned = true; }
    if (type === 'wave' && st.react === 'wave' && t - st.reactT < 2.2) return;
    st.react = type; st.reactT = t;
    if (type === 'cheer') st.hop = 0;
  };
  const home = () => {
    const hero = document.getElementById('hero');
    const vw = window.innerWidth; const vh = window.innerHeight;
    const right = vw >= 1100 ? vw - 260 : vw - 20;
    const left = Math.min(vw * 0.48, 700);
    const r = hero ? hero.getBoundingClientRect() : { top: 0, height: vh, bottom: vh };
    const small = vw < 700;
    return { x: small ? vw - 84 : (left + right) / 2, y: r.top + Math.min(r.height, vh) * 0.7, vis: r.top > -vh * 0.35 && r.bottom > vh * 0.65, py: small ? r.top + 150 : r.top + Math.min(r.height, vh) * 0.42 };
  };
  const h0 = home();
  st.m = h0.vis ? 0 : 1;
  if (h0.vis) { st.x = h0.x; st.y = h0.py; } else { st.x = window.innerWidth * 0.5; st.y = window.innerHeight * 0.8; }
  st.tx = st.x; st.ty = st.y;
  let ripIdx = 0;
  const clampT = (x: number, y: number) => [Math.max(50, Math.min(window.innerWidth - 50, x)), Math.max(170, Math.min(window.innerHeight - 8, y))];
  let touchStart: { x: number; y: number; t: number } | null = null;
  type DownEvent = { clientX: number; clientY: number; target: EventTarget | null; pointerType: string; button?: number; _tap?: boolean };
  const onDown = (e: DownEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.pointerType === 'touch' && !e._tap) { touchStart = { x: e.clientX, y: e.clientY, t: performance.now() }; return; }
    const rp = rips[ripIdx % Math.max(1, rips.length)];
    ripIdx++;
    if (rp) {
      rp.classList.remove('go');
      rp.style.left = e.clientX + 'px';
      rp.style.top = e.clientY + 'px';
      void rp.offsetWidth;
      rp.classList.add('go');
    }
    const t = e.target;
    if (t instanceof Element && (t.closest('.focus-root') || t.closest('.boot'))) return;
    const c = clampT(e.clientX, e.clientY);
    st.tx = c[0]; st.ty = c[1];
    st.lastClick = performance.now() / 1000;
    if (rm) { st.x = st.tx; st.y = st.ty; }
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType !== 'touch' || !touchStart) return;
    const moved = Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y);
    const quick = performance.now() - touchStart.t < 350;
    touchStart = null;
    if (moved < 10 && quick) onDown({ clientX: e.clientX, clientY: e.clientY, target: e.target, pointerType: 'touch', _tap: true });
  };
  window.addEventListener('pointerdown', onDown, true);
  window.addEventListener('pointerup', onUp, true);
  const built = buildMii(miiColors());
  let last = performance.now() / 1000;
  let raf = 0;
  const L = (() => { const v = [-0.35, 0.6, 0.72]; const n = Math.hypot(v[0], v[1], v[2]); return v.map((x) => x / n); })();
  let skip = false;
  const frame = (nowMs: number) => {
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
      const sp = Math.min(dist, 230 * dt);
      st.x += dx / dist * sp; st.y += dy / dist * sp;
      st.phase += dt * 10;
      const ty = Math.atan2(dx, dy / Math.sin(0.62));
      const d = ((ty - st.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      st.yaw += d * Math.min(1, dt * 10);
    } else {
      st.walking = false;
      if (wasWalking) st.hop = 0;
      const ty = (st.m > 0.5 ? 0.7 : 0) + Math.sin(now * 0.6) * 0.22;
      const d = ((ty - st.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      st.yaw += d * Math.min(1, dt * 4);
      st.phase = 0;
    }
    if (st.hop < 1) st.hop = Math.min(1, st.hop + dt / 0.38);
    if (!st.walking && st.m > 0.9 && now > st.nextWave) { st.wave = now; st.nextWave = now + 7 + Math.random() * 4; }
    if (now > st.nextBlink) { st.blink = now; st.nextBlink = now + 2.5 + Math.random() * 3; }
    const atHome = hm.vis && !st.walking && Math.hypot(hm.x - st.x, hm.py - st.y) < 10 && now - st.lastClick > 2.5;
    st.m += ((atHome ? 0 : 1) - st.m) * Math.min(1, dt * 4.5);
    if (rm) st.m = atHome ? 0 : 1;
    const m = st.m;
    const lerp = (a: number, b: number) => a + (b - a) * m;
    const S = lerp(118, 40); const AX = 120; const AY = lerp(332, 222);
    const pitch = lerp(0.04, 0.62); const invF = lerp(1 / 9, 0);
    const vw = window.innerWidth;
    const sc = vw < 700 ? lerp(0.55, 0.75) : 1;
    wrap.style.opacity = '1';
    wrap.style.transform = 'translate3d(' + (st.x - AX * sc).toFixed(1) + 'px, ' + (st.y - lerp(128, 222) * sc).toFixed(1) + 'px, 0) scale(' + sc + ')';
    wrap.style.transformOrigin = '0 0';
    const sw = st.walking ? Math.sin(st.phase) : 0;
    let bob = rm ? 0 : (st.walking ? Math.abs(Math.sin(st.phase)) * 0.06 : Math.sin(now * 2.2) * 0.012) + Math.sin(Math.PI * st.hop) * 0.22;
    const waving = !rm && now - st.wave < 1.7 && !st.walking;
    const pose: Pose = {
      legL: { x: sw * 0.6, z: 0 }, legR: { x: -sw * 0.6, z: 0 },
      armL: { x: -sw * 0.55, z: -0.12 - (st.hop < 1 ? Math.sin(Math.PI * st.hop) * 1.2 : 0) },
      armR: { x: sw * 0.55, z: 0.12 + (st.hop < 1 ? Math.sin(Math.PI * st.hop) * 1.2 : 0) },
      head: { y: st.walking ? 0 : Math.sin(now * 0.9) * 0.12, x: st.walking ? 0.05 : Math.sin(now * 1.3) * 0.03 },
    };
    if (waving) { pose.armR = { x: -0.25, z: 2.5 + Math.sin((now - st.wave) * 13) * 0.35 }; }
    const rAge = now - st.reactT;
    const reacting = !rm && st.react && rAge < (st.react === 'cheer' ? 1.5 : 1.9) ? st.react : null;
    if (!reacting) st.react = null;
    const dancing = !rm && !reacting && !st.walking && opts.isPlaying();
    let yawExtra = 0;
    if (reacting === 'wave' && !st.walking) {
      pose.armR = { x: -0.25, z: 2.55 + Math.sin(rAge * 13) * 0.4 };
      pose.head = { y: 0.12, x: -0.04, z: -0.12 };
    } else if (reacting === 'cheer') {
      const k = Math.sin(rAge * 12);
      pose.armL = { x: -0.15, z: -2.7 - k * 0.25 };
      pose.armR = { x: -0.15, z: 2.7 + k * 0.25 };
      pose.head = { y: 0, x: -0.12, z: 0 };
      bob += Math.abs(Math.sin(rAge * Math.PI * 2.4)) * 0.2;
    } else if (dancing) {
      const beat = now * Math.PI * 3.6;
      const up = Math.sin(beat);
      pose.armL = { x: up * 0.45, z: -0.5 - 0.9 * Math.max(0, up) };
      pose.armR = { x: -up * 0.45, z: 0.5 + 0.9 * Math.max(0, -up) };
      pose.legL = { x: Math.max(0, up) * 0.45, z: 0 };
      pose.legR = { x: Math.max(0, -up) * 0.45, z: 0 };
      pose.head = { y: Math.sin(beat / 2) * 0.22, x: 0.04, z: up * 0.16 };
      bob += Math.abs(up) * 0.07;
      yawExtra = Math.sin(beat / 2) * 0.35;
      if (now > st.nextNote) {
        st.nextNote = now + 0.55;
        st.notes.push({ t: now, dx: (Math.random() - 0.5) * 60, g: Math.random() < 0.5 ? '♪' : '♫', c: Math.random() < 0.5 ? '#34BEED' : '#FF6FB5' });
      }
    }
    st.notes = st.notes.filter((nt) => now - nt.t < 1.4);
    const focused = opts.hasFocus();
    if (!focused) st.pinned = false;
    wrap.style.zIndex = (st.pinned && focused) ? '85' : '60';
    const ks = Math.min(1, dt * (st.walking ? 18 : 7));
    if (!st.pose) st.pose = {};
    const curPose = st.pose;
    ['legL', 'legR', 'armL', 'armR', 'head'].forEach((nm) => {
      const tg = pose[nm] || {};
      const cur = curPose[nm] || (curPose[nm] = { x: tg.x || 0, y: tg.y || 0, z: tg.z || 0 });
      (['x', 'y', 'z'] as const).forEach((ax) => { cur[ax] += ((tg[ax] || 0) - cur[ax]) * (rm ? 1 : ks); });
      pose[nm] = { x: cur.x, y: cur.y, z: cur.z };
    });
    const piv: Record<string, Vec> = { torso: [0, 0, 0], head: [0, 1.1, 0], armL: [-0.31, 0.97, 0], armR: [0.31, 0.97, 0], legL: [-0.12, 0.55, 0], legR: [0.12, 0.55, 0] };
    const cyw = Math.cos(st.yaw + yawExtra); const syw = Math.sin(st.yaw + yawExtra);
    const cp = Math.cos(pitch); const spc = Math.sin(pitch);
    const toCam = (p: Vec) => {
      const x = p[0] * cyw + p[2] * syw;
      let z = -p[0] * syw + p[2] * cyw;
      const y = p[1] + bob;
      const y2 = y * cp - z * spc;
      z = y * spc + z * cp;
      return [x, y2, z];
    };
    const proj = (q: Vec) => { const pf = 1 / (1 - q[2] * invF); return [AX + q[0] * S * pf, AY - q[1] * S * pf, q[2]]; };
    const local = (p: Vec, ps: Vec, name: string) => {
      const r = pose[name] || { x: 0, z: 0, y: 0 };
      let x = p[0]; let y = p[1]; let z = p[2];
      if (r.y) { const c = Math.cos(r.y); const s2 = Math.sin(r.y); const x2 = x * c + z * s2; z = -x * s2 + z * c; x = x2; }
      if (r.x) { const c = Math.cos(r.x); const s2 = Math.sin(r.x); const y2 = y * c - z * s2; z = y * s2 + z * c; y = y2; }
      if (r.z) { const c = Math.cos(r.z); const s2 = Math.sin(r.z); const x2 = x * c - y * s2; y = x * s2 + y * c; x = x2; }
      return [x + ps[0], y + ps[1], z + ps[2]];
    };
    const items: DrawItem[] = [];
    (['torso', 'head', 'armL', 'armR', 'legL', 'legR'] as const).forEach((name) => {
      const prt = built[name];
      const P = prt.v.map((v) => toCam(local(v, piv[name], name)));
      prt.f.forEach((f) => {
        const a = P[f.i[0]]; const b = P[f.i[1]]; const c = P[f.i[2]];
        const ux = b[0] - a[0]; const uy = b[1] - a[1]; const uz = b[2] - a[2];
        const vx = c[0] - a[0]; const vy = c[1] - a[1]; const vz = c[2] - a[2];
        const nx = uy * vz - uz * vy; const ny = uz * vx - ux * vz; const nz = ux * vy - uy * vx;
        const nl = Math.hypot(nx, ny, nz) || 1;
        const lit = 0.74 + 0.3 * Math.abs((nx * L[0] + ny * L[1] + nz * L[2]) / nl);
        let z = 0; f.i.forEach((kk) => { z += P[kk][2]; });
        items.push({ z: z / f.i.length, pts: f.i.map((kk) => proj(P[kk])), col: f.c.map((v) => Math.min(255, Math.round(v * lit))) });
      });
      (prt.t || []).forEach((tb) => {
        const Q = tb.pts.map((pt) => toCam(local(pt, piv[name], name)));
        const zs = Q.reduce((a, q) => a + q[2], 0) / Q.length;
        items.push({ z: zs + 1, tube: Q.map(proj), w: tb.w * S, col: tb.c });
      });
      prt.b.forEach((bl) => {
        const q = toCam(local(bl.p, piv[name], name));
        const pq = proj(q);
        const pf = 1 / (1 - q[2] * invF);
        items.push({ z: q[2] + (bl.head ? 0 : 0.001), ball: [pq[0], pq[1], bl.r * S * pf], col: bl.c });
      });
    });
    const HC = 0.56; const HR = 0.62;
    const onHead = (x: number, y: number, lift?: number) => {
      const nx = x / HR; const ny = (y - HC) / HR;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      return [x, y, nz * HR + (lift || 0.006)];
    };
    const headPts = (pts: Vec[]) => pts.map((p) => toCam(local(p, piv.head, 'head')));
    const hcCam = headPts([[0, HC, 0]])[0];
    const facing = (pts3: Vec[]) => {
      const ctr = pts3.reduce((a, p) => [a[0] + p[0] / pts3.length, a[1] + p[1] / pts3.length, a[2] + p[2] / pts3.length], [0, 0, 0]);
      const cc = headPts([ctr])[0];
      return { ok: cc[2] - hcCam[2] > HR * 0.18, z: cc[2] };
    };
    const ell = (cx: number, cy: number, rx: number, ry: number) => {
      const pts: number[][] = [];
      for (let k = 0; k < 14; k++) {
        const t = k * Math.PI * 2 / 14;
        pts.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]);
      }
      return pts;
    };
    const poly = (pts2: number[][], col: RGB, lift: number, bias: number) => {
      const p3 = pts2.map((p) => onHead(p[0], p[1], lift));
      const fc = facing(p3);
      if (!fc.ok) return;
      items.push({ z: fc.z + 0.6 + bias, pts: headPts(p3).map(proj), col });
    };
    const line = (pts2: number[][], col: RGB, w: number, lift: number, bias: number) => {
      const p3 = pts2.map((p) => onHead(p[0], p[1], lift));
      const fc = facing(p3);
      if (!fc.ok) return;
      items.push({ z: fc.z + 0.6 + bias, line: headPts(p3).map(proj), col, w });
    };
    const blink = now - st.blink < 0.14;
    const dark = [38, 34, 32];
    [-1, 1].forEach((sd) => {
      const ex = sd * 0.2; const ey = 0.57;
      if (blink) {
        line([[ex - 0.05, ey], [ex, ey - 0.018], [ex + 0.05, ey]], dark, 3, 0.008, 0.02);
      } else {
        poly(ell(ex, ey, 0.045, 0.075), dark, 0.008, 0.02);
      }
      line([[ex - 0.06, 0.71], [ex, 0.725], [ex + 0.06, 0.712]], built.C.hair, 2.6, 0.04, 0.3);
    });
    const mouth: number[][] = [];
    for (let k = 0; k <= 6; k++) { const x = -0.09 + k * 0.18 / 6; mouth.push([x, 0.36 - 0.035 * (1 - Math.pow(x / 0.09, 2))]); }
    line(mouth, [120, 62, 56], 2.4, 0.008, 0.01);
    poly([[-0.58, 0.68], [-0.42, 0.8], [-0.2, 0.86], [0.05, 0.875], [0.3, 0.85], [0.5, 0.79], [0.6, 0.75], [0.52, 0.765], [0.36, 0.81], [0.18, 0.805], [0.04, 0.84], [-0.12, 0.825], [-0.3, 0.805], [-0.46, 0.74]], built.C.hair, 0.035, 0.04);
    items.sort((a, b) => a.z - b.z);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CW, CH);
    const hopLift = Math.sin(Math.PI * st.hop);
    ctx.save();
    if (m < 0.999) {
      const R = 100 + m * 260;
      ctx.globalAlpha = 1 - m;
      const g = ctx.createLinearGradient(0, 28, 0, 228);
      g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#BDEBFB');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(120, 128, 100, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = '#D5DAE1'; ctx.stroke();
      ctx.lineWidth = 3; ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(120, 128, 95, Math.PI * 1.1, Math.PI * 1.55); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(120, 128, Math.min(R, 400) - 2, 0, Math.PI * 2); ctx.clip();
    }
    if (m > 0.02) {
      ctx.globalAlpha = m;
      const rr = 17 - hopLift * 5;
      const sg = ctx.createRadialGradient(AX, AY, 0, AX, AY, rr);
      sg.addColorStop(0, 'rgba(60, 64, 70, ' + (0.3 - hopLift * 0.12).toFixed(3) + ')');
      sg.addColorStop(0.7, 'rgba(60, 64, 70, ' + (0.18 - hopLift * 0.08).toFixed(3) + ')');
      sg.addColorStop(1, 'rgba(60, 64, 70, 0)');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(AX, AY, rr, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.lineJoin = 'round';
    items.forEach((it) => {
      const col = 'rgb(' + it.col.join(',') + ')';
      ctx.globalAlpha = it.a === undefined ? 1 : it.a;
      if (it.tube) {
        const w = it.w!;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgb(' + it.col.map((v) => Math.round(v * 0.82)).join(',') + ')';
        ctx.lineWidth = w;
        ctx.beginPath(); it.tube.forEach((q, j) => { if (j === 0) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); }); ctx.stroke();
        ctx.strokeStyle = col; ctx.lineWidth = w * 0.7;
        ctx.beginPath(); it.tube.forEach((q, j) => { if (j === 0) ctx.moveTo(q[0], q[1] - w * 0.08); else ctx.lineTo(q[0], q[1] - w * 0.08); }); ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; ctx.lineWidth = w * 0.22;
        ctx.beginPath(); it.tube.forEach((q, j) => { if (j === 0) ctx.moveTo(q[0], q[1] - w * 0.22); else ctx.lineTo(q[0], q[1] - w * 0.22); }); ctx.stroke();
        return;
      }
      if (it.ball) {
        const bx = it.ball[0]; const by = it.ball[1]; const br = it.ball[2];
        const lite = 'rgb(' + it.col.map((v) => Math.min(255, Math.round(v + (255 - v) * 0.45))).join(',') + ')';
        const shade = 'rgb(' + it.col.map((v) => Math.round(v * 0.8)).join(',') + ')';
        const g = ctx.createRadialGradient(bx - br * 0.35, by - br * 0.4, br * 0.05, bx, by, br);
        g.addColorStop(0, lite); g.addColorStop(0.5, col); g.addColorStop(1, shade);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
        return;
      }
      if (it.line) {
        ctx.strokeStyle = col; ctx.lineWidth = (it.w || 2.2) * S / 62; ctx.lineCap = 'round';
        ctx.beginPath(); it.line.forEach((p, j) => { if (j === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }); ctx.stroke();
        return;
      }
      ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 0.6;
      ctx.beginPath(); it.pts!.forEach((p, j) => { if (j === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }); ctx.closePath();
      if (it.a === undefined) { ctx.fill(); ctx.stroke(); } else ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (st.notes.length) {
      const headY = AY - (1.66 + 0.75) * S;
      ctx.textAlign = 'center';
      st.notes.forEach((nt) => {
        const a = (now - nt.t) / 1.4;
        ctx.globalAlpha = Math.max(0, 1 - a);
        ctx.fillStyle = nt.c;
        ctx.font = '700 ' + Math.round(14 + S * 0.12) + 'px sans-serif';
        ctx.fillText(nt.g, AX + nt.dx * (0.5 + a), Math.max(18, headY + 20 - a * 40));
      });
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    const bc = document.getElementById('boot-mii') as HTMLCanvasElement | null;
    const bx = bc ? bc.getContext('2d') : null;
    if (bc && bx) {
      bx.clearRect(0, 0, bc.width, bc.height);
      bx.drawImage(cv, 8 * dpr, 16 * dpr, 224 * dpr, 224 * dpr, 0, 0, bc.width, bc.height);
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return {
    react,
    stop: () => { cancelAnimationFrame(raf); window.removeEventListener('pointerdown', onDown, true); window.removeEventListener('pointerup', onUp, true); },
  };
}
