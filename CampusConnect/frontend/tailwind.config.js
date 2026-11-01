/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: '#7352A3',     // Royal Violet
          lavender: '#B9A1D8',   // Lavender
          coral: '#FF897C',      // Coral
          warm: '#F8F4F1',       // Warm White
          charcoal: '#30303C',   // Charcoal
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(115, 82, 163, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 12px 32px -4px rgba(115, 82, 163, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'coral-glow': '0 8px 24px -4px rgba(255, 137, 124, 0.35)',
      }
    },
  },
  plugins: [],
}
