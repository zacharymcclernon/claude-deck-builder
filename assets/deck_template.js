// ============================================================================
// Deck generator — starting template
//
//   npm install pptxgenjs
//   node build_deck.js            # build
//   node build_deck.js --force    # build even if the .pptx was edited by hand
//
// THIS SCRIPT IS THE SOURCE OF TRUTH. The .pptx is a build artifact — anything
// typed into PowerPoint is lost on the next build. The guard below turns that
// into an error instead of silent data loss.
//
// The slides below are INDEPENDENT EXAMPLES, not a required sequence. Each is
// in its own { } block so you can reorder, duplicate, or delete any of them.
// Keep the ones whose shape fits your content; throw away the rest. The full
// menu of layouts lives in reference/slide-patterns.md.
//
// Design: flat. No drop shadows, no rounded corners, no gradients. Structure
// comes from hairline rules, whitespace, and left accent bars. To change the
// whole look — colors and fonts — edit the THEME block below and nothing else.
// ============================================================================

const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------- EDIT THIS
const OUT      = "./My_Deck.pptx";
const AUTHOR   = "Your Name";
const DOCTITLE = "Deck title for file metadata";
// ---------------------------------------------------------------------------

/* ===========================================================================
   THEME — the only block you edit to re-skin the whole deck.
   Ships with the Salesforce Lightning Design System palette and Salesforce
   Sans. Swap the hex values and font names for any brand; the primitives and
   slides below all read from here, so nothing else has to change.

   Colors are named by ROLE, not by hue, so the semantics survive a re-skin:
     accent      the through-line. Primary brand color, used on most slides.
     warn        a gap, a risk, the thing to flag. Use sparingly or it stops
                 meaning anything.
     good        confirmed, measured, positive, done.
     alt         an optional neutral third category when you need one.
     dark        dark-slide background and heading color.
   The *Wash colors are the palest tint of each — for fills behind text.
   --------------------------------------------------------------------------- */
const THEME = {
  fonts: {
    sans: "Salesforce Sans", // fallback below is used if it isn't installed
    fallback: "Arial",
  },
  colors: {
    // Structure / brand
    dark:        "032D60", // headings, dark-slide background
    darker:      "001639", // deepest shade
    accent:      "0176D3", // primary brand accent
    accentBright:"1B96FF", // brighter accent, reads on dark backgrounds
    accentSoft:  "CFE9FE", // body text on dark backgrounds
    accentWash:  "EAF5FE", // band fills, table-header fill
    // Signal
    warn:        "D83A00", warnWash: "FEF1ED",
    good:        "2E844A", goodWash: "EBF7EE",
    alt:         "5867E8", altWash:  "F1F0FF",
    // Neutrals
    ink:         "181818", // body copy
    muted:       "747474", // captions, footnotes
    rule:        "E5E5E5", // hairlines
    tint:        "F3F3F3", // subtle fills
    white:       "FFFFFF",
    dimOnDark:   "8CA9C9", // muted text on dark
    ruleOnDark:  "1B4D80", // hairline on dark
  },
};

/* Short aliases so the primitives below stay readable. */
const C    = THEME.colors;
const FONT = THEME.fonts.sans;

/* Refuse to clobber hand edits made in PowerPoint. */
(function guard() {
  if (process.argv.includes("--force")) return;
  if (!fs.existsSync(OUT)) return;
  const deck = fs.statSync(OUT).mtimeMs;
  const src = fs.statSync(__filename).mtimeMs;
  if (deck > src + 2000) {
    const mins = Math.round((deck - src) / 60000);
    console.error(
      "\n  REFUSING TO BUILD\n\n" +
      `  ${path.basename(OUT)} was modified ${mins} minute(s) after this script.\n` +
      "  Something edited the deck directly, and those changes are not in the script.\n" +
      "  Building now would discard them.\n\n" +
      "  Either port the changes into this script, or run:\n" +
      `      node ${path.basename(__filename)} --force\n`
    );
    process.exit(1);
  }
})();

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
pres.author = AUTHOR;
pres.title = DOCTITLE;

const W  = 13.33;      // slide width
const H  = 7.5;        // slide height
const M  = 0.7;        // page margin
const CW = W - M * 2;  // content width, 11.93

