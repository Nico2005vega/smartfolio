import type { CVData, CVStyleConfig, AcademicRecord, Skill } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";
import { MapPin, Phone, Globe, Link as LinkIcon, Mail } from "lucide-react";

interface Props { data: CVData; }

function getCfg(config: CVStyleConfig) {
  const cfg = config;
  const accent       = config?.accent_color    ?? "#059669";
  const fontFace     = cfg.font_family === "serif"
    ? "Georgia, 'Times New Roman', serif"
    : cfg.font_family === "mono"
    ? "'Courier New', Consolas, monospace"
    : "system-ui, -apple-system, sans-serif";
  return {
    accent, fontFace,
    basePx:       cfg.font_size    ?? 13,
    lh:           cfg.line_height  ?? 1.55,
    photoShape:   cfg.photo_shape  ?? "circle",
    sectionStyle: cfg.section_style ?? "underline",
    skillsStyle:  cfg.skills_style  ?? "chips",
    cardStyle:    cfg.card_style    ?? "flat",
    showPhoto:    cfg.show_photo    !== false,
    showIcons:    cfg.show_icons    !== false,
    uppercase:    cfg.uppercase     === true,
  };
}

type Cfg = ReturnType<typeof getCfg>;

/* ── Section header renderer ─────────────────────── */
function SectionHeader({ icon, label, cfg }: { icon:string; label:string; cfg:Cfg }) {
  const { sectionStyle, basePx, accent, fontFace, showIcons } = cfg;
  switch (sectionStyle) {
    case "left-bar": return (
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
        <div style={{ width:"3px", height:"16px", background:accent, borderRadius:"2px", flexShrink:0 }}/>
        <h2 style={{ fontSize:`${basePx-2}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:fontFace }}>
          {showIcons && `${icon} `}{label}
        </h2>
      </div>
    );
    case "filled": return (
      <div style={{ background:`${accent}14`, padding:"4px 10px", borderRadius:"6px", marginBottom:"10px" }}>
        <h2 style={{ fontSize:`${basePx-2}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:fontFace }}>
          {showIcons && `${icon} `}{label}
        </h2>
      </div>
    );
    case "minimal": return (
      <div style={{ marginBottom:"10px" }}>
        <h2 style={{ fontSize:`${basePx-3}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"2px", color:"#9ca3af", margin:0, fontFamily:fontFace }}>
          {label}
        </h2>
      </div>
    );
    default: return ( // underline
      <div style={{ display:"flex", alignItems:"center", gap:"8px", borderBottom:`1.5px solid ${accent}`, paddingBottom:"4px", marginBottom:"10px" }}>
        <h2 style={{ fontSize:`${basePx-2}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:fontFace }}>
          {showIcons && `${icon} `}{label}
        </h2>
      </div>
    );
  }
}

