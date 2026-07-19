// ===== PATTO Muay Thai Lexikon — Vokabeldaten =====
// Quelle: Lexikon.docx (Original-Content, unveraendert uebernommen).
// lexTable-Zeilenformat: [Deutsch, Phonetik, Thai-Schrift, Beschreibung]

const ZAHLEN = [
  ["Null", "Sun", "ศูนย์", ""],
  ["Eins", "Neung", "หนึ่ง", ""],
  ["Zwei", "Song", "สอง", ""],
  ["Drei", "Sam", "สาม", ""],
  ["Vier", "Si", "สี่", ""],
  ["Fünf", "Ha", "ห้า", ""],
  ["Sechs", "Hok", "หก", ""],
  ["Sieben", "Chet", "เจ็ด", ""],
  ["Acht", "Paet", "แปด", ""],
  ["Neun", "Kao", "เก้า", ""],
  ["Zehn", "Sip", "สิบ", ""],
];

const KOERPERTEILE = [
  ["Körper", "Tua", "ตัว", ""],
  ["Auge", "Ta", "ตา", ""],
  ["Nase", "Jamuk", "จมูก", ""],
  ["Mund", "Pak", "ปาก", ""],
  ["Kopf", "Hua", "หัว", ""],
  ["Bein", "Kha", "ขา", ""],
  ["Arm", "Khaen", "แขน", ""],
  ["Hals / Nacken", "Kho", "คอ", ""],
  ["Hand", "Mue", "มือ", ""],
  ["Ellbogen", "Sok", "ศอก", ""],
  ["Knie", "Khao", "เข่า", ""],
  ["Fuß", "Thao", "เท้า", ""],
  ["Finger", "Nio", "นิ้ว", ""],
  ["Knöchel", "Kho Thao", "ข้อเท้า", ""],
];

const ADJEKTIVE = [
  ["lang", "Yao", "ยาว", "von großer Länge"],
  ["kurz", "San", "สั้น", "von kleiner Länge"],
  ["Kraft", "Raeng", "แรง", "körperliche Stärke"],
  ["stark", "Khaeng Raeng", "แข็งแรง", "viel Kraft besitzend"],
  ["leicht", "Bao", "เบา", "von geringem Gewicht"],
  ["Geschwindigkeit", "Reo", "เร็ว", "hohes Tempo"],
  ["richtig", "Thuk (Dong)", "ถูกต้อง", "korrekt, passend"],
  ["falsch", "Phit", "ผิด", "nicht korrekt"],
  ["hoch / groß", "Sung", "สูง", "von großer Höhe"],
  ["niedrig / klein", "Tia", "เตี้ย", "von geringer Höhe"],
  ["schön", "Suai", "สวย", "optisch ansprechend"],
  ["viel", "Yer", "เยอะ", "Häufigkeit"],
  ["groß", "Yai", "ใหญ่", "von großem Umfang"],
  ["klein", "Lek", "เล็ก", "von kleinem Umfang"],
  ["dünn", "Phom", "ผอม", "schlank, wenig Körperfett"],
  ["dick", "Uan", "อ้วน", "kräftig, viel Körperfett"],
  ["mollig", "Pum Pui", "ปุ้มปุ้ย", "leicht dicklich"],
  ["Schmerz", "Jep", "เจ็บ", "akuter Schmerz"],
  ["Muskelkater", "Buat Klahm Nuea", "ปวดกล้ามเนื้อ", "muskuläre Schmerzen nach Anstrengung"],
];

const PERSONEN_TITEL = [
  ["Kämpfer", "Nak Muay", "นักมวย", "Athlet, der Muay Thai betreibt"],
  ["Krieger", "Nak Su", "นักสู้", "Allgemeiner Begriff für Kämpfer/Krieger"],
  ["Lehrer / Trainer", "Khru", "ครู", "Lehrer, Ausbilder im Muay Thai"],
  ["Meister", "Ajarn", "อาจารย์", "Ehrentitel für erfahrene Lehrer/Meister"],
  ["Ringrichter", "Kammakan", "กรรมการ", "Offizieller, der den Kampf im Ring leitet"],
  ["Punktrichter", "Kammakan Tatsin", "กรรมการตัดสิน", "Wertungsrichter, entscheidet über Punkte"],
  ["Champion / Titelträger", "Champ", "แชมป์", "Titelträger, Gewinner eines Turniers oder Gürtels"],
  ["Besitzer / Inhaber", "Chao Khong", "เจ้าของ", "Eigentümer, z. B. eines Camps oder Stadions"],
];

