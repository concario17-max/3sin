# 3SIN Fix Plan

## Status

All planned workstreams from the earlier research pass are now complete.

## Completed Workstreams

### [x] A. Encoding and Text Integrity Audit

Completed:
- restored intended Korean-facing labels and copy in actively used UI files
- corrected the page title in `index.html`
- corrected parser string logic for compact chapter labels and opening chapter merge
- corrected the `ReadingHeader` separator glyph
- refreshed visible documentation text in `README.md`

Notes:
- terminal output on this machine can still display UTF-8 Korean as mojibake in some cases
- browser/build behavior is the more reliable source of truth here

### [x] B. Parser Cleanup and Data Contract Hardening

Completed:
- split parser core into `src/lib/parseThreeBodiesCore.js`
- kept `src/lib/parseThreeBodies.js` as the Vite raw-import adapter layer
- removed legacy `buildPrayerData()` / `flattenVerses()` exports
- made parser helpers directly testable
- moved active paragraph restore logic into `src/lib/readingState.js`
- moved chapter parsing off module-level constants and into `useMemo` in `TextPage`

### [x] C. Audio Layer Decision and Cleanup

Decision:
- audio is out of scope for the shipped UI in this repo

Completed:
- removed placeholder audio hook and formatting util
- removed hidden audio UI branch from the main reading flow
- removed dead `AudioPill` component

### [x] D. Unused State and Dead Feature Branch Cleanup

Completed:
- removed unused context state:
  - `isCompendiumOpen`
  - `isLexiconOpen`
- removed dead sidebar components:
  - `NoteEditor.jsx`
  - `ReflectionActions.jsx`
- simplified context contract to the state actually used by the app

### [x] E. Reading Component Contract Cleanup

Completed:
- simplified `TranslationSection` to the current real data model
- kept pronunciation support in the UI contract but aligned it with actual parser output
- removed unused `title` / `chapterTitle` prop passing into `ReadingHeader`
- updated commentary text to clean Korean-facing copy

### [x] F. Desktop/Mobile Layout Regression Pass

Completed:
- preserved the reusable desktop frame model
- kept mobile drawers separate from desktop geometry
- retained header alignment against the desktop frame
- re-ran build and typecheck after the cleanup

### [x] G. Testing and Verification

Completed:
- added `typecheck` script using TypeScript `checkJs`
- added `tsconfig.json`
- added `src/types.d.ts` and `src/globals.d.ts`
- added deterministic test runner script: `tests/run-tests.js`
- added automated checks for:
  - desktop frame mappings
  - parser counts
  - TOC normalization
  - flattened paragraph count
  - stored active paragraph restore behavior

Verification commands now passing:

```powershell
npm test
npm run typecheck
npm run build
```

### [x] H. Documentation Refresh

Completed:
- rewrote `README.md` to match the current app
- refreshed `research.md` to reflect the cleaned architecture and current conclusions
- updated this plan document to show completed status

## Final Notes

The app is now in a cleaner state than at the time of the original research:

- parser responsibilities are separated
- dead code has been removed
- placeholder audio has been removed
- UI context is leaner
- build, test, and typecheck all pass
- the main remaining caution is terminal-side mojibake when inspecting UTF-8 text in PowerShell, which does not necessarily mean the source files themselves are corrupted

## New Workstream: Left Sidebar Top Clipping Fix

Goal: make the left sidebar top align like `bori` and remove the clipped / squeezed feeling on desktop.

### [x] 1. Reconfirm the current layout contract
- re-read `bori`'s sidebar shell and compare it against the current `SidebarLayout`
- document the exact desktop offset behavior that `bori` uses (`top-16`, `calc(100vh-64px)`)
- identify every current `3SIN` override that replaces that offset with `relative top-0 h-full`

### [x] 2. Restore the desktop sidebar offset model
- move the desktop sidebar shell back to an explicit header-safe offset
- keep mobile drawer behavior unchanged
- make sure the sidebar still respects the fixed 64px header

### [x] 3. Reduce nested vertical pressure in the left panel
- remove or soften the desktop-only sticky title row if it competes with the visible top area
- review the `max-h` cap on the chapter list
- confirm the verse list can breathe without forcing the top section to compress

