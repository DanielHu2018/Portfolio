// Wii-style boot screen: press anywhere to start, a loading bar, then it fades into the site.
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';

export type BootState = 'on' | 'loading' | 'leaving' | 'done';

export default function BootScreen({ state, onStart }: { state: BootState; onStart: () => void }) {
  const d = new Date();
  const time = (d.getHours() % 12 || 12) + ':' + String(d.getMinutes()).padStart(2, '0');
  const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] + ' ' + (d.getMonth() + 1) + '/' + d.getDate();
  const style: CSSProperties = { position: 'fixed', inset: '0', zIndex: '9990', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', cursor: state === 'on' ? 'pointer' : 'default', outline: 'none', opacity: state === 'leaving' ? 0 : 1, transform: 'scale(' + (state === 'leaving' ? 1.06 : 1) + ')', transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' };
  const start = (e: MouseEvent) => { e.stopPropagation(); onStart(); };
  const key = (e: KeyboardEvent) => { if (e.key === 'Tab') return; e.preventDefault(); onStart(); };
  return (
    <div className="boot" role="dialog" aria-modal="true" aria-label="Welcome" tabIndex={-1} onClick={start} onKeyDown={key} style={style}>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "radial-gradient(ellipse at 50% 38%, #FFFFFF 0%, #FFFFFF 35%, #EEF1F5 100%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "repeating-linear-gradient(0deg, rgba(225, 230, 237, 0.55) 0px, rgba(225, 230, 237, 0.55) 2px, transparent 2px, transparent 6px)" }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "26px", textAlign: "center", padding: "24px 24px 170px", width: "100%", boxSizing: "border-box" }}>
        <div className="boot-tile" style={{ width: "min(560px, 88vw)", borderRadius: "28px", padding: "10px", background: "linear-gradient(180deg, #FFFFFF 0%, #E6EAF0 100%)", border: "3px solid #D5DAE1", boxShadow: "inset 0 2px 0 #FFFFFF", boxSizing: "border-box" }}>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: "20px", border: "2px solid #C9D0D9", background: "linear-gradient(180deg, #FFFFFF 0%, #F2FAFE 60%, #DDF3FC 100%)", padding: "34px 20px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div aria-hidden="true" style={{ position: "absolute", left: "-10%", right: "-10%", top: "-60%", height: "100%", borderRadius: "50%", background: "linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0))", pointerEvents: "none" }} />
            <canvas id="boot-mii" className="boot-logo" aria-hidden="true" width="300" height="300" style={{ position: "relative", display: "block", width: "150px", height: "150px", margin: "-10px 0 -6px" }} />
            <h1 className="boot-name" style={{ position: "relative", margin: "0", font: "800 clamp(36px, 6vw, 60px) 'M PLUS Rounded 1c', sans-serif", color: "#3C4046", letterSpacing: "-0.01em" }}>Daniel Hu</h1>
            <p className="boot-sub" style={{ position: "relative", margin: "0", font: "700 15px 'M PLUS Rounded 1c', sans-serif", color: "#5A5F67" }}>Software and AI Engineer</p>
          </div>
        </div>
        <div style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {state === 'on' && (
              <button type="button" className="boot-btn" onClick={start} style={{ display: "inline-flex", alignItems: "center", gap: "12px", minHeight: "52px", font: "800 17px 'M PLUS Rounded 1c', sans-serif", color: "#3C4046", background: "linear-gradient(180deg, #FFFFFF 0%, #E9EDF2 100%)", border: "3px solid #C9D0D9", borderRadius: "999px", padding: "8px 28px 8px 10px", boxShadow: "inset 0 2px 0 #FFFFFF", cursor: "pointer" }}>
                <span aria-hidden="true" style={{ width: "34px", height: "34px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", font: "800 16px 'M PLUS Rounded 1c', sans-serif", color: "#FFFFFF", background: "radial-gradient(circle at 35% 30%, #A6E6FB 0%, #34BEED 60%, #1A8CC6 100%)", border: "2px solid #FFFFFF", boxShadow: "0 0 0 2px #A9DDF2" }}>&#9654;</span>
                Press anywhere to start
              </button>
          )}
          {(state === 'loading' || state === 'leaving') && (
            <>
              <div role="progressbar" aria-label="Loading" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "min(340px, 72vw)", height: "22px", borderRadius: "999px", padding: "3px", background: "linear-gradient(180deg, #E3E7EC 0%, #FFFFFF 100%)", border: "3px solid #C9D0D9", boxSizing: "border-box", boxShadow: "inset 0 2px 3px rgba(60, 64, 70, 0.12)" }}>
                  <div className="boot-fill" style={{ height: "100%", borderRadius: "999px", background: "linear-gradient(180deg, #A6E6FB 0%, #34BEED 55%, #1A9CCB 100%)", position: "relative", overflow: "hidden" }}>
                    <div className="boot-shine" aria-hidden="true" style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.35) 0 8px, rgba(255, 255, 255, 0) 8px 16px)" }} />
                    <div aria-hidden="true" style={{ position: "absolute", left: "4px", right: "4px", top: "2px", height: "35%", borderRadius: "999px", background: "rgba(255, 255, 255, 0.6)" }} />
                  </div>
                </div>
                <span style={{ font: "700 14px 'M PLUS Rounded 1c', sans-serif", color: "#5A5F67" }}>
                  Loading
                  <span className="boot-dots" />
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="boot-bar" aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "150px", pointerEvents: "none" }}>
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style={{ position: "absolute", inset: "0", width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="bootBarG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F4F6F9" />
              <stop offset="1" stopColor="#DCE1E8" />
            </linearGradient>
          </defs>
          <path d="M0 12 L330 12 C380 12 380 44 430 44 L570 44 C620 44 620 12 670 12 L1000 12 L1000 150 L0 150 Z" fill="url(#bootBarG)" />
          <path d="M0 12 L330 12 C380 12 380 44 430 44 L570 44 C620 44 620 12 670 12 L1000 12" fill="none" stroke="#34BEED" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
        <div style={{ position: "absolute", left: "50%", bottom: "14px", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ font: "800 34px 'M PLUS Rounded 1c', sans-serif", color: "#8D949E", letterSpacing: "0.02em", lineHeight: "1" }}>{time}</span>
          <span style={{ font: "700 14px 'M PLUS Rounded 1c', sans-serif", color: "#A3AAB3" }}>{date}</span>
        </div>
        <div style={{ position: "absolute", left: "clamp(16px, 4vw, 48px)", bottom: "22px", width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(180deg, #FFFFFF 0%, #E6EAF0 100%)", border: "3px solid #C9D0D9", display: "flex", alignItems: "center", justifyContent: "center", font: "800 18px 'M PLUS Rounded 1c', sans-serif", color: "#34BEED" }}>DH</div>
        <div style={{ position: "absolute", right: "clamp(16px, 4vw, 48px)", bottom: "22px", width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(180deg, #FFFFFF 0%, #E6EAF0 100%)", border: "3px solid #C9D0D9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="20" viewBox="0 0 28 20">
            <rect x="1.5" y="1.5" width="25" height="17" rx="3" fill="#FFFFFF" stroke="#34BEED" strokeWidth="2.5" />
            <path d="M3 4 L14 12 L25 4" fill="none" stroke="#34BEED" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
