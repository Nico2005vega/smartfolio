import crypto from "crypto";

// ── Precios de los planes que se pueden comprar directo (en pesos, no centavos) ──
// Business no está aquí porque se vende por contacto directo (mailto), no por Wompi.
export const WOMPI_PLAN_PRICES_COP: Record<"basic" | "premium", number> = {
  basic: 19900,
  premium: 44900,
};

export type PurchasablePlan = keyof typeof WOMPI_PLAN_PRICES_COP;

export function isPurchasablePlan(plan: string): plan is PurchasablePlan {
  return plan === "basic" || plan === "premium";
}

// ── Referencia de pago ───────────────────────────────────────
// Codificamos profile_id + plan directo en la referencia (separados por "_",
// que un UUID nunca contiene) para no necesitar una tabla de "pagos pendientes":
// el webhook puede leer directo de aquí a quién y qué plan darle.
export function buildWompiReference(profileId: string, plan: PurchasablePlan): string {
  return `SF_${profileId}_${plan}_${Date.now()}`;
}

export function parseWompiReference(reference: string): { profileId: string; plan: string } | null {
  const parts = reference.split("_");
  if (parts.length < 4 || parts[0] !== "SF") return null;
  const [, profileId, plan] = parts;
  return { profileId, plan };
}

// ── Firma de integridad (Wompi Widget/Web Checkout) ─────────
// SHA256(referencia + monto_en_centavos + moneda + secreto_de_integridad)
// Debe calcularse siempre en el servidor: el secreto nunca debe llegar al navegador.
export function generateWompiIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string
): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) throw new Error("Falta configurar WOMPI_INTEGRITY_SECRET en las variables de entorno");
  const raw = `${reference}${amountInCents}${currency}${secret}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}