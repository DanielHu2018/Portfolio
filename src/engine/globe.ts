import type { SiteController } from '../site/controller';
import { LAND_MASK } from './landMask';
import { home, visited, wantToVisit, PLACE_COLORS, type Place } from '../site/places';

declare const document: any;
declare const window: any;

// The dotted globe in Off the clock (#globe): a glossy ball with the land as halftone dots, a music-staff ring
// orbiting it, and markers for home (star), places visited and places to visit. It spins slowly on its own;
// drag to turn it, hover or tap a marker for its name. Software 3D on Canvas 2D like the hobby models.

const DEG = Math.PI / 180;
const KIND_LABEL = { home: 'Home', visited: 'Been there', want: 'Want to go' };
// The marker colors, darkened enough to read as text on white.
const KIND_INK = { home: '#A86E00', visited: '#D63C8A', want: '#1F9A55' };
type Marker = Place & { kind: 'home' | 'visited' | 'want'; v: number[] };
const unit = (lat: number, lon: number) => [Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.sin(lat * DEG), Math.cos(lat * DEG) * Math.sin(lon * DEG)];

// Land dots: rows every 2.4 degrees of latitude, spaced the same along each row, kept where the mask says land.
function landDots() {
  const bin = atob(LAND_MASK);
  const land = (lat: number, lon: number) => {
    const row = Math.min(179, Math.max(0, Math.floor(90 - lat)));
    const col = ((Math.floor(lon + 180) % 360) + 360) % 360;
    const n = row * 360 + col;
    return (bin.charCodeAt(n >> 3) >> (7 - (n & 7))) & 1;
  };
  const out: number[] = [];
  const STEP = 2.4;
  for (let lat = -90 + STEP / 2; lat < 90; lat += STEP) {
    const n = Math.max(1, Math.round((360 * Math.cos(lat * DEG)) / STEP));
    for (let i = 0; i < n; i++) {
      const lon = -180 + ((i + 0.5) * 360) / n;
      if (land(lat, lon)) out.push(...unit(lat, lon));
    }
  }
  return new Float32Array(out);
}

