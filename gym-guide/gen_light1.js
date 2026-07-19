const fs = require("fs");
const { sectionHeader, checklistCol, tipBox, htmlShell } = require("./htmlkit.js");
const data = require("./data.js");

let out = [];

// --- Worauf solltest du bei der Gym-Wahl achten? ---
out.push(`<div class="content-section first-in-block">`);
out.push(sectionHeader("Kapitel 1 · Vorbereitung", "Worauf solltest du bei der Gym-Wahl achten?"));
out.push(`<p class="page-intro">${data.GYMWAHL_GUT_INTRO} / ${data.GYMWAHL_SCHLECHT_INTRO}</p>`);
out.push(`<div class="checklist-cols">`);
out.push(checklistCol("good", "Gutes Gym", data.GYMWAHL_GUT));
out.push(checklistCol("bad", "Schlechtes Gym", data.GYMWAHL_SCHLECHT));
out.push(`</div>`);
out.push(`</div>`);

// --- Recherchetipps ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Kapitel 1 · Vorbereitung", "Recherchetipps – Wie findest du das passende Gym?"));
out.push(`<p class="page-intro">${data.RECHERCHE_INTRO}</p>`);
out.push(`<h2 class="block-title" style="margin-top:0;">Das bedeutet in der Praxis oft:</h2>`);
out.push(`<div class="checklist-cols" style="grid-template-columns:1fr;">`);
out.push(checklistCol("bad", "Warnzeichen kommerzieller Gyms", data.RECHERCHE_WARN));
out.push(`</div>`);
out.push(tipBox("comments", "Recherche-Tipp:", data.RECHERCHE_OUTRO));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-1.html", html);
console.log("light-1.html written");
