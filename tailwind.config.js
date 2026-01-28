/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector', // ✅ v4에서는 'class' 대신 'selector'를 권장합니다.
  theme: {
    extend: {},
  },
  plugins: [],
};
