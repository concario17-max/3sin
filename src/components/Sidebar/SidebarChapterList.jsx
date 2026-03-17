import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterButton from './ChapterButton';
import ChapterGroup from './ChapterGroup';

/**
 * SidebarChapterList - 챕터 목록 컨테이너 (Refactored: Zero Monolith)
 */
const SidebarChapterList = ({ prayers, expandedChapter, toggleChapter, onSelectVerse }) => {
    return (
        <motion.div
            layout
            className={`flex-none overflow-y-auto border-gold-border/40 dark:border-[#222] custom-scrollbar transition-all duration-500 ease-in-out ${expandedChapter ? 'h-[30%] min-h-[30%] border-b shadow-sm' : 'max-h-full h-full'
                }`}
        >
            <div className="p-4 bg-transparent sticky top-0 z-10 backdrop-blur-sm hidden lg:block">
                <h2 className="text-[11px] font-bold font-inter tracking-[0.2em] uppercase text-text-primary/70 dark:text-dark-text-primary/60 pl-1">
                    장 (Chapter)
                </h2>
            </div>

            <div className="py-1 px-3 flex flex-col gap-0">
                <AnimatePresence mode="popLayout" initial={false}>
                    {prayers && prayers.map((prayer) => {
                        if (prayer.isGroup) {
                            return (
                                <ChapterGroup
                                    key={prayer.id}
                                    group={prayer}
                                    expandedChapter={expandedChapter}
                                    toggleChapter={toggleChapter}
                                    onSelectVerse={onSelectVerse}
                                />
                            );
                        }

                        const isExpanded = expandedChapter === prayer.id;
                        return (
                            <ChapterButton
                                key={prayer.id}
                                chapter={prayer}
                                isExpanded={isExpanded}
                                onClick={() => {
                                    toggleChapter(prayer.id);
                                    if (prayer.verses?.length > 0 && onSelectVerse) {
                                        onSelectVerse(prayer.verses[0]);
                                    }
                                }}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default React.memo(SidebarChapterList);
