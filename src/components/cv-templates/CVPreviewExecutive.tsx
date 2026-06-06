import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

export default function CVPreviewExecutive({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#374151";

  return (
    <div className="font-sans text-gray-800 text-sm p-10">
      {/* Header minimalista */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase letter-spacing-wide">
          {profile.first_name} {profile.last_name}
        </h1>
        <div className="h-0.5 w-16 my-3" style={{ background: accent }} />
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {profile.city    && <span>{profile.city}, {profile.country}</span>}
          {profile.phone   && <span>·  {profile.phone}</span>}
          {profile.linkedin_url && <span>·  LinkedIn</span>}
          {profile.website_url  && <span>·  Portfolio</span>}
        </div>
        {profile.bio && (
          <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">{profile.bio}</p>
        )}
      </div>

      {/* Secciones */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.type}>
            <h2 className="font-bold text-xs tracking-widest uppercase mb-3"
              style={{ color: accent }}>
              {section.label}
            </h2>
            <div className="space-y-3">
              {section.records.map((r) => (
                <div key={r.id} className="grid grid-cols-[1fr_auto] gap-4">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{r.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.institution}</p>
                    {r.description && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{r.description}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">
                      {r.end_date
                        ? formatDate(r.end_date, "yyyy")
                        : formatDate(r.start_date, "yyyy")}
                    </p>
                    {r.duration_hours && (
                      <p className="text-xs text-gray-400">{r.duration_hours}h</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Habilidades por categoría */}
        {Object.entries(skills).length > 0 && (
          <div>
            <h2 className="font-bold text-xs tracking-widest uppercase mb-3" style={{ color: accent }}>
              Competencias
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
                <div key={cat}>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                  </p>
                  <p className="text-xs text-gray-500">{list.map(s => s.name).join("  ·  ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
