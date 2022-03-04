module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  variants: {
    height: ['responsive', 'hover', 'focus'],
    extend: {
      opacity: ['disabled'],
    }
  },
  plugins: [],
}
