"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface EventTypePickerProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const EVENT_TYPES = [
  { label: "Wedding", emoji: "💍" },
  { label: "Birthday", emoji: "🎂" },
  { label: "Graduation", emoji: "🎓" },
  { label: "Corporate", emoji: "💼" },
  { label: "Engagement", emoji: "🎉" },
  { label: "Other", emoji: "🎊" },
]

export function EventTypePicker({ value, onChange, className }: EventTypePickerProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1 scrollbar-none", className)}>
      {EVENT_TYPES.map((type) => {
        const isSelected = value === type.label
        return (
          <button
            key={type.label}
            type="button"
            onClick={() => onChange?.(type.label)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border cursor-pointer transition-colors duration-150",
              isSelected
                ? "bg-brand-primary-subtle border-brand-primary text-brand-primary"
                : "bg-surface-secondary border-transparent text-text-secondary hover:bg-border"
            )}
          >
            <span>{type.emoji}</span>
            <span>{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}
