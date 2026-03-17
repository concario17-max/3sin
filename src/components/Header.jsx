import React from 'react';
import { Edit3, Menu } from 'lucide-react';
import { useUI } from '../context/UIContext';

function Header() {
  const ui = useUI() || {
    toggleSidebar: () => {},
    toggleReflections: () => {},
  };

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
        <span className="whitespace-nowrap font-serif text-[14px] font-bold uppercase tracking-[0.1em] text-charcoal-main sm:text-[17px] sm:tracking-[0.15em]">
          The Three Bodies
        </span>
      </div>

      <div className="flex flex-1 justify-end xl:hidden">
        <button
          onClick={ui.toggleReflections}
          className="rounded-lg p-2 text-gold-primary transition-colors hover:bg-gold-surface"
          aria-label="Open reflections"
        >
          <Edit3 className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

export default Header;
