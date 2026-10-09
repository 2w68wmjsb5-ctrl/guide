const fs = require("fs");
const { sectionHeader, doDontCard, tipBox, tocRow, htmlShell, iconHex, hexGlyph, infoCard, exTable } = require("./htmlkit.js");

const TAG = "Kapitel 1 · Grundlagen";
let out = [];

// --- Warum S&C ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Warum S&amp;C für Muay Thai?"));
out.push(`<p class="page-intro">Im Ring entscheidet nicht nur deine Technik, sondern auch, wie viel Kraft du in sie legen kannst und wie lange du das durchhältst. Ein Kick ist nur so hart, wie deine Hüfte ihn beschleunigt. Ein Clinch ist nur so stabil, wie dein Rumpf und deine Beine dagegenhalten. Gezieltes Krafttraining verbessert genau diese Grundlagen und macht deinen Körper gleichzeitig widerstandsfähiger.</p>`);
out.push(`<p class="page-intro">Strength &amp; Conditioning, kurz S&amp;C, steht für vier Fähigkeiten, die im Ring zusammenspielen:</p>`);
out.push(`<div class="region-cards">`);
out.push(infoCard("01", "Maximalkraft", "Die Basis", "Je mehr Kraft du hast, desto mehr kannst du in Schläge, Tritte, Knie und den Clinch übertragen."));
out.push(infoCard("02", "Explosivkraft", "Kraft × Tempo", "Wie schnell du deine Kraft abrufen kannst. Sie macht Techniken hart und schnell zugleich."));
out.push(infoCard("03", "Kraftausdauer", "Bis zur letzten Runde", "Die Fähigkeit, deine Kraft über alle Runden zu halten, statt nach der ersten abzubauen."));
out.push(infoCard("04", "Kondition", "Der Motor", "Ausdauer und schnelle Erholung zwischen einzelnen Aktionen und zwischen den Runden."));
out.push(`</div>`);
out.push(tipBox("kneeBandage", "Weniger Ausfälle:", "Starke Muskeln, Sehnen und Bänder fangen Belastungen besser ab. Wer regelmäßig Kraft trainiert, fällt seltener verletzt aus und kann dadurch konstanter Muay Thai trainieren. Auch das ist ein Leistungsvorteil."));
out.push(`</div>`);

// --- Smart vs. falsch ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Smartes vs. falsches S&amp;C"));
out.push(`<p class="page-intro">Mehr ist nicht automatisch besser. Gerade wenn deine Zeit knapp ist, entscheidet die Qualität deiner Einheiten, nicht ihre Menge.</p>`);
out.push(`<div class="dodont-cols">`);
out.push(doDontCard("do", "Smartes S&amp;C", iconHex("checkCircle", "7mm"), [
  "kurze, fokussierte Einheiten mit klarem Ziel",
  "schwere Grundübungen und explosive Bewegungen, die zum Kampfsport passen",
  "saubere Technik vor mehr Gewicht",
  "Einheiten so gelegt, dass dein Muay Thai nicht darunter leidet",
  "jede Einheit notieren und dich langsam, aber stetig steigern",
]));
out.push(doDontCard("dont", "Falsches S&amp;C", hexGlyph("&#10005;", "7mm"), [
  "stundenlanges „Pumpen“ einzelner Muskeln wie im Bodybuilding",
  "jede Einheit bis zur völligen Erschöpfung",
  "eine harte Beineinheit am Tag vor dem Sparring",
  "ständig wechselnde Übungen ohne Plan",
  "S&amp;C statt Muay Thai, wenn die Zeit knapp wird",
]));
out.push(`</div>`);
out.push(tipBox("lightbulb", "Faustregel:", "Nach einer S&amp;C-Einheit solltest du dich gefordert fühlen, aber nicht zerstört. Wenn du am nächsten Tag im Muay-Thai-Training nicht mehr sauber kicken kannst, war es zu viel."));
out.push(`</div>`);