/* ---------------------------------------------------------------------------
   PRIMITIVES — the building blocks every slide is made of. Brand-neutral;
   they read colors and fonts from THEME.
   --------------------------------------------------------------------------- */

/** Horizontal hairline. Defaults to full content width at the page margin. */
function hrule(s, y, x, w, color, pt) {
  s.addShape(pres.ShapeType.rect, {
    x: x === undefined ? M : x, y: y,
    w: w === undefined ? CW : w, h: (pt || 0.75) / 72,
    fill: { color: color || C.rule }, line: { width: 0 }
  });
}

/** Vertical hairline — use between columns instead of boxing them. */
function vrule(s, x, y, h, color) {
  s.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 0.008, h: h,
    fill: { color: color || C.rule }, line: { width: 0 }
  });
}

/** Left accent bar. The workhorse: marks a block without drawing a box. */
function accent(s, x, y, h, color) {
  s.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 0.045, h: h,
    fill: { color: color || C.accent }, line: { width: 0 }
  });
}

/**
 * Standard slide header: small-caps kicker, a title, optional subtitle,
 * closed with a hairline. The title should say the point, not name a topic.
 *   header(s, "SECTION", "The title, stated as the takeaway", "Supporting line.")
 */
function header(s, kick, title, sub, kickColor) {
  if (kick) {
    s.addText(kick.toUpperCase(), {
      x: M, y: 0.4, w: CW, h: 0.24,
      fontFace: FONT, fontSize: 9.5, bold: true, color: kickColor || C.accent,
      charSpacing: 2.2, margin: 0, valign: "middle"
    });
  }
  s.addText(title, {
    x: M, y: 0.66, w: CW, h: 0.52,
    fontFace: FONT, fontSize: 25, bold: true, color: C.dark, margin: 0, valign: "middle"
  });
  if (sub) {
    s.addText(sub, {
      x: M, y: 1.18, w: CW, h: 0.3,
      fontFace: FONT, fontSize: 13, color: C.muted, margin: 0, valign: "middle"
    });
    hrule(s, 1.64);
  } else {
    hrule(s, 1.36);
  }
}

/** Page number, plus an optional footnote for caveats and sourcing. */
function footer(s, n, note) {
  if (note) {
    s.addText(note, {
      x: M, y: 6.88, w: CW - 1.0, h: 0.26,
      fontFace: FONT, fontSize: 8.5, color: C.muted, margin: 0, valign: "middle"
    });
  }
  s.addText(String(n), {
    x: W - M - 0.5, y: 6.88, w: 0.5, h: 0.26,
    fontFace: FONT, fontSize: 8.5, color: C.muted, align: "right", margin: 0, valign: "middle"
  });
}

/**
 * Full-width statement band — the loudest element available. Use it a couple
 * of times in a deck, no more. `dark: true` for a filled dark band.
 */
function band(s, y, lead, support, dark) {
  const h = support ? 1.12 : 0.68;
  s.addShape(pres.ShapeType.rect, {
    x: M, y: y, w: CW, h: h,
    fill: { color: dark ? C.dark : C.accentWash }, line: { width: 0 }
  });
  if (!dark) accent(s, M, y, h, C.accent);
  s.addText(lead, {
    x: M + 0.34, y: y + (support ? 0.14 : 0), w: CW - 0.68, h: support ? 0.36 : h,
    fontFace: FONT, fontSize: 14.5, bold: true,
    color: dark ? C.white : C.dark, margin: 0, valign: "middle"
  });
  if (support) {
    s.addText(support, {
      x: M + 0.34, y: y + 0.52, w: CW - 0.68, h: 0.5,
      fontFace: FONT, fontSize: 12, color: dark ? C.accentSoft : C.ink, margin: 0, valign: "top"
    });
  }
}

/** Big number with a caption under it. For stat rows. */
function stat(s, x, y, w, value, label, color) {
  s.addText(value, {
    x: x, y: y, w: w, h: 0.6,
    fontFace: FONT, fontSize: 32, bold: true, color: color || C.accent, margin: 0, valign: "middle"
  });
  s.addText(label, {
    x: x, y: y + 0.64, w: w - 0.2, h: 0.66,
    fontFace: FONT, fontSize: 10.5, color: C.muted, margin: 0, valign: "top"
  });
}

