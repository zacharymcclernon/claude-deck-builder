// ============================================================================
// EXAMPLE / TEST DECK — a re-skin + non-pitch deck in one.
//
//   "Sonnet, Opus, Fable" — a three-slide model reference that specifies the
//   differences between the three Claude 5 models. Nothing here persuades; the
//   job is to let someone pick the right model at a glance.
//
//   npm install pptxgenjs
//   node claude_models_deck.js        # writes Claude_Models.pptx
//
// It exercises two things the skill is supposed to do:
//   1. RE-SKIN — the THEME block below is a *yellow* palette, mapped onto the
//      same roles. Because yellow is too light to read as text, it lives in the
//      bars/fills (accent) and the dark-slide stripes; text stays dark/ink and
//      the dark slides use a deep amber-brown. This is the exact move the
//      re-skin guide in reference/design-system.md prescribes.
//   2. GENERAL CONTENT — a title, a spec table, and a closing, composed from
//      reference/slide-patterns.md. No pitch arc.
//
// Model facts (context, output, price, positioning) are the current Claude 5
// family figures. Prices are Anthropic first-party API rates, per MTok.
// ============================================================================

const pptxgen = require("pptxgenjs");

/* ===========================================================================
   THEME — yellow re-skin. Only this block changes to re-brand the deck.
   Roles, not hues: the vivid yellow is `accent` (bars + fills only, never
   text), `dark` is a deep amber-brown for dark slides and headings, the wash
   is the palest yellow for fills behind dark text.
   =========================================================================== */
const THEME = {
  fonts: { sans: "Arial", fallback: "Helvetica Neue" },
  colors: {
    dark:        "3D2C00", darker: "2A1E00",
    accent:      "F2A900", accentBright: "FFC94D", accentSoft: "FBE3A0", accentWash: "FDF3D6",
    warn:        "D83A00", warnWash: "FEF1ED",
    good:        "2E844A", goodWash: "EBF7EE",
    alt:         "5867E8", altWash: "F1F0FF",
    ink:         "1B1608", muted: "6B5D34", rule: "E9E2CB", tint: "FBF7EC", white: "FFFFFF",
    dimOnDark:   "C9B896", ruleOnDark: "6B5320",
  },
};
const C = THEME.colors;
const FONT = THEME.fonts.sans;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Model reference";
pres.title = "Sonnet, Opus, Fable — the Claude 5 models";

const W = 13.33, H = 7.5, M = 0.7, CW = W - M * 2;

/* Primitives (only the ones these three slides use). */
function hrule(s, y, x, w, color, pt) {
  s.addShape(pres.ShapeType.rect, { x: x === undefined ? M : x, y, w: w === undefined ? CW : w, h: (pt || 0.75) / 72, fill: { color: color || C.rule }, line: { width: 0 } });
}
function accent(s, x, y, h, color) {
  s.addShape(pres.ShapeType.rect, { x, y, w: 0.045, h, fill: { color: color || C.accent }, line: { width: 0 } });
}
function header(s, kick, title, sub, kickColor) {
  if (kick) s.addText(kick.toUpperCase(), { x: M, y: 0.4, w: CW, h: 0.24, fontFace: FONT, fontSize: 9.5, bold: true, color: kickColor || C.accent, charSpacing: 2.2, margin: 0, valign: "middle" });
  s.addText(title, { x: M, y: 0.66, w: CW, h: 0.52, fontFace: FONT, fontSize: 25, bold: true, color: C.dark, margin: 0, valign: "middle" });
  if (sub) { s.addText(sub, { x: M, y: 1.18, w: CW, h: 0.3, fontFace: FONT, fontSize: 13, color: C.muted, margin: 0, valign: "middle" }); hrule(s, 1.64); }
  else hrule(s, 1.36);
}
function footer(s, n, note) {
  if (note) s.addText(note, { x: M, y: 6.88, w: CW - 1.0, h: 0.26, fontFace: FONT, fontSize: 8.5, color: C.muted, margin: 0, valign: "middle" });
  s.addText(String(n), { x: W - M - 0.5, y: 6.88, w: 0.5, h: 0.26, fontFace: FONT, fontSize: 8.5, color: C.muted, align: "right", margin: 0, valign: "middle" });
}
function darkEdge(s) {
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.16, h: H, fill: { color: C.accent }, line: { width: 0 } });
  s.addShape(pres.ShapeType.rect, { x: 0.16, y: 0, w: 0.06, h: H, fill: { color: C.accentBright }, line: { width: 0 } });
}
function band(s, y, lead, support, dark) {
  const h = support ? 1.12 : 0.68;
  s.addShape(pres.ShapeType.rect, { x: M, y, w: CW, h, fill: { color: dark ? C.dark : C.accentWash }, line: { width: 0 } });
  if (!dark) accent(s, M, y, h, C.accent);
  s.addText(lead, { x: M + 0.34, y: y + (support ? 0.14 : 0), w: CW - 0.68, h: support ? 0.36 : h, fontFace: FONT, fontSize: 14.5, bold: true, color: dark ? C.white : C.dark, margin: 0, valign: "middle" });
  if (support) s.addText(support, { x: M + 0.34, y: y + 0.52, w: CW - 0.68, h: 0.5, fontFace: FONT, fontSize: 12, color: dark ? C.accentSoft : C.ink, margin: 0, valign: "top" });
}
const TBL_BORDER = [{ pt: 0.75, color: C.rule }, { pt: 0, color: C.white }, { pt: 0.75, color: C.rule }, { pt: 0, color: C.white }];
function tableHead(cells) { return cells.map((h) => ({ text: h, options: { bold: true, color: C.dark, fontSize: 11.5, fill: { color: C.accentWash }, charSpacing: 0.6, valign: "middle", margin: [8, 10, 8, 10] } })); }
function tableRow(cells, fill) { return cells.map((c, i) => ({ text: c, options: { bold: i === 0, color: i === 0 ? C.dark : C.ink, fontSize: i === 0 ? 12 : 11.5, fill: fill ? { color: fill } : undefined, valign: "middle", margin: [9, 10, 9, 10] } })); }

