import type { SiteVals } from '../site/renderVals';

export function Hero({ v }: { v: SiteVals }) {
  return (
    <header id="hero" className="shift" style={{ position: 'relative', overflow: 'hidden', padding: '20px clamp(16px, 4vw, 48px) 0' }}>
      <canvas className="staffs" id="stf-hero" aria-hidden="true" />
      <nav aria-label="Primary" style={{ position: 'relative', zIndex: '2', maxWidth: '1240px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <a href="#hero" style={{ minHeight: '44px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '17px', textDecoration: 'none', color: '#3C4046', background: '#FFFFFF', border: '3px solid #D5DAE1', borderRadius: '999px', padding: '6px 18px 6px 8px' }}>
          <span aria-hidden="true" style={{ width: '30px', height: '30px', borderRadius: '50%', background: v.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '13px' }}>
            DH
          </span>
          Daniel Hu
        </a>
      </nav>
      <div style={{ position: 'relative', zIndex: '2', flex: '1', width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '48px 0 56px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between', gap: '48px' }}>
        <div style={{ flex: '999 1 460px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 onPointerEnter={v.waveMii} style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(60px, 9vw, 136px)', lineHeight: '0.95', letterSpacing: '-0.01em', color: '#3C4046' }}>
            Daniel Hu
          </h1>
          <p style={{ alignSelf: 'flex-start', margin: '0', fontWeight: '800', fontSize: 'clamp(18px, 2vw, 24px)', color: '#0B3550', background: 'linear-gradient(180deg, #A6E6FB 0%, #34BEED 100%)', border: '3px solid #1A9CCB', borderRadius: '999px', padding: '8px 26px', boxShadow: 'inset 0 2px 0 rgba(255, 255, 255, 0.7)' }}>
            Software and AI Engineer
          </p>
          <p style={{ margin: '0', maxWidth: '600px', fontSize: '19px', lineHeight: '1.5', fontWeight: '700', color: '#3C4046' }}>
            I build AI products that turn messy, high-stakes decisions into clear next steps.
          </p>
          <p style={{ margin: '0', maxWidth: '540px', fontSize: '15px', lineHeight: '1.6', fontWeight: '500', color: '#4A4F57' }}>
            Honors CSE at Ohio State · Statistics minor · Graduating December 2026 · Columbus, OH
          </p>
        </div>
      </div>
      <div className="bleed hero-dock" style={{ position: 'relative', zIndex: '2', margin: '0 calc(-1 * clamp(16px, 4vw, 48px))', background: 'linear-gradient(180deg, #F7F8FA, #E3E7EC)', borderTop: '3px solid #D5DAE1', borderRadius: '40px 40px 0 0', padding: '18px clamp(16px, 4vw, 48px) 29px' }}>
        <div style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
          <a className="pill" href="https://www.linkedin.com/in/danielhu2005" target="_blank" rel="noopener noreferrer" style={{ minHeight: '52px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', fontWeight: '800', fontSize: '15px', textDecoration: 'none', color: '#3C4046', background: '#FFFFFF', border: '3px solid #C9CED6', borderRadius: '999px', padding: '10px 22px' }}>
            LinkedIn
          </a>
          <a className="pill" href="#resume" onClick={v.openResume} style={{ minHeight: '52px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', fontWeight: '800', fontSize: '15px', textDecoration: 'none', color: '#3C4046', background: '#FFFFFF', border: '3px solid #C9CED6', borderRadius: '999px', padding: '10px 22px' }}>
            Resume
          </a>
          <a className="pill" href="https://github.com/DanielHu2018" target="_blank" rel="noopener noreferrer" style={{ minHeight: '52px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', fontWeight: '800', fontSize: '15px', textDecoration: 'none', color: '#3C4046', background: '#FFFFFF', border: '3px solid #C9CED6', borderRadius: '999px', padding: '10px 22px' }}>
            GitHub
          </a>
          <a className="pill" href="mailto:hu.daniel.w@gmail.com" style={{ minHeight: '52px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', fontWeight: '700', fontSize: '15px', textDecoration: 'none', color: '#3C4046', background: '#FFFFFF', border: '3px solid #C9CED6', borderRadius: '999px', padding: '10px 22px' }}>
            hu.daniel.w@gmail.com
          </a>
        </div>
      </div>
    </header>
  );
}
