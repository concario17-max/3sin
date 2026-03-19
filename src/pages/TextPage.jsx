import React from 'react';
import { buildReadingData, flattenParagraphs } from '../lib/parseThreeBodies';
import { useUI } from '../context/UIContext';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';

const chapters = buildReadingData();
const ACTIVE_PARAGRAPH_STORAGE_KEY = 'three_body_active_verse';
const LEGACY_ACTIVE_PARAGRAPH_STORAGE_KEY = 'tibet_active_verse';

function loadStoredActiveParagraph(fallbackParagraph, paragraphs) {
  try {
    const saved =
      localStorage.getItem(ACTIVE_PARAGRAPH_STORAGE_KEY) ??
      localStorage.getItem(LEGACY_ACTIVE_PARAGRAPH_STORAGE_KEY);

    if (!saved) return fallbackParagraph;

    const parsed = JSON.parse(saved);
    const paragraphId =
      typeof parsed === 'string'
        ? parsed
        : typeof parsed?.id === 'string'
          ? parsed.id
          : null;

    if (!paragraphId) return fallbackParagraph;
    return paragraphs.find((paragraph) => paragraph.id === paragraphId) ?? fallbackParagraph;
  } catch {
    return fallbackParagraph;
  }
}

function StatePanel({ kicker, title, description }) {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center p-6 sm:p-8">
      <div className="empty-state-card max-w-lg rounded-[2rem] px-8 py-10 text-center shadow-[0_30px_70px_rgba(120,93,48,0.08)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep shadow-inner">
          <span className="font-serif text-2xl">3</span>
        </div>
        <p className="mt-5 font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-deep/72">
          {kicker}
        </p>
        <h3 className="mt-4 font-serif text-[1.8rem] leading-tight text-text-primary">{title}</h3>
        <p className="mt-4 font-korean text-[15px] leading-[1.9] text-text-secondary/85">{description}</p>
      </div>
    </div>
  );
}

function TextPage() {
  const flatParagraphs = React.useMemo(() => flattenParagraphs(chapters), []);
  const [activeParagraph, setActiveParagraph] = React.useState(() => loadStoredActiveParagraph(flatParagraphs[0] ?? null, flatParagraphs));
  const ui = useUI() || { isSidebarOpen: true, isRightPanelOpen: false };
  const { isSidebarOpen, isRightPanelOpen } = ui;
  const desktopRightSidebarWidth = isRightPanelOpen
    ? (isSidebarOpen ? '400px' : '800px')
    : '0px';
  const layoutVars = React.useMemo(() => ({
    '--desktop-left-sidebar-width': isSidebarOpen ? '400px' : '0px',
    '--desktop-right-sidebar-width': desktopRightSidebarWidth,
  }), [desktopRightSidebarWidth, isSidebarOpen]);

  React.useEffect(() => {
    if (typeof activeParagraph?.id === 'string') {
      localStorage.setItem(ACTIVE_PARAGRAPH_STORAGE_KEY, JSON.stringify(activeParagraph.id));
    }
  }, [activeParagraph]);

  const currentIndex = activeParagraph ? flatParagraphs.findIndex((paragraph) => paragraph.id === activeParagraph.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < flatParagraphs.length - 1;

  const handleNavigate = (direction) => {
    if (direction === 'prev' && hasPrev) setActiveParagraph(flatParagraphs[currentIndex - 1]);
    if (direction === 'next' && hasNext) setActiveParagraph(flatParagraphs[currentIndex + 1]);
  };

  return (
    <div
      className="relative z-10 flex h-screen min-h-screen w-full overflow-hidden bg-sand-primary pt-16 xl:bg-transparent"
      style={layoutVars}
    >
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-grid-slate-900/[0.04] bg-[bottom_1px_center]" />

      <LeftSidebar chapters={chapters} onSelectParagraph={setActiveParagraph} activeParagraphId={activeParagraph?.id} />

      {activeParagraph ? (
        <>
          <ReadingPanel
            verse={activeParagraph}
            globalIndex={currentIndex + 1}
            hideAudio={true}
            onPrevious={hasPrev ? () => handleNavigate('prev') : null}
            onNext={hasNext ? () => handleNavigate('next') : null}
          />
          <RightSidebar
            activeVerseId={activeParagraph.id}
            activeParagraph={activeParagraph}
            chapterSidebarOpen={isSidebarOpen}
            expandToDoubleWidthWhenChapterSidebarClosed={true}
          />
        </>
      ) : (
        <StatePanel
          kicker="Select A Passage"
          title="Select a paragraph to begin"
          description="Choose a chapter and paragraph from the left sidebar to open the full reading layout."
        />
      )}
    </div>
  );
}

export default TextPage;
