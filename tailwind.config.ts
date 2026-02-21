import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // 'class' strategy: next-themes sets class="dark" on <html>
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Fixed accent colours — same in light and dark
        primary:   "#0E7490",
        secondary: "#065F46",
        warning:   "#B45309",
        // Semantic tokens driven by CSS variables (switch with .dark class)
        background: "var(--color-background)",
        card:       "var(--color-card)",
        "text-main":"var(--color-text-main)",
        muted:      "var(--color-muted)",
        border:     "var(--color-border)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        base: ["17px", { lineHeight: "1.7" }],
        sm: ["15px", { lineHeight: "1.6" }],
        h1: ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["20px", { lineHeight: "1.4", fontWeight: "600" }],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      spacing: {
        "touch": "48px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
