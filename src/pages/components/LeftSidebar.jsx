import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import SidebarHeader from '../../components/Sidebar/SidebarHeader';
import SidebarChapterList from '../../components/Sidebar/SidebarChapterList';
import SidebarVerseList from '../../components/Sidebar/SidebarVerseList';

// Gita의 디자인 철학(Awwwards급)을 Tibet 프로젝트에 맞게 변환
const LeftSidebar = ({ prayers, onSelectVerse, activeVerseId, isPrayerPage = false }) => {
    // 만약 useUI가 App 최상단에 Provider로 안 감싸져 있다면 에러가 나므로, 
    // 실제 통합 전까지는 UIContext를 우선 임시로 써도 되지만, 에러 방지를 위해 optional chaining 처리.
    // 하지만 Zero Monolith & 강제 Immutability 원칙에 따라 UIContext는 외부에서 반드시 주입됨.
    const uiContext = useUI() || { isSidebarOpen: true, setIsSidebarOpen: () => { } };
    const { isSidebarOpen, setIsSidebarOpen } = uiContext;

    // 전역 구절 인덱스 맵 생성 (isPrayerPage가 true면 챕터별로 1부터 시작)
    const verseGlobalIndices = React.useMemo(() => {
        const map = {};
        let count = 1;
        prayers?.forEach(p => {
            if (isPrayerPage) count = 1; // 챕터 시작 시 초기화

            if (p.isGroup && p.subchapters) {
                p.subchapters.forEach(s => {
                    if (isPrayerPage) count = 1; // 소제목(Subchapter) 시작 시에도 초기화
                    s.verses?.forEach(v => {
                        map[v.id] = count++;
                    });
                });
            } else {
                p.verses?.forEach(v => {
                    map[v.id] = count++;
                });
            }
        });
        return map;
    }, [prayers, isPrayerPage]);

    // activeVerseId를 기반으로 초기 확장 챕터 설정 (새로고침 대응, 고유 키 사용)
    const [expandedChapter, setExpandedChapter] = useState(() => {
        if (!activeVerseId || !prayers) return null;
        for (const prayer of prayers) {
            if (prayer.isGroup && prayer.subchapters) {
                const sub = prayer.subchapters.find(s => s.verses?.some(v => v.id === activeVerseId));
                if (sub) return `${prayer.id}-${sub.id}`;
            } else if (prayer.verses?.some(v => v.id === activeVerseId)) {
                return prayer.id;
            }
        }
        return null;
    });

    // 외부에서 구절이 변경될 때(네비게이션 등) 해당 챕터를 자동으로 확장
    React.useEffect(() => {
        if (!activeVerseId || !prayers) return;

        let targetChapterId = null;
        for (const prayer of prayers) {
            if (prayer.isGroup && prayer.subchapters) {
                const sub = prayer.subchapters.find(s => s.verses?.some(v => v.id === activeVerseId));
                if (sub) {
                    targetChapterId = `${prayer.id}-${sub.id}`;
                    break;
                }
            } else if (prayer.verses?.some(v => v.id === activeVerseId)) {
                targetChapterId = prayer.id;
                break;
            }
        }

        if (targetChapterId && targetChapterId !== expandedChapter) {
            setExpandedChapter(targetChapterId);
        }
    }, [activeVerseId, prayers]);

    // 챕터 토글 핸들러 (재생성 방지)
    const toggleChapter = React.useCallback((chapterId) => {
        setExpandedChapter(prev => prev === chapterId ? null : chapterId);
    }, []);

    return (
        <>
            {/* 모바일 배경 (반투명 블러 처리) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 opacity-100"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 top-16 z-50 w-80 bg-white/80 dark:bg-dark-bg/95 backdrop-blur-xl border-r border-gold-primary/20 dark:border-dark-border/50 h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : '-translate-x-full'} flex flex-col font-inter`}>

                {/* 모바일 닫기 버튼 및 헤더 */}
                <SidebarHeader setIsSidebarOpen={setIsSidebarOpen} />

                {/* 상단: 챕터 목록 */}
                <SidebarChapterList
                    prayers={prayers}
                    expandedChapter={expandedChapter}
                    toggleChapter={toggleChapter}
                    onSelectVerse={onSelectVerse}
                />

                {/* 하단: 구절(Verse) 목록 - 챕터가 선택되었을 때만 렌더링 (메타 디자인) */}
                <SidebarVerseList
                    prayers={prayers}
                    expandedChapter={expandedChapter}
                    activeVerseId={activeVerseId}
                    verseGlobalIndices={verseGlobalIndices}
                    onSelectVerse={onSelectVerse}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </aside>
        </>
    );
};

export default React.memo(LeftSidebar, (prevProps, nextProps) => {
    return (
        prevProps.activeVerseId === nextProps.activeVerseId &&
        prevProps.prayers === nextProps.prayers
    );
});
