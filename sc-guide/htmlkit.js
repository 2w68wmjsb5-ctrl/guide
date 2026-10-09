const fs = require("fs");
const path = require("path");

const ICON_DIR = path.join(__dirname, "icons");
// "badge": icon sits inside a solid accent/ink hexagon -> needs a light icon first.
// "onLight": icon sits directly on a white/paper background -> needs a dark icon first.
const FALLBACKS = {
  badge: ["white", "dark", "accent"],
  onLight: ["dark", "accent", "white"],
};

function resolveIcon(name, context = "badge") {
  const order = FALLBACKS[context] || FALLBACKS.badge;
  for (const v of order) {
    const file = `${name}_${v}.png`;
    if (fs.existsSync(path.join(ICON_DIR, file))) return { src: `icons/${file}`, variant: v };
  }
  throw new Error(`No icon variant found for "${name}"`);
}

function icon(name, context = "badge") {
  return resolveIcon(name, context).src;
}

// Hexagon badges default to an accent-orange fill. An "_accent" icon on that
// fill would vanish, so switch the badge to ink whenever the resolved PNG
// variant is itself accent-colored, guaranteeing contrast either way.
function iconHex(name, size = "9mm") {
  const { src, variant } = resolveIcon(name, "badge");
  const cls = variant === "accent" ? "hex hex-ink" : "hex hex-accent";
  const padded = `calc(${size} * 0.52)`;
  return `<div class="${cls}" style="width:${size};height:${size};"><img src="${src}" alt="" style="width:${padded};height:${padded};"></div>`;
}

function numHex(num, size = "11mm") {
  return `<div class="hex hex-ink num-hex on-light" style="width:${size};height:${size};">${num}</div>`;
}

// Text-glyph hexagon badge (e.g. an "X" cross) for cases with no matching icon PNG.
function hexGlyph(glyph, size = "9mm") {
  const fontSize = `calc(${size} * 0.62)`;
  return `<div class="hex hex-accent hex-glyph" style="width:${size};height:${size};font-size:${fontSize};">${glyph}</div>`;
}

function htmlShell(bodyHtml, extraCss = "", bodyClass = "light-doc") {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="style.css">
<style>${extraCss}</style>
</head>
<body class="${bodyClass}">
${bodyHtml}
</body>
</html>`;
}

function brandLogo(widthMm = "90mm") {
  return `<img class="brand-logo" src="brand/patto-logo-white.png" alt="PATTO" style="width:${widthMm}">`;
}

// Bold diagonal-cut color panel — the series' signature background motif,
// replacing soft circles. dir controls which corner it bleeds from.
function accentPanel(opts) {
  const { top, left, right, bottom, w, h, tone = "accent", clip } = opts;
  const pos = [];
  if (top !== undefined) pos.push(`top:${top}`);
  if (left !== undefined) pos.push(`left:${left}`);
  if (right !== undefined) pos.push(`right:${right}`);
  if (bottom !== undefined) pos.push(`bottom:${bottom}`);
  const toneCls = tone === "accent" ? "" : ` ${tone}`;
  const clipStyle = clip ? `clip-path:${clip};` : "";
  return `<div class="accent-panel${toneCls}" style="width:${w};height:${h};${pos.join(";")};${clipStyle}"></div>`;
}

function darkPage(innerHtml) {
  return `<div class="dark-page">${innerHtml}</div>`;
}

function sectionHeader(tag, title) {
  return `<div class="section-tag">${tag}</div>
<h1 class="page-title">${title}</h1>`;
}

function legendCard(num, title, desc) {
  return `<div class="legend-card">
  ${numHex(num)}
  <div class="l-title">${title}</div>
  <div class="l-desc">${desc}</div>
</div>`;
}

function tocRow(num, iconName, title, sub) {
  return `<div class="toc-row">
  ${numHex(num)}
  <img class="toc-icon" src="${icon(iconName, "onLight")}" alt="">
  <div class="toc-text">
    <div class="t-title">${title}</div>
    <div class="t-sub">${sub}</div>
  </div>
</div>`;
}

function tipBox(iconName, label, text) {
  return `<div class="tip-box">
  ${iconHex(iconName, "8mm")}
  <div><span class="tip-label">${label}</span> ${text}</div>
</div>`;
}

function disclaimer(text) {
  return `<div class="disclaimer">${text}</div>`;
}

function quoteBlock({ text, source }) {
  return `<div class="quote-block">
  <span class="q-mark">&ldquo;</span>
  <div class="q-text">${text}</div>
  <div class="q-source">${source}</div>
</div>`;
}

// ---------- Gym Guide-specific components ----------

// kind: "do" | "dont". iconHtml is pre-rendered badge markup (iconHex(...) or hexGlyph(...)).
function doDontCard(kind, title, iconHtml, items) {
  const label = kind === "do" ? "&#10003;" : "&#10005;";
  const rows = items.map(text => `<div class="dodont-item"><span class="mark">${label}</span><div>${text}</div></div>`).join("\n");
  return `<div class="dodont-card ${kind}">
  <div class="dodont-head">${iconHtml}${title}</div>
  <div class="dodont-body">${rows}</div>
</div>`;
}

function gymGrid(gyms) {
  const items = gyms.map(name => `<div class="gym-item">${name}</div>`).join("\n");
  return `<div class="gym-grid">${items}</div>`;
}

function regionPageTitle(tag, name) {
  return `<div class="section-tag">${tag}</div>
<h1 class="page-title region-page-title"><img class="page-title-icon" src="${icon("mapMarked", "onLight")}" alt="">${name}</h1>`;
}

function regionSubTitle(iconName, title) {
  return `<div class="region-sub-title"><img class="rs-icon" src="${icon(iconName, "onLight")}" alt="">${title}</div>`;
}

function regionCard(num, name, count, tag) {
  return `<div class="region-card">
  <div class="rc-num">${num}</div>
  <div class="rc-name">${name}</div>
  <div class="rc-count">${count} Gyms</div>
  <div class="rc-tag">${tag}</div>
</div>`;
}

function gymIndexItem(name, region) {
  return `<div class="gym-index-item"><span class="gi-name">${name}</span><span class="gi-region">${region}</span></div>`;
}

// ---------- Strength & Conditioning components ----------

// Page title with a leading icon (same pattern as the Gym Guide region pages).
function iconPageTitle(tag, iconName, title) {
  return `<div class="section-tag">${tag}</div>
<h1 class="page-title region-page-title"><img class="page-title-icon" src="${icon(iconName, "onLight")}" alt="">${title}</h1>`;
}

// Small heading with a numbered hexagon, used for warm-up phases and circuit variants.
function blockTitle(num, title, meta = "") {
  const m = meta ? `<span class="bt-meta">${meta}</span>` : "";
  return `<div class="block-head">${numHex(num, "8mm")}<span class="bt-title">${title}</span>${m}</div>`;
}

// Generic PATTO table. cols: [{label, cls}], rows: [{cells:[...], contrast}]
function exTable(cols, rows, extraCls = "") {
  const head = cols.map(c => `<th class="${c.cls || ""}">${c.label}</th>`).join("");
  const body = rows.map(r => {
    const cells = r.cells.map((v, i) => `<td class="${cols[i].cls || ""}">${v}</td>`).join("");
    return `<tr class="${r.contrast ? "contrast" : ""}">${cells}</tr>`;
  }).join("\n");
  return `<table class="ex-table ${extraCls}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function contrastLegend() {
  return `<div class="contrast-legend"><span class="cl-swatch"></span>Kontrastsatz: schwere Kraftübung, direkt gefolgt von der explosiven Variante</div>`;
}

