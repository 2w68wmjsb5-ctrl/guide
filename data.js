// ===== PATTO Muay Thai Lexikon — Vokabeldaten =====
// Format lexTable rows: [Deutsch, Phonetik, Thai-Schrift, Beschreibung]
// Format Karten-Objekte: { icon, de, phon, thai, desc }

// ---------- Kapitel 2 · Grundlagen ----------

const ZAHLEN = [
  ["Null", "Sun", "ศูนย์", "Beim Punktestand oder für 'keine Wiederholungen mehr'."],
  ["Eins", "Neung", "หนึ่ง", "Die Basiszahl – auch in 'Sip Et' (elf) enthalten."],
  ["Zwei", "Song", "สอง", "Wird z. B. für die zweite Runde verwendet: 'Yok Song'."],
  ["Drei", "Sam", "สาม", "Kommt auch in 'Yang Sam Khum' (dreifache Fußarbeit) vor."],
  ["Vier", "Sii", "สี่", "Zum Zählen von Wiederholungen oder Kombinationen."],
  ["Fünf", "Haa", "ห้า", "Häufig bei Serien: 'Haa Mat' – fünf Schläge."],
  ["Sechs", "Hok", "หก", "Zum Zählen von Sätzen im Training."],
  ["Sieben", "Jet", "เจ็ด", "Weniger gebräuchlich im Gym, aber gutes Zahlwort zum Üben."],
  ["Acht", "Paet", "แปด", "Zum Zählen von Wiederholungen bei Kombinationen."],
  ["Neun", "Kao", "เก้า", "Direkt vor 'Sip' (zehn) – gutes Übungspaar."],
  ["Zehn", "Sip", "สิบ", "Klassische Zahl für Wiederholungssätze am Sandsack."],
  ["Zwanzig", "Yii-sip", "ยี่สิบ", "Für längere Serien oder Altersangaben nützlich."],
  ["Hundert", "Roi", "ร้อย", "Zum Beispiel für 'hundert Tritte' im Konditionstraining."],
];

const KOERPERTEILE = [
  ["Kopf", "Hua", "หัว", "Kopfstöße sind im modernen Muay Thai verboten, das Wort begegnet dir trotzdem oft."],
  ["Gesicht", "Naa", "หน้า", "Wird auch für 'vorne' / 'Richtung' verwendet."],
  ["Hand", "Mue", "มือ", "Steckt auch in 'Nak Muay' verwandten Begriffen wie 'Khu Mue' (Trainingspartner, wörtlich 'Handpaar')."],
  ["Faust", "Gam Pun", "กำปั้น", "Die geschlossene Hand beim geraden Schlag oder Haken."],
  ["Arm", "Khaen", "แขน", "Wichtig für Begriffe rund um Armkontrolle im Clinch."],
  ["Ellbogen", "Sok", "ศอก", "Zugleich Körperteil und eine der wichtigsten Waffen im Muay Thai."],
  ["Schulter", "Lai", "ไหล่", "Wird beim Blocken und in der Deckung eingesetzt."],
  ["Brust", "Ok", "อก", "Zielzone für gerade Schläge und Tritte."],
  ["Bauch", "Thong", "ท้อง", "Häufiges Ziel für Konditionsschläge im Sparring."],
  ["Rücken", "Lang", "หลัง", "Wird z. B. für 'Rückwärtsschritt' in zusammengesetzten Begriffen verwendet."],
  ["Bein", "Kha", "ขา", "Grundlage aller Tritt- und Knietechniken."],
  ["Knie", "Khao", "เข่า", "Sowohl Körperteil als auch zentrale Muay-Thai-Waffe."],
  ["Fuß", "Tao", "เท้า", "Kommt in 'Muay Thai' selbst indirekt über Fußtechniken vor."],
  ["Kinn", "Kang", "คาง", "Klassisches Ziel beim Aufwärtshaken."],
];

