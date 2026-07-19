const fs = require("fs");
const { sectionHeader, lexTable, ritualCard, kampfstilCard, htmlShell } = require("./htmlkit.js");
const {
  SAETZE, TRAINING_EINHEITEN, TRAINING_UEBUNGEN, AUSRUESTUNG,
  WETTKAMPF_RITUAL, WETTKAMPF_ABLAUF, WETTKAMPF_STATUS, WETTKAMPF_RUNDEN, KAMPFSTILE,
} = require("./data.js");

let out = [];

// --- Sätze ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("03 · Allgemeine Phrasen", "Sätze, Fragen und Aussagen"));
out.push(`<p class="page-intro">Diese Sätze begleiten dich beim Warm-up, bei Partnerübungen und im Gespräch mit deinem Trainer.</p>`);
out.push(lexTable(SAETZE, { colWidths: [26, 24, 18, 32] }));
out.push(`</div>`);

// --- Training: Einheiten & Übungen ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Training", "Trainingseinheiten &amp; Übungen"));
out.push(`<p class="page-intro">Von der Zeiteinheit bis zur Konditionsübung – das Vokabular, das jede Trainingseinheit strukturiert.</p>`);
out.push(`<h2 class="block-title" style="margin-top:0;">Trainingseinheiten &amp; Zeit</h2>`);
out.push(lexTable(TRAINING_EINHEITEN, { colWidths: [24, 22, 18, 36] }));
out.push(`<h2 class="block-title">Übungen</h2>`);
out.push(lexTable(TRAINING_UEBUNGEN, { colWidths: [24, 22, 18, 36] }));
out.push(`</div>`);

// --- Ausrüstung ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Training", "Ausrüstung"));
out.push(`<p class="page-intro">Die Standard-Ausrüstung, die in jedem Muay Thai Camp zum Einsatz kommt – von Schutzausrüstung bis Trainingsgeräten.</p>`);
out.push(lexTable(AUSRUESTUNG, { colWidths: [24, 22, 18, 36] }));
out.push(`</div>`);

// --- Wettkampf: Ritual & Kultur ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Wettkampf", "Ritual &amp; Kultur am Wettkampftag"));
out.push(`<p class="page-intro">Bevor die Fäuste fliegen, spricht die Tradition: Diese Rituale sind fester Bestandteil jedes Muay Thai Kampfes und zeigen Respekt vor Lehrer, Camp und Gegner.</p>`);
out.push(`<div class="card-grid cols-2">`);
WETTKAMPF_RITUAL.forEach(r => out.push(ritualCard(r)));
out.push(`</div></div>`);

// --- Wettkampf: Ablauf & Ergebnis ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Wettkampf", "Ablauf &amp; Ergebnis"));
out.push(`<p class="page-intro">Der Wortschatz rund um Austragungsort, Kampfverlauf und Ausgang eines Fights.</p>`);
out.push(lexTable(WETTKAMPF_ABLAUF, { colWidths: [24, 22, 20, 34] }));
out.push(`</div>`);

// --- Wettkampf: Status & Runden ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Wettkampf", "Kämpferstatus &amp; Runden"));
out.push(`<p class="page-intro">Vom Amateurstatus bis zur letzten Runde – Begriffe für die Einordnung eines Kampfes.</p>`);
out.push(`<h2 class="block-title" style="margin-top:0;">Kämpferstatus</h2>`);
out.push(lexTable(WETTKAMPF_STATUS, { colWidths: [24, 22, 18, 36] }));
out.push(`<h2 class="block-title">Runden</h2>`);
out.push(lexTable(WETTKAMPF_RUNDEN, { colWidths: [16, 22, 14, 48] }));
out.push(`</div>`);

// --- Kampfstile ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Wettkampf", "Kampfstile"));
out.push(`<p class="page-intro">Jeder Kämpfer entwickelt seinen eigenen Stil. Diese sechs Archetypen begegnen dir in jedem Muay Thai Stadion.</p>`);
out.push(`<div class="card-grid cols-3">`);
KAMPFSTILE.forEach(k => out.push(kampfstilCard(k)));
out.push(`</div></div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-3.html", html);
console.log("light-3.html written");