const SAETZE = [
  ["Entspannen", "Sabai", "สบาย", "Zur Ruhe kommen, entspannen"],
  ["Zurückgehen", "Thoi", "ถอย", "Einen Schritt zurücktreten"],
  ["Vorwärtsgehen", "Doen", "เดิน", "Nach vorne gehen, marschieren"],
  ["Keine Eile", "Mai Tong Rip", "ไม่ต้องรีบ", "Man muss sich nicht beeilen"],
  ["Ruhig bleiben", "Jai Yen Yen", "ใจเย็นๆ", "Gelassen und ruhig bleiben"],
  ["Benutze (deine) ___", "Chai ___", "ใช้ ___", "Eine Technik oder Körperteil einsetzen"],
  ["Los geht's! / Gib Gas!", "Su Su", "สู้ๆ", "Motivation: Kämpfe! Halte durch!"],
  ["Viel Glück", "Chok Di", "โชคดี", "Jemandem Glück wünschen"],
  ["Wie oft hast du gekämpft?", "Chok Ma Ki Khrang", "ชกมากี่ครั้ง", "Frage nach der Anzahl der Kämpfe"],
  ["Ich habe ___ Kämpfe.", "Chok Ma ___ Khrang", "ชกมา ___ ครั้ง", "Antwort über die Anzahl der Kämpfe"],
  ["Wann kämpfst du?", "Chok Mue Rai / Chok Wan Nai", "ชกเมื่อไหร่ / ชกวันไหน", "Frage nach dem Kampfdatum"],
  ["Wie viel wiegst du?", "Nam Nak Thao Rai", "น้ำหนักเท่าไหร่", "Frage nach dem Gewicht"],
  ["In welcher Gewichtsklasse kämpfst du?", "Chok Ki Lo", "ชกกี่โล", "Frage nach der Gewichtsklasse"],
  ["Wie viel Gewicht musst du abnehmen?", "Lot Ki Lo", "ลดกี่โล", "Frage nach dem Gewicht, das reduziert werden muss"],
  ["Wo findet der Kampf statt?", "Chok Thi Nai", "ชกที่ไหน", "Frage nach dem Kampf-Ort"],
  ["Um wie viel Uhr?", "Ki Mong", "กี่โมง", "Frage nach der Uhrzeit"],
  ["Ich bin fertig", "Taai Laeo", "ตายแล้ว", "Ausdruck für Erschöpfung oder Aufgabe"],
];

const TRAINING_AUSRUESTUNG = [
  ["Muay Thai Camp", "Kai Muay", "ค่ายมวย", "Trainingslager für Muay Thai"],
  ["Boxring", "We Tee", "เวที", "Ring, in dem gekämpft wird"],
  ["Thai-Öl", "Nam Man Muay", "น้ำมันมวย", "Traditionelles Öl zum Aufwärmen"],
  ["Sandsack", "Gra Sorp", "กระสอบ", "Schwerer Sack für Schlag- und Kicktraining"],
  ["Muay Thai Sparring", "Len Cheng", "เล่นเชิง", "Technisches Übungssparring"],
  ["Boxsparring", "Long Nuam", "ลงนวม", "Freies Sparring mit Handschuhen"],
  ["Training", "Som Muay", "ซ้อมมวย", "Allgemeines Muay Thai Training"],
  ["Runde", "Yok", "ยก", "Kampfrunde"],
  ["Zeit", "Wela", "เวลา", "Zeitangabe allgemein"],
  ["Minute", "Naa Tee", "นาที", "Zeiteinheit Minute"],
  ["Sekunde", "Wi Naa Tee", "วินาที", "Zeiteinheit Sekunde"],
  ["Stunde", "Chua Mong", "ชั่วโมง", "Zeiteinheit Stunde"],
  ["Bandagen", "Pha Phan Mue", "ผ้าพันมือ", "Handbandagen zum Schutz"],
  ["Tiefschutz", "Gra Jap", "กระจับ", "Tiefschutz zum Schutz der Genitalien"],
  ["Mundschutz", "Fan Yang", "ฟันยาง", "Schutz für die Zähne"],
  ["Springseil", "Chueak Kra-dot", "เชือกกระโดด", "Seil zum Aufwärmen und Konditionstraining"],
  ["Hantel", "Dam Bel", "ดัมเบล", "Gewicht für Krafttraining"],
  ["Muay Thai Shorts", "Kang Keng Muay", "กางเกงมวย", "Kurze Hose für Muay Thai Kämpfer"],
  ["Shirt / Oberteil", "Suea", "เสื้อ", "T-Shirt oder Oberteil"],
  ["Boxhandschuhe", "Nuam", "นวม", "Handschuhe für Training und Wettkampf"],
  ["Schienbeinschoner", "Sanap Khaeng", "สนับแข้ง", "Schoner zum Schutz der Schienbeine"],
  ["Muay Thai Pratzen", "Pao", "เป้า", "Pratzen für Schlag- und Kicktraining"],
  ["Boxpratzen", "Pao Mat", "เป้าหมัด", "Pratzen speziell für Boxtechniken"],
  ["Schuhe", "Rong Thao", "รองเท้า", "Schuhe, meist außerhalb des Rings getragen"],
  ["Knöchelschoner", "Aeng Kheun", "แองเคิ้ล", "Bandage für die Fußknöchel"],
  ["Hände bandagieren", "Phan Mue", "พันมือ", "Vorbereitung vor Training oder Wettkampf"],
  ["Seilspringen", "Kra-dot Chueak", "กระโดดเชือก", "Training mit Springseil"],
  ["Liegestütz", "Wit Peun", "วิดพื้น", "Kraftübung für Oberkörper"],
  ["Bauchaufzug / Sit-up", "Luk Nang", "ลุกนั่ง", "Bauchübung"],
  ["Klimmzug", "Deung Khuen", "ดึงขึ้น", "Kraftübung für Rücken"],
  ["Laufen", "Wing", "วิ่ง", "Ausdauertraining"],
  ["Auf dem Reifen springen", "Kra-dot Yaang", "กระโดดยาง", "Trainingsübung: wiederholtes Springen auf einem Reifen zur Verbesserung von Beinarbeit, Balance und Kondition"],
];

