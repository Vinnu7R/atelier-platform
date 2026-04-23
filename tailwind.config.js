/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        mono: ["'DM Mono'", "monospace"],
        sans: ["'Syne'", "sans-serif"],
      },
      colors: {
        ink: "#0e0d0c",
        paper: "#f5f0e8",
        warm: "#f0e6d0",
        accent: "#c8502a",
        accent2: "#2a4c8a",
        muted: "#8a8070",
      },
    },
  },
  plugins: [],
};
