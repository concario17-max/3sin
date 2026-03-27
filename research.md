# Repository Research Report

## Executive Summary

`3SIN` is a single-page React reader for the Three Bodies text set. The app has no router and no route switching layer. It is a single reading surface whose entire behavior is driven by local UI state, persisted reading position, and a parser that turns three raw text sources into chapter and paragraph objects.

The runtime flow is:

[`src/main.jsx`](C:/Users/roadsea/Desktop/3SIN/src/main.jsx) -> [`src/App.jsx`](C:/Users/roadsea/Desktop/3SIN/src/App.jsx) -> [`src/context/UIContext.jsx`](C:/Users/roadsea/Desktop/3SIN/src/context/UIContext.jsx) -> [`src/pages/TextPage.jsx`](C:/Users/roadsea/Desktop/3SIN/src/pages/TextPage.jsx)

From there, the page fans out into the shared shell, the left chapter/verse sidebar, the central reading column, and the right commentary panel.

## Bootstrapping

[`src/main.jsx`](C:/Users/roadsea/Desktop/3SIN/src/main.jsx) mounts the app with `ReactDOM.createRoot`, wraps it in `React.StrictMode`, and imports the global stylesheet from [`src/index.css`](C:/Users/roadsea/Desktop/3SIN/src/index.css).

[`src/App.jsx`](C:/Users/roadsea/Desktop/3SIN/src/App.jsx) is intentionally thin. It only mounts the UI provider and the main text page. There is no router, no nested page tree, and no client-side navigation model beyond the paragraph selection state.

## UI State Model

[`src/context/UIContext.jsx`](C:/Users/roadsea/Desktop/3SIN/src/context/UIContext.jsx) is the central state store for the app. It owns four major concerns:

- viewport mode
- left sidebar open/closed state
- right panel open/closed state
- light/dark theme

### Desktop and Mobile Split

The app treats `min-width: 1280px` as desktop mode. On desktop:

- `isDesktopViewport` becomes `true`
- the left sidebar uses `isDesktopSidebarOpen`
- the right panel uses `activeDesktopRightPanel`

On mobile:

- `isSidebarOpen` controls the left drawer
- `activeRightPanel` controls the right drawer

The provider also closes the mobile drawer state when the viewport crosses into desktop mode. That keeps the two modes separate instead of trying to share the same open/closed booleans.

### Persistence

Desktop sidebar and desktop right panel state are persisted to `localStorage`. Theme is also persisted there, under `three-body-theme`.

This is useful for continuity, but it means the app assumes a browser environment and is not SSR-safe by design.

### State Risks

- viewport state is split across desktop and mobile branches, so a quick inspection of only one branch can be misleading
- direct `localStorage` use means stale saved values can survive data-shape changes
- only one right panel type exists in practice: `commentary`

## Shell and Layout

[`src/components/ui/AppShell.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/ui/AppShell.jsx) is the structural wrapper for the entire page.

It provides:

- the fixed decorative background layer
- the top header
- the main three-column frame
- the left sidebar
- the center reading area
- the right sidebar

The desktop layout is coordinated by a shared CSS variable set on the shell.

### Desktop Frame Contract

[`src/components/ui/desktopFrame.js`](C:/Users/roadsea/Desktop/3SIN/src/components/ui/desktopFrame.js) is the single source of truth for the desktop frame columns.

It maps two desktop booleans:

- left sidebar open/closed
- right panel open/closed

to four states:

- left open + right open: `20% 60% 20%`
- left closed + right open: `0% 60% 40%`
- left open + right closed: `20% 80% 0%`
- left closed + right closed: `0% 100% 0%`

This is the core layout contract for the app. Header alignment, sidebars, and the reading column all depend on it.

### Header Alignment

[`src/components/Header.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/Header.jsx) reads the same desktop frame string and aligns its desktop content to the center reading column.

- On mobile it renders a hamburger, icon/title group, commentary toggle, and theme toggle in a simple flex row.
- On desktop it renders a grid-based header strip that mirrors the main frame columns.
- The title, commentary button, and theme button are all arranged relative to the same frame width as the reading column.

### Sidebar Shell

