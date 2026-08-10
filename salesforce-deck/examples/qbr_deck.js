// ============================================================================
// Worked example — a Salesforce customer QBR, composed from the pattern menu.
//
//   node examples/qbr_deck.js
//
// This is a real, runnable deck showing the branded patterns in sequence:
// cover → agenda → stat row → card row w/ status → table → pull quote →
// statement → forward-looking statements → thank-you. It reads the SAME frozen
// BRAND block and primitives as the template; the content is placeholder QBR
// copy. Everything stays on brand because it only ever touches C, T, and the
// primitives — never a raw color or font.
//
// Fonts (Avant Garde Demi SFDC, Salesforce Sans) and the palette are LOCKED. To
// build a real QBR, copy assets/deck_template.js instead and edit its slides.
// ============================================================================

const pptxgen = require("pptxgenjs");
const path = require("path");

const C = {
  eb15: "001E5B", eb20: "002775", eb30: "022AC0", eb50: "066AFE",
  cb68: "00B3FF", cb80: "90D0FE", cb90: "CFE9FE", cb95: "EAF5FE",
  teal: "04E1CB", tealDeep: "06A59A", tealWash: "DEF9F3",
  yellow: "FCC003", yellowDeep: "E4A201", yellowWash: "FBF3E0",
  pink: "FF538A", pinkDeep: "B60554", pinkWash: "FEF0F3",
  ink: "181818", muted: "59575C", rule: "D8DDE6", white: "FFFFFF",
};
const DF = "Avant Garde Demi SFDC";
const BF = "Salesforce Sans";
const T = { coverTitle: 54, title: 40, subtitle: 28, category: 26, body: 22, detail: 18, caption: 14, kicker: 16, stat: 54 };
const RADIUS = { card: 0.125, pill: 0.5 };
const SHADOW = { type: "outer", color: "066AFE", opacity: 0.15, blur: 28, offset: 7.5, angle: 75 };
const brandShadow = () => ({ ...SHADOW });

// Logos live in the shared skill assets folder, one level up.
const LOGO = path.join(__dirname, "..", "assets", "brand", "salesforce-logo.png");
const LOGO_WHITE = path.join(__dirname, "..", "assets", "brand", "salesforce-logo-white.png");
const LOGO_AR = 1960 / 1372;

const pres = new pptxgen();
pres.defineLayout({ name: "SF_WIDE", width: 20, height: 11.25 });
pres.layout = "SF_WIDE";
pres.author = "Account Team";
pres.title = "Acme Corp — Q2 Business Review";
pres.theme = { headFontFace: DF, bodyFontFace: BF };

const W = 20, H = 11.25, M = 0.94, CW = W - M * 2;
const radius = (side, kind) => side * (kind === "pill" ? RADIUS.pill : RADIUS.card);
const logo = (s, x, y, w, v) => s.addImage({ path: v === "white" ? LOGO_WHITE : LOGO, x, y, w, h: w / LOGO_AR });

