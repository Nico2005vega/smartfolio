"use client";
import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { PurchasablePlan } from "@/lib/wompi";

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

export default function WompiCheckoutButton({ plan, label, background }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
          toast.success("¡Pago aprobado! Activando tu plan...");
          setTimeout(() => router.push("/dashboard"), 1500);
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
    </>
  );
}