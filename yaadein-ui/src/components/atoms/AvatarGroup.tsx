"use client"

import * as React from "react"
import { Avatar } from "./Avatar"
import { cn } from "@/lib/utils"

export interface AvatarGroupProps {
  avatars: { src?: string; alt?: string; fallback?: string }[]
  max?: number
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function AvatarGroup({ avatars, max = 4, size = "md", className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max)
  const excess = avatars.length - max

  return (
    <div className={cn("flex items-center -space-x-3", className)}>
      {visibleAvatars.map((avatar, i) => (
        <div key={i} className="relative ring-2 ring-surface-primary rounded-full">
          <Avatar size={size} {...avatar} />
        </div>
      ))}
      {excess > 0 && (
        <div className="relative ring-2 ring-surface-primary rounded-full">
          <Avatar size={size} fallback={`+${excess}`} />
        </div>
      )}
    </div>
  )
}