function hrule(s, y, x, w, color, pt) {
  s.addShape(pres.ShapeType.rect, { x: x ?? M, y, w: w ?? CW, h: (pt || 1) / 72, fill: { color: color || C.rule }, line: { type: "none" } });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: radius(Math.min(w, h), "card"), fill: { color: fill || C.white }, line: { type: "none" }, shadow: brandShadow() });
}
function header(s, kicker, title, onDark) {
  const tc = onDark ? C.white : C.eb20, kc = onDark ? C.cb80 : C.eb50;
  if (kicker) {
    s.addText(kicker.toUpperCase(), { x: M, y: 0.7, w: CW, h: 0.4, fontFace: BF, fontSize: T.kicker, bold: true, color: kc, charSpacing: 3, margin: 0, valign: "middle" });
    s.addText(title, { x: M, y: 1.14, w: CW, h: 0.9, fontFace: DF, fontSize: T.title, color: tc, margin: 0, valign: "middle" });
    hrule(s, 2.16, M, 2.6, C.eb50, 3);
  } else {
    s.addText(title, { x: M, y: 0.82, w: CW, h: 0.9, fontFace: DF, fontSize: T.title, color: tc, margin: 0, valign: "middle" });
    hrule(s, 1.84, M, 2.6, C.eb50, 3);
  }
}
function footer(s, n, note) {
  if (note) s.addText(note, { x: M, y: H - 0.68, w: CW - 1.2, h: 0.4, fontFace: BF, fontSize: T.caption, color: C.muted, margin: 0, valign: "middle" });
  if (n != null) s.addText(String(n), { x: W - M - 0.8, y: H - 0.68, w: 0.8, h: 0.4, fontFace: BF, fontSize: T.caption, color: C.muted, align: "right", margin: 0, valign: "middle" });
}
function stat(s, x, y, w, value, label, color) {
  s.addText(value, { x, y, w, h: 0.9, fontFace: DF, fontSize: T.stat, color: color || C.eb50, margin: 0, valign: "middle" });
  s.addText(label, { x, y: y + 0.98, w: w - 0.3, h: 0.9, fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0, valign: "top" });
}
const TBL_BORDER = [{ pt: 1, color: C.rule }, { type: "none" }, { pt: 1, color: C.rule }, { type: "none" }];
const tableHead = (cells) => cells.map((h) => ({ text: h, options: { bold: true, color: C.eb20, fontFace: DF, fontSize: T.detail, fill: { color: C.cb95 }, valign: "middle", margin: [10, 14, 10, 14] } }));
const tableRow = (cells, fill) => cells.map((c, i) => ({ text: c, options: { bold: i === 0, color: i === 0 ? C.eb20 : C.ink, fontFace: BF, fontSize: T.detail, fill: fill ? { color: fill } : undefined, valign: "middle", margin: [10, 14, 10, 14] } }));

/* ---- Cover ---------------------------------------------------------------- */
{
  const s = pres.addSlide();
  s.background = { color: C.eb50 };
  logo(s, M, M, 3.1, "white");
  s.addText("Acme Corp\nQ2 Business Review", { x: M, y: 4.0, w: CW - 2.0, h: 3.0, fontFace: DF, fontSize: T.coverTitle, color: C.white, margin: 0, valign: "top", lineSpacingMultiple: 1.0 });
  s.addText("Progress against the FY26 success plan, and what we're asking for next quarter.", { x: M, y: 7.4, w: CW - 3.0, h: 1.0, fontFace: BF, fontSize: T.subtitle, color: C.cb90, margin: 0, valign: "top" });
  s.addText("Dana Lee  ·  Customer Success Director", { x: M, y: H - 1.5, w: CW, h: 0.44, fontFace: BF, fontSize: T.detail, bold: true, color: C.white, margin: 0 });
  s.addText("April 2026", { x: M, y: H - 1.06, w: CW, h: 0.44, fontFace: BF, fontSize: T.caption, color: C.cb80, margin: 0 });
  s.addNotes("Open by naming the one outcome you want from this review, then walk the agenda.");
}

/* ---- Agenda --------------------------------------------------------------- */
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, "Agenda", "What we'll cover");
  const items = [
    ["Where we are", "Adoption and value delivered since Q1."],
    ["What's working", "The wins worth repeating, by team."],
    ["What's at risk", "The one workstream that needs a decision."],
    ["The ask", "What we need from you to keep Q3 on track."],
  ];
  let y = 2.7; const step = (H - 1.6 - y) / items.length;
  items.forEach((a, i) => {
    s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 1.2, h: step, fontFace: DF, fontSize: T.category, color: C.eb50, margin: 0, valign: "middle" });
    s.addText(a[0], { x: M + 1.3, y, w: 9.5, h: step, fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0, valign: "middle" });
    s.addText(a[1], { x: M + 11.0, y, w: CW - 11.0, h: step, fontFace: BF, fontSize: T.body, color: C.muted, margin: 0, valign: "middle" });
    hrule(s, y + step - 0.02, M, CW, C.rule, 1);
    y += step;
  });
  footer(s, 2);
}

