import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseWompiReference } from "@/lib/wompi";

// Lee un valor anidado de un objeto usando una ruta tipo "transaction.status"
function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

interface WompiEventBody {
  event: string;
  data: { transaction: { id: string; status: string; reference: string } };
  signature: { properties: string[]; checksum: string };
  timestamp: number;
  environment: "test" | "prod";
}

// POST /api/webhooks/wompi — Wompi llama aquí cuando una transacción cambia de estado.
// Configura esta URL en tu Dashboard de Wompi: Desarrolladores > URL de eventos
// (una para sandbox y otra para producción).
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as WompiEventBody | null;
  if (!body?.signature?.checksum) {
    return NextResponse.json({ error: "Cuerpo del evento inválido" }, { status: 400 });
  }

  // 1. Verificar que el evento realmente viene de Wompi (no de un impostor)
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    console.error("Falta WOMPI_EVENTS_SECRET en las variables de entorno");
    return NextResponse.json({ error: "Servidor mal configurado" }, { status: 500 });
  }

  const concatenatedValues = body.signature.properties
    .map((path) => String(getByPath(body.data, path) ?? ""))
    .join("");
  const toHash = `${concatenatedValues}${body.timestamp}${secret}`;
  const expectedChecksum = crypto.createHash("sha256").update(toHash).digest("hex");

  if (expectedChecksum !== body.signature.checksum) {
    console.error("Firma de Wompi inválida — posible intento de suplantación");
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  // 2. Solo nos interesa cuando una transacción llega a un estado final
  if (body.event !== "transaction.updated") {
    return NextResponse.json({ received: true });
  }

  const { transaction } = body.data;
  const parsed = parseWompiReference(transaction.reference);
  if (!parsed) {
    console.error("Referencia de Wompi no reconocida:", transaction.reference);
    return NextResponse.json({ received: true });
  }

  if (transaction.status === "APPROVED") {
    const admin = createAdminClient();

    // Activa el plan en el perfil del usuario
    const { error: profileError } = await admin
      .from("profiles")
      .update({ plan: parsed.plan })
      .eq("id", parsed.profileId);

    if (profileError) console.error("Error actualizando el plan del perfil:", profileError.message);

    // Registra la suscripción para historial
    const { error: subError } = await admin.from("subscriptions").insert({
      profile_id: parsed.profileId,
      plan: parsed.plan,
      status: "active",
      payment_provider: "wompi",
      external_id: transaction.id,
    });

    if (subError) console.error("Error registrando la suscripción:", subError.message);
  }
  // Nota: DECLINED, VOIDED o ERROR no requieren acción — el usuario
  // simplemente se queda en su plan actual y puede intentar de nuevo.

  return NextResponse.json({ received: true });
}