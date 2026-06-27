/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ===== SIRF DARK MODE KE LIYE =====
        dark: {
          bg: '#0F172A',        // Page background
          card: '#1E293B',      // Cards
          border: '#334155',    // Borders
          heading: '#F1F5F9',   // Headings
          text: '#94A3B8',      // Body text
          muted: '#64748B',     // Muted text
          primary: '#818CF8',   // Primary buttons
          accent: '#A78BFA',    // Accent elements
        }
      }
    },
  },
  plugins: [],
}