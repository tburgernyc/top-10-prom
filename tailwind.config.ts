import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        onyx: {
          DEFAULT: "#050505",
          50: "#1a1a1a",
          100: "#111111",
          200: "#0a0a0a",
          900: "#050505",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8CC6A",
          dark: "#A88A1A",
        },
        platinum: {
          DEFAULT: "#C0C0C0",
          light: "#D8D8D8",
          dark: "#9A9A9A",
        },
        ivory: {
          DEFAULT: "#F5F5F5",
          warm: "#FAF8F5",
          cool: "#F0F0F2",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-display)", "serif"],
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        "glass-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "glass-lg": "0 24px 64px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.10)",
        "gold-glow": "0 0 24px rgba(212, 175, 55, 0.3)",
        "gold-glow-lg": "0 0 48px rgba(212, 175, 55, 0.4)",
      },
      borderColor: {
        "glass": "rgba(255, 255, 255, 0.08)",
        "glass-gold": "rgba(212, 175, 55, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "cursor-dot": "cursorDot 0.12s linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        cursorDot: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E8CC6A 0%, #D4AF37 50%, #A88A1A 100%)",
        "gold-gradient-subtle": "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
      },
      transitionDuration: {
        "350": "350ms",
      },
    },
  },
  plugins: [],
};

export default config;
