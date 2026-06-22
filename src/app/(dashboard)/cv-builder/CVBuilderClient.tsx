"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateCVData } from "@/lib/cv-generator";
import type { Profile, AcademicRecord, Skill, CVTemplate, CVConfiguration, RecordType } from "@/types";
import { RECORD_TYPE_LABELS } from "@/types";
import { toast } from "sonner";
import {
  Loader2, CheckCircle2, Eye, Share2, FileText,
  Layout, Palette, SlidersHorizontal, BookOpen,
  User, Wrench, Award, ChevronRight, Sparkles,
  Circle, Square, RectangleHorizontal, Minus,
  AlignLeft, Tag, BarChart2, List,
  Sun, Moon, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import PDFDownloadButton from "@/components/cv-templates/PDFDownloadButton";

const CVPreviewModern    = dynamic(() => import("@/components/cv-templates/CVPreviewModern"),    { ssr:false });
const CVPreviewClassic   = dynamic(() => import("@/components/cv-templates/CVPreviewClassic"),   { ssr:false });
const CVPreviewExecutive = dynamic(() => import("@/components/cv-templates/CVPreviewExecutive"), { ssr:false });
const CVPreviewCreative  = dynamic(() => import("@/components/cv-templates/CVPreviewCreative"),  { ssr:false });
const CVPreviewMinimal   = dynamic(() => import("@/components/cv-templates/CVPreviewMinimal"),   { ssr:false });
const CVPreviewTech      = dynamic(() => import("@/components/cv-templates/CVPreviewTech"),      { ssr:false });

interface Props {
  profile:   Profile | null;
  records:   AcademicRecord[];
  skills:    Skill[];
  templates: CVTemplate[];
  config:    CVConfiguration | null;
}

/* ── Static registry ─────────────────────────────────────── */
const REGISTRY: CVTemplate[] = [
  { id:"t1", name:"Moderna",      description:"Sidebar con foto y acento de color", template_key:"modern",    is_active:true, is_premium:false, preview_url:null },
  { id:"t2", name:"Clásica",      description:"Encabezado centrado, formato tradicional", template_key:"classic",   is_active:true, is_premium:false, preview_url:null },
  { id:"t3", name:"Ejecutiva",    description:"Minimalista, tipografía en protagonismo", template_key:"executive", is_active:true, is_premium:false, preview_url:null },
  { id:"t4", name:"Creativa",     description:"Header bold + sidebar de habilidades", template_key:"creative",  is_active:true, is_premium:false, preview_url:null },
  { id:"t5", name:"Minimalista",  description:"Serif elegante, espacios amplios", template_key:"minimal",   is_active:true, is_premium:false, preview_url:null },
  { id:"t6", name:"Tecnológica",  description:"Sidebar oscuro, estilo código/dev", template_key:"tech",      is_active:true, is_premium:false, preview_url:null },
];

/* ── Colour palettes ─────────────────────────────────────── */
const PALETTES = [
  { name:"Esmeralda",  hex:"#059669" },
  { name:"Cielo",      hex:"#0284c7" },
  { name:"Índigo",     hex:"#4f46e5" },
  { name:"Violeta",    hex:"#7c3aed" },
  { name:"Rosa",       hex:"#db2777" },
  { name:"Coral",      hex:"#e11d48" },
  { name:"Ámbar",      hex:"#d97706" },
  { name:"Lima",       hex:"#65a30d" },
  { name:"Cian",       hex:"#0891b2" },
  { name:"Slate",      hex:"#475569" },
  { name:"Carbón",     hex:"#1e293b" },
  { name:"Negro",      hex:"#09090b" },
];

type Tab  = "plantilla" | "estilo" | "diseno" | "secciones";

/* ── Mini SVG thumbnails ─────────────────────────────────── */
function TemplateThumb({ k, color }: { k:string; color:string }) {
  const c = color;
  switch(k) {
    case "modern": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f1f5f9" rx="4"/>
        <rect width="24" height="100" fill={c} rx="0"/>
        <rect x="2" y="2" width="20" height="100" fill={c}/>
        <circle cx="12" cy="18" r="7" fill="white" fillOpacity=".3"/>
        <rect x="4" y="30" width="14" height="1.5" fill="white" fillOpacity=".5" rx="1"/>
        <rect x="4" y="35" width="10" height="1.5" fill="white" fillOpacity=".4" rx="1"/>
        <rect x="4" y="44" width="13" height="1.5" fill="white" fillOpacity=".35" rx="1"/>
        {[52,57,62,68,74,80,86].map((y,i)=>(<rect key={y} x="30" y={y-10} width={34-(i%3)*5} height="2" fill="#cbd5e1" rx="1"/>))}
      </svg>
    );
    case "classic": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f8fafc" rx="4"/>
        <rect x="14" y="9" width="52" height="6" fill={c} rx="2"/>
        <rect x="8" y="19" width="64" height=".8" fill={c} fillOpacity=".4"/>
        {[26,34,42,50,58,66,74].map((y,i)=>(<rect key={y} x="8" y={y} width={52-(i%4)*7} height="2" fill="#e2e8f0" rx="1"/>))}
      </svg>
    );
    case "executive": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#fafafa" rx="4"/>
        <rect x="8" y="9" width="42" height="7" fill="#111827" rx="1"/>
        <rect x="8" y="20" width="24" height="2" fill={c} rx="1"/>
        {[30,40,50,60,70,80,88].map((y,i)=>(<rect key={y} x="8" y={y-2} width={55-(i%3)*8} height="2" fill="#e2e8f0" rx="1"/>))}
      </svg>
    );
    case "creative": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f8fafc" rx="4"/>
        <rect width="80" height="26" fill={c} rx="3"/>
        <circle cx="15" cy="13" r="8" fill="white" fillOpacity=".2"/>
        <rect x="28" y="7" width="30" height="4" fill="white" rx="1"/>
        <rect x="28" y="15" width="18" height="2" fill="white" fillOpacity=".65" rx="1"/>
        <rect x="8" y="34" width="3" height="44" fill="#e2e8f0" rx="1"/>
        {[34,43,52,61,70].map((y,i)=>(<rect key={y} x="14" y={y} width={38-(i%3)*5} height="2.5" fill="#e2e8f0" rx="1"/>))}
        <rect x="56" y="28" width="18" height="68" fill="#f1f5f9" rx="0"/>
        {[30,37,44,51,58,65,72].map(y=>(<rect key={y} x="58" y={y} width="12" height="1.5" fill="#cbd5e1" rx="1"/>))}
      </svg>
    );
    case "minimal": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="white" rx="4"/>
        <rect x="8" y="9" width="46" height="7" fill="#09090b" rx="1"/>
        <rect x="8" y="21" width="64" height=".6" fill="#e4e4e7"/>
        {[28,38,48,58,68,78].map((y,i)=>(<rect key={y} x="8" y={y} width={52-(i%4)*8} height="1.5" fill="#a1a1aa" rx="1"/>))}
      </svg>
    );
    case "tech": return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="100" fill="#f8fafc" rx="4"/>
        <rect width="22" height="100" fill="#0f172a" rx="0"/>
        <rect x="0" y="0" width="22" height="100" fill="#0f172a"/>
        <circle cx="11" cy="16" r="6" fill={c} fillOpacity=".35"/>
        {[28,35,42,50].map(y=>(<rect key={y} x="4" y={y} width="13" height="1.5" fill={c} fillOpacity=".45" rx="1"/>))}
        <rect x="26" y="8" width="44" height="1.5" fill={c} rx="1"/>
        {[16,25,34,43,52,61,70,79].map((y,i)=>(<rect key={y} x="28" y={y} width={36-(i%3)*5} height="2" fill="#e2e8f0" rx="1"/>))}
      </svg>
    );
    default: return <div className="w-full h-full bg-gray-200 rounded"/>;
  }
}

