/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'btn-primary',
    'btn-secondary',
    'input-field',
    'card',
    'arabic-numerals',
    'sr-only',
    // Landing-only classes
    'landing-btn-primary',
    'landing-btn-secondary',
    'landing-card',
    'container-app',
    'section-eyebrow',
    'section-title',
    'gradient-text',
    'no-scrollbar',
    // Safelist for dynamic classes
    { pattern: /grid-cols-\d/ },
    { pattern: /gap-\d/ },
    { pattern: /p[xy]?-\d/ },
    { pattern: /text-\w+-\d+/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        'iransans': ['iransans', 'sans-serif'],
        'iran': ['iransans', 'sans-serif'],
        'peyda': ['Peyda', 'iransans', 'sans-serif'],
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // RTL-friendly breakpoints
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1024px',
        'wide': '1440px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      // --- Added for Landing page only ---
      colors: {
        brand: {
          50: "#f3f1ff",
          100: "#efedff",
          200: "#d9d4ff",
          300: "#b3a8ff",
          400: "#8a7bff",
          500: "#5b47fb",
          600: "#4935e0",
          700: "#3a29b8",
          800: "#2a1f7a",
          900: "#1c1552",
        },
        // sevof.com: violet -> purple -> teal accents, deep ink text
        accent: { purple: "#9b5cff", teal: "#10c99a" },
        ink: {
          700: "#3b3f5c",
          800: "#1a1d38",
          900: "#0d0f23",
        },
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(11, 18, 32, 0.15)",
        soft: "0 4px 20px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      // --- end additions ---
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        // Added for Landing
        'float-slow': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Added for Landing
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}