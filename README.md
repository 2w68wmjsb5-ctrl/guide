# PATTO Muay Thai Lexikon

Build pipeline for the PATTO Muay Thai Lexikon: a German/Thai vocabulary guide
rendered to a print-ready A4 PDF.

## Build

```
npm install
pip install -r requirements.txt
npm run build
```

This runs, in order:

1. `gen_light1.js` … `gen_light5.js`, `gen_dark.js` — generate `light-*.html` and `dark.html` from `data.js` via `htmlkit.js`
2. `render_light.js`, `render_dark.js` — print each HTML file to PDF with Playwright/Chromium
3. `merge.py` — interleaves the dark (cover/divider) pages with the light (content) pages and stamps page numbers, producing `PATTO_Muay_Thai_Lexikon_GUIDE.pdf`

## Structure

- `data.js` — all vocabulary content (German, phonetic, Thai script, description)
- `htmlkit.js` — HTML building blocks (tables, cards, TOC rows, dark-page dividers) shared by the generators
- `style.css` — print design system
- `icons/` — icon set (accent/dark/white variants; not every icon has all three)
- `*.otf` / `*.ttf` — brand and Thai typefaces
