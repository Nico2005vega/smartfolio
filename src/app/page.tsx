import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText, Award, Globe, ArrowRight,
  CheckCircle2, BookOpen, Palette, Shield,
} from "lucide-react";

export const metadata = { title: "Smartfolio · Portafolios académicos UTS" };

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui,-apple-system,sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{ background:"white", borderBottom:"1px solid #e5e7eb", padding:"0 32px", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:"linear-gradient(135deg,#16a34a,#059669)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FileText size={16} color="white"/>
          </div>
          <div>
            <p style={{ fontSize:"15px", fontWeight:"800", color:"#111827", margin:0, lineHeight:1 }}>Smartfolio</p>
            <p style={{ fontSize:"10px", color:"#9ca3af", margin:0 }}></p>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          {user ? (
            <Link href="/dashboard" style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 18px", background:"#16a34a", color:"white", borderRadius:"10px", textDecoration:"none", fontSize:"14px", fontWeight:"600" }}>
              Ir al dashboard <ArrowRight size={14}/>
            </Link>
          ) : (
            <>
              <Link href="/login" style={{ padding:"8px 16px", color:"#374151", textDecoration:"none", fontSize:"14px", fontWeight:"500", borderRadius:"8px", border:"1px solid #e5e7eb" }}>
                Iniciar sesión
              </Link>
              <Link href="/register" style={{ padding:"8px 16px", background:"#16a34a", color:"white", textDecoration:"none", fontSize:"14px", fontWeight:"600", borderRadius:"8px" }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ background:"linear-gradient(135deg,#052e16 0%,#166534 60%,#15803d 100%)", padding:"72px 32px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", left:"10%", top:"-40px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(255,255,255,0.03)" }}/>
        <div style={{ position:"absolute", right:"5%", bottom:"-60px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(74,222,128,0.05)" }}/>

        <div style={{ position:"relative", maxWidth:"640px", margin:"0 auto" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.3)", borderRadius:"99px", padding:"4px 12px", marginBottom:"20px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#4ade80" }}/>
            <span style={{ color:"#4ade80", fontSize:"12px", fontWeight:"600" }}></span>
          </div>

          <h1 style={{ color:"white", fontSize:"42px", fontWeight:"800", margin:"0 0 16px", lineHeight:1.15, letterSpacing:"-0.5px" }}>
            Tu portafolio académico<br/>
            <span style={{ color:"#4ade80" }}>profesional</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"17px", margin:"0 0 36px", lineHeight:1.6, maxWidth:"480px", marginLeft:"auto", marginRight:"auto" }}>
            Registra tu formación, genera tu hoja de vida y comparte tu portafolio público desde un solo lugar.
          </p>

          <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
            {user ? (
              <Link href="/dashboard" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"14px 28px", background:"white", color:"#16a34a", borderRadius:"12px", textDecoration:"none", fontSize:"15px", fontWeight:"700", boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
                Ir a mi dashboard <ArrowRight size={16}/>
              </Link>
            ) : (
              <>
                <Link href="/register" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"14px 28px", background:"white", color:"#16a34a", borderRadius:"12px", textDecoration:"none", fontSize:"15px", fontWeight:"700", boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
                  Comenzar gratis <ArrowRight size={16}/>
                </Link>
                <Link href="/login" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"14px 28px", background:"rgba(255,255,255,0.12)", color:"white", borderRadius:"12px", textDecoration:"none", fontSize:"15px", fontWeight:"600", border:"1px solid rgba(255,255,255,0.25)" }}>
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"64px 32px" }}>
        <h2 style={{ textAlign:"center", fontSize:"28px", fontWeight:"800", color:"#111827", margin:"0 0 8px" }}>
          Todo lo que necesitas en un lugar
        </h2>
        <p style={{ textAlign:"center", color:"#6b7280", fontSize:"15px", margin:"0 0 48px" }}>
          Diseñado especialmente para estudiantes de la UTS
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"20px" }}>
          {[
            { icon:BookOpen,  color:"#16a34a", bg:"#f0fdf4", title:"Registros académicos",  desc:"Guarda títulos, cursos, experiencias y certificaciones de forma organizada." },
            { icon:Palette,   color:"#7c3aed", bg:"#f5f3ff", title:"Generador de CV",       desc:"12 plantillas profesionales. Exporta tu hoja de vida en PDF con un clic." },
            { icon:Globe,     color:"#2563eb", bg:"#eff6ff", title:"Portafolio público",     desc:"Comparte tu perfil con empresas y reclutadores sin que inicien sesión." },
            { icon:Shield,    color:"#d97706", bg:"#fffbeb", title:"Seguro y privado",       desc:"Tus datos protegidos con Supabase. Solo tú decides qué es público." },
            { icon:Award,     color:"#e11d48", bg:"#fff1f2", title:"Habilidades",            desc:"Organiza tus competencias por categoría y muéstralas en tu CV." },
            { icon:FileText,  color:"#0891b2", bg:"#ecfeff", title:"Documentos",             desc:"Sube y gestiona tus diplomas, certificados y soportes en un solo lugar." },
          ].map(f => (
            <div key={f.title} style={{ background:"white", borderRadius:"16px", border:"1px solid #f0f0f0", padding:"24px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:f.bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"14px" }}>
                <f.icon size={22} color={f.color}/>
              </div>
              <h3 style={{ fontSize:"14px", fontWeight:"700", color:"#111827", margin:"0 0 6px" }}>{f.title}</h3>
              <p style={{ fontSize:"13px", color:"#6b7280", margin:0, lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA final ── */}
      <div style={{ background:"linear-gradient(135deg,#052e16,#166534)", margin:"0 32px 64px", borderRadius:"20px", padding:"48px 32px", textAlign:"center" }}>
        <h2 style={{ color:"white", fontSize:"26px", fontWeight:"800", margin:"0 0 10px" }}>
          ¿Listo para destacar?
        </h2>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"15px", margin:"0 0 28px" }}>
          Crea tu portafolio académico en minutos.
        </p>
        {user ? (
          <Link href="/dashboard" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"13px 28px", background:"white", color:"#16a34a", borderRadius:"12px", textDecoration:"none", fontSize:"15px", fontWeight:"700" }}>
            Ir a mi dashboard <ArrowRight size={16}/>
          </Link>
        ) : (
          <Link href="/register" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"13px 28px", background:"white", color:"#16a34a", borderRadius:"12px", textDecoration:"none", fontSize:"15px", fontWeight:"700" }}>
            Crear mi portafolio gratis <ArrowRight size={16}/>
          </Link>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop:"1px solid #e5e7eb", padding:"20px 32px", textAlign:"center" }}>
        <p style={{ fontSize:"13px", color:"#9ca3af", margin:0 }}>
          © 2025 Smartfolio · Nicolás Vega & Juan Carlos Rúgeles · UTS Bucaramanga
        </p>
      </div>
    </div>
  );
}