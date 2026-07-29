// ============================================================================
// EXAMPLE DECK — a non-pitch, informational deck.
//
//   "Your first two weeks on the Platform team" — a new-hire onboarding
//   explainer. Nothing here is trying to convince anyone of anything; the job
//   is to orient someone quickly and clearly. That's the point of this example:
//   the skill is for any deck, not just persuasion.
//
//   npm install pptxgenjs
//   node onboarding_deck.js
//
// It composes six layouts from reference/slide-patterns.md — title, section
// divider, numbered list, ruled rows, timeline, table, closing — to show how a
// real deck is assembled from the menu. It carries its own copy of the THEME
// and primitives so it runs standalone.
// ============================================================================

const pptxgen = require("pptxgenjs");

const THEME = {
  fonts: { sans: "Salesforce Sans", fallback: "Arial" },
  colors: {
    dark:        "032D60", darker: "001639",
    accent:      "0176D3", accentBright: "1B96FF", accentSoft: "CFE9FE", accentWash: "EAF5FE",
    warn:        "D83A00", warnWash: "FEF1ED",
    good:        "2E844A", goodWash: "EBF7EE",
    alt:         "5867E8", altWash: "F1F0FF",
    ink:         "181818", muted: "747474", rule: "E5E5E5", tint: "F3F3F3", white: "FFFFFF",
    dimOnDark:   "8CA9C9", ruleOnDark: "1B4D80",
  },
};
const C = THEME.colors;
const FONT = THEME.fonts.sans;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Platform Team";
pres.title = "Your first two weeks on the Platform team";

const W = 13.33, H = 7.5, M = 0.7, CW = W - M * 2;

/* Primitives (copied from the template so this example runs on its own). */
function hrule(s, y, x, w, color, pt) {
  s.addShape(pres.ShapeType.rect, { x: x === undefined ? M : x, y, w: w === undefined ? CW : w, h: (pt || 0.75) / 72, fill: { color: color || C.rule }, line: { width: 0 } });
}
function vrule(s, x, y, h, color) {
  s.addShape(pres.ShapeType.rect, { x, y, w: 0.008, h, fill: { color: color || C.rule }, line: { width: 0 } });
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
const TBL_BORDER = [{ pt: 0.75, color: C.rule }, { pt: 0, color: C.white }, { pt: 0.75, color: C.rule }, { pt: 0, color: C.white }];
function tableHead(cells) { return cells.map((h) => ({ text: h, options: { bold: true, color: C.dark, fontSize: 10.5, fill: { color: C.accentWash }, charSpacing: 0.6, valign: "middle", margin: [7, 10, 7, 10] } })); }
function tableRow(cells, fill) { return cells.map((c, i) => ({ text: c, options: { bold: i === 0, color: i === 0 ? C.dark : C.ink, fontSize: i === 0 ? 12.5 : 11.5, fill: fill ? { color: fill } : undefined, valign: "middle", margin: [10, 10, 10, 10] } })); }

/* ------------------------------------------------------------------ TITLE */
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);
  s.addText("PLATFORM TEAM  ·  ONBOARDING", { x: M, y: 1.7, w: CW, h: 0.26, fontFace: FONT, fontSize: 10, bold: true, color: C.accentSoft, charSpacing: 2.4, margin: 0 });
  s.addText("Your first two weeks", { x: M, y: 2.1, w: CW, h: 0.88, fontFace: FONT, fontSize: 40, bold: true, color: C.white, margin: 0, valign: "middle" });
  s.addText("What to set up, who to meet, and how we work — so you can ship something small by Friday of week one.", { x: M, y: 3.02, w: 10.4, h: 0.6, fontFace: FONT, fontSize: 16, color: C.accentSoft, margin: 0, valign: "top" });
  hrule(s, 3.9, M, 2.2, C.accentBright, 2.5);
  s.addText("Read this on day one. Bookmark it; you'll come back to the checklist.", { x: M, y: 5.6, w: CW, h: 0.3, fontFace: FONT, fontSize: 12.5, color: C.white, margin: 0 });
  s.addText("Questions → #platform-onboarding", { x: M, y: 5.92, w: CW, h: 0.3, fontFace: FONT, fontSize: 11, color: C.dimOnDark, margin: 0 });
  s.addNotes("This deck is a reference, not a presentation — it's meant to be read. Notes here point the reader to the person who owns each area.");
}

