import type { MouseEventHandler } from 'react';
import { SlabLayers } from './ipod';

export default function About({ onOpenPhoto }: { onOpenPhoto: MouseEventHandler<HTMLDivElement> }) {
  return (
    <section id="about" className="shift" style={{ padding: "100px clamp(16px, 4vw, 48px)" }}>
      <div className="reveal" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "56px", alignItems: "center" }}>
        <div className="dots rv-item" style={{ background: "#FFFFFF", border: "4px solid #D5DAE1", borderRadius: "32px", boxShadow: "inset 0 0 0 4px #FFFFFF", padding: "36px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <span style={{ alignSelf: "flex-start", fontWeight: "800", fontSize: "13px", color: "#0B3550", background: "#BDEBFB", borderRadius: "999px", padding: "5px 14px" }}>About</span>
          <h2 style={{ margin: "0", fontWeight: "800", fontSize: "clamp(30px, 3.6vw, 44px)", lineHeight: "1.12" }}>I build agentic AI apps on top of foundation models.</h2>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.75", color: "#4A4F57" }}>I'm an Honors Computer Science and Engineering student at Ohio State with a Statistics minor, graduating in December 2026. I've shipped enterprise software at Nationwide, spent two years teaching robot arms in a research lab, and I lead the AI track for a 100+ member student org.</p>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.75", color: "#4A4F57" }}>Now looking for new grad software and AI engineering roles.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "13px", borderRadius: "999px", padding: "6px 14px", background: "#FFE58A", color: "#4A3700" }}>3.8 GPA</span>
            <span style={{ fontWeight: "700", fontSize: "13px", borderRadius: "999px", padding: "6px 14px", background: "#FFB8DA", color: "#5C1236" }}>National Merit Scholar</span>
            <span style={{ fontWeight: "700", fontSize: "13px", borderRadius: "999px", padding: "6px 14px", background: "#A9EBC2", color: "#12452A" }}>Engineering Honors</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
          <div className="rv-item" onClick={onOpenPhoto} style={{ cursor: "zoom-in", position: "relative", width: "320px", transformStyle: "preserve-3d", transform: "perspective(900px) rotateY(-14deg) rotate(3deg)" }}>
            <div aria-hidden="true" style={{ position: "absolute", inset: "0", transform: "translate3d(18px, 18px, -24px)", backgroundImage: "radial-gradient(#9AD9F0 1.6px, transparent 1.9px)", backgroundSize: "7px 7px", borderRadius: "10px" }} />
            <div className="flap">
              <div className="slab3d" style={{ position: "relative", background: "#FFFFFF", border: "3px solid #D5DAE1", borderRadius: "10px", padding: "16px 16px 0" }}>
                <SlabLayers thin />
                <div role="img" aria-label="Photo of Daniel (placeholder)" style={{ aspectRatio: "1 / 1", background: "linear-gradient(180deg, #E9F8FE, #BDEBFB)", border: "2px solid #D5DAE1", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", color: "#1677A8" }}>[PHOTO OF YOU]</div>
                <p style={{ margin: "14px 0 18px", fontFamily: "'Permanent Marker', cursive", fontSize: "24px", textAlign: "center", color: "#3C4046" }}>hi, I'm Daniel</p>
              </div>
              <div aria-hidden="true" style={{ position: "absolute", top: "-16px", left: "50%", width: "120px", height: "32px", transform: "translateX(-50%) translateZ(2px) rotate(-5deg)", zIndex: "4", background: "#FFE58A", opacity: "0.95", border: "2px solid #E8C65A", borderRadius: "4px" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
