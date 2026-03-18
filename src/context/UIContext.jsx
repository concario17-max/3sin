import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();
const THEME_STORAGE_KEY = 'three-body-theme';
const RIGHT_PANEL_STORAGE_KEY = 'three-body-right-panel';

function loadStoredTheme() {
    if (typeof window === 'undefined') return false;

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function loadStoredRightPanel() {
    if (typeof window === 'undefined') return 'reflections';
    const savedPanel = window.localStorage.getItem(RIGHT_PANEL_STORAGE_KEY);
    return savedPanel === 'commentary' ? 'commentary' : 'reflections';
}

export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window === 'undefined') return true;
        return window.innerWidth >= 1024;
    });
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
    const [activeRightPanel, setActiveRightPanel] = useState(loadStoredRightPanel);
    const [isDarkMode, setIsDarkMode] = useState(loadStoredTheme);
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);

    const toggleSidebar = React.useCallback(() => setIsSidebarOpen((prev) => !prev), []);
    const openRightPanel = React.useCallback((panel) => {
        setActiveRightPanel(panel);
        setIsRightPanelOpen(true);
    }, []);
    const closeRightPanel = React.useCallback(() => setIsRightPanelOpen(false), []);
    const toggleRightPanel = React.useCallback(() => {
        setActiveRightPanel((prev) => (prev === 'reflections' ? 'commentary' : 'reflections'));
        setIsRightPanelOpen(true);
    }, []);
    const toggleTheme = React.useCallback(() => setIsDarkMode((prev) => !prev), []);

    const closeAllDrawers = React.useCallback(() => {
        setIsSidebarOpen(false);
        setIsRightPanelOpen(false);
    }, []);

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    React.useEffect(() => {
        window.localStorage.setItem(RIGHT_PANEL_STORAGE_KEY, activeRightPanel);
    }, [activeRightPanel]);

    const isReflectionsOpen = isRightPanelOpen && activeRightPanel === 'reflections';
    const isCommentariesOpen = isRightPanelOpen && activeRightPanel === 'commentary';
    const setIsReflectionsOpen = React.useCallback((value) => {
        setActiveRightPanel('reflections');
        setIsRightPanelOpen(value);
    }, []);
    const setIsCommentariesOpen = React.useCallback((value) => {
        setActiveRightPanel('commentary');
        setIsRightPanelOpen(value);
    }, []);
    const toggleReflections = React.useCallback(() => {
        setActiveRightPanel('reflections');
        setIsRightPanelOpen((prev) => (activeRightPanel === 'reflections' ? !prev : true));
    }, [activeRightPanel]);

    const providerValue = React.useMemo(() => ({
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isRightPanelOpen,
        setIsRightPanelOpen,
        openRightPanel,
        closeRightPanel,
        toggleRightPanel,
        activeRightPanel,
        setActiveRightPanel,
        isDarkMode,
        toggleTheme,
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
    }), [
        isSidebarOpen,
        isRightPanelOpen,
        activeRightPanel,
        isDarkMode,
        isReflectionsOpen,
        isCompendiumOpen,
        isCommentariesOpen,
        isLexiconOpen,
        toggleSidebar,
        openRightPanel,
        closeRightPanel,
        toggleRightPanel,
        toggleTheme,
        toggleReflections,
        closeAllDrawers,
        setIsReflectionsOpen,
        setIsCommentariesOpen,
    ]);

    return (
        <UIContext.Provider value={providerValue}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
