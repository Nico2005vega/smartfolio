import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { UserPlan } from "@/types";

const VALID_PLANS: UserPlan[] = ["free", "basic", "premium", "business"];
const VALID_ROLES = ["student", "admin"] as const;

// PATCH /api/admin/users/update — { userId, plan?, role? }
// Permite a un admin cambiar directamente el plan o el rol de otro usuario
// (por ejemplo, para soporte: otorgar un plan sin pago, o corregir un rol).
export async function PATCH(req: Request) {
  const { userId, plan, role } = await req.json();
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Falta el id del usuario" }, { status: 400 });
  }
  if (plan !== undefined && !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
  }
  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: callerProfile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Solo un administrador puede editar usuarios" }, { status: 403 });
  }

  // Evita que un admin se quite el rol de admin a sí mismo por accidente
  if (userId === user.id && role === "student") {
    return NextResponse.json({ error: "No puedes quitarte el rol de administrador a ti mismo desde aquí" }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  if (plan !== undefined) updates.plan = plan;
  if (role !== undefined) updates.role = role;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No se envió ningún cambio" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("id, first_name, last_name, plan, role")
    .single();

  if (error) {
    console.error("Error actualizando usuario:", error.message);
    return NextResponse.json({ error: "No se pudo actualizar el usuario" }, { status: 500 });
  }

  return NextResponse.json(data);
}