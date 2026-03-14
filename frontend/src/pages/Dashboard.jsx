import Layout from "../components/Layout";

const cards = [
  { label:"Total Employees", value:"24", note:"Registered staff", delay:"0s" },
  { label:"Active Today", value:"18", note:"Checked in", delay:"0.05s" },
  { label:"Departments", value:"5", note:"Active teams", delay:"0.1s" },
];

function Dashboard() {
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Layout>
      <div style={{ marginBottom:"2rem" }}>
        <h2 style={{ fontFamily:"var(--font-serif)", fontSize:34, fontWeight:400, letterSpacing:"-0.5px", lineHeight:1.1 }}>
          Good morning, <em style={{ fontStyle:"italic", color:"var(--accent)" }}>{user.name?.split(" ")[0] || "there"}</em>
        </h2>
        <p style={{ fontSize:14, color:"var(--muted)", marginTop:6 }}>Here's what's happening with your team today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        {cards.map(card=>(
          <div key={card.label} className="fade-up" style={{
            background:"var(--surface)", border:"1px solid var(--border-strong)",
            borderRadius:14, padding:"1.25rem", animationDelay: card.delay
          }}>
            <div style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--muted)", letterSpacing:"0.06em", marginBottom:8 }}>{card.label.toUpperCase()}</div>
            <div style={{ fontFamily:"var(--font-serif)", fontSize:38, lineHeight:1, color:"var(--text)" }}>{card.value}</div>
            <div style={{ fontSize:12, color:"var(--green)", marginTop:6 }}>{card.note}</div>
          </div>
        ))}
        <div className="fade-up" style={{
          background:"var(--surface)", border:"1px solid var(--border-strong)",
          borderRadius:14, padding:"1.25rem", animationDelay:"0.15s"
        }}>
          <div style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--muted)", letterSpacing:"0.06em", marginBottom:8 }}>YOUR ROLE</div>
          <div style={{ fontFamily:"var(--font-serif)", fontSize:24, lineHeight:1, color:"var(--text)", paddingTop:4 }}>{role}</div>
          <div style={{ fontSize:12, color:"var(--green)", marginTop:6 }}>Current session</div>
        </div>
      </div>

      {/* Quick info */}
      <div className="fade-up" style={{
        background:"var(--surface)", border:"1px solid var(--border-strong)",
        borderRadius:16, padding:"1.5rem", animationDelay:"0.2s"
      }}>
        <div style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--muted)", letterSpacing:"0.06em", marginBottom:"1rem" }}>QUICK INFO</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:"1rem" }}>
          {[
            ["System Status", "● Operational", "var(--green)"],
            ["Auth Method", "JWT Bearer Token", "var(--muted)"],
            ["Backend", "localhost:5000", "var(--muted)"],
            ["Session", "Active", "var(--green)"],
          ].map(([key,val,color])=>(
            <div key={key} style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <span style={{ fontSize:12, fontFamily:"var(--font-mono)", color:"var(--muted)" }}>{key}</span>
              <span style={{ fontSize:14, color }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
