const fs = require("fs");
const { sectionHeader, lexTable, tipBox, quoteBlock, htmlShell } = require("./htmlkit.js");
const { ZAHLEN, KOERPERTEILE, ADJEKTIVE, PERSONEN_TITEL } = require("./data.js");

let out = [];

// --- Zahlen ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("02 · Grundlagen", "Zahlen"));
out.push(`<p class="page-intro">Bevor es in die Tiefe geht, sind die Grundlagen entscheidend. In diesem Kapitel findest du die wichtigsten Wörter und Begriffe, die dir in jedem Muay Thai Gym in Thailand begegnen können. Dazu gehören die Zahlen, die oft beim Zählen von Wiederholungen oder Runden verwendet werden, die Bezeichnungen der Körperteile, die im Training oder Kampf eine Rolle spielen, sowie typische Adjektive und Beschreibungen, um Techniken oder Bewegungen genauer zu erklären. Außerdem erfährst du, wie Personen im Gym respektvoll angesprochen werden – vom Trainingspartner bis hin zum Trainer.</p>`);
out.push(lexTable(ZAHLEN, { noDesc: true, colWidths: [30, 30, 40] }));
out.push(tipBox("lightbulb", "Lerntipp:", "Zähle beim nächsten Seilspringen oder Sit-up-Satz laut auf Thai mit – Bewegung und Wort verknüpfen sich so am schnellsten."));
out.push(`</div>`);

// --- Körperteile ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("02 · Grundlagen", "Körperteile"));
out.push(`<p class="page-intro">Vom Kopf bis zum Fuß – das Vokabular für Ziele, Waffen und Verletzungen im Muay Thai.</p>`);
out.push(lexTable(KOERPERTEILE, { noDesc: true, colWidths: [30, 30, 40] }));
out.push(`</div>`);

// --- Adjektive ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("02 · Grundlagen", "Adjektive und Beschreibungen"));
out.push(`<p class="page-intro">Kurze Wörter, die im Gym-Alltag ständig fallen – von Tempo über Kraft bis zum Muskelkater danach.</p>`);
out.push(lexTable(ADJEKTIVE, { colWidths: [22, 22, 16, 40] }));
out.push(`</div>`);

// --- Personen & Titel ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("02 · Grundlagen", "Personen und Titel"));
out.push(`<p class="page-intro">Wer ist wer im Camp und im Ring – von Trainingspartner bis Champion.</p>`);
out.push(lexTable(PERSONEN_TITEL, { colWidths: [24, 20, 16, 40] }));
out.push(quoteBlock({
  thai: "ช้าๆ ได้พร้าเล่มงาม",
  text: "„Langsam, langsam bekommst du ein schönes Messer.“ Gute Technik – und ein guter Wortschatz – entstehen durch Geduld, nicht durch Eile.",
  source: "Thailändisches Sprichwort",
}));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-2.html", html);
console.log("light-2.html written");
