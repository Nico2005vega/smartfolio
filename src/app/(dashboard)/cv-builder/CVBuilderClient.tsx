"use client";
import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateCVData } from "@/lib/cv-generator";
import type { Profile, AcademicRecord, Skill, CVTemplate, CVConfiguration, RecordType } from "@/types";
import { RECORD_TYPE_LABELS } from "@/types";
import { toast } from "sonner";
import {
  Loader2, CheckCircle2, Eye, Share2, FileText,
  Layout, Palette, Sparkles, SlidersHorizontal,
  User, BookOpen, Minus, Tag, BarChart2,
  Search, X, Heart, ArrowRight, Shield, Star,
  Zap, Award, Briefcase,
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
  profile:              Profile | null;
  records:              AcademicRecord[];
  skills:               Skill[];
  templates:            CVTemplate[];
  config:               CVConfiguration | null;
  preSelectedTemplate?: string;
}

/* ── Catálogo completo de plantillas ────────────────────── */
interface TplMeta {
  key: string; name: string; category: string;
  description: string; tags: string[]; ats: number;
  accent: string; functional: boolean;
}
const CATALOGUE: TplMeta[] = [
  { key:"modern",    name:"Moderna",      category:"profesional",  description:"Sidebar colorido con foto",              tags:["Popular","ATS"],        ats:82,  accent:"#059669", functional:true  },
  { key:"classic",   name:"Clásica",      category:"tradicional",  description:"Encabezado centrado, estilo académico",  tags:["Formal","ATS"],         ats:95,  accent:"#2563eb", functional:true  },
  { key:"executive", name:"Ejecutiva",    category:"ejecutivo",    description:"Tipografía protagonista, líneas limpias",tags:["Elegante"],             ats:90,  accent:"#374151", functional:true  },
  { key:"creative",  name:"Creativa",     category:"creativo",     description:"Header bold + sidebar de habilidades",   tags:["Nuevo","Visual"],       ats:68,  accent:"#7c3aed", functional:true  },
  { key:"minimal",   name:"Minimalista",  category:"minimalista",  description:"Serif elegante, ultra limpia",           tags:["Limpia"],               ats:88,  accent:"#18181b", functional:true  },
  { key:"tech",      name:"Tecnológica",  category:"tecnológico",  description:"Sidebar oscuro, estilo código",          tags:["Dev"],                  ats:75,  accent:"#06b6d4", functional:true  },
  { key:"corporate", name:"Corporativa",  category:"corporativo",  description:"Header navy, máximo profesionalismo",    tags:["Próximamente"],         ats:92,  accent:"#1e3a5f", functional:false },
  { key:"elegant",   name:"Elegante",     category:"ejecutivo",    description:"Acento dorado, sensación premium",       tags:["Próximamente","Premium"],ats:80, accent:"#b7882c", functional:false },
  { key:"ats",       name:"ATS Pro",      category:"ats",          description:"Sin imágenes, 100% compatible ATS",      tags:["Próximamente","ATS"],   ats:100, accent:"#16a34a", functional:false },
  { key:"compact",   name:"Compacta",     category:"profesional",  description:"Más contenido en menos espacio",         tags:["Próximamente"],         ats:85,  accent:"#0891b2", functional:false },
  { key:"academic",  name:"Académica",    category:"académico",    description:"Diseño denso para investigadores",       tags:["Próximamente"],         ats:94,  accent:"#4f46e5", functional:false },
  { key:"bold",      name:"Audaz",        category:"creativo",     description:"Diagonal accent, muy impactante",        tags:["Próximamente","Visual"],ats:60,  accent:"#e11d48", functional:false },
];

const CATS = [
  { id:"all",         label:"Todas"       },
  { id:"profesional", label:"Profesional" },
  { id:"creativo",    label:"Creativo"    },
  { id:"ejecutivo",   label:"Ejecutivo"   },
  { id:"tecnológico", label:"Tecnológico" },
  { id:"minimalista", label:"Minimalista" },
  { id:"ats",         label:"ATS"         },
];