const WETTKAMPF_RITUAL = [
  {icon: "templeGate", de: "Wai Kru (Ritualtanz)", phon: "Wai Khru (Ram Muay)", thai: "ไหว้ครู (รำมวย)", desc: "Traditioneller Tanz vor dem Kampf" },
  {icon: "crown", de: "Mongkon (Kopfschmuck)", phon: "Mong Khon", thai: "มงคล", desc: "Heiliger Kopfschmuck beim Einzug" },
  {icon: "tiedScroll", de: "Prajiad (Armbinde)", phon: "Pra Chiat", thai: "ประเจียด", desc: "Armbinde als Glücksbringer" },
  {icon: "handshake", de: "Betreuer", phon: "Phi Liang", thai: "พี่เลี้ยง", desc: "Trainer/Betreuer in der Ecke" },
];

const WETTKAMPF = [
  ["Boxstadion", "Sanam Muay", "สนามมวย", "Ort, an dem die Kämpfe stattfinden"],
  ["Hauptkampf", "Khu Ek", "คู่เอก", "Der wichtigste Kampf des Abends"],
  ["Titelkampf", "Kan Khaeng Chan", "การแข่งขันชิงแชมป์", "Kampf um den Titel oder Gürtel"],
  ["Kampf", "Chok / Toi", "ชก / ต่อย", "Allgemeiner Begriff für den Kampf"],
  ["Sieg", "Cha Na", "ชนะ", "Den Kampf gewinnen"],
  ["Niederlage", "Paeh", "แพ้", "Den Kampf verlieren"],
  ["Unentschieden", "Sa Moe", "เสมอ", "Kampf ohne Sieger"],
  ["Punktsieg / Entscheidung", "Khan Naen", "คะแนน", "Sieg durch Punktewertung"],
  ["Knockout", "Nok", "น็อก", "Sieg durch KO"],
  ["Cut / Platzwunde", "Taek", "แตก", "Wunde oder Cut im Gesicht"],
  ["Amateurkämpfer", "Muay Samak Len", "มวยสมัครเล่น", "Kämpfer ohne Profistatus"],
  ["Profikämpfer", "Muay Achip", "มวยอาชีพ", "Kämpfer mit Profistatus"],
  ["Klassisches Boxen", "Muay Sakon", "มวยสากล", "Internationales/Westliches Boxen"],
  ["Gewicht", "Nam Nak", "น้ำหนัก", "Das Körpergewicht des Kämpfers"],
  ["Kampfnummer", "Khu", "คู่", "Nummer des Kampfes auf der Fightcard"],
  ["Erster", "Raek", "แรก", "Der erste Kampf des Abends"],
  ["Letzter", "Sut Thai", "สุดท้าย", "Der letzte Kampf des Abends"],
  ["Runde 1", "Yok Thi Neung", "ยกที่ 1", "Erste Runde"],
  ["Runde 2", "Yok Thi Song", "ยกที่ 2", "Zweite Runde"],
  ["Runde 3", "Yok Thi Sam", "ยกที่ 3", "Dritte Runde"],
  ["Runde 4", "Yok Thi Si", "ยกที่ 4", "Vierte Runde"],
  ["Runde 5", "Yok Thi Ha", "ยกที่ 5", "Fünfte Runde"],
  ["Trennen", "Yaek", "แยก", "Kämpfer voneinander trennen"],
  ["Starten / Beginnen", "Reum", "เริ่ม", "Starten/ Beginnen"],
  ["Stoppen", "Yut", "หยุด", "Den Kampf anhalten"],
];

