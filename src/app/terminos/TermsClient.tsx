"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";
import { TERMS_SECTIONS } from "@/lib/termsContent";

interface Props { firstName: string | null; }

export default function TermsClient({ firstName }: Props) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!checked) return;
    setLoading(true);
    try {
      const res = await fetch("/api/terms/accept", { method: "POST" });
      if (!res.ok) throw new Error("No se pudo registrar tu aceptación");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ocurrió un error");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "white", borderRadius: "24px", maxWidth: "600px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        <div style={{ padding: "32px 32px 0" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <ShieldCheck size={24} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 6px" }}>
            Términos de uso y tratamiento de datos personales
          </h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 20px" }}>
            {firstName ? `Hola ${firstName}, antes` : "Antes"} de continuar, necesitamos que conozcas y aceptes lo siguiente.
          </p>
        </div>

        <div style={{ padding: "0 32px", maxHeight: "360px", overflowY: "auto" }}>
          <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.6, marginBottom: "18px" }}>
            De acuerdo con la <strong>Ley 1581 de 2012</strong> (protección de datos personales) de Colombia,
            Smartfolio informa el tratamiento que da a tus datos personales. Al usar la plataforma, aceptas
            lo descrito a continuación. Si no estás de acuerdo, no deberías continuar usando el servicio.
          </p>

          {TERMS_SECTIONS.map((s) => (
            <div key={s.title} style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>{s.title}</p>
              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: "20px 32px 32px", borderTop: "1px solid #f3f4f6", marginTop: "16px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "18px" }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{ marginTop: "3px", width: "16px", height: "16px", accentColor: "#16a34a", flexShrink: 0, cursor: "pointer" }}
            />
            <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
              He leído y acepto el tratamiento de mis datos personales conforme a lo descrito anteriormente.
            </span>
          </label>

          <button
            onClick={handleContinue}
            disabled={!checked || loading}
            style={{
              width: "100%", padding: "13px", borderRadius: "12px", border: "none",
              background: checked ? "#16a34a" : "#e5e7eb",
              color: checked ? "white" : "#9ca3af",
              fontSize: "14px", fontWeight: "700",
              cursor: checked && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Guardando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}