const fs = require("fs");
const { sectionHeader, gymIndexItem, tipBox, htmlShell } = require("./htmlkit.js");
const { REGIONS } = require("./data.js");

function allGyms(regions) {
  const out = [];
  regions.forEach(r => {
    (r.gyms || []).forEach(name => out.push({ name, region: r.name }));
    if (r.sub) r.sub.gyms.forEach(name => out.push({ name, region: `${r.name} (Umland)` }));
    if (r.groups) r.groups.forEach(g => g.gyms.forEach(name => out.push({ name, region: g.title })));
  });
  out.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }));
  return out;
}

const gyms = allGyms(REGIONS);

let out = [];
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Kapitel 2 · Gym-Verzeichnis", "Gym-Index A–Z"));
out.push(`<div class="gym-index" style="margin-top:6mm;">`);
gyms.forEach(g => out.push(gymIndexItem(g.name, g.region)));
out.push(`</div>`);
out.push(tipBox("lightbulb", "Tipp:", "Nutze in deinem PDF-Reader Strg+F (Windows) bzw. Cmd+F (Mac), um gezielt nach einem Gym-Namen zu suchen."));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-4.html", html);
console.log("light-4.html written (" + gyms.length + " gyms)");
