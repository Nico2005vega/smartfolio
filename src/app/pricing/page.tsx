import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText, ArrowRight, Check, X,
  User, Briefcase, Star, Building2, ShieldCheck,
} from "lucide-react";
import type { UserPlan } from "@/types";
import { isPurchasablePlan } from "@/lib/wompi";
import WompiCheckoutButton from "@/components/payments/WompiCheckoutButton";

export const metadata = { title: "Precios" };

// ── Correo pre-llenado para "Contactar ventas" (plan Business) ──
// Se abre en el cliente de correo del visitante, ya listo para enviar
// con un formato organizado; solo debe completar los 3 campos y dar Enviar.
const BUSINESS_CONTACT_EMAIL = "contacto.smartfolio@gmail.com";
const BUSINESS_MAILTO_SUBJECT = encodeURIComponent("Interés en el plan Business de Smartfolio");
const BUSINESS_MAILTO_BODY = encodeURIComponent(
`Hola equipo de Smartfolio,

Estoy interesado/a en conocer más sobre el plan Business para mi institución.

Nombre de la institución: 
Número aproximado de usuarios: 
Motivo de contacto: 

¡Gracias!`
);
const BUSINESS_MAILTO_HREF = `mailto:${BUSINESS_CONTACT_EMAIL}?subject=${BUSINESS_MAILTO_SUBJECT}&body=${BUSINESS_MAILTO_BODY}`;

interface PlanFeature { text: string; included: boolean; }
interface PlanDef {
  key: UserPlan;
  name: string;
  icon: typeof User;
  price: string;
  period: string;
  color: string;
  gradient: string;
  badge?: string;
  badgeColor?: string;
  highlighted?: boolean;
  features: PlanFeature[];
  ctaLabel: string;
}

const PLANS: PlanDef[] = [
  {
    key: "free", name: "Free", icon: User, price: "$0", period: "/mes",
    color: "#6b7280", gradient: "linear-gradient(135deg,#9ca3af,#6b7280)",
    features: [
      { text: "3 registros académicos", included: true },
      { text: "1 plantilla de CV", included: true },
      { text: "PDF sin marca de agua", included: false },
      { text: "Portafolio personalizado", included: false },
      { text: "Match laboral con IA", included: false },
    ],
    ctaLabel: "Comenzar gratis",
  },
  {
    key: "basic", name: "Basic", icon: Briefcase, price: "$19.900", period: "/mes",
    color: "#2563eb", gradient: "linear-gradient(135deg,#60a5fa,#2563eb)",
    features: [
      { text: "Registros ilimitados", included: true },
      { text: "6 plantillas de CV", included: true },
      { text: "PDF sin marca de agua", included: true },
      { text: "Slug personalizado", included: true },
      { text: "Match laboral con IA", included: false },
    ],
    ctaLabel: "Elegir Basic",
  },
  {
    key: "premium", name: "Premium", icon: Star, price: "$44.900", period: "/mes",
    color: "#7c3aed", gradient: "linear-gradient(135deg,#a78bfa,#7c3aed)",
    badge: "Más popular", badgeColor: "#7c3aed", highlighted: true,
    features: [
      { text: "Registros ilimitados", included: true },
      { text: "12 plantillas de CV", included: true },
      { text: "Personalización total (fuentes y colores)", included: true },
      { text: "Analíticas del portafolio", included: true },
      { text: "Match laboral con IA", included: true },
    ],
    ctaLabel: "Elegir Premium",
  },
  {
    key: "business", name: "Business", icon: Building2, price: "A cotizar", period: "",
    color: "#d97706", gradient: "linear-gradient(135deg,#fbbf24,#d97706)",
    badge: "Institucional", badgeColor: "#d97706",
    features: [
      { text: "Todo lo de Premium", included: true },
      { text: "Panel multi-usuario", included: true },
      { text: "Branding institucional", included: true },
      { text: "Reportes agregados", included: true },
      { text: "Soporte dedicado", included: true },
    ],
    ctaLabel: "Contactar ventas",
  },
];

