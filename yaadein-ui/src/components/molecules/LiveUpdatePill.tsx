"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LiveUpdatePillProps {
  count: number
  onClick?: () => void
  className?: string
}

export function LiveUpdatePill({ count, onClick, className }: LiveUpdatePillProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (count > 0) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [count])

  return (
    <AnimatePresence>
      {isVisible && count > 0 && (
        <motion.button
          type="button"
          onClick={onClick}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-primary text-white shadow-elevated font-medium text-sm cursor-pointer hover:bg-brand-primary-hover transition-colors",
            className
          )}
        >
          <ArrowUp className="h-4 w-4" />
          <span>{count} new photos</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
