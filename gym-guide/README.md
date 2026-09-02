# PATTO Muay Thai Gym Guide

Build pipeline for the PATTO Muay Thai Gym Guide: a curated directory of
recommended Muay Thai gyms across Thailand, rendered to a print-ready,
sale-ready A4 PDF. Content sourced verbatim from `Guide.docx`.

Runs on **PATTO Tactical** — a bold, high-contrast brand system built for
the combat-sports niche (oversized display type, hexagon markers, angular
accent panels, a single dominant signature color) and designed to be the
reusable visual identity for future guides in the series, not a one-off.
It draws on genre conventions from established tactical/combat-sports
editorial content (bold numbered do/don't callouts, big display type,
strong single-accent contrast) while using PATTO's own real logo, its own
orange/near-black palette, and its own hexagon motif — not a copy of any
third party's specific look.

## Build

```
npm install   # only needed once at the repo root; playwright is shared
pip install pypdf reportlab
npm run build
```

This runs, in order:

1. `gen_light1.js` … `gen_light4.js`, `gen_dark.js` — generate `light-*.html` and `dark.html` from `data.js` via `htmlkit.js`
2. `render_light.js`, `render_dark.js` — print each HTML file to PDF with Playwright/Chromium
3. `merge.py` — interleaves the dark (cover/divider/closing) pages with the light (content) pages and stamps page numbers, producing `PATTO_Muay_Thai_Gym_Guide.pdf`

## Structure

- `data.js` — Vorwort, Gym-Wahl checklist (gut/schlecht), Recherchetipps, and all 7 regions with their gyms (verbatim source content; do not rephrase)
- `htmlkit.js` — HTML building blocks: hexagon badges/numbers (`iconHex`, `numHex`), the `doDontCard` component, angular `accentPanel` backgrounds, `regionCard`, `gymGrid`, `gymIndexItem`, `disclaimer`, `quoteBlock`, `tipBox`
- `style.css` — the PATTO Tactical design tokens (colors, Anton/Barlow Condensed type) and every component style
- `fonts/` — Anton (display) and Barlow Condensed (eyebrows/labels/UI), both open-license (Google Fonts), embedded locally for reliable offline rendering
- `gen_light1.js` — Inhaltsverzeichnis (TOC) + "Wie benutze ich diesen Guide?"
- `gen_light2.js` — Gym-Wahl (Do/Don't), Recherchetipps, "Bevor du gehst" (6 practical tips), disclaimer
- `gen_light3.js` — "Regionen im Überblick" summary cards + all 7 region pages (Bangkok, Chiang Mai, Isaan, islands, Pattaya, Phuket, Weitere Orte)
- `gen_light4.js` — Gym-Index A–Z: all 58 gyms alphabetically with their region, generated programmatically from `data.js` (never hand-typed, so it can't drift from the region pages)
- `gen_dark.js` — cover, Vorwort, Vorbereitung-divider, Regionen-divider, closing
- `icons/`, `brand/patto-logo-white.png` — the real PΛTTO wordmark and icon set

## Content notes

- Region "ideal für" tags on the overview cards are short paraphrases of each region's own descriptive paragraph (not new claims).
- Gym counts and the A–Z index are computed from `REGIONS` in `data.js`, not hardcoded — regenerating after any data edit keeps every count and cross-reference in sync automatically.
- The disclaimer ("Alle Empfehlungen … Bedingungen können sich ändern") is a good-practice manageability note appropriate for a guide that will be sold; it doesn't alter or contradict anything in the sourced content.
