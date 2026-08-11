"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Heart, Eye, ArrowRight, Sparkles,
  Zap, Star, Award, Shield, Briefcase,
  Layout, Palette, X, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Template catalogue ─────────────────────────────────── */
interface TemplateInfo {
  key:         string;
  name:        string;
  category:    string;
  description: string;
  tags:        string[];
  ats:         number;       // 0–100
  accent:      string;       // default accent color
  functional:  boolean;      // false = coming soon
  pages:       number;
}

const TEMPLATES: TemplateInfo[] = [
  {
    key:"modern", name:"Moderna", category:"profesional",
    description:"Sidebar colorido con foto, ideal para cualquier perfil",
    tags:["Popular","ATS"], ats:82, accent:"#059669", functional:true, pages:1,
  },
  {
    key:"classic", name:"Clásica", category:"tradicional",
    description:"Encabezado centrado y formato académico tradicional",
    tags:["Formal","ATS"], ats:95, accent:"#2563eb", functional:true, pages:1,
  },
  {
    key:"executive", name:"Ejecutiva", category:"ejecutivo",
    description:"Tipografía protagonista, líneas limpias y elegantes",
    tags:["Premium","Elegante"], ats:90, accent:"#374151", functional:true, pages:1,
  },
  {
    key:"creative", name:"Creativa", category:"creativo",
    description:"Header bold con foto y sidebar de habilidades",
    tags:["Nuevo","Visual"], ats:68, accent:"#7c3aed", functional:true, pages:1,
  },
  {
    key:"minimal", name:"Minimalista", category:"minimalista",
    description:"Tipografía serif, espacios amplios, ultra limpia",
    tags:["Limpia","Serif"], ats:88, accent:"#18181b", functional:true, pages:1,
  },
  {
    key:"tech", name:"Tecnológica", category:"tecnológico",
    description:"Sidebar oscuro estilo código, ideal para devs",
    tags:["Nuevo","Dev"], ats:75, accent:"#06b6d4", functional:true, pages:1,
  },
  {
    key:"corporate", name:"Corporativa", category:"corporativo",
    description:"Header navy oscuro, dos columnas, máximo profesionalismo",
    tags:["Próximamente"], ats:92, accent:"#1e3a5f", functional:false, pages:1,
  },
  {
    key:"elegant", name:"Elegante", category:"ejecutivo",
    description:"Acento dorado, centrada, sensación de lujo",
    tags:["Próximamente","Premium"], ats:80, accent:"#b7882c", functional:false, pages:1,
  },
  {
    key:"academic", name:"Académica", category:"académico",
    description:"Diseño denso, ideal para investigadores y docentes",
    tags:["Próximamente"], ats:94, accent:"#4f46e5", functional:false, pages:2,
  },
  {
    key:"bold", name:"Audaz", category:"creativo",
    description:"Diagonal accent, formas geométricas, muy impactante",
    tags:["Próximamente","Visual"], ats:60, accent:"#e11d48", functional:false, pages:1,
  },
  {
    key:"ats", name:"ATS Pro", category:"ats",
    description:"Sin imágenes ni tablas, optimizada al 100% para ATS",
    tags:["Próximamente","ATS"], ats:100, accent:"#16a34a", functional:false, pages:1,
  },
  {
    key:"compact", name:"Compacta", category:"profesional",
    description:"Más contenido en menos espacio, letra optimizada",
    tags:["Próximamente"], ats:85, accent:"#0891b2", functional:false, pages:1,
  },
];

const CATEGORIES = [
  { id:"all",          label:"Todas",        icon:<Layout size={13}/> },
  { id:"profesional",  label:"Profesional",  icon:<Briefcase size={13}/> },
  { id:"creativo",     label:"Creativo",     icon:<Palette size={13}/> },
  { id:"ejecutivo",    label:"Ejecutivo",    icon:<Award size={13}/> },
  { id:"tecnológico",  label:"Tecnológico",  icon:<Zap size={13}/> },
  { id:"minimalista",  label:"Minimalista",  icon:<Sparkles size={13}/> },
  { id:"corporativo",  label:"Corporativo",  icon:<Shield size={13}/> },
  { id:"ats",          label:"ATS Friendly", icon:<CheckCircle2 size={13}/> },
];

