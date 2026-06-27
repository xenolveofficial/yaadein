"use client"

import * as React from "react"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadDropzoneProps {
  onFilesSelected: (files: FileList) => void
  accept?: string
  maxFiles?: number
  disabled?: boolean
  className?: string
}

export function UploadDropzone({
  onFilesSelected,
  accept = "image/jpeg, image/png, image/heic, video/mp4",
  maxFiles,
  disabled,
  className,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files)
      // Reset input value so same files can be selected again if needed
      e.target.value = ""
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload files"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        isDragOver
          ? "border-brand-primary bg-brand-primary-subtle opacity-100"
          : "border-brand-primary/40 bg-surface-primary hover:bg-surface-secondary",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={maxFiles !== 1}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <Camera className="h-10 w-10 text-brand-primary mb-4" />
      <p className="font-body font-medium text-text-primary text-base text-center">
        Tap to choose photos or videos
      </p>
      <p className="font-body text-sm text-text-muted text-center mt-1">
        JPG, PNG, HEIC, MP4 · Original quality preserved
      </p>
    </div>
  )
}
