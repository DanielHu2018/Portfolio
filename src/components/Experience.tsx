import type { SiteVals } from '../site/renderVals';

export function Experience({ v }: { v: SiteVals }) {
  return (
    <section id="experience" className="shift" style={{ padding: '40px clamp(16px, 4vw, 48px) 100px' }}>
      <div className={v.rv_experience} style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="rv-item" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: '800', fontSize: '13px', color: '#4A3700', background: '#FFE58A', borderRadius: '999px', padding: '5px 14px' }}>
            Experience
          </span>
          <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(34px, 4.5vw, 52px)' }}>
            Where I've worked
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <article className="dots rv-item" style={{ background: '#FFFFFF', border: '4px solid #D5DAE1', borderRadius: '28px', boxShadow: 'inset 0 0 0 4px #FFFFFF', display: 'flex', flexDirection: 'column' }}>
            <div style={{ borderRadius: '24px 24px 0 0', height: '92px', backgroundColor: '#FFFFFF', backgroundImage: "url('/assets/nationwide.png')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '14px 20px' }}>
            </div>
            <div style={{ padding: '22px', background: 'linear-gradient(180deg, #E9F8FE, #BDEBFB)', borderRadius: '0 0 24px 24px', display: 'flex', flexGrow: '1', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ margin: '0', fontWeight: '800', fontSize: '26px' }}>
                Nationwide Mutual Insurance Company
              </h3>
              <p style={{ margin: '0', fontWeight: '700', fontSize: '15px' }}>
                Software Engineering Intern · Nationwide Financial, Project Fulcrum
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '6px', color: '#0B3550' }}>
                <span style={{ fontWeight: '800', fontSize: '13px' }}>
                  Internship
                </span>
                <span style={{ fontWeight: '700', fontSize: '13px' }}>
                  May 2026 — Present
                </span>
              </div>
              <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.65', color: '#4A4F57' }}>
                Owned and built a business-critical module end to end with 18 features and 22 endpoints, designing PostgreSQL tables, REST APIs, and an Angular/TypeScript UI.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '12px', borderRadius: '999px', padding: '4px 12px', background: '#EEF1F5' }}>
                  PostgreSQL
                </span>
                <span style={{ fontWeight: '700', fontSize: '12px', borderRadius: '999px', padding: '4px 12px', background: '#EEF1F5' }}>
                  REST
                </span>
                <span style={{ fontWeight: '700', fontSize: '12px', borderRadius: '999px', padding: '4px 12px', background: '#EEF1F5' }}>
                  Angular
                </span>
              </div>
            </div>
          </article>
          <article className="dots rv-item" style={{ background: '#FFFFFF', border: '4px solid #D5DAE1', borderRadius: '28px', boxShadow: 'inset 0 0 0 4px #FFFFFF', display: 'flex', flexDirection: 'column' }}>
            <div style={{ borderRadius: '24px 24px 0 0', height: '92px', backgroundColor: '#FFFFFF', backgroundImage: "url('/assets/The-Ohio-State-University-Logo.png')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '14px 20px' }}>
            </div>
            <div style={{ padding: '22px', background: 'linear-gradient(180deg, #F1ECFF, #CDBDFF)', borderRadius: '0 0 24px 24px', display: 'flex', flexGrow: '1', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ margin: '0', fontWeight: '800', fontSize: '26px' }}>
                Design Innovation &amp; Simulation Lab
              </h3>
              <p style={{ margin: '0', fontWeight: '700', fontSize: '15px' }}>
                Undergraduate AI/ML Researcher
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '6px', color: '#2E1F70' }}>
                <span style={{ fontWeight: '800', fontSize: '13px' }}>
                  Research
                </span>
                <span style={{ fontWeight: '700', fontSize: '13px', lineHeight: '1.35', textAlign: 'right' }}>
                  Mar 2025 — May 2026
                </span>
              </div>
              <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.65', color: '#4A4F57' }}>
                Integrated a VLA policy through OpenCV for autonomous robot manipulation, trained a CNN-based behavior-cloning model from wrist-camera input for a 6-DOF UR5e arm, and reproduced Stanford's UMI environment.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '12px', borderRadius: '999px', padding: '4px 12px', background: '#EEF1F5' }}>
                  VLA policies
                </span>
                <span style={{ fontWeight: '700', fontSize: '12px', borderRadius: '999px', padding: '4px 12px', background: '#EEF1F5' }}>
                  Behavior cloning
                </span>
              </div>
            </div>
          </article>
          <article className="dots rv-item" style={{ background: '#FFFFFF', border: '4px solid #D5DAE1', borderRadius: '28px', boxShadow: 'inset 0 0 0 4px #FFFFFF', display: 'flex', flexDirection: 'column' }}>
            <div style={{ borderRadius: '24px 24px 0 0', height: '92px', backgroundColor: '#A96F5A', backgroundImage: "url('/assets/bdaa.png')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '14px 20px' }}>
            </div>
            <div style={{ padding: '22px', background: 'linear-gradient(180deg, #E6FAEE, #A9EBC2)', borderRadius: '0 0 24px 24px', display: 'flex', flexGrow: '1', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ margin: '0', fontWeight: '800', fontSize: '26px' }}>
                Big Data &amp; Analytics Association
              </h3>
              <p style={{ margin: '0', fontWeight: '700', fontSize: '15px' }}>
                Foundations of AI Track Lead
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '6px', color: '#12452A' }}>
                <span style={{ fontWeight: '800', fontSize: '13px' }}>
                  Leadership
                </span>
                <span style={{ fontWeight: '700', fontSize: '13px' }}>
                  Nov 2025 — Present
                </span>
              </div>
              <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.65', color: '#4A4F57' }}>
                Led the Foundations of AI track for a 300+ member organization, overseeing teams building AI-powered products and mentoring students on scoping, AI integration, and presentation.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '12px', borderRadius: '999px', padding: '4px 12px', background: '#EEF1F5' }}>
                  Teaching
                </span>
                <span style={{ fontWeight: '700', fontSize: '12px', borderRadius: '999px', padding: '4px 12px', background: '#EEF1F5' }}>
                  Workshops
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
