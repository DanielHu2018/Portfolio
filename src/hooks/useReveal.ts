import { useEffect } from 'react';
import { prefersReducedMotion } from '../engine/motion';

/** Rises `.rv-item` elements into place as they scroll into view, staggered among siblings. */
export function useReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;
    const root = document.querySelector('.rv-root');
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('.rv-item'));
    items.forEach((el) => {
      const sibs = Array.from(el.parentNode ? el.parentNode.children : []).filter((c) => c.classList.contains('rv-item'));
      el.style.transitionDelay = (Math.max(0, sibs.indexOf(el)) * 110) + 'ms';
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        el.setAttribute('data-in', '1');
        obs.unobserve(el);
        setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => obs.observe(el));
    root.setAttribute('data-armed', '1');
    return () => obs.disconnect();
  }, []);
}
