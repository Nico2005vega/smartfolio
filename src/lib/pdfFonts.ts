import { Font } from "@react-pdf/renderer";

// ═══════════════════════════════════════════════════════════
// SMARTFOLIO – Fuentes reales para los PDF del CV.
//
// Antes, todos los PDF usaban Helvetica/Times/Courier sin importar
// qué fuente eligiera el usuario en el CV Builder — por eso el PDF
// nunca se veía igual a la vista previa. Esto registra las 14
// fuentes de Google que ya se usan en el Builder, servidas desde
// /public/fonts, para que el PDF use la fuente EXACTA elegida.
//
// Nota técnica: react-pdf 4.5.1 solo procesa de forma confiable el
// formato WOFF (no WOFF2, no TTF) para el subsetting de glifos —
// por eso los archivos en /public/fonts están en .woff.
//
// Cada peso (normal/negrita) se registra como una familia INDEPEN-
// DIENTE (ej. "Poppins" y "Poppins-Bold"), igual al patrón que ya
// usan los documentos con las fuentes estándar ("Helvetica" /
// "Helvetica-Bold"), así no hay que tocar los estilos existentes.
// ═══════════════════════════════════════════════════════════

const GOOGLE_FONTS = [
  "Inter", "Poppins", "Montserrat", "Raleway", "Nunito", "Lato", "Roboto",
  "OpenSans", "PlayfairDisplay", "Merriweather", "Lora", "EBGaramond",
  "JetBrainsMono", "FiraCode",
] as const;

let registered = false;

/** Llamar una vez antes de generar cualquier PDF (idempotente). */
export function registerPdfFonts(): void {
  if (registered) return;
  registered = true;
  for (const family of GOOGLE_FONTS) {
    Font.register({ family, src: `/fonts/${family}-Regular.woff` });
    Font.register({ family: `${family}-Bold`, src: `/fonts/${family}-Bold.woff` });
  }
}

// Traduce el nombre de la primera fuente en el "font_name" guardado
// (ej: "'Open Sans',system-ui,sans-serif" → "Open Sans") a la familia
// registrada arriba.
const FONT_NAME_MAP: Record<string, string> = {
  "Inter": "Inter",
  "Poppins": "Poppins",
  "Montserrat": "Montserrat",
  "Raleway": "Raleway",
  "Nunito": "Nunito",
  "Lato": "Lato",
  "Roboto": "Roboto",
  "Open Sans": "OpenSans",
  "Playfair Display": "PlayfairDisplay",
  "Merriweather": "Merriweather",
  "Lora": "Lora",
  "EB Garamond": "EBGaramond",
  "JetBrains Mono": "JetBrainsMono",
  "Fira Code": "FiraCode",
};

export interface ResolvedPdfFont { regular: string; bold: string; }

const DEFAULT_FALLBACK: ResolvedPdfFont = { regular: "Helvetica", bold: "Helvetica-Bold" };

/**
 * Dado el font_name guardado en CVStyleConfig, devuelve los nombres
 * de familia (normal y negrita) a usar en los estilos del PDF.
 * Si la fuente no tiene Google Font asociada (Georgia, Courier New)
 * o no hay ninguna guardada, cae al `fallback` — que por defecto es
 * Helvetica, pero cada plantilla puede pasar el suyo propio (ej.
 * Minimal usa Times-Roman como su estilo distintivo por defecto).
 */
export function resolvePdfFont(
  fontName: string | null | undefined,
  fallback: ResolvedPdfFont = DEFAULT_FALLBACK
): ResolvedPdfFont {
  const first = (fontName ?? "").split(",")[0].replace(/['"]/g, "").trim();

  const family = FONT_NAME_MAP[first];
  if (family) return { regular: family, bold: `${family}-Bold` };

  if (first === "Georgia") return { regular: "Times-Roman", bold: "Times-Bold" };
  if (first === "'Courier New'" || first === "Courier New") return { regular: "Courier", bold: "Courier-Bold" };

  return fallback;
}