const fs = require("fs");
const { iconPageTitle, tipBox, htmlShell, exTable, disclaimer } = require("./htmlkit.js");
const { STRETCHING, HIP_MOBILITY } = require("./data.js");

const TAG = "Bonus · Mobilität";
let out = [];

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
out.push(disclaimer("<b>Wichtiger Hinweis:</b> Dieser Guide ersetzt keine ärztliche oder physiotherapeutische Beratung. Kläre bei Vorerkrankungen, Verletzungen oder Beschwerden vor Trainingsbeginn mit einem Arzt, ob das Training für dich geeignet ist. Das Training erfolgt auf eigene Verantwortung."));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-6.html", html);
console.log("light-6.html written");
