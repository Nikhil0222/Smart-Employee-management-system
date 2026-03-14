import { useNavigate, useLocation } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.name ? user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "??";

  const logout = () => { localStorage.clear(); navigate("/"); };

  const navItems = [
    { label:"Dashboard", path:"/dashboard", icon:"◈", roles:["ADMIN","MANAGER","EMPLOYEE"] },
    { label:"Employees", path:"/employees", icon:"◎", roles:["ADMIN","MANAGER"] },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>

      {/* Sidebar */}
      <aside style={{
        width:240, background:"var(--text)", color:"var(--bg)",
        display:"flex", flexDirection:"column", padding:"1.5rem 1rem",
        position:"fixed", top:0, left:0, bottom:0, zIndex:100
      }}>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:13, letterSpacing:"0.1em", color:"rgba(245,242,236,0.4)", padding:"0.5rem 0.75rem", marginBottom:"1.5rem" }}>
          SEMS / <span style={{ color:"var(--accent)" }}>System</span>
        </div>

        {/* User chip */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0.75rem", borderRadius:10, background:"rgba(255,255,255,0.06)", marginBottom:"1.5rem" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600, color:"white", flexShrink:0 }}>
            {initials}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:500, color:"var(--bg)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name || "User"}</div>
            <div style={{ fontSize:11, color:"rgba(245,242,236,0.4)", fontFamily:"var(--font-mono)" }}>{role}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1 }}>
          <div style={{ fontSize:10, fontFamily:"var(--font-mono)", letterSpacing:"0.1em", color:"rgba(245,242,236,0.25)", padding:"0 0.75rem", marginBottom:6 }}>MAIN</div>
          {navItems.filter(item=>item.roles.includes(role)).map(item=>(
            <button key={item.path} onClick={()=>navigate(item.path)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%",
              padding:"9px 12px", borderRadius:8, fontSize:14, border:"none", cursor:"pointer",
              background: location.pathname===item.path ? "rgba(255,255,255,0.1)" : "transparent",
              color: location.pathname===item.path ? "var(--bg)" : "rgba(245,242,236,0.55)",
              fontWeight: location.pathname===item.path ? 500 : 400,
              fontFamily:"var(--font-sans)", marginBottom:2, transition:"all 0.15s", textAlign:"left"
            }}
            onMouseEnter={e=>{ if(location.pathname!==item.path){ e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="var(--bg)"; }}}
            onMouseLeave={e=>{ if(location.pathname!==item.path){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(245,242,236,0.55)"; }}}
            >
              <span style={{ fontSize:15, width:20, textAlign:"center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ paddingTop:"1rem", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={logout} style={{
            width:"100%", padding:"9px 12px", background:"transparent",
            border:"1px solid rgba(255,255,255,0.1)", borderRadius:8,
            color:"rgba(245,242,236,0.5)", fontFamily:"var(--font-sans)", fontSize:13,
            cursor:"pointer", textAlign:"left", transition:"all 0.15s"
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(200,82,42,0.15)"; e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.borderColor="rgba(200,82,42,0.3)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(245,242,236,0.5)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}
          >
            ↩ Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft:240, flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
        <header style={{
          background:"var(--surface)", borderBottom:"1px solid var(--border-strong)",
          padding:"1rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center"
        }}>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:22, fontWeight:400, letterSpacing:"-0.3px" }}>
            {navItems.find(i=>i.path===location.pathname)?.label || "Dashboard"}
          </h1>
          <span style={{
            fontSize:11, padding:"4px 12px", borderRadius:20, fontFamily:"var(--font-mono)",
            background: role==="ADMIN" ? "var(--accent-light)" : "rgba(0,0,0,0.05)",
            color: role==="ADMIN" ? "var(--accent)" : "var(--muted)",
            border: `1px solid ${role==="ADMIN" ? "rgba(200,82,42,0.2)" : "var(--border-strong)"}`
          }}>
            {role}
          </span>
        </header>
        <main style={{ flex:1, padding:"2rem 2.5rem" }} className="fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
