// Synthesized UI sounds (Web Audio oscillators, no audio files).

export type SfxType = 'hover' | 'click' | 'open' | 'close' | 'skip' | 'sign' | 'boot';

let ac: AudioContext | null = null;
let out: GainNode | null = null;
let muted = (() => {
  try { return window.localStorage.getItem('dh-sfx') === 'off'; } catch { return false; }
})();

export function isMuted() {
  return muted;
}

export function setMuted(m: boolean) {
  muted = m;
  try { window.localStorage.setItem('dh-sfx', m ? 'off' : 'on'); } catch { /* storage unavailable */ }
}

export function sfx(type: SfxType) {
  if (muted) return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!ac) ac = new AC();
    const ctx = ac;
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + 0.005;
    if (!out) { out = ctx.createGain(); out.gain.value = 0.55; out.connect(ctx.destination); }
    const dest = out;
    const tone = (f: number, at: number, dur: number, vol: number, wave?: OscillatorType, f2?: number) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = wave || 'sine';
      o.frequency.setValueAtTime(f, t0 + at);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + at + dur);
      g.gain.setValueAtTime(0.0001, t0 + at);
      g.gain.exponentialRampToValueAtTime(vol, t0 + at + Math.min(0.012, dur / 3));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
      o.connect(g); g.connect(dest); o.start(t0 + at); o.stop(t0 + at + dur + 0.02);
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
  } catch { /* audio unavailable */ }
}

/** Hover ticks and click blips for every interactive element on the page. Returns a cleanup function. */
export function attachUiSounds() {
  const SEL = 'a, button, .proj, .photo3d, canvas[id^="hb-"], [role="button"], input, textarea';
  let lastEl: Element | null = null; let lastT = 0;
  const over = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const el = e.target instanceof Element ? e.target.closest(SEL) : null;
    if (el === lastEl) return;
    lastEl = el;
    if (!el || el.closest('.boot')) return;
    const now = performance.now();
    if (now - lastT < 70) return;
    lastT = now;
    sfx('hover');
  };
  const down = (e: PointerEvent) => {
    const el = e.target instanceof Element ? e.target.closest(SEL) : null;
    if (!el || el.closest('.boot') || el.classList.contains('gb-board') || el.classList.contains('sfx-btn')) return;
    if (el.matches('input, textarea')) return;
    const lbl = el.getAttribute('aria-label') || '';
    sfx(/next|previous|skip/i.test(lbl) || el.classList.contains('flow-arrow') ? 'skip' : 'click');
  };
  document.addEventListener('pointerover', over, true);
  document.addEventListener('pointerdown', down, true);
  return () => { document.removeEventListener('pointerover', over, true); document.removeEventListener('pointerdown', down, true); };
}
