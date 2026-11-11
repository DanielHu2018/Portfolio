import type { CSSProperties } from 'react';
import type { ExperienceItem } from '../site/experience';

type Props = {
  e: ExperienceItem;
  className?: string;
  style?: CSSProperties;
  onClick?: (ev: any) => void;
  onPointerMove?: (ev: any) => void;
  onPointerLeave?: (ev: any) => void;
};

/** One "Where I've worked" card face. Used on the page (where it tilts and opens the focus overlay) and in the overlay. */
export function ExperienceCard({ e, className, style, onClick, onPointerMove, onPointerLeave }: Props) {
  return (
    <div className={className} onClick={onClick} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} style={{ boxSizing: 'border-box', background: '#FFFFFF', border: '4px solid #D5DAE1', borderRadius: '28px', boxShadow: 'inset 0 0 0 4px #FFFFFF', display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ borderRadius: '24px 24px 0 0', height: '92px', backgroundColor: e.headerBg, backgroundImage: `url('${e.logo}')`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: e.logoSize, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '14px 20px' }}>
      </div>
      <div style={{ padding: '22px', background: e.body, borderRadius: '0 0 24px 24px', display: 'flex', flexGrow: '1', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ margin: '0', fontWeight: '800', fontSize: '26px' }}>
          {e.company}
        </h3>
        <p style={{ margin: '0', fontWeight: '700', fontSize: '15px' }}>
          {e.role}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '6px', color: e.meta }}>
          <span style={{ fontWeight: '800', fontSize: '13px' }}>
            {e.tag}
          </span>
          <span style={e.wrapDates ? { fontWeight: '700', fontSize: '13px', lineHeight: '1.35', textAlign: 'right' } : { fontWeight: '700', fontSize: '13px' }}>
            {e.dates}
          </span>
        </div>
        <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.65', color: '#4A4F57' }}>
          {e.blurb}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {e.chips.map((c) => (
            <span key={c} style={{ fontWeight: '700', fontSize: '12px', borderRadius: '999px', padding: '4px 12px', background: '#EEF1F5' }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
