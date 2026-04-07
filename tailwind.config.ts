import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand:   "#0ea5e9",
        surface: "#0f172a",
        panel:   "#1e293b",
        border:  "#334155",
        safe:    "#34d399",
        warn:    "#fbbf24",
        danger:  "#f87171",
        muted:   "#64748b",
        dim:     "#94a3b8",
        text:    "#f1f5f9",
      },
      animation: {
        "fade-up":   "fadeUp 0.4s ease-out both",
        "fade-in":   "fadeIn 0.3s ease-out both",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:   { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        pulseDot: { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: "0.4", transform: "scale(0.8)" } },
      },
    },
  },
  plugins: [],
};
export default config;
