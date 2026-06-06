import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate, formatFileSize } from "@/lib/utils";
import { FileText, ExternalLink } from "lucide-react";

export const metadata = { title: "Mis Documentos" };

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: docs } = await supabase
    .from("documents").select("*")
    .eq("profile_id", user.id)
    .order("uploaded_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Documentos</h1>
        <p className="text-gray-500 text-sm mt-1">
          {docs?.length ?? 0} archivos almacenados · Sube PDFs e imágenes de soporte al agregar un registro académico.
        </p>
      </div>

      {(!docs || docs.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FileText size={48} className="text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Sin documentos aún</h3>
          <p className="text-gray-500 text-sm">Los documentos se suben al crear o editar un registro académico.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{background: doc.file_type === "pdf" ? "#fee2e2" : "#dbeafe"}}>
                  <span className="text-lg">{doc.file_type === "pdf" ? "📄" : "🖼️"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{doc.file_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatFileSize(doc.file_size_bytes)} · {formatDate(doc.uploaded_at)}
                  </p>
                </div>
                <a href={doc.public_url} target="_blank" rel="noopener"
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 flex-shrink-0">
                  <ExternalLink size={14} /> Ver
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
