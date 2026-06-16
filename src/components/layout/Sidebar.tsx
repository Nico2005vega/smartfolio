"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap, LayoutDashboard, User, BookOpen,
  FileText, Palette, Settings, Shield, Tag, LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { href: "/profile",    label: "Mi Perfil",   icon: User },
  { href: "/skills",     label: "Habilidades", icon: Tag },
  { href: "/academic",   label: "Formación",   icon: BookOpen },
  { href: "/documents",  label: "Documentos",  icon: FileText },
  { href: "/cv-builder", label: "Generar CV",  icon: Palette },
];

const adminItems = [
  { href: "/admin", label: "Administración", icon: Shield },
];

interface SidebarProps { role: string; }

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
    router.refresh();
  };

  return (
    <aside style={{
      width: "220px", flexShrink: 0,
      background: "white", borderRight: "1px solid #f0f0f0",
      minHeight: "100vh", display: "flex", flexDirection: "column",
    }} className="hidden lg:flex">

      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #f8f8f8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#16a34a", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
            boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
          }}>
            <GraduationCap size={18} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: "700", fontSize: "15px", color: "#111827", margin: 0, lineHeight: 1 }}>Smartfolio</p>
            <p style={{ fontSize: "10px", color: "#9ca3af", margin: "3px 0 0" }}>UTS · BAN 00329</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        <p style={{ fontSize: "10px", fontWeight: "600", color: "#c4c4c4", textTransform: "uppercase", letterSpacing: "1px", padding: "4px 10px 8px" }}>
          Principal
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 10px", borderRadius: "10px",
              fontSize: "13px", fontWeight: active ? "600" : "500",
              color: active ? "#16a34a" : "#6b7280",
              background: active ? "#f0fdf4" : "transparent",
              textDecoration: "none", marginBottom: "1px",
              transition: "all 0.15s",
              borderLeft: active ? "3px solid #16a34a" : "3px solid transparent",
            }}>
              <Icon size={16} color={active ? "#16a34a" : "#c4c4c4"} />
              {label}
            </Link>
          );
        })}

        {role === "admin" && (
          <>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#c4c4c4", textTransform: "uppercase", letterSpacing: "1px", padding: "14px 10px 8px" }}>
              Admin
            </p>
            {adminItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 10px", borderRadius: "10px",
                  fontSize: "13px", fontWeight: active ? "600" : "500",
                  color: active ? "#16a34a" : "#6b7280",
                  background: active ? "#f0fdf4" : "transparent",
                  textDecoration: "none", marginBottom: "1px",
                  borderLeft: active ? "3px solid #16a34a" : "3px solid transparent",
                }}>
                  <Icon size={16} color={active ? "#16a34a" : "#c4c4c4"} />
                  {label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ padding: "10px", borderTop: "1px solid #f8f8f8" }}>
        <Link href="/settings" style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "9px 10px", borderRadius: "10px",
          fontSize: "13px", fontWeight: "500", color: "#6b7280",
          textDecoration: "none", marginBottom: "2px",
        }}>
          <Settings size={16} color="#c4c4c4" />
          Configuración
        </Link>
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px",
          padding: "9px 10px", borderRadius: "10px",
          fontSize: "13px", fontWeight: "500", color: "#ef4444",
          background: "none", border: "none", cursor: "pointer",
          transition: "background 0.15s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
          <LogOut size={16} color="#ef4444" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}