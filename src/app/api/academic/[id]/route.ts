import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface Props { params: Promise<{ id: string }> }

// GET /api/academic/:id
export async function GET(_: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("academic_records")
    .select("*, document:documents(*)")
    .eq("id", id).eq("profile_id", user.id).single();

  if (error || !data) return NextResponse.json({ error:"Not found" }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH /api/academic/:id
export async function PATCH(req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("academic_records")
    .update(body)
    .eq("id", id).eq("profile_id", user.id)
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/academic/:id
export async function DELETE(_: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("academic_records")
    .delete()
    .eq("id", id).eq("profile_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
