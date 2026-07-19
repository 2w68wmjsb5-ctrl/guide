// Editable PowerPoint (A4 portrait) version of the PATTO Muay Thai Lexikon.
// Mirrors the PDF's content and design language using native, editable
// PowerPoint shapes/tables/text instead of print HTML.
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const data = require("./data.js");

const ICON_DIR = path.join(__dirname, "icons");
const FALLBACKS = { badge: ["white", "dark", "accent"], onLight: ["dark", "accent", "white"] };
function resolveIcon(name, context = "badge") {
  for (const v of FALLBACKS[context]) {
    const p = path.join(ICON_DIR, `${name}_${v}.png`);
    if (fs.existsSync(p)) return { file: p, variant: v };
  }
  throw new Error(`No icon variant for "${name}"`);
}

const COLORS = {
  primary: "14171D",
  primaryLight: "20242C",
  primaryLighter: "2B303A",
  accent: "E8792F",
  accentDeep: "B85A1E",
  bgLight: "F4F5F7",
  cardBg: "FFFFFF",
  rowTint: "F7F8FA",
  textDark: "14171D",
  textMuted: "5B6472",
  textOnDarkMuted: "9AA3B0",
  white: "FFFFFF",
  border: "E4E6EA",
};
const FONT = "Arial";

const PAGE_W = 8.27;
const PAGE_H = 11.69;
const MARGIN = 0.7;
const CONTENT_W = +(PAGE_W - 2 * MARGIN).toFixed(3);

const pres = new pptxgen();
pres.defineLayout({ name: "A4P", width: PAGE_W, height: PAGE_H });
pres.layout = "A4P";
pres.author = "PATTO";
pres.title = "PATTO Muay Thai Lexikon";

// ---------- Slide masters (background + footer + page number) ----------
pres.defineSlideMaster({
  title: "LIGHT",
  background: { color: COLORS.bgLight },
  objects: [
    { text: { text: "PATTO", options: { x: MARGIN, y: PAGE_H - 0.55, w: 1.0, h: 0.3, fontSize: 8.5, bold: true, color: COLORS.textDark, fontFace: FONT, margin: 0 } } },
    { text: { text: "·  MUAY THAI LEXIKON", options: { x: MARGIN + 0.42, y: PAGE_H - 0.55, w: 3.0, h: 0.3, fontSize: 8.5, color: COLORS.textMuted, fontFace: FONT, margin: 0 } } },
  ],
  slideNumber: { x: PAGE_W - MARGIN - 0.6, y: PAGE_H - 0.55, w: 0.6, h: 0.3, fontSize: 8.5, color: COLORS.textMuted, fontFace: FONT, align: "right" },
});
pres.defineSlideMaster({
  title: "DARK",
  background: { color: COLORS.primary },
  objects: [
    { text: { text: "PATTO", options: { x: MARGIN, y: PAGE_H - 0.55, w: 1.0, h: 0.3, fontSize: 8.5, bold: true, color: COLORS.white, fontFace: FONT, margin: 0 } } },
    { text: { text: "·  MUAY THAI LEXIKON", options: { x: MARGIN + 0.42, y: PAGE_H - 0.55, w: 3.0, h: 0.3, fontSize: 8.5, color: COLORS.textOnDarkMuted, fontFace: FONT, margin: 0 } } },
  ],
  slideNumber: { x: PAGE_W - MARGIN - 0.6, y: PAGE_H - 0.55, w: 0.6, h: 0.3, fontSize: 8.5, color: COLORS.textOnDarkMuted, fontFace: FONT, align: "right" },
});

// ---------- small helpers ----------
function iconBadge(slide, { x, y, d = 0.5, iconName }) {
  const { file, variant } = resolveIcon(iconName, "badge");
  const bg = variant === "accent" ? COLORS.primary : COLORS.accent;
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: bg }, line: { type: "none" } });
  const pad = d * 0.3;
  slide.addImage({ path: file, x: x + pad / 2, y: y + pad / 2, w: d - pad, h: d - pad });
}

function paraBoxHeight(text, fontSize = 11, widthIn = CONTENT_W) {
  if (!text) return 0;
  const charsPerLine = Math.max(20, Math.floor((widthIn * 96) / (fontSize * 0.62)));
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
  return +(lines * (fontSize / 72) * 1.5 + 0.05).toFixed(2);
}

function chapterHeader(slide, tag, title) {
  slide.addText(tag.toUpperCase(), { x: MARGIN, y: MARGIN, w: CONTENT_W, h: 0.24, fontSize: 10, bold: true, color: COLORS.accent, fontFace: FONT, charSpacing: 1.2, margin: 0 });
  slide.addText(title, { x: MARGIN, y: MARGIN + 0.3, w: CONTENT_W, h: 0.5, fontSize: 23, bold: true, color: COLORS.textDark, fontFace: FONT, margin: 0 });
  return MARGIN + 0.3 + 0.52;
}

