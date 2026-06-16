import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/forms/ProfileForm";
import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";

export const metadata = { title: "Mi Perfil" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  const completedFields = [
    profile?.first_name, profile?.last_name, profile?.bio,
    profile?.city, profile?.phone,
  ].filter(Boolean).length;

  const completionPct = Math.round((completedFields / 5) * 100);

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>
          Mi Perfil
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
          Esta información aparece en tu CV y portafolio público.
        </p>
      </div>

      {/* Barra de completitud */}
      <div style={{
        background: "white", borderRadius: "16px",
        border: "1px solid #f0f0f0", padding: "16px 20px",
        marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Perfil completado</span>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>{completionPct}%</span>
          </div>
          <div style={{ background: "#f0f0f0", borderRadius: "99px", height: "6px" }}>
            <div style={{
              background: completionPct === 100 ? "#16a34a" : "#4ade80",
              borderRadius: "99px", height: "6px",
              width: `${completionPct}%`, transition: "width 0.5s ease",
            }} />
          </div>
        </div>
        {completionPct === 100 && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: "99px", padding: "4px 12px",
            fontSize: "12px", fontWeight: "600", color: "#16a34a",
            flexShrink: 0,
          }}>
            ✓ Completo
          </div>
        )}
      </div>

      {/* Formulario */}
      <div style={{
        background: "white", borderRadius: "16px",
        border: "1px solid #f0f0f0", padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        marginBottom: "16px",
      }}>
        <ProfileForm profile={profile} userId={user.id} />
      </div>

      {/* Card de habilidades */}
      <div style={{
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        border: "1px solid #bbf7d0", borderRadius: "16px",
        padding: "18px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Tag size={18} color="white" />
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#166534", margin: 0 }}>
              Agrega tus habilidades
            </p>
            <p style={{ fontSize: "12px", color: "#4ade80", margin: 0 }}>
              Aparecen en tu CV y portafolio
            </p>
          </div>
        </div>
        <Link href="/skills" style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "9px 16px", background: "#16a34a", color: "white",
          borderRadius: "10px", textDecoration: "none",
          fontSize: "13px", fontWeight: "600", flexShrink: 0,
        }}>
          Gestionar <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}