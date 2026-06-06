import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────
export const registerSchema = z.object({
  fullName:  z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email:     z.string().email("Correo electrónico inválido"),
  password:  z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email:    z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

// ── Perfil ────────────────────────────────────────────────
export const profileSchema = z.object({
  first_name:   z.string().min(1, "El nombre es requerido"),
  last_name:    z.string().min(1, "El apellido es requerido"),
  phone:        z.string().optional(),
  city:         z.string().optional(),
  country:      z.string().optional(),
  bio:          z.string().max(500, "Máximo 500 caracteres").optional(),
  linkedin_url: z.string().url("URL inválida").optional().or(z.literal("")),
  github_url:   z.string().url("URL inválida").optional().or(z.literal("")),
  website_url:  z.string().url("URL inválida").optional().or(z.literal("")),
});

// ── Registro Académico ────────────────────────────────────
export const academicRecordSchema = z.object({
  record_type:      z.enum(["certificate","course","diploma","degree","act","seminar","workshop","experience"]),
  title:            z.string().min(2, "El título es requerido"),
  institution:      z.string().min(2, "La institución es requerida"),
  description:      z.string().optional(),
  start_date:       z.string().min(1, "La fecha de inicio es requerida"),
  end_date:         z.string().optional(),
  duration_hours:   z.number().int().positive().optional().nullable(),
  credential_id:    z.string().optional(),
  credential_url:   z.string().url("URL inválida").optional().or(z.literal("")),
  is_visible_in_cv: z.boolean().default(true),
});

// ── Habilidad ─────────────────────────────────────────────
export const skillSchema = z.object({
  name:     z.string().min(1, "El nombre es requerido"),
  category: z.enum(["technical","soft","language","tool"]),
  level:    z.enum(["basic","intermediate","advanced","expert"]).optional(),
});

export type RegisterFormData  = z.infer<typeof registerSchema>;
export type LoginFormData      = z.infer<typeof loginSchema>;
export type ProfileFormData    = z.infer<typeof profileSchema>;
export type AcademicFormData   = z.infer<typeof academicRecordSchema>;
export type SkillFormData      = z.infer<typeof skillSchema>;
