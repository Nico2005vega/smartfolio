"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const benefits = [
  "Registra certificados, cursos y diplomados",
  "Genera tu CV profesional con 1 clic",
  "Portafolio web con URL personalizada",
  "Exporta en PDF listo para enviar",
  "Comparte con reclutadores fácilmente",
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName } },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("¡Cuenta creada! Bienvenido a Smartfolio 🎉");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #052e16 0%, #14532d 40%, #166534 100%)" }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(22,163,74,0.4)" }}>
              <span style={{ color: "white", fontWeight: "800", fontSize: "18px" }}>S</span>
            </div>
            <div>
              <p style={{ color: "white", fontWeight: "700", fontSize: "20px", margin: 0, lineHeight: 1 }}>Smartfolio</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: 0 }}></p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ color: "white", fontSize: "28px", fontWeight: "700", lineHeight: "1.25", margin: "0 0 10px" }}>
            Comienza a construir<br />
            <span style={{ color: "#4ade80" }}>tu futuro profesional</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", margin: "0 0 28px", lineHeight: "1.6" }}>
            Únete a estudiantes que ya están generando su portafolio profesional con Smartfolio.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {benefits.map((benefit) => (
              <div key={benefit} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={16} color="#4ade80" style={{ flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>
            Nicolás Vega Ruiz · Juan Carlos Rúgeles Navarro<br />
            Tecnología en Desarrollo de Sistemas Informáticos · UTS
          </p>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-14 bg-white overflow-y-auto py-8">
        <div style={{ maxWidth: "420px", width: "100%", margin: "0 auto" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", margin: "0 0 6px" }}>Crear cuenta</h1>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Únete a Smartfolio — es completamente gratis</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { name: "fullName",        label: "Nombre completo",     type: "text",     placeholder: "Nicolás Vega Ruiz" },
              { name: "email",           label: "Correo electrónico",  type: "email",    placeholder: "nvegar@uts.edu.co" },
              { name: "password",        label: "Contraseña",          type: showPassword ? "text" : "password", placeholder: "Mínimo 8 caracteres" },
              { name: "confirmPassword", label: "Confirmar contraseña", type: "password", placeholder: "Repite tu contraseña" },
            ].map((field) => (
              <div key={field.name}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  {field.label}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    {...register(field.name as keyof RegisterFormData)}
                    type={field.type}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%", padding: "11px 14px",
                      border: "1.5px solid #e5e7eb", borderRadius: "10px",
                      fontSize: "14px", color: "#111827", outline: "none",
                      background: "#fafafa", boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                  {field.name === "password" && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "12px" }}>
                      {showPassword ? "Ocultar" : "Ver"}
                    </button>
                  )}
                </div>
                {errors[field.name as keyof RegisterFormData] && (
                  <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                    {errors[field.name as keyof RegisterFormData]?.message}
                  </p>
                )}
              </div>
            ))}

            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
              Al registrarte aceptas que tus datos serán tratados conforme a la Ley 1581 de 2012.
            </p>

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "12px", background: loading ? "#86efac" : "#16a34a",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
              }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creando cuenta...</> : "Crear mi cuenta gratis"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "20px" }}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" style={{ color: "#16a34a", fontWeight: "600", textDecoration: "none" }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}