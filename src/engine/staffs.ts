import type { SiteController } from '../site/controller';
import { initHobbies, drawHobbies } from './hobbies';

declare const document: any;
declare const window: any;

export function initStaffs(site: SiteController) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const cfg: any = {
    'stf-hero': [
      { y: 0.22, amp: 46, len: 0.55, slide: 40, rev: false, seed: 1, count: 7, gap: 13, depth: 140 },
      { y: 0.8, amp: 36, len: 0.4, slide: 55, rev: true, seed: 3, count: 6, gap: 12, depth: 110 }
    ],
    'stf-work': [
      { y: 0.46, amp: 70, len: 0.8, slide: 50, rev: false, seed: 4, count: 8, gap: 15, depth: 180 }
    ],
    'stf-off': [
      { y: 0.14, amp: 40, len: 0.5, slide: 45, rev: true, seed: 7, count: 7, gap: 12, depth: 120 }
    ],
    'stf-skills': [
      { y: 0.15, amp: 46, len: 0.5, slide: 44, rev: false, seed: 9, count: 7, gap: 13, depth: 150 }
    ],
    'stf-contact': [
      { y: 0.24, amp: 46, len: 0.5, slide: 48, rev: false, seed: 5, count: 6, gap: 13, depth: 140 },
      { y: 0.82, amp: 32, len: 0.7, slide: 65, rev: true, seed: 6, count: 5, gap: 12, depth: 110 }
    ]
  };
  site.stf = Object.keys(cfg).map((id) => ({ el: document.getElementById(id), staves: cfg[id] })).filter((c) => c.el && c.el.getContext);
  const size = () => {
    site.stf.forEach((c: any) => {
      const dpr = Math.min(1, window.devicePixelRatio || 1) * 0.8 * (site.pageZoom || 1);
      c.w = c.el.clientWidth;
      c.h = c.el.clientHeight;
      c.el.width = Math.max(1, Math.round(c.w * dpr));
      c.el.height = Math.max(1, Math.round(c.h * dpr));
      c.dpr = dpr;
      c.ctx = c.el.getContext('2d');
    });
  };
  size();
  let rm = false;
  try { rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { rm = false; }
  site.onResize = () => { size(); if (rm) drawAll(site, 0, true); };
  window.addEventListener('resize', site.onResize);
  initHobbies(site);
  if (rm) { drawAll(site, 0, true); return; }
  const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  let flip = false;
  const loop = (now: any) => {
    flip = !flip;
    if (flip && !(site.st().focus && site.st().focus.kind !== 'hobby')) drawAll(site, (now - t0) / 1000, false);
    site.raf = requestAnimationFrame(loop);
  };
  site.raf = requestAnimationFrame(loop);
}

export function drawAll(site: SiteController, t: any, force: any) {
  const vh = window.innerHeight || 800;
  (site.stf || []).forEach((c: any) => {
    if (!c.ctx) return;
    const r = c.el.getBoundingClientRect();
    if (!force && (r.bottom < -60 || r.top > vh + 60)) return;
    c.ctx.setTransform(c.dpr, 0, 0, c.dpr, 0, 0);
    c.ctx.clearRect(0, 0, c.w, c.h);
    c.staves.forEach((st: any) => drawStaff(site, c, st, t));
  });
  drawHobbies(site, t, force);
}

