"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  label?: string
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, label, className, ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value))

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <div className="flex justify-between mb-2 text-sm font-body font-medium text-text-primary">
            <span>{label}</span>
            <span>{Math.round(clampedValue)}%</span>
          </div>
        )}
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
          <motion.div
            className="h-full bg-brand-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
