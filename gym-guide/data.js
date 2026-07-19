// ===== PATTO Muay Thai Gym Guide — Daten =====
// Quelle: Guide.docx (Original-Content, unveraendert uebernommen).

const VORWORT = ["Thailand gilt als das Mekka des Muay Thai – kein Land auf der Welt ist so eng mit dem Nationalsport verwurzelt. Wer in Thailand trainiert, erlebt nicht nur authentisches Training, sondern auch die Kultur, Disziplin und Spiritualität, die diesen Sport prägen. Die Qualität der Gyms ist allerdings sehr unterschiedlich – von Weltklasse-Schmieden bis hin zu reinen Touristenfallen ist alles dabei. Damit du das für dich passende Gym findest, habe ich eine Auswahl an empfohlenen Muay Thai Gyms zusammengestellt – basierend auf Community-Feedback, eigenen Erfahrungen und fundierter Recherche.", "Nutze diesen Guide als Orientierungshilfe – aber vergiss nicht: Jede Empfehlung ist nur ein Wegweiser – deine persönliche Erfahrung macht den Unterschied."];

const GYMWAHL_GUT_INTRO = "Ein gutes Gym erkennst du daran, dass es:";
const GYMWAHL_GUT = ["viel Clinchtraining anbietet", "tägliches gemeinsames Joggen organisiert", "aktive Kämpfer im Team hat – besonders junge Thais, die regelmäßig nach der Schule zum Training kommen", "Wert auf Technik, Ausführung und kontinuierliche Verbesserung legt", "Trainer zeigt, die wirklich an dir als Kämpfer interessiert sind – sie korrigieren, motivieren und fordern dich"];
const GYMWAHL_SCHLECHT_INTRO = "Ein schlechtes Gym erkennst du dagegen oft an:";
const GYMWAHL_SCHLECHT = ["HIIT-Workouts ohne Bezug zum Muay Thai", "keinem vorgeschriebenen Joggen", "fehlendem Kämpferteam oder gar Sparring", "kurzen, halbherzigen Pratzenrunden", "Trainern, die dich nicht korrigieren oder sich nicht kümmern", "hartem Sparring, besonders mit Anfängern"];

const RECHERCHE_INTRO = "Viele Gyms posten regelmäßig auf Instagram, TikTok oder Facebook. Dort kannst du dir einen ersten Eindruck vom Training, den Kämpfern und der Atmosphäre verschaffen. Aber Achtung: Nicht alles, was auf Social Media gut aussieht, ist auch gut im echten Leben. Kommerzielle Gyms investieren oft mehr in ihre Außenwirkung und Marketing als in echtes, strukturiertes Training. Das bedeutet in der Praxis oft:";
const RECHERCHE_WARN = ["Training wird stark vereinfacht, um es für Anfänger „angenehm“ zu halten – dadurch fehlt Tiefgang, Technikfokus oder Drill", "statt individueller Korrektur geht man unter in großen Gruppen, ohne persönliches Feedback", "die Trainer sind oft ausgelaugt, demotiviert oder beschäftigen sich mehr mit neuen Kunden als mit echten Lernfortschritten", "statt echter Wettkampfatmosphäre herrscht eher ein „Retreat-Flair“ – mit Fokus auf Wellness, Proteinshakes und Community-Vibes"];
const RECHERCHE_OUTRO = "Wenn ein Gym auf Instagram, TikTok oder Facebook fast nur Selfies, HIIT-Workouts und Sonnenuntergänge postet, statt Sparring, Clinch oder Jogging – sei kritisch. Gute Gyms posten das Training selbst, ihre Kämpfer, Resultate und echte Szenen aus dem Camp. Auch Reddit ist eine sehr wertvolle Quelle. Gib z. B. „Chiang Mai Muay Thai Reddit“ ein – dort findest du ehrliche Erfahrungsberichte, Sparring-Videos und auch Warnungen vor Mogelpackungen.";

