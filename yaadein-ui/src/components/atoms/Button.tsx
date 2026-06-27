import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-card font-body font-bold text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-text-inverse hover:bg-brand-primary-hover",
        secondary: "bg-surface-primary border-[1.5px] border-brand-primary text-brand-primary",
        ghost: "text-brand-primary hover:underline",
        destructive: "bg-error text-text-inverse hover:bg-error/90",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#25D366]/90",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-12 md:h-10 px-4 py-2",
        lg: "h-14 md:h-11 px-8",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {asChild ? (
          // When asChild, Slot needs a single React element child to merge onto.
          // Pass children directly — icons/loading state are not used in asChild mode.
          children
        ) : (
          <>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : leftIcon ? (
              <span className="mr-2">{leftIcon}</span>
            ) : null}
            <span className="truncate">{children}</span>
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
