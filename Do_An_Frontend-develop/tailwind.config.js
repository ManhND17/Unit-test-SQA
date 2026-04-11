/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#00a651',
        blue: {
          DEFAULT: '#2563eb',
        },
      },
      backgroundColor: {
        primary: '#0ea5e9',
        secondary: '#00a651',
      },
      boxShadow: {
        custom1: '0px 0px 20px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
