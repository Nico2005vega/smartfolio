import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, FileText, BookOpen, LayoutDashboard } from "lucide-react";

export const metadata = { title: "Panel Administrador" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [
    { count: totalUsers },
    { count: totalRecords },
    { count: totalDocs },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("academic_records").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentUsers } = await supabase
    .from("profiles").select("id,first_name,last_name,plan,role,created_at")
    .order("created_at", { ascending: false }).limit(10);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel Administrador</h1>
        <p className="text-gray-500 text-sm mt-1">Gestión y métricas globales de Smartfolio</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label:"Usuarios", value:totalUsers ?? 0, icon:Users, color:"#16a34a", bg:"#f0fdf4" },
          { label:"Registros académicos", value:totalRecords ?? 0, icon:BookOpen, color:"#2563eb", bg:"#eff6ff" },
          { label:"Documentos", value:totalDocs ?? 0, icon:FileText, color:"#7c3aed", bg:"#f5f3ff" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:s.bg}}>
              <s.icon size={22} style={{color:s.color}} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <LayoutDashboard size={16} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900">Usuarios recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Nombre</th>
                <th className="px-5 py-3 text-left">Plan</th>
                <th className="px-5 py-3 text-left">Rol</th>
                <th className="px-5 py-3 text-left">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(recentUsers ?? []).map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{u.first_name} {u.last_name}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.plan === "premium" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                      {u.plan === "premium" ? "⭐ Premium" : "Gratuito"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs capitalize">{u.role}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString("es-CO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
