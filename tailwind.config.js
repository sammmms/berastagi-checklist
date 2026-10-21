/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c5dfd4',
          300: '#9bc6b6',
          400: '#6ca693',
          500: '#4e8a77',
          600: '#3a6e5e',
          700: '#30584c',
          800: '#28463e',
          900: '#233b34',
        }
      }
    },
  },
  plugins: [],
}
