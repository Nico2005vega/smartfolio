"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateCVData } from "@/lib/cv-generator";
import type { Profile, AcademicRecord, Skill, CVTemplate, CVConfiguration } from "@/types";
import { toast } from "sonner";
import {
  Loader2, CheckCircle2, Eye, Share2,
  Layout, Palette, SlidersHorizontal,
  User, BookOpen, Wrench, Award, ChevronRight, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import PDFDownloadButton from "@/components/cv-templates/PDFDownloadButton";

const CVPreviewModern    = dynamic(() => import("@/components/cv-templates/CVPreviewModern"),    { ssr: false });
const CVPreviewClassic   = dynamic(() => import("@/components/cv-templates/CVPreviewClassic"),   { ssr: false });
const CVPreviewExecutive = dynamic(() => import("@/components/cv-templates/CVPreviewExecutive"), { ssr: false });

interface Props {
  profile:   Profile | null;
  records:   AcademicRecord[];
  skills:    Skill[];
  templates: CVTemplate[];
  config:    CVConfiguration | null;
}

const ACCENT_COLORS = [
  { hex: "#16a34a", name: "Verde"   },
  { hex: "#2563eb", name: "Azul"    },
  { hex: "#7c3aed", name: "Violeta" },
  { hex: "#db2777", name: "Rosa"    },
  { hex: "#d97706", name: "Ámbar"   },
  { hex: "#0891b2", name: "Cian"    },
  { hex: "#374151", name: "Gris"    },
  { hex: "#dc2626", name: "Rojo"    },
];

type Tab = "plantilla" | "color" | "resumen";

// ── Mini previsualización SVG de cada plantilla ───────────────────
function TemplateThumb({ templateKey, color }: { templateKey: string; color: string }) {
  if (templateKey === "modern") return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <rect width="80" height="100" fill="#f8fafc" rx="4" />
      <rect width="26" height="100" fill={color} />
      <circle cx="13" cy="22" r="7" fill="white" fillOpacity="0.25" />
      {[36, 44, 52, 60, 68, 76].map((y, i) => (
        <rect key={y} x="31" y={y} width={34 - (i % 3) * 6} height="2.5" fill="#e2e8f0" rx="1" />
      ))}
      {[32, 40, 48, 56].map((y) => (
        <rect key={y} x="4" y={y} width="15" height="1.5" fill="white" fillOpacity="0.35" rx="1" />
      ))}
    </svg>
  );
  if (templateKey === "classic") return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <rect width="80" height="100" fill="#f8fafc" rx="4" />
      <rect x="8" y="10" width="44" height="5" fill={color} rx="1" />
      <rect x="8" y="18" width="64" height="1" fill={color} fillOpacity="0.35" />
      {[24, 32, 40, 48, 56, 64, 72].map((y, i) => (
        <rect key={y} x="8" y={y} width={50 - (i % 4) * 8} height="2.5" fill="#e2e8f0" rx="1" />
      ))}
    </svg>
  );
  // executive / fallback
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <rect width="80" height="100" fill="#f8fafc" rx="4" />
      <rect width="80" height="30" fill={color} />
      <circle cx="40" cy="15" r="8" fill="white" fillOpacity="0.2" />
      {[38, 46, 54, 62, 70, 78].map((y, i) => (
        <rect key={y} x="10" y={y} width={58 - (i % 3) * 10} height="2.5" fill="#e2e8f0" rx="1" />
      ))}
    </svg>
  );
}

