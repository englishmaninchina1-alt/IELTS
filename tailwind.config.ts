import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14161C",
        slate1: "#1a2138",
        paper: "#F7F4EE",
        lime: "#C7F464",
        limeDeep: "#4E6B0B",
        teal: "#5EEAD4",
        tealDeep: "#0F766E",
        coral: "#FF8A6B",
        coralDeep: "#B4451F",
        violet: "#A78BFA",
        violetDeep: "#6D4AC4",
        amberDeep: "#8A6100",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Georgia", "ui-serif", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(78,107,11,0.18), 0 12px 40px -18px rgba(15,118,110,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
