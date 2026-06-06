import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AcademicRecordForm from "@/components/forms/AcademicRecordForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Nuevo Registro Académico" };

export default async function NewAcademicPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link href="/academic" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> Volver a Formación
      </Link>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Nuevo registro académico</h1>
        <p className="text-gray-500 text-sm mb-7">Agrega un certificado, curso, diploma u otro logro académico.</p>
        <AcademicRecordForm profileId={user.id} />
      </div>
    </div>
  );
}
