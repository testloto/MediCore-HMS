/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: { xs:'375px', sm:'640px', md:'768px', lg:'1024px', xl:'1280px', '2xl':'1536px' },
    extend: {
      fontFamily: {
        body:    ['DM Sans','sans-serif'],
        display: ['Playfair Display','serif'],
        mono:    ['JetBrains Mono','monospace'],
      },
      colors: {
        brand: { 300:'#5fd8c4', 400:'#33cfb4', 500:'#18ae94', 600:'#0e9a82', 700:'#0a7a68' },
      },
    },
  },
  plugins: [],
}
