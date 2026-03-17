import React from 'react';
import { useUI } from '../../context/UIContext';
import SidebarHeader from '../../components/Sidebar/SidebarHeader';
import SidebarChapterList from '../../components/Sidebar/SidebarChapterList';
import SidebarVerseList from '../../components/Sidebar/SidebarVerseList';

function LeftSidebar({ prayers, onSelectVerse, activeVerseId }) {
  const ui = useUI() || { isSidebarOpen: true, setIsSidebarOpen: () => {} };
  const { isSidebarOpen, setIsSidebarOpen } = ui;

  const verseGlobalIndices = React.useMemo(() => {
    const map = {};
    let count = 1;
    prayers.forEach((chapter) => {
      chapter.verses.forEach((verse) => {
        map[verse.id] = count++;
      });
    });
    return map;
  }, [prayers]);

  const [expandedChapter, setExpandedChapter] = React.useState(() => {
    const found = prayers.find((chapter) => chapter.verses.some((verse) => verse.id === activeVerseId));
    return found?.id ?? prayers[0]?.id ?? null;
  });

  React.useEffect(() => {
    const found = prayers.find((chapter) => chapter.verses.some((verse) => verse.id === activeVerseId));
    if (found?.id) setExpandedChapter(found.id);
  }, [activeVerseId, prayers]);

  const toggleChapter = React.useCallback((chapterId) => {
    setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
  }, []);

  return (
    <>
      {isSidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-80 flex-col border-r border-gold-primary/20 bg-white/80 font-inter backdrop-blur-xl transition-transform duration-500 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : '-translate-x-full'
        }`}
      >
        <SidebarHeader setIsSidebarOpen={setIsSidebarOpen} />
        <SidebarChapterList
          prayers={prayers}
          expandedChapter={expandedChapter}
          toggleChapter={toggleChapter}
          onSelectVerse={onSelectVerse}
        />
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
}

export default LeftSidebar;
