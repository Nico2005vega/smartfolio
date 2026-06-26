import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar solo en desktop */}
      <Sidebar role={profile?.role ?? "student"} />

      {/* Contenido principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar profile={profile} />
        <main style={{
          flex: 1,
          padding: "20px 16px 80px",  /* padding-bottom para la bottom nav */
        }}
          className="lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}