"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateCVData } from "@/lib/cv-generator";
import type {
  Profile, AcademicRecord, Skill, CVTemplate,
  CVConfiguration, RecordType,
} from "@/types";
import { RECORD_TYPE_LABELS } from "@/types";
import { toast } from "sonner";
import {
  Loader2, CheckCircle2, Eye, Share2, FileText,
  Layout, Palette, SlidersHorizontal, BookOpen,
  User, Wrench, Award, ChevronRight,
  Type, AlignJustify,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import PDFDownloadButton from "@/components/cv-templates/PDFDownloadButton";

/* ── Lazy-load preview components ───────────────────────── */
const CVPreviewModern    = dynamic(() => import("@/components/cv-templates/CVPreviewModern"),    { ssr:false });
const CVPreviewClassic   = dynamic(() => import("@/components/cv-templates/CVPreviewClassic"),   { ssr:false });
const CVPreviewExecutive = dynamic(() => import("@/components/cv-templates/CVPreviewExecutive"), { ssr:false });
const CVPreviewCreative  = dynamic(() => import("@/components/cv-templates/CVPreviewCreative"),  { ssr:false });
const CVPreviewMinimal   = dynamic(() => import("@/components/cv-templates/CVPreviewMinimal"),   { ssr:false });
const CVPreviewTech      = dynamic(() => import("@/components/cv-templates/CVPreviewTech"),      { ssr:false });

/* ── Props ───────────────────────────────────────────────── */
interface Props {
  profile:   Profile | null;
  records:   AcademicRecord[];
  skills:    Skill[];
  templates: CVTemplate[];
  config:    CVConfiguration | null;
}

/* ── Constants ───────────────────────────────────────────── */
const ACCENT_COLORS = [
  { hex:"#16a34a", name:"Verde"   },
  { hex:"#2563eb", name:"Azul"    },
  { hex:"#7c3aed", name:"Violeta" },
  { hex:"#db2777", name:"Rosa"    },
  { hex:"#d97706", name:"Ámbar"   },
  { hex:"#0891b2", name:"Cian"    },
  { hex:"#374151", name:"Gris"    },
  { hex:"#dc2626", name:"Rojo"    },
  { hex:"#0f172a", name:"Negro"   },
];

/** Static template registry — works even if DB has fewer entries */
const TEMPLATE_REGISTRY: CVTemplate[] = [
  { id:"t-modern",    name:"Moderno",      description:"Barra lateral colorida con foto",         template_key:"modern",    is_active:true, is_premium:false, preview_url:null },
  { id:"t-classic",   name:"Clásico",      description:"Encabezado centrado, diseño tradicional",  template_key:"classic",   is_active:true, is_premium:false, preview_url:null },
  { id:"t-executive", name:"Ejecutivo",    description:"Minimalista y elegante, máximo impacto",   template_key:"executive", is_active:true, is_premium:false, preview_url:null },
  { id:"t-creative",  name:"Creativo",     description:"Header bold y sidebar de habilidades",     template_key:"creative",  is_active:true, is_premium:false, preview_url:null },
  { id:"t-minimal",   name:"Minimalista",  description:"Tipografía serif, limpieza total",         template_key:"minimal",   is_active:true, is_premium:false, preview_url:null },
  { id:"t-tech",      name:"Tecnológico",  description:"Sidebar oscuro, estilo código/dev",        template_key:"tech",      is_active:true, is_premium:false, preview_url:null },
];

const FONT_OPTIONS = [
  { key:"sans",  label:"Sans-Serif", hint:"Moderno y limpio" },
  { key:"serif", label:"Serif",      hint:"Clásico y elegante" },
  { key:"mono",  label:"Monospace",  hint:"Técnico / developer" },
];

const SIZE_OPTIONS  = [
  { key:"sm", label:"Pequeño" },
  { key:"md", label:"Mediano" },
  { key:"lg", label:"Grande"  },
];

const SPACE_OPTIONS = [
  { key:"compact",  label:"Compacto" },
  { key:"normal",   label:"Normal"   },
  { key:"relaxed",  label:"Amplio"   },
];

type Tab = "plantilla" | "estilo" | "secciones" | "resumen";

/* ── Mini SVG thumbnails ─────────────────────────────────── */
function TemplateThumb({ templateKey, color }: { templateKey:string; color:string }) {
  switch (templateKey) {
    case "modern": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f8fafc" rx="3"/>
        <rect width="26" height="100" fill={color}/>
        <circle cx="13" cy="20" r="7" fill="white" fillOpacity=".25"/>
        {[34,42,50,58,66,74].map((y,i) => (
          <rect key={y} x="31" y={y} width={32-(i%3)*5} height="2" fill="#e2e8f0" rx="1"/>
        ))}
      </svg>
    );
    case "classic": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f8fafc" rx="3"/>
        <rect x="15" y="10" width="50" height="5" fill={color} rx="1"/>
        <rect x="8" y="18" width="64" height=".8" fill={color} fillOpacity=".35"/>
        {[25,33,41,49,57,65,73].map((y,i) => (
          <rect key={y} x="8" y={y} width={50-(i%4)*7} height="2" fill="#e2e8f0" rx="1"/>
        ))}
      </svg>
    );
    case "executive": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f8fafc" rx="3"/>
        <rect x="8" y="10" width="38" height="5" fill="#111827" rx="1"/>
        <rect x="8" y="18" width="20" height="1.5" fill={color} rx="1"/>
        {[28,36,44,52,60,68,76].map((y,i) => (
          <rect key={y} x="8" y={y} width={55-(i%3)*8} height="2" fill="#e2e8f0" rx="1"/>
        ))}
      </svg>
    );
    case "creative": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f8fafc" rx="3"/>
        <rect width="80" height="24" fill={color} rx="3"/>
        <circle cx="14" cy="12" r="7" fill="white" fillOpacity=".2"/>
        <rect x="26" y="7" width="28" height="3.5" fill="white" rx="1"/>
        <rect x="26" y="14" width="20" height="2" fill="white" fillOpacity=".6" rx="1"/>
        {[32,40,48,56].map((y,i) => (
          <rect key={y} x="10" y={y} width={50-(i%3)*6} height="2.5" fill="#e2e8f0" rx="1"/>
        ))}
        <rect x="56" y="28" width="18" height="64" fill="#f1f5f9" rx="0"/>
        {[30,36,42,48,54,60].map(y => (
          <rect key={y} x="58" y={y} width="13" height="1.5" fill="#cbd5e1" rx="1"/>
        ))}
      </svg>
    );
    case "minimal": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="white" rx="3"/>
        <rect x="8" y="10" width="42" height="6" fill="#09090b" rx="1"/>
        <rect x="8" y="20" width="64" height=".5" fill="#e4e4e7"/>
        {[28,36,44,52,60,68,76].map((y,i) => (
          <rect key={y} x="8" y={y} width={52-(i%4)*7} height="1.5" fill="#a1a1aa" rx="1"/>
        ))}
      </svg>
    );
    case "tech": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f8fafc" rx="3"/>
        <rect width="24" height="100" fill="#0f172a"/>
        <circle cx="12" cy="18" r="6" fill={color} fillOpacity=".3"/>
        {[30,38,46].map(y => (
          <rect key={y} x="4" y={y} width="14" height="1.5" fill={color} fillOpacity=".5" rx="1"/>
        ))}
        {[14,22,30,38,46,54,62,70].map((y,i) => (
          <rect key={y} x="30" y={y} width={36-(i%3)*5} height="2" fill="#e2e8f0" rx="1"/>
        ))}
        <rect x="28" y="10" width="44" height="1.5" fill={color} rx="1"/>
      </svg>
    );
    default: return <div className="w-full h-full bg-gray-100" />;
  }
}

