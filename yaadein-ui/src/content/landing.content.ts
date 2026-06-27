export const landingContent = {
  nav: {
    logo: "YAADEIN",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "pricing" },
      // { label: "For Photographers", href: "#photographers" },
    ],
    cta: "Create Free Event →",
  },

  hero: {
    sectionLabel: "FOR INDIAN WEDDINGS & CELEBRATIONS",
    h1: "Every guest's photo. One beautiful gallery.",
    subheading:
      "Share a QR code. Guests upload from their phones. You get every candid moment — organized, searchable, and yours forever.",
    ctaPrimary: "Create Free Event →",
    ctaGhost: "See a live demo",
    socialProof: [
      "✦ 10,000+ events",
      "✦ No app download needed",
      "✦ Trusted by Indian families",
    ],
  },

  howItWorks: {
    sectionLabel: "HOW Yaadein WORKS",
    steps: [
      {
        icon: "QrCode" as const,
        title: "Create your event",
        body: "2 minutes. QR code ready.",
      },
      {
        icon: "Upload" as const,
        title: "Guests upload instantly",
        body: "Scan, upload, done. No app. No login.",
      },
      {
        icon: "Grid2x2" as const,
        title: "One gallery, all memories",
        body: "Browse, search, download. Yours for a year.",
      },
    ],
  },

  features: [
    {
      label: "AI-ORGANISED",
      title: "Smart gallery, AI-organized",
      body: "Our AI automatically groups photos by face, moment, and location — so you never hunt for a specific candid again.",
    },
    {
      label: "SHARE BACK",
      title: "Share back to WhatsApp",
      body: "One tap sends guests a personalized gallery link over WhatsApp. No app, no sign-up, no friction.",
    },
    {
      label: "VENUE READY",
      title: "Built for Indian venues",
      body: "Chunked multipart uploads work even on crowded venue Wi-Fi. Every photo makes it through.",
    },
  ],

  testimonials: {
    sectionLabel: "FAMILIES ACROSS INDIA TRUST Yaadein",
    items: [
      {
        quote:
          "We had 600 guests at our daughter's wedding. Yaadein collected over 4,000 photos without any fuss. Best decision we made.",
        name: "Rekha Nair",
        city: "Kochi",
        role: "Mother of the bride",
        rating: 5,
      },
      {
        quote:
          "My clients now expect Yaadein at every event. The QR code on the table is a game changer — guests love it.",
        name: "Arjun Sharma",
        city: "Delhi",
        role: "Wedding Photographer",
        rating: 5,
      },
      {
        quote:
          "Even my naani figured it out! She just scanned and uploaded directly from her phone. Zero confusion.",
        name: "Priya Menon",
        city: "Bengaluru",
        role: "Bride",
        rating: 5,
      },
    ],
  },

  footer: {
    logo: "Yaadein",
    tagline: "Made with ❤️ for Indian celebrations",
    columns: [
      {
        heading: "Product",
        links: ["Features", "Pricing", "QR Sharing", "AI Gallery"],
      },
      {
        heading: "Use Cases",
        links: ["Weddings", "Birthdays", "Corporate", "Engagement"],
      },
      {
        heading: "Photographers",
        links: ["Partner Program", "Reseller Plans", "API Access", "Case Studies"],
      },
      {
        heading: "Company",
        links: ["About", "Blog", "Privacy Policy", "Terms of Use"],
      },
    ],
    copyright: `© ${new Date().getFullYear()} Yaadein. All rights reserved.`,
  },
} as const;
