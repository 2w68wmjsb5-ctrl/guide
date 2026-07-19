const fs = require("fs");
const { htmlShell, brandLogo, bgCircle, darkPage, iconBadge } = require("./htmlkit.js");
const data = require("./data.js");

const EXTRA_CSS = `
.cover-wrap { position: relative; height: 100%; }
.cover-page { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; }
.brand-logo { display: block; margin: 0 auto 5mm auto; }
.cover-sub { font-size: 13pt; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-bottom: 3mm; }
.cover-tagline { font-size: 11pt; font-style: italic; color: var(--text-on-dark-muted); letter-spacing: 0.5px; }
.cover-foot { position: absolute; bottom: 0; left: 0; right: 0; text-align: center; font-size: 9pt; color: #6C7382; letter-spacing: 0.5px; }

.vorwort-tag { color: var(--accent); font-weight: 700; font-size: 10pt; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6mm; }
.vorwort-title { font-size: 26pt; font-weight: 700; margin: 0 0 8mm 0; max-width: 150mm; line-height: 1.2; }

.audience-row { display: flex; gap: 7mm; margin-top: 9mm; }
.audience-item { flex: 1 1 0; }
.audience-item .icon-badge { margin-bottom: 3mm; }
.audience-item .a-title { font-weight: 700; font-size: 10pt; color: var(--white); margin-bottom: 1.2mm; }
.audience-item .a-desc { font-size: 8.6pt; color: #9AA3B0; line-height: 1.42; }

.divider-page { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.divider-tag { color: var(--accent); font-weight: 700; font-size: 10pt; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4mm; }
.divider-title { font-size: 27pt; font-weight: 700; margin: 0 0 6mm 0; max-width: 150mm; line-height: 1.15; }
.divider-desc { font-size: 11pt; color: #C7CEDA; max-width: 130mm; line-height: 1.6; margin-bottom: 10mm; }
.divider-list { list-style: none; padding: 0; margin: 0; columns: 2; column-gap: 10mm; }
.divider-list li { font-size: 10.5pt; color: #D6DAE0; padding: 2.5mm 0; border-top: 0.3mm solid var(--primary-lighter); display: flex; align-items: center; gap: 3.5mm; break-inside: avoid; }
.divider-list .li-num { color: var(--accent); font-weight: 700; font-size: 9.5pt; width: 6mm; flex: 0 0 auto; }

.closing-page { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; }
.closing-title { margin-bottom: 8mm; }
.closing-tagline { font-size: 20pt; font-weight: 700; color: var(--white); line-height: 1.5; }
.closing-tagline .accent { color: var(--accent); }
`;

let pages = [];

// 0 — Cover
pages.push(darkPage(`
  ${bgCircle("160mm", { top: "-60mm", left: "-50mm" }, "accent-tint")}
  ${bgCircle("100mm", { bottom: "-30mm", right: "-30mm" })}
  <div class="page-fg cover-wrap">
    <div class="cover-page">
      ${brandLogo("95mm")}
      <div class="cover-sub">Muay Thai Gym Guide</div>
      <div class="cover-tagline">Trainieren in Thailand</div>
    </div>
    <div class="cover-foot">EMPFOHLENE GYMS FÜR AUTHENTISCHES TRAINING IN GANZ THAILAND</div>
  </div>
`));

// 1 — Vorwort
pages.push(darkPage(`
  ${bgCircle("90mm", { top: "-30mm", right: "-30mm" }, "accent-tint")}
  <div class="page-fg">
    <div class="vorwort-tag">Vorwort</div>
    <h1 class="vorwort-title">Dein Weg zum richtigen Gym</h1>
    <div class="intro-text">
      ${data.VORWORT.map(p => `<p>${p}</p>`).join("\n")}
    </div>
    <div class="audience-row">
      ${audienceItem("mapMarked", "Regionen & Orte", "Überblick über die besten Trainingsorte in ganz Thailand.")}
      ${audienceItem("shieldBash", "Touristenfallen erkennen", "Hilfreiche Warnzeichen für die Gym-Wahl vor Ort.")}
      ${audienceItem("userGraduate", "Für jedes Level", "Perfekt für Anfänger, Fortgeschrittene und Kämpfer.")}
    </div>
  </div>
`));

function audienceItem(iconName, title, desc) {
  return `<div class="audience-item">
    ${iconBadge(iconName)}
    <div class="a-title">${title}</div>
    <div class="a-desc">${desc}</div>
  </div>`;
}

// 2 — Regionen divider
{
  const regionNames = data.REGIONS.map(r => r.name);
  pages.push(darkPage(`
    ${bgCircle("120mm", { top: "-40mm", right: "-40mm" }, "accent-tint")}
    <div class="divider-page page-fg">
      <div class="divider-tag">Gym-Verzeichnis</div>
      <h1 class="divider-title">Empfohlene Gyms nach Region</h1>
      <p class="divider-desc">Von Bangkok bis zu den Inseln im Süden – sieben Regionen, kuratiert nach Trainingsqualität, Authentizität und Community-Feedback.</p>
      <ul class="divider-list">
        ${regionNames.map((n, i) => `<li><span class="li-num">${String(i + 1).padStart(2, "0")}</span>${n}</li>`).join("\n")}
      </ul>
    </div>
  `));
}

// 3 — Closing
pages.push(darkPage(`
  ${bgCircle("110mm", { bottom: "-40mm", left: "-40mm" }, "accent-tint")}
  ${bgCircle("70mm", { top: "-20mm", right: "-20mm" })}
  <div class="closing-page page-fg">
    <div class="closing-title">${brandLogo("70mm")}</div>
    <div class="closing-tagline">Train hard.<br>Stay humble.<br><span class="accent">Choose wisely.</span></div>
  </div>
`));

const html = htmlShell(pages.join("\n"), EXTRA_CSS, "");
fs.writeFileSync(__dirname + "/dark.html", html);
console.log("dark.html written (" + pages.length + " pages)");