const KAMPFSTILE = [
  {icon: "wingfoot", de: "Technischer Kämpfer", phon: "Muay Femur", thai: "มวยฝีมือ", desc: "Taktisch, technisch versierter Kämpfer mit hoher Ringintelligenz" },
  {icon: "kneeCap", de: "Kniekämpfer", phon: "Muay Khao", thai: "มวยเข่า", desc: "Spezialist für Kniestöße, stark im Clinch" },
  {icon: "punch", de: "Schlagkämpfer", phon: "Muay Mat", thai: "มวยหมัด", desc: "Fokus auf Faustschläge, meist aggressiver Stil" },
  {icon: "elbowPad", de: "Ellbogenkämpfer", phon: "Muay Sok", thai: "มวยศอก", desc: "Kämpfer, der intensiv mit Ellenbogen arbeitet" },
  {icon: "flame", de: "Aggressiver Kämpfer", phon: "Muay Bouk", thai: "มวยบู๊", desc: "Ständig vorwärtsgehend, druckvoll und kampfbetont" },
  {icon: "bootKick", de: "Kickkämpfer", phon: "Muay Tae", thai: "มวยเตะ", desc: "Fokus auf Tritte, besonders harte Low- und High-Kicks" },
];

const TECH_GENERELL = [
  ["Blocken", "Bang", "บัง", "Blockbewegung"],
  ["Drücken / Stoßen", "Phlak", "ผลัก", "Gegner wegstoßen"],
  ["Ziehen", "Deung", "ดึง", "Gegner ziehen"],
  ["Heben", "Yok", "ยก", "Anheben, hochheben"],
  ["Hinaufgehen / Hineingehen", "Khuen", "ขึ้น", "Den Ring betreten"],
  ["Anziehen / Einsetzen", "Sai", "ใส่", "Einsetzen, anlegen"],
  ["Links", "Sai", "ซ้าย", "Linke Seite"],
  ["Rechts", "Khwa", "ขวา", "Rechte Seite"],
  ["Schlagen / Treffen", "Dtee", "ตี", "Den Gegner mit dem Knie im Clinch treffen / schlagen"],
  ["Stoßen / Einstechen", "Siab", "เสียบ", "Mit Knie, Ellbogen oder Waffe gerade nach vorn stoßen bzw. in den Gegner „einstoßen“"],
];

const TECH_SCHLAG = [
  ["Superman-Punch", "Kra-dot Chok", "กระโดดชก", "Gesprungener gerader Faustschlag"],
  ["Gerader Faustschlag", "Mat Trong", "หมัดตรง", "Gerade geführter Schlag"],
  ["Uppercut / Aufwärtshaken", "Mat Ngad / Mat Soi Dao", "หมัดงัด / หมัดสอยดาว", "Aufwärtshaken zum Kinn"],
  ["Spinning Backfist / Drehschlag mit dem Handrücken", "Mat Klap", "หมัดกลับ", "Rückwärtsschlag mit Handrücken"],
  ["Hook / Kopfhaken", "Mat Thawaad", "หมัดถวาย", "Seitlicher Haken zum Kopf"],
  ["Overhead Punch / Schwinger", "Mat Khwang", "หมัดคว้าง", "Von oben geführter Schwinger"],
];

