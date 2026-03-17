import React from 'react';
import { Download } from 'lucide-react';

function ReflectionActions({
  showExportMenu,
  setShowExportMenu,
  handleExportCurrent,
  handleExportAll,
  handleSave,
  isSaving,
}) {
  return (
    <div className="relative mt-4 flex gap-3 pt-2">
      <div className="relative flex-1">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="w-full rounded-xl border border-gold-primary/20 bg-white/60 px-4 py-2.5 text-xs font-bold tracking-wide text-text-secondary shadow-sm transition-all hover:bg-gold-surface/60"
        >
          <span className="flex items-center justify-center gap-2">
            <Download className="h-3.5 w-3.5" />
            Export
          </span>
        </button>

        {showExportMenu ? (
          <div className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-lg border border-gold-border/50 bg-white shadow-lg">
            <button onClick={handleExportCurrent} className="w-full border-b border-gold-border/20 px-4 py-2.5 text-left text-xs font-medium hover:bg-gold-surface">
              Current Verse
            </button>
            <button onClick={handleExportAll} className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-gold-surface">
              All Verses
            </button>
          </div>
        ) : null}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex-1 rounded-xl bg-gold-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-gold-muted disabled:opacity-70"
      >
        {isSaving ? 'Saving...' : 'Save Note'}
      </button>
    </div>
  );
}

export default ReflectionActions;
