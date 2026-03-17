import React from 'react';
import { Pause, Play } from 'lucide-react';

const AudioPill = ({ isPlaying, progress, currentTime, duration, togglePlay, seek, audioUrl, formatTime }) => {
    return (
        <div className="mb-12 flex justify-center sm:mb-16">
            <div className="w-full max-w-[520px] rounded-[1.8rem] border border-gold-border/25 bg-white/65 px-4 py-3 shadow-[0_20px_50px_rgba(120,93,48,0.08)] backdrop-blur-xl transition-all hover:border-gold-primary/35 dark:border-dark-border/60 dark:bg-dark-surface/55 sm:px-5">
                <div className="mb-3 flex items-center justify-between">
                    <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-deep/70 dark:text-gold-light/65">
                        Guided Recitation
                    </p>
                    <span className="font-inter text-[10px] uppercase tracking-[0.24em] text-text-secondary/55 dark:text-dark-text-secondary/55">
                        Audio
                    </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={togglePlay}
                        disabled={!audioUrl}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/40 text-gold-deep transition-transform hover:scale-105 dark:border-gold-light/15 dark:bg-gold-primary/10 dark:text-gold-light ${!audioUrl ? 'cursor-not-allowed opacity-30' : ''}`}
                    >
                        {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                    </button>

                    <span className="w-10 shrink-0 text-right font-inter text-[10px] font-semibold tracking-[0.18em] text-text-secondary/65 tabular-nums dark:text-dark-text-secondary/65 sm:w-12">
                        {formatTime(currentTime)}
                    </span>

                    <div
                        className="group relative h-[3px] flex-1 cursor-pointer rounded-full bg-gold-border/30 dark:bg-dark-border"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const percentage = x / rect.width;
                            seek(percentage * 100);
                        }}
                    >
                        <div className="absolute left-0 top-0 h-full rounded-full bg-[#A68B5C] transition-all" style={{ width: `${progress}%` }} />
                        <div
                            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-white/80 bg-[#A68B5C] shadow-sm transition-opacity group-hover:opacity-100"
                            style={{ left: `calc(${progress}% - 6px)`, opacity: progress > 0 ? 1 : 0 }}
                        />
                    </div>

                    <span className="w-10 shrink-0 font-inter text-[10px] font-semibold tracking-[0.18em] text-text-secondary/65 tabular-nums dark:text-dark-text-secondary/65 sm:w-12">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AudioPill);
