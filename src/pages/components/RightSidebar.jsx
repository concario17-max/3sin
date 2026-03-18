import React, { useState, useEffect } from 'react';
import { Edit3, MessageSquareText, X } from 'lucide-react';
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

function CommentaryPanel({ activeParagraph }) {
    const englishText = activeParagraph?.text?.english || 'No English rendering is available for this paragraph.';
    const koreanText = activeParagraph?.text?.korean || 'No Korean rendering is available for this paragraph.';
    const tibetanText = activeParagraph?.text?.tibetan || 'No Tibetan source line is available for this paragraph.';

    return (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
            <section className="rounded-[1.5rem] border border-gold-border/25 bg-white/65 p-5 shadow-sm dark:border-dark-border/60 dark:bg-dark-surface/55">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
                    Reading Lens
                </p>
                <h3 className="mt-3 text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                    {activeParagraph?.chapterTitle || 'Commentary'}
                </h3>
                <p className="mt-3 font-korean text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary">
                    Paragraph {activeParagraph?.id || '-'}를 읽을 때 티베트 원문, 영어 역문, 한국어 번역을 나란히 두고 의미의 결을 비교해 보세요. 이 패널은 본문을 곁에서 읽는 보조 해설 창으로 동작합니다.
                </p>
            </section>

            <section className="rounded-[1.5rem] border border-gold-border/20 bg-gold-surface/45 p-5 dark:border-dark-border/60 dark:bg-dark-bg/30">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
                    Tibetan Anchor
                </p>
                <p className="mt-3 font-noto text-[14px] leading-7 text-text-primary dark:text-dark-text-primary">
                    {tibetanText}
                </p>
            </section>

            <section className="rounded-[1.5rem] border border-gold-border/20 bg-white/60 p-5 dark:border-dark-border/60 dark:bg-dark-surface/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
                    English Reference
                </p>
                <p className="mt-3 font-serif text-[15px] leading-7 text-text-primary dark:text-dark-text-primary">
                    {englishText}
                </p>
            </section>

            <section className="rounded-[1.5rem] border border-gold-border/20 bg-white/60 p-5 dark:border-dark-border/60 dark:bg-dark-surface/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
                    Korean Reference
                </p>
                <p className="mt-3 font-korean text-[14px] leading-7 text-text-primary dark:text-dark-text-primary">
                    {koreanText}
                </p>
            </section>
        </div>
    );
}

const RightSidebar = ({
    activeVerseId,
    activeParagraph,
    storagePrefix = 'prayer',
    chapterSidebarOpen = true,
    expandToDoubleWidthWhenChapterSidebarClosed = false,
}) => {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const uiContext = useUI() || {
        activeRightPanel: 'reflections',
        isRightPanelOpen: true,
        closeRightPanel: () => { },
    };
    const {
        activeRightPanel,
        isRightPanelOpen,
        closeRightPanel,
    } = uiContext;
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
            {isRightPanelOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden transition-opacity duration-300"
                    onClick={closeRightPanel}
                />
            )}

            <aside className={`fixed inset-y-0 right-0 top-16 z-50 w-[90vw] sm:w-[400px] ${desktopWidthClassName} bg-white/80 dark:bg-dark-bg/95 backdrop-blur-xl border-l border-gold-primary/20 dark:border-dark-border/50 h-[calc(100vh-64px)] xl:sticky xl:top-16 transform transition-transform duration-500 xl:translate-x-0 ${isRightPanelOpen ? 'translate-x-0 overflow-hidden shadow-2xl xl:shadow-none' : 'translate-x-full'} flex flex-col font-inter`}>
                <div className="xl:hidden absolute top-4 right-4 z-50">
                    <button onClick={closeRightPanel} className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 relative flex flex-col h-full min-h-0">
                    <div className="flex items-center gap-2 mb-6 shrink-0 border-b border-gold-border/30 pb-4">
                        {activeRightPanel === 'commentary' ? (
                            <MessageSquareText className="w-5 h-5 text-[#A68B5C] dark:text-gold-light" />
                        ) : (
                            <Edit3 className="w-5 h-5 text-[#A68B5C] dark:text-gold-light" />
                        )}
                        <h2 className="text-sm font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide">
                            {activeRightPanel === 'commentary' ? 'Commentary' : 'Reflections'}
                        </h2>
                    </div>

                    {activeRightPanel === 'commentary' ? (
                        <CommentaryPanel activeParagraph={activeParagraph} />
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </aside>
        </>
    );
};

export default React.memo(RightSidebar, (prevProps, nextProps) => prevProps.activeVerseId === nextProps.activeVerseId);
