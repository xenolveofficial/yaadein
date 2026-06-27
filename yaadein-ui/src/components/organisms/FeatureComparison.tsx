"use client";

import * as React from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureRow {
  name: string;
  starter: string | boolean;
  basic: string | boolean;
  premium: string | boolean;
  elite: string | boolean;
}

interface FeatureCategory {
  category: string;
  color: string;
  rows: FeatureRow[];
}

const FEATURE_DATA: FeatureCategory[] = [
  {
    category: "Storage & Media",
    color: "text-brand-primary bg-brand-primary-subtle",
    rows: [
      { name: "Photo Limit", starter: "500 Photos", basic: "2,000 Photos", premium: "Unlimited", elite: "Unlimited" },
      { name: "Video Limit", starter: "No Videos", basic: "50 Videos", premium: "Unlimited", elite: "Unlimited" },
      { name: "Max Resolution", starter: "Standard", basic: "High-Res (1080p)", premium: "Original Quality", elite: "Original Quality (up to 4K)" },
      { name: "Storage Space", starter: "5 GB", basic: "20 GB", premium: "100 GB", elite: "500 GB" },
    ]
  },
  {
    category: "Guest Experience",
    color: "text-accent-gold bg-accent-gold-subtle",
    rows: [
      { name: "QR Code Sharing", starter: true, basic: true, premium: true, elite: true },
      { name: "Face Search (AI)", starter: false, basic: true, premium: true, elite: true },
      { name: "Custom Gallery Branding", starter: false, basic: false, premium: true, elite: true },
      { name: "Slideshow Mode", starter: false, basic: true, premium: true, elite: true },
    ]
  },
  {
    category: "Retention & Support",
    color: "text-success bg-success-subtle",
    rows: [
      { name: "Active Retention", starter: "90 Days", basic: "180 Days", premium: "365 Days", elite: "Lifetime" },
      { name: "Forever Archive Option", starter: false, basic: false, premium: "Add-on Available", elite: "Included" },
      { name: "Support Level", starter: "Self-serve", basic: "Email (24h)", premium: "Priority (1h)", elite: "24/7 Dedicated Manager" },
    ]
  }
];

export function FeatureComparison() {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (catName: string) => {
    setCollapsed(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const renderCell = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="h-5 w-5 text-brand-primary mx-auto" />
      ) : (
        <span className="text-text-muted font-bold mx-auto">-</span>
      );
    }
    return <span className="text-sm font-medium text-text-secondary">{val}</span>;
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h3 className="font-heading text-2xl font-bold text-text-primary">Compare Features</h3>
        <p className="text-text-secondary text-sm mt-1">Detailed comparison of event host plans</p>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="border border-border rounded-xl bg-surface-primary shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/40">
                <th className="w-1/3 p-4 text-left font-body font-semibold text-text-primary sticky left-0 bg-surface-primary z-10 border-r border-border">
                  Features
                </th>
                <th className="p-4 text-center font-body font-semibold text-text-primary">Starter</th>
                <th className="p-4 text-center font-body font-semibold text-text-primary border-l border-border bg-brand-primary-subtle/5">Basic</th>
                <th className="p-4 text-center font-body font-semibold text-brand-primary relative">
                  Premium
                  <span className="absolute top-0 right-0 left-0 h-1 bg-brand-primary" />
                </th>
                <th className="p-4 text-center font-body font-semibold text-text-primary border-l border-border">Elite</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_DATA.map((cat) => {
                const isCollapsed = !!collapsed[cat.category];
                return (
                  <React.Fragment key={cat.category}>
                    {/* Category Header Row */}
                    <tr className="bg-surface-secondary/20 border-b border-border cursor-pointer hover:bg-surface-secondary/35 transition-colors" onClick={() => toggleCategory(cat.category)}>
                      <td colSpan={5} className="p-3 font-body font-bold text-xs sticky left-0 bg-surface-primary z-10">
                        <div className="flex items-center justify-between">
                          <span className={cn("px-2.5 py-1 rounded-full uppercase tracking-wider", cat.color)}>
                            {cat.category}
                          </span>
                          <span className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 text-xs">
                            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Category Rows */}
                    {!isCollapsed && cat.rows.map((row) => (
                      <tr key={row.name} className="border-b border-border last:border-b-0 hover:bg-surface-secondary/10 transition-colors">
                        <td className="p-4 text-left text-sm font-medium text-text-primary sticky left-0 bg-surface-primary z-10 border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          {row.name}
                        </td>
                        <td className="p-4 text-center">{renderCell(row.starter)}</td>
                        <td className="p-4 text-center border-l border-border bg-brand-primary-subtle/5">{renderCell(row.basic)}</td>
                        <td className="p-4 text-center border-l border-r border-border font-semibold text-text-primary">{renderCell(row.premium)}</td>
                        <td className="p-4 text-center">{renderCell(row.elite)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
