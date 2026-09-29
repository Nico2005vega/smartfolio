import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = { title: "Panel Administrador" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // El rol se comprueba con la sesión del usuario (solo lee su propia fila)
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  // Solo después de confirmar que es admin se leen los datos globales.
  // Con la sesión normal, RLS solo deja ver las filas propias.
  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: totalRecords },
    { count: totalDocs },
    { data: recentUsers },
    { data: recordsByType },
    { data: allProfiles },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("academic_records").select("*", { count: "exact", head: true }),
    admin.from("documents").select("*", { count: "exact", head: true }),
    admin.from("profiles")
      .select("id,first_name,last_name,plan,role,created_at,visit_count")
      .order("created_at", { ascending: false })
      .limit(100),
    admin.from("academic_records").select("record_type"),
    admin.from("profiles")
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
      currentUserId={user.id}
    />
  );
}