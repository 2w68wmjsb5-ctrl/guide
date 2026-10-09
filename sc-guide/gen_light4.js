const fs = require("fs");
const { sectionHeader, iconPageTitle, tipBox, htmlShell, exTable, contrastLegend, finisherBox, factRow, blockTitle } = require("./htmlkit.js");
const { WARMUP, EINHEIT_A, EINHEIT_B, EINHEIT_C } = require("./data.js");

const TAG = "Kapitel 3 · Das Programm";
let out = [];

const STRENGTH_COLS = [
  { label: "Übung", cls: "w-ex" }, { label: "Equipment", cls: "w-muted" }, { label: "Sätze" },
  { label: "Wdh." }, { label: "% 1RM" }, { label: "Pause" },
];
const strengthRows = (u) => u.rows.map(r => ({ cells: [r.ex, r.eq, r.sets, r.reps, r.rm, r.rest], contrast: r.contrast }));
const totalSets = (u) => u.rows.reduce((n, r) => n + Number(r.sets), 0);

// --- Warm-up ---
out.push(`<div class="content-section chapter-start tight">`);
out.push(iconPageTitle(TAG, "fireRing", "Warm-up"));
out.push(`<p class="page-intro">Vor jeder Einheit, rund 15 Minuten. Das Warm-up bringt deinen Puls hoch, mobilisiert Hüfte, Schultern und Brustwirbelsäule und bereitet dein Nervensystem auf schnelle, explosive Bewegungen vor. Kommst du direkt aus dem Muay-Thai-Training, bist du schon warm: Dann reicht der letzte Block.</p>`);
WARMUP.forEach((phase, i) => {
  out.push(blockTitle(String(i + 1), phase.title, `${phase.rows.length} ${phase.rows.length === 1 ? "Übung" : "Übungen"}`));
  out.push(exTable([{ label: "Übung", cls: "w-ex" }, { label: "Umfang" }], phase.rows.map(r => ({ cells: r })), "xcompact"));
});
out.push(`</div>`);

// --- Einheit A ---
function strengthUnit(letter, title, intro, unit, tip) {
  out.push(`<div class="content-section chapter-start">`);
  out.push(iconPageTitle(TAG, "weightLifting", `Einheit ${letter}: ${title}`));
  out.push(factRow([["Dauer", "ca. 45 Min."], ["Übungen", String(unit.rows.length)], ["Sätze gesamt", String(totalSets(unit))], ["Finisher", unit.finisher.rounds]]));
  intro.forEach(p => out.push(`<p class="page-intro">${p}</p>`));
  out.push(exTable(STRENGTH_COLS, strengthRows(unit)));
  if (unit.rows.some(r => r.contrast)) out.push(contrastLegend());
  out.push(finisherBox(unit.finisher.title, unit.finisher.rounds, `${unit.finisher.work} / ${unit.finisher.rest}`));
  if (tip) out.push(tipBox(tip[0], tip[1], tip[2]));
  out.push(`</div>`);
}

strengthUnit("A", "Kraft &amp; Power", [
  "Einheit A verbindet schwere Grundübungen mit explosiven Bewegungen. Das Herzstück sind die Kontrastsätze: Direkt nach dem schweren Satz folgt eine schnelle Übung mit ähnlichem Bewegungsablauf. Die hohe Last aktiviert dein Nervensystem, sodass du in der explosiven Übung mehr Kraft in kürzerer Zeit abrufen kannst. Genau diese Fähigkeit steckt in jedem harten Kick, jedem Knie und jedem Schlag.",
], EINHEIT_A, ["handGrip", "So läuft ein Kontrastsatz:", "Erst die schwere Übung, ohne Pause direkt die explosive Variante, dann die volle Pause. Bei der explosiven Übung zählt jede Wiederholung: maximal schnell, maximal kraftvoll, sauber gelandet. Wirst du langsamer, beende den Satz."]);

