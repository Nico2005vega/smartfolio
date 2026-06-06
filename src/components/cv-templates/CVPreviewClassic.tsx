import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

export default function CVPreviewClassic({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#16a34a";
  const allSkills = Object.values(skills).flat();

  return (
    <div className="font-sans text-gray-800 text-sm p-8">
      {/* Header */}
      <div className="text-center border-b-2 pb-5 mb-6" style={{borderColor:accent}}>
        <h1 className="text-2xl font-bold text-gray-900">
          {profile.first_name} {profile.last_name}
        </h1>
        <div className="flex items-center justify-center gap-4 mt-2 flex-wrap text-xs text-gray-500">
          {profile.city && <span>📍 {profile.city}</span>}
          {profile.phone && <span>📱 {profile.phone}</span>}
          {profile.linkedin_url && <span>🔗 LinkedIn</span>}
          {profile.website_url && <span>🌐 Portafolio</span>}
        </div>
        {profile.bio && <p className="text-gray-600 text-xs mt-3 max-w-xl mx-auto leading-relaxed">{profile.bio}</p>}
      </div>

      {/* Secciones */}
      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.type}>
            <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{color:accent,borderColor:accent+"55"}}>
              {section.icon} {section.label}
            </h2>
            <div className="space-y-2">
              {section.records.map((r) => (
                <div key={r.id} className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs">{r.title}</p>
                    <p className="text-[11px] text-gray-500">{r.institution}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-gray-400">
                      {formatDate(r.start_date,"MMM yyyy")}
                      {r.end_date ? ` — ${formatDate(r.end_date,"MMM yyyy")}` : ""}
                    </p>
                    {r.duration_hours && <p className="text-[10px] text-gray-400">{r.duration_hours}h</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Habilidades */}
        {allSkills.length > 0 && (
          <div>
            <h2 className="font-bold text-xs uppercase tracking-widest mb-2 pb-1 border-b" style={{color:accent,borderColor:accent+"55"}}>
              🏷️ Habilidades
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.map((s) => (
                <span key={s.id} className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
