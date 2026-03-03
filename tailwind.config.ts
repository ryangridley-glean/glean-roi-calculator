import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glean: {
          blue:    '#1A73E8',
          indigo:  '#3D5AFE',
          violet:  '#7C4DFF',
          surface: '#F8F9FA',
          border:  '#E8EAED',
          sidebar: '#FFFFFF',
          text: {
            primary:   '#202124',
            secondary: '#5F6368',
            tertiary:  '#9AA0A6',
          },
        },
      },
      fontFamily: {
        sans: ['"Google Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.08)',
        'card-hover': '0 4px 12px 0 rgba(60,64,67,0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config
