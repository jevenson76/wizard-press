/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
      fontSize: {
        'title': ['3.5rem', { lineHeight: '1.2', letterSpacing: '0.05em' }],
        'subtitle': ['1.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'nav': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.03em' }],
      },
      colors: {
        'wizard': {
          'blue': '#1E3A8A',
          'accent': '#3B82F6',
          'text': '#E2E8F0',
        },
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
      },
    },
  },
  plugins: [],
};