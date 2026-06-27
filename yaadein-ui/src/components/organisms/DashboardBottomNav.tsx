"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Plus, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: "Events", href: "/dashboard", icon: CalendarDays },
  { label: "Create", href: "/dashboard/create-event", icon: Plus },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-primary border-t border-border flex items-center justify-around z-40 px-2 shadow-lg">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1.5 gap-1 text-[10px] font-semibold transition-all duration-150",
              isActive
                ? "text-brand-primary"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
