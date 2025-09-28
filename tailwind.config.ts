import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-scale-up': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95) translateY(-8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-scale-up': 'fade-in-scale-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
export default config
