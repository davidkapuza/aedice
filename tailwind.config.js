/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./core/ui/**/*.{js,ts,jsx,tsx}"],

  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)"],
        mono: ["var(--font-space_mono)"],
      },
    },
  },
  plugins: [],
};
