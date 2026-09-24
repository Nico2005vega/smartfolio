import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Eye, TrendingUp, Globe2 } from "lucide-react";
import { hasFeature } from "@/lib/plan";
import type { UserPlan } from "@/types";
import VisitsChart from "@/app/(dashboard)/dashboard/VisitsChart";

export const metadata = { title: "Analíticas del portafolio" };

function getHostname(url: string | null): string {
  if (!url) return "Directo / desconocido";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Directo / desconocido";
  }
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, visit_count, username_slug")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan as UserPlan) ?? "free";
  const unlocked = hasFeature("portfolioAnalytics", plan);

  if (!unlocked) {
    return (
      <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <TrendingUp size={26} color="#7c3aed" />
        </div>
        <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
          Analíticas del portafolio
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 20px", lineHeight: 1.6 }}>
          Mira cuántas visitas recibe tu portafolio público día a día y desde dónde llegan. Disponible en los planes Premium y Business.
        </p>
        <Link href="/pricing" style={{
          display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 20px",
          background: "#7c3aed", color: "white", borderRadius: "12px", textDecoration: "none",
          fontSize: "13px", fontWeight: "700",
        }}>
          <Sparkles size={14} /> Ver planes
        </Link>
      </div>
    );
  }

  // Últimos 30 días de visitas
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: visits } = await supabase
    .from("portfolio_visits")
    .select("visited_at, referrer")
    .eq("profile_id", user.id)
    .gte("visited_at", since.toISOString())
    .order("visited_at", { ascending: true });

  // Agrupar por día (los últimos 30 días, incluidos los días sin visitas)
  const dayBuckets: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayBuckets[d.toISOString().slice(0, 10)] = 0;
  }
  (visits ?? []).forEach(v => {
    const day = v.visited_at.slice(0, 10);
    if (day in dayBuckets) dayBuckets[day] += 1;
  });
  const chartData = Object.entries(dayBuckets).map(([date, count]) => ({ date, count }));

  // Top referrers
  const referrerCounts: Record<string, number> = {};
  (visits ?? []).forEach(v => {
    const host = getHostname(v.referrer);
    referrerCounts[host] = (referrerCounts[host] ?? 0) + 1;
  });
  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const visitsLast30 = (visits ?? []).length;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", margin: "0 0 4px" }}>
        Analíticas del portafolio
      </h1>
      <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 24px" }}>
        /p/{profile?.username_slug}
      </p>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "14px", marginBottom: "24px" }}>
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Eye size={16} color="#7c3aed" />
            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600" }}>Visitas totales</span>
          </div>
          <p style={{ fontSize: "26px", fontWeight: "800", color: "#111827", margin: 0 }}>{profile?.visit_count ?? 0}</p>
        </div>
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <TrendingUp size={16} color="#16a34a" />
            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600" }}>Últimos 30 días</span>
          </div>
          <p style={{ fontSize: "26px", fontWeight: "800", color: "#111827", margin: 0 }}>{visitsLast30}</p>
        </div>
      </div>

      {/* Gráfica */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 14px" }}>Visitas por día (últimos 30 días)</h2>
        <VisitsChart data={chartData} />
      </div>

      {/* Top referrers */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Globe2 size={16} color="#2563eb" />
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>¿De dónde llegan tus visitantes?</h2>
        </div>
        {topReferrers.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>Todavía no hay suficientes datos en los últimos 30 días.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {topReferrers.map(([host, count]) => (
              <div key={host} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f8f8f8" }}>
                <span style={{ fontSize: "13px", color: "#374151" }}>{host}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}