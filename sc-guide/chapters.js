// Chapter list shared by the TOC, the dark divider pages and merge order.
const CHAPTERS = [
  {
    num: "01", title: "Grundlagen", icon: "book", file: "light-2",
    toc: "Ziele, Kraftübertragung, Verletzungsvorbeugung, Intensität und Progression",
    desc: "Bevor du loslegst: was Athletiktraining dir im Ring bringt, wie du Kraft richtig überträgst, wie du Verletzungen vorbeugst und wie du dich Woche für Woche steigerst.",
    items: ["Warum S&amp;C für Muay Thai?", "Kraft richtig übertragen", "Verletzungen vorbeugen", "Smartes vs. falsches S&amp;C", "Intensität richtig wählen", "So steigerst du dich"],
  },
  {
    num: "02", title: "Planung", icon: "layerGroup", file: "light-3",
    toc: "Drei Zeitmodelle und wie S&amp;C in deine Trainingswoche passt",
    desc: "Wie viel S&amp;C du wirklich brauchst und wie du es so in deine Woche einbaust, dass dein Muay-Thai-Training nicht darunter leidet.",
    items: ["Drei Zeitmodelle", "Deine Trainingswoche", "Training im Camp in Thailand"],
  },
  {
    num: "03", title: "Das Programm", icon: "weightLifting", file: "light-4",
    toc: "Warm-up und die drei Einheiten A, B und C mit allen Übungen",
    desc: "Ein Warm-up und drei kompakte Einheiten. Jede ist in 30 bis 45 Minuten erledigt und auf die Anforderungen im Ring ausgerichtet.",
    items: ["Warm-up", "Einheit A: Kraft &amp; Power", "Einheit B: Circuit", "Einheit C: Kraft &amp; Power"],
  },
  {
    num: "04", title: "Kondition", icon: "stopwatch", file: "light-5",
    toc: "Energiesysteme, Herzfrequenzzonen und gezielte Konditionsarbeit",
    desc: "Welche Ausdauer ein Kämpfer braucht, in welchen Herzfrequenzzonen du sie trainierst und was du neben dem Muay Thai gezielt ergänzt.",
    items: ["Die drei Energiesysteme", "Energiesysteme im Ring", "Herzfrequenzzonen", "Die Zonen im Detail", "Kondition gezielt ergänzen"],
  },
  {
    num: "+", label: "Bonus-Kapitel", title: "Mobilität", icon: "highKick", file: "light-6",
    toc: "Bonus: Stretching-Flow und Hüftmobilität für hohe Kicks",
    desc: "Hohe Kicks, ein tiefer Stand und schnelle Hüftrotation brauchen Beweglichkeit. Zwei Einheiten, die du flexibel an trainingsfreien Tagen oder nach dem Training einbaust.",
    items: ["Stretching", "Hüftmobilität"],
  },
];

module.exports = { CHAPTERS };
