import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

export default function CVPreviewCreative({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent     = config?.accent_color ?? "#7c3aed";
  const cfgAny     = config as any;
  const fontFamily = cfgAny.font_family === "serif"
    ? "Georgia, serif"
    : cfgAny.font_family === "mono"
    ? "'Courier New', monospace"
    : "sans-serif";
  const basePx     = cfgAny.font_size === "lg" ? 14 : cfgAny.font_size === "sm" ? 11 : 13;
  const gap        = cfgAny.spacing === "relaxed" ? 24 : cfgAny.spacing === "compact" ? 12 : 16;

  return (
    <div style={{ fontFamily, color: "#1f2937", fontSize: `${basePx}px` }}>

      {/* ── Bold colour header ─────────────────────────────── */}
      <div style={{ background: accent, padding: "28px 28px", color: "white", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:"-24px", right:"-24px", width:"110px", height:"110px", borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ position:"absolute", bottom:"-32px", left:"35%", width:"80px", height:"80px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />

        <div style={{ display:"flex", alignItems:"center", gap:"20px", position:"relative" }}>
          {profile.photo_url ? (
            <img src={profile.photo_url} alt="Foto" style={{ width:"72px", height:"72px", borderRadius:"12px", objectFit:"cover", border:"2px solid rgba(255,255,255,0.4)" }} />
          ) : (
            <div style={{ width:"72px", height:"72px", borderRadius:"12px", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", fontWeight:"800", color:"white", flexShrink:0 }}>
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </div>
          )}

          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontSize:`${basePx + 10}px`, fontWeight:"800", margin:"0 0 6px", lineHeight:1.15, color:"white" }}>
              {profile.first_name} {profile.last_name}
            </h1>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"12px", fontSize:`${basePx - 3}px`, opacity:0.9 }}>
              {profile.city         && <span>📍 {profile.city}</span>}
              {profile.phone        && <span>📱 {profile.phone}</span>}
              {profile.linkedin_url && <span>🔗 LinkedIn</span>}
              {profile.github_url   && <span>💻 GitHub</span>}
              {profile.website_url  && <span>🌐 Portafolio</span>}
            </div>
            {profile.bio && (
              <p style={{ margin:"8px 0 0", fontSize:`${basePx - 2}px`, opacity:0.9, lineHeight:1.55, maxWidth:"430px" }}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Body: main + skills sidebar ───────────────────── */}
      <div style={{ display:"flex" }}>

        {/* Main content */}
        <div style={{ flex:1, padding:"24px 28px" }}>
          {sections.map((section) => (
            <div key={section.type} style={{ marginBottom:`${gap}px` }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
                <div style={{ width:"3px", height:"16px", borderRadius:"2px", background:accent, flexShrink:0 }} />
                <h2 style={{ fontSize:`${basePx - 3}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"1.5px", color:accent, margin:0 }}>
                  {section.label}
                </h2>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"6px", paddingLeft:"11px" }}>
                {section.records.map((r) => (
                  <div key={r.id} style={{ padding:"10px 12px", background:"#f9fafb", borderRadius:"8px", borderLeft:`3px solid ${accent}44` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px" }}>
                      <p style={{ fontWeight:"700", fontSize:`${basePx - 1}px`, color:"#111827", margin:0, flex:1, minWidth:0 }}>
                        {r.title}
                      </p>
                      <span style={{ fontSize:`${basePx - 3}px`, color:"white", background:accent, borderRadius:"20px", padding:"2px 8px", flexShrink:0, whiteSpace:"nowrap" }}>
                        {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
                      </span>
                    </div>
                    <p style={{ fontSize:`${basePx - 3}px`, color:"#6b7280", margin:"3px 0 0" }}>
                      {r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}
                    </p>
                    {r.description && (
                      <p style={{ fontSize:`${basePx - 4}px`, color:"#9ca3af", margin:"4px 0 0", lineHeight:1.5 }}>
                        {r.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skills sidebar */}
        {Object.values(skills).flat().length > 0 && (
          <div style={{ width:"176px", flexShrink:0, background:"#f8fafc", borderLeft:"1px solid #e2e8f0", padding:"24px 16px" }}>
            <div style={{ fontSize:`${basePx - 4}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"1px", color:"#94a3b8", marginBottom:"14px" }}>
              Habilidades
            </div>
            {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
              <div key={cat} style={{ marginBottom:"14px" }}>
                <p style={{ fontSize:`${basePx - 4}px`, fontWeight:"700", color:accent, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 6px" }}>
                  {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                  {list.map((s) => (
                    <span key={s.id} style={{ fontSize:`${basePx - 3}px`, padding:"2px 7px", background:`${accent}18`, color:accent, borderRadius:"4px", border:`1px solid ${accent}33` }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}