const fs = require("fs");
const { sectionHeader, gymIndexItem, tipBox, htmlShell, trackerBlock } = require("./htmlkit.js");
const { WARMUP, EINHEIT_A, EINHEIT_B, EINHEIT_C, STRETCHING, HIP_MOBILITY } = require("./data.js");

// Every exercise in data.js with the place it appears, generated (never hand-typed).
function allExercises() {
  const map = new Map();
  const add = (name, where) => {
    if (!map.has(name)) map.set(name, new Set());
    map.get(name).add(where);
  };
  WARMUP.forEach(p => p.rows.forEach(r => add(r[0], "Warm-up")));
  EINHEIT_A.rows.forEach(r => add(r.ex, "Einheit A"));
  EINHEIT_B.emom.rows.forEach(r => add(r.ex, "Einheit B"));
  EINHEIT_B.amrap.rows.forEach(r => add(r.ex, "Einheit B"));
  EINHEIT_C.rows.forEach(r => add(r.ex, "Einheit C"));
  STRETCHING.forEach(r => add(r[0], "Stretching"));
  HIP_MOBILITY.forEach(r => add(r[0], "Hüftmobilität"));
  return [...map.entries()]
    .map(([name, w]) => ({ name, where: [...w].join(" · ") }))
    .sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }));
}

const ex = allExercises();
let out = [];

out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Anhang", "Übungs-Index A–Z"));
out.push(`<div class="gym-index" style="margin-top:6mm;">`);
ex.forEach(e => out.push(gymIndexItem(e.name, e.where)));
out.push(`</div>`);
out.push(tipBox("lightbulb", "Tipp:", "Du kennst eine Übung nicht? Such den Namen auf YouTube. Zu allen Übungen findest du dort Videos, die dir die richtige Ausführung zeigen."));
out.push(`</div>`);

out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Anhang", "Trainings-Tracker"));
out.push(`<p class="page-intro">Druck diese Seite aus oder trag deine Werte direkt in der PDF ein. Notiere bei jedem Satz die geschafften Wiederholungen, so weißt du in der nächsten Woche genau, wo du anknüpfst.</p>`);
out.push(trackerBlock(6));
out.push(trackerBlock(6));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-7.html", html);
console.log("light-7.html written (" + ex.length + " exercises)");
