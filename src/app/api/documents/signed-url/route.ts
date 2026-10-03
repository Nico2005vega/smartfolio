import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const SIGNED_URL_SECONDS = 120; // 2 minutos — corto a propósito, ver informe

// POST /api/documents/signed-url — { storagePath, download?: boolean, fileName?: string }
// El bucket "academic-documents" es privado (correctamente, para no exponer
// certificados y diplomas por enlace público). Esta ruta genera un enlace
// temporal firmado en su lugar. Se usa el cliente normal (con la sesión del
// usuario), no el administrador: la política RLS "storage_academic_own" ya
// restringe a cada usuario a su propia carpeta, así que si alguien intenta
// pedir el archivo de otra persona, Supabase lo rechaza solo.
export async function POST(req: Request) {
  const { storagePath, download, fileName } = await req.json();
  if (!storagePath || typeof storagePath !== "string") {
    return NextResponse.json({ error: "Falta la ruta del archivo" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.storage
    .from("academic-documents")
    .createSignedUrl(storagePath, SIGNED_URL_SECONDS, download ? { download: fileName ?? true } : undefined);

  if (error) {
    console.error("Error generando enlace firmado:", error.message);
    return NextResponse.json({ error: "No se pudo generar el enlace al archivo" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}