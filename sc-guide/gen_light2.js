const fs = require("fs");
const { sectionHeader, doDontCard, tipBox, tocRow, htmlShell, iconHex, hexGlyph, infoCard, exTable, chainRow } = require("./htmlkit.js");

const TAG = "Kapitel 1 · Grundlagen";
let out = [];

// --- Warum S&C ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Warum S&amp;C für Muay Thai?"));
out.push(`<p class="page-intro">Muay Thai ist ein Vollkontaktsport. Jeder Kick, jedes Knie und jeder Clinch belastet Gelenke, Sehnen und Muskeln, und das Woche für Woche. Gutes Athletiktraining macht dich deshalb nicht nur explosiver, sondern vor allem belastbarer: Du trainierst konstanter, fällst seltener aus und kannst deine Technik mit mehr Wucht umsetzen.</p>`);
out.push(`<p class="page-intro">Dabei geht es nicht darum, möglichst viel Gewicht zu bewegen. Kraft ist die Grundlage, aber erst wenn du lernst, sie schnell abzurufen und über den ganzen Körper in die Technik zu übertragen, wird sie im Ring wirksam. Dieser Guide verfolgt deshalb vier Ziele:</p>`);
out.push(`<div class="region-cards">`);
out.push(infoCard("01", "Kraft aufbauen", "Das Fundament", "Mehr Kraft in Beinen, Hüfte, Rumpf und Oberkörper. Sie ist die Basis für alles andere und macht dich im Clinch standfest."));
out.push(infoCard("02", "Kraft übertragen", "Vom Boden in die Technik", "Kraft entsteht in den Beinen und muss über Hüfte und Rumpf ohne Verlust bis ins Schienbein oder die Faust gelangen."));
out.push(infoCard("03", "Explosivkraft", "Kraft × Tempo", "Wie schnell du deine Kraft abrufen kannst. Sie macht Kicks, Knie und Schläge hart und schnell zugleich."));
out.push(infoCard("04", "Verletzungen vorbeugen", "Belastbar bleiben", "Starke Muskeln, Sehnen und Bänder fangen Belastung ab. Wer seltener ausfällt, trainiert konstanter und wird schneller besser."));
out.push(`</div>`);
out.push(tipBox("stopwatch", "Und die Ausdauer?", "Kraftausdauer und Kondition sorgen dafür, dass du all das bis in die letzte Runde abrufen kannst. Welche Ausdauer du brauchst und wie du sie gezielt ergänzt, erfährst du in Kapitel 4."));
out.push(`</div>`);

// --- Kraftübertragung ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Kraft richtig übertragen"));
out.push(`<p class="page-intro">Ein harter Roundhouse-Kick entsteht nicht im Bein, das trifft. Er beginnt mit dem Druck des Standfußes in den Boden, wird über Hüftrotation beschleunigt, vom Rumpf weitergeleitet und landet erst am Ende im Schienbein. Diese Abfolge heißt <b>kinetische Kette</b>. Bei Schlägen, Knien und Teeps funktioniert sie genauso.</p>`);
out.push(chainRow([
  ["Boden", "Standfuß drückt in den Boden"],
  ["Beine", "Streckung erzeugt die Kraft"],
  ["Hüfte", "Rotation beschleunigt"],
  ["Rumpf", "überträgt ohne Verlust"],
  ["Ziel", "Schienbein, Knie oder Faust"],
]));
out.push(`<p class="page-intro">Jedes Glied muss stark und stabil sein. Ist der Rumpf zu weich oder der Standfuß instabil, versickert Kraft auf dem Weg, ganz egal wie stark deine Beine sind. Krafttraining für Kämpfer heißt deshalb immer auch: lernen, Kraft durch den ganzen Körper zu leiten.</p>`);
[
  ["1", "footsteps", "Im Stand und vom Boden aus", "Übungen im Stand mit festem Fußdruck, statt im Sitzen oder Liegen an der Maschine. So trainierst du die Kette so, wie du sie im Ring brauchst."],
  ["2", "muscularTorso", "Rumpf als Brücke", "Ein starker Rumpf hält Rotation aus und leitet sie gezielt weiter. Trainiert wird er durch Übungen, die Rotation erzeugen, und durch Übungen, die ihr widerstehen."],
  ["3", "highKick", "Rotation und Stabilität auf einem Bein", "Kicks und Knie schlägst du auf einem Bein. Rotationsübungen, Würfe und einbeinige Stabilität übertragen deine Kraft direkt in diese Bewegungen."],
  ["4", "punchingBag", "Vom Gym in die Technik", "Kontrastsätze und Medizinballwürfe verbinden schwere Kraft mit schneller Bewegung. Am Sandsack setzt du das dann in Technik um."],
].forEach(t => out.push(tocRow(t[0], t[1], t[2], t[3])));
out.push(`</div>`);