// --- Intensität ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Intensität richtig wählen"));
out.push(`<p class="page-intro">In den Krafteinheiten findest du zu jeder Übung einen Wiederholungsbereich und eine Intensität in Prozent deines 1RM. Das 1RM (One-Rep-Max) ist das Gewicht, das du mit sauberer Technik genau einmal bewegen kannst. Je weniger Wiederholungen, desto höher die Last.</p>`);
out.push(exTable(
  [{ label: "Ziel", cls: "w-ex" }, { label: "Wdh." }, { label: "% 1RM" }, { label: "Am Satzende", cls: "w-ex" }],
  [
    { cells: ["Kraft &amp; Power (Hauptübungen)", "5-8", "80-85 %", "noch 1 bis 2 saubere Wdh. möglich"] },
    { cells: ["Kraftausdauer (Ergänzungsübungen)", "8-12", "65-70 %", "noch 2 bis 3 saubere Wdh. möglich"] },
    { cells: ["Explosive Übungen (Sprünge, Würfe)", "laut Plan", "–", "jede Wdh. maximal schnell und sauber"] },
  ]
));
out.push(tipBox("lightbulb", "Kein 1RM-Test nötig:", "Du musst dein Maximum nicht austesten. Wähle ein Gewicht, mit dem du die untere Grenze des Wiederholungsbereichs in allen Sätzen sauber schaffst und am Ende noch ein bis zwei Wiederholungen übrig hättest. Das entspricht ziemlich genau dem angegebenen Prozentbereich."));
out.push(`<p class="page-intro">Bei Übungen ohne Prozentangabe, etwa mit Medizinball, Ab Wheel oder Körpergewicht, zählt die Qualität jeder einzelnen Wiederholung. Sobald du langsamer oder unsauber wirst, ist der Satz vorbei.</p>`);
out.push(`</div>`);

// --- Progression ---
out.push(`<div class="content-section chapter-start tight">`);
out.push(sectionHeader(TAG, "So steigerst du dich"));
out.push(`<p class="page-intro">Dein Körper passt sich nur an, wenn die Anforderung langsam steigt. Dafür nutzt du die doppelte Progression: erst mehr Wiederholungen, dann mehr Gewicht.</p>`);
[
  ["1", "footsteps", "Unten starten", "Wähle ein Gewicht, mit dem du in allen Sätzen die untere Grenze des Bereichs sauber schaffst, bei 5-8 also 5 Wiederholungen."],
  ["2", "sortNumeric", "Wiederholungen steigern", "Versuch jede Woche, mit demselben Gewicht ein oder zwei Wiederholungen mehr zu schaffen."],
  ["3", "checkCircle", "Obergrenze erreicht", "Schaffst du in allen Sätzen die obere Grenze mit sauberer Technik, ist es Zeit für mehr Gewicht. Leidet die Ausführung, zählt die Wiederholung nicht."],
  ["4", "weightLifting", "Gewicht erhöhen", "Leg 2,5 bis 5 kg drauf (bei Kurzhanteln die nächste Stufe) und starte wieder an der unteren Grenze."],
  ["5", "scroll", "Alles notieren", "Ohne Notizen rätst du. Mit dem Tracker im Anhang weißt du jede Woche genau, wo du anknüpfst."],
].forEach(t => out.push(tocRow(t[0], t[1], t[2], t[3])));
out.push(`<h2 class="block-title" style="margin-top:5mm;">Beispiel: Front Squats, 3 Sätze à 5-8 Wdh.</h2>`);
out.push(exTable(
  [{ label: "Woche" }, { label: "Gewicht" }, { label: "Satz 1" }, { label: "Satz 2" }, { label: "Satz 3" }, { label: "Nächster Schritt", cls: "w-ex" }],
  [
    { cells: ["1", "50 kg", "6", "5", "5", "Wdh. steigern"] },
    { cells: ["3", "50 kg", "8", "7", "7", "Wdh. steigern"] },
    { cells: ["4", "50 kg", "8", "8", "8", "Gewicht erhöhen"], contrast: true },
    { cells: ["5", "52,5 kg", "6", "6", "5", "Wdh. steigern"] },
  ], "compact"
));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-2.html", html);
console.log("light-2.html written");
