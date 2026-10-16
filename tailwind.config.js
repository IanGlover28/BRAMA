const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const scale = (name) =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [
      step,
      themed(`${name}-${step}`),
    ])
  );

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",       // all pages & layouts
    "./src/components/**/*.{js,ts,jsx,tsx}" // all components
  ],
  theme: {
    extend: {
      // Values live in src/app/globals.css as CSS variables so they can
      // switch with the system light/dark preference.
      colors: {
        brand: scale("brand"),
        ink: scale("ink"),
        surface: {
          DEFAULT: themed("surface"),
          canvas: themed("surface-canvas"),
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      letterSpacing: {
        brand: "0.3em",
      },
    },
  },
  plugins: [],
}
