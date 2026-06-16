"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types";
import { toast } from "sonner";

interface TopBarProps { profile: Profile | null; }

export default function TopBar({ profile }: TopBarProps) {
  const supabase = createClient();
  const router   = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
    router.refresh();
  };

  const initials = profile
    ? getInitials(profile.first_name || "U", profile.last_name || "S")
    : "US";

  return (
    <header style={{
      background: "white", borderBottom: "1px solid #f0f0f0",
      padding: "12px 20px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 30,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    }}>
      {/* Espacio para el botón hamburguesa en móvil */}
      <div style={{ width: "48px" }} className="lg:hidden" />

      {/* Spacer en desktop */}
      <div className="hidden lg:block" />

      {/* Derecha */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button style={{
          padding: "8px", borderRadius: "10px", background: "none",
          border: "none", cursor: "pointer",
        }}>
          <Bell size={18} color="#9ca3af" />
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          paddingLeft: "12px", borderLeft: "1px solid #f0f0f0",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "#16a34a", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "13px", fontWeight: "700",
            overflow: "hidden", flexShrink: 0, cursor: "pointer",
          }}>
            {profile?.photo_url
              ? <img src={profile.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
              : initials}
          </div>
          <div className="hidden sm:block">
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#111827", margin: 0, lineHeight: 1 }}>
              {profile?.first_name} {profile?.last_name}
            </p>
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>
              {profile?.plan === "premium" ? "⭐ Premium" : "Plan Gratuito"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}