/* ---- Stat row ------------------------------------------------------------- */
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, "Where we are", "Adoption is up and time-to-value is down");
  const stats = [["+62%", "weekly active\nusers vs. Q1"], ["23", "workflows live\nin production"], ["11 days", "median time to\nfirst value °"], ["4.6/5", "admin satisfaction\n(n=38)"]];
  const sw = CW / 4;
  stats.forEach((st, i) => stat(s, M + i * sw, 3.0, sw - 0.4, st[0], st[1], i === 3 ? C.teal : C.eb50));
  const by = 7.3, bh = 2.1;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: by, w: CW, h: bh, rectRadius: radius(bh, "card"), fill: { color: C.eb50 }, line: { type: "none" } });
  s.addText("Every team that onboarded in Q1 is now live — the platform is past the pilot.", { x: M + 0.7, y: by + 0.4, w: CW - 1.4, h: 0.8, fontFace: DF, fontSize: T.category, color: C.white, margin: 0, valign: "middle" });
  s.addText("The remaining gap is Support, which started late; that's the workstream on slide 4.", { x: M + 0.7, y: by + 1.2, w: CW - 1.4, h: 0.7, fontFace: BF, fontSize: T.body, color: C.cb90, margin: 0, valign: "middle" });
  footer(s, 3, "° Median across the 23 production workflows; two outliers excluded and flagged in the appendix.");
}

/* ---- Card row with status ------------------------------------------------- */
{
  const s = pres.addSlide();
  s.background = { color: C.cb90 };
  header(s, "By team", "Two teams are ahead of plan; Support needs a decision");
  const cols = [
    ["Sales", "On track", C.tealDeep, C.tealWash, "Fully live on the new pipeline flows. Forecast accuracy up, manual entry down."],
    ["Service", "Ahead", C.tealDeep, C.tealWash, "Adopted faster than planned and is now piloting the next module unprompted."],
    ["Support", "At risk", C.pinkDeep, C.pinkWash, "Started a quarter late and is blocked on a staffing decision — the ask on slide 6."],
  ];
  const gap = 0.5, colW = (CW - gap * 2) / 3, cardY = 2.7, cardH = 6.4;
  cols.forEach((c, i) => {
    const x = M + i * (colW + gap);
    card(s, x, cardY, colW, cardH);
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.5, y: cardY + 0.6, w: 2.6, h: 0.6, rectRadius: radius(0.6, "pill"), fill: { color: c[3] }, line: { type: "none" } });
    s.addText(c[1].toUpperCase(), { x: x + 0.5, y: cardY + 0.6, w: 2.6, h: 0.6, align: "center", valign: "middle", fontFace: BF, fontSize: T.caption, bold: true, color: c[2], charSpacing: 1.5, margin: 0 });
    s.addText(c[0], { x: x + 0.5, y: cardY + 1.45, w: colW - 1.0, h: 0.9, fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0, valign: "top" });
    s.addText(c[4], { x: x + 0.5, y: cardY + 2.4, w: colW - 1.0, h: cardH - 3.0, fontFace: BF, fontSize: T.body, color: C.ink, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  });
  footer(s, 4);
}

/* ---- Table ---------------------------------------------------------------- */
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, "Success plan", "Three of four Q2 commitments are done");
  const rows = [tableHead(["Commitment", "Owner", "Target", "Status"])];
  rows.push(tableRow(["Migrate Sales to new flows", "Joint", "Q2", "Done"]));
  rows.push(tableRow(["Stand up Service module", "Acme", "Q2", "Done"]));
  rows.push(tableRow(["Admin certification (5 staff)", "Acme", "Q2", "Done — 6 certified"]));
  rows.push(tableRow(["Support go-live", "Acme", "Q2", "Slipped to Q3 — needs staffing"], C.pinkWash));
  s.addTable(rows, { x: M, y: 2.7, w: CW, colW: [7.0, 3.0, 3.0, CW - 13.0], border: TBL_BORDER, autoPage: false });
  s.addText("The three that shipped were the ones with a named owner on both sides. Support had no Acme owner until March.", { x: M, y: 8.4, w: CW, h: 1.2, fontFace: BF, fontSize: T.body, color: C.ink, margin: 0, valign: "top" });
  footer(s, 5);
  s.addNotes("Walk the table once. Land on the highlighted row — it sets up the ask.");
}

