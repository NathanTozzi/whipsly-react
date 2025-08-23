/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whipsly: {
          blue: '#5FBFF9',
          navy: '#0A1F44',
          silver: '#D1D5DB',
          ghost: '#F8FAFC',
          'navy-light': '#1E3A8A',
          'blue-light': '#93C5FD'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-gentle': 'bounceGentle 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'whipsly': '0 4px 6px -1px rgba(95, 191, 249, 0.1), 0 2px 4px -1px rgba(95, 191, 249, 0.06)',
        'whipsly-lg': '0 10px 15px -3px rgba(95, 191, 249, 0.1), 0 4px 6px -2px rgba(95, 191, 249, 0.05)',
        'navy': '0 4px 6px -1px rgba(10, 31, 68, 0.1), 0 2px 4px -1px rgba(10, 31, 68, 0.06)'
      },
      backdropBlur: {
        xs: '2px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
  ],
}