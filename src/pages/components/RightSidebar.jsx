import React, { useState, useEffect } from 'react';
import { Edit3, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import NoteEditor from '../../components/Sidebar/NoteEditor';
import ReflectionActions from '../../components/Sidebar/ReflectionActions';

// 불변성과 기능적 분리 원칙 적용: LocalStorage 연동 Reflections 패널
const RightSidebar = ({ activeVerseId, storagePrefix = 'prayer' }) => {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const uiContext = useUI() || { isReflectionsOpen: true, setIsReflectionsOpen: () => { } };
    const { isReflectionsOpen, setIsReflectionsOpen } = uiContext;

    // activeVerseId를 기반으로 LocalStorage 키 생성
    const noteKey = `tibet-${storagePrefix}-note-${activeVerseId}`;

    // 구절이 바뀔 때마다 메모 로드
    useEffect(() => {
        if (!activeVerseId) return;
        const savedNote = localStorage.getItem(noteKey);
        setNote(savedNote || '');
    }, [activeVerseId, noteKey]);

    const handleSave = React.useCallback(() => {
        if (!activeVerseId) return;
        setIsSaving(true);
        localStorage.setItem(noteKey, note);
        // 저장 피드백을 위한 인위적 지연
        setTimeout(() => setIsSaving(false), 1000);
    }, [activeVerseId, noteKey, note]);

    const handleExportCurrent = React.useCallback(() => {
        if (!activeVerseId) return;
        const element = document.createElement("a");
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Tibet_Reflection_${activeVerseId}.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    }, [activeVerseId, note]);

    const handleExportAll = React.useCallback(() => {
        let allNotesText = `Tibet Prayers - All Reflections\n\n`;
        const noteKeys = Object.keys(localStorage).filter(key => key.startsWith(`tibet-${storagePrefix}-note-`));

        // 키 정렬 로직 (ID가 문자열이므로 문자열 비교 정렬)
        noteKeys.sort((a, b) => a.localeCompare(b));

        noteKeys.forEach(key => {
            const vId = key.replace(`tibet-${storagePrefix}-note-`, '');
            const content = localStorage.getItem(key);
            if (content && content.trim()) {
                allNotesText += `--- Verse ${vId} ---\n${content}\n\n`;
            }
        });

        if (allNotesText === `Tibet Prayers - All Reflections\n\n`) {
            alert("No saved reflections found to export.");
            setShowExportMenu(false);
            return;
        }

        const element = document.createElement("a");
        const file = new Blob([allNotesText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Tibet_All_Reflections.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    }, []);

    if (!activeVerseId) return null;

    return (
        <>
            {/* Mobile Backdrop */}
            {isReflectionsOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden transition-opacity duration-300"
                    onClick={() => setIsReflectionsOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 right-0 z-50 w-[90vw] sm:w-[400px] xl:w-80 bg-white/80 dark:bg-dark-bg/95 backdrop-blur-xl border-l border-gold-primary/20 dark:border-dark-border/50 h-full xl:h-[calc(100vh-64px)] xl:sticky xl:top-16 transform transition-transform duration-500 xl:translate-x-0 ${isReflectionsOpen ? 'translate-x-0 overflow-hidden shadow-2xl xl:shadow-none' : 'translate-x-full'} flex flex-col font-inter`}>

                {/* Mobile Close Button */}
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
