import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText, ArrowRight, Check, X,
  User, Briefcase, Star, Building2,
} from "lucide-react";
import type { UserPlan } from "@/types";
import { isPurchasablePlan } from "@/lib/wompi";
import WompiCheckoutButton from "@/components/payments/WompiCheckoutButton";

export const metadata = { title: "Precios" };

interface PlanFeature { text: string; included: boolean; }
interface PlanDef {
  key: UserPlan;
  name: string;
  icon: typeof User;
  price: string;
  period: string;
  color: string;
  bg: string;
  badge?: string;
  badgeColor?: string;
  highlighted?: boolean;
  features: PlanFeature[];
  ctaLabel: string;
}

const PLANS: PlanDef[] = [
  {
    key: "free", name: "Free", icon: User, price: "$0", period: "/mes",
    color: "#6b7280", bg: "#f3f4f6",
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
    color: "#2563eb", bg: "#eff6ff",
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
    color: "#7c3aed", bg: "#f5f3ff",
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
    color: "#d97706", bg: "#fffbeb",
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
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* ── Navbar (igual que la landing) ── */}
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
      <div style={{ textAlign: "center", padding: "56px 32px 16px", maxWidth: "640px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "34px", fontWeight: "800", color: "#111827", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Un plan para cada etapa
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px", margin: 0, lineHeight: 1.6 }}>
          Desde tu primer CV hasta encontrar tu próximo empleo. Cambia de plan cuando quieras.
        </p>
      </div>

      {/* ── Tarjetas de planes ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "20px", alignItems: "stretch" }}>
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.key;

            return (
              <div key={plan.key} style={{
                background: "white",
                borderRadius: "20px",
                border: plan.highlighted ? "2px solid #7c3aed" : "1px solid #f0f0f0",
                padding: "28px 24px",
                boxShadow: plan.highlighted ? "0 8px 30px rgba(124,58,237,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}>
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: "-12px", left: "24px",
                    background: plan.badgeColor, color: "white",
                    fontSize: "11px", fontWeight: "700",
                    padding: "4px 12px", borderRadius: "99px",
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: plan.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <Icon size={22} color={plan.color} />
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", margin: "0 0 4px" }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", margin: "0 0 20px" }}>
                  <span style={{ fontSize: "28px", fontWeight: "800", color: "#111827" }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: "13px", color: "#9ca3af" }}>{plan.period}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px", flex: 1 }}>
                  {plan.features.map((f) => (
                    <div key={f.text} style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "13px", color: f.included ? "#374151" : "#c1c7d0" }}>
                      {f.included
                        ? <Check size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: "1px" }} />
                        : <X size={15} color="#d1d5db" style={{ flexShrink: 0, marginTop: "1px" }} />}
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <div style={{ textAlign: "center", padding: "12px", background: "#f3f4f6", color: "#6b7280", borderRadius: "10px", fontSize: "14px", fontWeight: "600" }}>
                    Tu plan actual
                  </div>
                ) : plan.key === "business" ? (
                  <a
                    href="mailto:ventas@smartfolio.co"
                    style={{ textAlign: "center", padding: "12px", background: "#111827", color: "white", borderRadius: "10px", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}
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
                    style={{
                      textAlign: "center", padding: "12px",
                      background: plan.highlighted ? "#7c3aed" : "#16a34a",
                      color: "white", borderRadius: "10px", textDecoration: "none",
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

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", marginTop: "32px" }}>
          Todos los precios están en pesos colombianos (COP). Puedes cambiar o cancelar tu plan cuando quieras.
        </p>
      </div>

      {/* ── Footer (igual que la landing) ── */}
      <div style={{ borderTop: "1px solid #e5e7eb", padding: "20px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
          © 2025 Smartfolio · Nicolás Vega & Juan Carlos Rúgeles · UTS Bucaramanga
        </p>
      </div>
    </div>
  );
}