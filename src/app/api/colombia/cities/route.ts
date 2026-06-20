// src/app/api/colombia/cities/route.ts
// Retorna todas las ciudades de un departamento usando api-colombia.com

import { NextRequest, NextResponse } from "next/server";

// ID de cada departamento en api-colombia.com
const DEPT_IDS: Record<string, number> = {
  "Amazonas":                 1,
  "Antioquia":                2,
  "Arauca":                   3,
  "Atlántico":                4,
  "Bolívar":                  5,
  "Boyacá":                   6,
  "Caldas":                   7,
  "Caquetá":                  8,
  "Casanare":                 9,
  "Cauca":                   10,
  "Cesar":                   11,
  "Chocó":                   12,
  "Córdoba":                 13,
  "Cundinamarca":            14,
  "Guainía":                 15,
  "Guaviare":                16,
  "Huila":                   17,
  "La Guajira":              18,
  "Magdalena":               19,
  "Meta":                    20,
  "Nariño":                  21,
  "Norte de Santander":      22,
  "Putumayo":                23,
  "Quindío":                 24,
  "Risaralda":               25,
  "San Andrés y Providencia":26,
  "Santander":               27,
  "Sucre":                   28,
  "Tolima":                  29,
  "Valle del Cauca":         30,
  "Vaupés":                  31,
  "Vichada":                 32,
  "Bogotá D.C.":             33,
};

export async function GET(request: NextRequest) {
  const dept   = request.nextUrl.searchParams.get("dept") ?? "";
  const deptId = DEPT_IDS[dept];

  if (!deptId) {
    return NextResponse.json({ cities: [] });
  }

  try {
    const res = await fetch(
      `https://api-colombia.com/api/v1/Department/${deptId}/cities`,
      {
        next: { revalidate: 86400 }, // cache 24 h
        headers: { "Accept": "application/json" },
      }
    );

    if (!res.ok) throw new Error(`api-colombia error: ${res.status}`);

    const data: { name: string }[] = await res.json();
    const cities = data.map((c) => c.name).sort();

    return NextResponse.json({ cities });
  } catch (err) {
    console.error("[cities API]", err);
    return NextResponse.json({ cities: [] });
  }
}