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
        lucid: {
          ink: "#11110F",
          bone: "#E9E5DA",
          ash: "#1A1A17",
          surface: "#1A1A17",
          stone: "#9A988F",
          oxide: "#C56A43",
          dust: "#71808A",
          moss: "#89956A",
          ember: "#B84C45",
          border: "rgba(154, 152, 143, 0.15)",
          borderHover: "rgba(154, 152, 143, 0.35)",
        },
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      transitionTimingFunction: {
        "lucid-standard": "cubic-bezier(0.2, 0.0, 0.2, 1)",
        "lucid-enter": "cubic-bezier(0.0, 0.0, 0.2, 1)",
        "lucid-exit": "cubic-bezier(0.4, 0.0, 1, 1)",
        "lucid-cinematic": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
      },
      animation: {
        breathe: "breathe 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
