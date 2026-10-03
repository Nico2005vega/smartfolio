// ═══════════════════════════════════════════════════════════
// SMARTFOLIO – Acceso a documentos privados mediante enlace
// firmado temporal (el bucket "academic-documents" es privado
// a propósito, ver informe de Bucket not found).
// ═══════════════════════════════════════════════════════════

export async function openDocument(
  storagePath: string,
  mode: "view" | "download",
  fileName?: string
): Promise<void> {
  // La ventana se abre ANTES del fetch (de forma síncrona) para que el
  // navegador no la bloquee como pop-up — si se abriera después del await,
  // ya no cuenta como resultado directo del clic del usuario.
  const newWindow = mode === "view" ? window.open("", "_blank") : null;

  try {
    const res = await fetch("/api/documents/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storagePath, download: mode === "download", fileName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "No se pudo abrir el documento");

    if (mode === "download") {
      const a = document.createElement("a");
      a.href = data.url;
      a.download = fileName ?? "";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else if (newWindow) {
      newWindow.location.href = data.url;
    }
  } catch (e) {
    newWindow?.close();
    throw e;
  }
}