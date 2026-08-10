# Slide patterns — Salesforce 2026

A menu of on-brand layouts, not a sequence. Pick the shape that fits each piece of
content; skip the rest. Every block assumes the frozen `BRAND` block, the aliases
(`C`, `DF`, `BF`, `T`), the primitives (`header`, `hrule`, `card`, `cta`, `logo`,
`stat`, `footer`, `radius`, `brandShadow`, `tableHead`, `tableRow`, `TBL_BORDER`),
and the constants (`W`, `H`, `M`, `CW`) from `assets/deck_template.js` are in scope.

Everything here already conforms to the brand. Don't reach past the primitives to
hand-roll shapes with your own colors, radii, or shadows — that's how a deck drifts
off-brand. If you need a color, it's a token in `C`; if you need depth, it's `card()`
or `brandShadow()`.

**How to choose:**

| You have… | Reach for |
|-----------|-----------|
| A cover or a close | **Cover / Thank-you** (blue) |
| A gear-shift between topics | **Section divider** (navy) |
| An outline of the talk | **Agenda** |
| Two or three areas to present side by side | **Card row** |
| Options/states to contrast, one the exception | **Card row with status** |
| More than three things with the same attributes | **Table** |
| Real numbers to headline | **Stat row** |
| A list of steps, asks, or requirements | **Numbered list** |
| One sentence that deserves the slide | **Statement band** |
| A human voice — a customer or user | **Pull quote** |
| A screenshot, diagram, or photo | **Image in a card** |
| A required legal notice | **Forward-looking statements** |

Don't run the same layout twice in a row. Variety is what keeps a deck from reading
as machine-made, even on brand.

---

## Cover (brand blue)

The corporate cover: a solid Salesforce-blue field, the reverse logo top-left, an
Avant Garde title, a Salesforce Sans subtitle, and a presenter line. For a navy
cover, swap the background to `C.eb15`.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.eb50 };
  logo(s, M, M, 3.1, "white");

  s.addText("The deck title", {
    x: M, y: 4.3, w: CW - 2.0, h: 2.6,
    fontFace: DF, fontSize: T.coverTitle, color: C.white, margin: 0, valign: "top",
  });
  s.addText("One line saying what this is, in plain language.", {
    x: M, y: 7.1, w: CW - 3.0, h: 0.9,
    fontFace: BF, fontSize: T.subtitle, color: C.cb90, margin: 0, valign: "top",
  });
  s.addText("Presenter Name  ·  Title", {
    x: M, y: H - 1.5, w: CW, h: 0.44, fontFace: BF, fontSize: T.detail, bold: true, color: C.white, margin: 0,
  });
  s.addText("Date, or the occasion", {
    x: M, y: H - 1.06, w: CW, h: 0.44, fontFace: BF, fontSize: T.caption, color: C.cb80, margin: 0,
  });
  s.addNotes("What to say out loud when this slide is up.");
}
```

---

## Section divider (navy)

A quiet gear-shift between topics. Deep Electric Blue 15 ground, a number, a blue
rule, the section name in Avant Garde, and the reverse logo in the corner.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.eb15 };

  s.addText("02", { x: M, y: 4.2, w: 3, h: 1.0, fontFace: DF, fontSize: T.category, color: C.cb68, margin: 0, valign: "middle" });
  hrule(s, 5.3, M, 1.4, C.eb50, 3);
  s.addText("The name of this section", { x: M, y: 5.5, w: CW, h: 1.3, fontFace: DF, fontSize: T.coverTitle, color: C.white, margin: 0, valign: "middle" });
  s.addText("One line on what this section covers and why it's here.", {
    x: M, y: 6.9, w: CW - 4.0, h: 0.8, fontFace: BF, fontSize: T.subtitle, color: C.cb80, margin: 0, valign: "top",
  });
  logo(s, W - M - 2.4, H - M - 2.4 / (1960/1372), 2.4, "white");
  s.addNotes("Use dividers to reset attention, not to pad the deck.");
}
```