const TAG_COLORS: Record<string,string> = {
  Popular:        "bg-green-100 text-green-700",
  Nuevo:          "bg-blue-100 text-blue-700",
  ATS:            "bg-emerald-100 text-emerald-700",
  Premium:        "bg-amber-100 text-amber-700",
  Formal:         "bg-slate-100 text-slate-600",
  Elegante:       "bg-purple-100 text-purple-700",
  Visual:         "bg-rose-100 text-rose-700",
  Serif:          "bg-orange-100 text-orange-700",
  Dev:            "bg-cyan-100 text-cyan-700",
  Limpia:         "bg-teal-100 text-teal-700",
  Próximamente:   "bg-gray-100 text-gray-500",
};

/* ── Detailed SVG thumbnails ────────────────────────────── */
function TemplateThumbnail({ tpl, accent }: { tpl: TemplateInfo; accent: string }) {
  const c = accent;
  const w = 210, h = 297; // A4 ratio

  switch (tpl.key) {

    case "modern": return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <rect width={w} height={h} fill="#f8fafc"/>
        {/* Sidebar */}
        <rect width="70" height={h} fill={c}/>
        {/* Photo circle */}
        <circle cx="35" cy="44" r="22" fill="rgba(255,255,255,.22)"/>
        <circle cx="35" cy="44" r="18" fill="rgba(255,255,255,.15)"/>
        {/* Name in sidebar */}
        <rect x="8" y="76" width="52" height="4" fill="white" fillOpacity=".85" rx="2"/>
        <rect x="16" y="83" width="36" height="3" fill="white" fillOpacity=".55" rx="1"/>
        {/* Sidebar sections */}
        {[100,108,116,134,142,150,168,176,184].map((y,i)=>(
          <rect key={y} x="8" y={y} width={i%3===0?50:i%3===1?38:44} height="2.5" fill="white" fillOpacity=".35" rx="1"/>
        ))}
        {/* Main content */}
        <rect x="82" y="20" width="90" height="7" fill={c} rx="2"/>
        <rect x="82" y="30" width="60" height="3.5" fill="#94a3b8" rx="1"/>
        <rect x="82" y="42" width="115" height=".8" fill={c} fillOpacity=".5"/>
        {[50,58,66,80,88,96,104,118,126,134,148,156,164].map((y,i)=>(
          <rect key={y} x="82" y={y} width={i%4===0?110:i%4===1?90:i%4===2?100:80} height="2.5" fill="#e2e8f0" rx="1"/>
        ))}
        {/* Section titles */}
        {[72,108,140].map(y=>(
          <rect key={y} x="82" y={y} width="50" height="3.5" fill={c} rx="1"/>
        ))}
      </svg>
    );

    case "classic": return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <rect width={w} height={h} fill="white"/>
        {/* Header */}
        <rect x="55" y="16" width="100" height="9" fill="#1e293b" rx="2"/>
        <rect x="75" y="28" width="60" height="4" fill={c} rx="1"/>
        {/* Contact row */}
        <rect x="30" y="36" width="30" height="2.5" fill="#94a3b8" rx="1"/>
        <rect x="88" y="36" width="30" height="2.5" fill="#94a3b8" rx="1"/>
        <rect x="148" y="36" width="30" height="2.5" fill="#94a3b8" rx="1"/>
        {/* Divider */}
        <rect x="20" y="43" width="170" height="1.5" fill={c}/>
        {/* Bio */}
        {[50,56,62].map((y,i)=>(
          <rect key={y} x="20" y={y} width={i===1?150:i===2?120:170} height="2.5" fill="#94a3b8" rx="1"/>
        ))}
        {/* Two columns */}
        <rect x="20" y="72" width="70" height="3.5" fill={c} rx="1"/>
        <rect x="110" y="72" width="80" height="3.5" fill={c} rx="1"/>
        {[80,88,96,104,112,120,128,136,144,152,160,168].map((y,i)=>(
          <rect key={y} x={i%2===0?20:110} y={y} width={i%2===0?70:80} height="2.5" fill="#e2e8f0" rx="1"/>
        ))}
      </svg>
    );

    case "executive": return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <rect width={w} height={h} fill="#fafafa"/>
        {/* Big name */}
        <rect x="20" y="20" width="120" height="11" fill="#0f172a" rx="2"/>
        {/* Accent bar */}
        <rect x="20" y="36" width="40" height="2" fill={c} rx="1"/>
        {/* Contact */}
        {[46,54].map((y,i)=>(
          <rect key={y} x="20" y={y} width={i===0?80:60} height="2.5" fill="#94a3b8" rx="1"/>
        ))}
        {/* Section title + content */}
        {[70,100,130,160,190,220].map((y,i)=>(
          <g key={y}>
            <rect x="20" y={y} width="60" height="2.5" fill={c} rx="1"/>
            <rect x="20" y={y+6} width="170" height=".7" fill={c} fillOpacity=".3"/>
            <rect x="20" y={y+12} width="140" height="2.5" fill="#0f172a" rx="1"/>
            <rect x="20" y={y+18} width="110" height="2" fill="#cbd5e1" rx="1"/>
            <rect x="20" y={y+24} width="130" height="2" fill="#cbd5e1" rx="1"/>
          </g>
        ))}
      </svg>
    );

    case "creative": return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <rect width={w} height={h} fill="#f8fafc"/>
        {/* Bold header */}
        <rect width={w} height="72" fill={c}/>
        {/* Decorative circles */}
        <circle cx={w-20} cy="10" r="28" fill="rgba(255,255,255,.07)"/>
        <circle cx="10" cy={72} r="20" fill="rgba(255,255,255,.05)"/>
        {/* Photo */}
        <circle cx="36" cy="36" r="22" fill="rgba(255,255,255,.2)"/>
        <circle cx="36" cy="36" r="17" fill="rgba(255,255,255,.15)"/>
        {/* Name */}
        <rect x="68" y="20" width="90" height="8" fill="white" rx="2"/>
        <rect x="68" y="32" width="60" height="4" fill="rgba(255,255,255,.7)" rx="1"/>
        {/* Contact chips */}
        {[44,56,68].map((x,i)=>(
          <rect key={x} x={68+i*46} y="52" width="40" height="12" fill="rgba(255,255,255,.15)" rx="6"/>
        ))}
        {/* Main + Sidebar */}
        <rect x="150" y="76" width="56" height={h-80} fill="#f1f5f9" rx="0"/>
        {/* Main content */}
        {[84,92,100,116,124,132,148,156,164,180,188,196,212].map((y,i)=>(
          <rect key={y} x="12" y={y} width={i%4===0?120:i%4===1?100:i%4===2?110:90} height="2.5" fill="#e2e8f0" rx="1"/>
        ))}
        {[80,112,144,176,208].map(y=>(
          <rect key={y} x="12" y={y} width="40" height="3.5" fill={c} rx="1"/>
        ))}
        {/* Sidebar chips */}
        {[82,98,114,130,146,162,178,194,210].map((y,i)=>(
          <rect key={y} x="154" y={y} width={i%3===0?44:i%3===1?36:40} height="8" fill={`${c}22`} rx="4"/>
        ))}
      </svg>
    );

    case "minimal": return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <rect width={w} height={h} fill="white"/>
        {/* Large name */}
        <rect x="20" y="22" width="130" height="12" fill="#09090b" rx="2"/>
        {/* Thin rule */}
        <rect x="20" y="40" width="170" height=".7" fill="#e4e4e7"/>
        {/* Contact */}
        {[48,56].map((y,i)=>(
          <rect key={y} x="20" y={y} width={i===0?160:120} height="2.5" fill="#a1a1aa" rx="1"/>
        ))}
        {/* Bio */}
        {[66,72,78].map((y,i)=>(
          <rect key={y} x="20" y={y} width={i===0?165:i===1?140:100} height="2.5" fill="#71717a" rx="1"/>
        ))}
        {/* Sections with rule */}
        {[96,140,184,228].map((y,i)=>(
          <g key={y}>
            <rect x="20" y={y} width="55" height="2.5" fill={c} rx="1"/>
            <rect x="80" y={y+1} width="110" height=".7" fill="#e4e4e7"/>
            {[y+10, y+18, y+26].map((sy,si)=>(
              <rect key={sy} x="20" y={sy} width={si===0?160:si===1?130:110} height="2" fill="#d4d4d4" rx="1"/>
            ))}
          </g>
        ))}
      </svg>
    );

    case "tech": return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <rect width={w} height={h} fill="#f8fafc"/>
        {/* Dark sidebar */}
        <rect width="68" height={h} fill="#0f172a"/>
        {/* Profile in sidebar */}
        <rect x="12" y="14" width="44" height="44" fill={`${c}22`} rx="8"/>
        <circle cx="34" cy="36" r="16" fill={`${c}33`}/>
        {/* Name in sidebar */}
        <rect x="8" y="68" width="50" height="4" fill="white" fillOpacity=".8" rx="1"/>
        <rect x="14" y="76" width="36" height="3" fill={c} fillOpacity=".6" rx="1"/>
        {/* Sidebar code comments */}
        {[90,98,106,124,132,140,158,166,174,192,200,208].map((y,i)=>(
          <rect key={y} x="8" y={y} width={i%3===0?52:i%3===1?40:46} height="2" fill={i%6===0?c:"rgba(255,255,255,.25)"} rx="1"/>
        ))}
        {/* Main */}
        <rect x="80" y="14" width="115" height="1.5" fill={c}/>
        {/* Code-style header */}
        <rect x="80" y="20" width="50" height="3" fill="#94a3b8" rx="1"/>
        <rect x="80" y="28" width="90" height="8" fill="#0f172a" rx="2"/>
        {/* Content */}
        {[46,54,62,76,84,92,100,114,122,130,144,152,160,174,182,190].map((y,i)=>(
          <rect key={y} x="80" y={y} width={i%4===0?110:i%4===1?90:i%4===2?100:80} height="2.5" fill="#e2e8f0" rx="1"/>
        ))}
        {/* Section comments */}
        {[68,108,138,168].map(y=>(
          <rect key={y} x="80" y={y} width="60" height="3" fill={c} fillOpacity=".8" rx="1"/>
        ))}
        {/* Accent bar */}
        <rect x="80" y="40" width="115" height="1.5" fill={c}/>
      </svg>
    );

    // Coming soon templates (slightly grayed)
    default: {
      const colors: Record<string,string> = {
        corporate:"#1e3a5f", elegant:"#b7882c", academic:"#4f46e5",
        bold:"#e11d48", ats:"#16a34a", compact:"#0891b2",
      };
      const tc = colors[tpl.key] || "#64748b";
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full opacity-60">
          <rect width={w} height={h} fill="#f1f5f9"/>
          <rect width={w} height="60" fill={tc}/>
          <rect x="20" y="20" width="100" height="8" fill="white" fillOpacity=".6" rx="2"/>
          {[76,88,100,112,130,142,154,166,184,196,208,220].map((y,i)=>(
            <rect key={y} x="20" y={y} width={170-(i%4)*20} height="3" fill="#cbd5e1" rx="1"/>
          ))}
        </svg>
      );
    }
  }
}

