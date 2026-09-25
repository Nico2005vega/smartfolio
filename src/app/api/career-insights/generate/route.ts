import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { analyzeProfileWithClaude } from "@/lib/anthropic";
import { hasFeature } from "@/lib/plan";
import type { UserPlan } from "@/types";

// POST /api/career-insights/generate — analiza el perfil del usuario con IA
// y guarda el resultado en career_insights. Requiere plan Premium o Business.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Verificar el plan — esta feature es exclusiva de Premium/Business
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, city, bio")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan as UserPlan) ?? "free";
  if (!hasFeature("jobMatchAI", plan)) {
    return NextResponse.json(
      { error: "El match laboral con IA es una función de los planes Premium y Business." },
      { status: 403 }
    );
  }

  // 2. Traer los datos reales del perfil para el análisis
  const [{ data: records }, { data: skills }] = await Promise.all([
    supabase.from("academic_records").select("title, institution, record_type").eq("profile_id", user.id),
    supabase.from("skills").select("name").eq("profile_id", user.id),
  ]);

  // 3. Llamar a Claude
  let result;
  try {
    result = await analyzeProfileWithClaude({
      bio: profile?.bio ?? null,
      city: profile?.city ?? null,
      records: records ?? [],
      skills: (skills ?? []).map(s => s.name),
    });
  } catch (err) {
    console.error("Error analizando perfil con Claude:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo analizar el perfil en este momento" },
      { status: 502 }
    );
  }

  // 4. Guardar (o actualizar) el resultado — un registro por usuario
  const { data: saved, error: saveError } = await supabase
    .from("career_insights")
    .upsert(
      {
        profile_id: user.id,
        suggested_role: result.suggested_role,
        seniority: result.seniority,
        keywords: result.keywords,
        industry: result.industry,
        generated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id" }
    )
    .select()
    .single();

  if (saveError) {
    console.error("Error guardando career_insights:", saveError.message);
    return NextResponse.json({ error: "No se pudo guardar el análisis" }, { status: 500 });
  }

  return NextResponse.json(saved, { status: 200 });
}