---

## Agenda

A numbered outline on white. Rows step by a constant increment so they line up.

```js
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
    s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 1.2, h: step, fontFace: DF, fontSize: T.category, color: C.eb50, margin: 0, valign: "middle" });
    s.addText(a[0], { x: M + 1.3, y, w: 9.5, h: step, fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0, valign: "middle" });
    s.addText(a[1], { x: M + 11.0, y, w: CW - 11.0, h: step, fontFace: BF, fontSize: T.body, color: C.muted, margin: 0, valign: "middle" });
    hrule(s, y + step - 0.02, M, CW, C.rule, 1);
    y += step;
  });
  footer(s, 2);
}
```

---

## Card row (the signature layout)

White rounded cards with the blue shadow, on a Cloud Blue 90 ground. Two, three, or
four across — three is the workhorse. A short colored tab per card differentiates
without shouting.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.cb90 };
  header(s, "Section", "A title that states the conclusion");

  const cols = [
    ["First area",  "Two or three sentences on what's true here and why it matters.", C.teal],
    ["Second area", "Keep each card to a single idea; the shadow and whitespace separate them.", C.eb50],
    ["Third area",  "The one that's different — the reason this slide exists.",        C.yellow],
  ];

  const gap = 0.5, colW = (CW - gap * 2) / 3, cardY = 2.7, cardH = 6.4;
  cols.forEach((c, i) => {
    const x = M + i * (colW + gap);
    card(s, x, cardY, colW, cardH);
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.5, y: cardY + 0.6, w: 0.9, h: 0.16, rectRadius: 0.08, fill: { color: c[2] }, line: { type: "none" } });
    s.addText(c[0], { x: x + 0.5, y: cardY + 1.0, w: colW - 1.0, h: 0.9, fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0, valign: "top" });
    s.addText(c[1], { x: x + 0.5, y: cardY + 1.95, w: colW - 1.0, h: cardH - 2.5, fontFace: BF, fontSize: T.body, color: C.ink, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  });
  footer(s, 3);
}
```

---

## Card row with status

Same cards, but each carries a status pill. Give the exception a different color so
the point lands before the text is read. Reach for `cta()`-style pills sparingly;
here they're labels, not buttons, so a small filled pill is fine.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.cb90 };
  header(s, "Section", "Where each workstream stands");

  const cols = [
    ["Workstream A", "On track", C.tealDeep, C.tealWash, "What's true here, in a sentence or two."],
    ["Workstream B", "On track", C.tealDeep, C.tealWash, "What's true here."],
    ["Workstream C", "At risk",  C.pinkDeep, C.pinkWash, "The one that's different — why this slide exists."],
  ];

  const gap = 0.5, colW = (CW - gap * 2) / 3, cardY = 2.7, cardH = 6.4;
  cols.forEach((c, i) => {
    const x = M + i * (colW + gap);
    card(s, x, cardY, colW, cardH);
    // status pill
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.5, y: cardY + 0.6, w: 2.6, h: 0.6, rectRadius: radius(0.6, "pill"), fill: { color: c[3] }, line: { type: "none" } });
    s.addText(c[1].toUpperCase(), { x: x + 0.5, y: cardY + 0.6, w: 2.6, h: 0.6, align: "center", valign: "middle", fontFace: BF, fontSize: T.caption, bold: true, color: c[2], charSpacing: 1.5, margin: 0 });
    s.addText(c[0], { x: x + 0.5, y: cardY + 1.45, w: colW - 1.0, h: 0.9, fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0, valign: "top" });
    s.addText(c[4], { x: x + 0.5, y: cardY + 2.4, w: colW - 1.0, h: cardH - 3.0, fontFace: BF, fontSize: T.body, color: C.ink, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  });
  footer(s, 4);
}
```

---

## Table

