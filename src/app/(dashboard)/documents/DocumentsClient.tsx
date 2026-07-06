"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Upload, Download, Eye, Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

function formatSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function getFileIcon(mime?: string) {
  if (!mime) return "📄";
  if (mime.includes("pdf"))   return "📕";
  if (mime.includes("image")) return "🖼️";
  return "📄";
}

interface Doc {
  id: string;
  file_name: string;
  public_url: string;
  storage_path: string;
  mime_type?: string;
  file_size_bytes?: number;
  uploaded_at: string;
}

interface Props { initialDocs: Doc[]; }

export default function DocumentsClient({ initialDocs }: Props) {
  const [docs,        setDocs]        = useState<Doc[]>(initialDocs);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [confirmId,   setConfirmId]   = useState<string | null>(null);
  const supabase = createClient();
  const router   = useRouter();

  const handleDelete = async (doc: Doc) => {
    setDeleting(doc.id);
    try {
      /* 1. Eliminar del storage */
      const { error: stErr } = await supabase.storage
        .from("academic-documents")
        .remove([doc.storage_path]);
      if (stErr) { toast.error("Error al eliminar archivo: " + stErr.message); return; }

      /* 2. Eliminar de la base de datos */
      const { error: dbErr } = await supabase
        .from("documents")
        .delete()
        .eq("id", doc.id);
      if (dbErr) { toast.error("Error al eliminar registro: " + dbErr.message); return; }

      setDocs(prev => prev.filter(d => d.id !== doc.id));
      setConfirmId(null);
      toast.success("Documento eliminado");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>

      {/* Modal de confirmación */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "28px", maxWidth: "380px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", textAlign: "center", margin: "0 0 8px" }}>
              ¿Eliminar documento?
            </h3>
            <p style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", margin: "0 0 24px" }}>
              Esta acción no se puede deshacer. El archivo se eliminará permanentemente.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setConfirmId(null)}
                style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "1.5px solid #e5e7eb", background: "white", color: "#6b7280", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Cancelar
              </button>
              <button
                onClick={() => { const doc = docs.find(d => d.id === confirmId); if (doc) handleDelete(doc); }}
                disabled={!!deleting}
                style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "none", background: "#ef4444", color: "white", fontSize: "13px", fontWeight: "600", cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1 }}>
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>
            Mis Documentos
          </h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
            {docs.length} archivo{docs.length !== 1 ? "s" : ""} guardado{docs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/documents/upload" style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "10px 18px", background: "#16a34a", color: "white",
          borderRadius: "12px", textDecoration: "none",
          fontSize: "13px", fontWeight: "600",
          boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
        }}>
          <Plus size={15} /> Subir documento
        </Link>
      </div>

      {/* Empty state */}
      {docs.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "60px 32px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <FileText size={28} color="#2563eb" />
          </div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
            Aún no tienes documentos
          </h2>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 24px", maxWidth: "360px", marginLeft: "auto", marginRight: "auto" }}>
            Sube diplomas, certificados o cualquier soporte académico para vincularlos a tus registros.
          </p>
          <Link href="/documents/upload" style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "10px 20px", background: "#16a34a", color: "white",
            borderRadius: "12px", textDecoration: "none", fontSize: "13px", fontWeight: "600",
          }}>
            <Upload size={15} /> Subir primer documento
          </Link>
        </div>
      ) : (
        /* Lista de documentos */
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {docs.map((doc) => (
            <div key={doc.id} style={{
              background: "white", borderRadius: "14px",
              border: `1px solid ${deleting === doc.id ? "#fecaca" : "#f0f0f0"}`,
              padding: "16px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", gap: "14px",
              opacity: deleting === doc.id ? 0.6 : 1,
              transition: "all 0.2s",
            }}>
              {/* Icono */}
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                {getFileIcon(doc.mime_type)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {doc.file_name ?? "Documento sin nombre"}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                  {doc.uploaded_at && (
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                      {formatDate(doc.uploaded_at)}
                    </span>
                  )}
                  {doc.file_size_bytes && (
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                      · {formatSize(doc.file_size_bytes)}
                    </span>
                  )}
                  {doc.mime_type && (
                    <span style={{ fontSize: "10px", color: "#6b7280", background: "#f3f4f6", padding: "2px 7px", borderRadius: "99px" }}>
                      {doc.mime_type.split("/")[1]?.toUpperCase() ?? "ARCHIVO"}
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                {doc.public_url && (
                  <>
                    <a href={doc.public_url} target="_blank" rel="noopener noreferrer"
                      style={{ width: "34px", height: "34px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4", textDecoration: "none" }}
                      title="Ver">
                      <Eye size={15} color="#16a34a" />
                    </a>
                    <a href={doc.public_url} download
                      style={{ width: "34px", height: "34px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", background: "#eff6ff", textDecoration: "none" }}
                      title="Descargar">
                      <Download size={15} color="#2563eb" />
                    </a>
                  </>
                )}
                <button
                  onClick={() => setConfirmId(doc.id)}
                  disabled={!!deleting}
                  style={{ width: "34px", height: "34px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", border: "none", cursor: deleting ? "not-allowed" : "pointer" }}
                  title="Eliminar">
                  <Trash2 size={15} color="#ef4444" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      {docs.length > 0 && (
        <div style={{ marginTop: "20px", padding: "14px 16px", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #bbf7d0", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: "12px", color: "#166534", margin: 0, lineHeight: 1.6 }}>
            Vincula estos documentos a tus registros académicos en{" "}
            <Link href="/academic" style={{ color: "#16a34a", fontWeight: "600" }}>Formación</Link>{" "}
            para que aparezcan como soporte en tu portafolio.
          </p>
        </div>
      )}
    </div>
  );
}