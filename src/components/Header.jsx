import React from 'react';
import { BookOpenText, Menu, MessageSquareText, MoonStar, SunMedium } from 'lucide-react';
import { useUI } from '../context/UIContext';

function Header() {
  const ui = useUI() || {
    toggleSidebar: () => {},
    toggleCommentary: () => {},
    toggleTheme: () => {},
    isDarkMode: false,
    isRightPanelOpen: false,
    isSidebarOpen: true,
  };
  const ThemeIcon = ui.isDarkMode ? SunMedium : MoonStar;

  return (
    <header className="fixed left-0 top-0 z-[60] h-16 w-full border-b border-sand-tertiary bg-white/80 backdrop-blur-md">
      <div className="flex h-full w-full items-center px-4 sm:px-8 xl:ml-[var(--desktop-left-sidebar-width)] xl:mr-[var(--desktop-right-sidebar-width)] xl:w-auto xl:px-8">
        <div className="flex flex-1 justify-start">
          <button
            onClick={ui.toggleSidebar}
            className="rounded-lg p-2 text-gold-primary transition-colors hover:bg-gold-surface"
            aria-label={ui.isSidebarOpen ? 'Hide chapter menu' : 'Show chapter menu'}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="pointer-events-auto flex flex-none items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-primary/20 bg-white/70 text-gold-primary dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light">
            <BookOpenText className="h-5 w-5" />
          </span>
          <div className="flex flex-col items-center leading-none">
            <span className="font-serif text-[13px] font-bold tracking-[0.03em] text-charcoal-main sm:text-[16px]">
              밀교의 성불 원리
            </span>
            <span className="font-serif text-[10px] tracking-[0.08em] text-gold-primary/80 sm:text-[11px]">
              因位三身行相明燈論
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <button
            onClick={ui.toggleCommentary}
            className="inline-flex items-center gap-2 rounded-full border border-gold-primary/20 bg-white/70 px-3 py-2 text-gold-primary transition-colors hover:bg-gold-surface dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light"
            aria-label={ui.isRightPanelOpen ? 'Hide commentary' : 'Show commentary'}
          >
            <MessageSquareText className="h-4 w-4" />
            <span className="hidden text-xs font-semibold tracking-wide sm:inline">
              {ui.isRightPanelOpen ? 'Hide Commentary' : 'Commentary'}
            </span>
          </button>

          <button
            onClick={ui.toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-gold-primary/20 bg-white/70 px-3 py-2 text-gold-primary transition-colors hover:bg-gold-surface dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light"
            aria-label={ui.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <ThemeIcon className="h-4 w-4" />
            <span className="hidden text-xs font-semibold tracking-wide sm:inline">
              {ui.isDarkMode ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
