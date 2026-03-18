import React, { useState, useEffect } from 'react';
import { Edit3, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import NoteEditor from '../../components/Sidebar/NoteEditor';
import ReflectionActions from '../../components/Sidebar/ReflectionActions';

const NOTE_STORAGE_KEY_PREFIX = 'three-body-note';

function getNoteKey(activeVerseId) {
    return `${NOTE_STORAGE_KEY_PREFIX}-${activeVerseId}`;
}

function getLegacyNoteKey(activeVerseId, storagePrefix) {
    return `tibet-${storagePrefix}-note-${activeVerseId}`;
}

function loadStoredNote(activeVerseId, storagePrefix) {
    const nextKey = getNoteKey(activeVerseId);
    const legacyKey = getLegacyNoteKey(activeVerseId, storagePrefix);
    return localStorage.getItem(nextKey) ?? localStorage.getItem(legacyKey) ?? '';
}

const RightSidebar = ({
    activeVerseId,
    storagePrefix = 'prayer',
    chapterSidebarOpen = true,
    expandToDoubleWidthWhenChapterSidebarClosed = false,
}) => {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const uiContext = useUI() || { isReflectionsOpen: true, setIsReflectionsOpen: () => { } };
    const { isReflectionsOpen, setIsReflectionsOpen } = uiContext;
    const desktopWidthClassName = expandToDoubleWidthWhenChapterSidebarClosed && !chapterSidebarOpen
        ? 'xl:w-[800px]'
        : 'xl:w-[400px]';

    const noteKey = getNoteKey(activeVerseId);

    useEffect(() => {
        if (!activeVerseId) return;
        setNote(loadStoredNote(activeVerseId, storagePrefix));
    }, [activeVerseId, noteKey, storagePrefix]);

    const handleSave = React.useCallback(() => {
        if (!activeVerseId) return;
        setIsSaving(true);
        localStorage.setItem(noteKey, note);
        setTimeout(() => setIsSaving(false), 1000);
    }, [activeVerseId, noteKey, note]);

    const handleExportCurrent = React.useCallback(() => {
        if (!activeVerseId) return;
        const element = document.createElement("a");
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `ThreeBody_Reflection_${activeVerseId}.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    }, [activeVerseId, note]);

    const handleExportAll = React.useCallback(() => {
        let allNotesText = `Three Bodies - All Reflections\n\n`;
        const normalizedNotes = new Map();
        const legacyPrefix = `tibet-${storagePrefix}-note-`;

        Object.keys(localStorage)
            .filter((key) => key.startsWith(legacyPrefix))
            .sort((a, b) => a.localeCompare(b))
            .forEach((key) => {
                const verseId = key.replace(legacyPrefix, '');
                const content = localStorage.getItem(key);
                if (content && content.trim()) {
                    normalizedNotes.set(verseId, content);
                }
            });

        Object.keys(localStorage)
            .filter((key) => key.startsWith(`${NOTE_STORAGE_KEY_PREFIX}-`))
            .sort((a, b) => a.localeCompare(b))
            .forEach((key) => {
                const verseId = key.replace(`${NOTE_STORAGE_KEY_PREFIX}-`, '');
                const content = localStorage.getItem(key);
                if (content && content.trim()) {
                    normalizedNotes.set(verseId, content);
                }
            });

        normalizedNotes.forEach((content, verseId) => {
            allNotesText += `--- Paragraph ${verseId} ---\n${content}\n\n`;
        });

        if (allNotesText === `Three Bodies - All Reflections\n\n`) {
            alert("No saved reflections found to export.");
            setShowExportMenu(false);
            return;
        }

        const element = document.createElement("a");
        const file = new Blob([allNotesText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `ThreeBody_All_Reflections.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    }, [storagePrefix]);

    if (!activeVerseId) return null;

    return (
        <>
            {isReflectionsOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden transition-opacity duration-300"
                    onClick={() => setIsReflectionsOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 right-0 top-16 z-50 w-[90vw] sm:w-[400px] ${desktopWidthClassName} bg-white/80 dark:bg-dark-bg/95 backdrop-blur-xl border-l border-gold-primary/20 dark:border-dark-border/50 h-[calc(100vh-64px)] xl:sticky xl:top-16 transform transition-transform duration-500 xl:translate-x-0 ${isReflectionsOpen ? 'translate-x-0 overflow-hidden shadow-2xl xl:shadow-none' : 'translate-x-full'} flex flex-col font-inter`}>
                <div className="xl:hidden absolute top-4 right-4 z-50">
                    <button onClick={() => setIsReflectionsOpen(false)} className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 relative flex flex-col h-full min-h-0">
                    <div className="flex items-center gap-2 mb-6 shrink-0 border-b border-gold-border/30 pb-4">
                        <Edit3 className="w-5 h-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide">Reflections</h2>
                    </div>

                    <NoteEditor
                        activeVerseId={activeVerseId}
                        note={note}
                        setNote={setNote}
                    />

                    <ReflectionActions
                        showExportMenu={showExportMenu}
                        setShowExportMenu={setShowExportMenu}
                        handleExportCurrent={handleExportCurrent}
                        handleExportAll={handleExportAll}
                        handleSave={handleSave}
                        isSaving={isSaving}
                    />
                </div>
            </aside>
        </>
    );
};

export default React.memo(RightSidebar, (prevProps, nextProps) => prevProps.activeVerseId === nextProps.activeVerseId);
