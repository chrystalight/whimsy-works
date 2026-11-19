# Whimsy Works — website

Static marketing site for Whimsy Works, a volunteer-run nonprofit that brings
theme-park-quality character performers to pediatric hospitals, fundraisers,
and community events across Ontario at no cost.

## Stack & deploy

- Plain HTML + CSS + vanilla JS. **No build step, no framework, no bundler.**
- Hosted on **GitHub Pages** from the `main` branch; custom domain in `CNAME`.
  **Pushing to `main` publishes the live site** — commit/push only when asked.
- Preview locally with a static server from the repo root, e.g.
  `python -m http.server 8000`, then open http://localhost:8000.

## Layout

- Pages (repo root): `index.html` (home), `events.html` (Event Calendar),
  `book.html`, `princesses.html`, `superheros.html`, `more-characters.html`,
  `volunteer.html`, `trickorsuite.html`, `trickorsuite-montreal.html`.
- `styles.css` — all styling (shared across pages).
- `script.js` — all interactivity: mobile menu, event rendering,
  character galleries/outfit switchers, booking-form helpers, the sparkle
  cursor trail, and a friendly placeholder for missing images.
- `images/` — site images, served as **`.webp`**. Full-res originals are
  backed up under `images/originals/` (committed).
- `scripts/` — helper scripts (see below).

## Events (Event Calendar)

- **`events-data.js` is the single source of truth.** It exports a `const EVENTS`
  array; `script.js` renders each entry into Upcoming vs. Past and sorts them by
  `date` automatically — nothing is moved by hand as events pass. A past event's
  `time` and `link` fields are simply not displayed.
- To add/edit an event, copy an existing object in `events-data.js`. Field docs
  are in the comment header of that file (`date`, `title`, `badge`, `location`,
  `time`, `charity`, `description`, `link`).
- When an event moves into the past, rewrite its `description` into a past-tense
  recap (see the 2025 entries for tone) and drop the now-unused `time`/`link`.

## Homepage scrapbook

- The "Making magic across Ontario" section in `index.html` is a grid of
  taped-up snapshots: each is one `<figure class="snap taped">` with an
  `<img>` and a `<figcaption>` (short handwritten line + a `<small>` detail
  sentence). **Adding a photo just means adding one `<figure>`** — no JS.
  Optional `tape-sky` / `tape-coral` classes change the tape colour. Images use
  the `event-N.webp` naming convention.

## Founder note & mirror

- The `#about` section of `index.html` is Catie's first-person founder note
  (Whimsy Works is run by her personally; keep it in her voice, not "a collective").
- Beside it, `.mirror-frame` stacks `images/mirror-*.webp` front-hall selfies
  (900x1200, cropped so the mirror lines up). Tap/click advances; hover
  flips through them (`script.js`). Add a look = add one `<img data-name="...">`.

## Look & feel

- Warm paper background, flat colours pulled from the shield logo (sky,
  coral, butter, mauve — tokens at the top of `styles.css`). No gradients.
- Fonts: Fraunces (headings), Atkinson Hyperlegible (body), Caveat (the
  handwritten notes/kickers). Every page loads the same Google Fonts link.
- Reusable bits: `.snap` (polaroid), `.taped` (washi tape), `.stitched`
  (card with a dashed seam), `.kicker` (handwritten line above a heading),
  `.squiggle` (hand-drawn underline).
- The header and footer are identical on every page; when changing one,
  change all nine pages.
- The sparkle cursor trail in `script.js` is beloved — keep it.

## Adding / updating images

Use the converter so everything stays small and consistent:

1. Drop new `.jpg`/`.png` files anywhere under `images/` (name them to match the
   relevant convention, e.g. `event-4.jpg`).
2. Run `python scripts/compress_images.py` (needs Pillow: `pip install Pillow`).
   It converts to `.webp`, backs up originals to `images/originals/`, deletes the
   source, and rewrites `images/*.jpg|png` references in the HTML. `--force`
   recompresses everything.
3. Reference the resulting `images/<name>.webp` in your HTML.

## Conventions

- Serve images as `.webp`; keep full-res originals in `images/originals/`.
- Canadian spelling in copy (e.g. Centre, Tumour, honour).
