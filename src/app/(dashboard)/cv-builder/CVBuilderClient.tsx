"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateCVData } from "@/lib/cv-generator";
import type { Profile, AcademicRecord, Skill, CVTemplate, CVConfiguration } from "@/types";
import { toast } from "sonner";
import { Loader2, Palette, CheckCircle2, Eye, Settings2 } from "lucide-react";
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
  { hex: "#16a34a", name: "Verde" },
  { hex: "#2563eb", name: "Azul" },
  { hex: "#7c3aed", name: "Violeta" },
  { hex: "#db2777", name: "Rosa" },
  { hex: "#d97706", name: "Ámbar" },
  { hex: "#0891b2", name: "Cian" },
  { hex: "#374151", name: "Gris" },
];

export default function CVBuilderClient({ profile, records, skills, templates, config }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState(
    config?.template?.template_key ?? templates[0]?.template_key ?? "modern"
  );
  const [accentColor, setAccentColor] = useState(config?.accent_color ?? "#16a34a");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"template" | "color">("template");
  const supabase = createClient();

  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Completa tu <a href="/profile" className="underline text-green-600">perfil</a> antes de generar el CV.</p>
      </div>
    );
  }

  const currentTemplate = templates.find(t => t.template_key === selectedTemplate);
  const cvData = generateCVData(profile, records, skills, {
    ...(config ?? {
      id: "", profile_id: profile.id, template_id: null,
      sections_config: {} as any, last_generated_at: null, updated_at: ""
    }),
    accent_color: accentColor,
    template: currentTemplate ?? null,
  });

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

  const renderPreview = () => {
    switch (selectedTemplate) {
      case "classic":   return <CVPreviewClassic   data={cvData} />;
      case "executive": return <CVPreviewExecutive data={cvData} />;
      default:          return <CVPreviewModern    data={cvData} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generador de CV</h1>
          <p className="text-gray-500 text-sm mt-1">
            {records.filter(r => r.is_visible_in_cv).length} registros · {skills.length} habilidades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={saveConfig} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60"
            style={{ background: "#16a34a" }}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <PDFDownloadButton
            data={cvData}
            fileName={`CV_${profile.first_name}_${profile.last_name}_Smartfolio.pdf`}
            templateKey={selectedTemplate}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[
                { id: "template", label: "Plantilla", icon: Palette },
                { id: "color",    label: "Color",     icon: Settings2 },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors",
                    tab === id ? "bg-green-50 text-green-700 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"
                  )}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {tab === "template" && (
                <div className="space-y-2">
                  {templates.map((t) => (
                    <button key={t.id} onClick={() => setSelectedTemplate(t.template_key)}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border-2 transition-all",
                        selectedTemplate === t.template_key
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        {selectedTemplate === t.template_key && (
                          <CheckCircle2 size={15} style={{ color: "#16a34a" }} />
                        )}
                      </div>
                      {t.description && (
                        <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {tab === "color" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">Color de acento:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {ACCENT_COLORS.map(({ hex, name }) => (
                      <button key={hex} onClick={() => setAccentColor(hex)} title={name}
                        className={cn(
                          "w-full aspect-square rounded-xl border-2 transition-all hover:scale-105",
                          accentColor === hex ? "border-gray-900 scale-105" : "border-transparent"
                        )}
                        style={{ background: hex }} />
                    ))}
                  </div>
                  <input type="color" value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer border border-gray-200" />
                </div>
              )}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Eye size={12} /> Vista previa
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200 min-h-96">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-96">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}