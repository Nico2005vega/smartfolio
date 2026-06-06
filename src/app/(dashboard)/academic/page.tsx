import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RECORD_TYPE_LABELS, RECORD_TYPE_ICONS } from "@/types";
import Link from "next/link";
import { Plus, ExternalLink, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Formación Académica" };

export default async function AcademicPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: records } = await supabase
    .from("academic_records")
    .select("*, document:documents(file_name, public_url)")
    .eq("profile_id", user.id)
    .order("start_date", { ascending: false });

  const byType = (records ?? []).reduce<Record<string, typeof records>>(
    (acc, r) => { acc[r.record_type] = [...(acc[r.record_type] ?? []), r]; return acc; },
    {}
  );

  const COLORS: Record<string, string> = {
    certificate:"#dcfce7",course:"#dbeafe",diploma:"#f3e8ff",degree:"#fef3c7",
    act:"#fee2e2",seminar:"#e0f2fe",workshop:"#fce7f3",experience:"#f0fdf4",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formación Académica</h1>
          <p className="text-gray-500 text-sm mt-1">{records?.length ?? 0} registros guardados</p>
        </div>
        <Link href="/academic/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm"
          style={{background:"#16a34a"}}>
          <Plus size={16} /> Nuevo registro
        </Link>
      </div>

      {(!records || records.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-bold text-gray-900 mb-2">Sin registros académicos aún</h3>
          <p className="text-gray-500 text-sm mb-6">Comienza agregando tus certificados, cursos y logros académicos.</p>
          <Link href="/academic/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
            style={{background:"#16a34a"}}>
            <Plus size={16} /> Agregar mi primer registro
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byType).map(([type, items]) => (
            <div key={type} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100" style={{background:COLORS[type]+"33"}}>
                <span className="text-xl">{RECORD_TYPE_ICONS[type as keyof typeof RECORD_TYPE_ICONS]}</span>
                <h2 className="font-semibold text-gray-800">{RECORD_TYPE_LABELS[type as keyof typeof RECORD_TYPE_LABELS]}</h2>
                <span className="ml-auto text-xs font-medium bg-white bg-opacity-60 px-2 py-0.5 rounded-full text-gray-600">
                  {items?.length}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {items?.map((r) => (
                  <div key={r.id} className="flex items-start gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{r.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{r.institution}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs text-gray-400">{formatDate(r.start_date)}{r.end_date ? ` — ${formatDate(r.end_date)}` : ""}</span>
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
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Oculto en CV</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link href={`/academic/${r.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit size={14} />
                      </Link>
                    </div>
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
