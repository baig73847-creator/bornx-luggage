# Bronx Luggage shop pages (80)

Extract into your project root (next to `index.html` and `package.json`), then `npm run dev`.

- `subpages/` : 80 pages. categories, products, luggage, bags, backpacks, men, women, plus 73 item pages.
- `css/shop.css`, `js/shop.js` : shop styles and GSAP (imports `gsap` from npm, already in your package.json).
- `public/images/products/` : 73 product images named `<slug>.webp`. Replace any file with a real photo using the same name.
- `vite.config.js` : lists every HTML page so `npm run build` includes all 80.
- In your `index.html`, change `subpages/products-html` to `subpages/products.html` (the dot is missing).
- Theme toggle uses localStorage key `bronx-theme`. Change it in `js/shop.js` and each page head if your home page uses another key.
