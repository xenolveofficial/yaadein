import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { landingContent } from "@/content/landing.content"

export interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const { logo, tagline, columns, copyright } = landingContent.footer

  return (
    <footer className={`bg-surface-dark pt-16 pb-8 ${className ?? ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Image
              src="/assets/Yaadein-logo.png"
              alt="Yaadein"
              width={120}
              height={40}
              className="h-20 w-auto brightness-0 invert"
            />
            <p className="font-body text-sm text-text-muted leading-relaxed max-w-[160px]">
              QR-based photo sharing for Indian celebrations.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <p className="font-body font-bold text-xs uppercase tracking-widest text-text-muted">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="font-body text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="font-body text-xs text-text-muted">{copyright}</p>
          <p className="font-body text-xs text-text-muted">{tagline}</p>
        </div>
      </div>
    </footer>
  )
}
