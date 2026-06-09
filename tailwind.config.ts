import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Core Solids ── */
        ink:    "#0d0d0d",
        cream:  "#f5f0eb",
        chalk:  "#fafaf8",
        stone:  "#e8e2da",
        ash:    "#c4bdb4",

        /* ── Accent Solids ── */
        blue:   "#2563eb",
        "blue-light": "#dbeafe",
        yellow: "#f5c518",
        "yellow-light": "#fef9c3",
        red:    "#dc2626",
        "red-light": "#fee2e2",
        purple: "#7c3aed",
        "purple-light": "#ede9fe",
        green:  "#16a34a",
        "green-light": "#dcfce7",

        /* ── Dark surface ── */
        "dark-1": "#0d0d0d",
        "dark-2": "#161616",
        "dark-3": "#1e1e1e",
        "dark-4": "#2a2a2a",
        "dark-5": "#3a3a3a",
      },
      fontFamily: {
        bebas: ["'Bebas Neue'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        "2xl":  "16px",
        "3xl":  "24px",
        "4xl":  "32px",
        "5xl":  "40px",
      },
      boxShadow: {
        "soft":   "0 4px 24px rgba(0,0,0,0.07)",
        "medium": "0 8px 40px rgba(0,0,0,0.10)",
        "strong": "0 16px 64px rgba(0,0,0,0.14)",
        "card":   "0 2px 12px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)",
        "inset":  "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      fontSize: {
        "10xl": ["10rem",   { lineHeight: "0.88" }],
        "9xl":  ["8rem",    { lineHeight: "0.90" }],
        "8xl":  ["6rem",    { lineHeight: "0.92" }],
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up":  "fade-up  0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in":  "fade-in  0.5s ease forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
