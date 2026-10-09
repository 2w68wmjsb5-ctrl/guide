// ===== PATTO Muay Thai Strength & Conditioning — Übungsdaten =====
// Quelle: SC_Final.xlsx. Übungsnamen und Werte unverändert übernommen,
// nur Einheiten und Beschreibungen ins Deutsche übertragen.
//
// HIER PASST DU DEINE ÜBUNGEN AN. Alles andere (Seiten, Übungs-Index,
// Zähler) wird beim nächsten Build automatisch aus dieser Datei erzeugt.
//
// contrast: true  -> Zeile wird als Kontrastsatz (schwer + explosiv) markiert.

const WARMUP = [
  {
    title: "Puls hoch & mobilisieren",
    rows: [
      ["Cardio of Choice", "5 Min."],
    ],
  },
  {
    title: "Aktivierung",
    rows: [
      ["Deep Body Weight Squat with Hold", "10 Wdh."],
      ["Knee Over Toe Lunges", "10 Wdh. pro Seite"],
      ["Cossack Squats", "10 Wdh. pro Seite"],
      ["Open The Gate", "10 Wdh. pro Seite"],
      ["Band Pull Apart", "10 Wdh."],
      ["Arm Circles", "15 Wdh."],
      ["Inch Worms", "5 Wdh."],
      ["Thread The Needle", "8 Wdh. pro Seite"],
      ["Spiderman with Thoracic Action", "8 Wdh. pro Seite"],
    ],
  },
  {
    title: "Explosiv machen",
    rows: [
      ["Pogo Jumps", "30 Sek."],
      ["A Skip", "10 Wdh. pro Seite"],
      ["B Skip", "10 Wdh. pro Seite"],
      ["High Kicks with Alternating Toe Touch", "10 Wdh. pro Seite"],
      ["Heel Flick", "30 Sek."],
      ["Broad Jumps", "10 Wdh."],
    ],
  },
];

// Einheit A + C: Krafteinheiten
// Spalten: Übung, Equipment, Sätze, Wdh., 1RM %, Pause
const EINHEIT_A = {
  rows: [
    { ex: "Front Squats - BW Jump Squats", eq: "Langhantel + Körpergewicht", sets: "4", reps: "5-8", rm: "80-85 %", rest: "3 Min.", contrast: true },
    { ex: "Incline Chest Press – Band Assisted Push Ups", eq: "Kurzhantel + Widerstandsband", sets: "4", reps: "5-8", rm: "80-85 %", rest: "3 Min.", contrast: true },
    { ex: "Ring Rows", eq: "Turnringe", sets: "4", reps: "5-8", rm: "80-85 %", rest: "3 Min." },
    { ex: "MB Chest Pass", eq: "Medizinball", sets: "3", reps: "5-8", rm: "–", rest: "90 Sek." },
    { ex: "Landmine Rotations", eq: "Langhantel", sets: "3", reps: "8-12", rm: "65-70 %", rest: "90 Sek." },
    { ex: "Banded Triceps Extensions", eq: "Widerstandsband", sets: "3", reps: "8-12", rm: "65-70 %", rest: "90 Sek." },
  ],
  finisher: { title: "Airbike-Finisher", rounds: "8 Runden", work: "15 Sek. Sprint", rest: "45 Sek. aktive Pause" },
};

const EINHEIT_C = {
  rows: [
    { ex: "Hex Bar Deadlift - BW Broad Jumps", eq: "Hex Bar + Körpergewicht", sets: "4", reps: "5-8", rm: "80-85 %", rest: "3 Min.", contrast: true },
    { ex: "KB Leg Raises - Banded Knee Raises", eq: "Kettlebell + Widerstandsband", sets: "3", reps: "5-8", rm: "80-85 %", rest: "3 Min.", contrast: true },
    { ex: "Barbell Push Press", eq: "Langhantel", sets: "4", reps: "5-8", rm: "80-85 %", rest: "3 Min." },
    { ex: "Band Assisted Pull Ups (Underhand Grip)", eq: "Widerstandsband", sets: "4", reps: "5-8", rm: "80-85 %", rest: "3 Min." },
    { ex: "Ab Rollout", eq: "Ab Wheel", sets: "3", reps: "8-12", rm: "–", rest: "90 Sek." },
    { ex: "MB Overhead Slams", eq: "Medizinball", sets: "3", reps: "5-8", rm: "–", rest: "90 Sek." },
  ],
  finisher: { title: "Airbike-Finisher", rounds: "8-10 Runden", work: "20 Sek. Sprint", rest: "10 Sek. Pause" },
};

