import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Smartfolio", template: "%s | Smartfolio" },
  description: "Plataforma web para la generación automática de portafolios profesionales y currículos para estudiantes universitarios.",
  keywords: ["portafolio", "currículo", "hoja de vida", "estudiantes", "UTS"],
  authors: [{ name: "Nicolás Vega Ruiz" }, { name: "Juan Carlos Rúgeles Navarro" }],
};

/* ── Viewport: fix zoom y responsive en móvil ── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,   // permite hacer zoom
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}