/* ------------------------------------------------------------------ TITLE */
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);
  s.addText("CLAUDE 5  ·  MODEL FAMILY", { x: M, y: 1.7, w: CW, h: 0.26, fontFace: FONT, fontSize: 10, bold: true, color: C.accentSoft, charSpacing: 2.4, margin: 0 });
  s.addText("Sonnet, Opus, Fable", { x: M, y: 2.1, w: CW, h: 0.88, fontFace: FONT, fontSize: 40, bold: true, color: C.white, margin: 0, valign: "middle" });
  s.addText("Three models on one spectrum. The only real question is how much reasoning the task in front of you actually needs.", { x: M, y: 3.02, w: 10.6, h: 0.6, fontFace: FONT, fontSize: 16, color: C.accentSoft, margin: 0, valign: "top" });
  hrule(s, 3.9, M, 2.2, C.accentBright, 2.5);
  s.addText("Model reference   ·   Prices are Anthropic first-party API rates, per million tokens", { x: M, y: 5.6, w: CW, h: 0.3, fontFace: FONT, fontSize: 12.5, color: C.white, margin: 0 });
  s.addText("As of July 2026", { x: M, y: 5.92, w: CW, h: 0.3, fontFace: FONT, fontSize: 11, color: C.dimOnDark, margin: 0 });
  s.addNotes("Frame the family as a single spectrum of reasoning depth and price, not three unrelated products. The rest of the deck is one comparison and one rule of thumb.");
}

/* --------------------------------------------------------------- TABLE */
{
  const s = pres.addSlide();
  header(s, "The comparison", "Same envelope, different depth and price", "Read down a column for one model; read across a row to see what changes.", C.dark);

  const rows = [tableHead(["", "Sonnet 5", "Opus 5", "Fable 5"])];
  rows.push(tableRow(["Model ID", "claude-sonnet-5", "claude-opus-5", "claude-fable-5"]));
  rows.push(tableRow(["Best for", "Everyday coding + agents, fast", "Complex agentic & enterprise work", "Hardest reasoning, long-horizon"]));
  rows.push(tableRow(["Reasoning depth", "Strong — near-Opus on code", "Deep, scales test-time compute", "Deepest, always-on thinking"]));
  rows.push(tableRow(["Context / max output", "1M / 128K", "1M / 128K", "1M / 128K"]));
  rows.push(tableRow(["Price — in / out", "$3 / $15", "$5 / $25", "$10 / $50"]));

  s.addTable(rows, { x: M, y: 1.94, w: CW, colW: [2.63, 3.1, 3.1, 3.1], rowH: 0.5, border: TBL_BORDER, fontFace: FONT, autoPage: false });

  band(s, 5.62, "Context and max output are identical across the family — you're buying reasoning depth and speed, not capacity.", "Intro pricing: Sonnet 5 is $2 / $10 per MTok through Aug 31, 2026.");
  footer(s, 2);
  s.addNotes("Walk the table once, don't read every cell. The point is the two rows that DON'T change (context, output) versus the two that do (depth, price). Fable is double Opus on price; Opus is the usual default.");
}

/* ------------------------------------------------------------- CLOSING */
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);
  s.addText("THE RULE OF THUMB", { x: M, y: 2.4, w: CW, h: 0.26, fontFace: FONT, fontSize: 10, bold: true, color: C.accentSoft, charSpacing: 2.4, margin: 0 });
  s.addText("Match the model to the hardest task in the loop.", { x: M, y: 2.78, w: CW, h: 0.9, fontFace: FONT, fontSize: 30, bold: true, color: C.white, margin: 0, valign: "middle" });
  hrule(s, 3.9, M, 2.2, C.accentBright, 2.5);
  s.addText("Start on Sonnet 5 — it's fast and near-Opus on code. Move up to Opus 5 when the reasoning gets hard, and to Fable 5 only when the task genuinely earns double the price.", { x: M, y: 4.12, w: 10.8, h: 0.9, fontFace: FONT, fontSize: 14, color: C.accentSoft, margin: 0, valign: "top" });
  s.addText("3", { x: W - M - 0.5, y: 6.88, w: 0.5, h: 0.26, fontFace: FONT, fontSize: 8.5, color: C.dimOnDark, align: "right", margin: 0, valign: "middle" });
  s.addNotes("Leave them with one decision rule, not a spec sheet: default low, escalate only when the work demands it. Then stop.");
}

pres.writeFile({ fileName: "./Claude_Models.pptx" }).then((f) => console.log("WROTE", f, "—", pres.slides.length, "slides"));
