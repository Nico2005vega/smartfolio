// src/app/api/colombia/schools/route.ts
// Dataset: ESTABLECIMIENTOS EDUCATIVOS-COLOMBIA (MEN)
// https://www.datos.gov.co/Educaci-n/ESTABLECIMIENTOS-EDUCATIVOS-COLOMBIA/upkm-vdjb

import { NextRequest, NextResponse } from "next/server";

const RESOURCE = "upkm-vdjb";
const BASE_URL = `https://www.datos.gov.co/resource/${RESOURCE}.json`;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dept = (searchParams.get("dept") ?? "").trim();
  const city = (searchParams.get("city") ?? "").trim();
  const q    = (searchParams.get("q")    ?? "").trim();

  if (!city && q.length < 3) {
    return NextResponse.json({ schools: [] });
  }

  try {
    const conditions: string[] = [];

    // Normalizar: el dataset guarda en MAYÚSCULAS sin tildes
    const normalize = (s: string) =>
      s.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/'/g, "''");

    if (dept) {
      conditions.push(`upper(departamento)='${normalize(dept)}'`);
    }
    if (city) {
      conditions.push(`upper(municipio)='${normalize(city)}'`);
    }
    if (q.length >= 3) {
      conditions.push(`upper(nombre_establecimiento) like '%${normalize(q)}%'`);
    }

    const params = new URLSearchParams({
      $limit: "80",
      $order: "nombre_establecimiento",
      $where: conditions.join(" AND "),
    });

    const res = await fetch(`${BASE_URL}?${params}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.error(`[schools] HTTP ${res.status}`);
      return NextResponse.json({ schools: [], error: `HTTP ${res.status}` });
    }

    const raw: Record<string, string>[] = await res.json();

    // El dataset puede tener variaciones en nombres de columnas
    const schools = raw
      .map((item) => ({
        name:       item.nombre_establecimiento ?? item.nombre_ee ?? "",
        city:       item.municipio              ?? item.municipio_nombre ?? "",
        department: item.departamento           ?? item.departamento_nombre ?? "",
        sector:     item.sector                 ?? "",
        type:       "colegio" as const,
      }))
      .filter((s) => s.name.length > 0);

    return NextResponse.json({ schools });
  } catch (err) {
    console.error("[schools]", err);
    return NextResponse.json({ schools: [] });
  }
}