"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center w-full", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep

        return (
          <React.Fragment key={step}>
            {/* Step Dot */}
            <div className="relative flex flex-col items-center group">
              <div
                className={cn(
                  "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-200 z-10",
                  isCompleted && "bg-brand-primary",
                  isActive && "border-2 border-brand-primary bg-white",
                  !isCompleted && !isActive && "bg-border"
                )}
              >
                {isCompleted && <Check className="h-3 w-3 text-white" />}
                {isActive && (
                  <motion.div
                    layoutId="active-step"
                    className="h-2 w-2 rounded-full bg-brand-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              
              {/* Step Label (Absolute to prevent layout shift) */}
              <span
                className={cn(
                  "absolute top-8 w-max text-xs font-medium text-center",
                  isActive || isCompleted ? "text-text-primary font-bold" : "text-text-muted"
                )}
              >
                {step}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 shrink bg-border overflow-hidden">
                <motion.div
                  className="h-full bg-brand-primary"
                  initial={{ width: isCompleted ? "100%" : "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
