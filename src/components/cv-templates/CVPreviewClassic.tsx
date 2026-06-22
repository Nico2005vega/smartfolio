import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:    String(c?.accent_color ?? "#059669"),
    font:      c?.font_family === "serif" ? "Georgia,'Times New Roman',serif"
             : c?.font_family === "mono"  ? "'Courier New',Consolas,monospace"
             : "system-ui,-apple-system,sans-serif",
    px:        Number(c?.font_size   ?? 13),
    lh:        Number(c?.line_height ?? 1.55),
    photoR:    c?.photo_shape === "square" ? "3px" : c?.photo_shape === "rounded" ? "12px" : "50%",
    secStyle:  (c?.section_style ?? "underline") as string,
    skillsSt:  (c?.skills_style  ?? "chips")     as string,
    cardSt:    (c?.card_style    ?? "flat")       as string,
    showPhoto: c?.show_photo !== false,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase === true,
  };
}

export default function CVPreviewClassic({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, photoR, secStyle, skillsSt, cardSt, showPhoto, showIcons, upper } = getCfg(config);
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  const SecHead = ({ icon, label }: { icon:string; label:string }) => {
    const txt = showIcons ? `${icon} ${label}` : label;
    if (secStyle === "left-bar") return (
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ width:3, height:14, background:accent, borderRadius:2, flexShrink:0 }}/>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{label}</h2>
      </div>
    );
    if (secStyle === "filled") return (
      <div style={{ background:`${accent}15`, padding:"4px 10px", borderRadius:6, marginBottom:8 }}>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
    if (secStyle === "minimal") return (
      <div style={{ marginBottom:8 }}>
        <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:"#9ca3af", margin:0, fontFamily:font }}>{label}</h2>
      </div>
    );
    return (
      <div style={{ borderBottom:`1.5px solid ${accent}88`, paddingBottom:3, marginBottom:8 }}>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
  };

  const Card = ({ r }: { r:any }) => {
    const base: React.CSSProperties = { display:"flex", justifyContent:"space-between", gap:8, marginBottom:6, padding:"6px 8px", borderRadius:8, fontFamily:font };
    const variants: Record<string,React.CSSProperties> = {
      flat:     { ...base },
      shadow:   { ...base, boxShadow:"0 1px 5px rgba(0,0,0,.08)", background:"#fafafa" },
      bordered: { ...base, border:"1px solid #e5e7eb" },
      accent:   { ...base, background:`${accent}0d`, borderLeft:`3px solid ${accent}`, paddingLeft:10 },
    };
    return (
      <div style={variants[cardSt] ?? base}>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:px, fontWeight:600, color:"#111827", margin:0, lineHeight:lh, fontFamily:font }}>{r.title}</p>
          <p style={{ fontSize:px-2, color:"#6b7280", margin:"2px 0 0" }}>{r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}</p>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <p style={{ fontSize:px-3, color:"#9ca3af", margin:0, whiteSpace:"nowrap" }}>
            {r.start_date ? formatDate(r.start_date,"MMM yyyy") : ""}
            {r.end_date ? ` — ${formatDate(r.end_date,"MMM yyyy")}` : ""}
          </p>
        </div>
      </div>
    );
  };

  const SkillsBlock = () => {
    if (skillsSt === "dots") return (
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0 16px" }}>
        {allSkills.map(s => (
          <div key={s.id} style={{ display:"flex", alignItems:"center", gap:5, fontSize:px-2, color:"#6b7280", marginBottom:3 }}>
            <span style={{ width:4, height:4, borderRadius:"50%", background:accent, flexShrink:0, display:"inline-block" }}/>
            {s.name}
          </div>
        ))}
      </div>
    );
    if (skillsSt === "bars") return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 16px" }}>
        {allSkills.slice(0,10).map((s,i) => {
          const pct = [85,70,90,75,80,65,88,72,78,68][i % 10];
          return (
            <div key={s.id}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:px-3, marginBottom:2 }}>
                <span style={{ color:"#374151" }}>{s.name}</span>
                <span style={{ color:"#9ca3af" }}>{pct}%</span>
              </div>
              <div style={{ height:3, background:"#e5e7eb", borderRadius:2 }}>
                <div style={{ height:"100%", width:`${pct}%`, background:accent, borderRadius:2 }}/>
              </div>
            </div>
          );
        })}
      </div>
    );
    if (skillsSt === "text") return (
      <p style={{ fontSize:px-1, color:"#6b7280", lineHeight:1.8 }}>
        {allSkills.map(s => s.name).join("  ·  ")}
      </p>
    );
    // chips
    return (
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {allSkills.map(s => (
          <span key={s.id} style={{ fontSize:px-2, padding:"2px 8px", borderRadius:20, border:`1px solid ${accent}55`, color:accent, background:`${accent}0e` }}>
            {s.name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ fontFamily:font, color:"#1f2937", fontSize:px, padding:32 }}>
      {/* Header */}
      <div style={{ textAlign:"center", borderBottom:`2px solid ${accent}`, paddingBottom:16, marginBottom:20 }}>
        {showPhoto && profile.photo_url && (
          <img src={profile.photo_url} alt="" style={{ width:72, height:72, objectFit:"cover", borderRadius:photoR, border:`2px solid ${accent}33`, marginBottom:10, display:"block", margin:"0 auto 10px" }}/>
        )}
        <h1 style={{ fontSize:px+10, fontWeight:700, color:"#111827", margin:0, lineHeight:1.2, fontFamily:font }}>{name}</h1>
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:12, marginTop:8, fontSize:px-2, color:"#6b7280" }}>
          {profile.city         && <span>📍 {profile.city}</span>}
          {profile.phone        && <span>📱 {profile.phone}</span>}
          {profile.linkedin_url && <span>🔗 LinkedIn</span>}
          {profile.website_url  && <span>🌐 Portafolio</span>}
        </div>
        {profile.bio && (
          <p style={{ fontSize:px-1, color:"#6b7280", maxWidth:480, margin:"10px auto 0", lineHeight:lh, fontFamily:font }}>{profile.bio}</p>
        )}
      </div>

      {/* Sections */}
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {sections.map(section => (
          <div key={section.type}>
            <SecHead icon={section.icon} label={section.label}/>
            {section.records.map(r => <Card key={r.id} r={r}/>)}
          </div>
        ))}
        {allSkills.length > 0 && (
          <div>
            <SecHead icon="🏷️" label="Habilidades"/>
            <SkillsBlock/>
          </div>
        )}
      </div>
    </div>
  );
}