import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:    String(c?.accent_color ?? "#7c3aed"),
    font:      c?.font_family === "serif" ? "Georgia,'Times New Roman',serif"
             : c?.font_family === "mono"  ? "'Courier New',Consolas,monospace"
             : "system-ui,-apple-system,sans-serif",
    px:        Number(c?.font_size   ?? 13),
    lh:        Number(c?.line_height ?? 1.55),
    photoR:    c?.photo_shape === "square" ? "4px" : c?.photo_shape === "rounded" ? "12px" : "50%",
    secStyle:  (c?.section_style ?? "left-bar") as string,
    skillsSt:  (c?.skills_style  ?? "chips")    as string,
    cardSt:    (c?.card_style    ?? "accent")    as string,
    showPhoto: c?.show_photo !== false,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase === true,
  };
}

export default function CVPreviewCreative({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, photoR, secStyle, skillsSt, cardSt, showPhoto, showIcons, upper } = getCfg(config);
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  const SecHead = ({ icon, label }: { icon:string; label:string }) => {
    const txt = showIcons ? `${icon} ${label}` : label;
    if (secStyle === "underline") return (
      <div style={{ borderBottom:`1.5px solid ${accent}`, paddingBottom:4, marginBottom:10 }}>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
    if (secStyle === "filled") return (
      <div style={{ background:`${accent}14`, padding:"4px 10px", borderRadius:6, marginBottom:10 }}>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
    if (secStyle === "minimal") return (
      <div style={{ marginBottom:10 }}>
        <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:"#9ca3af", margin:0, fontFamily:font }}>{label}</h2>
      </div>
    );
    // left-bar (default)
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <div style={{ width:3, height:16, background:accent, borderRadius:2, flexShrink:0 }}/>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{label}</h2>
      </div>
    );
  };

  const Card = ({ r }: { r:any }) => {
    const base: React.CSSProperties = { padding:"9px 11px", marginBottom:6, borderRadius:8, fontFamily:font };
    const variants: Record<string,React.CSSProperties> = {
      flat:     { ...base, background:"#f9fafb" },
      shadow:   { ...base, background:"white", boxShadow:"0 1px 5px rgba(0,0,0,.09)" },
      bordered: { ...base, border:"1px solid #e5e7eb", background:"white" },
      accent:   { ...base, background:`${accent}0d`, borderLeft:`3px solid ${accent}` },
    };
    return (
      <div style={variants[cardSt] ?? variants.flat}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
          <p style={{ fontWeight:700, fontSize:px, color:"#111827", margin:0, lineHeight:lh, flex:1, fontFamily:font }}>{r.title}</p>
          <span style={{ fontSize:px-3, color:"white", background:accent, borderRadius:20, padding:"1px 7px", flexShrink:0, whiteSpace:"nowrap", alignSelf:"flex-start" }}>
            {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
          </span>
        </div>
        <p style={{ fontSize:px-2, color:"#6b7280", margin:"3px 0 0" }}>
          {r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}
        </p>
        {r.description && <p style={{ fontSize:px-3, color:"#9ca3af", margin:"4px 0 0", lineHeight:1.5 }}>{r.description}</p>}
      </div>
    );
  };

  const SidebarSkills = () => {
    if (skillsSt === "dots") return (
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {Object.values(skills).flat().slice(0,14).map(s => (
          <div key={s.id} style={{ display:"flex", alignItems:"center", gap:6, fontSize:px-2, color:"#475569" }}>
            <span style={{ width:4, height:4, borderRadius:"50%", background:accent, flexShrink:0, display:"inline-block" }}/>
            {s.name}
          </div>
        ))}
      </div>
    );
    if (skillsSt === "bars") return (
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {Object.values(skills).flat().slice(0,8).map((s,i) => {
          const pct=[90,75,85,70,80,65,88,72][i%8];
          return (
            <div key={s.id}>
              <div style={{ fontSize:px-3, color:"#475569", marginBottom:2 }}>{s.name}</div>
              <div style={{ height:3, background:"#e2e8f0", borderRadius:2 }}>
                <div style={{ height:"100%", width:`${pct}%`, background:accent, borderRadius:2 }}/>
              </div>
            </div>
          );
        })}
      </div>
    );
    if (skillsSt === "text") return (
      <p style={{ fontSize:px-2, color:"#475569", lineHeight:1.8 }}>
        {Object.values(skills).flat().map(s=>s.name).join("  ·  ")}
      </p>
    );
    // chips (default)
    return (
      <div>
        {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
          <div key={cat} style={{ marginBottom:12 }}>
            <p style={{ fontSize:px-4, fontWeight:700, color:accent, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 5px", fontFamily:font }}>
              {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
              {list.map(s => (
                <span key={s.id} style={{ fontSize:px-3, padding:"2px 6px", background:`${accent}16`, color:accent, borderRadius:4, border:`1px solid ${accent}33` }}>
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
    <div style={{ fontFamily:font, color:"#1f2937", fontSize:px }}>
      {/* Header */}
      <div style={{ background:accent, padding:"26px 28px", color:"white", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:18, position:"relative" }}>
          {showPhoto && (
            profile.photo_url
              ? <img src={profile.photo_url} alt="" style={{ width:68, height:68, objectFit:"cover", borderRadius:photoR, border:"2px solid rgba(255,255,255,.4)", flexShrink:0 }}/>
              : <div style={{ width:68, height:68, borderRadius:photoR, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"white", flexShrink:0 }}>
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontSize:px+9, fontWeight:800, margin:"0 0 5px", lineHeight:1.15, color:"white", fontFamily:font }}>{name}</h1>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, fontSize:px-3, opacity:.9 }}>
              {profile.city         && <span>📍 {profile.city}</span>}
              {profile.phone        && <span>📱 {profile.phone}</span>}
              {profile.linkedin_url && <span>🔗 LinkedIn</span>}
              {profile.github_url   && <span>💻 GitHub</span>}
            </div>
            {profile.bio && <p style={{ margin:"7px 0 0", fontSize:px-2, opacity:.9, lineHeight:lh, maxWidth:400, fontFamily:font }}>{profile.bio}</p>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display:"flex" }}>
        {/* Main */}
        <div style={{ flex:1, padding:"22px 24px" }}>
          {sections.map(section => (
            <div key={section.type} style={{ marginBottom:18 }}>
              <SecHead icon={section.icon} label={section.label}/>
              {section.records.map(r => <Card key={r.id} r={r}/>)}
            </div>
          ))}
        </div>
        {/* Sidebar */}
        {Object.values(skills).flat().length > 0 && (
          <div style={{ width:176, flexShrink:0, background:"#f8fafc", borderLeft:"1px solid #e2e8f0", padding:"22px 15px" }}>
            <div style={{ fontSize:px-4, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:"#94a3b8", marginBottom:12 }}>Habilidades</div>
            <SidebarSkills/>
          </div>
        )}
      </div>
    </div>
  );
}