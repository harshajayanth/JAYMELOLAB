import { useCallback, useRef, useState } from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startBackgroundMusic = useCallback(() => {
    if (!hasStarted) {
      // Create audio element dynamically since we don't have actual audio files
      // In production, you would load actual ambient music files
      audioRef.current = new Audio();
      // audioRef.current.src = "/path/to/ambient-music.mp3";
      audioRef.current.loop = true;
      audioRef.current.volume = 0.1;
      
      // For demo purposes, we'll just track that music "started"
      setHasStarted(true);
      setIsPlaying(true);
      
      // audioRef.current.play().catch(console.error);
      //console.log('Background music would start playing here');
    }
  }, [hasStarted]);

  const stopBackgroundMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleBackgroundMusic = useCallback(() => {
    if (isPlaying) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  }, [isPlaying, startBackgroundMusic, stopBackgroundMusic]);

  return {
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    isPlaying,
    hasStarted
  };
}
