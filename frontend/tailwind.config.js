/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cane-dark': '#0f172a',
        'cane-darker': '#020617',
        'cane-accent': '#22c55e',
        'cane-warning': '#f59e0b',
        'cane-danger': '#ef4444',
      },
    },
  },
  plugins: [],
}
