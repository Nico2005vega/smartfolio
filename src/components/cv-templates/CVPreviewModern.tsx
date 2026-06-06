import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from "lucide-react";

interface Props { data: CVData; }

export default function CVPreviewModern({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#16a34a";
  const allSkills = Object.values(skills).flat();

  return (
    <div style={{ fontFamily: "sans-serif", color: "#1f2937", fontSize: "14px", minHeight: "297mm" }}>
      <div style={{ display: "flex", minHeight: "180px" }}>

        {/* Sidebar */}
        <div style={{ width: "220px", flexShrink: 0, padding: "24px", background: accent, color: "#fff" }}>
          {profile.photo_url ? (
            <img src={profile.photo_url} alt="Foto" style={{
              width: "80px", height: "80px", borderRadius: "50%",
              objectFit: "cover", border: "2px solid rgba(255,255,255,0.4)", marginBottom: "16px"
            }} />
          ) : (
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", display: "flex",
              alignItems: "center", justifyContent: "center",
              marginBottom: "16px", fontSize: "24px", fontWeight: "bold"
            }}>
              {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
            </div>
          )}

          <div style={{ fontSize: "11px", opacity: 0.9, display: "flex", flexDirection: "column", gap: "6px" }}>
            {profile.city && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={11} /> {profile.city}, {profile.country}
              </div>
            )}
            {profile.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={11} /> {profile.phone}
              </div>
            )}
            {profile.linkedin_url && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <LinkIcon size={11} /> LinkedIn
              </div>
            )}
            {profile.github_url && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <LinkIcon size={11} /> GitHub
              </div>
            )}
            {profile.website_url && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Globe size={11} /> Portafolio
              </div>
            )}
          </div>

          {/* Skills */}
          {allSkills.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <div style={{
                fontSize: "10px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "1px",
                color: "rgba(255,255,255,0.6)", marginBottom: "8px"
              }}>
                Habilidades
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {allSkills.slice(0, 12).map((s) => (
                  <div key={s.id} style={{
                    fontSize: "11px",
                    color: "#ffffff",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "4px",
                    padding: "3px 8px",
                  }}>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div style={{ flex: 1, padding: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: accent, margin: "0 0 8px" }}>
            {profile.first_name} {profile.last_name}
          </h1>

          {profile.bio && (
            <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.6", maxWidth: "420px", margin: "0 0 12px" }}>
              {profile.bio}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#6b7280", marginBottom: "20px" }}>
            <Mail size={11} /> contacto@smartfolio.co
          </div>

          {/* Secciones académicas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {sections.map((section) => (
              <div key={section.type}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "10px"
                }}>
                  <span style={{ fontSize: "14px" }}>{section.icon}</span>
                  <h2 style={{
                    fontSize: "11px", fontWeight: "700",
                    textTransform: "uppercase", letterSpacing: "1px", color: accent, margin: 0
                  }}>
                    {section.label}
                  </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {section.records.map((r) => (
                    <div key={r.id} style={{ display: "flex", gap: "12px" }}>
                      <div style={{ width: "56px", flexShrink: 0, textAlign: "right" }}>
                        <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                          {r.end_date ? formatDate(r.end_date, "yyyy") : formatDate(r.start_date, "yyyy")}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "12px", fontWeight: "600", color: "#111827", margin: "0 0 2px" }}>
                          {r.title}
                        </p>
                        <p style={{ fontSize: "10px", color: "#6b7280", margin: 0 }}>
                          {r.institution}
                        </p>
                        {r.duration_hours && (
                          <span style={{ fontSize: "10px", color: "#9ca3af" }}>{r.duration_hours}h</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}