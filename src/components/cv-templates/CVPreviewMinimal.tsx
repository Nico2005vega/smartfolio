import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

export default function CVPreviewMinimal({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent     = config?.accent_color ?? "#18181b";
  const cfgAny     = config as any;
  const fontFamily = cfgAny.font_family === "sans"
    ? "system-ui, sans-serif"
    : cfgAny.font_family === "mono"
    ? "'Courier New', monospace"
    : "Georgia, 'Times New Roman', serif";
  const basePx     = cfgAny.font_size === "lg" ? 14 : cfgAny.font_size === "sm" ? 11 : 13;
  const gap        = cfgAny.spacing === "relaxed" ? 28 : cfgAny.spacing === "compact" ? 14 : 20;
  const padding    = cfgAny.spacing === "relaxed" ? "44px" : cfgAny.spacing === "compact" ? "28px" : "36px";
  const allSkills  = Object.values(skills).flat();

  return (
    <div style={{ fontFamily, color:"#18181b", padding, background:"white", fontSize:`${basePx}px` }}>

      {/* ── Minimal header ────────────────────────────────── */}
      <div style={{ marginBottom:`${gap + 8}px` }}>
        <h1 style={{ fontSize:`${basePx + 14}px`, fontWeight:"700", letterSpacing:"-0.5px", margin:"0 0 10px", color:"#09090b", lineHeight:1.15 }}>
          {profile.first_name} {profile.last_name}
        </h1>
        <div style={{ height:"1px", background:"#e4e4e7", marginBottom:"12px" }} />
        <div style={{ display:"flex", flexWrap:"wrap", gap:"16px", fontSize:`${basePx - 2}px`, color:"#71717a" }}>
          {profile.city         && <span>{profile.city}{profile.country ? `, ${profile.country}` : ""}</span>}
          {profile.phone        && <span>{profile.phone}</span>}
          {profile.linkedin_url && <span>LinkedIn</span>}
          {profile.github_url   && <span>GitHub</span>}
          {profile.website_url  && <span>Portafolio</span>}
        </div>
        {profile.bio && (
          <p style={{ margin:"14px 0 0", fontSize:`${basePx - 1}px`, color:"#52525b", lineHeight:"1.75", maxWidth:"520px" }}>
            {profile.bio}
          </p>
        )}
      </div>

      {/* ── Sections ──────────────────────────────────────── */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${gap}px` }}>
        {sections.map((section) => (
          <div key={section.type}>
            {/* Section header: label + horizontal rule */}
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"12px" }}>
              <span style={{ fontSize:`${basePx - 4}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"2px", color:accent, flexShrink:0 }}>
                {section.label}
              </span>
              <div style={{ flex:1, height:"1px", background:"#e4e4e7" }} />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:`${gap / 2}px` }}>
              {section.records.map((r) => (
                <div key={r.id} style={{ display:"grid", gridTemplateColumns:"1fr 70px", gap:"16px", alignItems:"start" }}>
                  <div>
                    <p style={{ fontSize:`${basePx}px`, fontWeight:"600", color:"#09090b", margin:0, lineHeight:1.4 }}>
                      {r.title}
                    </p>
                    <p style={{ fontSize:`${basePx - 2}px`, color:"#71717a", margin:"3px 0 0" }}>
                      {r.institution}{r.duration_hours ? ` — ${r.duration_hours}h` : ""}
                    </p>
                    {r.description && (
                      <p style={{ fontSize:`${basePx - 3}px`, color:"#a1a1aa", margin:"4px 0 0", lineHeight:1.6 }}>
                        {r.description}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:`${basePx - 3}px`, color:"#a1a1aa", margin:0, whiteSpace:"nowrap" }}>
                      {r.end_date
                        ? formatDate(r.end_date,"yyyy")
                        : formatDate(r.start_date,"yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Skills — just text, no boxes */}
        {allSkills.length > 0 && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"12px" }}>
              <span style={{ fontSize:`${basePx - 4}px`, fontWeight:"700", textTransform:"uppercase", letterSpacing:"2px", color:accent, flexShrink:0 }}>
                Habilidades
              </span>
              <div style={{ flex:1, height:"1px", background:"#e4e4e7" }} />
            </div>
            <p style={{ fontSize:`${basePx - 1}px`, color:"#71717a", lineHeight:"1.9", margin:0 }}>
              {allSkills.map((s) => s.name).join("  ·  ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}