"use client";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { hasFeature } from "@/lib/plan";
import { buildJobSearchLinks } from "@/lib/jobSearchLinks";
import type { CareerInsight, UserPlan } from "@/types";

interface Props {
  plan: UserPlan;
  city: string | null;
  initialInsight: CareerInsight | null;
}

const SENIORITY_LABELS: Record<string, string> = {
  junior: "Junior",
  mid: "Intermedio",
  senior: "Senior",
};

export default function JobMatchCard({ plan, city, initialInsight }: Props) {
  const [insight, setInsight] = useState<CareerInsight | null>(initialInsight);
  const [loading, setLoading] = useState(false);

  const unlocked = hasFeature("jobMatchAI", plan);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/career-insights/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo analizar tu perfil");
      setInsight(data);
      toast.success("¡Análisis listo! Aquí tienes tus recomendaciones.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  // ── No disponible en el plan actual ──────────────────────
  if (!unlocked) {
    return (
      <div style={{ background: "linear-gradient(135deg,#faf5ff,#f5f3ff)", borderRadius: "16px", border: "1px solid #e9d5ff", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <Sparkles size={16} color="#7c3aed" />
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>Match Laboral con IA</h2>
        </div>
        <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 14px", lineHeight: 1.5 }}>
          Descubre qué cargo buscar y recibe enlaces directos a vacantes reales según tu perfil. Disponible en Premium.
        </p>
        <Link href="/pricing" style={{
          display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px",
          background: "#7c3aed", color: "white", borderRadius: "10px", textDecoration: "none",
          fontSize: "13px", fontWeight: "700",
        }}>
          <Sparkles size={13} /> Ver planes
        </Link>
      </div>
    );
  }

  // ── Sin análisis todavía ──────────────────────────────────
  if (!insight) {
    return (
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <Sparkles size={16} color="#7c3aed" />
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>Match Laboral con IA</h2>
        </div>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 14px", lineHeight: 1.5 }}>
          Analizamos tu perfil y te decimos qué cargo buscar, con enlaces directos a vacantes.
        </p>
        <button onClick={handleAnalyze} disabled={loading} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          padding: "10px", borderRadius: "10px", border: "none", cursor: loading ? "default" : "pointer",
          background: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "700", opacity: loading ? 0.7 : 1,
        }}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Analizando tu perfil..." : "Analizar mi perfil"}
        </button>
      </div>
    );
  }

  // ── Con resultado ──────────────────────────────────────────
  const links = buildJobSearchLinks(insight.keywords, city);

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={16} color="#7c3aed" />
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>Match Laboral con IA</h2>
        </div>
        <button onClick={handleAnalyze} disabled={loading} title="Volver a analizar" style={{
          background: "none", border: "none", cursor: loading ? "default" : "pointer", padding: "4px",
        }}>
          <RefreshCw size={14} color="#9ca3af" className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px" }}>Según tu perfil, te recomendamos buscar como:</p>
      <p style={{ fontSize: "16px", fontWeight: "800", color: "#111827", margin: "0 0 8px" }}>{insight.suggested_role}</p>

      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
        {insight.seniority && (
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#7c3aed", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "99px", padding: "3px 10px" }}>
            {SENIORITY_LABELS[insight.seniority] ?? insight.seniority}
          </span>
        )}
        {insight.industry && (
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "99px", padding: "3px 10px" }}>
            {insight.industry}
          </span>
        )}
      </div>

      <p style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>
        Buscar en
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {links.map(link => (
          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 12px", borderRadius: "10px", border: "1px solid #f0f0f0",
            textDecoration: "none", fontSize: "12.5px", fontWeight: "600", color: "#374151",
          }}>
            {link.name}
            <ExternalLink size={12} color="#9ca3af" />
          </a>
        ))}
      </div>
    </div>
  );
}