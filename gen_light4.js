const fs = require("fs");
const { sectionHeader, lexTable, catCard, htmlShell } = require("./htmlkit.js");
const {
  TECHNIK_KATEGORIEN, TECH_SCHLAG, TECH_KICK, TECH_KNIE,
  TECH_ELLBOGEN, TECH_CLINCH, TECH_BLOCK, TECH_SCHRITTE,
} = require("./data.js");

let out = [];

// --- Überblick ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("04 · Techniken", "Techniken im Überblick"));
out.push(`<p class="page-intro">Sieben Grundkategorien bilden das technische Fundament des Muay Thai – vom Schlag bis zur Fußarbeit.</p>`);
out.push(`<div class="card-grid cols-4">`);
TECHNIK_KATEGORIEN.forEach(k => out.push(catCard(k.icon, k.title, k.meta)));
out.push(`</div></div>`);

const sections = [
  ["Schlag", TECH_SCHLAG, "Handtechniken – die schnellste Waffe, meist zur Vorbereitung von Kicks und Knien genutzt."],
  ["Kick", TECH_KICK, "Bein- und Tritttechniken – Reichweite und Kraft, das Markenzeichen des Muay Thai."],
  ["Knie", TECH_KNIE, "Nahkampfwaffen, die vor allem im Clinch zum Einsatz kommen."],
  ["Ellbogen", TECH_ELLBOGEN, "Die schärfste Waffe im Muay Thai – kurze Distanz, hohe Verletzungsgefahr."],
  ["Clinch", TECH_CLINCH, "Der Ringkampf im Stehen – Kontrolle über Kopf, Nacken und Arme des Gegners."],
  ["Block", TECH_BLOCK, "Verteidigungstechniken, um Schläge und Tritte abzuwehren oder zu neutralisieren."],
  ["Schritte", TECH_SCHRITTE, "Fußarbeit als Grundlage für Distanzkontrolle, Angriff und Verteidigung."],
];

sections.forEach(([title, rows, intro]) => {
  out.push(`<div class="content-section content-block">`);
  out.push(sectionHeader("04 · Techniken", title));
  out.push(`<p class="page-intro">${intro}</p>`);
  out.push(lexTable(rows, { colWidths: [26, 22, 16, 36] }));
  out.push(`</div>`);
});

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-4.html", html);
console.log("light-4.html written");
