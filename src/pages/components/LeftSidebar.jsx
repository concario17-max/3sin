import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import SidebarHeader from '../../components/Sidebar/SidebarHeader';
import SidebarChapterList from '../../components/Sidebar/SidebarChapterList';
import SidebarVerseList from '../../components/Sidebar/SidebarVerseList';

const LeftSidebar = ({ chapters, onSelectParagraph, activeParagraphId, isPrayerPage = false }) => {
    const uiContext = useUI() || { isSidebarOpen: true, setIsSidebarOpen: () => { } };
    const { isSidebarOpen, setIsSidebarOpen } = uiContext;

    const paragraphIndices = React.useMemo(() => {
        const map = {};
        let count = 1;

        chapters?.forEach((chapter) => {
            if (isPrayerPage) count = 1;

            if (chapter.isGroup && chapter.subchapters) {
                chapter.subchapters.forEach((subchapter) => {
                    if (isPrayerPage) count = 1;
                    subchapter.paragraphs?.forEach((paragraph) => {
                        map[paragraph.id] = count++;
                    });
                });
            } else {
                chapter.paragraphs?.forEach((paragraph) => {
                    map[paragraph.id] = count++;
                });
            }
        });

        return map;
    }, [chapters, isPrayerPage]);

    const [expandedChapter, setExpandedChapter] = useState(() => {
        if (!activeParagraphId || !chapters) return null;

        for (const chapter of chapters) {
            if (chapter.isGroup && chapter.subchapters) {
                const subchapter = chapter.subchapters.find((item) => item.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId));
                if (subchapter) return `${chapter.id}-${subchapter.id}`;
            } else if (chapter.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId)) {
                return chapter.id;
            }
        }

        return null;
    });

    React.useEffect(() => {
        if (!activeParagraphId || !chapters) return;

        let targetChapterId = null;
        for (const chapter of chapters) {
            if (chapter.isGroup && chapter.subchapters) {
                const subchapter = chapter.subchapters.find((item) => item.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId));
                if (subchapter) {
                    targetChapterId = `${chapter.id}-${subchapter.id}`;
                    break;
                }
            } else if (chapter.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId)) {
                targetChapterId = chapter.id;
                break;
            }
        }

        if (targetChapterId && targetChapterId !== expandedChapter) {
            setExpandedChapter(targetChapterId);
        }
    }, [activeParagraphId, chapters, expandedChapter]);

    const toggleChapter = React.useCallback((chapterId) => {
        setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
    }, []);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 opacity-100"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 top-16 z-50 w-80 lg:w-[400px] bg-white/80 dark:bg-dark-bg/95 backdrop-blur-xl border-r border-gold-primary/20 dark:border-dark-border/50 h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : '-translate-x-full'} flex flex-col font-inter`}>
                <SidebarHeader setIsSidebarOpen={setIsSidebarOpen} />

                <SidebarChapterList
                    chapters={chapters}
                    expandedChapter={expandedChapter}
                    toggleChapter={toggleChapter}
                    onSelectParagraph={onSelectParagraph}
                />

                <SidebarVerseList
                    chapters={chapters}
                    expandedChapter={expandedChapter}
                    activeParagraphId={activeParagraphId}
                    paragraphIndices={paragraphIndices}
                    onSelectParagraph={onSelectParagraph}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </aside>
        </>
    );
};

export default React.memo(LeftSidebar, (prevProps, nextProps) => {
    return (
        prevProps.activeParagraphId === nextProps.activeParagraphId &&
        prevProps.chapters === nextProps.chapters
    );
});
