import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    font: c?.font_name ?? (c?.font_family === "serif" ? "Georgia,serif" : "'Arial',system-ui,sans-serif"),
    px:   Number(c?.font_size   ?? 12),
    lh:   Number(c?.line_height ?? 1.5),
    upper: c?.uppercase === true,
  };
}

export default function CVPreviewATS({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { font, px, lh, upper } = getCfg(config);
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  return (
    <div style={{ fontFamily:font, fontSize:px, color:"#000", background:"white", padding:"28px 36px", lineHeight:lh }}>

      {/* Plain header - no images, no colors */}
      <div style={{ borderBottom:"2px solid #000", paddingBottom:8, marginBottom:10 }}>
        <h1 style={{ fontSize:px+8, fontWeight:700, margin:"0 0 3px", fontFamily:font }}>{name}</h1>
        <div style={{ display:"flex", flexWrap:"wrap", gap:12, fontSize:px-1, color:"#333" }}>
          {profile.city         && <span>{profile.city}{profile.country ? `, ${profile.country}` : ""}</span>}
          {profile.phone        && <span>| {profile.phone}</span>}
          {profile.linkedin_url && <span>| linkedin.com/in/...</span>}
          {profile.github_url   && <span>| github.com/...</span>}
          {profile.website_url  && <span>| Portfolio</span>}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div style={{ marginBottom:10 }}>
          <h2 style={{ fontSize:px, fontWeight:700, textTransform:"uppercase", margin:"0 0 4px", borderBottom:"1px solid #666", paddingBottom:2, fontFamily:font }}>
            PERFIL PROFESIONAL
          </h2>
          <p style={{ margin:0, fontSize:px, lineHeight:lh }}>{profile.bio}</p>
        </div>
      )}

      {/* Sections - completely plain */}
      {sections.map(section => (
        <div key={section.type} style={{ marginBottom:10 }}>
          <h2 style={{ fontSize:px, fontWeight:700, textTransform:"uppercase", margin:"0 0 4px", borderBottom:"1px solid #444", paddingBottom:2, fontFamily:font }}>
            {section.label.toUpperCase()}
          </h2>
          {section.records.map(r => (
            <div key={r.id} style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <strong style={{ fontSize:px, fontFamily:font }}>{r.title}</strong>
                <span style={{ fontSize:px-1, color:"#333" }}>
                  {r.start_date ? formatDate(r.start_date,"MM/yyyy") : ""}
                  {r.end_date ? ` - ${formatDate(r.end_date,"MM/yyyy")}` : ""}
                </span>
              </div>
              <p style={{ margin:"1px 0 0", fontSize:px-1, color:"#333", fontStyle:"italic" }}>
                {r.institution}{r.duration_hours ? ` | ${r.duration_hours} horas` : ""}
              </p>
              {r.description && (
                <ul style={{ margin:"3px 0 0 16px", padding:0, fontSize:px-1, lineHeight:lh }}>
                  {r.description.split(". ").filter(Boolean).map((sentence, i) => (
                    <li key={i} style={{ marginBottom:1 }}>{sentence.trim()}{sentence.endsWith(".") ? "" : "."}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Skills - plain text, ATS parseable */}
      {allSkills.length > 0 && (
        <div style={{ marginBottom:10 }}>
          <h2 style={{ fontSize:px, fontWeight:700, textTransform:"uppercase", margin:"0 0 4px", borderBottom:"1px solid #444", paddingBottom:2, fontFamily:font }}>
            HABILIDADES Y COMPETENCIAS
          </h2>
          <p style={{ margin:0, fontSize:px, lineHeight:1.8 }}>
            {allSkills.map(s => s.name).join(" | ")}
          </p>
        </div>
      )}
    </div>
  );
}