/* ── Record card renderer ─────────────────────────── */
function RecordCard({ r, cfg }: { r:AcademicRecord; cfg:Cfg }) {
  const { fontFace, cardStyle, accent, basePx, lh } = cfg;
  const cardBase: React.CSSProperties = {
    display:"flex", gap:"12px", padding:"8px",
    marginBottom:"6px", borderRadius:"8px",
    fontFamily:fontFace,
  };
  const cardStyles: Record<string, React.CSSProperties> = {
    flat:     { ...cardBase },
    shadow:   { ...cardBase, boxShadow:"0 1px 4px rgba(0,0,0,0.08)", background:"#fafafa" },
    bordered: { ...cardBase, border:"1px solid #e5e7eb", background:"white" },
    accent:   { ...cardBase, background:`${accent}0c`, borderLeft:`3px solid ${accent}` },
  };

  return (
    <div style={cardStyles[cardStyle] ?? cardBase}>
      <div style={{ width:"44px", flexShrink:0, textAlign:"right" }}>
        <span style={{ fontSize:`${basePx-3}px`, color:"#9ca3af", lineHeight:1 }}>
          {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
        </span>
      </div>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:`${basePx}px`, fontWeight:"600", color:"#111827", margin:0, lineHeight:lh, fontFamily:fontFace }}>
          {r.title}
        </p>
        <p style={{ fontSize:`${basePx-2}px`, color:"#6b7280", margin:"2px 0 0", lineHeight:1.4 }}>
          {r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}
        </p>
        {r.description && (
          <p style={{ fontSize:`${basePx-3}px`, color:"#9ca3af", margin:"4px 0 0", lineHeight:1.5 }}>
            {r.description}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Skills renderer ─────────────────────────────── */
function Skills({ allSkills, cfg }: { allSkills:Skill[]; cfg:Cfg }) {
  const { skillsStyle, basePx } = cfg;
  if (allSkills.length === 0) return null;
  switch (skillsStyle) {
    case "dots": return (
      <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
        {allSkills.slice(0,14).map(s=>(
          <div key={s.id} style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:`${basePx-2}px`, color:"rgba(255,255,255,0.85)" }}>
            <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:"rgba(255,255,255,0.6)", flexShrink:0 }}/>
            {s.name}
          </div>
        ))}
      </div>
    );
    case "bars": return (
      <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
        {allSkills.slice(0,8).map((s,i)=>{
          const pct = [90,75,85,70,80,65,88,72][i%8];
          return (
            <div key={s.id}>
              <div style={{ fontSize:`${basePx-3}px`, color:"rgba(255,255,255,0.8)", marginBottom:"2px" }}>{s.name}</div>
              <div style={{ height:"3px", background:"rgba(255,255,255,0.2)", borderRadius:"2px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:"rgba(255,255,255,0.7)", borderRadius:"2px" }}/>
              </div>
            </div>
          );
        })}
      </div>
    );
    case "text": return (
      <p style={{ fontSize:`${basePx-2}px`, color:"rgba(255,255,255,0.85)", lineHeight:1.7 }}>
        {allSkills.map(s=>s.name).join("  ·  ")}
      </p>
    );
    default: return ( // chips
      <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
        {allSkills.slice(0,12).map(s=>(
          <div key={s.id} style={{
            fontSize:`${basePx-2}px`, color:"#ffffff",
            background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
            borderRadius:"4px", padding:"3px 8px",
          }}>
            {s.name}
          </div>
        ))}
      </div>
    );
  }
}

export default function CVPreviewModern({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const cfg = getCfg(config);
  const { accent, fontFace, basePx, lh, photoShape, skillsStyle, showPhoto } = cfg;

  const photoRadius  = photoShape === "circle" ? "50%" : photoShape === "rounded" ? "12px" : "4px";
  const nameText     = cfg.uppercase
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;
  const allSkills    = Object.values(skills).flat();

  /* ── Render ──────────────────────────────────────── */
  return (
    <div style={{ fontFamily:fontFace, color:"#1f2937", fontSize:`${basePx}px`, minHeight:"297mm" }}>
      <div style={{ display:"flex", minHeight:"180px" }}>

        {/* ── Sidebar ─────────────────────────────── */}
        <div style={{ width:"215px", flexShrink:0, padding:"24px 18px", background:accent, color:"#fff" }}>
          {showPhoto && (
            profile.photo_url ? (
              <img src={profile.photo_url} alt="Foto" style={{
                width:"78px", height:"78px", objectFit:"cover",
                borderRadius:photoRadius, border:"2.5px solid rgba(255,255,255,0.4)",
                marginBottom:"14px", display:"block"
              }}/>
            ) : (
              <div style={{
                width:"78px", height:"78px",
                borderRadius:photoRadius,
                background:"rgba(255,255,255,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:"14px", fontSize:"26px", fontWeight:"800", color:"white"
              }}>
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </div>
            )
          )}

          <p style={{ fontSize:`${basePx+1}px`, fontWeight:"800", color:"#fff", lineHeight:1.2, marginBottom:"12px" }}>
            {nameText}
          </p>

          <div style={{ fontSize:`${basePx-2}px`, opacity:0.9, display:"flex", flexDirection:"column", gap:"6px", marginBottom:"16px" }}>
            {profile.city    && <div style={{display:"flex",alignItems:"center",gap:"5px"}}><MapPin size={10}/> {profile.city}{profile.country ? `, ${profile.country}` : ""}</div>}
            {profile.phone   && <div style={{display:"flex",alignItems:"center",gap:"5px"}}><Phone size={10}/> {profile.phone}</div>}
            {profile.linkedin_url && <div style={{display:"flex",alignItems:"center",gap:"5px"}}><LinkIcon size={10}/> LinkedIn</div>}
            {profile.github_url   && <div style={{display:"flex",alignItems:"center",gap:"5px"}}><LinkIcon size={10}/> GitHub</div>}
            {profile.website_url  && <div style={{display:"flex",alignItems:"center",gap:"5px"}}><Globe size={10}/> Portafolio</div>}
          </div>

          {/* Skills grouped by category */}
          {Object.entries(skills).some(([,list])=>list.length>0) && (
            <div style={{ marginTop:"8px" }}>
              <div style={{ fontSize:`${basePx-4}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"1px", color:"rgba(255,255,255,0.55)", marginBottom:"8px" }}>
                Habilidades
              </div>
              {skillsStyle === "chips" || skillsStyle === "bars" || skillsStyle === "dots" || skillsStyle === "text"
                ? <Skills allSkills={allSkills} cfg={cfg}/>
                : Object.entries(skills).map(([cat, list]) => list.length > 0 && (
                    <div key={cat} style={{ marginBottom:"8px" }}>
                      <p style={{ fontSize:`${basePx-4}px`, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 4px" }}>
                        {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                      </p>
                      <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                        {list.map(s=>(
                          <span key={s.id} style={{ fontSize:`${basePx-2}px`, color:"white", background:"rgba(255,255,255,0.14)", border:"1px solid rgba(255,255,255,0.22)", borderRadius:"4px", padding:"2px 7px" }}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
              }
            </div>
          )}
        </div>

        {/* ── Main content ─────────────────────────── */}
        <div style={{ flex:1, padding:"24px 22px" }}>
          {/* Name (shown in main area if no photo) */}
          {!showPhoto && (
            <h1 style={{ fontSize:`${basePx+8}px`, fontWeight:"800", color:accent, margin:"0 0 6px", lineHeight:1.15, fontFamily:fontFace }}>
              {nameText}
            </h1>
          )}

          {profile.bio && (
            <p style={{ fontSize:`${basePx-1}px`, color:"#4b5563", lineHeight:lh, maxWidth:"420px", margin:"0 0 12px", fontFamily:fontFace }}>
              {profile.bio}
            </p>
          )}

          <div style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:`${basePx-2}px`, color:"#9ca3af", marginBottom:"20px" }}>
            <Mail size={10}/> contacto@smartfolio.co
          </div>

          {/* Academic sections */}
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            {sections.map(section=>(
              <div key={section.type}>
                <SectionHeader icon={section.icon} label={section.label} cfg={cfg}/>
                {section.records.map(r=><RecordCard key={r.id} r={r} cfg={cfg}/>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
