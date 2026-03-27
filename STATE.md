# STATE

## Current Task
- Remove the chapter label block from the verse list header and clamp Tibetan text to one line.

## Route
- Route A

## Writer Slot
- main: direct implementation for a single-file layout cleanup.

## Contract Freeze
- Remove the `4장 기본의 삼신` chapter label block from the verse list header.
- Clamp the Tibetan preview text in the verse rows to one line instead of two.
- Keep the mobile drawer behavior unchanged.
- Remove any leftover duplicated title block from the verse list area if present.
- Avoid introducing any `any` or `unknown` types.
- Preserve existing desktop/mobile sidebar behavior and keep the chapter list and verse list readable.

## Write Sets
- main: `src/components/Sidebar/SidebarVerseList.jsx`

## Reviewer
- Not required for Route A

## Last Update
- 2026-03-27 completed
