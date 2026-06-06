import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/forms/ProfileForm";

export const metadata = { title: "Mi Perfil" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">
          Esta información aparece en tu portafolio y hoja de vida.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
        <ProfileForm profile={profile} userId={user.id} email={user.email ?? ""} />
      </div>
    </div>
  );
}
