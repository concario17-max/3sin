import React from 'react';
import { MessageSquareText, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

function CommentaryPanel({ activeParagraph }) {
  const englishText = activeParagraph?.text?.english || 'No English rendering is available for this paragraph.';
  const koreanText = activeParagraph?.text?.korean || 'No Korean rendering is available for this paragraph.';
  const tibetanText = activeParagraph?.text?.tibetan || 'No Tibetan source line is available for this paragraph.';

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
      <section className="rounded-[1.5rem] border border-gold-border/25 bg-white/65 p-5 shadow-sm dark:border-dark-border/60 dark:bg-dark-surface/55">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          Reading Lens
        </p>
        <h3 className="mt-3 text-lg font-semibold text-text-primary dark:text-dark-text-primary">
          {activeParagraph?.chapterTitle || 'Commentary'}
        </h3>
        <p className="mt-3 font-korean text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary">
          Paragraph {activeParagraph?.id || '-'}瑜??쎌쓣 ???곕쿋???먮Ц, ?곸뼱 ??Ц, ?쒓뎅??踰덉뿭???섎????먭퀬 ?섎???寃곗쓣 鍮꾧탳??蹂댁꽭?? ???⑤꼸? 蹂몃Ц??怨곸뿉???쎈뒗 ?댁꽕 李쎌쑝濡??숈옉?⑸땲??
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
        <p className="mt-3 font-serif text-[15px] leading-7 text-text-primary dark:text-dark-text-primary">
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
  );
}

const RightSidebar = ({ activeParagraph }) => {
  const uiContext = useUI() || {
    isRightPanelOpen: true,
    closeRightPanel: () => {},
  };
  const { isRightPanelOpen, closeRightPanel } = uiContext;
  const visibilityClassName = isRightPanelOpen
    ? 'translate-x-0 lg:translate-x-0'
    : 'translate-x-full lg:translate-x-full pointer-events-none';

  return (
    <>
      {isRightPanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={closeRightPanel}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 top-16 z-50 w-[90vw] sm:w-[400px] bg-white/80 dark:bg-dark-bg/95 backdrop-blur-xl border-l border-gold-primary/20 dark:border-dark-border/50 h-[calc(100vh-64px)] transform transition-transform duration-500 ${visibilityClassName} ${
          isRightPanelOpen ? 'overflow-hidden shadow-2xl lg:shadow-none' : ''
        } flex flex-col font-inter lg:relative lg:top-0 lg:right-0 lg:z-10 lg:h-[calc(100vh-64px)] lg:w-full`}
      >
        <div className="lg:hidden absolute top-4 right-4 z-50">
          <button
            onClick={closeRightPanel}
            className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 relative flex flex-col h-full min-h-0">
          <div className="mb-6 flex items-center gap-2 border-b border-gold-border/30 pb-4 shrink-0">
            <MessageSquareText className="w-5 h-5 text-[#A68B5C] dark:text-gold-light" />
            <h2 className="text-sm font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide">
              Commentary
            </h2>
          </div>

          <CommentaryPanel activeParagraph={activeParagraph} />
        </div>
      </aside>
    </>
  );
};

export default React.memo(RightSidebar, (prevProps, nextProps) => prevProps.activeParagraph?.id === nextProps.activeParagraph?.id);
