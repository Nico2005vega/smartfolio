"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import type { Profile } from "@/types";
import { toast } from "sonner";

interface TopBarProps { profile: Profile | null; }

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export default function TopBar({ profile }: TopBarProps) {
  const supabase = createClient();
  const router   = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
    router.refresh();
  };

  const initials = getInitials(
    profile?.first_name ?? "U",
    profile?.last_name  ?? "S"
  );

  return (
    <header style={{
      background: "white",
      borderBottom: "1px solid #f0f0f0",
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 30,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      {/* Logo en móvil */}
      <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px",
          background: "#16a34a", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "white", fontWeight: 800, fontSize: "13px" }}>S</span>
        </div>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>Smartfolio</span>
      </div>

      {/* Spacer desktop */}
      <div className="hidden lg:block" />

      {/* Derecha */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button style={{
          padding: "7px", borderRadius: "10px",
          background: "none", border: "none", cursor: "pointer",
        }}>
          <Bell size={18} color="#9ca3af" />
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          paddingLeft: "10px", borderLeft: "1px solid #f0f0f0",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "#16a34a", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "13px", fontWeight: 700,
            overflow: "hidden", flexShrink: 0, cursor: "pointer",
          }}>
            {profile?.photo_url
              ? <img src={profile.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
              : initials}
          </div>
          <div className="hidden sm:block">
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1 }}>
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