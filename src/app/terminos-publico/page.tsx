import { ShieldCheck } from "lucide-react";
import { TERMS_SECTIONS } from "@/lib/termsContent";

export const metadata = { title: "Términos y tratamiento de datos" };

export default function PublicTermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "48px 24px" }}>
      <div style={{ background: "white", borderRadius: "24px", maxWidth: "600px", width: "100%", margin: "0 auto", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", padding: "32px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
          <ShieldCheck size={24} color="#16a34a" />
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 6px" }}>
          Términos de uso y tratamiento de datos personales
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 20px" }}>
          Smartfolio · BAN 00329 · UTS Bucaramanga
        </p>

        <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.6, marginBottom: "18px" }}>
          De acuerdo con la <strong>Ley 1581 de 2012</strong> (protección de datos personales) de Colombia,
          Smartfolio informa el tratamiento que da a tus datos personales. Al usar la plataforma, aceptas
          lo descrito a continuación.
        </p>

        {TERMS_SECTIONS.map((s) => (
          <div key={s.title} style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>{s.title}</p>
            <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}