"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Plus, Settings, CreditCard, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/atoms/Avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "My Events", href: "/dashboard", icon: CalendarDays },
  { label: "Create Event", href: "/dashboard/create-event", icon: Plus },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-60 bg-surface-primary border-r border-border h-screen flex flex-col shrink-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-border flex items-center justify-center">
        <Image
          src="/assets/yaadein-logo.png"
          alt="Yaadein"
          width={120}
          height={40}
          className="h-20 w-auto"
          priority
        />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150",
                isActive
                  ? "bg-brand-primary-subtle text-brand-primary"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <Avatar size="sm" src={user.avatarUrl} alt={user.name} />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">{user.name}</span>
            <span className="text-xs text-text-muted truncate">{user.email}</span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-error hover:bg-error-subtle transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
