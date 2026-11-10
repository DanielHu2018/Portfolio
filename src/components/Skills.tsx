import { type CSSProperties, Fragment } from 'react';
import type { SiteVals } from '../site/renderVals';
import { parseStyle } from '../site/style';

export function Skills({ v }: { v: SiteVals }) {
  return (
    <section id="skills" className="shift" style={{ position: 'relative', padding: '100px clamp(16px, 4vw, 48px)', overflow: 'hidden' }}>
      <canvas className="staffs" id="stf-skills" aria-hidden="true" />
      <div className={v.rv_skills} style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div className="rv-item" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: '800', fontSize: '13px', color: '#12452A', background: '#A9EBC2', borderRadius: '999px', padding: '5px 14px' }}>
            Skills
          </span>
          <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(34px, 4.5vw, 52px)' }}>
            Toolkit
          </h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '48px 64px' }}>
          <article className="dots rv-item" style={{ '--dot': '#3FB872', position: 'relative', flex: '1 1 320px', maxWidth: '420px', borderRadius: '40px', perspective: '1100px' } as CSSProperties}>
            <div className="slab3d proj" onClick={v.openSkills} onPointerMove={v.projMove} onPointerLeave={v.projLeave} style={{ cursor: 'zoom-in', position: 'relative', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
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
          </article>
          <article className="dots rv-item" style={{ '--dot': '#3FB872', flex: '1 1 340px', maxWidth: '560px', background: '#FFFFFF', border: '4px solid #D5DAE1', borderRadius: '28px', boxShadow: 'inset 0 0 0 4px #FFFFFF', display: 'flex', flexDirection: 'column' } as CSSProperties}>
            <div style={{ borderRadius: '24px 24px 0 0', height: '92px', background: 'linear-gradient(180deg, #EAFBF1, #A9EBC2)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '14px 20px' }}>
              <span style={{ fontWeight: '800', fontSize: '13px', color: '#12452A' }}>
                Where I've used it
              </span>
              <span style={{ fontWeight: '700', fontSize: '13px', color: '#12452A' }}>
                {v.skillCount}
              </span>
            </div>
            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ margin: '0', fontWeight: '800', fontSize: '26px' }}>
                {v.skillName}
              </h3>
              <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', margin: '0 -10px' }}>
                {v.skillUses.map((u: any, i0: number) => (
                  <Fragment key={i0}>
                    <button type="button" className="skill-use" onClick={u.open} style={parseStyle(u.rowStyle)}>
                      {u.isImage ? (
                        <img src={u.media} alt="" style={{ flexShrink: '0', width: '76px', height: '56px', boxSizing: 'border-box', objectFit: 'cover', borderRadius: '12px', border: '3px solid #D5DAE1', background: '#3C4046' }} />
                      ) : null}
                      {u.isVideo ? (
                        <video src={u.media} muted playsInline preload="metadata" aria-hidden="true" style={{ flexShrink: '0', width: '76px', height: '56px', boxSizing: 'border-box', objectFit: 'cover', borderRadius: '12px', border: '3px solid #D5DAE1', background: '#3C4046' }} />
                      ) : null}
                      {u.isMono ? (
                        <span aria-hidden="true" style={parseStyle(u.monoStyle)}>
                          {u.mono}
                        </span>
                      ) : null}
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }}>
                        <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '800', fontSize: '16px', color: '#3C4046' }}>
                            {u.title}
                          </span>
                          <span style={parseStyle(u.tagStyle)}>
                            {u.tag}
                          </span>
                        </span>
                        <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#4A4F57' }}>
                          {u.line}
                        </span>
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
