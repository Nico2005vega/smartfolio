import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen" style={{background:"linear-gradient(135deg,#f0fdf4,#ffffff,#ecfdf5)"}}>
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div style={{background:"#16a34a"}} className="w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Smartfolio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 font-medium px-4 py-2">Iniciar sesión</Link>
          <Link href="/register" style={{background:"#16a34a"}} className="text-sm text-white font-medium px-4 py-2 rounded-lg">Comenzar gratis</Link>
        </div>
      </nav>
      <section className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6" style={{background:"#dcfce7",color:"#15803d"}}>
          🎓 Proyecto BAN 00329 · UTS Bucaramanga
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
          Tu portafolio profesional,<br/><span style={{color:"#16a34a"}}>generado automáticamente</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Centraliza tus certificados, cursos, diplomados y logros académicos. Smartfolio genera tu hoja de vida en segundos.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" style={{background:"#16a34a"}} className="text-white font-semibold px-8 py-4 rounded-xl shadow-lg">
            Crear mi portafolio — Es gratis
          </Link>
          <Link href="/login" className="text-gray-600 border border-gray-300 font-medium px-8 py-4 rounded-xl">
            Ya tengo cuenta →
          </Link>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon:"📁", title:"Centraliza todo", desc:"Certificados, cursos, diplomados y títulos en un solo lugar seguro." },
            { icon:"⚡", title:"CV automático", desc:"Tu hoja de vida se genera sola. Lista para descargar en PDF." },
            { icon:"🌐", title:"Portafolio web", desc:"URL personal: smartfolio.co/p/tu-nombre, visible para reclutadores." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-200">
        <p>Smartfolio · BAN 00329 · Tecnología en Desarrollo de Sistemas Informáticos · UTS Bucaramanga</p>
        <p className="mt-1">Nicolás Vega Ruiz · Juan Carlos Rúgeles Navarro · Dir. Edward Villamizar</p>
      </footer>
    </main>
  );
}
