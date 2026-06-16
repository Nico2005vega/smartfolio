"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, GraduationCap, LayoutDashboard, User,
  BookOpen, FileText, Palette, Settings, Shield, Tag
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

interface Props {
  role:      string;
  firstName: string;
  lastName:  string;
  email:     string;
  plan:      string;
  photoUrl:  string | null;
}

export default function MobileNav({ role, firstName, lastName, email, plan, photoUrl }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  // Cierra el menú al navegar
  useEffect(() => { setOpen(false); }, [pathname]);

  // Bloquea scroll cuando está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Botón hamburguesa — solo visible en móvil */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden"
        style={{
          position: "fixed", top: "12px", left: "12px", zIndex: 50,
          width: "40px", height: "40px", borderRadius: "10px",
          background: "white", border: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer",
        }}>
        <Menu size={20} color="#374151" />
      </button>

      {/* Overlay oscuro */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 60,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Drawer lateral */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 70,
        width: "280px", background: "white",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: open ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Header del drawer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px", borderBottom: "1px solid #f0f0f0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "9px",
              background: "#16a34a", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <GraduationCap size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: "700", fontSize: "15px", color: "#111827", margin: 0 }}>Smartfolio</p>
              <p style={{ fontSize: "10px", color: "#9ca3af", margin: 0 }}>UTS · BAN 00329</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Perfil del usuario */}
        <div style={{
          padding: "16px", borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "#16a34a", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "700", fontSize: "16px",
            overflow: "hidden", flexShrink: 0,
          }}>
            {photoUrl
              ? <img src={photoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
              : `${firstName.charAt(0)}${lastName.charAt(0)}`
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: "600", fontSize: "14px", color: "#111827", margin: 0 }}>
              {firstName} {lastName}
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, truncate: true }}>
              {plan === "premium" ? "⭐ Premium" : "Plan Gratuito"}
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav style={{ flex: 1, padding: "12px" }}>
          <p style={{ fontSize: "10px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", padding: "8px 12px 4px" }}>
            Principal
          </p>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "11px 12px", borderRadius: "10px",
                fontSize: "14px", fontWeight: isActive(href) ? "600" : "500",
                color: isActive(href) ? "#16a34a" : "#374151",
                background: isActive(href) ? "#f0fdf4" : "transparent",
                textDecoration: "none", marginBottom: "2px",
              }}>
              <Icon size={18} color={isActive(href) ? "#16a34a" : "#9ca3af"} />
              {label}
            </Link>
          ))}

          {role === "admin" && (
            <>
              <p style={{ fontSize: "10px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", padding: "12px 12px 4px" }}>
                Admin
              </p>
              {adminItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "11px 12px", borderRadius: "10px",
                    fontSize: "14px", fontWeight: isActive(href) ? "600" : "500",
                    color: isActive(href) ? "#16a34a" : "#374151",
                    background: isActive(href) ? "#f0fdf4" : "transparent",
                    textDecoration: "none", marginBottom: "2px",
                  }}>
                  <Icon size={18} color={isActive(href) ? "#16a34a" : "#9ca3af"} />
                  {label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Footer del drawer */}
        <div style={{ padding: "12px", borderTop: "1px solid #f0f0f0" }}>
          <Link href="/settings"
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 12px", borderRadius: "10px",
              fontSize: "14px", fontWeight: "500", color: "#374151",
              textDecoration: "none", marginBottom: "4px",
            }}>
            <Settings size={18} color="#9ca3af" />
            Configuración
          </Link>
          <button onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 12px", borderRadius: "10px",
              fontSize: "14px", fontWeight: "500", color: "#ef4444",
              background: "#fef2f2", border: "none", cursor: "pointer",
            }}>
            <X size={18} color="#ef4444" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}