// A light content slide with header + optional intro + an auto-paging vocab table
function tableSection(pres, { tag, title, intro, rows, headers, colWidths, noDesc = false }) {
  const slide = pres.addSlide({ masterName: "LIGHT" });
  let y = chapterHeader(slide, tag, title);
  if (intro) {
    const h = paraBoxHeight(intro);
    slide.addText(intro, { x: MARGIN, y, w: CONTENT_W, h, fontSize: 11, color: COLORS.textDark, fontFace: FONT, valign: "top", margin: 0, lineSpacingMultiple: 1.25 });
    y += h + 0.18;
  }
  const hdrLabels = noDesc ? ["Deutsch", "Phonetik", "ภาษาไทย"] : (headers || ["Deutsch", "Phonetik", "ภาษาไทย", "Beschreibung"]);
  const headerRow = hdrLabels.map(h => ({ text: h, options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary }, fontSize: 10, fontFace: FONT, valign: "middle" } }));
  const bodyRows = rows.map((r, i) => {
    const cells = noDesc ? r.slice(0, 3) : r;
    return cells.map((val, ci) => {
      const opts = { fontSize: 9, fontFace: FONT, color: COLORS.textDark, fill: { color: i % 2 === 1 ? COLORS.rowTint : COLORS.cardBg }, valign: "top" };
      if (ci === 0) opts.bold = true;
      if (ci === 1) { opts.italic = true; opts.color = COLORS.accentDeep; }
      if (ci === 2) opts.fontSize = 10.5;
      if (ci === 3) { opts.color = COLORS.textMuted; opts.fontSize = 8.8; }
      return { text: val, options: opts };
    });
  });
  const widths = (colWidths || (noDesc ? [34, 33, 33] : [24, 20, 16, 40])).map(pct => +(pct / 100 * CONTENT_W).toFixed(3));
  slide.addTable([headerRow, ...bodyRows], {
    x: MARGIN, y, colW: widths,
    autoPage: true, autoPageRepeatHeader: true, autoPageHeaderRows: 1,
    autoPageSlideStartY: MARGIN,
    border: { type: "solid", color: COLORS.border, pt: 0.75 },
    margin: [0.05, 0.08, 0.05, 0.08],
    valign: "top",
  });
  return slide;
}

// Small labelled callout (tip / quote), returns nothing - draws in place
function tipBox(slide, { x, y, w, iconName, label, text }) {
  const h = paraBoxHeight(`${label} ${text}`, 9.5, w - 0.75) + 0.3;
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: COLORS.primary }, line: { type: "none" } });
  const { file } = resolveIcon(iconName, "badge");
  slide.addImage({ path: file, x: x + 0.2, y: y + h / 2 - 0.14, w: 0.28, h: 0.28 });
  slide.addText([{ text: label + "  ", options: { bold: true, color: COLORS.accent } }, { text, options: { color: "E3E6EA" } }], {
    x: x + 0.62, y: y + 0.1, w: w - 0.82, h: h - 0.2, fontSize: 9.5, fontFace: FONT, valign: "middle", margin: 0, lineSpacingMultiple: 1.2,
  });
  return h;
}

function quoteBlock(slide, { x, y, w, thai, text, source }) {
  const h = paraBoxHeight(text, 10.3, w - 0.5) + (thai ? 0.85 : 0.55);
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.04, fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 0.75 } });
  let ty = y + 0.12;
  slide.addText("“", { x: x + 0.25, y: ty, w: 0.6, h: 0.35, fontSize: 26, color: COLORS.accent, fontFace: "Georgia", margin: 0 });
  ty += 0.32;
  if (thai) {
    slide.addText(thai, { x: x + 0.25, y: ty, w: w - 0.5, h: 0.3, fontSize: 13, color: COLORS.textDark, fontFace: FONT, margin: 0 });
    ty += 0.32;
  }
  slide.addText(text, { x: x + 0.25, y: ty, w: w - 0.5, h: h - (ty - y) - 0.3, fontSize: 10.3, italic: true, color: COLORS.textDark, fontFace: FONT, margin: 0, lineSpacingMultiple: 1.2 });
  slide.addText(source.toUpperCase(), { x: x + 0.25, y: y + h - 0.28, w: w - 0.5, h: 0.22, fontSize: 8.5, color: COLORS.textMuted, fontFace: FONT, charSpacing: 0.5, margin: 0 });
  return h;
}

module.exports = {
  pres, COLORS, FONT, PAGE_W, PAGE_H, MARGIN, CONTENT_W,
  resolveIcon, iconBadge, paraBoxHeight, chapterHeader, tableSection, tipBox, quoteBlock, data,
};
