import React from 'react';
import { Edit3, Menu, MessageSquareText, MoonStar, SunMedium } from 'lucide-react';
import { useUI } from '../context/UIContext';

function Header() {
  const ui = useUI() || {
    toggleSidebar: () => {},
    toggleRightPanel: () => {},
    toggleTheme: () => {},
    activeRightPanel: 'reflections',
    isDarkMode: false,
  };
  const nextPanelLabel = ui.activeRightPanel === 'reflections' ? 'Commentary' : 'Reflections';
  const NextPanelIcon = ui.activeRightPanel === 'reflections' ? MessageSquareText : Edit3;
  const ThemeIcon = ui.isDarkMode ? SunMedium : MoonStar;

  return (
    <header className="fixed left-0 top-0 z-[60] flex h-16 w-full items-center border-b border-sand-tertiary bg-white/80 px-4 backdrop-blur-md sm:px-8">
      <div className="flex flex-1 justify-start lg:hidden">
        <button
          onClick={ui.toggleSidebar}
          className="rounded-lg p-2 text-gold-primary transition-colors hover:bg-gold-surface"
          aria-label="Open chapter menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="pointer-events-auto flex flex-none items-center justify-center gap-3">
        <span className="text-[24px] text-gold-primary sm:text-[28px]">III</span>
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
          onClick={ui.toggleRightPanel}
          className="inline-flex items-center gap-2 rounded-full border border-gold-primary/20 bg-white/70 px-3 py-2 text-gold-primary transition-colors hover:bg-gold-surface dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light"
          aria-label={`Switch to ${nextPanelLabel}`}
        >
          <NextPanelIcon className="h-4 w-4" />
          <span className="hidden text-xs font-semibold tracking-wide sm:inline">{nextPanelLabel}</span>
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
    </header>
  );
}

export default Header;
