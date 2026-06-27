"use client"

import * as React from "react"
import Image from "next/image"
import { AlertCircle, Check } from "lucide-react"
import { motion } from "framer-motion"
import { ProgressBar } from "@/components/atoms/ProgressBar"
import { Spinner } from "@/components/atoms/Spinner"
import { Badge } from "@/components/atoms/Badge"
import { cn } from "@/lib/utils"

export interface PhotoThumbnailProps {
  src: string
  alt: string
  status: "uploading" | "processing" | "ready" | "error"
  uploadProgress?: number
  onRemove?: () => void
  selectable?: boolean
  isSelected?: boolean
  className?: string
}

export function PhotoThumbnail({
  src,
  alt,
  status,
  uploadProgress = 0,
  onRemove,
  selectable,
  isSelected,
  className,
}: PhotoThumbnailProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-sm aspect-[3/2] bg-surface-secondary",
        status === "error" && "border-2 border-error",
        className
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" />

      {/* Selectable Hover State */}
      {selectable && !isSelected && (
        <div className="absolute top-2 left-2 opacity-0 hover:opacity-100 transition-opacity z-10">
          <div className="h-5 w-5 rounded-sm border-2 border-white/80 bg-black/20" />
        </div>
      )}

      {/* Selected State overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-brand-primary/20 z-10 flex items-start justify-start p-2">
          <div className="h-5 w-5 rounded-sm bg-brand-primary flex items-center justify-center text-white">
            <Check className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {/* Status Overlays */}
      {status === "uploading" && (
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent z-10">
          <ProgressBar value={uploadProgress} />
        </div>
      )}

      {status === "processing" && (
        <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center gap-2">
          <Spinner color="white" />
          <Badge variant="processing">Processing</Badge>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 bg-error/10 z-10 flex flex-col items-center justify-center text-error">
          <AlertCircle className="h-8 w-8 mb-1" />
          <span className="text-xs font-bold bg-white/80 px-2 py-0.5 rounded-full">Failed</span>
        </div>
      )}
    </motion.div>
  )
}
