"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const totalVisits = recentUsers.reduce((acc, u) => acc + (u.visit_count ?? 0), 0);

  const typeData = chartByType.map(d => ({
    ...d,
    name: RECORD_LABELS[d.name] ?? d.name,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

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
          { label:"Usuarios",            value: totalUsers,   icon: Users,    color:"#16a34a", bg:"#f0fdf4" },
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

      {/* Gráficas — solo se renderizan cuando el componente está montado */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Barras por tipo */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Registros por categoría</h2>
            {typeData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin datos aún</p>
            ) : (
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius:"8px", border:"1px solid #e5e7eb", fontSize:"12px" }}
                    />
                    <Bar dataKey="value" fill="#16a34a" radius={[4,4,0,0]} name="Registros" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Pie distribución */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Distribución de tipos</h2>
            {typeData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin datos aún</p>
            ) : (
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%" cy="50%"
                      outerRadius={75}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}>
                      {typeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius:"8px", border:"1px solid #e5e7eb", fontSize:"12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Usuarios por mes */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
            <h2 className="font-bold text-gray-900 mb-4">Nuevos usuarios por mes</h2>
            {chartByMonth.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin datos aún</p>
            ) : (
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius:"8px", border:"1px solid #e5e7eb", fontSize:"12px" }}
                    />
                    <Bar dataKey="value" fill="#2563eb" radius={[4,4,0,0]} name="Usuarios" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      )}

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