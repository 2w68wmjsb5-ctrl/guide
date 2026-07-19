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

## Editable PowerPoint version

```
npm install
npm run build:pptx
```

Produces `PATTO_Muay_Thai_Lexikon_EDITIERBAR.pptx` — an A4-portrait deck with
the same content as the PDF, but as native, fully editable PowerPoint text
boxes and tables (no exported images of pages). Long vocab tables flow across
extra slides automatically via pptxgenjs's table auto-paging.

## Structure

- `data.js` — all vocabulary content (German, phonetic, Thai script, description)
- `htmlkit.js` — HTML building blocks (tables, cards, TOC rows, dark-page dividers) shared by the PDF generators
- `pptxkit.js` / `build_pptx.js` — the PowerPoint build: shared slide/shape helpers + the deck script
- `style.css` — print design system
- `icons/` — icon set (accent/dark/white variants; not every icon has all three)
- `*.otf` / `*.ttf` — brand and Thai typefaces
- `brand/patto-logo-white.png` — the real PΛTTO wordmark, cropped from the studio-supplied logo
