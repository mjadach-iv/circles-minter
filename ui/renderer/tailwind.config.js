import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '45rem',
        'sm': '9999rem',
        'md': '9999rem',
        'lg': '9999rem',
        'xl': '9999rem',
        '2xl': '9999rem'
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
