import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Upload, Download, Trash2, Eye, Plus } from "lucide-react";

export const metadata = { title: "Documentos" };

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
  if (mime.includes("pdf")) return "📕";
  if (mime.includes("image")) return "🖼️";
  if (mime.includes("word") || mime.includes("document")) return "📝";
  if (mime.includes("sheet") || mime.includes("excel")) return "📊";
  if (mime.includes("zip") || mime.includes("rar")) return "🗜️";
  return "📄";
}

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  const docs = documents ?? [];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>

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

      {docs.length === 0 ? (
        /* ── Empty state ── */
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
            borderRadius: "12px", textDecoration: "none",
            fontSize: "13px", fontWeight: "600",
          }}>
            <Upload size={15} /> Subir primer documento
          </Link>
        </div>
      ) : (
        /* ── Document list ── */
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {docs.map((doc: any) => (
            <div key={doc.id} style={{
              background: "white", borderRadius: "14px",
              border: "1px solid #f0f0f0", padding: "16px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", gap: "14px",
            }}>
              {/* Icono */}
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: "#eff6ff", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "22px", flexShrink: 0,
              }}>
                {getFileIcon(doc.mime_type)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {doc.file_name ?? "Documento sin nombre"}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                  {doc.created_at && (
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                      {formatDate(doc.created_at)}
                    </span>
                  )}
                  {doc.file_size && (
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                      · {formatSize(doc.file_size)}
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
                    <a href={doc.public_url} target="_blank" rel="noopener noreferrer" style={{
                      width: "34px", height: "34px", borderRadius: "9px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#f0fdf4", textDecoration: "none",
                    }} title="Ver documento">
                      <Eye size={15} color="#16a34a" />
                    </a>
                    <a href={doc.public_url} download style={{
                      width: "34px", height: "34px", borderRadius: "9px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#eff6ff", textDecoration: "none",
                    }} title="Descargar">
                      <Download size={15} color="#2563eb" />
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info tip */}
      {docs.length > 0 && (
        <div style={{ marginTop: "20px", padding: "14px 16px", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #bbf7d0", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: "12px", color: "#166534", margin: 0, lineHeight: 1.6 }}>
            Puedes vincular estos documentos a tus registros académicos en la sección{" "}
            <Link href="/academic" style={{ color: "#16a34a", fontWeight: "600" }}>Formación</Link>{" "}
            para que aparezcan como soporte en tu portafolio.
          </p>
        </div>
      )}
    </div>
  );
}