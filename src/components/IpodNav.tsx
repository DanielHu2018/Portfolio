import { Fragment } from 'react';
import type { SiteVals } from '../site/renderVals';
import { parseStyle } from '../site/style';

export function IpodNav({ v }: { v: SiteVals }) {
  return (
    <aside className="ipod" aria-label="Site navigator" title="Drag to move · double-click to dock" style={parseStyle(v.ipodStyle)} onPointerDown={v.dragStart} onDoubleClick={v.resetPos}>
      <div className="dots" style={{ cursor: 'grab', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', width: '230px', boxSizing: 'border-box', padding: '16px 16px 22px', borderRadius: '34px', background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F4F7 55%, #DFE3E9 100%)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 3px 0 #FFFFFF, inset 0 -6px 12px rgba(60, 64, 70, 0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
        <div style={{ width: '100%', boxSizing: 'border-box', border: '7px solid #23262B', borderRadius: '10px', background: '#23262B', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: '700 11px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
            <svg aria-hidden="true" viewBox="0 0 10 10" width="9" height="9">
              <path d="M2 1l7 4-7 4z" fill="#23262B" />
            </svg>
            <span>
              Daniel Hu
            </span>
            <span aria-hidden="true" style={{ width: '9px' }} />
          </div>
          <div style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
            {v.rows.map((r: any, i0: number) => (
              <Fragment key={i0}>
                <a href={r.href} onClick={r.go} aria-current={r.current} style={parseStyle(r.style)}>
                  {r.label}
                  <span aria-hidden="true">
                    ›
                  </span>
                </a>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 6px rgba(60, 64, 70, 0.08)' }}>
          <button type="button" aria-label="Menu: back to top" onClick={v.menu} style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', minWidth: '60px', minHeight: '44px', border: '0', background: 'transparent', font: '800 12px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', color: '#7E848D', cursor: 'pointer' }}>
            MENU
          </button>
          <button type="button" aria-label={v.prevLabel} onClick={v.prev} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
              <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" aria-label={v.nextLabel} onClick={v.next} style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
              <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" aria-label={v.tourLabel} aria-pressed={v.tourOn} title={v.tourLabel} onClick={v.tourToggle} style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '44px', height: '44px', border: '0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
              <path d="M4 6l8 6-8 6z" fill={v.tourOn ? '#C2C7CE' : v.accent} />
              <path d="M15 6v12M19 6v12" stroke={v.tourOn ? v.accent : '#7E848D'} strokeWidth="2.5" />
            </svg>
          </button>
          <button type="button" aria-label="Open highlighted section" onClick={v.center} style={{ position: 'absolute', left: '50%', top: '50%', width: '62px', height: '62px', margin: '-31px 0 0 -31px', borderRadius: '50%', background: 'linear-gradient(180deg, #F4F6F9, #DDE1E7)', border: '3px solid #D5DAE1', boxShadow: 'inset 0 2px 0 #FFFFFF', cursor: 'pointer' }} />
        </div>
      </div>
    </aside>
  );
}
