# Examples

Runnable, on-brand decks that show the patterns from `reference/slide-patterns.md`
composed into a real deck. They read the same locked palette, fonts, and primitives
as the template.

| File | What it is |
|------|------------|
| `qbr_deck.js` | A customer Quarterly Business Review — cover, agenda, stat row, card row with status, table, pull quote, an ask with a CTA, forward-looking statements, and a thank-you close. |

Run from the skill root so the shared logo assets resolve:

```bash
node examples/qbr_deck.js      # writes Acme_Q2_Business_Review.pptx
```

The examples reference the logo lockups in `../assets/brand/`. To build your own
deck, don't edit an example — copy `assets/deck_template.js` and the `assets/brand/`
folder into a new project, per the setup in `SKILL.md`.
