# Example

`onboarding_deck.js` — a worked, runnable deck that is deliberately **not** a pitch.

It's a new-hire onboarding reference ("Your first two weeks on the Platform team").
Nothing in it is trying to persuade; the job is to orient someone quickly. It's here
to show that the skill builds any kind of deck, and to show several layouts from
`reference/slide-patterns.md` composed into one:

- Title (dark)
- Section divider
- Numbered list
- Ruled rows (who to ask / for what)
- Table (tools and access)
- Timeline (how the first month goes)
- Closing (dark)

Run it:

```bash
npm install pptxgenjs
node onboarding_deck.js       # writes Onboarding.pptx
```

The script carries its own copy of the `THEME` and primitives so it runs standalone,
without the template. In a real deck you'd keep them in the one `build_deck.js` and
edit `THEME` once to re-skin the whole thing.
