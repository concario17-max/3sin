import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import SidebarHeader from '../../components/Sidebar/SidebarHeader.jsx';
import SidebarChapterList from '../../components/Sidebar/SidebarChapterList.jsx';
import SidebarVerseList from '../../components/Sidebar/SidebarVerseList.jsx';
import SidebarLayout from '../../components/ui/SidebarLayout.jsx';

const LeftSidebar = ({ chapters, onSelectParagraph, activeParagraphId, isPrayerPage = false }) => {
  const uiContext = useUI() || {
    isSidebarOpen: false,
    setIsSidebarOpen: () => {},
    isDesktopSidebarOpen: true,
    isDesktopViewport: false,
  };
  const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen, isDesktopViewport } = uiContext;
  const isSingleChapter = (chapters?.length ?? 0) <= 1;

  const paragraphIndices = React.useMemo(() => {
    const map = {};
    let count = 1;

    chapters?.forEach((chapter) => {
      if (isPrayerPage) count = 1;

      if (chapter.isGroup && chapter.subchapters) {
        chapter.subchapters.forEach((subchapter) => {
          if (isPrayerPage) count = 1;
          subchapter.paragraphs?.forEach((paragraph) => {
            map[paragraph.id] = count++;
          });
        });
      } else {
        chapter.paragraphs?.forEach((paragraph) => {
          map[paragraph.id] = count++;
        });
      }
    });

    return map;
  }, [chapters, isPrayerPage]);

  const [expandedChapter, setExpandedChapter] = useState(() => {
    if (!activeParagraphId || !chapters) return null;

    for (const chapter of chapters) {
      if (chapter.isGroup && chapter.subchapters) {
        const subchapter = chapter.subchapters.find((item) =>
          item.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId),
        );
        if (subchapter) return `${chapter.id}-${subchapter.id}`;
      } else if (chapter.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId)) {
        return chapter.id;
      }
    }

    return null;
  });

  React.useEffect(() => {
    if (!activeParagraphId || !chapters) return;

    let targetChapterId = null;
    for (const chapter of chapters) {
      if (chapter.isGroup && chapter.subchapters) {
        const subchapter = chapter.subchapters.find((item) =>
          item.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId),
        );
        if (subchapter) {
          targetChapterId = `${chapter.id}-${subchapter.id}`;
          break;
        }
      } else if (chapter.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId)) {
        targetChapterId = chapter.id;
        break;
      }
    }

    if (targetChapterId && targetChapterId !== expandedChapter) {
      setExpandedChapter(targetChapterId);
    }
  }, [activeParagraphId, chapters, expandedChapter]);

  const toggleChapter = React.useCallback((chapterId) => {
    setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
  }, []);

  return (
    <SidebarLayout
      isOpen={isSidebarOpen}
      isDesktopOpen={isDesktopSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      position="left"
      widthClass="w-80"
      className="dark:bg-dark-bg/95"
    >
      <SidebarHeader setIsSidebarOpen={setIsSidebarOpen} />

      <div className="shrink-0 border-b border-gold-border/20 bg-white/90 px-4 py-4 backdrop-blur-sm dark:border-dark-border/50 dark:bg-dark-bg/92">
        <p className="font-korean text-[14px] font-semibold leading-tight text-text-primary dark:text-dark-text-primary">
          시이꾸쑴기남샥랍쌜된메
        </p>
        <p className="mt-0.5 font-inter text-[10px] font-bold uppercase tracking-[0.24em] text-gold-deep/70 dark:text-gold-light/65">
          (因位三身行相明燈論)
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-white/80 dark:bg-dark-bg/95">
        {!isSingleChapter ? (
          <SidebarChapterList
            chapters={chapters}
            expandedChapter={expandedChapter}
            toggleChapter={toggleChapter}
            onSelectParagraph={onSelectParagraph}
          />
        ) : null}

        <SidebarVerseList
          chapters={chapters}
          expandedChapter={expandedChapter}
          activeParagraphId={activeParagraphId}
          paragraphIndices={paragraphIndices}
          onSelectParagraph={onSelectParagraph}
          setIsSidebarOpen={setIsSidebarOpen}
          isDesktopViewport={isDesktopViewport}
        />
      </div>
    </SidebarLayout>
  );
};

export default React.memo(
  LeftSidebar,
  (prevProps, nextProps) =>
    prevProps.activeParagraphId === nextProps.activeParagraphId &&
    prevProps.chapters === nextProps.chapters &&
    prevProps.isPrayerPage === nextProps.isPrayerPage,
);


