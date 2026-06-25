"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, BookOpen, Palette, Tag, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const items = [
  { href: "/dashboard",  label: "Inicio",    icon: LayoutDashboard },
  { href: "/academic",   label: "Formación", icon: BookOpen },
  { href: "/cv-builder", label: "CV",        icon: Palette },
  { href: "/skills",     label: "Skills",    icon: Tag },
  { href: "/profile",    label: "Perfil",    icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
      background: "white", borderTop: "1px solid #f0f0f0",
      display: "flex", alignItems: "center",
      boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }} className="lg:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link key={href} href={href} style={{
            flex: 1,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "10px 4px 8px",
            textDecoration: "none",
            color: active ? "#16a34a" : "#9ca3af",
            position: "relative",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: "24px", height: "2.5px",
                background: "#16a34a", borderRadius: "0 0 4px 4px",
              }} />
            )}
            <Icon size={22} color={active ? "#16a34a" : "#c4c4c4"} />
            <span style={{
              fontSize: "10px", marginTop: "3px",
              fontWeight: active ? 600 : 400,
              color: active ? "#16a34a" : "#9ca3af",
            }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}