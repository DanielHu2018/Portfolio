// Hobby models (guitar, pencil, skis, volleyball): hand-built meshes drawn with flat shading and a painter's sort.
import type { HobbyId } from '../data/content';

type Vec = number[];
type RGB = number[];
interface Face { i: number[]; c: RGB }
interface Mesh { v: Vec[]; f: Face[]; l: Face[] }
export interface HobbyModel { m: Mesh; s: number; tilt: number; sway?: boolean }

export interface HobbyView {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  model: HobbyModel;
  phase: number;
  hx: number; hy: number; tx: number; ty: number;
  over: boolean;
  boost: number;
}

export function buildHobbies(): Record<HobbyId, HobbyModel> {
  const M = (): Mesh => ({ v: [], f: [], l: [] });
  const addV = (m: Mesh, p: Vec) => { m.v.push(p); return m.v.length - 1; };
  const box = (m: Mesh, cx: number, cy: number, cz: number, w: number, h: number, d: number, col: RGB) => {
    const b = addV(m, [cx - w / 2, cy - h / 2, cz - d / 2]);
    [[1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].forEach((q) => addV(m, [cx - w / 2 + q[0] * w, cy - h / 2 + q[1] * h, cz - d / 2 + q[2] * d]));
    [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach((fc) => m.f.push({ i: fc.map((k) => b + k), c: col }));
  };
  const prism = (m: Mesh, poly: number[][], z0: number, z1: number, col: RGB, side?: RGB, tf?: (p: Vec) => Vec) => {
    const T = tf || ((p: Vec) => p);
    const a = poly.map((p) => addV(m, T([p[0], p[1], z0])));
    const b = poly.map((p) => addV(m, T([p[0], p[1], z1])));
    m.f.push({ i: a.slice(), c: side || col });
    m.f.push({ i: b.slice(), c: col });
    for (let k = 0; k < poly.length; k++) {
      const k2 = (k + 1) % poly.length;
      m.f.push({ i: [a[k], a[k2], b[k2], b[k]], c: side || col });
    }
  };
  const ring = (m: Mesh, n: number, r: number, y: number, rot: number, tf: (p: Vec) => Vec) => Array.from({ length: n }, (_, k) => {
    const ang = rot + k * Math.PI * 2 / n;
    return addV(m, tf([Math.cos(ang) * r, y, Math.sin(ang) * r]));
  });
  const tube = (m: Mesh, n: number, r0: number, r1: number, y0: number, y1: number, cols: RGB[], tf: (p: Vec) => Vec, capTop?: RGB, capBot?: RGB) => {
    const a = ring(m, n, r0, y0, 0, tf);
    const b = ring(m, n, r1, y1, 0, tf);
    for (let k = 0; k < n; k++) {
      const k2 = (k + 1) % n;
      m.f.push({ i: [a[k], a[k2], b[k2], b[k]], c: cols[k % cols.length] });
    }
    if (capBot) m.f.push({ i: a.slice(), c: capBot });
    if (capTop) m.f.push({ i: b.slice(), c: capTop });
  };
  const cone = (m: Mesh, n: number, r: number, y0: number, yApex: number, cols: RGB[], tf: (p: Vec) => Vec) => {
    const a = ring(m, n, r, y0, 0, tf);
    const ap = addV(m, tf([0, yApex, 0]));
    for (let k = 0; k < n; k++) m.f.push({ i: [a[k], a[(k + 1) % n], ap], c: cols[k % cols.length] });
  };
  const rotZ = (ang: number, dx: number, dy: number, dz: number) => (p: Vec) => {
    const c = Math.cos(ang); const s = Math.sin(ang);
    return [p[0] * c - p[1] * s + dx, p[0] * s + p[1] * c + dy, p[2] + dz];
  };

  const guitar = M();
  const body = [[-0.30, -0.05], [-0.38, -0.15], [-0.36, -0.35], [-0.42, -0.55], [-0.34, -0.80], [-0.10, -0.92], [0.18, -0.90], [0.36, -0.78], [0.40, -0.55], [0.32, -0.38], [0.38, -0.18], [0.30, -0.02], [0.12, 0.02], [0.0, -0.06], [-0.14, 0.0]];
  prism(guitar, body, -0.07, 0.07, [120, 212, 245], [70, 160, 210]);
  prism(guitar, [[-0.22, -0.12], [0.24, -0.10], [0.28, -0.40], [0.10, -0.62], [-0.20, -0.55], [-0.26, -0.30]], 0.07, 0.085, [244, 245, 248], [210, 214, 220]);
  box(guitar, 0, -0.28, 0.1, 0.26, 0.06, 0.03, [250, 248, 238]);
  box(guitar, 0, -0.46, 0.1, 0.26, 0.06, 0.03, [250, 248, 238]);
  box(guitar, 0, -0.68, 0.095, 0.22, 0.04, 0.03, [196, 202, 212]);
  box(guitar, 0, 0.40, 0.0, 0.10, 0.80, 0.06, [226, 176, 112]);
  box(guitar, 0, 0.40, 0.035, 0.09, 0.80, 0.015, [120, 78, 48]);
  box(guitar, 0, 0.88, 0.0, 0.15, 0.17, 0.05, [60, 64, 70]);
  [-0.025, 0, 0.025].forEach((x) => {
    const a = addV(guitar, [x, -0.68, 0.115]);
    const b = addV(guitar, [x, 0.84, 0.05]);
    guitar.l.push({ i: [a, b], c: [245, 245, 250] });
  });

  const pencil = M();
  const tiltP = rotZ(-0.6, 0, 0, 0);
  const yel = [[255, 210, 63], [240, 186, 30], [255, 224, 110]];
  tube(pencil, 6, 0.12, 0.12, -0.45, 0.45, yel, tiltP);
  tube(pencil, 6, 0.125, 0.125, 0.45, 0.56, [[205, 211, 220], [170, 178, 190]], tiltP);
  tube(pencil, 6, 0.12, 0.11, 0.56, 0.70, [[255, 150, 200], [235, 120, 175]], tiltP, [255, 170, 210]);
  const woodRing = ring(pencil, 6, 0.12, -0.45, 0, tiltP);
  const tipRing = ring(pencil, 6, 0.035, -0.68, 0, tiltP);
  for (let k = 0; k < 6; k++) pencil.f.push({ i: [woodRing[k], woodRing[(k + 1) % 6], tipRing[(k + 1) % 6], tipRing[k]], c: k % 2 ? [246, 220, 172] : [232, 200, 150] });
  cone(pencil, 6, 0.035, -0.68, -0.80, [[60, 64, 70], [40, 42, 48]], tiltP);

  const skis = M();
  const prof = [[-0.86, 0.02], [-0.80, 0], [0.66, 0], [0.82, 0.07], [0.93, 0.17], [0.96, 0.22], [0.92, 0.23], [0.80, 0.11], [0.64, 0.05], [-0.80, 0.05], [-0.88, 0.07]];
  const skiTf = (dx: number, lean: number) => (p: Vec) => {
    const q = [p[2], p[0], p[1]];
    const c = Math.cos(lean); const sn = Math.sin(lean);
    return [q[0] * c - q[1] * sn + dx, q[0] * sn + q[1] * c, q[2]];
  };
  const pink = [255, 138, 196];
  const pinkSide = [206, 82, 146];
  [[-0.14, 0.09], [0.14, -0.09]].forEach((cfg) => {
    prism(skis, prof, -0.08, 0.08, pink, pinkSide, skiTf(cfg[0], cfg[1]));
    prism(skis, [[-0.30, 0.05], [0.30, 0.05], [0.30, 0.058], [-0.30, 0.058]], -0.05, 0.05, [255, 255, 255], [230, 232, 238], skiTf(cfg[0], cfg[1]));
    const T = skiTf(cfg[0], cfg[1]);
    const bind = (y0: number, y1: number, h: number, col: RGB) => {
      const poly = [[y0, 0.05], [y1, 0.05], [y1, 0.05 + h], [y0, 0.05 + h]];
      prism(skis, poly, -0.065, 0.065, col, [40, 42, 48], T);
    };
    bind(-0.18, -0.08, 0.07, [60, 64, 70]);
    bind(0.02, 0.14, 0.09, [60, 64, 70]);
    bind(0.14, 0.18, 0.05, [196, 202, 212]);
  });
  const pole = (x0: number, ang: number) => {
    const tf = (p: Vec) => {
      const c = Math.cos(ang); const sn = Math.sin(ang);
      return [p[0] * c - p[1] * sn + x0, p[0] * sn + p[1] * c - 0.02, p[2] - 0.12];
    };
    tube(skis, 6, 0.02, 0.02, -0.92, 0.80, [[214, 220, 228], [176, 184, 196]], tf);
    tube(skis, 6, 0.035, 0.035, 0.66, 0.92, [[206, 82, 146], [176, 60, 120]], tf, [206, 82, 146]);
    tube(skis, 8, 0.085, 0.085, -0.76, -0.73, [[60, 64, 70], [40, 42, 48]], tf, [60, 64, 70], [60, 64, 70]);
  };
  pole(-0.42, -0.32);
  pole(0.42, 0.32);

  const ball = M();
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((p) => { const L = Math.hypot(p[0], p[1], p[2]); return p.map((x) => x / L); });
  let faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  for (let pass = 0; pass < 3; pass++) {
    const cache: Record<string, number> = {};
    const mid = (a: number, b: number) => {
      const key = a < b ? a + '_' + b : b + '_' + a;
      if (cache[key] !== undefined) return cache[key];
      const p = verts[a].map((x, k) => (x + verts[b][k]) / 2);
      const L = Math.hypot(p[0], p[1], p[2]);
      verts.push(p.map((x) => x / L));
      cache[key] = verts.length - 1;
      return cache[key];
    };
    const nf: number[][] = [];
    faces.forEach((f) => {
      const a = mid(f[0], f[1]); const b = mid(f[1], f[2]); const c = mid(f[2], f[0]);
      nf.push([f[0], a, c], [f[1], b, a], [f[2], c, b], [a, b, c]);
    });
    faces = nf;
  }
  verts.forEach((p) => addV(ball, p.map((x) => x * 0.62)));
  faces.forEach((f) => {
    const c3 = [0, 1, 2].map((k) => (verts[f[0]][k] + verts[f[1]][k] + verts[f[2]][k]) / 3);
    const ax = c3.map(Math.abs);
    const dom = ax[0] >= ax[1] && ax[0] >= ax[2] ? 0 : (ax[1] >= ax[2] ? 1 : 2);
    const split = [1, 2, 0][dom];
    const u = c3[split] / ax[dom];
    const sorted = ax.slice().sort((p1, p2) => p2 - p1);
    const faceEdge = sorted[1] / sorted[0] > 0.965;
    const stripeEdge = Math.abs(Math.abs(u) - 1 / 3) < 0.028;
    const stripe = u < -1 / 3 ? 0 : (u > 1 / 3 ? 2 : 1);
    const tone = [[248, 248, 244], [240, 240, 235], [244, 244, 240]][stripe];
    ball.f.push({ i: f.slice(), c: (faceEdge || stripeEdge) ? [190, 194, 202] : tone });
  });
  return { 'hb-guitar': { m: guitar, s: 1.2, tilt: 0.12 }, 'hb-drawing': { m: pencil, s: 1.2, tilt: 0.3 }, 'hb-ski': { m: skis, s: 1.15, tilt: 0.08, sway: true }, 'hb-volley': { m: ball, s: 1.15, tilt: 0.25 } };
}

/** Wraps a canvas so the model leans toward the pointer while it hovers. */
export function createHobbyView(el: HTMLCanvasElement, model: HobbyModel, phase: number): HobbyView | null {
  const ctx = el.getContext('2d');
  if (!ctx) return null;
  const h: HobbyView = { el, ctx, model, phase, hx: 0, hy: 0, tx: 0, ty: 0, over: false, boost: 0 };
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    h.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    h.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    h.over = true;
  });
  el.addEventListener('pointerleave', () => { h.over = false; h.tx = 0; h.ty = 0; });
  return h;
}

