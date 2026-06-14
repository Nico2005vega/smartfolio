'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <div className="animate-pulse text-white text-lg">Cargando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
            <span className="text-white font-bold text-sm sm:text-lg">S</span>
          </div>
          <span className="text-lg sm:text-2xl font-bold text-white hidden xs:inline">Smartfolio</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="text-xs sm:text-sm text-green-100 font-medium px-3 sm:px-4 py-2 hover:text-white transition-colors">
            Iniciar
          </Link>
          <Link href="/register" className="text-xs sm:text-sm text-white font-medium px-4 sm:px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 transition-all">
            Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-12 sm:pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 bg-green-800/50 border border-green-400/30 text-green-200 backdrop-blur-sm">
          🎓 BAN 00329 · UTS
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
          Tu portafolio profesional
          <br/>
          <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">te espera</span>
        </h1>
        
        <p className="text-sm sm:text-base lg:text-lg text-green-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
          Centraliza tus logros académicos y genera hojas de vida profesionales en segundos.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <Link 
            href="/register" 
            className="w-full sm:w-auto text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 transition-all text-center"
          >
            Crear portafolio gratis
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto text-green-200 border border-green-400/50 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-green-900/30 transition-all text-center"
          >
            Ya tengo cuenta →
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16">¿Qué puedes almacenar?</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-20">
          {[
            { icon:"📜", title:"8 tipos de registro", desc:"Certificados, títulos y más" },
            { icon:"⚡", title:"CV automático", desc:"Descargar en PDF" },
            { icon:"🌐", title:"Portafolio web", desc:"URL personalizada" },
            { icon:"🔒", title:"Seguro", desc:"Almacenamiento certificado" },
          ].map((f) => (
            <div 
              key={f.title} 
              className="bg-green-800/30 border border-green-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-green-300/50 transition-all hover:shadow-lg hover:shadow-green-500/10 group cursor-pointer"
            >
              <div className="text-2xl sm:text-4xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="font-bold text-white mb-1 sm:mb-2 text-sm sm:text-base">{f.title}</h3>
              <p className="text-xs sm:text-sm text-green-100">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Beneficios principales */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-8 sm:mb-12">Beneficios principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                icon: "📁",
                title: "Centraliza todo",
                desc: "Todos tus certificados, cursos y logros en una plataforma segura.",
                features: ["Búsqueda rápida", "Categorización automática", "Sincronización en tiempo real"]
              },
              {
                icon: "⚡",
                title: "CV automático",
                desc: "Tu hoja de vida se genera automáticamente en segundos.",
                features: ["Múltiples formatos", "Descarga en PDF", "Actualización instantánea"]
              },
              {
                icon: "🌐",
                title: "Portafolio profesional",
                desc: "Obtén una URL personal visible para reclutadores.",
                features: ["URL personalizada", "Visible para reclutadores", "Diseño profesional"]
              },
              {
                icon: "🔒",
                title: "Seguridad garantizada",
                desc: "Protección de nivel empresarial para tus documentos.",
                features: ["Encriptación E2E", "Backup automático", "Cumplimiento LGPD"]
              },
            ].map((benefit) => (
              <div 
                key={benefit.title}
                className="bg-green-800/30 border border-green-400/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-green-300/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 inline-block">{benefit.icon}</div>
                <h3 className="font-bold text-white mb-2 sm:mb-3 text-base sm:text-lg lg:text-xl">{benefit.title}</h3>
                <p className="text-green-100 mb-4 sm:mb-5 leading-relaxed text-sm sm:text-base">{benefit.desc}</p>
                <ul className="space-y-1.5 sm:space-y-2">
                  {benefit.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs sm:text-sm text-green-200">
                      <span className="w-1 h-1 bg-green-300 rounded-full flex-shrink-0"></span>
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
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="bg-green-800/30 border border-green-400/30 rounded-xl sm:rounded-3xl p-6 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">¿Listo para destacar?</h2>
          <p className="text-sm sm:text-base lg:text-lg text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Crea tu portafolio en segundos e impresiona a reclutadores y empresas.
          </p>
          <Link 
            href="/register" 
            className="inline-block text-white font-semibold px-6 sm:px-10 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 transition-all"
          >
            Crear portafolio gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 sm:py-12 text-xs sm:text-sm text-green-200/70 border-t border-green-400/20 px-4">
        <p className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Smartfolio · BAN 00329 · UTS Bucaramanga</p>
        <p className="text-xs">Nicolás Vega · Juan Carlos Rúgeles · Edward Villamizar</p>
      </footer>
    </main>
  );
}
