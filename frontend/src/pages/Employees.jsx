import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"EMPLOYEE" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [modalErr, setModalErr] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/employees");
      setEmployees(res.data.employees || res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filtered = employees.filter(e =>
    (e.name||"").toLowerCase().includes(search.toLowerCase()) ||
    (e.email||"").toLowerCase().includes(search.toLowerCase()) ||
    (e.role||"").toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true); setModalErr("");
    try {
      await api.post("/api/auth/register", form);
      await fetchEmployees();
      setShowModal(false);
      setForm({ name:"", email:"", password:"", role:"EMPLOYEE" });
      showToast(`✓ ${form.name} added successfully`);
    } catch (err) {
      setModalErr(err.response?.data?.message || "Failed to add employee");
    } finally { setSaving(false); }
  };

  const initials = (name) => name ? name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "??";

  return (
    <Layout>
      <div style={{ marginBottom:"2rem" }}>
        <h2 style={{ fontFamily:"var(--font-serif)", fontSize:34, fontWeight:400, letterSpacing:"-0.5px" }}>
          All <em style={{ fontStyle:"italic", color:"var(--accent)" }}>Employees</em>
        </h2>
        <p style={{ fontSize:14, color:"var(--muted)", marginTop:6 }}>{employees.length} registered staff members</p>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2rem" }}>
        {[
          ["TOTAL", employees.length],
          ["ADMINS", employees.filter(e=>e.role==="ADMIN").length],
          ["EMPLOYEES", employees.filter(e=>e.role==="EMPLOYEE").length],
        ].map(([label,val])=>(
          <div key={label} className="fade-up" style={{ background:"var(--surface)", border:"1px solid var(--border-strong)", borderRadius:12, padding:"1rem 1.25rem" }}>
            <div style={{ fontSize:10, fontFamily:"var(--font-mono)", color:"var(--muted)", letterSpacing:"0.08em", marginBottom:6 }}>{label}</div>
            <div style={{ fontFamily:"var(--font-serif)", fontSize:32, lineHeight:1 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="fade-up" style={{ background:"var(--surface)", border:"1px solid var(--border-strong)", borderRadius:16, overflow:"hidden", animationDelay:"0.1s" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.25rem 1.5rem", borderBottom:"1px solid var(--border)" }}>
          <span style={{ fontSize:15, fontWeight:500 }}>Employee Directory</span>
          <div style={{ display:"flex", gap:8 }}>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search..."
              style={{ padding:"7px 12px", background:"var(--bg)", border:"1px solid var(--border-strong)", borderRadius:8, fontFamily:"var(--font-sans)", fontSize:13, color:"var(--text)", outline:"none", width:180 }}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border-strong)"}
            />
            <button onClick={()=>setShowModal(true)} style={{ padding:"7px 14px", background:"var(--text)", color:"var(--bg)", border:"none", borderRadius:8, fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500, cursor:"pointer" }}>
              + Add Employee
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding:"4rem", textAlign:"center", color:"var(--muted)", fontSize:14 }}>Loading employees...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:"4rem", textAlign:"center", color:"var(--muted)" }}>
            <div style={{ fontSize:28, marginBottom:12, opacity:0.4 }}>◌</div>
            <p style={{ fontSize:14 }}>{search ? "No employees match your search" : "No employees yet"}</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  {["EMPLOYEE","ROLE","ID","ACTIONS"].map(h=>(
                    <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontFamily:"var(--font-mono)", letterSpacing:"0.06em", color:"var(--muted)", borderBottom:"1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp=>(
                  <tr key={emp.id} style={{ borderBottom:"1px solid var(--border)" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.02)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <td style={{ padding:"13px 16px", verticalAlign:"middle" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--bg)", border:"1px solid var(--border-strong)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"var(--muted)", flexShrink:0 }}>
                          {initials(emp.name)}
                        </div>
                        <div>
                          <div style={{ fontSize:14 }}>{emp.name}</div>
                          <div style={{ fontSize:12, color:"var(--muted)" }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{
                        display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:20,
                        fontSize:11, fontFamily:"var(--font-mono)", fontWeight:500,
                        background: emp.role==="ADMIN" ? "var(--accent-light)" : "rgba(0,0,0,0.05)",
                        color: emp.role==="ADMIN" ? "var(--accent)" : "var(--muted)",
                        border: `1px solid ${emp.role==="ADMIN" ? "rgba(200,82,42,0.2)" : "var(--border-strong)"}`
                      }}>
                        {emp.role}
                      </span>
                    </td>
                    <td style={{ padding:"13px 16px", fontFamily:"var(--font-mono)", fontSize:12, color:"var(--muted)" }}>
                      {String(emp.id||"").slice(0,8)}...
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        {["Edit","Remove"].map(action=>(
                          <button key={action} style={{ padding:"5px 10px", borderRadius:6, fontSize:12, fontFamily:"var(--font-sans)", cursor:"pointer", border:"1px solid var(--border-strong)", background:"transparent", color:"var(--muted)", transition:"all 0.15s" }}
                            onMouseEnter={e=>{ e.currentTarget.style.background=action==="Remove"?"rgba(200,82,42,0.08)":"var(--bg)"; e.currentTarget.style.color=action==="Remove"?"var(--accent)":"var(--text)"; }}
                            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--muted)"; }}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(26,24,20,0.5)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={e=>{ if(e.target===e.currentTarget) setShowModal(false); }}
        >
          <div className="fade-up" style={{ background:"var(--surface)", border:"1px solid var(--border-strong)", borderRadius:18, padding:"2rem", width:"100%", maxWidth:440 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h3 style={{ fontFamily:"var(--font-serif)", fontSize:24, fontWeight:400 }}>Add Employee</h3>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"var(--muted)", lineHeight:1, padding:4 }}>✕</button>
            </div>
            {modalErr && <div style={{ padding:"9px 12px", borderRadius:7, fontSize:13, marginBottom:"1rem", background:"var(--accent-light)", color:"var(--accent)" }}>{modalErr}</div>}
            <form onSubmit={handleAdd}>
              {[
                { label:"FULL NAME", key:"name", type:"text", placeholder:"Jane Smith" },
                { label:"EMAIL ADDRESS", key:"email", type:"email", placeholder:"jane@company.com" },
                { label:"PASSWORD", key:"password", type:"password", placeholder:"Min. 8 characters" },
              ].map(field=>(
                <div key={field.key} style={{ marginBottom:"1rem" }}>
                  <label style={{ display:"block", fontSize:11, fontFamily:"var(--font-mono)", letterSpacing:"0.06em", color:"var(--muted)", marginBottom:6 }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder} required value={form[field.key]}
                    onChange={e=>setForm({...form,[field.key]:e.target.value})}
                    style={{ width:"100%", padding:"10px 13px", background:"var(--bg)", border:"1px solid var(--border-strong)", borderRadius:9, fontFamily:"var(--font-sans)", fontSize:14, color:"var(--text)", outline:"none" }}
                    onFocus={e=>e.target.style.borderColor="var(--accent)"}
                    onBlur={e=>e.target.style.borderColor="var(--border-strong)"}
                  />
                </div>
              ))}
              <div style={{ marginBottom:"1rem" }}>
                <label style={{ display:"block", fontSize:11, fontFamily:"var(--font-mono)", letterSpacing:"0.06em", color:"var(--muted)", marginBottom:6 }}>ROLE</label>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
                  style={{ width:"100%", padding:"10px 13px", background:"var(--bg)", border:"1px solid var(--border-strong)", borderRadius:9, fontFamily:"var(--font-sans)", fontSize:14, color:"var(--text)", outline:"none" }}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:"1.5rem" }}>
                <button type="button" onClick={()=>setShowModal(false)} style={{ padding:"9px 18px", background:"transparent", border:"1px solid var(--border-strong)", borderRadius:8, fontFamily:"var(--font-sans)", fontSize:13, cursor:"pointer", color:"var(--muted)" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding:"9px 18px", background:"var(--text)", color:"var(--bg)", border:"none", borderRadius:8, fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500, cursor: saving?"not-allowed":"pointer", opacity: saving?0.6:1 }}>
                  {saving ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      <div style={{
        position:"fixed", bottom:"2rem", right:"2rem",
        background:"var(--text)", color:"var(--bg)", padding:"12px 18px",
        borderRadius:10, fontSize:13, fontWeight:500, zIndex:300,
        transition:"all 0.3s ease",
        transform: toast ? "translateY(0)" : "translateY(100px)",
        opacity: toast ? 1 : 0,
        pointerEvents: "none"
      }}>
        {toast}
      </div>
    </Layout>
  );
}

export default Employees;
