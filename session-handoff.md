# Session Handoff

## Current Objective

- Goal: keep the resume site's content aligned with the verified career record, on a branch, with the
  existing build pipeline untouched.
- Current status: content pass complete, regenerated and committed on the branch; `./init.sh` passes.
- Branch / commit: `redesign/resume-site` off `main`.

## Completed This Session

- [x] `data/resume.json` rewritten around the verified facts: Dukascopy rule engine / 145 endpoints /
      JSON-RPC layer / PHP 8.2 migration / GDPR pipeline / S3 + Azure storage / ActiveMQ + Oracle /
      `dukascopy/handlersocket`; Seopa and BestComp trimmed to what is defensible; Buylink added as
      part-time advisory work.
- [x] Project set replaced with LevelUp / Eimtahan.az, Bakutrend, the MMMC Platform and pit.
- [x] `scripts/generate.js`: project titles link to `project.url` when present, `period()` prints one
      month when start and end are equal, meta keywords refreshed.
- [x] `docs/index.html` and `docs/build.css` regenerated and committed with the sources.
- [x] Harness state files updated.

## Verification Evidence

| Check | Command | Result | Notes |
|---|---|---|---|
| Full verification | `./init.sh` | pass, exit 0 | install, generator syntax, regenerate, rebuild, asset resolution |
| Clean checkout | `git clone` → `./init.sh` | pass, exit 0 | what a fresh clone would do |
| Drift gate, both paths | sandbox clone, committed to a fresh git repo | 0 then 1 | clean tree passes; staged hand-edit of `docs/index.html` fails with the intended message |
| Build determinism | `bun run build` twice | same md5 | after `source(none)`; before it, every rebuild grew the file by ~928 lines |
| Theme toggle | click `#theme-toggle`, press `D` | light ⇄ dark | `localStorage.theme` updated, `color-scheme` follows |
| Behaviours | browser probe | ok | 3 flip sentences, nav `aria-current` follows the scroll, 9 copy buttons |
| Rendering | browser probe at 1440px | ok | 9 panels, 10 stripe dividers, column `[336, 768]`, header 56px sticky, 3 social links |
| Responsive | 390px viewport | ok | no horizontal overflow, nav collapses below `sm` |
| Project links | generated page probe | ok | 2 project links, both `https://github.com/hose1021/...` |
| Stale stack terms | grep generated page | 0 hits | superseded stack names no longer appear |

## Files Changed

- `data/resume.json`, `scripts/generate.js`, `progress.md`, `feature_list.json`, `session-handoff.md`
- `docs/index.html`, `docs/build.css` - regenerated

## Decisions Made

- The page carries no claim that is not in the CV; content edits happen in `data/resume.json` only.
- Content truth beats keyword coverage: a stack name appears only where the work behind it exists.
- A project links out only when a public URL exists; LevelUp and pit deliberately show no link.
- Telegram stays in `basics.urls`; `siteFooter()` reads it from there.

## Blockers / Risks

- `taglines` restate the summary; the wording may still be tightened.
- Attribution: the CSS utilities and token names in `tailwind.css` derive from an MIT-licensed design
  system. MIT asks that the upstream copyright notice travel with substantial copies, and no `NOTICE`
  file exists - a deliberate choice, revisit it if this repository is ever redistributed.
- Three content questions belong to the user: Seopa detail, the Dukascopy end date, and the MSU degree.

## Next Session Startup

1. Read `AGENTS.md`.
2. Read `feature_list.json` and `progress.md`.
3. Review this handoff.
4. Run `./init.sh` before editing.

## Recommended Next Step

- View the branch with `bun run serve`, then merge to `main` once the review passes. Pages publishes on
  the push to `main`.
