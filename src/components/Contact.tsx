import { type CSSProperties, Fragment } from 'react';
import type { SiteVals } from '../site/renderVals';
import { parseStyle } from '../site/style';

export function Contact({ v }: { v: SiteVals }) {
  return (
    <footer id="contact" className="shift" style={{ position: 'relative', padding: '120px clamp(16px, 4vw, 48px) 90px', background: 'linear-gradient(180deg, #BDEBFB 0%, #8FDBF5 100%)', overflow: 'hidden' }}>
      <canvas className="staffs" id="stf-contact" aria-hidden="true" />
      <div className={v.rv_contact} style={{ position: 'relative', maxWidth: '860px', margin: '0 auto' }}>
        <div className="dots rv-item" style={{ '--dot': '#4FA6D3', borderRadius: '44px', padding: '8px', background: 'linear-gradient(135deg, #FFFFFF 0%, #C9CED6 22%, #F4F6F9 40%, #9AA2AD 60%, #EEF1F5 78%, #B9BFC8 100%)' } as CSSProperties}>
          <div style={{ isolation: 'isolate', background: '#FFFFFF', borderRadius: '36px', padding: '48px clamp(20px, 4vw, 56px)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '22px' }}>
            <span style={{ fontWeight: '800', fontSize: '13px', color: '#4A2306', background: '#FFC59A', borderRadius: '999px', padding: '5px 14px' }}>
              Contact
            </span>
            <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: '1.05' }}>
              Let's build something together.
            </h2>
            <p style={{ margin: '0', fontSize: '17px', color: '#4A4F57' }}>
              Open to new grad software and AI engineering roles.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              <a className="pill" href="#resume" onClick={v.openResume} style={{ minHeight: '52px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', fontWeight: '800', fontSize: '15px', textDecoration: 'none', color: '#3C4046', background: '#FFFFFF', border: '3px solid #C9CED6', borderRadius: '999px', padding: '10px 22px' }}>
                Resume
              </a>
              <a className="pill" href="https://www.linkedin.com/in/danielhu2005" target="_blank" rel="noopener noreferrer" style={{ minHeight: '52px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', fontWeight: '800', fontSize: '15px', textDecoration: 'none', color: '#3C4046', background: '#FFFFFF', border: '3px solid #C9CED6', borderRadius: '999px', padding: '10px 22px' }}>
                LinkedIn
              </a>
              <a className="pill" href="https://github.com/DanielHu2018" target="_blank" rel="noopener noreferrer" style={{ minHeight: '52px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', fontWeight: '800', fontSize: '15px', textDecoration: 'none', color: '#3C4046', background: '#FFFFFF', border: '3px solid #C9CED6', borderRadius: '999px', padding: '10px 22px' }}>
                GitHub
              </a>
            </div>
            <p style={{ margin: '0', fontWeight: '700', fontSize: '18px', color: '#1677A8' }}>
              hu.daniel.w@gmail.com
            </p>
          </div>
        </div>
        <div className="dots rv-item gb" style={{ '--dot': '#4FA6D3', marginTop: '40px', borderRadius: '44px', padding: '8px', background: 'linear-gradient(135deg, #FFFFFF 0%, #C9CED6 22%, #F4F6F9 40%, #9AA2AD 60%, #EEF1F5 78%, #B9BFC8 100%)' } as CSSProperties}>
          <div style={{ isolation: 'isolate', borderRadius: '36px', padding: '40px clamp(18px, 4vw, 48px)', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '800', fontSize: '13px', color: '#0B3550', background: '#BDEBFB', borderRadius: '999px', padding: '5px 14px' }}>
                Guestbook
              </span>
              <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: '1.1' }}>
                Leave a sticker :)
              </h2>
              <p style={{ margin: '0', fontSize: '15px', color: '#4A4F57' }}>
                Pick a sticker, add a short note if you like, then tap anywhere on the board to stick it.
              </p>
            </div>
            <div className="gb-board" role="button" tabIndex={0} aria-label={v.gbBoardLabel} onClick={v.gbPlace} onKeyDown={v.gbKey} style={{ position: 'relative', height: 'clamp(240px, 34vw, 340px)', borderRadius: '24px', border: '3px solid #D5DAE1', overflow: 'hidden', cursor: 'copy', backgroundColor: '#F7FBFE', backgroundImage: 'linear-gradient(rgba(52, 190, 237, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 190, 237, 0.1) 1px, transparent 1px)', backgroundSize: '28px 28px', boxShadow: 'inset 0 3px 8px rgba(60, 64, 70, 0.08)' }}>
              {v.gbList.map((g: any, i0: number) => (
                <Fragment key={i0}>
                  <span className="gb-stk" style={parseStyle(g.wrap)}>
                    <span style={{ position: 'relative', display: 'block' }}>
                      <span aria-hidden="true" style={parseStyle(g.style)} />
                      {g.mine ? (
                        <button type="button" className="gb-del" aria-label={g.removeLabel} title="Remove your sticker" onClick={g.remove} onKeyDown={g.removeKey}>
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="10" height="10"><path d="M6 6l12 12M18 6L6 18" stroke="#4A4F57" strokeWidth="3.2" strokeLinecap="round" /></svg>
                        </button>
                      ) : null}
                    </span>
                    {g.hasNote ? (
                      <span style={parseStyle(g.tag)}>
                        {g.name}
                      </span>
                    ) : null}
                  </span>
                </Fragment>
              ))}
              <span aria-hidden="true" style={{ position: 'absolute', right: '14px', bottom: '10px', fontWeight: '800', fontSize: '12px', color: '#8D949E', background: 'rgba(255, 255, 255, 0.85)', borderRadius: '999px', padding: '4px 10px' }}>
                {v.gbCount}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '14px 18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '13px', color: '#4A4F57' }}>
                Note{' '}
                <input id="gb-name" type="text" maxLength={40} placeholder="Say hi!" autoComplete="off" style={{ width: '220px', minHeight: '48px', boxSizing: 'border-box', font: '700 15px \'M PLUS Rounded 1c\', sans-serif', color: '#3C4046', background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '999px', padding: '8px 16px', outlineColor: '#34BEED' }} />
              </label>
              <div role="radiogroup" aria-label="Sticker" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                {v.gbStickers.map((sk: any, i0: number) => (
                  <Fragment key={i0}>
                    <button type="button" role="radio" aria-checked={sk.on} aria-label={sk.label} onClick={sk.pick} style={parseStyle(sk.style)} />
                  </Fragment>
                ))}
              </div>
            </div>
            <p role="status" style={{ margin: '-8px 0 0', minHeight: '18px', textAlign: 'center', fontWeight: '700', fontSize: '13px', color: v.gbMsgColor }}>
              {v.gbStatus}
            </p>
          </div>
        </div>
        <p style={{ position: 'relative', margin: '28px 0 0', textAlign: 'center', fontSize: '13px', color: '#24506A' }}>
          {"Designed & built by Daniel Hu · © 2026"}
        </p>
      </div>
    </footer>
  );
}
