"use client";
import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateCVData } from "@/lib/cv-generator";
import type { Profile, AcademicRecord, Skill, CVTemplate, CVConfiguration, RecordType } from "@/types";
import { RECORD_TYPE_LABELS } from "@/types";
import { toast } from "sonner";
import {
  Loader2, CheckCircle2, Eye, Share2, FileText,
  Layout, Palette, Sparkles, SlidersHorizontal,
  User, BookOpen, Minus, Tag, BarChart2,
  Search, X, Heart, ArrowRight, Shield, Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import PDFDownloadButton from "@/components/cv-templates/PDFDownloadButton";

/* ── Skeleton para el preview mientras carga ─────────────── */
const PreviewSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[590px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-gray-300">
      <Loader2 size={28} className="animate-spin"/>
      <span className="text-xs font-medium">Cargando plantilla...</span>
    </div>
  </div>
);

/* ── Dynamic imports — carga bajo demanda ────────────────── */
const CVPreviewModern    = dynamic(() => import("@/components/cv-templates/CVPreviewModern"),    { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewClassic   = dynamic(() => import("@/components/cv-templates/CVPreviewClassic"),   { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewExecutive = dynamic(() => import("@/components/cv-templates/CVPreviewExecutive"), { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewCreative  = dynamic(() => import("@/components/cv-templates/CVPreviewCreative"),  { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewMinimal   = dynamic(() => import("@/components/cv-templates/CVPreviewMinimal"),   { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewTech      = dynamic(() => import("@/components/cv-templates/CVPreviewTech"),      { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewCorporate = dynamic(() => import("@/components/cv-templates/CVPreviewCorporate"), { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewElegant   = dynamic(() => import("@/components/cv-templates/CVPreviewElegant"),   { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewATS       = dynamic(() => import("@/components/cv-templates/CVPreviewATS"),       { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewBold      = dynamic(() => import("@/components/cv-templates/CVPreviewBold"),      { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewCompact   = dynamic(() => import("@/components/cv-templates/CVPreviewCompact"),   { ssr:false, loading:()=><PreviewSkeleton/> });
const CVPreviewAcademic  = dynamic(() => import("@/components/cv-templates/CVPreviewAcademic"),  { ssr:false, loading:()=><PreviewSkeleton/> });

/* ── Hook: debounce ──────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&" +
  "family=Poppins:wght@300;400;500;600;700&" +
  "family=Montserrat:wght@300;400;500;600;700;800&" +
  "family=Raleway:wght@300;400;500;600;700&" +
  "family=Nunito:wght@300;400;500;600;700&" +
  "family=Lato:wght@300;400;700&" +
  "family=Roboto:wght@300;400;500;700&" +
  "family=Open+Sans:wght@300;400;500;600;700&" +
  "family=Playfair+Display:wght@400;500;600;700&" +
  "family=Merriweather:wght@300;400;700&" +
  "family=Lora:wght@400;500;600;700&" +
  "family=EB+Garamond:wght@400;500;600;700&" +
  "family=JetBrains+Mono:wght@300;400;500;700&" +
  "family=Fira+Code:wght@300;400;500;700&" +
  "display=swap";

const FONTS = [
  { name:"Inter",        family:"Inter,system-ui,sans-serif",               cat:"Sans"  },
  { name:"Poppins",      family:"Poppins,system-ui,sans-serif",             cat:"Sans"  },
  { name:"Montserrat",   family:"Montserrat,system-ui,sans-serif",          cat:"Sans"  },
  { name:"Raleway",      family:"Raleway,system-ui,sans-serif",             cat:"Sans"  },
  { name:"Nunito",       family:"Nunito,system-ui,sans-serif",              cat:"Sans"  },
  { name:"Lato",         family:"Lato,system-ui,sans-serif",                cat:"Sans"  },
  { name:"Roboto",       family:"Roboto,system-ui,sans-serif",              cat:"Sans"  },
  { name:"Open Sans",    family:"'Open Sans',system-ui,sans-serif",         cat:"Sans"  },
  { name:"Playfair",     family:"'Playfair Display',Georgia,serif",         cat:"Serif" },
  { name:"Merriweather", family:"Merriweather,Georgia,serif",               cat:"Serif" },
  { name:"Lora",         family:"Lora,Georgia,serif",                       cat:"Serif" },
  { name:"EB Garamond",  family:"'EB Garamond',Georgia,serif",              cat:"Serif" },
  { name:"Georgia",      family:"Georgia,serif",                            cat:"Serif" },
  { name:"JetBrains",    family:"'JetBrains Mono','Courier New',monospace", cat:"Mono"  },
  { name:"Fira Code",    family:"'Fira Code','Courier New',monospace",      cat:"Mono"  },
  { name:"Courier",      family:"'Courier New',monospace",                  cat:"Mono"  },
];

const PALETTES = [
  "#059669","#0284c7","#4f46e5","#7c3aed","#db2777","#e11d48",
  "#d97706","#65a30d","#0891b2","#475569","#1e293b","#09090b",
  "#b7882c","#0f766e","#9333ea","#c2410c","#1d4ed8","#be185d",
];

interface TplMeta { key:string; name:string; category:string; description:string; tags:string[]; ats:number; accent:string; }
const CATALOGUE: TplMeta[] = [
  { key:"modern",    name:"Moderna",     category:"profesional",  description:"Sidebar colorido con foto",                tags:["Popular","ATS"], ats:82,  accent:"#2563EB" },
  { key:"classic",   name:"Clásica",     category:"tradicional",  description:"Encabezado centrado, académica",            tags:["Formal","ATS"],  ats:95,  accent:"#374151" },
  { key:"executive", name:"Ejecutiva",   category:"ejecutivo",    description:"Tipografía protagonista",                   tags:["Elegante"],      ats:90,  accent:"#111827" },
  { key:"creative",  name:"Creativa",    category:"creativo",     description:"Header bold + sidebar skills",              tags:["Nuevo","Visual"], ats:68,  accent:"#EC4899" },
  { key:"minimal",   name:"Minimalista", category:"minimalista",  description:"Serif elegante, ultra limpia",              tags:["Limpia"],        ats:88,  accent:"#6B7280" },
  { key:"tech",      name:"Tecnológica", category:"tecnológico",  description:"Sidebar oscuro estilo código",              tags:["Dev"],           ats:75,  accent:"#06B6D4" },
  { key:"corporate", name:"Corporativa", category:"corporativo",  description:"Header navy profesional dos columnas",      tags:["Corporativo"],   ats:92,  accent:"#1e3a5f" },
  { key:"elegant",   name:"Elegante",    category:"ejecutivo",    description:"Acento dorado serif centrada",              tags:["Premium","Serif"],ats:80,  accent:"#b7882c" },
  { key:"ats",       name:"ATS Pro",     category:"ats",          description:"Sin imágenes 100% compatible ATS",          tags:["ATS","Máximo"],  ats:100, accent:"#16a34a" },
  { key:"bold",      name:"Audaz",       category:"creativo",     description:"Diagonal geométrica muy impactante",        tags:["Nuevo","Bold"],  ats:62,  accent:"#e11d48" },
  { key:"compact",   name:"Compacta",    category:"profesional",  description:"Eficiente, más contenido menos espacio",    tags:["Eficiente"],     ats:85,  accent:"#0891b2" },
  { key:"academic",  name:"Académica",   category:"académico",    description:"Estilo Harvard/Oxford para investigadores", tags:["Académico"],     ats:94,  accent:"#4f46e5" },
];

const CATS = [
  { id:"all", label:"Todas" }, { id:"profesional", label:"Profesional" },
  { id:"creativo", label:"Creativo" }, { id:"ejecutivo", label:"Ejecutivo" },
  { id:"tecnológico", label:"Tecnológico" }, { id:"minimalista", label:"Minimalista" },
  { id:"corporativo", label:"Corporativo" }, { id:"ats", label:"ATS" }, { id:"académico", label:"Académico" },
];

const TAG_COLORS: Record<string,string> = {
  Popular:"bg-green-100 text-green-700", Nuevo:"bg-blue-100 text-blue-700",
  ATS:"bg-emerald-100 text-emerald-700", Elegante:"bg-purple-100 text-purple-700",
  Visual:"bg-rose-100 text-rose-700",    Limpia:"bg-teal-100 text-teal-700",
  Dev:"bg-cyan-100 text-cyan-700",       Formal:"bg-slate-100 text-slate-600",
  Premium:"bg-amber-100 text-amber-700", Bold:"bg-red-100 text-red-700",
  Serif:"bg-indigo-100 text-indigo-700", Corporativo:"bg-blue-100 text-blue-800",
  Máximo:"bg-green-100 text-green-800",  Eficiente:"bg-sky-100 text-sky-700",
  Académico:"bg-violet-100 text-violet-700",
};

const REGISTRY: CVTemplate[] = CATALOGUE.map((t,i) => ({
  id:`t${i+1}`, name:t.name, description:t.description,
  template_key:t.key, is_active:true, is_premium:false, preview_url:null,
}));

type Tab = "plantilla"|"fuentes"|"estilo"|"diseno"|"secciones";

function Thumb({ k, c }: { k:string; c:string }) {
  const col = CATALOGUE.find(t=>t.key===k)?.accent ?? c;
  switch (k) {
    case "modern":    return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="#f1f5f9" rx="4"/><rect width="24" height="100" fill={col}/><circle cx="12" cy="18" r="7" fill="white" fillOpacity=".3"/><rect x="3" y="30" width="16" height="1.5" fill="white" fillOpacity=".5" rx="1"/><rect x="3" y="35" width="12" height="1.5" fill="white" fillOpacity=".4" rx="1"/>{[45,53,61,69,77,85].map((y,i)=>(<rect key={y} x="30" y={y-8} width={36-(i%3)*5} height="2.2" fill="#cbd5e1" rx="1"/>))}</svg>);
    case "classic":   return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="#f8fafc" rx="4"/><rect x="14" y="9" width="52" height="6" fill={col} rx="2"/><rect x="8" y="19" width="64" height=".8" fill={col} fillOpacity=".4"/>{[27,35,43,51,59,67,75].map((y,i)=>(<rect key={y} x="8" y={y} width={52-(i%4)*7} height="2" fill="#e2e8f0" rx="1"/>))}</svg>);
    case "executive": return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="#fafafa" rx="4"/><rect x="8" y="9" width="42" height="7" fill="#111827" rx="1"/><rect x="8" y="20" width="24" height="2" fill={col} rx="1"/>{[32,42,52,62,72,82,90].map((y,i)=>(<rect key={y} x="8" y={y-4} width={55-(i%3)*8} height="2" fill="#e2e8f0" rx="1"/>))}</svg>);
    case "creative":  return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="#f8fafc" rx="4"/><rect width="80" height="26" fill={col} rx="3"/><rect y="16" width="80" height="10" fill={col}/><circle cx="14" cy="13" r="7" fill="white" fillOpacity=".22"/><rect x="27" y="7" width="28" height="3.5" fill="white" rx="1"/><rect x="57" y="28" width="18" height="68" fill="#f1f5f9"/>{[33,43,53,63,73].map((y,i)=>(<rect key={y} x="8" y={y} width={36-(i%3)*5} height="2.5" fill="#e2e8f0" rx="1"/>))}</svg>);
    case "minimal":   return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="white" rx="4"/><rect x="8" y="9" width="46" height="7" fill="#09090b" rx="1"/><rect x="8" y="21" width="64" height=".6" fill="#e4e4e7"/>{[28,38,48,58,68,78].map((y,i)=>(<rect key={y} x="8" y={y} width={52-(i%4)*8} height="1.5" fill="#a1a1aa" rx="1"/>))}</svg>);
    case "tech":      return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="#f8fafc" rx="4"/><rect width="22" height="100" fill="#0f172a" rx="4"/><rect x="12" width="10" height="100" fill="#0f172a"/><circle cx="11" cy="16" r="5.5" fill={col} fillOpacity=".35"/>{[28,35,42,50].map(y=>(<rect key={y} x="4" y={y} width="13" height="1.5" fill={col} fillOpacity=".45" rx="1"/>))}<rect x="26" y="8" width="44" height="1.5" fill={col} rx="1"/>{[16,25,34,43,52,61,70,79].map((y,i)=>(<rect key={y} x="28" y={y} width={36-(i%3)*5} height="2" fill="#e2e8f0" rx="1"/>))}</svg>);
    case "corporate": return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="white" rx="4"/><rect width="80" height="28" fill={col} rx="3"/><rect y="18" width="80" height="10" fill={col}/><rect x="8" y="10" width="40" height="5" fill="white" fillOpacity=".8" rx="1"/>{[38,46,54,62,70,78,86,94].map((y,i)=>(<rect key={y} x={i%2===0?8:50} y={y} width={i%2===0?38:26} height="2" fill="#e2e8f0" rx="1"/>))}</svg>);
    case "elegant":   return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="white" rx="4"/><rect x="20" y="10" width="40" height="7" fill="#1a1a1a" rx="1"/><rect x="28" y="20" width="8" height="1" fill={col} rx="1"/><rect x="36" y="19" width="3" height="3" fill={col} rx="1"/><rect x="39" y="20" width="13" height="1" fill={col} rx="1"/>{[28,34,40].map((y,i)=>(<rect key={y} x={18+i*2} y={y} width={44-i*4} height="1.5" fill="#a1a1aa" rx="1"/>))}{[50,60,70,80,90].map((y,i)=>(<rect key={y} x="12" y={y} width={56-(i%3)*10} height="1.5" fill="#d4d4d4" rx="1"/>))}</svg>);
    case "ats":       return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="white" rx="4"/><rect x="8" y="8" width="50" height="6" fill="#000" rx="1"/><rect x="8" y="17" width="64" height="1.5" fill="#333"/>{[24,32,40,48,56,64,72,80,88].map((y,i)=>(<rect key={y} x={i%3===0?8:14} y={y} width={i%3===0?60:52} height="1.8" fill={i%3===0?"#555":"#aaa"} rx="1"/>))}</svg>);
    case "bold":      return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="#0f0f0f" rx="4"/><polygon points="35,0 80,0 80,100 50,100" fill={col}/><polygon points="28,0 45,0 60,100 43,100" fill={`${col}60`}/><rect x="6" y="20" width="26" height="8" fill="white" rx="1"/>{[36,44,52,60,68,76,84].map((y,i)=>(<rect key={y} x="6" y={y} width={i%3===0?28:i%3===1?22:25} height="1.8" fill="white" fillOpacity=".5" rx="1"/>))}</svg>);
    case "compact":   return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="white" rx="4"/><rect width="80" height="20" fill={`${col}15`} rx="3"/><rect x="8" y="8" width="30" height="5" fill={col} rx="1"/>{[30,36,42,48,54,60,66,72,78].map((y,i)=>(<rect key={y} x={i%2===0?8:50} y={y} width={i%2===0?38:26} height="1.5" fill="#e2e8f0" rx="1"/>))}</svg>);
    case "academic":  return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="white" rx="4"/><rect x="15" y="8" width="50" height="7" fill="#1e293b" rx="1"/><rect x="20" y="18" width="40" height="2" fill={col} fillOpacity=".5" rx="1"/>{[26,32,38].map((y,i)=>(<rect key={y} x={16+i*4} y={y} width={48-i*8} height="1.5" fill="#94a3b8" rx="1"/>))}{[50,56,62,68,74,80,88].map((y,i)=>(<rect key={y} x={i%3===0?8:16} y={y} width={i%3===0?60:50} height="1.5" fill={i%3===0?"#334155":"#d4d4d4"} rx="1"/>))}</svg>);
    default:          return (<svg viewBox="0 0 80 100" className="w-full h-full"><rect width="80" height="100" fill="#f1f5f9" rx="4"/><rect width="80" height="30" fill={col} rx="3"/>{[38,48,58,68,78].map((y,i)=>(<rect key={y} x="8" y={y} width={65-(i%3)*10} height="2.5" fill="#e2e8f0" rx="1"/>))}</svg>);
  }
}

function GalleryModal({ currentKey, onSelect, onClose }: {
  currentKey:string; onSelect:(key:string)=>void; onClose:()=>void;
}) {
  const [search,  setSearch]  = useState("");
  const [cat,     setCat]     = useState("all");
  const [favs,    setFavs]    = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string|null>(null);

  const filtered = useMemo(() => {
    let list = CATALOGUE;
    if (cat !== "all") list = list.filter(t => t.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(g => g.toLowerCase().includes(q)));
    }
    return list;
  }, [search, cat]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden" style={{ animation:"slideUp .22s cubic-bezier(.34,1.56,.64,1)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Galería de plantillas</h2>
            <p className="text-xs text-gray-400 mt-0.5">{CATALOGUE.length} diseños · Clic para aplicar al instante</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={16} className="text-gray-600"/>
          </button>
        </div>
        <div className="px-6 py-3 border-b border-gray-50 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder="Buscar plantilla..." value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-300 border border-gray-100"/>
            {search && <button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={12} className="text-gray-400"/></button>}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
            {CATS.map(c=>(
              <button key={c.id} onClick={()=>setCat(c.id)}
                className={cn("px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  cat===c.id?"bg-indigo-600 text-white shadow-sm":"bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filtered.map(tpl=>{
              const isActive = currentKey===tpl.key;
              const isHov    = hovered===tpl.key;
              return (
                <div key={tpl.key}
                  className={cn("relative rounded-2xl border-2 overflow-hidden cursor-pointer select-none",
                    isActive?"border-indigo-500 ring-2 ring-indigo-200 shadow-lg":"border-gray-100 hover:border-gray-300 hover:shadow-md")}
                  style={{ transform:isHov&&!isActive?"translateY(-4px)":"none", transition:"all .2s cubic-bezier(.34,1.56,.64,1)" }}
                  onMouseEnter={()=>setHovered(tpl.key)} onMouseLeave={()=>setHovered(null)}
                  onClick={()=>{ onSelect(tpl.key); onClose(); }}>
                  <div className="relative bg-gray-50" style={{ aspectRatio:"4/5" }}>
                    <Thumb k={tpl.key} c={tpl.accent}/>
                    {isHov && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background:"rgba(0,0,0,.45)", backdropFilter:"blur(1px)" }}>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg"
                          style={{ background:tpl.accent }} onClick={e=>{e.stopPropagation();onSelect(tpl.key);onClose();}}>
                          Usar <ArrowRight size={11}/>
                        </button>
                      </div>
                    )}
                    {isActive && <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow"><CheckCircle2 size={11} className="text-white"/></div>}
                    {tpl.ats>=90 && <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full"><Shield size={7}/> ATS</div>}
                    <button onClick={e=>{e.stopPropagation();setFavs(p=>{const n=new Set(p);n.has(tpl.key)?n.delete(tpl.key):n.add(tpl.key);return n;});}}
                      className={cn("absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                        favs.has(tpl.key)?"bg-rose-500 opacity-100":"bg-white/80",(isHov||favs.has(tpl.key))?"opacity-100":"opacity-0")}>
                      <Heart size={10} className={favs.has(tpl.key)?"text-white fill-white":"text-rose-400"} style={{fill:favs.has(tpl.key)?"white":"none"}}/>
                    </button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-[11px] font-bold text-gray-800 truncate">{tpl.name}</p>
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {tpl.tags.slice(0,2).map(tag=>(
                        <span key={tag} className={cn("text-[9px] px-1 py-0.5 rounded-full font-medium",TAG_COLORS[tag]??"bg-gray-100 text-gray-400")}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">{CATALOGUE.length} plantillas · Todas funcionales</p>
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cerrar</button>
        </div>
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}

function Slider({ min, max, step=1, value, onChange, label, format }:{
  min:number;max:number;step?:number;value:number;onChange:(v:number)=>void;label:string;format:(v:number)=>string;
}) {
  const pct=((value-min)/(max-min))*100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600">{label}</span>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
        style={{background:`linear-gradient(to right,#16a34a ${pct}%,#e5e7eb ${pct}%)`}}/>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">{format(min)}</span>
        <span className="text-[10px] text-gray-400">{format(max)}</span>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }:{ checked:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button type="button" onClick={()=>onChange(!checked)}
      className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none",checked?"bg-green-500":"bg-gray-200")}>
      <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform",checked?"translate-x-6":"translate-x-1")}/>
    </button>
  );
}

interface Props {
  profile:Profile|null; records:AcademicRecord[]; skills:Skill[];
  templates:CVTemplate[]; config:CVConfiguration|null; preSelectedTemplate?:string;
}

export default function CVBuilderClient({ profile, records, skills, templates, config, preSelectedTemplate }:Props) {
  const [tplKey,      setTplKey]      = useState(preSelectedTemplate??config?.template?.template_key??"modern");
  const [tab,         setTab]         = useState<Tab>("plantilla");
  const [saving,      setSaving]      = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const supabase = createClient();

  useEffect(()=>{
    const id="smartfolio-gfonts";
    if(document.getElementById(id)) return;
    const link=document.createElement("link");
    link.id=id; link.rel="stylesheet"; link.href=GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  },[]);

  const [accent,       setAccent]       = useState(config?.accent_color??"#059669");
  const [fontName,     setFontName]     = useState("Inter");
  const [fontFamily,   setFontFamily]   = useState("Inter,system-ui,sans-serif");
  const [fontSize,     setFSize]        = useState(13);
  const [lineHeight,   setLH]           = useState(1.55);
  const [uppercase,    setUpper]        = useState(false);
  const [photoShape,   setPhotoShape]   = useState<"circle"|"rounded"|"square">("circle");
  const [sectionStyle, setSectionStyle] = useState<"underline"|"left-bar"|"filled"|"minimal">("underline");
  const [skillsStyle,  setSkillsStyle]  = useState<"chips"|"dots"|"bars"|"text">("chips");
  const [cardStyle,    setCardStyle]    = useState<"flat"|"shadow"|"bordered"|"accent">("flat");
  const [dividerStyle, setDivider]      = useState<"solid"|"dashed"|"dotted"|"double"|"none">("solid");
  const [showPhoto,    setShowPhoto]    = useState(true);
  const [showIcons,    setShowIcons]    = useState(true);
  const [hidden,       setHidden]       = useState<Set<RecordType>>(new Set());
  const [fontCat,      setFontCat]      = useState<"Sans"|"Serif"|"Mono"|"Todos">("Todos");

  /* ── Debounce sliders — evita re-renders en cada pixel ── */
  const debouncedFontSize   = useDebounce(fontSize,   120);
  const debouncedLineHeight = useDebounce(lineHeight, 120);

  const filteredFonts = fontCat==="Todos" ? FONTS : FONTS.filter(f=>f.cat===fontCat);
  const allTpls    = REGISTRY.map(st=>(templates??[]).find(t=>t.template_key===st.template_key)??st);
  const currentTpl = allTpls.find(t=>t.template_key===tplKey)??allTpls[0];

  if(!profile) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center"><FileText size={26} className="text-gray-400"/></div>
      <p className="font-bold text-gray-700">Completa tu perfil primero</p>
      <a href="/profile" className="text-sm text-green-600 underline">Ir al perfil →</a>
    </div>
  );

  const filteredRecords = records.filter(r=>!hidden.has(r.record_type));

  /* ── extConfig usa valores debounced ────────────────────── */
  const extConfig = useMemo(()=>({
    ...(config??{id:"",profile_id:profile.id,template_id:null,sections_config:{} as any,last_generated_at:null,updated_at:""}),
    accent_color:accent, template:currentTpl,
    font_name:fontFamily,
    font_family:fontFamily.includes("Georgia")||fontFamily.includes("Playfair")||fontFamily.includes("Merriweather")||fontFamily.includes("Lora")||fontFamily.includes("Garamond")?"serif":fontFamily.includes("Mono")||fontFamily.includes("Code")||fontFamily.includes("Courier")?"mono":"sans",
    font_size:debouncedFontSize,
    line_height:debouncedLineHeight,
    photo_shape:photoShape, section_style:sectionStyle, skills_style:skillsStyle,
    card_style:cardStyle, divider_style:dividerStyle,
    show_photo:showPhoto, show_icons:showIcons, uppercase,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }),[config,accent,currentTpl,fontFamily,debouncedFontSize,debouncedLineHeight,photoShape,sectionStyle,skillsStyle,cardStyle,dividerStyle,showPhoto,showIcons,uppercase]);

  const cvData = useMemo(
    ()=>generateCVData(profile,filteredRecords,skills,extConfig as CVConfiguration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile,filteredRecords,skills,extConfig]
  );

  const visibleRecs  = records.filter(r=>r.is_visible_in_cv&&!hidden.has(r.record_type));
  const sectionTypes = [...new Set(records.filter(r=>r.is_visible_in_cv).map(r=>r.record_type))];

  const save = async()=>{
    setSaving(true);
    await supabase.from("cv_configurations").upsert({profile_id:profile.id,template_id:currentTpl?.id??null,accent_color:accent,last_generated_at:new Date().toISOString()},{onConflict:"profile_id"});
    toast.success("Guardado ✓");
    setSaving(false);
  };
  const share=()=>{navigator.clipboard.writeText(`${window.location.origin}/p/${profile.username_slug}`);toast.success("¡Enlace copiado! 🔗");};

  /* ── renderPreview memoizado — no se recrea en cada render ─ */
  const renderPreview = useCallback(()=>{
    const p={data:cvData};
    switch(tplKey){
      case "classic":   return <CVPreviewClassic   {...p}/>;
      case "executive": return <CVPreviewExecutive {...p}/>;
      case "creative":  return <CVPreviewCreative  {...p}/>;
      case "minimal":   return <CVPreviewMinimal   {...p}/>;
      case "tech":      return <CVPreviewTech      {...p}/>;
      case "corporate": return <CVPreviewCorporate {...p}/>;
      case "elegant":   return <CVPreviewElegant   {...p}/>;
      case "ats":       return <CVPreviewATS       {...p}/>;
      case "bold":      return <CVPreviewBold      {...p}/>;
      case "compact":   return <CVPreviewCompact   {...p}/>;
      case "academic":  return <CVPreviewAcademic  {...p}/>;
      default:          return <CVPreviewModern    {...p}/>;
    }
  },[tplKey,cvData]);

  const STitle=({icon,text}:{icon:React.ReactNode;text:string})=>(
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 text-[10px]">{icon}</div>
      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{text}</span>
    </div>
  );
  const Divider=()=><div className="border-t border-gray-100 my-4"/>;

  return (
    <>
      {galleryOpen && (
        <GalleryModal currentKey={tplKey}
          onSelect={key=>{setTplKey(key);toast.success(`Plantilla "${CATALOGUE.find(t=>t.key===key)?.name}" aplicada ✓`);}}
          onClose={()=>setGalleryOpen(false)}/>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generador de CV</h1>
            <p className="text-gray-400 text-sm mt-0.5">{visibleRecs.length} registros · {skills.length} habilidades · <span className="text-gray-600 font-medium">{currentTpl?.name}</span></p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={share} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border-2 hover:bg-blue-50 transition-colors" style={{borderColor:"#2563eb",color:"#2563eb"}}>
              <Share2 size={14}/> Compartir
            </button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60" style={{background:"#16a34a"}}>
              {saving?<><Loader2 size={14} className="animate-spin"/> Guardando</>:<><CheckCircle2 size={14}/> Guardar</>}
            </button>
            <PDFDownloadButton data={cvData} fileName={`CV_${profile.first_name}_${profile.last_name}_Smartfolio.pdf`} templateKey={tplKey}/>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
          <aside>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex p-1.5 gap-0.5 bg-gray-50/80 border-b border-gray-100">
                {([
                  {id:"plantilla",label:"Plantilla", icon:<Layout size={10}/>},
                  {id:"fuentes",  label:"Fuentes",   icon:<Type size={10}/>},
                  {id:"estilo",   label:"Estilo",    icon:<Palette size={10}/>},
                  {id:"diseno",   label:"Diseño",    icon:<Sparkles size={10}/>},
                  {id:"secciones",label:"Secciones", icon:<SlidersHorizontal size={10}/>},
                ] as {id:Tab;label:string;icon:React.ReactNode}[]).map(({id,label,icon})=>(
                  <button key={id} onClick={()=>setTab(id)}
                    className={cn("flex-1 flex items-center justify-center gap-0.5 py-2 px-0.5 rounded-2xl text-[10px] font-semibold transition-all",
                      tab===id?"bg-white text-gray-900 shadow-sm":"text-gray-400 hover:text-gray-600")}>
                    {icon}<span className="hidden sm:inline ml-0.5">{label}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-4 max-h-[72vh] overflow-y-auto">

                {tab==="plantilla" && (
                  <>
                    <button onClick={()=>setGalleryOpen(true)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[.98] shadow-md"
                      style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)"}}>
                      <div className="flex items-center gap-2"><Sparkles size={16}/> Explorar galería completa</div>
                      <div className="flex items-center gap-1 text-xs font-normal opacity-80">{CATALOGUE.length} diseños <ArrowRight size={13}/></div>
                    </button>
                    <p className="text-[11px] text-gray-400 font-medium">O elige rápidamente:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {allTpls.map(t=>(
                        <button key={t.id} onClick={()=>setTplKey(t.template_key)}
                          className={cn("relative text-left rounded-2xl border-2 overflow-hidden transition-all hover:shadow-md",
                            tplKey===t.template_key?"border-green-500 shadow-md ring-2 ring-green-100":"border-gray-100 hover:border-gray-200")}>
                          {tplKey===t.template_key && <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><CheckCircle2 size={11} className="text-white"/></div>}
                          <div className="h-20 bg-gray-50 p-2"><Thumb k={t.template_key} c={accent}/></div>
                          <div className="p-2.5 border-t border-gray-50">
                            <p className="text-xs font-bold text-gray-800">{t.name}</p>
                            {t.description&&<p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{t.description}</p>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {tab==="fuentes" && (
                  <>
                    <STitle icon={<Type size={10}/>} text="Familia tipográfica"/>
                    <div className="flex gap-1.5 mb-3">
                      {(["Todos","Sans","Serif","Mono"] as const).map(cat=>(
                        <button key={cat} onClick={()=>setFontCat(cat)}
                          className={cn("flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all",
                            fontCat===cat?"bg-indigo-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {filteredFonts.map(f=>(
                        <button key={f.name} onClick={()=>{setFontName(f.name);setFontFamily(f.family);}}
                          className={cn("w-full text-left rounded-2xl border-2 overflow-hidden transition-all",
                            fontName===f.name?"border-green-500 shadow-sm":"border-gray-100 hover:border-gray-200 hover:shadow-sm")}>
                          <div className={cn("px-4 py-3",fontName===f.name?"bg-green-50":"bg-gray-50")} style={{fontFamily:f.family}}>
                            <p className="text-2xl font-bold text-gray-800 leading-none">Aa Bb Cc</p>
                            <p className="text-xs text-gray-500 mt-1">Nicolás Vega — Desarrollador Web</p>
                          </div>
                          <div className="px-4 py-2 bg-white flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-gray-800">{f.name}</p>
                              <p className="text-[10px] text-gray-400">{f.cat}</p>
                            </div>
                            {fontName===f.name ? <CheckCircle2 size={14} className="text-green-500 flex-shrink-0"/> : <span className="text-[10px] text-gray-300">Usar</span>}
                          </div>
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
                        <p className="text-[10px] text-gray-400 mt-0.5">{uppercase?"JUAN PÉREZ":"Juan Pérez"}</p>
                      </div>
                      <Toggle checked={uppercase} onChange={setUpper}/>
                    </div>
                  </>
                )}

                {tab==="estilo" && (
                  <>
                    <STitle icon={<Palette size={10}/>} text="Color de acento"/>
                    <div className="grid grid-cols-6 gap-2">
                      {PALETTES.map(hex=>(
                        <button key={hex} onClick={()=>setAccent(hex)}
                          className={cn("aspect-square rounded-xl transition-all hover:scale-110",
                            accent===hex?"ring-2 ring-offset-2 ring-gray-800 scale-110 shadow-lg":"hover:shadow-md")}
                          style={{background:hex}}>
                          {accent===hex&&<div className="flex items-center justify-center h-full"><div className="w-2.5 h-2.5 bg-white rounded-full shadow"/></div>}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-2xl">
                      <input type="color" value={accent} onChange={e=>setAccent(e.target.value)}
                        className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent flex-shrink-0" style={{padding:0}}/>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono font-bold text-gray-700">{accent.toUpperCase()}</p>
                        <p className="text-[10px] text-gray-400">Color personalizado</p>
                      </div>
                      <div className="w-10 h-9 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                        <div className="h-1/2" style={{background:accent}}/>
                        <div className="h-1/2 bg-white flex items-center px-1.5"><div className="h-1 w-5 bg-gray-200 rounded-full"/></div>
                      </div>
                    </div>
                    <Divider/>
                    <STitle icon={<Minus size={10}/>} text="Estilo de separadores"/>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(["solid","dashed","dotted","double","none"] as const).map(ds=>(
                        <button key={ds} onClick={()=>setDivider(ds)}
                          className={cn("p-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all",
                            dividerStyle===ds?"border-green-500 bg-green-50":"border-gray-100 hover:border-gray-200")}>
                          <div style={{width:"100%",height:0,borderTop:`2px solid ${dividerStyle===ds?"#16a34a":"#d1d5db"}`,borderTopStyle:ds==="none"?"solid":ds as any,opacity:ds==="none"?0:1}}/>
                          <span className="text-[9px] font-semibold text-gray-500 capitalize">{ds}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {tab==="diseno" && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <STitle icon={<User size={10}/>} text="Foto de perfil"/>
                      <Toggle checked={showPhoto} onChange={setShowPhoto}/>
                    </div>
                    {showPhoto&&(
                      <div className="grid grid-cols-3 gap-2">
                        {[{key:"circle",label:"Círculo",radius:"50%"},{key:"rounded",label:"Redondeado",radius:"10px"},{key:"square",label:"Cuadrado",radius:"2px"}].map(({key,label,radius})=>(
                          <button key={key} onClick={()=>setPhotoShape(key as any)}
                            className={cn("p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all",
                              photoShape===key?"border-green-500 bg-green-50":"border-gray-100 hover:border-gray-200")}>
                            <div className="w-9 h-9 bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center" style={{borderRadius:radius}}>
                              <User size={14} className="text-gray-500"/>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-600">{label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <Divider/>
                    <STitle icon={<Minus size={10}/>} text="Encabezado de sección"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {key:"underline",label:"Línea inferior",render:(c:string)=>(<div className="px-2 py-2"><p className="text-[9px] font-bold text-gray-700 tracking-widest uppercase mb-1">Educación</p><div className="h-0.5 rounded-full" style={{background:c}}/></div>)},
                        {key:"left-bar", label:"Barra lateral", render:(c:string)=>(<div className="px-2 py-2 flex items-center gap-1.5"><div className="w-0.5 h-4 rounded-full" style={{background:c}}/><p className="text-[9px] font-bold text-gray-700 tracking-widest uppercase">Educación</p></div>)},
                        {key:"filled",   label:"Fondo relleno", render:(c:string)=>(<div className="mx-2 my-1.5 px-2 py-1 rounded-md" style={{background:`${c}18`}}><p className="text-[9px] font-bold tracking-widest uppercase" style={{color:c}}>Educación</p></div>)},
                        {key:"minimal",  label:"Minimalista",   render:(_:string)=>(<div className="px-2 py-2"><p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Educación</p></div>)},
                      ].map(({key,label,render})=>(
                        <button key={key} onClick={()=>setSectionStyle(key as any)}
                          className={cn("rounded-2xl border-2 overflow-hidden text-left transition-all",
                            sectionStyle===key?"border-green-500":"border-gray-100 hover:border-gray-200")}>
                          <div className="bg-gray-50 min-h-[40px] border-b border-gray-100">{render(accent)}</div>
                          <p className="text-[10px] font-semibold text-gray-600 p-2">{label}</p>
                        </button>
                      ))}
                    </div>
                    <Divider/>
                    <STitle icon={<Tag size={10}/>} text="Habilidades"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {key:"chips",label:"Etiquetas", render:(c:string)=>(<div className="flex flex-wrap gap-1 p-2">{["React","Node","CSS"].map(s=>(<span key={s} className="text-[8px] px-1.5 py-0.5 rounded-full font-medium" style={{background:`${c}18`,color:c,border:`1px solid ${c}33`}}>{s}</span>))}</div>)},
                        {key:"dots", label:"Puntos",    render:(_:string)=>(<div className="p-2 space-y-0.5">{["React","Node","CSS"].map(s=>(<div key={s} className="flex items-center gap-1 text-[9px] text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"/>{s}</div>))}</div>)},
                        {key:"bars", label:"Barras",    render:(c:string)=>(<div className="p-2 space-y-1.5">{[["React",80],["Node",60]].map(([s,v])=>(<div key={s as string}><p className="text-[8px] text-gray-500 mb-0.5">{s as string}</p><div className="h-1 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${v}%`,background:c}}/></div></div>))}</div>)},
                        {key:"text", label:"Texto",     render:(_:string)=>(<div className="p-2"><p className="text-[9px] text-gray-500 leading-relaxed">React · Node · CSS · Git</p></div>)},
                      ].map(({key,label,render})=>(
                        <button key={key} onClick={()=>setSkillsStyle(key as any)}
                          className={cn("rounded-2xl border-2 overflow-hidden text-left transition-all",
                            skillsStyle===key?"border-green-500":"border-gray-100 hover:border-gray-200")}>
                          <div className="bg-gray-50 min-h-[48px] border-b border-gray-100">{render(accent)}</div>
                          <p className="text-[10px] font-semibold text-gray-600 p-2">{label}</p>
                        </button>
                      ))}
                    </div>
                    <Divider/>
                    <STitle icon={<BarChart2 size={10}/>} text="Estilo de entradas"/>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {key:"flat",     label:"Simple",   style:{} as React.CSSProperties},
                        {key:"shadow",   label:"Sombra",   style:{boxShadow:"0 1px 4px rgba(0,0,0,.1)"} as React.CSSProperties},
                        {key:"bordered", label:"Bordeado", style:{border:"1px solid #e5e7eb"} as React.CSSProperties},
                        {key:"accent",   label:"Acento",   style:{} as React.CSSProperties},
                      ].map(({key,label,style})=>(
                        <button key={key} onClick={()=>setCardStyle(key as any)}
                          className={cn("p-3 rounded-2xl border-2 text-left transition-all",
                            cardStyle===key?"border-green-500 bg-green-50":"border-gray-100 hover:border-gray-200")}>
                          <div className="h-6 rounded-lg mb-1.5 flex items-center px-2 bg-white"
                            style={{...style,...(key==="accent"?{background:`${accent}14`,borderLeft:`3px solid ${accent}`}:{})}}>
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

                {tab==="secciones" && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Visibilidad</p>
                      {hidden.size>0&&<button onClick={()=>setHidden(new Set())} className="text-[10px] text-green-600 font-semibold hover:underline">Mostrar todo</button>}
                    </div>
                    {sectionTypes.length===0?(
                      <div className="text-center py-8">
                        <BookOpen size={22} className="mx-auto mb-2 text-gray-300"/>
                        <p className="text-xs text-gray-400">Sin registros visibles</p>
                        <a href="/academic" className="text-green-600 text-xs underline mt-1 block">Agregar →</a>
                      </div>
                    ):sectionTypes.map(type=>{
                      const off=hidden.has(type);
                      const count=records.filter(r=>r.is_visible_in_cv&&r.record_type===type).length;
                      return (
                        <div key={type}
                          onClick={()=>setHidden(prev=>{const n=new Set(prev);off?n.delete(type):n.add(type);return n;})}
                          className={cn("flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all select-none mb-2",
                            off?"border-gray-100 bg-gray-50 opacity-60":"border-green-100 bg-green-50/60")}>
                          <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0",
                            off?"bg-gray-200 text-gray-400":"bg-green-200 text-green-700")}>
                            {off?"✕":"✓"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-700 truncate">{RECORD_TYPE_LABELS[type]}</p>
                            <p className="text-[10px] text-gray-400">{count} entrada{count!==1?"s":""}</p>
                          </div>
                          <Toggle checked={!off} onChange={()=>{}}/>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                {v:currentTpl?.name??"—",l:"Plantilla"},
                {v:`${sectionTypes.length-hidden.size}/${sectionTypes.length}`,l:"Secciones"},
                {v:String(skills.length),l:"Habilidades"},
              ].map(({v,l})=>(
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
              <div className="flex items-center gap-1.5 text-xs text-gray-400"><Eye size={12}/> Vista previa en tiempo real</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{background:accent}}/>
                <span className="text-xs font-medium text-gray-600">{currentTpl?.name}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400" style={{fontFamily}}>{fontName} {fontSize}px</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-5 flex-1 min-h-[640px] border border-gray-200 shadow-inner">
              {/* Fix fuentes */}
              <style>{`.sf-preview * { font-family: ${fontFamily} !important; }`}</style>
              {/* SIN key prop — React actualiza sin destruir el componente */}
              <div className="sf-preview bg-white rounded-2xl shadow-xl overflow-hidden min-h-[590px]">
                {renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}