const ADJEKTIVE = [
  ["schnell", "Reo", "เร็ว", "Für Tempo bei Kombinationen und Fußarbeit."],
  ["langsam", "Chaa", "ช้า", "Oft als Anweisung: 'Chaa Chaa Noi' – etwas langsamer bitte."],
  ["stark", "Khaeng Raeng", "แข็งแรง", "Für Kraft und körperliche Verfassung."],
  ["schwach", "Awn Ae", "อ่อนแอ", "Gegenteil von 'Khaeng Raeng'."],
  ["groß", "Yai", "ใหญ่", "Für Größe von Personen oder Ausrüstung."],
  ["klein", "Lek", "เล็ก", "Gegenteil von 'Yai'."],
  ["gut", "Dii", "ดี", "Eines der meistgenutzten Wörter im Gym-Alltag."],
  ["schlecht", "Mai Dii", "ไม่ดี", "Verneinung von 'Dii' mit 'Mai'."],
  ["müde", "Nuey", "เหนื่อย", "Wird nach intensiven Runden oft gerufen."],
  ["verletzt / schmerzhaft", "Jep", "เจ็บ", "Zentrales Wort, um Schmerzen zu kommunizieren."],
  ["bereit", "Phrom", "พร้อม", "Antwort auf die Frage, ob man startklar ist."],
  ["schwierig", "Yaak", "ยาก", "Für anspruchsvolle Techniken oder Übungen."],
  ["einfach", "Ngaai", "ง่าย", "Gegenteil von 'Yaak'."],
];

const PERSONEN_TITEL = [
  ["Lehrer / Trainer", "Khru", "ครู", "Wird traditionell mit großem Respekt angesprochen."],
  ["Cheftrainer", "Khru Yai", "ครูใหญ่", "Der ranghöchste Trainer eines Camps."],
  ["Kämpfer", "Nak Muay", "นักมวย", "Allgemeine Bezeichnung für einen Muay-Thai-Kämpfer."],
  ["Ausländischer Kämpfer", "Nak Muay Farang", "นักมวยฝรั่ง", "Bezeichnung für nicht-thailändische Kämpfer."],
  ["Schiedsrichter", "Kammakan", "กรรมการ", "Leitet und bewertet den Kampf im Ring."],
  ["Trainingspartner", "Khu Sorm", "คู่ซ้อม", "Wörtlich 'Übungspaar' – dein Partner beim Sparring."],
  ["Camp-Besitzer", "Jao Khaai", "เจ้าค่าย", "Leitet und besitzt das Trainingscamp."],
  ["Champion", "Champ", "แชมป์", "Lehnwort aus dem Englischen, weit verbreitet im Thai."],
  ["Anfänger", "Mue Mai", "มือใหม่", "Wörtlich 'neue Hand' – jemand, der gerade beginnt."],
  ["Ausländer", "Farang", "ฝรั่ง", "Umgangssprachliche, neutrale Bezeichnung für Westler."],
];

// ---------- Kapitel 3 · Phrasen, Training & Wettkampf ----------

const SAETZE = [
  ["Hallo", "Sawatdee", "สวัสดี", "Universelle Begrüßung zu jeder Tageszeit."],
  ["Danke", "Khop Khun", "ขอบคุณ", "Höfliche Grundform, im Gym auch kurz als Geste genutzt."],
  ["Kein Problem", "Mai Pen Rai", "ไม่เป็นไร", "Die typisch thailändische Antwort auf fast alles."],
  ["Wie geht's?", "Sabai Dii Mai", "สบายดีไหม", "Beiläufige Frage nach dem Befinden."],
  ["Mir geht's gut", "Sabai Dii", "สบายดี", "Die Standardantwort auf 'Sabai Dii Mai'."],
  ["Viel Glück", "Chok Dii", "โชคดี", "Wird Kämpfern vor dem Fight zugerufen."],
  ["Entschuldigung", "Khor Thot", "ขอโทษ", "Für Missgeschicke im Training oder im Alltag."],
  ["Verstanden", "Khao Jai Laew", "เข้าใจแล้ว", "Bestätigung, dass eine Erklärung angekommen ist."],
  ["Noch einmal", "Iik Khrang", "อีกครั้ง", "Bitte um Wiederholung einer Übung oder Ansage."],
  ["Langsamer, bitte", "Chaa Chaa Noi", "ช้าๆหน่อย", "Höfliche Bitte um ein geringeres Tempo."],
  ["Gut gemacht", "Geng Maak", "เก่งมาก", "Lob, das Trainer nach guter Ausführung häufig geben."],
  ["Ich bin bereit", "Phrom Laew", "พร้อมแล้ว", "Signal an Trainer oder Partner zum Start."],
];

