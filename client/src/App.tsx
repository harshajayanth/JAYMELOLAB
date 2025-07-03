import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 💡 Intro screen with "DIVE IN" button
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
          /* From Uiverse.io by nima-mollazadeh */ 
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

          .button span {
            position: relative;
            z-index: 1;
          }

          .button::before {
            content: "";
            position: absolute;
            inset: 1px;
            background: #272727;
            border-radius: 9px;
            transition: 0.5s;
          }

          .button:hover::before {
            opacity: 0.7;
          }

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

          .button:hover::after {
            opacity: 1;
          }
        `}
      </style>

      <div className="text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl font-bold"
        >
          Welcome to JAYMELO SOUNDLAB
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

// 💡 App content with music + routing
function AppContent() {
  const [isMuted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/intro.mp3");
    audio.loop = true;
    audio.muted = false;
    audioRef.current = audio;

    audio
      .play()
      .catch((err) => console.warn("Music play failed:", err));

    return () => audio.pause();
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setMuted(newMuted);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen relative">
          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="fixed bottom-4 right-4 z-50 px-6 py-3 glass hover:bg-white/10 rounded-full font-semibold text-lg transition-all"
            title={isMuted ? "Unmute" : "Mute"}
          >
            <span className="material-icons">
              {isMuted ? "music_off" : "music_note"}
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

// 💡 Main App wrapper
function App() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      <AnimatePresence>{!entered && <IntroScreen onEnter={() => setEntered(true)} />}</AnimatePresence>
      {entered && <AppContent />}
    </>
  );
}

export default App;
