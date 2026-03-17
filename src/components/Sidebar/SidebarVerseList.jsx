import React from 'react';

const SidebarVerseList = ({ prayers, expandedChapter, activeVerseId, verseGlobalIndices, onSelectVerse, setIsSidebarOpen }) => {
    if (!expandedChapter) return null;

    let foundChapter = null;
    for (const prayer of prayers) {
        if (prayer.id === expandedChapter) {
            foundChapter = prayer;
            break;
        }
        if (prayer.isGroup && prayer.subchapters) {
            const sub = prayer.subchapters.find(s => `${prayer.id}-${s.id}` === expandedChapter);
            if (sub) {
                foundChapter = sub;
                break;
            }
        }
    }

    if (!foundChapter || !foundChapter.verses) return null;

    return (
        <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar h-full animate-[fadeIn_0.5s_ease-out]">
            <div className="py-2 px-3 space-y-0.5">
                {foundChapter.verses.map((verse) => {
                    const isActive = activeVerseId === verse.id;

                    return (
                        <button
                            key={verse.id}
                            onClick={() => {
                                if (onSelectVerse) onSelectVerse(verse);
                                if (window.innerWidth < 1024) setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-start text-left gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                ? 'bg-white/60 border border-gold-primary/30 text-text-primary font-medium shadow-sm dark:bg-dark-bg/60 dark:border-gold-primary/20 dark:text-gold-light'
                                : 'border border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary hover:bg-gold-surface/30 dark:hover:bg-dark-bg/40'
                                }`}
                        >
                            <span className={`min-w-[40px] whitespace-nowrap font-bold text-xs mt-[3px] ${isActive ? 'text-gold-primary' : 'text-text-secondary/60 dark:text-dark-text-secondary/60'}`}>
                                {verseGlobalIndices[verse.id] || verse.id}
                            </span>
                            <span className="truncate opacity-90 text-[13px] leading-relaxed font-noto break-keep">
                                {verse.text?.tibetan || verse.chapterTitle || verse.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(SidebarVerseList);
