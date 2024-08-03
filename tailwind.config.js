module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#3c1053'
      },
      minWidth: {
        'md': '300px',
      },
      maxWidth: {
        'md': '850px',
      },
    },
  },
  plugins: [],
};
