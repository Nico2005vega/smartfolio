"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RECORD_TYPE_LABELS, RECORD_TYPE_ICONS, type RecordType } from "@/types";
import Link from "next/link";
import { Plus, Edit, Search, X, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AcademicPage() {
  const [records, setRecords]         = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("academic_records")
        .select("*, document:documents(file_name,public_url)")
        .eq("profile_id", user.id)
        .order("start_date", { ascending: false });
      setRecords(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const types = [...new Set(records.map(r => r.record_type))];

  const filtered = records.filter(r => {
    const matchSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.institution.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "all" || r.record_type === activeFilter;
    return matchSearch && matchFilter;
  });

  const byType = filtered.reduce<Record<string, any[]>>((acc, r) => {
    acc[r.record_type] = [...(acc[r.record_type] ?? []), r];
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>Formación Académica</h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
            {records.length} registro{records.length !== 1 ? "s" : ""} guardado{records.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/academic/new" style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "10px 18px", background: "#16a34a", color: "white",
          borderRadius: "12px", textDecoration: "none",
          fontSize: "13px", fontWeight: "600",
          boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
        }}>
          <Plus size={15} /> Nuevo registro
        </Link>
      </div>

      {/* Buscador y filtros */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "16px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <Search size={15} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o institución..."
            style={{
              width: "100%", padding: "10px 36px 10px 36px",
              border: "1.5px solid #f0f0f0", borderRadius: "10px",
              fontSize: "13px", outline: "none", background: "#fafafa",
              boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = "#16a34a"}
            onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: "4px",
            }}>
              <X size={13} color="#9ca3af" />
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <button onClick={() => setActiveFilter("all")} style={{
            padding: "5px 12px", borderRadius: "99px", border: "1.5px solid",
            fontSize: "12px", fontWeight: "500", cursor: "pointer",
            background: activeFilter === "all" ? "#16a34a" : "white",
            color: activeFilter === "all" ? "white" : "#6b7280",
            borderColor: activeFilter === "all" ? "#16a34a" : "#e5e7eb",
          }}>
            <Filter size={11} style={{ verticalAlign: "-1px", marginRight: "4px" }} />
            Todos ({records.length})
          </button>
          {types.map(type => (
            <button key={type} onClick={() => setActiveFilter(type)} style={{
              padding: "5px 12px", borderRadius: "99px", border: "1.5px solid",
              fontSize: "12px", fontWeight: "500", cursor: "pointer",
              background: activeFilter === type ? "#16a34a" : "white",
              color: activeFilter === type ? "white" : "#6b7280",
              borderColor: activeFilter === type ? "#16a34a" : "#e5e7eb",
            }}>
              {RECORD_TYPE_ICONS[type as RecordType]} {RECORD_TYPE_LABELS[type as RecordType]}
              <span style={{ marginLeft: "4px", opacity: 0.7 }}>({records.filter(r => r.record_type === type).length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1,2].map(i => (
            <div key={i} style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "20px", height: "120px" }} className="animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "48px", textAlign: "center" }}>
          <p style={{ fontSize: "36px", margin: "0 0 10px" }}>🔍</p>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#374151", margin: "0 0 6px" }}>Sin resultados</p>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 16px" }}>
            {search ? `No hay registros que coincidan con "${search}"` : "Aún no tienes registros académicos"}
          </p>
          {search
            ? <button onClick={() => { setSearch(""); setActiveFilter("all"); }} style={{ fontSize: "13px", color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>Limpiar búsqueda</button>
            : <Link href="/academic/new" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#16a34a", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                <Plus size={14} /> Agregar primero
              </Link>
          }
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {search && (
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para <strong style={{ color: "#374151" }}>"{search}"</strong>
            </p>
          )}
          {Object.entries(byType).map(([type, items]) => (
            <div key={type} style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: "18px" }}>{RECORD_TYPE_ICONS[type as RecordType]}</span>
                <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>
                  {RECORD_TYPE_LABELS[type as RecordType]}
                </h2>
                <span style={{ marginLeft: "auto", fontSize: "11px", color: "#9ca3af", background: "#f0f0f0", padding: "2px 8px", borderRadius: "99px" }}>
                  {items.length}
                </span>
              </div>
              <div>
                {items.map((r, i) => (
                  <div key={r.id} style={{
                    display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px",
                    borderBottom: i < items.length - 1 ? "1px solid #f8f8f8" : "none",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.institution}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                          {formatDate(r.start_date)}
                          {r.end_date ? ` — ${formatDate(r.end_date)}` : ""}
                        </span>
                        {r.duration_hours && (
                          <span style={{ fontSize: "11px", color: "#9ca3af" }}>· {r.duration_hours}h</span>
                        )}
                        {r.document?.public_url && (
                          <a href={r.document.public_url} target="_blank" style={{ fontSize: "11px", color: "#16a34a", textDecoration: "none" }}>
                            📎 Ver documento
                          </a>
                        )}
                        {!r.is_visible_in_cv && (
                          <span style={{ fontSize: "11px", color: "#9ca3af", background: "#f0f0f0", padding: "1px 6px", borderRadius: "99px" }}>
                            Oculto en CV
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/academic/${r.id}/edit`} style={{
                      padding: "8px", borderRadius: "10px",
                      color: "#9ca3af", textDecoration: "none",
                      display: "flex", alignItems: "center",
                      flexShrink: 0,
                    }}>
                      <Edit size={15} />
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