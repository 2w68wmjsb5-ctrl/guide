const fs = require("fs");
const { htmlShell, brandLogo, accentPanel, darkPage, iconHex } = require("./htmlkit.js");
const data = require("./data.js");

const EXTRA_CSS = `
.cover-wrap { position: relative; height: 100%; }
.cover-eyebrow { font-family:'Barlow Condensed',sans-serif; font-weight:800; letter-spacing:3px; text-transform:uppercase; font-size:10pt; color: var(--accent); margin-bottom: 6mm; }
.cover-title { font-family:'Anton',sans-serif; text-transform:uppercase; font-size: 44pt; line-height: 0.98; color: var(--white); margin: 0 0 6mm 0; max-width: 82mm; }
.cover-title .line2 { color: var(--accent); }
.cover-tagline { font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size: 13pt; color: #C7C9CE; max-width: 66mm; line-height: 1.4; }
.cover-foot { position: absolute; bottom: 0; left: 0; right: 0; display:flex; justify-content: space-between; align-items:center; }
.cover-foot .cf-text { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size: 9pt; color: #7C818A; letter-spacing: 1px; text-transform: uppercase; }
.cover-logo-row { display:flex; align-items:center; gap: 4mm; margin-bottom: 14mm; }

.vorwort-title { font-family:'Anton',sans-serif; text-transform:uppercase; font-size: 27pt; margin: 0 0 8mm 0; max-width: 150mm; line-height: 1.05; color: var(--white); }

.audience-row { display: flex; gap: 6mm; margin-top: 9mm; }
.audience-item { flex: 1 1 0; }
.audience-item .num-hex { margin-bottom: 3mm; width: 9mm; height: 9mm; font-size: 10pt; }
.audience-item .a-title { font-family:'Anton',sans-serif; text-transform:uppercase; font-size: 10.5pt; color: var(--white); margin-bottom: 1.2mm; letter-spacing: 0.2px; }
.audience-item .a-desc { font-size: 8.4pt; color: #9AA0A8; line-height: 1.42; }

.divider-page { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.divider-num { font-family:'Anton',sans-serif; font-size: 64pt; color: var(--ink-3); line-height: 1; margin-bottom: 2mm; }
.divider-tag { font-family:'Barlow Condensed',sans-serif; font-weight:800; color: var(--accent); font-size: 10.5pt; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 4mm; }
.divider-title { font-family:'Anton',sans-serif; text-transform:uppercase; font-size: 30pt; margin: 0 0 6mm 0; max-width: 150mm; line-height: 1.05; color: var(--white); }
.divider-desc { font-size: 11pt; color: #C7C9CE; max-width: 130mm; line-height: 1.6; margin-bottom: 10mm; }
.divider-list { list-style: none; padding: 0; margin: 0; columns: 2; column-gap: 10mm; }
.divider-list li { font-size: 10.3pt; color: #D7D6D2; padding: 2.6mm 0; border-top: 0.3mm solid var(--ink-3); display: flex; align-items: center; gap: 3.2mm; break-inside: avoid; }
.divider-list .li-num { font-family:'Anton',sans-serif; color: var(--accent); font-size: 9.5pt; width: 6mm; flex: 0 0 auto; }

.closing-page { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; }
.closing-title { margin-bottom: 8mm; }
.closing-tagline { font-family:'Anton',sans-serif; text-transform:uppercase; font-size: 22pt; color: var(--white); line-height: 1.5; }
.closing-tagline .accent { color: var(--accent); }
.closing-sub { font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size: 10.5pt; color: #9AA0A8; margin-top: 6mm; max-width: 110mm; line-height: 1.5; }
`;

let pages = [];

// 0 — Cover
pages.push(darkPage(`
  ${accentPanel({ top: "0", right: "0", w: "120mm", h: "180mm", clip: "polygon(38% 0, 100% 0, 100% 100%, 0 100%)" })}
  ${accentPanel({ top: "0", right: "0", w: "120mm", h: "180mm", tone: "ink", clip: "polygon(46% 0, 60% 0, 22% 100%, 8% 100%)" })}
  <div class="page-fg cover-wrap">
    <div style="position:absolute; top:0; left:0;">
      <div class="cover-logo-row">${brandLogo("42mm")}</div>
      <div class="cover-eyebrow">PATTO Guide Series</div>
      <h1 class="cover-title">Muay Thai<br><span class="line2">Gym Guide</span></h1>
      <p class="cover-tagline">Trainieren in Thailand — kuratierte Camps in 7 Regionen, geprüft nach Trainingsqualität, Authentizität und Community-Feedback.</p>
    </div>
    <div class="cover-foot">
      <div class="cf-text">Vol. 01 — Thailand Edition</div>
      <div class="cf-text">58 Gyms · 7 Regionen</div>
    </div>
  </div>
`));

