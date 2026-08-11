import type { CVData, CVStyleConfig, AcademicRecord, SkillCategory, Skill } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

function getCfg(c: CVStyleConfig | undefined) {
  return {
    accent:    String(c?.accent_color ?? "#374151"),
    font:      c?.font_family === "serif" ? "Georgia,'Times New Roman',serif"
             : c?.font_family === "mono"  ? "'Courier New',Consolas,monospace"
             : "system-ui,-apple-system,sans-serif",
    px:        Number(c?.font_size   ?? 13),
    lh:        Number(c?.line_height ?? 1.55),
    secStyle:  (c?.section_style ?? "underline") as string,
    skillsSt:  (c?.skills_style  ?? "text")      as string,
    cardSt:    (c?.card_style    ?? "flat")       as string,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase === true,
  };
}

type Cfg = ReturnType<typeof getCfg>;

function SecHead({ icon, label, cfg }: { icon:string; label:string; cfg:Cfg }) {
  const { showIcons, secStyle, px, accent, font } = cfg;
  const txt = showIcons ? `${icon} ${label}` : label;
  if (secStyle === "left-bar") return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
      <div style={{ width:3, height:14, background:accent, borderRadius:2, flexShrink:0 }}/>
      <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:accent, margin:0, fontFamily:font }}>{label}</h2>
    </div>
  );
  if (secStyle === "filled") return (
    <div style={{ background:`${accent}12`, padding:"4px 10px", borderRadius:6, marginBottom:10 }}>
      <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
    </div>
  );
  if (secStyle === "minimal") return (
    <div style={{ marginBottom:10 }}>
      <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:"#9ca3af", margin:0, fontFamily:font }}>{label}</h2>
    </div>
  );
  // underline (default)
  return (
    <div style={{ marginBottom:10, paddingBottom:3, borderBottom:`1px solid ${accent}66` }}>
      <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
    </div>
  );
}

function Card({ r, cfg }: { r:AcademicRecord; cfg:Cfg }) {
  const { font, cardSt, accent, px, lh } = cfg;
  const base: React.CSSProperties = { display:"flex", justifyContent:"space-between", gap:12, marginBottom:8, padding:"8px 0", borderBottom:"0.3px solid #f3f4f6", fontFamily:font };
  const variants: Record<string,React.CSSProperties> = {
    flat:     { ...base },
    shadow:   { ...base, background:"#fafafa", padding:"8px 10px", boxShadow:"0 1px 4px rgba(0,0,0,.07)", borderRadius:6, borderBottom:"none" },
    bordered: { ...base, border:"1px solid #e5e7eb", padding:"8px 10px", borderRadius:6, borderBottom:undefined },
    accent:   { ...base, background:`${accent}0c`, borderLeft:`3px solid ${accent}`, padding:"8px 10px", paddingLeft:12, borderBottom:"none", borderRadius:0 },
  };
  return (
    <div style={variants[cardSt] ?? base}>
      <div style={{ flex:1 }}>
        <p style={{ fontWeight:700, fontSize:px, color:"#111827", margin:0, fontFamily:font }}>{r.title}</p>
        <p style={{ fontSize:px-2, color:"#6b7280", margin:"2px 0 0" }}>{r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}</p>
        {r.description && <p style={{ fontSize:px-3, color:"#9ca3af", margin:"3px 0 0", lineHeight:lh }}>{r.description}</p>}
      </div>
      <div style={{ textAlign:"right", flexShrink:0, minWidth:40 }}>
        <p style={{ fontSize:px-3, color:"#9ca3af", margin:0, whiteSpace:"nowrap" }}>
          {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
        </p>
      </div>
    </div>
  );
}

function SkillsBlock({ skills, cfg }: { skills:Record<SkillCategory, Skill[]>; cfg:Cfg }) {
  const { skillsSt, px, accent } = cfg;
  const allSkills = Object.values(skills).flat();
  if (skillsSt === "chips") return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
      {allSkills.map(s => <span key={s.id} style={{ fontSize:px-2, padding:"2px 8px", borderRadius:20, border:`1px solid ${accent}55`, color:accent, background:`${accent}0d` }}>{s.name}</span>)}
    </div>
  );
  if (skillsSt === "bars") return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 20px" }}>
      {allSkills.slice(0,10).map((s,i)=>{
        const pct=[85,70,90,75,80,65,88,72,78,68][i%10];
        return (
          <div key={s.id}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:px-3, marginBottom:2 }}>
              <span style={{ color:"#374151" }}>{s.name}</span><span style={{ color:"#9ca3af" }}>{pct}%</span>
            </div>
            <div style={{ height:2.5, background:"#e5e7eb", borderRadius:2 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:accent, borderRadius:2 }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
  if (skillsSt === "dots") return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 16px" }}>
      {allSkills.map(s=>(
        <div key={s.id} style={{ display:"flex", alignItems:"center", gap:6, fontSize:px-2, color:"#6b7280" }}>
          <span style={{ width:4, height:4, borderRadius:"50%", background:accent, flexShrink:0, display:"inline-block" }}/>
          {s.name}
        </div>
      ))}
    </div>
  );
  // text (default for executive)
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 20px" }}>
      {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
        <div key={cat}>
          <p style={{ fontSize:px-3, fontWeight:700, color:"#6b7280", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.5px" }}>
            {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
          </p>
          <p style={{ fontSize:px-2, color:"#9ca3af", margin:0, lineHeight:1.6 }}>{list.map(s=>s.name).join("  ·  ")}</p>
        </div>
      ))}
    </div>
  );
}

export default function CVPreviewExecutive({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const cfg = getCfg(config);
  const { accent, font, px, lh } = cfg;
  const name = cfg.upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  return (
    <div style={{ fontFamily:font, color:"#374151", fontSize:px, padding:"36px 40px" }}>
      {/* Header */}
      <h1 style={{ fontSize:px+14, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:"#111827", margin:"0 0 6px", lineHeight:1.15, fontFamily:font }}>
        {name}
      </h1>
      <div style={{ width:32, height:2, background:accent, marginBottom:10, borderRadius:1 }}/>
      <div style={{ display:"flex", flexWrap:"wrap", gap:12, fontSize:px-2, color:"#9ca3af", marginBottom:10 }}>
        {profile.city         && <span>📍 {profile.city}</span>}
        {profile.phone        && <span>📱 {profile.phone}</span>}
        {profile.linkedin_url && <span>🔗 LinkedIn</span>}
        {profile.website_url  && <span>🌐 Portafolio</span>}
      </div>
      {profile.bio && <p style={{ fontSize:px-1, color:"#6b7280", lineHeight:lh, maxWidth:460, margin:"0 0 20px", fontFamily:font }}>{profile.bio}</p>}

      {/* Sections */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {sections.map(section => (
          <div key={section.type}>
            <SecHead icon={section.icon} label={section.label} cfg={cfg}/>
            {section.records.map(r => <Card key={r.id} r={r} cfg={cfg}/>)}
          </div>
        ))}
        {Object.values(skills).flat().length > 0 && (
          <div>
            <SecHead icon="🏷️" label="Competencias" cfg={cfg}/>
            <SkillsBlock skills={skills} cfg={cfg}/>
          </div>
        )}
      </div>
    </div>
  );
}