const TRAINING_EINHEITEN = [
  ["Aufwärmen", "Wom Ap", "วอร์มอัพ", "Lehnwort aus dem Englischen, fester Bestandteil jeder Einheit."],
  ["Runde", "Yok", "ยก", "Zeiteinheit im Training und im Kampf, z. B. 'Yok Neung' – erste Runde."],
  ["Pause", "Phak", "พัก", "Erholungszeit zwischen zwei Runden."],
  ["Sparring", "Sa-Pa-Ring", "สปาร์ริ่ง", "Lehnwort für kontrolliertes Übungskämpfen."],
  ["Cool Down", "Khuun Daaun", "คูลดาวน์", "Lockeres Auslaufen und Dehnen zum Abschluss."],
  ["Pratzentraining", "Tii Pad", "ตีแพด", "Technikarbeit an den Handpratzen des Trainers."],
  ["Zeit", "Wela", "เวลา", "Allgemeines Wort für Zeit, z. B. bei Zeitansagen."],
  ["Stunde", "Chua Mong", "ชั่วโมง", "Für die Länge einer Trainingseinheit."],
  ["Minute", "Naathii", "นาที", "Kleinere Zeiteinheit, z. B. für Rundenlänge."],
];

const TRAINING_UEBUNGEN = [
  ["Liegestütze", "Wid Phuen", "วิดพื้น", "Klassische Kraftübung zum Aufbau der Oberkörperkraft."],
  ["Sit-ups", "Sit Ap", "ซิทอัพ", "Lehnwort für die Bauchmuskelübung."],
  ["Seilspringen", "Kra Dot Cheuak", "กระโดดเชือก", "Fester Bestandteil des Cardio-Trainings vieler Camps."],
  ["Laufen", "Wing", "วิ่ง", "Ausdauertraining, oft am frühen Morgen."],
  ["Schattenboxen", "Muay Lom", "มวยลม", "Wörtlich 'Windboxen' – Technikarbeit ohne Partner."],
  ["Dehnen", "Yeut Sen", "ยืดเส้น", "Beweglichkeitstraining vor und nach der Einheit."],
  ["Krafttraining", "Yok Namnak", "ยกน้ำหนัก", "Wörtlich 'Gewicht heben'."],
  ["Sandsacktraining", "Tii Kra Sorb", "ตีกระสอบ", "Kraft- und Techniktraining am Sandsack."],
];

const AUSRUESTUNG = [
  ["Boxhandschuhe", "Nuam", "นวม", "Grundausstattung für Sparring und Pratzentraining."],
  ["Bandagen", "Pha Phan Mue", "ผ้าพันมือ", "Schützen Hand- und Fingergelenke unter den Handschuhen."],
  ["Mundschutz", "Fan Yang", "ฟันยาง", "Wörtlich 'Gummizähne' – Pflicht bei jedem Sparring."],
  ["Tiefschutz", "Kra Jab", "กระจับ", "Schutzausrüstung für den Unterleib."],
  ["Schienbeinschützer", "Sanop Khaa", "สนับแข้ง", "Wichtig für hartes Tritttraining und Sparring."],
  ["Kopfschutz", "Hed Kaad", "เฮดการ์ด", "Lehnwort, verwendet vor allem im Amateur-Sparring."],
  ["Sandsack", "Kra Sorb", "กระสอบ", "Zentrales Trainingsgerät für Kraft und Technik."],
  ["Thai-Pads", "Thai Pad", "ไทยแพด", "Große Polster für Kick-, Knie- und Ellbogentraining."],
  ["Mongkol", "Monkhon", "มงคล", "Heiliges Kopfband, das vor dem Kampf getragen wird."],
  ["Pra Jiad", "Pra-Jiad", "ประเจียด", "Armbänder mit schützender, ritueller Bedeutung."],
];

