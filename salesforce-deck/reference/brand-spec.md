# Salesforce 2026 brand spec — the authority

This is the single source of truth for how a deck from this skill must look. Every
value here is transcribed directly from the brand-guideline slides embedded in the
**Salesforce Corporate Template 2026** (`Salesforce Corporate Template 2026.pptx`),
not invented. When your eye and this document disagree, this document wins.

**This skill is brand-locked by design.** Unlike a general deck builder, there is no
"re-skin" step and no palette to choose. The `BRAND` block in
`assets/deck_template.js` is `Object.freeze`d for exactly this reason. Your job is to
choose *layouts and words*, never colors, fonts, radii, or effects.

---

## Hard rules — do not break these

1. **Only these two typefaces.** Avant Garde Demi SFDC for titles/stats/short
   treatments; Salesforce Sans for everything else. No third font. No serif. No
   italics on Avant Garde, and only the **Demi** weight of it (the brand forbids
   other weights).
2. **Only the palette below.** Never introduce a color that isn't a named brand
   token. No off-brand blues, no invented grays.
3. **Electric Blue 50 `#066AFE` is *the* Salesforce Blue.** It is the primary accent
   and carries the through-line. The extended palette (teal, yellow, pink, violet)
   is for secondary accents only — never as the primary voice of a slide.
4. **The canvas is 20 × 11.25 in.** Not 13.33 × 7.5. The whole type scale is
   calibrated to it. Do not change the layout size.
5. **Containers are rounded and carry the blue shadow.** ~12.5% corner radius on
   cards, 50% (pill) on CTA buttons. The drop shadow is **Electric Blue `#066AFE` at
   15% opacity** — never black. This is a brand requirement (there is a dedicated
   "Shadow treatment" guideline slide), and it is the one place this skill departs
   from a generic "flat" house style.
6. **Use the real logo.** The cloud lockup ships in `assets/brand/`. Color logo on
   light grounds, white (reverse) logo on blue/navy grounds. Never recolor it, never
   redraw it, never stretch it off its aspect ratio.

---

## Palette

Named exactly as the brand guidelines name them. Token names in code are in the
right-hand column (`BRAND.colors.*`).

### Core blues — the primary system

| Brand name       | Hex       | Token  | Job |
|------------------|-----------|--------|-----|
| Electric Blue 15 | `#001E5B` | `eb15` | Deepest navy. Dark backgrounds, section dividers. |
| Electric Blue 20 | `#002775` | `eb20` | Type on light; deep headings. |
| Electric Blue 30 | `#022AC0` | `eb30` | Containers; a secondary dark ground. |
| **Electric Blue 50** | **`#066AFE`** | `eb50` | **The Salesforce Blue.** Primary accent, cover/close grounds, CTAs, the brand shadow. |
| Cloud Blue 68    | `#00B3FF` | `cb68` | Logo blue; a bright accent on dark grounds. |
| Cloud Blue 80    | `#90D0FE` | `cb80` | Soft accent; body text on dark grounds. |
| Cloud Blue 90    | `#CFE9FE` | `cb90` | Light slide background. |
| Cloud Blue 95    | `#EAF5FE` | `cb95` | Palest wash; container ground on white; table-header fill. |

### Extended palette — secondary accents only

Each family has a dark (20), a deep mid, a bright, and a 95 wash. Use them to
differentiate categories on a card row or a chart — **never** as a slide's primary
color, and never in place of the blue.

| Family | Bright | Deep     | Dark (20) | Wash (95) |
|--------|--------|----------|-----------|-----------|
| Teal   | `#04E1CB` | `#06A59A` | `#023434` | `#DEF9F3` |
| Yellow | `#FCC003` | `#E4A201` | `#4F2100` | `#FBF3E0` |
| Pink   | `#FF538A` | `#B60554` | `#61022A` | `#FEF0F3` |
| Violet | `#D17DFE` | `#730394` | `#481A54` | `#F9F0FF` |

### Neutrals

| Use | Hex | Token |
|-----|-----|-------|
| Body copy on light | `#181818` | `ink` |
| Captions, footnotes, labels | `#59575C` | `muted` |
| Hairlines | `#D8DDE6` | `rule` |
| White | `#FFFFFF` | `white` |