/* ── Template card ──────────────────────────────────────── */
function TemplateCard({
  tpl, isFav, onFav, onUse,
}: {
  tpl: TemplateInfo;
  isFav: boolean;
  onFav: () => void;
  onUse: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        boxShadow: hovered
          ? "0 20px 60px -10px rgba(0,0,0,.18), 0 4px 20px -4px rgba(0,0,0,.12)"
          : "0 2px 12px rgba(0,0,0,.08)",
        transform: hovered ? "translateY(-4px) scale(1.012)" : "translateY(0) scale(1)",
        transition: "all 0.28s cubic-bezier(.34,1.56,.64,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio:"210/297" }}>
        <TemplateThumbnail tpl={tpl} accent={tpl.accent}/>

        {/* Overlay on hover */}
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-200",
          hovered ? "opacity-100 bg-black/40 backdrop-blur-[2px]" : "opacity-0 pointer-events-none"
        )}>
          {tpl.functional ? (
            <>
              <button
                onClick={e => { e.stopPropagation(); onUse(); }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full shadow-lg active:scale-95 transition-transform"
                style={{ background: tpl.accent }}
              >
                Usar plantilla <ArrowRight size={14}/>
              </button>
              <button
                onClick={e => { e.stopPropagation(); onUse(); }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-white/20 border border-white/40 rounded-full hover:bg-white/30 transition-colors"
              >
                <Eye size={12}/> Vista previa
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="px-4 py-2 bg-white/90 rounded-full text-xs font-bold text-gray-700 shadow">
                Próximamente
              </div>
              <p className="text-white/80 text-xs text-center px-4">
                Esta plantilla estará disponible pronto
              </p>
            </div>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={e => { e.stopPropagation(); onFav(); }}
          className={cn(
            "absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all",
            isFav ? "bg-rose-500 shadow-md" : "bg-white/80 hover:bg-white shadow-sm",
            hovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          style={{ transition:"opacity 0.2s, background 0.15s, transform 0.1s" }}
        >
          <Heart size={14} className={isFav ? "text-white fill-white" : "text-rose-400"}
            style={{ fill: isFav ? "white" : "none" }}/>
        </button>

        {/* ATS badge */}
        {tpl.ats >= 90 && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow">
            <Shield size={9}/> ATS {tpl.ats}%
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="bg-white px-3 pt-2.5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-tight truncate">{tpl.name}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-1">{tpl.description}</p>
          </div>
          {tpl.functional && (
            <div className="flex items-center gap-1 text-[10px] text-amber-500 flex-shrink-0 mt-0.5">
              <Star size={9} className="fill-amber-400 text-amber-400"/>
              <Star size={9} className="fill-amber-400 text-amber-400"/>
              <Star size={9} className="fill-amber-400 text-amber-400"/>
            </div>
          )}
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {tpl.tags.slice(0,3).map(tag => (
            <span key={tag} className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", TAG_COLORS[tag] ?? "bg-gray-100 text-gray-500")}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function TemplateGalleryClient() {
  const router = useRouter();
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("all");
  const [favs, setFavs]         = useState<Set<string>>(new Set());
  const [showFavs, setShowFavs] = useState(false);

  const filtered = useMemo(() => {
    let list = TEMPLATES;
    if (showFavs) list = list.filter(t => favs.has(t.key));
    if (category !== "all") list = list.filter(t => t.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, category, favs, showFavs]);

  const toggleFav = (key: string) => {
    setFavs(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const goToTemplate = (key: string) => {
    router.push(`/cv-builder?template=${key}`);
  };

  return (
    <div className="min-h-screen" style={{ background:"#f8fafc" }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{
        background:"linear-gradient(135deg, #6366f1 0%, #8b5cf6 35%, #ec4899 70%, #f43f5e 100%)",
        padding:"52px 32px 44px",
      }}>
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { x:"5%",  y:"-20%", size:280, op:.06 },
            { x:"80%", y:"40%",  size:200, op:.08 },
            { x:"50%", y:"-10%", size:160, op:.05 },
          ].map((s,i)=>(
            <div key={i} style={{
              position:"absolute", left:s.x, top:s.y,
              width:s.size, height:s.size, borderRadius:"50%",
              background:"white", opacity:s.op,
            }}/>
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="flex items-center gap-2 justify-center mb-3">
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Smartfolio</span>
            <span className="w-1 h-1 bg-white/40 rounded-full"/>
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Studio</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white text-center leading-tight mb-3">
            Diseña un CV que destaque
          </h1>
          <p className="text-white/75 text-center text-base mb-8 max-w-lg mx-auto leading-relaxed">
            {TEMPLATES.filter(t=>t.functional).length} plantillas profesionales listas para personalizar y exportar como PDF.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              type="text"
              placeholder="Buscar por nombre, estilo o categoría..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm bg-white shadow-xl text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/60"
            />
            {search && (
              <button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={15}/>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-6">
            {[
              { v:`${TEMPLATES.filter(t=>t.functional).length}`, l:"Disponibles" },
              { v:`${TEMPLATES.length}`,                          l:"En total"   },
              { v:"PDF",                                          l:"Exporta"    },
            ].map(({v,l})=>(
              <div key={l} className="text-center">
                <p className="text-xl font-extrabold text-white">{v}</p>
                <p className="text-white/60 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-wrap">

            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={()=>{ setCategory(cat.id); setShowFavs(false); }}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  category === cat.id && !showFavs
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}>
                {cat.icon} {cat.label}
              </button>
            ))}

            {/* Favorites toggle */}
            <button onClick={()=>{ setShowFavs(p=>!p); setCategory("all"); }}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ml-auto",
                showFavs ? "bg-rose-500 text-white shadow-md shadow-rose-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}>
              <Heart size={12} className={showFavs ? "fill-white text-white" : "text-rose-400"}/>
              Favoritos {favs.size > 0 && `(${favs.size})`}
            </button>
          </div>
        </div>
      </div>

      {/* ── Gallery grid ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {filtered.length === 0
              ? "Sin resultados"
              : `${filtered.length} plantilla${filtered.length !== 1 ? "s" : ""}`}
            {search && <span className="text-gray-400"> para &ldquo;{search}&rdquo;</span>}
          </p>
          {(search || category !== "all" || showFavs) && (
            <button onClick={()=>{ setSearch(""); setCategory("all"); setShowFavs(false); }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
              <X size={11}/> Limpiar filtros
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Search size={28} className="text-gray-300"/>
            </div>
            <p className="font-semibold text-gray-500">Sin resultados</p>
            <button onClick={()=>{ setSearch(""); setCategory("all"); setShowFavs(false); }}
              className="text-sm text-indigo-600 hover:underline">
              Ver todas las plantillas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
            {filtered.map(tpl => (
              <TemplateCard
                key={tpl.key}
                tpl={tpl}
                isFav={favs.has(tpl.key)}
                onFav={() => toggleFav(tpl.key)}
                onUse={() => goToTemplate(tpl.key)}
              />
            ))}
          </div>
        )}

        {/* Coming soon banner */}
        {!showFavs && category === "all" && (
          <div className="mt-10 rounded-3xl overflow-hidden"
            style={{ background:"linear-gradient(135deg,#f8fafc,#f1f5f9)" }}>
            <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                <Sparkles size={24} className="text-white"/>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-gray-900 text-lg">Más plantillas en camino</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Las plantillas marcadas como &ldquo;Próximamente&rdquo; estarán disponibles en futuras actualizaciones de Smartfolio.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <span className="px-3 py-1.5 text-xs font-semibold bg-white text-gray-600 rounded-full shadow-sm border border-gray-200">
                  +{TEMPLATES.filter(t=>!t.functional).length} próximamente
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}