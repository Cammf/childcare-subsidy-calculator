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
        primary: "#0E7490",
        secondary: "#065F46",
        warning: "#B45309",
        background: "#F7F8FA",
        card: "#FFFFFF",
        "text-main": "#1A202C",
        muted: "#4A5568",
        border: "#E2E8F0",
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
