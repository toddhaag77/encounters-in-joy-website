/**
 * Tailwind build settings for encountersinjoy.org.
 *
 * Every page used to load Tailwind's Play CDN (a 120 KB script that generates
 * the CSS in the visitor's browser on every visit). The site now ships one
 * small compiled stylesheet instead, assets/site.css, built from this file +
 * tools/tailwind.css by `npm run build:css` (Netlify runs it on every deploy;
 * see package.json and netlify.toml).
 *
 * `content` lists every file that uses Tailwind classes. If a new page or
 * template is added somewhere else, add its path here or its classes will be
 * missing from the stylesheet.
 *
 * The `theme.extend` block is the palette the pages were designed with (it
 * was previously repeated inline in every page's <head>).
 */
module.exports = {
  content: ['./*.html', './tools/blog-templates.js'],
  theme: {
    extend: {
      colors: {
        crimson: { 50: '#fdf3f1', 100: '#fadcd5', 200: '#f1ad9f', 300: '#e57f6c', 400: '#d65543', 500: '#d63725', 600: '#c42a20', 700: '#a72017', 800: '#8f2e24', 900: '#65100b' },
        gold:    { 50: '#fff8e1', 100: '#ffeeba', 200: '#ffe085', 300: '#ffd052', 400: '#ffcc33', 500: '#f2cc5a', 600: '#d8a013', 700: '#b58015', 800: '#8a5a16', 900: '#623a14' },
        cream:   { 50: '#f9f7f6', 100: '#f4efe9', 200: '#efe5da', 300: '#e2ddd5', 400: '#d3c5b0', 500: '#b39c7d', 600: '#8e7558', 700: '#6e5841', 800: '#4f3f2e', 900: '#332820' },
        brown:   { 50: '#f6f1ec', 100: '#e6d8c8', 200: '#cdb293', 300: '#b08c66', 400: '#8c6c4a', 500: '#74503e', 600: '#5e4030', 700: '#4a3225', 800: '#3a2820', 900: '#2a1d18' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
      },
    },
  },
};
