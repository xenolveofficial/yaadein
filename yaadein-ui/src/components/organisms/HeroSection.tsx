"use client"

import * as React from "react"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/atoms/Button"
import { SectionLabel } from "@/components/atoms/SectionLabel"
import { MotifBackground } from "@/components/atoms/MotifBackground"
import { landingContent } from "@/content/landing.content"

export interface HeroSectionProps {
  className?: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const polaroids = [
  { rotate: "-5deg", top: "10%", left: "-8%", delay: 0.2 },
  { rotate: "3deg", top: "45%", right: "-10%", delay: 0.4 },
  { rotate: "-2deg", bottom: "8%", left: "5%", delay: 0.6 },
]

export function HeroSection({ className }: HeroSectionProps) {
  const { sectionLabel, h1, subheading, ctaPrimary, ctaGhost, socialProof } = landingContent.hero

  return (
    <section className={`relative overflow-hidden bg-surface-primary py-16 lg:py-24 ${className ?? ""}`}>
      <MotifBackground variant="floral" className="opacity-[0.04]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left column */}
          <motion.div
            className="flex-1 flex flex-col gap-6 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <SectionLabel text={sectionLabel} />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-hero font-semibold text-text-primary leading-tight"
            >
              {h1}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="font-body text-lg text-text-secondary max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              {subheading}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button variant="primary" size="lg" asChild>
                <Link href="/create">{ctaPrimary}</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/demo">{ctaGhost}</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-xs text-text-muted font-body"
            >
              {socialProof.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column — phone mockup */}
          <div className="relative hidden lg:flex flex-shrink-0 w-[320px] h-[580px] items-center justify-center">
            {/* Phone frame */}
            <div className="relative z-10 w-[260px] h-[520px] rounded-[2rem] border-4 border-text-primary/10 shadow-elevated bg-surface-secondary overflow-hidden flex flex-col items-center justify-start pt-6 px-4 gap-3">
              {/* Status bar simulation */}
              <div className="w-full flex justify-between text-[10px] text-text-muted px-2 font-body">
                <span>9:41</span>
                <span>●●●</span>
              </div>
              <div className="w-full h-[1px] bg-border" />
              <p className="font-body text-xs font-bold text-text-primary text-center">📷 Upload Photos</p>
              <p className="font-body text-[11px] text-text-muted text-center">Scan ↑ and share your moments</p>
              {/* Mock photo grid */}
              <div className="grid grid-cols-3 gap-1.5 w-full mt-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-sm bg-surface-primary"
                    style={{ opacity: 0.5 + i * 0.05 }}
                  />
                ))}
              </div>
              <div className="mt-auto pb-4 w-full">
                <div className="h-9 w-full rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <span className="text-xs font-body font-bold text-brand-primary">Upload Now ↑</span>
                </div>
              </div>
            </div>

            {/* Polaroid cards */}
            {polaroids.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: p.delay, duration: 0.5, ease: "easeOut" }}
                className="absolute w-[120px] h-[100px] bg-white shadow-card rounded-sm p-2"
                style={{
                  transform: `rotate(${p.rotate})`,
                  top: p.top,
                  bottom: p.bottom,
                  left: p.left,
                  right: p.right,
                  zIndex: 5 + i,
                }}
              >
                <div className="w-full h-[72px] rounded-[2px] bg-surface-secondary" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
