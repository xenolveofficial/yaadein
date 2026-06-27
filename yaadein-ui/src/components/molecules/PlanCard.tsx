"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/atoms/Card"
import { Button } from "@/components/atoms/Button"
import { Badge } from "@/components/atoms/Badge"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

export interface PlanData {
  name: string
  price: string
  priceUnit: string
  photos: string
  videos: string
  retentionDays: string
  features: string[]
  infraCost: string
  isRecommended?: boolean
  color: string
}

export interface PlanCardProps {
  plan: PlanData
  isSelected?: boolean
  onSelect?: () => void
  showInfraCost?: boolean
  className?: string
}

export function PlanCard({ plan, isSelected, onSelect, showInfraCost, className }: PlanCardProps) {
  return (
    <Card
      variant={isSelected ? "interactive" : "elevated"}
      className={cn(
        "relative overflow-hidden cursor-pointer flex flex-col",
        isSelected && "ring-2 ring-brand-primary shadow-elevated",
        className
      )}
      onClick={onSelect}
      style={{ borderTop: plan.isRecommended ? "2px solid var(--color-brand-primary)" : undefined }}
    >
      <CardContent className="p-6 flex flex-col gap-6 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span
              className="font-body font-bold text-base"
              style={{ color: plan.color }}
            >
              {plan.name}
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-4xl font-semibold text-text-primary">
                {plan.price}
              </span>
              <span className="font-body text-sm text-text-muted">
                {plan.priceUnit}
              </span>
            </div>
          </div>
          {plan.isRecommended && (
            <Badge variant="elite">Most Popular</Badge>
          )}
        </div>

        <SeparatorPrimitive.Root className="h-[1px] w-full bg-border" />

        <div className="flex justify-between text-sm text-text-secondary font-medium">
          <div className="flex flex-col items-center">
            <span className="text-text-primary font-bold">{plan.photos}</span>
            <span className="text-xs">Photos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-text-primary font-bold">{plan.videos}</span>
            <span className="text-xs">Videos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-text-primary font-bold">{plan.retentionDays}</span>
            <span className="text-xs">Retention</span>
          </div>
        </div>

        <ul className="flex flex-col gap-3 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <Check className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {showInfraCost && (
          <p className="text-xs text-text-muted text-center mt-auto">
            Infra cost ~₹{plan.infraCost}
          </p>
        )}

        <Button
          variant={isSelected ? "primary" : "secondary"}
          fullWidth
          className="mt-4"
        >
          {isSelected ? "Selected" : "Select Plan"}
        </Button>
      </CardContent>
    </Card>
  )
}
