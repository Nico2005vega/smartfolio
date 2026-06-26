import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";
import InactivityProvider from "@/components/InactivityProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={profile?.role ?? "student"} />

      <MobileNav
        role={profile?.role ?? "student"}
        firstName={profile?.first_name ?? "U"}
        lastName={profile?.last_name ?? "S"}
        email={user.email ?? ""}
        plan={profile?.plan ?? "free"}
        photoUrl={profile?.photo_url ?? null}
      />

      <InactivityProvider>
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar profile={profile ?? null} />
          <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
        </div>
      </InactivityProvider>
    </div>
  );
}