const WETTKAMPF_RITUAL = [
  {
    icon: "templeGate",
    de: "Wai Khru Ram Muay",
    phon: "Wai Khruu Ram Muay",
    thai: "ไหว้ครูรำมวย",
    desc: "Der zeremonielle Tanz vor dem Kampf, mit dem der Kämpfer seinem Lehrer und Camp Respekt erweist.",
  },
  {
    icon: "crown",
    de: "Mongkol",
    phon: "Monkhon",
    thai: "มงคล",
    desc: "Das heilige Kopfband, das der Trainer dem Kämpfer kurz vor dem Gong abnimmt – Symbol für Schutz und Segen.",
  },
  {
    icon: "tiedScroll",
    de: "Pra Jiad",
    phon: "Pra-Jiad",
    thai: "ประเจียด",
    desc: "Armbänder, die während des Kampfes getragen werden und Schutz bringen sollen.",
  },
  {
    icon: "whistle",
    de: "Sarama-Musik",
    phon: "Wong Pi Klong",
    thai: "วงปี่กลอง",
    desc: "Die traditionelle Live-Musik aus Java-Flöte und Trommeln, die Tempo und Stimmung des Kampfes begleitet.",
  },
];

const WETTKAMPF_ABLAUF = [
  ["Ring", "Weti", "เวที", "Der quadratische Kampfplatz, meist erhöht aufgebaut."],
  ["Ecke", "Mum", "มุม", "Der Rückzugsort des Kämpfers zwischen den Runden."],
  ["Gong", "Kong", "ฆ้อง", "Signalisiert Start und Ende jeder Runde."],
  ["K.O.", "Nok", "น็อก", "Lehnwort für den Sieg durch Knockout."],
  ["Punktsieg", "Chana Khanaen", "ชนะคะแนน", "Sieg nach Punkten der Kampfrichter."],
  ["Unentschieden", "Samoe", "เสมอ", "Kein Sieger nach Ablauf aller Runden."],
  ["Aufgabe", "Yorm Phae", "ยอมแพ้", "Ein Kämpfer gibt den Kampf vorzeitig auf."],
  ["Kampfabbruch (Arzt)", "Mor Yut", "หมอหยุด", "Der Ringarzt beendet den Kampf aus medizinischen Gründen."],
];

const WETTKAMPF_STATUS = [
  ["Amateur", "Samak Len", "สมัครเล่น", "Kämpfer ohne Profi-Lizenz."],
  ["Profi", "Achiip", "อาชีพ", "Lizenzierter, hauptberuflicher Kämpfer."],
  ["Champion", "Champ", "แชมป์", "Titelträger einer Gewichtsklasse oder Organisation."],
  ["Herausforderer", "Phu Thaa Thaai", "ผู้ท้าชิง", "Kämpfer, der um einen Titel antritt."],
];

const WETTKAMPF_RUNDEN = [
  ["1. Runde", "Yok Neung", "ยกหนึ่ง", "Die Eröffnungsrunde, oft zum Abtasten genutzt."],
  ["2. Runde", "Yok Song", "ยกสอง", "Meist die Runde, in der das Tempo steigt."],
  ["3. Runde", "Yok Saam", "ยกสาม", "Häufig die entscheidende Runde eines Kampfes."],
  ["Letzte Runde", "Yok Sud Thai", "ยกสุดท้าย", "Wörtlich 'allerletzte Runde' – unabhängig von der Rundenzahl."],
];

