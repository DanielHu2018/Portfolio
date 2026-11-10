import type { SiteController } from '../site/controller';

declare const document: any;
declare const window: any;

export function initCursor(site: SiteController) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  let fine = false;
  try { fine = !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches); } catch (e) { fine = false; }
  const el = document.querySelector('.wii-cursor');
  const inner = el ? el.querySelector('.wii-cursor-in') : null;
  if (!fine || !el || !inner) return;
  document.documentElement.setAttribute('data-wii', '1');
  let lastX: any = null;
  let tilt = 0;
  let down = false;
  let hot = false;
  let idle: any = null;
  const paint = () => {
    inner.style.transform = 'rotate(' + tilt.toFixed(1) + 'deg) scale(' + (down ? 0.86 : (hot ? 1.1 : 1)) + ')';
  };
  const sel = 'a, button, canvas, [role="button"], .proj, .photo3d, [style*="zoom-in"], [style*="cursor: pointer"], [style*="cursor: grab"]';
  // Embedded documents (the resume PDF) swallow pointer events without telling this page the pointer left,
  // so when moves stop, look a little ahead along the last direction; if that lands in a frame, hide the hand.
  const blocked = (n: any) => !!(n && n.closest && n.closest('iframe, embed, object'));
  const hide = () => { el.style.opacity = '0'; lastX = null; };
  let px: any = null; let py: any = null; let vx = 0; let vy = 0; let gone: any = null;
  const entered = () => {
    const len = Math.hypot(vx, vy);
    if (px === null || !len) return;
    const ahead = Math.max(24, len * 3) / len;
    if (blocked(document.elementFromPoint(px + vx * ahead, py + vy * ahead))) hide();
  };
  const move = (e: any) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    if (px !== null) { vx = e.clientX - px; vy = e.clientY - py; }
    px = e.clientX; py = e.clientY;
    if (gone) clearTimeout(gone);
    if (blocked(e.target)) { hide(); return; }
    gone = setTimeout(entered, 80);
    el.style.opacity = '1';
    const z = site.pageZoom || 1;
    el.style.transform = 'translate3d(' + (e.clientX - 20 * z) + 'px, ' + (e.clientY - 4 * z) + 'px, 0) scale(' + z + ')';
    if (lastX !== null) {
      const dx = e.clientX - lastX;
      tilt = Math.max(-22, Math.min(22, tilt * 0.6 + dx * 1.1));
    }
    lastX = e.clientX;
    const t = e.target;
    hot = !!(t && t.closest && t.closest(sel));
    paint();
    if (idle) clearTimeout(idle);
    idle = setTimeout(() => { tilt = 0; paint(); }, 90);
  };
  const press = () => { down = true; paint(); };
  const release = () => { down = false; paint(); };
  const leave = (e: any) => { if (!e.relatedTarget || blocked(e.relatedTarget)) hide(); };
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('blur', hide);
  window.addEventListener('pointerdown', press);
  window.addEventListener('pointerup', release);
  document.addEventListener('pointerout', leave);
  site.curOff = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('blur', hide);
    window.removeEventListener('pointerdown', press);
    window.removeEventListener('pointerup', release);
    document.removeEventListener('pointerout', leave);
    if (idle) clearTimeout(idle);
    if (gone) clearTimeout(gone);
    document.documentElement.removeAttribute('data-wii');
  };
}
