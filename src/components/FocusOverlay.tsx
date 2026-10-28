// Click-to-focus overlay: the clicked card flies from its spot on the page to the center (Esc / X / backdrop closes).
import type { CSSProperties, KeyboardEvent } from 'react';
import { HOBBIES, PROJECTS } from '../data/content';
import type { Focus, FocusKind, FocusPhase } from '../hooks/useFocus';
import type { Player } from '../hooks/usePlayer';
import { ProjectIpod, SpotifyIpod } from './ipod';

interface Props {
  focus: Focus;
  phase: FocusPhase;
  onClose: () => void;
  player: Player;
  onMenu: () => void;
}

/** Final size and center for cards that are re-laid out at a fixed width (not scaled from the page). */
function focusTarget(kind: FocusKind) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fit = (w: number, h: number) => Math.min(w, (vw - 48), (vh - 120) * (w / h));
  if (kind === 'photo') return { w: fit(440, 560), cx: vw / 2, cy: vh / 2 };
  if (kind === 'concert') return { w: fit(400, 520), cx: vw / 2, cy: vh / 2 };
  if (kind === 'proj') return { w: fit(440, 860), cx: vw / 2, cy: vh / 2 };
  if (kind === 'spotify') return { w: fit(400, 760), cx: vw / 2, cy: vh / 2 };
  const w = Math.min(440, vw * 0.42);
  return { w, cx: vw / 2 + 20 + w / 2, cy: vh / 2 };
}

