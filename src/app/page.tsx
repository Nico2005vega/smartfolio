import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-hidden" style={{background:"linear-gradient(135deg, #0d5c3a 0%, #1a4d2e 25%, #0f3d2a 50%, #1a4d2e 75%, #0d5c3a 100%)"}}>
      {/* Elemento decorativo de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div style={{background:"linear-gradient(135deg, #16a34a, #22c55e)"}} className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-2xl font-bold text-white">Smartfolio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-green-100 font-medium px-4 py-2 hover:text-white transition-colors">Iniciar sesión</Link>
          <Link href="/register" style={{background:"linear-gradient(135deg, #16a34a, #22c55e)"}} className="text-sm text-white font-medium px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all">Comenzar gratis</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-green-900/40 border border-green-500/30 text-green-200 backdrop-blur-sm">
          🎓 Proyecto BAN 00329 · UTS Bucaramanga
        </div>
        
        <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in">
          Tu portafolio profesional
          <br/>
          <span style={{background:"linear-gradient(90deg, #22c55e, #4ade80, #86efac)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>te espera</span>
        </h1>
        
        <p className="text-lg text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          Centraliza tus logros académicos y genera hojas de vida profesionales en segundos. Smartfolio es tu herramienta para destacar ante reclutadores y empresas.
        </p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
          <Link href="/register" style={{background:"linear-gradient(135deg, #16a34a, #22c55e)"}} className="text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105 transform">
            Crear mi portafolio — Es gratis
          </Link>
          <Link href="/login" className="text-green-200 border border-green-500/50 font-medium px-8 py-4 rounded-xl hover:bg-green-900/30 transition-all backdrop-blur-sm">
            Ya tengo cuenta →
          </Link>
        </div>
      </section>

      {/* Features Grid - Lo que ofrecemos */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">¿Qué puedes almacenar?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {[
            { icon:"📜", title:"8 tipos de registro académico", desc:"Certificados, títulos, diplomados y más" },
            { icon:"⚡", title:"CV generado automáticamente", desc:"Listo para descargar en PDF" },
            { icon:"🌐", title:"Portafolio web con URL propia", desc:"smartfolio.co/p/tu-nombre" },
            { icon:"🔒", title:"Documentos seguros", desc:"Almacenamiento certificado en la nube" },
          ].map((f, i) => (
            <div 
              key={f.title} 
              className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-green-400/50 transition-all hover:shadow-lg hover:shadow-green-500/20 hover:scale-105 transform group cursor-pointer"
              style={{animationDelay: `${i * 100}ms`}}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="font-bold text-white mb-2 text-lg">{f.title}</h3>
              <p className="text-sm text-green-100">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Beneficios principales */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Beneficios principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "📁",
                title: "Centraliza todo en un lugar",
                desc: "Deja atrás las carpetas confusas. Todos tus certificados, cursos, diplomados y logros académicos en una plataforma segura y organizada.",
                features: ["Búsqueda rápida", "Categorización automática", "Sincronización en tiempo real"]
              },
              {
                icon: "⚡",
                title: "CV generado automáticamente",
                desc: "Olvídate de actualizar tu hoja de vida manualmente. Smartfolio la genera automáticamente a partir de tu información.",
                features: ["Múltiples formatos", "Descarga en PDF", "Actualización instantánea"]
              },
              {
                icon: "🌐",
                title: "Portafolio web profesional",
                desc: "Obtén una URL personal donde reclutadores pueden ver tu perfil completo. Impresiona a empresas en una sola plataforma.",
                features: ["URL personalizada", "Visible para reclutadores", "Diseño profesional"]
              },
              {
                icon: "🔒",
                title: "Seguridad garantizada",
                desc: "Tus documentos están protegidos con encriptación de nivel empresarial. Almacenamiento certificado en servidores seguros.",
                features: ["Encriptación E2E", "Backup automático", "Cumplimiento LGPD"]
              },
            ].map((benefit, i) => (
              <div 
                key={benefit.title}
                className="bg-gradient-to-br from-green-900/50 via-green-800/30 to-emerald-900/20 border border-green-400/20 rounded-2xl p-8 backdrop-blur-sm hover:border-green-400/50 transition-all hover:shadow-xl hover:shadow-green-500/20"
                style={{animationDelay: `${i * 150}ms`}}
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-white mb-3 text-xl">{benefit.title}</h3>
                <p className="text-green-100 mb-5 leading-relaxed">{benefit.desc}</p>
                <ul className="space-y-2">
                  {benefit.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-green-200">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-green-900/50 via-emerald-800/50 to-green-900/50 border border-green-400/30 rounded-3xl p-12 backdrop-blur-sm">
          <h2 className="text-4xl font-bold text-white mb-4">¿Listo para destacar?</h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Crea tu portafolio en segundos y comienza a impresionar a reclutadores y empresas hoy mismo.
          </p>
          <Link 
            href="/register" 
            style={{background:"linear-gradient(135deg, #16a34a, #22c55e)"}} 
            className="inline-block text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105 transform"
          >
            Crear portafolio gratis ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 text-sm text-green-200/70 border-t border-green-500/20">
        <p className="font-semibold mb-2">Smartfolio · BAN 00329 · Tecnología en Desarrollo de Sistemas Informáticos · UTS Bucaramanga</p>
        <p className="text-xs">Nicolás Vega Ruiz · Juan Carlos Rúgeles Navarro · Dir. Edward Villamizar</p>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
