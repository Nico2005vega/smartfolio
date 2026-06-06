"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RECORD_TYPE_LABELS, RECORD_TYPE_ICONS, type RecordType } from "@/types";
import Link from "next/link";
import { Plus, ExternalLink, Edit, Search, Filter, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AcademicPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const supabase = createClient();

  useEffect(() => {
    const fetchRecords = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("academic_records")
        .select("*, document:documents(file_name, public_url)")
        .eq("profile_id", user.id)
        .order("start_date", { ascending: false });
      setRecords(data ?? []);
      setLoading(false);
    };
    fetchRecords();
  }, []);

  const filtered = records.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.institution.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "all" || r.record_type === activeFilter;
    return matchSearch && matchFilter;
  });

  const byType = filtered.reduce<Record<string, any[]>>((acc, r) => {
    acc[r.record_type] = [...(acc[r.record_type] ?? []), r];
    return acc;
  }, {});

  const COLORS: Record<string, string> = {
    certificate: "#dcfce7", course: "#dbeafe", diploma: "#f3e8ff",
    degree: "#fef3c7", act: "#fee2e2", seminar: "#e0f2fe",
    workshop: "#fce7f3", experience: "#f0fdf4",
  };

  const types = [...new Set(records.map(r => r.record_type))];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formación Académica</h1>
          <p className="text-gray-500 text-sm mt-1">{records.length} registros guardados</p>
        </div>
        <Link href="/academic/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm"
          style={{ background: "#16a34a" }}>
          <Plus size={16} /> Nuevo registro
        </Link>
      </div>

      {/* Búsqueda y filtros */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
        {/* Buscador */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título o institución..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filtros por tipo */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={{
              background: activeFilter === "all" ? "#16a34a" : "white",
              color: activeFilter === "all" ? "white" : "#6b7280",
              borderColor: activeFilter === "all" ? "#16a34a" : "#e5e7eb",
            }}>
            <Filter size={11} /> Todos ({records.length})
          </button>
          {types.map((type) => (
            <button key={type}
              onClick={() => setActiveFilter(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{
                background: activeFilter === type ? "#16a34a" : "white",
                color: activeFilter === type ? "white" : "#6b7280",
                borderColor: activeFilter === type ? "#16a34a" : "#e5e7eb",
              }}>
              {RECORD_TYPE_ICONS[type as RecordType]} {RECORD_TYPE_LABELS[type as RecordType]}
              <span className="ml-1 opacity-70">
                ({records.filter(r => r.record_type === type).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando registros...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-bold text-gray-900 mb-2">Sin resultados</h3>
          <p className="text-gray-500 text-sm">
            {search ? `No hay registros que coincidan con "${search}"` : "Aún no tienes registros académicos."}
          </p>
          {search && (
            <button onClick={() => { setSearch(""); setActiveFilter("all"); }}
              className="mt-4 text-sm font-medium"
              style={{ color: "#16a34a" }}>
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {search && (
            <p className="text-sm text-gray-500">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para <strong>"{search}"</strong>
            </p>
          )}
          {Object.entries(byType).map(([type, items]) => (
            <div key={type} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100"
                style={{ background: COLORS[type] + "33" }}>
                <span className="text-xl">{RECORD_TYPE_ICONS[type as RecordType]}</span>
                <h2 className="font-semibold text-gray-800 text-sm">
                  {RECORD_TYPE_LABELS[type as RecordType]}
                </h2>
                <span className="ml-auto text-xs font-medium bg-white bg-opacity-60 px-2 py-0.5 rounded-full text-gray-600">
                  {items.length}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((r) => (
                  <div key={r.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{r.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{r.institution}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs text-gray-400">
                          {formatDate(r.start_date)}
                          {r.end_date ? ` — ${formatDate(r.end_date)}` : ""}
                        </span>
                        {r.duration_hours && (
                          <span className="text-xs text-gray-400">· {r.duration_hours}h</span>
                        )}
                        {r.document?.public_url && (
                          <a href={r.document.public_url} target="_blank" rel="noopener"
                            className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                            <ExternalLink size={10} /> Ver documento
                          </a>
                        )}
                        {!r.is_visible_in_cv && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            Oculto en CV
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/academic/${r.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                      <Edit size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}