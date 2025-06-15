import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        marquee: 'marquee var(--marquee-animation-duration) linear infinite',
        colorChange: 'colorChange 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        colorChange: {
          '0%': { color: '#3b82f6' },   // Blue
          '25%': { color: '#8b5cf6' },  // Purple
          '50%': { color: '#f97316' },  // Orange
          '75%': { color: '#10b981' },  // Emerald
          '100%': { color: '#3b82f6' }, // Blue again
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': {
            transform: 'translateX(calc(-1 * var(--marquee-elements) * 80px))',
          },
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
