import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:    String(c?.accent_color ?? "#18181b"),
    font:      c?.font_family === "sans" ? "system-ui,-apple-system,sans-serif"
             : c?.font_family === "mono" ? "'Courier New',Consolas,monospace"
             : "Georgia,'Times New Roman',serif",   // serif default for minimal
    px:        Number(c?.font_size   ?? 13),
    lh:        Number(c?.line_height ?? 1.65),
    secStyle:  (c?.section_style ?? "minimal") as string,
    skillsSt:  (c?.skills_style  ?? "text")    as string,
    cardSt:    (c?.card_style    ?? "flat")     as string,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase === true,
  };
}

export default function CVPreviewMinimal({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, secStyle, skillsSt, cardSt, showIcons, upper } = getCfg(config);
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  const SecHead = ({ icon, label }: { icon:string; label:string }) => {
    const txt = showIcons ? `${icon} ${label}` : label;
    if (secStyle === "left-bar") return (
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <div style={{ width:3, height:14, background:accent, borderRadius:2, flexShrink:0 }}/>
        <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:accent, margin:0, fontFamily:font }}>{label}</h2>
      </div>
    );
    if (secStyle === "underline") return (
      <div style={{ borderBottom:`1px solid ${accent}`, paddingBottom:4, marginBottom:10 }}>
        <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
    if (secStyle === "filled") return (
      <div style={{ background:`${accent}10`, padding:"3px 10px", borderRadius:4, marginBottom:10 }}>
        <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
    // minimal (default)
    return (
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
        <span style={{ fontSize:px-4, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:accent, flexShrink:0, fontFamily:font }}>{label}</span>
        <div style={{ flex:1, height:1, background:"#e4e4e7" }}/>
      </div>
    );
  };

  const Card = ({ r }: { r:any }) => {
    const base: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 60px", gap:16, marginBottom:9, fontFamily:font };
    const variants: Record<string,React.CSSProperties> = {
      flat:     { ...base },
      shadow:   { ...base, background:"#fafafa", padding:"8px 10px", boxShadow:"0 1px 4px rgba(0,0,0,.07)", borderRadius:6, gridTemplateColumns:"1fr 60px" },
      bordered: { ...base, border:"1px solid #e5e7eb", padding:"8px 10px", borderRadius:6 },
      accent:   { ...base, borderLeft:`2px solid ${accent}`, paddingLeft:10, paddingTop:2, paddingBottom:2 },
    };
    return (
      <div style={variants[cardSt] ?? base}>
        <div>
          <p style={{ fontSize:px, fontWeight:600, color:"#09090b", margin:0, lineHeight:lh, fontFamily:font }}>{r.title}</p>
          <p style={{ fontSize:px-2, color:"#71717a", margin:"2px 0 0" }}>{r.institution}{r.duration_hours ? ` — ${r.duration_hours}h` : ""}</p>
          {r.description && <p style={{ fontSize:px-3, color:"#a1a1aa", margin:"3px 0 0", lineHeight:1.5 }}>{r.description}</p>}
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ fontSize:px-3, color:"#a1a1aa", margin:0, whiteSpace:"nowrap" }}>
            {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
          </p>
        </div>
      </div>
    );
  };

  const SkillsBlock = () => {
    if (skillsSt === "chips") return (
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {allSkills.map(s=><span key={s.id} style={{ fontSize:px-2, padding:"2px 8px", borderRadius:20, border:`1px solid ${accent}44`, color:accent, background:`${accent}0a` }}>{s.name}</span>)}
      </div>
    );
    if (skillsSt === "dots") return (
      <div style={{ display:"flex", flexWrap:"wrap", gap:"3px 20px" }}>
        {allSkills.map(s=>(
          <div key={s.id} style={{ display:"flex", alignItems:"center", gap:6, fontSize:px-2, color:"#71717a" }}>
            <span style={{ width:3, height:3, borderRadius:"50%", background:accent, display:"inline-block", flexShrink:0 }}/>
            {s.name}
          </div>
        ))}
      </div>
    );
    if (skillsSt === "bars") return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px 20px" }}>
        {allSkills.slice(0,10).map((s,i)=>{
          const pct=[85,70,90,75,80,65,88,72,78,68][i%10];
          return (
            <div key={s.id}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:px-3, marginBottom:2 }}>
                <span style={{ color:"#52525b" }}>{s.name}</span><span style={{ color:"#a1a1aa" }}>{pct}%</span>
              </div>
              <div style={{ height:2, background:"#e4e4e7", borderRadius:1 }}>
                <div style={{ height:"100%", width:`${pct}%`, background:accent, borderRadius:1 }}/>
              </div>
            </div>
          );
        })}
      </div>
    );
    // text (default)
    return <p style={{ fontSize:px-1, color:"#71717a", lineHeight:1.9, margin:0 }}>{allSkills.map(s=>s.name).join("  ·  ")}</p>;
  };

  const pad = 36;
  return (
    <div style={{ fontFamily:font, color:"#18181b", padding:pad, background:"white", fontSize:px }}>
      <h1 style={{ fontSize:px+14, fontWeight:700, letterSpacing:"-0.4px", margin:"0 0 10px", color:"#09090b", lineHeight:1.15, fontFamily:font }}>{name}</h1>
      <div style={{ height:1, background:"#e4e4e7", marginBottom:12 }}/>
      <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:px-2, color:"#71717a", marginBottom:14 }}>
        {profile.city         && <span>{profile.city}{profile.country ? `, ${profile.country}` : ""}</span>}
        {profile.phone        && <span>{profile.phone}</span>}
        {profile.linkedin_url && <span>LinkedIn</span>}
        {profile.github_url   && <span>GitHub</span>}
        {profile.website_url  && <span>Portafolio</span>}
      </div>
      {profile.bio && <p style={{ margin:"0 0 20px", fontSize:px-1, color:"#52525b", lineHeight:lh, maxWidth:500, fontFamily:font }}>{profile.bio}</p>}

      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
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