"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, GraduationCap, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
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
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-center px-14" style={{background:"linear-gradient(135deg,#14532d,#166534,#16a34a)"}}>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white" size={22} />
          </div>
          <span className="text-2xl font-bold text-white">Smartfolio</span>
        </div>
        <h2 className="text-3xl font-bold text-white leading-snug mb-5">
          Comienza a construir tu futuro profesional hoy
        </h2>
        <div className="space-y-4">
          {[
            "Registra certificados, cursos y diplomados",
            "Genera tu CV con 1 clic",
            "Portafolio web con URL personalizada",
            "Exporta en PDF listo para enviar",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-green-300 flex-shrink-0" />
              <span className="text-green-100 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 lg:px-14 bg-white overflow-y-auto py-8">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mb-7">Únete a Smartfolio — es completamente gratis</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
              <input {...register("fullName")} type="text" placeholder="Nicolás Vega Ruiz"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <input {...register("email")} type="email" placeholder="nvegar@uts.edu.co"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <input {...register("password")} type="password" placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
              <input {...register("confirmPassword")} type="password" placeholder="Repite tu contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <p className="text-xs text-gray-400">Al registrarte aceptas que tus datos serán tratados conforme a la Ley 1581 de 2012.</p>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{background:"#16a34a"}}>
              {loading ? <><Loader2 size={16} className="animate-spin"/>Creando cuenta...</> : "Crear mi cuenta gratis"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold" style={{color:"#16a34a"}}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
