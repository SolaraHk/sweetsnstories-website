# Sweets N Stories Website

Polished Vite + React + TypeScript website for **Sweets N Stories**, a Hong Kong chiffon cake shop.

## Built pages

- `/` — editorial homepage
- `/shop/` — collection grid with category filters
- `/shop/mikan-mango-chiffon/` — product detail and demo add-to-bag flow
- `/custom-cake/` — custom cake inquiry form with demo-safe success state
- `/our-story/` — brand story page

## Local commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

The site uses static/demo product data from `src/data/products.ts`, local cart state, and demo-safe WhatsApp inquiry links. There is **no live payment, inventory, delivery-slot, or backend order submission** connected yet.

## Imagery/data notes

- Product images in `public/assets/` are cropped/derived from the supplied reference screenshots for MVP demo use.
- Product catalogue and prices are demo seed data from `notes.md`.
- Final production launch should replace imagery with approved product photography and connect real order/payment/delivery flows if required.

## Reference pack preserved

The original handoff files remain in this repository:

- `START_HERE_FOR_PA.md`
- `project-build-prompt.md`
- `notes.md`
- `references/`
