// Sticker guestbook, persisted through /api/stickers (see STICKERS.md). The seed stays up if the API is unavailable.
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { GUESTBOOK_SEED, STICKERS, type Sticker } from '../data/content';
import { sfx } from '../engine/sfx';
import { stickerUri } from '../engine/stickers';

const tagStyle: CSSProperties = { display: 'block', maxWidth: '130px', textAlign: 'center', overflowWrap: 'anywhere', fontWeight: '700', fontSize: '11px', lineHeight: '1.3', color: '#3C4046', background: '#FFFFFF', border: '2px solid #D5DAE1', borderRadius: '10px', padding: '3px 8px' };

export default function Guestbook() {
  const [list, setList] = useState<Sticker[]>(GUESTBOOK_SEED);
  const [pick, setPick] = useState(0);
  const [status, setStatus] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const response = await fetch('/api/stickers');
        if (!response.ok) return;
        const data: unknown = await response.json();
        if (live && Array.isArray(data)) setList(data.map((g) => ({ x: Number(g.x), y: Number(g.y), k: Number(g.k), r: Number(g.r), n: String(g.n || '') })));
      } catch { /* local seed remains available if the API is unavailable */ }
    })();
    return () => { live = false; };
  }, []);

  const add = (x: number, y: number) => {
    const inp = input.current;
    const name = inp ? inp.value.replace(/\s+/g, ' ').trim().slice(0, 40) : '';
    if (inp) inp.value = '';
    const sticker: Sticker = { x, y, k: pick, r: Math.round(Math.random() * 30 - 15), n: name };
    setList((l) => l.concat([sticker]).slice(-80));
    setStatus('Thanks for stopping by!');
    fetch('/api/stickers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sticker) }).catch(() => { /* keep the local sticker visible if saving is unavailable */ });
    sfx('sign');
  };
  const place = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = Math.min(12, 8000 / r.width);
    const x = Math.max(px, Math.min(100 - px, (e.clientX - r.left) / r.width * 100));
    const y = Math.max(10, Math.min(90, (e.clientY - r.top) / r.height * 100));
    add(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    add(Math.round(10 + Math.random() * 80), Math.round(15 + Math.random() * 70));
  };

  return (
    <div className="dots rv-item gb" style={{ '--dot': '#4FA6D3', marginTop: '40px', borderRadius: '44px', padding: '8px', background: 'linear-gradient(135deg, #FFFFFF 0%, #C9CED6 22%, #F4F6F9 40%, #9AA2AD 60%, #EEF1F5 78%, #B9BFC8 100%)' } as CSSProperties}>
      <div style={{ isolation: 'isolate', borderRadius: '36px', padding: '40px clamp(18px, 4vw, 48px)', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '800', fontSize: '13px', color: '#0B3550', background: '#BDEBFB', borderRadius: '999px', padding: '5px 14px' }}>Guestbook</span>
          <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: '1.1' }}>Leave a sticker :)</h2>
          <p style={{ margin: '0', fontSize: '15px', color: '#4A4F57' }}>Pick a sticker, add a short note if you like, then tap anywhere on the board to stick it.</p>
        </div>
        <div className="gb-board" role="button" tabIndex={0} aria-label={'Sticker board. Press Enter to place the selected ' + STICKERS[pick].label.toLowerCase() + ' sticker.'} onClick={place} onKeyDown={key} style={{ position: 'relative', height: 'clamp(240px, 34vw, 340px)', borderRadius: '24px', border: '3px solid #D5DAE1', overflow: 'hidden', cursor: 'copy', backgroundColor: '#F7FBFE', backgroundImage: 'linear-gradient(rgba(52, 190, 237, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 190, 237, 0.1) 1px, transparent 1px)', backgroundSize: '28px 28px', boxShadow: 'inset 0 3px 8px rgba(60, 64, 70, 0.08)' }}>
          {list.map((g, i) => (
            <span key={i} className="gb-stk" style={{ position: 'absolute', left: g.x + '%', top: g.y + '%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transform: 'translate(-50%, -32%)', pointerEvents: 'none' }}>
              <span aria-hidden="true" style={{ position: 'relative', display: 'block', width: 'clamp(48px, 13vw, 66px)', height: 'clamp(48px, 13vw, 66px)', background: stickerUri(g.k) + ' center / contain no-repeat', filter: 'drop-shadow(0 2px 0 rgba(60, 64, 70, 0.1)) drop-shadow(0 5px 6px rgba(60, 64, 70, 0.18))', transform: 'rotate(' + g.r + 'deg)' }} />
              {g.n.trim() && <span style={tagStyle}>{g.n}</span>}
            </span>
          ))}
          <span aria-hidden="true" style={{ position: 'absolute', right: '14px', bottom: '10px', fontWeight: '800', fontSize: '12px', color: '#8D949E', background: 'rgba(255, 255, 255, 0.85)', borderRadius: '999px', padding: '4px 10px' }}>{list.length} stickers</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '14px 18px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '13px', color: '#4A4F57' }}>
            Note
            <input ref={input} id="gb-name" type="text" maxLength={40} placeholder="Say hi!" autoComplete="off" style={{ width: '220px', minHeight: '48px', boxSizing: 'border-box', font: "700 15px 'M PLUS Rounded 1c', sans-serif", color: '#3C4046', background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '999px', padding: '8px 16px', outlineColor: '#34BEED' }} />
          </label>
          <div role="radiogroup" aria-label="Sticker" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {STICKERS.map((k, i) => {
              const on = pick === i;
              return (
                <button key={k.label} type="button" role="radio" aria-checked={on} aria-label={k.label} onClick={() => setPick(i)} style={{ width: '54px', height: '54px', borderRadius: '16px', cursor: 'pointer', padding: '0', background: stickerUri(i) + ' center / 44px 44px no-repeat, ' + (on ? '#E6F7FD' : '#FFFFFF'), border: '3px solid ' + (on ? '#34BEED' : '#D5DAE1'), boxShadow: on ? '0 0 0 3px #BDEBFB' : 'none', transition: 'transform 0.15s', transform: 'scale(' + (on ? 1.08 : 1) + ') rotate(' + (on ? -6 : 0) + 'deg)' }} />
              );
            })}
          </div>
        </div>
        <p role="status" style={{ margin: '-8px 0 0', minHeight: '18px', textAlign: 'center', fontWeight: '700', fontSize: '13px', color: '#1677A8' }}>{status}</p>
      </div>
    </div>
  );
}
