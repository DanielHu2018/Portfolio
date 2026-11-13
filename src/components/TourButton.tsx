import type { SiteVals } from '../site/renderVals';

// Phones only (the navigator iPod is hidden under 700px): starts and pauses the tour. While the tour plays,
// back and skip buttons sit above it and step between checkpoints like the navigator's arrows.
export function TourButton({ v }: { v: SiteVals }) {
  const round = { width: '44px', height: '44px', borderRadius: '50%', border: '3px solid #D5DAE1', background: 'linear-gradient(180deg, #FFFFFF, #EDF0F4)', boxShadow: 'inset 0 2px 0 #FFFFFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0' } as const;
  return (
    <div className="tour-fab" style={{ position: 'fixed', right: '12px', bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', zIndex: '48', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
      {v.tourOn ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" aria-label={v.prevLabel} onClick={v.prev} style={round}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
              <path d="M6 6v12M18 6l-9 6 9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" aria-label={v.nextLabel} onClick={v.next} style={round}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
              <path d="M18 6v12M6 6l9 6-9 6z" fill="#7E848D" stroke="#7E848D" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : null}
      <button type="button" aria-label={v.tourLabel} aria-pressed={v.tourOn} onClick={v.tourToggle} style={{ minHeight: '48px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 18px 0 14px', borderRadius: '999px', border: '3px solid ' + (v.tourOn ? '#D5DAE1' : '#1A9CCB'), background: v.tourOn ? 'linear-gradient(180deg, #FFFFFF, #EDF0F4)' : 'linear-gradient(180deg, #6ED3F5, #34BEED)', boxShadow: 'inset 0 2px 0 rgba(255, 255, 255, 0.7)', color: v.tourOn ? '#3C4046' : '#FFFFFF', font: "800 15px 'M PLUS Rounded 1c', system-ui, sans-serif", cursor: 'pointer' }}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
          {v.tourOn ? <path d="M8 5v14M16 5v14" stroke="#3C4046" strokeWidth="3.5" strokeLinecap="round" /> : <path d="M7 4.5l13 7.5-13 7.5z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />}
        </svg>
        {v.tourOn ? 'Pause' : 'Tour'}
      </button>
    </div>
  );
}
