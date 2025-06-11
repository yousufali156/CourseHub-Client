import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee var(--marquee-animation-duration) linear infinite',
        colorChange: 'colorChange 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': {
            transform:
              'translateX(calc(-1 * var(--marquee-elements) * 80px))',
          },
        },
        colorChange: {
          '0%, 100%': { color: '#3b82f6' },   // Blue
          '33%': { color: '#8b5cf6' },        // Purple
          '66%': { color: '#f97316' },        // Orange
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.animate-marquee': {
          display: 'flex',
          width: 'fit-content',
          animation: 'marquee var(--marquee-animation-duration) linear infinite',
        },
      });
    }),
  ],
};
