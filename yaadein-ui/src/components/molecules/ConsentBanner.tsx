"use client"

import * as React from "react"
import { Info } from "lucide-react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ConsentBannerProps {
  onConsent: (consented: boolean) => void
  eventName: string
  className?: string
}

export function ConsentBanner({ onConsent, eventName, className }: ConsentBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 bg-surface-secondary border border-border rounded-md px-4 py-3 text-sm text-text-primary",
        className
      )}
    >
      <p>
        This event ({eventName}) uses face search. Your face data is encrypted, never shared, and deleted when the event expires.
      </p>
      <div className="flex items-center gap-2">
        <CheckboxPrimitive.Root
          id="consent-checkbox"
          onCheckedChange={(checked) => onConsent(checked === true)}
          className="peer h-5 w-5 shrink-0 rounded-sm border border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-primary data-[state=checked]:text-white flex items-center justify-center bg-white"
        >
          <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
            <Check className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <label
          htmlFor="consent-checkbox"
          className="font-medium font-body text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
        >
          I consent to face search for this event
        </label>

        <TooltipPrimitive.Provider>
          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
              <button type="button" className="text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none">
                <Info className="h-4 w-4" />
                <span className="sr-only">More info</span>
              </button>
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
              <TooltipPrimitive.Content
                side="top"
                align="end"
                className="z-50 overflow-hidden rounded-md border border-border bg-surface-primary px-3 py-1.5 text-xs text-text-primary shadow-elevated animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-[250px]"
              >
                In compliance with DPDP, your biometric data is solely used to find your photos in this event and is not stored permanently.
                <TooltipPrimitive.Arrow className="fill-surface-primary" />
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
      </div>
    </div>
  )
}