const REGIONS = [
  {
    name: "Bangkok",
    paragraphs: ["Bangkok ist der Ursprung und das pulsierende Zentrum des modernen Muay Thai. In der thailändischen Hauptstadt findest du eine hohe Dichte an traditionellen Gyms, aktiven Wettkämpfern und erfahrenen Trainern. Viele bekannte Profis stammen aus Camps in Bangkok – hier wird täglich unter echten Bedingungen trainiert, meist in enger Verbindung zur lokalen Kampfszene.", "Wer authentisches Muay Thai sucht, ist hier genau richtig: Die Trainings sind fordernd, technisch fokussiert und tief in der Kultur verankert. Gleichzeitig bietet Bangkok eine große Auswahl – von ruhigen Local-Gyms bis zu etablierten Wettkampfschmieden.\nPerfekt für alle, die mittendrin statt nur dabei sein wollen."],
    gyms: ["Dejrat Gym", "F.A.GROUP Muaythai Gym", "Kiatsongrit Muay Thai Gym", "Looknongsaeng Muay Thai", "Rithirit Gym Academy", "Sangmorakot Muay Thai Academy", "Sasiprapa Muay Thai Gym", "Sitsongpeenong Muay Thai Camp", "TDED99 Muay Thai Gym", "Wor.Auracha Muay Thai Gym", "Pinsinchai Muay Thai Gym"],
    sub: { title: "Auch außerhalb der Metropole", intro: "Wer denkt, das Beste gäbe es nur mitten in Bangkok, liegt falsch. Auch außerhalb der Metropole – in den angrenzenden Provinzen oder am Stadtrand – verbergen sich echte Trainingsschätze. Hier findest du Gyms, die nicht auf Massentourismus setzen, sondern auf authentisches Training, familiäre Atmosphäre und persönliche Betreuung.", gyms: ["Captainken Boxing Gym", "Kiatphontip Gym", "Sangtiennoi Gym", "Sitmonchai Gym", "Sit Palan Muay Thai Gym"] },
  },
  {
    name: "Chiang Mai",
    paragraphs: ["Chiang Mai im Norden Thailands hat sich in den letzten Jahren zu einem beliebten Trainingsort für Muay Thai entwickelt. Die Stadt verbindet eine entspannte Atmosphäre mit einer aktiven Szene aus motivierten Kämpfern und passionierten Coaches. Viele der Gyms hier legen Wert auf Technik, kontinuierliche Entwicklung und respektvollen Umgang – perfekt für Lernfortschritte ohne unnötigen Druck.", "Besonders beliebt ist Chiang Mai bei Langzeitreisenden, digitalen Nomaden und all jenen, die konzentriert trainieren wollen – fernab vom Trubel Bangkoks oder den Partyorten im Süden.\nDie ideale Wahl für alle, die Wert auf Qualität, Ruhe und Tiefe im Training legen."],
    gyms: ["Burklerk Gym", "Hongthong Muay Thai Gym", "Lanna Muay Thai", "Manasak Muay Thai Gym", "Manop Gym", "Santai Muay Thai Gym", "Sereephap Muay Thai", "Sit Thaharnaek", "Sit Thailand Muay Thai Gym"],
  },
  {
    name: "Isaan",
    paragraphs: ["Der Isaan im Nordosten Thailands gilt als Ursprungsregion vieler Topkämpfer. In den ländlichen Provinzen wie Buriram, Ubon Ratchathani oder Khon Kaen liegt der Fokus oft auf hartem, bodenständigem Training – fernab touristischer Ablenkung. Wer hier trainiert, erlebt Muay Thai in seiner rohen, unverfälschten Form.", "Die Region ist ideal für erfahrene Kämpfer oder all jene, die maximale Authentizität suchen. In kleinen, familiären Camps trainiert man oft Seite an Seite mit lokalen Talenten – mit echtem Wettkampfgeist und tiefer sportlicher Tradition."],
    gyms: ["Dokbua Gym", "Lamnammoon Muay Thai", "Look Nungubon Muay Thai", "Siriluck Gym", "Sunti Muay Thai Gym", "Kem Muay Thai Gym"],
  },
  {
    name: "Inselregion: Koh Samui, Koh Phangan & Koh Tao",
    paragraphs: ["Diese drei Inseln im Golf von Thailand bieten die perfekte Mischung aus tropischem Flair und Muay Thai Training. Vor allem Koh Samui hat sich in den letzten Jahren zu einem beliebten Spot für Trainierende aus aller Welt entwickelt – mit einer wachsenden Szene und professionellen Camps. Auf Koh Phangan findet man kleinere, oft familiäre Gyms, die abseits vom Partytrubel auf ernsthaftes Training setzen. Koh Tao ist ruhiger, punktet aber mit guter Atmosphäre für ein fokussiertes Training in paradiesischer Umgebung.", "Wer auf den Inseln trainiert, kann Muay Thai mit Strand, Sonne und Erholung kombinieren – ideal für motivierte Anfänger, Fortgeschrittene und Langzeitreisende."],
    groups: [
      { title: "Koh Samui", gyms: ["Chatpichit Muay Thai Gym", "Chor.Ratchawat Muay Thai", "Dowden Muay Thai Gym", "Sor Jitphakdee", "Srisawat Muay Thai Samui Camp", "Wech Pinyo Muay Thai"] },
      { title: "Koh Pangan", gyms: ["Diamond Muay Thai", "Martial Arts Academy", "Sor Saktai Muay Thai"] },
      { title: "Koh Tao", gyms: ["Koh Tao Muay Thai", "Monsoon Gym"] },
    ],
  },
  {
    name: "Pattaya",
    paragraphs: ["Pattaya ist mehr als nur Nachtleben und Tourismus – es hat sich zu einem soliden Standort für Muay Thai Training entwickelt. Inmitten der geschäftigen Küstenstadt finden sich einige authentische Gyms, die mit erfahrenen Trainern und einer klaren Struktur überzeugen. Wer gezielt nach Qualität sucht, kann hier echtes Training erleben – abseits vom Massentourismus.", "Pattaya eignet sich besonders für alle, die eine gute Infrastruktur, kurze Wege und intensives Training verbinden wollen – mit der Möglichkeit, auch mal durchzuatmen oder am Meer zu entspannen."],
    gyms: ["Ban Rambaa Gym", "Phetchrungruang Gym", "Rage Fight Academy", "Silk Muay Thai", "Sityodtong Muay Thai Camp", "Sor.Klinmee Gym"],
  },
  {
    name: "Phuket",
    paragraphs: ["Phuket zählt zu den bekanntesten Muay Thai-Destinationen weltweit – insbesondere die sogenannte „Fitness Street – Soi Ta-iad“ in Chalong zieht zahlreiche Trainingsreisende an. Hier reiht sich Gym an Gym, ergänzt durch Cafés, Proteinbars und Unterkünfte. Doch nicht alles, was dort glänzt, steht für echtes Muay Thai.", "Abseits dieser kommerzialisierten Zone findest du auf Phuket auch authentische Camps mit Herz, erfahrenen Trainern und lokal verwurzelten Kämpfern. Wer nicht nur schwitzen, sondern wirklich lernen will, sollte sich bewusst fernab des Mainstreams umsehen.", "Mit einem wachen Blick und etwas Recherche findest du auf Phuket hochwertige Trainingsmöglichkeiten, die Touristenkomfort mit echter Muay Thai-Kultur verbinden – ganz ohne Show."],
    gyms: ["Cookie Muay Thai Gym", "Singpatong Muay Thai Gym"],
  },
  {
    name: "Weitere Orte",
    paragraphs: ["Neben den bekannten Muay Thai-Hotspots gibt es in Thailand zahlreiche kleinere Orte, die oft übersehen werden – dabei bieten sie genau das, wonach viele wirklich suchen: Ruhe, Authentizität und unverfälschtes Training.", "Orte wie Hua Hin, Khao Lak, Krabi, Pai, Phayao oder Singburi liegen abseits des Massentourismus. Die dortigen Gyms zeichnen sich durch familiäre Strukturen, direkte Betreuung und engen Kontakt zur lokalen Community aus. Viele dieser Camps arbeiten nicht für die Kamera – sondern für Fortschritt im Ring.", "Gerade für Fortgeschrittene, die fokussiert trainieren oder Kämpfe vorbereiten wollen, können diese Orte eine ideale Basis sein. Und auch Anfänger, die keine Lust auf überfüllte Gruppenstunden oder „Fitness-Flair“ haben, finden hier echtes Muay Thai – so, wie es sein sollte."],
    groups: [
      { title: "Hua Hin", gyms: ["MrKnock Muay Thai", "Sitjaopho Muay Thai"] },
      { title: "Khao Lak", gyms: ["Khao Lak Muay Thai"] },
      { title: "Krabi", gyms: ["Bull Muay Thai"] },
      { title: "Pai", gyms: ["Charn Chai Muay Thai", "Sitjemam Muay Thai"] },
      { title: "Phayao", gyms: ["Phuthon Muay Thai – Buathet"] },
      { title: "Singburi", gyms: ["Jor. Apichat Muay Thai Gym"] },
    ],
  },
];

module.exports = {
  VORWORT, GYMWAHL_GUT_INTRO, GYMWAHL_GUT, GYMWAHL_SCHLECHT_INTRO, GYMWAHL_SCHLECHT,
  RECHERCHE_INTRO, RECHERCHE_WARN, RECHERCHE_OUTRO, REGIONS,
};
