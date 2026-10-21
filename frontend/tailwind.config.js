/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#10201E',
        muted: '#566663',
        line: '#D5DEDC',
        mist: '#EEF3F2',
        brand: { DEFAULT: '#0F6B62', dark: '#0A4F48', deep: '#073832', soft: '#D6EBE7' },
        danger: { DEFAULT: '#B42318', soft: '#FDECEA' },
        ok: { DEFAULT: '#1B6E3A', soft: '#E3F4E8' },
      },
    },
  },
  plugins: [],
};
