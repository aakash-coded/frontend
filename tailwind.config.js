/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1b5e20", // Deep Green
        secondary: "#f9fbe7", // Soft Cream
        accent: "#ffb300", // Gold accents
      }
    },
  },
  plugins: [],
}