// Dark strip for finishers: big label left, protocol right.
function finisherBox(title, rounds, protocol) {
  return `<div class="finisher">
  ${iconHex("stopwatch", "9mm")}
  <div class="f-text"><div class="f-title">${title} <span class="f-rounds">${rounds}</span></div><div class="f-proto">${protocol}</div></div>
</div>`;
}

// Session fact chips (Dauer, Fokus, Equipment ...)
function factRow(facts) {
  return `<div class="fact-row">${facts.map(([k, v]) => `<div class="fact"><div class="f-k">${k}</div><div class="f-v">${v}</div></div>`).join("")}</div>`;
}

// Weekly grid. days: [{d:"Mo", v:"MT", kind:"thai"|"sc"|"rest"|"opt"}]
function weekGrid(days) {
  return `<div class="week-grid">${days.map(x => `<div class="wg-col"><div class="wg-day">${x.d}</div><div class="wg-cell ${x.kind}">${x.v}</div></div>`).join("")}</div>`;
}

function weekLegend() {
  return `<div class="week-legend">
  <span><i class="thai"></i>Muay Thai</span><span><i class="sc"></i>S&amp;C-Einheit</span><span><i class="opt"></i>optional</span><span><i class="rest"></i>Ruhetag</span>
</div>`;
}

// Generic dark summary card (re-uses the region-card look).
function infoCard(num, name, sub, text) {
  return `<div class="region-card">
  <div class="rc-num">${num}</div>
  <div class="rc-name">${name}</div>
  <div class="rc-count">${sub}</div>
  <div class="rc-tag">${text}</div>
</div>`;
}

// Blank tracking sheet for one workout.
function trackerBlock(rows = 6) {
  const empty = Array.from({ length: rows }, () => `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join("");
  return `<div class="tracker">
  <div class="tr-head"><span>Einheit:</span><span>Datum:</span><span>Woche:</span></div>
  <table class="ex-table tracker-table">
    <thead><tr><th class="w-ex">Übung</th><th>Gewicht</th><th>Satz 1</th><th>Satz 2</th><th>Satz 3</th><th>Satz 4</th></tr></thead>
    <tbody>${empty}</tbody>
  </table>
  <div class="tr-foot"><span>Finisher / Kondition:</span><span>Gefühl (1–10):</span></div>
</div>`;
}

module.exports = {
  icon, iconHex, numHex, hexGlyph, htmlShell, sectionHeader, legendCard, tocRow, tipBox, disclaimer, quoteBlock,
  brandLogo, accentPanel, darkPage, doDontCard, gymGrid, regionSubTitle, regionCard, gymIndexItem, regionPageTitle,
  iconPageTitle, blockTitle, exTable, contrastLegend, finisherBox, factRow, weekGrid, weekLegend, infoCard, trackerBlock,
};
