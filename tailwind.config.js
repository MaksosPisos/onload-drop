/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [require("daisyui")],
}