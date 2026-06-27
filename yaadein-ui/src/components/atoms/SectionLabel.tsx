import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
}

const SectionLabel = React.forwardRef<HTMLSpanElement, SectionLabelProps>(
  ({ text, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "font-body text-xs font-bold uppercase tracking-widest text-accent-gold",
          className
        )}
        {...props}
      >
        {text}
      </span>
    )
  }
)
SectionLabel.displayName = "SectionLabel"

export { SectionLabel }
