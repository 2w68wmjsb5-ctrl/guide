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

function brand(variant = "on-dark") {
  return `<span class="brand ${variant}">P<span class="turned-a">&Lambda;</span>TTO</span>`;
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

function lexTable(rows, opts = {}) {
  const colWidths = opts.colWidths || [22, 20, 18, 40];
  const headers = opts.headers || ["Deutsch", "Phonetik", "ภาษาไทย", "Beschreibung"];
  const colgroup = colWidths.map(w => `<col style="width:${w}%">`).join("");
  const thead = `<thead><tr>
    <th class="col-de" style="width:${colWidths[0]}%">${headers[0]}</th>
    <th class="col-phon" style="width:${colWidths[1]}%">${headers[1]}</th>
    <th class="col-thai" style="width:${colWidths[2]}%">${headers[2]}</th>
    <th class="col-desc" style="width:${colWidths[3]}%">${headers[3]}</th>
  </tr></thead>`;
  const tbody = rows.map(([de, phon, thai, desc]) => `<tr>
    <td class="col-de">${de}</td>
    <td class="col-phon">${phon}</td>
    <td class="col-thai">${thai}</td>
    <td class="col-desc">${desc}</td>
  </tr>`).join("\n");
  return `<table class="lex-table">
  <colgroup>${colgroup}</colgroup>
  ${thead}
  <tbody>${tbody}</tbody>
</table>`;
}

function iconDarkCard(entry) {
  const { icon: iconName, de, phon, thai, desc } = entry;
  return `<div class="dark-card">
  ${iconBadge(iconName)}
  <div class="card-title">${de}</div>
  <div class="card-meta"><span class="phon">${phon}</span><span class="thai">${thai}</span></div>
  <div class="card-desc">${desc}</div>
</div>`;
}

function ritualCard(r) {
  return iconDarkCard(r);
}

function kampfstilCard(k) {
  return iconDarkCard(k);
}

function techRow(num, e) {
  return `<div class="tech-row">
  <div class="num-badge">${num}</div>
  <div class="tech-main">
    <div class="name">${e.de}</div>
    <div class="meta"><span class="phon">${e.phon}</span><span class="thai">${e.thai}</span></div>
  </div>
  <div class="tech-desc">${e.desc}</div>
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

module.exports = {
  icon, iconBadge, htmlShell, sectionHeader, legendCard, tocRow, lexTable,
  ritualCard, kampfstilCard, techRow, catCard, tipBox,
  brand, bgCircle, darkPage,
};
