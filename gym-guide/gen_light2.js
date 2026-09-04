const fs = require("fs");
const { sectionHeader, doDontCard, tipBox, tocRow, disclaimer, htmlShell, iconHex, hexGlyph } = require("./htmlkit.js");
const data = require("./data.js");

let out = [];

// --- Gym-Wahl: Do / Don't ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Kapitel 1 · Vorbereitung", "Worauf solltest du bei der Gym-Wahl achten?"));
out.push(`<p class="page-intro">${data.GYMWAHL_GUT_INTRO} / ${data.GYMWAHL_SCHLECHT_INTRO}</p>`);
out.push(`<div class="dodont-cols">`);
out.push(doDontCard("do", "Gutes Gym", iconHex("checkCircle", "7mm"), data.GYMWAHL_GUT));
out.push(doDontCard("dont", "Schlechtes Gym", hexGlyph("&#10005;", "7mm"), data.GYMWAHL_SCHLECHT));
out.push(`</div>`);
out.push(`</div>`);

// --- Recherchetipps ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Kapitel 1 · Vorbereitung", "Recherchetipps – Wie findest du das passende Gym?"));
out.push(`<p class="page-intro">${data.RECHERCHE_INTRO}</p>`);
out.push(`<div class="dodont-cols" style="grid-template-columns:1fr;">`);
out.push(doDontCard("dont", "Warnzeichen kommerzieller Gyms", iconHex("vibratingShield", "7mm"), data.RECHERCHE_WARN));
out.push(`</div>`);
out.push(tipBox("comments", "Recherche-Tipp:", data.RECHERCHE_OUTRO));
out.push(`</div>`);

// --- Bevor du gehst ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Kapitel 1 · Vorbereitung", "Bevor du gehst"));
out.push(`<p class="page-intro">Ein gutes Gym allein reicht nicht – so kommst du optimal vorbereitet in dein Trainingscamp.</p>`);
const tips = [
  ["1", "mapMarked", "Region wählen", "Überlege dir, was du suchst – intensives Training, traditionelles Muay Thai, gute Infrastruktur oder Ruhe. Die Region sollte zu deinen Trainingszielen und deinem Alltag passen."],
  ["2", "route", "Unterkunft in Gym-Nähe wählen", "Kurze Wege sparen Zeit und Energie – besonders wenn du zweimal täglich trainierst. Idealerweise liegt deine Unterkunft nur wenige Minuten vom Gym entfernt."],
  ["3", "compass", "Verschiedene Gyms anschauen", "Schau dir vor Ort mehrere Gyms an – viele kannst du spontan und unangekündigt besuchen. Mach, wenn möglich, ein Probetraining und entscheide erst danach, welches Gym am besten zu dir passt."],
  ["4", "shieldBash", "Passende Ausrüstung mitbringen", "Handbandagen, Mundschutz und eigene Handschuhe gehören zur Grundausstattung. Eigene Ausrüstung ist zudem hygienischer und du bist unabhängig vom Equipment des Gyms."],
  ["5", "templeGate", "Grundregeln & Respekt zeigen", "Sei pünktlich, aufmerksam und respektvoll gegenüber Trainern und Trainingspartnern. Respekt und Disziplin gehören fest zur Muay-Thai-Kultur."],
  ["6", "stopwatch", "Auf den eigenen Körper hören", "Plane ausreichend Erholung ein – besonders bei täglichem Doppeltraining und tropischer Hitze. Pausen helfen dir, konstant zu trainieren und Überlastung zu vermeiden."],
];
tips.forEach(t => out.push(tocRow(t[0], t[1], t[2], t[3])));
out.push(disclaimer("<b>Wichtiger Hinweis:</b> Alle Empfehlungen in diesem Guide basieren auf Community-Feedback, persönlichen Erfahrungen und Recherche. Trainerteams, Preise und Qualität können sich ändern."));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-2.html", html);
console.log("light-2.html written");
