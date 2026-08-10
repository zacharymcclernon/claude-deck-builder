// ============================================================================
// Salesforce-branded deck generator — starting template
//
//   npm install pptxgenjs
//   node build_deck.js            # build
//   node build_deck.js --force    # build even if the .pptx was edited by hand
//
// THIS SCRIPT IS THE SOURCE OF TRUTH. The .pptx is a build artifact — anything
// typed into PowerPoint is lost on the next build. The guard below turns that
// into an error instead of silent data loss.
//
// ----------------------------------------------------------------------------
// THIS IS A BRAND-LOCKED TEMPLATE. It reproduces the Salesforce Corporate
// Template 2026. The BRAND block below is frozen on purpose: colors, fonts, the
// canvas size, the container radius, and the shadow are the brand standard and
// are NOT design choices you get to make. Do not edit BRAND. Do not introduce
// colors, fonts, gradients, or effects that aren't defined here. Compose slides
// from the primitives; that is where all of your freedom lives.
//
// What you DO decide: which layouts fit the content, the words, the order, the
// speaker notes. What you must NOT change: the palette, the two typefaces, the
// 20 x 11.25 canvas, the rounded-container radius, the blue drop shadow, or the
// logo lockups. See reference/brand-spec.md — it is the authority, not your eye.
// ============================================================================

const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { attachFitCheck } = require("./fitcheck"); // text-overflow guard

// ---------------------------------------------------------------- EDIT THIS
const OUT      = "./Salesforce_Deck.pptx";
const AUTHOR   = "Your Name";
const DOCTITLE = "Deck title for file metadata";
// ---------------------------------------------------------------------------

/* ===========================================================================
   BRAND — FROZEN. Do not edit. Do not add to. This is the Salesforce 2026
   corporate identity, transcribed from the brand-guideline slides embedded in
   the corporate template (Core blues, Extended palette, Fonts, Font scale,
   Shadow treatment). Every value below is a brand standard, not a preference.
   The whole point of this template is that these do not drift.
   =========================================================================== */
const BRAND = Object.freeze({
  // Canvas — the corporate template is 20 x 11.25 in (16:9), not 13.33 x 7.5.
  canvas: Object.freeze({ w: 20, h: 11.25, margin: 0.94 }),

  fonts: Object.freeze({
    // Titles, stats, category headers, short special treatments. Demi weight
    // ONLY — the brand forbids other weights and italics for this face.
    display: "Avant Garde Demi SFDC",
    // Body copy and any lengthy text. This is the workhorse.
    body:    "Salesforce Sans",
    // Rendered fallback when the brand fonts aren't installed. The template's
    // own theme falls back to Arial; matching that keeps reflow predictable.
    fallback: "Arial",
  }),

  colors: Object.freeze({
    // --- Core blues (the primary system) ------------------------------------
    eb15: "001E5B", // Electric Blue 15 — deepest navy; dark backgrounds
    eb20: "002775", // Electric Blue 20 — type on light, deep headings
    eb30: "022AC0", // Electric Blue 30 — containers, secondary dark ground
    eb50: "066AFE", // Electric Blue 50 — THE Salesforce Blue. Primary accent.
    cb68: "00B3FF", // Cloud Blue 68  — logo blue / bright accent on dark
    cb80: "90D0FE", // Cloud Blue 80  — soft accent, body text on dark
    cb90: "CFE9FE", // Cloud Blue 90  — light slide background
    cb95: "EAF5FE", // Cloud Blue 95  — palest wash, container ground on white

    // --- Extended palette (secondary — accents only, never the primary blue) -
    teal:   "04E1CB", tealDeep: "06A59A", tealDark: "023434", tealWash: "DEF9F3",
    yellow: "FCC003", yellowDeep: "E4A201", yellowDark: "4F2100", yellowWash: "FBF3E0",
    pink:   "FF538A", pinkDeep: "B60554", pinkDark: "61022A", pinkWash: "FEF0F3",
    violet: "D17DFE", violetDeep: "730394", violetDark: "481A54", violetWash: "F9F0FF",

    // --- Neutrals -----------------------------------------------------------
    ink:   "181818", // body copy on light
    muted: "59575C", // captions, footnotes, labels
    rule:  "D8DDE6", // hairlines
    white: "FFFFFF",
  }),

  // Rounded containers — the corporate template uses ~12.5% corner radius on
  // white cards and 50% (pill) on CTA buttons. radius() below applies these.
  radius: Object.freeze({ card: 0.125, pill: 0.5 }),

  // The one, specific brand shadow: Electric Blue 50 at 15% opacity, applied to
  // white containers and CTAs sitting on white or light-blue grounds. Do not
  // substitute a black shadow — the brand shadow is blue.
  shadow: Object.freeze({
    type: "outer", color: "066AFE", opacity: 0.15, blur: 28, offset: 7.5, angle: 75,
  }),

  // Type scale, in points, straight from the brand "Font scale" guideline.
  type: Object.freeze({
    coverTitle: 54, // Avant Garde
    title:      40, // Avant Garde — slide titles
    subtitle:   28, // Salesforce Sans
    category:   26, // Avant Garde — section / card headers
    body:       22, // Salesforce Sans — primary body
    detail:     18, // Salesforce Sans — secondary detail
    caption:    14, // Salesforce Sans — captions, footer
    kicker:     16, // Salesforce Sans, tracked — eyebrow labels
    stat:       54, // Avant Garde — big numbers
  }),
});

