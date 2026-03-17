import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterButton from './ChapterButton';

function SidebarChapterList({ prayers, expandedChapter, toggleChapter, onSelectVerse }) {
  return (
    <motion.div
      layout
      className={`custom-scrollbar flex-none overflow-y-auto border-gold-border/40 transition-all duration-500 ${
        expandedChapter ? 'h-[30%] min-h-[30%] border-b shadow-sm' : 'h-full max-h-full'
      }`}
    >
      <div className="sticky top-0 z-10 hidden bg-transparent p-4 backdrop-blur-sm lg:block">
        <h2 className="pl-1 font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-text-primary/70">
          장 (Chapter)
        </h2>
      </div>
      <div className="flex flex-col gap-0 px-3 py-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {prayers.map((chapter) => (
            <ChapterButton
              key={chapter.id}
              chapter={chapter}
              isExpanded={expandedChapter === chapter.id}
              onClick={() => {
                toggleChapter(chapter.id);
                if (chapter.verses?.length) onSelectVerse(chapter.verses[0]);
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default SidebarChapterList;
