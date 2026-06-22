import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

export default function CVPreviewTech({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent     = config?.accent_color ?? "#06b6d4";
  const cfgAny     = config as any;
  const fontMono   = "'Courier New', 'Consolas', monospace";
  const fontMain   = cfgAny.font_family === "serif"
    ? "Georgia, serif"
    : cfgAny.font_family === "mono"
    ? fontMono
    : "system-ui, sans-serif";
  const basePx     = cfgAny.font_size === "lg" ? 14 : cfgAny.font_size === "sm" ? 11 : 12;
  const gap        = cfgAny.spacing === "relaxed" ? 20 : cfgAny.spacing === "compact" ? 10 : 14;
  const darkBg     = "#0f172a";

  return (
    <div style={{ display:"flex", fontFamily:fontMain, fontSize:`${basePx}px`, minHeight:"200px" }}>

      {/* ── Dark sidebar ──────────────────────────────────── */}
      <div style={{ width:"195px", background:darkBg, padding:"28px 18px", color:"#e2e8f0", flexShrink:0 }}>

        {/* Profile section */}
        <div style={{ marginBottom:"22px" }}>
          <div style={{ fontFamily:fontMono, fontSize:`${basePx - 4}px`, color:accent, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"8px" }}>
            {"// perfil"}
          </div>
          {profile.photo_url ? (
            <img src={profile.photo_url} alt="" style={{ width:"60px", height:"60px", borderRadius:"8px", objectFit:"cover", border:`2px solid ${accent}`, marginBottom:"10px", display:"block" }} />
          ) : (
            <div style={{ width:"60px", height:"60px", borderRadius:"8px", background:`${accent}22`, border:`2px solid ${accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:"bold", color:accent, marginBottom:"10px" }}>
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </div>
          )}
          <div style={{ fontSize:`${basePx + 1}px`, fontWeight:"700", color:"#f8fafc", lineHeight:1.3 }}>
            {profile.first_name}<br />{profile.last_name}
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginBottom:"20px" }}>
          <div style={{ fontFamily:fontMono, fontSize:`${basePx - 4}px`, color:accent, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"8px" }}>
            {"// contacto"}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"5px", fontSize:`${basePx - 2}px`, color:"#94a3b8" }}>
            {profile.city         && <span>📍 {profile.city}</span>}
            {profile.phone        && <span>📱 {profile.phone}</span>}
            {profile.linkedin_url && <span>🔗 LinkedIn</span>}
            {profile.github_url   && <span>💻 GitHub</span>}
            {profile.website_url  && <span>🌐 Portfolio</span>}
          </div>
        </div>

        {/* Tech stack */}
        {Object.values(skills).flat().length > 0 && (
          <div>
            <div style={{ fontFamily:fontMono, fontSize:`${basePx - 4}px`, color:accent, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"10px" }}>
              {"// stack"}
            </div>
            {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
              <div key={cat} style={{ marginBottom:"12px" }}>
                <p style={{ fontSize:`${basePx - 4}px`, color:`${accent}cc`, textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 5px", fontFamily:fontMono }}>
                  {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"3px" }}>
                  {list.map((s) => (
                    <span key={s.id} style={{ fontSize:`${basePx - 3}px`, padding:"2px 6px", background:`${accent}1a`, color:accent, borderRadius:"3px", border:`1px solid ${accent}33`, fontFamily:fontMono }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <div style={{ flex:1, padding:"28px 24px", background:"white" }}>

        {/* Header */}
        <div style={{ marginBottom:`${gap + 6}px`, paddingBottom:"14px", borderBottom:`2px solid ${accent}` }}>
          <span style={{ fontFamily:fontMono, fontSize:`${basePx - 3}px`, color:"#94a3b8" }}>{"const dev = {"}</span>
          <h1 style={{ fontSize:`${basePx + 8}px`, fontWeight:"800", color:"#0f172a", margin:"4px 0 4px" }}>
            {profile.first_name} {profile.last_name}
          </h1>
          {profile.bio && (
            <p style={{ fontSize:`${basePx - 1}px`, color:"#475569", lineHeight:"1.65", margin:"4px 0 6px", maxWidth:"480px" }}>
              {profile.bio}
            </p>
          )}
          <span style={{ fontFamily:fontMono, fontSize:`${basePx - 3}px`, color:"#94a3b8" }}>{"}"}</span>
        </div>

        {/* Sections */}
        <div style={{ display:"flex", flexDirection:"column", gap:`${gap + 4}px` }}>
          {sections.map((section) => (
            <div key={section.type}>
              <div style={{ fontFamily:fontMono, fontSize:`${basePx - 3}px`, color:accent, textTransform:"uppercase", letterSpacing:"1.5px", fontWeight:"700", marginBottom:"8px" }}>
                {"// "}{section.label.toUpperCase()}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                {section.records.map((r) => (
                  <div key={r.id} style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"9px 11px", background:"#f8fafc", borderRadius:"5px", borderLeft:`3px solid ${accent}` }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:`${basePx}px`, fontWeight:"600", color:"#0f172a", margin:0, lineHeight:1.35 }}>
                        {r.title}
                      </p>
                      <p style={{ fontSize:`${basePx - 3}px`, color:"#64748b", margin:"2px 0 0", fontFamily:fontMono }}>
                        {r.institution}{r.duration_hours ? ` | ${r.duration_hours}h` : ""}
                      </p>
                      {r.description && (
                        <p style={{ fontSize:`${basePx - 3}px`, color:"#94a3b8", margin:"4px 0 0", lineHeight:1.5 }}>
                          {r.description}
                        </p>
                      )}
                    </div>
                    <span style={{ fontSize:`${basePx - 3}px`, color:accent, background:`${accent}1a`, padding:"2px 7px", borderRadius:"3px", flexShrink:0, fontFamily:fontMono, whiteSpace:"nowrap" }}>
                      {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}