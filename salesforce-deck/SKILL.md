---
name: salesforce-deck
description: Build on-brand Salesforce PowerPoint decks in code with pptxgenjs, matching the Salesforce Corporate Template 2026 exactly. Use when asked to create, generate, or edit a Salesforce-branded .pptx — customer decks, QBRs, readouts, all-hands, proposals, training, kickoffs. The branding is LOCKED: fixed 2026 palette, Avant Garde Demi + Salesforce Sans, 20×11.25 canvas, rounded white cards with the blue drop shadow, and the real cloud logo. Claude composes layouts and writes copy; it does NOT choose colors, fonts, or effects.
---

# Salesforce-branded decks, generated from code

Build Salesforce decks by writing a Node script, not by hand-placing boxes. The
script is the source of truth; the `.pptx` is a build artifact. This skill produces
decks that match the **Salesforce Corporate Template 2026** — the same palette,
typefaces, canvas, rounded-card style, blue shadow, and logo lockups.

**This skill is brand-locked, and that is the whole point.** A general deck builder
lets you re-skin to any brand. This one does not: the identity is fixed so a deck
can't drift off-brand. Read `reference/brand-spec.md` — it is the authority. When
your visual instinct disagrees with it, it wins.

## What you decide, and what you must not

**You compose and write:**
- Which layouts fit each piece of content (from the menu in `reference/slide-patterns.md`)
- The order and length of the deck — there is no required sequence
- The words: titles that state the point, body copy, speaker notes
- Which of the brand's grounds a slide uses (white, light blue, blue, navy)

**You must NOT change — these are frozen in the `BRAND` block:**
- The palette. Only named brand tokens. Electric Blue 50 `#066AFE` is *the*
  Salesforce Blue; the extended palette (teal/yellow/pink/violet) is secondary
  accents only.
- The two typefaces. Avant Garde Demi SFDC (titles/stats, Demi weight only, no
  italics) and Salesforce Sans (body). No third font, ever.
- The 20 × 11.25 in canvas and the type scale calibrated to it.
- The rounded-container radius, the pill CTA, and the **Electric Blue `#066AFE` at
  15%** drop shadow. Never a black shadow, never a gradient, never an added effect.
- The logo. Use the shipped asset; never recolor, redraw, or stretch it.

If a user asks for a different color, font, or "flat" look, explain that this skill
matches the locked corporate template and offer the closest on-brand option — don't
edit `BRAND`. (If they truly want an arbitrary brand, that's the generic
`deck-builder` skill, not this one.)

## Why code instead of PowerPoint

- **Reproducible.** Same script, same deck, every time.
- **On-brand by construction.** The palette, fonts, and shadow live in one frozen
  block; individual slides can't wander off it.
- **Reviewable.** Content lives in arrays you can read and diff.
- **Speaker notes stay attached** to the slide they belong to.

The tradeoff: you can't see the slides while building. Bounds-check after every build
(see *Verifying*), and open the file to check text fitting.

## Setup

```bash
mkdir my-deck && cd my-deck
npm init -y
npm install pptxgenjs
cp -r /path/to/this/skill/assets/brand ./brand      # the logo lockups
cp /path/to/this/skill/assets/fitcheck.js ./        # text-overflow guard (required by the template)
cp /path/to/this/skill/assets/deck_template.js build_deck.js
node build_deck.js
```

`build_deck.js` `require`s `./fitcheck` — copy it alongside, or the build errors on
a missing module.

The template references **Avant Garde Demi SFDC** and **Salesforce Sans** by name.
On a Salesforce-issued Mac both are usually installed — check with
`system_profiler SPFontsDataType | grep -iE "salesforce sans|avant garde"`. If either
is missing, PowerPoint substitutes a system sans; the deck degrades but stays
legible. Do not switch fonts in the script to "fix" this — the font names are part of
the brand lock.

## How to work

1. **Get the argument first.** Before any layout code, be clear on what the deck is
   *for* and what each slide is doing — informing, comparing, persuading, recording.
   Design is downstream of that.
2. **Copy `assets/deck_template.js`** and the `assets/brand/` folder. The template
   ships with the frozen `BRAND` block, the primitives, and worked example slides.
3. **Compose from the menu.** The examples in the template and the full set in
   `reference/slide-patterns.md` are a menu, not a sequence. Keep what fits; delete
   the rest; reorder freely.
4. **One slide per block.** Keep each slide in its own `{ ... }` scope so variable
   names can repeat and slides move as a unit.
5. **Content in arrays, layout in loops.** Never hand-position repeated elements — the
   card-row and list patterns show the shape.
6. **Use the primitives, not raw shapes.** `card()`, `cta()`, `header()`, `logo()`,
   `stat()`, `hrule()`, `footer()`, `tableHead/tableRow` encode the brand. Reaching
   past them to hand-roll a shape with your own color/radius/shadow is how a deck goes
   off-brand.
7. **Build, bounds-check, open.** Then iterate.

## The design language (matches the template — not "flat")

The Salesforce 2026 look is **white rounded cards floating on a light-blue ground,
each with a soft blue shadow.** That is the signature. Concretely:

- **Rounded containers** (~12.5% radius) and **pill CTAs** (50%). Use `card()` and
  `cta()`.
- **The blue shadow** — `#066AFE` at 15% — on white containers and CTAs. This is a
  documented brand requirement, not decoration. Never substitute black.