// --- Einheit B ---
out.push(`<div class="content-section chapter-start tight">`);
out.push(iconPageTitle(TAG, "fireRing", "Einheit B: Circuit"));
const emomMin = EINHEIT_B.emom.rows.length * EINHEIT_B.emom.rounds;
const amrapMin = EINHEIT_B.amrap.rounds * EINHEIT_B.amrap.rows.length;
out.push(factRow([["Dauer", "ca. 40 Min."], ["Varianten", "2 zur Wahl"], ["Fokus", "Kraftausdauer"], ["Finisher", `Koordinationsleiter`]]));
out.push(`<p class="page-intro">Einheit B trainiert deine Kraftausdauer, also Kraft, die du über mehrere Runden abrufen kannst. Wähle eine der zwei Varianten, je nach Tagesform und verfügbarer Zeit. Beide enden mit einem kurzen Finisher an der Koordinationsleiter für schnelle Füße. Tipp: Ein Intervall-Timer auf dem Handy nimmt dir das Zählen ab.</p>`);

out.push(blockTitle("1", "Variante EMOM", `${EINHEIT_B.emom.rounds} Runden · ${emomMin} Min.`));
out.push(`<p class="page-intro" style="margin-bottom:3mm;"><b>EMOM</b> steht für „Every Minute on the Minute“. Zu Beginn jeder Minute startest du die nächste Übung, der Rest der Minute ist Pause. Nach der letzten Übung beginnst du von vorne.</p>`);
out.push(exTable(
  [{ label: "Übung", cls: "w-ex" }, { label: "Equipment", cls: "w-muted" }, { label: "Wdh." }, { label: "Pause" }],
  EINHEIT_B.emom.rows.map(r => ({ cells: [r.ex, r.eq, r.reps, "Rest der Minute"] })), "xcompact"
));

out.push(blockTitle("2", "Variante AMRAP", `${EINHEIT_B.amrap.rounds} Runden · ${amrapMin} Min. Belastung`));
out.push(`<p class="page-intro" style="margin-bottom:3mm;"><b>AMRAP</b> steht für „As Many Reps As Possible“. Pro Übung hast du ${EINHEIT_B.amrap.work} Zeit für so viele saubere Wiederholungen wie möglich, danach ${EINHEIT_B.amrap.rest} Pause bis zur nächsten Übung. Nach allen ${EINHEIT_B.amrap.rows.length} Übungen folgen ${EINHEIT_B.amrap.roundRest} Pause, dann die nächste Runde.</p>`);
out.push(exTable(
  [{ label: "Übung", cls: "w-ex" }, { label: "Equipment", cls: "w-muted" }, { label: "Belastung" }, { label: "Pause" }],
  EINHEIT_B.amrap.rows.map(r => ({ cells: [r.ex, r.eq, EINHEIT_B.amrap.work, EINHEIT_B.amrap.rest] })), "xcompact"
));
out.push(finisherBox("Koordinationsleiter", `${EINHEIT_B.ladder.rounds} Runden`, EINHEIT_B.ladder.drills.join(" · ")));
out.push(`</div>`);

// --- Einheit C ---
strengthUnit("C", "Kraft &amp; Power", [
  "Einheit C ist das Gegenstück zu Einheit A. Sie trainiert dieselben Fähigkeiten mit anderen Übungen: Statt der Kniebeuge steht hier das Heben vom Boden im Mittelpunkt, dazu Drücken über Kopf, Klimmzüge und gezielte Rumpfarbeit.",
  "Durch den Wechsel zwischen A und C trainierst du jede Muskelgruppe zweimal pro Woche mit unterschiedlichen Reizen. Das bringt mehr Fortschritt und weniger Überlastung als zweimal dieselbe Einheit.",
], EINHEIT_C, ["muscularTorso", "Rumpf = Kraftübertragung:", "Jeder Schlag und jeder Kick wird von den Beinen über den Rumpf übertragen. Ein starker Rumpf sorgt dafür, dass auf dem Weg keine Kraft verloren geht, und stabilisiert dich im Clinch."]);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-4.html", html);
console.log("light-4.html written");
