const fs = require("fs");
const { sectionHeader, doDontCard, tipBox, tocRow, disclaimer, htmlShell } = require("./htmlkit.js");
const data = require("./data.js");

let out = [];

// --- Gym-Wahl: Do / Don't ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Kapitel 1 · Vorbereitung", "Worauf solltest du bei der Gym-Wahl achten?"));
out.push(`<p class="page-intro">${data.GYMWAHL_GUT_INTRO} / ${data.GYMWAHL_SCHLECHT_INTRO}</p>`);
out.push(`<div class="dodont-cols">`);
out.push(doDontCard("do", "Gutes Gym", "checkCircle", data.GYMWAHL_GUT));
out.push(doDontCard("dont", "Schlechtes Gym", "shieldBash", data.GYMWAHL_SCHLECHT));
out.push(`</div>`);
out.push(`</div>`);

// --- Recherchetipps ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("Kapitel 1 · Vorbereitung", "Recherchetipps – Wie findest du das passende Gym?"));
out.push(`<p class="page-intro">${data.RECHERCHE_INTRO}</p>`);
out.push(`<div class="dodont-cols" style="grid-template-columns:1fr;">`);
out.push(doDontCard("dont", "Warnzeichen kommerzieller Gyms", "vibratingShield", data.RECHERCHE_WARN));
out.push(`</div>`);
out.push(tipBox("comments", "Recherche-Tipp:", data.RECHERCHE_OUTRO));
out.push(`</div>`);

// --- Bevor du gehst ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Kapitel 1 · Vorbereitung", "Bevor du gehst"));
out.push(`<p class="page-intro">Ein gutes Gym allein reicht nicht – so kommst du optimal vorbereitet in dein Trainingscamp. Sechs PATTO-Tipps aus der Praxis.</p>`);
const tips = [
  ["1", "commentDots", "Kontakt vorab aufnehmen", "Schreib dem Gym vor der Anreise (Instagram, E-Mail) – frag nach Verfügbarkeit, Preisen und ob ein Probetraining möglich ist."],
  ["2", "mapMarked", "Unterkunft in Gym-Nähe wählen", "Kurze Wege sparen Zeit und Energie, gerade bei zwei Trainingseinheiten am Tag."],
  ["3", "shieldBash", "Passende Ausrüstung mitbringen", "Handbandagen, Mundschutz und eigene Handschuhe sind in den meisten Gyms Pflicht oder empfehlenswert."],
  ["4", "templeGate", "Grundregeln & Respekt zeigen", "Wai Khru, Verbeugung vor dem Ring, Pünktlichkeit und Respekt gegenüber Trainern gehören zur Kultur des Muay Thai."],
  ["5", "stopwatch", "Auf den eigenen Körper hören", "Plane Ruhetage ein, gerade bei täglichem Doppeltraining in tropischer Hitze."],
  ["6", "checkCircle", "Reiseversicherung mit Sportklausel", "Muay Thai zählt bei vielen Anbietern als Risikosport – prüfe das vor der Buchung."],
];
tips.forEach(t => out.push(tocRow(t[0], t[1], t[2], t[3])));
out.push(disclaimer("<b>Wichtiger Hinweis:</b> Alle Empfehlungen in diesem Guide basieren auf Community-Feedback, persönlichen Erfahrungen und Recherche. Trainerteams, Preise und Qualität können sich ändern – kontaktiere Gyms vorab und prüfe aktuelle Bewertungen, bevor du buchst."));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-2.html", html);
console.log("light-2.html written");
