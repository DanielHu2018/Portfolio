import type { CSSProperties } from 'react';
import type { SiteVals } from '../site/renderVals';
import { experience } from '../site/experience';
import { ExperienceCard } from './ExperienceCard';

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
          {experience.map((e, i) => (
            // The dotted shadow stays put on the article while the card face tilts, like the project iPods.
            <article key={e.company} className="dots exp-dots rv-item" style={{ '--dot': e.dot, borderRadius: '28px', perspective: '1100px', display: 'flex' } as CSSProperties}>
              <ExperienceCard e={e} className="proj" onClick={v.openExp[i]} onPointerMove={v.projMove} onPointerLeave={v.projLeave} style={{ position: 'relative', flex: '1', minWidth: '0' }} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
