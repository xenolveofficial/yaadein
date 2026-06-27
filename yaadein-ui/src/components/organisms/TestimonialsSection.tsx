import * as React from "react"
import { SectionLabel } from "@/components/atoms/SectionLabel"
import { TestimonialCard } from "@/components/molecules/TestimonialCard"
import { landingContent } from "@/content/landing.content"

export interface TestimonialsSectionProps {
  className?: string
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const { sectionLabel, items } = landingContent.testimonials

  return (
    <section className={`bg-surface-dark py-16 lg:py-24 ${className ?? ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <SectionLabel text={sectionLabel} className="text-accent-gold" />
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-inverse text-center">
            Real memories. Real families.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <TestimonialCard
              key={item.name}
              quote={item.quote}
              name={item.name}
              city={item.city}
              role={item.role}
              rating={item.rating}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
