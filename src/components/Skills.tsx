export default function Skills() {
  return (
    <section id="skills" className="shift" style={{ position: "relative", padding: "100px clamp(16px, 4vw, 48px)", overflow: "hidden" }}>
      <canvas className="staffs" id="stf-skills" aria-hidden="true" />
      <div className="reveal" style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
        <div className="rv-item" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ fontWeight: "800", fontSize: "13px", color: "#12452A", background: "#A9EBC2", borderRadius: "999px", padding: "5px 14px" }}>Skills</span>
          <h2 style={{ margin: "0", fontWeight: "800", fontSize: "clamp(34px, 4.5vw, 52px)" }}>Toolkit</h2>
        </div>
        <div className="rv-item" style={{ maxWidth: "760px", border: "8px solid #23262B", borderRadius: "16px", background: "#23262B" }}>
          <div style={{ borderRadius: "8px 8px 0 0", background: "linear-gradient(180deg, #FAFBFC, #E7EAEE)", borderBottom: "1px solid #B9BFC8", padding: "5px 12px", textAlign: "center", font: "700 13px 'Helvetica Neue', Arial, sans-serif", color: "#23262B" }}>Skills</div>
          <div style={{ borderRadius: "0 0 8px 8px", overflow: "hidden", background: "#FFFFFF", display: "flex", flexDirection: "column", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", justifyContent: "space-between", alignItems: "baseline", padding: "12px 16px", borderBottom: "1px solid #E3E6EB", color: "#FFFFFF", background: "linear-gradient(180deg, #6EC3F5 0%, #2A8BD8 100%)" }}>
              <span style={{ fontWeight: "700", fontSize: "15px" }}>AI / ML</span>
              <span style={{ fontSize: "14px" }}>LLM agents · RAG · Claude · VLA policies · Behavior cloning · W&amp;B</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", justifyContent: "space-between", alignItems: "baseline", padding: "12px 16px", borderBottom: "1px solid #E3E6EB", color: "#23262B" }}>
              <span style={{ fontWeight: "700", fontSize: "15px" }}>Cloud &amp; Data</span>
              <span style={{ fontSize: "14px", color: "#4A4F57" }}>AWS Bedrock · PostgreSQL · Elasticsearch</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", justifyContent: "space-between", alignItems: "baseline", padding: "12px 16px", borderBottom: "1px solid #E3E6EB", color: "#23262B" }}>
              <span style={{ fontWeight: "700", fontSize: "15px" }}>Web</span>
              <span style={{ fontSize: "14px", color: "#4A4F57" }}>Angular · REST APIs</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", justifyContent: "space-between", alignItems: "baseline", padding: "12px 16px", color: "#23262B" }}>
              <span style={{ fontWeight: "700", fontSize: "15px" }}>Languages</span>
              <span style={{ fontSize: "14px", color: "#4A4F57" }}>[FROM YOUR RESUME]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