/* ── Component ───────────────────────────────────────────── */
export default function CVBuilderClient({ profile, records, skills, templates, config }: Props) {
  /* ── State ── */
  const [selectedTemplate, setSelectedTemplate] = useState(
    config?.template?.template_key ?? templates[0]?.template_key ?? "modern"
  );
  const [accentColor,    setAccentColor]    = useState(config?.accent_color ?? "#16a34a");
  const [fontFamily,     setFontFamily]     = useState("sans");
  const [fontSize,       setFontSize]       = useState("md");
  const [spacing,        setSpacing]        = useState("normal");
  const [hiddenSections, setHiddenSections] = useState<Set<RecordType>>(new Set());
  const [saving,         setSaving]         = useState(false);
  const [tab,            setTab]            = useState<Tab>("plantilla");
  const supabase = createClient();

  /* ── Merged template list (DB overrides static for matching keys) ── */
  const mergedTemplates = TEMPLATE_REGISTRY.map((st) => {
    const dbT = (templates ?? []).find((t) => t.template_key === st.template_key);
    return dbT ?? st;
  });
  const currentTemplate = mergedTemplates.find((t) => t.template_key === selectedTemplate) ?? mergedTemplates[0];

  /* ── No profile guard ── */
  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
        <FileText size={28} className="text-gray-400" />
      </div>
      <p className="font-semibold text-gray-700">Perfil incompleto</p>
      <p className="text-gray-500 text-sm">
        Completa tu <a href="/profile" className="underline text-green-600 font-medium">perfil</a> antes de generar el CV.
      </p>
    </div>
  );

  /* ── CV data with all customizations ── */
  const filteredRecords = records.filter((r) => !hiddenSections.has(r.record_type));
  const extendedConfig  = {
    ...(config ?? {
      id:"", profile_id:profile.id, template_id:null,
      sections_config:{} as any, last_generated_at:null, updated_at:"",
    }),
    accent_color:  accentColor,
    template:      currentTemplate,
    // Extended client-only options consumed by Preview/Document components
    font_family:   fontFamily,
    font_size:     fontSize,
    spacing:       spacing,
  } as CVConfiguration & { font_family:string; font_size:string; spacing:string };

  const cvData = generateCVData(profile, filteredRecords, skills, extendedConfig);
  const visibleRecords = records.filter((r) => r.is_visible_in_cv && !hiddenSections.has(r.record_type));

  /* ── Unique section types that have records ── */
  const sectionTypes = [...new Set(records.filter(r => r.is_visible_in_cv).map(r => r.record_type))];

  /* ── Actions ── */
  const saveConfig = async () => {
    setSaving(true);
    await supabase.from("cv_configurations").upsert({
      profile_id:        profile.id,
      template_id:       currentTemplate?.id ?? null,
      accent_color:      accentColor,
      last_generated_at: new Date().toISOString(),
    }, { onConflict:"profile_id" });
    toast.success("Configuración guardada ✓");
    setSaving(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${profile.username_slug}`);
    toast.success("¡Enlace copiado! 🔗");
  };

  const toggleSection = (type: RecordType) => {
    setHiddenSections((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  /* ── Render preview ── */
  const renderPreview = () => {
    const props = { data: cvData };
    switch (selectedTemplate) {
      case "classic":   return <CVPreviewClassic   {...props} />;
      case "executive": return <CVPreviewExecutive {...props} />;
      case "creative":  return <CVPreviewCreative  {...props} />;
      case "minimal":   return <CVPreviewMinimal   {...props} />;
      case "tech":      return <CVPreviewTech      {...props} />;
      default:          return <CVPreviewModern    {...props} />;
    }
  };

  const tabs: { id:Tab; label:string; icon:React.ReactNode }[] = [
    { id:"plantilla", label:"Plantilla", icon:<Layout size={13}/> },
    { id:"estilo",    label:"Estilo",    icon:<Palette size={13}/> },
    { id:"secciones", label:"Secciones", icon:<SlidersHorizontal size={13}/> },
    { id:"resumen",   label:"Resumen",   icon:<BookOpen size={13}/> },
  ];

  /* ════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generador de CV</h1>
          <p className="text-gray-500 text-sm mt-1">
            {visibleRecords.length} registros visibles · {skills.length} habilidades · {mergedTemplates.length} plantillas disponibles
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-colors hover:bg-blue-50"
            style={{ borderColor:"#2563eb", color:"#2563eb" }}>
            <Share2 size={15}/> Compartir
          </button>
          <button onClick={saveConfig} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60"
            style={{ background:"#16a34a" }}>
            {saving
              ? <><Loader2 size={15} className="animate-spin"/> Guardando…</>
              : <><CheckCircle2 size={15}/> Guardar</>}
          </button>
          <PDFDownloadButton
            data={cvData}
            fileName={`CV_${profile.first_name}_${profile.last_name}_Smartfolio.pdf`}
            templateKey={selectedTemplate}
          />
        </div>
      </div>

      {/* ── Layout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">

        {/* ── Side panel ─────────────────────────────── */}
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {tabs.map(({ id, label, icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors",
                    tab === id
                      ? "text-green-700 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}>
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="p-4">

              {/* ── Tab: Plantilla ── */}
              {tab === "plantilla" && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-3">Elige el diseño de tu CV:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {mergedTemplates.map((t) => (
                      <button key={t.id} onClick={() => setSelectedTemplate(t.template_key)}
                        className={cn(
                          "text-left rounded-xl border-2 transition-all overflow-hidden",
                          selectedTemplate === t.template_key
                            ? "border-green-500 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        )}>
                        {/* Thumbnail */}
                        <div className="h-16 bg-gray-50 p-1 flex items-center justify-center overflow-hidden">
                          <TemplateThumb templateKey={t.template_key} color={accentColor} />
                        </div>
                        <div className="p-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-semibold text-gray-900 text-xs truncate">{t.name}</p>
                            {selectedTemplate === t.template_key && (
                              <CheckCircle2 size={13} style={{ color:"#16a34a" }} className="flex-shrink-0" />
                            )}
                          </div>
                          {t.description && (
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">{t.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tab: Estilo ── */}
              {tab === "estilo" && (
                <div className="space-y-5">

                  {/* Color */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Palette size={12}/> Color de acento
                    </p>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {ACCENT_COLORS.map(({ hex, name }) => (
                        <button key={hex} onClick={() => setAccentColor(hex)} title={name}
                          className={cn(
                            "aspect-square rounded-xl border-2 transition-all hover:scale-105 relative",
                            accentColor === hex ? "border-gray-900 scale-105 shadow-md" : "border-transparent hover:border-gray-300"
                          )}
                          style={{ background:hex }}>
                          {accentColor === hex && (
                            <CheckCircle2 size={11} className="absolute top-1 right-1 text-white drop-shadow"/>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 flex-shrink-0"/>
                      <span className="text-xs font-mono text-gray-500">{accentColor.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Type size={12}/> Tipografía
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {FONT_OPTIONS.map(({ key, label, hint }) => (
                        <button key={key} onClick={() => setFontFamily(key)}
                          className={cn(
                            "p-2 rounded-xl border text-left transition-all",
                            fontFamily === key
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}>
                          <p className="text-xs font-semibold text-gray-800">{label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{hint}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font size */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <AlignJustify size={12}/> Tamaño de fuente
                    </p>
                    <div className="flex gap-1.5">
                      {SIZE_OPTIONS.map(({ key, label }) => (
                        <button key={key} onClick={() => setFontSize(key)}
                          className={cn(
                            "flex-1 py-2 rounded-xl border text-xs font-medium transition-all",
                            fontSize === key
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Espaciado</p>
                    <div className="flex gap-1.5">
                      {SPACE_OPTIONS.map(({ key, label }) => (
                        <button key={key} onClick={() => setSpacing(key)}
                          className={cn(
                            "flex-1 py-2 rounded-xl border text-xs font-medium transition-all",
                            spacing === key
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live preview pill */}
                  <div className="rounded-xl overflow-hidden border border-gray-200 h-12">
                    <div className="h-full flex">
                      <div className="w-1/3 h-full" style={{ background:accentColor }}/>
                      <div className="flex-1 bg-white flex flex-col justify-center px-3 gap-1.5">
                        <div className="h-1.5 w-14 bg-gray-200 rounded-full"/>
                        <div className="h-1.5 w-9  bg-gray-100 rounded-full"/>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tab: Secciones ── */}
              {tab === "secciones" && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-3">
                    Activa o desactiva secciones en tu CV:
                  </p>
                  {sectionTypes.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-xs">
                      No hay registros visibles aún.
                      <br />
                      <a href="/academic" className="text-green-600 underline mt-1 inline-block">
                        Agregar registros académicos
                      </a>
                    </div>
                  ) : sectionTypes.map((type) => {
                    const isHidden = hiddenSections.has(type);
                    const count    = records.filter(r => r.is_visible_in_cv && r.record_type === type).length;
                    return (
                      <div key={type}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                          isHidden ? "border-gray-100 bg-gray-50 opacity-60" : "border-green-100 bg-green-50"
                        )}
                        onClick={() => toggleSection(type)}>
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0",
                          isHidden ? "bg-gray-200 text-gray-400" : "bg-green-100 text-green-600"
                        )}>
                          {isHidden ? "—" : "✓"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 truncate">{RECORD_TYPE_LABELS[type]}</p>
                          <p className="text-[10px] text-gray-400">{count} registro{count !== 1 ? "s" : ""}</p>
                        </div>
                        {/* Toggle switch */}
                        <div className={cn(
                          "w-9 h-5 rounded-full transition-colors relative flex-shrink-0",
                          isHidden ? "bg-gray-300" : "bg-green-500"
                        )}>
                          <div className={cn(
                            "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                            isHidden ? "translate-x-0.5" : "translate-x-4"
                          )}/>
                        </div>
                      </div>
                    );
                  })}
                  {hiddenSections.size > 0 && (
                    <button onClick={() => setHiddenSections(new Set())}
                      className="w-full text-xs text-green-600 hover:text-green-700 font-medium pt-1">
                      Mostrar todas las secciones
                    </button>
                  )}
                </div>
              )}

              {/* ── Tab: Resumen ── */}
              {tab === "resumen" && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-3">Estado actual de tu CV:</p>
                  {[
                    { icon:<User size={12}/>, label:"Datos personales",   value:`${profile.first_name} ${profile.last_name}`,          ok:true,  href:"/profile" },
                    { icon:<BookOpen size={12}/>, label:"Registros visibles",  value:`${visibleRecords.length} de ${records.length}`,  ok:visibleRecords.length > 0, href:"/academic" },
                    { icon:<Wrench size={12}/>, label:"Habilidades",         value:`${skills.length} registradas`,                     ok:skills.length > 0, href:"/skills" },
                    { icon:<Award size={12}/>, label:"Plantilla",            value:currentTemplate?.name ?? "—",                       ok:!!currentTemplate, href:undefined },
                    { icon:<Palette size={12}/>, label:"Color de acento",    value:accentColor.toUpperCase(),                          ok:true, href:undefined },
                  ].map((item) => (
                    <div key={item.label}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border",
                        item.ok ? "border-green-100 bg-green-50" : "border-amber-100 bg-amber-50"
                      )}>
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                        item.ok ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                      )}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                        <p className="text-[10px] text-gray-500 truncate">{item.value}</p>
                      </div>
                      {item.href && (
                        <a href={item.href}><ChevronRight size={13} className="text-gray-300 hover:text-gray-500"/></a>
                      )}
                    </div>
                  ))}
                  {visibleRecords.length === 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-700 leading-relaxed">
                      ⚠️ Ve a{" "}
                      <a href="/academic" className="underline font-semibold">Académico</a>
                      {" "}y activa &quot;Incluir en CV&quot; en tus registros.
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </aside>

        {/* ── Preview panel ───────────────────────────── */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Eye size={12}/> Vista previa en tiempo real
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0" style={{ background:accentColor }}/>
              <span className="text-xs text-gray-500 font-medium">
                {currentTemplate?.name} · {accentColor.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200 flex-1 min-h-[620px]">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[580px]">
              {renderPreview()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}