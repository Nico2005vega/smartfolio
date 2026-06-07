import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = { title: "Panel Administrador" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [
    { count: totalUsers },
    { count: totalRecords },
    { count: totalDocs },
    { data: recentUsers },
    { data: recordsByType },
    { data: allProfiles },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("academic_records").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase.from("profiles")
      .select("id,first_name,last_name,plan,role,created_at,visit_count")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("academic_records").select("record_type"),
    supabase.from("profiles")
      .select("created_at")
      .order("created_at", { ascending: true }),
  ]);

  const byType = (recordsByType ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.record_type] = (acc[r.record_type] ?? 0) + 1;
    return acc;
  }, {});

  const chartByType = Object.entries(byType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const byMonth = (allProfiles ?? []).reduce<Record<string, number>>((acc, p) => {
    const month = new Date(p.created_at).toLocaleDateString("es-CO", {
      month: "short", year: "2-digit"
    });
    acc[month] = (acc[month] ?? 0) + 1;
    return acc;
  }, {});

  const chartByMonth = Object.entries(byMonth).map(([name, value]) => ({ name, value }));

  return (
    <AdminDashboardClient
      totalUsers={totalUsers ?? 0}
      totalRecords={totalRecords ?? 0}
      totalDocs={totalDocs ?? 0}
      recentUsers={recentUsers ?? []}
      chartByType={chartByType}
      chartByMonth={chartByMonth}
    />
  );
}