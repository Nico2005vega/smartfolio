import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DocumentsClient from "./DocumentsClient";

export const metadata = { title: "Documentos" };

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("profile_id", user.id)
    .order("id", { ascending: false });

  return <DocumentsClient initialDocs={documents ?? []} />;
}