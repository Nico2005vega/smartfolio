import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RECORD_TYPE_LABELS, RECORD_TYPE_ICONS } from "@/types";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { MapPin, Phone, Globe, ExternalLink, Link as LinkIcon, Eye, Mail } from "lucide-react";

interface Props { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("first_name,last_name")
    .eq("username_slug", username).single();
  if (!data) return { title: "Portafolio no encontrado" };
  return {
    title: `${data.first_name} ${data.last_name} | Smartfolio`,
    description: `Portafolio profesional de ${data.first_name} ${data.last_name}`,
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("username_slug", username)
    .eq("portfolio_public", true).single();
  if (!profile) notFound();

  const [{ data: records }, { data: skills }] = await Promise.all([
    supabase.from("academic_records").select("*").eq("profile_id", profile.id).eq("is_visible_in_cv", true).order("start_date", { ascending: false }),
    supabase.from("skills").select("*").eq("profile_id", profile.id).order("sort_order"),
    supabase.from("profiles").update({ visit_count: (profile.visit_count ?? 0) + 1 }).eq("username_slug", username),
  ]);

  const byType = (records ?? []).reduce<Record<string, typeof records>>((acc, r) => {
    acc[r.record_type] = [...(acc[r.record_type] ?? []), r]; return acc;
  }, {});

  const skillsByCategory = (skills ?? []).reduce<Record<string, typeof skills>>((acc, s) => {
    acc[s.category] = [...(acc[s.category] ?? []), s]; return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    technical: "Técnicas", soft: "Blandas", language: "Idiomas", tool: "Herramientas",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>

      {/* Navbar */}
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "800", fontSize: "12px" }}>S</span>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>Smartfolio</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#9ca3af" }}>
          <Eye size={13} />
          <span>{(profile.visit_count ?? 0) + 1} visitas</span>
        </div>
      </div>

      {/* Hero del perfil */}
      <div style={{ background: "linear-gradient(135deg, #052e16, #166534)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <div style={{
            width: "90px", height: "90px", borderRadius: "50%",
            background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "700", fontSize: "28px",
            overflow: "hidden", flexShrink: 0,
          }}>
            {profile.photo_url
              ? <img src={profile.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Foto" />
              : `${profile.first_name?.charAt(0)}${profile.last_name?.charAt(0)}`}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: "white", fontSize: "26px", fontWeight: "700", margin: "0 0 6px" }}>
              {profile.first_name} {profile.last_name}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "10px" }}>
              {profile.city    && <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><MapPin size={13} />{profile.city}, {profile.country}</span>}
              {profile.phone   && <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Phone size={13} />{profile.phone}</span>}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "white", textDecoration: "none", fontSize: "12px" }}>
                  <LinkIcon size={12} /> LinkedIn
                </a>
              )}
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "white", textDecoration: "none", fontSize: "12px" }}>
                  <LinkIcon size={12} /> GitHub
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "white", textDecoration: "none", fontSize: "12px" }}>
                  <Globe size={12} /> Portafolio
                </a>
              )}
            </div>
          </div>
        </div>
        {profile.bio && (
          <div style={{ maxWidth: "800px", margin: "16px auto 0" }}>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
              {profile.bio}
            </p>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: "20px" }}>

          {/* Registros académicos */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.keys(byType).length === 0 ? (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                Sin registros académicos publicados aún.
              </div>
            ) : (
              Object.entries(byType).map(([type, items]) => (
                <div key={type} style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ fontSize: "18px" }}>{RECORD_TYPE_ICONS[type as keyof typeof RECORD_TYPE_ICONS]}</span>
                    <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>
                      {RECORD_TYPE_LABELS[type as keyof typeof RECORD_TYPE_LABELS]}
                    </h2>
                    <span style={{ marginLeft: "auto", fontSize: "11px", color: "#9ca3af", background: "#f0f0f0", padding: "2px 8px", borderRadius: "99px" }}>{items?.length}</span>
                  </div>
                  <div>
                    {items?.map((r, i) => (
                      <div key={r.id} style={{
                        padding: "14px 18px",
                        borderBottom: i < (items?.length ?? 0) - 1 ? "1px solid #f8f8f8" : "none",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 3px" }}>{r.title}</p>
                            <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px" }}>{r.institution}</p>
                            {r.description && <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: "1.5" }}>{r.description}</p>}
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 4px" }}>
                              {formatDate(r.start_date, "MMM yyyy")}
                              {r.end_date ? ` — ${formatDate(r.end_date, "MMM yyyy")}` : ""}
                            </p>
                            {r.credential_url && (
                              <a href={r.credential_url} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "#16a34a", textDecoration: "none" }}>
                                Verificar <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar derecho */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Habilidades */}
            {Object.keys(skillsByCategory).length > 0 && (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: "13px", fontWeight: "700", color: "#111827", margin: "0 0 12px" }}>Habilidades</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {Object.entries(skillsByCategory).map(([cat, list]) => (
                    <div key={cat}>
                      <p style={{ fontSize: "10px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>
                        {categoryLabels[cat] ?? cat}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {list?.map((s) => (
                          <span key={s.id} style={{
                            fontSize: "11px", padding: "3px 9px",
                            background: "#f0fdf4", color: "#16a34a",
                            borderRadius: "99px", border: "1px solid #bbf7d0",
                            fontWeight: "500",
                          }}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Smartfolio badge */}
            <div style={{ background: "linear-gradient(135deg, #052e16, #166534)", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: "0 0 4px" }}>Portafolio generado con</p>
              <p style={{ color: "white", fontWeight: "700", fontSize: "16px", margin: "0 0 2px" }}>Smartfolio</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", margin: "0 0 12px" }}>BAN 00329 · UTS Bucaramanga</p>
              <a href="/register" style={{
                display: "block", padding: "8px", background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px",
                color: "white", textDecoration: "none", fontSize: "12px", fontWeight: "600",
              }}>
                Crea el tuyo gratis →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}