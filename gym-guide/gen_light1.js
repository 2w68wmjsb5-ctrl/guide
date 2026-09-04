const fs = require("fs");
const { sectionHeader, legendCard, tocRow, htmlShell } = require("./htmlkit.js");

let out = [];

// --- Inhaltsverzeichnis ---
out.push(`<div class="content-section first-in-block">`);
out.push(sectionHeader("Guide-Übersicht", "Inhaltsverzeichnis"));
const tocItems = [
  ["01", "compass", "Vorwort", "Warum dieser Guide entstanden ist und für wen er gemacht ist"],
  ["02", "checkCircle", "Vorbereitung", "Gutes vs. schlechtes Gym, Recherchetipps, bevor du gehst"],
  ["03", "mapMarked", "Gym-Verzeichnis", "7 Regionen mit über 50 empfohlenen Gyms"],
  ["04", "sortNumeric", "Gym-Index A–Z", "Alle Gyms alphabetisch geordnet, mit Region zum Nachschlagen"],
];
tocItems.forEach(it => out.push(tocRow(it[0], it[1], it[2], it[3])));
out.push(`</div>`);

// --- Wie benutze ich diesen Guide ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Guide-Übersicht", "Wie benutze ich diesen Guide?"));
out.push(`<p class="page-intro">Jedes Kapitel folgt demselben klaren Format – damit du auf Reisen oder beim Planen sofort findest, was du brauchst.</p>`);
out.push(`<div class="card-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4.5mm;">`);
out.push(legendCard("1", "Regionen", "7 Regionen, die ganz Thailand abdecken – vom Norden bis in den Süden."));
out.push(legendCard("2", "Do / Don&#39;t", "Klare Kriterien für gute und schlechte Gyms auf einen Blick."));
out.push(legendCard("3", "Gym-Karten", "Kompakte Empfehlungen mit Region zum schnellen Nachschlagen."));
out.push(legendCard("4", "Index", "Alle über 50 Gyms alphabetisch mit Region zum Nachschlagen."));
out.push(`</div>`);
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-1.html", html);
console.log("light-1.html written");
