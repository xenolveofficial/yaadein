"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/atoms/Button"
import { landingContent } from "@/content/landing.content"
import { cn } from "@/lib/utils"
import * as Dialog from "@radix-ui/react-dialog"

export interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const { logo, links, cta } = landingContent.nav

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-surface-primary/95 backdrop-blur-sm border-b border-border transition-shadow duration-200",
        scrolled && "shadow-card",
        className
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/assets/yaadein-logo.png"
            alt="Yaadein"
            width={120}
            height={40}
            className="h-20 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors font-body"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="primary" size="sm" asChild>
            <Link href="dashboard/create-event">{cta}</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className="md:hidden text-text-primary p-1.5 rounded-md hover:bg-surface-secondary transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-surface-primary p-6 shadow-elevated flex flex-col">
              <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                  <Image
                    src="/assets/yaadein-logo.png"
                    alt="Yaadein"
                    width={120}
                    height={40}
                    className="h-20 w-auto"
                  />
                </Link>
                <Dialog.Close asChild>
                  <button className="text-text-muted hover:text-text-primary transition-colors p-1" aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>

              <ul className="flex flex-col gap-2 flex-1">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 px-2 text-base font-medium font-body text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-md transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-border">
                <Button variant="primary" fullWidth asChild>
                  <Link href="dashboard/create-event" onClick={() => setOpen(false)}>{cta}</Link>
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  )
}
