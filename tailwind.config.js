/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./core/ui/**/*.{js,ts,jsx,tsx}"],

  darkMode: "class",
  theme: {
    extend: {
      borderColor: {
        white: "rgba(255, 255, 255, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)"],
      },
      fontSize: {
        xs: "9px",
        sm: "11px",
        base: "14px",
      },
    },
  },
  plugins: [],
};
