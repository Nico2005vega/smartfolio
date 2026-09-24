import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ⚠️ Este cliente usa la Service Role Key y se salta TODAS las políticas de RLS.
// Úsalo únicamente en código que corre en el servidor (API routes, webhooks) y
// NUNCA lo importes en un componente "use client" ni expongas la key con el
// prefijo NEXT_PUBLIC_.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno");
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}