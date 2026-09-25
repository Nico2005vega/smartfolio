// ═══════════════════════════════════════════════════════════
// SMARTFOLIO – Integración con Claude (Anthropic) para el
// match laboral con IA (feature Premium/Business).
// ═══════════════════════════════════════════════════════════

interface ProfileForAnalysis {
  bio: string | null;
  city: string | null;
  records: { title: string; institution: string; record_type: string }[];
  skills: string[];
}

export interface ProfileAnalysisResult {
  suggested_role: string;
  seniority: "junior" | "mid" | "senior";
  keywords: string[];
  industry: string;
}

const MODEL = "claude-haiku-4-5-20251001"; // económico y rápido, suficiente para esta tarea

export async function analyzeProfileWithClaude(profile: ProfileForAnalysis): Promise<ProfileAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Falta configurar ANTHROPIC_API_KEY en las variables de entorno");
  }

  const recordsText = profile.records.length
    ? profile.records.map(r => `- ${r.title} (${r.record_type}) en ${r.institution}`).join("\n")
    : "Sin registros académicos todavía.";

  const skillsText = profile.skills.length ? profile.skills.join(", ") : "Sin habilidades registradas.";

  const prompt = `Eres un experto en reclutamiento en Colombia. Analiza este perfil profesional y responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin explicación, sin bloque de código markdown. El JSON debe tener EXACTAMENTE esta forma:
{"suggested_role": "string", "seniority": "junior" o "mid" o "senior", "keywords": ["palabra1", "palabra2", "palabra3"], "industry": "string"}

Perfil a analizar:
Ciudad: ${profile.city ?? "No especificada"}
Biografía: ${profile.bio ?? "No especificada"}
Formación y experiencia:
${recordsText}
Habilidades: ${skillsText}

Instrucciones:
- "suggested_role" debe ser un cargo real y específico que esta persona podría buscar en Colombia (ej: "Desarrollador Backend Junior", "Auxiliar Contable"), no algo genérico como "Profesional".
- "seniority" se basa en la cantidad y profundidad de la formación/experiencia registrada.
- "keywords" son 3 a 5 palabras clave técnicas o de habilidades, en español, útiles para buscar en portales de empleo (ej: ["Python", "APIs REST", "PostgreSQL"]).
- "industry" es el sector o industria más relevante (ej: "Tecnología", "Contabilidad y Finanzas").
- Si el perfil tiene muy poca información, igual responde con tu mejor estimación razonable basada en lo poco disponible.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Error de la API de Claude (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const rawText: string = data?.content?.[0]?.text ?? "";
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("La IA no devolvió un JSON válido");
  }

  const p = parsed as Record<string, unknown>;
  const seniority = p.seniority === "senior" || p.seniority === "mid" ? p.seniority : "junior";

  return {
    suggested_role: typeof p.suggested_role === "string" ? p.suggested_role : "Profesional",
    seniority,
    keywords: Array.isArray(p.keywords) ? p.keywords.map(String).slice(0, 5) : [],
    industry: typeof p.industry === "string" ? p.industry : "General",
  };
}