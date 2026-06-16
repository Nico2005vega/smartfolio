"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
import type { Profile } from "@/types";

interface Props { profile: Profile | null; userId: string; }

export default function ProfileForm({ profile, userId }: Props) {
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile?.photo_url ?? null);

  const [form, setForm] = useState({
    firstName:   profile?.first_name   ?? "",
    lastName:    profile?.last_name    ?? "",
    phone:       profile?.phone        ?? "",
    city:        profile?.city         ?? "",
    country:     profile?.country      ?? "Colombia",
    bio:         profile?.bio          ?? "",
    linkedinUrl: profile?.linkedin_url ?? "",
    githubUrl:   profile?.github_url   ?? "",
    websiteUrl:  profile?.website_url  ?? "",
  });

  const supabase = createClient();
  const router   = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("La foto no puede superar 2MB"); return; }
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Error al subir la foto");
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      await supabase.from("profiles").update({ photo_url: url }).eq("id", userId);
      setPhotoPreview(url);
      toast.success("Foto actualizada ✓");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) {
      toast.error("El nombre y apellido son obligatorios");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      first_name:   form.firstName,
      last_name:    form.lastName,
      phone:        form.phone       || null,
      city:         form.city        || null,
      country:      form.country     || null,
      bio:          form.bio         || null,
      linkedin_url: form.linkedinUrl || null,
      github_url:   form.githubUrl   || null,
      website_url:  form.websiteUrl  || null,
    }).eq("id", userId);
    if (error) { toast.error("Error al guardar los cambios"); }
    else { toast.success("Perfil actualizado ✓"); router.refresh(); }
    setSaving(false);
  };

  const inputCss: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    border: "1.5px solid #e5e7eb", borderRadius: "10px",
    fontSize: "14px", color: "#111827", outline: "none",
    background: "#fafafa", boxSizing: "border-box", fontFamily: "inherit",
  };

  const labelCss: React.CSSProperties = {
    display: "block", fontSize: "13px", fontWeight: 600,
    color: "#374151", marginBottom: "6px",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "#16a34a");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "#e5e7eb");

  return (
    <form onSubmit={handleSubmit}>

      {/* Foto */}
      <div style={{ display:"flex", alignItems:"center", gap:"20px", marginBottom:"28px", paddingBottom:"24px", borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"#16a34a", border:"3px solid #f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", color:"white", fontWeight:700, fontSize:"24px" }}>
            {photoPreview
              ? <img src={photoPreview} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="Foto" />
              : `${form.firstName.charAt(0) || "U"}${form.lastName.charAt(0) || "S"}`}
          </div>
          <label style={{ position:"absolute", bottom:"-2px", right:"-2px", width:"28px", height:"28px", borderRadius:"50%", background:"#16a34a", border:"2px solid white", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            {uploading ? <Loader2 size={12} color="white" className="animate-spin" /> : <Camera size={12} color="white" />}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display:"none" }} />
          </label>
        </div>
        <div>
          <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:"0 0 2px" }}>Foto de perfil</p>
          <p style={{ fontSize:"12px", color:"#9ca3af", margin:"0 0 8px" }}>JPG o PNG · máximo 2MB</p>
          <label style={{ display:"inline-block", fontSize:"12px", fontWeight:600, color:"#16a34a", cursor:"pointer", padding:"6px 12px", border:"1px solid #16a34a", borderRadius:"8px" }}>
            {uploading ? "Subiendo..." : "Cambiar foto"}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display:"none" }} />
          </label>
        </div>
      </div>

      {/* Datos personales */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
        <div>
          <label style={labelCss}>Nombre <span style={{ color:"#ef4444" }}>*</span></label>
          <input name="firstName" value={form.firstName} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} placeholder="Nicolás" style={inputCss} />
        </div>
        <div>
          <label style={labelCss}>Apellido <span style={{ color:"#ef4444" }}>*</span></label>
          <input name="lastName" value={form.lastName} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} placeholder="Vega Ruiz" style={inputCss} />
        </div>
        <div>
          <label style={labelCss}>Teléfono</label>
          <input name="phone" value={form.phone} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} placeholder="+57 315 687 0466" style={inputCss} />
        </div>
        <div>
          <label style={labelCss}>Ciudad</label>
          <input name="city" value={form.city} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} placeholder="Bucaramanga" style={inputCss} />
        </div>
        <div>
          <label style={labelCss}>País</label>
          <input name="country" value={form.country} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} placeholder="Colombia" style={inputCss} />
        </div>
      </div>

      {/* Bio */}
      <div style={{ marginBottom:"16px" }}>
        <label style={labelCss}>Presentación profesional</label>
        <textarea
          name="bio" value={form.bio} onChange={handleChange}
          onFocus={onFocus} onBlur={onBlur}
          placeholder="Cuéntale a los reclutadores sobre ti..."
          rows={3}
          style={{ ...inputCss, resize:"vertical", minHeight:"80px" }}
        />
      </div>

      {/* Links */}
      <div style={{ borderTop:"1px solid #f0f0f0", paddingTop:"20px", marginBottom:"20px" }}>
        <p style={{ fontSize:"13px", fontWeight:700, color:"#374151", margin:"0 0 14px" }}>
          Links profesionales <span style={{ fontSize:"11px", fontWeight:400, color:"#9ca3af" }}>(opcionales)</span>
        </p>
        <div style={{ display:"grid", gap:"12px" }}>
          <div>
            <label style={labelCss}>LinkedIn URL</label>
            <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} placeholder="https://linkedin.com/in/tu-perfil" style={inputCss} />
          </div>
          <div>
            <label style={labelCss}>GitHub URL</label>
            <input name="githubUrl" value={form.githubUrl} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} placeholder="https://github.com/tu-usuario" style={inputCss} />
          </div>
          <div>
            <label style={labelCss}>Sitio web</label>
            <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} placeholder="https://tu-sitio.com" style={inputCss} />
          </div>
        </div>
      </div>

      {/* Guardar */}
      <button type="submit" disabled={saving} style={{
        width:"100%", padding:"12px",
        background: saving ? "#86efac" : "#16a34a",
        color:"white", border:"none", borderRadius:"12px",
        fontSize:"14px", fontWeight:600,
        cursor: saving ? "not-allowed" : "pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
        boxShadow:"0 2px 8px rgba(22,163,74,0.25)",
      }}>
        {saving ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : "Guardar cambios"}
      </button>
    </form>
  );
}