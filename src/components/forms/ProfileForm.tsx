"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Camera } from "lucide-react";
import type { Profile } from "@/types";
import { getInitials } from "@/lib/utils";

interface Props { profile: Profile | null; userId: string; email: string; }

export default function ProfileForm({ profile, userId, email }: Props) {
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url ?? "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name:   profile?.first_name ?? "",
      last_name:    profile?.last_name ?? "",
      phone:        profile?.phone ?? "",
      city:         profile?.city ?? "",
      country:      profile?.country ?? "Colombia",
      bio:          profile?.bio ?? "",
      linkedin_url: profile?.linkedin_url ?? "",
      github_url:   profile?.github_url ?? "",
      website_url:  profile?.website_url ?? "",
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    const { data, error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast.error("Error al subir la foto"); setUploadingPhoto(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
    setPhotoUrl(urlData.publicUrl + "?t=" + Date.now());
    await supabase.from("profiles").update({ photo_url: urlData.publicUrl }).eq("id", userId);
    toast.success("Foto actualizada");
    setUploadingPhoto(false);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      ...data,
      linkedin_url: data.linkedin_url || null,
      github_url:   data.github_url || null,
      website_url:  data.website_url || null,
    }).eq("id", userId);

    if (error) toast.error("Error al guardar el perfil");
    else toast.success("Perfil actualizado ✓");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden"
            style={{background:"#16a34a"}}>
            {photoUrl
              ? <img src={photoUrl} alt="avatar" className="w-full h-full object-cover" />
              : getInitials(profile?.first_name ?? "U", profile?.last_name ?? "S")}
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50">
            {uploadingPhoto ? <Loader2 size={12} className="animate-spin text-gray-400" /> : <Camera size={12} className="text-gray-500" />}
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
          </label>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{profile?.first_name} {profile?.last_name}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-xs text-gray-400 font-mono mt-1">smartfolio.co/p/{profile?.username_slug}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre *</label>
          <input {...register("first_name")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Apellido *</label>
          <input {...register("last_name")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
          <input {...register("phone")} placeholder="+57 315 000 0000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ciudad</label>
          <input {...register("city")} placeholder="Bucaramanga"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">País</label>
          <input {...register("country")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Presentación profesional</label>
        <textarea {...register("bio")} rows={3}
          placeholder="Estudiante de Tecnología en Desarrollo de Sistemas Informáticos en las UTS..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { key:"linkedin_url", label:"LinkedIn URL", ph:"https://linkedin.com/in/tu-perfil" },
          { key:"github_url",   label:"GitHub URL",   ph:"https://github.com/tu-usuario" },
          { key:"website_url",  label:"Sitio web",    ph:"https://tu-sitio.com" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
            <input {...register(f.key as keyof ProfileFormData)} placeholder={f.ph}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
        style={{background:"#16a34a"}}>
        {loading ? <><Loader2 size={16} className="animate-spin"/>Guardando...</> : "Guardar cambios"}
      </button>
    </form>
  );
}
