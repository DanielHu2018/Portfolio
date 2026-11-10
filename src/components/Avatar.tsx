export function Avatar() {
  return (
    <div className="mii-wrap" aria-hidden="true" style={{ position: 'fixed', left: '0', top: '0', zIndex: '60', pointerEvents: 'none', width: '240px', height: '240px', opacity: '0', willChange: 'transform' }}>
      <canvas id="mii" style={{ display: 'block', width: '240px', height: '240px' }} />
      <img className="mii-sprite" alt="" src="/assets/avatar/avatar_idle.png" draggable="false" style={{ position: 'absolute', left: '0', top: '0', width: '512px', height: '512px', maxWidth: 'none', transformOrigin: '0 0', transform: 'scale(0)', userSelect: 'none' }} />
    </div>
  );
}
