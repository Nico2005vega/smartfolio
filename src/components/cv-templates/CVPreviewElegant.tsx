import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:    String(c?.accent_color ?? "#b7882c"),
    font:      c?.font_name ?? (c?.font_family === "sans" ? "system-ui,sans-serif" : c?.font_family === "mono" ? "'Courier New',mono" : "Georgia,'Palatino Linotype',serif"),
    px:        Number(c?.font_size   ?? 13),
    lh:        Number(c?.line_height ?? 1.7),
    skillsSt:  (c?.skills_style ?? "text") as string,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase === true,
  };
}

export default function CVPreviewElegant({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, skillsSt, upper } = getCfg(config);
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  const GoldLine = () => (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"10px 0" }}>
      <div style={{ flex:1, height:".7px", background:`linear-gradient(to right, transparent, ${accent})` }}/>
      <div style={{ width:6, height:6, background:accent, transform:"rotate(45deg)", flexShrink:0 }}/>
      <div style={{ flex:1, height:".7px", background:`linear-gradient(to left, transparent, ${accent})` }}/>
    </div>
  );

  const SecHead = ({ icon, label }: { icon:string; label:string }) => (
    <div style={{ textAlign:"center", margin:"16px 0 10px" }}>
      <GoldLine/>
      <h2 style={{ fontSize:px-1, fontWeight:600, textTransform:"uppercase", letterSpacing:"3px", color:accent, margin:0, fontFamily:font }}>
        {label}
      </h2>
      <GoldLine/>
    </div>
  );

  return (
    <div style={{ fontFamily:font, fontSize:px, color:"#2d2d2d", background:"white", padding:"36px 44px" }}>

      {/* Centered elegant header */}
      <div style={{ textAlign:"center", marginBottom:4 }}>
        <h1 style={{ fontSize:px+16, fontWeight:700, letterSpacing:upper?"3px":"1px", color:"#1a1a1a", margin:"0 0 6px", fontFamily:font, lineHeight:1.1 }}>
          {name}
        </h1>
        {/* Gold ornamental line */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, margin:"8px 0" }}>
          <div style={{ width:40, height:1, background:accent }}/>
          <div style={{ width:8, height:8, borderRadius:"50%", background:accent }}/>
          <div style={{ width:4, height:4, borderRadius:"50%", border:`1.5px solid ${accent}` }}/>
          <div style={{ width:8, height:8, borderRadius:"50%", background:accent }}/>
          <div style={{ width:40, height:1, background:accent }}/>
        </div>
        {/* Contact row */}
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:16, fontSize:px-2, color:"#71717a" }}>
          {profile.city    && <span>{profile.city}{profile.country ? `, ${profile.country}` : ""}</span>}
          {profile.phone   && <span>✦ {profile.phone}</span>}
          {profile.linkedin_url && <span>✦ LinkedIn</span>}
          {profile.github_url   && <span>✦ GitHub</span>}
        </div>
        {profile.bio && (
          <p style={{ fontSize:px-1, color:"#52525b", lineHeight:lh, maxWidth:460, margin:"12px auto 0", fontStyle:"italic" }}>
            &ldquo;{profile.bio}&rdquo;
          </p>
        )}
      </div>

      {/* Sections */}
      {sections.map(section => (
        <div key={section.type}>
          <SecHead icon={section.icon} label={section.label}/>
          {section.records.map(r => (
            <div key={r.id} style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:12, marginBottom:10, paddingBottom:10, borderBottom:`0.5px solid ${accent}22` }}>
              <div>
                <p style={{ fontWeight:700, fontSize:px, color:"#1a1a1a", margin:0, fontFamily:font }}>{r.title}</p>
                <p style={{ fontSize:px-1, color:accent, margin:"2px 0 0", fontStyle:"italic" }}>{r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}</p>
                {r.description && <p style={{ fontSize:px-2, color:"#71717a", margin:"4px 0 0", lineHeight:1.6 }}>{r.description}</p>}
              </div>
              <p style={{ fontSize:px-2, color:"#a1a1aa", textAlign:"right", fontStyle:"italic", margin:0 }}>
                {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
              </p>
            </div>
          ))}
        </div>
      ))}

      {/* Skills */}
      {allSkills.length > 0 && (
        <>
          <SecHead icon="🏷️" label="Competencias"/>
          {skillsSt === "bars" ? (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 20px" }}>
              {allSkills.slice(0,10).map((s,i) => {
                const pct=[85,70,90,75,80,65,88,72,78,68][i%10];
                return (
                  <div key={s.id}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:px-2, marginBottom:2 }}>
                      <span>{s.name}</span><span style={{ color:"#a1a1aa" }}>{pct}%</span>
                    </div>
                    <div style={{ height:2, background:"#f4f4f5", borderRadius:1 }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:accent, borderRadius:1 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign:"center", fontSize:px-1, color:"#71717a", lineHeight:2, fontStyle:"italic" }}>
              {allSkills.map(s=>s.name).join("  ✦  ")}
            </p>
          )}
        </>
      )}
    </div>
  );
}