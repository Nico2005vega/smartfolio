// ═══════════════════════════════════════════════════════════
// SMARTFOLIO – Tipos TypeScript
// Proyecto BAN 00329 · UTS Bucaramanga
// ═══════════════════════════════════════════════════════════

export type UserRole = "student" | "admin";
export type UserPlan = "free" | "basic" | "premium" | "business";
export type FileType = "pdf" | "image";

// ── Planes de pago ──────────────────────────────────────────
export const PLAN_LABELS: Record<UserPlan, string> = {
  free:     "Gratuito",
  basic:    "Basic",
  premium:  "⭐ Premium",
  business: "🏢 Business",
};

export const PLAN_BADGE_CLASSES: Record<UserPlan, string> = {
  free:     "bg-gray-100 text-gray-600",
  basic:    "bg-blue-100 text-blue-700",
  premium:  "bg-purple-100 text-purple-700",
  business: "bg-amber-100 text-amber-700",
};
export type SkillCategory = "technical" | "soft" | "language" | "tool";
export type SkillLevel = "basic" | "intermediate" | "advanced" | "expert";

export type RecordType =
  | "certificate"
  | "course"
  | "diploma"
  | "degree"
  | "act"
  | "seminar"
  | "workshop"
  | "experience";

// ── Labels en español ─────────────────────────────────────
export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  certificate: "Certificado",
  course:      "Curso",
  diploma:     "Diplomado",
  degree:      "Título Académico",
  act:         "Acta / Reconocimiento",
  seminar:     "Seminario",
  workshop:    "Taller",
  experience:  "Experiencia Académica",
};

export const RECORD_TYPE_ICONS: Record<RecordType, string> = {
  certificate: "📜",
  course:      "📚",
  diploma:     "🏛️",
  degree:      "🎓",
  act:         "📋",
  seminar:     "🗣️",
  workshop:    "🔧",
  experience:  "💼",
};

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  basic:        "Básico",
  intermediate: "Intermedio",
  advanced:     "Avanzado",
  expert:       "Experto",
};

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  technical: "Habilidad Técnica",
  soft:      "Habilidad Blanda",
  language:  "Idioma",
  tool:      "Herramienta",
};

// ── Entidades ─────────────────────────────────────────────
export interface Profile {
  id:               string;
  first_name:       string;
  last_name:        string;
  username_slug:    string | null;
  phone:            string | null;
  city:             string | null;
  country:          string | null;
  bio:              string | null;
  photo_url:        string | null;
  linkedin_url:     string | null;
  github_url:       string | null;
  website_url:      string | null;
  role:             UserRole;
  plan:             UserPlan;
  portfolio_public: boolean;
  created_at:       string;
  updated_at:       string;
  visit_count: number | null;
  
}

export interface Document {
  id:              string;
  profile_id:      string;
  file_name:       string;
  storage_path:    string;
  public_url:      string;
  file_type:       FileType;
  mime_type:       string;
  file_size_bytes: number;
  uploaded_at:     string;
}

export interface AcademicRecord {
  id:               string;
  profile_id:       string;
  record_type:      RecordType;
  title:            string;
  institution:      string;
  description:      string | null;
  start_date:       string;
  end_date:         string | null;
  duration_hours:   number | null;
  credential_id:    string | null;
  credential_url:   string | null;
  document_id:      string | null;
  is_visible_in_cv: boolean;
  sort_order:       number;
  metadata:         Record<string, unknown>;
  created_at:       string;
  updated_at:       string;
  document?:        Document | null;
}

export interface Skill {
  id:         string;
  profile_id: string;
  name:       string;
  category:   SkillCategory;
  level:      SkillLevel | null;
  sort_order: number;
}

export interface CVTemplate {
  id:           string;
  name:         string;
  description:  string | null;
  template_key: string;
  preview_url:  string | null;
  is_active:    boolean;
  is_premium:   boolean;
}

export interface SectionConfig {
  visible: boolean;
  order:   number;
}

export interface CVConfiguration {
  id:                string;
  profile_id:        string;
  template_id:       string | null;
  accent_color:      string;
  sections_config:   Record<RecordType, SectionConfig>;
  last_generated_at: string | null;
  updated_at:        string;
  template?:         CVTemplate | null;
}

// ── CV Data (para generación del PDF) ─────────────────────
export interface CVSection {
  type:    RecordType;
  label:   string;
  icon:    string;
  records: AcademicRecord[];
}

export interface CVData {
  profile:     Profile;
  sections:    CVSection[];
  skills:      Record<SkillCategory, Skill[]>;
  config:      CVConfiguration;
  templateKey: string;
}

// ── Planes de pago: suscripciones y match laboral con IA ───
export interface Subscription {
  id:               string;
  profile_id:       string;
  plan:             UserPlan;
  status:           "active" | "past_due" | "canceled";
  payment_provider: string | null;
  external_id:      string | null;
  started_at:       string;
  renews_at:        string | null;
  canceled_at:      string | null;
  created_at:       string;
  updated_at:       string;
}

export interface CareerInsight {
  id:              string;
  profile_id:      string;
  suggested_role:  string | null;
  seniority:       string | null;
  keywords:        string[];
  industry:        string | null;
  generated_at:    string;
}

export interface JobPosting {
  id:         string;
  title:      string;
  company:    string | null;
  city:       string | null;
  keywords:   string[];
  seniority:  string | null;
  apply_url:  string;
  source:     "manual" | "aggregator";
  is_active:  boolean;
  created_at: string;
}

// ── Estadísticas del Dashboard ─────────────────────────────
export interface DashboardStats {
  totalRecords:   number;
  totalDocuments: number;
  byType:         Record<RecordType, number>;
  lastActivity:   string | null;
}

// ── Database types para Supabase ──────────────────────────
export interface Database {
  public: {
    Tables: {
      profiles:          { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      documents:         { Row: Document; Insert: Partial<Document>; Update: Partial<Document> };
      academic_records:  { Row: AcademicRecord; Insert: Partial<AcademicRecord>; Update: Partial<AcademicRecord> };
      skills:            { Row: Skill; Insert: Partial<Skill>; Update: Partial<Skill> };
      cv_templates:      { Row: CVTemplate; Insert: Partial<CVTemplate>; Update: Partial<CVTemplate> };
      cv_configurations: { Row: CVConfiguration; Insert: Partial<CVConfiguration>; Update: Partial<CVConfiguration> };
      subscriptions:     { Row: Subscription; Insert: Partial<Subscription>; Update: Partial<Subscription> };
      career_insights:   { Row: CareerInsight; Insert: Partial<CareerInsight>; Update: Partial<CareerInsight> };
      job_postings:      { Row: JobPosting; Insert: Partial<JobPosting>; Update: Partial<JobPosting> };
    };
  };
}