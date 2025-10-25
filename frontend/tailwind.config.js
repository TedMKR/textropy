/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Основная палитра на основе дизайн-кода
                primary: {
                    DEFAULT: '#00A779', // Основной цвет элементов интерфейса
                    50: '#E6FFF7',
                    100: '#CCFFEF',
                    200: '#99FFDF',
                    300: '#66FFCF',
                    400: '#33FFBF',
                    500: '#00A779', // Основной
                    600: '#008661',
                    700: '#006549',
                    800: '#004331',
                    900: '#002218',
                    dark: '#008661',
        },
          background: {
              DEFAULT: '#F5FFFA', // Основной цвет страниц (светлая мятная тема)
              dark: '#0F172A',
          },
          // Дополнительные цвета для темной темы
          dark: {
              100: '#1E293B',
              200: '#334155',
              300: '#475569',
          }
      },
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
        },
        boxShadow: {
            'glow': '0 0 20px rgba(0, 167, 121, 0.3)',
            'glow-lg': '0 0 40px rgba(0, 167, 121, 0.4)',
        },
        animation: {
            'fade-in': 'fadeIn 0.5s ease-in-out',
            'slide-up': 'slideUp 0.5s ease-out',
        },
        keyframes: {
            fadeIn: {
                '0%': {opacity: '0'},
                '100%': {opacity: '1'},
            },
            slideUp: {
                '0%': {transform: 'translateY(20px)', opacity: '0'},
                '100%': {transform: 'translateY(0)', opacity: '1'},
            },
        },
    },
  },
    plugins: [],
}
