const fs = require("fs");
const { sectionHeader, legendCard, lexTable, tocRow, htmlShell } = require("./htmlkit.js");
const { PERSONEN_TITEL } = require("./data.js");

let out = [];
const beispielEintrag = PERSONEN_TITEL.find(r => r[0] === "Lehrer / Trainer");

out.push(`<div class="content-section first-in-block">`);
out.push(sectionHeader("Kapitel 1 · Vorwort", "Wie benutze ich diesen Guide?"));
out.push(`<p class="page-intro">Jeder Eintrag im PATTO Lexikon folgt demselben klaren Format – damit du im Gym, beim Reisen oder beim Nachschlagen sofort findest, was du brauchst.</p>`);

out.push(`<div class="card-grid cols-4">`);
out.push(legendCard("users", "Deutsch", "Die deutsche Übersetzung des Begriffs – dein Ausgangspunkt."));
out.push(legendCard("commentDots", "Phonetik", "Die Lautschrift zum lauten Nachsprechen – so wie du es im Gym hörst."));
out.push(legendCard("book", "Thai-Schrift", "Das Original in Thai – zum Zeigen, Lesen und Wiedererkennen."));
out.push(legendCard("lightbulb", "Beschreibung", "Eine kurze, anschauliche Erklärung der Bedeutung oder Ausführung."));
out.push(`</div>`);

out.push(`<h2 class="block-title">Beispiel-Eintrag</h2>`);
out.push(lexTable([beispielEintrag], { colWidths: [20, 18, 14, 48] }));
out.push(`</div>`);

// --- Inhaltsverzeichnis (eigene Seite, damit sie nicht umbricht) ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Gliederung", "Der Guide im Überblick"));
out.push(`<p class="page-intro">Fünf Kapitel, ein System: von den Grundlagen bis zu den traditionellen Techniken des Muay Boran.</p>`);

const items = [
  ["01", "compass", "Vorwort", "Ziel, Nutzung & Einstieg in die Sprache des Muay Thai"],
  ["02", "sortNumeric", "Grundlagen", "Zahlen, Körperteile, Adjektive, Personen und Titel"],
  ["03", "commentDots", "Phrasen, Training & Wettkampf", "Sätze, Training & Ausrüstung, Wettkampf, Kampfstile"],
  ["04", "highKick", "Techniken", "Generelle Techniken, Schlag, Kick, Knie, Ellbogen, Clinch, Block, Schritte"],
  ["05", "scroll", "Traditionelle Techniken", "Bonus: Mae Mai & Look Mai – das Erbe des Muay Boran"],
];
items.forEach(it => out.push(tocRow(it[0], it[1], it[2], it[3])));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-1.html", html);
console.log("light-1.html written");
