import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { sfx } from '../engine/sfx';
import type { MiiHandle } from '../engine/mii';

export type FocusKind = 'photo' | 'concert' | 'proj' | 'spotify' | 'hobby';
export interface Focus { kind: FocusKind; idx: number | string; rect: { x: number; y: number; w: number; h: number } }
export type FocusPhase = 'from' | 'open' | 'closing' | null;
export type OpenFocus = (kind: FocusKind, idx: number | string, e: ReactMouseEvent<HTMLElement>) => void;

/**
 * Click-to-focus overlay state. Opening starts the card at the clicked element's rect ('from') and animates it
 * to the center ('open'); closing animates back to wherever that element is now, then unmounts.
 */
export function useFocus(mii: React.RefObject<MiiHandle | null>) {
  const [focus, setFocus] = useState<Focus | null>(null);
  const [phase, setPhase] = useState<FocusPhase>(null);
  const focusRef = useRef<Focus | null>(null);
  const phaseRef = useRef<FocusPhase>(null);
  const focusEl = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  focusRef.current = focus;
  phaseRef.current = phase;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const open: OpenFocus = useCallback((kind, idx, e) => {
    const tgt = e.target as Element;
    if (kind !== 'concert' && tgt.closest('button')) return;
    const link = tgt.closest('a');
    if (link) { if (kind === 'proj') e.preventDefault(); else return; }
    const r = e.currentTarget.getBoundingClientRect();
    e.stopPropagation();
    focusEl.current = e.currentTarget;
    sfx('open');
    const f: Focus = { kind, idx, rect: { x: r.left, y: r.top, w: r.width, h: r.height } };
    focusRef.current = f;
    setFocus(f);
    setPhase('from');
    if (kind === 'proj' && mii.current) {
      const vw = window.innerWidth; const vh = window.innerHeight;
      const k = Math.max(0.5, Math.min(1.5, (vh - 110) / r.height, (vw - 48) / r.width));
      const ax = vw / 2 - r.width * k / 2 - 70;
      mii.current.react('cheer', ax > 60 ? { x: ax, y: Math.min(vh - 30, vh / 2 + r.height * k / 2 - 20) } : null);
    }
    if (timer.current) clearTimeout(timer.current);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setPhase('open');
      document.querySelector<HTMLElement>('.focus-root')?.focus();
    }));
  }, [mii]);

  const close = useCallback(() => {
    const f = focusRef.current;
    if (!f || phaseRef.current === 'closing') return;
    sfx('close');
    const el = focusEl.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setFocus({ ...f, rect: { x: r.left, y: r.top, w: r.width, h: r.height } });
    }
    setPhase('closing');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setFocus(null);
      setPhase(null);
      focusEl.current?.focus({ preventScroll: true });
    }, 520);
  }, []);

  return { focus, phase, focusRef, open, close };
}
