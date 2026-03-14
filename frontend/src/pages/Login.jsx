import { useState } from "react";
import { login } from "../auth/authApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }}>

      {/* Left panel */}
      <div style={{
        background: "var(--text)", color: "var(--bg)",
        padding: "3rem", display: "flex", flexDirection: "column",
        justifyContent: "space-between", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position:"absolute", inset:0,
          background:"radial-gradient(ellipse at 20% 80%, rgba(200,82,42,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,82,42,0.08) 0%, transparent 50%)",
          backgroundImage:`linear-gradient(rgba(245,242,236,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,242,236,0.03) 1px, transparent 1px)`,
          backgroundSize:"40px 40px"
        }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:13, letterSpacing:"0.12em", color:"rgba(245,242,236,0.4)", marginBottom:"4rem" }}>
            SEMS / v1.0
          </div>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(40px,5vw,62px)", fontWeight:400, lineHeight:1.1, letterSpacing:"-1px", marginBottom:"1.5rem" }}>
            Smart <em style={{ fontStyle:"italic", color:"var(--accent)" }}>Employee</em><br/>Management
          </h1>
          <p style={{ fontSize:15, color:"rgba(245,242,236,0.5)", lineHeight:1.7, maxWidth:340 }}>
            A modern system to manage your workforce — track employees, roles, and access with precision.
          </p>
        </div>
        <div style={{ display:"flex", gap:"2rem", position:"relative", zIndex:1 }}>
          {[["∞","Employees"],["3","Role tiers"],["JWT","Auth"]].map(([val,label])=>(
            <div key={label}>
              <div style={{ fontFamily:"var(--font-serif)", fontSize:30, color:"var(--bg)", lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:11, color:"rgba(245,242,236,0.35)", marginTop:4, fontFamily:"var(--font-mono)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem 2rem" }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:400 }}>
          <div style={{ marginBottom:"2.5rem" }}>
            <h2 style={{ fontFamily:"var(--font-serif)", fontSize:36, fontWeight:400, letterSpacing:"-0.5px", marginBottom:6 }}>Welcome back</h2>
            <p style={{ fontSize:14, color:"var(--muted)" }}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div style={{ padding:"10px 14px", borderRadius:8, fontSize:13, marginBottom:"1rem", background:"var(--accent-light)", color:"var(--accent)", border:"1px solid rgba(200,82,42,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:"1rem" }}>
              <label style={{ display:"block", fontSize:11, fontFamily:"var(--font-mono)", letterSpacing:"0.06em", color:"var(--muted)", marginBottom:6 }}>EMAIL ADDRESS</label>
              <input
                type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{ width:"100%", padding:"11px 14px", background:"var(--surface)", border:"1px solid var(--border-strong)", borderRadius:10, fontFamily:"var(--font-sans)", fontSize:14, color:"var(--text)", outline:"none" }}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor="var(--border-strong)"}
              />
            </div>
            <div style={{ marginBottom:"1.5rem" }}>
              <label style={{ display:"block", fontSize:11, fontFamily:"var(--font-mono)", letterSpacing:"0.06em", color:"var(--muted)", marginBottom:6 }}>PASSWORD</label>
              <input
                type="password" required value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width:"100%", padding:"11px 14px", background:"var(--surface)", border:"1px solid var(--border-strong)", borderRadius:10, fontFamily:"var(--font-sans)", fontSize:14, color:"var(--text)", outline:"none" }}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor="var(--border-strong)"}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"12px", background:"var(--text)", color:"var(--bg)",
              border:"none", borderRadius:10, fontFamily:"var(--font-sans)", fontSize:14,
              fontWeight:500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
              transition:"opacity 0.2s"
            }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile fallback */}
      <style>{`@media(max-width:768px){div[style*="gridTemplateColumns"]{grid-template-columns:1fr!important} div[style*="background: var(--text)"]{display:none!important}}`}</style>
    </div>
  );
}

export default Login;