// @ts-expect-error unused, kept for a uniform engine signature
export function drawStaff(site: SiteController, c: any, st: any, t: any) {
  const ctx = c.ctx;
  const W = c.w;
  const H = c.h;
  const dpr = c.dpr;
  if (!W || !H) return;
  const L = Math.max(200, W * st.len);
  const k = Math.PI * 2 / L;
  const sd = st.seed;
  const D = 900;
  const slide = (st.rev ? -1 : 1) * (t / st.slide) * W;
  const baseY = st.y * H;
  const center = (x: any) => {
    const s = x + slide;
    return {
      y: st.amp * Math.sin(k * s + t * 0.9 + sd) + st.amp * 0.35 * Math.sin(2.1 * k * s - t * 1.7 + sd * 2),
      z: st.depth * Math.sin(0.7 * k * s + t * 0.6 + sd * 1.3),
      phi: 1.35 * Math.sin(0.5 * k * s - t * 0.8 + sd) + 0.4 * Math.sin(1.3 * k * s + t * 1.1)
    };
  };
  const proj = (x: any, y: any, z: any) => {
    const p = D / (D + z);
    return [W / 2 + (x - W / 2) * p, baseY + y * p, p];
  };
  const offs = [-2, -1, 0, 1, 2].map((o) => o * st.gap);
  const N = 60;
  const x0 = -80;
  const x1 = W + 80;
  const pts: any = offs.map(() => []);
  const faces = [];
  for (let i = 0; i <= N; i++) {
    const x = x0 + (x1 - x0) * i / N;
    const cc = center(x);
    const cp = Math.cos(cc.phi);
    const sp = Math.sin(cc.phi);
    faces.push(cp);
    offs.forEach((o, j) => pts[j].push(proj(x, cc.y + o * cp, cc.z + o * sp)));
  }
  for (let i = 0; i < N; i++) {
    const f = faces[i];
    const a = 0.07 + 0.17 * Math.abs(f);
    ctx.fillStyle = f >= 0 ? 'rgba(126, 211, 245, ' + a.toFixed(3) + ')' : 'rgba(246, 160, 210, ' + a.toFixed(3) + ')';
    const top = pts[0];
    const bot = pts[4];
    ctx.beginPath();
    ctx.moveTo(top[i][0], top[i][1]);
    ctx.lineTo(top[i + 1][0], top[i + 1][1]);
    ctx.lineTo(bot[i + 1][0], bot[i + 1][1]);
    ctx.lineTo(bot[i][0], bot[i][1]);
    ctx.closePath();
    ctx.fill();
  }
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#4FB2E6');
  grad.addColorStop(0.25, '#97A6BA');
  grad.addColorStop(0.5, '#EE6FB0');
  grad.addColorStop(0.75, '#97A6BA');
  grad.addColorStop(1, '#4FB2E6');
  ctx.strokeStyle = grad;
  ctx.lineJoin = 'round';
  pts.forEach((line: any, j: any) => {
    ctx.lineWidth = (j === 0 || j === 4) ? 2.2 : 1.6;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    line.forEach((pt: any, i: any) => { if (i === 0) ctx.moveTo(pt[0], pt[1]); else ctx.lineTo(pt[0], pt[1]); });
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  const stops: any = [[0, [79, 178, 230]], [0.25, [151, 166, 186]], [0.5, [238, 111, 176]], [0.75, [151, 166, 186]], [1, [79, 178, 230]]];
  const lineColor = (u: any) => {
    for (let q = 0; q < stops.length - 1; q++) {
      const s0 = stops[q];
      const s1 = stops[q + 1];
      if (u <= s1[0]) {
        const f = (u - s0[0]) / (s1[0] - s0[0]);
        return [0, 1, 2].map((ch) => Math.round(s0[1][ch] + (s1[1][ch] - s0[1][ch]) * f));
      }
    }
    return stops[stops.length - 1][1];
  };
  const steps = [-3, -1, 2, 0, -2, 1, 3, -1, 1];
  const span = x1 - x0;
  const notes: any = [];
  for (let i = 0; i < st.count; i++) {
    const m = (span / st.count) * i + ((i * 47 + sd * 31) % 90);
    let x = ((m - slide) % span + span) % span + x0;
    const cc = center(x);
    const o = steps[(i * 3 + sd) % steps.length] * st.gap / 2 + Math.sin(t * 4.2 + i * 1.7) * 3;
    const cp = Math.cos(cc.phi);
    const sp = Math.sin(cc.phi);
    const a = proj(x, cc.y + o * cp, cc.z + o * sp);
    const cc2 = center(x + 3);
    const b = proj(x + 3, cc2.y + o * Math.cos(cc2.phi), cc2.z + o * Math.sin(cc2.phi));
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const kind = ['q', 'e', 'b', 'e', 'q'][(i + sd) % 5];
    const rgb = lineColor(Math.min(1, Math.max(0, a[0] / W)));
    const spin = (i + sd) % 4 === 2 ? Math.cos(t * 1.6 + i) : 1;
    const sy = Math.sign(cp || 1) * Math.max(0.2, Math.abs(cp));
    const sxs = (Math.abs(spin) < 0.12 ? 0.12 * Math.sign(spin || 1) : spin);
    const scale = a[2] * (st.gap / 13);
    notes.push({ z: cc.z, a: a, ang: ang, sx: sxs * scale, sy: sy * scale, scale: scale, kind: kind, rgb: rgb, face: cp });
  }
  notes.sort((n1: any, n2: any) => n2.z - n1.z);
  notes.forEach((n: any) => {
    const ca = Math.cos(n.ang);
    const sa = Math.sin(n.ang);
    const col = 'rgb(' + n.rgb.join(', ') + ')';
    const tint = 'rgba(' + n.rgb.join(', ') + ', ' + (0.18 + 0.2 * Math.abs(n.face)).toFixed(3) + ')';
    ctx.globalAlpha = Math.min(1, 0.6 + 0.4 * n.a[2]);
    ctx.setTransform(dpr * ca * n.sx, dpr * sa * n.sx, -dpr * sa * n.sy, dpr * ca * n.sy, dpr * n.a[0], dpr * n.a[1]);
    const lw = 1 / Math.max(0.35, n.scale);
    const heads = n.kind === 'b' ? [[0, 0], [28, -7]] : [[0, 0]];
    ctx.strokeStyle = col;
    ctx.fillStyle = tint;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    heads.forEach((hd) => {
      ctx.beginPath();
      ctx.ellipse(hd[0], hd[1], 8.5, 6, -22 * Math.PI / 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2 * lw;
      ctx.stroke();
    });
    ctx.lineWidth = 1.8 * lw;
    ctx.beginPath();
    ctx.moveTo(7.6, -2);
    ctx.lineTo(7.6, -38);
    if (n.kind === 'e') {
      ctx.moveTo(7.6, -38);
      ctx.bezierCurveTo(14, -33, 18, -26, 14, -17);
    }
    if (n.kind === 'b') {
      ctx.moveTo(35.6, -9);
      ctx.lineTo(35.6, -45);
    }
    ctx.stroke();
    if (n.kind === 'b') {
      ctx.lineWidth = 3 * lw;
      ctx.beginPath();
      ctx.moveTo(7.6, -38);
      ctx.lineTo(35.6, -45);
      ctx.stroke();
    }
  });
  ctx.globalAlpha = 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
