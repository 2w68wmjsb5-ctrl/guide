const fs = require("fs");
const { sectionHeader, iconPageTitle, tipBox, htmlShell, exTable, infoCard, blockTitle, tocRow, zoneChip } = require("./htmlkit.js");
const { EINHEIT_A, EINHEIT_C, STRETCHING, HIP_MOBILITY } = require("./data.js");

const TAG = "Kapitel 4 · Kondition &amp; Mobilität";
let out = [];

// --- Energiesysteme ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Die drei Energiesysteme"));
out.push(`<p class="page-intro">Dein Körper hat drei Wege, Energie für die Muskeln bereitzustellen. Sie arbeiten nie einzeln, sondern immer gleichzeitig. Je nachdem, wie lang und wie intensiv eine Belastung ist, übernimmt aber eines von ihnen den Hauptteil. Für den Kampfsport brauchst du alle drei.</p>`);
out.push(`<div class="region-cards" style="grid-template-columns:1fr 1fr 1fr;">`);
out.push(infoCard("01", "Alaktazid", "0 bis ca. 10 Sek. · Explosivität", "Liefert sofort Energie für einzelne explosive Aktionen: Kick, Knie, schnelle Kombination, Sprung. Sehr stark, aber nach wenigen Sekunden leer. In Pausen füllen sich die Speicher innerhalb von ein bis drei Minuten wieder auf."));
out.push(infoCard("02", "Laktazid", "ca. 10 Sek. bis 2 Min. · Druckphasen", "Übernimmt bei langen, intensiven Schlagabtäuschen, im Clinch-Gerangel und wenn du Druck machst. Hohe Leistung, aber es entsteht Laktat: Die Muskeln brennen, die Arme werden schwer."));
out.push(infoCard("03", "Aerob", "ab ca. 2 Min. · Grundlage", "Trägt dich durch alle Runden. Es versorgt dich zwischen den Aktionen und füllt in Pausen die schnellen Speicher wieder auf. Je besser es ist, desto schneller erholst du dich."));
out.push(`</div>`);
out.push(`<h2 class="block-title">Was das für Muay Thai bedeutet</h2>`);
out.push(`<p class="page-intro">Eine Runde dauert drei Minuten. Über den ganzen Kampf gesehen kommt der größte Teil der Energie aus dem aeroben System. Die entscheidenden Momente, der harte Kick, die schnelle Kombination, die Druckphase am Ende der Runde, laufen aber über die beiden anaeroben Systeme. Ein Kämpfer braucht deshalb eine breite aerobe Basis und die Fähigkeit, explosive Aktionen immer wieder abzurufen.</p>`);
out.push(exTable(
  [{ label: "System", cls: "w-ex" }, { label: "Im Ring", cls: "w-ex" }, { label: "So trainierst du es", cls: "w-ex" }, { label: "In diesem Guide", cls: "w-ex" }],
  [
    { cells: ["Alaktazid", "einzelne Explosivaktionen", "kurze Vollgas-Belastungen, lange Pausen", "Kontrastsätze, Finisher Einheit A"] },
    { cells: ["Laktazid", "lange Exchanges, Druckphasen", "harte Intervalle, kurze Pausen", "Finisher Einheit C, Einheit B"] },
    { cells: ["Aerob", "Erholung zwischen Aktionen und Runden", "lockere Läufe, Seilspringen, Pratzenrunden", "Muay-Thai-Training, lockerer Lauf"] },
  ], "compact"
));
out.push(`</div>`);

// --- Herzfrequenzzonen ---
const HFMAX_EX = 190;
const ZONES = [
  { n: 1, name: "Regeneration", lo: 50, hi: 60, talk: "mühelos plaudern", sys: "aerob", use: "Cool-down, aktive Erholung am Ruhetag" },
  { n: 2, name: "Grundlage", lo: 60, hi: 70, talk: "ganze Sätze sprechen", sys: "aerob", use: "lockerer Lauf, Seilspringen, Technikrunden" },
  { n: 3, name: "Tempo", lo: 70, hi: 80, talk: "nur noch kurze Sätze", sys: "aerob, Übergang", use: "zügige Pratzen- und Sandsackrunden" },
  { n: 4, name: "Schwelle", lo: 80, hi: 90, talk: "nur noch einzelne Worte", sys: "laktazid", use: "harte Sparring- und Pratzenrunden, Einheit B" },
  { n: 5, name: "Maximal", lo: 90, hi: 100, talk: "Sprechen unmöglich", sys: "alaktazid und laktazid", use: "Airbike-Finisher, Sprints, Vollgas-Kombinationen" },
];
const bpm = (pct) => Math.round(HFMAX_EX * pct / 100);

