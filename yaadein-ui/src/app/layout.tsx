import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { OfflineBanner } from "@/components/atoms/OfflineBanner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yaadein — Capture Every Moment",
  description: "AI-powered event photo and video sharing platform for Indian weddings and celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={cn(
        "h-full",
        "antialiased",
        plusJakartaSans.variable,
        cormorantGaramond.variable
      )}
    >
      <body className="min-h-full flex flex-col font-body text-text-primary bg-surface-primary antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <QueryProvider>
          <OfflineBanner />
          {children}
          <Toaster position="bottom-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
