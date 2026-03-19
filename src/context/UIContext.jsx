import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();
const THEME_STORAGE_KEY = 'three-body-theme';
const isDesktopLayout = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches;

function loadStoredTheme() {
    if (typeof window === 'undefined') return false;

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktopLayout);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(isDesktopLayout);
    const [isDarkMode, setIsDarkMode] = useState(loadStoredTheme);
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);

    const toggleSidebar = React.useCallback(() => setIsSidebarOpen((prev) => !prev), []);
    const openRightPanel = React.useCallback(() => setIsRightPanelOpen(true), []);
    const closeRightPanel = React.useCallback(() => setIsRightPanelOpen(false), []);
    const toggleCommentary = React.useCallback(() => setIsRightPanelOpen((prev) => !prev), []);
    const toggleTheme = React.useCallback(() => setIsDarkMode((prev) => !prev), []);

    const closeAllDrawers = React.useCallback(() => {
        setIsSidebarOpen(false);
        setIsRightPanelOpen(false);
    }, []);

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const providerValue = React.useMemo(() => ({
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isRightPanelOpen,
        setIsRightPanelOpen,
        openRightPanel,
        closeRightPanel,
        toggleCommentary,
        isDarkMode,
        toggleTheme,
        isCompendiumOpen,
        setIsCompendiumOpen,
        isLexiconOpen,
        setIsLexiconOpen,
        closeAllDrawers,
    }), [
        isSidebarOpen,
        isRightPanelOpen,
        isDarkMode,
        isCompendiumOpen,
        isLexiconOpen,
        toggleSidebar,
        openRightPanel,
        closeRightPanel,
        toggleCommentary,
        toggleTheme,
        closeAllDrawers,
    ]);

    return (
        <UIContext.Provider value={providerValue}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
