import React from 'react';
import { MessageSquareText, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

function CommentaryPanel({ activeParagraph }) {
    const englishText = activeParagraph?.text?.english || 'No English rendering is available for this paragraph.';
    const koreanText = activeParagraph?.text?.korean || 'No Korean rendering is available for this paragraph.';
    const tibetanText = activeParagraph?.text?.tibetan || 'No Tibetan source line is available for this paragraph.';

    return (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
            <section className="rounded-[1.5rem] border border-gold-border/25 bg-white/65 p-5 shadow-sm dark:border-dark-border/60 dark:bg-dark-surface/55">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
                    Reading Lens
                </p>
                <h3 className="mt-3 text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                    {activeParagraph?.chapterTitle || 'Commentary'}
                </h3>
                <p className="mt-3 font-korean text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary">
                    Paragraph {activeParagraph?.id || '-'}를 읽을 때 티베트 원문, 영어 역문, 한국어 번역을 나란히 두고 의미의 결을 비교해 보세요. 이 패널은 본문을 곁에서 읽는 해설 창으로 동작합니다.
                </p>
            </section>

            <section className="rounded-[1.5rem] border border-gold-border/20 bg-gold-surface/45 p-5 dark:border-dark-border/60 dark:bg-dark-bg/30">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
                    Tibetan Anchor
                </p>
                <p className="mt-3 font-noto text-[14px] leading-7 text-text-primary dark:text-dark-text-primary">
                    {tibetanText}
                </p>
            </section>

            <section className="rounded-[1.5rem] border border-gold-border/20 bg-white/60 p-5 dark:border-dark-border/60 dark:bg-dark-surface/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
                    English Reference
                </p>
                <p className="mt-3 font-korean text-[14px] leading-7 tracking-[-0.01em] text-text-primary dark:text-dark-text-primary">
                    {englishText}
                </p>
            </section>

            <section className="rounded-[1.5rem] border border-gold-border/20 bg-white/60 p-5 dark:border-dark-border/60 dark:bg-dark-surface/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
                    Korean Reference
                </p>
                <p className="mt-3 font-korean text-[14px] leading-7 text-text-primary dark:text-dark-text-primary">
                    {koreanText}
                </p>
            </section>
        </div>
    );
}

const RightSidebar = ({
    activeParagraph,
    chapterSidebarOpen = true,
    expandToDoubleWidthWhenChapterSidebarClosed = false,
}) => {
    const uiContext = useUI() || {
        isRightPanelOpen: true,
        closeRightPanel: () => { },
    };
    const { isRightPanelOpen, closeRightPanel } = uiContext;
    const desktopWidthClassName = expandToDoubleWidthWhenChapterSidebarClosed && !chapterSidebarOpen
        ? 'xl:w-[800px]'
        : 'xl:w-[400px]';

    return (
        <>
            {isRightPanelOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden transition-opacity duration-300"
                    onClick={closeRightPanel}
                />
            )}

            <aside className={`fixed inset-y-0 right-0 top-16 z-50 w-[90vw] sm:w-[400px] bg-white/80 dark:bg-dark-bg/95 backdrop-blur-xl border-l border-gold-primary/20 dark:border-dark-border/50 h-[calc(100vh-64px)] xl:sticky xl:top-16 transform transition-all duration-500 ${isRightPanelOpen ? `translate-x-0 overflow-hidden shadow-2xl xl:translate-x-0 xl:shadow-none ${desktopWidthClassName}` : 'translate-x-full xl:w-0 xl:translate-x-10 xl:border-none xl:opacity-0'} flex flex-col font-inter`}>
                <div className="xl:hidden absolute top-4 right-4 z-50">
                    <button onClick={closeRightPanel} className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 relative flex flex-col h-full min-h-0">
                    <div className="mb-6 flex items-center gap-2 border-b border-gold-border/30 pb-4 shrink-0">
                        <MessageSquareText className="w-5 h-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide">
                            Commentary
                        </h2>
                    </div>

                    <CommentaryPanel activeParagraph={activeParagraph} />
                </div>
            </aside>
        </>
    );
};

export default React.memo(
    RightSidebar,
    (prevProps, nextProps) =>
        prevProps.activeParagraph?.id === nextProps.activeParagraph?.id &&
        prevProps.chapterSidebarOpen === nextProps.chapterSidebarOpen &&
        prevProps.expandToDoubleWidthWhenChapterSidebarClosed === nextProps.expandToDoubleWidthWhenChapterSidebarClosed,
);
