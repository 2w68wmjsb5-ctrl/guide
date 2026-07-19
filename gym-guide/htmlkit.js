const fs = require("fs");
const path = require("path");

const ICON_DIR = path.join(__dirname, "icons");
// "badge": icon sits inside a solid accent/navy circle -> needs a light icon first.
// "onLight": icon sits directly on a white/light background -> needs a dark icon first.
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

// Icon-badge circles default to an accent-orange fill. An "_accent" icon on
// that fill would vanish, so switch the badge to navy whenever the resolved
// PNG variant is itself accent-colored, guaranteeing contrast either way.
function iconBadge(name) {
  const { src, variant } = resolveIcon(name, "badge");
  const cls = variant === "accent" ? "icon-badge circle-primary" : "icon-badge";
  return `<div class="${cls}"><img src="${src}" alt=""></div>`;
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

function bgCircle(size, pos, extraClass = "") {
  const style = Object.entries(pos).map(([k, v]) => `${k}:${v}`).join(";");
  return `<div class="bg-circle ${extraClass}" style="width:${size};height:${size};${style}"></div>`;
}

function darkPage(innerHtml) {
  return `<div class="dark-page">${innerHtml}</div>`;
}

function sectionHeader(tag, title) {
  return `<div class="section-tag">${tag}</div>
<h1 class="page-title">${title}</h1>`;
}

function legendCard(iconName, title, desc) {
  return `<div class="legend-card">
  ${iconBadge(iconName)}
  <div class="l-title">${title}</div>
  <div class="l-desc">${desc}</div>
</div>`;
}

function tocRow(num, iconName, title, sub) {
  return `<div class="toc-row">
  <div class="num-circle">${num}</div>
  <img class="toc-icon" src="${icon(iconName, "onLight")}" alt="">
  <div class="toc-text">
    <div class="t-title">${title}</div>
    <div class="t-sub">${sub}</div>
  </div>
</div>`;
}

function catCard(iconName, title, meta) {
  return `<div class="cat-card">
  ${iconBadge(iconName)}
  <div class="cat-title">${title}</div>
  <div class="cat-meta">${meta}</div>
</div>`;
}

function tipBox(iconName, label, text) {
  return `<div class="tip-box">
  <img src="${icon(iconName, "badge")}" alt="">
  <div><span class="tip-label">${label}</span> ${text}</div>
</div>`;
}

function quoteBlock({ text, source }) {
  return `<div class="quote-block">
  <span class="q-mark">&ldquo;</span>
  <div class="q-text">${text}</div>
  <div class="q-source">${source}</div>
</div>`;
}

// ---------- Gym Guide-specific components ----------

// kind: "good" | "bad"
function checklistCol(kind, title, items) {
  const iconMark = kind === "good" ? icon("checkCircle", "onLight") : null;
  const rows = items.map(text => {
    const marker = iconMark
      ? `<img src="${iconMark}" alt="">`
      : `<span class="bullet-dash"></span>`;
    return `<div class="check-item">${marker}<div>${text}</div></div>`;
  }).join("\n");
  return `<div class="checklist-col ${kind}">
  <div class="cl-title"><span class="cl-dot"></span>${title}</div>
  ${rows}
</div>`;
}

function gymGrid(gyms) {
  const items = gyms.map(name => `<div class="gym-item"><img src="${icon("mapMarked", "onLight")}" alt="">${name}</div>`).join("\n");
  return `<div class="gym-grid">${items}</div>`;
}

function regionSubTitle(iconName, title) {
  return `<div class="region-sub-title"><img class="rs-icon" src="${icon(iconName, "onLight")}" alt="">${title}</div>`;
}

module.exports = {
  icon, iconBadge, htmlShell, sectionHeader, legendCard, tocRow, catCard, tipBox, quoteBlock,
  brandLogo, bgCircle, darkPage, checklistCol, gymGrid, regionSubTitle,
};
