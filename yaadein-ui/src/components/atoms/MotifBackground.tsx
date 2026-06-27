import * as React from "react"
import { cn } from "@/lib/utils"

export interface MotifBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "floral" | "geometric" | "mandala"
}

const MotifBackground = React.forwardRef<HTMLDivElement, MotifBackgroundProps>(
  ({ variant = "floral", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 z-0 pointer-events-none opacity-[0.03]", className)}
        {...props}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`motif-${variant}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {variant === "floral" && (
                <path d="M50 0 Q75 25 50 50 Q25 25 50 0 M50 50 Q75 75 50 100 Q25 75 50 50 M0 50 Q25 25 50 50 Q25 75 0 50 M50 50 Q75 25 100 50 Q75 75 50 50" fill="currentColor" />
              )}
              {variant === "geometric" && (
                <path d="M0 0 L50 50 L100 0 L100 100 L50 50 L0 100 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              )}
              {variant === "mandala" && (
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
              )}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#motif-${variant})`} className="text-brand-primary" />
        </svg>
      </div>
    )
  }
)
MotifBackground.displayName = "MotifBackground"

export { MotifBackground }
