/**
 * generate-schools.mjs
 *
 * Descarga TODOS los colegios de Colombia desde datos.gov.co (MEN)
 * y genera el archivo src/data/colombia-schools.ts
 *
 * USO:
 *   node scripts/generate-schools.mjs
 *
 * Requiere Node.js 18+. Ejecutar una sola vez; luego hacer commit del archivo generado.
 */

import fs from "fs";
import path from "path";

const CANDIDATES = [
  "upkm-vdjb",
  "ji8i-4anb",
  "xf74-24mp",
  "muny-tzeh",
  "9dvd-gfcc",
];

const BASE = "https://www.datos.gov.co/resource";

async function detectResource() {
  for (const rid of CANDIDATES) {
    try {
      const res = await fetch(`${BASE}/${rid}.json?$limit=1`);
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) continue;

      const fields = Object.keys(data[0]);
      console.log(`✅ Resource ${rid} responde. Campos: ${fields.join(", ")}`);

      // ── Detectar nombres de campos (incluye variantes del MEN) ──
      const nameField = fields.find(f =>
        ["nombreestablecimiento", "nombre_establecimiento", "nombre_ee", "nombre"].some(
          k => f === k || f.includes(k)
        )
      );
      const deptField = fields.find(f =>
        ["nombredepartamento", "departamento", "dpto"].some(
          k => f === k || f.startsWith(k)
        )
      );
      const cityField = fields.find(f =>
        ["nombremunicipio", "municipio", "mpio", "ciudad"].some(
          k => f === k || f.startsWith(k)
        )
      );

      if (nameField && deptField && cityField) {
        console.log(`  Nombre: ${nameField} | Depto: ${deptField} | Ciudad: ${cityField}`);
        return { rid, nameField, deptField, cityField };
      }
      console.log(`  ⚠️  No se encontraron los campos esperados.`);
      console.log(`      nameField=${nameField} deptField=${deptField} cityField=${cityField}`);
    } catch (e) {
      console.log(`  ❌ ${rid}: ${e.message}`);
    }
  }
  return null;
}

async function fetchAll(rid, nameField, deptField, cityField) {
  const all = [];
  const limit = 1000;
  let offset = 0;

  while (true) {
    const url = `${BASE}/${rid}.json?$limit=${limit}&$offset=${offset}&$order=${deptField},${cityField},${nameField}`;
    console.log(`  Descargando registros ${offset + 1}–${offset + limit}...`);
    const res = await fetch(url);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    for (const item of batch) {
      const dept = (item[deptField] ?? "").trim();
      const city = (item[cityField] ?? "").trim();
      const name = (item[nameField] ?? "").trim();
      if (dept && city && name) all.push({ dept, city, name });
    }

    if (batch.length < limit) break;
    offset += limit;
    await new Promise(r => setTimeout(r, 200));
  }

  return all;
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/\b(\w)/g, c => c.toUpperCase())
    .replace(/\bDe\b/g, "de")
    .replace(/\bDel\b/g, "del")
    .replace(/\bLa\b/g, "la")
    .replace(/\bLas\b/g, "las")
    .replace(/\bLos\b/g, "los")
    .replace(/\bEl\b/g, "el")
    .replace(/\bY\b/g, "y");
}

async function main() {
  console.log("🔍 Detectando dataset del MEN en datos.gov.co...\n");
  const detected = await detectResource();

  if (!detected) {
    console.error("\n❌ No se encontró ningún resource ID válido.");
    console.error("   Verifica en https://www.datos.gov.co buscar 'establecimientos educativos'");
    process.exit(1);
  }

  const { rid, nameField, deptField, cityField } = detected;

  console.log(`\n📥 Descargando todos los colegios (resource: ${rid})...\n`);
  const raw = await fetchAll(rid, nameField, deptField, cityField);
  console.log(`\n✅ ${raw.length.toLocaleString()} colegios descargados.\n`);

  // Organizar: { "Departamento": { "Ciudad": ["Nombre", ...] } }
  const organized = {};
  for (const { dept, city, name } of raw) {
    const d = toTitleCase(dept);
    const c = toTitleCase(city);
    const n = toTitleCase(name);
    if (!organized[d]) organized[d] = {};
    if (!organized[d][c]) organized[d][c] = [];
    if (!organized[d][c].includes(n)) organized[d][c].push(n);
  }

  // Ordenar alfabéticamente
  const sorted = {};
  for (const dept of Object.keys(organized).sort()) {
    sorted[dept] = {};
    for (const city of Object.keys(organized[dept]).sort()) {
      sorted[dept][city] = organized[dept][city].sort();
    }
  }

  const deptCount   = Object.keys(sorted).length;
  const cityCount   = Object.values(sorted).reduce((a, c) => a + Object.keys(c).length, 0);
  const schoolCount = raw.length;

  const ts = `// ─────────────────────────────────────────────────────────────
//  colombia-schools.ts  —  AUTO-GENERADO
//  ${schoolCount.toLocaleString()} colegios · ${cityCount} ciudades · ${deptCount} departamentos
//  Fuente: MEN / datos.gov.co (resource: ${rid})
//  Regenerar: node scripts/generate-schools.mjs
// ─────────────────────────────────────────────────────────────

export const COLOMBIA_SCHOOLS: Record<string, Record<string, string[]>> = ${JSON.stringify(sorted, null, 2)};

export function getSchools(department: string, city: string): string[] {
  return COLOMBIA_SCHOOLS[department]?.[city] ?? [];
}

export function searchSchools(
  query: string,
  department?: string,
  city?: string,
  limit = 30
): Array<{ name: string; city: string; department: string }> {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
  const q = norm(query.trim());
  const results: Array<{ name: string; city: string; department: string }> = [];
  const depts = department ? [department] : Object.keys(COLOMBIA_SCHOOLS);
  for (const dept of depts) {
    const deptData = COLOMBIA_SCHOOLS[dept];
    if (!deptData) continue;
    const cities = city ? [city] : Object.keys(deptData);
    for (const c of cities) {
      for (const school of (deptData[c] ?? [])) {
        if (!q || norm(school).includes(q)) {
          results.push({ name: school, city: c, department: dept });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}
`;

  const outPath = path.join(process.cwd(), "src", "data", "colombia-schools.ts");
  fs.writeFileSync(outPath, ts, "utf8");

  console.log(`📄 Archivo generado: src/data/colombia-schools.ts`);
  console.log(`   ${schoolCount.toLocaleString()} colegios · ${cityCount} ciudades · ${deptCount} departamentos`);
  console.log(`\n✅ Haz commit del archivo generado:`);
  console.log(`   git add src/data/colombia-schools.ts`);
  console.log(`   git commit -m "feat: todos los colegios de Colombia (MEN)"`);
  console.log(`   git push origin main`);
}

main().catch(err => { console.error(err); process.exit(1); });
