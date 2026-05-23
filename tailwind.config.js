/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(34, 211, 238, 0.2), 0 10px 40px rgba(2, 132, 199, 0.25)',
      },
    },
  },
  plugins: [],
}
