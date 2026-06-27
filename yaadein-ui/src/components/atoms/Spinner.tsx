import * as React from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
      },
      color: {
        primary: "text-brand-primary",
        inverse: "text-text-inverse",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
    },
  }
)

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

function Spinner({ size, color, className }: SpinnerProps) {
  return (
    <Loader2 className={cn(spinnerVariants({ size, color }), className)} />
  )
}

export { Spinner, spinnerVariants }