const TECH_KICK = [
  ["Lowkick", "Dteh Kha", "เตะขา", "Tritt mit dem Schienbein zum Oberschenkel oder Unterschenkel des Gegners"],
  ["Roundhouse-Kick", "Dteh Tat", "เตะตัด", "Seitlicher Rundtritt mit dem Schienbein oder Spann zum Körper oder Kopf"],
  ["Diagonaltritt", "Dteh Chiang", "เตะเฉียง", "Schräger Tritt im 45°-Winkel von unten nach oben gegen Körper oder Kopf mit dem Schienbein oder Spann"],
  ["Axekick / Axtkick", "Dteh Khao", "เตะบน", "Von oben nach unten geschwungener Tritt mit der Ferse"],
  ["Frontkick / Gerader Fußstoß", "Teep Trong", "ถีบตรง", "Gerader Stoßtritt mit der Fußsohle"],
  ["Sidekick / Seitlicher Fußstoß", "Teep Khang", "ถีบข้าง", "Seitlicher Stoßtritt mit Fußsohle"],
  ["Gedrehter Roundhouse-Kick / Spinning Roundhouse Kick", "Dteh Klap Lang", "เตะกลับหลัง", "Gedrehter Tritt im Halbkreis mit dem Schienbein oder Spann"],
  ["Abwärts-Roundhouse-Kick / Downward Roundhouse Kick", "Dteh Kot", "เตะกด", "Abwärts gerichteter, Tritt von oben nach unten mit dem Schienbein oder Spann"],
  ["Sprungkick / Jumping Roundhouse Kick", "Kra-dot Dteh", "กระโดดเตะ", "Im Sprung ausgeführter Roundhouse Kick"],
  ["Gesprungener Front Kick", "Kra-dot Teep", "กระโดดถีบ", "Stoßtritt nach vorne im Sprung mit der Fußsohle"],
  ["Spinning Back Kick / Gedrehter Rückwärts-Fußstoß", "Teep Klap Lang", "ถีบกลับหลัง", "Gedrehter Rückwärts-Fußstoß mit der Fußsohle"],
  ["Highkick", "Dteh Hua", "เตะหัว", "Hoher Tritt mit dem Schienbein oder Spann zum Kopf"],
  ["Spinning Heel Kick / Fersendrehschlag", "Dteh Wiang Lang", "เตะเวียงหลัง", "Drehkick mit der Ferse von hinten/seitlich getroffen"],
];

const TECH_KNIE = [
  ["Gerader Knieschlag", "Khao Trong", "เข่าตรง", "Knieschlag gerade nach vorne"],
  ["Stoßendes Knie", "Khao Yad Sai", "เข่ายัดไส้", "Bohrender Stoß mit dem Knie nach vorne"],
  ["Gesprungenes Knie", "Khao Loi", "เข่าลอย", "Knie aus dem Sprung"],
  ["Diagonaler Knieschlag", "Khao Chiang", "เข่าเฉียง", "Knieschlag diagonal, 45° von unten nach oben"],
  ["Horizontaler Knieschlag", "Khao Tad", "เข่าตัด", "Knieschlag waagerecht, 90° seitlich"],
  ["Seitlicher Knieschlag", "Khao Tee", "เข่าตี", "Knieschlag mit der Innenseite seitlich"],
  ["Kurzer Knieschlag", "Khao Noi", "เข่าน้อย", "Kurzes Knie im Clinch, oft zum Oberschenkel"],
  ["Knie-Schienbein-Schlag", "Khao Laa", "เข่าลา", "Treffer mit Knie und Schienbein gleichzeitig"],
];

const TECH_ELLBOGEN = [
  ["Gedrehter Ellenbogen", "Sok Klap", "ศอกกลับ", "Ellenbogen aus der Drehung"],
  ["Aufwärts-Ellenbogen", "Sok Ngat", "ศอกงัด", "Ellenbogen von unten nach oben"],
  ["Abwärts-Ellbogen", "Sok Sab", "ศอกซับ", "Ellenbogen von oben nach unten"],
  ["Horizontaler Ellenbogen", "Sok Tat", "ศอกตัด", "Ellenbogen waagerecht, 90° seitlich"],
  ["Diagonaler Ellenbogen", "Sok Chiang", "ศอกเฉียง", "Ellenbogen schräg, 45° von unten nach oben"],
  ["Doppel-Ellenbogen", "Sok Ku", "ศอกคู่", "Beide Ellenbogen gleichzeitig von oben nach unten"],
  ["Speer-Ellenbogen", "Sok Phong", "ศอกพุ่ง", "Ellenbogen gerade nach vorne gestoßen"],
  ["Schlag-Ellenbogen", "Sok Ti", "ศอกตี", "Ellenbogen schräg, 45° von oben nach unten"],
  ["Gesprungener Ellenbogen", "Kra-dot Sok", "กระโดดศอก", "Ellenbogen aus dem Sprung"],
  ["Seitlicher Ellenbogenstoß", "Sok Kratung", "ศอกกระทุ้ง", "Seitlicher Ellenbogenstoß von unten nach oben"],
];

