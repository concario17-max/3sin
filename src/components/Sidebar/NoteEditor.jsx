import React from 'react';

const NoteEditor = ({ activeVerseId, note, setNote }) => {
    return (
        <div className="mb-4 flex-1 flex flex-col min-h-0 space-y-2">
            <div className="text-xs font-bold text-[#8FA0AD] tracking-wider uppercase">
                Verse {activeVerseId}
            </div>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="수트라 관점. 개인적 통찰 및 논리 압축 기록 요망."
                className="flex-1 w-full p-5 rounded-2xl border border-gold-primary/20 dark:border-dark-border bg-white/80 dark:bg-dark-surface/60 text-text-primary dark:text-dark-text-primary focus:outline-none focus:border-gold-primary/50 focus:ring-1 focus:ring-gold-primary/20 shadow-inner backdrop-blur-xl transition-all resize-none font-inter text-[14px] leading-relaxed custom-scrollbar placeholder:text-text-secondary/60 dark:placeholder:text-dark-text-secondary/60"
            />
        </div>
    );
};

export default React.memo(NoteEditor);
