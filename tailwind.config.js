/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a12',
        card: '#1a1a2e',
        primary: '#00d4ff',
        secondary: '#7b2ffc',
        glow: '#00d4ff40',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px #00d4ff' },
          '50%': { boxShadow: '0 0 30px #00d4ff, 0 0 60px #7b2ffc' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        bounceCoin: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.2) rotate(15deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        tapPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        jumpUp: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-100px)' },
          '100%': { transform: 'translateY(0)' },
        },
        landDown: {
          '0%': { transform: 'translateY(-20px) scale(1.1)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        pop: {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '70%': { transform: 'scale(1.2)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        float: 'float 2s ease-in-out infinite',
        glowPulse: 'glowPulse 1.5s ease-in-out infinite',
        slideUp: 'slideUp 0.5s ease-out forwards',
        bounceCoin: 'bounceCoin 0.6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        tapPulse: 'tapPulse 0.3s ease-in-out',
        jumpUp: 'jumpUp 0.5s ease-in-out',
        landDown: 'landDown 0.3s ease-out',
        pop: 'pop 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}