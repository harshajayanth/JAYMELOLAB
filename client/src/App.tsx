// ✅ App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    backgroundMusic: HTMLAudioElement | null;
    videoIsPlaying?: boolean;
    originalBackgroundMusic?: HTMLAudioElement | null;
  }
}

export function IntroScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
    >
      <style>
        {`
        .button {
          position: relative;
          text-decoration: none;
          color: #fff;
          background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
          padding: 14px 25px;
          border-radius: 10px;
          font-size: 1.25em;
          cursor: pointer;
          display: inline-block;
        }
        .button span { position: relative; z-index: 1; }
        .button::before {
          content: "";
          position: absolute;
          inset: 1px;
          background: #272727;
          border-radius: 9px;
          transition: 0.5s;
        }
        .button:hover::before { opacity: 0.7; }
        .button::after {
          content: "";
          position: absolute;
          inset: 0px;
          background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
          border-radius: 9px;
          transition: 0.5s;
          opacity: 0;
          filter: blur(20px);
        }
        .button:hover::after { opacity: 1; }
      `}
      </style>
      <div className="text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl font-bold"
        >
          Welcome
        </motion.h1>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="button"
          onClick={onEnter}
        >
          <span>DIVE IN</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AppContent() {
  const [isMuted, setMuted] = useState(false);
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/intro.mp3");
    audio.loop = true;
    audio.muted = false;
    window.backgroundMusic = audio;
    audio.play().catch((err) => console.warn("Music play failed:", err));

    return () => {
      audio.pause();
      window.backgroundMusic = null;
    };
  }, []);

  useEffect(() => {
    const handleVideoState = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      const isPlaying = custom.detail;

      setVideoIsPlaying(isPlaying);
      window.videoIsPlaying = isPlaying;

      if (!isPlaying) {
        if (
          window.originalBackgroundMusic &&
          window.originalBackgroundMusic.paused
        ) {
          window.originalBackgroundMusic
            .play()
            .then(() => {
              window.backgroundMusic = window.originalBackgroundMusic!;
              window.originalBackgroundMusic = null;
            })
            .catch(console.warn);
        } else if (window.backgroundMusic && window.backgroundMusic.paused) {
          window.backgroundMusic.play().catch(console.warn);
        }
      }
    };

    window.addEventListener("video-playing", handleVideoState);
    return () => {
      window.removeEventListener("video-playing", handleVideoState);
    };
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m" && !videoIsPlaying) {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [videoIsPlaying, isMuted]);

  const toggleMute = () => {
    const audio = window.backgroundMusic;
    if (!audio) return;

    const newMuted = !audio.muted;
    audio.muted = newMuted;
    setMuted(newMuted);

    if (!newMuted) {
      audio.play().catch(console.warn);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen relative">
          <button
            onClick={toggleMute}
            disabled={videoIsPlaying}
            className={`fixed bottom-4 right-4 z-50 px-6 py-3 glass rounded-full font-semibold text-lg transition-all ${
              videoIsPlaying ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"
            }`}
            title={
              videoIsPlaying ? "Disabled while video is playing" : isMuted ? "Unmute" : "Mute"
            }
          >
            <span className="material-icons">
              {videoIsPlaying || isMuted ? "music_off" : "music_note"}
            </span>
          </button>

          <Toaster />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
          </Switch>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!entered && <IntroScreen onEnter={() => setEntered(true)} />}
      </AnimatePresence>
      {entered && <AppContent />}
    </>
  );
}

export default App;
