import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/terms/accept — marca que el usuario autenticado aceptó los
// términos de uso y el tratamiento de datos personales, con fecha y hora.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("profiles")
    .update({ terms_accepted_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    console.error("Error registrando aceptación de términos:", error.message);
    return NextResponse.json({ error: "No se pudo registrar la aceptación" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}