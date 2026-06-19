/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "!./node_modules/**"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
