import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();
const THEME_STORAGE_KEY = 'three-body-theme';
const DESKTOP_QUERY = '(min-width: 1280px)';
const DESKTOP_SIDEBAR_STORAGE_KEY = 'three-body-desktop-sidebar';
const DESKTOP_RIGHT_PANEL_STORAGE_KEY = 'three-body-desktop-right-panel';

const isDesktopLayout = () =>
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;

function loadStoredTheme() {
  if (typeof window === 'undefined') return false;

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function loadStoredDesktopSidebar() {
  if (typeof window === 'undefined') return true;

  const savedState = window.localStorage.getItem(DESKTOP_SIDEBAR_STORAGE_KEY);
  return savedState === null ? true : JSON.parse(savedState);
}

function loadStoredDesktopRightPanel() {
  if (typeof window === 'undefined') return 'commentary';

  const savedState = window.localStorage.getItem(DESKTOP_RIGHT_PANEL_STORAGE_KEY);
  return savedState === null ? 'commentary' : JSON.parse(savedState);
}

export const UIProvider = ({ children }) => {
  const [isDesktopViewport, setIsDesktopViewport] = useState(isDesktopLayout);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState(null);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(loadStoredDesktopSidebar);
  const [activeDesktopRightPanel, setActiveDesktopRightPanel] = useState(loadStoredDesktopRightPanel);
  const [isDarkMode, setIsDarkMode] = useState(loadStoredTheme);
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
  const [isLexiconOpen, setIsLexiconOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQueryList = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event) => {
      setIsDesktopViewport(event.matches);

      if (event.matches) {
        setIsSidebarOpen(false);
        setActiveRightPanel(null);
      }
    };

    handleChange(mediaQueryList);
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isDesktopViewport) {
      setIsDesktopSidebarOpen((prev) => {
        const next = !prev;
        window.localStorage.setItem(DESKTOP_SIDEBAR_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return;
    }

    setIsSidebarOpen((prev) => !prev);
  }, [isDesktopViewport]);

  const toggleRightPanel = React.useCallback(
    (panel = 'commentary') => {
      if (isDesktopViewport) {
        setActiveDesktopRightPanel((prev) => {
          const next = prev === panel ? null : panel;
          window.localStorage.setItem(DESKTOP_RIGHT_PANEL_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
        return;
      }

      setActiveRightPanel((prev) => (prev === panel ? null : panel));
    },
    [isDesktopViewport],
  );

  const openRightPanel = React.useCallback(() => {
    if (isDesktopViewport) {
      setActiveDesktopRightPanel('commentary');
      window.localStorage.setItem(DESKTOP_RIGHT_PANEL_STORAGE_KEY, JSON.stringify('commentary'));
      return;
    }

    setActiveRightPanel('commentary');
  }, [isDesktopViewport]);

  const closeRightPanel = React.useCallback(() => {
    if (isDesktopViewport) {
      setActiveDesktopRightPanel(null);
      window.localStorage.setItem(DESKTOP_RIGHT_PANEL_STORAGE_KEY, JSON.stringify(null));
      return;
    }

    setActiveRightPanel(null);
  }, [isDesktopViewport]);

  const toggleCommentary = React.useCallback(() => {
    toggleRightPanel('commentary');
  }, [toggleRightPanel]);

  const toggleTheme = React.useCallback(() => setIsDarkMode((prev) => !prev), []);

  const closeAllDrawers = React.useCallback(() => {
    setIsSidebarOpen(false);
    setActiveRightPanel(null);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const isRightPanelOpen = isDesktopViewport
    ? activeDesktopRightPanel === 'commentary'
    : activeRightPanel === 'commentary';

  const providerValue = React.useMemo(
    () => ({
      isDesktopViewport,
      isSidebarOpen,
      setIsSidebarOpen,
      isDesktopSidebarOpen,
      setIsDesktopSidebarOpen,
      toggleSidebar,
      activeRightPanel,
      setActiveRightPanel,
      activeDesktopRightPanel,
      setActiveDesktopRightPanel,
      isRightPanelOpen,
      openRightPanel,
      closeRightPanel,
      toggleRightPanel,
      toggleCommentary,
      isDarkMode,
      toggleTheme,
      isCompendiumOpen,
      setIsCompendiumOpen,
      isLexiconOpen,
      setIsLexiconOpen,
      closeAllDrawers,
    }),
    [
      isDesktopViewport,
      isSidebarOpen,
      isDesktopSidebarOpen,
      activeRightPanel,
      activeDesktopRightPanel,
      isRightPanelOpen,
      isDarkMode,
      isCompendiumOpen,
      isLexiconOpen,
      toggleSidebar,
      openRightPanel,
      closeRightPanel,
      toggleRightPanel,
      toggleCommentary,
      toggleTheme,
      closeAllDrawers,
    ],
  );

  return <UIContext.Provider value={providerValue}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);
