import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:    String(c?.accent_color ?? "#06b6d4"),
    font:      c?.font_family === "serif" ? "Georgia,'Times New Roman',serif"
             : c?.font_family === "sans"  ? "system-ui,-apple-system,sans-serif"
             : "'Courier New',Consolas,monospace",   // mono default for tech
    mono:      "'Courier New',Consolas,monospace",
    px:        Number(c?.font_size   ?? 12),
    lh:        Number(c?.line_height ?? 1.55),
    photoR:    c?.photo_shape === "square" ? "4px" : c?.photo_shape === "rounded" ? "8px" : "50%",
    secStyle:  (c?.section_style ?? "left-bar") as string,
    skillsSt:  (c?.skills_style  ?? "chips")    as string,
    cardSt:    (c?.card_style    ?? "accent")    as string,
    showPhoto: c?.show_photo !== false,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase === true,
  };
}

const DARK = "#0f172a";

export default function CVPreviewTech({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, mono, px, lh, photoR, secStyle, skillsSt, cardSt, showPhoto, showIcons, upper } = getCfg(config);
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  const SecHead = ({ icon, label }: { icon:string; label:string }) => {
    const txt = showIcons ? `${icon} ${label}` : label;
    if (secStyle === "underline") return (
      <div style={{ borderBottom:`1.5px solid ${accent}`, paddingBottom:4, marginBottom:8 }}>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
    if (secStyle === "filled") return (
      <div style={{ background:`${accent}14`, padding:"4px 10px", borderRadius:4, marginBottom:8 }}>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:mono }}>{txt}</h2>
      </div>
    );
    if (secStyle === "minimal") return (
      <div style={{ marginBottom:8 }}>
        <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:"#64748b", margin:0, fontFamily:mono }}>{label}</h2>
      </div>
    );
    // left-bar / default (code comment style)
    return (
      <div style={{ marginBottom:8 }}>
        <span style={{ fontFamily:mono, fontSize:px-3, color:accent, textTransform:"uppercase", letterSpacing:"1.5px", fontWeight:700 }}>
          {"// "}{label.toUpperCase()}
        </span>
      </div>
    );
  };

  const Card = ({ r }: { r:any }) => {
    const base: React.CSSProperties = { display:"flex", gap:10, alignItems:"flex-start", padding:"8px 10px", marginBottom:5, borderRadius:5, fontFamily:font };
    const variants: Record<string,React.CSSProperties> = {
      flat:     { ...base, background:"#f8fafc" },
      shadow:   { ...base, background:"white", boxShadow:"0 1px 5px rgba(0,0,0,.08)" },
      bordered: { ...base, border:"1px solid #e2e8f0", background:"white" },
      accent:   { ...base, background:`${accent}0b`, borderLeft:`3px solid ${accent}` },
    };
    return (
      <div style={variants[cardSt] ?? variants.flat}>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:px, fontWeight:600, color:"#0f172a", margin:0, lineHeight:lh, fontFamily:font }}>{r.title}</p>
          <p style={{ fontSize:px-3, color:"#64748b", margin:"2px 0 0", fontFamily:mono }}>
            {r.institution}{r.duration_hours ? ` | ${r.duration_hours}h` : ""}
          </p>
          {r.description && <p style={{ fontSize:px-3, color:"#94a3b8", margin:"3px 0 0", lineHeight:1.5 }}>{r.description}</p>}
        </div>
        <span style={{ fontSize:px-3, color:accent, background:`${accent}18`, padding:"1px 6px", borderRadius:3, flexShrink:0, fontFamily:mono, whiteSpace:"nowrap" }}>
          {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
        </span>
      </div>
    );
  };

  const SidebarSkills = () => {
    const all = Object.values(skills).flat();
    if (skillsSt === "dots") return (
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {all.map(s=>(
          <div key={s.id} style={{ display:"flex", alignItems:"center", gap:5, fontSize:px-2, color:"#94a3b8" }}>
            <span style={{ width:4, height:4, borderRadius:"50%", background:accent, flexShrink:0, display:"inline-block" }}/>
            {s.name}
          </div>
        ))}
      </div>
    );
    if (skillsSt === "bars") return (
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {all.slice(0,8).map((s,i)=>{
          const pct=[90,75,85,70,80,65,88,72][i%8];
          return (
            <div key={s.id}>
              <div style={{ fontSize:px-3, color:"#94a3b8", marginBottom:2, fontFamily:mono }}>{s.name}</div>
              <div style={{ height:2.5, background:"rgba(255,255,255,.1)", borderRadius:2 }}>
                <div style={{ height:"100%", width:`${pct}%`, background:accent, borderRadius:2 }}/>
              </div>
            </div>
          );
        })}
      </div>
    );
    if (skillsSt === "text") return (
      <p style={{ fontSize:px-2, color:"#94a3b8", lineHeight:1.8, fontFamily:mono }}>{all.map(s=>s.name).join(" · ")}</p>
    );
    // chips (default)
    return (
      <div>
        {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
          <div key={cat} style={{ marginBottom:10 }}>
            <p style={{ fontSize:px-4, color:`${accent}cc`, textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 4px", fontFamily:mono }}>
              {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
              {list.map(s=>(
                <span key={s.id} style={{ fontSize:px-3, padding:"1px 5px", background:`${accent}1a`, color:accent, borderRadius:3, border:`1px solid ${accent}33`, fontFamily:mono }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display:"flex", fontFamily:font, fontSize:px, minHeight:200 }}>
      {/* Dark sidebar */}
      <div style={{ width:192, background:DARK, padding:"26px 16px", color:"#e2e8f0", flexShrink:0 }}>
        <span style={{ fontFamily:mono, fontSize:px-4, color:accent, letterSpacing:"1.5px", textTransform:"uppercase", display:"block", marginBottom:7 }}>{"// perfil"}</span>
        {showPhoto && (
          profile.photo_url
            ? <img src={profile.photo_url} alt="" style={{ width:56, height:56, borderRadius:photoR, objectFit:"cover", border:`2px solid ${accent}`, marginBottom:9, display:"block" }}/>
            : <div style={{ width:56, height:56, borderRadius:photoR, background:`${accent}22`, border:`2px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:accent, marginBottom:9 }}>
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </div>
        )}
        <p style={{ fontSize:px+1, fontWeight:700, color:"#f8fafc", lineHeight:1.3, marginBottom:14, fontFamily:font }}>{name}</p>

        <span style={{ fontFamily:mono, fontSize:px-4, color:accent, letterSpacing:"1.5px", textTransform:"uppercase", display:"block", marginBottom:7 }}>{"// contacto"}</span>
        <div style={{ display:"flex", flexDirection:"column", gap:4, fontSize:px-2, color:"#94a3b8", marginBottom:14 }}>
          {profile.city         && <span>📍 {profile.city}</span>}
          {profile.phone        && <span>📱 {profile.phone}</span>}
          {profile.linkedin_url && <span>🔗 LinkedIn</span>}
          {profile.github_url   && <span>💻 GitHub</span>}
          {profile.website_url  && <span>🌐 Portfolio</span>}
        </div>

        {Object.values(skills).flat().length > 0 && (
          <>
            <span style={{ fontFamily:mono, fontSize:px-4, color:accent, letterSpacing:"1.5px", textTransform:"uppercase", display:"block", marginBottom:7 }}>{"// stack"}</span>
            <SidebarSkills/>
          </>
        )}
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:"26px 22px", background:"white" }}>
        <span style={{ fontFamily:mono, fontSize:px-3, color:"#94a3b8", display:"block", marginBottom:3 }}>{"const dev = {"}</span>
        <h1 style={{ fontSize:px+8, fontWeight:800, color:"#0f172a", margin:"0 0 4px", fontFamily:font }}>{name}</h1>
        {profile.bio && <p style={{ fontSize:px-1, color:"#475569", lineHeight:lh, margin:"4px 0 5px", maxWidth:450, fontFamily:font }}>{profile.bio}</p>}
        <span style={{ fontFamily:mono, fontSize:px-3, color:"#94a3b8", display:"block", marginBottom:14 }}>{"}"}</span>
        <div style={{ borderBottom:`2px solid ${accent}`, marginBottom:14 }}/>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {sections.map(section => (
            <div key={section.type}>
              <SecHead icon={section.icon} label={section.label}/>
              {section.records.map(r => <Card key={r.id} r={r}/>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}