[`src/components/ui/SidebarLayout.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/ui/SidebarLayout.jsx) is the generic shell used by both sidebars.

Mobile behavior:

- fixed off-canvas drawer
- translate-based open/close motion
- backdrop overlay when open

Desktop behavior:

- sticky sidebar aligned to the main frame
- width and opacity controlled through `xl:` state classes
- closed state collapses width and disables pointer events

That design keeps the side panels drawer-like on mobile, while making them part of the desktop frame.

## Left Sidebar

[`src/pages/components/LeftSidebar.jsx`](C:/Users/roadsea/Desktop/3SIN/src/pages/components/LeftSidebar.jsx) owns the chapter navigation and paragraph list for the left side.

### Responsibilities

- renders the sidebar shell
- renders the top title block below the top bar
- renders the chapter list
- renders the verse list
- tracks which chapter is expanded
- selects the first paragraph when a chapter button is clicked

### Paragraph Indexing

The component builds a `paragraphIndices` map with `useMemo`.

- it numbers paragraphs across all chapters
- if `isPrayerPage` is true, numbering resets inside the nested loop structure
- the numbers are used by the verse badges

### Expanded Chapter Logic

`expandedChapter` is initialized from the active paragraph and kept in sync with `activeParagraphId`.

The component also handles grouped chapters and nested subchapters by matching paragraph IDs.

### Sidebar Memoization

The component is wrapped in `React.memo`.

Current comparison keys:

- `activeParagraphId`
- `chapters`
- `isPrayerPage`

That is important because paragraph numbering and grouping behavior changes when `isPrayerPage` changes.

### Important Layout Detail

The left sidebar now has a visible title block directly below the top bar:

- `시이꾸쑴기남샥랍쌜된메`
- `(因位三身行相明燈論)`

This title is part of the left sidebar shell, not the verse list.

## Chapter List

[`src/components/Sidebar/SidebarChapterList.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/Sidebar/SidebarChapterList.jsx) renders the collapsible chapter navigator.

- it uses `framer-motion` for layout transitions
- expanded state changes the vertical height distribution
- chapter rows are rendered by [`src/components/Sidebar/ChapterButton.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/Sidebar/ChapterButton.jsx)
- grouped chapters are rendered by [`src/components/Sidebar/ChapterGroup.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/Sidebar/ChapterGroup.jsx)

### Chapter Button

[`src/components/Sidebar/ChapterButton.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/Sidebar/ChapterButton.jsx)

- shows the compact `chapterName`
- shows a paragraph count badge
- uses small motion hover/tap transitions

### Chapter Group

[`src/components/Sidebar/ChapterGroup.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/Sidebar/ChapterGroup.jsx)

- adds a group header label
- renders nested subchapters
- uses a `groupId-subchapterId` key format for nested expansion

### Risk

The chapter list is driven entirely by parsed chapter metadata. If a chapter title needs to disappear from the sidebar, that is a data/parsing decision, not a verse-list decision.

## Verse List

[`src/components/Sidebar/SidebarVerseList.jsx`](C:/Users/roadsea/Desktop/3SIN/src/components/Sidebar/SidebarVerseList.jsx) renders the paragraphs for the currently expanded chapter.

### Behavior

- finds the active chapter or subchapter from `expandedChapter`
- renders paragraph rows in a scrollable list
- clicking a paragraph selects it
- on mobile, selecting a paragraph closes the drawer
- on desktop, the drawer stays open

### Current Display Contract

- there is no longer a chapter badge header block inside the verse list
- Tibetan preview text is clamped to one line
- the paragraph number badge comes from `paragraphIndices`

### Risk

The verse rows still rely on text fallbacks. If the underlying source data changes shape, the row may display a fallback title instead of the desired Tibetan line.

## Right Panel

[`src/pages/components/RightSidebar.jsx`](C:/Users/roadsea/Desktop/3SIN/src/pages/components/RightSidebar.jsx) is the commentary panel.

### Responsibilities

- wraps the right panel in the same sidebar shell as the left side
- switches between mobile and desktop open state
- renders a commentary heading and several reference cards

### Commentary Content

The commentary card stack currently shows:

- Reading Lens
- Tibetan Anchor
- English Reference
- Korean Reference

It is tied to the currently active paragraph and acts like contextual reading guidance.

### Risk / Oddity

The commentary body contains some mojibake-looking placeholder text. That is not a runtime error, but it is a content-quality problem and a sign that the repo has some encoding damage.

## Reading Pipeline

The reading data is built from three raw text files at the repository root:

- `1. 삼신 티벳-한글.txt`
- `2. 삼신 영어.txt`
- `3. 삼신 목차.txt`

### Parser Flow

[`src/lib/parseThreeBodiesCore.js`](C:/Users/roadsea/Desktop/3SIN/src/lib/parseThreeBodiesCore.js) contains the real parsing logic.

It does the following:

- `parseKoreanEntries()` parses the numbered source paragraphs that contain Tibetan and Korean text
- `parseEnglishEntries()` parses English entries into a `Map`
- `parseToc()` parses chapter ranges from the table of contents text
- `normalizeReadingToc()` adjusts the opening TOC mapping when the source has a special introductory chapter
- `compactChapterLabel()` converts chapter titles into compact labels used by the sidebar
- `createReadingData()` turns parsed entries into chapter objects with paragraph arrays
- `flattenParagraphs()` flattens all chapter paragraphs into a single list for linear navigation

### Build Wrapper

[`src/lib/parseThreeBodies.js`](C:/Users/roadsea/Desktop/3SIN/src/lib/parseThreeBodies.js)

- imports the raw text files with Vite `?raw`
- re-exports the pure parsing helpers
- exposes `buildReadingData()`

So the parser is split into:

- a pure parsing core
- a Vite-specific raw-file wrapper

### Reading State Recovery

[`src/lib/readingState.js`](C:/Users/roadsea/Desktop/3SIN/src/lib/readingState.js) resolves saved paragraph selection from storage.

