const fs = require("fs");
const { sectionHeader, techRow, htmlShell } = require("./htmlkit.js");
const { MAE_MAI, LOOK_MAI } = require("./data.js");

let out = [];

out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("05 · Mae Mai", "Mae Mai – Grundtechniken"));
out.push(`<p class="page-intro">Die klassischen Grundtechniken – Fundament fast jedes Muay Thai Kampfes.</p>`);
MAE_MAI.forEach((e, i) => out.push(techRow(i + 1, e)));
out.push(`</div>`);

out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("05 · Look Mai", "Look Mai – Fortgeschrittene Techniken"));
out.push(`<p class="page-intro">Komplexe, raffinierte Bewegungen eines erfahrenen Kämpfers.</p>`);
LOOK_MAI.forEach((e, i) => out.push(techRow(i + 1, e)));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-5.html", html);
console.log("light-5.html written");
