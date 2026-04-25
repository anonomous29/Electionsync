/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          dark: '#0f172a',
          light: '#f8fafc',
          primary: '#2563eb',
          accent: '#10b981',
          danger: '#ef4444',
          surface: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
