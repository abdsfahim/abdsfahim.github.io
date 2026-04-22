import { useState, useEffect } from "react";

// ── default data ──────────────────────────────────────────────
const DEFAULT_ITEMS = [
  {
    id: "r1", type: "research", color: "blue",
    icon: "⚛️", title: "Semiconductor Process ML",
    short: "ML surrogate models replacing SRIM/TRIM Monte Carlo simulations for ion implantation — R² > 0.98, millisecond inference.",
    details: "Built a dual-stage Hybrid Random Forest framework for forward and inverse ion implantation modeling in Si, SiC, and GaAs. Automated SRIM/TRIM pipeline using Python to generate 10,000+ training samples. Achieved R² > 0.98 across all substrates with inference time reduced from minutes to milliseconds.",
    tags: ["Random Forest", "SRIM/TRIM", "SiC", "GaAs", "Surrogate Modeling"],
    photos: [], videos: [],
  },
  {
    id: "r2", type: "research", color: "teal",
    icon: "🫀", title: "Biomedical & Predictive Healthcare",
    short: "IoT-enabled non-invasive CVD prediction using Gradient Boosting — 89% accuracy on Framingham Dataset.",
    details: "Designed CardioPredictor: a real-time non-invasive cardiovascular disease prediction system. Built sensor hardware (glucose, cholesterol, blood pressure), integrated ThingSpeak IoT server, trained Gradient Boosting model on Framingham Dataset with 10-fold cross-validation. Published in IEEE.",
    tags: ["Gradient Boosting", "IoT", "Framingham Dataset", "Non-invasive"],
    photos: [], videos: [],
  },
  {
    id: "p1", type: "project", color: "amber",
    icon: "🤖", title: "SRIM Automation Pipeline",
    short: "Python pipeline to automate SRIM/TRIM Monte Carlo simulations for large-scale dataset generation.",
    details: "Wrote a Python script that programmatically launches SRIM, injects parameters (ion species, energy, angle, target material), extracts output files, and compiles structured datasets — reducing manual effort from days to hours.",
    tags: ["Python", "Automation", "SRIM/TRIM", "Data Pipeline"],
    photos: [], videos: [],
  },
  {
    id: "p2", type: "project", color: "rose",
    icon: "⚖️", title: "Self-Balancing Robot",
    short: "Two-wheel robot with Arduino Nano + MPU6050 using PID control for real-time stable balancing.",
    details: "Designed and assembled a two-wheeled inverted pendulum robot. Implemented PID control algorithm tuned in real-time using MPU6050 gyroscope/accelerometer data. Achieved stable balancing under minor disturbances.",
    tags: ["Arduino", "PID Control", "MPU6050", "Embedded C"],
    photos: [], videos: [],
  },
];

const COLORS = {
  blue:  { bg: "rgba(74,143,255,0.1)",  border: "rgba(74,143,255,0.3)",  text: "#4a8fff", bar: "linear-gradient(90deg,#4a8fff,#7ab8ff)" },
  teal:  { bg: "rgba(0,229,192,0.1)",   border: "rgba(0,229,192,0.3)",   text: "#00e5c0", bar: "linear-gradient(90deg,#00e5c0,#7fffd4)" },
  amber: { bg: "rgba(255,179,68,0.1)",  border: "rgba(255,179,68,0.3)",  text: "#ffb344", bar: "linear-gradient(90deg,#ffb344,#ffd580)" },
  rose:  { bg: "rgba(255,107,138,0.1)", border: "rgba(255,107,138,0.3)", text: "#ff6b8a", bar: "linear-gradient(90deg,#ff6b8a,#ffaabb)" },
};

const COLOR_OPTIONS = ["blue","teal","amber","rose"];
const BLANK_ITEM = { type:"project", color:"blue", icon:"🔬", title:"", short:"", details:"", tags:[], photos:[], videos:[] };

// ── helpers ───────────────────────────────────────────────────
function youtubeId(url) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ── storage ───────────────────────────────────────────────────
async function loadItems() {
  try {
    const r = await window.storage.get("portfolio_items");
    return r ? JSON.parse(r.value) : DEFAULT_ITEMS;
  } catch { return DEFAULT_ITEMS; }
}
async function saveItems(items) {
  try { await window.storage.set("portfolio_items", JSON.stringify(items)); } catch {}
}

