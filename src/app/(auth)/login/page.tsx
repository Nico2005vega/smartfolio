"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, FileText, Zap, Globe, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

const features = [
  { icon: FileText, label: "8 tipos de registro académico", desc: "Certificados, títulos, diplomados y más" },
  { icon: Zap,      label: "CV generado automáticamente",  desc: "Listo para descargar en PDF" },
  { icon: Globe,    label: "Portafolio web con URL propia", desc: "Compártelo con reclutadores" },
  { icon: Shield,   label: "Documentos seguros",           desc: "Almacenamiento certificado en la nube" },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email, password: data.password,
    });
    if (error) {
      toast.error("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } else {
      toast.success("¡Bienvenido a Smartfolio!");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #052e16 0%, #14532d 40%, #166534 100%)" }}>

        {/* Patrón de fondo */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />

        {/* Círculos decorativos */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "240px", height: "240px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#16a34a", display: "flex", alignItems: "center",
              justifyContent: "center", boxShadow: "0 4px 12px rgba(22,163,74,0.4)",
            }}>
              <span style={{ color: "white", fontWeight: "800", fontSize: "18px" }}>S</span>
            </div>
            <div>
              <p style={{ color: "white", fontWeight: "700", fontSize: "20px", margin: 0, lineHeight: 1 }}>
                Smartfolio
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: 0 }}>
                BAN 00329 · UTS Bucaramanga
              </p>
            </div>
          </div>
        </div>

        {/* Contenido central */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            color: "white", fontSize: "32px", fontWeight: "700",
            lineHeight: "1.2", margin: "0 0 12px",
          }}>
            Tu portafolio profesional<br />
            <span style={{ color: "#4ade80" }}>te espera</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", margin: "0 0 36px", lineHeight: "1.6" }}>
            Centraliza tus logros académicos y genera hojas de vida profesionales en segundos.
          </p>

          {/* Features */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px", padding: "14px",
                backdropFilter: "blur(10px)",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: "rgba(74,222,128,0.15)", display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: "8px",
                }}>
                  <Icon size={16} color="#4ade80" />
                </div>
                <p style={{ color: "white", fontSize: "12px", fontWeight: "600", margin: "0 0 2px" }}>
                  {label}
                </p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer del panel */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>
            Nicolás Vega Ruiz · Juan Carlos Rúgeles Navarro<br />
            Tecnología en Desarrollo de Sistemas Informáticos · UTS
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div style={{ maxWidth: "420px", width: "100%", margin: "0 auto" }}>

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div style={{
              width: "36px", height: "36px", borderRadius: "8px",
              background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontWeight: "800", fontSize: "16px" }}>S</span>
            </div>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>Smartfolio</span>
          </div>

          {/* Header formulario */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", margin: "0 0 6px" }}>
              Iniciar sesión
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Ingresa a tu cuenta de Smartfolio
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Correo electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="tucorreo@email.com"
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #e5e7eb", borderRadius: "10px",
                  fontSize: "14px", color: "#111827", outline: "none",
                  background: "#fafafa", boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
              {errors.email && (
                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "11px 44px 11px 14px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "14px", color: "#111827", outline: "none",
                    background: "#fafafa", boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#9ca3af",
                    fontSize: "12px",
                  }}>
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#86efac" : "#16a34a",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.15s", boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
              }}>
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Ingresando...</>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
            <span style={{ fontSize: "12px", color: "#d1d5db" }}>o</span>
            <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
            ¿No tienes cuenta?{" "}
            <Link href="/register" style={{ color: "#16a34a", fontWeight: "600", textDecoration: "none" }}>
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
