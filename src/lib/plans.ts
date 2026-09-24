// ═══════════════════════════════════════════════════════════
// SMARTFOLIO – Lógica centralizada de planes y permisos
// Toda la app consulta este archivo. Si cambian los límites,
// precios o features de cada plan, se edita SOLO aquí (y en
// supabase/migrations/003_limites_por_plan.sql para que la base
// de datos también los conozca).
// ═══════════════════════════════════════════════════════════

import type { UserPlan } from "@/types";

// ── Orden de los planes (de menor a mayor) ──────────────────
export const PLAN_RANK: Record<UserPlan, number> = {
  free: 0,
  basic: 1,
  premium: 2,
  business: 3,
};

/** true si `plan` es igual o superior a `min` (ej: planAtLeast(profile.plan, "premium")) */
export function planAtLeast(plan: UserPlan, min: UserPlan): boolean {
  return PLAN_RANK[plan] >= PLAN_RANK[min];
}

// ── Límites numéricos por plan (null = ilimitado) ───────────
export const LIMITS = {
  academicRecords: { free: 3, basic: null, premium: null, business: null },
  documents: { free: 1, basic: 10, premium: null, business: null },
  skills: { free: 5, basic: null, premium: null, business: null },
} satisfies Record<string, Record<UserPlan, number | null>>;

export type LimitedFeature = keyof typeof LIMITS;

export function getLimit(feature: LimitedFeature, plan: UserPlan): number | null {
  return LIMITS[feature][plan];
}

/** true si el usuario todavía puede agregar uno más (o no hay límite para su plan) */
export function canAddMore(feature: LimitedFeature, plan: UserPlan, currentCount: number): boolean {
  const limit = getLimit(feature, plan);
  return limit === null || currentCount < limit;
}

// ── Features booleanas por plan ─────────────────────────────
export const FEATURES = {
  pdfWithoutWatermark: { free: false, basic: true, premium: true, business: true },
  customSlug: { free: false, basic: true, premium: true, business: true },
  fullCustomization: { free: false, basic: false, premium: true, business: true },
  portfolioAnalytics: { free: false, basic: false, premium: true, business: true },
  jobMatchAI: { free: false, basic: false, premium: true, business: true },
  certificateBadge: { free: false, basic: false, premium: true, business: true },
  multiUserPanel: { free: false, basic: false, premium: false, business: true },
} satisfies Record<string, Record<UserPlan, boolean>>;

export type BooleanFeature = keyof typeof FEATURES;

export function hasFeature(feature: BooleanFeature, plan: UserPlan): boolean {
  return FEATURES[feature][plan];
}

// ── Plantillas de CV disponibles por plan ───────────────────
// Nota: hoy cv_templates solo tiene el campo booleano `is_premium`.
// Esta función centraliza la regla de negocio; si más adelante se
// agrega una columna `min_plan` a cv_templates, solo hay que
// actualizar esta función, no cada componente.
export function canUseTemplate(plan: UserPlan, templateIsPremium: boolean): boolean {
  if (!templateIsPremium) return true;
  return planAtLeast(plan, "premium");
}