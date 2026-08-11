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
    <aside
      className="hidden lg:flex"
      style={{
        width: "200px",
        flexShrink: 0,
        background: "white",
        borderRight: "1px solid #f0f0f0",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexDirection: "column",
        overflow: "hidden", // evita que crezca
      }}>

      {/* Logo */}
      <div style={{ padding: "14px 12px", borderBottom: "1px solid #f8f8f8", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "9px",
            background: "#16a34a", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
            boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
          }}>
            <GraduationCap size={16} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: "700", fontSize: "14px", color: "#111827", margin: 0, lineHeight: 1 }}>Smartfolio</p>
            <p style={{ fontSize: "9px", color: "#9ca3af", margin: "2px 0 0" }}></p>
          </div>
        </div>
      </div>

      {/* Nav — ocupa el espacio disponible con scroll si es necesario */}
      <nav style={{ flex: 1, padding: "8px", overflowY: "auto", minHeight: 0 }}>
        <p style={{ fontSize: "9px", fontWeight: "600", color: "#c4c4c4", textTransform: "uppercase", letterSpacing: "1px", padding: "4px 8px 6px" }}>
          Principal
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "7px 8px", borderRadius: "8px",
              fontSize: "12.5px", fontWeight: active ? "600" : "500",
              color: active ? "#16a34a" : "#6b7280",
              background: active ? "#f0fdf4" : "transparent",
              textDecoration: "none", marginBottom: "1px",
              transition: "all 0.15s",
              borderLeft: active ? "2px solid #16a34a" : "2px solid transparent",
            }}>
              <Icon size={15} color={active ? "#16a34a" : "#c4c4c4"} />
              {label}
            </Link>
          );
        })}

        {role === "admin" && (
          <>
            <p style={{ fontSize: "9px", fontWeight: "600", color: "#c4c4c4", textTransform: "uppercase", letterSpacing: "1px", padding: "10px 8px 6px" }}>
              Admin
            </p>
            {adminItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "7px 8px", borderRadius: "8px",
                  fontSize: "12.5px", fontWeight: active ? "600" : "500",
                  color: active ? "#16a34a" : "#6b7280",
                  background: active ? "#f0fdf4" : "transparent",
                  textDecoration: "none", marginBottom: "1px",
                  borderLeft: active ? "2px solid #16a34a" : "2px solid transparent",
                }}>
                  <Icon size={15} color={active ? "#16a34a" : "#c4c4c4"} />
                  {label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer — siempre visible, no se corta */}
      <div style={{ padding: "8px", borderTop: "1px solid #f8f8f8", flexShrink: 0 }}>
        <Link href="/settings" style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "7px 8px", borderRadius: "8px",
          fontSize: "12.5px", fontWeight: "500", color: "#6b7280",
          textDecoration: "none", marginBottom: "2px",
        }}>
          <Settings size={15} color="#c4c4c4" />
          Configuración
        </Link>
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: "8px",
          padding: "7px 8px", borderRadius: "8px",
          fontSize: "12.5px", fontWeight: "500", color: "#ef4444",
          background: "#fef2f2", border: "none", cursor: "pointer",
        }}>
          <LogOut size={15} color="#ef4444" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}