const REGISTRY: CVTemplate[] = [
  { id:"t1", name:"Moderna",     description:"Sidebar con foto y acento de color",      template_key:"modern",    is_active:true, is_premium:false, preview_url:null },
  { id:"t2", name:"Clásica",     description:"Encabezado centrado, formato tradicional", template_key:"classic",   is_active:true, is_premium:false, preview_url:null },
  { id:"t3", name:"Ejecutiva",   description:"Minimalista, tipografía en protagonismo",  template_key:"executive", is_active:true, is_premium:false, preview_url:null },
  { id:"t4", name:"Creativa",    description:"Header bold + sidebar de habilidades",     template_key:"creative",  is_active:true, is_premium:false, preview_url:null },
  { id:"t5", name:"Minimalista", description:"Serif elegante, espacios amplios",         template_key:"minimal",   is_active:true, is_premium:false, preview_url:null },
  { id:"t6", name:"Tecnológica", description:"Sidebar oscuro, estilo código/dev",        template_key:"tech",      is_active:true, is_premium:false, preview_url:null },
];

const PALETTES = [
  "#059669","#0284c7","#4f46e5","#7c3aed","#db2777","#e11d48",
  "#d97706","#65a30d","#0891b2","#475569","#1e293b","#09090b",
];

const TAG_COLORS: Record<string,string> = {
  Popular:"bg-green-100 text-green-700", Nuevo:"bg-blue-100 text-blue-700",
  ATS:"bg-emerald-100 text-emerald-700", Elegante:"bg-purple-100 text-purple-700",
  Visual:"bg-rose-100 text-rose-700",    Limpia:"bg-teal-100 text-teal-700",
  Dev:"bg-cyan-100 text-cyan-700",       Formal:"bg-slate-100 text-slate-600",
  Próximamente:"bg-gray-100 text-gray-400", Premium:"bg-amber-100 text-amber-700",
};

type Tab = "plantilla" | "estilo" | "diseno" | "secciones";

/* ── SVG Thumbnails ─────────────────────────────────────── */
function Thumb({ k, color, size="sm" }: { k:string; color:string; size?:"sm"|"lg" }) {
  const c = color;
  const r = size === "lg" ? 6 : 4;
  switch (k) {
    case "modern": return (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <rect width="80" height="96" fill="#f1f5f9" rx={r}/>
        <rect width="24" height="96" fill={c} rx={r}/><rect x="12" width="12" height="96" fill={c}/>
        <circle cx="12" cy="18" r="7" fill="white" fillOpacity=".3"/>
        <rect x="3" y="30" width="16" height="1.5" fill="white" fillOpacity=".5" rx="1"/>
        {[45,53,61,69,77,85].map((y,i)=>(<rect key={y} x="30" y={y-8} width={36-(i%3)*5} height="2.2" fill="#cbd5e1" rx="1"/>))}
      </svg>
    );
    case "classic": return (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <rect width="80" height="96" fill="#f8fafc" rx={r}/>
        <rect x="14" y="9" width="52" height="6" fill={c} rx="2"/>
        <rect x="8" y="19" width="64" height=".8" fill={c} fillOpacity=".4"/>
        {[27,35,43,51,59,67,75].map((y,i)=>(<rect key={y} x="8" y={y} width={52-(i%4)*7} height="2" fill="#e2e8f0" rx="1"/>))}
      </svg>
    );
    case "executive": return (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <rect width="80" height="96" fill="#fafafa" rx={r}/>
        <rect x="8" y="9" width="42" height="7" fill="#111827" rx="1"/>
        <rect x="8" y="20" width="24" height="2" fill={c} rx="1"/>
        {[32,42,52,62,72,82].map((y,i)=>(<rect key={y} x="8" y={y-4} width={55-(i%3)*8} height="2" fill="#e2e8f0" rx="1"/>))}
      </svg>
    );
    case "creative": return (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <rect width="80" height="96" fill="#f8fafc" rx={r}/>
        <rect width="80" height="26" fill={c} rx={r}/><rect y="16" width="80" height="10" fill={c}/>
        <circle cx="14" cy="13" r="7" fill="white" fillOpacity=".22"/>
        <rect x="27" y="7" width="28" height="3.5" fill="white" rx="1"/>
        {[33,43,53,63,73].map((y,i)=>(<rect key={y} x="8" y={y} width={36-(i%3)*5} height="2.5" fill="#e2e8f0" rx="1"/>))}
        <rect x="57" y="28" width="18" height="64" fill="#f1f5f9"/>
        {[30,37,44,51,58,65,72,79].map(y=>(<rect key={y} x="59" y={y} width="12" height="1.5" fill="#cbd5e1" rx="1"/>))}
      </svg>
    );
    case "minimal": return (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <rect width="80" height="96" fill="white" rx={r}/>
        <rect x="8" y="9" width="46" height="7" fill="#09090b" rx="1"/>
        <rect x="8" y="21" width="64" height=".6" fill="#e4e4e7"/>
        {[28,38,48,58,68,78].map((y,i)=>(<rect key={y} x="8" y={y} width={52-(i%4)*8} height="1.5" fill="#a1a1aa" rx="1"/>))}
      </svg>
    );
    case "tech": return (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <rect width="80" height="96" fill="#f8fafc" rx={r}/>
        <rect width="22" height="96" fill="#0f172a" rx={r}/><rect x="12" width="10" height="96" fill="#0f172a"/>
        <circle cx="11" cy="16" r="5.5" fill={c} fillOpacity=".35"/>
        {[28,35,42,50].map(y=>(<rect key={y} x="4" y={y} width="13" height="1.5" fill={c} fillOpacity=".45" rx="1"/>))}
        <rect x="26" y="8" width="44" height="1.5" fill={c} rx="1"/>
        {[16,25,34,43,52,61,70,79].map((y,i)=>(<rect key={y} x="28" y={y} width={36-(i%3)*5} height="2" fill="#e2e8f0" rx="1"/>))}
      </svg>
    );
    default: return (
      <svg viewBox="0 0 80 96" className="w-full h-full">
        <rect width="80" height="96" fill="#f1f5f9" rx={r}/>
        <rect width="80" height="30" fill={c} rx={r}/><rect y="20" width="80" height="10" fill={c}/>
        {[38,48,58,68,78].map((y,i)=>(<rect key={y} x="8" y={y} width={65-(i%3)*10} height="2.5" fill="#e2e8f0" rx="1"/>))}
      </svg>
    );
  }
}