When more than three things share the same attributes, a real table beats cards.
Horizontal hairlines only; header row on the palest blue wash. Highlight the row that
carries the argument with a wash.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, "Section", "The comparison, stated as a claim");

  const rows = [tableHead(["", "Column two", "Column three", "Column four"])];
  rows.push(tableRow(["First row",  "Value", "Value", "Value"]));
  rows.push(tableRow(["Second row", "Value", "Value", "Value"]));
  rows.push(tableRow(["Third row",  "Value", "Value", "Value"]));
  rows.push(tableRow(["The exception", "Value", "Value", "Why this one is different"], C.pinkWash));

  s.addTable(rows, {
    x: M, y: 2.7, w: CW,
    colW: [4.2, 5.0, 4.0, CW - 13.2],
    border: TBL_BORDER, autoPage: false,
  });
  footer(s, 5);
  s.addNotes("Walk the table once. Don't read every cell.");
}
```

---

## Stat row

Real numbers in Avant Garde. Keep to four; more reads as a dashboard. Mark anything
unconfirmed with `°` and footnote it. Close with a statement band if the numbers add
up to one point.

```js
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
  stats.forEach((st, i) => stat(s, M + i * sw, 3.0, sw - 0.4, st[0], st[1], i === 3 ? C.teal : C.eb50));

  // statement band — see the Statement band pattern below
  footer(s, 6, "° This figure is unconfirmed and needs checking before presenting.");
}
```

---

## Numbered list

Steps, asks, requirements, an agenda item's detail. Rows step by a constant
increment. Works on white or the light-blue ground.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, "Section", "The list, titled as what it accomplishes");

  const items = [
    ["The first item",  "One or two sentences of detail about what this means."],
    ["The second item", "Detail."],
    ["The third item",  "Detail."],
    ["The fourth item", "Detail."],
  ];

  let y = 2.8;
  const step = (H - 1.6 - y) / items.length;
  items.forEach((a, i) => {
    s.addText(String(i + 1).padStart(2, "0"), { x: M, y, w: 1.0, h: 0.7, fontFace: DF, fontSize: T.category, color: C.eb50, margin: 0, valign: "top" });
    s.addText(a[0], { x: M + 1.1, y, w: CW - 1.1, h: 0.6, fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0, valign: "top" });
    s.addText(a[1], { x: M + 1.1, y: y + 0.7, w: CW - 1.1, h: step - 0.9, fontFace: BF, fontSize: T.body, color: C.ink, margin: 0, valign: "top" });
    y += step;
  });
  footer(s, 7);
}
```

---

## Statement band

One sentence deserves the whole slide, or a filled blue band caps a slide. The
loudest element there is — use it a couple of times per deck, no more. A rounded blue
card with white Avant Garde.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  const by = 4.3, bh = 2.6;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: by, w: CW, h: bh, rectRadius: radius(bh, "card"), fill: { color: C.eb50 }, line: { type: "none" } });
  s.addText("The one idea, in a single sentence, set large enough to fill the room.", {
    x: M + 0.8, y: by + 0.4, w: CW - 1.6, h: bh - 0.8, fontFace: DF, fontSize: T.title, color: C.white, margin: 0, valign: "middle", lineSpacingMultiple: 1.05,
  });
  footer(s, 8);
}
```

---

## Pull quote

A human voice — a customer, a user, a survey verbatim. The oversized quote mark in a
soft cloud blue reads as editorial. On the Cloud Blue 95 wash.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.cb95 };

  s.addText("“", { x: M - 0.1, y: 1.4, w: 2.4, h: 2.4, fontFace: DF, fontSize: 200, color: C.cb80, margin: 0, valign: "top" });
  s.addText("The quote, kept to one or two sentences so it can be read aloud in a single breath.", {
    x: M + 1.9, y: 3.4, w: CW - 3.4, h: 3.2, fontFace: DF, fontSize: T.title, color: C.eb20, margin: 0, valign: "top", lineSpacingMultiple: 1.1,
  });
  hrule(s, 7.5, M + 1.9, 3.0, C.eb50, 3);
  s.addText("Name, role", { x: M + 1.9, y: 7.7, w: 12, h: 0.5, fontFace: DF, fontSize: T.body, color: C.eb20, margin: 0 });
  s.addText("Where they're from, or the context of the quote.", { x: M + 1.9, y: 8.2, w: 12, h: 0.5, fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0 });
  footer(s, 9);
}
```

