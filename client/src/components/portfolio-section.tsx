import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { getProjects } from "../lib/data";

// 👇 Global declarations
declare global {
  interface Window {
    backgroundMusic: HTMLAudioElement | null;
    videoIsPlaying?: boolean;
    originalBackgroundMusic?: HTMLAudioElement | null;
  }
}

function getThumbnailFromUrl(url: string | null, fallback: string): string {
  if (!url) return fallback;
  const cleanedUrl = url.split("?")[0];
  const ytMatch = cleanedUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^/?&]+)/
  );
  return ytMatch
    ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
    : fallback;
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com"))
      return parsed.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [playingYouTubeId, setPlayingYouTubeId] = useState<number | null>(null);
  const [videoEnded, setVideoEnded] = useState<{ [id: number]: boolean }>({});
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const youtubeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const resumeBackgroundMusic = () => {
    if (
      window.originalBackgroundMusic &&
      window.originalBackgroundMusic.paused
    ) {
      window.originalBackgroundMusic
        .play()
        .then(() => {
          window.backgroundMusic = window.originalBackgroundMusic!;
          window.originalBackgroundMusic = null;
          console.log("🎵 Background music resumed");
        })
        .catch((err) => {
          console.warn("🔇 Failed to resume background music", err);
        });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (youtubeTimeoutRef.current)
            clearTimeout(youtubeTimeoutRef.current);

          // MP3 Fade out
          if (
            playingVideoId !== null &&
            window.backgroundMusic &&
            window.backgroundMusic !== window.originalBackgroundMusic
          ) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            const fadeOutAudio = () => {
              let vol = window.backgroundMusic!.volume;
              const fadeStep = 0.05;
              const fadeInterval = setInterval(() => {
                if (window.backgroundMusic && vol > 0) {
                  vol = Math.max(0, vol - fadeStep);
                  window.backgroundMusic.volume = vol;
                } else {
                  clearInterval(fadeInterval);
                  if (window.backgroundMusic) {
                    window.backgroundMusic.pause();
                    window.backgroundMusic.currentTime = 0;
                    window.backgroundMusic = null;
                  }

                  setPlayingVideoId(null);
                  setVideoEnded({});
                  setTimeProgress(0);
                  window.videoIsPlaying = false;
                  window.dispatchEvent(
                    new CustomEvent("video-playing", { detail: false })
                  );

                  setTimeout(() => resumeBackgroundMusic(), 300);
                }
              }, 50);
            };

            fadeOutAudio();
          }

          // YouTube Stop
          if (playingYouTubeId !== null) {
            setPlayingYouTubeId(null);
            setPlayingVideoId(null);
            setVideoEnded({});
            setTimeProgress(0);
            window.videoIsPlaying = false;
            window.dispatchEvent(
              new CustomEvent("video-playing", { detail: false })
            );

            // Resume bg music after delay
            setTimeout(() => resumeBackgroundMusic(), 300);
          }
        } else {
          if (playingVideoId !== null && !window.videoIsPlaying) {
            setTimeProgress(0);
          }
        }
      },
      { threshold: 0.1 }
    );

    const node = ref.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [playingVideoId, playingYouTubeId]);

  const handleMP3Play = (projectId: number, audioUrl: string) => {
    if (
      window.backgroundMusic &&
      !window.backgroundMusic.paused &&
      !window.originalBackgroundMusic
    ) {
      window.originalBackgroundMusic = window.backgroundMusic;
    }

    if (window.backgroundMusic) {
      window.backgroundMusic.pause();
      window.backgroundMusic.currentTime = 0;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    const audio = new Audio(audioUrl);
    audio.volume = 1;

    audio.onerror = (e) => {
      console.error("❌ Failed to load or play audio:", audioUrl, e.toString());
    };

    audio.play().catch((err) => {
      console.warn("⚠️ Audio play() failed:", err);
    });
    window.backgroundMusic = audio;

    setPlayingVideoId(projectId);
    setPlayingYouTubeId(null);
    setVideoEnded((prev) => ({ ...prev, [projectId]: false }));
    setTimeProgress(0);
    window.videoIsPlaying = true;
    window.dispatchEvent(new CustomEvent("video-playing", { detail: true }));

    const totalDuration = 60;
    const fadeOutDuration = 5;
    let elapsed = 0;

    intervalRef.current = setInterval(() => {
      elapsed += 1;
      const percent = (elapsed / totalDuration) * 100;
      setTimeProgress(percent);

      const timeLeft = totalDuration - elapsed;
      if (timeLeft <= fadeOutDuration && audio.volume > 0) {
        const newVolume = Math.max(0, timeLeft / fadeOutDuration);
        audio.volume = newVolume;
      }

      if (elapsed >= totalDuration) {
        clearInterval(intervalRef.current!);
        audio.pause();
        audio.currentTime = 0;
        handleMP3Pause(projectId);
      }
    }, 1000);

    audio.onended = () => handleMP3Pause(projectId);
  };

  const handleMP3Pause = (projectId: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (window.backgroundMusic) {
      window.backgroundMusic.pause();
      window.backgroundMusic.currentTime = 0;
      window.backgroundMusic.volume = 1;
      window.backgroundMusic = null;
    }

    setPlayingVideoId(null);
    setVideoEnded((prev) => ({ ...prev, [projectId]: true }));
    setTimeProgress(0);
    window.videoIsPlaying = false;

    resumeBackgroundMusic();
    window.dispatchEvent(new CustomEvent("video-playing", { detail: false }));
  };

  const handleYouTubePlay = (projectId: number) => {
    // Save current background music if playing
    if (
      window.backgroundMusic &&
      !window.backgroundMusic.paused &&
      !window.originalBackgroundMusic
    ) {
      window.originalBackgroundMusic = window.backgroundMusic;
    }

    if (window.backgroundMusic) {
      window.backgroundMusic.pause();
      window.backgroundMusic.currentTime = 0;
      window.backgroundMusic = null;
    }

    if (youtubeTimeoutRef.current) {
      clearTimeout(youtubeTimeoutRef.current);
    }

    setPlayingVideoId(null);
    setPlayingYouTubeId(projectId);
    setTimeProgress(0);
    window.videoIsPlaying = true;
    window.dispatchEvent(new CustomEvent("video-playing", { detail: true }));

    // ⏳ Stop YouTube after 1 min and resume BG music
    youtubeTimeoutRef.current = setTimeout(() => {
      setPlayingYouTubeId(null);
      setPlayingVideoId(null);
      setVideoEnded((prev) => ({ ...prev, [projectId]: true }));
      setTimeProgress(0);
      window.videoIsPlaying = false;
      window.dispatchEvent(new CustomEvent("video-playing", { detail: false }));
      resumeBackgroundMusic();
    }, 60 * 1000); // 1 minute
  };

  return (
    <section id="portfolio" className="py-20 px-6 bg-darker-gray">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest Work</h2>
            <p className="text-xl text-gray-400">
              Featured projects from film scores to web series soundtracks
            </p>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {projects.map((project) => {
            const isYouTube = project.url?.includes("youtu");
            const isMP3 = project.url?.includes(".mp3");
            const ytId = getYouTubeId(project.url ?? "");
            const isPlaying =
              playingVideoId === project.id && !videoEnded[project.id];
            const isYouTubePlaying = playingYouTubeId === project.id;

            return (
              <motion.div
                key={project.id}
                className="project-card group"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <div className="glass rounded-2xl overflow-hidden relative">
                  {isYouTube && isYouTubePlaying ? (
                    <iframe
                      className="w-full h-64"
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1`}
                      title="YouTube Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={getThumbnailFromUrl(project.url, project.imageUrl)}
                        alt={project.title}
                        className="w-full h-64 object-cover"
                      />

                      {isYouTube && (
                        <motion.button
                          onClick={() => handleYouTubePlay(project.id)}
                          className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-electric-purple text-white rounded-full"
                          whileHover={{ scale: 1.05 }}
                          onMouseEnter={() => setHoveredId(project.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <span className="material-icons text-sm align-middle">
                            play_arrow
                          </span>{" "}
                          {hoveredId === project.id ? "Watch" : "1 Min"}
                        </motion.button>
                      )}

                      {isMP3 && (
                        <>
                          {isPlaying ? (
                            <motion.div
                              className="absolute bottom-4 left-4 right-4 bg-white/20 rounded-full h-2 overflow-hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <motion.div
                                className="bg-white h-full"
                                animate={{ width: `${timeProgress}%` }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                              />
                            </motion.div>
                          ) : (
                            <motion.button
                              onClick={() =>
                                handleMP3Play(project.id, project.url!)
                              }
                              className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-electric-purple text-white rounded-full"
                              whileHover={{ scale: 1.05 }}
                              onMouseEnter={() => setHoveredId(project.id)}
                              onMouseLeave={() => setHoveredId(null)}
                            >
                              <span className="material-icons text-sm align-middle">
                                volume_up
                              </span>{" "}
                              {hoveredId === project.id ? "Listen" : "1 Min"}
                            </motion.button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-electric-purple text-sm font-medium mb-3">
                    {project.category}
                  </p>
                  <p className="text-gray-400 text-sm">{project.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
