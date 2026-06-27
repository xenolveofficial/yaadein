import type { Metadata } from "next"
import { Navbar } from "@/components/organisms/Navbar"
import { HeroSection } from "@/components/organisms/HeroSection"
import { HowItWorksSection } from "@/components/organisms/HowItWorksSection"
import { FeatureSection } from "@/components/organisms/FeatureSection"
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection"
import { Footer } from "@/components/organisms/Footer"

export const metadata: Metadata = {
  title: "Yaadein — Share Wedding Photos Instantly",
  description:
    "QR-based photo sharing for Indian weddings and celebrations. Share a QR code, guests upload from their phones, you get every candid moment organized and searchable.",
  keywords: ["wedding photos", "QR photo sharing", "Indian wedding", "event gallery", "guest upload"],
  openGraph: {
    title: "Yaadein — Share Wedding Photos Instantly",
    description: "Every guest's photo. One beautiful gallery.",
    type: "website",
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-primary">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeatureSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
