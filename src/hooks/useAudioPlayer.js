import React from 'react';

export function useAudioPlayer() {
  const [progress, setProgress] = React.useState(0);
  return {
    isPlaying: false,
    progress,
    currentTime: 0,
    duration: 0,
    togglePlay: () => {},
    seek: (value) => setProgress(value),
  };
}