/* ════════════════════════════════════════════════════════════ */
export default function CVBuilderClient({ profile, records, skills, templates, config }: Props) {

  /* ── Core ── */
  const [tplKey, setTplKey]   = useState(config?.template?.template_key ?? "modern");
  const [tab,    setTab]      = useState<Tab>("plantilla");
  const [saving, setSaving]   = useState(false);
  const supabase = createClient();

  /* ── Colour ── */
  const [accentColor, setAccent]  = useState(config?.accent_color ?? "#059669");

  /* ── Typography ── */
  const [fontFamily, setFont]  = useState<"sans"|"serif"|"mono">("sans");
  const [fontSize,   setSize]  = useState(13);   // px 10–16
  const [lineHeight, setLH]    = useState(1.55); // 1.2–2.0

  /* ── Design ── */
  const [photoShape,  setPhotoShape]   = useState<"circle"|"rounded"|"square">("circle");
  const [sectionStyle,setSectionStyle] = useState<"underline"|"left-bar"|"filled"|"minimal">("underline");
  const [skillsStyle, setSkillsStyle]  = useState<"chips"|"dots"|"bars"|"text">("chips");
  const [cardStyle,   setCardStyle]    = useState<"flat"|"shadow"|"bordered"|"accent">("flat");
  const [showPhoto,   setShowPhoto]    = useState(true);
  const [showIcons,   setShowIcons]    = useState(true);
  const [uppercase,   setUppercase]    = useState(false);

  /* ── Sections visibility ── */
  const [hidden, setHidden] = useState<Set<RecordType>>(new Set());

  /* ── Merged templates ── */
  const allTpls = REGISTRY.map(st => (templates??[]).find(t=>t.template_key===st.template_key) ?? st);
  const currentTpl = allTpls.find(t=>t.template_key===tplKey) ?? allTpls[0];

  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center">
        <FileText size={28} className="text-gray-400"/>
      </div>
      <p className="font-bold text-gray-700">Completa tu perfil primero</p>
      <a href="/profile" className="text-sm text-green-600 underline">Ir al perfil →</a>
    </div>
  );

  /* ── CV Data ── */
  const filteredRecords = records.filter(r=>!hidden.has(r.record_type));
  const extConfig = {
    ...(config ?? { id:"",profile_id:profile.id,template_id:null,sections_config:{} as any,last_generated_at:null,updated_at:"" }),
    accent_color:  accentColor,
    template:      currentTpl,
    font_family:   fontFamily,
    font_size:     fontSize,
    line_height:   lineHeight,
    photo_shape:   photoShape,
    section_style: sectionStyle,
    skills_style:  skillsStyle,
    card_style:    cardStyle,
    show_photo:    showPhoto,
    show_icons:    showIcons,
    uppercase:     uppercase,
  } as CVConfiguration & Record<string,unknown>;

  const cvData        = generateCVData(profile, filteredRecords, skills, extConfig);
  const visibleRecs   = records.filter(r=>r.is_visible_in_cv && !hidden.has(r.record_type));
  const sectionTypes  = [...new Set(records.filter(r=>r.is_visible_in_cv).map(r=>r.record_type))];

  /* ── Actions ── */
  const save = async () => {
    setSaving(true);
    await supabase.from("cv_configurations").upsert({
      profile_id:profile.id, template_id:currentTpl?.id??null,
      accent_color:accentColor, last_generated_at:new Date().toISOString(),
    },{onConflict:"profile_id"});
    toast.success("Guardado ✓");
    setSaving(false);
  };

  const share = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${profile.username_slug}`);
    toast.success("¡Enlace copiado! 🔗");
  };

  const Preview = () => {
    const p = { data:cvData };
    switch(tplKey) {
      case "classic":   return <CVPreviewClassic   {...p}/>;
      case "executive": return <CVPreviewExecutive {...p}/>;
      case "creative":  return <CVPreviewCreative  {...p}/>;
      case "minimal":   return <CVPreviewMinimal   {...p}/>;
      case "tech":      return <CVPreviewTech      {...p}/>;
      default:          return <CVPreviewModern    {...p}/>;
    }
  };

  /* ── Reusable sub-components ── */
  const SectionTitle = ({ icon, label }: { icon:React.ReactNode; label:string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
        {icon}
      </div>
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{label}</span>
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked:boolean; onChange:(v:boolean)=>void }) => (
    <button onClick={() => onChange(!checked)} className={cn(
      "relative w-10 h-6 rounded-full transition-all flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400",
      checked ? "bg-green-500" : "bg-gray-200"
    )}>
      <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
        checked ? "translate-x-5" : "translate-x-1")}/>
    </button>
  );

  /* ──────────────────────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto">

      {/* ── Top bar ──────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generador de CV</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {visibleRecs.length} registros · {skills.length} habilidades · <span className="font-medium text-gray-600">{currentTpl?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={share}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-2xl border-2 hover:bg-blue-50 transition-colors"
            style={{borderColor:"#2563eb",color:"#2563eb"}}>
            <Share2 size={14}/> Compartir
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white rounded-2xl disabled:opacity-60"
            style={{background:"#16a34a"}}>
            {saving ? <><Loader2 size={14} className="animate-spin"/> Guardando</> : <><CheckCircle2 size={14}/> Guardar</>}
          </button>
          <PDFDownloadButton data={cvData} fileName={`CV_${profile.first_name}_${profile.last_name}.pdf`} templateKey={tplKey}/>
        </div>
      </div>

      {/* ── Two-column layout ────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">

        {/* ══ Side panel ════════════════════════════════════ */}
        <aside>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Tab row */}
            <div className="flex p-2 gap-1 bg-gray-50 border-b border-gray-100">
              {([
                { id:"plantilla",  label:"Plantilla",  icon:<Layout size={12}/> },
                { id:"estilo",     label:"Estilo",     icon:<Palette size={12}/> },
                { id:"diseno",     label:"Diseño",     icon:<Sparkles size={12}/> },
                { id:"secciones",  label:"Secciones",  icon:<SlidersHorizontal size={12}/> },
              ] as {id:Tab;label:string;icon:React.ReactNode}[]).map(({id,label,icon})=>(
                <button key={id} onClick={()=>setTab(id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-2xl text-[11px] font-semibold transition-all",
                    tab===id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}>
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* ─ Content ─────────────────────────────────── */}
            <div className="p-4 space-y-5 max-h-[75vh] overflow-y-auto">

              {/* ══ PLANTILLA ══════════════════════════════ */}
              {tab==="plantilla" && (
                <div>
                  <p className="text-xs text-gray-400 mb-3 font-medium">Elige el diseño de tu CV</p>
                  <div className="grid grid-cols-2 gap-2">
                    {allTpls.map(t=>(
                      <button key={t.id} onClick={()=>setTplKey(t.template_key)}
                        className={cn(
                          "relative text-left rounded-2xl border-2 overflow-hidden transition-all hover:shadow-md",
                          tplKey===t.template_key
                            ? "border-green-500 shadow-md ring-2 ring-green-200"
                            : "border-gray-100 hover:border-gray-200"
                        )}>
                        {tplKey===t.template_key && (
                          <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={11} className="text-white"/>
                          </div>
                        )}
                        <div className="h-20 bg-gray-50 p-1.5">
                          <TemplateThumb k={t.template_key} color={accentColor}/>
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-bold text-gray-800 leading-tight">{t.name}</p>
                          {t.description && (
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">{t.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ ESTILO ══════════════════════════════════ */}
              {tab==="estilo" && (
                <div className="space-y-5">

                  {/* Color de acento */}
                  <div>
                    <SectionTitle icon={<Palette size={12}/>} label="Color de acento"/>
                    <div className="grid grid-cols-6 gap-2 mb-2">
                      {PALETTES.map(({name,hex})=>(
                        <button key={hex} title={name} onClick={()=>setAccent(hex)}
                          className={cn("aspect-square rounded-xl transition-all hover:scale-110 hover:shadow-md relative",
                            accentColor===hex ? "ring-2 ring-offset-1 ring-gray-800 scale-110 shadow-md" : ""
                          )}
                          style={{background:hex}}>
                          {accentColor===hex && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-white rounded-full shadow"/>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {/* Custom color */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl">
                      <input type="color" value={accentColor} onChange={e=>setAccent(e.target.value)}
                        className="w-9 h-9 rounded-xl cursor-pointer border-2 border-white shadow flex-shrink-0 bg-transparent"/>
                      <div>
                        <p className="text-xs font-mono font-semibold text-gray-700">{accentColor.toUpperCase()}</p>
                        <p className="text-[10px] text-gray-400">Color personalizado</p>
                      </div>
                      {/* Live mini-preview */}
                      <div className="ml-auto rounded-xl overflow-hidden w-10 h-9 border border-gray-200 flex-shrink-0">
                        <div className="h-full flex flex-col">
                          <div className="flex-1" style={{background:accentColor}}/>
                          <div className="h-1/2 bg-white flex items-center px-1">
                            <div className="h-1 w-5 bg-gray-200 rounded-full"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tipografía */}
                  <div>
                    <SectionTitle icon={<span className="text-[10px] font-bold">Aa</span>} label="Tipografía"/>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        {key:"sans",  sample:"Aa", face:"system-ui",         label:"Sans",    sub:"Moderno"},
                        {key:"serif", sample:"Aa", face:"Georgia,serif",      label:"Serif",   sub:"Elegante"},
                        {key:"mono",  sample:"Aa", face:"'Courier New',mono", label:"Mono",    sub:"Técnico"},
                      ].map(({key,sample,face,label,sub})=>(
                        <button key={key} onClick={()=>setFont(key as any)}
                          className={cn("p-2.5 rounded-2xl border-2 text-left transition-all hover:shadow-sm",
                            fontFamily===key ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"
                          )}>
                          <span className="text-lg font-bold text-gray-700 block" style={{fontFamily:face}}>{sample}</span>
                          <p className="text-[11px] font-semibold text-gray-700 mt-0.5">{label}</p>
                          <p className="text-[10px] text-gray-400">{sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tamaño de fuente */}
                  <div>
                    <SectionTitle icon={<span className="text-[9px] font-bold">TT</span>} label="Tamaño de fuente"/>
                    <div className="px-1">
                      <input type="range" min={10} max={16} step={0.5} value={fontSize}
                        onChange={e=>setSize(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500"/>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-gray-400">Pequeño</span>
                        <span className="text-[11px] font-bold text-gray-700">{fontSize}px</span>
                        <span className="text-[10px] text-gray-400">Grande</span>
                      </div>
                    </div>
                  </div>

                  {/* Interlineado */}
                  <div>
                    <SectionTitle icon={<AlignLeft size={11}/>} label="Interlineado"/>
                    <div className="px-1">
                      <input type="range" min={1.2} max={2.0} step={0.05} value={lineHeight}
                        onChange={e=>setLH(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500"/>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-gray-400">Compacto</span>
                        <span className="text-[11px] font-bold text-gray-700">{lineHeight.toFixed(2)}×</span>
                        <span className="text-[10px] text-gray-400">Amplio</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle: mayúsculas */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Nombre en mayúsculas</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">JUAN PÉREZ vs. Juan Pérez</p>
                    </div>
                    <Toggle checked={uppercase} onChange={setUppercase}/>
                  </div>
                </div>
              )}

              {/* ══ DISEÑO ═══════════════════════════════════ */}
              {tab==="diseno" && (
                <div className="space-y-5">

                  {/* Foto */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <SectionTitle icon={<User size={11}/>} label="Foto de perfil"/>
                      <Toggle checked={showPhoto} onChange={setShowPhoto}/>
                    </div>
                    {showPhoto && (
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {key:"circle",  Icon:Circle,              label:"Círculo"},
                          {key:"rounded", Icon:RectangleHorizontal, label:"Redondeado"},
                          {key:"square",  Icon:Square,              label:"Cuadrado"},
                        ].map(({key,Icon,label})=>(
                          <button key={key} onClick={()=>setPhotoShape(key as any)}
                            className={cn("p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all hover:shadow-sm",
                              photoShape===key ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"
                            )}>
                            <div className="w-8 h-8 bg-gray-200 flex items-center justify-center" style={{
                              borderRadius: key==="circle"?"50%": key==="rounded"?"8px":"2px"
                            }}>
                              <Icon size={14} className="text-gray-400"/>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-600">{label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Estilo de sección */}
                  <div>
                    <SectionTitle icon={<Minus size={11}/>} label="Encabezado de sección"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key:"underline", label:"Línea inferior",  preview:(c:string)=>(
                          <div className="px-2 py-1.5">
                            <div className="text-[9px] font-bold text-gray-700 tracking-wider uppercase">Educación</div>
                            <div className="h-0.5 mt-0.5 rounded-full" style={{background:c}}/>
                          </div>
                        )},
                        { key:"left-bar", label:"Barra lateral", preview:(c:string)=>(
                          <div className="px-2 py-1.5 flex items-center gap-1.5">
                            <div className="w-0.5 h-4 rounded-full" style={{background:c}}/>
                            <div className="text-[9px] font-bold text-gray-700 tracking-wider uppercase">Educación</div>
                          </div>
                        )},
                        { key:"filled", label:"Relleno", preview:(c:string)=>(
                          <div className="px-2 py-1" style={{background:`${c}18`,borderRadius:"6px"}}>
                            <div className="text-[9px] font-bold tracking-wider uppercase" style={{color:c}}>Educación</div>
                          </div>
                        )},
                        { key:"minimal", label:"Minimalista", preview:(_:string)=>(
                          <div className="px-2 py-1.5">
                            <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Educación</div>
                          </div>
                        )},
                      ].map(({key,label,preview})=>(
                        <button key={key} onClick={()=>setSectionStyle(key as any)}
                          className={cn("rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-sm",
                            sectionStyle===key ? "border-green-500" : "border-gray-100 hover:border-gray-200"
                          )}>
                          <div className="bg-gray-50 border-b border-gray-100">
                            {preview(accentColor)}
                          </div>
                          <p className="text-[10px] font-semibold text-gray-600 p-2">{label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estilo de habilidades */}
                  <div>
                    <SectionTitle icon={<Tag size={11}/>} label="Visualización de habilidades"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key:"chips", label:"Etiquetas", preview:(c:string)=>(
                          <div className="flex flex-wrap gap-1 p-2">
                            {["React","Node","CSS"].map(s=>(
                              <span key={s} style={{background:`${c}18`,color:c,border:`1px solid ${c}33`}} className="text-[8px] px-1.5 py-0.5 rounded-full font-medium">{s}</span>
                            ))}
                          </div>
                        )},
                        { key:"dots", label:"Puntos", preview:(_:string)=>(
                          <div className="p-2 space-y-0.5">
                            {["React","Node"].map(s=>(
                              <div key={s} className="text-[9px] text-gray-600 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0"/>
                                {s}
                              </div>
                            ))}
                          </div>
                        )},
                        { key:"bars", label:"Barras", preview:(c:string)=>(
                          <div className="p-2 space-y-1">
                            {[["React",80],["Node",60]].map(([s,v])=>(
                              <div key={s as string}>
                                <div className="text-[8px] text-gray-500 mb-0.5">{s as string}</div>
                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{width:`${v}%`,background:c}}/>
                                </div>
                              </div>
                            ))}
                          </div>
                        )},
                        { key:"text", label:"Texto plano", preview:(_:string)=>(
                          <div className="p-2">
                            <div className="text-[9px] text-gray-500 leading-loose">React · Node · CSS · Git</div>
                          </div>
                        )},
                      ].map(({key,label,preview})=>(
                        <button key={key} onClick={()=>setSkillsStyle(key as any)}
                          className={cn("rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-sm",
                            skillsStyle===key ? "border-green-500" : "border-gray-100 hover:border-gray-200"
                          )}>
                          <div className="bg-gray-50 border-b border-gray-100 min-h-[46px]">
                            {preview(accentColor)}
                          </div>
                          <p className="text-[10px] font-semibold text-gray-600 p-2">{label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estilo de tarjeta de registro */}
                  <div>
                    <SectionTitle icon={<BarChart2 size={11}/>} label="Estilo de entradas"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {key:"flat",     label:"Simple",    cls:"bg-white"},
                        {key:"shadow",   label:"Sombra",    cls:"bg-white shadow-sm"},
                        {key:"bordered", label:"Bordes",    cls:"bg-white border border-gray-200"},
                        {key:"accent",   label:"Acento",    cls:""},
                      ].map(({key,label,cls})=>(
                        <button key={key} onClick={()=>setCardStyle(key as any)}
                          className={cn("p-3 rounded-2xl border-2 text-left transition-all hover:shadow-sm",
                            cardStyle===key ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"
                          )}>
                          <div className={cn("h-5 rounded-lg mb-1.5 flex items-center px-2", cls)}
                            style={key==="accent"?{background:`${accentColor}14`,borderLeft:`3px solid ${accentColor}`}:{}}>
                            <div className="h-1 w-8 bg-gray-200 rounded-full"/>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-600">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Iconos en secciones */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Íconos en secciones</p>
                      <p className="text-[10px] text-gray-400">📚 Educación vs Educación</p>
                    </div>
                    <Toggle checked={showIcons} onChange={setShowIcons}/>
                  </div>
                </div>
              )}

              {/* ══ SECCIONES ════════════════════════════════ */}
              {tab==="secciones" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Secciones del CV</p>
                    {hidden.size>0 && (
                      <button onClick={()=>setHidden(new Set())}
                        className="text-[10px] text-green-600 font-semibold hover:underline">
                        Mostrar todo
                      </button>
                    )}
                  </div>
                  {sectionTypes.length===0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <BookOpen size={24} className="mx-auto mb-2 opacity-40"/>
                      <p className="text-xs">Sin registros visibles</p>
                      <a href="/academic" className="text-green-600 text-xs underline mt-1 block">Agregar registros →</a>
                    </div>
                  ) : sectionTypes.map((type)=>{
                    const isOff = hidden.has(type);
                    const count = records.filter(r=>r.is_visible_in_cv&&r.record_type===type).length;
                    return (
                      <div key={type}
                        onClick={()=>setHidden(prev=>{const n=new Set(prev);isOff?n.delete(type):n.add(type);return n;})}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all select-none",
                          isOff ? "border-gray-100 bg-gray-50 opacity-50" : "border-green-100 bg-green-50"
                        )}>
                        <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0",
                          isOff ? "bg-gray-200 text-gray-400" : "bg-green-200 text-green-700")}>
                          {isOff ? "✕" : "✓"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 truncate">{RECORD_TYPE_LABELS[type]}</p>
                          <p className="text-[10px] text-gray-400">{count} entrada{count!==1?"s":""}</p>
                        </div>
                        <Toggle checked={!isOff} onChange={()=>{}}/>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>{/* end scroll container */}
          </div>

          {/* Quick stats */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label:"Plantilla",    value:currentTpl?.name??"-" },
              { label:"Secciones",    value:`${sectionTypes.length-hidden.size}/${sectionTypes.length}` },
              { label:"Habilidades",  value:`${skills.length}` },
            ].map(({label,value})=>(
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-2.5 text-center shadow-sm">
                <p className="text-xs font-bold text-gray-800">{value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* ══ Preview pane ══════════════════════════════════ */}
        <div className="flex flex-col min-h-0">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Eye size={12}/> Vista previa en tiempo real
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm" style={{background:accentColor}}/>
              <span className="text-xs text-gray-500 font-medium">{currentTpl?.name} · {accentColor.toUpperCase()}</span>
              <span className="text-[10px] text-gray-300">·</span>
              <span className="text-xs text-gray-400">{fontSize}px · {fontFamily}</span>
            </div>
          </div>

          {/* Preview frame */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-5 flex-1 min-h-[640px] border border-gray-200">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[590px] transition-all duration-300">
              <Preview/>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}