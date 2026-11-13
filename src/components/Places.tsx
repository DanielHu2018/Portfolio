import type { SiteVals } from '../site/renderVals';

// The globe in Off the clock (engine/globe.ts draws #globe) with a small key. Places aren't listed here (there
// are a lot); clicking a dot names it, and the canvas label lists them all for screen readers.
export function Places({ v }: { v: SiteVals }) {
  const dot = (color: string) => (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
      <circle cx="10" cy="10" r="6.5" fill={color} stroke="#FFFFFF" strokeWidth="2.5" />
    </svg>
  );
  const star = (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 2.5l2.8 6.1 6.6.7-5 4.5 1.4 6.5L12 17l-5.8 3.3 1.4-6.5-5-4.5 6.6-.7z" fill={v.placeColors.home} stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
  const key = [
    { icon: star, label: 'Home' },
    { icon: dot(v.placeColors.visited), label: 'Been there' },
    { icon: dot(v.placeColors.want), label: 'Want to go' }
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3 style={{ margin: '0', fontWeight: '800', fontSize: '28px' }}>
        Places
      </h3>
      <div className="rv-item places" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px 40px' }}>
        <canvas id="globe" role="img" aria-label={v.globeLabel} style={{ display: 'block', flex: '1 1 300px', width: '100%', maxWidth: '460px', aspectRatio: '1 / 1', touchAction: 'pan-y', cursor: 'grab' }} />
        <div style={{ position: 'relative', zIndex: '1', display: 'flex', flexDirection: 'column', gap: '12px', textShadow: '0 0 3px #FFF6D6, 0 0 6px #FFF6D6, 0 0 10px #FFF6D6' }}>
          {key.map((k) => (
            <span key={k.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '16px', color: '#3C4046' }}>
              <span style={{ display: 'inline-flex', width: '24px', justifyContent: 'center' }}>
                {k.icon}
              </span>
              {k.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
