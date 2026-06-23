import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:    String(c?.accent_color ?? "#e11d48"),
    font:      c?.font_name ?? (c?.font_family === "serif" ? "Georgia,serif" : c?.font_family === "mono" ? "'Courier New',mono" : "system-ui,sans-serif"),
    px:        Number(c?.font_size   ?? 13),
    lh:        Number(c?.line_height ?? 1.55),
    photoR:    c?.photo_shape === "square" ? "4px" : c?.photo_shape === "rounded" ? "12px" : "50%",
    skillsSt:  (c?.skills_style ?? "chips") as string,
    showPhoto: c?.show_photo !== false,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase === true,
  };
}

export default function CVPreviewBold({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, photoR, skillsSt, showPhoto, showIcons, upper } = getCfg(config);
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;
  const darkBg = "#0f0f0f";

  const SecHead = ({ icon, label }: { icon:string; label:string }) => (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
      <div style={{ width:4, height:20, background:accent, borderRadius:2, flexShrink:0 }}/>
      <h2 style={{ fontSize:px-1, fontWeight:800, textTransform:"uppercase", letterSpacing:"2px", color:darkBg, margin:0, fontFamily:font }}>
        {showIcons ? `${icon} ` : ""}{label}
      </h2>
      <div style={{ flex:1, height:1, background:`${darkBg}18` }}/>
    </div>
  );

  return (
    <div style={{ fontFamily:font, fontSize:px, color:darkBg }}>

      {/* Bold header with geometric accent */}
      <div style={{ position:"relative", overflow:"hidden", minHeight:100 }}>
        {/* Background */}
        <div style={{ position:"absolute", inset:0, background:darkBg }}/>
        {/* Diagonal color accent */}
        <div style={{ position:"absolute", right:0, top:0, width:"55%", height:"200%",
          background:accent,
          clipPath:"polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}/>
        {/* Smaller accent triangle */}
        <div style={{ position:"absolute", right:"40%", top:0, width:"15%", height:"200%",
          background:`${accent}60`,
          clipPath:"polygon(20% 0, 100% 0, 80% 100%, 0% 100%)" }}/>

        {/* Content */}
        <div style={{ position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 28px" }}>
          <div style={{ zIndex:1, flex:1, marginRight:16 }}>
            <h1 style={{ fontSize:px+14, fontWeight:900, color:"white", margin:"0 0 6px", lineHeight:1.1, fontFamily:font, letterSpacing:upper?"2px":"-0.5px" }}>
              {name}
            </h1>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, fontSize:px-2, color:"rgba(255,255,255,.7)" }}>
              {profile.city    && <span>📍 {profile.city}</span>}
              {profile.phone   && <span>📱 {profile.phone}</span>}
              {profile.linkedin_url && <span>🔗 LinkedIn</span>}
            </div>
          </div>
          {/* Photo */}
          {showPhoto && (
            <div style={{ zIndex:2, flexShrink:0 }}>
              {profile.photo_url ? (
                <img src={profile.photo_url} alt="" style={{ width:72, height:72, objectFit:"cover", borderRadius:photoR, border:"3px solid white" }}/>
              ) : (
                <div style={{ width:72, height:72, borderRadius:photoR, background:"rgba(255,255,255,.15)", border:"3px solid rgba(255,255,255,.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"white" }}>
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Accent strip */}
      <div style={{ height:5, background:`linear-gradient(to right, ${darkBg} 30%, ${accent})` }}/>

      {/* Bio bar */}
      {profile.bio && (
        <div style={{ padding:"10px 28px", background:"#f9fafb", borderBottom:"1px solid #e5e7eb" }}>
          <p style={{ fontSize:px-1, color:"#475569", lineHeight:lh, margin:0, fontStyle:"italic" }}>{profile.bio}</p>
        </div>
      )}

      {/* Content */}
      <div style={{ padding:"20px 28px" }}>
        {sections.map(section => (
          <div key={section.type} style={{ marginBottom:18 }}>
            <SecHead icon={section.icon} label={section.label}/>
            {section.records.map(r => (
              <div key={r.id} style={{ display:"flex", gap:12, marginBottom:8, padding:"8px 10px", background:"#f9fafb", borderRadius:8, borderLeft:`3px solid ${accent}` }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:700, fontSize:px, color:darkBg, margin:0, fontFamily:font }}>{r.title}</p>
                  <p style={{ fontSize:px-2, color:accent, margin:"2px 0 0", fontWeight:600 }}>{r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}</p>
                  {r.description && <p style={{ fontSize:px-3, color:"#64748b", margin:"3px 0 0", lineHeight:1.5 }}>{r.description}</p>}
                </div>
                <span style={{ fontSize:px-2, fontWeight:700, color:"white", background:accent, borderRadius:20, padding:"1px 8px", flexShrink:0, alignSelf:"flex-start" }}>
                  {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
                </span>
              </div>
            ))}
          </div>
        ))}

        {/* Skills */}
        {allSkills.length > 0 && (
          <div>
            <SecHead icon="🏷️" label="Habilidades"/>
            {skillsSt === "chips" ? (
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {allSkills.map(s => (
                  <span key={s.id} style={{ fontSize:px-2, padding:"3px 10px", borderRadius:20, background:`${accent}15`, color:accent, border:`1.5px solid ${accent}44`, fontWeight:600 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize:px-1, color:"#475569", lineHeight:2 }}>{allSkills.map(s=>s.name).join("  ·  ")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}