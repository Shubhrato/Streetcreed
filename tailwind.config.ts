import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141310",
        "ink-soft": "#3E3B35",
        mist: "#7A756B",
        paper: "#FAF8F4",
        bone: "#F1ECE3",
        linen: "#E5DED1",
        line: "#DDD6C9",
        accent: "#6E4F2A",
        "accent-deep": "#4A3419",
        success: "#2F5D3A",
        error: "#9C2B2B",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: { eyebrow: "0.18em" },
      transitionTimingFunction: { expo: "cubic-bezier(0.32, 0.72, 0, 1)" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
        "drawer-in": { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.32,0.72,0,1) both",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 1.4s linear infinite",
        "drawer-in": "drawer-in 0.32s cubic-bezier(0.32,0.72,0,1) both",
        "fade-in": "fade-in 0.24s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
