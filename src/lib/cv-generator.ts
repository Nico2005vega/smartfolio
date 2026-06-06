import type {
  Profile, AcademicRecord, Skill, CVConfiguration,
  CVData, CVSection, RecordType, SkillCategory
} from "@/types";
import { RECORD_TYPE_LABELS, RECORD_TYPE_ICONS } from "@/types";

const SECTION_ORDER: RecordType[] = [
  "degree", "diploma", "certificate", "course",
  "experience", "seminar", "workshop", "act",
];

export function generateCVData(
  profile: Profile,
  records: AcademicRecord[],
  skills: Skill[],
  config: CVConfiguration
): CVData {
  // 1. Filtrar solo registros visibles
  const visibleRecords = records.filter((r) => r.is_visible_in_cv);

  // 2. Agrupar por tipo y ordenar por fecha descendente
  const grouped = SECTION_ORDER.reduce<Record<RecordType, AcademicRecord[]>>(
    (acc, type) => {
      acc[type] = visibleRecords
        .filter((r) => r.record_type === type)
        .sort((a, b) => {
          const da = a.end_date ?? a.start_date;
          const db = b.end_date ?? b.start_date;
          return db.localeCompare(da);
        });
      return acc;
    },
    {} as Record<RecordType, AcademicRecord[]>
  );

  // 3. Construir secciones según sections_config (orden y visibilidad)
  const sections: CVSection[] = SECTION_ORDER
    .filter((type) => {
      const cfg = config.sections_config?.[type];
      return cfg?.visible !== false && grouped[type].length > 0;
    })
    .sort((a, b) => {
      const oa = config.sections_config?.[a]?.order ?? 99;
      const ob = config.sections_config?.[b]?.order ?? 99;
      return oa - ob;
    })
    .map((type) => ({
      type,
      label: RECORD_TYPE_LABELS[type],
      icon:  RECORD_TYPE_ICONS[type],
      records: grouped[type],
    }));

  // 4. Agrupar habilidades por categoría
  const skillsByCategory = skills.reduce<Record<SkillCategory, Skill[]>>(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<SkillCategory, Skill[]>
  );

  return {
    profile,
    sections,
    skills: skillsByCategory,
    config,
    templateKey: config.template?.template_key ?? "modern",
  };
}

export function countRecordsByType(
  records: AcademicRecord[]
): Record<RecordType, number> {
  return records.reduce(
    (acc, r) => ({ ...acc, [r.record_type]: (acc[r.record_type] ?? 0) + 1 }),
    {} as Record<RecordType, number>
  );
}
