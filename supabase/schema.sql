-- ═══════════════════════════════════════════════════════════════
-- SMARTFOLIO – Esquema de Base de Datos PostgreSQL (Supabase)
-- Proyecto: BAN 00329 · UTS Bucaramanga
-- Autores: Nicolás Vega Ruiz · Juan Carlos Rúgeles Navarro
-- ═══════════════════════════════════════════════════════════════

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUM TYPES ────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE user_plan AS ENUM ('free', 'premium');
CREATE TYPE record_type AS ENUM (
  'certificate', 'course', 'diploma', 'degree',
  'act', 'seminar', 'workshop', 'experience'
);
CREATE TYPE file_type AS ENUM ('pdf', 'image');
CREATE TYPE skill_category AS ENUM ('technical', 'soft', 'language', 'tool');
CREATE TYPE skill_level AS ENUM ('basic', 'intermediate', 'advanced', 'expert');

-- ── TABLA: profiles ───────────────────────────────────────────
-- (se crea sobre auth.users de Supabase)
CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name        VARCHAR(100)  NOT NULL DEFAULT '',
  last_name         VARCHAR(100)  NOT NULL DEFAULT '',
  username_slug     VARCHAR(80)   UNIQUE,
  phone             VARCHAR(30),
  city              VARCHAR(100),
  country           VARCHAR(100)  DEFAULT 'Colombia',
  bio               TEXT,
  photo_url         TEXT,
  linkedin_url      TEXT,
  github_url        TEXT,
  website_url       TEXT,
  role              user_role     NOT NULL DEFAULT 'student',
  plan              user_plan     NOT NULL DEFAULT 'free',
  portfolio_public  BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── TABLA: documents ─────────────────────────────────────────
CREATE TABLE documents (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name        VARCHAR(300) NOT NULL,
  storage_path     TEXT        NOT NULL,
  public_url       TEXT        NOT NULL,
  file_type        file_type   NOT NULL DEFAULT 'pdf',
  mime_type        VARCHAR(100) NOT NULL,
  file_size_bytes  BIGINT      NOT NULL DEFAULT 0,
  uploaded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_documents_profile ON documents(profile_id);

-- ── TABLA: academic_records ───────────────────────────────────
CREATE TABLE academic_records (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  record_type      record_type NOT NULL,
  title            VARCHAR(300) NOT NULL,
  institution      VARCHAR(300) NOT NULL,
  description      TEXT,
  start_date       DATE        NOT NULL,
  end_date         DATE,
  duration_hours   INTEGER,
  credential_id    VARCHAR(200),
  credential_url   TEXT,
  document_id      UUID        REFERENCES documents(id) ON DELETE SET NULL,
  is_visible_in_cv BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order       INTEGER     NOT NULL DEFAULT 0,
  metadata         JSONB       NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_academic_profile ON academic_records(profile_id);
CREATE INDEX idx_academic_type    ON academic_records(profile_id, record_type);

-- ── TABLA: skills ─────────────────────────────────────────────
CREATE TABLE skills (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID           NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        VARCHAR(150)   NOT NULL,
  category    skill_category NOT NULL DEFAULT 'technical',
  level       skill_level,
  sort_order  SMALLINT       NOT NULL DEFAULT 0
);
CREATE INDEX idx_skills_profile ON skills(profile_id);

-- ── TABLA: cv_templates ───────────────────────────────────────
CREATE TABLE cv_templates (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(100) NOT NULL,
  description  TEXT,
  template_key VARCHAR(50)  UNIQUE NOT NULL,
  preview_url  TEXT,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  is_premium   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar las 3 plantillas del MVP
INSERT INTO cv_templates (name, description, template_key, is_active, is_premium) VALUES
  ('Moderna', 'Diseño contemporáneo con sidebar y acento de color. Ideal para perfiles tecnológicos.', 'modern', TRUE, FALSE),
  ('Clásica', 'Formato tradicional de una columna. Perfecto para áreas administrativas y educación.', 'classic', TRUE, FALSE),
  ('Ejecutiva', 'Minimalista y elegante. Enfocada en logros y competencias clave.', 'executive', TRUE, FALSE);

-- ── TABLA: cv_configurations ──────────────────────────────────
CREATE TABLE cv_configurations (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id        UUID        UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id       UUID        REFERENCES cv_templates(id) ON DELETE SET NULL,
  accent_color      VARCHAR(7)  NOT NULL DEFAULT '#16a34a',
  sections_config   JSONB       NOT NULL DEFAULT '{"degree":{"visible":true,"order":1},"certificate":{"visible":true,"order":2},"course":{"visible":true,"order":3},"diploma":{"visible":true,"order":4},"experience":{"visible":true,"order":5},"seminar":{"visible":true,"order":6},"workshop":{"visible":true,"order":7},"act":{"visible":true,"order":8}}',
  last_generated_at TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TABLA: audit_logs ────────────────────────────────────────
CREATE TABLE audit_logs (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id   UUID,
  metadata    JSONB       NOT NULL DEFAULT '{}',
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

-- ═══════════════════════════════════════════════════════════════
-- FUNCIONES Y TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Función: updated_at automático
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_academic_updated_at
  BEFORE UPDATE ON academic_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_cv_config_updated_at
  BEFORE UPDATE ON cv_configurations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Función: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter    INTEGER := 0;
BEGIN
  base_slug := lower(regexp_replace(
    split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1) || '-' ||
    split_part(NEW.raw_user_meta_data->>'full_name', ' ', 2),
    '[^a-z0-9-]', '', 'g'
  ));
  IF base_slug = '-' OR base_slug = '' THEN
    base_slug := 'usuario';
  END IF;
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username_slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  INSERT INTO profiles (id, first_name, last_name, username_slug)
  VALUES (
    NEW.id,
    COALESCE(split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1), ''),
    COALESCE(split_part(NEW.raw_user_meta_data->>'full_name', ' ', 2), ''),
    final_slug
  );
  INSERT INTO cv_configurations (profile_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_configurations ENABLE ROW LEVEL SECURITY;

-- profiles: el usuario solo ve y edita el propio
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);

-- documents: CRUD del propio
CREATE POLICY "documents_own" ON documents
  FOR ALL USING (auth.uid() = profile_id);

-- academic_records: CRUD del propio
CREATE POLICY "academic_own" ON academic_records
  FOR ALL USING (auth.uid() = profile_id);

-- skills: CRUD del propio
CREATE POLICY "skills_own" ON skills
  FOR ALL USING (auth.uid() = profile_id);

-- cv_configurations: CRUD del propio
CREATE POLICY "cv_config_own" ON cv_configurations
  FOR ALL USING (auth.uid() = profile_id);

-- cv_templates: lectura pública
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "templates_public_read" ON cv_templates
  FOR SELECT USING (TRUE);

-- Portafolio público: perfiles con portfolio_public=true son legibles sin auth
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (portfolio_public = TRUE OR auth.uid() = id);

CREATE POLICY "academic_public_read" ON academic_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = academic_records.profile_id
        AND profiles.portfolio_public = TRUE
    ) OR auth.uid() = profile_id
  );

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('academic-documents', 'academic-documents', FALSE, 10485760,
   ARRAY['application/pdf','image/jpeg','image/png','image/webp']),
  ('avatars', 'avatars', TRUE, 2097152,
   ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT DO NOTHING;

-- Políticas Storage: academic-documents
CREATE POLICY "storage_academic_own"
  ON storage.objects FOR ALL
  USING (bucket_id = 'academic-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas Storage: avatars (públicos)
CREATE POLICY "storage_avatars_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "storage_avatars_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "storage_avatars_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
