module.exports = {
  purge: [
      'src/components/**/*.vue',
      'web/index.html',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      center: true,
      padding: '1rem',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
