const fs = require("fs");
const { sectionHeader, gymGrid, regionSubTitle, htmlShell } = require("./htmlkit.js");
const { REGIONS } = require("./data.js");

let out = [];

REGIONS.forEach((region, i) => {
  out.push(`<div class="content-section ${i === 0 ? "chapter-start" : "content-block"}">`);
  out.push(sectionHeader("Gym-Verzeichnis", region.name));
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

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-2.html", html);
console.log("light-2.html written");
