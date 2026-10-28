import type { CSSProperties } from 'react';
import { PROJECTS } from '../data/content';
import type { OpenFocus } from '../hooks/useFocus';
import { ProjectIpod } from './ipod';

export default function Projects({ openFocus }: { openFocus: OpenFocus }) {
  return (
    <section id="work" className="shift" style={{ position: 'relative', padding: '110px clamp(16px, 4vw, 48px) 130px', background: '#E9F8FE', borderTop: '4px solid #D5DAE1', borderBottom: '4px solid #D5DAE1', overflow: 'hidden' }}>
      <canvas className="staffs" id="stf-work" aria-hidden="true" />
      <div className="reveal" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '44px' }}>
        <div className="rv-item" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: '800', fontSize: '13px', color: '#5C1236', background: '#FFB8DA', borderRadius: '999px', padding: '5px 14px' }}>Projects</span>
          <h2 style={{ margin: '0', fontWeight: '800', fontSize: 'clamp(34px, 4.5vw, 52px)' }}>Featured projects</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px 32px', alignItems: 'stretch' }}>
          {PROJECTS.map((p, i) => (
            <article key={p.name} className="dots rv-item" style={{ '--dot': p.dot, position: 'relative', borderRadius: '40px', perspective: '1100px' } as CSSProperties}>
              <ProjectIpod p={p} onOpen={(e) => openFocus('proj', i, e)} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
