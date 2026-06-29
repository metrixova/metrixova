
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        metrix: {
          bg: '#0B090A',
          surface: '#161A1D',
          crimson: '#A4161A',
          'crimson-bright': '#BA181B',
          'crimson-alert': '#E5383B',
          'crimson-dark': '#660708',
          muted: '#B1A7A6',
          light: '#D3D3D3',
          offwhite: '#F5F3F4',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        hero: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
