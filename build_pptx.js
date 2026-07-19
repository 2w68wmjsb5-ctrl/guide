const {
  pres, COLORS, FONT, PAGE_W, PAGE_H, MARGIN, CONTENT_W,
  resolveIcon, iconBadge, paraBoxHeight, chapterHeader, tableSection, tipBox, quoteBlock, data,
} = require("./pptxkit.js");

const LOGO = __dirname + "/brand/patto-logo-white.png";
const LOGO_RATIO = 1008 / 326;

// ---------- generic grid card helpers ----------
function grid(n, cols, gap, cellW, cellH, x0, y0) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    out.push({ x: x0 + c * (cellW + gap), y: y0 + r * (cellH + gap) });
  }
  return out;
}

function legendCard(slide, { x, y, w, h, iconName, title, desc }) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.05, fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 0.75 } });
  const d = 0.42;
  iconBadge(slide, { x: x + w / 2 - d / 2, y: y + 0.18, d, iconName });
  slide.addText(title, { x: x + 0.08, y: y + 0.68, w: w - 0.16, h: 0.26, fontSize: 11, bold: true, align: "center", color: COLORS.textDark, fontFace: FONT, margin: 0 });
  slide.addText(desc, { x: x + 0.1, y: y + 0.95, w: w - 0.2, h: h - 1.05, fontSize: 8, align: "center", color: COLORS.textMuted, fontFace: FONT, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
}

function darkCard(slide, { x, y, w, h, iconName, title, sub, desc }) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.05, fill: { color: COLORS.primary }, line: { color: "3A4150", width: 0.75 } });
  const d = 0.36;
  iconBadge(slide, { x: x + 0.16, y: y + 0.16, d, iconName });
  slide.addText(title, { x: x + 0.16, y: y + 0.6, w: w - 0.32, h: 0.4, fontSize: 10.5, bold: true, color: COLORS.accent, fontFace: FONT, margin: 0, valign: "top" });
  let ty = y + 0.6 + (title.length > 16 ? 0.42 : 0.24);
  if (sub) {
    slide.addText(sub, { x: x + 0.16, y: ty, w: w - 0.32, h: 0.22, fontSize: 8, italic: true, color: COLORS.textOnDarkMuted, fontFace: FONT, margin: 0 });
    ty += 0.24;
  }
  slide.addText(desc, { x: x + 0.16, y: ty, w: w - 0.32, h: y + h - ty - 0.1, fontSize: 8, color: "D6DAE0", fontFace: FONT, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
}

function catCard(slide, { x, y, w, h, iconName, title, meta }) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.05, fill: { color: COLORS.primary }, line: { type: "none" } });
  const d = 0.4;
  iconBadge(slide, { x: x + w / 2 - d / 2, y: y + 0.16, d, iconName });
  slide.addText(title, { x: x + 0.05, y: y + 0.62, w: w - 0.1, h: 0.24, fontSize: 10.5, bold: true, align: "center", color: COLORS.white, fontFace: FONT, margin: 0 });
  slide.addText(meta, { x: x + 0.05, y: y + 0.86, w: w - 0.1, h: 0.2, fontSize: 8, align: "center", color: COLORS.accent, fontFace: FONT, margin: 0 });
}

function tocRow(slide, { x, y, w, num, iconName, title, sub }) {
  const h = 0.72;
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 0.75 } });
  const d = 0.44;
  slide.addShape(pres.ShapeType.ellipse, { x: x + 0.16, y: y + h / 2 - d / 2, w: d, h: d, fill: { color: COLORS.primary }, line: { type: "none" } });
  slide.addText(num, { x: x + 0.16, y: y + h / 2 - d / 2, w: d, h: d, fontSize: 12, bold: true, color: COLORS.accent, align: "center", valign: "middle", fontFace: FONT, margin: 0 });
  const { file } = resolveIcon(iconName, "onLight");
  slide.addImage({ path: file, x: x + 0.7, y: y + h / 2 - 0.16, w: 0.32, h: 0.32 });
  slide.addText(title, { x: x + 1.15, y: y + 0.1, w: w - 1.3, h: 0.28, fontSize: 12.5, bold: true, color: COLORS.textDark, fontFace: FONT, margin: 0 });
  slide.addText(sub, { x: x + 1.15, y: y + 0.38, w: w - 1.3, h: 0.3, fontSize: 8.5, color: COLORS.textMuted, fontFace: FONT, margin: 0, valign: "top" });
  return h;
}

