// Floating iPod navigator: drag to move, double-click to dock, click wheel steps between sections.
import { useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react';
import { SECTIONS } from '../data/content';
import type { Player } from '../hooks/usePlayer';
import { ClickWheel, ProgressBar } from './ipod';

interface Props {
  sel: number;
  go: (i: number) => void;
  player: Player;
  onPicked: () => void;
}

const isSmall = () => window.innerWidth < 1100;
const rowBase: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '30px', padding: '0 9px', textDecoration: 'none', font: "600 13px 'Helvetica Neue', Arial, sans-serif" };

export default function IpodNav({ sel, go, player, onPicked }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const dragStart = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    if ((e.target as Element).closest('button, a')) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const ox = e.clientX - r.left;
    const oy = e.clientY - r.top;
    const w = r.width;
    const h = r.height;
    const tf = isSmall() ? 'scale(0.54)' : 'scale(0.84)';
    e.preventDefault();
    let dragPos: { x: number; y: number } | null = null;
    const move = (ev: globalThis.PointerEvent) => {
      const x = Math.min(Math.max(0, ev.clientX - ox), Math.max(0, window.innerWidth - w));
      const y = Math.min(Math.max(0, ev.clientY - oy), Math.max(0, window.innerHeight - h));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.transform = tf;
      el.style.transformOrigin = 'top left';
      dragPos = { x: Math.round(x), y: Math.round(y) };
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (dragPos) setPos(dragPos);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const resetPos = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as Element).closest('button, a')) return;
    const s = e.currentTarget.style;
    s.left = ''; s.top = ''; s.right = ''; s.bottom = ''; s.transform = ''; s.transformOrigin = '';
    setPos(null);
  };

  const style: CSSProperties | undefined = pos
    ? { left: pos.x + 'px', top: pos.y + 'px', right: 'auto', bottom: 'auto', transformOrigin: 'top left', transform: isSmall() ? 'scale(0.54)' : 'scale(0.84)' }
    : undefined;

  return (
    <aside className="ipod" aria-label="Site navigator" title="Drag to move · double-click to dock" style={style} onPointerDown={dragStart} onDoubleClick={resetPos}>
      <div className="dots" style={{ cursor: 'grab', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', width: '230px', boxSizing: 'border-box', padding: '16px 16px 22px', borderRadius: '34px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF, inset 0 -6px 12px rgba(60, 64, 70, 0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
        <div style={{ width: '100%', boxSizing: 'border-box', border: '7px solid #23262B', borderRadius: '10px', background: '#23262B', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: "700 11px 'Helvetica Neue', Arial, sans-serif", color: '#23262B' }}>
            <svg aria-hidden="true" viewBox="0 0 10 10" width="9" height="9">
              <path d={player.playing ? 'M2 1h2v8H2zM6 1h2v8H6z' : 'M2 1l7 4-7 4z'} fill="#23262B" />
            </svg>
            <span>Daniel Hu</span>
            <span aria-hidden="true" style={{ width: '9px' }} />
          </div>
          <div style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={'#' + s.id}
                aria-current={i === sel ? 'true' : 'false'}
                onClick={(e) => { e.preventDefault(); go(i); onPicked(); }}
                style={{ ...rowBase, ...(i === sel ? { color: '#FFFFFF', background: 'linear-gradient(180deg, #6EC3F5 0%, #2A8BD8 100%)' } : { color: '#23262B', background: '#FFFFFF' }) }}
              >
                {s.label}<span aria-hidden="true">›</span>
              </a>
            ))}
          </div>
          {player.playing && (
            <div style={{ background: 'linear-gradient(180deg, #F1F3F6, #E2E6EB)', borderTop: '1px solid #B9BFC8', padding: '5px 8px', display: 'flex', flexDirection: 'column', gap: '4px', font: "600 10px 'Helvetica Neue', Arial, sans-serif", color: '#23262B' }}>
              <span>Now Playing · {player.title}</span>
              <ProgressBar span pct={player.pct} height={5} fill="#FFFFFF" />
            </div>
          )}
        </div>
        <ClickWheel
          prevLabel="Previous section"
          nextLabel="Next section"
          centerLabel="Open highlighted section"
          playing={player.playing}
          onMenu={() => go(0)}
          onPrev={() => go(sel - 1)}
          onNext={() => go(sel + 1)}
          onPlay={player.togglePlay}
          onCenter={() => go(sel)}
        />
      </div>
    </aside>
  );
}
