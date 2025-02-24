/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "light-primary": "#F7F7F7",
        "dark-primary": "#101010",
        "light-secondary": "#C5C5C5",
        "light-secondary-200": "#E3E3E3",
        "light-secondary-300": "#898989",
        "dark-secondary": "#2B2B2B",
        "dark-secondary-200": "#424242",
        "dark-secondary-300": "#5C5D61",
        "message-light": "#E4E5E7",
        "message-dark": "#374151",
      }
    },
  },
  plugins: [],
}