// ============================================================================
// fitcheck — a text-fit / overflow guard for pptxgenjs decks.
//
// pptxgenjs never renders text, so it can't know where a string wraps. The
// bounds-check verifies boxes sit on-canvas; it CANNOT see text spilling out of
// its own box (the "Running a POC..." running into "Nothing sizes..." class of
// bug). This estimates wrapped-line count from box width + font size, compares
// the estimated text height to the box height, and — crucially — flags a box
// only when its overflow actually COLLIDES with another box below it in the
// same column. Overflow into empty whitespace is reported separately as a soft
// note.
//
// It is APPROXIMATE. The exact check is still opening the file in a renderer.
// But it reliably catches real collisions on every build, for free.
//
// Usage:
//     const { attachFitCheck } = require("./fitcheck");   // adjust path
//     const pres = new pptxgen();
//     const fit = attachFitCheck(pres, { bodyDefault: 22 });
//     ... build slides ...
//     fit.report();          // prints collisions + soft notes
//     // fit.report({ throwOnCollision: true })  // to fail the build instead
//     pres.writeFile({ fileName: OUT });
//
// Tuning: CHAR_W is the average glyph advance as a fraction of font size,
// calibrated to Salesforce Sans (an 86-char subtitle fits one line across
// ~16"). Lower it if the check is too eager; raise it if real overflows slip
// through. LINE_H is the single-line height as a fraction of font size.
// ============================================================================

const CHAR_W = 0.46;
const LINE_H = 1.20;

function estimate(text, opts, bodyDefault) {
  const w = opts.w;
  if (!w) return null;
  let fs = opts.fontSize || bodyDefault;
  let segs = [];

  if (Array.isArray(text)) {
    // Rich-text runs: split on "\n" inside a run and on breakLine between runs.
    let cur = "", maxfs = 0;
    for (const run of text) {
      const rfs = (run.options && run.options.fontSize) || fs;
      if (rfs > maxfs) maxfs = rfs;
      const parts = String(run.text == null ? "" : run.text).split("\n");
      parts.forEach((p, i) => { if (i > 0) { segs.push(cur); cur = ""; } cur += p; });
      if (run.options && run.options.breakLine) { segs.push(cur); cur = ""; }
    }
    segs.push(cur);
    fs = maxfs || fs;
  } else {
    segs = String(text == null ? "" : text).split("\n");
  }

  const maxChars = Math.max(1, Math.floor((w * 72) / (fs * CHAR_W)));
  let lines = 0;
  for (const seg of segs) {
    const words = seg.trim().split(/\s+/).filter(Boolean);
    if (!words.length) { lines += 1; continue; }
    let line = "", segLines = 1;
    for (const wd of words) {
      const t = line ? line + " " + wd : wd;
      if (t.length > maxChars && line) { segLines++; line = wd; } else line = t;
    }
    lines += segLines;
  }

  const mult = opts.lineSpacingMultiple || 1.0;
  const neededIn = (lines * fs * LINE_H * mult) / 72;
  return { lines, neededIn, fs };
}

/**
 * Patch a pptxgen instance so every addText() call is recorded, and return a
 * handle with report(). Call BEFORE building slides.
 *   opts.bodyDefault — font size assumed when a text call omits fontSize (22).
 *   opts.tol         — fraction over box height before a box counts as
 *                      overflowing (default 1.04 = 4% fudge).
 */
function attachFitCheck(pres, opts = {}) {
  const bodyDefault = opts.bodyDefault || 22;
  const tol = opts.tol || 1.04;
  const boxes = [];

  const origAddSlide = pres.addSlide.bind(pres);
  pres.addSlide = function (...a) {
    const s = origAddSlide(...a);
    const n = pres.slides.length; // 1-based index of the slide just added
    const origAddText = s.addText.bind(s);
    s.addText = function (text, o) {
      boxes.push({ n, text, opts: o || {} });
      return origAddText(text, o);
    };
    return s;
  };

  function report(reportOpts = {}) {
    const raw = (t) => (Array.isArray(t) ? t.map((r) => r.text).join("") : String(t == null ? "" : t));
    const overlapX = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w;

    const measured = [];
    for (const b of boxes) {
      const o = b.opts;
      if (o.w == null || o.h == null || o.x == null || o.y == null) continue;
      const e = estimate(b.text, o, bodyDefault);
      if (!e) continue;
      measured.push({ n: b.n, x: o.x, y: o.y, w: o.w, h: o.h, est: e.neededIn, e, text: raw(b.text) });
    }

    const collisions = [], softs = [];
    for (const a of measured) {
      if (a.est <= a.h * tol) continue;
      const estBottom = a.y + a.est, declBottom = a.y + a.h;
      const hit = measured.find((b) =>
        b !== a && b.n === a.n && overlapX(a, b) &&
        b.y >= declBottom - 0.05 && b.y < estBottom - 0.05
      );
      const line =
        `  slide ${String(a.n).padStart(2)}: ~${a.est.toFixed(2)}" of text in ${a.h.toFixed(2)}" box ` +
        `(${a.e.lines} lines @ ${a.e.fs}pt)  "${a.text.replace(/\s+/g, " ").slice(0, 52)}"`;
      if (hit) collisions.push(line + `\n            └ overruns into: "${hit.text.replace(/\s+/g, " ").slice(0, 46)}"`);
      else softs.push(line);
    }

    if (collisions.length) {
      console.log("\n  ⚠ TEXT-FIT COLLISIONS (a box overruns into the one below — fix these):");
      collisions.forEach((c) => console.log(c));
    }
    if (softs.length) {
      console.log(`\n  ${softs.length} box(es) extend past their declared height into open space (usually fine, but eyeball dense slides):`);
      softs.forEach((s) => console.log(s));
    }
    if (!collisions.length && !softs.length) console.log("text-fit ok (estimated)");
    if (collisions.length) console.log(`\n  ${collisions.length} COLLISION(S) — verify in a renderer.\n`);

    if (reportOpts.throwOnCollision && collisions.length) {
      throw new Error(`${collisions.length} text-fit collision(s) — fix before shipping, or pass throwOnCollision:false.`);
    }
    return { collisions: collisions.length, softs: softs.length };
  }

  return { report };
}

module.exports = { attachFitCheck, estimate };
