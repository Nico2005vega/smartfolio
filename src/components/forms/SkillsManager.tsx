"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, type SkillFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Skill, SkillCategory, SkillLevel } from "@/types";
import { SKILL_CATEGORY_LABELS, SKILL_LEVEL_LABELS } from "@/types";

interface Props { profileId: string; initialSkills: Skill[]; }

const CATEGORIES = Object.entries(SKILL_CATEGORY_LABELS) as [SkillCategory, string][];
const LEVELS     = Object.entries(SKILL_LEVEL_LABELS) as [SkillLevel, string][];

const CATEGORY_COLORS: Record<SkillCategory, { bg: string; text: string; border: string }> = {
  technical: { bg:"#f0fdf4", text:"#166534", border:"#bbf7d0" },
  soft:      { bg:"#eff6ff", text:"#1e40af", border:"#bfdbfe" },
  language:  { bg:"#fdf4ff", text:"#7e22ce", border:"#e9d5ff" },
  tool:      { bg:"#fff7ed", text:"#9a3412", border:"#fed7aa" },
};

export default function SkillsManager({ profileId, initialSkills }: Props) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("technical");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema) as any,
    defaultValues: { category: "technical" },
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
  const col = CATEGORY_COLORS[activeCategory];

  return (
    <div className="space-y-5">
      {/* Tabs de categoría */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(([cat, label]) => {
          const count = skills.filter(s => s.category === cat).length;
          const isActive = activeCategory === cat;
          const c = CATEGORY_COLORS[cat];
          return (
            <button key={cat}
              onClick={() => { setActiveCategory(cat); setAdding(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
              style={{
                background:   isActive ? c.bg   : "white",
                color:        isActive ? c.text : "#6b7280",
                borderColor:  isActive ? c.border : "#e5e7eb",
              }}>
              {label}
              {count > 0 && (
                <span className="text-xs px-1.5 py-0 rounded-full font-semibold"
                  style={{ background: isActive ? c.border : "#f3f4f6", color: isActive ? c.text : "#9ca3af" }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lista de habilidades */}
      <div className="space-y-2">
        {filtered.length === 0 && !adding && (
          <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
            Sin habilidades en esta categoría. Agrega la primera.
          </div>
        )}
        {filtered.map((skill) => (
          <div key={skill.id}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 group">
            <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-gray-900">{skill.name}</span>
              {skill.level && (
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
                  {SKILL_LEVEL_LABELS[skill.level]}
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(skill.id)}
              disabled={deletingId === skill.id}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50">
              {deletingId === skill.id
                ? <Loader2 size={13} className="animate-spin" />
                : <Trash2 size={13} />}
            </button>
          </div>
        ))}
      </div>

      {/* Formulario para agregar */}
      {adding ? (
        <form onSubmit={handleSubmit(onSubmit)}
          className="p-4 rounded-xl border-2 space-y-3"
          style={{ borderColor: col.border, background: col.bg }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <input {...register("name")} placeholder="Ej: Python, Inglés, Figma…"
                autoFocus
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <select {...register("category")}
              onChange={(e) => setActiveCategory(e.target.value as SkillCategory)}
              className="px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>

            <select {...register("level")}
              className="px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Sin nivel</option>
              {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60"
              style={{ background: "#16a34a" }}>
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Agregar
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => { setAdding(true); }}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all">
          <Plus size={16} /> Agregar habilidad
        </button>
      )}

      {skills.length > 0 && (
        <p className="text-xs text-gray-400 text-center pt-2">
          {skills.length} habilidad{skills.length !== 1 ? "es" : ""} en total · Aparecen en tu CV y portafolio
        </p>
      )}
    </div>
  );
}