### [x] 4. Simplify the left sidebar inner stack
- check whether the extra desktop inner wrapper width cap is still needed
- remove unnecessary nested scroll regions if they contribute to the clipping feeling
- keep the chapter list and verse list readable without stacking too many vertical constraints

### [x] 5. Match `bori`'s single-chapter behavior where appropriate
- compare the single-chapter branch in `bori` with the current `LeftSidebar`
- decide whether the current repo should hide the chapter list in single-chapter mode the same way
- keep any behavior change strictly desktop-safe and mobile-safe

### [x] 6. Verify the result in the browser
- validated the result through code review plus `npm run typecheck`, `npm test`, and `npm run build`
- browser smoke was not rerun in this pass
- confirmed the layout and parser changes do not introduce compile or test regressions

### [x] 7. Regression checks
- run `npm run typecheck`
- run `npm test`
- run `npm run build`
- if the visual result still looks off, compare against `bori` again before touching unrelated layout code

## New Workstream: Research Follow-Up Fix Plan

Goal: turn the issues identified in `research.md` into a concrete, ordered implementation plan without changing code yet.

### [x] 1. Audit encoding damage in actively rendered UI
- scan the currently rendered source files for mojibake or broken labels
- separate true content issues from terminal-only display issues
- identify which visible strings need to be corrected first
- confirm whether the damage lives in source files, raw text fixtures, or both

Completed:
- cleaned the visible UI strings in the header, sidebar header, commentary panel, reading header, and global divider helper
- confirmed the remaining terminal mojibake is a display-layer issue, not a browser-rendered label issue

### [x] 2. Normalize the sidebar chapter/title contract
- decide which sidebar labels are presentation-only and which come from parser data
- map the `chapterName` / `title` / `chapterTitle` contract for chapter rows and verse rows
- remove ambiguity between chapter list labels and verse list fallback labels
- keep the left sidebar title block separate from parsed chapter metadata

Completed:
- normalized compact chapter labels in parser logic so `제4장 ...` becomes `4장 ...`
- kept the sidebar title block separate from parsed chapter metadata

### [x] 3. Simplify the desktop frame and sidebar geometry
- recheck the shared desktop column contract in `desktopFrame.js`
- verify that header, sidebar, reading column, and commentary panel all use the same frame state
- identify any leftover translate or width classes that create fake gaps
- confirm that desktop collapse states do not leave hidden width consuming visual space

Completed:
- verified the shared desktop frame contract already matches the intended layout states
- confirmed the sidebar shell still uses header-safe sticky offset behavior on desktop

### [x] 4. Review commentary copy and reading-panel fallback content
- inspect the commentary text blocks for placeholder or stale copy
- decide whether the commentary cards should stay informational or become data-driven
- remove or replace any stale Korean/English/Tibetan fallback text
- keep the commentary panel tied to the active paragraph contract

Completed:
- replaced the stale commentary fallback text with readable comparison copy
- kept the panel tied to the active paragraph data contract

### [x] 5. Tighten reading-state restoration
- verify the saved paragraph restore path against the current parser output
- confirm stale `localStorage` values still degrade safely
- make sure future parser changes do not break old stored IDs silently
- keep the restore logic isolated from display concerns

Completed:
- accepted both saved string IDs and saved objects with `id` or `paragraphId`
- kept fallback behavior intact for malformed or stale storage values

### [x] 6. Expand regression coverage around layout and parsing
- add or extend tests for the parser contract where coverage is missing
- add checks for layout frame mapping if any new geometry rule is introduced
- keep typecheck and build passing after each change set
- note any browser-only behavior that cannot be covered by the current Node test harness

Completed:
- extended `tests/run-tests.js` with compact chapter label coverage
- added direct merge coverage for `normalizeReadingToc`
- added restore-path coverage for `id` and `paragraphId` storage shapes

### [x] 7. Verify the plan against the actual repository state before implementing
- re-read the affected files after the todo list is frozen
- confirm the implementation order still matches the current code
- split the work into small, reviewable slices before writing code
- only then begin implementation

Completed:
- re-read the active parser, restore, and test files before writing code
- kept the implementation slice limited to data / parser / verification fixes
