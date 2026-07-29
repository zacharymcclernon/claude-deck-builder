---
name: deck-builder
description: Build good-looking PowerPoint decks in code with pptxgenjs — any kind of deck, not one fixed format. Use when asked to create, generate, or edit a .pptx presentation of any sort: readouts, training, proposals, all-hands, reference explainers, pitches, QBRs, onboarding. Produces flat, editorial-looking slides that don't read as template-generated. Ships with a Salesforce Lightning Design System theme by default; the theme is swappable to any brand in one config block.
---

# Decks, generated from code

Build decks by writing a Node script, not by hand-placing boxes. The script is the
source of truth; the `.pptx` is a build artifact.

This skill does not assume a kind of deck. Whatever the user asks for — a training
module, a status readout, a reference explainer, a proposal, a pitch — the job is
the same: get the content and the argument right, then format it well. There is no
required slide sequence and no fixed length. You compose the deck from a menu of
layouts (`reference/slide-patterns.md`), picking the shape that fits each piece of
content.

## Why code instead of PowerPoint

- **Reproducible.** Same script, same deck, every time.
- **Reviewable.** Content lives in arrays you can read and diff.
- **Fast to iterate.** Change a line, rebuild, look. No dragging.
- **Speaker notes stay attached** to the slide they belong to.

The tradeoff: you can't see the slides while building. Bounds-check after every
build (see *Verifying*), and open the file to check text fitting.

## Setup

```bash
mkdir my-deck && cd my-deck
npm init -y
npm install pptxgenjs
cp /path/to/this/skill/assets/deck_template.js build_deck.js
node build_deck.js
```

The template ships with **Salesforce Sans**. Most Salesforce-issued Macs have it —
check with `system_profiler SPFontsDataType | grep -i "salesforce sans"`. If it's
missing, set the font to the fallback in the `THEME` block (see below). Anyone
opening the deck without the font gets a system-sans fallback, which degrades
acceptably.

## How to work

1. **Get the argument first.** Before any layout code, be clear on what the deck is
   *for* and what each slide is doing — informing, comparing, instructing,
   persuading, recording. The design is downstream of that. This matters whether or
   not the deck is trying to convince anyone.
2. **Copy `assets/deck_template.js`** and edit it. It ships with the theme, the
   primitives, and four independent example slides.
3. **Compose from the menu.** The examples in the template and the full set in
   `reference/slide-patterns.md` are a menu, not a sequence. Keep the layouts that
   fit your content; delete the rest; reorder freely.
4. **One slide per block.** Keep each slide in its own `{ ... }` scope so variable
   names can repeat and slides can be reordered by moving a block.
5. **Content in arrays, layout in loops.** Never hand-position repeated elements —
   the column and row patterns show the shape.
6. **Build, bounds-check, open.** Then iterate.

## Changing the look (re-skin)

The whole visual identity — every color and both fonts — lives in the `THEME`
object at the top of the template. Nothing else in the script hard-codes a color.
To re-brand a deck, edit `THEME` and rebuild; every slide updates.

Colors are named by **role**, not hue, so the meaning survives a re-skin:
`accent` is the through-line, `warn` flags a gap or risk, `good` marks something
confirmed or positive, `alt` is an optional neutral third category, `dark` is the
dark-slide background and heading color. `reference/design-system.md` has the full
palette, the type scale, and a step-by-step for swapping in a new brand.

The default theme is Salesforce Lightning Design System. It is a sensible default,
not a mandate — if the user names a brand or hands you colors, put them in `THEME`.

## Design rules that keep it from looking generated

Read `reference/design-system.md` for the full spec. The rules that matter most,
regardless of brand or deck type:

**Flat.** No drop shadows, no rounded corners, no gradients. Structure comes from
hairline rules, whitespace, and left accent bars. Drop shadows on rounded cards are
the single strongest tell of a generated deck.

**Vary the layout.** The fastest way to look machine-made is four identical
three-card slides in a row. Rotate between: ruled rows, real tables, numbered lists
with a sidebar, column comparisons, stat rows, full-bleed statement slides.

**One type family.** One sans throughout, weight and size for hierarchy. Never pair
a serif with it.

**Use accent color as signal, not decoration.** The accent carries the through-line;
`warn` appears only where you're naming a gap or a risk; `good` only for something
confirmed or positive. If every slide has `warn` on it, `warn` means nothing.

**Statement bands, sparingly.** A full-width band is the loudest element available.
A couple of times in a deck. Nine times and they're wallpaper.

**Dark slides bookend.** A dark title and closing slide with light content between
gives a deck shape. Optional, but it reads well.

## Writing the words

Design carries less than the language does. What reads as AI-written, in any deck:

- Antithesis and triads on every slide — *"earned, gated, specified"*,
  *"designed, not proven"*. One is a good line. Five is a tic.
- Em-dashes everywhere.
- Headers that name a category (*"Key Considerations"*) instead of saying the point
  (*"Two of these ship this quarter; the third slips"*).

Prefer: sentences a person would say out loud, headers that state the point, and
plain verbs. If a header could be the first line of what you'd say standing up, it's
right. This holds for a training deck as much as a pitch — a section header that
says what the reader will learn beats one that just names the topic.

## Speaker notes are half the deliverable

Put on the slide only what the audience needs to see. Everything else goes in
`addNotes()`:

- What to actually say, in the presenter's voice
- Which facts are unconfirmed and must be checked first
- Questions likely to come up, with a prepared answer
- Anything sensitive that should be spoken but never written down

A deck file gets forwarded. Notes travel with it, so anything genuinely private
belongs in neither — but "say this, don't ship it" guidance in notes is appropriate
and useful.

## Flagging unconfirmed numbers

If a figure isn't verified, mark it inline with `°` and footnote it. Presenting an
estimate as settled is the fastest way to lose a room when someone checks. The
template's `footer()` takes a note string for exactly this.

## Verifying a build

Bounds-check every build — it catches anything positioned off-slide:

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
    if((x+cx)/E>13.34||(y+cy)/E>7.51||x<0||y<0){console.log(f,'overflow');bad++}
  }
}
console.log(bad?bad+' overflow':'bounds ok');
EOF
)"
```

Simpler: ask Claude to bounds-check after building. It unzips the `.pptx` and checks
every shape's origin plus extent against the 13.33 × 7.5in slide.

**What bounds-checking does not catch:** text overflowing its own box. Only opening
the file catches that. If a text block looks tight, either shorten the copy or raise
the box height — don't shrink below 9pt.

## Protecting hand edits

The template includes a guard that refuses to build if the `.pptx` is newer than the
script, so PowerPoint edits produce an error instead of vanishing. Override with
`node build_deck.js --force`.

If someone edits in PowerPoint, port the change back into the script. Otherwise the
next build silently reverts it.

Some things can't be generated at all: transitions, animations, comments,
master-slide changes. If a deck needs those, they're the last step before presenting,
and the `.pptx` becomes the source of truth from that point.

## Files

- `assets/deck_template.js` — copy this and edit. The `THEME` block, the primitives,
  and four independent example slides. Builds as-is.
- `reference/design-system.md` — the palette with hex values, type scale, layout
  grid, the flat-design rules with rationale, and how to re-skin `THEME` for any brand.
- `reference/slide-patterns.md` — copy-paste code for the full menu of slide layouts.
- `examples/` — a small worked deck (a non-pitch one) showing the patterns composed.
