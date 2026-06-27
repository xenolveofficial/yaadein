import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Note: Uncomment Toaster once your manually added toaster files are committed/visible in the project.
// import { Toaster } from "@/components/ui/toaster";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Yaadein",
  description: "AI-powered event photo and video sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        plusJakartaSans.variable,
        cormorantGaramond.variable
      )}
    >
      <body className="min-h-full flex flex-col font-body text-text-primary bg-surface-primary antialiased">
        {children}
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
