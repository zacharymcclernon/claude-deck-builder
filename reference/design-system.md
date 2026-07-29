# Design system

The visual spec every slide follows. Read this once before building; the rules are
what keep a code-generated deck from looking code-generated. They are brand-neutral —
they hold whatever palette is in `THEME`. The default palette below is Salesforce
Lightning Design System; swap it for any brand using the re-skin steps at the end.

---

## The palette

All colors live in the `THEME.colors` object at the top of the template and are named
by **role**, not by hue. That naming is the point: a slide asks for `accent` or `warn`,
never for "blue" or "orange", so re-skinning to a different brand keeps every slide's
meaning intact.

### Roles

| Role           | Default hex | Meaning — what it's for |
|----------------|-------------|-------------------------|
| `dark`         | `#032D60`   | Dark-slide background; heading text on light slides. |
| `darker`       | `#001639`   | The deepest shade, for depth on dark slides. |
| `accent`       | `#0176D3`   | The through-line. Primary brand color, most slides. |
| `accentBright` | `#1B96FF`   | A brighter accent that reads on dark backgrounds. |
| `accentSoft`   | `#CFE9FE`   | Body text on dark backgrounds. |
| `accentWash`   | `#EAF5FE`   | Palest tint — band fills, table-header fill. |
| `warn`         | `#D83A00`   | A gap, a risk, the thing to flag. Sparingly. |
| `warnWash`     | `#FEF1ED`   | Fill behind `warn` text. |
| `good`         | `#2E844A`   | Confirmed, measured, positive, done. |
| `goodWash`     | `#EBF7EE`   | Fill behind `good` text. |
| `alt`          | `#5867E8`   | Optional neutral third category. |
| `altWash`      | `#F1F0FF`   | Fill behind `alt` text. |
| `ink`          | `#181818`   | Body copy. |
| `muted`        | `#747474`   | Captions, footnotes, labels. |
| `rule`         | `#E5E5E5`   | Hairlines. |
| `tint`         | `#F3F3F3`   | Subtle fills on light slides. |
| `white`        | `#FFFFFF`   | — |
| `dimOnDark`    | `#8CA9C9`   | Muted text on dark slides. |
| `ruleOnDark`   | `#1B4D80`   | Hairlines on dark slides. |

### Using color as signal

The discipline that separates a designed deck from a decorated one: **color means
something.**

- **`accent`** carries the argument's spine. It's on most slides and that's fine — it
  reads as consistency, not noise.
- **`warn`** appears only where you are naming a gap, a risk, or the item that breaks
  the pattern. If it's on every slide, it stops flagging anything.
- **`good`** is for confirmed / measured / positive / done — a shipped feature, a
  closed item, a metric that's real (not estimated).
- **`alt`** is a release valve for when a slide genuinely has a third category. Reach
  for it rarely.

A three-column slide where one column is `warn` and two are `good` tells the whole
story before anyone reads a word. That only works if the colors are otherwise quiet.

---

## Type

**One family.** The template uses `THEME.fonts.sans` everywhere (Salesforce Sans by
default, Arial fallback). Never pair a serif with it. Hierarchy comes from size and
weight, not from a second face.

| Use                 | Size (pt) | Weight | Color   |
|---------------------|-----------|--------|---------|
| Title-slide title   | 40        | bold   | `white` on dark |
| Slide title         | 25        | bold   | `dark`  |
| Statement band lead | 14.5      | bold   | `dark` / `white` |
| Section kicker      | 9.5       | bold   | `accent`, tracked +2.2 |
| Big stat            | 32        | bold   | `accent` |
| Body / prose        | 11.5–12.5 | regular| `ink`   |
| Caption / label     | 9.5–10.5  | reg/bold | `muted` |
| Footnote / page no. | 8.5       | regular| `muted` |

**Floors.** Don't set body text below 9pt — it stops being legible at the back of a
room. If text doesn't fit, cut words or grow the box; never shrink past 9pt.

**Tracking.** Only kickers and all-caps labels get letter-spacing (`charSpacing`
2.2–2.4). Body text never does.

---

## The grid

- **Canvas:** 13.33 × 7.5 in (16:9 wide). Set by `pres.layout = "LAYOUT_WIDE"`.
- **Margin (`M`):** 0.7 in on all sides. Content width `CW` = 11.93 in.
- **Header block:** kicker at y≈0.4, title at y≈0.66, hairline at y≈1.36 (or 1.64
  with a subtitle). Body content starts below ~1.6.
- **Footer:** page number and footnote at y≈6.88.
- **Columns:** for even splits, divide `CW`. Two columns with a gutter → ~5.6 in
  each. Three → ~3.83 in each. Four stats → `CW / 4`.
- **Vertical rhythm:** repeated rows step by a fixed increment (the ruled-row pattern
  steps 1.44 in; numbered-list rows step 1.14 in). Keep the increment constant down a
  slide so rows line up.

Everything is positioned in inches from the top-left. When in doubt, align new
elements to `M` on the left and to an existing y-coordinate.

---

## Flat, and why

The house style is flat. Concretely, **do not use**:

- drop shadows
- rounded corners
- gradients
- glows, bevels, reflections
- clip-art or 3-D icons

Structure comes instead from three devices:

1. **Hairline rules** (`hrule`, `vrule`) — 0.75pt lines in `rule`. They separate
   without boxing.
2. **Whitespace** — the margin and the gutters do the work a border would.
3. **Left accent bars** (`accent`) — a 0.045-in colored bar marks a block. This is
   the workhorse; it labels a region without drawing a rectangle around it.

The reason is diagnostic: a drop-shadowed, rounded card with a gradient fill is the
single strongest visual tell of a template-generated deck. Flat, ruled, whitespace-led
layout is what editorial print looks like, and it's what reads as considered. This is
true across brands — the flat discipline is not Salesforce-specific.

---

## Re-skinning to another brand

Everything above assumes the default palette, but the whole look is swappable from the
`THEME` block at the top of `assets/deck_template.js`. Nothing else in the script
hard-codes a color or font.

To re-skin:

1. **Fonts.** Set `THEME.fonts.sans` to the brand's sans (and `fallback` to a safe
   web-safe sans). Keep it to one family.
2. **Map the brand's colors onto the roles**, not onto hues. Ask, for each brand color,
   *what job does it do* — and assign it to `accent`, `warn`, `good`, `dark`, etc.
   The brand's primary → `accent`. Its darkest neutral or primary-dark → `dark`. A
   red/amber → `warn`. A green → `good`.
3. **Generate the wash tints.** Each `*Wash` should be the palest possible tint of its
   role color — roughly the hue at ~6–8% saturation against white. If the brand has a
   defined "5%" or "10%" tint, use it. These sit behind text, so they must stay very
   pale; text on them is always `dark` or `ink`.
4. **Set the neutrals** (`ink`, `muted`, `rule`, `tint`) from the brand's grays if it
   has them; the defaults are brand-neutral enough to keep otherwise.
5. **Check contrast.** Body text (`ink` on white, `accentSoft` on `dark`) must stay
   readable. Aim for WCAG AA (4.5:1) on body copy. If the brand accent is too light to
   read as text, keep it for bars and fills and use `dark` for text.
6. **Rebuild.** Every slide picks up the new theme; re-run the bounds check to be safe.

The `dataviz` skill's palette method (a validator for categorical/sequential color
sets) is a good companion if the deck contains charts — align chart colors to the same
roles so the deck reads as one system.
