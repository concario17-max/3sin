import React from 'react';
import { X } from 'lucide-react';

function SidebarHeader({ setIsSidebarOpen }) {
  return (
    <div className="flex items-center justify-between border-b border-gold-border/30 p-4 lg:hidden">
      <span className="font-crimson text-lg font-bold text-text-primary">챕터 목록</span>
      <button onClick={() => setIsSidebarOpen(false)} className="rounded-full p-2 hover:bg-gold-surface">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export default SidebarHeader;