/* -------------------------------------------------------- SECTION DIVIDER */
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);
  s.addText("01", { x: M, y: 2.5, w: 2, h: 0.9, fontFace: FONT, fontSize: 15, bold: true, color: C.accentBright, charSpacing: 2, margin: 0, valign: "middle" });
  hrule(s, 3.3, M, 0.9, C.ruleOnDark, 1.5);
  s.addText("Week one: get set up", { x: M, y: 3.5, w: CW, h: 0.9, fontFace: FONT, fontSize: 30, bold: true, color: C.white, margin: 0, valign: "middle" });
  s.addText("Accounts, access, and your first pull request. Aim to finish this list by end of day three.", { x: M, y: 4.42, w: 9.8, h: 0.6, fontFace: FONT, fontSize: 14, color: C.accentSoft, margin: 0, valign: "top" });
}

/* ------------------------------------------------------- NUMBERED LIST */
{
  const s = pres.addSlide();
  header(s, "Week one", "The day-one checklist");
  const items = [
    ["Get your accounts", "IT provisions Okta, GitHub, and the VPN on your start date. If any are missing by 10am, ping #it-help — don't wait."],
    ["Clone the monorepo and build", "Follow README > Getting Started. The first build takes ~20 minutes. If it fails, that's a documentation bug — file it."],
    ["Pair on a starter task", "Your onboarding buddy has picked a small, real issue tagged `good-first-issue`. You'll pair on it, not do it alone."],
    ["Open your first PR", "Small is the goal, not impressive. A typo fix that goes through the full review-and-deploy loop teaches more than a big change that stalls."],
  ];
  let y = 1.62;
  items.forEach((a, i) => {
    hrule(s, y);
    s.addText(String(i + 1).padStart(2, "0"), { x: M, y: y + 0.2, w: 0.5, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: C.accent, margin: 0, valign: "middle" });
    s.addText(a[0], { x: M + 0.56, y: y + 0.18, w: 11.0, h: 0.32, fontFace: FONT, fontSize: 14.5, bold: true, color: C.dark, margin: 0, valign: "middle" });
    s.addText(a[1], { x: M + 0.56, y: y + 0.52, w: 11.1, h: 0.52, fontFace: FONT, fontSize: 12, color: C.ink, margin: 0, valign: "top" });
    y += 1.14;
  });
  hrule(s, y);
  footer(s, 3);
  s.addNotes("Buddy owns the starter task pick. If the reader has no buddy assigned by day one, that's an escalation to the manager.");
}

