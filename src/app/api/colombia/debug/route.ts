// src/app/api/colombia/debug/route.ts
// SOLO PARA DIAGNOSTICAR — borra este archivo después de solucionar el problema

import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Test 1: Ver los primeros 2 registros del dataset
  try {
    const r1 = await fetch(
      "https://www.datos.gov.co/resource/upkm-vdjb.json?$limit=2",
      { headers: { Accept: "application/json" } }
    );
    const data1 = await r1.json();
    results.sample = data1;
    results.fields = data1.length > 0 ? Object.keys(data1[0]) : [];
    results.status = r1.status;
  } catch (e) {
    results.error_sample = String(e);
  }

  // Test 2: Buscar con departamento SANTANDER
  try {
    const r2 = await fetch(
      "https://www.datos.gov.co/resource/upkm-vdjb.json?$limit=3&$where=upper(departamento)='SANTANDER'",
      { headers: { Accept: "application/json" } }
    );
    results.santander = await r2.json();
  } catch (e) {
    results.error_santander = String(e);
  }

  // Test 3: Buscar Floridablanca
  try {
    const r3 = await fetch(
      "https://www.datos.gov.co/resource/upkm-vdjb.json?$limit=3&$where=upper(municipio)='FLORIDABLANCA'",
      { headers: { Accept: "application/json" } }
    );
    results.floridablanca = await r3.json();
  } catch (e) {
    results.error_floridablanca = String(e);
  }

  return NextResponse.json(results, { status: 200 });
}