export function drawHobby(h: HobbyView, t: number) {
  h.hx += (h.tx - h.hx) * 0.08;
  h.hy += (h.ty - h.hy) * 0.08;
  h.boost += ((h.over ? 1 : 0) - h.boost) * 0.06;
  const ctx = h.ctx;
  const W = h.el.width;
  const H = h.el.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const yaw = (h.model.sway ? Math.sin(t * 0.7 + h.phase) * 0.75 : t * 0.9 + h.phase) + h.hx * 1.1;
  const pitch = -h.model.tilt + h.hy * 0.5;
  const bob = Math.sin(t * 1.8 + h.phase) * 0.05 + h.boost * 0.06;
  const cy = Math.cos(yaw); const sy = Math.sin(yaw);
  const cp = Math.cos(pitch); const sp = Math.sin(pitch);
  const S = 46 * (W / 128) * h.model.s * (1 + h.boost * 0.08);
  const F = 4;
  const P = h.model.m.v.map((v) => {
    const x = v[0] * cy + v[2] * sy;
    let z = -v[0] * sy + v[2] * cy;
    let y = v[1] * cp - z * sp;
    z = v[1] * sp + z * cp;
    y += bob;
    const p = F / (F - z);
    return [W / 2 + x * S * p, H / 2 - y * S * p, z, x, y];
  });
  ctx.fillStyle = 'rgba(60, 64, 70, ' + (0.16 - bob * 0.4).toFixed(3) + ')';
  ctx.beginPath();
  ctx.ellipse(W / 2, H * 0.9, (30 - bob * 40) * W / 128, (6 - bob * 6) * W / 128, 0, 0, Math.PI * 2);
  ctx.fill();
  const L = [-0.45, 0.65, 0.62];
  const items: { z: number; f?: Face; lit?: number; l?: Face }[] = [];
  h.model.m.f.forEach((f) => {
    const a = P[f.i[0]]; const b = P[f.i[1]]; const c = P[f.i[2]];
    const ux = b[3] - a[3]; const uy = b[4] - a[4]; const uz = b[2] - a[2];
    const vx = c[3] - a[3]; const vy = c[4] - a[4]; const vz = c[2] - a[2];
    let nx = uy * vz - uz * vy; let ny = uz * vx - ux * vz; let nz = ux * vy - uy * vx;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl; ny /= nl; nz /= nl;
    const lit = 0.4 + 0.6 * Math.abs(nx * L[0] + ny * L[1] + nz * L[2]);
    let z = 0;
    f.i.forEach((k) => { z += P[k][2]; });
    items.push({ z: z / f.i.length, f, lit });
  });
  h.model.m.l.forEach((ln) => items.push({ z: (P[ln.i[0]][2] + P[ln.i[1]][2]) / 2 + 0.02, l: ln }));
  items.sort((p1, p2) => p1.z - p2.z);
  items.forEach((it) => {
    if (it.l) {
      ctx.strokeStyle = 'rgb(' + it.l.c.join(',') + ')';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(P[it.l.i[0]][0], P[it.l.i[0]][1]);
      ctx.lineTo(P[it.l.i[1]][0], P[it.l.i[1]][1]);
      ctx.stroke();
      return;
    }
    const f = it.f!;
    const col = 'rgb(' + f.c.map((v) => Math.min(255, Math.round(v * it.lit!))).join(',') + ')';
    ctx.fillStyle = col;
    ctx.strokeStyle = col;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    f.i.forEach((k, j) => { if (j === 0) ctx.moveTo(P[k][0], P[k][1]); else ctx.lineTo(P[k][0], P[k][1]); });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
}
