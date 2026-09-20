# Session Progress Log

## Current State

**Last Updated:** 2026-09-21
**Active Feature:** none — the design overhaul (feat-004) and the content refresh (feat-005) are done; feat-006 is the next slot
**Branch:** `redesign/resume-site`, pushed and open for review against `main`

### What's Done

- [x] Design system: oklch zinc tokens, dark/light theme, 768px column, full-bleed screen lines, stripe dividers, hairline panels
- [x] Profile header (name, rotating taglines) and eight content panels: About, Overview, Experience, Professional Development, Projects, Stack, Recommendations, Education, Languages
- [x] Interactions: theme toggle with the `D` hotkey, nav scroll-spy, hover copy buttons, rotating taglines
- [x] Local fonts: Inter (latin + latin-ext subsets) for prose, Geist Mono for meta, plus a 15-icon lucide subset in `data/icons.json`
- [x] Removed on request: the FiraGO asset folder, the unused Geist Sans file, and the untracked `Mikail_Huseynov_CV.pdf`
- [x] Content refreshed from `Mikail_Huseynov_CV.pdf`: summary, Dukascopy bullets (PCI DSS, on-call, mentoring), condensed project bullets, stack additions (Go in progress, PCI DSS, Payment Gateways), education reordered, Professional Development panel added
- [x] Removed on request: the decorative mark block, the handwritten greeting and note, the `Fig. 1.` caption, the local-time row, the Highlights panel, the avatar roundel and the five footer info rows
- [x] Dead code pruned with them: Caveat, the `ink` filter, `dot-grid`, `link-underline`, `screen-dashed-line-*`, `screen-line-*-none`, `extend-touch-target`, the `retina` variant, the `clock` icon, `metrics`
- [x] `./init.sh` passes on a clean checkout; the page is verified in a browser at 1440px and 390px

### What's In Progress

- [ ] Nothing in progress.

### What's Next

1. Review the branch in a browser: `bun run serve`.
2. Merge once the review passes; Pages publishes on the push to `main`.
3. Take `feat-006` and replace it with the next concrete resume change.

## Blockers / Risks

- [ ] The sticky nav header and the three hero taglines were kept when the top decoration was removed. Drop them if that was the intent.
- [ ] Attribution: the CSS utilities and token names in `tailwind.css` derive from an MIT-licensed design system. MIT asks that the upstream copyright notice travel with substantial copies. No `NOTICE` file exists, on the user's instruction to keep references out of the repository.

## Decisions Made

- **Stack kept:** bun + Tailwind v4 + `scripts/generate.js` → `docs/`. No framework migration.
- **Web-first, print dropped:** the A4 two-page layout is gone; print is not a supported target.
- **Tailwind is now real:** the old `tailwind.css` never imported Tailwind, so utilities such as `md:col-count-2` did nothing. The new entry point imports `tailwindcss` and uses `@theme inline`, `@custom-variant`, `@utility`.
- **`source(none)` added to the Tailwind import.** With auto source detection on, Tailwind scanned its own `docs/build.css` output and appended the classes it found there on every rebuild (928 lines added, different md5 each run). Explicit `@source` files only.
- **Icons are committed data, not a dependency:** `data/icons.json` holds lucide's inner SVG markup, so `generate.js` stays dependency-free and offline.
- **Two border tokens:** `border` for panel edges, `line` (a `color-mix` of border and background) for internal dividers.
- **Removals stayed clean:** every deleted element took its assets, tokens, icons, data and scripts with it.

## Files Modified This Session

- `tailwind.css` — design system
- `scripts/generate.js` — page assembly
- `data/resume.json` — content; `data/icons.json` — icons
- `docs/index.html`, `docs/build.css`, `docs/fonts.css`, `docs/fonts/Inter-*.woff2`, `docs/fonts/GeistMono-Variable.woff2`, `docs/.nojekyll`
- `docs/fira-go.css`, 55 `docs/fonts/FiraGO-*.woff2`, `docs/fonts/original/` and `docs/fonts/Geist-Variable.woff2` — removed
- `init.sh`, `AGENTS.md`, `feature_list.json`, `progress.md`, `session-handoff.md`

## Evidence of Completion

- [ ] `./init.sh` passes: `=== Verification Complete ===`, exit 0
- [ ] Clean checkout (`git clone` → `./init.sh`): exit 0
- [ ] Build determinism: two consecutive `bun run build` runs give the same md5
- [ ] Drift gate, both paths: clean tree exit 0, hand-edited `docs/index.html` staged exit 1
- [ ] Rendering: 9 panels, 10 stripe dividers, column `[336, 768]` in a 1440 viewport, sticky 56px header, no horizontal overflow at 390px
- [ ] Behaviour: 3 rotating taglines, nav `aria-current` follows the scroll, 9 copy buttons, theme persisted in `localStorage`

## Notes for Next Session

The generator escapes text with `h()`, so `data/resume.json` values stay plain text — never add HTML there. Design lives in `tailwind.css`; layout lives in `scripts/generate.js`; icons live in `data/icons.json`. New sections must follow the panel + stripe-divider rhythm, and new markup must use the `line` border token for internal dividers and `border` for panel edges.