// ══════════════════════════════════════════════════════════════
export default function App() {
  const [items, setItems]     = useState([]);
  const [view, setView]       = useState("portfolio"); // portfolio | admin
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);   // null | "new" | item
  const [loading, setLoading] = useState(true);
  const [saved, setSaved]     = useState(false);

  useEffect(() => { loadItems().then(d => { setItems(d); setLoading(false); }); }, []);

  const persist = (next) => { setItems(next); saveItems(next); };

  const saveItem = (item) => {
    let next;
    if (item.id) {
      next = items.map(i => i.id === item.id ? item : i);
    } else {
      next = [...items, { ...item, id: "i" + Date.now() }];
    }
    persist(next);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteItem = (id) => {
    if (!confirm("Delete this item?")) return;
    persist(items.filter(i => i.id !== id));
    setEditing(null);
  };

  if (loading) return (
    <div style={S.page}>
      <div style={{margin:"auto",color:"#8899bb",fontFamily:"sans-serif"}}>Loading…</div>
    </div>
  );

  return (
    <div style={S.page}>
      {/* TOP BAR */}
      <div style={S.topbar}>
        <span style={S.logo}>AS Fahim · Portfolio CMS</span>
        <div style={{display:"flex",gap:"0.6rem",alignItems:"center"}}>
          {saved && <span style={{fontSize:"0.8rem",color:"#00e5c0"}}>✓ Saved</span>}
          <button style={view==="portfolio"?S.tabActive:S.tab} onClick={()=>{setEditing(null);setView("portfolio")}}>🌐 Portfolio</button>
          <button style={view==="admin"?S.tabActive:S.tab} onClick={()=>{setSelected(null);setView("admin")}}>⚙️ Dashboard</button>
        </div>
      </div>

      {/* ── PORTFOLIO VIEW ── */}
      {view === "portfolio" && (
        <div style={S.content}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={S.badge}>⚡ Click any card to see details</div>
            <h1 style={S.heroTitle}>Research & Projects</h1>
            <p style={{color:"#8899bb",fontSize:"0.95rem"}}>Abdullah Shadek Fahim · EEE Researcher · JUST</p>
          </div>

          {/* Research */}
          <SectionHeader label="Research" emoji="🔬" />
          <div style={S.grid}>
            {items.filter(i=>i.type==="research").map(item => (
              <Card key={item.id} item={item} onClick={()=>setSelected(item)} />
            ))}
          </div>

          {/* Projects */}
          <SectionHeader label="Projects" emoji="🛠️" />
          <div style={S.grid}>
            {items.filter(i=>i.type==="project").map(item => (
              <Card key={item.id} item={item} onClick={()=>setSelected(item)} />
            ))}
          </div>
        </div>
      )}

      {/* ── ADMIN VIEW ── */}
      {view === "admin" && !editing && (
        <div style={S.content}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
            <h2 style={{fontFamily:"sans-serif",color:"#e8edf7",margin:0}}>Manage Items ({items.length})</h2>
            <button style={S.btnPrimary} onClick={()=>setEditing({...BLANK_ITEM})}>+ Add New</button>
          </div>

          {["research","project"].map(type => (
            <div key={type} style={{marginBottom:"2rem"}}>
              <div style={{fontSize:"0.75rem",color:"#00e5c0",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.8rem"}}>
                {type === "research" ? "🔬 Research" : "🛠️ Projects"}
              </div>
              {items.filter(i=>i.type===type).map(item => (
                <AdminRow key={item.id} item={item} onEdit={()=>setEditing(item)} onDelete={()=>deleteItem(item.id)} />
              ))}
              {items.filter(i=>i.type===type).length === 0 && (
                <p style={{color:"#8899bb",fontSize:"0.85rem"}}>No items yet.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── EDITOR ── */}
      {view === "admin" && editing && (
        <Editor
          item={editing}
          onSave={saveItem}
          onCancel={()=>setEditing(null)}
          onDelete={editing.id ? ()=>deleteItem(editing.id) : null}
        />
      )}

      {/* ── DETAIL MODAL ── */}
      {selected && <DetailModal item={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

// ── CARD ─────────────────────────────────────────────────────
function Card({ item, onClick }) {
  const c = COLORS[item.color] || COLORS.blue;
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{...S.card, ...(hover?{transform:"translateY(-5px)",borderColor:c.border,boxShadow:"0 16px 40px rgba(0,0,0,0.35)"}:{})}}
      onClick={onClick}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
    >
      <div style={{...S.cardBar, background:c.bar}} />
      <div style={{...S.cardIcon, background:c.bg}}>{item.icon}</div>
      <div style={S.cardTitle}>{item.title}</div>
      <div style={S.cardShort}>{item.short}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginTop:"1rem"}}>
        {(item.tags||[]).slice(0,3).map(t=>(
          <span key={t} style={{...S.tag, background:c.bg, borderColor:c.border, color:c.text}}>{t}</span>
        ))}
        {(item.tags||[]).length > 3 && <span style={{...S.tag,background:"rgba(255,255,255,0.05)",borderColor:"rgba(255,255,255,0.1)",color:"#8899bb"}}>+{item.tags.length-3}</span>}
      </div>
      {(item.photos?.length > 0 || item.videos?.length > 0) && (
        <div style={{marginTop:"0.8rem",fontSize:"0.75rem",color:"#8899bb"}}>
          {item.photos?.length > 0 && `🖼️ ${item.photos.length} photo${item.photos.length>1?"s":""}`}
          {item.photos?.length > 0 && item.videos?.length > 0 && "  "}
          {item.videos?.length > 0 && `🎬 ${item.videos.length} video${item.videos.length>1?"s":""}`}
        </div>
      )}
      <div style={{marginTop:"auto",paddingTop:"1rem",fontSize:"0.8rem",color:c.text,fontWeight:600}}>View details →</div>
    </div>
  );
}

// ── SECTION HEADER ────────────────────────────────────────────
function SectionHeader({ label, emoji }) {
  return (
    <div style={{marginBottom:"1rem",marginTop:"2rem"}}>
      <div style={{fontSize:"0.75rem",color:"#00e5c0",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{emoji} {label}</div>
      <div style={{width:40,height:2,background:"linear-gradient(90deg,#4a8fff,#00e5c0)",borderRadius:2,marginTop:"0.4rem"}} />
    </div>
  );
}

// ── ADMIN ROW ─────────────────────────────────────────────────
function AdminRow({ item, onEdit, onDelete }) {
  const c = COLORS[item.color] || COLORS.blue;
  return (
    <div style={S.adminRow}>
      <span style={{fontSize:"1.2rem"}}>{item.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,color:"#e8edf7",fontSize:"0.9rem"}}>{item.title}</div>
        <div style={{fontSize:"0.78rem",color:"#8899bb",marginTop:"0.1rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.short}</div>
      </div>
      <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
        <span style={{...S.tag, background:c.bg, borderColor:c.border, color:c.text, fontSize:"0.7rem"}}>{item.color}</span>
        <button style={S.btnSm} onClick={onEdit}>✏️ Edit</button>
        <button style={{...S.btnSm,borderColor:"rgba(255,107,138,0.3)",color:"#ff6b8a"}} onClick={onDelete}>🗑️</button>
      </div>
    </div>
  );
}

// ── EDITOR ───────────────────────────────────────────────────
function Editor({ item, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState({ ...item });
  const [tagInput, setTagInput] = useState("");
  const [photoInput, setPhotoInput] = useState("");
  const [videoInput, setVideoInput] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...(form.tags||[]), t]);
    setTagInput("");
  };

  const addPhoto = () => {
    const u = photoInput.trim();
    if (u) { set("photos", [...(form.photos||[]), u]); setPhotoInput(""); }
  };

  const addVideo = () => {
    const u = videoInput.trim();
    if (u) { set("videos", [...(form.videos||[]), u]); setVideoInput(""); }
  };

  return (
    <div style={S.content}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
        <h2 style={{fontFamily:"sans-serif",color:"#e8edf7",margin:0}}>{form.id ? "Edit Item" : "New Item"}</h2>
        <div style={{display:"flex",gap:"0.5rem"}}>
          {onDelete && <button style={{...S.btnSm,borderColor:"rgba(255,107,138,0.4)",color:"#ff6b8a",padding:"0.5rem 1rem"}} onClick={onDelete}>🗑️ Delete</button>}
          <button style={S.btnOutline} onClick={onCancel}>Cancel</button>
          <button style={S.btnPrimary} onClick={()=>onSave(form)}>💾 Save</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
        {/* LEFT */}
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <Field label="Type">
            <select style={S.input} value={form.type} onChange={e=>set("type",e.target.value)}>
              <option value="research">Research</option>
              <option value="project">Project</option>
            </select>
          </Field>

          <Field label="Icon (emoji)">
            <input style={S.input} value={form.icon} onChange={e=>set("icon",e.target.value)} placeholder="🔬" />
          </Field>

          <Field label="Color">
            <div style={{display:"flex",gap:"0.5rem"}}>
              {COLOR_OPTIONS.map(c=>(
                <div key={c} onClick={()=>set("color",c)}
                  style={{width:32,height:32,borderRadius:8,background:COLORS[c].bg,border:`2px solid ${form.color===c?COLORS[c].text:"transparent"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",color:COLORS[c].text,fontWeight:700}}>
                  {c[0].toUpperCase()}
                </div>
              ))}
            </div>
          </Field>

          <Field label="Title">
            <input style={S.input} value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Project title…" />
          </Field>

          <Field label="Short description (card preview)">
            <textarea style={{...S.input,minHeight:80,resize:"vertical"}} value={form.short} onChange={e=>set("short",e.target.value)} placeholder="One or two sentences shown on the card…" />
          </Field>

          <Field label="Full details (shown in modal)">
            <textarea style={{...S.input,minHeight:140,resize:"vertical"}} value={form.details} onChange={e=>set("details",e.target.value)} placeholder="Full explanation, methodology, results…" />
          </Field>

          {/* Tags */}
          <Field label="Tags">
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>
              {(form.tags||[]).map(t=>(
                <span key={t} style={{...S.tag,background:"rgba(74,143,255,0.1)",borderColor:"rgba(74,143,255,0.3)",color:"#4a8fff",cursor:"pointer"}}
                  onClick={()=>set("tags",form.tags.filter(x=>x!==t))}>
                  {t} ×
                </span>
              ))}
            </div>
            <div style={{display:"flex",gap:"0.4rem"}}>
              <input style={{...S.input,flex:1}} value={tagInput} onChange={e=>setTagInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addTag()} placeholder="Add tag, press Enter…" />
              <button style={S.btnSm} onClick={addTag}>Add</button>
            </div>
          </Field>
        </div>

        {/* RIGHT — media */}
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          {/* Photos */}
          <Field label="📸 Photos (image URLs)">
            <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"0.5rem"}}>
              {(form.photos||[]).map((p,i)=>(
                <div key={i} style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
                  <img src={p} alt="" style={{width:48,height:36,objectFit:"cover",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)"}} onError={e=>e.target.style.display="none"} />
                  <span style={{flex:1,fontSize:"0.75rem",color:"#8899bb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p}</span>
                  <button style={{...S.btnSm,borderColor:"rgba(255,107,138,0.3)",color:"#ff6b8a",padding:"0.2rem 0.5rem"}}
                    onClick={()=>set("photos",form.photos.filter((_,j)=>j!==i))}>×</button>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:"0.4rem"}}>
              <input style={{...S.input,flex:1}} value={photoInput} onChange={e=>setPhotoInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addPhoto()} placeholder="https://i.imgur.com/… or any image URL" />
              <button style={S.btnSm} onClick={addPhoto}>Add</button>
            </div>
            <div style={{fontSize:"0.73rem",color:"#8899bb",marginTop:"0.4rem"}}>
              💡 Tip: Upload to imgur.com or Google Drive (public), paste the direct image link
            </div>
          </Field>

          {/* Videos */}
          <Field label="🎬 Videos (YouTube URLs)">
            <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"0.5rem"}}>
              {(form.videos||[]).map((v,i)=>{
                const vid = youtubeId(v);
                return (
                  <div key={i} style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
                    {vid && <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" style={{width:48,height:36,objectFit:"cover",borderRadius:6}} />}
                    <span style={{flex:1,fontSize:"0.75rem",color:"#8899bb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</span>
                    <button style={{...S.btnSm,borderColor:"rgba(255,107,138,0.3)",color:"#ff6b8a",padding:"0.2rem 0.5rem"}}
                      onClick={()=>set("videos",form.videos.filter((_,j)=>j!==i))}>×</button>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:"0.4rem"}}>
              <input style={{...S.input,flex:1}} value={videoInput} onChange={e=>setVideoInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addVideo()} placeholder="https://youtube.com/watch?v=…" />
              <button style={S.btnSm} onClick={addVideo}>Add</button>
            </div>
          </Field>

          {/* Live preview */}
          <div style={{background:"var(--card,#111d35)",border:"1px solid rgba(74,143,255,0.15)",borderRadius:14,padding:"1rem"}}>
            <div style={{fontSize:"0.73rem",color:"#00e5c0",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.6rem"}}>Live Preview</div>
            <div style={{display:"flex",gap:"0.6rem",alignItems:"flex-start"}}>
              <span style={{fontSize:"1.4rem"}}>{form.icon||"❓"}</span>
              <div>
                <div style={{fontWeight:700,color:"#e8edf7",fontSize:"0.9rem"}}>{form.title||"Title…"}</div>
                <div style={{fontSize:"0.78rem",color:"#8899bb",marginTop:"0.2rem"}}>{form.short||"Short description…"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DETAIL MODAL ──────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  const c = COLORS[item.color] || COLORS.blue;
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={S.modal}>
        {/* header */}
        <div style={{...S.modalBar, background:c.bar}} />
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.2rem"}}>
          <div style={{display:"flex",gap:"0.8rem",alignItems:"center"}}>
            <div style={{...S.cardIcon, background:c.bg, fontSize:"1.6rem"}}>{item.icon}</div>
            <div>
              <div style={{fontFamily:"sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#e8edf7"}}>{item.title}</div>
              <div style={{fontSize:"0.78rem",color:c.text,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600}}>{item.type}</div>
            </div>
          </div>
          <button style={{background:"none",border:"none",color:"#8899bb",fontSize:"1.4rem",cursor:"pointer",lineHeight:1,padding:"0.2rem"}} onClick={onClose}>×</button>
        </div>

        {/* tags */}
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1.2rem"}}>
          {(item.tags||[]).map(t=>(
            <span key={t} style={{...S.tag, background:c.bg, borderColor:c.border, color:c.text}}>{t}</span>
          ))}
        </div>

        {/* details text */}
        <p style={{color:"#c8d3e8",fontSize:"0.92rem",lineHeight:1.75,marginBottom:"1.5rem"}}>{item.details}</p>

        {/* photo gallery */}
        {item.photos?.length > 0 && (
          <div style={{marginBottom:"1.5rem"}}>
            <div style={{fontSize:"0.75rem",color:"#00e5c0",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.6rem"}}>📸 Photos</div>
            <img src={item.photos[activePhoto]} alt=""
              style={{width:"100%",maxHeight:260,objectFit:"cover",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",marginBottom:"0.6rem"}} />
            {item.photos.length > 1 && (
              <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
                {item.photos.map((p,i)=>(
                  <img key={i} src={p} alt="" onClick={()=>setActivePhoto(i)}
                    style={{width:56,height:42,objectFit:"cover",borderRadius:6,cursor:"pointer",border:`2px solid ${i===activePhoto?c.text:"transparent"}`,opacity:i===activePhoto?1:0.6,transition:"all 0.15s"}} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* videos */}
        {item.videos?.length > 0 && (
          <div>
            <div style={{fontSize:"0.75rem",color:"#00e5c0",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.8rem"}}>🎬 Videos</div>
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              {item.videos.map((v,i)=>{
                const vid = youtubeId(v);
                return vid ? (
                  <div key={i} style={{position:"relative",paddingTop:"56.25%",borderRadius:12,overflow:"hidden",background:"#000"}}>
                    <iframe src={`https://www.youtube.com/embed/${vid}`} title={`video-${i}`}
                      style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}} allowFullScreen />
                  </div>
                ) : (
                  <a key={i} href={v} target="_blank" rel="noreferrer" style={{color:c.text,fontSize:"0.85rem"}}>▶ {v}</a>
                );
              })}
            </div>
          </div>
        )}

        {item.photos?.length === 0 && item.videos?.length === 0 && (
          <div style={{padding:"1rem",background:"rgba(255,255,255,0.03)",borderRadius:10,textAlign:"center",color:"#8899bb",fontSize:"0.83rem"}}>
            No media added yet. Add photos & videos from the Dashboard.
          </div>
        )}
      </div>
    </div>
  );
}

// ── FIELD ─────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label style={{display:"block",fontSize:"0.78rem",color:"#8899bb",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"0.4rem"}}>{label}</label>
      {children}
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────
const S = {
  page: { minHeight:"100vh", background:"#060d1f", color:"#e8edf7", fontFamily:"'DM Sans',system-ui,sans-serif", display:"flex", flexDirection:"column" },
  topbar: { position:"sticky",top:0,zIndex:50,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.8rem 1.5rem",background:"rgba(6,13,31,0.9)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(74,143,255,0.1)" },
  logo: { fontWeight:800, fontSize:"0.95rem", background:"linear-gradient(90deg,#4a8fff,#00e5c0)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  tab: { padding:"0.4rem 0.9rem",borderRadius:8,border:"1px solid rgba(74,143,255,0.2)",background:"transparent",color:"#8899bb",fontSize:"0.83rem",cursor:"pointer" },
  tabActive: { padding:"0.4rem 0.9rem",borderRadius:8,border:"1px solid rgba(74,143,255,0.4)",background:"rgba(74,143,255,0.1)",color:"#4a8fff",fontSize:"0.83rem",cursor:"pointer" },
  content: { padding:"2rem 1.5rem", maxWidth:900, width:"100%", margin:"0 auto", flex:1 },
  badge: { display:"inline-block",padding:"0.3rem 0.9rem",borderRadius:999,background:"rgba(74,143,255,0.1)",border:"1px solid rgba(74,143,255,0.2)",fontSize:"0.78rem",color:"#4a8fff",marginBottom:"0.8rem" },
  heroTitle: { fontFamily:"sans-serif",fontWeight:800,fontSize:"2rem",margin:"0 0 0.4rem",background:"linear-gradient(135deg,#e8edf7,#8899bb)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" },
  grid: { display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1rem",marginBottom:"1rem" },
  card: { background:"#111d35",border:"1px solid rgba(74,143,255,0.12)",borderRadius:16,padding:"1.4rem",cursor:"pointer",transition:"all 0.25s",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden" },
  cardBar: { position:"absolute",top:0,left:0,right:0,height:3 },
  cardIcon: { width:42,height:42,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",marginBottom:"0.9rem" },
  cardTitle: { fontWeight:700,fontSize:"0.97rem",marginBottom:"0.5rem",color:"#e8edf7" },
  cardShort: { fontSize:"0.82rem",color:"#8899bb",lineHeight:1.6,flex:1 },
  tag: { padding:"0.2rem 0.6rem",borderRadius:999,fontSize:"0.72rem",border:"1px solid" },
  adminRow: { display:"flex",alignItems:"center",gap:"0.8rem",background:"#111d35",border:"1px solid rgba(74,143,255,0.1)",borderRadius:12,padding:"0.9rem 1rem",marginBottom:"0.6rem" },
  input: { width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(74,143,255,0.2)",borderRadius:8,color:"#e8edf7",padding:"0.55rem 0.8rem",fontSize:"0.88rem",outline:"none",boxSizing:"border-box" },
  btnPrimary: { padding:"0.55rem 1.2rem",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4a8fff,#2d6fe0)",color:"#fff",fontWeight:600,fontSize:"0.88rem",cursor:"pointer" },
  btnOutline: { padding:"0.55rem 1.2rem",borderRadius:8,border:"1px solid rgba(74,143,255,0.3)",background:"transparent",color:"#e8edf7",fontWeight:600,fontSize:"0.88rem",cursor:"pointer" },
  btnSm: { padding:"0.35rem 0.75rem",borderRadius:6,border:"1px solid rgba(74,143,255,0.25)",background:"transparent",color:"#4a8fff",fontSize:"0.8rem",cursor:"pointer",whiteSpace:"nowrap" },
  overlay: { position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" },
  modal: { background:"#0d1830",border:"1px solid rgba(74,143,255,0.2)",borderRadius:20,padding:"1.8rem",maxWidth:640,width:"100%",maxHeight:"90vh",overflowY:"auto",position:"relative" },
  modalBar: { position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"20px 20px 0 0" },
};