const TECH_CLINCH = [
  ["Nacken / Hals greifen", "Jap Kho", "จับคอ", "Nacken-/ Halskontrolle im Clinch"],
  ["Clinch", "Bplam", "ปล้ำ", "Nahkampf-Halteposition für Kontrolle, Knie- und Ellenbogentechniken"],
  ["Arme durchschwimmen", "Lai Kaen", "ไล่แขน", "Mit den Armen „durchschwimmen“, um im Clinch eine bessere Position oder Kontrolle zu bekommen"],
];

const TECH_BLOCK = [
  ["Schienbein Außenblock", "Khao Bang Nok", "เข่าบล็อกนอก", "Block mit Schienbein gegen Kick von außen"],
  ["Schienbein Innenblock", "Khao Bang Nai", "เข่าบล็อกใน", "Block mit Schienbein gegen Kick von innen"],
];

const TECH_SCHRITTE = [
  ["Kampfstellung, Gewicht nach hinten verlagert", "Jot Muay", "จดมวย", "Grundstellung mit Gewicht auf dem hinteren Bein"],
  ["Kampfstellung mit Partner", "Khum Chung", "ขุมเชิง", "Klassische Kampfstellung mit Gegner gegenüber"],
  ["Gleitschritt vorwärts", "Seup Rug", "สืบรับ", "Schrittbewegung nach vorn, Gewicht gleitend"],
  ["Gleitschritt rückwärts", "Seup Thoy", "สืบถอย", "Schrittbewegung nach hinten, Gewicht gleitend"],
  ["Hinteres Bein nach vorne", "Khao Rug", "ก้าวรุก", "Vorwärtsschritt mit dem hinteren Bein"],
  ["Vorderes Bein nach hinten", "Khao Thoy", "ก้าวถอย", "Rückwärtsschritt mit dem vorderen Bein"],
  ["Hinteres Bein zur Seite", "Khao Chak", "ก้าวฉาก", "Seitwärtsschritt mit dem hinteren Bein"],
  ["Pass-Gang", "Yang Sam Khum", "ย่างสามขุม", "Dreischritt-Muster, traditionelles Muay Thai Fußarbeitssystem"],
];

