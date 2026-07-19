const fs = require("fs");
const { sectionHeader, lexTable, htmlShell } = require("./htmlkit.js");
const { ZAHLEN, KOERPERTEILE, ADJEKTIVE, PERSONEN_TITEL } = require("./data.js");

let out = [];

// --- Zahlen ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("02 · Grundlagen", "Zahlen"));
out.push(`<p class="page-intro">Ob beim Zählen der Runden, Wiederholungen oder Sätze – diese Zahlen begegnen dir in jeder Trainingseinheit.</p>`);
out.push(lexTable(ZAHLEN, { colWidths: [20, 20, 16, 44] }));
out.push(`</div>`);

// --- Körperteile ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("02 · Grundlagen", "Körperteile"));
out.push(`<p class="page-intro">Vom Kopf bis zum Fuß – das Vokabular für Ziele, Waffen und Verletzungen im Muay Thai.</p>`);
out.push(lexTable(KOERPERTEILE, { colWidths: [22, 20, 16, 42] }));
out.push(`</div>`);

// --- Adjektive ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("02 · Grundlagen", "Adjektive"));
out.push(`<p class="page-intro">Kurze Wörter, die im Gym-Alltag ständig fallen – von Tempo über Kraft bis Zustand.</p>`);
out.push(lexTable(ADJEKTIVE, { colWidths: [22, 22, 16, 40] }));
out.push(`</div>`);

// --- Personen & Titel ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("02 · Grundlagen", "Personen &amp; Titel"));
out.push(`<p class="page-intro">Wer ist wer im Camp und im Ring – von Trainer bis Champion.</p>`);
out.push(lexTable(PERSONEN_TITEL, { colWidths: [24, 20, 16, 40] }));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-2.html", html);
console.log("light-2.html written");
