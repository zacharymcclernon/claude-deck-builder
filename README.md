# deck-builder

A Claude Code skill for building good-looking PowerPoint decks **from code** with
[pptxgenjs](https://github.com/gitbrent/PptxGenJS) — any kind of deck, not one fixed
format. Readouts, training, proposals, all-hands, reference explainers, pitches, QBRs,
onboarding. The output is flat, editorial-looking slides that don't read as
template-generated.

The script is the source of truth; the `.pptx` is a build artifact. Content lives in
arrays you can read and diff, speaker notes stay attached to their slide, and the whole
visual identity — every color and both fonts — lives in one `THEME` block you edit to
re-brand the deck.

It ships with a Salesforce Lightning Design System theme by default. That's a sensible
default, not a mandate: point the `THEME` block at any brand's colors and every slide
updates.

## Use it as a Claude Code skill

Drop this repo into your skills directory so Claude Code loads it automatically:

```bash
git clone https://github.com/zacharymcclernon/claude-deck-builder.git \
  ~/.claude/skills/deck-builder
```

(For a single project instead of globally, clone into `.claude/skills/deck-builder`
inside the project.) Then just ask, e.g. *"build me a 3-slide deck comparing our three
plans, in our brand colors."* Claude reads `SKILL.md` and composes the deck from the
pattern menu.

## Or build a deck by hand

You don't need Claude Code to use the template — it's plain Node:

```bash
mkdir my-deck && cd my-deck
npm init -y
npm install pptxgenjs
cp /path/to/this/repo/assets/deck_template.js build_deck.js
node build_deck.js            # writes My_Deck.pptx
node build_deck.js --force    # rebuild even if the .pptx was hand-edited
```

Edit the `THEME` block to re-skin, then compose slides from the menu in
`reference/slide-patterns.md`.

## What's here

| Path | What it is |
|------|------------|
| `SKILL.md` | The skill instructions Claude Code reads — how to work, re-skin, and verify. |
| `assets/deck_template.js` | Copy this and edit. The `THEME` block, all primitives, and four independent example slides. Builds as-is. |
| `reference/design-system.md` | The palette with hex values, type scale, layout grid, the flat-design rules with rationale, and a step-by-step for re-skinning `THEME` to any brand. |
| `reference/slide-patterns.md` | Copy-paste code for the full menu of slide layouts (title, ruled rows, comparison columns, table, stat row, timeline, pull quote, and more). |
| `examples/onboarding_deck.js` | A worked, runnable non-pitch deck showing several patterns composed. |
| `examples/claude_models_deck.js` | A second worked deck that also demonstrates a full re-skin — a yellow theme comparing the Claude 5 models. |

## Design, in one paragraph

Flat: no drop shadows, no rounded corners, no gradients — structure comes from hairline
rules, whitespace, and left accent bars. One type family. Color is signal, not
decoration (`accent` is the through-line, `warn` flags a risk, `good` marks something
confirmed). Vary the layout so it doesn't read as machine-made. Bounds-check every build.
The full rationale is in `reference/design-system.md`.

## Requirements

- [Node.js](https://nodejs.org/) 16+
- `pptxgenjs` (installed via `npm install`)

## License

[MIT](LICENSE).
