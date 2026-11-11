import { initCursor } from '../engine/cursor';
import { initMii } from '../engine/mii';
import { initStaffs } from '../engine/staffs';

declare const document: any;
declare const window: any;

export type SiteState = {
  sel?: number;
  jumping?: boolean;
  seen?: Record<string, boolean>;
  armed?: boolean;
  rm?: boolean;
  boot?: string;
  focus?: any;
  fPhase?: string | null;
  gb?: any[];
  gbSk?: number;
  gbStatus?: string;
  gbErr?: boolean;
  np?: any;
  receipts?: any;
  receiptView?: number;
  receiptSel?: number;
  album?: number | null;
  songSel?: number;
  skillSel?: number;
  flow?: number;
  navOpen?: boolean;
  sfxMuted?: boolean;
  pos?: { x: number; y: number } | null;
  reduced?: boolean;
};

export class SiteController {
  state: SiteState = {};
  props = { accent: '#34BEED' };
  pageZoom?: number;
  miiReact?: (type: string, at?: { x: number; y: number } | null) => void;
  // Instance fields the moved methods assign to, under their original names.
  [field: string]: any;

  private listeners = new Set<() => void>();

  // Like the old runtime: state is readable immediately, the render follows.
  setState(partial: Partial<SiteState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener());
  }
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
  initStaffs() { initStaffs(this); }
  initMii() { initMii(this); }
  initCursor() { initCursor(this); }
  sectionIds() {
    return ['hero', 'about', 'experience', 'work', 'skills', 'off', 'contact'];
  }
  st() {
    return this.state || {};
  }
  sfx(type: any) {
    if (this.sfxMuted) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!this.ac) this.ac = new AC();
      const ac = this.ac;
      if (ac.state === 'suspended') ac.resume();
      const t0 = ac.currentTime + 0.005;
      const out = this.sfxOut || (this.sfxOut = (() => { const g = ac.createGain(); g.gain.value = 0.55; g.connect(ac.destination); return g; })());
      const tone = (f: any, at: any, dur: any, vol: any, wave?: any, f2?: any) => {
        const o = ac.createOscillator(); const g = ac.createGain();
        o.type = wave || 'sine';
        o.frequency.setValueAtTime(f, t0 + at);
        if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + at + dur);
        g.gain.setValueAtTime(0.0001, t0 + at);
        g.gain.exponentialRampToValueAtTime(vol, t0 + at + Math.min(0.012, dur / 3));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
        o.connect(g); g.connect(out); o.start(t0 + at); o.stop(t0 + at + dur + 0.02);
      };
      if (type === 'hover') tone(1900, 0, 0.045, 0.035, 'sine', 2300);
      else if (type === 'click') { tone(740, 0, 0.06, 0.09, 'triangle'); tone(1110, 0.045, 0.08, 0.07, 'triangle'); }
      else if (type === 'open') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.055, 0.22, 0.06, 'sine'));
      else if (type === 'close') [880, 659, 523].forEach((f, i) => tone(f, i * 0.05, 0.16, 0.055, 'sine'));
      else if (type === 'skip') tone(1300, 0, 0.05, 0.06, 'square', 900);
      else if (type === 'sign') [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.07, 0.3, 0.06, 'triangle'));
      else if (type === 'boot') {
        [392, 523, 659, 784, 988].forEach((f, i) => tone(f, i * 0.09, 1.3 - i * 0.1, 0.05, 'sine'));
        [1568, 1976, 2349].forEach((f, i) => tone(f, 0.5 + i * 0.08, 0.5, 0.025, 'sine'));
      }
    } catch (e) { /* audio unavailable */ }
  }
  initSfx() {
    try { this.sfxMuted = window.localStorage.getItem('dh-sfx') === 'off'; } catch (e) { this.sfxMuted = false; }
    this.setState({ sfxMuted: this.sfxMuted });
    const SEL = 'a, button, .proj, .photo3d, canvas[id^="hb-"], [role="button"], input, textarea';
    let lastEl: any = null; let lastT = 0;
    const over = (e: any) => {
      if (e.pointerType === 'touch') return;
      const el = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (el === lastEl) return;
      lastEl = el;
      if (!el || el.closest('.boot')) return;
      const now = performance.now();
      if (now - lastT < 70) return;
      lastT = now;
      this.sfx('hover');
    };
    const down = (e: any) => {
      const el = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (!el || el.closest('.boot') || el.classList.contains('gb-board') || el.classList.contains('sfx-btn')) return;
      if (el.matches('input, textarea')) return;
      const lbl = el.getAttribute('aria-label') || '';
      this.sfx(/next|previous|skip/i.test(lbl) || el.classList.contains('flow-arrow') ? 'skip' : 'click');
    };
    document.addEventListener('pointerover', over, true);
    document.addEventListener('pointerdown', down, true);
    this.sfxOff = () => { document.removeEventListener('pointerover', over, true); document.removeEventListener('pointerdown', down, true); };
  }
  stickerUri(i: any) {
    if (!this._stk) this._stk = {};
    if (this._stk[i]) return this._stk[i];
    const D = this.gbStickerDefs()[i] || this.gbStickerDefs()[0];
    const col = D[1];
    const f = (n: any) => Math.round(n * 10) / 10;
    const poly = (pts: any, ro: any, ri: any, cx: any, cy: any, rot: any) => {
      const a = [];
      for (let j = 0; j < pts * 2; j++) { const r = j % 2 ? ri : ro; const t = rot + j * Math.PI / pts; a.push(f(cx + Math.sin(t) * r) + ',' + f(cy - Math.cos(t) * r)); }
      return '<polygon points="' + a.join(' ') + '"/>';
    };
    let fill = ''; let lines = ''; let detail = '';
    if (i === 0) fill = '<ellipse cx="34" cy="72" rx="19" ry="14" transform="rotate(-22 34 72)"/><rect x="43" y="10" width="11" height="64" rx="4"/><path d="M48 10 C60 22 84 26 80 52 C74 40 64 36 52 36 Z"/>';
    else if (i === 1) fill = poly(5, 48, 21, 50, 54, 0);
    else if (i === 2) fill = '<path d="M50 88 C20 68 5 52 5 33 C5 18 16 8 30 8 C40 8 46 14 50 22 C54 14 60 8 70 8 C84 8 95 18 95 33 C95 52 80 68 50 88 Z"/>';
    else if (i === 3) {
      for (let j = 0; j < 5; j++) { const t = j * Math.PI * 2 / 5; fill += '<circle cx="' + f(50 + Math.sin(t) * 25) + '" cy="' + f(50 - Math.cos(t) * 25) + '" r="21"/>'; }
      detail = '<circle cx="50" cy="50" r="15" fill="#FFE27A"/>';
    } else if (i === 4) {
      for (let j = 0; j < 6; j++) {
        const t = j * Math.PI / 3; const ex = 50 + Math.sin(t) * 42; const ey = 50 - Math.cos(t) * 42;
        const bx = 50 + Math.sin(t) * 26; const by = 50 - Math.cos(t) * 26;
        lines += '<path d="M50 50 L' + f(ex) + ' ' + f(ey) + ' M' + f(bx + Math.sin(t - 0.8) * 14) + ' ' + f(by - Math.cos(t - 0.8) * 14) + ' L' + f(bx) + ' ' + f(by) + ' L' + f(bx + Math.sin(t + 0.8) * 14) + ' ' + f(by - Math.cos(t + 0.8) * 14) + '"/>';
      }
    } else if (i === 5) { fill = poly(12, 48, 35, 50, 50, 0); detail = '<circle cx="50" cy="50" r="25" fill="#FFC46B"/><circle cx="42" cy="46" r="3.5" fill="#7A3E10"/><circle cx="58" cy="46" r="3.5" fill="#7A3E10"/><path d="M41 56 Q50 64 59 56" fill="none" stroke="#7A3E10" stroke-width="3.5" stroke-linecap="round"/>'; }
    else if (i === 6) fill = '<ellipse cx="25" cy="76" rx="16" ry="12" transform="rotate(-22 25 76)"/><ellipse cx="71" cy="66" rx="16" ry="12" transform="rotate(-22 71 66)"/><rect x="33" y="22" width="9" height="54" rx="3"/><rect x="79" y="12" width="9" height="54" rx="3"/><polygon points="33,22 88,10 88,26 33,38"/>';
    else {
      fill = '<circle cx="22" cy="24" r="15"/><circle cx="78" cy="24" r="15"/><ellipse cx="50" cy="56" rx="42" ry="37"/>';
      detail = '<circle cx="22" cy="24" r="7" fill="#FFD3A6"/><circle cx="78" cy="24" r="7" fill="#FFD3A6"/>'
        + '<ellipse cx="50" cy="73" rx="22" ry="15" fill="#FFF4E4"/>'
        + '<g fill="none" stroke="#3C2A1E" stroke-linecap="round" stroke-width="5"><path d="M50 22 V34"/><path d="M37 25 L41 36"/><path d="M63 25 L59 36"/>'
        + '<path d="M10 52 L23 56"/><path d="M11 65 L23 64"/><path d="M90 52 L77 56"/><path d="M89 65 L77 64"/></g>'
        + '<circle cx="36" cy="52" r="5" fill="#3C2A1E"/><circle cx="64" cy="52" r="5" fill="#3C2A1E"/><circle cx="37.6" cy="50.4" r="1.6" fill="#FFFFFF"/><circle cx="65.6" cy="50.4" r="1.6" fill="#FFFFFF"/>'
        + '<path d="M44 64 H56 L50 71 Z" fill="#FF6FB5" stroke="#FF6FB5" stroke-width="2" stroke-linejoin="round"/>'
        + '<path d="M50 71 Q46 78 40 75 M50 71 Q54 78 60 75" fill="none" stroke="#3C2A1E" stroke-width="2.6" stroke-linecap="round"/>';
    }
    const lw = 11;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -14 128 128">'
      + '<defs><clipPath id="c">' + fill + '</clipPath></defs>'
      + '<g fill="#C9CFD8" stroke="#C9CFD8" stroke-width="22" stroke-linejoin="round" stroke-linecap="round">' + fill + '</g>'
      + '<g fill="none" stroke="#C9CFD8" stroke-width="' + (lw + 22) + '" stroke-linecap="round" stroke-linejoin="round">' + lines + '</g>'
      + '<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="18" stroke-linejoin="round" stroke-linecap="round">' + fill + '</g>'
      + '<g fill="none" stroke="#FFFFFF" stroke-width="' + (lw + 18) + '" stroke-linecap="round" stroke-linejoin="round">' + lines + '</g>'
      + '<g fill="' + col + '">' + fill + '</g>'
      + '<g fill="none" stroke="' + col + '" stroke-width="' + lw + '" stroke-linecap="round" stroke-linejoin="round">' + lines + '</g>'
      + detail
      + '<g clip-path="url(#c)"><ellipse cx="30" cy="22" rx="46" ry="26" fill="#FFFFFF" opacity="0.32"/></g>'
      + '<g fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="' + (lw - 6) + '" stroke-linecap="round" transform="translate(-1.5 -1.5)">' + lines.replace(/M50 50 L[^M]*/g, '') + '</g>'
      + '</svg>';
    this._stk[i] = 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")';
    return this._stk[i];
  }
  gbStickerDefs() {
    return [['\u266A', '#34BEED', 'Music note'], ['\u2605', '#FFB020', 'Star'], ['\u2665', '#FF6FB5', 'Heart'], ['\u273F', '#4CD07D', 'Flower'], ['\u2744', '#7FB8FF', 'Snowflake'], ['\u2600', '#FF9A3C', 'Sun'], ['\u266B', '#A77BFF', 'Notes'], ['\uD83D\uDC2F', '#FF8A1F', 'Tiger']];
  }
  gbSeed() {
    return [[12, 28, 0, -8, 'thanks for visiting!'], [26, 60, 2, 6, '[NOTE]'], [44, 22, 1, 10, '[NOTE]'], [58, 66, 4, -5, ''], [73, 30, 3, -12, '[NOTE]'], [86, 62, 6, 7, '']].map((a) => ({ x: a[0], y: a[1], k: a[2], r: a[3], n: a[4] }));
  }
  async loadGuestbook() {
    try {
      const response = await fetch('/api/stickers');
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) this.setState({ gb: data.map((g) => ({ x: Number(g.x), y: Number(g.y), k: Number(g.k), r: Number(g.r), n: String(g.n || '') })) });
    } catch (e) { /* local seed remains available if the API is unavailable */ }
  }
  gbAdd(x: any, y: any) {
    const inp = document.getElementById('gb-name');
    const name = inp ? inp.value.replace(/\s+/g, ' ').trim().slice(0, 40) : '';
    if (inp) inp.value = '';
    const sticker = { x: x, y: y, k: this.st().gbSk || 0, r: Math.round(Math.random() * 30 - 15), n: name };
    const list = (this.st().gb || this.gbSeed()).concat([sticker]).slice(-80);
    this.setState({ gb: list, gbStatus: 'Thanks for stopping by!', gbErr: false });
    fetch('/api/stickers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sticker) }).catch(() => { /* keep the local sticker visible if saving is unavailable */ });
    this.sfx('sign');
  }
  // Scale the 1440x900 design up to fill bigger screens (never down); sets --z for the CSS zoom rules.
  fitZoom() {
    const z = Math.round(Math.min(2.25, Math.max(1, Math.min(window.innerWidth / 1440, window.innerHeight / 900))) * 100) / 100;
    this.pageZoom = z;
    document.documentElement.style.setProperty('--z', String(z));
  }
  mount() {
    this.zoomOff = (() => { const f = () => this.fitZoom(); f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); })();
    this.loadGuestbook();
    this.loadReceipts();
    this.nowPlayingOff = this.watchNowPlaying();
    this.initStaffs();
    this.initSfx();
    setTimeout(() => { const b = typeof document !== 'undefined' ? document.querySelector('.boot') : null; if (b && b.focus) b.focus(); }, 50);
    this.initCursor();
    this.initMii();
    this.initReveal();
    const ids = this.sectionIds();
    const doc = typeof document !== 'undefined' ? document : null;
    if (!doc || typeof IntersectionObserver === 'undefined') return;
    this.spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const i = ids.indexOf(en.target.id);
          if (i >= 0 && i !== this.st().sel && !this.st().jumping) this.setState({ sel: i });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    this.rev = new IntersectionObserver((entries) => {
      const seen = Object.assign({}, this.st().seen || {});
      let changed = false;
      entries.forEach((en) => {
        if (en.isIntersecting && !seen[en.target.id]) { seen[en.target.id] = true; changed = true; }
      });
      if (changed) this.setState({ seen: seen });
    }, { threshold: 0.12 });
    ids.forEach((id) => {
      const el = doc.getElementById(id);
      if (el) { this.spy.observe(el); this.rev.observe(el); }
    });
    let rm = false;
    try { rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { rm = false; }
    this.setState({ armed: true, rm: rm });
  }
  unmount() {
    if (this.nowPlayingOff) this.nowPlayingOff();
    if (this.zoomOff) this.zoomOff();
    if (this.sfxOff) this.sfxOff();
    if (this.curOff) this.curOff();
    if (this.miiOff) this.miiOff();
    if (this.fTimer) clearTimeout(this.fTimer);
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.rvObs) this.rvObs.disconnect();
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.spy) this.spy.disconnect();
    if (this.rev) this.rev.disconnect();
    if (this.jumpTimer) clearTimeout(this.jumpTimer);
    // Strict Mode remounts on the same DOM; observeNew skips anything already marked.
    document.querySelectorAll('.rv-item[data-rv]').forEach((el: any) => el.removeAttribute('data-rv'));
  }
  isSmall() {
    return typeof window !== 'undefined' && window.innerWidth < 1100;
  }
  dragStart(e: any) {
    if (e.button !== undefined && e.button !== 0) return;
    const tgt = e.target;
    if (tgt && tgt.closest && tgt.closest('button, a')) return;
    const el = e.currentTarget;
    if (!el || typeof window === 'undefined') return;
    const r = el.getBoundingClientRect();
    const ox = e.clientX - r.left;
    const oy = e.clientY - r.top;
    const w = r.width;
    const h = r.height;
    const tf = this.isSmall() ? 'scale(0.54)' : 'scale(0.84)';
    if (e.preventDefault) e.preventDefault();
    this.dragPos = null;
    const move = (ev: any) => {
      const x = Math.min(Math.max(0, ev.clientX - ox), Math.max(0, window.innerWidth - w));
      const y = Math.min(Math.max(0, ev.clientY - oy), Math.max(0, window.innerHeight - h));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.transform = tf;
      el.style.transformOrigin = 'top left';
      this.dragPos = { x: Math.round(x), y: Math.round(y) };
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (this.dragPos) this.setState({ pos: this.dragPos });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }
  resetPos(e: any) {
    const tgt = e && e.target;
    if (tgt && tgt.closest && tgt.closest('button, a')) return;
    const el = e && e.currentTarget;
    if (el) { el.style.left = ''; el.style.top = ''; el.style.right = ''; el.style.bottom = ''; el.style.transform = ''; el.style.transformOrigin = ''; }
    this.setState({ pos: null });
  }
  initReveal() {
    if (typeof document === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    let rm = false;
    try { rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { rm = false; }
    if (rm) return;
    const root = document.querySelector('.rv-root');
    if (!root) return;
    const items = Array.prototype.slice.call(root.querySelectorAll('.rv-item'));
    items.forEach((el) => {
      const sibs = Array.prototype.filter.call(el.parentNode ? el.parentNode.children : [], (c) => c.classList && c.classList.contains('rv-item'));
      const idx = Math.max(0, sibs.indexOf(el));
      el.style.transitionDelay = (idx * 110) + 'ms';
    });
    this.rvObs = new IntersectionObserver((entries) => {
      entries.forEach((en: any) => {
        if (en.isIntersecting) {
          en.target.setAttribute('data-in', '1');
          this.rvObs.unobserve(en.target);
          setTimeout(() => { en.target.style.transitionDelay = ''; }, 1400);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    this.observeNew();
    root.setAttribute('data-armed', '1');
  }
  observeNew() {
    if (!this.rvObs || typeof document === 'undefined') return;
    const root = document.querySelector('.rv-root');
    if (!root) return;
    root.querySelectorAll('.rv-item:not([data-rv])').forEach((el: any) => {
      el.setAttribute('data-rv', '1');
      this.rvObs.observe(el);
    });
  }
  didUpdate() {
    this.observeNew();
  }
  projMove(e: any) {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const el = e.currentTarget;
    if (!el) return;
    if (el.dataset.base === undefined) el.dataset.base = el.style.transform || '';
    const r = el.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    const rx = (0.5 - py) * 32;
    const ry = (px - 0.5) * 44;
    const isPhoto = el.classList.contains('photo3d');
    const entering = isPhoto && el.getAttribute('data-hover') !== '1';
    if (isPhoto) el.setAttribute('data-hover', '1');
    if (el._edgeT) { clearTimeout(el._edgeT); el._edgeT = null; }
    el.setAttribute('data-edge', '1');
    el.style.transition = (entering ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.12s ease-out') + ', opacity 0.7s ease, translate 0.8s ease, scale 0.8s ease';
    el.style.transform = 'translateY(-14px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(1.03)';
    el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    el.style.zIndex = '5';
  }
  photoOut(e: any) {
    const el = e.currentTarget;
    if (!el) return;
    const to = e.relatedTarget;
    if (to && el.contains(to)) return;
    this.resetTilt(el);
  }
  stripLeave(e: any) {
    const strip = e.currentTarget;
    if (!strip) return;
    strip.querySelectorAll('.photo3d').forEach((el: any) => this.resetTilt(el));
  }
  projLeave(e: any) {
    const el = e.currentTarget;
    if (!el) return;
    this.resetTilt(el);
  }
  resetTilt(el: any) {
    if (el.getAttribute('data-hover') === '0' && !el.style.transform) return;
    const slow = el.classList.contains('photo3d');
    el.setAttribute('data-hover', '0');
    el.style.transition = (slow ? 'transform 0.9s cubic-bezier(0.45, 0, 0.25, 1)' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)') + ', opacity 0.7s ease, translate 0.8s ease, scale 0.8s ease';
    el.style.transform = el.dataset.base || '';
    el.style.zIndex = '';
    if (el._edgeT) clearTimeout(el._edgeT);
    el._edgeT = setTimeout(() => { el.setAttribute('data-edge', '0'); el._edgeT = null; }, slow ? 950 : 650);
  }
  // Polls Daniel's live Spotify status (api/now-playing.js) while the tab is visible.
  watchNowPlaying() {
    const load = async () => {
      if (document.visibilityState === 'hidden') return;
      try {
        const response = await fetch('/api/now-playing', { cache: 'no-cache' });
        const np = response.ok ? await response.json() : null;
        this.setState({ np: np && np.playing ? np : null });
      } catch (e) { this.setState({ np: null }); }
    };
    load();
    const timer = setInterval(load, 20000);
    document.addEventListener('visibilitychange', load);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', load); };
  }
  async loadReceipts() {
    try {
      const response = await fetch('/assets/receipts/receipts.json', { cache: 'no-cache' });
      if (response.ok) this.setState({ receipts: await response.json() });
    } catch (e) {}
  }
  concertMove(dir: any) {
    const f = this.st().focus;
    if (!f || f.kind !== 'concert') return;
    const n = 10;
    this.setState({ focus: { ...f, idx: (f.idx + dir + n) % n } });
  }
  focusTarget(kind: any) {
    const Z = this.pageZoom || 1;
    const vw = typeof window !== 'undefined' ? window.innerWidth / Z : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight / Z : 900;
    const fit = (w: any, h: any) => Math.min(w, (vw - 48), (vh - 120) * (w / h));
    if (kind === 'photo') return { w: fit(440, 560), cx: vw / 2, cy: vh / 2 };
    if (kind === 'concert') return { w: fit(400, 520), cx: vw / 2, cy: vh / 2 };
    if (kind === 'resume') return { w: fit(860, 860), cx: vw / 2, cy: vh / 2 };
    if (kind === 'proj') return { w: fit(440, 860), cx: vw / 2, cy: vh / 2 };
    if (kind === 'spotify') return { w: fit(400, 760), cx: vw / 2, cy: vh / 2 };
    const w = Math.min(440, vw * 0.42);
    return { w: w, cx: vw / 2 + 20 + w / 2, cy: vh / 2 };
  }
  openFocus(kind: any, idx: any, e: any) {
    if (!e || !e.currentTarget) return;
    const tgt = e.target;
    if (kind !== 'concert' && tgt && tgt.closest && tgt.closest('button')) return;
    const link = tgt && tgt.closest ? tgt.closest('a') : null;
    if (link) { if (kind === 'proj' || kind === 'resume') e.preventDefault(); else return; }
    const r = e.currentTarget.getBoundingClientRect();
    if (e.stopPropagation) e.stopPropagation();
    this.focusEl = e.currentTarget;
    this.sfx('open');
    this.setState({ focus: { kind: kind, idx: idx, rect: { x: r.left, y: r.top, w: r.width, h: r.height } }, fPhase: 'from' });
    if (kind === 'proj' && this.miiReact) {
      const vw = window.innerWidth; const vh = window.innerHeight;
      const k = Math.max(0.5, Math.min(1.5, (vh - 110) / r.height, (vw - 48) / r.width));
      const ax = vw / 2 - r.width * k / 2 - 70;
      this.miiReact('cheer', ax > 60 ? { x: ax, y: Math.min(vh - 30, vh / 2 + r.height * k / 2 - 20) } : null);
    }
    if (this.fTimer) clearTimeout(this.fTimer);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.setState({ fPhase: 'open' });
      const root = document.querySelector('.focus-root');
      if (root && root.focus) root.focus();
    }));
  }
  projStep(d: any) {
    const f = this.st().focus;
    if (!f || f.kind !== 'proj') return;
    const cards = document.querySelectorAll('#work .slab3d.proj');
    if (!cards.length) return;
    const idx = ((f.idx + d) % cards.length + cards.length) % cards.length;
    this.focusEl = cards[idx];
    this.setState({ focus: Object.assign({}, f, { idx: idx }) });
  }
  closeFocus() {
    const f = this.st().focus;
    if (!f || this.st().fPhase === 'closing') return;
    this.sfx('close');
    if (this.focusEl && this.focusEl.getBoundingClientRect) {
      const r = this.focusEl.getBoundingClientRect();
      f.rect = { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    this.setState({ focus: f, fPhase: 'closing' });
    if (this.fTimer) clearTimeout(this.fTimer);
    this.fTimer = setTimeout(() => {
      this.setState({ focus: null, fPhase: null });
      if (this.focusEl && this.focusEl.focus) this.focusEl.focus({ preventScroll: true });
    }, 520);
  }
  bootGo() {
    const cur = this.st().boot || this._bootInit;
    if (cur !== 'on') return;
    this.sfx('boot');
    this.setState({ boot: 'loading' });
    const minLoad = new Promise((resolve) => setTimeout(resolve, 1650));
    Promise.resolve(minLoad).then(() => {
      this.setState({ boot: 'leaving' });
      setTimeout(() => this.setState({ boot: 'done' }), 650);
    });
  }
  go(i: any) {
    const ids = this.sectionIds();
    const n = Math.max(0, Math.min(ids.length - 1, i));
    const el = typeof document !== 'undefined' ? document.getElementById(ids[n]) : null;
    if (el) el.scrollIntoView({ behavior: this.st().reduced ? 'auto' : 'smooth', block: 'start' });
    this.setState({ sel: n, jumping: true });
    if (this.jumpTimer) clearTimeout(this.jumpTimer);
    this.jumpTimer = setTimeout(() => this.setState({ jumping: false }), 900);
  }
}