function darkBgCircle(slide, { d, x, y, tint = false }) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: tint ? COLORS.primaryLighter : COLORS.primaryLight }, line: { type: "none" } });
}

function insightSlide(kind, opts) {
  const slide = pres.addSlide({ masterName: "LIGHT" });
  const y = MARGIN + 0.4;
  if (kind === "tip") tipBox(slide, { x: MARGIN, y, w: CONTENT_W, ...opts });
  else quoteBlock(slide, { x: MARGIN, y, w: CONTENT_W, ...opts });
  return slide;
}

// ============================================================
// 0 — COVER
// ============================================================
{
  const slide = pres.addSlide({ masterName: "DARK" });
  darkBgCircle(slide, { d: 5.5, x: -2.2, y: -2.2, tint: true });
  darkBgCircle(slide, { d: 3.5, x: PAGE_W - 1.5, y: PAGE_H - 2.2 });
  const logoW = 3.6, logoH = logoW / LOGO_RATIO;
  slide.addImage({ path: LOGO, x: (PAGE_W - logoW) / 2, y: 4.6, w: logoW, h: logoH });
  slide.addText("MUAY THAI LEXIKON", { x: 0, y: 4.6 + logoH + 0.15, w: PAGE_W, h: 0.35, fontSize: 15, bold: true, color: COLORS.accent, align: "center", fontFace: FONT, charSpacing: 2, margin: 0 });
  slide.addText("Deutsch  ·  Phonetik  ·  ภาษาไทย", { x: 0, y: 4.6 + logoH + 0.6, w: PAGE_W, h: 0.3, fontSize: 11, color: COLORS.textOnDarkMuted, align: "center", fontFace: FONT, margin: 0 });
  slide.addText("DEIN VOKABULAR FÜR GYM, REISE UND WETTKAMPF IN THAILAND", { x: 0.5, y: PAGE_H - 1.15, w: PAGE_W - 1, h: 0.3, fontSize: 9, color: "6C7382", align: "center", fontFace: FONT, charSpacing: 0.5, margin: 0 });
}

