import React from 'react';
import { X } from 'lucide-react';

const SidebarHeader = ({ setIsSidebarOpen }) => {
    return (
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gold-border/30 dark:border-[#333] shrink-0">
            <span className="font-crimson font-bold text-lg text-text-primary dark:text-dark-text-primary">챕터 목록</span>
            <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default React.memo(SidebarHeader);
