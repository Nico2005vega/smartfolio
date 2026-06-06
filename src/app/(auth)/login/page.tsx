"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
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
      {/* Panel izquierdo - brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16" style={{background:"linear-gradient(135deg,#14532d,#166534,#16a34a)"}}>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white" size={22} />
          </div>
          <span className="text-2xl font-bold text-white">Smartfolio</span>
        </div>
        <h2 className="text-4xl font-bold text-white leading-snug mb-4">
          Tu portafolio profesional te espera
        </h2>
        <p className="text-green-100 text-lg leading-relaxed">
          Centraliza tus logros académicos y genera hojas de vida profesionales en segundos.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4">
          {[
            { n:"8", label:"Tipos de registro" },
            { n:"3", label:"Plantillas de CV" },
            { n:"PDF", label:"Exportación directa" },
            { n:"∞", label:"Documentos soporte" },
          ].map((s) => (
            <div key={s.label} className="bg-white bg-opacity-10 rounded-xl p-4 border border-white border-opacity-20">
              <div className="text-2xl font-bold text-white">{s.n}</div>
              <div className="text-green-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho - formulario */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"#16a34a"}}>
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Smartfolio</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm mb-8">Ingresa a tu cuenta de Smartfolio</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <input {...register("email")} type="email" placeholder="tucorreo@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{"--tw-ring-color":"#16a34a"} as React.CSSProperties} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <input {...register("password")} type="password" placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{background:"#16a34a"}}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Ingresando...</> : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-semibold" style={{color:"#16a34a"}}>Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
