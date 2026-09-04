const fs = require("fs");
const { sectionHeader, gymGrid, regionSubTitle, regionCard, regionPageTitle, tipBox, htmlShell } = require("./htmlkit.js");
const data = require("./data.js");
const { REGIONS } = data;

function regionGymCount(region) {
  let n = 0;
  if (region.gyms) n += region.gyms.length;
  if (region.sub) n += region.sub.gyms.length;
  if (region.groups) region.groups.forEach(g => (n += g.gyms.length));
  return n;
}

// Short "ideal für" tags, paraphrased from each region's own source text
// (not new claims) — a scannable at-a-glance summary, not fabricated data.
const REGION_TAGS = {
  "Bangkok": "Authentizität & Wettkampf-Niveau — mittendrin statt nur dabei",
  "Chiang Mai": "Qualität, Ruhe & Tiefe im Training ohne unnötigen Druck",
  "Isaan": "Maximale Authentizität & bodenständiges, hartes Training",
  "Inselregion: Koh Samui, Koh Phangan & Koh Tao": "Training kombiniert mit Strand, Sonne & Erholung",
  "Pattaya": "Gute Infrastruktur, kurze Wege, intensives Training & Strand",
  "Phuket": "Trainingsvielfalt & Strand abseits der kommerzialisierten Zone",
  "Weitere Orte": "Ruhe, Authentizität & unverfälschtes Training abseits des Trubels",
};

let out = [];

// --- Regionen im Überblick ---
out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("Kapitel 2 · Gym-Verzeichnis", "Regionen im Überblick"));
out.push(`<p class="page-intro">Über 50 empfohlene Gyms, sieben Regionen – auf einen Blick, welche zu deinem Trainingsstil passt.</p>`);
out.push(`<div class="region-cards">`);
REGIONS.forEach((r, i) => {
  out.push(regionCard(String(i + 1).padStart(2, "0"), r.name, regionGymCount(r), REGION_TAGS[r.name] || ""));
});
out.push(`</div>`);
out.push(tipBox("trophyCup", "Möglichkeiten zu kämpfen:", data.KAEMPFEN_TIPP));
out.push(`</div>`);

// --- Einzelne Regionen ---
REGIONS.forEach((region, i) => {
  out.push(`<div class="content-section chapter-start">`);
  out.push(regionPageTitle("Kapitel 2 · Gym-Verzeichnis", region.name));
  region.paragraphs.forEach(p => {
    out.push(`<p class="page-intro">${p.replace(/\n/g, "<br>")}</p>`);
  });
  if (region.gyms) {
    out.push(gymGrid(region.gyms));
  }
  if (region.sub) {
    out.push(regionSubTitle("route", region.sub.title));
    out.push(`<p class="page-intro" style="margin-bottom:3mm;">${region.sub.intro}</p>`);
    out.push(gymGrid(region.sub.gyms));
  }
  if (region.groups) {
    region.groups.forEach(g => {
      out.push(regionSubTitle("mapMarked", g.title));
      out.push(gymGrid(g.gyms));
    });
  }
  out.push(`</div>`);
});

const html = htmlShell(out.join("\n"), `body{background:var(--paper);}`);
fs.writeFileSync(__dirname + "/light-3.html", html);
console.log("light-3.html written");
