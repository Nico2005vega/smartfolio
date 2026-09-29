import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// POST /api/terms/accept — marca que el usuario autenticado aceptó los
// términos de uso y el tratamiento de datos personales, con fecha y hora.
export async function POST() {
  // 1. Verificar la sesión con el cliente normal (respeta RLS)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Escribir con el cliente administrador — evita depender de que exista
  // una política RLS específica para esta columna. Es seguro porque el
  // usuario ya quedó verificado arriba y solo se actualiza su propia fila.
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ terms_accepted_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    console.error("Error registrando aceptación de términos:", error.message);
    return NextResponse.json({ error: `No se pudo registrar la aceptación: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}