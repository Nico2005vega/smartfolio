import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RECORD_TYPE_LABELS, RECORD_TYPE_ICONS } from "@/types";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { MapPin, Phone, Globe, ExternalLink, Link as LinkIcon } from "lucide-react";

interface Props { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("first_name,last_name")
    .eq("username_slug", username).single();
  if (!data) return { title: "Portafolio no encontrado" };
  return {
    title: `${data.first_name} ${data.last_name} | Smartfolio`,
    description: `Portafolio profesional de ${data.first_name} ${data.last_name} — generado con Smartfolio`,
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("username_slug", username)
    .eq("portfolio_public", true).single();
  if (!profile) notFound();

  const [{ data: records }, { data: skills }] = await Promise.all([
    supabase.from("academic_records").select("*")
      .eq("profile_id", profile.id)
      .eq("is_visible_in_cv", true)
      .order("start_date", { ascending: false }),
    supabase.from("skills").select("*").eq("profile_id", profile.id).order("sort_order"),
  ]);

  const byType = (records ?? []).reduce<Record<string, typeof records>>(
    (acc, r) => { acc[r.record_type] = [...(acc[r.record_type] ?? []), r]; return acc; },
    {}
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{background:"#16a34a"}}>
              {profile.photo_url
                ? <img src={profile.photo_url} className="w-full h-full rounded-2xl object-cover" alt="Foto" />
                : `${profile.first_name?.charAt(0)}${profile.last_name?.charAt(0)}`}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-gray-500">
                {profile.city && <span className="flex items-center gap-1"><MapPin size={14}/>{profile.city}, {profile.country}</span>}
                {profile.phone && <span className="flex items-center gap-1"><Phone size={14}/>{profile.phone}</span>}
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                    <LinkIcon size={14}/> LinkedIn
                  </a>
                )}
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" className="flex items-center gap-1.5 text-sm text-gray-600 hover:underline">
                    <LinkIcon size={14}/> GitHub
                  </a>
                )}
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" className="flex items-center gap-1.5 text-sm text-gray-600 hover:underline">
                    <Globe size={14}/> Sitio web
                  </a>
                )}
              </div>
              {profile.bio && <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-xl">{profile.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registros académicos */}
        <div className="lg:col-span-2 space-y-5">
          {Object.keys(byType).length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
              Este portafolio aún no tiene registros académicos publicados.
            </div>
          ) : (
            Object.entries(byType).map(([type, items]) => (
              <div key={type} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <span>{RECORD_TYPE_ICONS[type as keyof typeof RECORD_TYPE_ICONS]}</span>
                  <h2 className="font-semibold text-gray-800 text-sm">
                    {RECORD_TYPE_LABELS[type as keyof typeof RECORD_TYPE_LABELS]}
                  </h2>
                  <span className="ml-auto text-xs text-gray-400">{items?.length}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {items?.map((r) => (
                    <div key={r.id} className="px-5 py-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900">{r.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{r.institution}</p>
                          {r.description && <p className="text-xs text-gray-400 mt-1">{r.description}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">
                            {formatDate(r.start_date,"MMM yyyy")}
                            {r.end_date ? ` — ${formatDate(r.end_date,"MMM yyyy")}` : ""}
                          </p>
                          {r.credential_url && (
                            <a href={r.credential_url} target="_blank"
                              className="text-xs text-blue-600 flex items-center justify-end gap-0.5 mt-1 hover:underline">
                              Verificar <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar: Habilidades + Stats */}
        <div className="space-y-4">
          {skills && skills.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 text-sm mb-3">Habilidades</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s.id} className="text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-50 rounded-2xl border border-green-100 p-5 text-center">
            <p className="text-xs text-green-700 mb-2">Portafolio generado con</p>
            <p className="font-bold text-green-800">Smartfolio</p>
            <p className="text-xs text-green-600 mt-1">BAN 00329 · UTS Bucaramanga</p>
            <a href="/register" className="mt-3 inline-block text-xs text-green-700 underline">
              Crea el tuyo gratis →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
