import { Fragment } from 'react';
import type { SiteVals } from '../site/renderVals';
import { parseStyle } from '../site/style';

export function FocusOverlay({ v }: { v: SiteVals }) {
  return (
    <>
      {v.fOpen ? (
        <div className="focus-root" role="dialog" aria-modal="true" aria-label={v.fLabel} tabIndex={-1} onKeyDown={v.fKey} style={{ position: 'fixed', inset: '0', zIndex: '80', outline: 'none' }}>
          <div onClick={v.fClose} style={parseStyle(v.fBackdrop)} />
          <button type="button" aria-label="Close" onClick={v.fClose} style={parseStyle(v.fCloseBtn)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
              <path d="M6 6l12 12M18 6L6 18" stroke="#4A4F57" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </button>
          {v.fIsPhoto ? (
            <div style={parseStyle(v.fCard)}>
              <div style={{ position: 'relative', background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '12px', padding: '22px 22px 0' }}>
                <img src="/assets/photo_of_me.jpg" alt="Photo of Daniel" style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', background: 'linear-gradient(180deg, #E9F8FE, #BDEBFB)', border: '2px solid #D5DAE1', borderRadius: '6px' }} />
                <p style={{ margin: '18px 0 24px', fontFamily: '\'Permanent Marker\', cursive', fontSize: '32px', textAlign: 'center', color: '#3C4046' }}>
                  hi, I'm Daniel
                </p>
                <div aria-hidden="true" style={{ position: 'absolute', top: '-20px', left: '50%', width: '150px', height: '40px', transform: 'translateX(-50%) rotate(-5deg)', background: '#FFE58A', opacity: '0.95', border: '2px solid #E8C65A', borderRadius: '4px' }} />
              </div>
            </div>
          ) : null}
          {v.fIsResume ? (
            <div style={parseStyle(v.fCard)}>
              <div style={{ background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '12px', padding: '14px' }}>
                <iframe src="/assets/Daniel_Hu_Resume_10312026.pdf" title="Daniel Hu resume" style={{ display: 'block', width: '100%', height: 'min(80vh, 720px)', border: '2px solid #D5DAE1', borderRadius: '6px', background: '#FFFFFF' }} />
                <a href="/api/resume" download="Daniel_Hu_Resume_10312026.pdf" target="_blank" rel="noopener" style={{ display: 'inline-block', margin: '10px 2px 0', color: '#5A5F67', font: '600 14px \'Helvetica Neue\', Arial, sans-serif', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Download resume PDF
                </a>
              </div>
            </div>
          ) : null}
          {v.fIsConcert ? (
            <div style={parseStyle(v.fCard)}>
              <div style={{ background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '10px', padding: '18px 18px 0' }}>
                <div style={{ position: 'relative' }}>
                  <button type="button" aria-label="Previous concert" onClick={v.concertPrev} style={{ position: 'absolute', zIndex: '1', left: '-84px', top: '50%', transform: 'translateY(-50%)', width: '42px', height: '42px', borderRadius: '50%', border: '3px solid #D5DAE1', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', boxShadow: 'inset 0 2px 0 #FFFFFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <img src={v.fc.src} alt={`${v.fc.artist} concert photo`} style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', background: '#3C4046', borderRadius: '5px' }} />
                  <button type="button" aria-label="Next concert" onClick={v.concertNext} style={{ position: 'absolute', zIndex: '1', right: '-84px', top: '50%', transform: 'translateY(-50%)', width: '42px', height: '42px', borderRadius: '50%', border: '3px solid #D5DAE1', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', boxShadow: 'inset 0 2px 0 #FFFFFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <p style={{ margin: '14px 0 4px', fontFamily: '\'Permanent Marker\', cursive', fontSize: '28px', textAlign: 'center', color: '#3C4046' }}>
                  {v.fc.artist}
                </p>
                <p style={{ margin: '0 0 18px', font: '600 15px \'Helvetica Neue\', Arial, sans-serif', textAlign: 'center', color: '#5A5F67' }}>
                  {v.fc.city} · {v.fc.date}
                </p>
              </div>
            </div>
          ) : null}
          {v.fIsProj ? (
            <div style={parseStyle(v.fCard)}>
              <div style={{ position: 'relative', height: '100%', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
                <div style={{ width: '100%', boxSizing: 'border-box', border: '8px solid #23262B', borderRadius: '12px', background: '#23262B', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: '700 12px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                    <span>
                      {v.fp.name}
                    </span>
                    {v.fp.hasBadge ? (
                      <span style={parseStyle(v.fp.badgeStyle)}>
                        {v.fp.badge}
                      </span>
                    ) : null}
                  </div>
                  {v.fp.isVideo ? (
                    <video src={v.fp.media} aria-label={`${v.fp.name} demo video`} muted loop playsInline controls style={{ display: 'block', width: '100%', height: '150px', objectFit: 'cover', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)', borderBottom: '1px solid #D5DAE1' }} />
                  ) : null}
                  {v.fp.isImage ? (
                    <img src={v.fp.media} alt={`${v.fp.name} screenshot`} style={{ display: 'block', width: '100%', height: '150px', objectFit: 'cover', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)', borderBottom: '1px solid #D5DAE1' }} />
                  ) : null}
                  <div style={{ background: '#FFFFFF', padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: '\'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                    <h3 style={{ margin: '0', font: '800 24px \'M PLUS Rounded 1c\', sans-serif', color: '#3C4046' }}>
                      {v.fp.name}
                    </h3>
                    <p style={{ margin: '0', fontWeight: '700', fontSize: '12px', color: '#4A4F57' }}>
                      {v.fp.sub}
                    </p>
                    <p style={{ margin: '0', minHeight: '58.5px', maxHeight: '58.5px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', fontSize: '13px', lineHeight: '1.5', color: '#3C4046' }}>
                      {v.fp.desc}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '2px' }}>
                      {v.fp.chips.map((cp: any, i0: number) => (
                        <Fragment key={i0}>
                          <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                            {cp.ch}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', flexShrink: '0', position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' }}>
                  <button type="button" aria-label="Menu: close project" onClick={v.fClose} style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', minWidth: '60px', minHeight: '44px', border: '0', background: 'transparent', font: '800 12px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#7E848D', cursor: 'pointer' }}>
                    MENU
                  </button>
                  <button type="button" aria-label="Previous project" onClick={v.projPrev} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', left: '0' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button type="button" aria-label="Next project" onClick={v.projNext} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', right: '0' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <span aria-hidden="true" style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M4 6l8 6-8 6z" fill="#7E848D" />
                      <path d="M15 6v12M19 6v12" stroke="#7E848D" strokeWidth="2.5" />
                    </svg>
                  </span>
                  <a className="proj-cta" href={v.fp.href} onClick={v.projectRepo} target="_blank" rel="noopener noreferrer" aria-label={`View ${v.fp.name} project`} style={{ position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', font: '800 10px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#4A4F57' }}>
                    VIEW
                  </a>
                </div>
              </div>
            </div>
          ) : null}
          {v.fIsSpotify ? (
            <div style={parseStyle(v.fCard)}>
              <div className="slab3d" style={{ position: 'relative', width: '100%', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
                {v.slab.map((L: any, i0: number) => (
                  <Fragment key={i0}>
                    <div className="slab-layer" aria-hidden="true" style={parseStyle(L.style)} />
                  </Fragment>
                ))}
                <div className="slab-layer slab-face" aria-hidden="true" />
                <div style={{ width: '100%', boxSizing: 'border-box', border: '8px solid #23262B', borderRadius: '12px', background: '#23262B', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: '700 12px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                    <span>
                      {v.receiptTitle}
                    </span>
                    <span style={{ fontWeight: '600', fontSize: '11px', color: '#4A4F57' }}>
                      {v.receiptRange}
                    </span>
                  </div>
                  <div role="list" aria-label={`Daniel's ${v.receiptTitle}, last ${v.receiptRange}`} style={{ height: '260px', overflow: 'hidden', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
                    {v.receiptRows.map((m: any, i0: number) => (
                      <Fragment key={i0}>
                        <div role="listitem" onPointerEnter={m.pick} style={parseStyle(m.style)}>
                          <span style={parseStyle(m.numStyle)}>
                            {m.num}
                          </span>
                          <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.name}
                          </span>
                          <span style={parseStyle(m.metaStyle)}>
                            {m.meta}
                          </span>
                          <span aria-hidden="true">
                            ›
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' }}>
                  <button type="button" aria-label="Menu: back to top" onClick={v.menu} style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', minWidth: '60px', minHeight: '44px', border: '0', background: 'transparent', font: '800 12px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#7E848D', cursor: 'pointer' }}>
                    MENU
                  </button>
                  <button type="button" aria-label="Previous receipt" onClick={v.trackPrev} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <a className="proj-cta sp-btn" href={v.spotifyProfile} target="_blank" rel="noopener noreferrer" aria-label="Daniel on Spotify" style={{ position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', boxSizing: 'border-box', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#4A4F57" strokeLinecap="round">
                      <path d="M3.6 8.7c5.4-1.8 11.6-1.3 16.6 1.4" strokeWidth="2.7" />
                      <path d="M5 12.7c4.5-1.4 9.6-1 13.6 1.2" strokeWidth="2.3" />
                      <path d="M6.3 16.5c3.7-1.1 7.6-.8 10.8 1" strokeWidth="1.9" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ) : null}
          {v.fIsSkills ? (
            <div style={parseStyle(v.fCard)}>
              <div className="slab3d" style={{ height: '100%', position: 'relative', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
                {v.slab.map((L: any, i0: number) => (
                  <Fragment key={i0}>
                    <div className="slab-layer" aria-hidden="true" style={parseStyle(L.style)} />
                  </Fragment>
                ))}
                <div className="slab-layer slab-face" aria-hidden="true" />
                <div style={{ width: '100%', boxSizing: 'border-box', border: '8px solid #23262B', borderRadius: '12px', background: '#23262B', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', textAlign: 'center', font: '700 12px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                    Skills
                  </div>
                  <div role="list" aria-label="Skill categories" style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', fontFamily: '\'Helvetica Neue\', Arial, sans-serif' }}>
                    {v.skillRows.map((k: any, i0: number) => (
                      <Fragment key={i0}>
                        <div role="listitem" aria-current={k.current} onPointerEnter={k.pick} style={parseStyle(k.style)}>
                          <span style={{ fontWeight: '700', fontSize: '15px' }}>
                            {k.name}
                          </span>
                          <span style={parseStyle(k.itemsStyle)}>
                            {k.items}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: '0', position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' }}>
                  <span aria-hidden="true" style={{ position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)', font: '800 12px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#7E848D' }}>
                    MENU
                  </span>
                  <button type="button" aria-label="Previous skill category" onClick={v.skillPrev} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', left: '0' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button type="button" aria-label="Next skill category" onClick={v.skillNext} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', right: '0' }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <span aria-hidden="true" style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M4 6l8 6-8 6z" fill="#7E848D" />
                      <path d="M15 6v12M19 6v12" stroke="#7E848D" strokeWidth="2.5" />
                    </svg>
                  </span>
                  <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          ) : null}
          {v.fIsHobby ? (
            <>
              <div style={parseStyle(v.fBlurb)}>
                <span style={{ alignSelf: 'flex-start', fontWeight: '800', fontSize: '13px', color: '#2E1F70', background: '#CDBDFF', borderRadius: '999px', padding: '5px 14px' }}>
                  Off the clock
                </span>
                <h2 style={{ margin: '0', fontWeight: '800', fontSize: '44px', color: '#3C4046' }}>
                  {v.fh.title}
                </h2>
                <p style={{ margin: '0', fontSize: '18px', lineHeight: '1.7', color: '#4A4F57' }}>
                  {v.fh.blurb}
                </p>
              </div>
              <div style={parseStyle(v.fCard)}>
                <canvas id="hb-focus" role="img" aria-label={v.fh.label} width="256" height="256" style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', imageRendering: 'pixelated', cursor: 'grab', touchAction: 'none' }} />
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
