# PATTO Muay Thai Gym Guide

Build pipeline for the PATTO Muay Thai Gym Guide: a curated directory of
recommended Muay Thai gyms across Thailand, rendered to a print-ready A4 PDF.
Sibling project to `../` (the PATTO Muay Thai Lexikon) — same brand system,
different content shape (no vocab tables, just region write-ups and gym
listings), sourced verbatim from `Guide.docx`.

## Build

```
npm install   # only needed once at the repo root; playwright is shared
pip install pypdf reportlab
npm run build
```

This runs, in order:

1. `gen_light1.js`, `gen_light2.js`, `gen_dark.js` — generate `light-*.html` and `dark.html` from `data.js` via `htmlkit.js`
2. `render_light.js`, `render_dark.js` — print each HTML file to PDF with Playwright/Chromium
3. `merge.py` — interleaves the dark (cover/divider/closing) pages with the light (content) pages and stamps page numbers, producing `PATTO_Muay_Thai_Gym_Guide.pdf`

## Structure

- `data.js` — Vorwort, Gym-Wahl checklist (gut/schlecht), Recherchetipps, and all 7 regions with their gyms
- `htmlkit.js` — HTML building blocks shared by the generators, incl. the gym-guide-specific `checklistCol`, `gymGrid`, `regionSubTitle`
- `gen_light1.js` — Gym-Wahl + Recherchetipps page
- `gen_light2.js` — all region pages (Bangkok, Chiang Mai, Isaan, islands, Pattaya, Phuket, Weitere Orte)
- `gen_dark.js` — cover, Vorwort, region-index divider, closing
- `style.css` — print design system (same tokens as the Lexikon, no Thai typeface since this guide has none)
- `icons/`, `brand/patto-logo-white.png` — copied from the Lexikon project (same brand assets)
