import { type CSSProperties, Fragment } from 'react';
import type { SiteVals } from '../site/renderVals';
import { parseStyle } from '../site/style';

export function Projects({ v }: { v: SiteVals }) {
  return (
    <section id="work" className="shift" style={{ position: 'relative', padding: '110px clamp(16px, 4vw, 48px) 130px', background: '#E9F8FE', borderTop: '4px solid #D5DAE1', borderBottom: '4px solid #D5DAE1', overflow: 'hidden' }}>
      <canvas className="staffs" id="stf-work" aria-hidden="true" />
      <div className={v.rv_work} style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '44px' }}>
        <div className="rv-item" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: '800', fontSize: '13px', color: '#5C1236', background: '#FFB8DA', borderRadius: '999px', padding: '5px 14px' }}>
            Projects
          </span>
          <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(34px, 4.5vw, 52px)' }}>
            Featured projects
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px 32px', alignItems: 'stretch' }}>
          <article className="dots rv-item project-card" style={{ '--dot': '#E8B400', position: 'relative', minHeight: '680px', borderRadius: '40px', perspective: '1100px' } as CSSProperties}>
            <div className="slab3d proj" onClick={v.openProj0} onPointerMove={v.projMove} onPointerLeave={v.projLeave} style={{ position: 'relative', height: '100%', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
              {v.slab.map((L: any, i0: number) => (
                <Fragment key={i0}>
                  <div className="slab-layer" aria-hidden="true" style={parseStyle(L.style)} />
                </Fragment>
              ))}
              <div className="slab-layer slab-face" aria-hidden="true" />
              <div style={{ width: '100%', boxSizing: 'border-box', border: '8px solid #23262B', borderRadius: '12px', background: '#23262B', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: '700 12px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                  <span>
                    CLARA
                  </span>
                  <span style={{ color: '#4A3700', background: '#FFD23F', borderRadius: '999px', padding: '0 8px' }}>
                    1st place
                  </span>
                </div>
                <img src="/assets/clara.jpeg" alt="CLARA screenshot" style={{ display: 'block', width: '100%', height: '150px', objectFit: 'cover', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)', borderBottom: '1px solid #D5DAE1' }} />
                <div style={{ background: '#FFFFFF', padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: '\'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                  <h3 style={{ margin: '0', font: '800 24px \'M PLUS Rounded 1c\', sans-serif', color: '#3C4046' }}>
                    CLARA
                  </h3>
                  <p style={{ margin: '0', fontWeight: '700', fontSize: '12px', color: '#4A4F57' }}>
                    1st place · IBM SkillsBuild × OSU FinTech Hackathon
                  </p>
                  <p style={{ margin: '0', minHeight: '58.5px', maxHeight: '58.5px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', fontSize: '13px', lineHeight: '1.5', color: '#3C4046' }}>
                    A decision-support agent that turns live global events into portfolio risk signals, stress-tests positions, and recommends optimized hedges before markets move.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '2px' }}>
                    <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                      IBM Granite
                    </span>
                    <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                      Black-Scholes
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'auto', flexShrink: '0', position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)', font: '800 12px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#7E848D' }}>
                  MENU
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M4 6l8 6-8 6z" fill="#7E848D" />
                    <path d="M15 6v12M19 6v12" stroke="#7E848D" strokeWidth="2.5" />
                  </svg>
                </span>
                <a className="proj-cta" href="https://github.com/DanielHu2018/CLARA" onClick={v.projectRepo} target="_blank" rel="noopener noreferrer" aria-label="View CLARA project" style={{ position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', font: '800 10px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#4A4F57' }}>
                  VIEW
                </a>
              </div>
            </div>
          </article>
          <article className="dots rv-item project-card" style={{ '--dot': '#3FB872', position: 'relative', minHeight: '680px', borderRadius: '40px', perspective: '1100px' } as CSSProperties}>
            <div className="slab3d proj" onClick={v.openProj1} onPointerMove={v.projMove} onPointerLeave={v.projLeave} style={{ position: 'relative', height: '100%', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
              {v.slab.map((L: any, i0: number) => (
                <Fragment key={i0}>
                  <div className="slab-layer" aria-hidden="true" style={parseStyle(L.style)} />
                </Fragment>
              ))}
              <div className="slab-layer slab-face" aria-hidden="true" />
              <div style={{ width: '100%', boxSizing: 'border-box', border: '8px solid #23262B', borderRadius: '12px', background: '#23262B', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: '700 12px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                  <span>
                    Sierra
                  </span>
                </div>
                <img src="/assets/sierra.png" alt="Sierra screenshot" style={{ display: 'block', width: '100%', height: '150px', objectFit: 'cover', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)', borderBottom: '1px solid #D5DAE1' }} />
                <div style={{ background: '#FFFFFF', padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: '\'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                  <h3 style={{ margin: '0', font: '800 24px \'M PLUS Rounded 1c\', sans-serif', color: '#3C4046' }}>
                    Sierra
                  </h3>
                  <p style={{ margin: '0', fontWeight: '700', fontSize: '12px', color: '#4A4F57' }}>
                    AI platform for transmission planning
                  </p>
                  <p style={{ margin: '0', minHeight: '58.5px', maxHeight: '58.5px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', fontSize: '13px', lineHeight: '1.5', color: '#3C4046' }}>
                    Routes transmission lines with multi-objective pathfinding and answers regulatory questions with RAG.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '2px' }}>
                    <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                      TypeScript
                    </span>
                    <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                      React
                    </span>
                    <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                      Node.js
                    </span>
                    <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                      Claude API
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'auto', flexShrink: '0', position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)', font: '800 12px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#7E848D' }}>
                  MENU
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M4 6l8 6-8 6z" fill="#7E848D" />
                    <path d="M15 6v12M19 6v12" stroke="#7E848D" strokeWidth="2.5" />
                  </svg>
                </span>
                <a className="proj-cta" href="https://github.com/DanielHu2018/Sierra" onClick={v.projectRepo} target="_blank" rel="noopener noreferrer" aria-label="View Sierra project" style={{ position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', font: '800 10px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#4A4F57' }}>
                  VIEW
                </a>
              </div>
            </div>
          </article>
          <article className="dots rv-item project-card" style={{ '--dot': '#EE5FA6', position: 'relative', minHeight: '680px', borderRadius: '40px', perspective: '1100px' } as CSSProperties}>
            <div className="slab3d proj" onClick={v.openProj2} onPointerMove={v.projMove} onPointerLeave={v.projLeave} style={{ position: 'relative', height: '100%', boxSizing: 'border-box', padding: '20px 20px 28px', borderRadius: '40px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
              {v.slab.map((L: any, i0: number) => (
                <Fragment key={i0}>
                  <div className="slab-layer" aria-hidden="true" style={parseStyle(L.style)} />
                </Fragment>
              ))}
              <div className="slab-layer slab-face" aria-hidden="true" />
              <div style={{ width: '100%', boxSizing: 'border-box', border: '8px solid #23262B', borderRadius: '12px', background: '#23262B', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: '700 12px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                  <span>
                    Disco
                  </span>
                  <span style={{ color: '#12452A', background: '#A9EBC2', borderRadius: '999px', padding: '0 8px' }}>
                    HackOHI/O 2026
                  </span>
                </div>
                <video src="/assets/disco-demo.mp4" aria-label="Disco demo video" muted loop playsInline controls style={{ display: 'block', width: '100%', height: '150px', objectFit: 'cover', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)', borderBottom: '1px solid #D5DAE1' }} />
                <div style={{ background: '#FFFFFF', padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: '\'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                  <h3 style={{ margin: '0', font: '800 24px \'M PLUS Rounded 1c\', sans-serif', color: '#3C4046' }}>
                    Disco
                  </h3>
                  <p style={{ margin: '0', fontWeight: '700', fontSize: '12px', color: '#4A4F57' }}>
                    HackOHI/O 2026 · agentic product prototype
                  </p>
                  <p style={{ margin: '0', minHeight: '58.5px', maxHeight: '58.5px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', fontSize: '13px', lineHeight: '1.5', color: '#3C4046' }}>
                    A multi-agent social planning system that combines friend-vouched recommendations with agent-to-agent negotiation to turn a natural-language idea into an approved group plan that works for everyone.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '2px' }}>
                    <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                      Multi-agent systems
                    </span>
                    <span style={{ font: '700 11px \'Helvetica Neue\', Arial, sans-serif', borderRadius: '999px', padding: '3px 9px', background: '#F1F3F6', border: '1px solid #D5DAE1', color: '#3C4046' }}>
                      Privacy by design
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'auto', flexShrink: '0', position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)', font: '800 12px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#7E848D' }}>
                  MENU
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex' }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M4 6l8 6-8 6z" fill="#7E848D" />
                    <path d="M15 6v12M19 6v12" stroke="#7E848D" strokeWidth="2.5" />
                  </svg>
                </span>
                <a className="proj-cta" href="https://github.com/ricky-he2006/hackio" onClick={v.projectRepo} target="_blank" rel="noopener noreferrer" aria-label="View Disco project" style={{ position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', font: '800 10px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#4A4F57' }}>
                  VIEW
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