/* ---------------------------------------------------- RULED ROWS (who to ask) */
{
  const s = pres.addSlide();
  header(s, "Week one", "Who to ask, for what", "You don't need to know everyone. You need to know where to start.");
  s.addText("WHEN YOU'RE STUCK ON…", { x: M, y: 1.9, w: 5.6, h: 0.26, fontFace: FONT, fontSize: 9.5, bold: true, color: C.accent, charSpacing: 1.8, margin: 0, valign: "middle" });
  s.addText("START WITH", { x: M + 6.3, y: 1.9, w: 5.6, h: 0.26, fontFace: FONT, fontSize: 9.5, bold: true, color: C.accent, charSpacing: 1.8, margin: 0, valign: "middle" });
  const rows = [
    ["Local setup or the build", "Anything that won't build or run on your machine.", "Your onboarding buddy", "They did this recently and remember the sharp edges."],
    ["How a service works", "Architecture, ownership, why something is the way it is.", "#platform-eng", "Ask in the open channel; the answer helps the next hire too."],
    ["Access and permissions", "Missing a role, a repo, or a dashboard.", "#it-help", "Include what you're trying to do, not just what you want granted."],
  ];
  let y = 2.24;
  rows.forEach((r) => {
    hrule(s, y);
    accent(s, M, y + 0.16, 1.16, C.accent);
    s.addText(r[0], { x: M + 0.22, y: y + 0.16, w: 5.3, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: C.dark, margin: 0, valign: "middle" });
    s.addText(r[1], { x: M + 0.22, y: y + 0.48, w: 5.3, h: 0.72, fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top" });
    accent(s, M + 6.3, y + 0.16, 1.16, C.alt);
    s.addText(r[2], { x: M + 6.52, y: y + 0.16, w: 5.35, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: C.dark, margin: 0, valign: "middle" });
    s.addText(r[3], { x: M + 6.52, y: y + 0.48, w: 5.35, h: 0.72, fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top" });
    y += 1.44;
  });
  hrule(s, y);
  footer(s, 4);
}

/* --------------------------------------------------------------- TABLE */
{
  const s = pres.addSlide();
  header(s, "Reference", "Tools you'll touch, and where access comes from", "Bookmark the ones marked daily.");
  const rows = [tableHead(["Tool", "What it's for", "Access via", "How often"])];
  rows.push(tableRow(["GitHub", "Code, reviews, CI", "Okta (auto)", "Daily"]));
  rows.push(tableRow(["Grafana", "Service dashboards, alerts", "Okta (auto)", "Daily"]));
  rows.push(tableRow(["PagerDuty", "On-call — you join the rotation in month two", "Ask your manager", "Later"]));
  rows.push(tableRow(["Prod console", "Read-only by default; write access is reviewed", "#it-help request", "As needed"]));
  s.addTable(rows, { x: M, y: 1.94, w: CW, colW: [2.4, 4.6, 2.9, 2.03], border: TBL_BORDER, fontFace: FONT, autoPage: false });
  s.addText("You won't have prod write access on day one, and that's deliberate — you don't need it to ship your first change, and it's easy to grant once you do.", { x: M, y: 4.7, w: CW - 0.3, h: 0.8, fontFace: FONT, fontSize: 12.5, color: C.ink, margin: 0, valign: "top" });
  footer(s, 5);
  s.addNotes("PagerDuty timing is a team norm, not a hard rule — some hires join on-call sooner if they ask. Confirm with the current on-call lead.");
}

/* ------------------------------------------------------------ TIMELINE */
{
  const s = pres.addSlide();
  header(s, "The arc", "How the first month tends to go", "A rough shape, not a schedule. People ramp at different speeds.");
  const steps = [
    ["Days 1–3", "Setup done, first PR open."],
    ["Week 1", "First change shipped to prod behind a flag."],
    ["Week 2", "Owning small tasks end to end, unpaired."],
    ["Month 1", "In the on-call shadow rotation; picking up normal issues."],
  ];
  const spineY = 3.1, x0 = M + 0.1, colW = (CW - 0.2) / steps.length;
  hrule(s, spineY, x0, CW - 0.2, C.rule, 1.5);
  steps.forEach((st, i) => {
    const cx = x0 + i * colW;
    const done = i === 0;
    s.addShape(pres.ShapeType.ellipse, { x: cx - 0.09, y: spineY - 0.08, w: 0.2, h: 0.2, fill: { color: done ? C.good : C.accent }, line: { width: 0 } });
    s.addText(st[0], { x: cx + 0.24, y: spineY - 0.72, w: colW - 0.3, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: C.dark, margin: 0, valign: "bottom" });
    s.addText(st[1], { x: cx + 0.24, y: spineY + 0.22, w: colW - 0.4, h: 1.2, fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top" });
  });
  footer(s, 6, "If you're behind this shape at any point, it's almost always a blocker on our side — say so early.");
}

/* ------------------------------------------------------------- CLOSING */
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);
  s.addText("THE ONE THING", { x: M, y: 2.4, w: CW, h: 0.26, fontFace: FONT, fontSize: 10, bold: true, color: C.accentSoft, charSpacing: 2.4, margin: 0 });
  s.addText("Ask early, ask in the open.", { x: M, y: 2.78, w: CW, h: 0.9, fontFace: FONT, fontSize: 30, bold: true, color: C.white, margin: 0, valign: "middle" });
  hrule(s, 3.9, M, 2.2, C.accentBright, 2.5);
  s.addText("Nobody here expects you to know how our systems fit together yet. A question in #platform-eng is never the wrong move — it's how the team stays legible to itself.", { x: M, y: 4.12, w: 10.6, h: 0.9, fontFace: FONT, fontSize: 14, color: C.accentSoft, margin: 0, valign: "top" });
  s.addText("7", { x: W - M - 0.5, y: 6.88, w: 0.5, h: 0.26, fontFace: FONT, fontSize: 8.5, color: C.dimOnDark, align: "right", margin: 0, valign: "middle" });
  s.addNotes("Close a reference deck on the single behavior you want to stick. Here it's: default to asking in public.");
}

pres.writeFile({ fileName: "./Onboarding.pptx" }).then((f) => console.log("WROTE", f, "—", pres.slides.length, "slides"));
