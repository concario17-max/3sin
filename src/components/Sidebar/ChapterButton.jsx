import React from 'react';
import { motion } from 'framer-motion';

function ChapterButton({ chapter, isExpanded, onClick }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-2 text-left transition-all ${
        isExpanded
          ? 'border-gold-primary/20 bg-white/60 text-[#1C2B36] shadow-sm'
          : 'border-transparent text-[#5B7282] hover:bg-gold-surface/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex-1 pr-2 text-[11px] font-bold leading-snug tracking-tight">{chapter.chapterName}</span>
        <span className="rounded px-2 py-0 text-xs font-bold text-gold-primary">{chapter.verses?.length || 0}</span>
      </div>
    </motion.button>
  );
}

export default ChapterButton;
