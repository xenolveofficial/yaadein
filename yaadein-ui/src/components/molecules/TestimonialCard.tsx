import * as React from "react"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/atoms/Card"
import { Avatar } from "@/components/atoms/Avatar"
import { cn } from "@/lib/utils"

export interface TestimonialCardProps {
  quote: string
  name: string
  city: string
  role: string
  rating?: number
  className?: string
}

export function TestimonialCard({
  quote,
  name,
  city,
  role,
  rating = 5,
  className,
}: TestimonialCardProps) {
  return (
    <Card variant="elevated" className={className}>
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating ? "fill-accent-gold text-accent-gold" : "fill-surface-secondary text-surface-secondary"
              )}
            />
          ))}
        </div>
        <p className="font-display italic text-base text-text-primary leading-relaxed">
          "{quote}"
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Avatar size="md" alt={name} />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-text-primary">{name}</span>
            <span className="text-xs text-text-muted">
              {role} · {city}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
