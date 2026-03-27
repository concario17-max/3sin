import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterButton from './ChapterButton.jsx';

const ChapterGroup = ({ group, expandedChapter, toggleChapter, onSelectParagraph }) => {
  return (
    <motion.div layout className="mb-2">
      <div className="mb-1 rounded-lg bg-gold-surface/30 px-2.5 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-gold-primary/80 dark:bg-dark-bg/30 dark:text-gold-light/70 font-inter">
        {group.chapterName}
      </div>

      <div className="flex flex-col gap-0.5">
        <AnimatePresence mode="popLayout">
          {group.subchapters.map((subchapter) => {
            const uniqueId = `${group.id}-${subchapter.id}`;
            const isExpanded = expandedChapter === uniqueId;

            return (
              <ChapterButton
                key={subchapter.id}
                chapter={subchapter}
                count={subchapter.paragraphs?.length || 0}
                isExpanded={isExpanded}
                isSubchapter={true}
                onClick={() => {
                  toggleChapter(uniqueId);
                  if (subchapter.paragraphs?.length > 0 && onSelectParagraph) {
                    onSelectParagraph(subchapter.paragraphs[0]);
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

export default React.memo(ChapterGroup);
