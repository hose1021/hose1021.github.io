# Session Progress Log

## Current State

**Last Updated:** 2026-09-21
**Active Feature:** none — the design port (feat-004) and the content refresh (feat-005) are done; feat-006 is the next slot
**Branch:** `redesign/chanhdai-style` (not committed, `master` untouched)

### What's Done

- [x] Port of the chanhdai.com design system: oklch zinc tokens, dark/light theme, 768px column, screen lines, stripe dividers, hairline panels
- [x] Profile header (initials roundel, name, rotating taglines) and seven content panels: About, Overview, Experience, Projects, Stack, Recommendations, Education, Languages
- [x] Interactions: theme toggle with the `D` hotkey, nav scroll-spy, hover copy buttons, rotating taglines
- [x] Two local fonts (Geist Sans, Geist Mono) and a 15-icon lucide subset in `data/icons.json`
- [x] Removed on request: the decorative mark block with its dot grid, `Fig. 1.` caption and handwritten note; the handwritten greeting; the local-time row; the whole Highlights panel with `metrics`; the `MH` avatar roundel in the profile header; the five footer info rows (`Crafted by`, `Deployed on`, `Source code`, `Contact`, `Location`)
- [x] Dead code pruned with them: Caveat, the `ink` filter, `dot-grid`, `link-underline`, `screen-dashed-line-*`, `screen-line-*-none`, `extend-touch-target`, the `retina` variant, the `clock` icon, `metrics`
- [x] Content refreshed from `Mikail_Huseynov_CV.pdf`: summary, Dukascopy bullets (PCI DSS, on-call, mentoring), condensed project bullets, stack additions (Go in progress, PCI DSS, Payment Gateways), education reordered, new Professional Development panel
- [x] `./init.sh` passes; the page was checked in a browser at 1440px

### What's In Progress

- [ ] Nothing in progress.

### What's Next

1. Review the branch in a browser: `bun run serve`, compare against `master`.
2. Commit `redesign/chanhdai-style` (sources plus regenerated `docs/`, never one without the other).
3. Take `feat-005` and replace it with the next concrete resume change.

## Blockers / Risks

- [ ] Nothing is committed yet on this branch: `git status` shows every redesign file as modified or untracked.
- [ ] `docs/fonts/original/` still holds 1.2 MB of FiraGO source fonts that no CSS references yet GitHub Pages publishes them. Delete when the old design is dropped for good.
- [ ] Sticky header: the user asked to drop the top decoration; the sticky nav header was kept because it carries navigation and the theme toggle. Remove it if that was the intent.
- [ ] Publish step: pushing `master` deploys to GitHub Pages with no CI gate. `./init.sh` is the only check.
- [ ] The drift check in `./init.sh` skips the git comparison while sources are uncommitted, by design. Commit sources and regenerated output together.

## Decisions Made

- **Design source:** chanhdai.com, read from its source at `main` (MIT). Ported: tokens, utilities, panel/header/stack/experience structures, typography split, interactions. Not ported: the Next.js stack, the logo mark, and any personal content or branding.
- **Stack kept:** bun + Tailwind v4 + `scripts/generate.js` → `docs/`. No Next.js migration.
- **Web-first, print dropped:** the A4 two-page layout is gone; print is not a supported target.
- **Tailwind is now real:** the old `tailwind.css` never imported Tailwind, so utilities such as `md:col-count-2` did nothing. The new entry point imports `tailwindcss` and uses `@theme inline`, `@custom-variant`, `@utility`.
- **`source(none)` added to the Tailwind import.** With auto source detection on, Tailwind scanned its own `docs/build.css` output and appended the classes it found there on every rebuild (928 lines added, different md5 each run). Explicit `@source` files only.
- **Icons are committed data, not a dependency:** `data/icons.json` holds lucide's inner SVG markup, so `generate.js` stays dependency-free and offline.
- **Removals stayed clean:** the mark, greeting, clock, Highlights panel, avatar roundel and footer rows took Caveat, the `ink` filter, `dot-grid`, `link-underline`, `screen-dashed-line-*`, `screen-line-*-none`, `extend-touch-target`, the `retina` variant, the clock icon, the `metrics` field and their scripts with them. No dead code left behind.

## Files Modified This Session

- `tailwind.css` — design system ported from the reference
- `scripts/generate.js` — whole page assembly
- `data/resume.json` — added `taglines`; `metrics` removed
- `data/icons.json` — new: lucide icon subset
- `docs/index.html`, `docs/build.css` — regenerated
- `docs/fonts.css` (new), `docs/fonts/Geist-Variable.woff2`, `docs/fonts/GeistMono-Variable.woff2` (new)
- `docs/fira-go.css` and 55 `docs/fonts/FiraGO-*.woff2` — removed
- `init.sh` — drift check now skips the git comparison while sources are uncommitted
- `AGENTS.md`, `feature_list.json`, `progress.md`, `session-handoff.md` — updated

## Evidence of Completion

- [ ] `./init.sh` passes: `=== Verification Complete ===`, exit 0
- [ ] Removals: 8 panels with no `highlights`, 9 stripe dividers, no `#hello-greeting`, no `[data-slot=handwritten-note]`, no `#local-time`, no `[data-slot=metric-value]`, `document.fonts` loads only GeistSans and GeistMono
- [ ] Rendering: column `[336, 768]` in a 1440 viewport, header 56px sticky, 86 tags, 4 experience entries, no horizontal overflow
- [ ] Theme: pre-paint script sets `light`/`dark`; toggle and the `D` hotkey switch it and persist `localStorage.theme`
- [ ] Behaviour: three flip sentences, nav `aria-current=page` follows the scroll, 9 copy buttons respond
- [ ] Drift gate, both paths, in a throwaway copy of the tree committed to a fresh git repo: clean tree exit 0, hand-edited `docs/index.html` staged exit 1 with `FAIL: docs/index.html differs from data/resume.json`
- [ ] Build determinism: two consecutive `bun run build` runs give the same md5

## Notes for Next Session

The generator escapes text with `h()`, so `data/resume.json` values stay plain text — never add HTML there. Design lives in `tailwind.css`; layout lives in `scripts/generate.js`; icons live in `data/icons.json`. New sections must follow the panel + stripe-divider rhythm, and new markup must use the `line` border token for internal dividers and `border` for panel edges.
