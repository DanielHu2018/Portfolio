import { useState, type CSSProperties } from 'react';
import { CONCERT_PHOTOS, HOBBIES } from '../data/content';
import { photoOut, projLeave, projMove, stripLeave } from '../engine/tilt';
import type { OpenFocus } from '../hooks/useFocus';
import type { Player } from '../hooks/usePlayer';
import { NextIcon, PrevIcon, SlabLayers, SpotifyIpod } from './ipod';

const arrowStyle: CSSProperties = { flexShrink: '0', marginBottom: '110px', width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #D5DAE1', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', boxShadow: 'inset 0 2px 0 #FFFFFF, inset 0 -3px 6px rgba(60, 64, 70, 0.06)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const cardStyle: CSSProperties = { position: 'relative', background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '6px', padding: '10px 10px 0' };
const photoStyle: CSSProperties = { aspectRatio: '1 / 1', background: '#3C4046', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', color: '#FFE58A' };
const captionStyle: CSSProperties = { margin: '8px 0 10px', fontFamily: "'Permanent Marker', cursive", fontSize: '15px', textAlign: 'center', color: '#3C4046' };

/** Concert Cover Flow: every photo appears twice so the strip loops endlessly in both directions. */
function CoverFlow({ openFocus }: { openFocus: OpenFocus }) {
  const [center, setCenter] = useState(0);
  const M = CONCERT_PHOTOS * 2;
  const fk = window.innerWidth < 700 ? 0.5 : 1;
  return (
    <div className="rv-item" style={{ marginTop: '0', padding: '0 0 24px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div className="flow-row" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
        <button type="button" className="flow-arrow" aria-label="Previous photo" onClick={() => setCenter((c) => c - 1)} style={arrowStyle}><PrevIcon color="#7E848D" size={22} /></button>
        <div onPointerLeave={stripLeave} style={{ position: 'relative', flex: '1', minWidth: '0', overflow: 'hidden', perspective: '1000px', height: '390px' }}>
          {Array.from({ length: M }, (_, i) => {
            let d = ((i - center) % M + M) % M;
            if (d >= M / 2) d -= M;
            const ad = Math.abs(d);
            const ry = d < 0 ? 58 : (d > 0 ? -58 : 0);
            const z = d === 0 ? 90 : 0;
            const x = d === 0 ? 0 : Math.sign(d) * (134 + (ad - 1) * 74) * fk;
            const shown = ad <= 3;
            return (
              <div
                key={i}
                onClick={(e) => openFocus('concert', i % CONCERT_PHOTOS, e)}
                style={{ position: 'absolute', top: '44px', left: '50%', width: '170px', marginLeft: '-85px', perspective: '700px', cursor: 'pointer', zIndex: 20 - ad, opacity: shown ? 1 : 0, pointerEvents: shown ? 'auto' : 'none', transform: 'translateX(' + x + 'px) rotateY(' + ry + 'deg) translateZ(' + z + 'px)', transition: 'transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.45s ease' }}
              >
                <div className="proj photo3d" onPointerMove={projMove} onPointerLeave={projLeave} onPointerOut={photoOut} style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
                  <div className="slab3d" style={cardStyle}>
                    <SlabLayers thin />
                    <div role="img" aria-label="Concert photo (placeholder)" style={photoStyle}>[CONCERT PHOTO]</div>
                    <p style={captionStyle}>[ARTIST]</p>
                  </div>
                </div>
                <div aria-hidden="true" style={{ position: 'absolute', left: '0', right: '0', top: '100%', marginTop: '6px', transform: 'scaleY(-1)', transformOrigin: '50% 50%', pointerEvents: 'none' }}>
                  <div style={cardStyle}>
                    <div style={photoStyle}>[CONCERT PHOTO]</div>
                    <p style={captionStyle}>[ARTIST]</p>
                  </div>
                  <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(to top, rgba(255, 246, 214, 0.55) 0%, rgba(255, 246, 214, 0.85) 30%, #FFF6D6 55%, #FFF6D6 100%)' }} />
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" className="flow-arrow" aria-label="Next photo" onClick={() => setCenter((c) => c + 1)} style={arrowStyle}><NextIcon color="#7E848D" size={22} /></button>
      </div>
      <p style={{ position: 'relative', margin: '0', font: "700 16px 'Helvetica Neue', Arial, sans-serif", color: '#3C4046' }}>[ARTIST]</p>
      <p style={{ position: 'relative', margin: '0', font: "500 14px 'Helvetica Neue', Arial, sans-serif", color: '#5A5F67' }}>[VENUE] · [DATE]</p>
    </div>
  );
}

export default function OffTheClock({ openFocus, player, onMenu }: { openFocus: OpenFocus; player: Player; onMenu: () => void }) {
  return (
    <section id="off" className="shift" style={{ position: 'relative', padding: '110px clamp(16px, 4vw, 48px)', background: '#FFF6D6', borderTop: '4px solid #D5DAE1', overflow: 'hidden' }}>
      <canvas className="staffs" id="stf-off" aria-hidden="true" />
      <div className="reveal" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '56px' }}>
        <div className="rv-item" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: '800', fontSize: '13px', color: '#2E1F70', background: '#CDBDFF', borderRadius: '999px', padding: '5px 14px' }}>Off the clock</span>
          <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(34px, 4.5vw, 52px)' }}>When I'm not coding</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ margin: '0', fontWeight: '800', fontSize: '28px' }}>Live shows</h3>
          <CoverFlow openFocus={openFocus} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="dots rv-item" style={{ position: 'relative', width: '320px', borderRadius: '40px', perspective: '1100px' }}>
              <SpotifyIpod player={player} onMenu={onMenu} onOpen={(e) => openFocus('spotify', 0, e)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
            {HOBBIES.map((h) => (
              <div key={h.id} className="rv-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas id={h.id} onClick={(e) => openFocus('hobby', h.id, e)} role="img" aria-label={h.gridLabel} width="128" height="128" style={{ display: 'block', width: '100%', maxWidth: '250px', aspectRatio: '1 / 1', imageRendering: 'pixelated', cursor: 'grab', touchAction: 'none' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
