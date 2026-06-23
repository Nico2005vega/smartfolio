import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:    String(c?.accent_color ?? "#4f46e5"),
    font:      c?.font_name ?? (c?.font_family === "sans" ? "system-ui,sans-serif" : c?.font_family === "mono" ? "'Courier New',mono" : "Georgia,'Times New Roman',serif"),
    px:        Number(c?.font_size   ?? 12),
    lh:        Number(c?.line_height ?? 1.6),
    upper:     c?.uppercase === true,
    showIcons: c?.show_icons !== false,
  };
}

export default function CVPreviewAcademic({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, upper, showIcons } = getCfg(config);
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  return (
    <div style={{ fontFamily:font, fontSize:px, color:"#1e293b", background:"white", padding:"28px 36px" }}>

      {/* Academic header - centered, formal */}
      <div style={{ textAlign:"center", borderBottom:`1px solid #cbd5e1`, paddingBottom:12, marginBottom:14 }}>
        <h1 style={{ fontSize:px+10, fontWeight:700, margin:"0 0 2px", letterSpacing:"0.5px", fontFamily:font, color:"#0f172a" }}>
          {name}
        </h1>
        {/* Institution/department if available */}
        <p style={{ fontSize:px, color:accent, margin:"2px 0", fontStyle:"italic" }}>
          Tecnología en Desarrollo de Sistemas Informáticos
        </p>
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:10, fontSize:px-1, color:"#64748b", marginTop:4 }}>
          {profile.city    && <span>{profile.city}{profile.country ? `, ${profile.country}` : ""}</span>}
          {profile.phone   && <span>|  {profile.phone}</span>}
          {profile.linkedin_url && <span>|  LinkedIn</span>}
          {profile.github_url   && <span>|  GitHub</span>}
          {profile.website_url  && <span>|  Portafolio</span>}
        </div>
      </div>

      {/* Research Profile / Bio */}
      {profile.bio && (
        <div style={{ marginBottom:14 }}>
          <h2 style={{ fontSize:px, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:accent, margin:"0 0 5px", paddingBottom:3, borderBottom:`1.5px solid ${accent}` }}>
            {showIcons ? "📝 " : ""}Perfil Académico
          </h2>
          <p style={{ fontSize:px, lineHeight:lh, margin:0, textAlign:"justify", color:"#374151" }}>{profile.bio}</p>
        </div>
      )}

      {/* Academic sections */}
      {sections.map((section, sIdx) => (
        <div key={section.type} style={{ marginBottom:14 }}>
          <h2 style={{ fontSize:px, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:accent, margin:"0 0 5px", paddingBottom:3, borderBottom:`1.5px solid ${accent}` }}>
            {showIcons ? `${section.icon} ` : ""}{section.label}
          </h2>
          {section.records.map((r, idx) => (
            <div key={r.id} style={{ display:"flex", gap:12, marginBottom:8, paddingLeft:8 }}>
              {/* Academic numbering / bullet */}
              <div style={{ width:20, flexShrink:0, textAlign:"right", paddingTop:1 }}>
                <span style={{ fontSize:px-2, color:`${accent}99`, fontWeight:600 }}>{idx+1}.</span>
              </div>
              <div style={{ flex:1, borderLeft:`1px solid ${accent}22`, paddingLeft:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ fontWeight:700, fontSize:px, color:"#0f172a", margin:0, fontFamily:font, lineHeight:lh }}>{r.title}</p>
                    <p style={{ fontSize:px-1, color:accent, margin:"1px 0 0", fontStyle:"italic" }}>
                      {r.institution}
                      {r.duration_hours ? ` · ${r.duration_hours} horas académicas` : ""}
                    </p>
                  </div>
                  <span style={{ fontSize:px-2, color:"#94a3b8", flexShrink:0, marginLeft:8, fontStyle:"italic" }}>
                    {r.end_date
                      ? formatDate(r.end_date,"MMM yyyy")
                      : formatDate(r.start_date,"MMM yyyy")}
                  </span>
                </div>
                {r.description && (
                  <p style={{ fontSize:px-1, color:"#4b5563", margin:"4px 0 0", lineHeight:lh, textAlign:"justify" }}>{r.description}</p>
                )}
                {r.credential_id && (
                  <p style={{ fontSize:px-2, color:"#94a3b8", margin:"2px 0 0" }}>ID: {r.credential_id}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Competences - academic style */}
      {allSkills.length > 0 && (
        <div>
          <h2 style={{ fontSize:px, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:accent, margin:"0 0 5px", paddingBottom:3, borderBottom:`1.5px solid ${accent}` }}>
            {showIcons ? "🏷️ " : ""}Competencias y Habilidades
          </h2>
          <p style={{ fontSize:px, lineHeight:1.9, margin:0, color:"#374151" }}>
            {allSkills.map(s => s.name).join("  ·  ")}
          </p>
        </div>
      )}
    </div>
  );
}