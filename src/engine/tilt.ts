// 3D hover tilt for project iPods and concert photo cards (writes transforms straight to the element).
import type { PointerEvent as ReactPointerEvent } from 'react';

type TiltEl = HTMLElement & { _edgeT?: ReturnType<typeof setTimeout> | null };

export function projMove(e: ReactPointerEvent<HTMLElement>) {
  if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
  const el = e.currentTarget as TiltEl;
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

export function resetTilt(el: TiltEl) {
  if (el.getAttribute('data-hover') === '0' && !el.style.transform) return;
  const slow = el.classList.contains('photo3d');
  el.setAttribute('data-hover', '0');
  el.style.transition = (slow ? 'transform 0.9s cubic-bezier(0.45, 0, 0.25, 1)' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)') + ', opacity 0.7s ease, translate 0.8s ease, scale 0.8s ease';
  el.style.transform = el.dataset.base || '';
  el.style.zIndex = '';
  if (el._edgeT) clearTimeout(el._edgeT);
  el._edgeT = setTimeout(() => { el.setAttribute('data-edge', '0'); el._edgeT = null; }, slow ? 950 : 650);
}

export function projLeave(e: ReactPointerEvent<HTMLElement>) {
  resetTilt(e.currentTarget);
}

export function photoOut(e: ReactPointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const to = e.relatedTarget;
  if (to instanceof Node && el.contains(to)) return;
  resetTilt(el);
}

export function stripLeave(e: ReactPointerEvent<HTMLElement>) {
  e.currentTarget.querySelectorAll<HTMLElement>('.photo3d').forEach((el) => resetTilt(el));
}