const KAMPFSTILE = [
  {
    icon: "highPunch",
    de: "Muay Mat",
    phon: "Muay Maat",
    thai: "มวยหมัด",
    desc: "Der Puncher – setzt auf harte, druckvolle Handserien und sucht die frühe Entscheidung.",
  },
  {
    icon: "bootKick",
    de: "Muay Tae",
    phon: "Muay Dteh",
    thai: "มวยเตะ",
    desc: "Der Kicker – dominiert mit langen, kraftvollen Beintechniken und hält Distanz.",
  },
  {
    icon: "handGrip",
    de: "Muay Khao",
    phon: "Muay Khao",
    thai: "มวยเข่า",
    desc: "Der Clinch-Spezialist – zieht den Gegner in den Nahkampf und arbeitet mit Knien.",
  },
  {
    icon: "wingfoot",
    de: "Muay Femur",
    phon: "Muay Feu-muu",
    thai: "มวยฝีมือ",
    desc: "Der Techniker – überzeugt durch Eleganz, Timing und präzise Ausführung statt roher Kraft.",
  },
  {
    icon: "shieldBash",
    de: "Muay Bandan",
    phon: "Muay Ban-dan",
    thai: "มวยบันได",
    desc: "Der Konterkämpfer – wartet ab, blockt und antwortet blitzschnell auf Angriffe des Gegners.",
  },
  {
    icon: "crossedSwords",
    de: "Muay Kae",
    phon: "Muay Gae",
    thai: "มวยแก้",
    desc: "Der Anpasser – liest den Gegner und wechselt Stil und Taktik während des Kampfes.",
  },
];

// ---------- Kapitel 4 · Techniken ----------

const TECHNIK_KATEGORIEN = [
  { icon: "punch", title: "Schlag", meta: "Mat · หมัด" },
  { icon: "bootKick", title: "Kick", meta: "Dteh · เตะ" },
  { icon: "kneeCap", title: "Knie", meta: "Khao · เข่า" },
  { icon: "elbowPad", title: "Ellbogen", meta: "Sok · ศอก" },
  { icon: "handGrip", title: "Clinch", meta: "Plam · ปล้ำ" },
  { icon: "shieldBash", title: "Block", meta: "Pong Kan · ป้องกัน" },
  { icon: "footsteps", title: "Schritte", meta: "Yang · ย่าง" },
];

const TECH_SCHLAG = [
  ["Schlagen (allgemein)", "Chok", "ชก", "Das allgemeine Verb für boxen bzw. schlagen."],
  ["Gerader Schlag", "Mat Trong", "หมัดตรง", "Der direkte Schlag – Basis jeder Handkombination."],
  ["Haken", "Mat Wiang", "หมัดเหวี่ยง", "Seitlicher Schlag in gebogener Bahn."],
  ["Aufwärtshaken", "Mat Suey", "หมัดเสย", "Schlag von unten nach oben, oft zum Kinn."],
];

const TECH_KICK = [
  ["Tritt (allgemein)", "Dteh", "เตะ", "Das allgemeine Verb für treten."],
  ["Vorwärtstritt / Pushkick", "Teep", "ถีบ", "Gerader Stoßtritt zum Abstandhalten und Kontern."],
  ["Hoher Tritt", "Dteh Sung", "เตะสูง", "Tritt in Richtung Kopf oder Oberkörper."],
  ["Tiefer Tritt", "Dteh Tam", "เตะต่ำ", "Tritt auf Ober- oder Unterschenkel des Gegners."],
];

const TECH_KNIE = [
  ["Knie (allgemein)", "Khao", "เข่า", "Das allgemeine Wort für Knie bzw. Knietechnik."],
  ["Gerades Knie", "Khao Trong", "เข่าตรง", "Direkter Knieschlag, meist im Clinch eingesetzt."],
  ["Seitliches Knie", "Khao Chiang", "เข่าเฉียง", "Knieschlag in angewinkelter, diagonaler Bahn."],
];

const TECH_ELLBOGEN = [
  ["Ellbogen (allgemein)", "Sok", "ศอก", "Das allgemeine Wort für Ellbogen bzw. Ellbogentechnik."],
  ["Waagerechter Ellbogen", "Sok Tad", "ศอกตัด", "Horizontaler, schneidender Ellbogenschlag."],
  ["Ellbogen von oben", "Sok Sap", "ศอกสับ", "Hackender Ellbogenschlag von oben nach unten."],
];

const TECH_CLINCH = [
  ["Clinch (allgemein)", "Plam", "ปล้ำ", "Der Nahkampf, in dem Knie- und Wurftechniken dominieren."],
  ["Nacken-Clinch", "Jap Kho", "จับคอ", "Wörtlich 'den Hals greifen' – Kontrolle über Kopf und Nacken."],
  ["Armkontrolle", "Jap Khaen", "จับแขน", "Kontrolle der Arme des Gegners im Nahkampf."],
];

