/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./core/ui/**/*.{js,ts,jsx,tsx}"],

  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)"],
      },
      borderWidth: {
        0.5: "0.5px",
      },
      fontSize: {
        xs: "8px",
        sm: "11px",
        base: "14px",
      },
    },
  },
  plugins: [],
};
