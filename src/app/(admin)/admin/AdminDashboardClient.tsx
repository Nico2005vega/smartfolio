"use client";
import { Users, FileText, BookOpen, Eye } from "lucide-react";

interface Props {
  totalUsers:   number;
  totalRecords: number;
  totalDocs:    number;
  recentUsers:  any[];
  chartByType:  { name: string; value: number }[];
  chartByMonth: { name: string; value: number }[];
}

const COLORS = ["#16a34a","#2563eb","#7c3aed","#db2777","#d97706","#0891b2","#374151","#dc2626"];

const RECORD_LABELS: Record<string, string> = {
  Certificate: "Certificado", Course: "Curso", Diploma: "Diplomado",
  Degree: "Título", Act: "Acta", Seminar: "Seminario",
  Workshop: "Taller", Experience: "Experiencia",
};

export default function AdminDashboardClient({
  totalUsers, totalRecords, totalDocs,
  recentUsers, chartByType, chartByMonth,
}: Props) {

  const totalVisits = recentUsers.reduce((acc, u) => acc + (u.visit_count ?? 0), 0);
  const maxType  = Math.max(...chartByType.map(d => d.value), 1);
  const maxMonth = Math.max(...chartByMonth.map(d => d.value), 1);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel Administrador</h1>
        <p className="text-gray-500 text-sm mt-1">
          Métricas globales de Smartfolio — BAN 00329 · UTS Bucaramanga
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Usuarios",             value: totalUsers,   icon: Users,    color:"#16a34a", bg:"#f0fdf4" },
          { label:"Registros académicos", value: totalRecords, icon: BookOpen, color:"#2563eb", bg:"#eff6ff" },
          { label:"Documentos",           value: totalDocs,    icon: FileText, color:"#7c3aed", bg:"#f5f3ff" },
          { label:"Visitas totales",      value: totalVisits,  icon: Eye,      color:"#d97706", bg:"#fffbeb" },
        ].map((s) => (
          <div key={s.label}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg }}>
              <s.icon size={22} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas CSS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Barras por tipo */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Registros por categoría</h2>
          {chartByType.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {chartByType.map((d, i) => (
                <div key={d.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">
                      {RECORD_LABELS[d.name] ?? d.name}
                    </span>
                    <span className="text-gray-400">{d.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                      style={{
                        width: `${(d.value / maxType) * 100}%`,
                        background: COLORS[i % COLORS.length],
                        minWidth: "32px",
                      }}>
                      <span className="text-white text-xs font-bold">{d.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distribución visual */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Distribución de tipos</h2>
          {chartByType.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos aún</p>
          ) : (
            <div className="space-y-2">
              {chartByType.map((d, i) => {
                const pct = Math.round((d.value / totalRecords) * 100);
                return (
                  <div key={d.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-gray-600 flex-1">
                      {RECORD_LABELS[d.name] ?? d.name}
                    </span>
                    <span className="text-xs font-bold text-gray-700">{pct}%</span>
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: COLORS[i % COLORS.length],
                        }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Usuarios por mes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="font-bold text-gray-900 mb-5">Nuevos usuarios por mes</h2>
          {chartByMonth.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos aún</p>
          ) : (
            <div className="flex items-end gap-3 h-36">
              {chartByMonth.map((d) => (
                <div key={d.name} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-gray-700">{d.value}</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${(d.value / maxMonth) * 100}px`,
                      background: "#2563eb",
                      minHeight: "8px",
                    }} />
                  <span className="text-xs text-gray-400 truncate w-full text-center">
                    {d.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Usuarios registrados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Nombre</th>
                <th className="px-5 py-3 text-left">Plan</th>
                <th className="px-5 py-3 text-left">Rol</th>
                <th className="px-5 py-3 text-left">Visitas</th>
                <th className="px-5 py-3 text-left">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {u.first_name} {u.last_name}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.plan === "premium"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {u.plan === "premium" ? "⭐ Premium" : "Gratuito"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs capitalize">{u.role}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {u.visit_count ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString("es-CO", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
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