out.push(`<div class="content-section chapter-start tight">`);
out.push(sectionHeader(TAG, "Herzfrequenzzonen"));
out.push(`<p class="page-intro">Mit deiner Herzfrequenz kannst du steuern, wie intensiv eine Ausdauereinheit wirklich ist. Sie wird in fünf Zonen eingeteilt. Jede Zone ist ein Prozentbereich deiner maximalen Herzfrequenz (HFmax) und trainiert etwas anderes.</p>`);
out.push(`<div class="zone-bar">${ZONES.map(z => `<div class="z${z.n}">Zone ${z.n}<small>${z.name} · ${z.lo}–${z.hi} %</small></div>`).join("")}</div>`);
out.push(`<h2 class="block-title">So bestimmst du deine HFmax</h2>`);
[
  ["1", "sortNumeric", "Faustformel", "220 minus dein Alter. Mit 30 Jahren also etwa 190 Schläge pro Minute. Etwas genauer ist 208 minus 0,7 × Alter. Beide Formeln sind nur Schätzungen, bei vielen liegt der echte Wert um zehn Schläge oder mehr daneben."],
  ["2", "stopwatch", "Messen im Training", "Am genauesten ist der höchste Wert, den deine Pulsuhr oder dein Brustgurt bei maximaler Belastung anzeigt, etwa am Ende eines Airbike-Finishers oder einer harten Sparringrunde. Brustgurte messen zuverlässiger als Uhren."],
].forEach(t => out.push(tocRow(t[0], t[1], t[2], t[3])));
out.push(`<h2 class="block-title">Die fünf Zonen auf einen Blick</h2>`);
out.push(exTable(
  [{ label: "Zone" }, { label: "% HFmax" }, { label: `Bei HFmax ${HFMAX_EX}` }, { label: "Sprechtest", cls: "w-ex" }, { label: "Energiesystem", cls: "w-ex" }],
  ZONES.map(z => ({ cells: [zoneChip(z.n), `${z.lo}–${z.hi}&nbsp;%`, `${bpm(z.lo)}–${bpm(z.hi)}`, z.talk, z.sys] })), "compact"
));
out.push(tipBox("commentDots", "Keine Pulsuhr?", "Der Sprechtest funktioniert erstaunlich gut. Wenn du dich beim lockeren Lauf noch in ganzen Sätzen unterhalten kannst, bist du in Zone 2. Wenn nur noch einzelne Worte gehen, bist du in Zone 4 oder höher."));
out.push(`</div>`);

// --- Zonen im Detail ---
out.push(`<div class="content-section chapter-start tight">`);
out.push(sectionHeader(TAG, "Die Zonen im Detail"));
const ZONE_TEXT = {
  1: "Sehr locker, fast wie Spazierengehen. Fördert die Durchblutung und beschleunigt die Erholung, ohne den Körper zusätzlich zu ermüden. Ideal nach harten Tagen und zum Auslaufen.",
  2: "Die wichtigste Zone für deine Ausdauerbasis. Hier wird das aerobe System effizienter: Herz und Muskeln lernen, mehr Sauerstoff zu nutzen. Je besser deine Zone 2, desto schneller erholst du dich zwischen Aktionen und Runden. Fühlt sich fast zu leicht an, und genau so ist es richtig.",
  3: "Zügig und schon anstrengend, aber noch gleichmäßig durchzuhalten. Ein großer Teil des normalen Muay-Thai-Trainings spielt sich hier ab. Zusätzlich musst du diese Zone kaum trainieren.",
  4: "Hier beginnt sich Laktat anzusammeln, die Muskeln fangen an zu brennen. Du trainierst, ein hohes Tempo länger zu halten, so wie in einer intensiven Runde. Sehr wirksam, aber auch sehr ermüdend: lieber gezielt und dosiert.",
  5: "Alles, was geht, nur für Sekunden bis wenige Minuten haltbar. Trainiert Explosivität und die Fähigkeit, Vollgas-Aktionen zu wiederholen. Bei kurzen Sprints steigt der Puls oft erst gegen Ende in diese Zone. Steuere hier über Leistung und Gefühl, nicht über die Uhr.",
};
ZONES.forEach(z => {
  out.push(`<div class="zone-detail">${zoneChip(z.n)}<div><div class="zd-title">${z.name} <span>${z.lo}–${z.hi}&nbsp;% HFmax · ${bpm(z.lo)}–${bpm(z.hi)} bpm bei HFmax ${HFMAX_EX}</span></div><div class="zd-text">${ZONE_TEXT[z.n]}</div><div class="zd-use"><b>Typisch:</b> ${z.use}</div></div></div>`);
});
out.push(tipBox("bullseye", "Die richtige Verteilung:", "Gute Ausdauer entsteht vor allem aus viel lockerem und wenig, dafür richtig hartem Training. Dein Muay-Thai-Training liefert dir bereits reichlich Zone 3 bis 5. Was zusätzlich am meisten bringt, sind deshalb lockere Einheiten in Zone 2 und kurze, harte Finisher in Zone 5. Die anstrengende, aber nicht harte Mitte brauchst du nicht extra."));
out.push(`</div>`);