// 1 — Vorwort
pages.push(darkPage(`
  ${accentPanel({ top: "-30mm", right: "-30mm", w: "90mm", h: "90mm", clip: "polygon(30% 0,100% 0,100% 100%,0 60%)" })}
  <div class="page-fg">
    <div class="section-tag" style="color:var(--accent);">Kapitel 1 · Vorwort</div>
    <h1 class="vorwort-title">Dein Weg zum richtigen Gym</h1>
    <div class="intro-text">
      ${data.VORWORT.map(p => `<p>${p}</p>`).join("\n")}
    </div>
    <div class="audience-row">
      ${audienceItem("01", "Regionen &amp; Orte", "Überblick über die besten Trainingsorte in ganz Thailand.")}
      ${audienceItem("02", "Touristenfallen erkennen", "Hilfreiche Warnzeichen für die Gym-Wahl vor Ort.")}
      ${audienceItem("03", "Für jedes Level", "Perfekt für Anfänger, Fortgeschrittene und Kämpfer.")}
    </div>
  </div>
`));

function audienceItem(num, title, desc) {
  return `<div class="audience-item">
    ${require("./htmlkit.js").numHex(num, "9mm")}
    <div class="a-title">${title}</div>
    <div class="a-desc">${desc}</div>
  </div>`;
}

// 2 — Vorbereitung divider
pages.push(darkPage(`
  ${accentPanel({ top: "-40mm", right: "-40mm", w: "120mm", h: "120mm", tone: "ink", clip: "polygon(30% 0,100% 0,100% 100%,0 70%)" })}
  <div class="divider-page page-fg">
    <div class="divider-num">01</div>
    <div class="divider-tag">Kapitel 1</div>
    <h1 class="divider-title">Vorbereitung</h1>
    <p class="divider-desc">Bevor es losgeht: woran du ein gutes Gym erkennst, wie du richtig recherchierst und was du vor der Abreise klären solltest.</p>
    <ul class="divider-list">
      <li><span class="li-num">01</span>Gym-Wahl: Gutes vs. schlechtes Gym</li>
      <li><span class="li-num">02</span>Recherchetipps</li>
      <li><span class="li-num">03</span>Bevor du gehst</li>
    </ul>
  </div>
`));

// 3 — Regionen divider
{
  const regionNames = data.REGIONS.map(r => r.name);
  pages.push(darkPage(`
    ${accentPanel({ top: "-40mm", right: "-40mm", w: "130mm", h: "130mm", clip: "polygon(30% 0,100% 0,100% 100%,0 70%)" })}
    <div class="divider-page page-fg">
      <div class="divider-num">02</div>
      <div class="divider-tag">Kapitel 2 · Gym-Verzeichnis</div>
      <h1 class="divider-title">Empfohlene Gyms nach Region</h1>
      <p class="divider-desc">Von Bangkok bis zu den Inseln im Süden – sieben Regionen, kuratiert nach Trainingsqualität, Authentizität und Community-Feedback.</p>
      <ul class="divider-list">
        ${regionNames.map((n, i) => `<li><span class="li-num">${String(i + 1).padStart(2, "0")}</span>${n}</li>`).join("\n")}
      </ul>
    </div>
  `));
}

// 4 — Closing
pages.push(darkPage(`
  ${accentPanel({ bottom: "-40mm", left: "-40mm", w: "110mm", h: "110mm", tone: "ink", clip: "polygon(0 30%,100% 0,100% 100%,0 100%)" })}
  ${accentPanel({ top: "-20mm", right: "-20mm", w: "70mm", h: "70mm", clip: "polygon(30% 0,100% 0,100% 100%,0 70%)" })}
  <div class="closing-page page-fg">
    <div class="closing-title">${brandLogo("60mm")}</div>
    <div class="closing-tagline">Train hard.<br>Stay humble.<br><span class="accent">Choose wisely.</span></div>
    <div class="closing-sub">Alle Empfehlungen basieren auf Community-Feedback, persönlicher Erfahrung und Recherche. Bedingungen können sich ändern — kontaktiere dein Gym vor der Anreise.</div>
  </div>
`));

const html = htmlShell(pages.join("\n"), EXTRA_CSS, "");
fs.writeFileSync(__dirname + "/dark.html", html);
console.log("dark.html written (" + pages.length + " pages)");
