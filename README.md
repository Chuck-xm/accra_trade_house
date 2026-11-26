# Accra Trade House prototype

A responsive, enquiry-led marketplace prototype using plain HTML, CSS, and JavaScript. No installation or build step is required.

## Preview

Serve the folder over HTTP because JavaScript uses native ES modules. Run `npm run dev` (no npm install required), or:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit http://127.0.0.1:8000.

Alternatively, open `index.html` with VS Code's Live Server extension using **Go Live**.

## Included flows

- Three hero banners rotate every 7 seconds with an 800ms fade, manual banner selectors, and left/right navigation arrows. Rotation pauses during hero interaction, while the tab is hidden, or while a dialog is open; reduced-motion users start with autoplay paused. The supplied Accra Trade House billboard is shown without cropping.
- Search by product, producer, category, or region; category filtering; price/name sorting; load more products.
- Product detail dialogs, saved products, quote/sample requests, and a local trade desk.
- Producer applications, sourcing briefs, visit requests, and Friday Market stall applications.
- Friday Market flyer opens once per tab session, dismissible with ×, Escape, or a backdrop click. Refreshing or navigating within the same tab does not show it again automatically. Navigation and footer buttons reopen it. If session storage is unavailable, it falls back to opening on each page load. The supplied artwork is displayed without cropping, with a link to the full-size image.
- Demo newsletter preference. Stall applications and the calendar module still use fixed prototype dates; the flyer is displayed as supplied, pending separate scheduling work.
- Local persistence, validation, empty states, and a control to clear demo data under privacy information.

All products, producer businesses, prices, and profiles are illustrative. Requests remain in this browser under `ath-records`; saved product IDs use `ath-saved`. No requests, emails, subscriptions, payments, authentication, or stock checks are sent to a backend. Use sample contact details during review. Calendar and market dates need staff confirmation.

## Files and Django handover

- `index.html`: page structure, navigation, and dialog container.
- `index.js`: short entry point that initializes the feature modules.
- `index.css`: stylesheet entry point importing component styles.
- `css/tokens.css`: shared brand palette sampled from the official logo. Green drives actions, red provides restrained accents, and gold highlights key content. Darker companion shades provide readable text and buttons; neutral surfaces keep the catalogue clear.
- `js/data/catalogue.js`: sample product and category data.
- `js/core/`: shared state, local storage adapter, modal, toast, icons, formatting, and delegated event helper.
- `js/features/`: catalogue, product details, navigation, saved products, producers, calendar, privacy, and trade desk. Each module owns its event handlers.
- `js/forms/`: individual enquiry, producer, stall, sourcing, contact, newsletter, and information dialogs; shared form fields and submission handler.
- `css/`: base styles plus header, hero, market advert, catalogue, trade/producer sections, footer, and dialogs. Each component includes its own responsive rules.
- `tests/prototype.test.mjs`: module and feature integration regression checks. Run `npm test`.
- `assets/`: downloaded reference photography.

For Django, move page markup into templates and CSS/JS/images into static files. Replace the sample `products` and `categories` arrays with catalogue data, and replace `js/forms/submissions.js` and `js/core/storage.js` with validated server endpoints. Add Django authentication, producer and staff permissions, CSRF protection, approval workflows, and server-managed enquiries before production use. Product records and physical inventory should remain distinct. Keep displayed prices indicative until commercial terms are confirmed.

## Photography references

Images are visual references, not evidence that the displayed items are supplied by the illustrative businesses. Replace them with approved producer photography for launch.

- Chocolate, pineapple, care oil, coffee, backpack, sandals, ceramics, farm, and studio: Unsplash. Original photo IDs are `photo-1511381939415-e44015466834`, `photo-1550258987-190a2d41a8ba`, `photo-1608571423902-eed4a5ad8108`, `photo-1447933601403-0c6688de566e`, `photo-1553062407-98eeb64c6a62`, `photo-1603487742131-4160ec999306`, `photo-1490312278390-ab64016e0aa9`, `photo-1605000797499-95a51c5269ae`, and `photo-1452860606245-08befc0ff44b`.
- Beverage: Unsplash `photo-1544145945-f90425340c7e` (illustrative drink photography).
- Bolga basket: https://theafricanhomegoods.com/products/large-african-ghana-bolga-basket-dye-free-14-16
- Heritage cloth: https://www.etsy.com/listing/4360134597/handwoven-kente-cloth-authentic-ghana
- Additional textile: https://www.etsy.com/listing/1443172680/african-kente-fabric-cloth-handwoven
- Shea butter reference: https://www.bol.com/nl/nl/p/nature-s-blend-shea-butter-puur-ongeraffineerd-200-ml-huid-en-lichaam/9300000019954490/

Fonts are DM Sans and Manrope, with Fraunces for hero headlines, from Google Fonts, with local system fallbacks. Product photos are local assets, so the catalogue does not depend on external image requests.

## Verification

Ten automated checks pass with `npm test`, covering hero timing and playback controls, popup session frequency, initialisation, catalogue filtering and sorting, delegated saved-item actions, independent form flows, enquiry persistence, escaped trade-desk content, producer search, and clearing data. The tests use a small DOM adapter; they do not replace browser layout checks. The local HTTP server returned the homepage successfully.

The project owner viewed the prototype through VS Code Go Live on 24 November 2026. Automated browser interaction and mobile viewport checks have not been completed.
