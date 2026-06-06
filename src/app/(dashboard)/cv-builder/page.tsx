import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CVBuilderWrapper from "./CVBuilderWrapper";

export const metadata = { title: "Generar CV" };

export default async function CVBuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: records },
    { data: skills },
    { data: templates },
    { data: config },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("academic_records").select("*, document:documents(file_name,public_url)").eq("profile_id", user.id),
    supabase.from("skills").select("*").eq("profile_id", user.id).order("sort_order"),
    supabase.from("cv_templates").select("*").eq("is_active", true),
    supabase.from("cv_configurations").select("*, template:cv_templates(*)").eq("profile_id", user.id).single(),
  ]);

  return (
    <CVBuilderWrapper
      profile={profile}
      records={records ?? []}
      skills={skills ?? []}
      templates={templates ?? []}
      config={config}
    />
  );
}