// Shared iPod pieces: CSS-3D slab edges, click wheels, project iPods and the Spotify iPod.
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import type { Project } from '../data/content';
import type { Player } from '../hooks/usePlayer';
import { projLeave, projMove } from '../engine/tilt';

/** Stacked layers behind an iPod body that read as its thickness when it tilts. */
const SLAB = Array.from({ length: 12 }, (_, i) => {
  const f = i / 11;
  const c = [221 - Math.round(48 * f), 226 - Math.round(44 * f), 232 - Math.round(36 * f)];
  return {
    transform: 'translateZ(-' + (i + 1) * 3 + 'px)',
    background: i === 11 ? 'linear-gradient(135deg, #FFFFFF 0%, #C9CED6 30%, #F4F6F9 50%, #9AA2AD 75%, #E6E9EE 100%)' : 'rgb(' + c.join(', ') + ')',
  };
});

/** Thinner edge for the photo cards. */
const SLAB_THIN = Array.from({ length: 4 }, (_, i) => ({
  inset: '-3px',
  transform: 'translateZ(-' + ((i + 1) * 1.5).toFixed(1) + 'px)',
  background: i === 3 ? '#D3D9E1' : 'rgb(' + (236 - i * 8) + ', ' + (239 - i * 8) + ', ' + (244 - i * 7) + ')',
}));

export function SlabLayers({ thin }: { thin?: boolean }) {
  const layers = (thin ? SLAB_THIN : SLAB).map((s, i) => <div key={i} className="slab-layer" aria-hidden="true" style={s} />);
  // The face copy keeps the edge layers behind the body even where a browser flattens the 3D.
  return thin ? layers : <>{layers}<div className="slab-layer slab-face" aria-hidden="true" /></>;
}

export function PrevIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}>
      <path d="M6 6v12M18 6l-9 6 9 6z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function NextIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}>
      <path d="M18 6v12M6 6l9 6-9 6z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function PlayPauseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path d="M4 6l8 6-8 6z" fill="#7E848D" />
      <path d="M15 6v12M19 6v12" stroke="#7E848D" strokeWidth="2.5" />
    </svg>
  );
}

