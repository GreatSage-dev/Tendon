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
        tendon: {
          bg: '#0B0E14',
          card: '#121721',
          border: '#1E2638',
          accent: '#00F0FF',
          accentHover: '#00D1DF',
          warning: '#FFB800',
          danger: '#FF3366',
          success: '#00E599',
          muted: '#8A99AD'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
