/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkest: '#021024',
        sidebar: '#052659',
        cardMid: '#5483B3',
        cardLight: '#7DA0CA',
        accent: '#C1E8FF',
        main: '#C9D6E4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
