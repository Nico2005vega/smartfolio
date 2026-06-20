// src/app/api/colombia/schools/route.ts
// Retorna colegios del SIMAT (MEN) via datos.gov.co
// Dataset: Establecimientos Educativos vigentes

import { NextRequest, NextResponse } from "next/server";

// Resource ID del dataset SIMAT en datos.gov.co
// Si el endpoint falla, verificar el ID actualizado en:
// https://www.datos.gov.co/Educaci-n/Establecimientos-Educativos/ji8i-4anb
const SIMAT_RESOURCE = "ji8i-4anb";
const SIMAT_URL      = `https://www.datos.gov.co/resource/${SIMAT_RESOURCE}.json`;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dept = searchParams.get("dept") ?? "";
  const city = searchParams.get("city") ?? "";
  const q    = searchParams.get("q")    ?? "";

  // Requiere al menos ciudad o búsqueda para no traer todo el dataset
  if (!city && q.length < 3) {
    return NextResponse.json({ schools: [] });
  }

  try {
    // Construir cláusula WHERE del Socrata API
    const conditions: string[] = [];

    if (dept) {
      conditions.push(
        `upper(departamento_nombre)='${dept.toUpperCase().replace(/'/g, "''")}'`
      );
    }
    if (city) {
      conditions.push(
        `upper(municipio_nombre)='${city.toUpperCase().replace(/'/g, "''")}'`
      );
    }
    if (q.length >= 3) {
      conditions.push(
        `upper(nombre_ee) like '%${q.toUpperCase().replace(/'/g, "''")}%'`
      );
    }

    const params = new URLSearchParams({
      $limit:  "80",
      $order:  "nombre_ee",
      $where:  conditions.join(" AND "),
    });

    const res = await fetch(`${SIMAT_URL}?${params}`, {
      next: { revalidate: 3600 }, // cache 1 h
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) throw new Error(`SIMAT error: ${res.status}`);

    const raw: Record<string, string>[] = await res.json();

    const schools = raw
      .map((item) => ({
        name:       item.nombre_ee        ?? item.nombre_establecimiento ?? "",
        city:       item.municipio_nombre ?? item.municipio              ?? "",
        department: item.departamento_nombre ?? item.departamento        ?? "",
        sector:     item.sector           ?? "",
        type:       "colegio" as const,
      }))
      .filter((s) => s.name.length > 0);

    return NextResponse.json({ schools });
  } catch (err) {
    console.error("[schools API]", err);
    // Si la API falla, retorna lista vacía y el componente usa datos estáticos
    return NextResponse.json({ schools: [] });
  }
}