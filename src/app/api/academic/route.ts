import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/academic — listar todos los registros del usuario autenticado
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("academic_records")
    .select("*, document:documents(id,file_name,public_url)")
    .eq("profile_id", user.id)
    .order("start_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/academic — crear nuevo registro
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("academic_records")
    .insert({ ...body, profile_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
