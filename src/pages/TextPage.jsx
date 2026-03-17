import React from 'react';
import { buildPrayerData, flattenVerses } from '../lib/parseThreeBodies';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';

const prayers = buildPrayerData();

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
  const flatVerses = React.useMemo(() => flattenVerses(prayers), []);
  const [activeVerse, setActiveVerse] = React.useState(() => {
    try {
      const saved = localStorage.getItem('three_body_active_verse');
      return saved ? JSON.parse(saved) : flatVerses[0] ?? null;
    } catch {
      return flatVerses[0] ?? null;
    }
  });

  React.useEffect(() => {
    if (activeVerse) {
      localStorage.setItem('three_body_active_verse', JSON.stringify(activeVerse));
    }
  }, [activeVerse]);

  const currentIndex = activeVerse ? flatVerses.findIndex((verse) => verse.id === activeVerse.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < flatVerses.length - 1;

  const handleNavigate = (direction) => {
    if (direction === 'prev' && hasPrev) setActiveVerse(flatVerses[currentIndex - 1]);
    if (direction === 'next' && hasNext) setActiveVerse(flatVerses[currentIndex + 1]);
  };

  return (
    <div className="relative z-10 flex h-screen min-h-screen w-full overflow-hidden bg-sand-primary xl:bg-transparent">
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-grid-slate-900/[0.04] bg-[bottom_1px_center]" />

      <LeftSidebar prayers={prayers} onSelectVerse={setActiveVerse} activeVerseId={activeVerse?.id} />

      {activeVerse ? (
        <>
          <ReadingPanel
            verse={activeVerse}
            globalIndex={currentIndex + 1}
            hideAudio={true}
            onPrevious={hasPrev ? () => handleNavigate('prev') : null}
            onNext={hasNext ? () => handleNavigate('next') : null}
          />
          <RightSidebar activeVerseId={activeVerse.id} />
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
