/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#e0e5ec',
        primary: '#3a3d98',
        secondary: '#00c6ff',
        accent: '#ff6b6b',
        success: '#4CAF50',
        text: '#1e1e2f',
      },
      boxShadow: {
        'neumorphic': '8px 8px 16px #c5cad1, -8px -8px 16px #fbffff',
        'neumorphic-inset': 'inset 8px 8px 16px #c5cad1, inset -8px -8px 16px #fbffff',
        'neumorphic-sm': '4px 4px 8px #c5cad1, -4px -4px 8px #fbffff',
        'neumorphic-lg': '12px 12px 24px #c5cad1, -12px -12px 24px #fbffff',
      },
    },
  },
  plugins: [],
}