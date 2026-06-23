import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:    String(c?.accent_color ?? "#0891b2"),
    font:      c?.font_name ?? (c?.font_family === "serif" ? "Georgia,serif" : c?.font_family === "mono" ? "'Courier New',mono" : "system-ui,sans-serif"),
    px:        Number(c?.font_size   ?? 11),
    lh:        Number(c?.line_height ?? 1.45),
    skillsSt:  (c?.skills_style  ?? "dots") as string,
    showPhoto: c?.show_photo !== false,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase === true,
    photoR:    c?.photo_shape === "square" ? "3px" : c?.photo_shape === "rounded" ? "8px" : "50%",
  };
}

export default function CVPreviewCompact({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, skillsSt, showPhoto, showIcons, upper, photoR } = getCfg(config);
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  const SecHead = ({ icon, label }: { icon:string; label:string }) => (
    <div style={{ background:`${accent}12`, padding:"3px 8px", marginBottom:6, borderLeft:`3px solid ${accent}` }}>
      <h2 style={{ fontSize:px-1, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:accent, margin:0, fontFamily:font }}>
        {showIcons ? `${icon} ` : ""}{label}
      </h2>
    </div>
  );

  return (
    <div style={{ fontFamily:font, fontSize:px, color:"#1e293b", background:"white" }}>

      {/* Compact header */}
      <div style={{ padding:"14px 20px 10px", background:`linear-gradient(to right, ${accent}08, white)`, borderBottom:`2px solid ${accent}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {showPhoto && (
            profile.photo_url
              ? <img src={profile.photo_url} alt="" style={{ width:52, height:52, objectFit:"cover", borderRadius:photoR, border:`2px solid ${accent}`, flexShrink:0 }}/>
              : <div style={{ width:52, height:52, borderRadius:photoR, background:`${accent}22`, border:`2px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:accent, flexShrink:0 }}>
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontSize:px+8, fontWeight:800, margin:"0 0 3px", color:"#0f172a", fontFamily:font, lineHeight:1.1 }}>{name}</h1>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"3px 12px", fontSize:px-1, color:"#64748b" }}>
              {profile.city    && <span>📍 {profile.city}</span>}
              {profile.phone   && <span>📱 {profile.phone}</span>}
              {profile.linkedin_url && <span>🔗 LinkedIn</span>}
              {profile.github_url   && <span>💻 GitHub</span>}
            </div>
          </div>
        </div>
        {profile.bio && (
          <p style={{ fontSize:px-1, color:"#475569", margin:"6px 0 0", lineHeight:lh }}>{profile.bio}</p>
        )}
      </div>

      {/* Two-column body */}
      <div style={{ display:"flex" }}>

        {/* Left 62% */}
        <div style={{ flex:"0 0 62%", padding:"12px 16px" }}>
          {sections.slice(0, Math.ceil(sections.length / 2) + 1).map(section => (
            <div key={section.type} style={{ marginBottom:12 }}>
              <SecHead icon={section.icon} label={section.label}/>
              {section.records.map(r => (
                <div key={r.id} style={{ display:"flex", gap:6, marginBottom:5 }}>
                  <div style={{ width:34, flexShrink:0, textAlign:"right" }}>
                    <span style={{ fontSize:px-2, color:"#94a3b8" }}>
                      {r.end_date ? formatDate(r.end_date,"yy") : formatDate(r.start_date,"yy")}
                    </span>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:px, color:"#0f172a", margin:0, lineHeight:lh, fontFamily:font }}>{r.title}</p>
                    <p style={{ fontSize:px-2, color:"#64748b", margin:0 }}>{r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}</p>
                    {r.description && <p style={{ fontSize:px-2, color:"#94a3b8", margin:"2px 0 0", lineHeight:1.4 }}>{r.description.substring(0,100)}...</p>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right 38% */}
        <div style={{ flex:"0 0 36%", padding:"12px 14px", background:"#f8fafc", borderLeft:`1px solid ${accent}22` }}>

          {/* Remaining sections */}
          {sections.slice(Math.ceil(sections.length / 2) + 1).map(section => (
            <div key={section.type} style={{ marginBottom:12 }}>
              <SecHead icon={section.icon} label={section.label}/>
              {section.records.map(r => (
                <div key={r.id} style={{ marginBottom:4 }}>
                  <p style={{ fontWeight:600, fontSize:px-1, color:"#0f172a", margin:0 }}>{r.title}</p>
                  <p style={{ fontSize:px-2, color:"#64748b", margin:0 }}>{r.institution}</p>
                </div>
              ))}
            </div>
          ))}

          {/* Skills */}
          {allSkills.length > 0 && (
            <div>
              <div style={{ background:`${accent}12`, padding:"3px 8px", marginBottom:6, borderLeft:`3px solid ${accent}` }}>
                <h2 style={{ fontSize:px-1, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:accent, margin:0, fontFamily:font }}>🏷️ Skills</h2>
              </div>
              {skillsSt === "bars" ? (
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {allSkills.slice(0,8).map((s,i) => {
                    const pct=[85,70,90,75,80,65,88,72][i%8];
                    return (
                      <div key={s.id}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:px-2, marginBottom:1 }}>
                          <span style={{ color:"#334155" }}>{s.name}</span>
                        </div>
                        <div style={{ height:2.5, background:"#e2e8f0", borderRadius:2 }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:accent, borderRadius:2 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {allSkills.map(s => (
                    <div key={s.id} style={{ display:"flex", alignItems:"center", gap:5, fontSize:px-1, color:"#475569" }}>
                      <span style={{ width:4, height:4, borderRadius:"50%", background:accent, flexShrink:0, display:"inline-block" }}/>
                      {s.name}
                    </div>
                  ))}
                </div>
              )}

              {/* By category */}
              <div style={{ marginTop:10 }}>
                {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
                  <div key={cat} style={{ marginBottom:6 }}>
                    <p style={{ fontSize:px-3, fontWeight:700, color:accent, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 2px" }}>
                      {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                    </p>
                    <p style={{ fontSize:px-2, color:"#64748b", margin:0, lineHeight:1.5 }}>
                      {list.map(s=>s.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}