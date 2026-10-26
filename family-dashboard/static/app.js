const $ = (id) => document.getElementById(id);
const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const eur0 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const SERIES = [
  ["einnahmen", "Einnahmen", "--series-1"],
  ["ausgaben", "Ausgaben", "--series-2"],
  ["gespart", "Gespart", "--series-3"],
];

function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtDate(iso, opts) {
  return new Date(iso).toLocaleDateString("de-DE", opts);
}

function monthLabel(ym) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("de-DE", { month: "short" });
}

function renderHeader(data) {
  const h = new Date().getHours();
  $("greeting").textContent = h < 11 ? "Guten Morgen!" : h < 18 ? "Hallo!" : "Guten Abend!";
  $("today").textContent = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  $("demo-banner").hidden = !data.demo;
  $("status").innerHTML = Object.entries(data.status).map(([name, s]) => {
    const time = new Date(s.zeit).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    const title = s.ok ? `Zuletzt aktualisiert ${time}${s.info ? " · " + s.info : ""}` : `Fehler: ${s.fehler}`;
    return `<span class="pill ${s.ok ? "" : "err"}" title="${esc(title)}">${esc(name)}</span>`;
  }).join("");
}

function renderKpis(f) {
  if (f.leer) {
    $("kpis").innerHTML = `<div class="kpi"><div class="label">Finanzen</div><div class="sub">Noch keine Umsätze importiert. Lege einen Export aus eurer Finanz-App in den Import-Ordner oder lade ihn unten hoch.</div></div>`;
    return;
  }
  const m = f.aktueller_monat;
  const tiles = [
    ["Einnahmen", eur0.format(m.einnahmen), f.noch_erwartet_summe ? `+ ${eur0.format(f.noch_erwartet_summe)} noch erwartet` : `im ${monthLabel(m.monat)}`],
    ["Ausgaben", eur0.format(m.ausgaben), `Fixkosten ≈ ${eur0.format(f.fixkosten_monatlich)} / Monat`],
    ["Übrig am Monatsende", eur0.format(f.prognose_uebrig), `Prognose, nach ${eur0.format(m.gespart)} gespart`],
    ["Noch fällig", eur0.format(f.noch_faellig_summe), `${f.noch_faellig.length} Fixkosten bis Monatsende`],
  ];
  $("kpis").innerHTML = tiles.map(([label, value, sub]) =>
    `<div class="kpi"><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${esc(sub)}</div></div>`
  ).join("");
}

function renderEvents(events) {
  if (!events) { $("termine").innerHTML = `<li class="empty">Kalender nicht verbunden.</li>`; return; }
  if (!events.length) { $("termine").innerHTML = `<li class="empty">Keine Termine in den nächsten Wochen.</li>`; return; }
  const todayKey = new Date().toDateString();
  const tomorrow = new Date(Date.now() + 864e5).toDateString();
  let lastDay = "";
  const html = [];
  for (const ev of events.slice(0, 14)) {
    const start = new Date(ev.start);
    const key = start.toDateString();
    if (key !== lastDay) {
      const label = key === todayKey ? "Heute" : key === tomorrow ? "Morgen" : fmtDate(ev.start, { weekday: "long", day: "numeric", month: "short" });
      html.push(`<li class="day-head ${key === todayKey ? "today" : ""}">${label}</li>`);
      lastDay = key;
    }
    const time = ev.ganztags ? "ganztags" : start.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    const meta = [ev.ort, ev.label].filter(Boolean).join(" · ");
    html.push(`<li><span class="when">${time}</span><span>${esc(ev.titel)}${meta ? `<div class="meta">${esc(meta)}</div>` : ""}</span></li>`);
  }
  $("termine").innerHTML = html.join("");
}

function renderShopping(list) {
  if (!list) { $("einkauf").innerHTML = `<li class="empty">Bring! nicht verbunden.</li>`; return; }
  $("liste-name").textContent = list.liste;
  $("einkauf").innerHTML = list.offen.length
    ? list.offen.map((i) => `<li><input type="checkbox" data-item="${esc(i.name)}" aria-label="${esc(i.name)} erledigt"><span>${esc(i.name)}</span><span class="info">${esc(i.info)}</span></li>`).join("")
    : `<li class="empty">Alles da 🎉</li>`;
  $("zuletzt").innerHTML = list.zuletzt.map((n) => `<button class="chip" data-add="${esc(n)}">+ ${esc(n)}</button>`).join("");
}

function renderFixed(f) {
  if (f.leer) { $("fixkosten").innerHTML = ""; $("fix-sum").textContent = ""; return; }
  $("fix-sum").textContent = `${f.fixkosten.length} automatisch erkannt · ≈ ${eur.format(f.fixkosten_monatlich)} pro Monat`;
  $("fixkosten").innerHTML = f.fixkosten.map((x) => `
    <tr><td>${esc(x.name)}<div class="muted small">${x.intervall_label}${x.naechste ? " · nächste " + fmtDate(x.naechste, { day: "numeric", month: "short" }) : ""}</div></td>
    <td class="num">${eur.format(x.betrag)}</td></tr>`).join("");
}

function renderSavings(f) {
  $("sparziele").innerHTML = (f.sparziele || []).map((g) => `
    <div class="goal"><div class="row"><span>${esc(g.name)}</span>
      <span class="num">${eur0.format(g.stand)}${g.ziel ? ` <span class="muted">/ ${eur0.format(g.ziel)}</span>` : ""}</span></div>
      ${g.ziel ? `<div class="bar" role="progressbar" aria-valuenow="${g.prozent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${g.prozent}%"></span></div>` : ""}
    </div>`).join("") || `<p class="empty">Sparziele in config.yaml eintragen.</p>`;
  if (f.leer || !f.ruecklage_posten.length) { $("empfehlung").hidden = true; return; }
  $("empfehlung").hidden = false;
  const items = f.ruecklage_posten.map((p) => `${esc(p.name)} (${eur0.format(p.betrag)} ${p.intervall_label})`).join(", ");
  $("empfehlung").innerHTML = `Legt <strong>${eur.format(f.ruecklage_empfehlung)} pro Monat</strong> zurück, dann tun die unregelmäßigen Fixkosten nicht weh: ${items}.`;
}

