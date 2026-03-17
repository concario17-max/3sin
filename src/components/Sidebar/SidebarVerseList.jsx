import React from 'react';

function SidebarVerseList({
  prayers,
  expandedChapter,
  activeVerseId,
  verseGlobalIndices,
  onSelectVerse,
  setIsSidebarOpen,
}) {
  const chapter = prayers.find((item) => item.id === expandedChapter);
  if (!chapter?.verses) return null;

  return (
    <div className="custom-scrollbar h-full flex-1 overflow-y-auto bg-transparent">
      <div className="space-y-0.5 px-3 py-2">
        {chapter.verses.map((verse) => {
          const isActive = activeVerseId === verse.id;
          return (
            <button
              key={verse.id}
              onClick={() => {
                onSelectVerse(verse);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                isActive
                  ? 'border-gold-primary/30 bg-white/60 font-medium text-text-primary shadow-sm'
                  : 'border-transparent text-text-secondary hover:bg-gold-surface/30 hover:text-text-primary'
              }`}
            >
              <span className={`mt-[3px] min-w-[40px] whitespace-nowrap text-xs font-bold ${isActive ? 'text-gold-primary' : 'text-text-secondary/60'}`}>
                {verseGlobalIndices[verse.id] || verse.id}
              </span>
              <span className="truncate font-noto text-[13px] leading-relaxed opacity-90">
                {verse.text?.tibetan || verse.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SidebarVerseList;
