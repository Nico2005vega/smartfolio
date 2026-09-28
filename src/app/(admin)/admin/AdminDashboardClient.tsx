"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Users, FileText, BookOpen, Eye, Search, Pencil, Trash2, X, ShieldAlert } from "lucide-react";
import type { Profile, UserPlan } from "@/types";
import { PLAN_LABELS, PLAN_BADGE_CLASSES } from "@/types";

type RecentUser = Pick<Profile, "id" | "first_name" | "last_name" | "plan" | "role" | "created_at" | "visit_count">;

interface Props {
  totalUsers:   number;
  totalRecords: number;
  totalDocs:    number;
  recentUsers:  RecentUser[];
  chartByType:  { name: string; value: number }[];
  chartByMonth: { name: string; value: number }[];
  currentUserId: string;
}

const COLORS = ["#16a34a","#2563eb","#7c3aed","#db2777","#d97706","#0891b2","#374151","#dc2626"];

const RECORD_LABELS: Record<string, string> = {
  Certificate: "Certificado", Course: "Curso", Diploma: "Diplomado",
  Degree: "Título", Act: "Acta", Seminar: "Seminario",
  Workshop: "Taller", Experience: "Experiencia",
};

const ALL_PLANS: UserPlan[] = ["free", "basic", "premium", "business"];

export default function AdminDashboardClient({
  totalUsers, totalRecords, totalDocs,
  recentUsers: initialUsers, chartByType, chartByMonth, currentUserId,
}: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<RecentUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<RecentUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<RecentUser | null>(null);
  const [busy, setBusy] = useState(false);

  const totalVisits = users.reduce((acc, u) => acc + (u.visit_count ?? 0), 0);
  const maxType  = Math.max(...chartByType.map(d => d.value), 1);
  const maxMonth = Math.max(...chartByMonth.map(d => d.value), 1);

  // Quita tildes para que buscar "Maria" también encuentre a "María"
  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredUsers = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return users;
    return users.filter(u => normalize(`${u.first_name} ${u.last_name}`).includes(q));
  }, [users, search]);

  const handleDelete = async () => {
    if (!deletingUser) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: deletingUser.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo eliminar el usuario");
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      toast.success(`${deletingUser.first_name} ${deletingUser.last_name} fue eliminado`);
      setDeletingUser(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ocurrió un error");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEdit = async (plan: UserPlan, role: "student" | "admin") => {
    if (!editingUser) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editingUser.id, plan, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo actualizar el usuario");
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, plan: data.plan, role: data.role } : u));
      toast.success("Usuario actualizado");
      setEditingUser(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ocurrió un error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
                      className="h-6 rounded-full flex items-center justify-end pr-2"
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

        {/* Distribución */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Distribución de tipos</h2>
          {chartByType.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
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
                  <div className="w-full rounded-t-lg"
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

      {/* Tabla usuarios */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="font-bold text-gray-900">Usuarios registrados</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 w-56"
            />
          </div>
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
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">Sin resultados</td></tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {u.first_name} {u.last_name}
                    {u.id === currentUserId && <span className="ml-2 text-[10px] text-gray-400 font-normal">(tú)</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PLAN_BADGE_CLASSES[u.plan]}`}>
                      {PLAN_LABELS[u.plan]}
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
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditingUser(u)} title="Editar"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => u.id !== currentUserId && setDeletingUser(u)}
                        disabled={u.id === currentUserId}
                        title={u.id === currentUserId ? "No puedes eliminar tu propia cuenta" : "Eliminar"}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:cursor-not-allowed">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: editar usuario ── */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          busy={busy}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* ── Modal: confirmar eliminación ── */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <ShieldAlert size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1.5">¿Eliminar a {deletingUser.first_name} {deletingUser.last_name}?</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Esta acción es permanente. Se borrarán su cuenta, perfil, CV, documentos, habilidades y todo su historial. No se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeletingUser(null)} disabled={busy}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={busy}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60">
                {busy ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditUserModal({ user, busy, onClose, onSave }: {
  user: RecentUser; busy: boolean;
  onClose: () => void;
  onSave: (plan: UserPlan, role: "student" | "admin") => void;
}) {
  const [plan, setPlan] = useState<UserPlan>(user.plan);
  const [role, setRole] = useState<"student" | "admin">(user.role as "student" | "admin");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Editar {user.first_name} {user.last_name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Plan</label>
        <select value={plan} onChange={(e) => setPlan(e.target.value as UserPlan)}
          className="w-full mb-4 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-400">
          {ALL_PLANS.map(p => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
        </select>

        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Rol</label>
        <select value={role} onChange={(e) => setRole(e.target.value as "student" | "admin")}
          className="w-full mb-5 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-400">
          <option value="student">Estudiante</option>
          <option value="admin">Administrador</option>
        </select>

        <div className="flex gap-2">
          <button onClick={onClose} disabled={busy}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={() => onSave(plan, role)} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
            {busy ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}