function renderChart(f) {
  if (f.leer) { $("chart").innerHTML = `<p class="empty">Noch keine Daten.</p>`; $("legend").innerHTML = ""; return; }
  const months = f.monate;
  const css = getComputedStyle(document.documentElement);
  const color = (v) => css.getPropertyValue(v).trim();
  $("legend").innerHTML = SERIES.map(([, label, v]) => `<span><i style="background:var(${v})"></i>${label}</span>`).join("");

  const W = 600, H = 220, padL = 44, padB = 22, padT = 6;
  const max = Math.max(1, ...months.flatMap((m) => SERIES.map(([k]) => m[k])));
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const y = (v) => padT + (H - padT - padB) * (1 - v / top);
  const groupW = (W - padL) / months.length;
  const barW = Math.min(18, (groupW - 16) / SERIES.length - 2);

  let svg = "";
  for (let i = 0; i <= 4; i++) {
    const v = (top / 4) * i;
    svg += `<line class="grid-line" x1="${padL}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/>`;
    svg += `<text class="axis" x="${padL - 6}" y="${y(v) + 4}" text-anchor="end">${v >= 1000 ? (v / 1000).toLocaleString("de-DE") + "k" : v}</text>`;
  }
  months.forEach((m, i) => {
    svg += `<rect class="hit" data-i="${i}" x="${padL + i * groupW}" y="0" width="${groupW}" height="${H - padB}"/>`;
  });
  months.forEach((m, i) => {
    const gx = padL + i * groupW;
    const start = gx + (groupW - SERIES.length * (barW + 2)) / 2;
    SERIES.forEach(([k, , v], j) => {
      const x = start + j * (barW + 2), top_ = y(m[k]), h = Math.max(0, H - padB - top_);
      const r = Math.min(4, h, barW / 2);
      // Rounded top corners, square at the baseline
      svg += `<path fill="${color(v)}" d="M${x},${H - padB} V${top_ + r} Q${x},${top_} ${x + r},${top_} H${x + barW - r} Q${x + barW},${top_} ${x + barW},${top_ + r} V${H - padB} Z"/>`;
    });
    svg += `<text class="axis" x="${gx + groupW / 2}" y="${H - 6}" text-anchor="middle">${monthLabel(m.monat)}</text>`;
  });
  $("chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${svg}</svg>`;

  const tip = $("tooltip");
  $("chart").querySelectorAll(".hit").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const m = months[+el.dataset.i];
      tip.innerHTML = `<strong>${new Date(m.monat + "-01").toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</strong>` +
        SERIES.map(([k, label, v]) => `<div class="t-row"><span><i style="background:var(${v})"></i>${label}</span><span class="num">${eur0.format(m[k])}</span></div>`).join("");
      tip.hidden = false;
      tip.style.left = Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8) + "px";
      tip.style.top = e.clientY + 14 + "px";
    });
    el.addEventListener("mouseleave", () => { tip.hidden = true; });
  });

  $("chart-table").innerHTML = `<tr><th>Monat</th>${SERIES.map(([, l]) => `<th class="num">${l}</th>`).join("")}</tr>` +
    months.map((m) => `<tr><td>${monthLabel(m.monat)}</td>${SERIES.map(([k]) => `<td class="num">${eur0.format(m[k])}</td>`).join("")}</tr>`).join("");
}

function renderTransactions(f) {
  $("umsaetze").innerHTML = f.leer ? "" : f.letzte_umsaetze.map((t) => `
    <tr><td>${esc(t.name)}<div class="muted small">${fmtDate(t.datum, { day: "numeric", month: "short" })}</div></td>
    <td class="num ${t.betrag > 0 ? "pos" : ""}">${eur.format(t.betrag)}</td></tr>`).join("");
}

let lastData = null;
async function load() {
  try {
    const res = await fetch("/api/dashboard");
    if (!res.ok) throw new Error(res.status);
    lastData = await res.json();
    render(lastData);
  } catch (err) {
    console.error("Dashboard konnte nicht geladen werden", err);
  }
}

function render(data) {
  renderHeader(data);
  renderKpis(data.finanzen);
  renderEvents(data.termine);
  renderShopping(data.einkauf);
  renderFixed(data.finanzen);
  renderSavings(data.finanzen);
  renderChart(data.finanzen);
  renderTransactions(data.finanzen);
}

async function post(url, body) {
  await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  await load();
}

$("add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("add-name").value.trim();
  if (!name) return;
  $("add-name").value = "";
  post("/api/einkauf", { name });
});
$("einkauf").addEventListener("change", (e) => {
  if (e.target.dataset.item) post("/api/einkauf/erledigt", { name: e.target.dataset.item });
});
$("zuletzt").addEventListener("click", (e) => {
  if (e.target.dataset.add) post("/api/einkauf", { name: e.target.dataset.add });
});
$("upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const form = new FormData();
  form.append("file", file);
  $("upload-status").textContent = "Importiere …";
  const res = await fetch("/api/import", { method: "POST", body: form });
  const s = await res.json();
  $("upload-status").textContent = res.ok ? (s.ok ? s.info || "Importiert" : "Fehler: " + s.fehler) : (s.detail || "Fehler");
  e.target.value = "";
  load();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => lastData && render(lastData));

load();
setInterval(load, 60_000);
