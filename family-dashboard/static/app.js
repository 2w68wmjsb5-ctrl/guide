const $ = (id) => document.getElementById(id);
const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const eur0 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const SERIES = [
  ["einnahmen", "Einnahmen", "--series-1"],
  ["ausgaben", "Ausgaben", "--series-2"],
  ["gespart", "Gespart", "--series-3"],
];
const INTERVAL_TAG = { monatlich: "gray", quartal: "blue", "halbjährlich": "purple", jaehrlich: "orange" };
const LABEL_COLORS = ["blue", "green", "pink", "purple", "yellow", "orange", "red"];

let lastData = null;
let fixTab = "alle";
let weekOffset = 0;

function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const fmtDate = (iso, opts) => new Date(iso).toLocaleDateString("de-DE", opts);
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const tag = (text, color, dot = false) => `<span class="tag ${color}${dot ? " dot" : ""}">${esc(text)}</span>`;

function monthLabel(ym, long = false) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("de-DE", long ? { month: "long", year: "numeric" } : { month: "short" });
}

function labelColor(label) {
  let h = 0;
  for (const ch of label) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return LABEL_COLORS[h % LABEL_COLORS.length];
}

// --- Static decoration ----------------------------------------------------

const PHASE_LABEL = { morning: "☼ Morgen", day: "☀ Tag", evening: "☾ Abend", night: "★ Nacht" };
let coverPhase = null;

function drawDecoration() {
  Pixel.icon($("page-icon"));
}

function tick() {
  const now = new Date();
  const phase = Pixel.phase(now.getHours());
  if (phase !== coverPhase) {
    coverPhase = phase;
    Pixel.cover($("cover"), now.getHours());
  }
  $("c-phase").textContent = PHASE_LABEL[phase];
  $("c-time").textContent = now.toLocaleTimeString("de-DE");
  $("c-date").textContent = now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  if (now.getSeconds() === 0 || !$("time-progress").childElementCount) renderTimeProgress(now);
}

function renderTimeProgress(now) {
  const y0 = new Date(now.getFullYear(), 0, 1), y1 = new Date(now.getFullYear() + 1, 0, 1);
  const m0 = new Date(now.getFullYear(), now.getMonth(), 1), m1 = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const w0 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const w1 = new Date(w0.getFullYear(), w0.getMonth(), w0.getDate() + 7);
  const pct = (a, b) => Math.round(((now - a) / (b - a)) * 100);
  $("time-progress").innerHTML = [["Jahr", pct(y0, y1), "hp"], ["Monat", pct(m0, m1), "xp"], ["Woche", pct(w0, w1), "mp"]]
    .map(([l, p, kind]) => `<div class="tprog"><div class="lbl"><span>${l}</span><span>${p}%</span></div><div class="box ${kind}"><span style="width:${p}%"></span></div></div>`).join("");
}

// --- Data sections ---------------------------------------------------------

function renderHeader(data) {
  const h = new Date().getHours();
  const hello = h < 11 ? "Guten Morgen" : h < 18 ? "Hallo" : "Guten Abend";
  $("greeting").textContent = `${hello}! Heute ist ${new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}.`;
  $("demo-banner").hidden = !data.demo;
  $("status").innerHTML = Object.entries(data.status).map(([name, s]) => {
    const title = s.ok ? (s.info || "OK") : `Fehler: ${s.fehler}`;
    return `<li class="${s.ok ? "" : "err"}" title="${esc(title)}"><span class="dot"></span>${esc(name)}<span class="time">${fmtTime(s.zeit)}</span></li>`;
  }).join("") || `<li class="empty">Noch nichts verbunden.</li>`;
}

function miniBar(pct) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return `<div class="mini-bar"><span>${p}%</span><div class="track"><span style="width:${p}%"></span></div></div>`;
}

