import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AcademicRecordForm from "@/components/forms/AcademicRecordForm";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import DeleteRecordButton from "@/components/forms/DeleteRecordButton";

interface Props { params: Promise<{ id: string }> }

export const metadata = { title: "Editar Registro" };

export default async function EditAcademicPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: record } = await supabase
    .from("academic_records")
    .select("*, document:documents(id,file_name,public_url)")
    .eq("id", id)
    .eq("profile_id", user.id)
    .single();

  if (!record) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Link href="/academic"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> Volver
        </Link>
        <DeleteRecordButton recordId={id} />
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Editar registro académico</h1>
        <p className="text-gray-500 text-sm mb-7">Actualiza los datos de este logro académico.</p>
        <AcademicRecordForm profileId={user.id} record={record as any} />
      </div>
    </div>
  );
}
