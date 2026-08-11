"use client";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { academicRecordSchema, type AcademicFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { RECORD_TYPE_LABELS } from "@/types";
import type { AcademicRecord } from "@/types";
import { InstitutionSearch } from "@/components/forms/InstitutionSearch";
import type { Institution } from "@/data/colombia-institutions";

interface Props {
  profileId: string;
  record?: AcademicRecord;
}

const RECORD_TYPES = Object.entries(RECORD_TYPE_LABELS) as [string, string][];

export default function AcademicRecordForm({ profileId, record }: Props) {
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docId, setDocId]       = useState<string | null>(record?.document_id ?? null);
  const [docName, setDocName]   = useState<string | null>(null);
  const router   = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AcademicFormData>({
    resolver: zodResolver(academicRecordSchema) as Resolver<AcademicFormData>,
    defaultValues: record ? {
      record_type:      record.record_type,
      title:            record.title,
      institution:      record.institution,
      description:      record.description ?? "",
      start_date:       record.start_date,
      end_date:         record.end_date ?? "",
      duration_hours:   record.duration_hours ?? undefined,
      credential_id:    record.credential_id ?? "",
      credential_url:   record.credential_url ?? "",
      is_visible_in_cv: record.is_visible_in_cv,
    } : { record_type: "certificate", is_visible_in_cv: true },
  });

  // Cuando el usuario selecciona o escribe una institución
  const handleInstitutionChange = (name: string, _institution?: Institution) => {
    setValue("institution", name, { shouldValidate: true });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("El archivo no puede superar 10 MB"); return; }

    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `${profileId}/${Date.now()}.${ext}`;

    const { data: uploaded, error } = await supabase.storage
      .from("academic-documents")
      .upload(path, file, { upsert: false });

    if (error) { toast.error("Error al subir el archivo"); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from("academic-documents").getPublicUrl(uploaded.path);
    const { data: doc } = await supabase.from("documents").insert({
      profile_id:       profileId,
      file_name:        file.name,
      storage_path:     uploaded.path,
      public_url:       urlData.publicUrl,
      file_type:        file.type.includes("pdf") ? "pdf" : "image",
      mime_type:        file.type,
      file_size_bytes:  file.size,
    }).select().single();

    if (doc) { setDocId(doc.id); setDocName(file.name); toast.success("Documento subido"); }
    setUploading(false);
  };

  const onSubmit = async (data: AcademicFormData) => {
    setLoading(true);
    const payload = {
      profile_id:    profileId,
      ...data,
      end_date:      data.end_date      || null,
      description:   data.description   || null,
      credential_id: data.credential_id || null,
      credential_url:data.credential_url|| null,
      duration_hours:data.duration_hours ?? null,
      document_id:   docId,
    };

    const { error } = record
      ? await supabase.from("academic_records").update(payload).eq("id", record.id)
      : await supabase.from("academic_records").insert(payload);

    if (error) {
      toast.error("Error al guardar el registro");
    } else {
      toast.success(record ? "Registro actualizado ✓" : "Registro guardado ✓");
      router.push("/academic");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

      {/* Tipo de registro */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de registro *</label>
        <select
          {...register("record_type")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {RECORD_TYPES.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        {errors.record_type && <p className="text-red-500 text-xs mt-1">{errors.record_type.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Título */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre / Título *</label>
          <input
            {...register("title")}
            placeholder="Ej: Certificado en Python Avanzado"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* ── Institución con buscador ── */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Institución *</label>
          <InstitutionSearch
            value={watch("institution") ?? ""}
            onChange={handleInstitutionChange}
            error={errors.institution?.message}
          />
        </div>

        {/* Fechas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de inicio *</label>
          <input
            {...register("start_date")}
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de finalización</label>
          <input
            {...register("end_date")}
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Horas y código */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Intensidad horaria</label>
          <input
            {...register("duration_hours", { valueAsNumber: true })}
            type="number"
            placeholder="60"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Código del certificado</label>
          <input
            {...register("credential_id")}
            placeholder="ABC-12345"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* URL de verificación */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL de verificación</label>
        <input
          {...register("credential_url")}
          placeholder="https://verify.example.com/abc"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.credential_url && <p className="text-red-500 text-xs mt-1">{errors.credential_url.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Describe brevemente este logro..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      {/* Documento soporte */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Documento soporte</label>
        {docId && docName ? (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <span className="text-green-700 text-sm font-medium flex-1 truncate">📄 {docName}</span>
            <button type="button" onClick={() => { setDocId(null); setDocName(null); }} className="text-gray-400 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
            {uploading
              ? <Loader2 size={24} className="animate-spin text-green-600" />
              : <Upload size={24} className="text-gray-400" />
            }
            <span className="text-sm text-gray-500">
              {uploading ? "Subiendo..." : "PDF o imagen (máx. 10 MB)"}
            </span>
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileUpload} disabled={uploading} />
          </label>
        )}
      </div>

      {/* Visible en CV */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
        <input
          {...register("is_visible_in_cv")}
          type="checkbox"
          id="visible_cv"
          className="w-4 h-4 accent-green-600 cursor-pointer"
        />
        <label htmlFor="visible_cv" className="text-sm font-medium text-gray-700 cursor-pointer">
          Incluir este registro en mi hoja de vida generada
        </label>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: "#16a34a" }}
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" />Guardando...</>
            : "Guardar registro"
          }
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}