const FAQS = [
  {
    q: "¿Puedo cambiar de plan cuando quiera?",
    a: "Sí. Puedes subir o bajar de plan en cualquier momento desde esta misma página, sin esperar a que termine ningún ciclo.",
  },
  {
    q: "¿Cómo se procesan los pagos?",
    a: "A través de Wompi, la pasarela de pagos más usada en Colombia. Smartfolio nunca ve ni guarda los datos de tu tarjeta.",
  },
  {
    q: "¿Qué pasa si cancelo?",
    a: "Escríbenos y coordinamos el cambio. Tus registros, documentos y CV nunca se borran — solo se ajustan los límites según el plan en el que quedes.",
  },
  {
    q: "¿El plan Business tiene un precio fijo?",
    a: "No — como está pensado para universidades o empresas con muchos usuarios, el precio se cotiza según la cantidad de personas. Escríbenos y te respondemos rápido.",
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentPlan: UserPlan | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    currentPlan = (profile?.plan as UserPlan) ?? "free";
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fafafa 0%,#f8fafc 400px)", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      <style>{`
        .pricing-card { transition: transform .25s ease, box-shadow .25s ease; }
        .pricing-card:hover { transform: translateY(-6px); }
        .pricing-card.featured:hover { transform: translateY(-10px) scale(1.02); }
        .pricing-cta { transition: opacity .15s ease, transform .15s ease; }
        .pricing-cta:hover { opacity: .92; transform: translateY(-1px); }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg,#16a34a,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={16} color="white" />
          </div>
          <p style={{ fontSize: "15px", fontWeight: "800", color: "#111827", margin: 0 }}>Smartfolio</p>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user ? (
            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: "#16a34a", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              Ir al dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link href="/login" style={{ padding: "8px 16px", color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                Iniciar sesión
              </Link>
              <Link href="/register" style={{ padding: "8px 16px", background: "#16a34a", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "600", borderRadius: "8px" }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Encabezado ── */}
      <div style={{ textAlign: "center", padding: "64px 32px 16px", maxWidth: "680px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px",
          background: "white", border: "1px solid #e9d5ff", borderRadius: "99px",
          fontSize: "12px", fontWeight: "700", color: "#7c3aed", marginBottom: "18px",
          boxShadow: "0 1px 3px rgba(124,58,237,0.08)",
        }}>
          <ShieldCheck size={13} /> Pagos seguros con Wompi
        </div>
        <h1 style={{ fontSize: "38px", fontWeight: "800", color: "#111827", margin: "0 0 14px", letterSpacing: "-0.8px", lineHeight: 1.1 }}>
          Un plan para cada etapa
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px", margin: 0, lineHeight: 1.6 }}>
          Desde tu primer CV hasta encontrar tu próximo empleo. Cambia de plan cuando quieras, sin permanencias.
        </p>
      </div>

      {/* ── Tarjetas de planes ── */}
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "44px 32px 90px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "22px", alignItems: "stretch" }}>
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.key;

            return (
              <div
                key={plan.key}
                className={`pricing-card${plan.highlighted ? " featured" : ""}`}
                style={{
                  background: "white",
                  borderRadius: "22px",
                  border: plan.highlighted ? "2px solid #7c3aed" : "1px solid #efefef",
                  padding: "30px 26px",
                  boxShadow: plan.highlighted ? "0 12px 40px rgba(124,58,237,0.16)" : "0 2px 10px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transform: plan.highlighted ? "translateY(-4px)" : "none",
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: "-13px", left: "26px",
                    background: plan.badgeColor, color: "white",
                    fontSize: "11px", fontWeight: "700",
                    padding: "5px 13px", borderRadius: "99px",
                    boxShadow: `0 4px 12px ${plan.badgeColor}55`,
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px", background: plan.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px",
                  boxShadow: `0 6px 16px ${plan.color}40`,
                }}>
                  <Icon size={23} color="white" />
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", margin: "0 0 4px" }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", margin: "0 0 22px" }}>
                  <span style={{ fontSize: "30px", fontWeight: "800", color: "#111827", letterSpacing: "-0.5px" }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: "13px", color: "#9ca3af" }}>{plan.period}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "26px", flex: 1 }}>
                  {plan.features.map((f) => (
                    <div key={f.text} style={{ display: "flex", gap: "9px", alignItems: "flex-start", fontSize: "13px", color: f.included ? "#374151" : "#c1c7d0" }}>
                      {f.included
                        ? (
                          <div style={{ width: "16px", height: "16px", borderRadius: "5px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                            <Check size={11} color="#16a34a" strokeWidth={3} />
                          </div>
                        )
                        : <X size={15} color="#e5e7eb" style={{ flexShrink: 0, marginTop: "1px" }} />}
                      <span style={{ lineHeight: 1.4 }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <div style={{ textAlign: "center", padding: "12px", background: "#f3f4f6", color: "#6b7280", borderRadius: "12px", fontSize: "14px", fontWeight: "600" }}>
                    Tu plan actual
                  </div>
                ) : plan.key === "business" ? (
                  <a
                    href={BUSINESS_MAILTO_HREF}
                    className="pricing-cta"
                    style={{ textAlign: "center", padding: "13px", background: "#111827", color: "white", borderRadius: "12px", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}
                  >
                    {plan.ctaLabel}
                  </a>
                ) : user && isPurchasablePlan(plan.key) ? (
                  <WompiCheckoutButton
                    plan={plan.key}
                    label={`Elegir ${plan.name}`}
                    background={plan.highlighted ? "#7c3aed" : "#16a34a"}
                  />
                ) : (
                  <Link
                    href={user ? "/settings" : `/register?plan=${plan.key}`}
                    className="pricing-cta"
                    style={{
                      textAlign: "center", padding: "13px",
                      background: plan.highlighted ? "#7c3aed" : "#16a34a",
                      color: "white", borderRadius: "12px", textDecoration: "none",
                      fontSize: "14px", fontWeight: "700",
                    }}
                  >
                    {user ? `Cambiar a ${plan.name}` : plan.ctaLabel}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", marginTop: "36px" }}>
          Todos los precios están en pesos colombianos (COP). Puedes cambiar o cancelar tu plan cuando quieras.
        </p>

        {/* ── Preguntas frecuentes ── */}
        <div style={{ maxWidth: "680px", margin: "72px auto 0" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", textAlign: "center", margin: "0 0 28px" }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FAQS.map((item) => (
              <div key={item.q} style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "18px 20px" }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 6px" }}>{item.q}</p>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: "1px solid #e5e7eb", padding: "20px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
          © 2025 Smartfolio · Nicolás Vega & Juan Carlos Rúgeles · UTS Bucaramanga
        </p>
      </div>
    </div>
  );
}