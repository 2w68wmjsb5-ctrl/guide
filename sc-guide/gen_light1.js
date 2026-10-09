const fs = require("fs");
const { sectionHeader, legendCard, tocRow, htmlShell } = require("./htmlkit.js");
const { CHAPTERS } = require("./chapters.js");

let out = [];

// --- Inhaltsverzeichnis ---
out.push(`<div class="content-section first-in-block">`);
out.push(sectionHeader("Guide-Übersicht", "Inhaltsverzeichnis"));
const rows = [["compass", "Vorwort", "Für wen dieser Guide gemacht ist und was er leisten soll"]]
  .concat(CHAPTERS.map(ch => [ch.icon, ch.title, ch.toc]))
  .concat([["sortNumeric", "Anhang", "Übungs-Index A–Z und Trainings-Tracker zum Ausdrucken"]]);
rows.forEach((r, i) => out.push(tocRow(String(i + 1).padStart(2, "0"), r[0], r[1], r[2])));
out.push(`</div>`);

// --- Wie benutze ich diesen Guide ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Guide-Übersicht", "Wie benutze ich diesen Guide?"));
out.push(`<p class="page-intro">Du musst nicht alles auf einmal lesen. Wähle dein Zeitmodell, plane deine Woche und leg los. Die Grundlagen kannst du nachlesen, wann immer du Fragen hast.</p>`);
out.push(`<div class="card-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4.5mm;">`);
out.push(legendCard("1", "Zeitmodell", "Minimum, Standard oder Plus: so viel S&amp;C, wie in deine Woche passt."));
out.push(legendCard("2", "Wochenplan", "Beispielwochen zeigen, wo die Einheiten neben dem Muay Thai liegen."));
out.push(legendCard("3", "Einheiten", "Warm-up plus drei Einheiten mit allen Übungen, Sätzen und Pausen."));
out.push(legendCard("4", "Tracker", "Trag jede Einheit ein, damit du siehst, wie du stärker wirst."));
out.push(`</div>`);
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-1.html", html);
console.log("light-1.html written");
