import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const metadata = { title: "Configuración" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  const { data: cvConfig } = await supabase
    .from("cv_configurations")
    .select("*, template:cv_templates(*)")
    .eq("profile_id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Privacidad, portafolio y preferencias de la cuenta.</p>
      </div>
      <SettingsClient
        profile={profile}
        userId={user.id}
        email={user.email ?? ""}
        cvConfig={cvConfig}
      />
    </div>
  );
}
