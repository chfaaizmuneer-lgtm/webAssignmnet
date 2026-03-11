/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f4f2ee',
          100: '#e8e4dc',
          200: '#d1c9ba',
          300: '#b5a890',
          400: '#99876a',
          500: '#7d6c52',
          600: '#655745',
          700: '#4e4336',
          800: '#3a3229',
          900: '#28221c',
          950: '#171310',
        },
        accent: {
          DEFAULT: '#e85d26',
          light:   '#f07a4a',
          dark:    '#c44b1e',
        },
        surface: {
          light: '#faf9f7',
          dark:  '#141210',
        }
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.6s ease forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },               to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      typography: {
        DEFAULT: { css: { maxWidth: 'none' } }
      }
    },
  },
  plugins: [],
};
