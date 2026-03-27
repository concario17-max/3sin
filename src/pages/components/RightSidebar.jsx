import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import SidebarLayout from '../../components/ui/SidebarLayout';

/** @typedef {import('../../types').ReadingParagraph} ReadingParagraph */
/** @typedef {import('../../types').UIContextValue} UIContextValue */

/**
 * @returns {UIContextValue}
 */
function createFallbackUIContext() {
  return {
    isDesktopViewport: false,
    isSidebarOpen: false,
    setIsSidebarOpen: () => {},
    isDesktopSidebarOpen: true,
    setIsDesktopSidebarOpen: () => {},
    toggleSidebar: () => {},
    activeRightPanel: null,
    setActiveRightPanel: () => {},
    activeDesktopRightPanel: 'commentary',
    setActiveDesktopRightPanel: () => {},
    isRightPanelOpen: true,
    closeRightPanel: () => {},
    toggleRightPanel: () => {},
    isDarkMode: false,
    toggleTheme: () => {},
    closeAllDrawers: () => {},
  };
}

/**
 * @param {{ activeParagraph: ReadingParagraph | null }} props
 */
function CommentaryPanel({ activeParagraph }) {
  const englishText =
    activeParagraph?.text.english || 'No English rendering is available for this paragraph.';
  const koreanText =
    activeParagraph?.text.korean || 'No Korean rendering is available for this paragraph.';
  const tibetanText =
    activeParagraph?.text.tibetan || 'No Tibetan source line is available for this paragraph.';

  return (
    <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto pr-0">
      <div className="flex flex-col gap-4 px-8 pb-6 pt-0">
        <section className="rounded-[1.5rem] border border-gold-border/25 bg-white/65 p-5 shadow-sm dark:border-dark-border/60 dark:bg-dark-surface/55">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          Reading Lens
        </p>
        <h3 className="mt-3 text-lg font-semibold text-text-primary dark:text-dark-text-primary">
          {activeParagraph?.chapterTitle || 'Commentary'}
        </h3>
        <p className="mt-3 font-korean text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary">
          Paragraph {activeParagraph?.id || '-'}를 읽을 때 참고하는 비교 패널입니다. 티벳
          원문, 영어 역문, 한국어 번역을 한 화면에서 함께 확인하도록 구성했습니다.
        </p>
        </section>

        <section className="rounded-[1.5rem] border border-gold-border/20 bg-gold-surface/45 p-5 dark:border-dark-border/60 dark:bg-dark-bg/30">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          Tibetan Anchor
        </p>
        <p className="mt-3 font-noto text-[14px] leading-7 text-text-primary dark:text-dark-text-primary">
          {tibetanText}
        </p>
        </section>

        <section className="rounded-[1.5rem] border border-gold-border/20 bg-white/60 p-5 dark:border-dark-border/60 dark:bg-dark-surface/50">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          English Reference
        </p>
        <p className="mt-3 font-korean text-[14px] leading-7 tracking-[-0.01em] text-text-primary dark:text-dark-text-primary">
          {englishText}
        </p>
        </section>

        <section className="rounded-[1.5rem] border border-gold-border/20 bg-white/60 p-5 dark:border-dark-border/60 dark:bg-dark-surface/50">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          Korean Reference
        </p>
        <p className="mt-3 font-korean text-[14px] leading-7 text-text-primary dark:text-dark-text-primary">
          {koreanText}
        </p>
        </section>
      </div>
    </div>
  );
}

/**
 * @param {{ activeParagraph: ReadingParagraph | null }} props
 */
function RightSidebar({ activeParagraph }) {
  const uiContext = useUI() ?? createFallbackUIContext();
  const { activeRightPanel, activeDesktopRightPanel, closeRightPanel } = uiContext;
  const isMobileOpen = activeRightPanel === 'commentary';
  const isDesktopOpen = activeDesktopRightPanel === 'commentary';

  return (
    <SidebarLayout
      isOpen={isMobileOpen}
      isDesktopOpen={isDesktopOpen}
      onClose={closeRightPanel}
      position="right"
      widthClass="w-[90vw] sm:w-[400px]"
      className="dark:bg-dark-bg/95"
    >
      <div className="relative flex h-full min-h-0 flex-col bg-white/80 dark:bg-dark-bg/95">
        <div className="shrink-0 px-6 pt-6">
          <div className="flex items-center gap-2 border-b border-gold-border/30 pb-4">
            <MessageSquareText className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
            <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">
              Commentary
            </h2>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col pt-6">
          <CommentaryPanel activeParagraph={activeParagraph} />
        </div>
      </div>
    </SidebarLayout>
  );
}

export default React.memo(
  RightSidebar,
  (prevProps, nextProps) => prevProps.activeParagraph?.id === nextProps.activeParagraph?.id,
);
