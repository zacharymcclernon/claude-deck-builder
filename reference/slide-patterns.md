# Slide patterns

A menu of layouts, not a sequence. Pick the shape that fits each piece of content;
skip the rest. Every block below assumes the `THEME`, the aliases (`C`, `FONT`), the
primitives (`header`, `hrule`, `vrule`, `accent`, `band`, `stat`, `footer`,
`darkEdge`, `tableHead`, `tableRow`, `TBL_BORDER`), and the constants (`W`, `H`, `M`,
`CW`) from `assets/deck_template.js` are in scope. Each is a self-contained `{ ... }`
block — paste it into the script, edit the content arrays, rebuild.

**How to choose:**

| You have… | Reach for |
|-----------|-----------|
| A cover or an ending | **Title / Closing** (dark) |
| A gear-shift between topics | **Section divider** |
| Paired items (before/after, term/definition, Q/A, problem/response) | **Ruled rows** |
| Options, states, or segments to contrast | **Comparison columns** |
| More than three things with the same attributes | **Table** |
| Real numbers to headline | **Stat row** |
| A list of steps, asks, or requirements | **Numbered list (+ optional sidebar)** |
| One sentence that deserves the whole slide | **Big statement** |
| A human voice — a customer, a user, a quote | **Pull quote** |
| A sequence over time | **Timeline** |
| A screenshot, diagram, or photo | **Image with caption** |

Don't run the same layout twice in a row. Variety is what keeps a deck from reading as
machine-made.

---

## Title (dark)

A cover. For a light cover, drop `darkEdge` and set the background to `C.white`, text
to `C.dark`.

```js
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
    x: M, y: 5.6, w: CW, h: 0.3, fontFace: FONT, fontSize: 12.5, color: C.white, margin: 0
  });
  s.addText("Date, or the occasion", {
    x: M, y: 5.92, w: CW, h: 0.3, fontFace: FONT, fontSize: 11, color: C.dimOnDark, margin: 0
  });
  s.addNotes("What to say out loud when this slide is up.");
}
```

---

## Section divider

