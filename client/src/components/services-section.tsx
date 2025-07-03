import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: "🎵",
    title: "Film Scoring",
    image:
      "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=800&q=80",
    description:
      "Original compositions that enhance emotional storytelling and create memorable cinematic moments.",
  },
  {
    icon: "🎤",
    title: "Sound Design",
    image:
      "https://images.unsplash.com/photo-1649456674221-12b66d8a6fa8?q=80&w=1170&auto=format&fit=crop",
    description:
      "Custom sound effects and ambient audio that brings your visual content to life with authentic atmosphere.",
  },
  {
    icon: "🎛️",
    title: "Audio Post-Production",
    image:
      "https://images.unsplash.com/photo-1748698534440-4888a47b3097?q=80&w=1170&auto=format&fit=crop",
    description:
      "Professional mixing and mastering services to ensure your audio meets industry standards.",
  },
  {
    icon: "🎧",
    title: "Music Consultation",
    image:
      "https://images.unsplash.com/photo-1652626627227-acc5ce198876?q=80&w=880&auto=format&fit=crop",
    description:
      "Strategic guidance on music selection, licensing, and creative direction for your projects.",
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section id="services" className="py-20 px-6 bg-darker-gray">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What I Do</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive music production services tailored for film, web
            series, and digital content creators.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.035,
                rotate: 0.2,
              }}
              transition={{ type: "tween", duration: 0.2 }}
              className="group relative rounded-2xl overflow-hidden bg-black text-white shadow-lg"
            >
              {/* Clear Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-300"
                style={{ backgroundImage: `url(${service.image})` }}
              ></div>

              {/* Content */}
              <div className="relative z-10 p-6 bg-black/50 rounded-2xl h-full flex flex-col">
                <div className="w-12 h-12 mb-4 text-2xl bg-gradient-to-r from-electric-purple to-neon-cyan text-white rounded-lg flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
