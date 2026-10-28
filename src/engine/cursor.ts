// Wii-style hand cursor that follows the pointer, tilts with motion and grows over clickable things.

export function startCursor(): (() => void) | null {
  let fine = false;
  try { fine = !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches); } catch { fine = false; }
  const el = document.querySelector<HTMLElement>('.wii-cursor');
  const inner = el ? el.querySelector<HTMLElement>('.wii-cursor-in') : null;
  if (!fine || !el || !inner) return null;
  document.documentElement.setAttribute('data-wii', '1');
  let lastX: number | null = null;
  let tilt = 0;
  let down = false;
  let hot = false;
  let idle: ReturnType<typeof setTimeout> | null = null;
  const paint = () => {
    inner.style.transform = 'rotate(' + tilt.toFixed(1) + 'deg) scale(' + (down ? 0.86 : (hot ? 1.1 : 1)) + ')';
  };
  const sel = 'a, button, canvas, [role="button"], .proj, .photo3d, [style*="zoom-in"], [style*="cursor: pointer"], [style*="cursor: grab"]';
  const move = (e: PointerEvent) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    el.style.opacity = '1';
    el.style.transform = 'translate3d(' + (e.clientX - 20) + 'px, ' + (e.clientY - 4) + 'px, 0)';
    if (lastX !== null) {
      const dx = e.clientX - lastX;
      tilt = Math.max(-22, Math.min(22, tilt * 0.6 + dx * 1.1));
    }
    lastX = e.clientX;
    const t = e.target;
    hot = t instanceof Element && !!t.closest(sel);
    paint();
    if (idle) clearTimeout(idle);
    idle = setTimeout(() => { tilt = 0; paint(); }, 90);
  };
  const press = () => { down = true; paint(); };
  const release = () => { down = false; paint(); };
  const leave = (e: PointerEvent) => { if (!e.relatedTarget) { el.style.opacity = '0'; lastX = null; } };
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', press);
  window.addEventListener('pointerup', release);
  document.addEventListener('pointerout', leave);
  return () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerdown', press);
    window.removeEventListener('pointerup', release);
    document.removeEventListener('pointerout', leave);
    if (idle) clearTimeout(idle);
    document.documentElement.removeAttribute('data-wii');
  };
}