/* ── Gallery Modal ──────────────────────────────────────── */
function GalleryModal({
  currentKey, accent, onSelect, onClose,
}: {
  currentKey: string; accent: string;
  onSelect: (key: string) => void; onClose: () => void;
}) {
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState("all");
  const [favs,     setFavs]     = useState<Set<string>>(new Set());
  const [hovering, setHovering] = useState<string|null>(null);

  const filtered = useMemo(() => {
    let list = CATALOGUE;
    if (cat !== "all") list = list.filter(t => t.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(g => g.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, cat]);

  const toggleFav = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavs(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)" }}>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ animation:"slideUp .25s cubic-bezier(.34,1.56,.64,1)" }}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Galería de plantillas</h2>
            <p className="text-xs text-gray-400 mt-0.5">Elige una y se aplicará al instante</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={16} className="text-gray-600"/>
          </button>
        </div>

        {/* Search + filters */}
        <div className="px-6 py-3 border-b border-gray-50 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder="Buscar plantilla..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-gray-50 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400 border border-gray-100"/>
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={12} className="text-gray-400"/>
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  cat === c.id
                    ? "bg-green-500 text-white shadow-sm shadow-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search size={28} className="mb-2 opacity-40"/>
              <p className="text-sm">Sin resultados para &ldquo;{search}&rdquo;</p>
              <button onClick={() => { setSearch(""); setCat("all"); }}
                className="text-xs text-green-600 mt-1 hover:underline">Ver todas</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filtered.map(tpl => {
                const isActive = currentKey === tpl.key;
                const isHover  = hovering === tpl.key;
                return (
                  <div key={tpl.key}
                    className={cn(
                      "relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all select-none",
                      isActive
                        ? "border-green-500 ring-2 ring-green-200 shadow-lg"
                        : "border-gray-100 hover:border-gray-300 hover:shadow-md"
                    )}
                    style={{ transform: isHover && !isActive ? "translateY(-3px)" : "none",
                             transition:"all .2s cubic-bezier(.34,1.56,.64,1)" }}
                    onMouseEnter={() => setHovering(tpl.key)}
                    onMouseLeave={() => setHovering(null)}
                    onClick={() => { if (tpl.functional) { onSelect(tpl.key); onClose(); } }}
                  >
                    {/* Thumbnail */}
                    <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio:"5/6" }}>
                      <Thumb k={tpl.key} color={tpl.accent} size="lg"/>

                      {/* Overlay */}
                      {isHover && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                          style={{ background:"rgba(0,0,0,.4)", backdropFilter:"blur(1px)" }}>
                          {tpl.functional ? (
                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg"
                              style={{ background: tpl.accent }}
                              onClick={e => { e.stopPropagation(); onSelect(tpl.key); onClose(); }}>
                              Usar <ArrowRight size={11}/>
                            </button>
                          ) : (
                            <span className="px-2 py-1 bg-white/90 rounded-full text-[10px] font-bold text-gray-600">
                              Próximamente
                            </span>
                          )}
                        </div>
                      )}

                      {/* Active check */}
                      {isActive && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow">
                          <CheckCircle2 size={11} className="text-white"/>
                        </div>
                      )}

                      {/* ATS badge */}
                      {tpl.ats >= 90 && (
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full">
                          <Shield size={7}/> ATS
                        </div>
                      )}

                      {/* Fav */}
                      <button
                        onClick={e => toggleFav(tpl.key, e)}
                        className={cn(
                          "absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                          favs.has(tpl.key) ? "bg-rose-500" : "bg-white/80",
                          isHover || favs.has(tpl.key) ? "opacity-100" : "opacity-0"
                        )}>
                        <Heart size={10}
                          className={favs.has(tpl.key) ? "text-white fill-white" : "text-rose-400"}
                          style={{ fill: favs.has(tpl.key) ? "white" : "none" }}/>
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="p-2 bg-white">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{tpl.name}</p>
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {tpl.tags.slice(0,2).map(tag => (
                          <span key={tag} className={cn("text-[9px] px-1 py-0.5 rounded-full font-medium", TAG_COLORS[tag] ?? "bg-gray-100 text-gray-400")}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {CATALOGUE.filter(t=>t.functional).length} disponibles · {CATALOGUE.filter(t=>!t.functional).length} próximamente
          </p>
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Cerrar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ── Slider ─────────────────────────────────────────────── */
function Slider({ min, max, step=1, value, onChange, label, format }: {
  min:number; max:number; step?:number; value:number;
  onChange:(v:number)=>void; label:string; format:(v:number)=>string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600">{label}</span>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
        style={{ background:`linear-gradient(to right,#16a34a ${pct}%,#e5e7eb ${pct}%)` }}/>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">{format(min)}</span>
        <span className="text-[10px] text-gray-400">{format(max)}</span>
      </div>
    </div>
  );
}

/* ── Toggle ─────────────────────────────────────────────── */
function Toggle({ checked, onChange }: { checked:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none",
        checked ? "bg-green-500" : "bg-gray-200")}>
      <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
        checked ? "translate-x-6" : "translate-x-1")}/>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function CVBuilderClient({
  profile, records, skills, templates, config, preSelectedTemplate,
}: Props) {
  const [tplKey, setTplKey] = useState(
    preSelectedTemplate ?? config?.template?.template_key ?? "modern"
  );
  const [tab,          setTab]          = useState<Tab>("plantilla");
  const [saving,       setSaving]       = useState(false);
  const [galleryOpen,  setGalleryOpen]  = useState(false);
  const supabase = createClient();

  const [accent,       setAccent]       = useState(config?.accent_color ?? "#059669");
  const [fontFamily,   setFont]         = useState<"sans"|"serif"|"mono">("sans");
  const [fontSize,     setFSize]        = useState(13);
  const [lineHeight,   setLH]           = useState(1.55);
  const [uppercase,    setUpper]        = useState(false);
  const [photoShape,   setPhotoShape]   = useState<"circle"|"rounded"|"square">("circle");
  const [sectionStyle, setSectionStyle] = useState<"underline"|"left-bar"|"filled"|"minimal">("underline");
  const [skillsStyle,  setSkillsStyle]  = useState<"chips"|"dots"|"bars"|"text">("chips");
  const [cardStyle,    setCardStyle]    = useState<"flat"|"shadow"|"bordered"|"accent">("flat");
  const [showPhoto,    setShowPhoto]    = useState(true);
  const [showIcons,    setShowIcons]    = useState(true);
  const [hidden,       setHidden]       = useState<Set<RecordType>>(new Set());

  const allTpls    = REGISTRY.map(st => (templates ?? []).find(t => t.template_key === st.template_key) ?? st);
  const currentTpl = allTpls.find(t => t.template_key === tplKey) ?? allTpls[0];

  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
        <FileText size={26} className="text-gray-400"/>
      </div>
      <p className="font-bold text-gray-700">Completa tu perfil primero</p>
      <a href="/profile" className="text-sm text-green-600 underline">Ir al perfil →</a>
    </div>
  );

  const filteredRecords = records.filter(r => !hidden.has(r.record_type));
  const extConfig = useMemo(() => ({
    ...(config ?? { id:"", profile_id:profile.id, template_id:null, sections_config:{} as any, last_generated_at:null, updated_at:"" }),
    accent_color:accent, template:currentTpl,
    font_family:fontFamily, font_size:fontSize, line_height:lineHeight,
    photo_shape:photoShape, section_style:sectionStyle, skills_style:skillsStyle,
    card_style:cardStyle, show_photo:showPhoto, show_icons:showIcons, uppercase,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [config, accent, currentTpl, fontFamily, fontSize, lineHeight, photoShape, sectionStyle, skillsStyle, cardStyle, showPhoto, showIcons, uppercase]);

  const cvData = useMemo(
    () => generateCVData(profile, filteredRecords, skills, extConfig as CVConfiguration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, filteredRecords, skills, extConfig]
  );

  const visibleRecs  = records.filter(r => r.is_visible_in_cv && !hidden.has(r.record_type));
  const sectionTypes = [...new Set(records.filter(r => r.is_visible_in_cv).map(r => r.record_type))];

  const save = async () => {
    setSaving(true);
    await supabase.from("cv_configurations").upsert({
      profile_id:profile.id, template_id:currentTpl?.id ?? null,
      accent_color:accent, last_generated_at:new Date().toISOString(),
    }, { onConflict:"profile_id" });
    toast.success("Guardado ✓");
    setSaving(false);
  };

  const share = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${profile.username_slug}`);
    toast.success("¡Enlace copiado! 🔗");
  };

  const renderPreview = () => {
    const p = { data:cvData };
    switch (tplKey) {
      case "classic":   return <CVPreviewClassic   {...p}/>;
      case "executive": return <CVPreviewExecutive {...p}/>;
      case "creative":  return <CVPreviewCreative  {...p}/>;
      case "minimal":   return <CVPreviewMinimal   {...p}/>;
      case "tech":      return <CVPreviewTech      {...p}/>;
      default:          return <CVPreviewModern    {...p}/>;
    }
  };

  const STitle = ({ icon, text }: { icon:React.ReactNode; text:string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 text-[10px]">{icon}</div>
      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{text}</span>
    </div>
  );
  const Divider = () => <div className="border-t border-gray-100 my-4"/>;

  return (
    <>
      {/* ── Gallery modal ── */}
      {galleryOpen && (
        <GalleryModal
          currentKey={tplKey}
          accent={accent}
          onSelect={key => { setTplKey(key); toast.success(`Plantilla "${CATALOGUE.find(t=>t.key===key)?.name}" aplicada ✓`); }}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generador de CV</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {visibleRecs.length} registros · {skills.length} habilidades ·{" "}
              <span className="text-gray-600 font-medium">{currentTpl?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={share}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border-2 hover:bg-blue-50 transition-colors"
              style={{ borderColor:"#2563eb", color:"#2563eb" }}>
              <Share2 size={14}/> Compartir
            </button>
            <button onClick={save} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60"
              style={{ background:"#16a34a" }}>
              {saving ? <><Loader2 size={14} className="animate-spin"/> Guardando</> : <><CheckCircle2 size={14}/> Guardar</>}
            </button>
            <PDFDownloadButton data={cvData}
              fileName={`CV_${profile.first_name}_${profile.last_name}_Smartfolio.pdf`}
              templateKey={tplKey}/>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">

          {/* ═══ SIDE PANEL ═══ */}
          <aside>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="flex p-1.5 gap-0.5 bg-gray-50/80 border-b border-gray-100">
                {([
                  { id:"plantilla", label:"Plantilla", icon:<Layout size={11}/> },
                  { id:"estilo",    label:"Estilo",    icon:<Palette size={11}/> },
                  { id:"diseno",    label:"Diseño",    icon:<Sparkles size={11}/> },
                  { id:"secciones", label:"Secciones", icon:<SlidersHorizontal size={11}/> },
                ] as {id:Tab;label:string;icon:React.ReactNode}[]).map(({ id, label, icon }) => (
                  <button key={id} onClick={() => setTab(id)}
                    className={cn("flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-2xl text-[11px] font-semibold transition-all",
                      tab === id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")}>
                    {icon}<span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-4 max-h-[72vh] overflow-y-auto">

                {/* ── PLANTILLA ── */}
                {tab === "plantilla" && (
                  <>
                    {/* Botón galería — lo más visible */}
                    <button onClick={() => setGalleryOpen(true)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[.98] shadow-md"
                      style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)" }}>
                      <div className="flex items-center gap-2">
                        <Sparkles size={16}/>
                        Explorar galería de plantillas
                      </div>
                      <div className="flex items-center gap-1 text-xs font-normal opacity-80">
                        {CATALOGUE.length} diseños <ArrowRight size={13}/>
                      </div>
                    </button>

                    <p className="text-[11px] text-gray-400 font-medium">O elige directamente:</p>

                    <div className="grid grid-cols-2 gap-2">
                      {allTpls.map(t => (
                        <button key={t.id} onClick={() => setTplKey(t.template_key)}
                          className={cn("relative text-left rounded-2xl border-2 overflow-hidden transition-all hover:shadow-md",
                            tplKey === t.template_key
                              ? "border-green-500 shadow-md ring-2 ring-green-100"
                              : "border-gray-100 hover:border-gray-200")}>
                          {tplKey === t.template_key && (
                            <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 size={11} className="text-white"/>
                            </div>
                          )}
                          <div className="h-20 bg-gray-50 p-2">
                            <Thumb k={t.template_key} color={accent}/>
                          </div>
                          <div className="p-2.5 border-t border-gray-50">
                            <p className="text-xs font-bold text-gray-800">{t.name}</p>
                            {t.description && (
                              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">{t.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* ── ESTILO ── */}
                {tab === "estilo" && (
                  <>
                    <STitle icon={<Palette size={10}/>} text="Color de acento"/>
                    <div className="grid grid-cols-6 gap-2">
                      {PALETTES.map(hex => (
                        <button key={hex} onClick={() => setAccent(hex)}
                          className={cn("aspect-square rounded-xl transition-all hover:scale-110",
                            accent === hex ? "ring-2 ring-offset-2 ring-gray-800 scale-110 shadow-lg" : "hover:shadow-md")}
                          style={{ background:hex }}>
                          {accent === hex && <div className="flex items-center justify-center h-full"><div className="w-2.5 h-2.5 bg-white rounded-full shadow"/></div>}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-2xl">
                      <input type="color" value={accent} onChange={e => setAccent(e.target.value)}
                        className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent flex-shrink-0" style={{ padding:0 }}/>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono font-bold text-gray-700">{accent.toUpperCase()}</p>
                        <p className="text-[10px] text-gray-400">Color personalizado</p>
                      </div>
                    </div>
                    <Divider/>
                    <STitle icon={<span className="font-bold">Aa</span>} text="Tipografía"/>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { key:"sans",  face:"system-ui,sans-serif",    label:"Sans",  sub:"Moderno"  },
                        { key:"serif", face:"Georgia,serif",           label:"Serif", sub:"Elegante" },
                        { key:"mono",  face:"'Courier New',monospace", label:"Mono",  sub:"Técnico"  },
                      ].map(({ key, face, label, sub }) => (
                        <button key={key} onClick={() => setFont(key as any)}
                          className={cn("p-2.5 rounded-2xl border-2 text-left transition-all",
                            fontFamily === key ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200")}>
                          <span className="block text-lg font-bold text-gray-700 leading-none mb-1" style={{ fontFamily:face }}>Aa</span>
                          <p className="text-[11px] font-bold text-gray-700">{label}</p>
                          <p className="text-[10px] text-gray-400">{sub}</p>
                        </button>
                      ))}
                    </div>
                    <Divider/>
                    <Slider min={10} max={16} step={0.5} value={fontSize} onChange={setFSize} label="Tamaño de fuente" format={v=>`${v}px`}/>
                    <Divider/>
                    <Slider min={1.2} max={2.0} step={0.05} value={lineHeight} onChange={setLH} label="Interlineado" format={v=>`${v.toFixed(2)}×`}/>
                    <Divider/>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Nombre en MAYÚSCULAS</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{uppercase ? "JUAN PÉREZ" : "Juan Pérez"}</p>
                      </div>
                      <Toggle checked={uppercase} onChange={setUpper}/>
                    </div>
                  </>
                )}

                {/* ── DISEÑO ── */}
                {tab === "diseno" && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <STitle icon={<User size={10}/>} text="Foto de perfil"/>
                      <Toggle checked={showPhoto} onChange={setShowPhoto}/>
                    </div>
                    {showPhoto && (
                      <div className="grid grid-cols-3 gap-2">
                        {[{ key:"circle", label:"Círculo", radius:"50%" }, { key:"rounded", label:"Redondeado", radius:"10px" }, { key:"square", label:"Cuadrado", radius:"2px" }].map(({ key, label, radius }) => (
                          <button key={key} onClick={() => setPhotoShape(key as any)}
                            className={cn("p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all",
                              photoShape === key ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200")}>
                            <div className="w-9 h-9 bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center" style={{ borderRadius:radius }}>
                              <User size={14} className="text-gray-500"/>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-600">{label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <Divider/>
                    <STitle icon={<Minus size={10}/>} text="Estilo de secciones"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key:"underline", label:"Línea inferior", render:(c:string) => (<div className="px-2 py-2"><p className="text-[9px] font-bold text-gray-700 tracking-widest uppercase mb-1">Educación</p><div className="h-0.5 rounded-full" style={{ background:c }}/></div>) },
                        { key:"left-bar",  label:"Barra lateral",  render:(c:string) => (<div className="px-2 py-2 flex items-center gap-1.5"><div className="w-0.5 h-4 rounded-full" style={{ background:c }}/><p className="text-[9px] font-bold text-gray-700 tracking-widest uppercase">Educación</p></div>) },
                        { key:"filled",    label:"Relleno",        render:(c:string) => (<div className="mx-2 my-1.5 px-2 py-1 rounded-md" style={{ background:`${c}18` }}><p className="text-[9px] font-bold tracking-widest uppercase" style={{ color:c }}>Educación</p></div>) },
                        { key:"minimal",   label:"Minimalista",    render:(_:string) => (<div className="px-2 py-2"><p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Educación</p></div>) },
                      ].map(({ key, label, render }) => (
                        <button key={key} onClick={() => setSectionStyle(key as any)}
                          className={cn("rounded-2xl border-2 overflow-hidden text-left transition-all",
                            sectionStyle === key ? "border-green-500" : "border-gray-100 hover:border-gray-200")}>
                          <div className="bg-gray-50 min-h-[40px] border-b border-gray-100">{render(accent)}</div>
                          <p className="text-[10px] font-semibold text-gray-600 p-2">{label}</p>
                        </button>
                      ))}
                    </div>
                    <Divider/>
                    <STitle icon={<Tag size={10}/>} text="Habilidades"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key:"chips", label:"Etiquetas", render:(c:string) => (<div className="flex flex-wrap gap-1 p-2">{["React","Node","CSS"].map(s=>(<span key={s} className="text-[8px] px-1.5 py-0.5 rounded-full font-medium" style={{ background:`${c}18`, color:c, border:`1px solid ${c}33` }}>{s}</span>))}</div>) },
                        { key:"dots",  label:"Puntos",    render:(_:string) => (<div className="p-2 space-y-0.5">{["React","Node","CSS"].map(s=>(<div key={s} className="flex items-center gap-1 text-[9px] text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"/>{s}</div>))}</div>) },
                        { key:"bars",  label:"Barras",    render:(c:string) => (<div className="p-2 space-y-1.5">{[["React",80],["Node",60]].map(([s,v])=>(<div key={s as string}><p className="text-[8px] text-gray-500 mb-0.5">{s as string}</p><div className="h-1 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width:`${v}%`, background:c }}/></div></div>))}</div>) },
                        { key:"text",  label:"Texto",     render:(_:string) => (<div className="p-2"><p className="text-[9px] text-gray-500 leading-relaxed">React · Node · CSS · Git</p></div>) },
                      ].map(({ key, label, render }) => (
                        <button key={key} onClick={() => setSkillsStyle(key as any)}
                          className={cn("rounded-2xl border-2 overflow-hidden text-left transition-all",
                            skillsStyle === key ? "border-green-500" : "border-gray-100 hover:border-gray-200")}>
                          <div className="bg-gray-50 min-h-[48px] border-b border-gray-100">{render(accent)}</div>
                          <p className="text-[10px] font-semibold text-gray-600 p-2">{label}</p>
                        </button>
                      ))}
                    </div>
                    <Divider/>
                    <STitle icon={<BarChart2 size={10}/>} text="Entradas"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key:"flat",     label:"Simple",    style:{} as React.CSSProperties },
                        { key:"shadow",   label:"Sombra",    style:{ boxShadow:"0 1px 4px rgba(0,0,0,.1)" } as React.CSSProperties },
                        { key:"bordered", label:"Bordes",    style:{ border:"1px solid #e5e7eb" } as React.CSSProperties },
                        { key:"accent",   label:"Acento",    style:{ background:`${accent}14`, borderLeft:`3px solid ${accent}` } as React.CSSProperties },
                      ].map(({ key, label, style }) => (
                        <button key={key} onClick={() => setCardStyle(key as any)}
                          className={cn("p-3 rounded-2xl border-2 text-left transition-all",
                            cardStyle === key ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200")}>
                          <div className="h-6 rounded-lg mb-1.5 flex items-center px-2 bg-white" style={style}>
                            <div className="h-1 w-8 bg-gray-200 rounded-full"/>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-600">{label}</span>
                        </button>
                      ))}
                    </div>
                    <Divider/>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Íconos en secciones</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">📚 Educación vs solo texto</p>
                      </div>
                      <Toggle checked={showIcons} onChange={setShowIcons}/>
                    </div>
                  </>
                )}

                {/* ── SECCIONES ── */}
                {tab === "secciones" && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Visibilidad</p>
                      {hidden.size > 0 && (
                        <button onClick={() => setHidden(new Set())} className="text-[10px] text-green-600 font-semibold hover:underline">
                          Mostrar todo
                        </button>
                      )}
                    </div>
                    {sectionTypes.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen size={22} className="mx-auto mb-2 text-gray-300"/>
                        <p className="text-xs text-gray-400">Sin registros visibles</p>
                        <a href="/academic" className="text-green-600 text-xs underline mt-1 block">Agregar →</a>
                      </div>
                    ) : sectionTypes.map(type => {
                      const off   = hidden.has(type);
                      const count = records.filter(r => r.is_visible_in_cv && r.record_type === type).length;
                      return (
                        <div key={type}
                          onClick={() => setHidden(prev => { const n = new Set(prev); off ? n.delete(type) : n.add(type); return n; })}
                          className={cn("flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all select-none mb-2",
                            off ? "border-gray-100 bg-gray-50 opacity-60" : "border-green-100 bg-green-50/60")}>
                          <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0",
                            off ? "bg-gray-200 text-gray-400" : "bg-green-200 text-green-700")}>
                            {off ? "✕" : "✓"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-700 truncate">{RECORD_TYPE_LABELS[type]}</p>
                            <p className="text-[10px] text-gray-400">{count} entrada{count !== 1 ? "s" : ""}</p>
                          </div>
                          <Toggle checked={!off} onChange={() => {}}/>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { v:currentTpl?.name ?? "—", l:"Plantilla" },
                { v:`${sectionTypes.length - hidden.size}/${sectionTypes.length}`, l:"Secciones" },
                { v:String(skills.length), l:"Habilidades" },
              ].map(({ v, l }) => (
                <div key={l} className="bg-white rounded-2xl border border-gray-100 p-2.5 text-center shadow-sm">
                  <p className="text-sm font-bold text-gray-800 truncate">{v}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* ═══ PREVIEW ═══ */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Eye size={12}/> Vista previa en tiempo real
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ background:accent }}/>
                <span className="text-xs font-medium text-gray-600">{currentTpl?.name}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{fontSize}px / {fontFamily}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-5 flex-1 min-h-[640px] border border-gray-200 shadow-inner">
              <div
                key={`${tplKey}-${accent}-${fontFamily}-${fontSize}-${lineHeight}-${photoShape}-${sectionStyle}-${skillsStyle}-${cardStyle}-${uppercase}`}
                className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[590px]">
                {renderPreview()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}