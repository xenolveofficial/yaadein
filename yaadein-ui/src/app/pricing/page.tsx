import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { PricingTabs } from "@/components/organisms/PricingTabs";
import { FeatureComparison } from "@/components/organisms/FeatureComparison";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Pricing — Yaadein",
  description: "Simple pricing for every celebration. One price per event. No monthly fees.",
};

const FAQ_ITEMS = [
  {
    value: "expire",
    question: "What happens when my event expires?",
    answer: "After your event's active retention period (90, 180, or 365 days), the gallery is deactivated. Guests will no longer be able to view, upload, or download photos. We keep a secure backup of your files for a 30-day grace period, after which they are permanently deleted unless you upgrade your plan or purchase the Forever Archive add-on."
  },
  {
    value: "upgrade",
    question: "Can I upgrade my plan after the event starts?",
    answer: "Yes! You can upgrade your plan at any time during the active period of your event. You will only pay the prorated difference between your current plan and the new plan. All uploaded media, custom branding, and settings will carry over seamlessly."
  },
  {
    value: "safety",
    question: "Is my data safe? What about DPDP compliance?",
    answer: "Data privacy is our top priority. We are fully compliant with India's DPDP Act. Guest face data is processed strictly to identify their photos within the event, requires explicit consent, and is encrypted. We do not store biometric data permanently, nor do we sell or share personal data. Once the event or archive expires, all associated data is permanently purged."
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-primary flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-surface-secondary/40 to-transparent">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
            <SectionLabel text="SIMPLE PRICING FOR EVERY CELEBRATION" />
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight mt-2">
              One price per event. <br />
              <span className="text-brand-primary">No monthly fees.</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-text-secondary max-w-2xl mt-4 leading-relaxed">
              Pay only when you celebrate. Plans in INR, built with love for Indian weddings and special events.
            </p>
          </div>
        </section>

        {/* Pricing Tabs & Plan Cards */}
        <section className="relative">
          <PricingTabs />
        </section>

        {/* Feature Comparison Table */}
        <section className="py-12 bg-surface-secondary/20 border-y border-border">
          <FeatureComparison />
        </section>

        {/* Forever Archive Add-On Card */}
        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] text-white p-8 md:p-12 shadow-elevated flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="flex-1 flex flex-col gap-4 text-center lg:text-left z-10">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="text-2xl" role="img" aria-label="filing cabinet">🗄️</span>
                <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
                  Forever Archive Add-On
                </h3>
                <span className="bg-white/10 text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  ₹999 / year
                </span>
              </div>
              <p className="font-body text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
                Never lose your core celebration memories. Move your photos to ultra-secure, DPDP-compliant cold storage.
                Keep the gallery link alive for family members to view and download forever.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-2">
                <span className="text-xs font-semibold text-white/60">Available for:</span>
                <span className="bg-accent-gold/20 text-accent-gold border border-accent-gold/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Premium
                </span>
                <span className="bg-success-subtle text-success border border-success/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Elite
                </span>
              </div>
            </div>

            <div className="shrink-0 z-10 w-full lg:w-auto">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                className="bg-white text-[#1e1b4b] hover:bg-white/90 border-transparent shadow-md"
                asChild
              >
                <Link href="/create?plan=premium&archive=true">
                  Add to Event &rarr;
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="text-center mb-10">
            <h3 className="font-heading text-2xl font-bold text-text-primary">
              Frequently Asked Questions
            </h3>
            <p className="text-text-secondary text-sm mt-1">
              Have questions about our pricing? We have answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <AccordionItem
                key={faq.value}
                value={faq.value}
                className="border border-border rounded-xl bg-surface-primary shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <AccordionTrigger className="p-5 font-body font-semibold text-base text-text-primary hover:text-brand-primary no-underline hover:no-underline flex items-center justify-between w-full">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm text-text-secondary leading-relaxed bg-surface-secondary/10">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <Footer />
    </div>
  );
}