const wheelStyle: CSSProperties = { position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' };
const wheelSideBtn: CSSProperties = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const centerBtn: CSSProperties = { position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', cursor: 'pointer' };

interface WheelProps {
  prevLabel: string;
  nextLabel: string;
  centerLabel: string;
  playing: boolean;
  onMenu: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  onCenter: () => void;
}

/** A working click wheel (navigator and Spotify iPod). */
export function ClickWheel(p: WheelProps) {
  return (
    <div style={wheelStyle}>
      <button type="button" aria-label="Menu: back to top" onClick={p.onMenu} style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', minWidth: '60px', minHeight: '44px', border: '0', background: 'transparent', font: "800 12px 'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.06em', color: '#7E848D', cursor: 'pointer' }}>MENU</button>
      <button type="button" aria-label={p.prevLabel} onClick={p.onPrev} style={{ ...wheelSideBtn, left: '0' }}><PrevIcon color="#7E848D" size={18} /></button>
      <button type="button" aria-label={p.nextLabel} onClick={p.onNext} style={{ ...wheelSideBtn, right: '0' }}><NextIcon color="#7E848D" size={18} /></button>
      <button type="button" aria-label="Play or pause music" aria-pressed={p.playing} onClick={p.onPlay} style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><PlayPauseIcon /></button>
      <button type="button" aria-label={p.centerLabel} onClick={p.onCenter} style={centerBtn} />
    </div>
  );
}

const ipodBody: CSSProperties = { position: 'relative', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' };
const screenFrame: CSSProperties = { width: '100%', boxSizing: 'border-box', border: '8px solid #23262B', borderRadius: '12px', background: '#23262B', overflow: 'hidden' };
const titleBar: CSSProperties = { background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', font: "700 12px 'Helvetica Neue', Arial, sans-serif", color: '#23262B' };
const decoIcon: CSSProperties = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' };

/** Project iPod: screenshot screen plus a decorative wheel whose center is the VIEW link. */
export function ProjectIpod({ p, focused, onOpen }: { p: Project; focused?: boolean; onOpen?: MouseEventHandler<HTMLDivElement> }) {
  return (
    <div
      className={focused ? undefined : 'slab3d proj'}
      onClick={onOpen}
      onPointerMove={focused ? undefined : projMove}
      onPointerLeave={focused ? undefined : projLeave}
      style={{ ...ipodBody, height: '100%' }}
    >
      {!focused && <SlabLayers />}
      <div style={screenFrame}>
        <div style={{ ...titleBar, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{p.name}</span>
          {p.badge && <span style={{ color: p.badgeColor, background: p.badgeBg, borderRadius: '999px', padding: focused ? '0 9px' : '0 8px' }}>{p.badge}</span>}
        </div>
        <div role="img" aria-label={p.name + ' screenshot (placeholder)'} style={{ height: '150px', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)', borderBottom: '1px solid #D5DAE1', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 12px 'Helvetica Neue', Arial, sans-serif", color: '#5A5F67' }}>{p.shot}</div>
        <div style={{ background: '#FFFFFF', padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#23262B' }}>
          <h3 style={{ margin: '0', font: "800 24px 'M PLUS Rounded 1c', sans-serif", color: '#3C4046' }}>{p.name}</h3>
          <p style={{ margin: '0', fontWeight: '700', fontSize: '12px', color: '#4A4F57' }}>{p.sub}</p>
          <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.5', color: '#3C4046' }}>{p.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '2px' }}>
            {p.chips.map((ch) => (
              <span key={ch} style={{ font: "700 11px 'Helvetica Neue', Arial, sans-serif", borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>{ch}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...wheelStyle, marginTop: 'auto', flexShrink: '0' }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)', font: "800 12px 'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.06em', color: '#7E848D' }}>MENU</span>
        <span aria-hidden="true" style={{ ...decoIcon, left: '12px' }}><PrevIcon color="#7E848D" size={18} /></span>
        <span aria-hidden="true" style={{ ...decoIcon, right: '12px' }}><NextIcon color="#7E848D" size={18} /></span>
        <span aria-hidden="true" style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex' }}><PlayPauseIcon /></span>
        <a className="proj-cta" href={p.href} aria-label={'View ' + p.name + ' project'} style={{ ...centerBtn, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', font: "800 10px 'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.06em', color: '#4A4F57', cursor: undefined }}>VIEW</a>
      </div>
    </div>
  );
}

/** Spotify iPod: now-playing screen wired to the mini player, plus a playlist embed slot. */
export function SpotifyIpod({ player, onMenu, focused, onOpen }: { player: Player; onMenu: () => void; focused?: boolean; onOpen?: MouseEventHandler<HTMLDivElement> }) {
  const style: CSSProperties = focused
    ? { ...ipodBody, width: '100%' }
    : { cursor: 'zoom-in', ...ipodBody, width: '320px' };
  return (
    <div
      className={focused ? 'slab3d' : 'slab3d proj'}
      onClick={onOpen}
      onPointerMove={focused ? undefined : projMove}
      onPointerLeave={focused ? undefined : projLeave}
      style={style}
    >
      <SlabLayers />
      <div style={screenFrame}>
        <div style={{ ...titleBar, textAlign: 'center' }}>Now Playing</div>
        <div style={{ background: '#FFFFFF', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div role="img" aria-label="Album art (placeholder)" style={{ width: '86px', height: '86px', flexShrink: '0', borderRadius: '4px', background: 'linear-gradient(135deg, #BDEBFB, #FFB8DA)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 10px 'Helvetica Neue', Arial, sans-serif", color: '#3C4046', textAlign: 'center' }}>[ALBUM ART]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: "'Helvetica Neue', Arial, sans-serif", minWidth: '0' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#23262B' }}>{player.title}</span>
              <span style={{ fontSize: '13px', color: '#4A4F57' }}>{player.artist}</span>
              <span style={{ fontSize: '13px', color: '#4A4F57' }}>[YOUR PLAYLIST]</span>
            </div>
          </div>
          <ProgressBar pct={player.pct} height={10} />
          <div style={{ display: 'flex', justifyContent: 'space-between', font: "600 11px 'Helvetica Neue', Arial, sans-serif", color: '#4A4F57' }}>
            <span>{player.elapsedText}</span>
            <span>-{player.remainText}</span>
          </div>
        </div>
      </div>
      <ClickWheel
        prevLabel="Previous track"
        nextLabel="Next track"
        centerLabel="Select"
        playing={player.playing}
        onMenu={onMenu}
        onPrev={() => player.skip(-1)}
        onNext={() => player.skip(1)}
        onPlay={player.togglePlay}
        onCenter={player.togglePlay}
      />
      <div style={{ width: '100%', boxSizing: 'border-box', border: '3px dashed #C9CED6', borderRadius: '16px', padding: '14px', textAlign: 'center', fontWeight: '800', fontSize: '12px', color: '#4A4F57' }}>[SPOTIFY PLAYLIST EMBED]</div>
    </div>
  );
}

/** Track progress bar; `fill` is the unplayed color. Rendered as a span where it sits in inline markup. */
export function ProgressBar({ pct, height, fill = '#F1F3F6', width, span }: { pct: string; height: number; fill?: string; width?: number; span?: boolean }): ReactNode {
  const style: CSSProperties = {
    ...(width ? { display: 'block', width: width + 'px' } : {}),
    height: height + 'px',
    borderRadius: '999px',
    border: '1px solid #9AA2AD',
    background: 'linear-gradient(90deg, #2A8BD8 0%, #6EC3F5 ' + pct + '%, ' + fill + ' ' + pct + '%)',
  };
  return span ? <span aria-hidden="true" style={style} /> : <div aria-hidden="true" style={style} />;
}
