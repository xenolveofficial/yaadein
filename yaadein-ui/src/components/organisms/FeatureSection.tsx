"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { AlbumChip } from "@/components/molecules/AlbumChip"
import { ProgressBar } from "@/components/atoms/ProgressBar"
import { SectionLabel } from "@/components/atoms/SectionLabel"
import { landingContent } from "@/content/landing.content"
import { cn } from "@/lib/utils"

export interface FeatureSectionProps {
  className?: string
}

interface FeatureRowProps {
  label: string
  title: string
  body: string
  visual: React.ReactNode
  reverse?: boolean
  index: number
}

function FeatureRow({ label, title, body, visual, reverse, index }: FeatureRowProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className={cn(
        "flex flex-col lg:flex-row items-center gap-10 lg:gap-16",
        reverse && "lg:flex-row-reverse"
      )}
    >
      {/* Text */}
      <div className="flex-1 flex flex-col gap-4">
        <SectionLabel text={label} />
        <h3 className="font-display text-h2 font-semibold text-text-primary leading-tight">{title}</h3>
        <p className="font-body text-lg text-text-secondary leading-relaxed max-w-md">{body}</p>
      </div>

      {/* Visual */}
      <div className="flex-1 w-full max-w-sm lg:max-w-none flex items-center justify-center">
        <div className="w-full rounded-xl bg-surface-secondary border border-border p-6 shadow-card min-h-[200px] flex items-center justify-center">
          {visual}
        </div>
      </div>
    </motion.div>
  )
}

export function FeatureSection({ className }: FeatureSectionProps) {
  const features = landingContent.features

  const visuals: React.ReactNode[] = [
    // Feature 1: AI gallery mock with AlbumChips
    <div key="gallery" className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Bride & Family", emoji: "👰", count: 142 },
          { label: "Ceremony", emoji: "💍", count: 87 },
          { label: "Reception", emoji: "🎉", count: 210 },
          { label: "Candids", emoji: "📷", count: 65 },
        ].map((chip, i) => (
          <AlbumChip
            key={chip.label}
            label={chip.label}
            icon={chip.emoji}
            count={chip.count}
            isActive={i === 0}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-border" />
        ))}
      </div>
    </div>,

    // Feature 2: WhatsApp chat bubble mock
    <div key="whatsapp" className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2">
        <div className="self-end max-w-[75%] rounded-t-xl rounded-bl-xl bg-[#25D366]/20 border border-[#25D366]/30 p-3">
          <p className="font-body text-sm text-text-primary">📸 Check out your photos from Priya's wedding!</p>
          <div className="mt-2 h-24 w-full rounded-md bg-surface-secondary border border-border flex items-center justify-center">
            <span className="text-xs text-text-muted font-body">memora.app/priya-wedding-2024</span>
          </div>
        </div>
        <div className="self-start max-w-[75%] rounded-t-xl rounded-br-xl bg-surface-primary border border-border p-3">
          <p className="font-body text-sm text-text-secondary">Omg I look amazing 😍 Downloading all of them!</p>
        </div>
      </div>
    </div>,

    // Feature 3: Upload progress bars
    <div key="upload" className="flex flex-col gap-4 w-full">
      <p className="font-body text-sm font-bold text-text-primary">Uploading 4 files...</p>
      {[
        { name: "DSC_0042.jpg", progress: 100 },
        { name: "IMG_5821.heic", progress: 72 },
        { name: "VID_0019.mp4", progress: 38 },
        { name: "DSC_0045.jpg", progress: 10 },
      ].map((f) => (
        <div key={f.name} className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="font-body text-xs text-text-muted truncate max-w-[70%]">{f.name}</span>
            <span className="font-body text-xs text-brand-primary font-medium">{f.progress}%</span>
          </div>
          <ProgressBar value={f.progress} />
        </div>
      ))}
    </div>,
  ]

  return (
    <section className={`bg-surface-primary py-16 lg:py-24 ${className ?? ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-20 lg:gap-28">
        {features.map((feature, index) => (
          <FeatureRow
            key={feature.title}
            label={feature.label}
            title={feature.title}
            body={feature.body}
            visual={visuals[index]}
            reverse={index % 2 === 1}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