- **Grounds:** white, Cloud Blue 90 `#CFE9FE`, Cloud Blue 95 wash `#EAF5FE`, Electric
  Blue 50 (covers/closes), Electric Blue 15 navy (dividers). Nothing else.
- **Titles in Avant Garde**, body in Salesforce Sans. Blue hairline under headers.
- **No** gradients, glows, bevels, black shadows, clip-art, or a second font. The
  rounded-card-with-blue-shadow is the entire depth vocabulary.

## Vary the layout

Four identical three-card slides in a row is the fastest way to look machine-made,
even on brand. Rotate between: card rows, real tables, numbered lists, stat rows,
pull quotes, statement bands, section dividers. Let the content pick the shape.

## Writing the words

Design carries less than the language does. What reads as AI-written, in any deck:

- Antithesis and triads on every slide — *"earned, gated, specified"*. One is a good
  line; five is a tic.
- Em-dashes everywhere.
- Headers that name a category (*"Key Considerations"*) instead of saying the point
  (*"Two of these ship this quarter; the third slips"*).

Prefer sentences a person would say out loud, headers that state the point, and plain
verbs. If a header could be the first line of what you'd say standing up, it's right.

## Speaker notes are half the deliverable

Put on the slide only what the audience needs to see; everything else goes in
`addNotes()`: what to actually say, which facts are unconfirmed and must be checked
first, likely questions with prepared answers, and "say this, don't ship it" guidance.
A deck gets forwarded and notes travel with it — so nothing genuinely private belongs
in either.

## Flagging unconfirmed numbers

Mark any unverified figure inline with `°` and footnote it via `footer(s, n, note)`.
Presenting an estimate as settled is the fastest way to lose a room.

## Required legal slides

External Salesforce decks carry a **Forward-Looking Statements** slide (and often a
Notice of Confidentiality). The template includes an FLS example, but its wording is a
placeholder. **Confirm the current approved language with Legal / Brand Central before
presenting externally** — it changes over time.

## Verifying a build

Bounds-check every build against the **20 × 11.25** canvas — it catches anything
positioned off-slide:

```bash
node build_deck.js && node -e "$(cat <<'EOF'
const {execSync}=require('child_process');
execSync('rm -rf /tmp/_dc && mkdir -p /tmp/_dc && cd /tmp/_dc && unzip -q "'"$PWD"'"/*.pptx');
const fs=require('fs'),path='/tmp/_dc/ppt/slides/';
let bad=0;
for(const f of fs.readdirSync(path).filter(x=>x.endsWith('.xml'))){
  const xml=fs.readFileSync(path+f,'utf8');
  for(const m of xml.matchAll(/<a:off x="(-?\d+)" y="(-?\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"/g)){
    const[,x,y,cx,cy]=m.map(Number),E=914400;
    if((x+cx)/E>20.02||(y+cy)/E>11.27||x<0||y<0){console.log(f,'overflow');bad++}
  }
}
console.log(bad?bad+' overflow':'bounds ok');
EOF
)"
```

Also worth a quick brand-lint: confirm every `typeface=` in the output is one of the
two brand faces and every `srgbClr` is a brand token. If a stray font or color shows
up, a slide reached past the primitives.

### Text-fit check (catches overflow the bounds-check can't)

Bounds-checking verifies boxes sit on-canvas; it **cannot** see text spilling out of
its own box — a long paragraph running into the heading below it. The template wires
in `fitcheck.js` for exactly this: it records every `addText()`, estimates how many
lines each string wraps to at its width and font size, and flags any box whose text
**collides with another box below it in the same column.** It prints on every build:

```
⚠ TEXT-FIT COLLISIONS (a box overruns into the one below — fix these):
  slide  3: ~1.30" of text in 1.02" box (4 lines @ 18pt)  "Account SEs live on breadth..."
            └ overruns into: "Nothing sizes our own effort"
```

Collisions are real bugs — fix them (shorten the copy, or raise the box/card height;
never drop below 14pt). The separate **soft** list ("extend past their declared
height into open space") is text flowing into whitespace — usually fine, but eyeball
dense slides. To make the build **fail** on a collision, call
`fit.report({ throwOnCollision: true })`.

It's an **estimate** (pptxgenjs never renders text, so wrap points aren't exact) —
tune `CHAR_W` in `fitcheck.js` if it's too eager or too lax. The exact check is still
opening the file in a renderer, but this catches the common collisions for free.

## Protecting hand edits

The template refuses to build if the `.pptx` is newer than the script, so PowerPoint
edits produce an error instead of vanishing. Override with `node build_deck.js
--force`. If someone edits in PowerPoint, port the change back into the script.

Some things can't be generated at all: transitions, animations, comments, master-slide
changes. If a deck needs those, they're the last step before presenting, and the
`.pptx` becomes the source of truth from that point.

## Files

- `assets/deck_template.js` — copy this and edit. The frozen `BRAND` block, the
  primitives, and worked example slides (cover, agenda, card row, stat row, divider,
  pull quote, forward-looking statements, thank-you). Builds as-is.
- `assets/fitcheck.js` — the text-overflow guard the template wires in. Copy it
  alongside `build_deck.js`.
- `assets/brand/` — the Salesforce cloud logo, color and white (reverse) variants.
  Copy this folder alongside the script.
- `reference/brand-spec.md` — the authority: palette with hex + tokens, type scale,
  the shadow/corner spec, and the hard rules. Read before building.
- `reference/slide-patterns.md` — copy-paste code for the full menu of on-brand
  layouts.
- `examples/` — a worked, runnable branded deck showing the patterns composed.