### Using color as signal

Even inside a locked palette, color should mean something. Electric Blue 50 is the
spine. A secondary color on one card in a row says "this one is different" — which
only reads if the rest of the deck is quiet. Don't scatter the extended palette for
decoration.

---

## Typography

Two families, from the brand "Fonts used" slide:

- **Avant Garde Demi SFDC** — titles, stats, category/card headers, and short
  special treatments. One weight (Demi). No italics.
- **Salesforce Sans** — body copy and any lengthy text. The workhorse.

### Type scale

From the brand "Font scale" guideline (calibrated to the 20 × 11.25 canvas). Tokens
are `BRAND.type.*`.

| Use | Size (pt) | Face | Token |
|-----|-----------|------|-------|
| Cover title | 54 | Avant Garde | `coverTitle` |
| Slide title | 40 | Avant Garde | `title` |
| Subtitle | 28 | Salesforce Sans | `subtitle` |
| Category / card header | 26 | Avant Garde | `category` |
| Big stat | 54 | Avant Garde | `stat` |
| Body | 22 | Salesforce Sans | `body` |
| Detail / secondary | 18 | Salesforce Sans | `detail` |
| Kicker (tracked +3) | 16 | Salesforce Sans | `kicker` |
| Caption / footer | 14 | Salesforce Sans | `caption` |

**Floor:** don't go below 14pt for anything a reader needs to read. If copy doesn't
fit, cut words or grow the box — never shrink the type.

### Fonts and machines

The corporate template *embeds* its fonts; a code-generated `.pptx` references them
by name instead. On a Salesforce-issued Mac both faces are usually installed — check:

```bash
system_profiler SPFontsDataType | grep -iE "salesforce sans|avant garde"
```

If a face is missing, PowerPoint substitutes a system sans and the deck degrades but
stays legible. Do **not** "fix" this by switching to a different font in the script —
the font names are part of the brand lock.

---

## Layout

- **Canvas:** 20 × 11.25 in. Set in code via a defined `SF_WIDE` layout.
- **Margin (`M`):** 0.94 in on all sides (the template's own cover margin). Content
  width `CW` = 18.12 in.
- **Header:** kicker at y≈0.7, title at y≈1.14, a short blue hairline under it. For a
  title with no kicker, title sits at y≈0.82.
- **Footer:** page number bottom-right, optional footnote bottom-left, at y≈H−0.68.
- **Grounds:** white, Cloud Blue 90 (`#CFE9FE`), Cloud Blue 95 wash (`#EAF5FE`),
  Electric Blue 50 (covers/closes), or Electric Blue 15 navy (dividers). Nothing else.

---

## Containers, shadows, corners — the brand's "not flat" rule

The corporate template is built out of **white rounded cards floating on a light-blue
ground, each casting a soft blue shadow.** That is the signature look. Concretely:

- **Corner radius:** cards use ~12.5% of the short side; CTA buttons are full pills
  (50%). `radius()` in the template computes both.
- **Shadow:** `outer`, color `#066AFE`, opacity 15%, blur 28pt, offset 7.5pt, angle
  75°. Applied to white containers and CTAs on white or light-blue grounds. Use
  `brandShadow()` (a fresh copy — the frozen `BRAND.shadow` can't be passed directly,
  pptxgenjs mutates it).
- **No other effects.** No gradients, no glows, no bevels, no black shadows, no
  clip-art. The rounded-card-with-blue-shadow *is* the depth vocabulary; don't add to
  it.

---

## Required legal slides (external decks)

Salesforce external presentations carry a **Forward-Looking Statements** slide (and
often a Notice of Confidentiality). The template includes an FLS example, but its
wording is a placeholder. **Confirm the current approved language with Legal / Brand
Central before presenting externally** — the statement changes over time.

---

## Where the numbers came from

Everything above was extracted from the corporate template's own embedded slides:
Core blues and Extended palette (color guidelines), Fonts used and Font scale
(typography guidelines), Shadow treatment (container guideline), and the cover/content
layout geometry. If a future template version changes a value, re-extract from that
file and update this doc and the `BRAND` block together — they must move as one.
