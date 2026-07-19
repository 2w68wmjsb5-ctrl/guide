const fs = require("fs");
const { htmlShell, brand, bgCircle, darkPage } = require("./htmlkit.js");

const EXTRA_CSS = `
.cover-page { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; }
.cover-brand { font-size: 46pt; margin-bottom: 3mm; }
.cover-sub { font-size: 13pt; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-bottom: 10mm; }
.cover-tagline { font-size: 10.5pt; color: #9AA3B0; letter-spacing: 1px; }
.cover-foot { position: absolute; bottom: 18mm; left: 0; right: 0; text-align: center; font-size: 9pt; color: #6C7382; letter-spacing: 1px; }

.vorwort-tag { color: var(--accent); font-weight: 700; font-size: 10pt; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6mm; }
.vorwort-title { font-size: 26pt; font-weight: 700; margin: 0 0 10mm 0; max-width: 140mm; line-height: 1.2; }

.divider-page { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.divider-num { font-size: 70pt; font-weight: 700; color: var(--primary-lighter); line-height: 1; margin-bottom: 2mm; }
.divider-tag { color: var(--accent); font-weight: 700; font-size: 10pt; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4mm; }
.divider-title { font-size: 27pt; font-weight: 700; margin: 0 0 6mm 0; max-width: 150mm; line-height: 1.15; }
.divider-desc { font-size: 11pt; color: #C7CEDA; max-width: 130mm; line-height: 1.6; margin-bottom: 10mm; }
.divider-list { list-style: none; padding: 0; margin: 0; }
.divider-list li { font-size: 10.5pt; color: #D6DAE0; padding: 2.5mm 0; border-top: 0.3mm solid var(--primary-lighter); display: flex; align-items: center; gap: 3.5mm; }
.divider-list li:first-child { border-top: none; }
.divider-list .li-num { color: var(--accent); font-weight: 700; font-size: 9.5pt; width: 6mm; flex: 0 0 auto; }

.closing-page { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; }
.closing-title { font-size: 24pt; font-weight: 700; margin-bottom: 6mm; }
.closing-text { font-size: 11pt; color: #C7CEDA; max-width: 120mm; line-height: 1.7; margin-bottom: 8mm; }
.closing-signoff { font-size: 13pt; color: var(--accent); font-weight: 700; }
`;

function dividerPage(num, tag, title, desc, items) {
  return darkPage(`
    ${bgCircle("120mm", { top: "-40mm", right: "-40mm" }, "accent-tint")}
    <div class="divider-page">
      <div class="divider-num">${num}</div>
      <div class="divider-tag">${tag}</div>
      <h1 class="divider-title">${title}</h1>
      <p class="divider-desc">${desc}</p>
      <ul class="divider-list">
        ${items.map((it, i) => `<li><span class="li-num">${String(i + 1).padStart(2, "0")}</span>${it}</li>`).join("\n")}
      </ul>
    </div>
  `);
}

let pages = [];

// 0 — Cover
pages.push(darkPage(`
  ${bgCircle("160mm", { top: "-60mm", left: "-50mm" }, "accent-tint")}
  ${bgCircle("100mm", { bottom: "-30mm", right: "-30mm" })}
  <div class="cover-page">
    <div class="cover-brand">${brand("on-dark")}</div>
    <div class="cover-sub">Muay Thai Lexikon</div>
    <div class="cover-tagline">Deutsch · Phonetik · ภาษาไทย</div>
  </div>
  <div class="cover-foot">EIN NACHSCHLAGEWERK FÜR GYM, REISE UND WETTKAMPF</div>
`));

// 1 — Vorwort
pages.push(darkPage(`
  ${bgCircle("90mm", { top: "-30mm", right: "-30mm" }, "accent-tint")}
  <div class="vorwort-tag">Vorwort</div>
  <h1 class="vorwort-title">Willkommen im PATTO Lexikon</h1>
  <div class="intro-text">
    <p>Muay Thai ist mehr als ein Kampfsport – es ist eine Sprache für sich. Wer im Gym trainiert, hört schnell dieselben Thai-Begriffe immer wieder: von der Zahl der Runde bis zum Namen der nächsten Technik.</p>
    <p>Dieses Lexikon sammelt das Vokabular, das dir im Training, auf Reisen und am Wettkampftag begegnet – von Grundlagen wie Zahlen und Körperteilen bis zu den traditionellen Techniken des Muay Boran.</p>
    <p>Jeder Eintrag verbindet die deutsche Übersetzung, die gesprochene Phonetik und die Thai-Schrift, damit du die Sprache nicht nur verstehst, sondern auch im Gym benutzen und wiedererkennen kannst.</p>
    <p>Chok Dii – viel Glück auf deinem Weg durch die Sprache des Muay Thai.</p>
  </div>
`));

// 2 — Grundlagen divider
pages.push(dividerPage(
  "02", "Kapitel 2", "Grundlagen",
  "Das sprachliche Fundament – Zahlen, Körperteile, Adjektive sowie Personen und Titel, die dir in jedem Gym begegnen.",
  ["Zahlen", "Körperteile", "Adjektive", "Personen &amp; Titel"]
));

// 3 — Phrasen divider
pages.push(dividerPage(
  "03", "Kapitel 3", "Phrasen, Training &amp; Wettkampf",
  "Vom Alltagssatz über Trainingsvokabular und Ausrüstung bis zu Ritual, Ablauf und Kampfstilen am Wettkampftag.",
  ["Allgemeine Phrasen", "Training: Einheiten &amp; Übungen", "Ausrüstung", "Wettkampf: Ritual &amp; Kultur", "Wettkampf: Ablauf &amp; Ergebnis", "Kämpferstatus &amp; Runden", "Kampfstile"]
));

// 4 — Techniken divider
pages.push(dividerPage(
  "04", "Kapitel 4", "Techniken",
  "Die sieben Grundkategorien des Muay Thai – von der Hand bis zum Fuß, von der Distanz bis in den Clinch.",
  ["Schlag", "Kick", "Knie", "Ellbogen", "Clinch", "Block", "Schritte"]
));

// 5 — Bonus divider
pages.push(dividerPage(
  "05", "Kapitel 5 · Bonus", "Traditionelle Techniken",
  "Ein Blick in das Erbe des Muay Boran: die klassischen Mae Mai und die fortgeschrittenen Look Mai.",
  ["Mae Mai – Grundtechniken", "Look Mai – Fortgeschrittene Techniken"]
));

// 6 — Closing
pages.push(darkPage(`
  ${bgCircle("110mm", { bottom: "-40mm", left: "-40mm" }, "accent-tint")}
  <div class="closing-page">
    <div class="closing-title">${brand("on-dark")}</div>
    <p class="closing-text">Das PATTO Lexikon begleitet dich vom ersten Aufwärmen bis in den Ring. Nimm es mit ins Gym, auf Reisen und zum nächsten Fight – und lerne die Sprache des Muay Thai so, wie sie dort gesprochen wird, wo sie zu Hause ist.</p>
    <div class="closing-signoff">Chok Dii!</div>
  </div>
`));

const html = htmlShell(pages.join("\n"), EXTRA_CSS, "");
fs.writeFileSync(__dirname + "/dark.html", html);
console.log("dark.html written (" + pages.length + " pages)");
