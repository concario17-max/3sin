import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterButton from './ChapterButton';

/**
 * ChapterGroup - 그룹화된 챕터 섹션 (독립 컴포넌트)
 * @param {Object} group - 그룹 데이터
 * @param {string} expandedChapter - 현재 확장된 챕터 ID
 * @param {function} toggleChapter - 토글 핸들러
 * @param {function} onSelectVerse - 구절 선택 핸들러
 */
const ChapterGroup = ({ group, expandedChapter, toggleChapter, onSelectVerse }) => {
    return (
        <motion.div layout className="mb-1">
            {/* Group Title */}
            <div className="px-3 py-2 text-gold-primary/80 dark:text-gold-light/70 text-[11px] font-bold tracking-[0.2em] rounded-lg bg-gold-surface/30 dark:bg-dark-bg/30 uppercase font-inter mb-1">
                {group.chapterName}
            </div>

            {/* Subchapters List */}
            <div className="flex flex-col gap-0">
                <AnimatePresence mode="popLayout">
                    {group.subchapters.map((subGroup) => {
                        const uniqueId = `${group.id}-${subGroup.id}`;
                        const isExpanded = expandedChapter === uniqueId;

                        return (
                            <ChapterButton
                                key={subGroup.id}
                                chapter={subGroup}
                                isExpanded={isExpanded}
                                isSubchapter={true}
                                onClick={() => {
                                    toggleChapter(uniqueId);
                                    if (subGroup.verses?.length > 0 && onSelectVerse) {
                                        onSelectVerse(subGroup.verses[0]);
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
