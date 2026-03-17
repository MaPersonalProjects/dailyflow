/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        habit: {
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#22c55e',
          teal: '#14b8a6',
          blue: '#3b82f6',
          indigo: '#6366f1',
          purple: '#a855f7',
          pink: '#ec4899',
        }
      }
    },
  },
  plugins: [],
}
