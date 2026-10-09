const fs = require("fs");
const { sectionHeader, iconPageTitle, tipBox, htmlShell, exTable, infoCard } = require("./htmlkit.js");
const { EINHEIT_A, EINHEIT_C, STRETCHING, HIP_MOBILITY } = require("./data.js");

const TAG = "Kapitel 4 · Kondition &amp; Mobilität";
let out = [];

// --- Kondition ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Kondition gezielt ergänzen"));
out.push(`<p class="page-intro">Die gute Nachricht zuerst: Den größten Teil deiner Ausdauer trainierst du bereits im Muay Thai. Pratzenrunden, Sandsack, Clinch und Sparring sind nichts anderes als hartes Intervalltraining. Zusätzliche Konditionseinheiten brauchst du deshalb nur gezielt und in kleiner Dosis.</p>`);
out.push(`<div class="region-cards" style="grid-template-columns:1fr 1fr 1fr;">`);
out.push(infoCard("01", "Sprint-Finisher", "In Einheit A und C", "Kurze Vollgas-Sprints am Ende der Krafteinheit. Sie trainieren deine Fähigkeit, dich nach explosiven Aktionen schnell zu erholen."));
out.push(infoCard("02", "Lockerer Lauf", "Optional · 20 bis 40 Min.", "In einem Tempo, in dem du dich noch unterhalten kannst. Ideal als aktive Erholung oder morgens vor dem Training, wie in vielen Camps in Thailand üblich."));
out.push(infoCard("03", "Seilspringen", "Optional · 5 bis 15 Min.", "Der Muay-Thai-Klassiker verbessert Fußarbeit, Rhythmus und die Ausdauer der Waden und passt in jedes Warm-up."));
out.push(`</div>`);
out.push(`<h2 class="block-title">Die Finisher im Überblick</h2>`);
out.push(exTable(
  [{ label: "Einheit", cls: "w-ex" }, { label: "Gerät" }, { label: "Runden" }, { label: "Belastung" }, { label: "Pause" }],
  [["A", EINHEIT_A.finisher], ["C", EINHEIT_C.finisher]].map(([l, f]) => ({ cells: [`Einheit ${l}`, f.title.replace("-Finisher", ""), f.rounds, f.work, f.rest] }))
));
out.push(tipBox("stopwatch", "Vollgas heißt Vollgas:", "In den Sprintphasen gehst du an dein Maximum. Kannst du die Intensität nicht mehr halten, beende den Finisher lieber eine Runde früher, statt im Halbgas weiterzumachen."));
out.push(tipBox("lightbulb", "Kein Airbike?", "Ruderergometer, Sprints am Berg oder auf dem Laufband und Vollgas-Runden am Sandsack funktionieren nach demselben Schema."));
out.push(`</div>`);

// --- Stretching ---
const stretchSec = STRETCHING.reduce((n, r) => n + r[3], 0);
out.push(`<div class="content-section chapter-start">`);
out.push(iconPageTitle(TAG, "highKick", "Stretching"));
out.push(`<p class="page-intro">Hohe Kicks, ein tiefer Stand und schnelle Hüftrotation brauchen Beweglichkeit. Dieser Stretching-Flow dauert ${Math.round(stretchSec / 60)} Minuten und eignet sich ideal für den Abend oder einen trainingsfreien Tag. Geh die Positionen der Reihe nach durch und atme ruhig weiter.</p>`);
out.push(exTable(
  [{ label: "Übung", cls: "w-ex" }, { label: "Körperpartie", cls: "w-ex" }, { label: "Ausführung", cls: "w-ex" }, { label: "Zeit" }],
  STRETCHING.map(r => ({ cells: [r[0], `<span style="color:var(--text-muted)">${r[1]}</span>`, r[2], `${r[3]} Sek.`] })), "xcompact"
));
out.push(`</div>`);

// --- Hüftmobilität ---
out.push(`<div class="content-section chapter-start">`);
out.push(iconPageTitle(TAG, "kneeCap", "Hüftmobilität"));
out.push(`<p class="page-intro">Die Hüfte ist das Kraftzentrum für Kicks und Knie. Diese Übungen verbessern Rotation und Kontrolle im Hüftgelenk und machen dich am Boden und in der Kampfstellung beweglicher. Nutze sie als Ergänzung zum Warm-up oder an trainingsfreien Tagen.</p>`);
out.push(exTable(
  [{ label: "Übung", cls: "w-ex" }, { label: "Sätze" }, { label: "Wdh." }, { label: "Ausführung", cls: "w-ex" }],
  HIP_MOBILITY.map(r => ({ cells: [r[0], r[1], r[2], `<span style="font-size:8.5pt;color:var(--text-muted)">${r[3]}</span>`] }))
));
out.push(tipBox("lightbulb", "Langsam ist schnell:", "Mobilitätsübungen leben von Kontrolle, nicht von Schwung. Beweg dich nur so weit, wie du die Position aktiv halten kannst."));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-5.html", html);
console.log("light-5.html written");
