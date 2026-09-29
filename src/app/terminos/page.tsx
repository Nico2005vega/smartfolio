import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TermsClient from "./TermsClient";

export const metadata = { title: "Términos y tratamiento de datos" };

export default async function TermsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("terms_accepted_at, first_name")
    .eq("id", user.id)
    .single();

  // Si ya aceptó antes, no tiene sentido mostrarle esto de nuevo
  if (profile?.terms_accepted_at) redirect("/dashboard");

  return <TermsClient firstName={profile?.first_name ?? null} />;
}