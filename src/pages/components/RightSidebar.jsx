import React from 'react';
import { Edit3, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import NoteEditor from '../../components/Sidebar/NoteEditor';
import ReflectionActions from '../../components/Sidebar/ReflectionActions';

function RightSidebar({ activeVerseId }) {
  const [note, setNote] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const ui = useUI() || { isReflectionsOpen: true, setIsReflectionsOpen: () => {} };
  const { isReflectionsOpen, setIsReflectionsOpen } = ui;
  const noteKey = `three-body-note-${activeVerseId}`;

  React.useEffect(() => {
    if (!activeVerseId) return;
    setNote(localStorage.getItem(noteKey) || '');
  }, [activeVerseId, noteKey]);

  const handleSave = React.useCallback(() => {
    localStorage.setItem(noteKey, note);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 900);
  }, [note, noteKey]);

  const downloadBlob = (name, content) => {
    const file = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = name;
    link.click();
  };

  return (
    <>
      {isReflectionsOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
          onClick={() => setIsReflectionsOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-[90vw] flex-col border-l border-gold-primary/20 bg-white/80 font-inter backdrop-blur-xl transition-transform duration-500 sm:w-[400px] xl:sticky xl:top-0 xl:h-screen xl:w-80 xl:translate-x-0 ${
          isReflectionsOpen ? 'translate-x-0 overflow-hidden shadow-2xl xl:shadow-none' : 'translate-x-full'
        }`}
      >
        <div className="absolute right-4 top-4 z-50 xl:hidden">
          <button onClick={() => setIsReflectionsOpen(false)} className="rounded-full p-2 hover:bg-gold-surface">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex h-full min-h-0 flex-col p-6">
          <div className="mb-6 flex shrink-0 items-center gap-2 border-b border-gold-border/30 pb-4">
            <Edit3 className="h-5 w-5 text-gold-primary" />
            <h2 className="text-sm font-bold tracking-wide text-text-primary">Reflections</h2>
          </div>

          <NoteEditor activeVerseId={activeVerseId} note={note} setNote={setNote} />
          <ReflectionActions
            showExportMenu={showExportMenu}
            setShowExportMenu={setShowExportMenu}
            handleExportCurrent={() => {
              downloadBlob(`3SIN_Reflection_${activeVerseId}.txt`, note);
              setShowExportMenu(false);
            }}
            handleExportAll={() => {
              const content = Object.keys(localStorage)
                .filter((key) => key.startsWith('three-body-note-'))
                .sort()
                .map((key) => `--- ${key.replace('three-body-note-', '')} ---\n${localStorage.getItem(key) || ''}`)
                .join('\n\n');
              downloadBlob('3SIN_All_Reflections.txt', content);
              setShowExportMenu(false);
            }}
            handleSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </aside>
    </>
  );
}

export default RightSidebar;
