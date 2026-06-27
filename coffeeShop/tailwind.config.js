/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 YEH ADD KARO
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coffee Brand Colors
        coffee: {
          dark: '#2C1810',
          DEFAULT: '#6F4E37',
          light: '#8B6914',
          mild: '#A67B5B',
        },
        accent: {
          caramel: '#D4A574',
          gold: '#C68E5C',
        },
        bg: {
          primary: '#FDF8F3',
          secondary: '#F5EDE3',
          card: '#FFFFFF',
          hover: 'rgba(111, 78, 55, 0.05)',
        },
        text: {
          primary: '#2C1810',
          secondary: '#5C4033',
          muted: '#8B7355',
        },
        border: {
          DEFAULT: 'rgba(44, 24, 16, 0.08)',
        },
      },
    },
  },
  plugins: [],
}