// --- Verletzungen vorbeugen ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Verletzungen vorbeugen"));
out.push(`<p class="page-intro">Die meisten Trainingsausfälle im Muay Thai entstehen nicht durch einen einzelnen Treffer, sondern durch Überlastung: zu viel, zu schnell, auf einen Körper, der nicht vorbereitet ist. Muskeln passen sich in wenigen Wochen an, Sehnen, Bänder und Knochen brauchen dafür Monate. Gezieltes Krafttraining gibt ihnen diese Zeit und macht dich Stück für Stück belastbarer.</p>`);
out.push(exTable(
  [{ label: "Bereich", cls: "w-ex" }, { label: "Belastung im Muay Thai", cls: "w-ex" }, { label: "Was schützt", cls: "w-ex" }],
  [
    { cells: ["Sprunggelenk &amp; Fuß", "Drehen auf dem Fußballen beim Kick, ständiges Federn", "Sprünge mit sauberer Landung, Wadenkraft, einbeinige Stabilität"] },
    { cells: ["Knie", "Rotation unter Last, Checks, Knie im Clinch", "Kraft in Ober- und Rückseite der Beine, kontrollierte Landungen"] },
    { cells: ["Hüfte &amp; Leiste", "Hohe Kicks, Teeps, weite Ausfallbewegungen", "Mobilität mit Kontrolle, Kraft in tiefen und weiten Positionen"] },
    { cells: ["Unterer Rücken", "Rotation, Ziehen und Drücken im Clinch", "Rumpfkraft, saubere Hebetechnik, Hüftbeweglichkeit"] },
    { cells: ["Schulter", "Tausende Schläge, Rahmen und Kontrolle im Clinch", "Zugübungen als Ausgleich zum Drücken, Schulterblattkontrolle"] },
    { cells: ["Nacken", "Ziehen und Halten im Clinch", "Kräftige Nacken- und obere Rückenmuskulatur"] },
  ], "compact"
));
out.push(`<div class="region-cards" style="grid-template-columns:1fr 1fr 1fr;">`);
out.push(infoCard("01", "Balance", "Ziehen gleicht Drücken aus", "Muay Thai ist drucklastig. Zugübungen halten Schultern und Haltung im Gleichgewicht."));
out.push(infoCard("02", "Kontrolle", "Bremsen lernen", "Saubere Landungen und kontrolliertes Absenken stärken Sehnen und schützen Knie und Sprunggelenk."));
out.push(infoCard("03", "Dosierung", "Langsam steigern", "Belastung in kleinen Schritten erhöhen und Erholung einplanen, damit das Gewebe mitwachsen kann."));
out.push(`</div>`);
out.push(tipBox("kneeBandage", "Schmerz ist ein Signal:", "Muskelkater ist normal, stechender oder anhaltender Schmerz in einem Gelenk nicht. Dann Belastung reduzieren, die Übung anpassen und bei Bedarf einen Arzt oder Physiotherapeuten fragen, statt durchzuziehen."));
out.push(`</div>`);

// --- Smart vs. falsch ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Smartes vs. falsches S&amp;C"));
out.push(`<p class="page-intro">Mehr ist nicht automatisch besser. Gerade wenn deine Zeit knapp ist, entscheidet die Qualität deiner Einheiten, nicht ihre Menge.</p>`);
out.push(`<div class="dodont-cols">`);
out.push(doDontCard("do", "Smartes S&amp;C", iconHex("checkCircle", "7mm"), [
  "kurze, fokussierte Einheiten mit klarem Ziel",
  "explosive Bewegungen auf Basis solider Grundübungen",
  "saubere Technik vor mehr Gewicht",
  "Einheiten so gelegt, dass dein Muay Thai nicht darunter leidet",
  "jede Einheit notieren und dich langsam, aber stetig steigern",
]));
out.push(doDontCard("dont", "Falsches S&amp;C", hexGlyph("&#10005;", "7mm"), [
  "Gewichte stemmen um der Zahlen willen oder stundenlanges „Pumpen“ einzelner Muskeln",
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
