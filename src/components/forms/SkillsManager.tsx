"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, type SkillFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Code2, Brain, Globe, Wrench } from "lucide-react";
import type { Skill, SkillCategory, SkillLevel } from "@/types";
import { SKILL_CATEGORY_LABELS, SKILL_LEVEL_LABELS } from "@/types";

interface Props { profileId: string; initialSkills: Skill[]; }

const CATEGORIES = Object.entries(SKILL_CATEGORY_LABELS) as [SkillCategory, string][];
const LEVELS     = Object.entries(SKILL_LEVEL_LABELS)    as [SkillLevel,    string][];

const CATEGORY_CONFIG: Record<SkillCategory, {
  bg: string; text: string; border: string; icon: React.ReactNode;
}> = {
  technical: { bg:"#f0fdf4", text:"#166534", border:"#bbf7d0", icon:<Code2  size={13}/> },
  soft:      { bg:"#eff6ff", text:"#1e40af", border:"#bfdbfe", icon:<Brain  size={13}/> },
  language:  { bg:"#fdf4ff", text:"#7e22ce", border:"#e9d5ff", icon:<Globe  size={13}/> },
  tool:      { bg:"#fff7ed", text:"#9a3412", border:"#fed7aa", icon:<Wrench size={13}/> },
};

// Barra de nivel: beginner 25 · intermediate 50 · advanced 75 · expert 100
const LEVEL_PCT: Partial<Record<SkillLevel, number>> = {
  beginner: 25, intermediate: 50, advanced: 75, expert: 100,
};

export default function SkillsManager({ profileId, initialSkills }: Props) {
  const [skills,         setSkills]         = useState<Skill[]>(initialSkills);
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("technical");
  const [adding,         setAdding]         = useState(false);
  const [deletingId,     setDeletingId]     = useState<string | null>(null);
  const supabase = createClient();

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema) as any,
    defaultValues: { category: activeCategory },
  });

  const onSubmit = async (data: SkillFormData) => {
    const payload = {
      profile_id: profileId,
      name:       data.name,
      category:   data.category as SkillCategory,
      level:      (data.level as SkillLevel) ?? null,
      sort_order: skills.filter(s => s.category === data.category).length,
    };
    const { data: created, error } = await supabase
      .from("skills").insert(payload).select().single();
    if (error) { toast.error("Error al guardar la habilidad"); return; }
    setSkills(prev => [...prev, created as Skill]);
    toast.success("Habilidad agregada ✓");
    reset({ category: activeCategory });
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from("skills").delete().eq("id", id);
    setSkills(prev => prev.filter(s => s.id !== id));
    toast.success("Habilidad eliminada");
    setDeletingId(null);
  };

  const filtered = skills.filter(s => s.category === activeCategory);
  const cfg      = CATEGORY_CONFIG[activeCategory];

  return (
    <div className="space-y-5">

      {/* ── Chips de resumen ───────────────────────────────── */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(([cat, label]) => {
            const count = skills.filter(s => s.category === cat).length;
            if (count === 0) return null;
            const c = CATEGORY_CONFIG[cat];
            return (
              <span key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{ background: c.bg, color: c.text, borderColor: c.border }}>
                {c.icon} {label}: {count}
              </span>
            );
          })}
        </div>
      )}

      {/* ── Tabs de categoría ──────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(([cat, label]) => {
          const count    = skills.filter(s => s.category === cat).length;
          const isActive = activeCategory === cat;
          const c        = CATEGORY_CONFIG[cat];
          return (
            <button key={cat}
              onClick={() => { setActiveCategory(cat); setAdding(false); }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm border transition-all"
              style={{
                background:  isActive ? c.bg     : "white",
                color:       isActive ? c.text   : "#6b7280",
                borderColor: isActive ? c.border : "#e5e7eb",
                fontWeight:  isActive ? 600       : 500,
              }}>
              {c.icon}
              {label}
              {count > 0 && (
                <span className="text-xs px-1.5 rounded-full font-semibold"
                  style={{
                    background: isActive ? c.border : "#f3f4f6",
                    color:      isActive ? c.text   : "#9ca3af",
                  }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Grid de habilidades ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filtered.length === 0 && !adding && (
          <div className="sm:col-span-2 text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-2xl mb-2">💡</p>
            <p className="text-sm text-gray-500">Sin habilidades en esta categoría</p>
            <p className="text-xs text-gray-400 mt-1">
              Haz clic en &ldquo;Agregar habilidad&rdquo; para empezar
            </p>
          </div>
        )}

        {filtered.map((skill) => {
          const pct = skill.level ? (LEVEL_PCT[skill.level] ?? 0) : null;
          return (
            <div key={skill.id}
              className="group flex items-start gap-3 p-3.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{skill.name}</p>

                {pct !== null ? (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: cfg.text }}>
                        {SKILL_LEVEL_LABELS[skill.level!]}
                      </span>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: cfg.text, opacity: 0.65 }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">Sin nivel</p>
                )}
              </div>

              <button
                onClick={() => handleDelete(skill.id)}
                disabled={deletingId === skill.id}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 mt-0.5">
                {deletingId === skill.id
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Trash2  size={13} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Formulario para agregar ────────────────────────── */}
      {adding ? (
        <form onSubmit={handleSubmit(onSubmit)}
          className="p-4 rounded-xl border-2 space-y-3"
          style={{ borderColor: cfg.border, background: cfg.bg }}>

          <p className="text-sm font-semibold" style={{ color: cfg.text }}>
            Nueva habilidad
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <input
                {...register("name")}
                placeholder="Ej: Python, Inglés, Figma…"
                autoFocus
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <select
              {...register("category")}
              onChange={(e) => setActiveCategory(e.target.value as SkillCategory)}
              className="px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
              {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>

            <select
              {...register("level")}
              className="px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Sin nivel</option>
              {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60"
              style={{ background: "#16a34a" }}>
              {isSubmitting
                ? <Loader2 size={14} className="animate-spin" />
                : <Plus    size={14} />}
              Agregar
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all">
          <Plus size={16} /> Agregar habilidad
        </button>
      )}

      {skills.length > 0 && (
        <p className="text-xs text-gray-400 text-center pt-2">
          {skills.length} habilidad{skills.length !== 1 ? "es" : ""} en total
          · Aparecen en tu CV y portafolio
        </p>
      )}
    </div>
  );
}