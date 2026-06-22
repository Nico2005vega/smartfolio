import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";
import { MapPin, Phone, Globe, Link as LinkIcon, Mail } from "lucide-react";

interface Props { data: CVData; }

function getCfg(c: any) {
  return {
    accent:     String(c?.accent_color  ?? "#059669"),
    font:       c?.font_family === "serif" ? "Georgia,'Times New Roman',serif"
              : c?.font_family === "mono"  ? "'Courier New',Consolas,monospace"
              : "system-ui,-apple-system,sans-serif",
    px:         Number(c?.font_size   ?? 13),
    lh:         Number(c?.line_height ?? 1.55),
    photoR:     c?.photo_shape === "square" ? "3px" : c?.photo_shape === "rounded" ? "12px" : "50%",
    secStyle:   (c?.section_style  ?? "underline") as string,
    skillsSt:   (c?.skills_style   ?? "chips")     as string,
    cardSt:     (c?.card_style     ?? "flat")       as string,
    showPhoto:  c?.show_photo  !== false,
    showIcons:  c?.show_icons  !== false,
    upper:      c?.uppercase   === true,
  };
}

export default function CVPreviewModern({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const { accent, font, px, lh, photoR, secStyle, skillsSt, cardSt, showPhoto, showIcons, upper } = getCfg(config);
  const allSkills = Object.values(skills).flat();
  const name = upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  /* Section header */
  const SecHead = ({ icon, label }: { icon:string; label:string }) => {
    const txt = showIcons ? `${icon} ${label}` : label;
    if (secStyle === "left-bar") return (
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <div style={{ width:3, height:16, background:accent, borderRadius:2, flexShrink:0 }}/>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{label}</h2>
      </div>
    );
    if (secStyle === "filled") return (
      <div style={{ background:`${accent}15`, padding:"4px 10px", borderRadius:6, marginBottom:10 }}>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
    if (secStyle === "minimal") return (
      <div style={{ marginBottom:10 }}>
        <h2 style={{ fontSize:px-3, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:"#9ca3af", margin:0, fontFamily:font }}>{label}</h2>
      </div>
    );
    // default: underline
    return (
      <div style={{ borderBottom:`1.5px solid ${accent}`, paddingBottom:4, marginBottom:10 }}>
        <h2 style={{ fontSize:px-2, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:accent, margin:0, fontFamily:font }}>{txt}</h2>
      </div>
    );
  };

  /* Record card */
  const Card = ({ r }: { r:any }) => {
    const base: React.CSSProperties = { display:"flex", gap:10, marginBottom:6, borderRadius:8, padding:"7px 8px", fontFamily:font };
    const variants: Record<string,React.CSSProperties> = {
      flat:     { ...base },
      shadow:   { ...base, boxShadow:"0 1px 5px rgba(0,0,0,.09)", background:"#fafafa" },
      bordered: { ...base, border:"1px solid #e5e7eb", background:"white" },
      accent:   { ...base, background:`${accent}0d`, borderLeft:`3px solid ${accent}`, paddingLeft:10 },
    };
    return (
      <div style={variants[cardSt] ?? base}>
        <div style={{ width:42, flexShrink:0, textAlign:"right" }}>
          <span style={{ fontSize:px-3, color:"#9ca3af" }}>
            {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
          </span>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:px, fontWeight:600, color:"#111827", margin:0, lineHeight:lh, fontFamily:font }}>{r.title}</p>
          <p style={{ fontSize:px-2, color:"#6b7280", margin:"2px 0 0", lineHeight:1.4 }}>
            {r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}
          </p>
          {r.description && (
            <p style={{ fontSize:px-3, color:"#9ca3af", margin:"3px 0 0", lineHeight:1.5 }}>{r.description}</p>
          )}
        </div>
      </div>
    );
  };

  /* Skills in sidebar */
  const SidebarSkills = () => {
    if (allSkills.length === 0) return null;
    if (skillsSt === "dots") return (
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {allSkills.slice(0,14).map(s => (
          <div key={s.id} style={{ display:"flex", alignItems:"center", gap:6, fontSize:px-2, color:"rgba(255,255,255,.88)" }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:"rgba(255,255,255,.55)", flexShrink:0 }}/>
            {s.name}
          </div>
        ))}
      </div>
    );
    if (skillsSt === "bars") return (
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {allSkills.slice(0,8).map((s,i) => {
          const pct = [90,75,85,70,80,65,88,72][i % 8];
          return (
            <div key={s.id}>
              <div style={{ fontSize:px-3, color:"rgba(255,255,255,.8)", marginBottom:2 }}>{s.name}</div>
              <div style={{ height:3, background:"rgba(255,255,255,.2)", borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:"rgba(255,255,255,.7)", borderRadius:2 }}/>
              </div>
            </div>
          );
        })}
      </div>
    );
    if (skillsSt === "text") return (
      <p style={{ fontSize:px-2, color:"rgba(255,255,255,.85)", lineHeight:1.8 }}>
        {allSkills.map(s => s.name).join("  ·  ")}
      </p>
    );
    // chips (default)
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
        {allSkills.slice(0,12).map(s => (
          <div key={s.id} style={{ fontSize:px-2, color:"#fff", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", borderRadius:4, padding:"3px 8px" }}>
            {s.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ fontFamily:font, color:"#1f2937", fontSize:px, minHeight:"297mm" }}>
      <div style={{ display:"flex", minHeight:180 }}>

        {/* Sidebar */}
        <div style={{ width:215, flexShrink:0, padding:"22px 18px", background:accent, color:"#fff" }}>
          {showPhoto && (
            profile.photo_url
              ? <img src={profile.photo_url} alt="" style={{ width:76, height:76, objectFit:"cover", borderRadius:photoR, border:"2.5px solid rgba(255,255,255,.4)", marginBottom:14, display:"block" }}/>
              : <div style={{ width:76, height:76, borderRadius:photoR, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, fontSize:24, fontWeight:800, color:"white" }}>
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </div>
          )}

          <p style={{ fontSize:px+1, fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:12, fontFamily:font }}>
            {name}
          </p>

          <div style={{ fontSize:px-2, opacity:.9, display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
            {profile.city         && <div style={{ display:"flex", alignItems:"center", gap:5 }}><MapPin size={10}/> {profile.city}{profile.country ? `, ${profile.country}` : ""}</div>}
            {profile.phone        && <div style={{ display:"flex", alignItems:"center", gap:5 }}><Phone size={10}/> {profile.phone}</div>}
            {profile.linkedin_url && <div style={{ display:"flex", alignItems:"center", gap:5 }}><LinkIcon size={10}/> LinkedIn</div>}
            {profile.github_url   && <div style={{ display:"flex", alignItems:"center", gap:5 }}><LinkIcon size={10}/> GitHub</div>}
            {profile.website_url  && <div style={{ display:"flex", alignItems:"center", gap:5 }}><Globe size={10}/> Portafolio</div>}
          </div>

          {allSkills.length > 0 && (
            <div>
              <div style={{ fontSize:px-4, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:"rgba(255,255,255,.55)", marginBottom:8 }}>
                Habilidades
              </div>
              <SidebarSkills/>
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ flex:1, padding:"22px 20px" }}>
          {!showPhoto && (
            <h1 style={{ fontSize:px+8, fontWeight:800, color:accent, margin:"0 0 6px", lineHeight:1.15, fontFamily:font }}>{name}</h1>
          )}
          {profile.bio && (
            <p style={{ fontSize:px-1, color:"#4b5563", lineHeight:lh, maxWidth:420, margin:"0 0 12px", fontFamily:font }}>{profile.bio}</p>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:px-2, color:"#9ca3af", marginBottom:18 }}>
            <Mail size={10}/> contacto@smartfolio.co
          </div>
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
    </div>
  );
}