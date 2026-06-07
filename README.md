# מנדלות בעבודת יד — Mandala Shop

A single-page **Hebrew, right-to-left** online shop for handmade crochet mandalas. Visitors
browse the catalogue, add pieces to a cart, and submit an order — which arrives as a formatted
Hebrew email. Each mandala is then crocheted and shipped to order. No payments, no backend.

**Live:** https://galke7.github.io/mandala-shop/

## Features

- Responsive **RTL** layout (Bootstrap 5 RTL): sticky header, hero, product grid, footer.
- Product grid rendered from a data array with **Mustache** templates.
- **Cart** with add / remove / quantity and totals, persisted in `localStorage` (survives refresh).
- **Quick-view modal** with a quantity selector.
- **Order form** with Hebrew client-side validation; submits via **Web3Forms** (AJAX, no backend)
  and emails a readable Hebrew order summary.
- Accessibility: semantic landmarks, `alt` text, `aria-label`s, visible focus, AA-level contrast.

## Tech stack

HTML5 · CSS3 · Bootstrap 5 RTL · jQuery 3.7 · Mustache.js 4 — all via CDN.
Tests: Vitest. Hosting: GitHub Pages.

The pure business logic (cart math, validation, order formatting) lives in dependency-free ES
modules (`js/cart.js`, `js/validation.js`, `js/order.js`) and is unit-tested. All DOM/jQuery
wiring lives in `js/app.js`.

## Run locally

```bash
npm install        # dev dependency: vitest
npm run dev        # serves the static site at http://localhost:8000
```

## Run the tests

```bash
npm test           # one-off
npm run test:watch # watch mode
```

## How orders work

The order form POSTs to [Web3Forms](https://web3forms.com/). The public access key in
`js/app.js` is an alias for the recipient inbox — there is no server to run. Submitting a valid
order emails the shop owner a Hebrew summary (items, quantities, totals, and the customer's
contact details) and uses the customer's email as the reply-to address.

## Project structure

```
mandala-shop/
├── index.html          # RTL skeleton, CDN links, Mustache <script> templates
├── css/styles.css      # all styling (RTL, grid, cart drawer, modal, a11y)
├── js/
│   ├── products.js     # product data + findProduct()
│   ├── cart.js         # pure cart logic (tested)
│   ├── validation.js   # pure form validation (tested)
│   ├── order.js        # pure order summary + payload builder (tested)
│   ├── storage.js      # localStorage wrappers
│   └── app.js          # jQuery + Mustache DOM wiring (entry point)
├── tests/              # Vitest specs for the pure modules
└── images/             # mandala photos
```

## License

Personal project. Product photos © their maker.