- it accepts either a saved string or an object with `id`
- it returns the matching paragraph when the saved value is valid
- it falls back to the first available paragraph when storage is stale or malformed

That fallback matters because the app has gone through several paragraph shape changes while the reader state persisted in browsers.

## Reading Page

[`src/pages/TextPage.jsx`](C:/Users/roadsea/Desktop/3SIN/src/pages/TextPage.jsx) is the page glue.

### What It Owns

- builds chapters once with `useMemo`
- flattens paragraphs once with `useMemo`
- restores the active paragraph from storage
- writes the active paragraph ID back to `localStorage`
- computes previous/next navigation
- calculates the desktop frame columns from UI state

### Page Composition

`TextPage` passes the three major children into `AppShell`:

- [`Header`](C:/Users/roadsea/Desktop/3SIN/src/components/Header.jsx)
- [`LeftSidebar`](C:/Users/roadsea/Desktop/3SIN/src/pages/components/LeftSidebar.jsx)
- [`RightSidebar`](C:/Users/roadsea/Desktop/3SIN/src/pages/components/RightSidebar.jsx)

The selected paragraph is then rendered in [`ReadingPanel`](C:/Users/roadsea/Desktop/3SIN/src/pages/components/ReadingPanel.jsx).

### Risk

This page is browser-only logic. It depends on `localStorage` and on the parser output staying compatible with the saved paragraph IDs.

## Reading Panel

[`src/pages/components/ReadingPanel.jsx`](C:/Users/roadsea/Desktop/3SIN/src/pages/components/ReadingPanel.jsx) renders the center reading column.

### Structure

- a centered header pill for chapter and paragraph labels
- a Tibetan original section
- an English/Korean translation section
- previous/next navigation

### Defensive Behavior

- it guards against null or malformed verse objects
- it safely reads `verse.id` and `verse.text`
- it uses `React.memo` so the panel does not rerender unless the selected paragraph ID changes

### Typography

- the reading column is centered with a wide max width
- Tibetan has its own dedicated visual section
- translations are styled as separate reading cards

## Styles and Visual System

[`src/index.css`](C:/Users/roadsea/Desktop/3SIN/src/index.css) contains the global stylesheet and the desktop frame helpers.

### Fonts

- imports `Pretendard Variable` from a CDN
- root defaults still use `Inter`
- headings use `Cormorant Garamond`

### Desktop Frame Helpers

At desktop breakpoint:

- `.desktop-frame-grid` applies the shared column contract
- `.desktop-frame-main` pins the reading area to the center column
- `.desktop-header-grid` mirrors the same columns for the top bar
- `.desktop-header-main` aligns the header content with the center reading column

### Other Styling

- custom scrollbars are defined globally
- there are utility classes for the glass and card visual language
- the app leans heavily on Tailwind utilities plus a small set of custom helpers

### Oddity

The stylesheet still contains some mojibake-looking fragments in utility content values. That is likely encoding damage rather than intentional design.

## Tests and Verification

[`tests/run-tests.js`](C:/Users/roadsea/Desktop/3SIN/tests/run-tests.js) is the only automated test entry.

### What It Checks

- desktop frame column mapping for all four layout states
- parser counts for the Korean, English, and TOC sources
- chapter normalization and paragraph flattening
- `resolveStoredActiveParagraph()` fallback behavior

### Coverage Level

- good for smoke-level regression detection
- not enough to catch visual layout regressions
- not enough to catch browser rendering issues, stale cache issues, or animation regressions

### Package Scripts

[`package.json`](C:/Users/roadsea/Desktop/3SIN/package.json) exposes:

- `dev`
- `build`
- `preview`
- `typecheck`
- `test`

The repo has type checking, build, and a small Node test harness, but no linter.

## Notable Risks and Oddities

1. **Encoding damage**
   - Several strings and comments are garbled in terminals.
   - The code still runs, but it is harder to maintain than it should be.

2. **Layout coupling**
   - The app uses a shared desktop frame variable, but the panels are still a mix of sticky, fixed, and width-controlled behavior.
   - That is workable, but it is easy to create fake gaps if translate or width classes drift.

3. **No router**
   - This is a single reading surface, not a multi-route app.
   - That keeps the code smaller, but future feature growth will need another navigation layer.

4. **LocalStorage-heavy state**
   - Useful for persistence.
   - Risky when the data contract changes, because old saved state can point to paragraphs that no longer exist.

5. **Narrow tests**
   - Current tests validate parser counts and frame mapping.
   - They do not validate real browser layout or sidebar collapse/expand visuals.

6. **Commentary content quality**
   - The commentary pane includes placeholder-like text.
   - That is not a runtime bug, but it makes the reading experience look unfinished.

## Short Summary

`3SIN` is a focused React reader with:

- one bootstrap path
- one shared UI state provider
- one parser pipeline for three raw text sources
- a desktop frame model driven by a single column contract
- a left chapter/verse sidebar
- a right commentary panel
- a centered reading column with strong typography and card-based sections

The architecture is reasonably clean, but the main maintenance risks are encoding damage, layout coupling, and limited automated coverage for visual behavior.
