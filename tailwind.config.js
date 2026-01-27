/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#3b82f6',
          dark: '#60a5fa',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'in': 'fade-in 0.2s ease-out, zoom-in 0.2s ease-out',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

