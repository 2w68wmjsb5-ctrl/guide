const fs = require("fs");
const { htmlShell, brandLogo, accentPanel, darkPage, numHex } = require("./htmlkit.js");
const { CHAPTERS } = require("./chapters.js");

const EXTRA_CSS = `
.cover-wrap { position: relative; height: 100%; }
.cover-eyebrow { font-family:'Barlow Condensed',sans-serif; font-weight:800; letter-spacing:3px; text-transform:uppercase; font-size:10pt; color: var(--accent); margin-bottom: 6mm; }
.cover-title { font-family:'Anton',sans-serif; text-transform:uppercase; font-size: 44pt; line-height: 0.98; color: var(--white); margin: 0 0 6mm 0; max-width: 100mm; }
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
.divider-list { list-style: none; padding: 0; margin: 0; }
.divider-list li { font-size: 10.3pt; color: #D7D6D2; padding: 2.6mm 0; border-top: 0.3mm solid var(--ink-3); display: flex; align-items: center; gap: 3.2mm; break-inside: avoid; }
.divider-list .li-num { font-family:'Anton',sans-serif; color: var(--accent); font-size: 9.5pt; width: 6mm; flex: 0 0 auto; }

.closing-page { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; }
.closing-title { margin-bottom: 8mm; }
.closing-tagline { font-family:'Anton',sans-serif; text-transform:uppercase; font-size: 22pt; color: var(--white); line-height: 1.5; }
.closing-tagline .accent { color: var(--accent); }
.cover-title .line3 { color: var(--accent); font-size: 33pt; line-height: 1.02; }
`;

let pages = [];

function audienceItem(num, title, desc) {
  return `<div class="audience-item">
    ${numHex(num, "9mm")}
    <div class="a-title">${title}</div>
    <div class="a-desc">${desc}</div>
  </div>`;
}

// 0 — Cover
pages.push(darkPage(`
  ${accentPanel({ top: "0", right: "0", w: "120mm", h: "180mm", clip: "polygon(38% 0, 100% 0, 100% 100%, 0 100%)" })}
  ${accentPanel({ top: "0", right: "0", w: "120mm", h: "180mm", tone: "ink", clip: "polygon(46% 0, 60% 0, 22% 100%, 8% 100%)" })}
  <div class="page-fg cover-wrap">
    <div style="position:absolute; top:0; left:0;">
      <div class="cover-logo-row">${brandLogo("42mm")}</div>
      <h1 class="cover-title">Muay Thai<br><span class="line3">Strength &amp;<br>Conditioning</span></h1>
      <p class="cover-tagline">Das Minimum an Kraft- und Konditionstraining, das dich im Ring besser macht. Für Kämpfer mit wenig Zeit, als Ergänzung zu deinem Muay-Thai-Training.</p>
    </div>
    <div class="cover-foot">
      <div class="cf-text">Fighter Edition</div>
      <div class="cf-text">3 Einheiten · 30 bis 45 Minuten</div>
    </div>
  </div>
`));

// 1 — Vorwort
pages.push(darkPage(`
  ${accentPanel({ top: "-30mm", right: "-30mm", w: "90mm", h: "90mm", clip: "polygon(30% 0,100% 0,100% 100%,0 60%)" })}
  <div class="page-fg">
    <div class="section-tag" style="color:var(--accent);">Vorwort</div>
    <h1 class="vorwort-title">Stärker im Ring, nicht länger im Gym</h1>
    <div class="intro-text">
      <p>Muay Thai verlangt dir alles ab: Schlagkraft in der ersten Runde, Standfestigkeit im Clinch in der dritten und genug Reserven, um in der fünften noch Druck zu machen. Technik und Timing holst du dir auf der Matte, an den Pratzen und am Sandsack. Daran ändert kein Trainingsplan etwas. Was dort aber oft zu kurz kommt, ist gezieltes Kraft- und Konditionstraining.</p>
      <p>Genau hier setzt dieser Guide an. Er ist für alle gemacht, die neben Job, Alltag und Muay Thai wenig Zeit haben und trotzdem das Beste aus jeder Einheit holen wollen. Statt dich mit endlosen Plänen zu überladen, zeige ich dir das Minimum, das wirklich etwas bringt: wenige, kurze Einheiten, klar aufgebaut und auf die Anforderungen im Ring abgestimmt.</p>
      <p>Eines vorweg: Strength &amp; Conditioning ersetzt kein Muay-Thai-Training. Es ist eine wertvolle Ergänzung, die dich robuster, explosiver und belastbarer macht. Dein Muay Thai bleibt immer die Hauptsache.</p>
    </div>
    <div class="audience-row">
      ${audienceItem("01", "Wenig Zeit", "Zwei bis drei kurze Einheiten pro Woche reichen aus.")}
      ${audienceItem("02", "Muay Thai zuerst", "S&amp;C ergänzt dein Training, es ersetzt es nicht.")}
      ${audienceItem("03", "Für jedes Level", "Für Einsteiger, Fortgeschrittene und aktive Kämpfer.")}
    </div>
  </div>
`));

// 2.. — Chapter dividers (alternating ink / accent panel, as in the Gym Guide)
CHAPTERS.forEach((ch, i) => {
  const tone = i % 2 === 0 ? "ink" : "accent";
  pages.push(darkPage(`
    ${accentPanel({ top: "-40mm", right: "-40mm", w: "125mm", h: "125mm", tone, clip: "polygon(30% 0,100% 0,100% 100%,0 70%)" })}
    <div class="divider-page page-fg">
      <div class="divider-num">${ch.num}</div>
      <div class="divider-tag">Kapitel ${Number(ch.num)}</div>
      <h1 class="divider-title">${ch.title}</h1>
      <p class="divider-desc">${ch.desc}</p>
      <ul class="divider-list">
        ${ch.items.map((n, j) => `<li><span class="li-num">${String(j + 1).padStart(2, "0")}</span>${n}</li>`).join("\n")}
      </ul>
    </div>
  `));
});

// last — Closing
pages.push(darkPage(`
  ${accentPanel({ bottom: "-40mm", left: "-40mm", w: "110mm", h: "110mm", tone: "ink", clip: "polygon(0 30%,100% 0,100% 100%,0 100%)" })}
  ${accentPanel({ top: "-20mm", right: "-20mm", w: "70mm", h: "70mm", clip: "polygon(30% 0,100% 0,100% 100%,0 70%)" })}
  <div class="closing-page page-fg">
    <div class="closing-title">${brandLogo("60mm")}</div>
    <div class="closing-tagline">Train hard.<br>Stay humble.<br><span class="accent">Build strength.</span></div>
  </div>
`));

const html = htmlShell(pages.join("\n"), EXTRA_CSS, "");
fs.writeFileSync(__dirname + "/dark.html", html);
console.log("dark.html written (" + pages.length + " pages)");
