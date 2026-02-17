import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple Color Palette - Minimal, clean design
        treigo: {
          cream: '#FFFFFF',      // Background primary (white)
          sage: '#F5F5F7',       // Secondary background (light gray)
          olive: '#E5E5E7',      // Tertiary background (medium gray)
          forest: '#0071E3',     // Primary blue (Apple blue)
        },
        // Extended palette for UI
        background: '#FFFFFF',
        foreground: '#000000',
        primary: {
          DEFAULT: '#0071E3',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F5F5F7',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#0071E3',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F5F7',
          foreground: '#666666',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#FF3B30',
          foreground: '#FFFFFF',
        },
        border: '#D5D5D7',
        input: '#F5F5F7',
        ring: '#0071E3',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        display: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      boxShadow: {
        'treigo': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'treigo-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
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
      },
    },
  },
  plugins: [],
}

export default config