/* Short aliases so the primitives below stay readable. */
const C  = BRAND.colors;
const DF = BRAND.fonts.display; // display / titles
const BF = BRAND.fonts.body;    // body
const T  = BRAND.type;
const LOGO       = path.join(__dirname, "brand", "salesforce-logo.png");        // color, for light grounds
const LOGO_WHITE = path.join(__dirname, "brand", "salesforce-logo-white.png");  // reverse, for blue/navy grounds
const LOGO_AR    = 1960 / 1372; // width / height of the logo asset

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
pres.defineLayout({ name: "SF_WIDE", width: BRAND.canvas.w, height: BRAND.canvas.h });
pres.layout = "SF_WIDE";
pres.author = AUTHOR;
pres.title = DOCTITLE;
pres.theme = { headFontFace: DF, bodyFontFace: BF };

// Text-fit guard: records every addText() so we can flag boxes that overflow
// into the content below them. Reported at the end, before writeFile. It's an
// estimate — the exact check is still opening the file — but it catches real
// collisions on every build. bodyDefault matches the brand body size.
const fit = attachFitCheck(pres, { bodyDefault: T.body });

const W  = BRAND.canvas.w;       // 20
const H  = BRAND.canvas.h;       // 11.25
const M  = BRAND.canvas.margin;  // 0.94
const CW = W - M * 2;            // content width, 18.12

/* ---------------------------------------------------------------------------
   PRIMITIVES — the only building blocks you should use. They encode the brand
   so individual slides can't drift from it. Reach for these; don't hand-roll
   shapes with your own colors, radii, or shadows.
   --------------------------------------------------------------------------- */

/** Corner radius for a container of the given short side, per brand spec. */
function radius(shortSideIn, kind) {
  return shortSideIn * (kind === "pill" ? BRAND.radius.pill : BRAND.radius.card);
}

/** A fresh copy of the brand shadow. pptxgenjs mutates the shadow object it's
 *  given, so it can't receive the frozen BRAND.shadow directly. */
function brandShadow() {
  return { ...BRAND.shadow };
}

/** Place the Salesforce cloud logo. variant "color" (light grounds) | "white"
 *  (blue/navy grounds). Give a width; height is locked to the logo aspect. */
function logo(s, x, y, w, variant) {
  s.addImage({
    path: variant === "white" ? LOGO_WHITE : LOGO,
    x, y, w, h: w / LOGO_AR,
  });
}

/** Horizontal hairline. Full content width at the margin by default. */
function hrule(s, y, x, w, color, pt) {
  s.addShape(pres.ShapeType.rect, {
    x: x === undefined ? M : x, y,
    w: w === undefined ? CW : w, h: (pt || 1) / 72,
    fill: { color: color || C.rule }, line: { type: "none" },
  });
}

/** White rounded container carrying the brand blue shadow. THE workhorse for
 *  content on light grounds — the corporate template builds nearly everything
 *  out of these. Pass fill to override white (e.g. C.cb95 for a tinted card). */
function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: radius(Math.min(w, h), "card"),
    fill: { color: fill || C.white }, line: { type: "none" },
    shadow: brandShadow(),
  });
}

/** Pill CTA button — blue fill, white label, brand shadow. */
function cta(s, x, y, w, h, label) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: radius(h, "pill"),
    fill: { color: C.eb50 }, line: { type: "none" }, shadow: brandShadow(),
  });
  s.addText(label, {
    x, y, w, h, align: "center", valign: "middle",
    fontFace: BF, fontSize: T.detail, bold: true, color: C.white, margin: 0,
  });
}

