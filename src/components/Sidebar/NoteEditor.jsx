import React from 'react';

function NoteEditor({ activeVerseId, note, setNote }) {
  return (
    <div className="mb-4 flex min-h-0 flex-1 flex-col space-y-2">
      <div className="text-xs font-bold uppercase tracking-wider text-[#8FA0AD]">Verse {activeVerseId}</div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="이 문단에 대한 메모와 해석을 적어두세요."
        className="custom-scrollbar flex-1 resize-none rounded-2xl border border-gold-primary/20 bg-white/80 p-5 text-[14px] leading-relaxed text-text-primary shadow-inner backdrop-blur-xl transition-all placeholder:text-text-secondary/60 focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/20"
      />
    </div>
  );
}

export default NoteEditor;
