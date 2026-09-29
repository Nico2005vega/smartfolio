import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseWompiReference, WOMPI_PLAN_PRICES_COP } from "@/lib/wompi";

// Lee un valor anidado de un objeto usando una ruta tipo "transaction.status"
function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

interface WompiEventBody {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      reference: string;
      amount_in_cents: number;
      currency: string;
    };
  };
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

  // Comparación en tiempo constante
  const expected = Buffer.from(expectedChecksum, "hex");
  const received = Buffer.from(String(body.signature.checksum), "hex");
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
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
    // Validar que lo pagado corresponde al precio del plan (evita activar un plan
    // con un pago menor). Se responde 200 porque reintentar no cambiaría el resultado.
    const expectedAmountInCents = WOMPI_PLAN_PRICES_COP[parsed.plan] * 100;
    if (transaction.amount_in_cents !== expectedAmountInCents || transaction.currency !== "COP") {
      console.error(
        "Monto o moneda no coinciden con el plan:",
        transaction.id, parsed.plan, transaction.amount_in_cents, transaction.currency
      );
      return NextResponse.json({ received: true });
    }

    const admin = createAdminClient();

    // Activa el plan en el perfil del usuario
    const { error: profileError } = await admin
      .from("profiles")
      .update({ plan: parsed.plan })
      .eq("id", parsed.profileId);

    // Si falla, respondemos 500 para que Wompi reintente el evento
    if (profileError) {
      console.error("Error actualizando el plan del perfil:", profileError.message);
      return NextResponse.json({ error: "No se pudo activar el plan" }, { status: 500 });
    }

    // Registra la suscripción para historial
    const { error: subError } = await admin.from("subscriptions").insert({
      profile_id: parsed.profileId,
      plan: parsed.plan,
      status: "active",
      payment_provider: "wompi",
      external_id: transaction.id,
    });

    // 23505 = external_id repetido: el evento ya estaba registrado, no es un error
    if (subError && subError.code !== "23505") {
      console.error("Error registrando la suscripción:", subError.message);
      return NextResponse.json({ error: "No se pudo registrar la suscripción" }, { status: 500 });
    }
  }
  // Nota: DECLINED, VOIDED o ERROR no requieren acción — el usuario
  // simplemente se queda en su plan actual y puede intentar de nuevo.

  return NextResponse.json({ received: true });
}