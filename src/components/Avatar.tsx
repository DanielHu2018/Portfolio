export function Avatar() {
  return (
    <>
    <div className="mii-wrap" aria-hidden="true" style={{ position: 'fixed', left: '0', top: '0', zIndex: '60', pointerEvents: 'none', width: '240px', height: '240px', opacity: '0', willChange: 'transform' }}>
      <canvas id="mii" style={{ display: 'block', width: '240px', height: '240px' }} />
      <img className="mii-sprite" alt="" src="/assets/avatar/avatar_idle.png" draggable="false" style={{ position: 'absolute', left: '0', top: '0', width: '512px', height: '512px', maxWidth: 'none', transformOrigin: '0 0', transform: 'scale(0)', userSelect: 'none' }} />
    </div>
    {/* The tour guide's speech bubble (engine/tour.ts types into it, engine/mii.ts keeps it over the head).
        The live region repeats each line in full for screen readers. */}
    <div className="mii-bubble" aria-hidden="true">
      <span className="mii-name">Daniel</span>
      <span className="mii-say" />
    </div>
    <div className="mii-live" role="status" aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }} />
    </>
  );
}
