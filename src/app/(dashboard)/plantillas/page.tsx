// src/app/(dashboard)/plantillas/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TemplateGalleryClient from "./TemplateGalleryClient";

export const metadata = { title: "Plantillas de CV · Smartfolio" };

export default async function PlantillasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <TemplateGalleryClient />;
}