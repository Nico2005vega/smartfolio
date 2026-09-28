import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// POST /api/admin/users/delete — { userId }
// Elimina por completo a un usuario: primero borra sus datos relacionados
// en cada tabla (para no dejar filas huérfanas aunque no exista ON DELETE
// CASCADE configurado), luego el perfil, y por último la cuenta de auth.
export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Falta el id del usuario a eliminar" }, { status: 400 });
  }

  // 1. Verificar que quien llama es realmente un admin autenticado
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: callerProfile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Solo un administrador puede eliminar usuarios" }, { status: 403 });
  }

  // 2. Nunca permitir que un admin se elimine a sí mismo por accidente desde aquí
  if (userId === user.id) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta desde este panel" }, { status: 400 });
  }

  const admin = createAdminClient();

  // 3. Borrar en cascada manual — el orden no importa entre sí, todas cuelgan
  // directamente de profile_id, así que se pueden borrar en paralelo.
  const cleanupTables = [
    "portfolio_visits", "career_insights", "subscriptions",
    "cv_configurations", "skills", "documents", "academic_records",
  ] as const;

  const cleanupResults = await Promise.all(
    cleanupTables.map((table) => admin.from(table).delete().eq("profile_id", userId))
  );
  const cleanupError = cleanupResults.find((r) => r.error);
  if (cleanupError?.error) {
    console.error("Error limpiando datos del usuario:", cleanupError.error.message);
    return NextResponse.json({ error: "No se pudieron borrar todos los datos relacionados" }, { status: 500 });
  }

  // 4. Borrar el perfil
  const { error: profileError } = await admin.from("profiles").delete().eq("id", userId);
  if (profileError) {
    console.error("Error borrando el perfil:", profileError.message);
    return NextResponse.json({ error: "No se pudo borrar el perfil" }, { status: 500 });
  }

  // 5. Borrar la cuenta de autenticación (esto es lo que realmente impide
  // que la persona vuelva a iniciar sesión)
  const { error: authError } = await admin.auth.admin.deleteUser(userId);
  if (authError) {
    console.error("Error borrando la cuenta de auth:", authError.message);
    return NextResponse.json({ error: "El perfil se borró, pero la cuenta de acceso no — contacta soporte de Supabase" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}