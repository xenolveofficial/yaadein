"use client"

import * as React from "react"
import { Badge } from "@/components/atoms/Badge"
import { cn } from "@/lib/utils"

export interface AlbumChipProps {
  label: string
  icon?: string
  isActive?: boolean
  count?: number
  onClick?: () => void
  className?: string
}

export function AlbumChip({ label, icon, isActive, count, onClick, className }: AlbumChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer border border-transparent",
        isActive
          ? "bg-brand-primary text-white"
          : "bg-surface-secondary text-text-secondary hover:bg-border",
        className
      )}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <Badge
          variant="default"
          className={cn(
            "ml-1 px-1.5 py-0 text-[10px] min-w-4 h-4 flex items-center justify-center",
            isActive ? "bg-white/20 text-white" : "bg-white text-text-primary"
          )}
        >
          {count}
        </Badge>
      )}
    </button>
  )
}
