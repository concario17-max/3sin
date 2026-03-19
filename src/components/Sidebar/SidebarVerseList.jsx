import React from 'react';

const SidebarVerseList = ({ chapters, expandedChapter, activeParagraphId, paragraphIndices, onSelectParagraph, setIsSidebarOpen }) => {
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
        <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar h-full animate-[fadeIn_0.5s_ease-out]">
            <div className="py-2 px-3 space-y-0.5">
                {foundChapter.paragraphs.map((paragraph) => {
                    const isActive = activeParagraphId === paragraph.id;

                    return (
                        <button
                            key={paragraph.id}
                            onClick={() => {
                                if (onSelectParagraph) onSelectParagraph(paragraph);
                                if (window.innerWidth < 1024) setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-start text-left gap-3 px-3 py-2.5 rounded-lg text-[16px] transition-all ${isActive
                                ? 'bg-white/60 border border-gold-primary/30 text-text-primary font-medium shadow-sm dark:bg-dark-bg/60 dark:border-gold-primary/20 dark:text-gold-light'
                                : 'border border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary hover:bg-gold-surface/30 dark:hover:bg-dark-bg/40'
                                }`}
                        >
                            <span className={`min-w-[40px] whitespace-nowrap font-bold text-[14px] mt-[3px] ${isActive ? 'text-gold-primary' : 'text-text-secondary/60 dark:text-dark-text-secondary/60'}`}>
                                {paragraphIndices[paragraph.id] || paragraph.id}
                            </span>
                            <span className="truncate opacity-90 text-[15px] leading-relaxed font-noto break-keep">
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
