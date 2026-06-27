import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide font-body transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-secondary text-text-secondary",
        premium: "bg-accent-gold-subtle text-[#A0782A]",
        elite: "bg-brand-primary-subtle text-brand-primary",
        live: "bg-success-subtle text-success",
        processing: "bg-surface-secondary text-text-secondary",
        success: "bg-success-subtle text-success",
        error: "bg-error-subtle text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "live" && (
        <span className="mr-1.5 flex h-2 w-2 rounded-full bg-success animate-pulse" />
      )}
      {variant === "processing" && (
        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
