import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { getProjects } from "../lib/data";

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

declare global {
  interface Window {
    backgroundMusic: HTMLAudioElement | null;
    videoIsPlaying?: boolean;
  }
}

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [videoEnded, setVideoEnded] = useState<{ [id: number]: boolean }>({});

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // 👇 Add this new effect here
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        setPlayingVideoId(null);
        setVideoEnded({});
        window.videoIsPlaying = false;

        // 🔥 Dispatch to notify App.tsx to re-enable mute button
        window.dispatchEvent(new CustomEvent("video-playing", { detail: false }));

        if (window.backgroundMusic && window.backgroundMusic.paused) {
          window.backgroundMusic.play().catch(console.warn);
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
}, []);


const handlePlay = (projectId: number) => {
  setPlayingVideoId(projectId);
  setVideoEnded((prev) => ({ ...prev, [projectId]: false }));
  window.videoIsPlaying = true;

  if (window.backgroundMusic && !window.backgroundMusic.paused) {
    window.backgroundMusic.pause();
  }

  // 🔥 Notify App
  window.dispatchEvent(new CustomEvent("video-playing", { detail: true }));

  setTimeout(() => {
    if (playingVideoId === projectId) handleVideoEnd(projectId);
  }, 60000);
};

const handleVideoEnd = (projectId: number) => {
  setVideoEnded((prev) => ({ ...prev, [projectId]: true }));
  setPlayingVideoId(null);
  window.videoIsPlaying = false;

  if (window.backgroundMusic) {
    window.backgroundMusic.play().catch(console.warn);
  }

  // 🔥 Notify App
  window.dispatchEvent(new CustomEvent("video-playing", { detail: false }));
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
                  {/* YouTube iframe */}
                  {isYouTube && isPlaying ? (
                    <iframe
                      className="w-full h-64"
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1`}
                      title="YouTube Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => {
                        // fallback in case onEnd isn't triggered
                        setTimeout(() => handleVideoEnd(project.id), 60000);
                      }}
                    />
                  ) : (
                    <>
                      <img
                        src={getThumbnailFromUrl(project.url, project.imageUrl)}
                        alt={project.title}
                        className="w-full h-64 object-cover"
                      />

                      {/* Play Button */}
                      {isYouTube && playingVideoId !== project.id && (
                        <motion.button
                          onClick={() => handlePlay(project.id)}
                          className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-electric-purple text-white rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="material-icons text-sm align-middle">
                            play_arrow
                          </span>{" "}
                          1 Min
                        </motion.button>
                      )}

                      {/* MP3 Listen Button */}
                      {isMP3 && (
                        <motion.a
                          href={project.url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-electric-purple text-white rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="material-icons text-sm align-middle">
                            volume_up
                          </span>{" "}
                          Listen
                        </motion.a>
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
