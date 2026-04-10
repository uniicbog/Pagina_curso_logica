/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#418bf4',
        secondary: '#131313',
      },
      animation: {
        'pulse-highlight': 'pulse-highlight 1.5s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        'pulse-highlight': {
          '0%, 100%': { backgroundColor: 'rgba(65, 139, 244, 0.1)', borderColor: 'rgba(65, 139, 244, 0.3)' },
          '50%': { backgroundColor: 'rgba(65, 139, 244, 0.3)', borderColor: 'rgba(65, 139, 244, 0.6)' },
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      }
    },
  },
  plugins: [],
}
