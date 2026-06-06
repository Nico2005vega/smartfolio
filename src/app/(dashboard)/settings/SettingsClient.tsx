"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Copy, ExternalLink } from "lucide-react";
import type { Profile, CVConfiguration } from "@/types";
import Link from "next/link";

interface Props {
  profile:   Profile | null;
  userId:    string;
  email:     string;
  cvConfig:  CVConfiguration | null;
}

export default function SettingsClient({ profile, userId, email, cvConfig }: Props) {
  const [portfolioPublic, setPortfolioPublic] = useState(profile?.portfolio_public ?? true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const togglePortfolio = async () => {
    setSaving(true);
    const next = !portfolioPublic;
    const { error } = await supabase
      .from("profiles")
      .update({ portfolio_public: next })
      .eq("id", userId);
    if (error) {
      toast.error("Error al actualizar");
    } else {
      setPortfolioPublic(next);
      toast.success(next ? "Portafolio público ✓" : "Portafolio ocultado ✓");
    }
    setSaving(false);
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/p/${profile?.username_slug}`;
    navigator.clipboard.writeText(url);
    toast.success("URL copiada al portapapeles");
  };

  return (
    <div className="space-y-5">

      {/* Portafolio público */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Visibilidad del portafolio</h2>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex-1 min-w-0 mr-4">
            <p className="font-medium text-gray-900 text-sm">Portafolio público</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Cuando está activo, cualquier persona con el enlace puede ver tu portafolio.
            </p>
          </div>
          <button
            onClick={togglePortfolio}
            disabled={saving}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none ${
              portfolioPublic ? "bg-green-600" : "bg-gray-300"
            }`}>
            {saving && (
              <Loader2 size={10} className="animate-spin absolute inset-0 m-auto text-white" />
            )}
            {!saving && (
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                portfolioPublic ? "translate-x-5" : "translate-x-0.5"
              }`} />
            )}
          </button>
        </div>

        <div className="pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">URL de tu portafolio</p>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
            {portfolioPublic ? (
              <Eye size={14} className="text-green-600 flex-shrink-0" />
            ) : (
              <EyeOff size={14} className="text-gray-400 flex-shrink-0" />
            )}
            <span className="flex-1 font-mono text-xs text-gray-700 truncate">
              {typeof window !== "undefined" ? window.location.origin : "smartfolio.co"}/p/{profile?.username_slug}
            </span>
            <button onClick={copyUrl}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
              <Copy size={13} />
            </button>
            {portfolioPublic && (
              <Link href={`/p/${profile?.username_slug}`} target="_blank"
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
                <ExternalLink size={13} />
              </Link>
            )}
          </div>
          {!portfolioPublic && (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
              ⚠️ Tu portafolio está oculto. Actívalo para que los reclutadores puedan verlo.
            </p>
          )}
        </div>
      </div>

      {/* Información de la cuenta */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Información de la cuenta</h2>
        <div className="space-y-3">
          {[
            { label:"Correo electrónico", value:email },
            { label:"Plan actual",        value:profile?.plan === "premium" ? "⭐ Premium" : "Gratuito" },
            { label:"Rol",                value:profile?.role === "admin" ? "Administrador" : "Estudiante" },
            { label:"Miembro desde",      value:profile?.created_at ? new Date(profile.created_at).toLocaleDateString("es-CO",{ year:"numeric",month:"long",day:"numeric" }) : "—" },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{f.label}</span>
              <span className="text-sm font-medium text-gray-900">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Links rápidos */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href:"/profile",    label:"Editar perfil",    emoji:"👤" },
            { href:"/skills",     label:"Mis habilidades",  emoji:"🏷️" },
            { href:"/academic",   label:"Mis registros",    emoji:"📚" },
            { href:"/cv-builder", label:"Generar CV",       emoji:"📄" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium text-gray-700">
              <span>{l.emoji}</span> {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info UTS */}
      <div className="bg-green-50 rounded-2xl border border-green-100 p-5 text-center">
        <p className="text-xs text-green-700 font-semibold">Smartfolio · Proyecto BAN 00329</p>
        <p className="text-xs text-green-600 mt-1">
          Tecnología en Desarrollo de Sistemas Informáticos · UTS Bucaramanga
        </p>
        <p className="text-xs text-green-500 mt-0.5">
          Nicolás Vega Ruiz · Juan Carlos Rúgeles Navarro
        </p>
      </div>
    </div>
  );
}
