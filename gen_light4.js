const fs = require("fs");
const { sectionHeader, lexTable, catCard, tipBox, htmlShell } = require("./htmlkit.js");
const {
  TECH_GENERELL, TECH_SCHLAG, TECH_KICK, TECH_KNIE,
  TECH_ELLBOGEN, TECH_CLINCH, TECH_BLOCK, TECH_SCHRITTE,
} = require("./data.js");

let out = [];

const KATEGORIEN = [
  { icon: "handGrip", title: "Generelle", meta: `${TECH_GENERELL.length} Aktionen` },
  { icon: "punch", title: "Schlag", meta: `${TECH_SCHLAG.length} Techniken` },
  { icon: "bootKick", title: "Kick", meta: `${TECH_KICK.length} Techniken` },
  { icon: "kneeCap", title: "Knie", meta: `${TECH_KNIE.length} Techniken` },
  { icon: "elbowPad", title: "Ellbogen", meta: `${TECH_ELLBOGEN.length} Techniken` },
  { icon: "handshake", title: "Clinch", meta: `${TECH_CLINCH.length} Techniken` },
  { icon: "shieldBash", title: "Block", meta: `${TECH_BLOCK.length} Techniken` },
  { icon: "footsteps", title: "Schritte", meta: `${TECH_SCHRITTE.length} Techniken` },
];

// --- Überblick ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("04 · Techniken", "Techniken im Überblick"));
out.push(`<p class="page-intro">Muay Thai wird nicht umsonst die „Kunst der acht Gliedmaßen“ genannt – Hände, Ellbogen, Knie und Schienbeine sind die Waffen, die diesen Kampfsport einzigartig machen. Dieses Kapitel bildet den Kern des Lexikons und gibt dir einen Überblick über das technische Fundament des Muay Thai.</p>`);
out.push(`<div class="card-grid cols-4">`);
KATEGORIEN.forEach(k => out.push(catCard(k.icon, k.title, k.meta)));
out.push(`</div></div>`);

const sections = [
  ["Generelle Techniken und Aktionen", TECH_GENERELL, "Grundlegende Bewegungen und Aktionen, die in nahezu jeder Trainingsanweisung auftauchen."],
  ["Schlagtechniken", TECH_SCHLAG, "Handtechniken – die schnellste Waffe, meist zur Vorbereitung von Kicks und Knien genutzt."],
  ["Kicktechniken", TECH_KICK, "Bein- und Tritttechniken – Reichweite und Kraft, das Markenzeichen des Muay Thai."],
  ["Knietechniken", TECH_KNIE, "Nahkampfwaffen, die vor allem im Clinch zum Einsatz kommen."],
  ["Ellenbogentechniken", TECH_ELLBOGEN, "Die schärfste Waffe im Muay Thai – kurze Distanz, hohe Verletzungsgefahr."],
  ["Clinchtechniken", TECH_CLINCH, "Der Ringkampf im Stehen – Kontrolle über Kopf, Nacken und Arme des Gegners."],
  ["Blocktechniken", TECH_BLOCK, "Verteidigungstechniken, um Tritte abzuwehren oder zu neutralisieren."],
  ["Schritt-Techniken", TECH_SCHRITTE, "Fußarbeit als Grundlage für Distanzkontrolle, Angriff und Verteidigung."],
];

sections.forEach(([title, rows, intro], i) => {
  out.push(`<div class="content-section content-block">`);
  out.push(sectionHeader("04 · Techniken", title));
  out.push(`<p class="page-intro">${intro}</p>`);
  out.push(lexTable(rows, { colWidths: [26, 22, 16, 36] }));
  if (i === 1) {
    out.push(tipBox("stopwatch", "Übungsidee:", "Wähle 3 Schlagtechniken aus und übe sie einzeln vor dem Spiegel oder am Sandsack, bevor du sie in eine Kombination packst."));
  }
  out.push(`</div>`);
});

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-4.html", html);
console.log("light-4.html written");
