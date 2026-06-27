import * as React from "react"
import Link from "next/link"
import { landingContent } from "@/content/landing.content"

export interface FooterProps {
  className?: string
}

function LotusIconWhite() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 14 C8 14 4 10 4 7 C4 4.8 5.8 3 8 3 C10.2 3 12 4.8 12 7 C12 10 8 14 8 14Z" fill="white" opacity="0.9" />
      <path d="M8 3 C8 3 4 2 2 5 C1 7 3 9.5 6 10" stroke="white" strokeWidth="1" fill="none" opacity="0.7" />
      <path d="M8 3 C8 3 12 2 14 5 C15 7 13 9.5 10 10" stroke="white" strokeWidth="1" fill="none" opacity="0.7" />
    </svg>
  )
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
            <div className="flex items-center gap-1.5">
              <LotusIconWhite />
              <span className="font-body font-bold text-lg text-white">{logo}</span>
            </div>
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