export default function CVBuilderClient({ profile, records, skills, templates, config }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState(
    config?.template?.template_key ?? templates[0]?.template_key ?? "modern"
  );
  const [accentColor, setAccentColor] = useState(config?.accent_color ?? "#16a34a");
  const [saving, setSaving] = useState(false);
  const [tab, setTab]       = useState<Tab>("plantilla");
  const supabase = createClient();

  // ── Sin perfil ────────────────────────────────────────────────
  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
        <FileText size={28} className="text-gray-400" />
      </div>
      <p className="font-semibold text-gray-700">Perfil incompleto</p>
      <p className="text-gray-500 text-sm">
        Completa tu{" "}
        <a href="/profile" className="underline text-green-600 font-medium">perfil</a>{" "}
        antes de generar el CV.
      </p>
    </div>
  );

  // ── Datos del CV ──────────────────────────────────────────────
  const currentTemplate = templates.find(t => t.template_key === selectedTemplate);
  const cvData = generateCVData(profile, records, skills, {
    ...(config ?? {
      id: "", profile_id: profile.id, template_id: null,
      sections_config: {} as any, last_generated_at: null, updated_at: "",
    }),
    accent_color: accentColor,
    template: currentTemplate ?? null,
  });

  const visibleRecords = records.filter(r => r.is_visible_in_cv);

  // ── Acciones ─────────────────────────────────────────────────
  const saveConfig = async () => {
    setSaving(true);
    await supabase.from("cv_configurations").upsert({
      profile_id:        profile.id,
      template_id:       currentTemplate?.id ?? null,
      accent_color:      accentColor,
      last_generated_at: new Date().toISOString(),
    }, { onConflict: "profile_id" });
    toast.success("Configuración guardada ✓");
    setSaving(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${profile.username_slug}`);
    toast.success("¡Enlace copiado al portapapeles! 🔗");
  };

  const renderPreview = () => {
    switch (selectedTemplate) {
      case "classic":   return <CVPreviewClassic   data={cvData} />;
      case "executive": return <CVPreviewExecutive data={cvData} />;
      default:          return <CVPreviewModern    data={cvData} />;
    }
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generador de CV</h1>
          <p className="text-gray-500 text-sm mt-1">
            {visibleRecords.length} registros visibles · {skills.length} habilidades
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-colors hover:bg-blue-50"
            style={{ borderColor: "#2563eb", color: "#2563eb" }}
          >
            <Share2 size={15} /> Compartir
          </button>

          <button
            onClick={saveConfig}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60"
            style={{ background: "#16a34a" }}
          >
            {saving
              ? <><Loader2 size={15} className="animate-spin" /> Guardando…</>
              : <><CheckCircle2 size={15} /> Guardar</>}
          </button>

          <PDFDownloadButton
            data={cvData}
            fileName={`CV_${profile.first_name}_${profile.last_name}_Smartfolio.pdf`}
            templateKey={selectedTemplate}
          />
        </div>
      </div>

      {/* ── Layout ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">

        {/* ── Panel izquierdo ──────────────────────────────── */}
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {([
                { id: "plantilla", label: "Plantilla", icon: <Layout size={13} /> },
                { id: "color",     label: "Color",     icon: <Palette size={13} /> },
                { id: "resumen",   label: "Resumen",   icon: <SlidersHorizontal size={13} /> },
              ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors",
                    tab === id
                      ? "text-green-700 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            <div className="p-4">

              {/* ── Tab: Plantilla ─── */}
              {tab === "plantilla" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">Elige el diseño de tu CV:</p>
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.template_key)}
                      className={cn(
                        "w-full text-left rounded-xl border-2 transition-all overflow-hidden",
                        selectedTemplate === t.template_key
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3 p-3">
                        {/* Miniatura */}
                        <div className="w-14 h-[72px] rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <TemplateThumb templateKey={t.template_key} color={accentColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                            {selectedTemplate === t.template_key && (
                              <CheckCircle2 size={15} style={{ color: "#16a34a" }} />
                            )}
                          </div>
                          {t.description && (
                            <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
                              {t.description}
                            </p>
                          )}
                          {selectedTemplate === t.template_key && (
                            <span className="inline-block mt-1.5 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                              Seleccionada
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Tab: Color ─── */}
              {tab === "color" && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500">Color de acento del CV:</p>

                  <div className="grid grid-cols-4 gap-2.5">
                    {ACCENT_COLORS.map(({ hex, name }) => (
                      <button
                        key={hex}
                        onClick={() => setAccentColor(hex)}
                        title={name}
                        className={cn(
                          "aspect-square rounded-xl border-2 transition-all hover:scale-105 relative",
                          accentColor === hex
                            ? "border-gray-900 scale-105 shadow-md"
                            : "border-transparent hover:border-gray-300"
                        )}
                        style={{ background: hex }}
                      >
                        {accentColor === hex && (
                          <CheckCircle2
                            size={13}
                            className="absolute top-1 right-1 text-white drop-shadow"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-xs text-gray-500">Color personalizado:</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <div>
                        <p className="text-xs font-mono font-semibold text-gray-700">
                          {accentColor.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400">Cualquier color</p>
                      </div>
                    </div>
                  </div>

                  {/* Preview color */}
                  <div className="rounded-xl overflow-hidden border border-gray-200 h-14">
                    <div className="h-full flex">
                      <div className="w-1/3 h-full" style={{ background: accentColor }} />
                      <div className="flex-1 bg-white flex flex-col justify-center px-3 gap-1.5">
                        <div className="h-1.5 w-16 bg-gray-200 rounded-full" />
                        <div className="h-1.5 w-10 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tab: Resumen ─── */}
              {tab === "resumen" && (
                <div className="space-y-2.5">
                  <p className="text-xs text-gray-500 mb-1">Contenido de tu CV:</p>

                  {[
                    {
                      icon: <User size={13} />,
                      label: "Datos personales",
                      value: `${profile.first_name} ${profile.last_name}`,
                      ok: true,
                      href: "/profile",
                    },
                    {
                      icon: <BookOpen size={13} />,
                      label: "Registros académicos",
                      value: `${visibleRecords.length} de ${records.length} visibles`,
                      ok: visibleRecords.length > 0,
                      href: "/academic",
                    },
                    {
                      icon: <Wrench size={13} />,
                      label: "Habilidades",
                      value: skills.length > 0 ? `${skills.length} registradas` : "Sin habilidades",
                      ok: skills.length > 0,
                      href: "/skills",
                    },
                    {
                      icon: <Award size={13} />,
                      label: "Plantilla",
                      value: currentTemplate?.name ?? "—",
                      ok: !!currentTemplate,
                      href: undefined,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border",
                        item.ok
                          ? "border-green-100 bg-green-50"
                          : "border-amber-100 bg-amber-50"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                        item.ok
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-600"
                      )}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                        <p className="text-xs text-gray-500 truncate">{item.value}</p>
                      </div>
                      {item.href && (
                        <a href={item.href}>
                          <ChevronRight size={13} className="text-gray-300 hover:text-gray-500 transition-colors" />
                        </a>
                      )}
                    </div>
                  ))}

                  {visibleRecords.length === 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 leading-relaxed">
                      ⚠️ Ningún registro está visible en el CV. Ve a{" "}
                      <a href="/academic" className="underline font-semibold">Académico</a>{" "}
                      y activa &quot;Incluir en CV&quot;.
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </aside>

        {/* ── Panel derecho: Preview ────────────────────────── */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Eye size={12} />
              Vista previa — el PDF puede variar ligeramente en tipografía
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-gray-200" style={{ background: accentColor }} />
              <span className="text-xs text-gray-500 font-medium">
                {currentTemplate?.name ?? "—"} · {accentColor.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200 flex-1 min-h-[600px]">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[560px]">
              {renderPreview()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}