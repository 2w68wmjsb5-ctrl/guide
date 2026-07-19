const fs = require("fs");
const { sectionHeader, techRow, quoteBlock, htmlShell } = require("./htmlkit.js");
const { MAE_MAI, LOOK_MAI } = require("./data.js");

let out = [];

out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("05 · Traditionelle Techniken", "Das Erbe des Muay Boran"));
out.push(`<p class="page-intro">Neben den modernen Trainingsmethoden und Standardtechniken bewahrt das Muay Thai auch eine tiefe Tradition. Unter Mae Mai versteht man die grundlegenden klassischen Techniken, die als Fundament dienen und in fast jedem Kampf Anwendung finden. Look Mai hingegen sind die fortgeschrittenen, oft komplexeren Bewegungen, die ein erfahrener Kämpfer beherrschen sollte. Sie zeigen die Vielfalt und Raffinesse des alten Muay Thai und geben Einblick in die Wurzeln dieser Kampfkunst.</p>
<p class="page-intro">Diese traditionellen Bewegungen stammen aus dem Muay Boran (มวยโบราณ) – der ursprünglichen Form des thailändischen Boxens, die lange vor dem modernen Muay Thai existierte. Muay Boran wurde ursprünglich als Kriegskunst entwickelt und diente den siamesischen Kriegern zur Selbstverteidigung auf dem Schlachtfeld. Jede Region Thailands hatte dabei ihren eigenen Stil – etwa Muay Chaiya, Muay Korat, Muay Lopburi oder Muay Tha Sao – die sich in Haltung, Technik und Strategie unterschieden, aber alle auf denselben Prinzipien von Effizienz, Balance und Körperbeherrschung basierten.</p>
<p class="page-intro">Aus dieser alten Kampfkunst entwickelte sich schließlich das sportlich regulierte Muay Thai, das heute weltweit praktiziert wird. Dennoch bleiben die Techniken des Muay Boran ein wichtiger Teil der thailändischen Kultur – als Erinnerung an die Ursprünge dieser Kampfkunst und als Symbol für Disziplin, Respekt und den unerschütterlichen Geist des Kämpfers.</p>`);
out.push(`</div>`);

out.push(`<div class="content-section chapter-start">`);
out.push(sectionHeader("05 · Mae Mai", "Mae Mai – Grundtechniken"));
out.push(`<p class="page-intro">Die klassischen Grundtechniken – Fundament fast jedes Muay Thai Kampfes.</p>`);
MAE_MAI.forEach((e, i) => out.push(techRow(i + 1, e)));
out.push(`</div>`);

out.push(`<div class="content-section content-block">`);
out.push(sectionHeader("05 · Look Mai", "Look Mai – Fortgeschrittene Techniken"));
out.push(`<p class="page-intro">Komplexe, raffinierte Bewegungen eines erfahrenen Kämpfers.</p>`);
LOOK_MAI.forEach((e, i) => out.push(techRow(i + 1, e)));
out.push(`<p class="page-intro" style="margin-top:6mm;">Dieses Bonus-Kapitel lädt dich dazu ein, die traditionellen Elemente kennenzulernen, die Muay Thai bis heute prägen und seine Geschichte lebendig halten.</p>`);
out.push(quoteBlock({
  thai: "เดินตามผู้ใหญ่ หมาไม่กัด",
  text: "„Wer den Älteren folgt, den beißt kein Hund.“ So wie die Mae Mai und Look Mai von Generation zu Generation weitergegeben wurden, lohnt es sich, von erfahrenen Trainern zu lernen.",
  source: "Thailändisches Sprichwort",
}));
out.push(`</div>`);

const html = htmlShell(out.join("\n"), `body{background:var(--bg-light);}`);
fs.writeFileSync(__dirname + "/light-5.html", html);
console.log("light-5.html written");
