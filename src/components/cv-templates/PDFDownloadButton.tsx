"use client";
import { useState, type ComponentType } from "react";
import { Download, Loader2 } from "lucide-react";
import type { CVData } from "@/types";

interface Props {
  data:        CVData;
  fileName:    string;
  templateKey: string;
}

async function imageToBase64(url: string): Promise<string> {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

// Registry of all available PDF document modules
const PDF_MODULES: Record<string, () => Promise<{ default: ComponentType<{ data: CVData }> }>> = {
  modern:    () => import("./CVDocumentModern"),
  classic:   () => import("./CVDocumentClassic"),
  executive: () => import("./CVDocumentExecutive"),
  creative:  () => import("./CVDocumentCreative"),
  minimal:   () => import("./CVDocumentMinimal"),
  tech:      () => import("./CVDocumentTech"),
};

export default function PDFDownloadButton({ data, fileName, templateKey }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Convert photo to base64 to avoid CORS in react-pdf
      let photoBase64 = "";
      if (data.profile.photo_url) {
        photoBase64 = await imageToBase64(data.profile.photo_url);
      }

      const dataWithBase64: CVData = {
        ...data,
        profile: {
          ...data.profile,
          photo_url: photoBase64 || data.profile.photo_url,
        },
      };

      const { pdf } = await import("@react-pdf/renderer");

      const key      = (templateKey in PDF_MODULES ? templateKey : "modern") as keyof typeof PDF_MODULES;
      const mod      = await PDF_MODULES[key]();
      const DocComp  = mod.default;

      const blob = await pdf(<DocComp data={dataWithBase64} /> as any).toBlob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Error generando PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-colors disabled:opacity-60"
      style={{ borderColor:"#16a34a", color:"#16a34a" }}
    >
      {loading
        ? <><Loader2 size={15} className="animate-spin" /> Generando PDF…</>
        : <><Download size={15} /> Descargar PDF</>
      }
    </button>
  );
}