import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050608',
        steel: '#0E1116',
        ash: '#8A8F98',
        bone: '#EEF0F3',
        afterburn: '#FF5B14',
        mach: '#5EC8FF',
      },
    },
  },
  plugins: [],
} satisfies Config;
