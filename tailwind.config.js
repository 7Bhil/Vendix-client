
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vendix: {
          brand: "#1e40af",
          "brand-dark": "#1e3a8a",
          ink: "#0f172a",
          surface: "#f8fafc",
        },
      },
    },
  },
  plugins: [],
}