function renderOverview(f) {
  if (f.leer) {
    $("overview-month").textContent = "";
    $("overview").innerHTML = `<p class="empty">Noch keine Umsätze importiert. Legt einen Export eurer Finanz-App in den Import-Ordner oder ladet ihn links hoch.</p>`;
    return;
  }
  const m = f.aktueller_monat;
  $("overview-month").textContent = monthLabel(m.monat, true);
  const incomeTotal = m.einnahmen + f.noch_erwartet_summe;
  const cards = [
    { scene: "gold", seed: 3, icon: "↓", title: "Einnahmen", big: eur0.format(m.einnahmen),
      lines: [`Regelmäßig = ${eur0.format(f.einnahmen_monatlich)} / Monat`, `Noch erwartet = ${eur0.format(f.noch_erwartet_summe)}`],
      bar: incomeTotal ? (m.einnahmen / incomeTotal) * 100 : 0 },
    { scene: "market", seed: 11, icon: "↑", title: "Ausgaben", big: eur0.format(m.ausgaben),
      lines: [`Fixkosten = ${eur0.format(f.fixkosten_monatlich)} / Monat`, `Gespart = ${eur0.format(m.gespart)}`],
      bar: incomeTotal ? (m.ausgaben / incomeTotal) * 100 : 0 },
    { scene: "chest", seed: 5, icon: "◎", title: "Übrig am Monatsende", big: eur0.format(f.prognose_uebrig),
      lines: ["Prognose mit erwarteten", "Eingängen und Fixkosten"], bar: null },
    { scene: "board", seed: 21, icon: "◷", title: "Noch fällig", big: eur0.format(f.noch_faellig_summe),
      lines: [`${f.noch_faellig.length} Fixkosten bis Monatsende`, f.noch_faellig.map((x) => x.name).slice(0, 2).join(", ") || "Nichts mehr offen"],
      bar: null },
  ];
  $("overview").innerHTML = cards.map((c, i) => `
    <article class="gcard">
      <canvas width="48" height="24" data-i="${i}"></canvas>
      <div class="body">
        <div class="title"><span class="ico">${c.icon}</span>${c.title}</div>
        <div class="big">${c.big}</div>
        ${c.lines.map((l) => `<div class="line">${esc(l)}</div>`).join("")}
        ${c.bar !== null ? miniBar(c.bar) : ""}
      </div>
    </article>`).join("");
  $("overview").querySelectorAll("canvas").forEach((cv) => {
    const c = cards[+cv.dataset.i];
    Pixel.scene(cv, c.scene, c.seed);
  });
}

function renderShopping(list) {
  if (!list) { $("einkauf").innerHTML = `<li class="empty">Bring! nicht verbunden.</li>`; return; }
  $("liste-name").textContent = list.liste;
  $("einkauf").innerHTML = list.offen.length
    ? list.offen.map((i) => `<li><input type="checkbox" data-item="${esc(i.name)}" aria-label="${esc(i.name)} erledigt"><span>${esc(i.name)}</span><span class="info">${esc(i.info)}</span></li>`).join("")
    : `<li class="empty">Alles da 🎉</li>`;
  $("zuletzt").innerHTML = list.zuletzt.map((n) => `<button class="chip" data-add="${esc(n)}">+ ${esc(n)}</button>`).join("");
}

function renderReminders(events) {
  if (!events) { $("termine").innerHTML = `<li class="empty">Kalender nicht verbunden.</li>`; return; }
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  $("termine").innerHTML = events.slice(0, 8).map((ev) => {
    const d = new Date(ev.start);
    const day = sameDay(d, now) ? "heute" : sameDay(d, tomorrow) ? "morgen" : fmtDate(ev.start, { weekday: "short", day: "numeric", month: "numeric" });
    const when = ev.ganztags ? day : `${day}, ${fmtTime(ev.start)}`;
    return `<li>${esc(ev.titel)} <span class="when ${sameDay(d, now) ? "today" : ""}">· ${when}</span></li>`;
  }).join("") || `<li class="empty">Keine Termine in den nächsten Wochen.</li>`;
}

