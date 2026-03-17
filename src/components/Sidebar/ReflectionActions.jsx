import React from 'react';
import { Download } from 'lucide-react';

const ReflectionActions = ({ showExportMenu, setShowExportMenu, handleExportCurrent, handleExportAll, handleSave, isSaving }) => {
    return (
        <div className="flex gap-3 mt-4 relative pt-2">
            <div className="flex-1 relative">
                <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold-primary/20 dark:border-dark-border/60 text-text-secondary dark:text-dark-text-secondary hover:bg-gold-surface/60 dark:hover:bg-dark-bg transition-all text-xs font-bold bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm shadow-sm tracking-wide"
                >
                    <Download className="w-3.5 h-3.5" />
                    Export
                </button>

                {showExportMenu && (
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-[#111] border border-gold-border/50 dark:border-[#333] rounded-lg shadow-lg overflow-hidden z-20">
                        <button
                            onClick={handleExportCurrent}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-text-primary dark:text-dark-text-primary hover:bg-gold-surface dark:hover:bg-[#222] transition-colors border-b border-gold-border/20 dark:border-[#333]"
                        >
                            Current Verse
                        </button>
                        <button
                            onClick={handleExportAll}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-text-primary dark:text-dark-text-primary hover:bg-gold-surface dark:hover:bg-[#222] transition-colors"
                        >
                            All Verses
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-primary hover:bg-gold-muted text-white transition-all text-xs font-bold shadow-md hover:shadow-lg hover:shadow-gold-primary/20 active:scale-95 disabled:opacity-70"
            >
                {isSaving ? 'Saving...' : 'Save Note'}
            </button>
        </div>
    );
};

export default React.memo(ReflectionActions);