export function initGlobe(site: SiteController) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const inlineCanvas = document.getElementById('globe');
  let cv = inlineCanvas;
  if (!cv || !cv.getContext) return;
  let ctx = cv.getContext('2d');
  let rm = false;
  try { rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { rm = false; }
  const dots = landDots();
  const markers: Marker[] = [
    ...wantToVisit.map((p) => ({ ...p, kind: 'want' as const, v: unit(p.lat, p.lon) })),
    ...visited.map((p) => ({ ...p, kind: 'visited' as const, v: unit(p.lat, p.lon) })),
    { ...home, kind: 'home' as const, v: unit(home.lat, home.lon) }
  ];
  // View: yaw turns longitude `lon0` to face front, pitch tips latitude `lat0` toward the middle.
  const st = { lon0: home.lon + 10, lat0: 24, vel: 0, drag: null as any, hover: null as Marker | null, pinned: null as Marker | null, goal: null as null | { lon: number; lat: number }, px: -1, py: -1, last: 0, visible: true };
  let W = 0; let dpr = 1;
  const size = () => {
    W = cv.clientWidth || 300;
    dpr = Math.min(2, window.devicePixelRatio || 1) * Math.max(1, site.pageZoom || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(W * dpr);
  };
  size();

  // Rotate a unit vector into view space: x right, y up, z toward the viewer. `turn()` takes the current view's
  // sines and cosines once per frame; `view()` then rotates a point into `vo` without allocating.
  let sth = 0; let cth = 1; let sph = 0; let cph = 1;
  const turn = () => {
    const th = Math.PI / 2 - st.lon0 * DEG; const ph = st.lat0 * DEG;
    sth = Math.sin(th); cth = Math.cos(th); sph = Math.sin(ph); cph = Math.cos(ph);
  };
  const vo = [0, 0, 0];
  const view = (v: ArrayLike<number>, i = 0) => {
    const x = v[i + 2] * sth - v[i] * cth; // east to the right
    const z1 = v[i] * sth + v[i + 2] * cth;
    vo[0] = x; vo[1] = v[i + 1] * cph - z1 * sph; vo[2] = v[i + 1] * sph + z1 * cph;
    return vo;
  };
  // Land dots on the near side, sorted into four depth buckets of (x, y, z) triples; reused every frame.
  const buckets = [0, 1, 2, 3].map(() => new Float64Array(dots.length));
  const fillTo = [0, 0, 0, 0];

  // Everything that depends only on the canvas size: the halftone shadow (hundreds of tiny dots, drawn once into
  // an offscreen canvas and copied in each frame) and the gradients. Rebuilt when the size changes.
  let cache: any = null;
  const sized = () => {
    const key = cv.width + 'x' + cv.height + '@' + W + '@' + dpr;
    if (cache && cache.key === key) return cache;
    const S = W; const cx = S / 2; const cy = S * 0.46; const R = S * 0.32;
    const shadow = document.createElement('canvas');
    shadow.width = cv.width; shadow.height = cv.height;
    const c = shadow.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = '#9AD9F0';
    const shy = cy + R * 1.14; const shr = R * 0.95;
    for (let y = -shr * 0.22; y <= shr * 0.22; y += 6) {
      for (let x = -shr; x <= shr; x += 6) {
        const d = (x / shr) ** 2 + (y / (shr * 0.22)) ** 2;
        if (d > 1) continue;
        c.beginPath(); c.arc(cx + x, shy + y, 1.6 * (1 - d * 0.6), 0, Math.PI * 2); c.fill();
      }
    }
    const ringG = ctx.createLinearGradient(cx - R * 1.5, 0, cx + R * 1.5, 0);
    ringG.addColorStop(0, '#34BEED'); ringG.addColorStop(0.55, '#7FB8FF'); ringG.addColorStop(1, '#FF6FB5');
    const ball = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    ball.addColorStop(0, '#FFFFFF'); ball.addColorStop(0.55, '#E9F8FE'); ball.addColorStop(1, '#BDEBFB');
    const gloss = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.45, 0, cx - R * 0.38, cy - R * 0.45, R * 0.55);
    gloss.addColorStop(0, 'rgba(255, 255, 255, 0.75)'); gloss.addColorStop(1, 'rgba(255, 255, 255, 0)');
    cache = { key, shadow, ringG, ball, gloss };
    return cache;
  };

  const star = (c: any, x: number, y: number, r: number) => {
    c.beginPath();
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5; const rr = k % 2 ? r * 0.45 : r;
      c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    c.closePath();
  };

  // The orbiting staff: five lines on a tilted ellipse, back half behind the ball, front half in front.
  const ring = (c: any, cx: number, cy: number, R: number, front: boolean, t: number, g: any) => {
    const tilt = -0.22;
    c.save();
    c.translate(cx, cy); c.rotate(tilt);
    c.strokeStyle = g; c.lineWidth = Math.max(1, R * 0.008);
    c.globalAlpha = front ? 0.85 : 0.35;
    for (let k = 0; k < 5; k++) {
      const rx = R * (1.3 + k * 0.035); const ry = R * (0.26 + k * 0.007);
      c.beginPath();
      c.ellipse(0, 0, rx, ry, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
      c.stroke();
    }
    // Notes riding the staff.
    c.globalAlpha = front ? 1 : 0.4;
    for (let n = 0; n < 4; n++) {
      const a = (((rm ? 0 : t * 0.35) + n * (Math.PI / 2)) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      if ((a < Math.PI) !== front) continue;
      const rx = R * 1.37; const ry = R * 0.275;
      const x = Math.cos(a) * rx; const y = Math.sin(a) * ry; const s = R * 0.05;
      c.fillStyle = n % 2 ? '#FF6FB5' : '#34BEED'; c.strokeStyle = c.fillStyle; c.lineWidth = s * 0.28;
      c.beginPath(); c.ellipse(x, y, s, s * 0.72, -0.4, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.moveTo(x + s * 0.9, y - s * 0.2); c.lineTo(x + s * 0.9, y - s * 3.2); c.stroke();
    }
    c.restore();
  };

  const draw = (t: number) => {
    const S = W; const cx = S / 2; const cy = S * 0.46; const R = S * 0.32;
    const C = sized();
    turn();
    // Halftone dot shadow under the ball, like the cards' dotted shadows (pre-drawn by sized()).
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(C.shadow, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ring(ctx, cx, cy, R, false, t, C.ringG);
    // The ball: glossy white to sky blue, gray rim.
    ctx.fillStyle = C.ball;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    // Land dots on the near side, fading toward the edge.
    fillTo[0] = fillTo[1] = fillTo[2] = fillTo[3] = 0;
    for (let i = 0; i < dots.length; i += 3) {
      const p = view(dots, i);
      if (p[2] <= 0.02) continue;
      const k = Math.min(3, Math.floor(p[2] * 4)); const b = buckets[k]; let n = fillTo[k];
      b[n++] = cx + p[0] * R; b[n++] = cy - p[1] * R; b[n++] = p[2];
      fillTo[k] = n;
    }
    ctx.fillStyle = '#34BEED';
    buckets.forEach((b, k) => {
      ctx.globalAlpha = 0.3 + k * 0.23;
      ctx.beginPath();
      for (let j = 0; j < fillTo[k]; j += 3) {
        const r = R * 0.0115 * (0.55 + 0.45 * b[j + 2]);
        ctx.moveTo(b[j] + r, b[j + 1]); ctx.arc(b[j], b[j + 1], r, 0, Math.PI * 2);
      }
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.lineWidth = 3; ctx.strokeStyle = '#D5DAE1';
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    // Gloss.
    ctx.fillStyle = C.gloss;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    // Markers on the near side; the home star pulses.
    st.hover = null;
    const shown: any[] = [];
    markers.forEach((m) => {
      const p = view(m.v);
      if (p[2] <= 0.08) return;
      const x = cx + p[0] * R * 1.01; const y = cy - p[1] * R * 1.01; const a = Math.min(1, (p[2] - 0.08) * 5);
      ctx.globalAlpha = a;
      ctx.lineWidth = 2.5; ctx.strokeStyle = '#FFFFFF'; ctx.fillStyle = PLACE_COLORS[m.kind];
      if (m.kind === 'home') {
        const pulse = rm ? 0 : (t * 0.8) % 1;
        ctx.save(); ctx.globalAlpha = a * (1 - pulse) * 0.6; ctx.strokeStyle = PLACE_COLORS.home; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, R * 0.05 + pulse * R * 0.09, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        star(ctx, x, y, R * 0.065); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(x, y, R * 0.032, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      shown.push({ m: m, x: x, y: y, a: a });
      if (st.px >= 0 && Math.hypot(st.px - x, st.py - y) < Math.max(12, R * 0.07)) st.hover = m;
    });
    ctx.globalAlpha = 1;
    ring(ctx, cx, cy, R, true, t, C.ringG);
    // Label for the clicked (or hovered) marker, over everything: "Columbus, OH · Home" in a small pill.
    const lab = st.pinned || st.hover;
    const s = lab ? shown.find((q) => q.m === lab) : null;
    if (s) {
      const name = s.m.name; const what = ' · ' + KIND_LABEL[s.m.kind as keyof typeof KIND_LABEL];
      const fs = Math.max(11, R * 0.075);
      ctx.font = '700 ' + fs + "px 'M PLUS Rounded 1c', system-ui, sans-serif";
      const nw = ctx.measureText(name).width; const w = nw + ctx.measureText(what).width + fs * 1.6; const h = fs * 1.9;
      const lx = Math.max(4, Math.min(S - w - 4, s.x - w / 2)); const ly = Math.max(4, s.y - h - R * 0.08);
      ctx.globalAlpha = s.a;
      ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#D5DAE1'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.roundRect(lx, ly, w, h, h / 2); ctx.fill(); ctx.stroke();
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#3C4046'; ctx.fillText(name, lx + fs * 0.8, ly + h / 2 + 1);
      ctx.fillStyle = KIND_INK[s.m.kind as keyof typeof KIND_INK]; ctx.fillText(what, lx + fs * 0.8 + nw, ly + h / 2 + 1);
      ctx.globalAlpha = 1;
    }
    const cursor = st.drag ? 'grabbing' : cv === inlineCanvas ? 'zoom-in' : st.hover ? 'pointer' : 'grab';
    if (cv.style.cursor !== cursor) cv.style.cursor = cursor;
  };

  // Drag to turn (horizontal swipes on touch; vertical ones still scroll the page), with a little momentum.
  const pos = (e: any) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (W / r.height)]; };
  const down = (e: any) => {
    if (e.button !== undefined && e.button !== 0) return;
    const p = pos(e);
    st.drag = { x: p[0], y: p[1], lon0: st.lon0, lat0: st.lat0, moved: false, t: performance.now() };
    st.vel = 0; st.goal = null;
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  };
  const move = (e: any) => {
    const p = pos(e); st.px = p[0]; st.py = p[1];
    const d = st.drag;
    if (!d) return;
    const R = W * 0.32; const k = 57 / R; // degrees per pixel: about a radian per radius
    const dx = p[0] - d.x; const dy = p[1] - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    const prev = st.lon0;
    st.lon0 = d.lon0 - dx * k;
    st.lat0 = Math.max(-60, Math.min(70, d.lat0 + dy * k));
    const now = performance.now();
    st.vel = (st.lon0 - prev) / Math.max(1, now - d.t) * 1000; d.t = now;
  };
  const up = (e: any) => {
    const d = st.drag; st.drag = null;
    if (d && !d.moved && cv === inlineCanvas) {
      site.openFocus('globe', 0, { currentTarget: inlineCanvas, target: inlineCanvas });
      return;
    }
    if (d && !d.moved) {
      // A tap: show the nearest marker's name for a moment.
      const p = pos(e); st.px = p[0]; st.py = p[1];
      draw(st.last);
      // A click or tap on a dot keeps its label up (and the globe still) until you click off it.
      st.pinned = st.hover;
      if (e.pointerType !== 'mouse') { st.px = -1; st.py = -1; }
    }
    if (rm) st.vel = 0;
  };
  const leave = () => { if (!st.drag) { st.px = -1; st.py = -1; } };
  const cancel = () => { st.drag = null; st.vel = 0; };
  const listen = (canvas: any, add: boolean) => {
    const method = add ? 'addEventListener' : 'removeEventListener';
    canvas[method]('pointerdown', down);
    canvas[method]('pointermove', move);
    canvas[method]('pointerup', up);
    canvas[method]('pointercancel', cancel);
    canvas[method]('pointerleave', leave);
  };
  listen(cv, true);

  let io: any = null;
  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver((en) => { st.visible = en[0].isIntersecting; }, { rootMargin: '100px' });
    io.observe(cv);
  }
  const onResize = () => { size(); draw(st.last); };
  window.addEventListener('resize', onResize);

  let raf = 0; let prevT = 0; let flip = false;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const t = now / 1000; const dt = Math.min(0.1, t - (prevT || t)); prevT = t;
    // Reuse the same view and interaction state in the focused canvas, including on close.
    const focused = document.getElementById('globe-focus');
    const target = focused || inlineCanvas;
    if (target !== cv) {
      listen(cv, false);
      cv = target; ctx = cv.getContext('2d');
      st.drag = null; st.px = -1; st.py = -1;
      listen(cv, true); size(); draw(t);
    } else if (cv.clientWidth && cv.clientWidth !== W) size();
    if ((!focused && !st.visible) || (site.st().focus && site.st().focus.kind !== 'globe')) return;
    flip = !flip;
    if (flip) return; // 30 fps is plenty
    if (st.goal && !st.drag) {
      // Gliding to a place the tour asked for (globeFocus), the short way round.
      const dl = ((st.goal.lon - st.lon0 + 540) % 360) - 180; const dp = st.goal.lat - st.lat0;
      const k = Math.min(1, dt * 2 * 3);
      st.lon0 += dl * k; st.lat0 += dp * k; st.vel = 0;
      if (Math.abs(dl) < 0.2 && Math.abs(dp) < 0.2) st.goal = null;
    } else if (!st.drag) {
      // Coast after a drag, then settle back into a slow spin (paused while a marker's name is showing).
      const spin = rm || st.hover || st.pinned ? 0 : -7; // drifting eastward, like the real thing
      st.vel += (spin - st.vel) * Math.min(1, dt * 1.5);
      st.lon0 += st.vel * dt * 2;
    }
    st.last = t;
    draw(t);
  };
  draw(0);
  raf = requestAnimationFrame(loop);
  // For the tour: turn the globe to a place (by name) and show its label; null lets it spin freely again.
  site.globeFocus = (name: string | null) => {
    const m = name ? markers.find((q) => q.name === name) : null;
    st.pinned = m || null;
    st.goal = m ? { lon: m.lon, lat: Math.max(-60, Math.min(70, m.lat - 6)) } : null;
    if (m && rm) { st.lon0 = st.goal!.lon; st.lat0 = st.goal!.lat; st.goal = null; draw(st.last); }
  };
  site.globeOff = () => { listen(cv, false); cancelAnimationFrame(raf); if (io) io.disconnect(); window.removeEventListener('resize', onResize); };
}
