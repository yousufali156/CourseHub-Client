/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        scrolling: 'scrolling var(--marquee-animation-duration) linear infinite',
      },
      keyframes: {
        scrolling: {
          '0%': { transform: 'translateX(0)' },
          '100%': {
            transform: 'translateX(calc(-1 * var(--marquee-element-width) * var(--marquee-elements)))',
          },
        },
      },
    },
  },
  plugins: [],
};