// --- Kondition ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Kondition gezielt ergänzen"));
out.push(`<p class="page-intro">Die gute Nachricht: Die aerobe Basis und einen großen Teil der anaeroben Ausdauer trainierst du bereits im Muay Thai. Pratzenrunden, Sandsack, Clinch und Sparring sind hartes Intervalltraining. Zusätzliche Konditionsarbeit brauchst du deshalb nur gezielt und in kleiner Dosis.</p>`);
out.push(`<div class="region-cards" style="grid-template-columns:1fr 1fr 1fr;">`);
out.push(infoCard("01", "Sprint-Finisher", "Einheit A und C · Zone 5", "Kurze Airbike-Intervalle am Ende der Krafteinheit. Sie trainieren gezielt die beiden anaeroben Systeme."));
out.push(infoCard("02", "Lockerer Lauf", "Optional · Zone 2", "20 bis 40 Minuten in einem Tempo, in dem du dich noch unterhalten kannst. Ideal als aktive Erholung oder morgens vor dem Training, wie in vielen Camps in Thailand üblich."));
out.push(infoCard("03", "Seilspringen", "Optional · Zone 2 bis 3", "5 bis 15 Minuten. Der Muay-Thai-Klassiker verbessert Fußarbeit, Rhythmus und die Ausdauer der Waden und passt in jedes Warm-up."));
out.push(`</div>`);
out.push(`<h2 class="block-title">Warum diese Airbike-Intervalle?</h2>`);
out.push(blockTitle("A", `Einheit A: ${EINHEIT_A.finisher.work} / ${EINHEIT_A.finisher.rest}`, `${EINHEIT_A.finisher.rounds} · alaktazid`));
out.push(`<p class="page-intro" style="margin-bottom:3mm;">Der kurze Vollgas-Sprint läuft vor allem über das alaktazide System, also genau die Energie für explosive Aktionen. Die lange, aktive Pause gibt den Speichern Zeit, sich wieder aufzufüllen, und genau diese Erholung leistet dein aerobes System. So trainierst du, explosive Aktionen nicht nur einmal, sondern Runde für Runde mit voller Wucht zu wiederholen.</p>`);
out.push(blockTitle("C", `Einheit C: ${EINHEIT_C.finisher.work} / ${EINHEIT_C.finisher.rest}`, `${EINHEIT_C.finisher.rounds} · laktazid`));
out.push(`<p class="page-intro" style="margin-bottom:3mm;">Hier ist die Pause kürzer als die Belastung. Die Speicher können sich nicht mehr erholen, Laktat sammelt sich an und das laktazide System übernimmt. Du trainierst, unter Ermüdung weiter Leistung zu bringen, so wie in einem harten Schlagabtausch oder in der Schlussphase einer Runde.</p>`);
out.push(tipBox("stopwatch", "Warum Airbike?", "Es fordert Arme und Beine gleichzeitig, ohne Aufprall und ohne Technikrisiko unter Ermüdung. Die Intensität lässt sich sofort hochfahren und deine Beine werden geschont, die du fürs Muay Thai brauchst. Vollgas heißt dabei Vollgas: Kannst du das Tempo nicht mehr halten, beende den Finisher lieber eine Runde früher. Kein Airbike? Ruderergometer, Bergsprints oder Vollgas-Runden am Sandsack funktionieren nach demselben Schema."));
out.push(`</div>`);

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
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-5.html", html);
console.log("light-5.html written");
