"use client";
import { useState, type ComponentType } from "react";
import { Download, Loader2 } from "lucide-react";
import type { CVData } from "@/types";

interface Props {
  data: CVData;
  fileName: string;
  templateKey: string;
}

async function imageToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

export default function PDFDownloadButton({ data, fileName, templateKey }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      let photoBase64 = "";
      if (data.profile.photo_url) {
        photoBase64 = await imageToBase64(data.profile.photo_url);
      }

      const dataWithBase64 = {
        ...data,
        profile: {
          ...data.profile,
          photo_url: photoBase64 || data.profile.photo_url,
        },
      };

      const { pdf } = await import("@react-pdf/renderer");

      const modules = {
        classic:   () => import("./CVDocumentClassic"),
        executive: () => import("./CVDocumentExecutive"),
        modern:    () => import("./CVDocumentModern"),
      };

      const key = (templateKey in modules ? templateKey : "modern") as keyof typeof modules;
      const mod = await modules[key]();
      const DocComponent = mod.default as ComponentType<{ data: CVData }>;

      const blob = await pdf(
        <DocComponent data={dataWithBase64} /> as any
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

    } catch (error: unknown) {
      console.error("Error generando PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-colors disabled:opacity-60"
      style={{ borderColor: "#16a34a", color: "#16a34a" }}>
      {loading 
        ? <><Loader2 size={15} className="animate-spin" /> Generando PDF...</> 
        : <><Download size={15} /> Descargar PDF</>
      }
    </button>
  );
}