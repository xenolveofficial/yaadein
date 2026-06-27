import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-border", className)}
      {...props}
    />
  )
}

// ─── Gallery Skeleton — masonry 2-col mobile, 3-col desktop ──────────────────
export function GallerySkeleton() {
  // Heights vary to mimic real masonry flow
  const heights = [
    "h-40", "h-56", "h-48", "h-32", "h-64", "h-36",
    "h-52", "h-44", "h-60", "h-40", "h-48", "h-56",
  ]
  return (
    <div className="columns-2 lg:columns-3 gap-[3px] p-1">
      {heights.map((h, i) => (
        <div key={i} className="break-inside-avoid mb-[3px]">
          <Skeleton className={cn("w-full rounded-none", h)} />
        </div>
      ))}
    </div>
  )
}

// ─── Event List Skeleton — 3 card skeletons ───────────────────────────────────
export function EventListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-border bg-surface-primary shadow-card">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="p-5 flex flex-col gap-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-10 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-2/3 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── QR Screen Skeleton ────────────────────────────────────────────────────────
export function QRSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <Skeleton className="h-48 w-48 rounded-xl" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  )
}
