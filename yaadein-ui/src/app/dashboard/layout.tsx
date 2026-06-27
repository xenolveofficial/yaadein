import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/organisms/DashboardSidebar";
import { DashboardBottomNav } from "@/components/organisms/DashboardBottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Parse user profile info
  const userProfile = {
    name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Host",
    email: user.email || "",
    avatarUrl: user.user_metadata?.avatar_url || undefined,
  };

  return (
    <div className="flex h-screen bg-surface-secondary overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block shrink-0">
        <DashboardSidebar user={userProfile} />
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </div>
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden">
        <DashboardBottomNav />
      </div>
    </div>
  );
}