/**
 * Standard slide header: an optional tracked kicker, then the title in Avant
 * Garde. The title should state the point, not name a topic. Closed with a
 * blue hairline. Colors flip for dark grounds via `onDark`.
 */
function header(s, kicker, title, onDark) {
  const titleColor = onDark ? C.white : C.eb20;
  const kickColor  = onDark ? C.cb80 : C.eb50;
  if (kicker) {
    s.addText(kicker.toUpperCase(), {
      x: M, y: 0.7, w: CW, h: 0.4,
      fontFace: BF, fontSize: T.kicker, bold: true, color: kickColor,
      charSpacing: 3, margin: 0, valign: "middle",
    });
    s.addText(title, {
      x: M, y: 1.14, w: CW, h: 0.9,
      fontFace: DF, fontSize: T.title, color: titleColor, margin: 0, valign: "middle",
    });
    hrule(s, 2.16, M, 2.6, C.eb50, 3);
  } else {
    s.addText(title, {
      x: M, y: 0.82, w: CW, h: 0.9,
      fontFace: DF, fontSize: T.title, color: titleColor, margin: 0, valign: "middle",
    });
    hrule(s, 1.84, M, 2.6, C.eb50, 3);
  }
}

/** Page number, plus an optional footnote for caveats and sourcing. */
function footer(s, n, note, onDark) {
  const col = onDark ? C.cb80 : C.muted;
  if (note) {
    s.addText(note, {
      x: M, y: H - 0.68, w: CW - 1.2, h: 0.4,
      fontFace: BF, fontSize: T.caption, color: col, margin: 0, valign: "middle",
    });
  }
  if (n != null) {
    s.addText(String(n), {
      x: W - M - 0.8, y: H - 0.68, w: 0.8, h: 0.4,
      fontFace: BF, fontSize: T.caption, color: col, align: "right", margin: 0, valign: "middle",
    });
  }
}

/** Big number with a caption under it. For stat rows. */
function stat(s, x, y, w, value, label, color) {
  s.addText(value, {
    x, y, w, h: 0.9,
    fontFace: DF, fontSize: T.stat, color: color || C.eb50, margin: 0, valign: "middle",
  });
  s.addText(label, {
    x, y: y + 0.98, w: w - 0.3, h: 0.9,
    fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0, valign: "top",
  });
}

/* Table borders: horizontal hairlines only, no verticals — matches the brand. */
const TBL_BORDER = [
  { pt: 1, color: C.rule }, { type: "none" },
  { pt: 1, color: C.rule }, { type: "none" },
];

/** Table header row on the palest blue wash. */
function tableHead(cells) {
  return cells.map((h) => ({
    text: h,
    options: {
      bold: true, color: C.eb20, fontFace: DF, fontSize: T.detail,
      fill: { color: C.cb95 }, valign: "middle", margin: [10, 14, 10, 14],
    },
  }));
}

/** Table body row. Pass a wash color to highlight one row. */
function tableRow(cells, fill) {
  return cells.map((c, i) => ({
    text: c,
    options: {
      bold: i === 0, color: i === 0 ? C.eb20 : C.ink,
      fontFace: BF, fontSize: T.detail,
      fill: fill ? { color: fill } : undefined,
      valign: "middle", margin: [10, 14, 10, 14],
    },
  }));
}