// Einheit B: Circuit, zwei Varianten zur Wahl
const EINHEIT_B = {
  emom: {
    rounds: 6,
    rows: [
      { ex: "KB Swings", eq: "Kettlebell", reps: "10-15" },
      { ex: "Push Ups", eq: "Körpergewicht", reps: "10-15" },
      { ex: "Squat Thrusters", eq: "Kettlebell", reps: "8-12" },
      { ex: "Gorilla Rows", eq: "Kettlebell", reps: "10-15" },
      { ex: "Goblet Squats", eq: "Kettlebell", reps: "8-12" },
    ],
  },
  amrap: {
    rounds: 5,
    work: "60 Sek.",
    rest: "15 Sek.",
    roundRest: "2 Min.",
    rows: [
      { ex: "Jump Step Ups", eq: "Körpergewicht" },
      { ex: "Hindu-Push Ups", eq: "Körpergewicht" },
      { ex: "Jump Squats", eq: "Körpergewicht" },
      { ex: "Explosive Banded Rows", eq: "Widerstandsband" },
      { ex: "Check - Teep", eq: "Körpergewicht" },
    ],
  },
  ladder: { rounds: 3, drills: ["In & Out", "Lateral Quick Steps", "Ali Shuffle", "Single-Leg Quick Steps"] },
};

// Bonus: Stretching (Übung, Körperpartie, Ausführung, Zeit in Sekunden)
const STRETCHING = [
  ["Seated Knee Press", "Leiste, Innenschenkel", "Druck nach unten", 60],
  ["Seated Single Leg Fold", "Hintere Oberschenkel, unterer Rücken", "Vorbeugen, linkes Bein", 60],
  ["Seated Single Leg Fold", "Hintere Oberschenkel, unterer Rücken", "Vorbeugen, rechtes Bein", 60],
  ["Seated Box Splits", "Hintere Oberschenkel, Hüfte, Innenschenkel", "Vorbeugen, Mitte", 60],
  ["Seated Box Splits", "Hintere Oberschenkel, Hüfte, Innenschenkel", "Diagonal, links", 60],
  ["Seated Box Splits", "Hintere Oberschenkel, Hüfte, Innenschenkel", "Diagonal, rechts", 60],
  ["Seated Box Splits", "Hintere Oberschenkel, Hüfte, Innenschenkel", "Tief vorbeugen, Mitte", 60],
  ["Seated Forward Fold", "Waden, hintere Oberschenkel, unterer Rücken", "Gerade nach vorne greifen", 60],
  ["Kneeling Box Split", "Leiste, Innenschenkel", "Zurücklehnen, auf den Händen", 30],
  ["Kneeling Box Split", "Leiste, Innenschenkel", "Zurücklehnen, auf den Ellbogen", 30],
  ["Kneeling Box Split", "Leiste, Innenschenkel", "Diagonal, links", 30],
  ["Kneeling Box Split", "Leiste, Innenschenkel", "Diagonal, rechts", 30],
  ["One Sided Box Split", "Leiste, hintere Oberschenkel, Innenschenkel", "Aufrecht halten, links", 30],
  ["One Sided Box Split", "Leiste, hintere Oberschenkel, Innenschenkel", "Vorbeugen, linkes Bein", 30],
  ["One Sided Box Split", "Leiste, hintere Oberschenkel, Innenschenkel", "Aufrecht halten, rechts", 30],
  ["One Sided Box Split", "Leiste, hintere Oberschenkel, Innenschenkel", "Vorbeugen, rechtes Bein", 30],
  ["Box Splits", "Hintere Oberschenkel, Hüfte, Innenschenkel", "Aufrecht halten, Mitte", 30],
  ["Box Splits", "Hintere Oberschenkel, Hüfte, Innenschenkel", "Nach unten sinken, Mitte", 30],
  ["Box Splits", "Hintere Oberschenkel, Hüfte, Innenschenkel", "Diagonal, links", 30],
  ["Box Splits", "Hintere Oberschenkel, Hüfte, Innenschenkel", "Diagonal, rechts", 30],
];

// Bonus: Hüftmobilität (Übung, Sätze, Wdh., Ausführung)
const HIP_MOBILITY = [
  ["Shin Box", "3", "10", "Sitzend, Fersen am Boden. Hüfte von Seite zu Seite rotieren, der Rücken bleibt gerade."],
  ["Shin Box with Hip Thrust", "3", "10", "Wie Shin Box, am Ende jeder Rotation die Hüfte nach vorne schieben."],
  ["S-Sit Switch", "3", "10", "Sitzend, ein Bein vorne angewinkelt, das andere gestreckt. Hüfte rotieren und fließend die Seite wechseln."],
  ["Hip Up To Combat Stance", "3", "10", "Sitzend, ein Bein angewinkelt. Über das Bein abrollen und die Hüfte nach vorne in die Kampfstellung drücken."],
  ["Squat To Knee Drop", "3", "10", "Aus der tiefen Hocke beide Knie kontrolliert zum Boden absenken."],
  ["Squat Hold To Internal Rotation", "3", "10", "In der 90-Grad-Hocke ein Bein nach innen rotieren, das Knie Richtung Boden. Seiten abwechseln."],
];

module.exports = { WARMUP, EINHEIT_A, EINHEIT_B, EINHEIT_C, STRETCHING, HIP_MOBILITY };
