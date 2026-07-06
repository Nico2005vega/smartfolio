"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, FileText, Image, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ACCEPTED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_MB   = 10;

function getFileIcon(mime: string) {
  if (mime.includes("pdf"))   return <FileText size={28} color="#ef4444" />;
  if (mime.includes("image")) return <Image    size={28} color="#2563eb" />;
  return <FileText size={28} color="#6b7280" />;
}

export default function DocumentUploadPage() {
  const [file,       setFile]       = useState<File | null>(null);
  const [dragging,   setDragging]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [done,       setDone]       = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router   = useRouter();

  const handleFile = (f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Tipo de archivo no permitido. Solo PDF, JPG, PNG o WEBP.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`El archivo supera el límite de ${MAX_MB} MB.`);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("No autenticado"); return; }

      const ext      = file.name.split(".").pop();
      const path     = `${user.id}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("academic-documents")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (upErr) { toast.error("Error al subir: " + upErr.message); return; }

      const { data: urlData } = supabase.storage
        .from("academic-documents")
        .getPublicUrl(path);

      const { error: dbErr } = await supabase.from("documents").insert({
        profile_id:   user.id,
        file_name:    file.name,
        public_url:   urlData.publicUrl,
        storage_path: path,
      });

      if (dbErr) { toast.error("Error al guardar: " + dbErr.message); return; }

      setDone(true);
      toast.success("Documento subido correctamente ✓");
      setTimeout(() => router.push("/documents"), 1800);

    } finally {
      setUploading(false);
    }
  };

  /* ── UI ── */
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>

      <Link href="/documents"
        style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#6b7280", textDecoration: "none", marginBottom: "20px" }}>
        <ChevronLeft size={16} /> Volver a documentos
      </Link>

      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>
        Subir documento
      </h1>
      <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 24px" }}>
        PDF, JPG, PNG o WEBP · máximo {MAX_MB} MB
      </p>

      {/* Zona de drop */}
      {!file && !done && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#16a34a" : "#e5e7eb"}`,
            borderRadius: "16px",
            padding: "48px 24px",
            textAlign: "center",
            background: dragging ? "#f0fdf4" : "#fafafa",
            cursor: "pointer",
            transition: "all 0.2s",
          }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Upload size={26} color="#2563eb" />
          </div>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#111827", margin: "0 0 6px" }}>
            Arrastra tu archivo aquí
          </p>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 16px" }}>
            o haz clic para seleccionar
          </p>
          <span style={{ fontSize: "12px", color: "#d1d5db", background: "#f3f4f6", padding: "4px 12px", borderRadius: "99px" }}>
            PDF · JPG · PNG · WEBP
          </span>
          <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp"
            style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {/* Preview del archivo seleccionado */}
      {file && !done && (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {getFileIcon(file.type)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type.split("/")[1].toUpperCase()}
              </p>
            </div>
            <button onClick={() => setFile(null)}
              style={{ background: "#fef2f2", border: "none", cursor: "pointer", padding: "8px", borderRadius: "9px" }}>
              <X size={16} color="#ef4444" />
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setFile(null)}
              style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1.5px solid #e5e7eb", background: "white", color: "#6b7280", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              Cambiar archivo
            </button>
            <button onClick={upload} disabled={uploading}
              style={{ flex: 2, padding: "11px", borderRadius: "12px", border: "none", background: uploading ? "#86efac" : "#16a34a", color: "white", fontSize: "13px", fontWeight: "600", cursor: uploading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {uploading
                ? <><Loader2 size={15} className="animate-spin" /> Subiendo...</>
                : <><Upload size={15} /> Subir documento</>}
            </button>
          </div>
        </div>
      )}

      {/* Estado completado */}
      {done && (
        <div style={{ background: "#f0fdf4", borderRadius: "16px", border: "1px solid #bbf7d0", padding: "40px 24px", textAlign: "center" }}>
          <CheckCircle2 size={48} color="#16a34a" style={{ margin: "0 auto 14px" }} />
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#166534", margin: "0 0 6px" }}>
            ¡Documento subido!
          </h2>
          <p style={{ fontSize: "13px", color: "#4ade80", margin: 0 }}>
            Redirigiendo a tus documentos...
          </p>
        </div>
      )}
    </div>
  );
}