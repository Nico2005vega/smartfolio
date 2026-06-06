"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

interface Props { recordId: string; }

export default function DeleteRecordButton({ recordId }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("academic_records")
      .delete()
      .eq("id", recordId);

    if (error) {
      toast.error("Error al eliminar el registro");
    } else {
      toast.success("Registro eliminado");
      router.push("/academic");
      router.refresh();
    }
    setLoading(false);
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
        <Trash2 size={14} /> Eliminar
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
      <span className="text-sm text-red-700 font-medium">¿Eliminar?</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-sm font-semibold text-white bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 disabled:opacity-60 flex items-center gap-1">
        {loading ? <Loader2 size={12} className="animate-spin" /> : null}
        Sí, eliminar
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-sm text-gray-500 hover:text-gray-700">
        Cancelar
      </button>
    </div>
  );
}
