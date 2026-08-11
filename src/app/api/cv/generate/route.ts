import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateCVData } from "@/lib/cv-generator";
import type { Profile, AcademicRecord, Skill, CVStyleConfig } from "@/types";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Unauthorized" }, { status:401 });

  const [{ data: profile },{ data: records },{ data: skills },{ data: config }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("academic_records").select("*, document:documents(*)").eq("profile_id", user.id),
    supabase.from("skills").select("*").eq("profile_id", user.id).order("sort_order"),
    supabase.from("cv_configurations").select("*, template:cv_templates(*)").eq("profile_id", user.id).single(),
  ]);

  if (!profile) return NextResponse.json({ error:"Not found" }, { status:404 });
  const cvData = generateCVData(
    profile as Profile,
    (records ?? []) as AcademicRecord[],
    (skills ?? []) as Skill[],
    config as CVStyleConfig
  );
  await supabase.from("cv_configurations").update({ last_generated_at: new Date().toISOString() }).eq("profile_id", user.id);
  return NextResponse.json(cvData);
}