// ============================================================
// 1 — VORWORT
// ============================================================
{
  const slide = pres.addSlide({ masterName: "DARK" });
  darkBgCircle(slide, { d: 3.2, x: PAGE_W - 1.6, y: -1.2, tint: true });
  slide.addText("KAPITEL 1 · VORWORT", { x: MARGIN, y: MARGIN, w: CONTENT_W, h: 0.25, fontSize: 10, bold: true, color: COLORS.accent, fontFace: FONT, charSpacing: 1.5, margin: 0 });
  slide.addText("Willkommen im PATTO Lexikon", { x: MARGIN, y: MARGIN + 0.32, w: CONTENT_W, h: 0.6, fontSize: 25, bold: true, color: COLORS.white, fontFace: FONT, margin: 0 });

  const paras = [
    "Muay Thai – die Kunst der „acht Gliedmaßen“ – ist nicht nur eine Kampfsportart, sondern auch ein wesentlicher Bestandteil der thailändischen Kultur und Tradition. Dieser Guide soll dir dabei helfen, die wichtigsten Begriffe, Techniken und Bewegungen im Muay Thai in deutscher und thailändischer Sprache besser zu verstehen.",
    "Neben der reinen Übersetzung findest du bei vielen Begriffen auch knappe und anschauliche Beschreibungen, die dir helfen, dir die Bewegungen direkt vorstellen zu können. Bitte beachte jedoch, dass diese Beschreibungen nur als Hilfestellung dienen. Die korrekte Ausführung der Techniken sollte stets unter Anleitung eines Trainers oder anhand von Videoanleitungen erlernt werden.",
    "Ob im Training, beim Wettkampf oder während eines Aufenthalts in Thailand – dieser Guide unterstützt dich dabei, dich sowohl sprachlich als auch fachlich im Muay Thai besser zurechtzufinden. Er ist Nachschlagewerk, Lernhilfe und Kulturführer zugleich.",
  ];
  let y = MARGIN + 1.05;
  slide.addShape(pres.ShapeType.rect, { x: MARGIN, y, w: 0.02, h: 3.15, fill: { color: COLORS.accent }, line: { type: "none" } });
  paras.forEach(p => {
    const h = paraBoxHeight(p, 11.5, CONTENT_W - 0.35);
    slide.addText(p, { x: MARGIN + 0.25, y, w: CONTENT_W - 0.25, h, fontSize: 11.5, color: "D6DAE0", fontFace: FONT, margin: 0, valign: "top", lineSpacingMultiple: 1.3 });
    y += h + 0.12;
  });

  y += 0.15;
  const audience = [
    ["userGraduate", "Für Einsteiger", "Verstehe von der ersten Trainingseinheit an, was dein Trainer sagt."],
    ["mapMarked", "Für Thailand-Reisende", "Kommuniziere im Camp und im Alltag mit den richtigen Begriffen."],
    ["trophyCup", "Für Wettkämpfer", "Kenne Ritual, Ablauf und Kampfstile am Wettkampftag."],
  ];
  const colW = (CONTENT_W - 0.4) / 3;
  audience.forEach(([icon, title, desc], i) => {
    const cx = MARGIN + i * (colW + 0.2);
    iconBadge(slide, { x: cx, y, d: 0.34, iconName: icon });
    slide.addText(title, { x: cx, y: y + 0.42, w: colW, h: 0.24, fontSize: 10, bold: true, color: COLORS.white, fontFace: FONT, margin: 0 });
    slide.addText(desc, { x: cx, y: y + 0.68, w: colW, h: 0.7, fontSize: 8.2, color: COLORS.textOnDarkMuted, fontFace: FONT, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
  });
}

// ============================================================
// 2 — KAPITEL 1: Wie benutze ich diesen Guide?
// ============================================================
{
  const slide = pres.addSlide({ masterName: "LIGHT" });
  let y = chapterHeader(slide, "Kapitel 1 · Vorwort", "Wie benutze ich diesen Guide?");
  slide.addText("Jeder Eintrag im PATTO Lexikon folgt demselben klaren Format – damit du im Gym, beim Reisen oder beim Nachschlagen sofort findest, was du brauchst.",
    { x: MARGIN, y, w: CONTENT_W, h: 0.5, fontSize: 11, color: COLORS.textDark, fontFace: FONT, margin: 0, valign: "top" });
  y += 0.65;

  const legendItems = [
    ["users", "Deutsch", "Die deutsche Übersetzung des Begriffs – dein Ausgangspunkt."],
    ["commentDots", "Phonetik", "Die Lautschrift zum lauten Nachsprechen – so wie du es im Gym hörst."],
    ["book", "Thai-Schrift", "Das Original in Thai – zum Zeigen, Lesen und Wiedererkennen."],
    ["lightbulb", "Beschreibung", "Eine kurze, anschauliche Erklärung der Bedeutung oder Ausführung."],
  ];
  const cardW = (CONTENT_W - 3 * 0.18) / 4, cardH = 1.55;
  grid(4, 4, 0.18, cardW, cardH, MARGIN, y).forEach((p, i) => {
    legendCard(slide, { x: p.x, y: p.y, w: cardW, h: cardH, iconName: legendItems[i][0], title: legendItems[i][1], desc: legendItems[i][2] });
  });
  y += cardH + 0.35;

  slide.addText("Beispiel-Eintrag", { x: MARGIN, y, w: CONTENT_W, h: 0.3, fontSize: 14, bold: true, color: COLORS.textDark, fontFace: FONT, margin: 0 });
  y += 0.35;
  const beispiel = data.PERSONEN_TITEL.find(r => r[0] === "Lehrer / Trainer");
  const widths = [20, 18, 14, 48].map(pct => +(pct / 100 * CONTENT_W).toFixed(3));
  const headerRow = ["Deutsch", "Phonetik", "ภาษาไทย", "Beschreibung"].map(h => ({ text: h, options: { bold: true, color: COLORS.white, fill: { color: COLORS.primary }, fontSize: 10, fontFace: FONT } }));
  const dataRow = beispiel.map((val, ci) => {
    const opts = { fontSize: 9.5, fontFace: FONT, color: COLORS.textDark, fill: { color: COLORS.cardBg }, valign: "top" };
    if (ci === 0) opts.bold = true;
    if (ci === 1) { opts.italic = true; opts.color = COLORS.accentDeep; }
    if (ci === 2) opts.fontSize = 11;
    if (ci === 3) opts.color = COLORS.textMuted;
    return { text: val, options: opts };
  });
  slide.addTable([headerRow, dataRow], { x: MARGIN, y, colW: widths, border: { type: "solid", color: COLORS.border, pt: 0.75 }, margin: [0.06, 0.08, 0.06, 0.08] });
}

// ============================================================
// 3 — Gliederung / TOC
// ============================================================
{
  const slide = pres.addSlide({ masterName: "LIGHT" });
  let y = chapterHeader(slide, "Gliederung", "Der Guide im Überblick");
  slide.addText("Fünf Kapitel, ein System: von den Grundlagen bis zu den traditionellen Techniken des Muay Boran.",
    { x: MARGIN, y, w: CONTENT_W, h: 0.3, fontSize: 11, color: COLORS.textDark, fontFace: FONT, margin: 0 });
  y += 0.5;
  const items = [
    ["01", "compass", "Vorwort", "Ziel, Nutzung & Einstieg in die Sprache des Muay Thai"],
    ["02", "sortNumeric", "Grundlagen", "Zahlen, Körperteile, Adjektive, Personen und Titel"],
    ["03", "commentDots", "Phrasen, Training & Wettkampf", "Sätze, Training & Ausrüstung, Wettkampf, Kampfstile"],
    ["04", "highKick", "Techniken", "Generelle Techniken, Schlag, Kick, Knie, Ellbogen, Clinch, Block, Schritte"],
    ["05", "scroll", "Traditionelle Techniken", "Bonus: Mae Mai & Look Mai – das Erbe des Muay Boran"],
  ];
  items.forEach(([num, icon, title, sub]) => {
    const h = tocRow(slide, { x: MARGIN, y, w: CONTENT_W, num, iconName: icon, title, sub });
    y += h + 0.16;
  });
}

// ============================================================
// 4 — Kapitel 2 divider
// ============================================================
function dividerSlide({ num, tag, title, desc, items }) {
  const slide = pres.addSlide({ masterName: "DARK" });
  darkBgCircle(slide, { d: 4.5, x: PAGE_W - 2.2, y: -1.6, tint: true });
  let y = 3.4;
  slide.addText(num, { x: MARGIN, y, w: 3, h: 1.1, fontSize: 60, bold: true, color: COLORS.primaryLighter, fontFace: FONT, margin: 0 });
  y += 1.05;
  slide.addText(tag.toUpperCase(), { x: MARGIN, y, w: CONTENT_W, h: 0.24, fontSize: 10, bold: true, color: COLORS.accent, fontFace: FONT, charSpacing: 1.5, margin: 0 });
  y += 0.3;
  const titleH = title.length > 30 ? 0.9 : 0.5;
  slide.addText(title, { x: MARGIN, y, w: CONTENT_W, h: titleH, fontSize: 24, bold: true, color: COLORS.white, fontFace: FONT, margin: 0, valign: "top" });
  y += titleH + 0.06;
  const descH = paraBoxHeight(desc, 11, CONTENT_W - 0.6);
  slide.addText(desc, { x: MARGIN, y, w: CONTENT_W - 0.6, h: descH, fontSize: 11, color: "C7CEDA", fontFace: FONT, margin: 0, valign: "top", lineSpacingMultiple: 1.3 });
  y += descH + 0.3;
  items.forEach((it, i) => {
    slide.addShape(pres.ShapeType.line, { x: MARGIN, y, w: CONTENT_W - 0.6, h: 0, line: { color: COLORS.primaryLighter, width: 0.75 } });
    slide.addText(String(i + 1).padStart(2, "0"), { x: MARGIN, y: y + 0.06, w: 0.4, h: 0.26, fontSize: 9.5, bold: true, color: COLORS.accent, fontFace: FONT, margin: 0 });
    slide.addText(it, { x: MARGIN + 0.4, y: y + 0.06, w: CONTENT_W - 1.0, h: 0.26, fontSize: 10.5, color: "D6DAE0", fontFace: FONT, margin: 0 });
    y += 0.34;
  });
  return slide;
}

dividerSlide({
  num: "02", tag: "Kapitel 2", title: "Grundlagen",
  desc: "Das sprachliche Fundament – Zahlen, Körperteile, Adjektive sowie Personen und Titel, die dir in jedem Gym begegnen.",
  items: ["Zahlen", "Körperteile", "Adjektive", "Personen & Titel"],
});

// ============================================================
// Kapitel 2 content
// ============================================================
tableSection(pres, {
  tag: "02 · Grundlagen", title: "Zahlen",
  intro: "Bevor es in die Tiefe geht, sind die Grundlagen entscheidend. In diesem Kapitel findest du die wichtigsten Wörter und Begriffe, die dir in jedem Muay Thai Gym in Thailand begegnen können. Dazu gehören die Zahlen, die oft beim Zählen von Wiederholungen oder Runden verwendet werden, die Bezeichnungen der Körperteile, sowie typische Adjektive und Beschreibungen, um Techniken oder Bewegungen genauer zu erklären.",
  rows: data.ZAHLEN, noDesc: true, colWidths: [30, 30, 40],
});
insightSlide("tip", { iconName: "lightbulb", label: "Lerntipp:", text: "Zähle beim nächsten Seilspringen oder Sit-up-Satz laut auf Thai mit – Bewegung und Wort verknüpfen sich so am schnellsten." });

tableSection(pres, { tag: "02 · Grundlagen", title: "Körperteile", intro: "Vom Kopf bis zum Fuß – das Vokabular für Ziele, Waffen und Verletzungen im Muay Thai.", rows: data.KOERPERTEILE, noDesc: true, colWidths: [30, 30, 40] });
tableSection(pres, { tag: "02 · Grundlagen", title: "Adjektive und Beschreibungen", intro: "Kurze Wörter, die im Gym-Alltag ständig fallen – von Tempo über Kraft bis zum Muskelkater danach.", rows: data.ADJEKTIVE, colWidths: [22, 22, 16, 40] });
tableSection(pres, { tag: "02 · Grundlagen", title: "Personen und Titel", intro: "Wer ist wer im Camp und im Ring – von Trainingspartner bis Champion.", rows: data.PERSONEN_TITEL, colWidths: [24, 20, 16, 40] });
insightSlide("quote", {
  thai: "ช้าๆ ได้พร้าเล่มงาม",
  text: "„Langsam, langsam bekommst du ein schönes Messer.“ Gute Technik – und ein guter Wortschatz – entstehen durch Geduld, nicht durch Eile.",
  source: "Thailändisches Sprichwort",
});

// ============================================================
// Kapitel 3 divider + content
// ============================================================
dividerSlide({
  num: "03", tag: "Kapitel 3", title: "Phrasen, Training & Wettkampf",
  desc: "Die Sprache, die dich direkt durch den Trainingsalltag und den Wettkampf begleitet – von Sätzen fürs Gym bis zu Kampfstilen im Ring.",
  items: ["Sätze, Fragen & Aussagen", "Training & Ausrüstung", "Wettkampf: Ritual & Kultur", "Wettkampf", "Kampfstile"],
});

tableSection(pres, {
  tag: "03 · Allgemeine Phrasen", title: "Sätze, Fragen und Aussagen",
  intro: "Hier geht es um die Sprache, die dich direkt durch den Trainingsalltag und den Wettkampf begleitet. Du lernst wichtige Sätze, Fragen und Aussagen kennen, die dir im Gym oder Ring weiterhelfen.",
  rows: data.SAETZE, colWidths: [28, 24, 16, 32],
});
insightSlide("tip", { iconName: "comments", label: "Übungsidee:", text: "Suche dir 3 Sätze aus dieser Liste aus und benutze sie aktiv in deiner nächsten Trainingseinheit – laut, auch wenn die Aussprache noch nicht perfekt sitzt." });

tableSection(pres, { tag: "03 · Training", title: "Training und Ausrüstung", intro: "Vom Trainingslager über Zeiteinheiten bis zur kompletten Schutzausrüstung – das Vokabular, das jede Einheit im Camp begleitet.", rows: data.TRAINING_AUSRUESTUNG, colWidths: [26, 22, 18, 34] });

{
  const slide = pres.addSlide({ masterName: "LIGHT" });
  let y = chapterHeader(slide, "03 · Wettkampf", "Ritual & Kultur am Wettkampftag");
  slide.addText("Bevor die Fäuste fliegen, spricht die Tradition: Diese Rituale sind fester Bestandteil jedes Muay Thai Kampfes.",
    { x: MARGIN, y, w: CONTENT_W, h: 0.4, fontSize: 11, color: COLORS.textDark, fontFace: FONT, margin: 0 });
  y += 0.55;
  const cardW = (CONTENT_W - 0.18) / 2, cardH = 1.7;
  grid(4, 2, 0.18, cardW, cardH, MARGIN, y).forEach((p, i) => {
    const r = data.WETTKAMPF_RITUAL[i];
    darkCard(slide, { x: p.x, y: p.y, w: cardW, h: cardH, iconName: r.icon, title: r.de, sub: `${r.phon}   ${r.thai}`, desc: r.desc });
  });
}

tableSection(pres, { tag: "03 · Wettkampf", title: "Wettkampf", intro: "Der Wortschatz rund um Austragungsort, Kampfverlauf, Status und Runden eines Fights.", rows: data.WETTKAMPF, colWidths: [26, 22, 18, 34] });

{
  const slide = pres.addSlide({ masterName: "LIGHT" });
  let y = chapterHeader(slide, "03 · Wettkampf", "Kampfstile");
  slide.addText("Jeder Kämpfer entwickelt seinen eigenen Stil. Diese sechs Archetypen begegnen dir in jedem Muay Thai Stadion.",
    { x: MARGIN, y, w: CONTENT_W, h: 0.4, fontSize: 11, color: COLORS.textDark, fontFace: FONT, margin: 0 });
  y += 0.55;
  const cardW = (CONTENT_W - 2 * 0.18) / 3, cardH = 2.05;
  grid(6, 3, 0.18, cardW, cardH, MARGIN, y).forEach((p, i) => {
    const k = data.KAMPFSTILE[i];
    darkCard(slide, { x: p.x, y: p.y, w: cardW, h: cardH, iconName: k.icon, title: k.de, sub: `${k.phon}  ${k.thai}`, desc: k.desc });
  });
}

// ============================================================
// Kapitel 4 divider + content
// ============================================================
dividerSlide({
  num: "04", tag: "Kapitel 4", title: "Techniken",
  desc: "Hände, Ellbogen, Knie und Schienbeine – die Waffen, die die „Kunst der acht Gliedmaßen“ einzigartig machen.",
  items: ["Generelle Techniken", "Schlag", "Kick", "Knie", "Ellbogen", "Clinch", "Block", "Schritte"],
});

{
  const slide = pres.addSlide({ masterName: "LIGHT" });
  let y = chapterHeader(slide, "04 · Techniken", "Techniken im Überblick");
  slide.addText("Muay Thai wird nicht umsonst die „Kunst der acht Gliedmaßen“ genannt. Dieses Kapitel gibt dir einen Überblick über das technische Fundament des Muay Thai.",
    { x: MARGIN, y, w: CONTENT_W, h: 0.5, fontSize: 11, color: COLORS.textDark, fontFace: FONT, margin: 0, valign: "top" });
  y += 0.65;
  const KATEGORIEN = [
    ["handGrip", "Generelle", `${data.TECH_GENERELL.length} Aktionen`],
    ["punch", "Schlag", `${data.TECH_SCHLAG.length} Techniken`],
    ["bootKick", "Kick", `${data.TECH_KICK.length} Techniken`],
    ["kneeCap", "Knie", `${data.TECH_KNIE.length} Techniken`],
    ["elbowPad", "Ellbogen", `${data.TECH_ELLBOGEN.length} Techniken`],
    ["handshake", "Clinch", `${data.TECH_CLINCH.length} Techniken`],
    ["shieldBash", "Block", `${data.TECH_BLOCK.length} Techniken`],
    ["footsteps", "Schritte", `${data.TECH_SCHRITTE.length} Techniken`],
  ];
  const cardW = (CONTENT_W - 3 * 0.15) / 4, cardH = 1.35;
  grid(8, 4, 0.15, cardW, cardH, MARGIN, y).forEach((p, i) => {
    catCard(slide, { x: p.x, y: p.y, w: cardW, h: cardH, iconName: KATEGORIEN[i][0], title: KATEGORIEN[i][1], meta: KATEGORIEN[i][2] });
  });
}

tableSection(pres, { tag: "04 · Techniken", title: "Generelle Techniken und Aktionen", intro: "Grundlegende Bewegungen und Aktionen, die in nahezu jeder Trainingsanweisung auftauchen.", rows: data.TECH_GENERELL, colWidths: [30, 18, 14, 38] });
tableSection(pres, { tag: "04 · Techniken", title: "Schlagtechniken", intro: "Handtechniken – die schnellste Waffe, meist zur Vorbereitung von Kicks und Knien genutzt.", rows: data.TECH_SCHLAG, colWidths: [30, 18, 14, 38] });
insightSlide("tip", { iconName: "stopwatch", label: "Übungsidee:", text: "Wähle 3 Schlagtechniken aus und übe sie einzeln vor dem Spiegel oder am Sandsack, bevor du sie in eine Kombination packst." });
tableSection(pres, { tag: "04 · Techniken", title: "Kicktechniken", intro: "Bein- und Tritttechniken – Reichweite und Kraft, das Markenzeichen des Muay Thai.", rows: data.TECH_KICK, colWidths: [30, 18, 14, 38] });
tableSection(pres, { tag: "04 · Techniken", title: "Knietechniken", intro: "Nahkampfwaffen, die vor allem im Clinch zum Einsatz kommen.", rows: data.TECH_KNIE, colWidths: [30, 18, 14, 38] });
tableSection(pres, { tag: "04 · Techniken", title: "Ellenbogentechniken", intro: "Die schärfste Waffe im Muay Thai – kurze Distanz, hohe Verletzungsgefahr.", rows: data.TECH_ELLBOGEN, colWidths: [30, 18, 14, 38] });
tableSection(pres, { tag: "04 · Techniken", title: "Clinchtechniken", intro: "Der Ringkampf im Stehen – Kontrolle über Kopf, Nacken und Arme des Gegners.", rows: data.TECH_CLINCH, colWidths: [30, 18, 14, 38] });
tableSection(pres, { tag: "04 · Techniken", title: "Blocktechniken", intro: "Verteidigungstechniken, um Tritte abzuwehren oder zu neutralisieren.", rows: data.TECH_BLOCK, colWidths: [30, 18, 14, 38] });
tableSection(pres, { tag: "04 · Techniken", title: "Schritt-Techniken", intro: "Fußarbeit als Grundlage für Distanzkontrolle, Angriff und Verteidigung.", rows: data.TECH_SCHRITTE, colWidths: [30, 18, 14, 38] });

// ============================================================
// Kapitel 5 divider + content
// ============================================================
dividerSlide({
  num: "05", tag: "Kapitel 5 · Bonus", title: "Traditionelle Techniken",
  desc: "Ein Blick in das Erbe des Muay Boran: die klassischen Mae Mai und die fortgeschrittenen Look Mai.",
  items: ["Mae Mai – Grundtechniken", "Look Mai – Fortgeschrittene Techniken"],
});

{
  const slide = pres.addSlide({ masterName: "LIGHT" });
  let y = chapterHeader(slide, "05 · Traditionelle Techniken", "Das Erbe des Muay Boran");
  const paras = [
    "Neben den modernen Trainingsmethoden und Standardtechniken bewahrt das Muay Thai auch eine tiefe Tradition. Unter Mae Mai versteht man die grundlegenden klassischen Techniken, die als Fundament dienen. Look Mai hingegen sind die fortgeschrittenen, oft komplexeren Bewegungen, die ein erfahrener Kämpfer beherrschen sollte.",
    "Diese traditionellen Bewegungen stammen aus dem Muay Boran (มวยโบราณ) – der ursprünglichen Form des thailändischen Boxens, die lange vor dem modernen Muay Thai existierte und den siamesischen Kriegern zur Selbstverteidigung auf dem Schlachtfeld diente. Jede Region Thailands hatte dabei ihren eigenen Stil – etwa Muay Chaiya, Muay Korat, Muay Lopburi oder Muay Tha Sao.",
    "Aus dieser alten Kampfkunst entwickelte sich schließlich das sportlich regulierte Muay Thai, das heute weltweit praktiziert wird. Dennoch bleiben die Techniken des Muay Boran ein wichtiger Teil der thailändischen Kultur – als Symbol für Disziplin, Respekt und den unerschütterlichen Geist des Kämpfers.",
  ];
  paras.forEach(p => {
    const h = paraBoxHeight(p, 11, CONTENT_W);
    slide.addText(p, { x: MARGIN, y, w: CONTENT_W, h, fontSize: 11, color: COLORS.textDark, fontFace: FONT, margin: 0, valign: "top", lineSpacingMultiple: 1.3 });
    y += h + 0.14;
  });
}

function techCardSlide(tag, title, intro, items) {
  let slide = pres.addSlide({ masterName: "LIGHT" });
  let y = chapterHeader(slide, tag, title);
  if (intro) {
    slide.addText(intro, { x: MARGIN, y, w: CONTENT_W, h: 0.4, fontSize: 11, color: COLORS.textDark, fontFace: FONT, margin: 0 });
    y += 0.55;
  }
  let i = 0;
  while (i < items.length) {
    const e = items[i];
    // Card height = header block (title + phon/thai, 0.58in) + estimated desc
    // height + bottom padding (0.12in). Keep the desc textbox's own height at
    // least as large as the estimate it was sized from, or text can spill
    // past the card into whatever follows.
    const descH = paraBoxHeight(e.desc, 9.5, CONTENT_W - 1.3);
    const h = 0.58 + descH + 0.12;
    if (y + h > PAGE_H - MARGIN - 0.4) {
      slide = pres.addSlide({ masterName: "LIGHT" });
      y = MARGIN;
    }
    slide.addShape(pres.ShapeType.roundRect, { x: MARGIN, y, w: CONTENT_W, h, rectRadius: 0.04, fill: { color: COLORS.primary }, line: { type: "none" } });
    const d = 0.4;
    slide.addShape(pres.ShapeType.ellipse, { x: MARGIN + 0.14, y: y + 0.13, w: d, h: d, fill: { color: COLORS.accent }, line: { type: "none" } });
    slide.addText(String(i + 1), { x: MARGIN + 0.14, y: y + 0.13, w: d, h: d, fontSize: 11, bold: true, color: COLORS.primary, align: "center", valign: "middle", fontFace: FONT, margin: 0 });
    slide.addText(e.de, { x: MARGIN + 0.68, y: y + 0.12, w: CONTENT_W - 0.85, h: 0.24, fontSize: 10.5, bold: true, color: COLORS.white, fontFace: FONT, margin: 0 });
    slide.addText(`${e.phon}   ${e.thai}`, { x: MARGIN + 0.68, y: y + 0.36, w: CONTENT_W - 0.85, h: 0.2, fontSize: 8.5, italic: true, color: COLORS.accent, fontFace: FONT, margin: 0 });
    slide.addText(e.desc, { x: MARGIN + 0.68, y: y + 0.58, w: CONTENT_W - 0.85, h: descH, fontSize: 8.7, color: "D6DAE0", fontFace: FONT, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
    y += h + 0.14;
    i++;
  }
  return y;
}

techCardSlide("05 · Mae Mai", "Mae Mai – Grundtechniken", "Die klassischen Grundtechniken – Fundament fast jedes Muay Thai Kampfes.", data.MAE_MAI);
let lastY = techCardSlide("05 · Look Mai", "Look Mai – Fortgeschrittene Techniken", "Komplexe, raffinierte Bewegungen eines erfahrenen Kämpfers.", data.LOOK_MAI);

insightSlide("quote", {
  thai: "เดินตามผู้ใหญ่ หมาไม่กัด",
  text: "„Wer den Älteren folgt, den beißt kein Hund.“ So wie die Mae Mai und Look Mai von Generation zu Generation weitergegeben wurden, lohnt es sich, von erfahrenen Trainern zu lernen.",
  source: "Thailändisches Sprichwort",
});

// ============================================================
// Closing
// ============================================================
{
  const slide = pres.addSlide({ masterName: "DARK" });
  darkBgCircle(slide, { d: 4.2, x: -1.8, y: PAGE_H - 2.8, tint: true });
  const logoW = 2.6, logoH = logoW / LOGO_RATIO;
  slide.addImage({ path: LOGO, x: (PAGE_W - logoW) / 2, y: 4.6, w: logoW, h: logoH });
  const text = "Das PATTO Lexikon begleitet dich vom ersten Aufwärmen bis in den Ring. Nimm es mit ins Gym, auf Reisen und zum nächsten Fight – und lerne die Sprache des Muay Thai so, wie sie dort gesprochen wird, wo sie zu Hause ist.";
  slide.addText(text, { x: 1.2, y: 4.6 + logoH + 0.25, w: PAGE_W - 2.4, h: 1.2, fontSize: 11, color: "C7CEDA", align: "center", fontFace: FONT, margin: 0, valign: "top", lineSpacingMultiple: 1.3 });
  slide.addText("Chok Dii!", { x: 0, y: 4.6 + logoH + 1.55, w: PAGE_W, h: 0.35, fontSize: 14, bold: true, color: COLORS.accent, align: "center", fontFace: FONT, margin: 0 });
}

pres.writeFile({ fileName: __dirname + "/PATTO_Muay_Thai_Lexikon_EDITIERBAR.pptx" }).then(fileName => {
  console.log("written:", fileName);
});
