# STATE

## Current Task
- Implementation complete for the research follow-up fixes.

## Route
- Route B

## Writer Slot
- main: planner only until contract_freeze and write_sets are recorded.

## Contract Freeze
- Clean up the left sidebar title and chapter/verse label contract in the rendered UI.
- Normalize visible copy and remove mojibake/stale fallback text in the actively rendered UI.
- Clean up parser contracts and chapter label normalization where it belongs in parser logic.
- Harden reading-state restoration against stale saved values.
- Expand parser/read-state regression coverage in the test harness.
- Avoid introducing any `any` or `unknown` types.
- Keep mobile drawer behavior unchanged while fixing desktop frame geometry.

## Write Sets
- worker_shared: `src/pages/components/LeftSidebar.jsx`, `src/components/Sidebar/SidebarChapterList.jsx`, `src/components/Sidebar/ChapterButton.jsx`, `src/components/Sidebar/ChapterGroup.jsx`, `src/components/Sidebar/SidebarVerseList.jsx`, `src/components/Sidebar/SidebarHeader.jsx`, `src/components/ui/SidebarLayout.jsx`, `src/components/Header.jsx`, `src/pages/components/RightSidebar.jsx`, `src/pages/components/ReadingPanel.jsx`, `src/index.css`, `plan.md`
- worker_data: `src/lib/parseThreeBodiesCore.js`, `src/lib/parseThreeBodies.js`, `src/lib/readingState.js`, `tests/run-tests.js`, `src/types.d.ts`

## Reviewer
- Pending assignment

## Last Update
- 2026-03-27 completed