/* ===========================================================================
   EXAMPLE — COVER  (brand blue)
   The corporate template's cover: a solid Salesforce-blue field, the reverse
   logo, an Avant Garde title, a Salesforce Sans subtitle, presenter line.
   For a navy cover, swap the background to C.eb15.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.eb50 };
  logo(s, M, M, 3.1, "white");

  s.addText("The deck title", {
    x: M, y: 4.3, w: CW - 2.0, h: 2.6,
    fontFace: DF, fontSize: T.coverTitle, color: C.white, margin: 0, valign: "top",
    lineSpacingMultiple: 1.0,
  });
  s.addText("One line saying what this is, in plain language.", {
    x: M, y: 7.1, w: CW - 3.0, h: 0.9,
    fontFace: BF, fontSize: T.subtitle, color: C.cb90, margin: 0, valign: "top",
  });

  s.addText("Presenter Name  ·  Title", {
    x: M, y: H - 1.5, w: CW, h: 0.44,
    fontFace: BF, fontSize: T.detail, bold: true, color: C.white, margin: 0,
  });
  s.addText("Date, or the occasion", {
    x: M, y: H - 1.06, w: CW, h: 0.44,
    fontFace: BF, fontSize: T.caption, color: C.cb80, margin: 0,
  });

  s.addNotes(
    "What to say out loud when this slide is up — in your own voice, not bullet points.\n\n" +
    "Anything that must be confirmed before presenting goes here in caps so it's hard to miss."
  );
}

/* ===========================================================================
   EXAMPLE — AGENDA
   A numbered list on the light-blue ground. Quiet, structured.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, "Agenda", "What we'll cover");

  const items = [
    ["Where things stand", "The current state, in one line."],
    ["What changed",       "The shift that prompted this conversation."],
    ["The recommendation", "What we're proposing, and why now."],
    ["What we need",       "The decision or the resources we're asking for."],
  ];

  let y = 2.7;
  const step = (H - 1.6 - y) / items.length;
  items.forEach((a, i) => {
    s.addText(String(i + 1).padStart(2, "0"), {
      x: M, y, w: 1.2, h: step, fontFace: DF, fontSize: T.category, color: C.eb50, margin: 0, valign: "middle",
    });
    s.addText(a[0], {
      x: M + 1.3, y, w: 9.5, h: step, fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0, valign: "middle",
    });
    s.addText(a[1], {
      x: M + 11.0, y, w: CW - 11.0, h: step, fontFace: BF, fontSize: T.body, color: C.muted, margin: 0, valign: "middle",
    });
    hrule(s, y + step - 0.02, M, CW, C.rule, 1);
    y += step;
  });

  footer(s, 2);
  s.addNotes("Set expectations, then move. Don't linger on the agenda.");
}

/* ===========================================================================
   EXAMPLE — THREE CARDS  (white containers on light blue)
   The signature corporate layout: white rounded cards with the blue shadow,
   sitting on the Cloud Blue 90 ground. Status pills carry the argument.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.cb90 };
  header(s, "Section", "A title that states the conclusion");

  const cols = [
    ["First area",  "Two or three sentences on what's true here and why it matters.", C.teal],
    ["Second area", "Keep each card to a single idea; the shadow and whitespace do the separating.", C.eb50],
    ["Third area",  "The one that's different — the reason this slide exists.",        C.yellow],
  ];

  const gap = 0.5, colW = (CW - gap * 2) / 3, cardY = 2.7, cardH = 6.4;
  cols.forEach((c, i) => {
    const x = M + i * (colW + gap);
    card(s, x, cardY, colW, cardH);
    // A short accent tab at the top of each card — brand secondary color.
    s.addShape(pres.ShapeType.roundRect, {
      x: x + 0.5, y: cardY + 0.6, w: 0.9, h: 0.16, rectRadius: 0.08,
      fill: { color: c[2] }, line: { type: "none" },
    });
    s.addText(c[0], {
      x: x + 0.5, y: cardY + 1.0, w: colW - 1.0, h: 0.9,
      fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0, valign: "top",
    });
    s.addText(c[1], {
      x: x + 0.5, y: cardY + 1.95, w: colW - 1.0, h: cardH - 2.5,
      fontFace: BF, fontSize: T.body, color: C.ink, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
    });
  });

  footer(s, 3);
  s.addNotes("Walk left to right. Land on the third card — that's the point.");
}

/* ===========================================================================
   EXAMPLE — STAT ROW + STATEMENT
   Real numbers, in Avant Garde. Keep to four. Mark anything unconfirmed with °.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, "Section", "What the numbers show");

  const stats = [
    ["10",   "unit of the first\nnumber"],
    ["4–5",  "unit of the second\nnumber °"],
    ["~40%", "unit of the third\nnumber"],
    ["$0",   "the number that\nmakes the point"],
  ];
  const sw = CW / 4;
  stats.forEach((st, i) => {
    stat(s, M + i * sw, 3.0, sw - 0.4, st[0], st[1], i === 3 ? C.teal : C.eb50);
  });

  // A statement card — a filled blue band is the loudest element; use sparingly.
  const by = 7.3, bh = 2.1;
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: by, w: CW, h: bh, rectRadius: radius(bh, "card"),
    fill: { color: C.eb50 }, line: { type: "none" },
  });
  s.addText("The headline the numbers add up to.", {
    x: M + 0.7, y: by + 0.4, w: CW - 1.4, h: 0.8,
    fontFace: DF, fontSize: T.category, color: C.white, margin: 0, valign: "middle",
  });
  s.addText("The second line — the implication, or an honest caveat.", {
    x: M + 0.7, y: by + 1.2, w: CW - 1.4, h: 0.7,
    fontFace: BF, fontSize: T.body, color: C.cb90, margin: 0, valign: "middle",
  });

  footer(s, 4, "° This figure is unconfirmed and needs checking before presenting.");
  s.addNotes("Lead with the outcome, then the number.\n\nCONFIRM BEFORE PRESENTING: any figure marked °.");
}

/* ===========================================================================
   EXAMPLE — SECTION DIVIDER  (navy)
   A gear-shift between topics. Deep Electric Blue 15 ground, reverse logo.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.eb15 };

  s.addText("02", {
    x: M, y: 4.2, w: 3, h: 1.0,
    fontFace: DF, fontSize: T.category, color: C.cb68, margin: 0, valign: "middle",
  });
  hrule(s, 5.3, M, 1.4, C.eb50, 3);
  s.addText("The name of this section", {
    x: M, y: 5.5, w: CW, h: 1.3,
    fontFace: DF, fontSize: T.coverTitle, color: C.white, margin: 0, valign: "middle",
  });
  s.addText("One line on what this section covers and why it's here.", {
    x: M, y: 6.9, w: CW - 4.0, h: 0.8,
    fontFace: BF, fontSize: T.subtitle, color: C.cb80, margin: 0, valign: "top",
  });
  logo(s, W - M - 2.4, H - M - 2.4 / LOGO_AR, 2.4, "white");

  s.addNotes("Use dividers to reset attention, not to pad the deck.");
}

/* ===========================================================================
   EXAMPLE — PULL QUOTE
   A human voice. The oversized quote mark in brand blue reads as editorial.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.cb95 };

  s.addText("“", {
    x: M - 0.1, y: 1.4, w: 2.4, h: 2.4,
    fontFace: DF, fontSize: 200, color: C.cb80, margin: 0, valign: "top",
  });
  s.addText("The quote, kept to one or two sentences so it can be read aloud in a single breath.", {
    x: M + 1.9, y: 3.4, w: CW - 3.4, h: 3.2,
    fontFace: DF, fontSize: T.title, color: C.eb20, margin: 0, valign: "top", lineSpacingMultiple: 1.1,
  });
  hrule(s, 7.5, M + 1.9, 3.0, C.eb50, 3);
  s.addText("Name, role", {
    x: M + 1.9, y: 7.7, w: 12, h: 0.5, fontFace: DF, fontSize: T.body, color: C.eb20, margin: 0,
  });
  s.addText("Where they're from, or the context of the quote.", {
    x: M + 1.9, y: 8.2, w: 12, h: 0.5, fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0,
  });
  footer(s, 6);
}

/* ===========================================================================
   EXAMPLE — FORWARD-LOOKING STATEMENTS  (required legal)
   Salesforce external decks carry this. Confirm the current wording with Legal
   before presenting — the text below is a placeholder, not approved copy.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, null, "Forward-looking statements");

  s.addText(
    "This presentation contains forward-looking statements about, among other things, trends in our " +
    "business. These statements reflect current expectations and are subject to risks and uncertainties " +
    "that could cause actual results to differ materially. Any unreleased services, features, or functions " +
    "referenced here are not currently available and may not be delivered on time or at all. Customers should " +
    "make purchase decisions based on features currently available.\n\n" +
    "CONFIRM WITH LEGAL: replace this placeholder with the current, approved forward-looking-statements " +
    "language before presenting externally.",
    { x: M, y: 2.5, w: CW, h: 6.5, fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0, valign: "top", lineSpacingMultiple: 1.2 }
  );
  footer(s, 7);
  s.addNotes("Do not present externally until Legal has confirmed the current statement wording.");
}

/* ===========================================================================
   EXAMPLE — THANK YOU  (brand blue close)
   Mirror the cover so the deck is bookended.
   =========================================================================== */
{
  const s = pres.addSlide();
  s.background = { color: C.eb50 };

  s.addText("Thank you", {
    x: M, y: 4.4, w: CW, h: 1.6,
    fontFace: DF, fontSize: T.coverTitle, color: C.white, margin: 0, valign: "middle",
  });
  hrule(s, 6.1, M, 2.6, C.cb68, 3);
  s.addText("A next step, a contact, or where to go from here.", {
    x: M, y: 6.4, w: CW - 3.0, h: 0.9,
    fontFace: BF, fontSize: T.subtitle, color: C.cb90, margin: 0, valign: "top",
  });
  logo(s, W - M - 2.6, H - M - 2.6 / LOGO_AR, 2.6, "white");

  s.addNotes("End on the takeaway, then stop. Let it land.");
}

fit.report(); // print text-fit collisions + soft overflow notes before writing
pres.writeFile({ fileName: OUT })
  .then((f) => console.log("WROTE", f, "—", pres.slides.length, "slides"));
