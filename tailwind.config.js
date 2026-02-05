/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // EXACT VITRAGVANI PALETTE
        maroon: {
          600: '#9b1c1c', // Their Dark Red text/borders
          700: '#771d1d',
          800: '#63171b',
          900: '#450a0a',
        },
        saffron: {
          500: '#F28C28', // The navigation bar orange
          100: '#FFF4E6', // Light highlights
        },
        cream: {
          50: '#FFFBF5',  // The main page background (Light & Clean)
          100: '#FDEFD0', // Subtle yellow accents
          200: '#F0E68C', // Your darker yellow (use sparingly)
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}