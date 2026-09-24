"use client";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Clock3 } from "lucide-react";
import type { PurchasablePlan } from "@/lib/wompi";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LABELS } from "@/types";

declare global {
  interface Window {
    WidgetCheckout: new (config: {
      currency: string;
      amountInCents: number;
      reference: string;
      publicKey: string;
      signature: { integrity: string };
      redirectUrl?: string;
    }) => {
      open: (callback: (result: { transaction?: { status: string } }) => void) => void;
    };
  }
}

interface Props {
  plan: PurchasablePlan;
  label: string;
  background: string;
}

type ConfirmState = "idle" | "confirming" | "success" | "timeout";

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 20000;

export default function WompiCheckoutButton({ plan, label, background }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>("idle");
  const router = useRouter();
  const supabase = createClient();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Espera de verdad a que el webhook de Wompi actualice el plan en Supabase,
  // en vez de redirigir a ciegas asumiendo que ya se aplicó.
  const startConfirmationPolling = () => {
    setConfirmState("confirming");

    pollRef.current = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();

      if (profile?.plan === plan) {
        if (pollRef.current) clearInterval(pollRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setConfirmState("success");
        router.refresh();
      }
    }, POLL_INTERVAL_MS);

    timeoutRef.current = setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
      setConfirmState((s) => (s === "confirming" ? "timeout" : s));
    }, POLL_TIMEOUT_MS);
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wompi/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "No se pudo iniciar el pago");
      }

      const { reference, amountInCents, currency, signature, publicKey } = await res.json();

      if (!publicKey) {
        toast.error("Wompi no está configurado todavía (falta NEXT_PUBLIC_WOMPI_PUBLIC_KEY)");
        setLoading(false);
        return;
      }
      if (!window.WidgetCheckout) {
        toast.error("El widget de pago no cargó, recarga la página e intenta de nuevo");
        setLoading(false);
        return;
      }

      const checkout = new window.WidgetCheckout({
        currency,
        amountInCents,
        reference,
        publicKey,
        signature: { integrity: signature },
        redirectUrl: `${window.location.origin}/dashboard`,
      });

      checkout.open((result) => {
        setLoading(false);
        const status = result?.transaction?.status;
        if (status === "APPROVED") {
          startConfirmationPolling();
        } else if (status === "DECLINED") {
          toast.error("El pago fue rechazado. Intenta con otro medio de pago.");
        } else {
          toast.info("Quedamos pendientes de la confirmación del pago.");
        }
      });
    } catch (e) {
      setLoading(false);
      toast.error(e instanceof Error ? e.message : "Ocurrió un error al iniciar el pago");
    }
  };

  return (
    <>
      <Script src="https://checkout.wompi.co/widget.js" strategy="lazyOnload" />
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          width: "100%", textAlign: "center", padding: "12px",
          background, color: "white", borderRadius: "10px", border: "none",
          fontSize: "14px", fontWeight: 700, cursor: loading ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : label}
      </button>

      {confirmState !== "idle" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(17,24,39,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px",
        }}>
          <div style={{
            background: "white", borderRadius: "24px", padding: "40px 32px", maxWidth: "380px", width: "100%",
            textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {confirmState === "confirming" && (
              <>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Loader2 size={28} className="animate-spin" color="#7c3aed" />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", margin: "0 0 8px" }}>Confirmando tu pago</h3>
                <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
                  Wompi ya aprobó tu pago — estamos activando tu plan <strong>{PLAN_LABELS[plan]}</strong>. Esto toma solo unos segundos.
                </p>
              </>
            )}

            {confirmState === "success" && (
              <>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle2 size={30} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", margin: "0 0 8px" }}>¡Bienvenido a {PLAN_LABELS[plan]}!</h3>
                <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 20px", lineHeight: 1.6 }}>
                  Tu cuenta ya está actualizada. Todo lo nuevo de tu plan está listo para usar.
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "none", background: "#16a34a", color: "white", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
                >
                  Ir al dashboard
                </button>
              </>
            )}

            {confirmState === "timeout" && (
              <>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Clock3 size={28} color="#d97706" />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", margin: "0 0 8px" }}>Tu pago fue aprobado</h3>
                <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 20px", lineHeight: 1.6 }}>
                  Puede tardar unos minutos más en reflejarse en tu cuenta. Si no ves el cambio pronto, recarga la página.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "none", background: "#7c3aed", color: "white", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
                >
                  Recargar página
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}