/* ---- Pull quote ----------------------------------------------------------- */
{
  const s = pres.addSlide();
  s.background = { color: C.cb95 };
  s.addText("“", { x: M - 0.1, y: 1.4, w: 2.4, h: 2.4, fontFace: DF, fontSize: 200, color: C.cb80, margin: 0, valign: "top" });
  s.addText("It used to take my team a full day to pull the numbers for this review. Now it's a saved dashboard we check every morning.", { x: M + 1.9, y: 3.2, w: CW - 3.4, h: 3.6, fontFace: DF, fontSize: T.title, color: C.eb20, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
  hrule(s, 7.6, M + 1.9, 3.0, C.eb50, 3);
  s.addText("Priya N., VP of Service", { x: M + 1.9, y: 7.8, w: 12, h: 0.5, fontFace: DF, fontSize: T.body, color: C.eb20, margin: 0 });
  s.addText("Acme Corp — said unprompted in the March steering call.", { x: M + 1.9, y: 8.3, w: 12, h: 0.5, fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0 });
  footer(s, 6);
}

/* ---- The ask (statement + CTA) -------------------------------------------- */
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, "The ask", "Name a Support owner by April 30");
  s.addText("Support go-live slipped for one reason: no owner on Acme's side. With a named owner and two weeks of admin time, Q3 go-live is safe. Without one, it slips again.", { x: M, y: 2.9, w: CW, h: 2.0, fontFace: BF, fontSize: T.subtitle, color: C.ink, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 5.4, w: 5.6, h: 1.0, rectRadius: radius(1.0, "pill"), fill: { color: C.eb50 }, line: { type: "none" }, shadow: brandShadow() });
  s.addText("Confirm Support owner", { x: M, y: 5.4, w: 5.6, h: 1.0, align: "center", valign: "middle", fontFace: BF, fontSize: T.detail, bold: true, color: C.white, margin: 0 });
  footer(s, 7);
  s.addNotes("This is the whole reason for the meeting. Stop talking after the ask and let them respond.");
}

/* ---- Forward-looking statements (required legal) -------------------------- */
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, null, "Forward-looking statements");
  s.addText(
    "This presentation contains forward-looking statements about, among other things, trends in our business and the anticipated performance of Salesforce products. These statements reflect current expectations and are subject to risks and uncertainties that could cause actual results to differ materially. Any unreleased services, features, or functions referenced here are not currently available and may not be delivered on time or at all. Customers should make purchase decisions based on features currently available.\n\nCONFIRM WITH LEGAL: replace this placeholder with the current, approved forward-looking-statements language before presenting externally.",
    { x: M, y: 2.5, w: CW, h: 6.5, fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0, valign: "top", lineSpacingMultiple: 1.2 }
  );
  footer(s, 8);
  s.addNotes("Do not present externally until Legal has confirmed the current statement wording.");
}

/* ---- Thank-you ------------------------------------------------------------ */
{
  const s = pres.addSlide();
  s.background = { color: C.eb50 };
  s.addText("Thank you", { x: M, y: 4.4, w: CW, h: 1.6, fontFace: DF, fontSize: T.coverTitle, color: C.white, margin: 0, valign: "middle" });
  hrule(s, 6.1, M, 2.6, C.cb68, 3);
  s.addText("Next check-in: first week of July. We'll bring the Support go-live plan.", { x: M, y: 6.4, w: CW - 3.0, h: 0.9, fontFace: BF, fontSize: T.subtitle, color: C.cb90, margin: 0, valign: "top" });
  logo(s, W - M - 2.6, H - M - 2.6 / LOGO_AR, 2.6, "white");
  s.addNotes("End on the next step and the date. Then stop.");
}

pres.writeFile({ fileName: "Acme_Q2_Business_Review.pptx" }).then((f) => console.log("WROTE", f, "—", pres.slides.length, "slides"));
