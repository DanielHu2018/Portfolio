export function WiiCursor() {
  return (
    <div className="wii-cursor" aria-hidden="true" style={{ position: 'fixed', left: '0', top: '0', zIndex: '9999', pointerEvents: 'none', opacity: '0', willChange: 'transform', transformOrigin: '0 0' }}>
      <div className="wii-cursor-in" style={{ transformOrigin: '20px 5px', transition: 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        <svg viewBox="0 0 40 48" width="50" height="60" style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(2px 5px 3px rgba(26, 40, 70, 0.28))' }}>
          <g fill="#AEB6C2" stroke="#AEB6C2" strokeWidth="5" strokeLinejoin="round">
            <rect x="11" y="3" width="10" height="26" rx="5" />
            <rect x="7" y="19" width="27" height="24" rx="10" />
            <rect x="20" y="17" width="8" height="12" rx="4" />
            <rect x="26.5" y="20" width="7.5" height="11" rx="3.75" />
            <rect x="2" y="25" width="13" height="9" rx="4.5" transform="rotate(-20 8 29)" />
          </g>
          <g fill="#FFFFFF">
            <rect x="11" y="3" width="10" height="26" rx="5" />
            <rect x="7" y="19" width="27" height="24" rx="10" />
            <rect x="20" y="17" width="8" height="12" rx="4" />
            <rect x="26.5" y="20" width="7.5" height="11" rx="3.75" />
            <rect x="2" y="25" width="13" height="9" rx="4.5" transform="rotate(-20 8 29)" />
          </g>
          <rect x="13.5" y="5.5" width="5" height="5" rx="2.5" fill="#E6EBF2" />
          <path d="M26.6 22.5v5M20.4 20v5" stroke="#CDD3DC" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M10 38c4 3 14 3 20 0" stroke="#E6EBF2" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
}
