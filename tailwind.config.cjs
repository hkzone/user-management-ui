const { withTV } = require('tailwind-variants/transformer');

/** @type {import('tailwindcss').Config} */
module.exports = withTV({
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-ciel': '#F0F9FF',
        ciel: '#D2E9FA',
        black: '#0E0F23',
        ring: '#0E0F23',
      },
    },
    keyframes: {
      rotate: {
        '0%': {
          transform: 'rotate(0deg) translateX(var(--rotate-displacement))',
        },
        '100%': {
          transform: 'rotate(360deg) translateX(var(--rotate-displacement))',
        },
      },
      'rotate-counterclockwise': {
        '0%': {
          transform: 'rotate(0deg) translateX(var(--rotate-displacement))',
        },
        '100%': {
          transform: 'rotate(-360deg) translateX(var(--rotate-displacement))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-react-aria-components')],
});
