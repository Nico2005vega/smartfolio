"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Bell, Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types";
import { toast } from "sonner";

interface TopBarProps { profile: Profile | null; }

export default function TopBar({ profile }: TopBarProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
    router.refresh();
  };

  const initials = profile
    ? getInitials(profile.first_name || "U", profile.last_name || "S")
    : "US";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
        <Menu size={20} className="text-gray-600" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell size={18} className="text-gray-500" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{background:"#16a34a"}}>
            {profile?.photo_url
              ? <img src={profile.photo_url} className="w-full h-full rounded-full object-cover" alt="avatar" />
              : initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {profile?.plan === "premium" ? "⭐ Premium" : "Plan Gratuito"}
            </p>
          </div>
        </div>

        <button onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-500 transition-colors"
          title="Cerrar sesión">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
