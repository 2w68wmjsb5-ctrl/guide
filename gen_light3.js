const fs = require("fs");
const { sectionHeader, lexTable, ritualCard, kampfstilCard, tipBox, htmlShell } = require("./htmlkit.js");
const {
  SAETZE, TRAINING_AUSRUESTUNG, WETTKAMPF_RITUAL, WETTKAMPF, KAMPFSTILE,
} = require("./data.js");

let out = [];

// --- Sätze, Fragen und Aussagen ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("03 · Allgemeine Phrasen", "Sätze, Fragen und Aussagen"));
out.push(`<p class="page-intro">Hier geht es um die Sprache, die dich direkt durch den Trainingsalltag und den Wettkampf begleitet. Du lernst wichtige Sätze, Fragen und Aussagen kennen, die dir im Gym oder Ring weiterhelfen – sei es beim Warm-up, bei Partnerübungen oder im Gespräch mit deinem Trainer.</p>`);
out.push(lexTable(SAETZE, { colWidths: [28, 24, 16, 32] }));
out.push(tipBox("comments", "Übungsidee:", "Suche dir 3 Sätze aus dieser Liste aus und benutze sie aktiv in deiner nächsten Trainingseinheit – laut, auch wenn die Aussprache noch nicht perfekt sitzt."));
out.push(`</div>`);

// --- Training und Ausrüstung ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Training", "Training und Ausrüstung"));
out.push(`<p class="page-intro">Vom Trainingslager über Zeiteinheiten bis zur kompletten Schutzausrüstung – das Vokabular, das jede Einheit im Camp begleitet.</p>`);
out.push(lexTable(TRAINING_AUSRUESTUNG, { colWidths: [26, 22, 18, 34] }));
out.push(`</div>`);

// --- Wettkampf: Ritual & Kultur ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Wettkampf", "Ritual &amp; Kultur am Wettkampftag"));
out.push(`<p class="page-intro">Bevor die Fäuste fliegen, spricht die Tradition: Diese Rituale sind fester Bestandteil jedes Muay Thai Kampfes und zeigen Respekt vor Lehrer, Camp und Gegner.</p>`);
out.push(`<div class="card-grid cols-4">`);
WETTKAMPF_RITUAL.forEach(r => out.push(ritualCard(r)));
out.push(`</div></div>`);

// --- Wettkampf ---
out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("03 · Wettkampf", "Wettkampf"));
out.push(`<p class="page-intro">Der Wortschatz rund um Austragungsort, Kampfverlauf, Status und Runden eines Fights.</p>`);
out.push(lexTable(WETTKAMPF, { colWidths: [26, 22, 18, 34] }));
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
