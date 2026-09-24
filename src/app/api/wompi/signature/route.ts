import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {
  WOMPI_PLAN_PRICES_COP, isPurchasablePlan,
  buildWompiReference, generateWompiIntegritySignature,
} from "@/lib/wompi";

// POST /api/wompi/signature — genera una referencia + firma para pagar un plan.
// El monto y la firma SIEMPRE se calculan aquí (servidor), nunca confiando en
// lo que mande el navegador, para que nadie pueda pagar $100 y quedar en Premium.
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const plan = body?.plan;

  if (!plan || !isPurchasablePlan(plan)) {
    return NextResponse.json({ error: "Plan inválido. Usa 'basic' o 'premium'." }, { status: 400 });
  }

  const currency = "COP";
  const amountInCents = WOMPI_PLAN_PRICES_COP[plan] * 100;
  const reference = buildWompiReference(user.id, plan);
  const signature = generateWompiIntegritySignature(reference, amountInCents, currency);

  return NextResponse.json({
    reference,
    amountInCents,
    currency,
    signature,
    publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
  });
}