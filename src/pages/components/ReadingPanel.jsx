import React from 'react';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { formatTime } from '../../utils/audioUtils';
import ReadingHeader from '../../components/Reading/ReadingHeader';
import TibetanSection from '../../components/Reading/TibetanSection';
import AudioPill from '../../components/Reading/AudioPill';
import TranslationSection from '../../components/Reading/TranslationSection';
import NavigationPill from '../../components/Reading/NavigationPill';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const ReadingPanel = ({ verse, globalIndex, hideAudio = false, onPrevious, onNext }) => {
    const safeVerse = verse && typeof verse === 'object' ? verse : null;
    const verseId = typeof safeVerse?.id === 'string' ? safeVerse.id : '';
    const verseTitle = typeof safeVerse?.title === 'string' ? safeVerse.title : '';
    const verseChapterTitle = typeof safeVerse?.chapterTitle === 'string' ? safeVerse.chapterTitle : '';
    const verseAudioUrl = typeof safeVerse?.audioUrl === 'string' ? safeVerse.audioUrl : '';
    const verseText = safeVerse?.text && typeof safeVerse.text === 'object' ? safeVerse.text : {};
    const audioPlaylist = React.useMemo(() => {
        return verseAudioUrl ? [{ id: verseId, title: verseTitle, url: verseAudioUrl }] : [];
    }, [verseAudioUrl, verseId, verseTitle]);

    const { isPlaying, progress, currentTime, duration, togglePlay, seek } = useAudioPlayer(audioPlaylist);
    const [chapterStr = '', verseStr = ''] = verseId.split('.');

    return (
        <motion.main
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10 flex-1 min-w-0 overflow-y-auto bg-transparent pb-28 pt-16 font-crimson text-text-primary transition-colors duration-500 scrollbar-hide dark:text-dark-text-primary sm:pb-20 sm:pt-24"
        >
            <div className="mx-auto max-w-[980px] px-4 sm:px-8">
                <motion.div variants={itemVariants}>
                    <ReadingHeader
                        chapterStr={chapterStr}
                        verseStr={verseStr}
                        globalIndex={globalIndex}
                        verseId={verseId}
                        title={verseTitle}
                        chapterTitle={verseChapterTitle}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <TibetanSection tibetan={verseText.tibetan} pronunciation={verseText.pronunciation} />
                </motion.div>

                {!hideAudio && (
                    <motion.div variants={itemVariants}>
                        <AudioPill
                            isPlaying={isPlaying}
                            progress={progress}
                            currentTime={currentTime}
                            duration={duration}
                            togglePlay={togglePlay}
                            seek={seek}
                            audioUrl={verseAudioUrl}
                            formatTime={formatTime}
                        />
                    </motion.div>
                )}

                <motion.div variants={itemVariants}>
                    <TranslationSection english={verseText.english} korean={verseText.korean} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <NavigationPill
                        globalIndex={globalIndex}
                        verseId={verseId}
                        onPrevious={onPrevious}
                        onNext={onNext}
                    />
                </motion.div>
            </div>
        </motion.main>
    );
};

export default React.memo(ReadingPanel, (prevProps, nextProps) => prevProps.verse?.id === nextProps.verse?.id);
