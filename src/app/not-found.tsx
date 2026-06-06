import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
        <p className="text-gray-500 mb-8">
          La página que buscas no existe o fue eliminada.
        </p>
        <Link href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-xl"
          style={{ background:"#16a34a" }}>
          Ir al dashboard
        </Link>
      </div>
    </div>
  );
}