/** Left-edge double stripe for dark slides. */
function darkEdge(s) {
  s.addShape(pres.ShapeType.rect, { x: 0,    y: 0, w: 0.16, h: H, fill: { color: C.accent },       line: { width: 0 } });
  s.addShape(pres.ShapeType.rect, { x: 0.16, y: 0, w: 0.06, h: H, fill: { color: C.accentBright }, line: { width: 0 } });
}

/* Table borders: horizontal rules only, no verticals. */
const TBL_BORDER = [
  { pt: 0.75, color: C.rule }, { pt: 0, color: C.white },
  { pt: 0.75, color: C.rule }, { pt: 0, color: C.white }
];

/** Table header row with a tinted fill. */
function tableHead(cells) {
  return cells.map((h) => ({
    text: h,
    options: {
      bold: true, color: C.dark, fontSize: 10.5, fill: { color: C.accentWash },
      charSpacing: 0.6, valign: "middle", margin: [7, 10, 7, 10]
    }
  }));
}

/** Table body row. Pass `fill` to highlight one row. */
function tableRow(cells, fill) {
  return cells.map((c, i) => ({
    text: c,
    options: {
      bold: i === 0, color: i === 0 ? C.dark : C.ink, fontSize: i === 0 ? 12.5 : 11.5,
      fill: fill ? { color: fill } : undefined,
      valign: "middle", margin: [10, 10, 10, 10]
    }
  }));
}

/* ===========================================================================
   EXAMPLE — TITLE  (dark)
   One way to open. A light title slide works just as well; delete darkEdge and
   swap the background to white.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);

  s.addText("KICKER  ·  CONTEXT", {
    x: M, y: 1.7, w: CW, h: 0.26,
    fontFace: FONT, fontSize: 10, bold: true, color: C.accentSoft, charSpacing: 2.4, margin: 0
  });

  s.addText("The deck title", {
    x: M, y: 2.1, w: CW, h: 0.88,
    fontFace: FONT, fontSize: 40, bold: true, color: C.white, margin: 0, valign: "middle"
  });

  s.addText("One line saying what this is, in plain language.", {
    x: M, y: 3.02, w: 10.4, h: 0.42,
    fontFace: FONT, fontSize: 16, color: C.accentSoft, margin: 0, valign: "middle"
  });

  hrule(s, 3.78, M, 2.2, C.accentBright, 2.5);

  s.addText("Presenter Name   ·   Title", {
    x: M, y: 5.6, w: CW, h: 0.3,
    fontFace: FONT, fontSize: 12.5, color: C.white, margin: 0
  });
  s.addText("Date, or the occasion", {
    x: M, y: 5.92, w: CW, h: 0.3,
    fontFace: FONT, fontSize: 11, color: C.dimOnDark, margin: 0
  });

  s.addNotes(
    "What to say out loud when this slide is up — in your own voice, not bullet points.\n\n" +
    "Anything that must be confirmed before presenting goes here in caps so it's hard to miss."
  );
}

/* ===========================================================================
   EXAMPLE — RULED ROWS (two-column)
   A flexible workhorse: any set of paired items — before/after, term/definition,
   question/answer, area/detail. Not just problem/response.
   =========================================================================== */
{
  const s = pres.addSlide();
  header(s, "Section", "A title that states the point of the slide");

  s.addText("LEFT COLUMN LABEL", {
    x: M, y: 1.6, w: 5.6, h: 0.26,
    fontFace: FONT, fontSize: 9.5, bold: true, color: C.accent, charSpacing: 1.8, margin: 0, valign: "middle"
  });
  s.addText("RIGHT COLUMN LABEL", {
    x: M + 6.3, y: 1.6, w: 5.6, h: 0.26,
    fontFace: FONT, fontSize: 9.5, bold: true, color: C.accent, charSpacing: 1.8, margin: 0, valign: "middle"
  });

  const rows = [
    ["First item",  "One or two sentences of detail.",
     "Its pair",    "The matching detail on the right."],
    ["Second item", "Detail.", "Its pair", "Detail."],
    ["Third item",  "Detail.", "Its pair", "Detail."],
  ];

  let y = 1.94;
  rows.forEach((r) => {
    hrule(s, y);
    accent(s, M, y + 0.16, 1.16, C.accent);
    s.addText(r[0], {
      x: M + 0.22, y: y + 0.16, w: 5.3, h: 0.3,
      fontFace: FONT, fontSize: 13, bold: true, color: C.dark, margin: 0, valign: "middle"
    });
    s.addText(r[1], {
      x: M + 0.22, y: y + 0.48, w: 5.3, h: 0.72,
      fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top"
    });
    accent(s, M + 6.3, y + 0.16, 1.16, C.accent);
    s.addText(r[2], {
      x: M + 6.52, y: y + 0.16, w: 5.35, h: 0.3,
      fontFace: FONT, fontSize: 13, bold: true, color: C.dark, margin: 0, valign: "middle"
    });
    s.addText(r[3], {
      x: M + 6.52, y: y + 0.48, w: 5.35, h: 0.72,
      fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top"
    });
    y += 1.44;
  });
  hrule(s, y);

  footer(s, 2);
  s.addNotes("What to say. Where to slow down.");
}

