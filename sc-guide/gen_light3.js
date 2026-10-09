const fs = require("fs");
const { sectionHeader, tipBox, tocRow, htmlShell, infoCard, weekGrid, weekLegend } = require("./htmlkit.js");

const TAG = "Kapitel 2 · Planung";
let out = [];

const W = (arr) => ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d, i) => ({ d, v: arr[i][0], kind: arr[i][1] }));

// --- Zeitmodelle ---
out.push(`<div class="content-section chapter-start tight">`);
out.push(sectionHeader(TAG, "Drei Zeitmodelle"));
out.push(`<p class="page-intro">Wie viel S&amp;C sinnvoll ist, hängt davon ab, wie oft du Muay Thai trainierst und wie viel Zeit dir bleibt. Wähle das Modell, das zu deiner aktuellen Woche passt. Wechseln kannst du jederzeit.</p>`);
out.push(`<div class="region-cards" style="grid-template-columns:1fr 1fr 1fr;">`);
out.push(infoCard("01", "Minimum", "1 Einheit pro Woche", "Einheit A oder C im wöchentlichen Wechsel. Für volle Wochen, Reisen oder Phasen mit sehr viel Muay Thai. Hält dein Kraftniveau."));
out.push(infoCard("02", "Standard", "2 Einheiten pro Woche", "Einheit A und C. Der Normalfall bei drei bis vier Muay-Thai-Einheiten pro Woche. Jede Muskelgruppe wird zweimal trainiert."));
out.push(infoCard("03", "Plus", "3 Einheiten pro Woche", "Einheit A, B und C. Wenn du mehr Zeit hast und zusätzlich gezielt an deiner Kraftausdauer arbeiten willst."));
out.push(`</div>`);
out.push(tipBox("star", "Empfehlung:", "Starte mit dem Standard-Modell. Zwei Einheiten pro Woche sind genug, um spürbar stärker zu werden, und lassen dir genug Energie für dein Muay-Thai-Training."));

out.push(`</div>`);
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Deine Trainingswoche"));
out.push(`<p class="page-intro">So können die drei Modelle in einer typischen Woche aussehen. Die Tage sind Beispiele, wichtig sind die Abstände dazwischen.</p>`);
out.push(weekLegend());
out.push(`<div class="block-head"><span class="bt-title">Minimum</span><span class="bt-meta">3× Muay Thai · 1× S&amp;C</span></div>`);
out.push(weekGrid(W([["Thai", "thai"], ["Frei", "rest"], ["Thai<br>+ A", "sc"], ["Frei", "rest"], ["Thai", "thai"], ["Frei", "rest"], ["Ruhe", "rest"]])));
out.push(`<div class="block-head"><span class="bt-title">Standard</span><span class="bt-meta">4× Muay Thai · 2× S&amp;C</span></div>`);
out.push(weekGrid(W([["Thai<br>+ A", "sc"], ["Thai", "thai"], ["Frei", "rest"], ["Thai<br>+ C", "sc"], ["Frei", "rest"], ["Thai", "thai"], ["Ruhe", "rest"]])));
out.push(`<div class="block-head"><span class="bt-title">Plus</span><span class="bt-meta">4× Muay Thai · 3× S&amp;C</span></div>`);
out.push(weekGrid(W([["Thai<br>+ A", "sc"], ["Thai", "thai"], ["B", "opt"], ["Thai<br>+ C", "sc"], ["Frei", "rest"], ["Thai", "thai"], ["Ruhe", "rest"]])));
out.push(`</div>`);

// --- Regeln ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader(TAG, "Sechs Regeln für deine Planung"));
out.push(`<p class="page-intro">Egal welches Modell du wählst: Mit diesen Regeln passen S&amp;C und Muay Thai zusammen, statt sich gegenseitig auszubremsen.</p>`);
[
  ["1", "punchingBag", "Muay Thai zuerst", "Trainierst du beides am selben Tag, kommt Muay Thai zuerst. Technik braucht frische Beine und einen klaren Kopf."],
  ["2", "layerGroup", "Lieber stapeln als verteilen", "Leg S&amp;C auf einen Tag, an dem du ohnehin trainierst. So bleiben echte Erholungstage frei. Ideal sind ein paar Stunden Abstand, direkt im Anschluss geht aber auch."],
  ["3", "stopwatch", "48 Stunden Abstand", "Zwischen Einheit A und Einheit C sollten rund 48 Stunden liegen, damit sich deine Muskulatur erholen kann."],
  ["4", "shieldBash", "Sparring schützen", "Keine schwere Krafteinheit am Tag vor dem Sparring. Du willst dort reaktionsschnell und frisch sein."],
  ["5", "medal", "Mindestens ein Ruhetag", "Ein kompletter Ruhetag pro Woche ist Pflicht, nicht Kür. Spazierengehen und Stretching sind erlaubt."],
  ["6", "trophyCup", "Vor dem Kampf zurückfahren", "In den letzten sieben bis zehn Tagen vor einem Kampf reduzierst du auf eine kurze, leichte Einheit oder lässt S&amp;C ganz weg."],
].forEach(t => out.push(tocRow(t[0], t[1], t[2], t[3])));
out.push(tipBox("templeGate", "Im Camp in Thailand:", "Bei zwei Muay-Thai-Einheiten am Tag ist dein Körper bereits stark gefordert. Wähle dann das Minimum-Modell und leg die Einheit direkt hinter das Vormittagstraining eines Tages, an dem du nachmittags frei hast. Welche Camps sich für deinen Trainingsaufenthalt eignen, findest du im PATTO Muay Thai Gym Guide."));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-3.html", html);
console.log("light-3.html written");
