import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["'Quicksand'", "sans-serif"],
        body: ["'Lato'", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        heading: "hsl(var(--text-heading))",
        "text-body": "hsl(var(--text-body))",
        "text-price": "hsl(var(--text-price))",
        "text-price-old": "hsl(var(--text-price-old))",
        "surface-light": "hsl(var(--surface-light))",
        "surface-banner": "hsl(var(--surface-banner))",
        "badge-hot": "hsl(var(--badge-hot))",
        "badge-sale": "hsl(var(--badge-sale))",
        "badge-new": "hsl(var(--badge-new))",
        "badge-discount": "hsl(var(--badge-discount))",
        "brand-yellow": "hsl(var(--brand-yellow))",
        "brand-orange": "hsl(var(--brand-orange))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-rtl"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        // RTL-aware margin utilities
        ".ms-auto": {
          "margin-inline-start": "auto",
        },
        ".me-auto": {
          "margin-inline-end": "auto",
        },
        // RTL-aware padding utilities
        ".ps-0": {
          "padding-inline-start": "0",
        },
        ".pe-0": {
          "padding-inline-end": "0",
        },
        ".ps-1": {
          "padding-inline-start": "0.25rem",
        },
        ".pe-1": {
          "padding-inline-end": "0.25rem",
        },
        ".ps-2": {
          "padding-inline-start": "0.5rem",
        },
        ".pe-2": {
          "padding-inline-end": "0.5rem",
        },
        ".ps-3": {
          "padding-inline-start": "0.75rem",
        },
        ".pe-3": {
          "padding-inline-end": "0.75rem",
        },
        ".ps-4": {
          "padding-inline-start": "1rem",
        },
        ".pe-4": {
          "padding-inline-end": "1rem",
        },
        ".ps-6": {
          "padding-inline-start": "1.5rem",
        },
        ".pe-6": {
          "padding-inline-end": "1.5rem",
        },
        ".ps-8": {
          "padding-inline-start": "2rem",
        },
        ".pe-8": {
          "padding-inline-end": "2rem",
        },
        // RTL-aware text alignment
        ".text-start": {
          "text-align": "start",
        },
        ".text-end": {
          "text-align": "end",
        },
        // RTL-aware border utilities
        ".border-s": {
          "border-inline-start-width": "1px",
        },
        ".border-e": {
          "border-inline-end-width": "1px",
        },
        // RTL-aware rounded corners
        ".rounded-s": {
          "border-start-start-radius": "0.25rem",
          "border-end-start-radius": "0.25rem",
        },
        ".rounded-e": {
          "border-start-end-radius": "0.25rem",
          "border-end-end-radius": "0.25rem",
        },
        ".rounded-s-lg": {
          "border-start-start-radius": "var(--radius)",
          "border-end-start-radius": "var(--radius)",
        },
        ".rounded-e-lg": {
          "border-start-end-radius": "var(--radius)",
          "border-end-end-radius": "var(--radius)",
        },
      });
    }),
  ],
} satisfies Config;
