import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: "var(--color-surface-primary)",
          secondary: "var(--color-surface-secondary)",
          dark: "var(--color-surface-dark)",
        },
        brand: {
          primary: {
            DEFAULT: "var(--color-brand-primary)",
            hover: "var(--color-brand-primary-hover)",
            subtle: "var(--color-brand-primary-subtle)",
          },
          secondary: "var(--color-brand-secondary)",
        },
        accent: {
          gold: {
            DEFAULT: "var(--color-accent-gold)",
            subtle: "var(--color-accent-gold-subtle)",
          },
        },
        success: {
          DEFAULT: "var(--color-success)",
          subtle: "var(--color-success-subtle)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          subtle: "var(--color-error-subtle)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          focus: "var(--color-border-focus)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: "var(--font-size-hero)",
        h2: "var(--font-size-h2)",
        h3: "var(--font-size-h3)",
        body: "var(--font-size-body)",
        small: "var(--font-size-small)",
        caption: "var(--font-size-caption)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
        card: "var(--radius-lg)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
      },
    },
  },
  plugins: [],
};

export default config;
