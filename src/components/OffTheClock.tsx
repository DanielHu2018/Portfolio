import { Fragment } from 'react';
import type { SiteVals } from '../site/renderVals';
import { parseStyle } from '../site/style';
import { ReceiptScreen } from './ReceiptScreen';

export function OffTheClock({ v }: { v: SiteVals }) {
  return (
    <section id="off" className="shift" style={{ position: 'relative', padding: '110px clamp(16px, 4vw, 48px)', background: '#FFF6D6', borderTop: '4px solid #D5DAE1', overflow: 'hidden' }}>
      <canvas className="staffs" id="stf-off" aria-hidden="true" />
      <div className={v.rv_off} style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '56px' }}>
        <div className="rv-item" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: '800', fontSize: '13px', color: '#2E1F70', background: '#CDBDFF', borderRadius: '999px', padding: '5px 14px' }}>
            Off the clock
          </span>
          <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(34px, 4.5vw, 52px)' }}>
            When I'm not coding
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ margin: '0', fontWeight: '800', fontSize: '28px' }}>
            Concerts
          </h3>
          <div className="rv-item" style={{ marginTop: '0', padding: '0 0 24px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="flow-row" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <button type="button" className="flow-arrow" aria-label="Previous photo" onClick={v.flowPrev} style={{ flexShrink: '0', marginBottom: '110px', width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #D5DAE1', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', boxShadow: 'inset 0 2px 0 #FFFFFF, inset 0 -3px 6px rgba(60, 64, 70, 0.06)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
                  <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </button>
              <div onPointerLeave={v.stripLeave} style={{ position: 'relative', flex: '1', minWidth: '0', overflow: 'hidden', perspective: '1000px', height: '390px' }}>
                {v.flow.map((c: any, i0: number) => (
                  <Fragment key={i0}>
                    <div style={parseStyle(c.style)} onClick={c.open}>
                      <div className="proj photo3d" onPointerMove={v.projMove} onPointerLeave={v.projLeave} onPointerOut={v.photoOut} style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
                        <div className="slab3d" style={{ position: 'relative', background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '6px', padding: '10px 10px 0' }}>
                          {v.slabThin.map((L: any, i1: number) => (
                            <Fragment key={i1}>
                              <div className="slab-layer" aria-hidden="true" style={parseStyle(L.style)} />
                            </Fragment>
                          ))}
                          <img src={c.src} alt={`${c.artist} concert photo`} style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', background: '#3C4046', borderRadius: '3px' }} />
                          <p style={{ margin: '8px 0 10px', fontFamily: '\'Permanent Marker\', cursive', fontSize: '15px', textAlign: 'center', color: '#3C4046' }}>
                            {c.artist}
                          </p>
                        </div>
                      </div>
                      <div aria-hidden="true" style={{ position: 'absolute', left: '0', right: '0', top: '100%', marginTop: '6px', transform: 'scaleY(-1)', transformOrigin: '50% 50%', pointerEvents: 'none' }}>
                        <div style={{ position: 'relative', background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '6px', padding: '10px 10px 0' }}>
                          <img src={c.src} alt={`${c.artist} concert photo`} style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', background: '#3C4046', borderRadius: '3px' }} />
                          <p style={{ margin: '8px 0 10px', fontFamily: '\'Permanent Marker\', cursive', fontSize: '15px', textAlign: 'center', color: '#3C4046' }}>
                            {c.artist}
                          </p>
                        </div>
                        <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(to top, rgba(255, 246, 214, 0.55) 0%, rgba(255, 246, 214, 0.85) 30%, #FFF6D6 55%, #FFF6D6 100%)' }} />
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <button type="button" className="flow-arrow" aria-label="Next photo" onClick={v.flowNext} style={{ flexShrink: '0', marginBottom: '110px', width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #D5DAE1', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', boxShadow: 'inset 0 2px 0 #FFFFFF, inset 0 -3px 6px rgba(60, 64, 70, 0.06)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
                  <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p aria-hidden="true" style={{ display: 'none', position: 'relative', margin: '0', font: '700 16px \'Helvetica Neue\', Arial, sans-serif', color: '#3C4046' }}>
              {v.flowCurrent.artist}
            </p>
            <p aria-hidden="true" style={{ display: 'none', position: 'relative', margin: '0', font: '500 14px \'Helvetica Neue\', Arial, sans-serif', color: '#5A5F67' }}>
              {v.flowCurrent.city} · {v.flowCurrent.date}
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="dots rv-item" style={{ position: 'relative', width: '320px', borderRadius: '40px', perspective: '1100px' }}>
              <div className="slab3d proj" onClick={v.openSpotify} onPointerMove={v.projMove} onPointerLeave={v.projLeave} style={{ cursor: 'zoom-in', position: 'relative', width: '320px', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
                {v.slab.map((L: any, i0: number) => (
                  <Fragment key={i0}>
                    <div className="slab-layer" aria-hidden="true" style={parseStyle(L.style)} />
                  </Fragment>
                ))}
                <div className="slab-layer slab-face" aria-hidden="true" />
                <ReceiptScreen v={v} />
                <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' }}>
                  <button type="button" aria-label={v.rcMenuLabel} onClick={v.rcMenu} style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', minWidth: '60px', minHeight: '44px', border: '0', background: 'transparent', font: '800 12px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#7E848D', cursor: 'pointer' }}>
                    MENU
                  </button>
                  <button type="button" aria-label={v.rcPrevLabel} onClick={v.trackPrev} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button type="button" aria-label="Next receipt" onClick={v.trackNext} style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <span aria-hidden="true" style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M4 6l8 6-8 6z" fill="#7E848D" />
                      <path d="M15 6v12M19 6v12" stroke="#7E848D" strokeWidth="2.5" />
                    </svg>
                  </span>
                  <a className="proj-cta sp-btn" href={v.spotifyProfile} onClick={v.rcCenter} target="_blank" rel="noopener noreferrer" aria-label={v.rcCenterLabel} style={{ position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', boxSizing: 'border-box', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#4A4F57" strokeLinecap="round">
                      <path d="M3.6 8.7c5.4-1.8 11.6-1.3 16.6 1.4" strokeWidth="2.7" />
                      <path d="M5 12.7c4.5-1.4 9.6-1 13.6 1.2" strokeWidth="2.3" />
                      <path d="M6.3 16.5c3.7-1.1 7.6-.8 10.8 1" strokeWidth="1.9" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
            <div className="rv-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <canvas id="hb-guitar" onClick={v.openHob_hb_guitar} role="img" aria-label="3D model of an electric guitar (learning guitar)" width="128" height="128" style={{ display: 'block', width: '100%', maxWidth: '250px', aspectRatio: '1 / 1', imageRendering: 'pixelated', cursor: 'grab', touchAction: 'none' }} />
            </div>
            <div className="rv-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <canvas id="hb-drawing" onClick={v.openHob_hb_drawing} role="img" aria-label="3D model of a pencil (drawing)" width="128" height="128" style={{ display: 'block', width: '100%', maxWidth: '250px', aspectRatio: '1 / 1', imageRendering: 'pixelated', cursor: 'grab', touchAction: 'none' }} />
            </div>
            <div className="rv-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <canvas id="hb-ski" onClick={v.openHob_hb_ski} role="img" aria-label="3D model of crossed skis (skiing)" width="128" height="128" style={{ display: 'block', width: '100%', maxWidth: '250px', aspectRatio: '1 / 1', imageRendering: 'pixelated', cursor: 'grab', touchAction: 'none' }} />
            </div>
            <div className="rv-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <canvas id="hb-volley" onClick={v.openHob_hb_volley} role="img" aria-label="3D model of a volleyball (volleyball)" width="128" height="128" style={{ display: 'block', width: '100%', maxWidth: '250px', aspectRatio: '1 / 1', imageRendering: 'pixelated', cursor: 'grab', touchAction: 'none' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
