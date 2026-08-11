"use client";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Loader2, Eye, EyeOff, Copy, ExternalLink,
  Globe, User, Lock, Zap, Palette, FileText,
} from "lucide-react";
import type { Profile, CVConfiguration } from "@/types";
import Link from "next/link";

interface Props {
  profile:  Profile | null;
  userId:   string;
  email:    string;
  cvConfig: CVConfiguration | null;
}

type Section = "portafolio" | "cuenta" | "seguridad" | "accesos";

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "portafolio", label: "Portafolio", icon: <Globe  size={14} /> },
  { id: "cuenta",     label: "Cuenta",     icon: <User   size={14} /> },
  { id: "seguridad",  label: "Seguridad",  icon: <Lock   size={14} /> },
  { id: "accesos",    label: "Accesos",    icon: <Zap    size={14} /> },
];

export default function SettingsClient({ profile, userId, email, cvConfig }: Props) {
  const [portfolioPublic, setPortfolioPublic] = useState(profile?.portfolio_public ?? true);
  const [saving,          setSaving]          = useState(false);
  const [activeSection,   setActiveSection]   = useState<Section>("portafolio");
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

  const portfolioUrl = `${typeof window !== "undefined" ? window.location.origin : "smartfolio.co"}/p/${profile?.username_slug}`;

  return (
    <div className="space-y-5">

      {/* ── Navegación por secciones ───────────────────────── */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
        {SECTIONS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={[
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all",
              activeSection === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── PORTAFOLIO ─────────────────────────────────────── */}
      {activeSection === "portafolio" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Visibilidad del portafolio</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Controla quién puede ver tu portafolio público.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">Portafolio público</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {portfolioPublic
                    ? "Cualquier persona con el enlace puede verlo."
                    : "Solo tú puedes verlo."}
                </p>
              </div>
              <button
                onClick={togglePortfolio}
                disabled={saving}
                className={[
                  "relative w-11 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
                  portfolioPublic ? "bg-green-600" : "bg-gray-300",
                ].join(" ")}
                aria-checked={portfolioPublic}
                role="switch"
              >
                {saving ? (
                  <Loader2 size={10} className="animate-spin absolute inset-0 m-auto text-white" />
                ) : (
                  <span className={[
                    "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                    portfolioPublic ? "translate-x-5" : "translate-x-0.5",
                  ].join(" ")} />
                )}
              </button>
            </div>

            {/* URL */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Tu URL pública
              </p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                {portfolioPublic
                  ? <Eye    size={14} className="text-green-600 flex-shrink-0" />
                  : <EyeOff size={14} className="text-gray-400  flex-shrink-0" />}
                <span className="flex-1 font-mono text-xs text-gray-700 truncate">
                  {portfolioUrl}
                </span>
                <button
                  onClick={copyUrl}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copiar URL"
                >
                  <Copy size={13} />
                </button>
                {portfolioPublic && (
                  <Link
                    href={`/p/${profile?.username_slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Abrir portafolio"
                  >
                    <ExternalLink size={13} />
                  </Link>
                )}
              </div>
              {!portfolioPublic && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ Tu portafolio está oculto. Actívalo para que los reclutadores puedan verlo.
                </p>
              )}
            </div>

            {/* Config CV actual */}
            {cvConfig && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Configuración actual del CV
                </p>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">
                      {cvConfig.template?.name ?? "Sin plantilla"}
                    </span>
                  </div>
                  {cvConfig.accent_color && (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                        style={{ background: cvConfig.accent_color }}
                      />
                      <span className="text-xs font-mono text-gray-500">
                        {cvConfig.accent_color.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <Link
                    href="/cv-builder"
                    className="text-xs text-green-600 hover:text-green-700 font-medium flex-shrink-0"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CUENTA ─────────────────────────────────────────── */}
      {activeSection === "cuenta" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Información de la cuenta</h2>
            <p className="text-xs text-gray-500 mt-0.5">Datos de tu cuenta en Smartfolio.</p>
          </div>
          <div className="p-6">
            <div className="space-y-1">
              {[
                { label: "Correo electrónico", value: email },
                { label: "Nombre completo",    value: profile ? `${profile.first_name} ${profile.last_name}` : "—" },
                { label: "Usuario",            value: profile?.username_slug ?? "—" },
                { label: "Plan actual",        value: profile?.plan === "premium" ? "⭐ Premium" : "Gratuito" },
                { label: "Rol",                value: profile?.role === "admin" ? "Administrador" : "Estudiante" },
                {
                  label: "Miembro desde",
                  value: profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("es-CO", {
                        year: "numeric", month: "long", day: "numeric",
                      })
                    : "—",
                },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-500">{f.label}</span>
                  <span className="text-sm font-medium text-gray-900">{f.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
                style={{ background: "#16a34a" }}
              >
                <User size={14} /> Editar perfil completo
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── SEGURIDAD ──────────────────────────────────────── */}
      {activeSection === "seguridad" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Cambiar contraseña</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Usa una contraseña segura con al menos 8 caracteres.
            </p>
          </div>
          <div className="p-6">
            <ChangePasswordForm />
          </div>
        </div>
      )}

      {/* ── ACCESOS RÁPIDOS ────────────────────────────────── */}
      {activeSection === "accesos" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Accesos rápidos</h2>
            <p className="text-xs text-gray-500 mt-0.5">Navega rápidamente a cualquier sección.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/profile",    label: "Editar perfil",   emoji: "👤" },
                { href: "/skills",     label: "Mis habilidades", emoji: "🏷️" },
                { href: "/academic",   label: "Mis registros",   emoji: "📚" },
                { href: "/cv-builder", label: "Generar CV",      emoji: "📄" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2.5 p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 group"
                >
                  <span className="text-base">{l.emoji}</span>
                  <span>{l.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Info UTS ────────────────────────────────────────── */}
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