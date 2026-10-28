// One animation loop for the staff ribbons and hobby models (drawn every other frame, only when on screen).
import { buildHobbies, createHobbyView, drawHobby, type HobbyView } from './hobbies';
import { STAFF_CONFIG, drawStaff, sizeStaff, type StaffCanvas } from './staffs';
import { prefersReducedMotion } from './motion';
import type { HobbyId } from '../data/content';

export interface SceneFocus { kind: string; idx: number | string }

/** Starts the loop. `getFocus` reports the open overlay: the loop pauses behind any overlay except a hobby one. */
export function startScene(getFocus: () => SceneFocus | null) {
  const stf: StaffCanvas[] = Object.keys(STAFF_CONFIG)
    .map((id) => ({ el: document.getElementById(id) as HTMLCanvasElement | null, staves: STAFF_CONFIG[id] }))
    .filter((c): c is { el: HTMLCanvasElement; staves: typeof c.staves } => !!c.el && !!c.el.getContext)
    .map((c) => ({ ...c, ctx: null, w: 0, h: 0, dpr: 1 }));
  const size = () => stf.forEach(sizeStaff);
  size();

  const models = buildHobbies();
  const hob = (Object.keys(models) as HobbyId[])
    .map((id, n) => {
      const el = document.getElementById(id) as HTMLCanvasElement | null;
      return el ? createHobbyView(el, models[id], n * 1.7) : null;
    })
    .filter((h): h is HobbyView => !!h);
  let hobFocus: HobbyView | null = null;

  const drawHobbies = (t: number, force: boolean) => {
    const f = getFocus();
    const fel = f && f.kind === 'hobby' ? document.getElementById('hb-focus') as HTMLCanvasElement | null : null;
    if (fel && (!hobFocus || hobFocus.el !== fel)) {
      const src = hob.find((x) => x.el.id === f!.idx);
      if (src) hobFocus = createHobbyView(fel, src.model, src.phase);
    }
    if (!fel) hobFocus = null;
    const vh = window.innerHeight || 800;
    hob.concat(hobFocus ? [hobFocus] : []).forEach((h) => {
      const r = h.el.getBoundingClientRect();
      if (!force && h !== hobFocus && (r.bottom < -40 || r.top > vh + 40)) return;
      drawHobby(h, t);
    });
  };

  const drawAll = (t: number, force: boolean) => {
    const vh = window.innerHeight || 800;
    stf.forEach((c) => {
      if (!c.ctx) return;
      const r = c.el.getBoundingClientRect();
      if (!force && (r.bottom < -60 || r.top > vh + 60)) return;
      c.ctx.setTransform(c.dpr, 0, 0, c.dpr, 0, 0);
      c.ctx.clearRect(0, 0, c.w, c.h);
      c.staves.forEach((st) => drawStaff(c, st, t));
    });
    drawHobbies(t, force);
  };

  const rm = prefersReducedMotion();
  const onResize = () => { size(); if (rm) drawAll(0, true); };
  window.addEventListener('resize', onResize);
  let raf = 0;
  if (rm) drawAll(0, true);
  else {
    const t0 = performance.now();
    let flip = false;
    const loop = (now: number) => {
      flip = !flip;
      const f = getFocus();
      if (flip && !(f && f.kind !== 'hobby')) drawAll((now - t0) / 1000, false);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
}