const MAE_MAI = [
  {de: "Fischzahnabwehr (Zick-Zack)", phon: "Salab Fan Pla", thai: "สลับฟันปลา", desc: "Lenke den Schlag des Gegners mit einer Hand ab und kontere, indem du mit der gegenüberliegenden Hand in die Außenschulter des Angreifers stößt" },
  {de: "Der Vogel guckt durch das Nest", phon: "Paksa Waeg Rang", thai: "ปักษาแหวกรัง", desc: "Tritt diagonal in die Deckung des Gegners, lenke seinen Schlag mit einem Arm ab und treffe mit der anderen Hand die Innenseite seiner Schulter" },
  {de: "Der Javaner wirft den Speer", phon: "Chawa Sad Hok", thai: "ชวาซัดหอก", desc: "Tritt diagonal außerhalb der Schlagbahn des Gegners, lenke seinen Angriff mit einem Arm ab und kontere, indem du mit dem gegenüberliegenden Arm einen aufwärts gerichteten Ellbogenstoß gegen seine Rippen ausführst" },
  {de: "Der Indonesier sticht mit dem Dolch", phon: "Inao Tang Grit", thai: "อิเหนาแทงกริช", desc: "Bewege dich diagonal in die Deckung des Gegners, lenke seinen Schlag mit einem Arm ab und triff seine Rippen mit einem kraftvollen Ellbogenstoß des gegenüberliegenden Arms" },
  {de: "Den Berg Sumeru heben", phon: "Yo Khao Prasumeru", thai: "โย้เขาพระสุเมรุ", desc: "Ducke dich unter den Schlag des Gegners, mache dabei einen kleinen Schritt vorwärts und kontere mit einem Aufwärtshaken aufs Kinn" },
  {de: "Der alte Mönch hält die Melone", phon: "Ta Then Kam Fak", thai: "ตาเถรข้ามฟาก", desc: "Tritt in die Deckung des Gegners ein, lenke seinen Schlag mit einem Arm nach oben ab und setze sofort mit der gegenüberliegenden Hand einen kraftvollen Schlag ans Kinn" },
  {de: "Der Peguaner stützt die Säule", phon: "Mon Yan Lak", thai: "มอญยันหลัก", desc: "Heb beide Arme in eine defensive Haltung, schütze das Gesicht und führe einen kraftvollen Push-Kick (Teep) gegen den Magen oder die Brust des Gegners aus, um ihn rückwärts zu stoßen" },
  {de: "Die Stufen in den Baumstamm einschlagen", phon: "Pak Look Toi", thai: "ปักลูกถอย", desc: "Dreh dich in Richtung des eintreffenden Tritts des Gegners, hebe beide Ellbogen, um sein Schienbein abzufangen, und halte gleichzeitig die Hände zum Schutz des Gesichts" },
  {de: "Das Krokodil schlägt mit dem Schwanz", phon: "Jarake Fad Hang", thai: "จระเข้ฟาดหาง", desc: "Drehe den Körper und führe einen kraftvollen Drehfersen-Tritt zum Kopf oder Oberkörper des Gegners aus" },
  {de: "Den Rüssel des Elefanten brechen", phon: "Hak Nguang Aiyara", thai: "หักงวงไอยรา", desc: "Greife mit einem Arm das Schienbein des Gegners, während er zum Tritt ausholt, und treffe mit dem anderen Arm mit einem scharfen Ellbogenstoß den Ansatz seines Beins" },
  {de: "Den Schwanz der Naga verdrehen", phon: "Naka Bid Hang", thai: "นาคาบิดหาง", desc: "Fange den tretenden Fuß des Gegners mit beiden Händen, dreh seinen Fuß nach außen und setze einen Kniestoß gegen seine Wade oder das Kniegelenk" },
  {de: "Der Yaksa wird zurückgeworfen", phon: "Viroon Hok Grab", thai: "วิรุฬหกกลับ", desc: "Dreh dich diagonal in Richtung des Tritts des Gegners, kontere mit einem Push-Kick (Teep) gegen seinen Oberschenkel und halte dabei die Deckung, um dich vor Angriffen auf den Oberkörper zu schützen" },
  {de: "Die Lampe ausschalten", phon: "Dub Chawala", thai: "ดับชวาลา", desc: "Drücke den schlagenden Arm des Gegners mit einer Hand nach unten und setzte gleichzeitig mit der anderen Hand einen Konter ins Gesicht" },
  {de: "Der Yaksa fängt den Affen", phon: "Khun Yak Jub Ling", thai: "ขุนยักษ์จับลิง", desc: "Blocke den Kick des Gegners mit beiden Armen, wehre anschließend mit einem Arm seinen Ellbogenstoß ab und halte gleichzeitig die Deckung gegen weitere Fäuste, Tritte oder Ellbogen" },
  {de: "Den Hals des Elefantengottes brechen", phon: "Hak Kor Erawan", thai: "หักคอเอราวัณ", desc: "Greife den Hals des Gegners mit beiden Händen, ziehe ihn nach unten und setze gleichzeitig einen kräftigen Kniestoß ins Gesicht" },
];

