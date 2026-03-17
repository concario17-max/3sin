import React from 'react';

function ReadingHeader({ chapterStr, verseStr, globalIndex }) {
  return (
    <div className="mb-6 flex flex-col items-center justify-center pt-2 sm:mb-8 sm:pt-4">
      <div className="inline-flex items-center gap-3 rounded-full border border-gold-border/30 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-text-secondary/80 shadow-[0_10px_30px_rgba(166,139,92,0.08)] backdrop-blur-md sm:px-5">
        <span>{`Chapter ${chapterStr}`}</span>
        <span className="text-gold-primary/60">·</span>
        <span className="text-text-primary">{`Paragraph ${globalIndex || `${chapterStr}-${verseStr}`}`}</span>
      </div>
    </div>
  );
}

export default ReadingHeader;