A quiet gear-shift between topics. Numbered so the deck feels structured.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);

  s.addText("02", {
    x: M, y: 2.5, w: 2, h: 0.9,
    fontFace: FONT, fontSize: 15, bold: true, color: C.accentBright, charSpacing: 2, margin: 0, valign: "middle"
  });
  hrule(s, 3.3, M, 0.9, C.ruleOnDark, 1.5);
  s.addText("The name of this section", {
    x: M, y: 3.5, w: CW, h: 0.9,
    fontFace: FONT, fontSize: 30, bold: true, color: C.white, margin: 0, valign: "middle"
  });
  s.addText("One line on what this section covers and why it's here.", {
    x: M, y: 4.42, w: 9.5, h: 0.5,
    fontFace: FONT, fontSize: 14, color: C.accentSoft, margin: 0, valign: "top"
  });
  s.addNotes("Use dividers to reset attention, not to pad the deck.");
}
```

---

## Ruled rows (two-column)

The most flexible workhorse. Any set of paired items: before/after, term/definition,
question/answer, problem/response, area/detail. Left and right column labels are
independent — color them to whatever the pairing means.

```js
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
    ["First item",  "One or two sentences of detail.", "Its pair", "The matching detail."],
    ["Second item", "Detail.", "Its pair", "Detail."],
    ["Third item",  "Detail.", "Its pair", "Detail."],
  ];

  let y = 1.94;
  rows.forEach((r) => {
    hrule(s, y);
    accent(s, M, y + 0.16, 1.16, C.accent);
    s.addText(r[0], { x: M + 0.22, y: y + 0.16, w: 5.3, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: C.dark, margin: 0, valign: "middle" });
    s.addText(r[1], { x: M + 0.22, y: y + 0.48, w: 5.3, h: 0.72, fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top" });
    accent(s, M + 6.3, y + 0.16, 1.16, C.accent);
    s.addText(r[2], { x: M + 6.52, y: y + 0.16, w: 5.35, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: C.dark, margin: 0, valign: "middle" });
    s.addText(r[3], { x: M + 6.52, y: y + 0.48, w: 5.35, h: 0.72, fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top" });
    y += 1.44;
  });
  hrule(s, y);
  footer(s, 3);
}
```

---

## Comparison columns (three-up)

Contrast states, options, or segments. Status chips carry the argument; give the odd
one out `warn` and the rest `good` so the point lands before the text is read.

```js
{
  const s = pres.addSlide();
  header(s, "Section", "A title that states the conclusion", "The supporting line, one sentence.");

  const cols = [
    ["First column",  "READY",     C.good, C.goodWash, "What's true here, in a sentence or two."],
    ["Second column", "READY",     C.good, C.goodWash, "What's true here."],
    ["Third column",  "NOT READY", C.warn, C.warnWash, "The one that's different — the reason for the slide."],
  ];

  const colW = 3.83, gap = 0.22;
  cols.forEach((c, i) => {
    const x = M + i * (colW + gap);
    s.addShape(pres.ShapeType.rect, { x, y: 1.95, w: colW, h: 0.34, fill: { color: c[3] }, line: { width: 0 } });
    s.addText(c[1], { x: x + 0.14, y: 1.95, w: colW - 0.28, h: 0.34, fontFace: FONT, fontSize: 9.5, bold: true, color: c[2], charSpacing: 1.6, margin: 0, valign: "middle" });
    s.addText(c[0], { x, y: 2.42, w: colW - 0.2, h: 0.62, fontFace: FONT, fontSize: 16.5, bold: true, color: C.dark, margin: 0, valign: "top" });
    s.addText(c[4], { x, y: 3.06, w: colW - 0.25, h: 1.6, fontFace: FONT, fontSize: 12, color: C.ink, margin: 0, valign: "top" });
    if (i < 2) vrule(s, x + colW + gap / 2 - 0.004, 2.42, 1.7);
  });

  band(s, 4.92, "The conclusion the three columns add up to.", null, true);
  footer(s, 4);
}
```

---

## Table

When more than three things share the same attributes, a real table beats cards.
Horizontal rules only. Highlight the row that carries the argument.

```js
{
  const s = pres.addSlide();
  header(s, "Section", "The comparison, stated as a claim", "How to read the table in one line.");

  const rows = [tableHead(["", "Column two", "Column three", "Column four"])];
  rows.push(tableRow(["First row",  "Value", "Value", "Value"]));
  rows.push(tableRow(["Second row", "Value", "Value", "Value"]));
  rows.push(tableRow(["Third row",  "Value", "Value", "Value"]));
  rows.push(tableRow(["The exception", "Value", "Value", "Why this one is different"], C.warnWash));

  s.addTable(rows, {
    x: M, y: 1.94, w: CW,
    colW: [2.6, 3.4, 2.6, 3.33],
    border: TBL_BORDER, fontFace: FONT, autoPage: false
  });

  band(s, 5.7, "The sentence you want them to remember from this table.");
  footer(s, 5);
  s.addNotes("Walk the table once. Don't read every cell.");
}
```

---

## Stat row + prose

For real numbers. Keep it to four; more reads as a dashboard. Mark anything
unconfirmed with `°` and footnote it via `footer`.

```js
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
    "A paragraph of context under the numbers. Plain sentences, no bullets — say what the numbers mean. " +
    "Four or five lines so it stays readable at the back of a room.",
    { x: M, y: 3.72, w: CW - 0.3, h: 1.1, fontFace: FONT, fontSize: 12.5, color: C.ink, margin: 0, valign: "top" }
  );
  band(s, 5.0, "The headline the numbers add up to.", "The implication, or an honest caveat.", true);
  footer(s, 6, "° This figure is unconfirmed and needs checking before presenting.");
}
```

---

## Numbered list (+ optional sidebar)

Steps, asks, requirements, an agenda. The sidebar is optional — delete the `vrule`
and the sidebar block for a full-width list, or keep it for label/value pairs
(costs, estimates, owners).

```js
{
  const s = pres.addSlide();
  header(s, "Section", "The list, titled as what it accomplishes");

  const items = [
    ["The first item",  "One or two sentences of detail about what this means."],
    ["The second item", "Detail."],
    ["The third item",  "Detail."],
    ["The fourth item", "Detail."],
  ];

  let y = 1.62;
  items.forEach((a, i) => {
    hrule(s, y);
    s.addText(String(i + 1).padStart(2, "0"), { x: M, y: y + 0.2, w: 0.5, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: C.accent, margin: 0, valign: "middle" });
    s.addText(a[0], { x: M + 0.56, y: y + 0.18, w: 7.2, h: 0.32, fontFace: FONT, fontSize: 14.5, bold: true, color: C.dark, margin: 0, valign: "middle" });
    s.addText(a[1], { x: M + 0.56, y: y + 0.52, w: 7.2, h: 0.52, fontFace: FONT, fontSize: 12, color: C.ink, margin: 0, valign: "top" });
    y += 1.14;
  });
  hrule(s, y);

  // --- optional sidebar ---
  vrule(s, M + 8.2, 1.62, y - 1.62);
  s.addText("Sidebar heading", { x: M + 8.62, y: 1.76, w: 3.3, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: C.dark, margin: 0, valign: "middle" });
  const pairs = [
    ["First item",  "value", "measured"],
    ["Second item", "value", "estimated"],
    ["Third item",  "value", "estimated"],
  ];
  let cy = 2.16;
  pairs.forEach((c) => {
    s.addText(c[0], { x: M + 8.62, y: cy, w: 1.9, h: 0.26, fontFace: FONT, fontSize: 11.5, bold: true, color: C.dark, margin: 0, valign: "middle" });
    s.addText(c[1], { x: M + 10.5, y: cy, w: 1.42, h: 0.26, fontFace: FONT, fontSize: 11.5, bold: true, color: C.accent, align: "right", margin: 0, valign: "middle" });
    s.addText(c[2], { x: M + 8.62, y: cy + 0.24, w: 3.3, h: 0.22, fontFace: FONT, fontSize: 8.5, color: c[2] === "measured" ? C.good : C.muted, margin: 0, valign: "middle" });
    cy += 0.62;
  });

  footer(s, 7);
}
```

---

## Big statement

One sentence deserves the whole slide. The loudest layout there is — use it once or
twice per deck. Works on light (shown) or dark (`darkEdge`, `C.dark` background,
`C.white` text).

```js
{
  const s = pres.addSlide();
  accent(s, M, 2.6, 2.3, C.accent);
  s.addText("The one idea, in a single sentence, set large enough to fill the room.", {
    x: M + 0.4, y: 2.5, w: CW - 1.0, h: 2.5,
    fontFace: FONT, fontSize: 30, bold: true, color: C.dark, margin: 0, valign: "middle", lineSpacingMultiple: 1.05
  });
  s.addText("An optional attribution or qualifier line.", {
    x: M + 0.4, y: 5.1, w: CW - 1.0, h: 0.4,
    fontFace: FONT, fontSize: 13, color: C.muted, margin: 0, valign: "middle"
  });
  footer(s, 8);
}
```

---

## Pull quote

A human voice — a customer, a user, a survey verbatim. The oversized quote mark reads
as editorial.

```js
{
  const s = pres.addSlide();
  header(s, "Section", "What they told us");

  s.addText("“", {
    x: M - 0.06, y: 1.7, w: 1.2, h: 1.2,
    fontFace: FONT, fontSize: 96, bold: true, color: C.accentWash, margin: 0, valign: "top"
  });
  s.addText("The quote, kept to one or two sentences so it can be read aloud in a single breath.", {
    x: M + 0.9, y: 2.2, w: CW - 1.6, h: 1.8,
    fontFace: FONT, fontSize: 22, color: C.dark, margin: 0, valign: "top", lineSpacingMultiple: 1.1
  });
  hrule(s, 4.4, M + 0.9, 2.0, C.accent, 2);
  s.addText("Name, role", { x: M + 0.9, y: 4.56, w: 8, h: 0.3, fontFace: FONT, fontSize: 12.5, bold: true, color: C.dark, margin: 0 });
  s.addText("Where they're from, or the context of the quote.", { x: M + 0.9, y: 4.86, w: 8, h: 0.3, fontFace: FONT, fontSize: 11, color: C.muted, margin: 0 });
  footer(s, 9);
}
```

---

## Timeline

A sequence over time — a roadmap, a history, phases. Dots on a horizontal spine.

```js
{
  const s = pres.addSlide();
  header(s, "Section", "How this unfolds", "Left to right, in order.");

  const steps = [
    ["Now",  "Where things stand today."],
    ["Next", "The immediate step."],
    ["Then", "What follows once that lands."],
    ["Later","The end state."],
  ];

  const spineY = 2.9, x0 = M + 0.1, colW = (CW - 0.2) / steps.length;
  hrule(s, spineY, x0, CW - 0.2, C.rule, 1.5);
  steps.forEach((st, i) => {
    const cx = x0 + i * colW;
    const done = i === 0;
    s.addShape(pres.ShapeType.ellipse, { x: cx - 0.09, y: spineY - 0.08, w: 0.2, h: 0.2, fill: { color: done ? C.good : C.accent }, line: { width: 0 } });
    s.addText(st[0], { x: cx + 0.24, y: spineY - 0.72, w: colW - 0.3, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: C.dark, margin: 0, valign: "bottom" });
    s.addText(st[1], { x: cx + 0.24, y: spineY + 0.22, w: colW - 0.4, h: 1.2, fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top" });
  });
  footer(s, 10);
}
```

---

## Image with caption

A screenshot, diagram, or photo. Give the image room; let the caption carry the point.
Replace the placeholder rectangle with `s.addImage({ path, x, y, w, h })`.

```js
{
  const s = pres.addSlide();
  header(s, "Section", "What this looks like");

  // Placeholder — swap for: s.addImage({ path: "screenshot.png", x: M, y: 1.9, w: 8.2, h: 4.6 });
  s.addShape(pres.ShapeType.rect, { x: M, y: 1.9, w: 8.2, h: 4.6, fill: { color: C.tint }, line: { color: C.rule, width: 1 } });
  s.addText("image goes here", { x: M, y: 1.9, w: 8.2, h: 4.6, fontFace: FONT, fontSize: 12, color: C.muted, align: "center", valign: "middle", margin: 0 });

  // Caption rail on the right.
  vrule(s, M + 8.7, 1.9, 4.6);
  s.addText("What to notice", { x: M + 8.95, y: 2.0, w: 3.0, h: 0.34, fontFace: FONT, fontSize: 13, bold: true, color: C.dark, margin: 0 });
  s.addText("Two or three sentences pointing at the thing in the image that matters. The reader's eye goes to the picture; the words tell them what they're seeing.", {
    x: M + 8.95, y: 2.4, w: 3.0, h: 3.8, fontFace: FONT, fontSize: 11.5, color: C.ink, margin: 0, valign: "top", lineSpacingMultiple: 1.15
  });
  footer(s, 11);
}
```

---

## Closing (dark)

Mirror the title so the deck is bookended. One line, large, plus a next step.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  darkEdge(s);

  s.addText("IN CLOSING", { x: M, y: 2.4, w: CW, h: 0.26, fontFace: FONT, fontSize: 10, bold: true, color: C.accentSoft, charSpacing: 2.4, margin: 0 });
  s.addText("The one line to leave in the room.", { x: M, y: 2.78, w: CW, h: 0.9, fontFace: FONT, fontSize: 30, bold: true, color: C.white, margin: 0, valign: "middle" });
  hrule(s, 3.9, M, 2.2, C.accentBright, 2.5);
  s.addText("A next step, a contact, or where to go from here.", { x: M, y: 4.12, w: 10.6, h: 0.5, fontFace: FONT, fontSize: 14, color: C.accentSoft, margin: 0, valign: "top" });
  s.addText("12", { x: W - M - 0.5, y: 6.88, w: 0.5, h: 0.26, fontFace: FONT, fontSize: 8.5, color: C.dimOnDark, align: "right", margin: 0, valign: "middle" });
  s.addNotes("End on the takeaway, then stop. Let it land.");
}
```
