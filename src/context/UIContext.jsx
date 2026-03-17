import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // 사이드바 상태를 제어하는 내부 State (불변성 유지)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // 리플렉션(우측 패널) 상태 제어
    const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);
    // 컴펜디움(안내서) 모달 상태 제어
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    // 코멘터리 모달 상태 제어
    const [isCommentariesOpen, setIsCommentariesOpen] = useState(false);
    // 렉시콘 모달 상태 제어
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);

    // 글로벌 구절(Sutra) 정보 공유 스테이트 (localStorage 기반 영속성 추가)
    const [activeVerse, setActiveVerse] = useState(() => {
        try {
            const saved = localStorage.getItem('tibet_active_verse');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    // activeVerse 변경 시 localStorage 동기화
    React.useEffect(() => {
        if (activeVerse === undefined) return;
        localStorage.setItem('tibet_active_verse', JSON.stringify(activeVerse));
    }, [activeVerse]);

    // 각 패널을 토글하는 불변성 기반 함수들 (재생성 방지)
    const toggleSidebar = React.useCallback(() => setIsSidebarOpen(prev => !prev), []);
    const toggleReflections = React.useCallback(() => setIsReflectionsOpen(prev => !prev), []);

    // 강제 종료 함수 (재생성 방지)
    const closeAllDrawers = React.useCallback(() => {
        setIsSidebarOpen(false);
        setIsReflectionsOpen(false);
    }, []);

    // Provider Value 메모이제이션
    const providerValue = React.useMemo(() => ({
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isReflectionsOpen,
        setIsReflectionsOpen,
        isCompendiumOpen,
        setIsCompendiumOpen,
        isCommentariesOpen,
        setIsCommentariesOpen,
        isLexiconOpen,
        setIsLexiconOpen,
        toggleReflections,
        closeAllDrawers,
        activeVerse,
        setActiveVerse
    }), [isSidebarOpen, isReflectionsOpen, isCompendiumOpen, isCommentariesOpen, isLexiconOpen, toggleSidebar, toggleReflections, closeAllDrawers, activeVerse]);

    return (
        <UIContext.Provider value={providerValue}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
