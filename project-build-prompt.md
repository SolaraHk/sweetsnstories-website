# Build Prompt — Sweets N Stories Cake Shop Website

I want you to build me a polished website for **Sweets N Stories**, a Hong Kong chiffon cake shop.

## Goal

Create a premium, editorial, conversion-ready cake shop website inspired closely by the supplied design screenshots. The site should feel like a boutique Hong Kong bakery: soft, story-led, handcrafted, seasonal, warm, and elegant — not like a generic Shopify template.

## Context

This repo is the build workspace for the Sweets N Stories website under the `SolaraHk` organization. The user has already created the `sweetsnstories` topic/workspace. The screenshots in `references/` are the primary design direction and must be inspected before building.

Reference images:

- `references/design-01-home.png` — homepage layout and tone.
- `references/design-02-shop-collection.png` — shop/category collection page.
- `references/design-03-product-detail.png` — product detail and ordering page.

## Important rules

- Do **not** just give me a plan. Build the actual files/artifacts.
- Inspect the current project structure before choosing implementation details.
- Preserve existing files; do not delete the prompt pack or reference images.
- Match the screenshots closely for layout, spacing, typography scale, color palette, dividers, buttons, cards, product grid, hero composition, product detail form, and desktop/mobile proportions.
- Use the screenshots for visual direction, not as proof of final business/legal data.
- Use realistic demo seed data from `notes.md` unless real product/catalogue content is supplied later.
- Do **not** invent fake live payment, inventory, delivery, or WhatsApp integrations. If credentials or live APIs are missing, implement demo/local behavior and label it clearly.
- Keep the e-commerce navigation clean: top nav should include **Shop**, **Seasonal**, **Custom Cake**, and **Our Story**. Do not add a hot-recommendation nav item.
- If adding informational pages, keep **Reviews** and **About/Our Story** as standalone sections/pages rather than burying them in product navigation.
- Prioritize working, verified UX over over-engineered backend work.

## Suggested implementation

Choose the best implementation after inspecting the repo. A strong default is:

- Vite + React + TypeScript
- CSS modules or plain CSS with well-structured variables
- Static demo product data in code or JSON
- Client-side routing for pages
- Local cart state
- No paid backend by default

If the repo already contains another framework, adapt to it instead of starting over.

## Pages / routes to build

### 1. Homepage

Match `references/design-01-home.png`.

Required sections:

- Slim top announcement bar: `FOUR-DAY ADVANCE ORDER · TSUEN WAN PICKUP · HONG KONG DELIVERY`
- Header with:
  - Logo: `SWEETS N STORIES`
  - Subline: `CHIFFON CAKES · HONG KONG`
  - Nav: Shop, Seasonal, Custom Cake, Our Story
  - Right controls: `EN / 中`, search icon, bag icon
- Split editorial hero:
  - Eyebrow: `SEASONAL STORY · NO. 06`
  - Headline: `Stories, baked softly.`
  - Chinese subcopy: `輕柔的戚風蛋糕，盛載每一個值得記住的時刻。`
  - Primary CTA: `Shop the collection →`
  - Secondary CTA: `Explore custom cakes`
  - Large product image panel on the right
  - Small circular label on image: `Mikan × Mango Chiffon`
- Seasonal favourites section with 3 product cards.
- Story/about section: `Every cake begins with a quiet story.` with short copy and image.
- Footer matching screenshot rhythm.

### 2. Shop / collection page

Match `references/design-02-shop-collection.png`.

Required sections:

- Editorial page intro:
  - Eyebrow: `THE COMPLETE COLLECTION · SUMMER 2026`
  - Headline: `The cake collection.`
  - Chinese subcopy: `輕柔戚風、當季水果與手工鮮忌廉。每一款蛋糕，都為值得記住的日子而做。`
  - Summary block: `12 stories currently available`
- Featured seasonal story panel:
  - Large wide image left, copy block right
  - Title: `Bright citrus, soft pandan.`
  - CTA: `Explore story C07 →`
- Category tabs/filters:
  - All Cakes, Seasonal, Chiffon, Mini, Bespoke
- Sort label: `Sort · Featured`
- Responsive product grid:
  - Desktop: 4 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- Product cards with image, label, optional badge, name, flavour notes, and price.

### 3. Product detail page

Match `references/design-03-product-detail.png`.

Create at least one polished product detail route for **Mikan & Mango Chiffon**.

Required components:

- Breadcrumb: `Shop / Seasonal / Mikan & Mango Chiffon`
- Left image gallery:
  - Thumbnail rail
  - Large active image
  - Overlay label: `HANDMADE IN HONG KONG · SEASONAL EDITION`