/* ===========================================================================
   EXAMPLE — STAT ROW + PROSE
   Use when you have real numbers. Keep it to four; more reads as a dashboard.
   Mark anything unconfirmed with ° and footnote it.
   =========================================================================== */
{
  const s = pres.addSlide();
  header(s, "Section", "What the numbers show", "Where they came from, in one line.");

  const stats = [
    ["10",   "unit of the first\nnumber"],
    ["4–5",  "unit of the second\nnumber °"],
    ["~40%", "unit of the third\nnumber"],
    ["$0",   "the number that\nmakes the point"],
  ];
  const sw = CW / 4;
  stats.forEach((st, i) => {
    const x = M + i * sw;
    if (i > 0) vrule(s, x - 0.1, 1.96, 1.44);
    stat(s, x, 1.96, sw - 0.3, st[0], st[1]);
  });

  hrule(s, 3.5);

  s.addText(
    "A paragraph of context under the numbers. Plain sentences, no bullets — this is where you say what " +
    "the numbers mean. Keep it to four or five lines so it stays readable at the back of a room.",
    { x: M, y: 3.72, w: CW - 0.3, h: 1.1, fontFace: FONT, fontSize: 12.5, color: C.ink, margin: 0, valign: "top" }
  );

  band(s, 5.0,
    "The headline the numbers add up to.",
    "The second line — the implication, or an honest caveat.",
    true);

  footer(s, 3, "° This figure is unconfirmed and needs checking before presenting.");
  s.addNotes(
    "Lead with the outcome, then the number.\n\n" +
    "CONFIRM BEFORE PRESENTING: list every figure here that isn't verified."
  );
}

/* ===========================================================================
   EXAMPLE — CLOSING  (dark)
   Mirror the title so the deck feels bookended. Put the one thing you want
   remembered here, large.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);

  s.addText("IN CLOSING", {
    x: M, y: 2.4, w: CW, h: 0.26,
    fontFace: FONT, fontSize: 10, bold: true, color: C.accentSoft, charSpacing: 2.4, margin: 0
  });
  s.addText("The one line to leave in the room.", {
    x: M, y: 2.78, w: CW, h: 0.9,
    fontFace: FONT, fontSize: 30, bold: true, color: C.white, margin: 0, valign: "middle"
  });
  hrule(s, 3.9, M, 2.2, C.accentBright, 2.5);
  s.addText("A next step, a contact, or where to go from here.", {
    x: M, y: 4.12, w: 10.6, h: 0.5,
    fontFace: FONT, fontSize: 14, color: C.accentSoft, margin: 0, valign: "top"
  });

  s.addText("4", {
    x: W - M - 0.5, y: 6.88, w: 0.5, h: 0.26,
    fontFace: FONT, fontSize: 8.5, color: C.dimOnDark, align: "right", margin: 0, valign: "middle"
  });

  s.addNotes("End on the takeaway, then stop. Let it land.");
}

pres.writeFile({ fileName: OUT })
  .then((f) => console.log("WROTE", f, "—", pres.slides.length, "slides"));
