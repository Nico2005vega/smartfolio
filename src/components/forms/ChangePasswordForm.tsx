"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener mínimo 8 caracteres");
      return;
    }
    if (newPassword !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error("Error al cambiar la contraseña");
    } else {
      toast.success("Contraseña actualizada correctamente ✓");
      setNewPassword("");
      setConfirm("");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Nueva contraseña
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Confirmar contraseña
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repite la nueva contraseña"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !newPassword || !confirm}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
        style={{ background: "#16a34a" }}>
        {loading
          ? <><Loader2 size={15} className="animate-spin" /> Actualizando...</>
          : <><KeyRound size={15} /> Actualizar contraseña</>
        }
      </button>
    </form>
  );
}