- Right product panel:
  - Eyebrow: `STORY C07 · SEASONAL`
  - Product name: `Mikan & Mango Chiffon`
  - Japanese-style subtitle: `みかん × マンゴー パンダンシフォン`
  - Price: `HK$428`
  - Description: `Feather-light pandan chiffon layered with mikan, mango and coconut water jelly. Bright, delicate and softly tropical.`
  - Tag pills: Citrus, Light Cream, Pandan
  - Size selector: 5 inch, 6 inch, 7 inch with 5 inch selected by default
  - Serves label: `Serves 4–8`
  - Fulfilment selector: Pickup, Delivery
  - Collection date select/input with placeholder `Select an available date`
  - Cake message input, optional, up to 20 characters
  - Quantity stepper
  - Add-to-bag CTA that updates local cart state
  - Advance-order notice: `Orders close four days before collection. Chilled delivery is available to selected drop-off points.`
  - Accordions: Ingredients & allergens, Storage & serving, Pickup & delivery
- Related products section: Pear & Earl Grey, Pistachio Genmaicha, Black Rice Taro.

### 4. Custom Cake page

Build a simple, elegant custom cake inquiry page matching the same visual system.

Required content:

- Explain custom celebration cakes for birthdays, thank-yous, and small gatherings.
- Include fields for occasion, servings, flavour direction, pickup/delivery preference, date, message, name, phone/WhatsApp.
- CTA should be `Send inquiry` or `Start WhatsApp inquiry`.
- If no real backend exists, show a clear demo success state and/or `mailto:`/WhatsApp link behavior rather than pretending an order was submitted to a real system.

### 5. Our Story page

Build a concise brand story page.

Required content themes:

- Small-batch chiffon cakes handmade in Hong Kong.
- Seasonal fruit, tea, handmade cream, quiet details.
- Tsuen Wan pickup and selected Hong Kong delivery.
- Four-day advance orders.
- Instagram `@sns.hkg`; WhatsApp `9680 2750`.

### 6. Cart / bag interaction

Implement a lightweight cart/bag drawer or page:

- Bag icon shows item count.
- Add-to-bag from product page adds selected size, fulfilment, date, message, quantity.
- Cart can increment/decrement/remove items.
- Checkout CTA should be demo-safe: either `Prepare WhatsApp order` or `Continue to inquiry`, not fake payment.
- Display order note about four-day advance ordering.

## Visual design requirements

Use a refined editorial system close to the screenshots:

- Background: warm cream/off-white.
- Primary text: deep espresso/dark brown.
- Accent: burnt citrus/orange for selected states and main CTA.
- Dividers: thin warm grey lines.
- Typography:
  - Large high-contrast serif display headlines.
  - Clean sans-serif for nav, labels, small uppercase metadata.
- Letter-spaced uppercase labels.
- Calm, generous spacing.
- Product photos should be large and soft-edged/rectangular as in screenshots.
- Buttons should feel minimal, tactile, and aligned to the reference style.
- Avoid generic gradients, neon colors, stock SaaS styling, or cluttered animations.

## Images

Use the provided screenshots as references and, for MVP/demo purposes, you may crop/use the supplied cake screenshots as temporary product images if no separate product assets are provided.

If you use screenshot crops directly:

- Keep it as demo/reference-derived imagery.
- Put any derived assets in a clear assets folder.
- Do not claim these are final production product photos.

## Responsive/mobile requirements

Build and verify at minimum:

- Desktop: 1440px wide
- Tablet: around 768px wide
- Mobile: around 390px wide

Mobile should not simply shrink desktop. It should:

- Collapse nav into a menu or simplified header.
- Stack hero sections cleanly.
- Keep product cards readable and tappable.
- Make product page purchase controls easy to use.
- Preserve the elegant editorial mood.

## Accessibility / UX requirements

- Semantic headings and landmarks.
- Alt text for product images.
- Keyboard-accessible buttons, selectors, accordions, and cart drawer.
- Visible focus states that match the design.
- Avoid tiny tap targets on mobile.
- Form validation for required custom cake/cart fields.

## Expected final artifacts

Create/update the actual project files, including:

1. Working website source code.
2. Product seed data.
3. Reusable components for header, footer, product cards, filters, product form, accordions, cart/bag.
4. Styling system that matches the references.
5. README with setup/run/build instructions.
6. Any generated/cropped demo assets, organized clearly.

## Verification requirements

Before finishing:

1. Install dependencies if needed.
2. Run the dev/build command.
3. Run any lint/typecheck/test command available.
4. Launch or preview the site locally.
5. Inspect in browser at desktop and mobile widths.
6. Compare against all three reference screenshots.
7. Fix obvious mismatches before reporting done.
8. Commit the finished work with a clear commit message.

If a command fails, fix it. If it cannot be fixed because of a real blocker, report the exact blocker and the command output.

## Final report format

When done, report:

- What you built.
- Git branch and commit hash.
- Files/pages/components created.
- Commands run and whether they passed.
- Desktop/mobile visual verification notes.
- What data is real/public/provided vs demo/heuristic.
- Any intentional deviations from the screenshots.
- The next best action.

Now inspect this repository, inspect the reference images, build the website, verify it locally, commit the result, and provide the final report.
