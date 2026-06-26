import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RECORD_TYPE_LABELS, RECORD_TYPE_ICONS, type RecordType } from "@/types";
import Link from "next/link";
import { Plus, FileText, Palette, ArrowRight, TrendingUp, Award, BookOpen } from "lucide-react";
import { formatDateRelative } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: records }, { data: docs }, { data: skills }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("academic_records").select("id,record_type,title,institution,created_at").eq("profile_id", user.id).order("created_at", { ascending: false }),
    supabase.from("documents").select("id").eq("profile_id", user.id),
    supabase.from("skills").select("id").eq("profile_id", user.id),
  ]);

  const byType = (records ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.record_type] = (acc[r.record_type] ?? 0) + 1;
    return acc;
  }, {});

  const recent      = (records ?? []).slice(0, 4);
  const totalRec    = records?.length ?? 0;
  const totalDocs   = docs?.length ?? 0;
  const totalSkills = skills?.length ?? 0;

  const profileComplete = !!(profile?.first_name && profile?.bio && profile?.city);
  const hasRecords      = totalRec > 0;
  const hasDocs         = totalDocs > 0;
  const completeness    = [profileComplete, hasRecords, hasDocs, totalSkills > 0].filter(Boolean).length;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

      {/* ── CSS responsivo ── */}
      <style>{`
        .dash-banner   { border-radius: 20px; padding: 28px 32px; }
        .dash-kpi      { grid-template-columns: repeat(4, 1fr); }
        .dash-actions  { grid-template-columns: 1fr 1fr; }
        .dash-body     { grid-template-columns: 1fr 340px; }
        .dash-records  { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }

        @media (max-width: 1024px) {
          .dash-body  { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .dash-banner  { padding: 20px 18px !important; border-radius: 14px !important; }
          .dash-kpi     { grid-template-columns: 1fr 1fr; }
          .dash-actions { grid-template-columns: 1fr 1fr; }
          .dash-records { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 380px) {
          .dash-kpi     { grid-template-columns: 1fr 1fr; }
          .dash-actions { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Bienvenida */}
      <div className="dash-banner" style={{
        background: "linear-gradient(135deg, #052e16, #166534)",
        marginBottom: "24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: "0 0 4px" }}>Buenos días 👋</p>
          <h1 style={{ color: "white", fontSize: "clamp(18px, 5vw, 24px)", fontWeight: "700", margin: "0 0 6px" }}>
            {profile?.first_name ?? "Estudiante"} {profile?.last_name}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: "0 0 16px" }}>
            <strong style={{ color: "#4ade80" }}>{totalRec}</strong> registros ·{" "}
            <strong style={{ color: "#4ade80" }}>{totalDocs}</strong> documentos ·{" "}
            <strong style={{ color: "#4ade80" }}>{totalSkills}</strong> habilidades
          </p>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>Perfil completado</span>
              <span style={{ color: "#4ade80", fontSize: "12px", fontWeight: "600" }}>{completeness * 25}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "99px", height: "6px" }}>
              <div style={{ background: "#4ade80", borderRadius: "99px", height: "6px", width: `${completeness * 25}%`, transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="dash-kpi" style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Registros",   value: totalRec,             icon: BookOpen,   color: "#16a34a", bg: "#f0fdf4", href: "/academic"  },
          { label: "Documentos",  value: totalDocs,            icon: FileText,   color: "#2563eb", bg: "#eff6ff", href: "/documents" },
          { label: "Habilidades", value: totalSkills,          icon: Award,      color: "#7c3aed", bg: "#f5f3ff", href: "/skills"    },
          { label: "Completitud", value:`${completeness*25}%`, icon: TrendingUp, color: "#d97706", bg: "#fffbeb", href: "/profile"   },
        ].map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #f0f0f0", padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: "3px 0 0" }}>{s.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Body */}
      <div className="dash-body" style={{ display: "grid", gap: "20px" }}>

        {/* Panel izquierdo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Acciones rápidas */}
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #f0f0f0", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 12px" }}>Acciones rápidas</h2>
            <div className="dash-actions" style={{ display: "grid", gap: "10px" }}>
              {[
                { href: "/academic/new", label: "Nuevo registro",  icon: Plus,    color: "#16a34a", bg: "#f0fdf4", desc: "Agrega un logro"          },
                { href: "/cv-builder",   label: "Generar CV",      icon: Palette, color: "#7c3aed", bg: "#f5f3ff", desc: "Descarga tu CV"           },
                { href: "/documents",    label: "Mis documentos",  icon: FileText,color: "#2563eb", bg: "#eff6ff", desc: `${totalDocs} archivos`     },
                { href: "/skills",       label: "Habilidades",     icon: Award,   color: "#d97706", bg: "#fffbeb", desc: `${totalSkills} registradas` },
              ].map(a => (
                <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
                  <div style={{ border: "1px solid #f0f0f0", borderRadius: "12px", padding: "13px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <a.icon size={17} color={a.color} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#111827", margin: 0 }}>{a.label}</p>
                      <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>{a.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Formación */}
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #f0f0f0", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: 0 }}>Formación académica</h2>
              <Link href="/academic" style={{ fontSize: "12px", color: "#16a34a", textDecoration: "none", fontWeight: "600" }}>Ver todo →</Link>
            </div>
            {Object.keys(byType).length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ fontSize: "28px", margin: "0 0 6px" }}>🎓</p>
                <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 12px" }}>Aún no tienes registros</p>
                <Link href="/academic/new" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#16a34a", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                  <Plus size={14} /> Agregar
                </Link>
              </div>
            ) : (
              <div className="dash-records" style={{ display: "grid", gap: "10px" }}>
                {Object.entries(byType).map(([type, count]) => (
                  <Link key={type} href={`/academic?type=${type}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fafafa", borderRadius: "12px", padding: "14px", border: "1px solid #f0f0f0", textAlign: "center" }}>
                      <p style={{ fontSize: "22px", margin: "0 0 4px" }}>{RECORD_TYPE_ICONS[type as RecordType]}</p>
                      <p style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 2px" }}>{count}</p>
                      <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, lineHeight: "1.3" }}>{RECORD_TYPE_LABELS[type as RecordType]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Actividad reciente */}
          {recent.length > 0 && (
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #f0f0f0", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 12px" }}>Actividad reciente</h2>
              {recent.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < recent.length - 1 ? "1px solid #f8f8f8" : "none" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{RECORD_TYPE_ICONS[r.record_type as RecordType]}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: "500", color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.institution}</p>
                  </div>
                  <span style={{ fontSize: "11px", color: "#d1d5db", flexShrink: 0 }}>{formatDateRelative(r.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel derecho */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", borderRadius: "14px", padding: "18px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>🌐 Tu portafolio público</p>
            <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: "0 0 3px", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>/p/{profile?.username_slug}</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: "0 0 12px" }}>Accesible sin iniciar sesión</p>
            <Link href={`/p/${profile?.username_slug}`} target="_blank" style={{ display: "block", textAlign: "center", padding: "9px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "10px", color: "white", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
              Ver mi portafolio →
            </Link>
          </div>

          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #f0f0f0", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px" }}>Lista de tareas</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Completa tu perfil",         done: profileComplete, href: "/profile"      },
                { label: "Agrega tu título académico",  done: hasRecords,      href: "/academic/new" },
                { label: "Sube un documento soporte",   done: hasDocs,         href: "/documents"    },
                { label: "Agrega tus habilidades",      done: totalSkills > 0, href: "/skills"       },
                { label: "Genera y descarga tu CV",     done: false,           href: "/cv-builder"   },
              ].map(item => (
                <Link key={item.label} href={item.done ? "#" : item.href} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "10px", background: item.done ? "#f0fdf4" : "#fafafa", border: `1px solid ${item.done ? "#bbf7d0" : "#f0f0f0"}` }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, background: item.done ? "#16a34a" : "white", border: `2px solid ${item.done ? "#16a34a" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.done && <span style={{ color: "white", fontSize: "10px", fontWeight: "700" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "12px", color: item.done ? "#16a34a" : "#6b7280", fontWeight: item.done ? "500" : "400", textDecoration: item.done ? "line-through" : "none", flex: 1, minWidth: 0 }}>
                      {item.label}
                    </span>
                    {!item.done && <ArrowRight size={12} color="#d1d5db" style={{ flexShrink: 0 }} />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}