export default function FocusOverlay({ focus: f, phase, onClose, player, onMenu }: Props) {
  const shown = phase === 'open';
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const opacity = shown ? 1 : (phase === 'from' ? 0.6 : 0);
  const transition = 'transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), opacity ' + (phase === 'closing' ? '0.5s ease-in' : '0.25s ease');
  let card: CSSProperties;
  let blurb: CSSProperties = {};
  if (f.kind === 'proj' || f.kind === 'spotify') {
    // iPods keep their page layout and scale up as a whole.
    const k = Math.max(0.5, Math.min(1.5, (vh - 110) / f.rect.h, (vw - 48) / f.rect.w));
    const ccx = vw / 2; const ccy = vh / 2;
    const dx0 = f.rect.x + f.rect.w / 2 - ccx; const dy0 = f.rect.y + f.rect.h / 2 - ccy;
    card = {
      position: 'fixed', zIndex: '2', left: ccx.toFixed(1) + 'px', top: ccy.toFixed(1) + 'px', width: f.rect.w.toFixed(1) + 'px',
      height: f.kind === 'proj' ? f.rect.h.toFixed(1) + 'px' : 'auto',
      transform: shown ? 'translate(-50%, -50%) scale(' + k.toFixed(3) + ')' : 'translate(-50%, -50%) translate(' + dx0.toFixed(1) + 'px, ' + dy0.toFixed(1) + 'px)',
      opacity, transition,
    };
  } else {
    const T = focusTarget(f.kind);
    const rcx = f.rect.x + f.rect.w / 2;
    const rcy = f.rect.y + f.rect.h / 2;
    const sc = Math.max(0.05, f.rect.w / T.w);
    card = {
      position: 'fixed', zIndex: '2', left: T.cx.toFixed(1) + 'px', top: T.cy.toFixed(1) + 'px', width: T.w.toFixed(1) + 'px',
      transform: shown ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) translate(' + (rcx - T.cx).toFixed(1) + 'px, ' + (rcy - T.cy).toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')',
      opacity, transition,
    };
    const bw = Math.min(400, vw * 0.38);
    blurb = { position: 'fixed', zIndex: '2', top: '50%', left: (vw / 2 - 20 - bw).toFixed(1) + 'px', width: bw.toFixed(1) + 'px', display: 'flex', flexDirection: 'column', gap: '16px', transform: 'translateY(-50%) translateX(' + (shown ? 0 : -40) + 'px)', opacity: shown ? 1 : 0, transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ' + (shown ? '0.18s' : '0s') + ', opacity 0.4s ease ' + (shown ? '0.18s' : '0s') };
  }
  const hobby = f.kind === 'hobby' ? HOBBIES.find((h) => h.id === f.idx) : undefined;
  const proj = f.kind === 'proj' ? PROJECTS[f.idx as number] : undefined;
  const label = hobby ? hobby.title : proj ? proj.name : f.kind === 'spotify' ? 'Music player' : f.kind === 'concert' ? 'Concert photo' : 'Photo of Daniel';
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };

  return (
    <div className="focus-root" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} onKeyDown={onKey} style={{ position: 'fixed', inset: '0', zIndex: '80', outline: 'none' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: '0', background: 'rgba(244, 247, 251, 0.72)', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)', opacity: shown ? 1 : 0, transition: 'opacity 0.4s ease', cursor: 'zoom-out' }} />
      <button type="button" aria-label="Close" onClick={onClose} style={{ position: 'fixed', zIndex: '3', top: '20px', right: '20px', width: '52px', height: '52px', borderRadius: '50%', border: '3px solid #D5DAE1', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', boxShadow: 'inset 0 2px 0 #FFFFFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: shown ? 1 : 0, transform: 'scale(' + (shown ? 1 : 0.7) + ')', transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6L6 18" stroke="#4A4F57" strokeWidth="2.6" strokeLinecap="round" /></svg>
      </button>

      {f.kind === 'photo' && (
        <div style={card}>
          <div style={{ position: 'relative', background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '12px', padding: '22px 22px 0' }}>
            <div role="img" aria-label="Photo of Daniel (placeholder)" style={{ aspectRatio: '1 / 1', background: 'linear-gradient(180deg, #E9F8FE, #BDEBFB)', border: '2px solid #D5DAE1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', color: '#1677A8' }}>[PHOTO OF YOU]</div>
            <p style={{ margin: '18px 0 24px', fontFamily: "'Permanent Marker', cursive", fontSize: '32px', textAlign: 'center', color: '#3C4046' }}>hi, I'm Daniel</p>
            <div aria-hidden="true" style={{ position: 'absolute', top: '-20px', left: '50%', width: '150px', height: '40px', transform: 'translateX(-50%) rotate(-5deg)', background: '#FFE58A', opacity: '0.95', border: '2px solid #E8C65A', borderRadius: '4px' }} />
          </div>
        </div>
      )}

      {f.kind === 'concert' && (
        <div style={card}>
          <div style={{ background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '10px', padding: '18px 18px 0' }}>
            <div role="img" aria-label="Concert photo (placeholder)" style={{ aspectRatio: '1 / 1', background: '#3C4046', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color: '#FFE58A' }}>[CONCERT PHOTO]</div>
            <p style={{ margin: '14px 0 4px', fontFamily: "'Permanent Marker', cursive", fontSize: '28px', textAlign: 'center', color: '#3C4046' }}>[ARTIST]</p>
            <p style={{ margin: '0 0 18px', font: "600 15px 'Helvetica Neue', Arial, sans-serif", textAlign: 'center', color: '#5A5F67' }}>[VENUE] · [DATE]</p>
          </div>
        </div>
      )}

      {proj && (
        <div style={card}>
          <ProjectIpod p={proj} focused />
        </div>
      )}

      {f.kind === 'spotify' && (
        <div style={card}>
          <SpotifyIpod player={player} onMenu={onMenu} focused />
        </div>
      )}

      {hobby && (
        <>
          <div style={blurb}>
            <span style={{ alignSelf: 'flex-start', fontWeight: '800', fontSize: '13px', color: '#2E1F70', background: '#CDBDFF', borderRadius: '999px', padding: '5px 14px' }}>Off the clock</span>
            <h2 style={{ margin: '0', fontWeight: '800', fontSize: '44px', color: '#3C4046' }}>{hobby.title}</h2>
            <p style={{ margin: '0', fontSize: '18px', lineHeight: '1.7', color: '#4A4F57' }}>{hobby.blurb}</p>
          </div>
          <div style={card}>
            <canvas id="hb-focus" role="img" aria-label={hobby.label} width="256" height="256" style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', imageRendering: 'pixelated', cursor: 'grab', touchAction: 'none' }} />
          </div>
        </>
      )}
    </div>
  );
}
