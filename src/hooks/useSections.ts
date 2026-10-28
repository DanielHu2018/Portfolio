import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTIONS } from '../data/content';

/** Tracks which section is in the middle of the viewport, and scrolls to a section on request. */
export function useSections() {
  const [sel, setSel] = useState(0);
  const jumping = useRef(false);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const ids = SECTIONS.map((s) => s.id);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = ids.indexOf(en.target.id);
        if (i >= 0 && !jumping.current) setSel(i);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
    return () => { spy.disconnect(); if (jumpTimer.current) clearTimeout(jumpTimer.current); };
  }, []);

  const go = useCallback((i: number) => {
    const n = Math.max(0, Math.min(SECTIONS.length - 1, i));
    document.getElementById(SECTIONS[n].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSel(n);
    jumping.current = true;
    if (jumpTimer.current) clearTimeout(jumpTimer.current);
    jumpTimer.current = setTimeout(() => { jumping.current = false; }, 900);
  }, []);

  return { sel, go };
}
