import { motion } from "framer-motion";

interface WaveformProps {
  bars?: number;
  height?: string;
  animated?: boolean;
}

export default function Waveform({ bars = 8, height = "h-8", animated = true }: WaveformProps) {
  const barHeights = [
    "h-2", "h-6", "h-4", "h-8", "h-3", "h-7", "h-5", "h-9", 
    "h-4", "h-6", "h-2", "h-8", "h-5", "h-3", "h-7"
  ];

  return (
    <div className="waveform">
      {Array.from({ length: bars }).map((_, index) => (
        <motion.div
          key={index}
          className={`wave-bar ${barHeights[index % barHeights.length]}`}
          initial={animated ? { scaleY: 0.5 } : {}}
          animate={animated ? { scaleY: [0.5, 1.2, 0.5] } : {}}
          transition={animated ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1
          } : {}}
        />
      ))}
    </div>
  );
}
