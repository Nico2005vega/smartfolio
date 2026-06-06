"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap, LayoutDashboard, User, BookOpen,
  FileText, Palette, Settings, Shield, Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href:"/dashboard",  label:"Dashboard",    icon:LayoutDashboard },
  { href:"/profile",    label:"Mi Perfil",    icon:User },
  { href:"/skills",     label:"Habilidades",  icon:Tag },
  { href:"/academic",   label:"Formación",    icon:BookOpen },
  { href:"/documents",  label:"Documentos",   icon:FileText },
  { href:"/cv-builder", label:"Generar CV",   icon:Palette },
];

const adminItems = [
  { href:"/admin", label:"Administración", icon:Shield },
];

interface SidebarProps { role: string; }

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-gray-200 min-h-screen flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background:"#16a34a" }}>
          <GraduationCap size={16} className="text-white" />
        </div>
        <div>
          <span className="text-base font-bold text-gray-900">Smartfolio</span>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">UTS · BAN 00329</p>
        </div>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Principal</p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5",
              isActive(href)
                ? "bg-green-50 text-green-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}>
            <Icon size={16} className={isActive(href) ? "text-green-600" : "text-gray-400"} />
            {label}
          </Link>
        ))}

        {role === "admin" && (
          <>
            <div className="pt-4 pb-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3">Admin</p>
            </div>
            {adminItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5",
                  isActive(href) ? "bg-green-50 text-green-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                )}>
                <Icon size={16} className={isActive(href) ? "text-green-600" : "text-gray-400"} />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Footer: Configuración */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <Link href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive("/settings") ? "bg-green-50 text-green-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          )}>
          <Settings size={16} className={isActive("/settings") ? "text-green-600" : "text-gray-400"} />
          Configuración
        </Link>
      </div>
    </aside>
  );
}
