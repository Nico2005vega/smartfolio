// ═══════════════════════════════════════════════════════════
// SMARTFOLIO – Enlaces de búsqueda de empleo (Capa 1 del match
// laboral). Solo construye URLs de búsqueda públicas — no hace
// scraping ni llama APIs de terceros, así que es 100% legal y
// no depende de convenios ni credenciales externas.
// ═══════════════════════════════════════════════════════════

export interface JobSearchLink {
  name: string;
  url: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function buildJobSearchLinks(keywords: string[], city: string | null): JobSearchLink[] {
  const primaryKeyword = keywords[0] ?? "empleo";
  const query = keywords.slice(0, 3).join(" ") || "empleo";
  const q = encodeURIComponent(query);
  const location = encodeURIComponent(city ?? "Colombia");

  return [
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${location}`,
    },
    {
      name: "Computrabajo",
      url: `https://co.computrabajo.com/trabajo-de-${slugify(primaryKeyword)}`,
    },
    {
      name: "ElEmpleo",
      url: `https://www.elempleo.com/co/ofertas-empleo/?Search=${q}`,
    },
    {
      name: "Indeed",
      url: `https://co.indeed.com/jobs?q=${q}&l=${location}`,
    },
  ];
}