function fixStatus(x, refMonth) {
  if (x.manuell) return tag("Manuell", "purple", true);
  if (x.letzte?.startsWith(refMonth)) return tag("Bezahlt", "green", true);
  if (x.naechste?.startsWith(refMonth)) return tag("Fällig", "orange", true);
  return tag("Später", "gray", true);
}

function renderFixed(f) {
  if (f.leer) { $("fixkosten").innerHTML = ""; $("fix-sum").textContent = ""; return; }
  const refMonth = f.stand.slice(0, 7);
  let rows = f.fixkosten;
  if (fixTab === "faellig") rows = f.noch_faellig;
  if (fixTab === "selten") rows = f.ruecklage_posten;
  $("fixkosten").innerHTML = `<tr><th>Name</th><th>Rhythmus</th><th>Status</th><th>Nächste</th><th class="num">Betrag</th></tr>` +
    (rows.map((x) => `
      <tr>
        <td class="name"><span class="ico">☰</span>${esc(x.name)}</td>
        <td>${tag(x.intervall_label, INTERVAL_TAG[x.intervall] || "gray")}</td>
        <td>${fixStatus(x, refMonth)}</td>
        <td class="date">${x.naechste ? fmtDate(x.naechste, { day: "numeric", month: "short", year: "numeric" }) : "–"}</td>
        <td class="num">${eur.format(x.betrag)}</td>
      </tr>`).join("") || `<tr><td colspan="5" class="empty">Nichts in dieser Ansicht.</td></tr>`);
  $("fix-sum").textContent = fixTab === "selten"
    ? `Dafür ${eur.format(f.ruecklage_empfehlung)} pro Monat zurücklegen.`
    : `${f.fixkosten.length} automatisch erkannt · ≈ ${eur.format(f.fixkosten_monatlich)} pro Monat`;
}

function renderGoals(f) {
  $("sparziele").innerHTML = (f.sparziele || []).map((g) => `
    <div class="goal">
      <div class="name"><span class="ico">⚑</span>Quest: ${esc(g.name)}</div>
      <div class="vals">${eur0.format(g.stand)}${g.ziel ? ` von ${eur0.format(g.ziel)}` : ""}</div>
      ${g.ziel ? miniBar(g.prozent) : ""}
    </div>`).join("") || `<p class="empty">Sparziele in config.yaml eintragen.</p>`;
  $("empfehlung").innerHTML = !f.leer && f.ruecklage_empfehlung
    ? `Für Quartals- und Jahreskosten <strong>${eur.format(f.ruecklage_empfehlung)} / Monat</strong> zurücklegen.` : "";
}

