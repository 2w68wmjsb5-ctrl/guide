const fs = require("fs");
const { sectionHeader, tipBox, tocRow, htmlShell, infoCard, disclaimer } = require("./htmlkit.js");

const TAG = "Kapitel 5 · Regeneration &amp; Ernährung";
let out = [];

// --- Schlaf & Erholung ---
out.push(`<div class="content-section chapter-start tight">`);
out.push(sectionHeader(TAG, "Schlaf &amp; Erholung"));
out.push(`<p class="page-intro">Training setzt den Reiz, stärker wirst du in der Erholung danach. Wer Muay Thai und S&amp;C kombiniert, verlangt seinem Körper viel ab und braucht entsprechend gute Regeneration.</p>`);
[
  ["1", "medal", "Schlaf ist dein bestes Supplement", "Sieben bis neun Stunden pro Nacht. Im Schlaf repariert dein Körper Muskeln und Gewebe, und dein Nervensystem erholt sich."],
  ["2", "templeGate", "Echte Ruhetage", "Mindestens ein Tag pro Woche ohne hartes Training. Leichte Bewegung wie Spazierengehen oder Schwimmen ist erlaubt."],
  ["3", "highKick", "Aktive Erholung", "Lockeres Stretching oder die Hüftmobilität aus Kapitel 4 fördern die Durchblutung und halten dich beweglich."],
  ["4", "kneeBandage", "Warnsignale ernst nehmen", "Anhaltende Müdigkeit, ein erhöhter Ruhepuls am Morgen, sinkende Leistung, schlechter Schlaf oder fehlende Motivation zeigen dir: Zeit für eine Pause."],
].forEach(t => out.push(tocRow(t[0], t[1], t[2], t[3])));

out.push(`<h2 class="block-title" style="margin-top:5mm;">Deload-Wochen</h2>`);
out.push(`<p class="page-intro">Eine Deload-Woche ist eine geplante, leichtere Trainingswoche. Sie gibt Muskeln, Gelenken und Nervensystem Zeit, aufzuholen. Plane sie etwa alle sechs bis zehn Wochen ein, oder früher, wenn die Warnsignale auftauchen. Danach steigst du mit den Gewichten aus der vorletzten Woche davor wieder ein.</p>`);
out.push(`<div class="region-cards" style="grid-template-columns:1fr 1fr 1fr;">`);
out.push(infoCard("01", "Weniger Sätze", "Volumen halbieren", "Pro Übung nur die Hälfte der Sätze, bei gleicher Übungsauswahl."));
out.push(infoCard("02", "Weniger Gewicht", "Etwa zwei Drittel", "Rund ein Drittel weniger Last als zuletzt, jede Wiederholung bleibt leicht."));
out.push(infoCard("03", "Mehr Technik", "Qualität statt Last", "Nutze die Woche für saubere Ausführung, Mobilität und lockeres Cardio."));
out.push(`</div>`);
out.push(`</div>`);

// --- Ernährung ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Ernährung für Kämpfer"));
out.push(`<p class="page-intro">Ohne passende Ernährung bringt auch das beste Training wenig. Du brauchst keinen komplizierten Plan, aber ein paar Grundregeln helfen dir, Leistung zu bringen und dich schnell zu erholen.</p>`);
out.push(`<div class="region-cards">`);
out.push(infoCard("01", "Protein", "1,6 bis 2 g pro kg Körpergewicht", "Baustoff für Muskeln und Reparatur. Verteile es auf drei bis fünf Mahlzeiten, etwa aus Eiern, Fleisch, Fisch, Milchprodukten oder Hülsenfrüchten."));
out.push(infoCard("02", "Kohlenhydrate", "Dein Treibstoff", "Reis, Kartoffeln, Haferflocken und Obst liefern die Energie für intensive Einheiten. Iss sie vor allem rund um dein Training."));
out.push(infoCard("03", "Fette", "Für Hormone &amp; Gesundheit", "Nüsse, Avocado, Olivenöl und fetter Fisch. Wichtig für deinen Körper, aber besser nicht in großen Mengen direkt vor dem Training."));
out.push(infoCard("04", "Timing", "Vor &amp; nach dem Training", "Zwei bis drei Stunden vorher eine leicht verdauliche Mahlzeit, danach Protein und Kohlenhydrate, um die Erholung zu starten."));
out.push(`</div>`);
out.push(tipBox("comments", "Wie viele Kalorien brauche ich?", "Das hängt von Körpergewicht, Trainingsumfang und Ziel ab. Ein Online-Kalorienrechner gibt dir einen ersten Richtwert. Beobachte danach dein Gewicht über zwei bis drei Wochen und passe die Menge an."));
out.push(tipBox("flame", "Trinken bei Hitze:", "Im tropischen Klima verlierst du beim Training schnell ein bis zwei Liter Schweiß pro Stunde. Trink über den ganzen Tag verteilt, nicht nur im Training, und ergänze bei langen Einheiten Elektrolyte. Ein einfacher Check: Dein Urin sollte hellgelb sein."));
out.push(disclaimer("<b>Wichtiger Hinweis:</b> Dieser Guide ersetzt keine ärztliche, physiotherapeutische oder ernährungswissenschaftliche Beratung. Kläre bei Vorerkrankungen, Verletzungen oder Beschwerden vor Trainingsbeginn mit einem Arzt, ob das Training für dich geeignet ist. Das Training erfolgt auf eigene Verantwortung."));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-6.html", html);
console.log("light-6.html written");
