import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Zap, Globe, Shield, ArrowRight, CheckCircle2 } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px", background: "white",
        borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}>
            <span style={{ color: "white", fontWeight: "800", fontSize: "16px" }}>S</span>
          </div>
          <div>
            <span style={{ fontSize: "17px", fontWeight: "700", color: "#111827" }}>Smartfolio</span>
            <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "8px" }}>BAN 00329 · UTS</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/login" style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280", textDecoration: "none", padding: "8px 16px" }}>
            Iniciar sesión
          </Link>
          <Link href="/register" style={{ fontSize: "14px", fontWeight: "600", color: "white", textDecoration: "none", padding: "9px 20px", background: "#16a34a", borderRadius: "9px", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}>
            Comenzar gratis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(145deg, #052e16 0%, #14532d 50%, #166534 100%)", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div style={{ position: "absolute", top: "-100px", right: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(74,222,128,0.06)" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "40px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: "500" }}>🎓 Proyecto BAN 00329 · UTS Bucaramanga</span>
          </div>
          <h1 style={{ fontSize: "52px", fontWeight: "800", color: "white", lineHeight: "1.1", margin: "0 0 16px" }}>
            Tu portafolio profesional,<br />
            <span style={{ color: "#4ade80" }}>generado automáticamente</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.65)", margin: "0 auto 36px", lineHeight: "1.7", maxWidth: "560px" }}>
            Centraliza tus certificados, cursos, diplomados y logros académicos. Smartfolio genera tu hoja de vida en segundos.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "#16a34a", color: "white", textDecoration: "none", borderRadius: "12px", fontWeight: "700", fontSize: "15px", boxShadow: "0 4px 20px rgba(22,163,74,0.4)" }}>
              Crear mi portafolio gratis <ArrowRight size={16} />
            </Link>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", textDecoration: "none", borderRadius: "12px", fontWeight: "600", fontSize: "15px" }}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "72px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 12px" }}>Todo lo que necesitas en un solo lugar</h2>
          <p style={{ fontSize: "16px", color: "#6b7280", margin: 0 }}>Diseñado para estudiantes universitarios colombianos</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {[
            { icon: FileText, title: "8 tipos de registro",  desc: "Certificados, títulos, diplomados, seminarios, talleres y más.", color: "#16a34a", bg: "#f0fdf4" },
            { icon: Zap,      title: "CV automático",        desc: "Tu hoja de vida se genera sola desde tus datos. Lista en segundos.", color: "#2563eb", bg: "#eff6ff" },
            { icon: Globe,    title: "Portafolio web",       desc: "URL personalizada: smartfolio.co/p/tu-nombre — visible para reclutadores.", color: "#7c3aed", bg: "#f5f3ff" },
            { icon: Shield,   title: "Documentos seguros",   desc: "Sube PDFs e imágenes como soporte de tus certificaciones.", color: "#d97706", bg: "#fffbeb" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>{title}</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: "1.6" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "0 48px 72px", background: "linear-gradient(135deg, #052e16, #166534)", borderRadius: "24px", padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-40px", top: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "white", margin: "0 0 12px" }}>¿Listo para crear tu portafolio?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {["Es completamente gratis", "No necesitas tarjeta de crédito", "Listo en menos de 5 minutos"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={15} color="#4ade80" />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "#16a34a", color: "white", textDecoration: "none", borderRadius: "12px", fontWeight: "700", fontSize: "15px", boxShadow: "0 4px 20px rgba(22,163,74,0.4)", position: "relative", zIndex: 1, whiteSpace: "nowrap" }}>
          Empezar ahora — Es gratis <ArrowRight size={16} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111827", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "800", fontSize: "14px" }}>S</span>
          </div>
          <div>
            <p style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: 0 }}>Smartfolio</p>
            <p style={{ color: "#4b5563", fontSize: "11px", margin: 0 }}>BAN 00329 · UTS Bucaramanga</p>
          </div>
        </div>
        <p style={{ color: "#4b5563", fontSize: "12px", margin: 0, textAlign: "center" }}>
          Nicolás Vega Ruiz · Juan Carlos Rúgeles Navarro<br />
          <span style={{ color: "#374151" }}>Tecnología en Desarrollo de Sistemas Informáticos · UTS</span>
        </p>
        <p style={{ color: "#374151", fontSize: "12px", margin: 0 }}>© 2026 Smartfolio</p>
      </footer>
    </div>
  );
}