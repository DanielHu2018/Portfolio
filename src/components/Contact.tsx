import type { CSSProperties } from 'react';
import Guestbook from './Guestbook';

export default function Contact() {
  return (
    <footer id="contact" className="shift" style={{ position: "relative", padding: "120px clamp(16px, 4vw, 48px) 90px", background: "linear-gradient(180deg, #BDEBFB 0%, #8FDBF5 100%)", overflow: "hidden" }}>
      <canvas className="staffs" id="stf-contact" aria-hidden="true" />
      <div className="reveal" style={{ position: "relative", maxWidth: "860px", margin: "0 auto" }}>
        <div className="dots rv-item" style={{ "--dot": "#4FA6D3", borderRadius: "44px", padding: "8px", background: "linear-gradient(135deg, #FFFFFF 0%, #C9CED6 22%, #F4F6F9 40%, #9AA2AD 60%, #EEF1F5 78%, #B9BFC8 100%)" } as CSSProperties}>
          <div style={{ isolation: "isolate", background: "#FFFFFF", borderRadius: "36px", padding: "48px clamp(20px, 4vw, 56px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "22px" }}>
            <span style={{ fontWeight: "800", fontSize: "13px", color: "#4A2306", background: "#FFC59A", borderRadius: "999px", padding: "5px 14px" }}>Contact</span>
            <h2 style={{ margin: "0", fontWeight: "800", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: "1.05" }}>Let's build something together.</h2>
            <p style={{ margin: "0", fontSize: "17px", color: "#4A4F57" }}>Open to new grad software and AI engineering roles.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
              <a className="pill" href="#resume" style={{ minHeight: "52px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", fontWeight: "800", fontSize: "15px", textDecoration: "none", color: "#3C4046", background: "#FFFFFF", border: "3px solid #C9CED6", borderRadius: "999px", padding: "10px 22px" }}>Resume</a>
              <a className="pill" href="https://www.linkedin.com/in/danielhu2005" style={{ minHeight: "52px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", fontWeight: "800", fontSize: "15px", textDecoration: "none", color: "#3C4046", background: "#FFFFFF", border: "3px solid #C9CED6", borderRadius: "999px", padding: "10px 22px" }}>LinkedIn</a>
              <a className="pill" href="https://github.com/DanielHu2018" style={{ minHeight: "52px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", fontWeight: "800", fontSize: "15px", textDecoration: "none", color: "#3C4046", background: "#FFFFFF", border: "3px solid #C9CED6", borderRadius: "999px", padding: "10px 22px" }}>GitHub</a>
            </div>
            <p style={{ margin: "0", fontWeight: "700", fontSize: "18px", color: "#1677A8" }}>hu.daniel.w@gmail.com</p>
          </div>
        </div>
        <Guestbook />
        <p style={{ position: "relative", margin: "28px 0 0", textAlign: "center", fontSize: "13px", color: "#24506A" }}>Designed &amp; built by Daniel Hu · © 2026</p>
      </div>
    </footer>
  );
}
