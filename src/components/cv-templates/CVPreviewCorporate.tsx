import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:     String(c?.accent_color  ?? "#1e3a5f"),
    font:       c?.font_name            ?? (c?.font_family === "serif" ? "Georgia,serif" : c?.font_family === "mono" ? "'Courier New',mono" : "system-ui,sans-serif"),
    px:         Number(c?.font_size     ?? 12),
    lh:         Number(c?.line_height   ?? 1.5),
    secStyle:   (c?.section_style       ?? "underline") as string,
    skillsSt:   (c?.skills_style        ?? "chips")     as string,
    showIcons:  c?.show_icons           !== false,
    upper:      c?.uppercase            === true,
    divStyle:   (c?.divider_style       ?? "solid")     as string,
  };
}

export default function CVPreviewCorporate({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, skillsSt, showIcons, upper } = getCfg(config);
  const navy   = accent;
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  const SecLabel = ({ icon, label }: { icon: string; label: string }) => (
    <div style={{ borderBottom:`2px solid ${navy}`, paddingBottom:3, marginBottom:8 }}>
      <h2 style={{ fontSize:px-1, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:navy, margin:0, fontFamily:font }}>
        {showIcons ? `${icon} ` : ""}{label}
      </h2>
    </div>
  );

  return (
    <div style={{ fontFamily:font, fontSize:px, color:"#1f2937", background:"white" }}>

      {/* Navy header */}
      <div style={{ background:navy, padding:"20px 28px", color:"white" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <h1 style={{ fontSize:px+12, fontWeight:800, margin:"0 0 4px", letterSpacing:upper?"2px":"0", fontFamily:font, color:"white" }}>
              {name}
            </h1>
            {profile.bio && (
              <p style={{ fontSize:px-2, color:"rgba(255,255,255,.75)", maxWidth:400, lineHeight:lh, margin:0 }}>
                {profile.bio.substring(0, 120)}{profile.bio.length > 120 ? "..." : ""}
              </p>
            )}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, fontSize:px-2, color:"rgba(255,255,255,.8)", textAlign:"right", flexShrink:0, marginLeft:20 }}>
            {profile.city    && <span>📍 {profile.city}</span>}
            {profile.phone   && <span>📱 {profile.phone}</span>}
            {profile.linkedin_url && <span>🔗 LinkedIn</span>}
            {profile.github_url   && <span>💻 GitHub</span>}
          </div>
        </div>
      </div>

      {/* Gold accent bar */}
      <div style={{ height:4, background:`linear-gradient(to right, ${navy}, ${navy}88, transparent)` }}/>

      {/* Two-column body */}
      <div style={{ display:"flex", padding:"20px 28px", gap:24 }}>

        {/* Left column (60%) */}
        <div style={{ flex:"0 0 62%" }}>
          {sections.map(section => (
            <div key={section.type} style={{ marginBottom:16 }}>
              <SecLabel icon={section.icon} label={section.label}/>
              {section.records.map(r => (
                <div key={r.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, padding:"6px 0", borderBottom:"0.5px solid #f3f4f6" }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:px, color:"#0f172a", margin:0, lineHeight:lh, fontFamily:font }}>{r.title}</p>
                    <p style={{ fontSize:px-2, color:navy, margin:"1px 0 0", fontWeight:600 }}>{r.institution}</p>
                    {r.duration_hours && <span style={{ fontSize:px-3, color:"#9ca3af" }}>{r.duration_hours}h</span>}
                    {r.description && <p style={{ fontSize:px-3, color:"#6b7280", margin:"3px 0 0", lineHeight:1.5 }}>{r.description}</p>}
                  </div>
                  <p style={{ fontSize:px-2, color:"#9ca3af", flexShrink:0, marginLeft:10, whiteSpace:"nowrap" }}>
                    {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right column (38%) */}
        <div style={{ flex:"0 0 34%", borderLeft:`2px solid ${navy}18`, paddingLeft:20 }}>

          {/* Skills */}
          {allSkills.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ borderBottom:`2px solid ${navy}`, paddingBottom:3, marginBottom:8 }}>
                <h2 style={{ fontSize:px-1, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:navy, margin:0 }}>
                  🏷️ Competencias
                </h2>
              </div>
              {skillsSt === "bars" ? (
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {allSkills.slice(0,8).map((s,i) => {
                    const pct = [85,70,90,75,80,65,88,72][i%8];
                    return (
                      <div key={s.id}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:px-2, marginBottom:2 }}>
                          <span style={{ color:"#374151" }}>{s.name}</span>
                          <span style={{ color:"#9ca3af" }}>{pct}%</span>
                        </div>
                        <div style={{ height:3, background:"#e5e7eb", borderRadius:2 }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:navy, borderRadius:2 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : skillsSt === "dots" ? (
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {allSkills.map(s => (
                    <div key={s.id} style={{ display:"flex", alignItems:"center", gap:6, fontSize:px-2, color:"#374151" }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:navy, flexShrink:0, display:"inline-block" }}/>
                      {s.name}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {allSkills.map(s => (
                    <span key={s.id} style={{ fontSize:px-2, padding:"2px 7px", borderRadius:4, background:`${navy}15`, color:navy, border:`1px solid ${navy}33`, fontWeight:500 }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* By category */}
          {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
            <div key={cat} style={{ marginBottom:10 }}>
              <p style={{ fontSize:px-3, fontWeight:700, color:navy, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 4px" }}>
                {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
              </p>
              <p style={{ fontSize:px-2, color:"#6b7280", margin:0, lineHeight:1.6 }}>
                {list.map(s=>s.name).join("  ·  ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}