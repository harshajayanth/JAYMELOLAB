import { motion } from "framer-motion";
import Waveform from "./waveform";

export default function WaveDivider() {
  return (
    <section className="relative py-16 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-electric-purple/20 to-neon-cyan/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />
      <div className="relative z-10 flex justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Waveform bars={20} height="h-16" />
        </motion.div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-electric-purple/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 20,
              opacity: 0 
            }}
            animate={{ 
              y: -20, 
              opacity: [0, 1, 0],
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 2
            }}
          />
        ))}
      </div>
    </section>
  );
}
