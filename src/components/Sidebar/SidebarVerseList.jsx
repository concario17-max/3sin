import React from 'react';

const SidebarVerseList = ({
  chapters,
  expandedChapter,
  activeParagraphId,
  paragraphIndices,
  onSelectParagraph,
  setIsSidebarOpen,
  isDesktopViewport = false,
}) => {
  if (!expandedChapter) return null;

  let foundChapter = null;
  for (const chapter of chapters) {
    if (chapter.id === expandedChapter) {
      foundChapter = chapter;
      break;
    }
    if (chapter.isGroup && chapter.subchapters) {
      const subchapter = chapter.subchapters.find((item) => `${chapter.id}-${item.id}` === expandedChapter);
      if (subchapter) {
        foundChapter = subchapter;
        break;
      }
    }
  }

  if (!foundChapter || !foundChapter.paragraphs) return null;

  return (
    <div className="custom-scrollbar flex-1 min-h-0 overflow-y-auto bg-transparent animate-[fadeIn_0.5s_ease-out]">
      <div className="space-y-1.5 px-3 py-3">
        {foundChapter.paragraphs.map((paragraph) => {
          const isActive = activeParagraphId === paragraph.id;

          return (
            <button
              key={paragraph.id}
              onClick={() => {
                if (onSelectParagraph) onSelectParagraph(paragraph);
                if (!isDesktopViewport) setIsSidebarOpen(false);
              }}
              className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-2.5 text-left text-[16px] transition-colors ${
                isActive
                  ? 'border-gold-primary/30 bg-white/65 text-text-primary shadow-sm dark:border-gold-primary/20 dark:bg-dark-bg/60 dark:text-gold-light'
                  : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:bg-gold-surface/30 hover:text-text-primary dark:hover:bg-dark-bg/40'
              }`}
            >
              <span
                className={`mt-0.5 flex min-w-[2.25rem] items-center justify-center rounded-full bg-gold-surface/55 px-2 py-1 text-[12px] font-bold leading-none ${
                  isActive
                    ? 'text-gold-primary dark:bg-dark-bg/50'
                    : 'text-text-secondary/70 dark:bg-dark-bg/40 dark:text-dark-text-secondary/70'
                }`}
              >
                {paragraphIndices[paragraph.id] || paragraph.id}
              </span>
              <span className="min-w-0 overflow-hidden font-noto text-[14px] leading-[1.45] opacity-90 break-keep [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
                {paragraph.text?.tibetan || paragraph.chapterTitle || paragraph.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(SidebarVerseList);