const TECH_BLOCK = [
  ["Blocken (allgemein)", "Pong Kan", "ป้องกัน", "Das allgemeine Wort für Verteidigung bzw. Blocken."],
  ["Tritt abfangen", "Rap Dteh", "รับเตะ", "Einen Tritt mit Schienbein oder Armen abfangen."],
  ["Schlag parieren", "Bat Mat", "ปัดหมัด", "Einen Schlag mit der Hand zur Seite ablenken."],
  ["Ausweichen", "Liik", "หลีก", "Eine Attacke durch Bewegung des Körpers vermeiden."],
];

const TECH_SCHRITTE = [
  ["Fußarbeit (allgemein)", "Yang", "ย่าง", "Das allgemeine Wort für die Schrittarbeit im Ring."],
  ["Vorwärts gehen", "Kao Pai", "เข้าไป", "Den Abstand zum Gegner verkürzen."],
  ["Zurückweichen", "Thoi", "ถอย", "Den Abstand zum Gegner vergrößern."],
];

// ---------- Kapitel 5 · Traditionelle Techniken (Muay Boran) ----------

const MAE_MAI = [
  {
    de: "Sadayut",
    phon: "Sadayut",
    thai: "ท่าเตรียมตัว",
    desc: "Die respektvolle Grundhaltung, aus der jede Mae-Mai-Technik beginnt – Fundament von Balance und Fokus.",
  },
  {
    de: "Chorakhe Fad Hang",
    phon: "Chorakhe Fad Haang",
    thai: "หางจระเข้ฟาด",
    desc: "'Der Krokodilschwanz schlägt' – ein rotierender Rückwärtstritt, der einen Angriff im letzten Moment kontert.",
  },
  {
    de: "Hak Kor Erawan",
    phon: "Hak Kor Erawan",
    thai: "ศอกสับหักคอ",
    desc: "'Erawans Genick brechen' – ein wuchtiger Ellbogenschlag von oben, benannt nach dem dreiköpfigen Elefanten der Mythologie.",
  },
  {
    de: "Kwang Liaw Lang",
    phon: "Kwang Liaw Lang",
    thai: "เหลียวหลังอย่างกวาง",
    desc: "'Der Rückblick des Hirsches' – eine ausweichende Drehbewegung mit anschließendem Ellbogenkonter.",
  },
];

const LOOK_MAI = [
  {
    de: "Fliegendes Knie",
    phon: "Khao Loi",
    thai: "เข่าลอย",
    desc: "Ein Sprungknie aus der Distanz – eine fortgeschrittene Variante der klassischen Knietechnik, oft als Finishing-Move eingesetzt.",
  },
  {
    de: "Springender Ellbogen",
    phon: "Sok Loi",
    thai: "ศอกลอย",
    desc: "Ein Ellbogenschlag im Sprung – hohe Präzision und Timing nötig, gilt als eine der spektakulärsten Techniken.",
  },
  {
    de: "Doppelter Rundkick",
    phon: "Dteh Song Chan",
    thai: "เตะสองชั้น",
    desc: "Zwei aufeinanderfolgende Tritte in schneller Folge, um die Deckung des Gegners zu durchbrechen.",
  },
  {
    de: "Drehschlag mit dem Ellbogen",
    phon: "Sok Klap",
    thai: "ศอกกลับ",
    desc: "Ein rückwärtiger Ellbogenschlag aus der Drehung heraus – eine raffinierte Überraschungstechnik im Nahkampf.",
  },
];

module.exports = {
  ZAHLEN, KOERPERTEILE, ADJEKTIVE, PERSONEN_TITEL,
  SAETZE, TRAINING_EINHEITEN, TRAINING_UEBUNGEN, AUSRUESTUNG,
  WETTKAMPF_RITUAL, WETTKAMPF_ABLAUF, WETTKAMPF_STATUS, WETTKAMPF_RUNDEN, KAMPFSTILE,
  TECHNIK_KATEGORIEN, TECH_SCHLAG, TECH_KICK, TECH_KNIE, TECH_ELLBOGEN, TECH_CLINCH, TECH_BLOCK, TECH_SCHRITTE,
  MAE_MAI, LOOK_MAI,
};
