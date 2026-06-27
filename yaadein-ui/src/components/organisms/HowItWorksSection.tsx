import * as React from "react"
import { QrCode, Upload, Grid2x2 } from "lucide-react"
import { Card, CardContent } from "@/components/atoms/Card"
import { SectionLabel } from "@/components/atoms/SectionLabel"
import { landingContent } from "@/content/landing.content"

export interface HowItWorksSectionProps {
  className?: string
}

const iconMap = {
  QrCode: QrCode,
  Upload: Upload,
  Grid2x2: Grid2x2,
} as const

export function HowItWorksSection({ className }: HowItWorksSectionProps) {
  const { sectionLabel, steps } = landingContent.howItWorks

  return (
    <section
      id="how-it-works"
      className={`bg-surface-secondary py-16 lg:py-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <SectionLabel text={sectionLabel} />
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary text-center">
            Simple for guests. Powerful for you.
          </h2>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-6 items-stretch">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon]
            return (
              <React.Fragment key={step.title}>
                <Card variant="elevated" className="flex-1">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary-subtle">
                        <Icon className="h-6 w-6 text-brand-primary" />
                      </div>
                      <span className="font-body text-caption font-bold uppercase tracking-widest text-text-muted">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="font-body font-bold text-h3 text-text-primary">{step.title}</h3>
                    <p className="font-body text-body text-text-secondary">{step.body}</p>
                  </CardContent>
                </Card>

                {/* Connecting dash — desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center self-center shrink-0">
                    <div className="w-8 border-t-2 border-dashed border-brand-primary opacity-40" />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}