function renderChart(f) {
  if (f.leer) { $("chart").innerHTML = `<p class="empty">Noch keine Daten.</p>`; $("legend").innerHTML = ""; return; }
  const months = f.monate;
  const css = getComputedStyle(document.documentElement);
  const color = (v) => css.getPropertyValue(v).trim();
  $("legend").innerHTML = SERIES.map(([, label, v]) => `<span><i style="background:var(${v})"></i>${label}</span>`).join("");

  const W = 600, H = 210, padL = 40, padB = 22, padT = 6;
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
      const x = start + j * (barW + 2), t = y(m[k]), h = Math.max(0, H - padB - t);
      const r = Math.min(4, h, barW / 2);
      svg += `<path fill="${color(v)}" d="M${x},${H - padB} V${t + r} Q${x},${t} ${x + r},${t} H${x + barW - r} Q${x + barW},${t} ${x + barW},${t + r} V${H - padB} Z"/>`;
    });
    svg += `<text class="axis" x="${gx + groupW / 2}" y="${H - 6}" text-anchor="middle">${monthLabel(m.monat)}</text>`;
  });
  $("chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${svg}</svg>`;

  const tip = $("tooltip");
  $("chart").querySelectorAll(".hit").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const m = months[+el.dataset.i];
      tip.innerHTML = `<strong>${monthLabel(m.monat, true)}</strong>` +
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
    <tr><td class="name"><span class="ico">⇄</span>${esc(t.name)}</td>
    <td class="date">${fmtDate(t.datum, { day: "numeric", month: "short" })}</td>
    <td class="num ${t.betrag > 0 ? "pos" : ""}">${eur.format(t.betrag)}</td></tr>`).join("");
}

function renderWeek(events) {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) + weekOffset * 7);
  const days = [...Array(7)].map((_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
  const first = days[0], last = days[6];
  const range = first.getMonth() === last.getMonth()
    ? first.toLocaleDateString("de-DE", { month: "long", year: "numeric" })
    : `${first.toLocaleDateString("de-DE", { month: "short" })} – ${last.toLocaleDateString("de-DE", { month: "short", year: "numeric" })}`;
  $("cal-range").textContent = range;
  $("week").innerHTML = days.map((d) => {
    const evs = (events || []).filter((ev) => sameDay(new Date(ev.start), d));
    return `<div class="day ${sameDay(d, now) ? "today" : ""}">
      <div class="day-head"><span>${d.toLocaleDateString("de-DE", { weekday: "short" })}</span><span class="n">${d.getDate()}</span></div>
      ${evs.map((ev) => `<div class="ev">
        <div class="t">▤ ${esc(ev.titel)}</div>
        <div class="s">${ev.ganztags ? "ganztags" : fmtTime(ev.start)}${ev.ort ? " · " + esc(ev.ort) : ""}</div>
        ${ev.label ? tag(ev.label, labelColor(ev.label), true) : ""}
      </div>`).join("")}
    </div>`;
  }).join("");
}

function render(data) {
  renderHeader(data);
  renderOverview(data.finanzen);
  renderShopping(data.einkauf);
  renderReminders(data.termine);
  renderFixed(data.finanzen);
  renderGoals(data.finanzen);
  renderChart(data.finanzen);
  renderTransactions(data.finanzen);
  renderWeek(data.termine);
}

async function load() {
  try {
    const res = await fetch("/api/dashboard");
    if (!res.ok) throw new Error(res.status);
    lastData = await res.json();
    $("offline-banner").hidden = !res.headers.get("X-Offline");
    render(lastData);
  } catch (err) {
    console.error("Dashboard konnte nicht geladen werden", err);
  }
}

async function post(url, body) {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(res.status);
  } catch {
    alert("Hat nicht geklappt. Seid ihr online? Bitte gleich nochmal versuchen.");
  }
  await load();
}

// --- Events ------------------------------------------------------------------

function selectTab(container, button) {
  container.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", String(b === button)));
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
$("fix-tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  fixTab = b.dataset.tab;
  selectTab($("fix-tabs"), b);
  if (lastData) renderFixed(lastData.finanzen);
});
$("cal-tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  weekOffset = +b.dataset.week;
  selectTab($("cal-tabs"), b);
  if (lastData) renderWeek(lastData.termine);
});
document.querySelector(".actions").addEventListener("click", (e) => {
  const action = e.target.closest("button")?.dataset.action;
  if (action === "einkauf") { $("panel-einkauf").scrollIntoView({ behavior: "smooth" }); $("add-name").focus({ preventScroll: true }); }
  if (action === "upload") $("upload").click();
  if (action === "termine") $("panel-termine").scrollIntoView({ behavior: "smooth" });
  if (action === "fixkosten") $("panel-fixkosten").scrollIntoView({ behavior: "smooth" });
});
$("upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const form = new FormData();
  form.append("file", file);
  $("upload-status").textContent = "Importiere …";
  try {
    const res = await fetch("/api/import", { method: "POST", body: form });
    const s = await res.json();
    $("upload-status").textContent = res.ok ? (s.ok ? s.info || "Importiert" : "Fehler: " + s.fehler) : (s.detail || "Fehler");
  } catch {
    $("upload-status").textContent = "Upload fehlgeschlagen. Seid ihr online?";
  }
  e.target.value = "";
  load();
});

if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
addEventListener("online", load);

drawDecoration();
tick();
setInterval(tick, 1000);
load();
setInterval(load, 60_000);
