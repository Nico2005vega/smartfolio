import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SkillsManager from "@/components/forms/SkillsManager";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Mis Habilidades" };

export default async function SkillsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order");

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link href="/profile"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> Volver al perfil
      </Link>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Mis Habilidades</h1>
        <p className="text-gray-500 text-sm mb-7">
          Agrega tus habilidades técnicas, idiomas y herramientas. Aparecerán en tu CV y portafolio.
        </p>
        <SkillsManager profileId={user.id} initialSkills={skills ?? []} />
      </div>
    </div>
  );
}
