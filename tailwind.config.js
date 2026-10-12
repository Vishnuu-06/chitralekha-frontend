/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#14181c', // Signature Letterboxd dark background
          subtle: '#1b2228',  // Letterboxd panel / card background
          muted: '#202830',   // Letterboxd secondary card / shelf background
          highlight: '#2c3440', // Letterboxd elevated card / hover state
          dark: '#0f1215',
        },
        charcoal: {
          DEFAULT: '#ffffff',
          900: '#ffffff',     // Primary title / text on dark
          800: '#e0e6ec',     // Bright header
          700: '#c8d4e0',     // Light grey
          600: '#99aabb',     // Standard Letterboxd body text
          500: '#778899',     // Subtle text
          400: '#667788',     // Letterboxd muted captions
          300: '#445566',     // Letterboxd secondary border
          200: '#2c3440',     // Letterboxd subtle border
          100: '#1b2228',     // Dark container
          light: '#99aabb',
        },
        'warm-grey': '#2c3440', // Letterboxd card border
        muted: '#667788',       // Letterboxd muted grey
        // Letterboxd signature action accents
        lb: {
          green: '#00e054',      // Letterboxd signature bright green
          greenHover: '#00b845',
          orange: '#ff8000',     // Letterboxd star rating / reviews amber
          blue: '#40bcf4',       // Letterboxd member / profile blue
          dark: '#14181c',       // Background
          card: '#1b2228',       // Card background
          border: '#2c3440',     // Card border
          borderHover: '#445566',
          text: '#99aabb',
          textWhite: '#ffffff',
        },
        burgundy: {
          DEFAULT: '#00e054',    // Mapped to Letterboxd action green
          light: '#00b845',
          dark: '#008a34',
          700: '#00e054',
          800: '#00c74a',
          900: '#009939',
          100: '#163322',
          50: '#0d2215',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      aspectRatio: {
        'poster': '2 / 3',
        'book': '2 / 3',
      },
    },
  },
  plugins: [],
}