const LOOK_MAI = [
  {de: "Der Elefantgott stößt seine Stoßzähne nach oben", phon: "Erawan Soei Nga", thai: "เอราวัณเสยงา", desc: "Diese Technik setzt einen Aufwärtshaken oder einen aufwärts gerichteten Ellbogenstoß an das Kinn des Gegners ein, während du dich gleichzeitig kraftvoll nach vorn bewegst, um den Gegner zu destabilisieren" },
  {de: "Die Fußsohle streicht das Gesicht", phon: "Bata Loob Pak", thai: "บาทาลูบพักตร์", desc: "Eine Kontertritt-Technik, bei der der Verteidiger nach dem Ausweichen vor einem Schlag oder Tritt mit einem hohen Kick ins Gesicht kontert und die entstandene Öffnung in der Deckung des Gegners ausnutzt" },
  {de: "Der Yaksa entführt die Frau", phon: "Khun Yak Panang", thai: "ขุนยักษ์พานาง", desc: "Eine Grappling-Technik, bei der der Kämpfer den Arm des Gegners einklemmt und ihn aus dem Gleichgewicht hebt, während er mit einem Kniestoß gegen die Rippen oder den Bauch nachsetzt" },
  {de: "König Rama biegt den Pfeil", phon: "Phra Ram Naow Son", thai: "พระรามเหียนศร", desc: "Der Kämpfer tritt zurück, um einem Angriff auszuweichen, und kontert mit einem geraden Schlag oder Tritt, wobei er die Bewegung eines Bogenspanners nachahmt, um den Gegner präzise zu treffen" },
  {de: "Der Löwe überquert den Bach", phon: "Kraisorn Khaam Huai", thai: "ไกรสรข้ามห้วย", desc: "Eine Fegetechnik, bei der ein Low-Kick auf die Beine des Gegners zielt, mit dem Ziel, ihn während eines Austauschs zu stolpern oder aus dem Gleichgewicht zu bringen" },
  {de: "Das Reh schaut zurück", phon: "Kwang Liew Lang", thai: "กวางเหลียวหลัง", desc: "Eine Finte, bei der der Kämpfer so tut, als würde er zurückweichen, um sich dann zu drehen und mit einem überraschenden Tritt oder Ellbogenstoß die freigelegte Seite oder den Rücken des Gegners zu treffen" },
  {de: "Der Yaksa-König rollt die Erde auf", phon: "Hiran Muan Paen Din", thai: "หิรัญม้วนแผ่นดิน", desc: "Fange den Tritt des Gegners, hebe sein Bein und fege ihn mit einer kraftvollen Drehung des Körpers zu Boden" },
  {de: "Die Naga taucht in das Unterweltreich von Patala ab", phon: "Naka Mud Badan", thai: "นาคมุดบาดาล", desc: "Eine Abwehrbewegung, bei der der Kämpfer unter den Schlag oder Tritt des Gegners taucht und mit einem Körpertreffer, Ellbogenstoß oder Aufwärtshaken kontert" },
  {de: "Der Vanara-Gott bietet einen Ring an", phon: "Hanuman Tawai Waen", thai: "หนุมานถวายแหวน", desc: "Eine elegante Bewegung, bei der der Kämpfer sich drehend einem Angriff ausweicht und mit einem kraftvollen Rückhandschlag oder einem drehenden Ellbogenstoß kontert" },
  {de: "Der Vietnamese wirft ein Fischernetz", phon: "Yuan Thod Hae", thai: "ยวนทอดแห", desc: "Eine Einklemmtechnik, bei der der Kämpfer seine Arme nutzt, um die Gliedmaßen des Gegners zu verfangen und im Nahkampf mit Kniestoßen oder einem Ellbogenstoß den Angreifer kampfunfähig zu machen" },
  {de: "Der Tay-Stammesmann stützt eine Säule", phon: "Thaye Kham Sao", thai: "ไทยค้ำเสา", desc: "Diese Technik konzentriert sich darauf, mit einem Low-Kick oder einer Fegebewegung den Gegner zu destabilisieren, während du dich fest abstützt, um dein Gleichgewicht zu bewahren" },
  {de: "Den Schwanenflügel brechen", phon: "Hong Peek Hak", thai: "หงส์ปีกหัก", desc: "Ein konternder Ellbogenstoß, der nach dem Auffangen oder Ablenken des Angriffs ausgeführt wird und mit Präzision und Schnelligkeit die Rippen oder das Kinn des Gegners trifft" },
  {de: "Ellenbogen Blumengirlande", phon: "Sok Phuang Malai", thai: "ศอกพวงมาลัย", desc: "Eine verkettete Nahdistanz-Ellbogenkombination: mehrere kurze, kreisförmige oder halbkreisförmige Ellbogenstöße in schneller Folge, getragen von Hüftrotation und Körperdrehung. Die Serie ähnelt dem Auffädeln einer Blumengirlande." },
  {de: "Der alte Mönch fegt den Hof", phon: "Thaen Kwad Laan", thai: "เถรกวาดลาน", desc: "Eine Technik, bei der sich der Kämpfer drehend bewegt, um mit einem tiefen Fege-Kick den Gegner aus dem Gleichgewicht zu bringen und unmittelbar in einen aggressiven Gegenangriff überzuleiten" },
  {de: "Den Kürbis schneiden", phon: "Fan Look Buab", thai: "ฟันลูกบวบ", desc: "Eine hochschnelle Kombinationsbewegung, bei der der Kämpfer mit einem Ausweichschritt reagiert und anschließend mit einem scharfen, nach unten gerichteten Ellbogenstoß oder Tritt die Verteidigung des Gegners effektiv durchtrennt" },
];

module.exports = {
  ZAHLEN,
  KOERPERTEILE,
  ADJEKTIVE,
  PERSONEN_TITEL,
  SAETZE,
  TRAINING_AUSRUESTUNG,
  WETTKAMPF_RITUAL,
  WETTKAMPF,
  KAMPFSTILE,
  TECH_GENERELL,
  TECH_SCHLAG,
  TECH_KICK,
  TECH_KNIE,
  TECH_ELLBOGEN,
  TECH_CLINCH,
  TECH_BLOCK,
  TECH_SCHRITTE,
  MAE_MAI,
  LOOK_MAI,
};
