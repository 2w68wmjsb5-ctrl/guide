// Pixel-game graphics: a village scene for the cover (sky follows the time
// of day) and small scenes for the overview cards. Everything is drawn at low
// resolution and scaled up with image-rendering: pixelated.
const Pixel = (() => {
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t));
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  // Sprites as text rows; each character maps to a color, "." is transparent
  function sprite(ctx, rows, colors, x, y, flip = false) {
    rows.forEach((row, dy) => [...row].forEach((ch, dx) => {
      const c = colors[ch];
      if (!c) return;
      rect(ctx, x + (flip ? row.length - 1 - dx : dx), y + dy, 1, 1, c);
    }));
  }

  function gradient(ctx, w, h, stops) {
    for (let y = 0; y < h; y++) {
      const t = (y / (h - 1)) * (stops.length - 1), i = Math.min(Math.floor(t), stops.length - 2);
      rect(ctx, 0, y, w, 1, mix(stops[i], stops[i + 1], t - i));
    }
  }

  // --- Sprites -------------------------------------------------------------

  const PERSON_A = [
    ".hhhh.",
    "hhhhhh",
    "hseseh",
    ".ssss.",
    ".cccc.",
    "sccccs",
    "sccccs",
    ".cccc.",
    ".pppp.",
    ".p..p.",
    ".b..b.",
  ];
  const PERSON_B = [
    ".hhhh.",
    "hhhhhh",
    "hseseh",
    "hssssh",
    "hcccch",
    "sccccs",
    ".cccc.",
    "cccccc",
    ".cccc.",
    ".s..s.",
    ".b..b.",
  ];
  const CAT = [
    "k.k.....",
    "kkk....k",
    "eke....k",
    ".kkkkkk.",
    ".k.k.k.k",
  ];
  const HEART = [
    ".rr.rr.",
    "rwrrrrr",
    "rrrrrrr",
    ".rrrrr.",
    "..rrr..",
    "...r...",
  ];
  const BAG = [
    "...oooo...",
    "....tt....",
    "...oooo...",
    "..obbbbo..",
    ".obbyybbo.",
    "obbybbbbBo",
    "obbbyybbBo",
    "obbbbbybBo",
    ".obyybbBo.",
    "..oooooo..",
  ];
  const COIN = [".yy.", "yYyy", "yyyo", ".oo."];
  const CHEST = [
    "..oooooooooo..",
    ".owwwwwwwwwwo.",
    "oWWWWWWWWWWWWo",
    "oggggggggggggo",
    "owwwwwgywwwwwo",
    "owwwwwggwwwwwo",
    "oWWWWWWWWWWWWo",
    "owwwwwwwwwwwwo",
    "oWWWWWWWWWWWWo",
    ".oooooooooooo.",
  ];

  const SKIES = {
    morning: { sky: ["#3b2a5c", "#d9788a", "#f7c98b"], hills: ["#5b6f8f", "#4d7a5a"], light: "#ffe6a8", night: false },
    day:     { sky: ["#3f86d9", "#78b7ef", "#bfe3ff"], hills: ["#7fa7c9", "#4f9a55"], light: "#fff4c4", night: false },
    evening: { sky: ["#2a1f4f", "#9b4a7a", "#f08a4b"], hills: ["#56406e", "#3f6a45"], light: "#ffb36b", night: false },
    night:   { sky: ["#070b1f", "#141c45", "#29346b"], hills: ["#1d2550", "#1b3a2c"], light: "#e9f0ff", night: true },
  };

  function phase(hour) {
    if (hour >= 5 && hour < 9) return "morning";
    if (hour >= 9 && hour < 17) return "day";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }

  // --- Cover: the family's little village ------------------------------------

  function tree(ctx, x, ground, size, r, dark) {
    const leaf = dark ? ["#1d4a2e", "#2a6a3a", "#3a7f45"] : ["#2f7a3b", "#46a04a", "#7cc95a"];
    rect(ctx, x - 1, ground - size * 0.6, 3, size * 0.6, dark ? "#3b2a22" : "#6b4428");
    const cy = ground - size * 0.75;
    for (let y = -size / 2; y <= size / 2; y++) {
      for (let dx = -size / 2; dx <= size / 2; dx++) {
        const d = (dx * dx + y * y * 1.3) / ((size / 2) ** 2);
        if (d > 1 + (r() - 0.5) * 0.2) continue;
        const shade = y < -size / 6 && dx < size / 6 ? 2 : d > 0.6 || y > size / 5 ? 0 : 1;
        rect(ctx, x + dx, cy + y, 1, 1, leaf[shade]);
      }
    }
  }

  function house(ctx, x, ground, night) {
    const w = 30, wallH = 15;
    const top = ground - wallH;
    // Chimney
    rect(ctx, x + 21, top - 13, 4, 8, "#7a4b3a");
    rect(ctx, x + 20, top - 14, 6, 2, "#5a3328");
    // Roof: stepped triangle with shingle rows
    for (let i = 0; i < 12; i++) {
      const y = top - 12 + i, inset = 12 - i;
      rect(ctx, x - 2 + inset, y, w + 4 - inset * 2, 1, i % 3 === 2 ? "#9c3b34" : "#c4524a");
    }
    rect(ctx, x - 3, top - 1, w + 6, 1, "#7d2e29");
    // Walls with plank lines
    rect(ctx, x, top, w, wallH, "#f1dfbf");
    for (let y = top + 3; y < ground; y += 4) rect(ctx, x, y, w, 1, "#dcc49e");
    rect(ctx, x + w - 2, top, 2, wallH, "#d4b88f");
    // Door
    rect(ctx, x + 12, ground - 9, 6, 9, "#6b3f24");
    rect(ctx, x + 13, ground - 8, 4, 8, "#8a5530");
    rect(ctx, x + 16, ground - 5, 1, 1, "#f2c94c");
    // Windows, lit at night
    for (const wx of [x + 3, x + 21]) {
      rect(ctx, wx, top + 3, 6, 6, "#5a3a26");
      rect(ctx, wx + 1, top + 4, 4, 4, night ? "#ffd66e" : "#8fd0ff");
      rect(ctx, wx + 3, top + 4, 1, 4, "#5a3a26");
      rect(ctx, wx + 1, top + 6, 4, 1, "#5a3a26");
      rect(ctx, wx, top + 9, 6, 1, "#7a4f33");
      rect(ctx, wx + 1, top + 10, 1, 1, "#ef7aa8");
      rect(ctx, wx + 4, top + 10, 1, 1, "#f2c94c");
    }
    if (night) {
      ctx.globalAlpha = 0.18;
      rect(ctx, x + 1, top + 2, 10, 10, "#ffd66e");
      rect(ctx, x + 19, top + 2, 10, 10, "#ffd66e");
      ctx.globalAlpha = 1;
    }
  }

  function cover(canvas, hour, seed = 4) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height, r = rng(seed);
    const s = SKIES[phase(hour)];
    const ground = h - 11, cx = Math.floor(w / 2);
    gradient(ctx, w, ground, s.sky);

    if (s.night) {
      for (let i = 0; i < w / 3; i++) {
        ctx.globalAlpha = 0.4 + r() * 0.6;
        rect(ctx, r() * w, r() * ground * 0.7, 1, 1, "#ffffff");
      }
      ctx.globalAlpha = 1;
      sprite(ctx, [".mmm.", "mmm..", "mm...", "mmm..", ".mmm."], { m: "#f4f1d0" }, cx + 70, 6);
    } else {
      const sunX = phase(hour) === "morning" ? cx - 90 : phase(hour) === "evening" ? cx + 95 : cx + 60;
      for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) {
        if (x * x + y * y <= 17) rect(ctx, sunX + x, 10 + y, 1, 1, s.light);
      }
      // Clouds
      for (let i = 0; i < 6; i++) {
        const x = r() * w, y = 4 + r() * 14, len = 8 + Math.floor(r() * 10);
        rect(ctx, x, y, len, 2, "#ffffff");
        rect(ctx, x + 2, y - 1, len - 5, 1, "#ffffff");
        rect(ctx, x + 1, y + 2, len - 2, 1, mix("#ffffff", s.sky[1], 0.4));
      }
      // Birds
      for (let i = 0; i < 3; i++) {
        const x = cx - 40 + i * 9 + r() * 4, y = 8 + r() * 6;
        rect(ctx, x, y, 1, 1, "#2b2b3a"); rect(ctx, x + 1, y + 1, 1, 1, "#2b2b3a"); rect(ctx, x + 2, y, 1, 1, "#2b2b3a");
      }
    }

    // Two rows of rolling hills
    s.hills.forEach((color, i) => {
      const base = ground - (i ? 6 : 14), amp = i ? 4 : 6, freq = i ? 0.05 : 0.03;
      for (let x = 0; x < w; x++) {
        const y = Math.round(base - amp * Math.sin(x * freq + i * 2 + seed));
        rect(ctx, x, y, 1, ground - y, color);
      }
    });

    // Trees, back to front
    for (const [dx, size] of [[-150, 13], [-118, 10], [-64, 15], [52, 12], [104, 16], [146, 11]]) {
      tree(ctx, cx + dx, ground, size, r, s.night);
    }
    house(ctx, cx - 15, ground, s.night);

    // Fence
    for (let x = cx - 60; x < cx - 22; x += 4) rect(ctx, x, ground - 5, 1, 5, "#8a5a34");
    rect(ctx, cx - 60, ground - 4, 38, 1, "#a8703f");
    rect(ctx, cx - 60, ground - 2, 38, 1, "#a8703f");

    // Ground: grass edge, dirt with pebbles, a path to the door
    rect(ctx, 0, ground, w, h - ground, "#7a5232");
    rect(ctx, 0, ground, w, 2, s.night ? "#2f5e33" : "#5cb84f");
    rect(ctx, 0, ground + 2, w, 1, s.night ? "#244a29" : "#3f9443");
    for (let i = 0; i < w / 3; i++) rect(ctx, r() * w, ground + 4 + r() * (h - ground - 4), 1, 1, r() < 0.5 ? "#5e3d24" : "#94693f");
    rect(ctx, cx - 3, ground, 6, h - ground, "#c9a46b");
    for (let i = 0; i < w / 5; i++) {
      const x = r() * w;
      if (Math.abs(x - cx) < 6) continue;
      rect(ctx, x, ground - 1, 1, 1, s.night ? "#3f7a43" : "#7cd25d");
      if (r() < 0.25) rect(ctx, x, ground - 2, 1, 1, ["#ef7aa8", "#f2c94c", "#ffffff"][Math.floor(r() * 3)]);
    }

    // The family
    sprite(ctx, PERSON_A, { h: "#4a2e1f", s: "#f2c39b", e: "#2b2b3a", c: "#3f7fd6", p: "#36405e", b: "#2b2b3a" }, cx + 22, ground - 11);
    sprite(ctx, PERSON_B, { h: "#c2702f", s: "#f2c39b", e: "#2b2b3a", c: "#d65f8a", b: "#2b2b3a" }, cx + 30, ground - 11, true);
    sprite(ctx, HEART, { r: "#e5534b", w: "#ffb3ad" }, cx + 26, ground - 20);
    sprite(ctx, CAT, { k: "#3a3a46", e: "#f2c94c" }, cx - 34, ground - 5);

    if (s.night) {
      for (let i = 0; i < 10; i++) {
        ctx.globalAlpha = 0.5 + r() * 0.5;
        rect(ctx, r() * w, ground - 4 - r() * 20, 1, 1, "#d8ff8a");
      }
      ctx.globalAlpha = 1;
    }
  }

  // --- Card scenes -----------------------------------------------------------

  function tiles(ctx, w, h, a, b, size = 4) {
    for (let y = 0; y < h; y += size) for (let x = 0; x < w; x += size) {
      rect(ctx, x, y, size, size, ((x + y) / size) % 2 ? a : b);
    }
  }

  const SCENES = {
    // Income: a bag of gold in a cave
    gold(ctx, w, h, r) {
      tiles(ctx, w, h, "#2b2d3f", "#30334a");
      for (let i = 0; i < 12; i++) rect(ctx, r() * w, r() * h * 0.6, 2, 1, "#3d4160");
      rect(ctx, 0, h - 5, w, 5, "#3a2b24");
      rect(ctx, 0, h - 5, w, 1, "#5a4234");
      const bx = Math.floor(w / 2) - 5;
      sprite(ctx, BAG, { o: "#4a2e1f", b: "#d8a65e", B: "#b07f3d", y: "#f2c94c", t: "#8a5530" }, bx, h - 14);
      const coin = { y: "#f2c94c", Y: "#fff3b0", o: "#b07f1a" };
      for (const [dx, dy] of [[-12, -4], [-8, -4], [-10, -7], [8, -4], [12, -4], [10, -7], [14, -8]]) {
        sprite(ctx, COIN, coin, Math.floor(w / 2) + dx, h + dy - 1);
      }
      for (let i = 0; i < 5; i++) rect(ctx, r() * w, 3 + r() * 8, 1, 1, "#fff3b0");
    },
    // Expenses: a market stall
    market(ctx, w, h) {
      gradient(ctx, w, h, ["#7fb7ef", "#cfe9ff"]);
      rect(ctx, 0, h - 4, w, 4, "#5cb84f");
      rect(ctx, 0, h - 2, w, 2, "#7a5232");
      const x0 = Math.floor(w / 2) - 16;
      for (let i = 0; i < 8; i++) rect(ctx, x0 + i * 4, 4, 4, 5, i % 2 ? "#ffffff" : "#e5534b");
      for (let i = 0; i < 8; i++) rect(ctx, x0 + i * 4 + 1, 9, 2, 1, i % 2 ? "#ffffff" : "#e5534b");
      rect(ctx, x0 + 1, 10, 1, h - 14, "#6b4428");
      rect(ctx, x0 + 30, 10, 1, h - 14, "#6b4428");
      rect(ctx, x0, h - 10, 32, 6, "#a8703f");
      rect(ctx, x0, h - 10, 32, 1, "#c98d55");
      for (let i = 0; i < 5; i++) {
        rect(ctx, x0 + 3 + i * 3, h - 12, 2, 2, "#e5534b");
        rect(ctx, x0 + 18 + i * 3, h - 12, 2, 2, i % 2 ? "#f2c94c" : "#7cd25d");
      }
      rect(ctx, x0 + 12, 12, 8, 4, "#f1dfbf");
      rect(ctx, x0 + 13, 13, 6, 1, "#6b4428");
    },
    // Left over: a treasure chest on grass
    chest(ctx, w, h, r) {
      gradient(ctx, w, h - 6, ["#29346b", "#56406e"]);
      for (let i = 0; i < 14; i++) rect(ctx, r() * w, r() * (h - 10), 1, 1, "#ffffff");
      rect(ctx, 0, h - 6, w, 6, "#3f9443");
      rect(ctx, 0, h - 6, w, 1, "#5cb84f");
      const x = Math.floor(w / 2) - 7;
      sprite(ctx, CHEST, { o: "#3b2416", w: "#a8703f", W: "#8a5530", g: "#f2c94c", y: "#fff3b0" }, x, h - 14);
      for (const [dx, dy] of [[-2, -3], [16, -1], [7, -5], [12, -6]]) {
        rect(ctx, x + dx, h - 14 + dy, 1, 1, "#fff3b0");
      }
    },
    // Still due: a notice board with pinned notes
    board(ctx, w, h) {
      tiles(ctx, w, h, "#5a3a26", "#634029", 3);
      for (let y = 2; y < h; y += 6) rect(ctx, 0, y, w, 1, "#4a2e1f");
      const notes = [[6, 4, "#f1dfbf"], [20, 6, "#fff3b0"], [33, 3, "#cfe9ff"]];
      for (const [x, y, c] of notes) {
        rect(ctx, x, y, 10, 13, c);
        for (let l = 0; l < 4; l++) rect(ctx, x + 2, y + 4 + l * 2, 6 - (l % 2) * 2, 1, "#8a7a6a");
        rect(ctx, x + 4, y, 2, 2, "#e5534b");
      }
    },
  };

  function scene(canvas, name, seed = 1) {
    const ctx = canvas.getContext("2d");
    SCENES[name](ctx, canvas.width, canvas.height, rng(seed));
  }

  // 16x16 page icon: the house from the cover
  function icon(canvas) {
    const ctx = canvas.getContext("2d");
    sprite(ctx, [
      "................",
      ".......rr.......",
      "......rRRr..cc..",
      ".....rRRRRr.cc..",
      "....rRRRRRRrcc..",
      "...rRRRRRRRRr...",
      "..rRRRRRRRRRRr..",
      ".dddddddddddddd.",
      "..wwwwwwwwwwww..",
      "..wggwwwwwwggw..",
      "..wggwwddwwggw..",
      "..wwwwwddwwwww..",
      "..wwwwwdywwwww..",
      "..wwwwwddwwwww..",
      "GGGGGGGGGGGGGGGG",
      "bbbbbbbbbbbbbbbb",
    ], { r: "#9c3b34", R: "#c4524a", d: "#7d2e29", c: "#7a4b3a", w: "#f1dfbf", g: "#ffd66e",
         y: "#f2c94c", G: "#5cb84f", b: "#7a5232" }, 0, 0);
    ctx.fillStyle = "#6b3f24";
    ctx.fillRect(7, 10, 2, 4);
    ctx.fillStyle = "#f2c94c";
    ctx.fillRect(8, 12, 1, 1);
  }

  return { cover, scene, icon, phase };
})();