---

## Image in a card

A screenshot, diagram, or photo. Put the image in a white card (so it gets the brand
shadow and rounding) and let a caption rail carry the point. Replace the placeholder
with `s.addImage({ path, x, y, w, h })`.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.cb90 };
  header(s, "Section", "What this looks like");

  const imgX = M, imgY = 2.7, imgW = 12.0, imgH = 7.4;
  card(s, imgX, imgY, imgW, imgH); // white card with shadow behind the image
  // placeholder — swap for: s.addImage({ path: "screenshot.png", x: imgX + 0.3, y: imgY + 0.3, w: imgW - 0.6, h: imgH - 0.6 });
  s.addText("image goes here", { x: imgX, y: imgY, w: imgW, h: imgH, align: "center", valign: "middle", fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0 });

  const railX = imgX + imgW + 0.6;
  s.addText("What to notice", { x: railX, y: imgY + 0.1, w: CW - imgW - 0.6, h: 0.6, fontFace: DF, fontSize: T.category, color: C.eb20, margin: 0 });
  s.addText("Two or three sentences pointing at the thing in the image that matters. The eye goes to the picture; the words say what they're seeing.", {
    x: railX, y: imgY + 0.9, w: CW - imgW - 0.6, h: 5.0, fontFace: BF, fontSize: T.body, color: C.ink, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
  });
  footer(s, 10);
}
```

---

## CTA row

A next-step slide with pill buttons. Pills are `cta()` — blue fill, white label, the
brand shadow.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.cb95 };
  header(s, "Next steps", "What we're asking for");

  s.addText("A sentence framing the decision or the ask.", {
    x: M, y: 2.9, w: CW, h: 1.0, fontFace: BF, fontSize: T.subtitle, color: C.ink, margin: 0, valign: "top",
  });
  cta(s, M, 4.4, 4.6, 0.9, "Primary action");
  cta(s, M + 5.0, 4.4, 4.6, 0.9, "Secondary action");
  footer(s, 11);
}
```

---

## Forward-looking statements (required legal)

External Salesforce decks carry this. **The wording below is a placeholder — confirm
the current approved language with Legal / Brand Central before presenting.**

```js
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  header(s, null, "Forward-looking statements");

  s.addText(
    "This presentation contains forward-looking statements ... [approved FLS language]. " +
    "Customers should make purchase decisions based on features currently available.\n\n" +
    "CONFIRM WITH LEGAL before presenting externally.",
    { x: M, y: 2.5, w: CW, h: 6.5, fontFace: BF, fontSize: T.detail, color: C.muted, margin: 0, valign: "top", lineSpacingMultiple: 1.2 }
  );
  footer(s, 12);
  s.addNotes("Do not present externally until Legal has confirmed the current wording.");
}
```

---

## Thank-you (brand blue close)

Mirror the cover so the deck is bookended.

```js
{
  const s = pres.addSlide();
  s.background = { color: C.eb50 };

  s.addText("Thank you", { x: M, y: 4.4, w: CW, h: 1.6, fontFace: DF, fontSize: T.coverTitle, color: C.white, margin: 0, valign: "middle" });
  hrule(s, 6.1, M, 2.6, C.cb68, 3);
  s.addText("A next step, a contact, or where to go from here.", {
    x: M, y: 6.4, w: CW - 3.0, h: 0.9, fontFace: BF, fontSize: T.subtitle, color: C.cb90, margin: 0, valign: "top",
  });
  logo(s, W - M - 2.6, H - M - 2.6 / (1960/1372), 2.6, "white");
  s.addNotes("End on the takeaway, then stop. Let it land.");
}
```
