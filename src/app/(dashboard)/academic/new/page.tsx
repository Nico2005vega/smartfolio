import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AcademicRecordForm from "@/components/forms/AcademicRecordForm";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { canAddMore, getLimit } from "@/lib/plans";
import type { UserPlan } from "@/types";

export const metadata = { title: "Nuevo Registro Académico" };

export default async function NewAcademicPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase.from("academic_records").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
  ]);

  const plan = (profile?.plan as UserPlan) ?? "free";
  const currentCount = count ?? 0;
  const canAdd = canAddMore("academicRecords", plan, currentCount);
  const limit = getLimit("academicRecords", plan);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link href="/academic" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> Volver a Formación
      </Link>

      {canAdd ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Nuevo registro académico</h1>
          <p className="text-gray-500 text-sm mb-7">Agrega un certificado, curso, diploma u otro logro académico.</p>
          <AcademicRecordForm profileId={user.id} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={26} className="text-purple-600" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Llegaste al límite de tu plan</h1>
          <p className="text-gray-500 text-sm mb-6">
            Tu plan actual permite hasta {limit} registro{limit === 1 ? "" : "s"} académico{limit === 1 ? "" : "s"}.
            Actualiza tu plan para agregar registros ilimitados.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#7c3aed" }}
          >
            <Sparkles size={14} /> Ver planes
          </Link>
        </div>
      )}
    </div>
  );
}